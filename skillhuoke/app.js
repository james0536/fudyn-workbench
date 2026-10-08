const crmStatuses = ["New", "Verified", "Contacted", "Replied", "Quoting", "Sample", "Negotiating", "Won", "Lost", "Not Fit"];

const initialLeads = [
  {
    id: 1,
    company: "United Tractors",
    country: "印尼",
    city: "Jakarta",
    website: "https://www.unitedtractors.com/",
    source: "https://www.unitedtractors.com/contact",
    buyerType: "Distributor / Dealer",
    mainProducts: "工程机械、挖掘机、矿用设备、设备租赁",
    productMatch: "越野叉车、电动叉车、伸缩臂叉装机与其工程机械/矿山设备渠道高度匹配，可走设备配套与租赁合作。",
    summary: "印尼最大工程机械经销商之一，代理 Komatsu，覆盖工程机械、矿用与租赁，是东南亚核心开发对象。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=United%20Tractors",
    contactPerson: "未公开",
    title: "Procurement / Dealer Development / Director",
    score: 89,
    priority: "A",
    crmStatus: "New",
    nextAction: "找设备采购或经销商发展团队，推越野叉车+伸缩臂叉装机的项目配套。",
    followNote: "优先开发，适合工程机械套单与租赁渠道。",
    scoreBreakdown: [30, 20, 15, 12, 7, 5],
  },
  {
    id: 2,
    company: "Siam Kubota",
    country: "泰国",
    city: "Bangkok",
    website: "https://www.siamkubota.co.th/",
    source: "https://www.siamkubota.co.th/contact",
    buyerType: "Distributor / Importer",
    mainProducts: "拖拉机、农机、工程机械、柴油发动机",
    productMatch: "电动叉车、越野叉车与其农机/工程机械渠道相邻，可拓展物料搬运品类。",
    summary: "泰国农机与工程机械龙头，渠道下沉广，适合电动叉车与越野叉车分销合作。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Siam%20Kubota",
    contactPerson: "未公开",
    title: "Sourcing / Distribution Manager",
    score: 88,
    priority: "A",
    crmStatus: "Verified",
    nextAction: "用电动叉车+农机渠道组合切入，推区域分销。",
    followNote: "已核验，适合先发目录。",
    scoreBreakdown: [30, 20, 15, 12, 7, 4],
  },
  {
    id: 3,
    company: "Toyota Material Handling Thailand",
    country: "泰国",
    city: "Bangkok",
    website: "https://www.toyota-industries.com/",
    source: "https://www.toyota-industries.com/contact",
    buyerType: "Distributor",
    mainProducts: "叉车、物料搬运设备、电动叉车",
    productMatch: "电动叉车、越野叉车直接匹配其物料搬运品类，是强竞争但高价值渠道。",
    summary: "丰田物料搬运泰国，叉车核心渠道，可作为竞品替代或高端电动叉车目标。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Toyota%20Material%20Handling%20Thailand",
    contactPerson: "未公开",
    title: "Procurement / Product Manager",
    score: 87,
    priority: "A",
    crmStatus: "New",
    nextAction: "突出电动叉车续航与价格优势，推替代方案。",
    followNote: "渠道价值高，竞争强需差异化。",
    scoreBreakdown: [29, 20, 15, 12, 7, 4],
  },
  {
    id: 4,
    company: "Sime Darby Industrial",
    country: "马来西亚",
    city: "Kuala Lumpur",
    website: "https://www.simedarby.com/",
    source: "https://www.simedarby.com/contact",
    buyerType: "Dealer / Distributor",
    mainProducts: "Caterpillar 工程设备、发电设备、工业机械",
    productMatch: "越野叉车、伸缩臂叉装机与其工程设备/建筑渠道匹配。",
    summary: "马来西亚大型工业设备经销商，代理 Caterpillar，覆盖工程与发电。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Sime%20Darby%20Industrial",
    contactPerson: "未公开",
    title: "Business Development / Sourcing",
    score: 86,
    priority: "A",
    crmStatus: "Contacted",
    nextAction: "跟进工程设备组合，推越野叉车+伸缩臂叉装机。",
    followNote: "已联系，准备开发信。",
    scoreBreakdown: [28, 19, 15, 11, 6, 5],
  },
  {
    id: 5,
    company: "Hoa Phat Group",
    country: "越南",
    city: "Hanoi",
    website: "https://www.hoaphat.com.vn/",
    source: "https://www.hoaphat.com.vn/contact",
    buyerType: "Manufacturer / Importer",
    mainProducts: "钢铁、钢管、工程机械、建筑设备",
    productMatch: "两头忙、越野叉车与其建筑设备/钢厂内部物流匹配。",
    summary: "越南最大钢铁与建材集团，自有工程机械需求与内部物流场景。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Hoa%20Phat%20Group",
    contactPerson: "未公开",
    title: "Procurement / Equipment Manager",
    score: 85,
    priority: "B",
    crmStatus: "New",
    nextAction: "面向内部物流与建筑设备，推电动叉车+两头忙。",
    followNote: "制造业自用+渠道双价值。",
    scoreBreakdown: [27, 18, 15, 10, 7, 6],
  },
  {
    id: 6,
    company: "Delta Earthmoving",
    country: "菲律宾",
    city: "Manila",
    website: "https://www.deltaearthmoving.com/",
    source: "https://www.deltaearthmoving.com/contact",
    buyerType: "Construction Company / Rental Company",
    mainProducts: "工程机械、土方设备、挖掘机租赁",
    productMatch: "越野叉车、伸缩臂叉装机与其土方/租赁业务匹配。",
    summary: "菲律宾工程机械与土方设备公司，含租赁业务。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Delta%20Earthmoving",
    contactPerson: "未公开",
    title: "Operations / Fleet Manager",
    score: 84,
    priority: "B",
    crmStatus: "Verified",
    nextAction: "推越野叉车+伸缩臂叉装机的租赁/项目组合。",
    followNote: "适合租赁渠道开发。",
    scoreBreakdown: [27, 18, 15, 11, 6, 5],
  },
  {
    id: 7,
    company: "Al-Bahar",
    country: "阿联酋",
    city: "Dubai",
    website: "https://www.al-bahar.com/",
    source: "https://www.al-bahar.com/contact",
    buyerType: "Distributor / Dealer",
    mainProducts: "Caterpillar 工程机械、发电机组、中东代理",
    productMatch: "越野叉车、伸缩臂叉装机与其中东工程设备渠道匹配。",
    summary: "中东 Caterpillar 代理，覆盖阿联酋及海湾，工程设备核心渠道。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Al-Bahar",
    contactPerson: "未公开",
    title: "Dealer Development / Procurement",
    score: 88,
    priority: "A",
    crmStatus: "New",
    nextAction: "面向海湾工程市场，推越野叉车+伸缩臂叉装机分销。",
    followNote: "中东高价值渠道，优先开发。",
    scoreBreakdown: [29, 19, 15, 12, 7, 6],
  },
  {
    id: 8,
    company: "Zahid Tractors",
    country: "沙特",
    city: "Jeddah",
    website: "https://www.zahid.com/",
    source: "https://www.zahid.com/contact",
    buyerType: "Distributor / Dealer",
    mainProducts: "Caterpillar 工程机械、建筑设备、沙特代理",
    productMatch: "越野叉车、电动叉车与其建筑/工程设备渠道匹配。",
    summary: "沙特 Caterpillar 代理，覆盖全国工程与基建。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Zahid%20Tractors",
    contactPerson: "未公开",
    title: "Procurement / Dealer Manager",
    score: 87,
    priority: "B",
    crmStatus: "New",
    nextAction: "面向沙特基建，推电动叉车+越野叉车。",
    followNote: "渠道门槛高但价值大。",
    scoreBreakdown: [28, 18, 15, 10, 8, 6],
  },
  {
    id: 9,
    company: "Komatsu Malaysia",
    country: "马来西亚",
    city: "Kuala Lumpur",
    website: "https://www.komatsu.com.my/",
    source: "https://www.komatsu.com.my/contact",
    buyerType: "Distributor / Dealer",
    mainProducts: "挖掘机、装载机、工程机械、叉车",
    productMatch: "越野叉车、电动叉车与其工程机械/叉车渠道匹配。",
    summary: "小松马来西亚，工程机械与叉车渠道，适合电动叉车合作。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Komatsu%20Malaysia",
    contactPerson: "未公开",
    title: "Product / Sourcing Manager",
    score: 85,
    priority: "B",
    crmStatus: "New",
    nextAction: "推电动叉车与越野叉车的差异化供货。",
    followNote: "适合叉车品类切入。",
    scoreBreakdown: [27, 18, 15, 11, 6, 5],
  },
  {
    id: 10,
    company: "Mitsubishi Heavy Industries Thailand",
    country: "泰国",
    city: "Bangkok",
    website: "https://www.mhi.com/",
    source: "https://www.mhi.com/contact",
    buyerType: "Manufacturer / Distributor",
    mainProducts: "工程机械、叉车、物料搬运、工业设备",
    productMatch: "电动叉车、越野叉车与其工程机械/物料搬运匹配。",
    summary: "三菱重工泰国，工程机械与叉车制造，渠道广。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Mitsubishi%20Heavy%20Industries",
    contactPerson: "未公开",
    title: "Sourcing / Business Development",
    score: 84,
    priority: "B",
    crmStatus: "Verified",
    nextAction: "推电动叉车与越野叉车的 OEM/补充供货。",
    followNote: "适合工业设备组合。",
    scoreBreakdown: [27, 18, 15, 11, 6, 5],
  },
  {
    id: 11,
    company: "Astra Construction Machinery",
    country: "印尼",
    city: "Jakarta",
    website: "https://www.astra.co.id/",
    source: "https://www.astra.co.id/contact",
    buyerType: "Distributor / Importer",
    mainProducts: "工程机械、建筑设备、设备代理",
    productMatch: "越野叉车、伸缩臂叉装机与其工程机械渠道匹配。",
    summary: "印尼 Astra 集团工程机械板块，覆盖全国经销网络。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Astra%20Construction%20Machinery",
    contactPerson: "未公开",
    title: "Procurement / Distribution",
    score: 86,
    priority: "B",
    crmStatus: "New",
    nextAction: "推越野叉车+伸缩臂叉装机的区域分销。",
    followNote: "印尼渠道网络价值高。",
    scoreBreakdown: [28, 18, 15, 10, 7, 5],
  },
  {
    id: 12,
    company: "Arabian Machinery & Heavy Equipment",
    country: "沙特",
    city: "Riyadh",
    website: "https://www.amhec.com/",
    source: "https://www.amhec.com/contact",
    buyerType: "Rental Company / Dealer",
    mainProducts: "工程机械租赁、重型设备、土方设备",
    productMatch: "越野叉车、伸缩臂叉装机与其租赁/重型设备匹配。",
    summary: "沙特工程机械租赁与重型设备公司，含土方业务。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Arabian%20Machinery%20Heavy%20Equipment",
    contactPerson: "未公开",
    title: "Fleet / Rental Manager",
    score: 83,
    priority: "C",
    crmStatus: "New",
    nextAction: "面向租赁 fleet，推越野叉车+伸缩臂叉装机。",
    followNote: "租赁专项客户。",
    scoreBreakdown: [26, 17, 15, 8, 6, 5],
  },
  ];let leads = [...initialLeads];
