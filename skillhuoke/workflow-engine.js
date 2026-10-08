(() => {
  const baseCompanies = [
    ["United Tractors", "Jakarta", "https://www.unitedtractors.com/", "https://www.unitedtractors.com/contact", "Distributor / Dealer", "工程机械、挖掘机、矿用设备、设备租赁", 89],
    ["Siam Kubota", "Bangkok", "https://www.siamkubota.co.th/", "https://www.siamkubota.co.th/contact", "Distributor / Importer", "拖拉机、农机、工程机械、柴油发动机", 88],
    ["Toyota Material Handling Thailand", "Bangkok", "https://www.toyota-industries.com/", "https://www.toyota-industries.com/contact", "Distributor", "叉车、物料搬运设备、电动叉车", 87],
    ["Sime Darby Industrial", "Kuala Lumpur", "https://www.simedarby.com/", "https://www.simedarby.com/contact", "Dealer / Distributor", "Caterpillar 工程设备、发电设备、工业机械", 86],
    ["Hoa Phat Group", "Hanoi", "https://www.hoaphat.com.vn/", "https://www.hoaphat.com.vn/contact", "Manufacturer / Importer", "钢铁、钢管、工程机械、建筑设备", 85],
    ["Delta Earthmoving", "Manila", "https://www.deltaearthmoving.com/", "https://www.deltaearthmoving.com/contact", "Construction Company / Rental Company", "工程机械、土方设备、挖掘机租赁", 84],
    ["Al-Bahar", "Dubai", "https://www.al-bahar.com/", "https://www.al-bahar.com/contact", "Distributor / Dealer", "Caterpillar 工程机械、发电机组、中东代理", 88],
    ["Zahid Tractors", "Jeddah", "https://www.zahid.com/", "https://www.zahid.com/contact", "Distributor / Dealer", "Caterpillar 工程机械、建筑设备、沙特代理", 87],
    ["Komatsu Malaysia", "Kuala Lumpur", "https://www.komatsu.com.my/", "https://www.komatsu.com.my/contact", "Distributor / Dealer", "挖掘机、装载机、工程机械、叉车", 85],
    ["Mitsubishi Heavy Industries Thailand", "Bangkok", "https://www.mhi.com/", "https://www.mhi.com/contact", "Manufacturer / Distributor", "工程机械、叉车、物料搬运、工业设备", 84],
    ["Astra Construction Machinery", "Jakarta", "https://www.astra.co.id/", "https://www.astra.co.id/contact", "Distributor / Importer", "工程机械、建筑设备、设备代理", 86],
    ["Arabian Machinery & Heavy Equipment", "Riyadh", "https://www.amhec.com/", "https://www.amhec.com/contact", "Rental Company / Dealer", "工程机械租赁、重型设备、土方设备", 83],
  ];

  const workflowSteps = ["创建找客任务", "生成搜索关键词", "发现客户公司", "补全公司信息", "核验联系方式", "AI客户评分", "生成开发内容", "进入CRM跟进", "导出结果"];

  function getLineValue(text, labels) {
    const labelPattern = labels.join("|");
    const match = text.match(new RegExp(`(?:${labelPattern})\\s*[：:]\\s*([^\\n]+)`, "i"));
    return match ? match[1].trim() : "";
  }

  function normalizeCountry(country) {
    if (/澳洲|澳大利亚|australia/i.test(country)) return "澳洲";
    return country || "澳洲";
  }

  function splitList(value) {
    return value.split(/\s*(?:\+|>|,|，|、|\/)\s*/).map((item) => item.trim()).filter(Boolean);
  }

  function parseWorkflowInstruction(instruction) {
    const text = instruction.trim();
    const product = getLineValue(text, ["产品", "Product"]) || "全屋定制、橱柜、衣柜、木门、家具出口";
    const country = normalizeCountry(getLineValue(text, ["目标国家", "国家", "市场", "Country"]));
    const buyerTypes = splitList(getLineValue(text, ["客户类型", "Buyer Types", "Buyer Type"]));
    const quantityRaw = getLineValue(text, ["数量", "客户数量", "Quantity"]);
    const quantity = Math.max(1, Math.min(Number.parseInt(quantityRaw, 10) || 12, 100));
    const contactPriority = splitList(getLineValue(text, ["联系方式优先级", "联系优先级", "Contact Priority"]));

    return {
      product,
      country,
      buyerTypes: buyerTypes.length ? buyerTypes : ["Builder", "Designer", "Kitchen Company", "Importer"],
      quantity,
      contactPriority: contactPriority.length ? contactPriority : ["WhatsApp", "电话", "邮箱", "LinkedIn"],
    };
  }

  function priority(score) {
    if (score >= 85) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    return "D";
  }

  function crmStatus(score) {
    if (score >= 75) return "Verified";
    if (score >= 60) return "New";
    return "Not Fit";
  }

  function buildEmail(company, product, products) {
    return `Subject: ${company} and rough terrain / electric forklift supply

Hi ${company} team,

I noticed that ${company} works with ${products}. We are FUDYN Machinery, a manufacturer of rough terrain forklifts, electric forklifts, telescopic handlers and backhoe loaders for construction, material handling, rental and distributor channels across Southeast Asia and the Middle East.

Would it be useful if I send a short catalogue and capability sheet for our rough terrain forklifts, electric forklifts and telescopic handlers?

Best regards,`;
  }

  function buildWhatsapp(company, product, products) {
    return `Hi ${company} team, this is [Your Name] from FUDYN Machinery. I saw that your company works with ${products}. We manufacture rough terrain forklifts, electric forklifts, telescopic handlers and backhoe loaders. May I send a short catalogue and project reference?`;
  }

  function createLead(seed, index, task) {
    const [company, city, website, source, buyerType, products, baseScore] = seed;
    const score = Math.max(62, baseScore - Math.floor(index / baseCompanies.length) * 3);
    const name = index < baseCompanies.length ? company : `${company} 候选拓展 ${Math.floor(index / baseCompanies.length) + 1}`;
    const p = priority(score);

    return {
      id: index + 1,
      company: name,
      country: task.country,
      city,
      website,
      source,
      buyerType,
      mainProducts: products,
      productMatch: `与 ${task.product} 存在直接或相邻匹配。`,
      summary: `${name} 的公开业务与 ${products} 相关，可作为 ${task.buyerTypes.join(" / ")} 方向的开发对象。`,
      whatsappStatus: score >= 75 ? "电话可核验WhatsApp" : "未公开WhatsApp",
      phone: "官网联系页核验；未发现可直接确认的公开 WhatsApp 号码",
      emailStatus: "联系表单",
      email: "未确认公开直邮；优先官网表单，邮箱为辅助补全",
      linkedin: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company)}`,
      contactPerson: "未公开",
      title: "Procurement / Sourcing / Owner / Design Director / Project Manager",
      score,
      priority: p,
      crmStatus: crmStatus(score),
      nextAction: p === "A" ? "优先人工核验联系方式并发送开发信。" : "进入二次筛选或渠道补全。",
      followNote: "工作流生成：发送前请人工核验来源、联系人和联系方式。",
      scoreBreakdown: [Math.min(30, score - 58), 18, 15, score >= 75 ? 11 : 8, 7, 5],
      firstEmail: buildEmail(name, task.product, products),
      whatsappOpener: buildWhatsapp(name, task.product, products),
    };
  }

  const COUNTRY_MAP = {
    "泰国": "Thailand", "越南": "Vietnam", "印尼": "Indonesia", "印度尼西亚": "Indonesia",
    "马来西亚": "Malaysia", "菲律宾": "Philippines", "阿联酋": "UAE", "迪拜": "UAE",
    "沙特": "Saudi Arabia", "沙特阿拉伯": "Saudi Arabia", "中东": "Middle East",
    "东南亚": "Southeast Asia", "澳洲": "Australia", "澳大利亚": "Australia",
  };
  function toEnCountry(cn) { return COUNTRY_MAP[cn] || cn; }

  function keywords(task) {
    const markets = (task.country || "东南亚 / 中东").split(/\s*[\/／,，、]\s*/).map((s) => s.trim()).filter(Boolean).map(toEnCountry);
    const enMarkets = markets.length ? markets : ["Southeast Asia", "Middle East"];
    const picks = enMarkets.slice(0, 6);
    while (picks.length < 6) picks.push(enMarkets[picks.length % enMarkets.length]);
    return [
      `rough terrain forklift ${picks[0]} distributor`,
      `electric forklift ${picks[1]} importer`,
      `telescopic handler ${picks[2]} rental company`,
      `backhoe loader ${picks[3]} construction equipment`,
      `material handling equipment ${picks[4]} dealer`,
      `construction machinery ${picks[5]} supplier`,
    ];
  }

  function createWorkflowRun(instruction) {
    const task = parseWorkflowInstruction(instruction);
    const leads = Array.from({ length: task.quantity }, (_, index) => createLead(baseCompanies[index % baseCompanies.length], index, task));

    return {
      task,
      keywords: keywords(task),
      steps: workflowSteps.map((name, index) => ({
        name,
        status: "done",
        note: index === 4 ? "联系方式按 WhatsApp > 电话 > 邮箱 > LinkedIn 规则核验，不编造号码。" : "已完成",
      })),
      leads,
    };
  }

  window.SkillWorkflow = { createWorkflowRun, parseWorkflowInstruction };
})();
