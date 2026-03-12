#!/usr/bin/env node
// Generates supabuilder-explainer.excalidraw

const elements = [];
let idCounter = 1;
const id = () => `elem_${idCounter++}`;

// Helpers
function rect({ x, y, w, h, bg = "transparent", stroke = "#000000", strokeWidth = 2, radius = 8, fill = "solid", label = null, fontSize = 20, fontFamily = 1, textAlign = "center", verticalAlign = "middle", opacity = 100 }) {
  const rectId = id();
  const els = [];
  const boundElements = [];

  if (label) {
    const textId = id();
    boundElements.push({ id: textId, type: "text" });
    els.push({
      id: textId,
      type: "text",
      x: x + 4,
      y: y + 4,
      width: w - 8,
      height: h - 8,
      angle: 0,
      strokeColor: stroke === "#ffffff" ? "#000000" : (stroke === "#000000" || stroke === "#495057" ? "#000000" : "#1e1e1e"),
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 0,
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 2000000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 2000000000),
      isDeleted: false,
      text: label,
      fontSize,
      fontFamily,
      textAlign,
      verticalAlign,
      containerId: rectId,
      originalText: label,
      autoResize: true,
      lineHeight: 1.25,
    });
  }

  els.unshift({
    id: rectId,
    type: "rectangle",
    x, y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: stroke,
    backgroundColor: bg,
    fillStyle: fill,
    strokeWidth,
    roughness: 0,
    opacity,
    groupIds: [],
    frameId: null,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 2000000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements,
  });

  return { id: rectId, els };
}

function text({ x, y, w = 200, content, fontSize = 20, color = "#000000", align = "center", fontFamily = 1 }) {
  const textId = id();
  return {
    id: textId,
    els: [{
      id: textId,
      type: "text",
      x, y,
      width: w,
      height: fontSize * 1.25 * Math.ceil(content.length * fontSize * 0.6 / w + 0.5),
      angle: 0,
      strokeColor: color,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 0,
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 2000000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 2000000000),
      isDeleted: false,
      text: content,
      fontSize,
      fontFamily,
      textAlign: align,
      verticalAlign: "top",
      containerId: null,
      originalText: content,
      autoResize: true,
      lineHeight: 1.25,
    }]
  };
}

function arrow({ startId, endId, startX, startY, endX, endY, color = "#495057", strokeWidth = 2 }) {
  const arrowId = id();
  const points = [[0, 0], [endX - startX, endY - startY]];
  const bindings = {};
  const boundUpdates = [];

  if (startId) {
    bindings.startBinding = { elementId: startId, focus: 0, gap: 4, fixedPoint: null };
    boundUpdates.push({ targetId: startId, arrowId });
  }
  if (endId) {
    bindings.endBinding = { elementId: endId, focus: 0, gap: 4, fixedPoint: null };
    boundUpdates.push({ targetId: endId, arrowId });
  }

  return {
    id: arrowId,
    boundUpdates,
    els: [{
      id: arrowId,
      type: "arrow",
      x: startX,
      y: startY,
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
      angle: 0,
      strokeColor: color,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth,
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: { type: 2 },
      seed: Math.floor(Math.random() * 2000000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 2000000000),
      isDeleted: false,
      points,
      lastCommittedPoint: null,
      ...bindings,
      startArrowhead: null,
      endArrowhead: "arrow",
    }]
  };
}

// ============================================
// PANEL 1: Your AI Product Team (top-left)
// ============================================
const P1X = 50, P1Y = 50;

// Panel title
elements.push(...text({ x: P1X, y: P1Y, w: 1700, content: "Your AI Product Team", fontSize: 36, color: "#000000" }).els);

// YOU box
const youBox = rect({ x: P1X + 700, y: P1Y + 70, w: 220, h: 70, bg: "#ffffff", stroke: "#000000", strokeWidth: 4, label: "YOU", fontSize: 28 });
elements.push(...youBox.els);

