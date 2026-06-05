const OPENALEX_API = "https://api.openalex.org/works";
const EUROPEPMC_SEARCH_API = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";

const DOMAIN_PRESETS = {
  biomed: {
    name: "生物医学与生命科学",
    query: "cell biology immune response microbiome gene protein pathway biomedical mechanism",
    visual: "细胞、组织、器官、微生物、DNA、RNA、蛋白质、药物分子、实验器材、免疫细胞、疾病相关结构"
  },
  nature: {
    name: "自然环境与生态地理",
    query: "biodiversity ecosystem wildlife habitat climate landscape conservation remote sensing",
    visual: "单个动物、单株植物、叶片、花朵、昆虫、果实、种子、鸟巢、水滴、石块、简化生态关系图标"
  },
  it: {
    name: "信息技术与智能科技",
    query: "artificial intelligence robot sensor smart device machine learning data network",
    visual: "机器人、芯片、神经网络、智能设备、数据节点、云端、传感器、人机交互界面元素"
  },
  industry: {
    name: "工业制造与能源材料",
    query: "battery material energy manufacturing carbon capture industrial engineering renewable energy",
    visual: "电池、太阳能板、风机、材料晶格、碳捕集装置、污染治理设备、循环利用符号"
  },
  urban: {
    name: "城市建筑与交通物流",
    query: "urban planning architecture transport logistics traffic infrastructure smart city",
    visual: "城市天际线、建筑、桥梁、道路、车辆、轨道交通、仓储、货运、物流节点"
  },
  science: {
    name: "数理基础与科学原理",
    query: "mathematical model physics experiment chemical reaction molecular model scientific principle",
    visual: "几何体、物理实验装置、化学分子、反应容器、统计图形、力学符号、抽象科学结构"
  },
  custom: {
    name: "",
    query: "",
    visual: "论文内容中最有代表性的对象、结构、材料、设备、环境元素或机制关系"
  }
};

const CARTOON_STYLE_OPTIONS = [
  "彩铅感",
  "粉笔感",
  "纸艺剪贴",
  "黏土感",
  "低多边形",
  "漫画分镜",
  "复古科普",
  "等距小模型",
  "线稿填色",
  "玻璃质感卡通",
  "图标玩具感",
  "Q版科普",
  "轻半立体卡通",
  "干净扁平图形",
  "厚描边贴纸",
  "赛璐璐动画",
  "极简线面插画",
  "几何图标卡通",
  "软塑料玩具",
  "泡泡糖高光",
  "拼块积木感",
  "2.5D数字插画",
  "科技UI卡通",
  "童书科普插画",
  "简洁矢量贴纸",
  "信息图标卡通"
];

const FINAL_COMPOSITION_OPTIONS = [
  "单主体近景",
  "双主体互动",
  "局部剖面视角",
  "主对象加局部放大",
  "进入微环境",
  "作用瞬间",
  "前后状态对照",
  "核心对象加少量关联物",
  "局部场景切片",
  "路径轨迹构图",
  "包裹或包围关系",
  "层级结构剖开",
  "操作台式近景",
  "异常点突出"
];

const state = {
  promptsText: "",
  promptFiles: [],
  metadata: [],
  fetchWarnings: [],
  styleBag: [],
  finalCompositionBag: [],
  promptStyle: "addchat",
  selectedPrefixIndex: 0,
  selectedPreviewIndex: 0
};

const els = {
  domainList: document.getElementById("domainList"),
  domainTemplate: document.getElementById("domainTemplate"),
  addDomainButton: document.getElementById("addDomainButton"),
  removeDomainButton: document.getElementById("removeDomainButton"),
  styleButtons: Array.from(document.querySelectorAll(".seg")),
  specifyRandomStyle: document.getElementById("specifyRandomStyle"),
  specifyFinalComposition: document.getElementById("specifyFinalComposition"),
  screenSettings: document.getElementById("screenSettings"),
  screenCount: document.getElementById("screenCount"),
  firstRatio: document.getElementById("firstRatio"),
  lastRatio: document.getElementById("lastRatio"),
  useEuropePmc: document.getElementById("useEuropePmc"),
  openAccessOnly: document.getElementById("openAccessOnly"),
  runButton: document.getElementById("runButton"),
  downloadButton: document.getElementById("downloadButton"),
  applyPrefixButton: document.getElementById("applyPrefixButton"),
  prefixFileSelect: document.getElementById("prefixFileSelect"),
  previewFileSelect: document.getElementById("previewFileSelect"),
  statusText: document.getElementById("statusText"),
  progress: document.getElementById("progress"),
  prefixEditor: document.getElementById("prefixEditor"),
  preview: document.getElementById("preview")
};