let selectedId = leads[0].id;
let currentKeywords = [
  "custom cabinetry Australia builder",
  "kitchen company Australia custom cabinets",
  "wardrobe company Australia contact",
  "wood doors Australia builder supplier",
  "kitchen importer Australia cabinets",
  "joinery company Australia kitchen wardrobe",
];
let currentSteps = ["创建找客任务", "生成搜索关键词", "发现客户公司", "补全公司信息", "核验联系方式", "AI客户评分", "生成开发内容", "进入CRM跟进", "导出结果"];

const els = {
  rows: document.getElementById("leadRows"),
  search: document.getElementById("searchInput"),
  priorityFilter: document.getElementById("priorityFilter"),
  buyerFilter: document.getElementById("buyerFilter"),
  whatsappFilter: document.getElementById("whatsappFilter"),
  crmFilter: document.getElementById("crmFilter"),
  detailCompany: document.getElementById("detailCompany"),
  detailPriority: document.getElementById("detailPriority"),
  detailContent: document.getElementById("detailContent"),
  exportCsv: document.getElementById("exportCsv"),
  kpiVisible: document.getElementById("kpiVisible"),
  kpiPriority: document.getElementById("kpiPriority"),
  kpiPhone: document.getElementById("kpiPhone"),
  kpiFollow: document.getElementById("kpiFollow"),
  workflowInstruction: document.getElementById("workflowInstruction"),
  runWorkflow: document.getElementById("runWorkflow"),
  clearWorkflow: document.getElementById("clearWorkflow"),
  productInput: document.getElementById("productInput"),
  countryInput: document.getElementById("countryInput"),
  buyerInput: document.getElementById("buyerInput"),
  quantityInput: document.getElementById("quantityInput"),
  keywordList: document.getElementById("keywordList"),
  workflowSteps: document.getElementById("workflowSteps"),
  taskStatus: document.getElementById("taskStatus"),
  visibleSummary: document.getElementById("visibleSummary"),
};