// Orchestrator box
const orchBox = rect({ x: P1X + 600, y: P1Y + 220, w: 420, h: 90, bg: "#e9ecef", stroke: "#495057", strokeWidth: 2, label: "Your Product Lead\n(Orchestrator)", fontSize: 20 });
elements.push(...orchBox.els);

// Arrow YOU → Orchestrator
const a1 = arrow({ startId: youBox.id, endId: orchBox.id, startX: P1X + 810, startY: P1Y + 140, endX: P1X + 810, endY: P1Y + 220 });
elements.push(...a1.els);

// Subtitle under orchestrator
elements.push(...text({ x: P1X + 480, y: P1Y + 320, w: 680, content: "You talk to one person. It manages the whole team.", fontSize: 16, color: "#495057" }).els);

// 6 agent cards
const agents = [
  { name: "Strategist", desc: "Big picture\n& direction", bg: "#d0bfff" },
  { name: "PM", desc: "What to build\n& why", bg: "#a5d8ff" },
  { name: "Designer", desc: "Look, feel &\nexperience", bg: "#ffc9c9" },
  { name: "Architect", desc: "How it fits\ntogether", bg: "#b2f2bb" },
  { name: "Tech PM", desc: "Buildable\ntickets", bg: "#ffd8a8" },
  { name: "QA", desc: "Tests &\nquality", bg: "#ffec99" },
];

const agentCardW = 220, agentCardH = 100, agentGap = 40;
const agentRowW = agents.length * agentCardW + (agents.length - 1) * agentGap;
const agentStartX = P1X + (1700 - agentRowW) / 2;
const agentY = P1Y + 380;

const agentBoxIds = [];
agents.forEach((agent, i) => {
  const ax = agentStartX + i * (agentCardW + agentGap);
  const box = rect({ x: ax, y: agentY, w: agentCardW, h: agentCardH, bg: agent.bg, stroke: "#495057", strokeWidth: 1, label: `${agent.name}\n${agent.desc}`, fontSize: 16 });
  elements.push(...box.els);
  agentBoxIds.push({ id: box.id, cx: ax + agentCardW / 2 });
});

// Arrows Orchestrator → each agent
agentBoxIds.forEach(({ id: agentId, cx }) => {
  const a = arrow({ startId: orchBox.id, endId: agentId, startX: P1X + 810, startY: P1Y + 310, endX: cx, endY: agentY });
  elements.push(...a.els);
});

// ============================================
// PANEL 2: What You Can Use It For (top-right)
// ============================================
const P2X = 2000, P2Y = 50;

elements.push(...text({ x: P2X, y: P2Y, w: 1700, content: "What You Can Use It For", fontSize: 36, color: "#000000" }).els);

// Spectrum line
elements.push({
  id: id(),
  type: "line",
  x: P2X + 80, y: P2Y + 120,
  width: 1540, height: 0,
  angle: 0,
  strokeColor: "#dee2e6",
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 4,
  roughness: 0,
  opacity: 100,
  groupIds: [],
  frameId: null,
  roundness: null,
  seed: Math.floor(Math.random() * 2e9),
  version: 1, versionNonce: Math.floor(Math.random() * 2e9),
  isDeleted: false,
  points: [[0, 0], [1540, 0]],
  lastCommittedPoint: null,
  startArrowhead: null,
  endArrowhead: null,
});

// Spectrum labels
elements.push(...text({ x: P2X + 80, y: P2Y + 90, w: 200, content: "Small", fontSize: 14, color: "#868e96", align: "left" }).els);
elements.push(...text({ x: P2X + 1420, y: P2Y + 90, w: 200, content: "Big", fontSize: 14, color: "#868e96", align: "right" }).els);

// Use case cards along the spectrum
const useCases = [
  { title: "Fix a bug or\ntweak something", desc: "Describe the issue,\nteam diagnoses and fixes it", x: 0 },
  { title: "Add a small\nfeature", desc: "A new button, a new screen,\na small enhancement", x: 1 },
  { title: "Build a new\nmodule", desc: "Auth, payments, notifications\n— fully specced and built", x: 2 },
  { title: "Explore a\nbusiness problem", desc: "Start with a question,\nnot a solution", x: 3 },
  { title: "Redesign or\nrevamp", desc: "Rethink how something\nworks — new UX, new arch", x: 4 },
  { title: "Start a whole\nnew product", desc: "From zero to shipped MVP.\nStrategy, specs, design, code.", x: 5 },
];