function setStatus(text, progress = null) {
  els.statusText.textContent = text;
  if (progress !== null) els.progress.value = progress;
}

function cleanText(text) {
  return (text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inferVisualExamples(domainName) {
  const name = domainName.toLowerCase();
  if (/生物|医学|生命|cell|bio|medical|microbe|gene|protein/.test(name)) {
    return "细胞、组织、器官、微生物、DNA、RNA、蛋白质、药物分子、实验器材、免疫细胞、疾病相关结构";
  }
  if (/自然|生态|地理|环境|wild|nature|eco|climate|geography/.test(name)) {
    return "单个动物、单株植物、叶片、花朵、昆虫、果实、种子、鸟巢、水滴、石块、简化生态关系图标";
  }
  if (/智能|技术|ai|digital|robot|sensor|network|computer/.test(name)) {
    return "机器人、芯片、神经网络、智能设备、数据节点、云端、传感器、人机交互界面元素";
  }
  if (/能源|材料|工业|制造|battery|material|energy|industry/.test(name)) {
    return "电池、太阳能板、风机、材料晶格、碳捕集装置、污染治理设备、循环利用符号";
  }
  return "论文内容中最有代表性的对象、结构、材料、设备、环境元素或机制关系";
}

function presetForValue(value) {
  return DOMAIN_PRESETS[value] || DOMAIN_PRESETS.custom;
}

function safeFilePart(text, fallback) {
  const cleaned = cleanText(text)
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || fallback;
}

function clipText(text, maxChars = 1300) {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(";"), cut.lastIndexOf("。"));
  if (lastStop > 450) return cut.slice(0, lastStop + 1).trim();
  return cut.replace(/\s+\S*$/, "").trim();
}

function reconstructAbstract(index) {
  if (!index) return "";
  const positions = Object.values(index).flat();
  const max = Math.max(...positions, -1);
  if (max < 0) return "";
  const words = new Array(max + 1).fill("");
  for (const [word, slots] of Object.entries(index)) {
    for (const slot of slots) words[slot] = word;
  }
  return cleanText(words.filter(Boolean).join(" "));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, label) {
  const retryStatuses = new Set([408, 429, 500, 502, 503, 504]);
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (response.ok) return response.json();
      const message = `${label}: ${response.status} ${response.statusText || ""}`.trim();
      lastError = new Error(message);
      if (!retryStatuses.has(response.status)) throw lastError;
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await wait(700 * attempt);
  }
  throw lastError || new Error(`${label}: request failed`);
}

async function fetchOpenAlex(query, limit, openAccessOnly) {
  const params = new URLSearchParams({
    search: query,
    "per-page": String(Math.min(Math.max(limit * 2, 10), 50))
  });
  params.set("filter", openAccessOnly ? "type:article,is_oa:true" : "type:article");

  const data = await fetchJson(`${OPENALEX_API}?${params.toString()}`, "OpenAlex");
  return (data.results || []).map((work) => {
    const abstract = reconstructAbstract(work.abstract_inverted_index);
    return {
      source: "OpenAlex",
      title: cleanText(work.title),
      year: work.publication_year || "",
      doi: work.doi || "",
      url: work.primary_location?.landing_page_url || work.id || "",
      text: clipText(`${work.title || ""}. ${abstract}`)
    };
  });
}

async function fetchEuropePmc(query, limit, openAccessOnly) {
  const pmcQuery = openAccessOnly ? `(${query}) OPEN_ACCESS:y` : query;
  const params = new URLSearchParams({
    query: pmcQuery,
    format: "json",
    pageSize: String(Math.min(Math.max(limit * 2, 10), 50))
  });
  const data = await fetchJson(`${EUROPEPMC_SEARCH_API}?${params.toString()}`, "Europe PMC");
  return (data.resultList?.result || []).map((paper) => {
    const text = `${paper.title || ""}. ${paper.abstractText || ""}`;
    return {
      source: "Europe PMC",
      title: cleanText(paper.title),
      year: paper.pubYear || "",
      doi: paper.doi ? `https://doi.org/${paper.doi}` : "",
      url: paper.pmcid ? `https://europepmc.org/article/MED/${paper.pmid || paper.id}` : "",
      text: clipText(text)
    };
  });
}

