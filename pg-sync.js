/* =========================================================
 * 外贸工作台 · CloudBase 同步模块（PostgreSQL · PostgREST 版）
 *
 * 背景：2026 体验版 CloudBase 环境是 PostgreSQL 底层（无文档型
 * 数据库实例），旧版 NoSQL collection API 全部不可用。实测发现
 * 环境网关内置 PostgREST 服务（CORS 全开、匿名令牌可用）：
 *   数据: https://<envId>.api.tcloudbasegateway.com/v1/rdb/rest/ftw_data
 *   登录: https://<envId>.api.tcloudbasegateway.com/auth/v1/signin/anonymously
 * 本模块改用「匿名登录(纯 fetch) + PostgREST 单表 JSONB」实现同步，
 * 对外暴露 window.__ftPg（接口与旧版完全一致，上层无需改动）。
 *
 * 数据模型（表 public.ftw_data，建表脚本见 CloudBase建表脚本.sql）：
 *   key         text  主键，格式 "<集合名>:<业务id>"
 *   value       jsonb 业务文档（含 bizId/updatedAt）
 *   updated_at  timestamptz
 *
 * 集合与业务 key 映射（与旧版一致）：
 *   customers / ai_history / market_analyses / calendar / settings
 *   calendar、settings 为单条记录（ftw_calendar / ftw_settings）
 * ========================================================= */