function priorityClass(priorityValue) {
  return `priority-${priorityValue.toLowerCase()}`;
}

function scoreClass(score) {
  if (score >= 85) return "score-a";
  if (score >= 75) return "score-b";
  return "score-c";
}

function channelClass(status) {
  if (status === "已验证WhatsApp") return "channel-verified";
  if (status === "电话可核验WhatsApp") return "channel-check";
  return "channel-missing";
}

function firstEmail(lead) {
  if (lead.firstEmail) return lead.firstEmail;
  return `Subject: ${lead.company} and rough terrain / electric forklift supply

Hi ${lead.company} team,

I noticed that ${lead.company} works with ${lead.mainProducts}. We are FUDYN Machinery, a manufacturer of rough terrain forklifts, electric forklifts, telescopic handlers and backhoe loaders for construction, material handling, rental and distributor channels across Southeast Asia and the Middle East.

Would it be useful if I send a short catalogue and capability sheet for our rough terrain forklifts, electric forklifts and telescopic handlers?

Best regards,`;
}

function whatsappOpener(lead) {
  if (lead.whatsappOpener) return lead.whatsappOpener;
  return `Hi ${lead.company} team, this is [Your Name] from FUDYN Machinery. I saw that your company works with ${lead.mainProducts}. We manufacture rough terrain forklifts, electric forklifts, telescopic handlers and backhoe loaders. May I send a short catalogue and project reference?`;
}