function scoreRecord(record) {
  const text = record.text.toLowerCase();
  const terms = [
    "mechanism", "pathway", "response", "model", "workflow", "analysis",
    "cell", "gene", "protein", "ecosystem", "habitat", "sensor", "material",
    "interaction", "regulation", "network", "structure", "process"
  ];
  let score = Math.min(record.text.length / 40, 30);
  for (const term of terms) {
    if (text.includes(term)) score += 5;
  }
  if (record.source === "Europe PMC") score += 5;
  return score;
}

function uniqueRecords(records, limit) {
  const seen = new Set();
  return records
    .filter((record) => record.title && record.text.length > 180)
    .sort((a, b) => scoreRecord(b) - scoreRecord(a))
    .filter((record) => {
      const key = record.title.toLowerCase().replace(/\W+/g, " ").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function shuffledCartoonStyles() {
  const styles = [...CARTOON_STYLE_OPTIONS];
  for (let i = styles.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [styles[i], styles[j]] = [styles[j], styles[i]];
  }
  return styles;
}

function pickCartoonStyle() {
  if (!state.styleBag.length) {
    state.styleBag = shuffledCartoonStyles();
  }
  return state.styleBag.shift();
}

function shuffledFinalCompositions() {
  const compositions = [...FINAL_COMPOSITION_OPTIONS];
  for (let i = compositions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [compositions[i], compositions[j]] = [compositions[j], compositions[i]];
  }
  return compositions;
}

function pickFinalComposition() {
  if (!state.finalCompositionBag.length) {
    state.finalCompositionBag = shuffledFinalCompositions();
  }
  return state.finalCompositionBag.shift();
}

function commonStyleText(specifiedStyle = "") {
  if (specifiedStyle) {
    return `所有屏幕都不要标题、标签、字母、数字或说明文字；不要复杂背景，不要照片级3D。本条prompt直接指定卡通风格：${specifiedStyle}；请围绕这一风格完成整组图片，配色和构图可以变化，但不要再随机切换到其他风格。避免总是紫粉渐变、透明细胞、漂浮颗粒网或白底居中。`;
  }
  return `所有屏幕都不要标题、标签、字母、数字或说明文字；不要复杂背景，不要照片级3D。风格保持卡通大类，并主动随机化：本段各屏之间要换画法、配色和构图，和上一段生成结果也尽量更换风格。可使用但不限于：${CARTOON_STYLE_OPTIONS.join("、")}。避免总是紫粉渐变、透明细胞、漂浮颗粒网或白底居中。`;
}

function readScreenSettings() {
  const screenCount = Math.min(Math.max(Number(els.screenCount.value) || 4, 2), 10);
  els.screenCount.value = String(screenCount);
  return {
    screenCount,
    firstRatio: els.firstRatio.value || "1:1",
    lastRatio: els.lastRatio.value || "16:9"
  };
}

function screenListText(count) {
  return Array.from({ length: count }, (_, index) => `第${index + 1}屏`).join("、");
}

function splitPromptParts(prompt) {
  const marker = "论文内容：";
  const index = prompt.lastIndexOf(marker);
  if (index < 0) return { prefix: prompt, body: "" };
  return {
    prefix: prompt.slice(0, index + marker.length),
    body: prompt.slice(index + marker.length)
  };
}

function normalizePrefix(prefix) {
  let nextPrefix = (prefix || "").trim();
  if (!nextPrefix.includes("论文内容：")) {
    nextPrefix = `${nextPrefix}${nextPrefix ? "\n" : ""}论文内容：`;
  }
  return nextPrefix;
}

function extractSpecifiedCartoonStyle(prefix) {
  const match = String(prefix || "").match(/本条prompt直接指定卡通风格：([^；。]+)/);
  return match ? match[1].trim() : "";
}

function preserveItemSpecifiedStyle(newPrefix, item) {
  const itemStyle = extractSpecifiedCartoonStyle(item.prefix);
  if (!itemStyle) return newPrefix;
  return newPrefix.replace(/(本条prompt直接指定卡通风格：)([^；。]+)/, `$1${itemStyle}`);
}

function extractSpecifiedFinalComposition(prefix) {
  const match = String(prefix || "").match(/本条prompt直接指定第\d+图构图：([^；。]+)/);
  return match ? match[1].trim() : "";
}

function preserveItemFinalComposition(newPrefix, item) {
  const itemComposition = extractSpecifiedFinalComposition(item.prefix);
  if (!itemComposition) return newPrefix;
  return newPrefix.replace(/(本条prompt直接指定第\d+图构图：)([^；。]+)/, `$1${itemComposition}`);
}

function preserveItemSpecifiedOptions(newPrefix, item) {
  return preserveItemFinalComposition(preserveItemSpecifiedStyle(newPrefix, item), item);
}

function finalCompositionText(finalScreen, specifiedComposition = "") {
  const base = `${finalScreen}构图必须避免元素堆砌、中心辐射网络、图标清单或把多个关键词物件简单平铺连接。画面围绕一个主要对象或一个明确事件展开，像一个有故事瞬间的无文字科普插图：一个主角、一个动作、少量辅助对象、清晰关系。`;
  if (specifiedComposition) {
    return `${base}本条prompt直接指定${finalScreen.replace("屏", "图")}构图：${specifiedComposition}；请围绕这一种构图完成${finalScreen}，不要混合多种构图套路。`;
  }
  return `${base}${finalScreen}请从以下14种构图中随机选择一种，而且只选一种：${FINAL_COMPOSITION_OPTIONS.join("、")}。`;
}

function buildAddChatPrompt(record, task) {
  return [
    `Create image with aspect ratio: 16:9: 请根据以下论文内容生成一张极简无文字${task.domainLabel}学术示意图，风格偏扁平矢量学术插画，参考干净医学插画的简洁度，允许少量柔和阴影和轻微体积感。只表达核心机制，不画完整复杂场景；画面最多包含3到5个主要图形单元、1到3条主箭头、2到4个浅色圆角分区或模块。使用大面积留白、低饱和配色、清晰轮廓和简单形状；不要标题、标签、字母、数字或说明文字。避免密集纹理、密集碎线、颗粒堆叠、重复图标或节点、复杂微小结构、强高光、照片级3D渲染和过多小元素；整体更简洁，更接近干净的论文机制流程示意图。`,
    `可优先考虑这些视觉对象：${task.visualExamples}。`,
    `论文内容：${record.text}`
  ].join("");
}

function buildScreensPrompt(record, task) {
  const screenCount = task.screenCount || 4;
  const firstScreenCount = Math.max(screenCount - 1, 1);
  const finalScreen = `第${screenCount}屏`;
  const firstScreenRange = firstScreenCount === 1 ? "第1屏" : `第1屏到第${firstScreenCount}屏`;
  const specifiedStyle = task.specifyRandomStyle ? pickCartoonStyle() : "";
  const specifiedFinalComposition = task.specifyFinalComposition ? pickFinalComposition() : "";
  return [
    `请根据以下论文内容生成图片。关键执行方式：从第1屏开始重新生成单张独立图，逐屏执行：${screenListText(screenCount)}，生成完一张自动继续下一张，直到${finalScreen}完成。每一屏都是一张单独图片、单独画布、单独结果；不要四宫格，不要拼图，不要拼版，不要长图，不要把多个结果合成在同一张画布或同一个外框里。`,
    `主题领域：${task.domainLabel}。`,
    `${firstScreenRange}分别使用${task.firstRatio || "1:1"}比例：从论文内容中挑选${firstScreenCount}个最有代表性、最适合单独成图的物品、主体或场景元素，各生成一张简单卡通素材图；每屏只画1个核心对象，可加入少量辅助小元素，但不要表达步骤、因果或流程。这些屏幕必须是简单物件素材图，白色或浅色纯背景，主体居中或轻微偏移，轮廓清楚，少细节、少纹理，像可单独使用的图标/贴纸/素材；不要画完整场景、微缩生态景观、复杂环境底座、密集背景、密集野生动物、复杂建筑或复杂人群。`,
    `可优先考虑这些视觉对象：${task.visualExamples}。`,
    `${finalScreen}使用${task.lastRatio || "16:9"}比例：生成一张无文字的百科式学术卡通插图，不是风景画，不是大场景插画，不是流程图。${finalScreen}要有故事性，像一个小型科普场景或机制片段，重点表现几个关键对象如何共处、接触、影响、进入某个微环境、形成结构或产生现象。优先使用近景、局部视角或明确互动瞬间，让主体占据画面主要面积，周围只保留1到3个辅助元素。可以用局部放大、箭头、简化剖面、运动轨迹、轻量对照、前后状态暗示或空间层次来描述关系，但这些都是可选手段，不要每次都强行使用。通常画3到8个主要视觉元素，像教材里的无文字小型机制示意图。${finalScreen}只提取其中最有代表性的几个物件或关系。`,
    finalCompositionText(finalScreen, specifiedFinalComposition),
    "使用清晰封闭轮廓、干净实色或平滑渐变色块、平滑边缘和较少颜色层级，避免颗粒、交叉排线、纸张纹理、手绘涂抹痕迹和大量碎线。",
    commonStyleText(specifiedStyle),
    `论文内容：${record.text}`
  ].join("");
}

function buildPrompt(record, task) {
  return state.promptStyle === "addchat"
    ? buildAddChatPrompt(record, task)
    : buildScreensPrompt(record, task);
}

function applyPresetToCard(card, overwriteQuery = true) {
  const presetValue = card.querySelector(".domain-preset").value;
  const preset = presetForValue(presetValue);
  const customWrap = card.querySelector(".custom-domain-wrap");
  const domainInput = card.querySelector(".domain-name");
  const query = card.querySelector(".query-input");
  customWrap.classList.toggle("hidden", presetValue !== "custom");
  if (presetValue === "custom") {
    if (overwriteQuery && !query.value.trim()) query.value = "";
    domainInput.focus();
    return;
  }
  domainInput.value = preset.name;
  if (overwriteQuery) query.value = preset.query;
}

function addDomainCard(presetValue = "biomed") {
  const fragment = els.domainTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".domain-card");
  const presetSelect = fragment.querySelector(".domain-preset");
  const domainInput = fragment.querySelector(".domain-name");
  const query = fragment.querySelector(".query-input");
  presetSelect.value = presetValue;
  presetSelect.addEventListener("change", () => {
    applyPresetToCard(card, true);
  });
  fragment.querySelector(".remove-card").addEventListener("click", () => {
    if (els.domainList.children.length > 1) {
      card.remove();
      refreshDomainIndexes();
    }
  });
  els.domainList.appendChild(fragment);
  applyPresetToCard(card, true);
  refreshDomainIndexes();
}

function refreshDomainIndexes() {
  Array.from(els.domainList.querySelectorAll(".domain-card")).forEach((card, index) => {
    card.querySelector(".domain-index").textContent = `领域 ${index + 1}`;
  });
}

function readTasks() {
  const screenSettings = readScreenSettings();
  return Array.from(els.domainList.querySelectorAll(".domain-card")).map((card) => {
    const presetValue = card.querySelector(".domain-preset").value;
    const preset = presetForValue(presetValue);
    const domainName = presetValue === "custom"
      ? (card.querySelector(".domain-name").value.trim() || "未命名领域")
      : preset.name;
    const query = card.querySelector(".query-input").value.trim() || domainName;
    const promptCount = Math.min(Math.max(Number(card.querySelector(".prompt-count").value) || 8, 1), 50);
    const paperCount = Math.min(Math.max(Number(card.querySelector(".paper-count").value) || promptCount, 1), 50);
    const perPaper = Math.min(Math.max(Number(card.querySelector(".per-paper").value) || 1, 1), 5);
    return {
      domain: safeFilePart(domainName, "domain"),
      domainName,
      query,
      promptCount,
      paperCount,
      perPaper,
      domainLabel: domainName,
      visualExamples: presetValue === "custom" ? inferVisualExamples(domainName) : preset.visual,
      specifyRandomStyle: els.specifyRandomStyle.checked,
      specifyFinalComposition: state.promptStyle === "screens" && els.specifyFinalComposition.checked,
      ...screenSettings
    };
  });
}

async function fetchTaskRecords(task, openAccessOnly, useEuropePmc) {
  const limit = Math.max(task.paperCount, Math.ceil(task.promptCount / task.perPaper));
  const batches = [];
  const errors = [];
  try {
    batches.push(await fetchOpenAlex(task.query, limit, openAccessOnly));
  } catch (error) {
    errors.push(error.message || String(error));
  }
  if (useEuropePmc) {
    try {
      batches.push(await fetchEuropePmc(task.query, limit, openAccessOnly));
    } catch (error) {
      errors.push(error.message || String(error));
    }
  }
  if (!batches.length) {
    throw new Error(errors.length ? errors.join("；") : "论文接口没有返回结果");
  }
  if (errors.length) {
    const warning = `${task.domainName}: ${errors.join("；")}`;
    state.fetchWarnings.push(warning);
    console.warn(warning);
  }
  return uniqueRecords(batches.flat(), Math.max(task.promptCount, task.paperCount));
}

async function runCrawler() {
  const tasks = readTasks();
  const openAccessOnly = els.openAccessOnly.checked;
  const useEuropePmc = els.useEuropePmc.checked;

  els.runButton.disabled = true;
  els.downloadButton.disabled = true;
  els.applyPrefixButton.disabled = true;
  els.prefixFileSelect.disabled = true;
  els.previewFileSelect.disabled = true;
  els.prefixFileSelect.innerHTML = "";
  els.previewFileSelect.innerHTML = "";
  els.prefixEditor.disabled = true;
  els.prefixEditor.value = "";
  els.preview.value = "";
  state.promptsText = "";
  state.promptFiles = [];
  state.metadata = [];
  state.fetchWarnings = [];
  state.styleBag = [];
  state.finalCompositionBag = [];
  state.selectedPrefixIndex = 0;
  state.selectedPreviewIndex = 0;

  try {
    const fileMap = [];
    for (let i = 0; i < tasks.length; i += 1) {
      const task = tasks[i];
      const baseProgress = Math.round((i / tasks.length) * 85);
      setStatus(`正在检索领域 ${i + 1}/${tasks.length}: ${task.domainName}`, baseProgress);
      const records = await fetchTaskRecords(task, openAccessOnly, useEuropePmc);
      if (!records.length) continue;
      const selected = records.slice(0, task.promptCount);
      const prompts = [];
      const items = [];
      selected.forEach((record) => {
        const prompt = buildPrompt(record, task);
        prompts.push(prompt);
        items.push(splitPromptParts(prompt));
        state.metadata.push({ ...record, domain: task.domain });
      });
      if (prompts.length) {
        fileMap.push({
          domainName: task.domainName,
          filename: `${task.domain}_prompts.txt`,
          items,
          text: prompts.join("\n\n")
        });
      }
    }

    if (!fileMap.length) {
      throw new Error("没有找到可用论文文本，请换关键词或取消“优先开放论文”。");
    }

    state.promptFiles = uniquifyPromptFiles(fileMap);
    populateFileSelectors();
    refreshPromptTexts();
    loadSelectedPrefix();
    els.downloadButton.disabled = false;
    const totalPrompts = state.promptFiles.reduce((sum, file) => sum + (file.items?.length || 0), 0);
    const warningText = state.fetchWarnings.length ? `；部分接口失败，已降级继续：${state.fetchWarnings.length} 条` : "";
    setStatus(`完成：${state.promptFiles.length} 个领域文件，${totalPrompts} 条 prompt${warningText}`, 100);
  } catch (error) {
    console.error(error);
    setStatus(`失败：${error.message}`, 0);
  } finally {
    els.runButton.disabled = false;
  }
}

function refreshPromptTexts() {
  state.promptFiles = state.promptFiles.map((file) => {
    const text = file.items
      ? file.items.map((item) => `${item.prefix}${item.body}`).join("\n\n")
      : file.text;
    return { ...file, text };
  });
  state.promptsText = state.promptFiles
    .map((file) => `# ${file.filename}\n\n${file.text}`)
    .join("\n\n");
  renderSelectedPreview();
}

function populateFileSelectors() {
  const options = state.promptFiles
    .map((file, index) => `<option value="${index}">${escapeHtml(file.domainName || file.filename)}</option>`)
    .join("");
  els.prefixFileSelect.innerHTML = options;
  els.previewFileSelect.innerHTML = options;
  els.prefixFileSelect.disabled = !state.promptFiles.length;
  els.previewFileSelect.disabled = !state.promptFiles.length;
  state.selectedPrefixIndex = 0;
  state.selectedPreviewIndex = 0;
  els.prefixFileSelect.value = "0";
  els.previewFileSelect.value = "0";
}

function selectedFile(index) {
  return state.promptFiles[Math.min(Math.max(Number(index) || 0, 0), Math.max(state.promptFiles.length - 1, 0))];
}

function loadSelectedPrefix() {
  const file = selectedFile(state.selectedPrefixIndex);
  const firstItem = file?.items?.[0];
  els.prefixEditor.value = firstItem?.prefix || "";
  const hasPrefix = Boolean(firstItem);
  els.prefixEditor.disabled = !hasPrefix;
  els.applyPrefixButton.disabled = !hasPrefix;
}

function renderSelectedPreview() {
  const file = selectedFile(state.selectedPreviewIndex);
  els.preview.value = file ? `# ${file.filename}\n\n${file.text}` : "";
}

function clearGeneratedOutputs() {
  state.promptsText = "";
  state.promptFiles = [];
  state.metadata = [];
  state.fetchWarnings = [];
  state.styleBag = [];
  state.finalCompositionBag = [];
  state.selectedPrefixIndex = 0;
  state.selectedPreviewIndex = 0;
  els.prefixFileSelect.innerHTML = "";
  els.previewFileSelect.innerHTML = "";
  els.prefixFileSelect.disabled = true;
  els.previewFileSelect.disabled = true;
  els.prefixEditor.value = "";
  els.prefixEditor.disabled = true;
  els.preview.value = "";
  els.applyPrefixButton.disabled = true;
  els.downloadButton.disabled = true;
}

function applyCurrentFilePrefix() {
  if (!state.promptFiles.length) return;
  const prefix = normalizePrefix(els.prefixEditor.value);
  const index = Math.min(Math.max(Number(state.selectedPrefixIndex) || 0, 0), state.promptFiles.length - 1);
  els.prefixEditor.value = prefix;
  state.promptFiles = state.promptFiles.map((file, fileIndex) => ({
    ...file,
    items: fileIndex === index
      ? (file.items || []).map((item) => ({ ...item, prefix: preserveItemSpecifiedOptions(prefix, item) }))
      : file.items
  }));
  refreshPromptTexts();
  setStatus(`已将前缀应用到当前领域：${state.promptFiles[index].domainName || state.promptFiles[index].filename}`, 100);
}

function uniquifyPromptFiles(files) {
  const counts = new Map();
  return files.map((file) => {
    const base = file.filename.replace(/_prompts\.txt$/, "");
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    return {
      ...file,
      filename: count ? `${base}_${count + 1}_prompts.txt` : file.filename
    };
  });
}

function downloadTextFile(text, filename, saveAs = false) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename,
    saveAs
  }, () => {
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  });
}