const ucCardW = 240, ucGap = 20;
const ucRowW = useCases.length * ucCardW + (useCases.length - 1) * ucGap;
const ucStartX = P2X + (1700 - ucRowW) / 2;

useCases.forEach((uc, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  const cx = ucStartX + col * (ucCardW + 40 + (row * 80));
  const cy = P2Y + 160 + row * 260;

  // Gradient from light to bolder colors
  const colors = ["#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#868e96"];

  const box = rect({ x: cx + row * 240, y: cy, w: ucCardW + 20, h: 200, bg: colors[i], stroke: "#495057", strokeWidth: 1, label: `${uc.title}\n\n${uc.desc}`, fontSize: 15 });
  elements.push(...box.els);
});

// Subtitle
elements.push(...text({ x: P2X + 200, y: P2Y + 730, w: 1300, content: "Start anywhere. The team adapts to the size of what you need.", fontSize: 18, color: "#495057" }).els);

// ============================================
// PANEL 3: From Idea to Shipped Product (middle-left)
// ============================================
const P3X = 50, P3Y = 1000;

elements.push(...text({ x: P3X, y: P3Y, w: 1700, content: "From Idea to Shipped Product", fontSize: 36, color: "#000000" }).els);

const steps = [
  { title: "Describe\nyour idea", desc: "Just say what you\nwant in plain English", bg: "#e7f5ff" },
  { title: "Team explores\n& discusses", desc: "Agents ask questions,\nresearch options", bg: "#dbe4ff" },
  { title: "You review\ndesigns & specs", desc: "See prototypes, approve\nrequirements", bg: "#d0bfff" },
  { title: "Architecture\n& plan", desc: "Technical blueprint +\nordered tickets", bg: "#b2f2bb" },
  { title: "Code gets\nbuilt", desc: "Piece by piece, with\nmilestone check-ins", bg: "#ffd8a8" },
  { title: "Tested, documented,\ndone", desc: "QA verifies. Wikis updated.\nMission complete.", bg: "#ffec99" },
];

const stepW = 220, stepH = 160, stepGap = 40;
const stepRowW = steps.length * stepW + (steps.length - 1) * stepGap;
const stepStartX = P3X + (1700 - stepRowW) / 2;
const stepY = P3Y + 100;

const stepIds = [];
steps.forEach((step, i) => {
  const sx = stepStartX + i * (stepW + stepGap);
  const box = rect({ x: sx, y: stepY, w: stepW, h: stepH, bg: step.bg, stroke: "#495057", strokeWidth: 1, label: `${step.title}\n\n${step.desc}`, fontSize: 14 });
  elements.push(...box.els);
  stepIds.push({ id: box.id, cx: sx + stepW / 2, x: sx });
});

// Arrows between steps
for (let i = 0; i < stepIds.length - 1; i++) {
  const fromX = stepIds[i].x + stepW;
  const toX = stepIds[i + 1].x;
  const midY = stepY + stepH / 2;
  const a = arrow({ startId: stepIds[i].id, endId: stepIds[i + 1].id, startX: fromX, startY: midY, endX: toX, endY: midY });
  elements.push(...a.els);
}

// Step numbers
steps.forEach((_, i) => {
  const sx = stepStartX + i * (stepW + stepGap);
  elements.push(...text({ x: sx, y: stepY + stepH + 10, w: stepW, content: `Step ${i + 1}`, fontSize: 14, color: "#868e96" }).els);
});

// Second row: what the user experiences
const expY = stepY + stepH + 60;

const experiences = [
  "You talk naturally —\nno templates needed",
  "You join the\nconversation any time",
  "Nothing gets built\nwithout your sign-off",
  "You see what will be\nbuilt and in what order",
  "You test as things\ncome together",
  "Everything documented\nand ready to ship",
];