(function () {
  if (typeof window === 'undefined') return;

  const PG = {
    envId: '',
    connected: false,
    inited: false,
    token: '',
    tokenExp: 0,
    deviceId: '',
    lastSync: '',
    lastError: '',
    pollTimer: null,
    lastFingerprint: '',
    onStatus: null
  };

  const COLLECTIONS = {
    customers: 'customers',
    aiHistory: 'ai_history',
    marketAnalyses: 'market_analyses',
    calendar: 'calendar',
    settings: 'settings'
  };

  const META_DELETE_PREFIX = '__ft_deleted__:';
  const META_CLEAR_ID = '__ft_customers_cleared__';

  const AUTH_CACHE_KEY = 'ftw_pg_auth_v1';
  const DEVICE_KEY = 'ftw_pg_device';
  const TABLE = 'ftw_data';
  const CHUNK = 80; // 批量 upsert 每批行数

  function gateway() { return 'https://' + PG.envId + '.api.tcloudbasegateway.com'; }
  function restBase() { return gateway() + '/v1/rdb/rest/' + TABLE; }

  function status(msg, type) { if (PG.onStatus) { try { PG.onStatus(msg, type); } catch (e) {} } }

  function customerClock(rec) {
    if (!rec) return 0;
    const vals = [rec.updatedAt, rec.createdAt, rec.syncedAt, rec._ftImportedAt]
      .map(v => new Date(v || 0).getTime())
      .filter(v => Number.isFinite(v) && v > 0);
    return vals.length ? Math.max(...vals) : 0;
  }

  function safeSettingsForCloud(settings) {
    const out = Object.assign({}, settings || {});
    [
      'apiKey', 'searchGoogleKey', 'searchBingKey', 'searchBraveKey', 'searchTavilyKey',
      'webdavPass', 'webdavPassword', 'webdavUser', 'webdavUsername',
      'sb_key', 'sbKey', 'supabaseKey', 'token', 'accessToken', 'refreshToken'
    ].forEach(k => { delete out[k]; });
    return out;
  }

  // ---------- 设备 ID / 令牌缓存 ----------
  function ensureDeviceId() {
    if (PG.deviceId) return PG.deviceId;
    try {
      let d = localStorage.getItem(DEVICE_KEY);
      if (!d) {
        d = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        localStorage.setItem(DEVICE_KEY, d);
      }
      PG.deviceId = d;
    } catch (e) { PG.deviceId = 'ftw-fallback-device'; }
    return PG.deviceId;
  }

  function readAuthCache() {
    try { return JSON.parse(localStorage.getItem(AUTH_CACHE_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function writeAuthCache() {
    try {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
        envId: PG.envId, token: PG.token, exp: PG.tokenExp
      }));
    } catch (e) {}
  }

  async function ensureAuth(force) {
    if (!force) {
      const cache = readAuthCache();
      if (cache && cache.envId === PG.envId && cache.token && Date.now() < (cache.exp || 0)) {
        PG.token = cache.token;
        PG.tokenExp = cache.exp;
        return PG.token;
      }
    }
    const resp = await fetch(gateway() + '/auth/v1/signin/anonymously?client_id=' + encodeURIComponent(PG.envId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-device-id': ensureDeviceId() },
      body: '{}'
    });
    let d = {};
    try { d = await resp.json(); } catch (e) {}
    if (!resp.ok || !d.access_token) {
      const msg = d.error_description || d.message || ('匿名登录失败(HTTP ' + resp.status + ')');
      throw new Error(msg);
    }
    PG.token = d.access_token;
    PG.tokenExp = Date.now() + (Number(d.expires_in) || 7200) * 1000 - 5 * 60 * 1000;
    writeAuthCache();
    return PG.token;
  }

  // 带令牌的 PostgREST 请求（401 自动重登一次）
  async function api(path, opts, isRetry) {
    await ensureAuth(false);
    const headers = Object.assign({
      'Authorization': 'Bearer ' + PG.token,
      'Content-Type': 'application/json'
    }, (opts && opts.headers) || {});
    const r = await fetch(path, Object.assign({}, opts, { headers }));
    if ((r.status === 401 || r.status === 403) && !isRetry) {
      await ensureAuth(true);
      return api(path, opts, true);
    }
    return r;
  }

  function rowKey(coll, id) { return coll + ':' + id; }
  function encodeFilter(s) { return encodeURIComponent(s); }

  // 时间戳兜底：空/非法值一律换成当前时间（PG 的 timestamptz 拒绝空串与非法格式）
  function toIso(ts) {
    if (ts) {
      const t = new Date(ts).getTime();
      if (Number.isFinite(t) && t > 0) return new Date(t).toISOString();
    }
    return new Date().toISOString();
  }

  // ---------- 连接 ----------
  async function connect(envId) {
    if (!envId) return { ok: false, error: '未配置环境 ID' };
    try {
      PG.envId = String(envId).trim();
      PG.inited = true;
      await ensureAuth(false);
      // 连通性验证：能查表即视为成功（表不存在会 404，给出明确提示）
      const r = await fetch(restBase() + '?select=key&limit=1', {
        headers: { 'Authorization': 'Bearer ' + PG.token }
      });
      if (r.status === 404) {
        const msg = '云端数据表不存在：请先在控制台 SQL 窗口执行「CloudBase建表脚本.sql」';
        PG.connected = false;
        PG.lastError = msg;
        status(msg, 'err');
        return { ok: false, error: msg };
      }
      if (!r.ok) {
        const msg = '连接失败(HTTP ' + r.status + ')';
        PG.connected = false;
        PG.lastError = msg;
        status(msg, 'err');
        return { ok: false, error: msg };
      }
      PG.connected = true;
      PG.lastError = '';
      status('已连接（PostgreSQL · PostgREST）', 'ok');
      return { ok: true, envId: PG.envId };
    } catch (e) {
      PG.connected = false;
      PG.lastError = e.message || '连接失败';
      status(PG.lastError, 'err');
      return { ok: false, error: PG.lastError };
    }
  }

  function getState() { return window.__ftState || {}; }

  // ---------- 拉取某集合全部数据 ----------
  async function pullTable(key) {
    const coll = COLLECTIONS[key];
    if (!coll || !PG.connected) return { ok: false, error: '未连接或集合不存在' };
    try {
      const r = await api(restBase()
        + '?select=key,value,updated_at'
        + '&key=like.' + encodeFilter(coll + ':*')
        + '&order=key.asc&limit=100000');
      if (!r.ok) return { ok: false, error: '拉取失败(HTTP ' + r.status + ')' };
      const rows = await r.json();
      const records = (rows || []).map(row => {
        const d = row.value || {};
        const { _id, bizId, id: _ignored, ...rest } = d;
        return { id: d.bizId || d.id || '', updatedAt: rest.updatedAt || '', ...rest };
      }).filter(x => x.id);
      return { ok: true, records };
    } catch (e) {
      return { ok: false, error: e.message || '拉取失败' };
    }
  }

  // ---------- upsert 一条 ----------
  async function upsertRecord(key, id, doc) {
    const coll = COLLECTIONS[key];
    if (!coll || !PG.connected) return { ok: false, error: '未连接' };
    try {
      const updatedAt = toIso(doc.updatedAt);
      const { id: _dropId, ...rest } = doc;
      const value = Object.assign({}, rest, { bizId: id, updatedAt });
      const row = { key: rowKey(coll, id), value, updated_at: updatedAt };
      const r = await api(restBase(), {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify([row])
      });
      if (!r.ok) {
        let msg = '写入失败(HTTP ' + r.status + ')';
        try { const j = await r.json(); msg = (j && j.message) || msg; } catch (e) {}
        return { ok: false, error: msg };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || '写入失败' };
    }
  }

  // ---------- 批量 upsert（失败时逐条回退定位，收集全部失败记录） ----------
  async function upsertMany(key, entries) {
    const coll = COLLECTIONS[key];
    if (!coll || !PG.connected) return { ok: false, error: '未连接' };
    const now = new Date().toISOString();
    const rows = entries.map(e => {
      const { id: _dropId, ...rest } = e.doc;
      const value = Object.assign({}, rest, { bizId: e.id, updatedAt: toIso(e.doc.updatedAt) });
      return { key: rowKey(coll, e.id), value, updated_at: value.updatedAt };
    });
    const failed = [];
    let lastError = '';
    for (let i = 0; i < rows.length; i += CHUNK) {
      const part = rows.slice(i, i + CHUNK);
      const r = await api(restBase(), {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(part)
      });
      if (!r.ok) {
        let detail = 'HTTP ' + r.status;
        try { const j = await r.json(); detail = (j && (j.message || j.error_description || j.code)) || detail; } catch (e) {}
        lastError = detail;
        // 回退：逐条写入，收集全部失败记录
        for (const e of entries.slice(i, i + CHUNK)) {
          const one = await upsertRecord(key, e.id, e.doc);
          if (!one.ok) failed.push(e.id);
        }
      }
    }
    if (failed.length) return { ok: false, error: lastError || '写入失败', failedIds: failed };
    return { ok: true };
  }

  // ---------- 删除 ----------
  async function deleteRecord(key, id) {
    const coll = COLLECTIONS[key];
    if (!coll || !PG.connected) return { ok: false, error: '未连接' };
    try {
      const r = await api(restBase() + '?key=eq.' + encodeFilter(rowKey(coll, id)), { method: 'DELETE' });
      if (!r.ok && r.status !== 404) return { ok: false, error: '删除失败(HTTP ' + r.status + ')' };
      if (key === 'customers' && !String(id).startsWith('__ft_')) {
        const deletedAt = new Date().toISOString();
        const mr = await upsertRecord('customers', META_DELETE_PREFIX + id, { _ftMeta: 'customerDeleted', targetId: id, deletedAt, updatedAt: deletedAt });
        if (!mr || !mr.ok) return { ok: false, error: (mr && mr.error) || '删除标记写入失败' };
      }
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message || '删除失败' }; }
  }

  async function deleteAllRecords(key) {
    const coll = COLLECTIONS[key];
    if (!coll || !PG.connected) return { ok: false, error: '未连接' };
    try {
      const r = await api(restBase() + '?key=like.' + encodeFilter(coll + ':*'), { method: 'DELETE' });
      if (!r.ok && r.status !== 404) return { ok: false, error: '清空失败(HTTP ' + r.status + ')' };
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message || '清空失败' }; }
  }

  async function clearBusinessData() {
    for (const key of ['customers', 'aiHistory', 'marketAnalyses']) {
      const r = await deleteAllRecords(key);
      if (!r.ok) return r;
    }
    const clearedAt = new Date().toISOString();
    const m = await upsertRecord('customers', META_CLEAR_ID, { _ftMeta: 'customersCleared', clearedAt, updatedAt: clearedAt });
    if (!m.ok) return m;
    return { ok: true, clearedAt };
  }

  // ---------- 全量推送 ----------
  async function fullPush() {
    const st = getState();
    if (!st.customers) return { ok: false, error: '数据未就绪' };
    if (!PG.connected) return { ok: false, error: '未连接' };
    try {
      const failedCustomers = [];
      let pushDetail = '';
      for (const key of ['customers', 'aiHistory', 'marketAnalyses']) {
        const list = st[key] || [];
        if (key === 'customers') {
          // 客户逐条带 syncedAt 语义：先批量推，失败回退逐条
          const entries = [];
          const stampMap = {};
          for (const rec of list) {
            const id = rec.id || rec.bizId;
            if (!id) continue;
            const stamp = new Date().toISOString();
            rec.syncedAt = stamp;
            stampMap[id] = stamp;
            entries.push({ id, doc: rec });
          }
          const r = await upsertMany(key, entries);
          if (!r.ok) {
            for (const e of entries) { if (e.doc.syncedAt) delete e.doc.syncedAt; }
            if (Array.isArray(r.failedIds) && r.failedIds.length) failedCustomers.push(...r.failedIds);
            else for (const e of entries) failedCustomers.push(e.id);
            pushDetail = r.error || '';
          } else {
            for (const e of entries) {
              const tombAt = st.tombstones && st.tombstones[e.id];
              if (tombAt && new Date(stampMap[e.id]).getTime() > new Date(tombAt || 0).getTime()) delete st.tombstones[e.id];
              if (Array.isArray(st.pendingDeletes)) st.pendingDeletes = st.pendingDeletes.filter(x => x !== e.id);
            }
          }
        } else {
          const entries = [];
          for (const rec of list) {
            const id = rec.id || rec.bizId;
            if (!id) continue;
            entries.push({ id, doc: rec });
          }
          const r = await upsertMany(key, entries);
          if (!r.ok && r.failedId) { /* 非客户表失败不阻塞整体 */ }
        }
      }
      if (typeof window.__ftPersistState === 'function') { try { window.__ftPersistState(); } catch (e) {} }
      if (failedCustomers.length) {
        const detail = pushDetail ? '（' + pushDetail + '）' : '';
        return { ok: false, error: `${failedCustomers.length} 个客户上传失败${detail}`, failed: failedCustomers };
      }
      // 日历数据作为单条记录整体同步
      if (st.calendar) {
        const calRec = Object.assign({ updatedAt: new Date().toISOString() }, st.calendar);
        await upsertRecord('calendar', 'ftw_calendar', calRec);
      }
      // 配置数据作为单条记录整体同步（公司画像 + API Key + 连接配置）
      if (st.settings) {
        const setRec = Object.assign({ updatedAt: new Date().toISOString() }, safeSettingsForCloud(st.settings));
        await upsertRecord('settings', 'ftw_settings', setRec);
      }
      PG.lastSync = new Date().toLocaleString('zh-CN');
      PG.lastError = '';
      status('已上传 ' + (st.customers || []).length + ' 个客户', 'ok');
      return { ok: true };
    } catch (e) {
      PG.lastError = e.message || '同步失败';
      return { ok: false, error: PG.lastError };
    }
  }

  // ---------- 拉取并合并到本地（逻辑与旧版一致） ----------
  async function pullAndMerge() {
    if (!PG.connected) return { ok: false, error: '未连接' };
    const st = getState();
    try {
      const keys = ['customers', 'aiHistory', 'marketAnalyses'];
      for (const key of keys) {
        const res = await pullTable(key);
        if (res.ok && Array.isArray(res.records)) {
          if (key === 'customers') {
            const tombs = st.tombstones || {};
            const allRemote = res.records || [];
            const clearMarker = allRemote.find(c => c && c.id === META_CLEAR_ID && c._ftMeta === 'customersCleared');
            const deleteMarkers = allRemote.filter(c => c && String(c.id || '').startsWith(META_DELETE_PREFIX) && c._ftMeta === 'customerDeleted');
            const remoteCustomers = allRemote.filter(c => c && !String(c.id || '').startsWith('__ft_'));

            deleteMarkers.forEach(m => { if (m.targetId) tombs[m.targetId] = m.deletedAt || m.updatedAt || new Date().toISOString(); });
            if (clearMarker) {
              const ct = new Date(clearMarker.clearedAt || clearMarker.updatedAt || 0).getTime();
              if (ct) {
                (st.customers || []).forEach(c => {
                  if (!c || !c.id) return;
                  const t = customerClock(c);
                  if (!t || t <= ct + 1000) tombs[c.id] = clearMarker.clearedAt || clearMarker.updatedAt;
                });
              }
            }
            const isDead = (id, rec) => {
              if (!id || !tombs[id]) return false;
              const t = new Date(tombs[id] || 0).getTime();
              if (!t) return false;
              const rt = (rec && typeof rec === 'object') ? customerClock(rec) : new Date(rec || 0).getTime();
              if (!rt) return true;
              return t >= rt - 1000;
            };
            const localMap = new Map((st.customers || []).map(c => [c.id, c]));
            remoteCustomers.forEach(c => {
              if (!c.id) return;
              if (isDead(c.id, c)) return;
              if (localMap.has(c.id)) {
                const t1 = new Date(localMap.get(c.id).updatedAt || 0).getTime();
                const t2 = new Date(c.updatedAt || 0).getTime();
                localMap.set(c.id, t2 >= t1 ? c : localMap.get(c.id));
              } else localMap.set(c.id, c);
            });
            remoteCustomers.forEach(c => {
              if (c && c.id && tombs[c.id] && !isDead(c.id, c)) delete tombs[c.id];
            });
            st.customers = Array.from(localMap.values()).filter(c => !isDead(c.id, c));
            if (typeof window.__ftPersistState === 'function') { try { window.__ftPersistState(); } catch (e) {} }
          } else {
            st[key] = res.records;
          }
        }
      }
      // 合并日历数据（单条记录）
      const calRes = await pullTable('calendar');
      if (calRes.ok && Array.isArray(calRes.records) && calRes.records.length) {
        const calRec = calRes.records.find(r => r.id === 'ftw_calendar');
        if (calRec) {
          const t1 = new Date((st.calendar && st.calendar.updatedAt) || 0).getTime();
          const t2 = new Date(calRec.updatedAt || 0).getTime();
          if (t2 >= t1) {
            st.calendar = { todos: [], customHolidays: [], ...calRec };
          }
        }
      }
      // 合并配置数据（单条记录）——跨设备同步公司画像/API Key/连接配置
      const setRes = await pullTable('settings');
      if (setRes.ok && Array.isArray(setRes.records) && setRes.records.length) {
        const setRec = setRes.records.find(r => r.id === 'ftw_settings');
        if (setRec) {
          const t1 = new Date((st.settings && st.settings.__syncedAt) || 0).getTime();
          const t2 = new Date(setRec.updatedAt || 0).getTime();
          // 云端配置比本地新才应用，避免覆盖本地刚保存的配置
          if (t2 > t1 && setRec.profile) {
            const clean = Object.assign({}, setRec);
            delete clean.id; delete clean.updatedAt; delete clean.__syncedAt;
            st.settings = Object.assign({}, st.settings, clean, { __syncedAt: setRec.updatedAt });
            if (PG.onSettings) { try { PG.onSettings(clean, setRec.updatedAt); } catch (e) {} }
          }
        }
      }
      PG.lastSync = new Date().toLocaleString('zh-CN');
      PG.lastError = '';
      return { ok: true, count: st.customers.length };
    } catch (e) {
      PG.lastError = e.message || '拉取失败';
      return { ok: false, error: PG.lastError };
    }
  }

  // ---------- 指纹检测变化 ----------
  function fingerprint() {
    const st = getState();
    const cust = st.customers || [];
    const cal = st.calendar || { todos: [], customHolidays: [] };
    const calStr = JSON.stringify({ t: (cal.todos || []).length, h: (cal.customHolidays || []).length, upd: cal.updatedAt || '' });
    const setStr = (st.settings && st.settings.__syncedAt) || '';
    return `${cust.length}|${cust.reduce((a, c) => a + (c.updatedAt || ''), '')}|${calStr}|${setStr}`;
  }

  // ---------- 轮询同步（上传 + 拉取） ----------
  function isBusy() {
    const st = getState();
    if (st.view !== 'dashboard' && st.view !== 'crm' && st.view !== 'calendar') return true;
    const modalRoot = document.getElementById && document.getElementById('modal-root');
    if (modalRoot && modalRoot.innerHTML && modalRoot.innerHTML.trim().length > 0) return true;
    if (document.activeElement &&
        /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return true;
    return false;
  }
  function startPolling(interval) {
    if (PG.pollTimer) return;
    PG.lastFingerprint = fingerprint();
    const ms = interval || 12000;
    PG.pollTimer = setInterval(async () => {
      if (!PG.connected) return;
      if (isBusy()) return;
      if (window.__ftFlushDeletes) { try { await window.__ftFlushDeletes(); } catch (e) {} }
      const cur = fingerprint();
      if (cur !== PG.lastFingerprint) {
        PG.lastFingerprint = cur;
        try { await fullPush(); } catch (e) {}
      }
      const r = await pullAndMerge();
      if (r.ok) {
        const cur2 = fingerprint();
        if (cur2 !== PG.lastFingerprint) PG.lastFingerprint = cur2;
        if (window.__ftRefreshUI) window.__ftRefreshUI();
      }
    }, ms);
  }

  function stopPolling() { if (PG.pollTimer) { clearInterval(PG.pollTimer); PG.pollTimer = null; } }

  function disconnect() { stopPolling(); PG.connected = false; }

  window.__ftPg = {
    connect, disconnect, fullPush, pullAndMerge, startPolling, stopPolling,
    pullTable, upsertRecord, deleteRecord, deleteAllRecords, clearBusinessData,
    getState: () => ({ connected: PG.connected, envId: PG.envId, lastSync: PG.lastSync, lastError: PG.lastError }),
    onStatus: (fn) => { PG.onStatus = fn; },
    onSettings: (fn) => { PG.onSettings = fn; }
  };
})();