function downloadTxt() {
  if (!state.promptFiles.length) return;
  const folder = "multi_domain_prompt_files";
  state.promptFiles.forEach((file) => {
    downloadTextFile(file.text, `${folder}/${file.filename}`, false);
  });
}

function setPromptStyle(style, options = {}) {
  const changed = state.promptStyle !== style;
  state.promptStyle = style;
  els.styleButtons.forEach((item) => item.classList.toggle("active", item.dataset.style === style));
  els.screenSettings.classList.toggle("hidden", style !== "screens");
  if (changed && options.clearOutputs !== false) {
    clearGeneratedOutputs();
    setStatus("已切换 Prompt 风格，请重新爬取生成。", 0);
  }
}

els.styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPromptStyle(button.dataset.style);
  });
});

els.specifyRandomStyle.addEventListener("change", () => {
  clearGeneratedOutputs();
  setStatus("已切换风格指定方式，请重新爬取生成。", 0);
});

els.specifyFinalComposition.addEventListener("change", () => {
  clearGeneratedOutputs();
  setStatus("已切换第4图构图指定方式，请重新爬取生成。", 0);
});

els.addDomainButton.addEventListener("click", () => addDomainCard("biomed"));
els.removeDomainButton.addEventListener("click", () => {
  if (els.domainList.children.length > 1) {
    els.domainList.lastElementChild.remove();
    refreshDomainIndexes();
  }
});
els.runButton.addEventListener("click", runCrawler);
els.downloadButton.addEventListener("click", downloadTxt);
els.applyPrefixButton.addEventListener("click", applyCurrentFilePrefix);
els.prefixFileSelect.addEventListener("change", () => {
  state.selectedPrefixIndex = Number(els.prefixFileSelect.value) || 0;
  loadSelectedPrefix();
});
els.previewFileSelect.addEventListener("change", () => {
  state.selectedPreviewIndex = Number(els.previewFileSelect.value) || 0;
  renderSelectedPreview();
});

addDomainCard("biomed");
setPromptStyle(state.promptStyle, { clearOutputs: false });