experiences.forEach((exp, i) => {
  const sx = stepStartX + i * (stepW + stepGap);
  const box = rect({ x: sx, y: expY, w: stepW, h: 80, bg: "#fff9db", stroke: "#fab005", strokeWidth: 1, label: exp, fontSize: 12 });
  elements.push(...box.els);
});

elements.push(...text({ x: P3X + 450, y: expY - 30, w: 800, content: "↑ What you experience at each stage ↑", fontSize: 14, color: "#fab005" }).els);

// ============================================
// PANEL 4: What You Get (middle-right)
// ============================================
const P4X = 2000, P4Y = 1000;

elements.push(...text({ x: P4X, y: P4Y, w: 1700, content: "What You Get", fontSize: 36, color: "#000000" }).els);

// Row 1: Planning phase
elements.push(...text({ x: P4X + 50, y: P4Y + 60, w: 400, content: "Planning Phase", fontSize: 20, color: "#495057", align: "left" }).els);

const deliverables1 = [
  { title: "Strategy Brief", desc: "Market context and\nproduct direction", bg: "#d0bfff" },
  { title: "Product Specs", desc: "Detailed requirements\nfor every feature", bg: "#a5d8ff" },
  { title: "UI Prototypes", desc: "HTML prototypes you can\nopen in your browser", bg: "#ffc9c9" },
  { title: "Architecture Plan", desc: "Technical blueprint —\ndata models, APIs", bg: "#b2f2bb" },
];

const delW = 360, delH = 130, delGap = 30;
const del1StartX = P4X + 50;
const del1Y = P4Y + 100;

deliverables1.forEach((del, i) => {
  const dx = del1StartX + (i % 4) * (delW + delGap);
  const box = rect({ x: dx, y: del1Y, w: delW, h: delH, bg: del.bg, stroke: "#495057", strokeWidth: 1, label: `${del.title}\n\n${del.desc}`, fontSize: 16 });
  elements.push(...box.els);
});

// Row 2: Building phase
elements.push(...text({ x: P4X + 50, y: P4Y + 280, w: 400, content: "Building Phase", fontSize: 20, color: "#495057", align: "left" }).els);

const deliverables2 = [
  { title: "Implementation\nTickets", desc: "Ordered build plan\nwith clear steps", bg: "#ffd8a8" },
  { title: "Working Code", desc: "Features implemented in\nyour actual codebase", bg: "#b2f2bb" },
  { title: "QA Reports", desc: "Test results and\nquality checks", bg: "#ffec99" },
  { title: "Living\nDocumentation", desc: "Product wiki + code wiki,\nalways current", bg: "#e7f5ff" },
];

const del2Y = P4Y + 320;

deliverables2.forEach((del, i) => {
  const dx = del1StartX + (i % 4) * (delW + delGap);
  const box = rect({ x: dx, y: del2Y, w: delW, h: delH, bg: del.bg, stroke: "#495057", strokeWidth: 1, label: `${del.title}\n\n${del.desc}`, fontSize: 16 });
  elements.push(...box.els);
});

// Subtitle
elements.push(...text({ x: P4X + 200, y: P4Y + 500, w: 1300, content: "Every deliverable is a real artifact in your project — not just a chat message.", fontSize: 18, color: "#495057" }).els);

// ============================================
// PANEL 5: Explore Before You Commit (bottom-left)
// ============================================
const P5X = 50, P5Y = 2000;

elements.push(...text({ x: P5X, y: P5Y, w: 1700, content: "Explore Before You Commit", fontSize: 36, color: "#000000" }).els);