function filteredLeads() {
  const query = els.search.value.trim().toLowerCase();
  return leads.filter((lead) => {
    const haystack = `${lead.company} ${lead.country} ${lead.buyerType} ${lead.mainProducts} ${lead.productMatch}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesPriority = !els.priorityFilter.value || lead.priority === els.priorityFilter.value;
    const matchesBuyer = !els.buyerFilter.value || lead.buyerType.includes(els.buyerFilter.value);
    const matchesWhatsapp = !els.whatsappFilter.value || lead.whatsappStatus === els.whatsappFilter.value;
    const matchesCrm = !els.crmFilter.value || lead.crmStatus === els.crmFilter.value;
    return matchesQuery && matchesPriority && matchesBuyer && matchesWhatsapp && matchesCrm;
  });
}

function renderKpis(list) {
  els.kpiVisible.textContent = list.length;
  els.kpiPriority.textContent = list.filter((lead) => lead.priority === "A" || lead.priority === "B").length;
  els.kpiPhone.textContent = list.filter((lead) => lead.phone && lead.phone !== "未公开").length;
  els.kpiFollow.textContent = list.filter((lead) => !["Won", "Lost", "Not Fit"].includes(lead.crmStatus)).length;
  els.visibleSummary.textContent = `${list.length} 个客户`;
}

function renderRows() {
  const list = filteredLeads();
  renderKpis(list);

  if (!list.some((lead) => lead.id === selectedId) && list[0]) {
    selectedId = list[0].id;
  }

  els.rows.innerHTML = list
    .map(
      (lead) => `
        <tr class="${lead.id === selectedId ? "selected" : ""}" data-id="${lead.id}">
          <td class="company-cell">
            <strong>${lead.company}</strong>
            <span>${lead.country} · ${lead.city}</span>
          </td>
          <td>${lead.buyerType}</td>
          <td><span class="score ${scoreClass(lead.score)}">${lead.score}</span></td>
          <td>
            <span class="channel-chip ${channelClass(lead.whatsappStatus)}">${lead.whatsappStatus}</span>
            <div class="muted">${lead.phone}</div>
          </td>
          <td>
            <strong>${lead.emailStatus}</strong>
            <span class="muted">${lead.email}</span>
          </td>
          <td><a href="${lead.linkedin}" target="_blank" rel="noreferrer">打开</a></td>
          <td>${lead.crmStatus}</td>
          <td>${lead.nextAction}</td>
        </tr>
      `,
    )
    .join("");

  els.rows.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      selectedId = Number(row.dataset.id);
      render();
    });
  });
}

function renderDetail() {
  const lead = leads.find((item) => item.id === selectedId) || filteredLeads()[0];
  if (!lead) {
    els.detailCompany.textContent = "没有匹配客户";
    els.detailPriority.textContent = "-";
    els.detailContent.innerHTML = "<p class=\"muted\">请调整筛选条件。</p>";
    return;
  }

  els.detailCompany.textContent = lead.company;
  els.detailPriority.textContent = `${lead.priority}级 · ${lead.score}`;
  els.detailPriority.className = `status-pill ${priorityClass(lead.priority)}`;

  const scoreLabels = ["产品匹配", "客户类型", "市场", "联系方式", "来源", "潜力"];
  els.detailContent.innerHTML = `
    <div class="detail-block">
      <h3>公司信息</h3>
      <p>${lead.summary}</p>
      <p><strong>主营产品</strong>${lead.mainProducts}</p>
      <p><strong>匹配点</strong>${lead.productMatch}</p>
      <p><a href="${lead.website}" target="_blank" rel="noreferrer">官网</a> · <a href="${lead.source}" target="_blank" rel="noreferrer">来源/联系页</a></p>
    </div>

    <div class="detail-block">
      <h3>联系方式</h3>
      <p><strong>WhatsApp</strong><span class="channel-chip ${channelClass(lead.whatsappStatus)}">${lead.whatsappStatus}</span></p>
      <p><strong>电话</strong>${lead.phone}</p>
      <p><strong>邮箱</strong>${lead.emailStatus} · ${lead.email}</p>
      <p><strong>LinkedIn</strong><a href="${lead.linkedin}" target="_blank" rel="noreferrer">打开 LinkedIn 搜索</a></p>
      <p><strong>建议联系人</strong>${lead.title}</p>
    </div>

    <div class="detail-block">
      <h3>评分拆解</h3>
      <div class="score-grid">
        ${lead.scoreBreakdown
          .map((value, index) => `<div class="score-item"><strong>${scoreLabels[index]}</strong><span>${value} 分</span></div>`)
          .join("")}
      </div>
    </div>

    <div class="detail-block">
      <h3>CRM 跟进</h3>
      <label>
        CRM状态
        <select id="crmStatusEditor">
          ${crmStatuses.map((status) => `<option value="${status}" ${status === lead.crmStatus ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </label>
      <label>
        跟进备注
        <textarea id="followNoteEditor">${lead.followNote}</textarea>
      </label>
    </div>

    <div class="detail-block">
      <h3>首封英文开发信</h3>
      <div class="message-box" id="emailCopy">${firstEmail(lead)}</div>
      <div class="detail-actions">
        <button class="secondary-button" data-copy="emailCopy" type="button">复制开发信</button>
      </div>
    </div>

    <div class="detail-block">
      <h3>WhatsApp 开场白</h3>
      <div class="message-box" id="whatsappCopy">${whatsappOpener(lead)}</div>
      <div class="detail-actions">
        <button class="secondary-button" data-copy="whatsappCopy" type="button">复制 WhatsApp 话术</button>
      </div>
    </div>
  `;

  document.getElementById("crmStatusEditor").addEventListener("change", (event) => {
    lead.crmStatus = event.target.value;
    render();
  });

  document.getElementById("followNoteEditor").addEventListener("input", (event) => {
    lead.followNote = event.target.value;
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const node = document.getElementById(button.dataset.copy);
      await copyText(node.textContent);
      button.textContent = "已复制";
      window.setTimeout(() => {
        button.textContent = button.dataset.copy === "emailCopy" ? "复制开发信" : "复制 WhatsApp 话术";
      }, 1200);
    });
  });
}

function renderWorkflowOutput() {
  els.keywordList.innerHTML = currentKeywords.map((keyword) => `<span class="keyword-pill">${keyword}</span>`).join("");
  els.workflowSteps.innerHTML = currentSteps.map((step) => `<span class="step-pill">${step} ✅</span>`).join("");
}

function runWorkflowFromInput() {
  const run = window.SkillWorkflow.createWorkflowRun(els.workflowInstruction.value);
  leads = run.leads;
  selectedId = leads[0]?.id ?? 0;
  currentKeywords = run.keywords;
  currentSteps = run.steps.map((step) => step.name);
  els.productInput.value = run.task.product;
  els.countryInput.value = run.task.country;
  els.buyerInput.value = run.task.buyerTypes.join(" + ");
  els.quantityInput.value = run.task.quantity;
  els.taskStatus.textContent = "工作流已运行";
  els.search.value = "";
  els.priorityFilter.value = "";
  els.buyerFilter.value = "";
  els.whatsappFilter.value = "";
  els.crmFilter.value = "";
  render();
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function exportCsv() {
  const headers = [
    "公司名称",
    "国家",
    "城市",
    "官网",
    "客户类型",
    "主营产品",
    "WhatsApp状态",
    "电话",
    "邮箱状态",
    "邮箱",
    "LinkedIn",
    "评分",
    "优先级",
    "CRM状态",
    "首封英文开发信",
    "WhatsApp开场白",
    "来源链接",
  ];

  const lines = [headers.map(csvEscape).join(",")];
  filteredLeads().forEach((lead) => {
    lines.push(
      [
        lead.company,
        lead.country,
        lead.city,
        lead.website,
        lead.buyerType,
        lead.mainProducts,
        lead.whatsappStatus,
        lead.phone,
        lead.emailStatus,
        lead.email,
        lead.linkedin,
        lead.score,
        lead.priority,
        lead.crmStatus,
        firstEmail(lead),
        whatsappOpener(lead),
        lead.source,
      ]
        .map(csvEscape)
        .join(","),
    );
  });

  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "skillhuoke1-leads.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function render() {
  renderWorkflowOutput();
  renderRows();
  renderDetail();
}

[els.search, els.priorityFilter, els.buyerFilter, els.whatsappFilter, els.crmFilter].forEach((el) => {
  el.addEventListener("input", render);
});

els.exportCsv.addEventListener("click", exportCsv);
els.runWorkflow.addEventListener("click", runWorkflowFromInput);
els.clearWorkflow.addEventListener("click", () => {
  els.workflowInstruction.value = "";
  els.workflowInstruction.focus();
});

render();