// Flow: conversation → options → prototype → decide
const exploreSteps = [
  { title: "Start with a\nconversation", desc: "The orchestrator discusses\nyour idea with you before\nany agent is called", bg: "#e9ecef", icon: "💬" },
  { title: "See multiple\ndesign options", desc: "Designer creates HTML\nprototypes you can open\nand interact with", bg: "#ffc9c9", icon: "🎨" },
  { title: "Prototype before\nyou build", desc: "Review screens, flows, and\ninteractions before a single\nline of code is written", bg: "#dbe4ff", icon: "🖥️" },
  { title: "Change direction\neasily", desc: "Early exploration is cheap.\nPivot, refine, or scrap\nbefore committing.", bg: "#d8f5a2", icon: "🔄" },
];

const expStepW = 350, expStepH = 180, expStepGap = 40;
const expRowW = exploreSteps.length * expStepW + (exploreSteps.length - 1) * expStepGap;
const expStepStartX = P5X + (1700 - expRowW) / 2;
const expStepY = P5Y + 100;

const expStepIds = [];
exploreSteps.forEach((step, i) => {
  const sx = expStepStartX + i * (expStepW + expStepGap);
  const box = rect({ x: sx, y: expStepY, w: expStepW, h: expStepH, bg: step.bg, stroke: "#495057", strokeWidth: 1, label: `${step.title}\n\n${step.desc}`, fontSize: 15 });
  elements.push(...box.els);
  expStepIds.push({ id: box.id, x: sx });
});

// Arrows between explore steps
for (let i = 0; i < expStepIds.length - 1; i++) {
  const fromX = expStepIds[i].x + expStepW;
  const toX = expStepIds[i + 1].x;
  const midY = expStepY + expStepH / 2;
  const a = arrow({ startId: expStepIds[i].id, endId: expStepIds[i + 1].id, startX: fromX, startY: midY, endX: toX, endY: midY });
  elements.push(...a.els);
}

// Branching visual: small diamond showing "multiple paths"
const diamondX = expStepStartX + expStepW + expStepGap / 2;
const diamondY = expStepY + expStepH + 40;

// Three small path indicators
const pathLabels = ["Option A", "Option B", "Option C"];
pathLabels.forEach((label, i) => {
  const px = P5X + 200 + i * 500;
  const py = expStepY + expStepH + 50;
  const box = rect({ x: px, y: py, w: 250, h: 50, bg: i === 0 ? "#ffc9c9" : i === 1 ? "#a5d8ff" : "#b2f2bb", stroke: "#adb5bd", strokeWidth: 1, label: label, fontSize: 14 });
  elements.push(...box.els);
});

// Converge arrow label
elements.push(...text({ x: P5X + 700, y: expStepY + expStepH + 110, w: 300, content: "→ You pick the best path →", fontSize: 14, color: "#495057" }).els);

// Subtitle
elements.push(...text({ x: P5X + 200, y: P5Y + 740, w: 1300, content: "The team thinks first, builds second. You explore ideas safely before committing.", fontSize: 18, color: "#495057" }).els);

// ============================================
// PANEL 6: You're Always in Control (bottom-right)
// ============================================
const P6X = 2000, P6Y = 2000;

elements.push(...text({ x: P6X, y: P6Y, w: 1700, content: "You're Always in Control", fontSize: 36, color: "#000000" }).els);

// Three control level cards
const controlLevels = [
  { title: "Hands-On", badge: "Default", desc: "See everything. Approve every\nagent's plan before they work.\nReview designs, specs, and\ncode at every step.", bg: "#e7f5ff", stroke: "#228be6", strokeWidth: 3 },
  { title: "Guided", badge: "", desc: "Major decisions and transitions.\nAgents work more independently\nbetween checkpoints.", bg: "#f1f3f5", stroke: "#495057", strokeWidth: 1 },
  { title: "Autonomous", badge: "", desc: "Team runs the full pipeline.\nYou review the final output.", bg: "#f1f3f5", stroke: "#495057", strokeWidth: 1 },
];

const ctrlW = 480, ctrlH = 180, ctrlGap = 40;
const ctrlStartX = P6X + (1700 - (3 * ctrlW + 2 * ctrlGap)) / 2;
const ctrlY = P6Y + 80;

controlLevels.forEach((level, i) => {
  const cx = ctrlStartX + i * (ctrlW + ctrlGap);
  const titleLabel = level.badge ? `${level.title}  ← Default` : level.title;
  const box = rect({ x: cx, y: ctrlY, w: ctrlW, h: ctrlH, bg: level.bg, stroke: level.stroke, strokeWidth: level.strokeWidth, label: `${titleLabel}\n\n${level.desc}`, fontSize: 16 });
  elements.push(...box.els);
});

// Control moments
elements.push(...text({ x: P6X + 100, y: ctrlY + ctrlH + 40, w: 1500, content: "What control looks like in practice:", fontSize: 20, color: "#000000", align: "left" }).els);

const controlMoments = [
  "Every agent shows you a plan before doing any work",
  "You approve prototypes before architecture starts",
  "You test code at milestones during the build",
];

controlMoments.forEach((moment, i) => {
  const my = ctrlY + ctrlH + 80 + i * 60;
  const box = rect({ x: P6X + 100, y: my, w: 1500, h: 45, bg: "#fff9db", stroke: "#fab005", strokeWidth: 1, label: `✓  ${moment}`, fontSize: 16, textAlign: "left" });
  elements.push(...box.els);
});

// Subtitle
elements.push(...text({ x: P6X + 200, y: P6Y + 730, w: 1300, content: "Switch anytime. Start hands-on, go autonomous when you trust the flow.", fontSize: 18, color: "#495057" }).els);

// ============================================
// Panel border separators (subtle)
// ============================================
// Horizontal lines
[950, 1950].forEach(y => {
  elements.push({
    id: id(),
    type: "line",
    x: 20, y,
    width: 3760, height: 0,
    angle: 0,
    strokeColor: "#e9ecef",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    roughness: 0,
    opacity: 60,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 2e9),
    version: 1, versionNonce: Math.floor(Math.random() * 2e9),
    isDeleted: false,
    points: [[0, 0], [3760, 0]],
    lastCommittedPoint: null,
    startArrowhead: null,
    endArrowhead: null,
  });
});

// Vertical line
[1900].forEach(x => {
  [50, 1000, 2000].forEach(startY => {
    elements.push({
      id: id(),
      type: "line",
      x, y: startY,
      width: 0, height: 850,
      angle: 0,
      strokeColor: "#e9ecef",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 0,
      opacity: 60,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 2e9),
      version: 1, versionNonce: Math.floor(Math.random() * 2e9),
      isDeleted: false,
      points: [[0, 0], [0, 850]],
      lastCommittedPoint: null,
      startArrowhead: null,
      endArrowhead: null,
    });
  });
});

// ============================================
// Build arrow boundElements
// ============================================
// We need to patch rectangle elements to include arrow references in boundElements
const arrowElements = elements.filter(e => e.type === "arrow");
const rectElements = elements.filter(e => e.type === "rectangle");

arrowElements.forEach(arrowEl => {
  if (arrowEl.startBinding) {
    const target = rectElements.find(r => r.id === arrowEl.startBinding.elementId);
    if (target) {
      if (!target.boundElements) target.boundElements = [];
      target.boundElements.push({ id: arrowEl.id, type: "arrow" });
    }
  }
  if (arrowEl.endBinding) {
    const target = rectElements.find(r => r.id === arrowEl.endBinding.elementId);
    if (target) {
      if (!target.boundElements) target.boundElements = [];
      target.boundElements.push({ id: arrowEl.id, type: "arrow" });
    }
  }
});

// ============================================
// Output
// ============================================
const excalidraw = {
  type: "excalidraw",
  version: 2,
  source: "claude-supabuilder",
  elements,
  appState: {
    gridSize: null,
    viewBackgroundColor: "#ffffff",
  },
  files: {},
};

const fs = await import("fs");
fs.writeFileSync(
  new URL("./supabuilder-explainer.excalidraw", import.meta.url),
  JSON.stringify(excalidraw, null, 2)
);

console.log(`Generated ${elements.length} elements`);
console.log("Written to planning/supabuilder-explainer.excalidraw");
