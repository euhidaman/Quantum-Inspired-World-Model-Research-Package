(() => {
  "use strict";

  const root = document.getElementById("quantumRoomLab");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const canvas = $("#roomCanvas");
  const ctx = canvas.getContext("2d");

  const state = {
    method: "current",
    time: 0,
    playing: false,
    evidence: "none",
    action: "wait",
    horizon: 4,
    methodValue: 60,
    selected: "cart",
    yaw: 0.62,
    pitch: 0.28,
    radius: 14,
    dragging: false,
    dragX: 0,
    dragY: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    lastFrame: performance.now(),
    hitRegions: [],
    frameRequested: false
  };

  const methodCopy = {
    current: {
      title: "Current compact / factorized baseline",
      summary: "A simplified baseline compresses the room into one state and predicts one main future.",
      control: "Baseline uncertainty",
      controlHelp: "Higher values widen the single uncertainty ribbon; they do not create separate linked futures.",
      formula: "z<sub>t+1</sub> ∼ p<sub>θ</sub>(z<sub>t+1</sub> | z<sub>t</sub>, a<sub>t</sub>)",
      meaning: "The model updates one compact hidden state after an action.",
      changeTitle: "The baseline keeps one compressed scene estimate.",
      changeText: "When two routes are plausible, a compact prediction may become broad or settle on one route. This is only a teaching baseline: modern stochastic and diffusion world models can also represent multiple futures.",
      caveat: "This is not every current world model. Stochastic RSSMs, mixture models, and latent diffusion can also preserve multiple futures. The comparison isolates a common compact or factorized baseline."
    },
    qlc: {
      title: "Quantum-inspired density-matrix core",
      summary: "One matrix stores probabilities and additional relations between alternatives. It is ordinary numerical computation—not quantum hardware.",
      control: "Coherence retained",
      controlHelp: "This changes the illustrative off-diagonal term. It matters only if learned dynamics and read-outs can use it.",
      formula: "ρ′ = ∑<sub>k</sub>K<sub>k</sub>ρK<sub>k</sub><sup>†</sup>, &nbsp; ∑<sub>k</sub>K<sub>k</sub><sup>†</sup>K<sub>k</sub> = I",
      meaning: "A valid matrix update preserves positivity and total probability. A read-out uses p(y) = Tr(Eᵧρ).",
      changeTitle: "One joint belief keeps two room alternatives related.",
      changeText: "The transparent room states are decoded alternatives—not particles. The density matrix can carry d²−1 real degrees of freedom at nominal dimension d, but those extra values help only when the model learns to use them.",
      caveat: "No qubits or speed-up are claimed. A matched-size ordinary vector can have the same parameter count. Trace one also means changing object count is not represented natively."
    },
    psc: {
      title: "Purified Slot Core (PSC)",
      summary: "Object slots are joined by a compressed relationship structure, so the person, cart, and route can remain linked.",
      control: "Relationship capacity χ",
      controlHelp: "Larger χ lets the tensor network retain richer cross-object dependence, with higher memory and compute cost.",
      formula: "ρ = Tr<sub>anc</sub>(|X⟩⟨X|) / ⟨X|X⟩",
      meaning: "A larger pure state is compressed, then the auxiliary part is ignored to obtain a valid mixed state.",
      changeTitle: "The slots remember which facts belong together.",
      changeText: "Lines in the room show retained dependencies: the technician moves with the cart, the divider causes occlusion, and an exit sensor supports one route. χ controls compression capacity—not a literal number of relationships.",
      caveat: "PSC represents a restricted tensor-network family, not every possible density matrix. Larger χ increases cost and does not guarantee better prediction."
    },
    tec: {
      title: "Trajectory Ensemble Core (TEC)",
      summary: "Several complete future room trajectories remain separate instead of being reduced immediately to one average.",
      control: "Number of future branches",
      controlHelp: "The slider keeps between two and six complete trajectory hypotheses. More branches cost more compute.",
      formula: "μ = ∑<sub>m</sub>w<sub>m</sub>δ<sub>[ψₘ]</sub>, &nbsp; ρ = ∑<sub>m</sub>w<sub>m</sub>|ψ<sub>m</sub>⟩⟨ψ<sub>m</sub>|",
      meaning: "TEC keeps the weighted branch description μ instead of retaining only its average density matrix ρ.",
      changeTitle: "Each ribbon is a complete, internally consistent future.",
      changeText: "The technician and cart stay together inside each branch. New evidence changes branch weights, while the planner can compare what the robot would observe after different actions.",
      caveat: "Different ensembles can produce the same density matrix. TEC adds testable value only if branch-conditioned dynamics or read-outs make that extra description operationally identifiable."
    }
  };

  const objectCopy = {
    cart: { name: "Rolling cart" },
    technician: { name: "Technician" },
    robot: { name: "Service robot" },
    divider: { name: "Opaque divider" }
  };

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const vSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const vDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vCross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const vNorm = (a) => {
    const n = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / n, a[1] / n, a[2] / n];
  };

  function parseColor(value) {
    const numbers = String(value).match(/[\d.]+/g);
    if (String(value).startsWith("#")) {
      const hex = value.slice(1);
      const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
      return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
    }
    return numbers ? numbers.slice(0, 3).map(Number) : [40, 40, 40];
  }

  function rgba(color, alpha) {
    const [r, g, b] = parseColor(color);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function mix(a, b, amount) {
    const ca = parseColor(a);
    const cb = parseColor(b);
    const out = ca.map((value, index) => Math.round(lerp(value, cb[index], amount)));
    return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
  }

  function palette() {
    const scene = $(".scene-wrap");
    const primaryButton = $("#playButton");
    const seriesTwo = $(".legend-solid");
    const computedRoot = getComputedStyle(root);
    return {
      bg: getComputedStyle(scene).backgroundColor,
      fg: computedRoot.color,
      muted: getComputedStyle($("#methodSummary")).color,
      border: getComputedStyle(scene).borderTopColor,
      primary: getComputedStyle(primaryButton).backgroundColor,
      secondary: getComputedStyle(seriesTwo).backgroundColor
    };
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(300, Math.round(rect.height));
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { width, height };
  }

  function camera(width, height) {
    const y = 5.6 + state.pitch * 4.2;
    const position = [Math.sin(state.yaw) * state.radius, y, Math.cos(state.yaw) * state.radius];
    const target = [0, 0.85, -0.2];
    const forward = vNorm(vSub(target, position));
    const right = vNorm(vCross(forward, [0, 1, 0]));
    const up = vCross(right, forward);
    return { position, forward, right, up, cx: width * 0.5, cy: height * 0.53, focal: Math.min(width, height) * 1.12 };
  }

  function project(point, cam) {
    const relative = vSub(point, cam.position);
    const depth = vDot(relative, cam.forward);
    if (depth <= 0.1) return null;
    const scale = cam.focal / depth;
    return { x: cam.cx + vDot(relative, cam.right) * scale, y: cam.cy - vDot(relative, cam.up) * scale, depth, scale };
  }

  function polygon(points, cam, fill, stroke, alpha = 1) {
    const projected = points.map((point) => project(point, cam));
    if (projected.some((point) => !point)) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    ctx.restore();
  }

  function cuboid(center, size, cam, fill, stroke, alpha = 1) {
    const [cx, cy, cz] = center;
    const [sx, sy, sz] = size.map((value) => value / 2);
    const vertices = [
      [cx - sx, cy - sy, cz - sz], [cx + sx, cy - sy, cz - sz],
      [cx + sx, cy - sy, cz + sz], [cx - sx, cy - sy, cz + sz],
      [cx - sx, cy + sy, cz - sz], [cx + sx, cy + sy, cz - sz],
      [cx + sx, cy + sy, cz + sz], [cx - sx, cy + sy, cz + sz]
    ];
    const faceIndices = [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 6, 7]];
    const faces = faceIndices.map((indices) => {
      const points = indices.map((index) => vertices[index]);
      const depth = points.reduce((sum, point) => sum + project(point, cam).depth, 0) / points.length;
      return { points, depth };
    }).sort((a, b) => b.depth - a.depth);
    faces.forEach((face, index) => polygon(face.points, cam, mix(fill, index === 4 ? "rgb(255,255,255)" : "rgb(0,0,0)", index === 4 ? 0.09 : 0.035), stroke, alpha));
  }

  function line3D(points, cam, color, width = 2, alpha = 1, dash = []) {
    const projected = points.map((point) => project(point, cam)).filter(Boolean);
    if (projected.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
  }

  function quadraticPath(start, control, end, y = 0.07, count = 30) {
    const points = [];
    for (let index = 0; index <= count; index += 1) {
      const t = index / count;
      const mt = 1 - t;
      points.push([
        mt * mt * start[0] + 2 * mt * t * control[0] + t * t * end[0],
        y,
        mt * mt * start[1] + 2 * mt * t * control[1] + t * t * end[1]
      ]);
    }
    return points;
  }

  function textLabel(text, point, cam, colors, options = {}) {
    const p = project(point, cam);
    if (!p) return;
    ctx.save();
    ctx.font = `${options.weight || 600} ${options.size || 12}px "Segoe UI", Arial, sans-serif`;
    const width = ctx.measureText(text).width + 14;
    const x = p.x - width / 2;
    const y = p.y - (options.offsetY || 0);
    ctx.fillStyle = rgba(colors.bg, options.backgroundAlpha || 0.9);
    ctx.fillRect(x, y - 16, width, 22);
    ctx.fillStyle = options.color || colors.fg;
    ctx.textAlign = "center";
    ctx.fillText(text, p.x, y);
    ctx.restore();
  }

  function drawPerson(position, cam, colors, alpha = 1, dashed = false, label = "Technician") {
    const [x, , z] = position;
    const foot = project([x, 0.02, z], cam);
    const hip = project([x, 0.82, z], cam);
    const shoulder = project([x, 1.48, z], cam);
    const head = project([x, 1.77, z], cam);
    if (!foot || !hip || !shoulder || !head) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colors.secondary;
    ctx.fillStyle = rgba(colors.secondary, dashed ? 0.08 : 0.18);
    ctx.lineWidth = Math.max(2, head.scale * 0.045);
    ctx.setLineDash(dashed ? [6, 5] : []);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.lineTo(hip.x, hip.y);
    ctx.lineTo(foot.x - 7, foot.y);
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(foot.x + 7, foot.y);
    ctx.moveTo(shoulder.x - 11, shoulder.y + 8);
    ctx.lineTo(shoulder.x + 10, shoulder.y + 17);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x, head.y, Math.max(4, head.scale * 0.11), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    state.hitRegions.push({ object: "technician", x: shoulder.x, y: shoulder.y, radius: 26 });
    if (!dashed && alpha > 0.8) textLabel(label, [x, 2.02, z], cam, colors, { size: 11, offsetY: 2 });
  }

  function drawCart(position, cam, colors, alpha = 1, dashed = false, label = "Rolling cart") {
    const [x, , z] = position;
    const frameColor = colors.primary;
    cuboid([x, 0.55, z], [0.9, 0.68, 0.58], cam, mix(colors.bg, frameColor, 0.13), frameColor, alpha * (dashed ? 0.28 : 0.82));
    line3D([[x + 0.38, 0.7, z + 0.25], [x + 0.55, 1.1, z + 0.34]], cam, frameColor, 2, alpha, dashed ? [5, 4] : []);
    const wheels = [[x - 0.3, 0.12, z - 0.22], [x + 0.3, 0.12, z - 0.22], [x - 0.3, 0.12, z + 0.22], [x + 0.3, 0.12, z + 0.22]];
    wheels.forEach((wheel) => {
      const p = project(wheel, cam);
      if (!p) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash(dashed ? [3, 3] : []);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, Math.max(2.5, p.scale * 0.07), Math.max(1.5, p.scale * 0.035), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
    const center = project([x, 0.58, z], cam);
    if (center) state.hitRegions.push({ object: "cart", x: center.x, y: center.y, radius: 34 });
    if (!dashed && alpha > 0.8) textLabel(label, [x, 1.42, z], cam, colors, { size: 11 });
  }

  function drawRobot(position, cam, colors) {
    const [x, , z] = position;
    cuboid([x, 0.42, z], [0.78, 0.7, 0.82], cam, mix(colors.bg, colors.secondary, 0.26), colors.secondary, 1);
    cuboid([x, 0.94, z], [0.52, 0.34, 0.52], cam, mix(colors.bg, colors.secondary, 0.12), colors.secondary, 1);
    const eye = project([x, 1.02, z + 0.28], cam);
    if (eye) {
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(eye.x, eye.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      state.hitRegions.push({ object: "robot", x: eye.x, y: eye.y, radius: 35 });
    }
    textLabel("Service robot", [x, 1.55, z], cam, colors, { size: 11 });
  }

  function evidenceBranch() {
    if (state.evidence.endsWith("left")) return "left";
    return "right";
  }

  function probabilities() {
    let left = 0.5;
    if (state.evidence === "audio-left") left = 0.72;
    if (state.evidence === "audio-right") left = 0.28;
    if (state.evidence === "door-left") left = 0.88;
    if (state.evidence === "door-right") left = 0.12;
    if (state.time > 0.84) left = evidenceBranch() === "left" ? 0.98 : 0.02;
    return { left, right: 1 - left };
  }

  function physicalPosition(time, branch) {
    const start = [-2.8, 1.55];
    const hidden = [-0.15, 0.25];
    const side = branch === "left" ? [-1.65, -0.72] : [1.65, -0.72];
    const end = branch === "left" ? [-3.25, -2.35] : [3.25, -2.35];
    if (time < 0.34) {
      const t = time / 0.34;
      return [lerp(start[0], hidden[0], t), 0, lerp(start[1], hidden[1], t)];
    }
    if (time < 0.72) {
      const t = (time - 0.34) / 0.38;
      return [lerp(hidden[0], side[0], t), 0, lerp(hidden[1], side[1], t)];
    }
    const t = clamp((time - 0.72) / 0.28);
    return [lerp(side[0], end[0], t), 0, lerp(side[1], end[1], t)];
  }

  function routeDefinitions() {
    return {
      start: [-0.15, 0.25],
      leftControl: [-1.6, -0.15],
      rightControl: [1.6, -0.15],
      leftEnd: [-3.25, -2.35],
      rightEnd: [3.25, -2.35]
    };
  }

  function drawRoomBase(cam, colors) {
    polygon([[-5, 0, 4], [5, 0, 4], [5, 0, -4], [-5, 0, -4]], cam, mix(colors.bg, colors.secondary, 0.035), colors.border);
    polygon([[-5, 0, -4], [5, 0, -4], [5, 3.4, -4], [-5, 3.4, -4]], cam, mix(colors.bg, colors.secondary, 0.07), colors.border);
    polygon([[-5, 0, 4], [-5, 0, -4], [-5, 3.4, -4], [-5, 3.4, 4]], cam, mix(colors.bg, colors.secondary, 0.045), colors.border);

    for (let x = -4; x <= 4; x += 1) line3D([[x, 0.006, 4], [x, 0.006, -4]], cam, colors.border, 0.7, 0.48);
    for (let z = -3; z <= 3; z += 1) line3D([[-5, 0.006, z], [5, 0.006, z]], cam, colors.border, 0.7, 0.48);

    cuboid([-3.85, 0.42, -2.9], [1.35, 0.84, 1.35], cam, mix(colors.bg, colors.muted, 0.25), colors.border, 1);
    cuboid([3.9, 0.95, -2.85], [1.25, 1.9, 0.72], cam, mix(colors.bg, colors.secondary, 0.12), colors.border, 1);

    const doorColor = mix(colors.bg, colors.secondary, 0.12);
    polygon([[-4.3, 0, -3.98], [-2.6, 0, -3.98], [-2.6, 2.45, -3.98], [-4.3, 2.45, -3.98]], cam, doorColor, colors.secondary, 0.9);
    polygon([[2.6, 0, -3.98], [4.3, 0, -3.98], [4.3, 2.45, -3.98], [2.6, 2.45, -3.98]], cam, doorColor, colors.secondary, 0.9);
    textLabel("LEFT EXIT", [-3.45, 2.7, -3.94], cam, colors, { size: 10 });
    textLabel("RIGHT EXIT", [3.45, 2.7, -3.94], cam, colors, { size: 10 });
  }

  function drawAction(cam, colors) {
    const robot = [2.85, 0, 2.65];
    if (state.action === "wait") return;
    let target = [0.6, 0, 1.2];
    if (state.action === "inspect-left") target = [-2.0, 0, 0.75];
    if (state.action === "inspect-right") target = [2.0, 0, 0.75];
    const path = quadraticPath([robot[0], robot[2]], [1.8, 1.7], [target[0], target[2]], 0.04, 18);
    line3D(path, cam, colors.secondary, 3, 0.78, [8, 5]);
    textLabel("planned robot motion", [target[0], 0.18, target[2]], cam, colors, { size: 10, color: colors.secondary });
  }

  function drawPredictions(cam, colors) {
    if (state.time < 0.22) return;
    const probs = probabilities();
    const routes = routeDefinitions();
    const leftPath = quadraticPath(routes.start, routes.leftControl, routes.leftEnd);
    const rightPath = quadraticPath(routes.start, routes.rightControl, routes.rightEnd);
    const horizonAlpha = clamp(0.4 + state.horizon / 12, 0.45, 0.95);

    if (state.method === "current") {
      const averageX = lerp(routes.leftEnd[0], routes.rightEnd[0], probs.right);
      const averageControlX = lerp(routes.leftControl[0], routes.rightControl[0], probs.right);
      const averagePath = quadraticPath(routes.start, [averageControlX, -0.12], [averageX, -2.35]);
      const width = 10 + state.methodValue * 0.24;
      line3D(averagePath, cam, colors.secondary, width, 0.12 * horizonAlpha);
      line3D(averagePath, cam, colors.secondary, 3, 0.88 * horizonAlpha);
      textLabel(probs.left > 0.65 ? "one left prediction" : probs.right > 0.65 ? "one right prediction" : "one compromise prediction", [averageX, 0.3, -2.35], cam, colors, { size: 10, color: colors.secondary });
      return;
    }

    if (state.method === "qlc") {
      line3D(leftPath, cam, colors.secondary, 7, probs.left * 0.55 * horizonAlpha);
      line3D(rightPath, cam, colors.primary, 7, probs.right * 0.55 * horizonAlpha);
      line3D(leftPath, cam, colors.secondary, 2.2, Math.max(0.28, probs.left) * horizonAlpha);
      line3D(rightPath, cam, colors.primary, 2.2, Math.max(0.28, probs.right) * horizonAlpha);
      drawCart([routes.leftEnd[0], 0, routes.leftEnd[1]], cam, colors, 0.2 + probs.left * 0.58, true, "Alternative L");
      drawPerson([routes.leftEnd[0] + 0.72, 0, routes.leftEnd[1] + 0.15], cam, colors, 0.2 + probs.left * 0.58, true, "");
      drawCart([routes.rightEnd[0], 0, routes.rightEnd[1]], cam, colors, 0.2 + probs.right * 0.58, true, "Alternative R");
      drawPerson([routes.rightEnd[0] + 0.72, 0, routes.rightEnd[1] + 0.15], cam, colors, 0.2 + probs.right * 0.58, true, "");
      textLabel("linked alternative L", [routes.leftEnd[0], 1.55, routes.leftEnd[1]], cam, colors, { size: 10, color: colors.secondary });
      textLabel("linked alternative R", [routes.rightEnd[0], 1.55, routes.rightEnd[1]], cam, colors, { size: 10, color: colors.primary });
      return;
    }

    if (state.method === "psc") {
      const capacity = state.methodValue / 100;
      line3D(leftPath, cam, colors.secondary, 3.2, (0.3 + probs.left * 0.55) * horizonAlpha);
      line3D(rightPath, cam, colors.primary, 3.2, (0.3 + probs.right * 0.55) * horizonAlpha);
      const ends = [
        { cart: [routes.leftEnd[0], 0, routes.leftEnd[1]], person: [routes.leftEnd[0] + 0.72, 0, routes.leftEnd[1] + 0.15], probability: probs.left, color: colors.secondary },
        { cart: [routes.rightEnd[0], 0, routes.rightEnd[1]], person: [routes.rightEnd[0] + 0.72, 0, routes.rightEnd[1] + 0.15], probability: probs.right, color: colors.primary }
      ];
      ends.forEach((branch) => {
        const alpha = 0.22 + branch.probability * 0.5;
        drawCart(branch.cart, cam, colors, alpha, true, "");
        drawPerson(branch.person, cam, colors, alpha, true, "");
        line3D([[branch.cart[0], 1.15, branch.cart[2]], [branch.person[0], 1.15, branch.person[2]]], cam, branch.color, 1 + capacity * 3, 0.22 + capacity * 0.7, capacity < 0.35 ? [5, 5] : []);
      });
      line3D([[0, 1.35, 0.18], [routes.leftEnd[0], 1.35, routes.leftEnd[1]]], cam, colors.secondary, 1 + capacity * 2, 0.16 + capacity * probs.left * 0.62, [6, 4]);
      line3D([[0, 1.35, 0.18], [routes.rightEnd[0], 1.35, routes.rightEnd[1]]], cam, colors.primary, 1 + capacity * 2, 0.16 + capacity * probs.right * 0.62, [6, 4]);
      textLabel("person ↔ cart", [probs.left >= probs.right ? -2.85 : 3.55, 1.55, -2.15], cam, colors, { size: 10 });
      textLabel("occluded by divider", [0, 2.85, 0.18], cam, colors, { size: 10, color: colors.primary });
      return;
    }

    const branches = 2 + Math.round(state.methodValue / 25);
    for (let index = 0; index < branches; index += 1) {
      const rightBranch = index % 2 === 1;
      const baseEnd = rightBranch ? routes.rightEnd : routes.leftEnd;
      const baseControl = rightBranch ? routes.rightControl : routes.leftControl;
      const spreadIndex = Math.floor(index / 2);
      const zOffset = (spreadIndex - (branches > 4 ? 1 : 0.5)) * 0.18;
      const xOffset = (spreadIndex % 2 ? 0.18 : -0.12) * (rightBranch ? 1 : -1);
      const probability = (rightBranch ? probs.right : probs.left) / Math.ceil(branches / 2);
      const path = quadraticPath(routes.start, [baseControl[0] + xOffset, baseControl[1] + zOffset], [baseEnd[0] + xOffset * 2, baseEnd[1] + zOffset * 2]);
      const color = rightBranch ? colors.primary : colors.secondary;
      line3D(path, cam, color, index < 2 ? 4 : 2, clamp(0.2 + probability * branches * 0.5, 0.22, 0.82) * horizonAlpha, index >= 2 ? [5, 4] : []);
    }
    drawCart([routes.leftEnd[0], 0, routes.leftEnd[1]], cam, colors, 0.22 + probs.left * 0.48, true, "");
    drawPerson([routes.leftEnd[0] + 0.72, 0, routes.leftEnd[1] + 0.15], cam, colors, 0.22 + probs.left * 0.48, true, "");
    drawCart([routes.rightEnd[0], 0, routes.rightEnd[1]], cam, colors, 0.22 + probs.right * 0.48, true, "");
    drawPerson([routes.rightEnd[0] + 0.72, 0, routes.rightEnd[1] + 0.15], cam, colors, 0.22 + probs.right * 0.48, true, "");
    textLabel(`${branches} complete future branches`, [0, 2.9, -1.15], cam, colors, { size: 10, color: colors.primary });
  }

  function drawDivider(cam, colors) {
    const fill = mix(colors.bg, colors.fg, 0.22);
    cuboid([0, 1.35, 0.18], [2.35, 2.7, 0.34], cam, fill, mix(colors.fg, colors.bg, 0.45), 1);
    textLabel("OPAQUE DIVIDER", [0, 3.0, 0.18], cam, colors, { size: 10 });
    const center = project([0, 1.35, 0.18], cam);
    if (center) state.hitRegions.push({ object: "divider", x: center.x, y: center.y, radius: 62 });
  }

  function drawActualActors(cam, colors) {
    const branch = evidenceBranch();
    const cart = physicalPosition(state.time, branch);
    const person = [cart[0] - 0.72, 0, cart[2] + 0.22];
    const hidden = state.time >= 0.34 && state.time <= 0.72;
    if (!hidden) {
      drawCart(cart, cam, colors, 1, false);
      drawPerson(person, cam, colors, 1, false);
    } else {
      drawCart(cart, cam, colors, 0.28, true, "");
      drawPerson(person, cam, colors, 0.28, true, "");
    }
  }

  function drawRoom() {
    state.frameRequested = false;
    const { width, height } = resizeCanvas();
    const colors = palette();
    const cam = camera(width, height);
    state.hitRegions = [];
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);

    drawRoomBase(cam, colors);
    drawPredictions(cam, colors);
    drawAction(cam, colors);
    drawRobot([2.85, 0, 2.65], cam, colors);
    const actorsAreHidden = state.time >= 0.34 && state.time <= 0.72;
    if (actorsAreHidden) {
      drawDivider(cam, colors);
      drawActualActors(cam, colors);
    } else {
      drawActualActors(cam, colors);
      drawDivider(cam, colors);
    }

    ctx.save();
    ctx.fillStyle = colors.muted;
    ctx.font = "11px \"Segoe UI\", Arial, sans-serif";
    ctx.fillText("Drag to rotate the room", 14, 22);
    ctx.restore();
  }

  function phase() {
    if (state.time < 0.30) return { label: "Observed now", lead: "The cart and technician are visible.", detail: "The model can directly encode their position and motion." };
    if (state.time < 0.72) return { label: "Behind divider", lead: "The room is partly hidden.", detail: "Two reappearance routes remain possible." };
    if (state.time < 0.86) return { label: "Reappearing", lead: "A new observation arrives.", detail: "The latent state should update without losing object identity." };
    return { label: "Observed again", lead: "The route is now visible.", detail: "Compare the prediction with the observed outcome." };
  }

  function representationText() {
    if (state.method === "current") return "One compact estimate";
    if (state.method === "qlc") return "One joint density matrix";
    if (state.method === "psc") return "Linked object slots";
    return `${2 + Math.round(state.methodValue / 25)} complete branches`;
  }

  function statusText() {
    const hidden = state.time >= 0.30 && state.time < 0.72;
    if (!hidden) return phase();
    if (state.method === "current") return { label: "Behind divider", lead: "One compressed prediction remains.", detail: "Its broad ribbon is not the same as separate linked futures." };
    if (state.method === "qlc") return { label: "Behind divider", lead: "One joint matrix keeps both alternatives.", detail: "The translucent rooms are decoded possibilities, not particles." };
    if (state.method === "psc") return { label: "Behind divider", lead: "Person, cart, and route stay linked.", detail: "The χ setting controls how much dependence survives compression." };
    return { label: "Behind divider", lead: "Complete future trajectories stay separate.", detail: "Sensor evidence reweights branches without averaging their stories." };
  }

  function updateMatrix() {
    const probs = probabilities();
    const coherence = state.methodValue / 100;
    const offDiagonal = coherence * Math.sqrt(probs.left * probs.right);
    $("#m00").textContent = probs.left.toFixed(2);
    $("#m01").textContent = offDiagonal.toFixed(2);
    $("#m10").textContent = offDiagonal.toFixed(2);
    $("#m11").textContent = probs.right.toFixed(2);
  }

  function updateInspector() {
    const selected = state.selected;
    const hidden = state.time >= 0.34 && state.time <= 0.72;
    const probs = probabilities();
    $("#objectName").textContent = objectCopy[selected].name;
    let position = "Fixed in the room";
    let motion = "Stationary";
    let confidence = "High";
    let links = "Room geometry";

    if (selected === "cart" || selected === "technician") {
      position = hidden ? "Hidden behind the divider" : state.time < 0.34 ? "Visible, approaching divider" : "Visible near an exit";
      motion = selected === "cart" ? "Moving with technician" : "Walking with cart";
      confidence = hidden ? `${Math.round(Math.max(probs.left, probs.right) * 100)}% on the leading route` : "High from direct observation";
      if (state.method === "current") links = hidden ? "Not explicit in this baseline" : selected === "cart" ? "Technician, implicitly" : "Cart, implicitly";
      if (state.method === "qlc") links = "Joint left/right room alternatives";
      if (state.method === "psc") links = selected === "cart" ? "Technician, divider, exit sensor" : "Cart and route";
      if (state.method === "tec") links = "Complete future branch";
    }
    if (selected === "robot") {
      position = "Front-right observation point";
      motion = state.action === "wait" ? "Waiting" : $("#action").selectedOptions[0].textContent;
      confidence = "Uses the selected latent prediction";
      links = "Camera, action, planning head";
    }
    if (selected === "divider") {
      position = "Middle of the room";
      motion = "Stationary";
      confidence = "Known room geometry";
      links = "Occludes cart and technician";
    }
    $("#objectPosition").textContent = position;
    $("#objectMotion").textContent = motion;
    $("#objectConfidence").textContent = confidence;
    $("#objectLinks").textContent = links;
  }

  function updateUI() {
    const copy = methodCopy[state.method];
    const probs = probabilities();
    const currentStatus = statusText();
    $("#methodTitle").textContent = copy.title;
    $("#methodSummary").textContent = copy.summary;
    $("#methodControlLabel").textContent = copy.control;
    $("#methodControlHelp").textContent = copy.controlHelp;
    $("#mathFormula").innerHTML = copy.formula;
    $("#mathMeaning").textContent = copy.meaning;
    $("#changeTitle").textContent = copy.changeTitle;
    $("#changeText").textContent = copy.changeText;
    $("#caveatText").textContent = copy.caveat;
    $("#phaseBadge").textContent = currentStatus.label;
    $("#statusLead").textContent = currentStatus.lead;
    $("#statusDetail").textContent = currentStatus.detail;
    $("#timelineValue").textContent = `${(state.time * 8).toFixed(1)} s`;
    $("#horizonValue").textContent = `${state.horizon} s`;
    $("#leftProbability").textContent = `${Math.round(probs.left * 100)}%`;
    $("#rightProbability").textContent = `${Math.round(probs.right * 100)}%`;
    $("#representationReadout").textContent = representationText();
    $("#methodRangeValue").textContent = state.method === "tec" ? `${2 + Math.round(state.methodValue / 25)} branches` : state.method === "psc" ? `χ ≈ ${2 + Math.round(state.methodValue / 8)}` : `${state.methodValue}%`;
    $("#playButton").textContent = state.playing ? "Pause" : "Play";
    $("#playButton").setAttribute("aria-pressed", String(state.playing));
    $("#matrixMini").hidden = state.method !== "qlc";
    $$(".method-tab").forEach((button) => {
      const active = button.dataset.method === state.method;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateMatrix();
    updateInspector();
    requestDraw();
  }

  function requestDraw() {
    if (state.frameRequested) return;
    state.frameRequested = true;
    requestAnimationFrame(drawRoom);
  }

  $$(".method-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.method = button.dataset.method;
      state.methodValue = state.method === "tec" ? 25 : state.method === "psc" ? 56 : 60;
      $("#methodRange").value = String(state.methodValue);
      updateUI();
    });
  });

  $("#playButton").addEventListener("click", () => {
    state.playing = !state.playing;
    state.lastFrame = performance.now();
    updateUI();
  });

  $("#resetButton").addEventListener("click", () => {
    state.time = 0;
    state.playing = false;
    state.evidence = "none";
    state.action = "wait";
    state.horizon = 4;
    $("#timeline").value = "0";
    $("#evidence").value = "none";
    $("#action").value = "wait";
    $("#horizon").value = "4";
    updateUI();
  });

  $("#timeline").addEventListener("input", (event) => {
    state.time = Number(event.target.value) / 100;
    state.playing = false;
    updateUI();
  });
  $("#evidence").addEventListener("change", (event) => { state.evidence = event.target.value; updateUI(); });
  $("#action").addEventListener("change", (event) => { state.action = event.target.value; updateUI(); });
  $("#horizon").addEventListener("input", (event) => { state.horizon = Number(event.target.value); updateUI(); });
  $("#methodRange").addEventListener("input", (event) => { state.methodValue = Number(event.target.value); updateUI(); });

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    state.pointerStartX = event.clientX;
    state.pointerStartY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.dragX;
    const dy = event.clientY - state.dragY;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    state.yaw += dx * 0.008;
    state.pitch = clamp(state.pitch - dy * 0.004, -0.08, 0.62);
    requestDraw();
  });

  function finishPointer(event) {
    if (!state.dragging) return;
    state.dragging = false;
    if (Math.abs(event.clientX - state.pointerStartX) < 4 && Math.abs(event.clientY - state.pointerStartY) < 4) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let nearest = null;
      state.hitRegions.forEach((region) => {
        const distance = Math.hypot(x - region.x, y - region.y);
        if (distance <= region.radius && (!nearest || distance < nearest.distance)) nearest = { ...region, distance };
      });
      if (nearest) { state.selected = nearest.object; updateInspector(); }
    }
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  canvas.addEventListener("pointerup", finishPointer);
  canvas.addEventListener("pointercancel", finishPointer);
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    state.radius = clamp(state.radius + event.deltaY * 0.008, 10.5, 18);
    requestDraw();
  }, { passive: false });

  const resizeObserver = new ResizeObserver(requestDraw);
  resizeObserver.observe(canvas);

  function animate(now) {
    const delta = Math.min((now - state.lastFrame) / 1000, 0.05);
    state.lastFrame = now;
    if (state.playing) {
      state.time += delta / 8;
      if (state.time >= 1) { state.time = 1; state.playing = false; }
      $("#timeline").value = String(Math.round(state.time * 100));
      updateUI();
    }
    requestAnimationFrame(animate);
  }

  updateUI();
  requestAnimationFrame(animate);
})();

(() => {
  "use strict";

  const root = document.getElementById("latentGeometryLab");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const canvas = $("#latentGeometryCanvas");
  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const defaults = {
    current: { primary: 45, secondary: 35, option: true },
    qlc: { primary: 64, secondary: 32, option: true },
    psc: { primary: 48, secondary: 38, option: true },
    tec: { primary: 48, secondary: 64, option: true }
  };

  const copy = {
    current: {
      title: "Current world-model latent",
      badge: "Curved occupied region",
      summary: "The model stores one compact location in a high-dimensional space. Similar situations often occupy nearby parts of a learned curved region.",
      primaryLabel: "Prediction uncertainty",
      secondaryLabel: "State evolution",
      optionLabel: "Show ambient coordinate guide",
      formula: "z<sub>t</sub> ∈ ℝ<sup>d</sup>, &nbsp; z<sub>t+1</sub> ∼ p<sub>θ</sub>(z<sub>t+1</sub> | h<sub>t</sub>, z<sub>t</sub>, a<sub>t</sub>)",
      formulaMeaning: "The sheet is the region occupied by learned states inside a much larger coordinate space. Current models may use deterministic, Gaussian, categorical, token, or diffusion-style states.",
      explanationTitle: "A compact state on a learned manifold",
      explanation: "The surface groups similar room situations. The orange path shows how an action changes the state; the green band shows nearby uncertain predictions.",
      capacity: "A vector has d real coordinates. The useful geometry is learned from data and is not necessarily spherical.",
      statusLead: "One compact state moves along a learned surface.",
      statusDetail: "The surrounding band shows nearby uncertain predictions.",
      legend: ["Occupied manifold", "State trajectory", "Uncertainty region", "Ambient coordinates"],
      aria: "Interactive three-dimensional teaching projection of a current world-model latent manifold."
    },
    qlc: {
      title: "Quantum Latent Core geometry",
      badge: "Spectrum + basis directions",
      summary: "A density matrix is described by mixture weights and an eigenbasis. The extra directions show how alternatives are oriented and linked—not extra physical rooms.",
      primaryLabel: "Basis / coherence orientation",
      secondaryLabel: "Mixing toward the centre",
      optionLabel: "Show the eigenvalue spectrum floor",
      formula: "ρ = U diag(λ) U<sup>†</sup>, &nbsp; ρ ⪰ 0, &nbsp; Tr(ρ)=1<br>ρ′ = Σ<sub>k</sub>K<sub>k</sub>ρK<sub>k</sub><sup>†</sup>, &nbsp; Σ<sub>k</sub>K<sub>k</sub><sup>†</sup>K<sub>k</sub>=I<br>p(y)=Tr(E<sub>y</sub>ρ)",
      formulaMeaning: "The triangle is an illustrative three-eigenvalue spectrum. Curved lifted directions represent changes of eigenbasis and basis-dependent coherence. A Bloch ball is exact only for d=2; this d>2 view is a projection, not a sphere.",
      explanationTitle: "Not a larger sphere: a lifted matrix-state family",
      explanation: "Moving around a lifted ribbon can change future read-outs while keeping the same eigenvalues. Mixing moves the spectrum toward the centre; at the maximally mixed state, orientation no longer matters.",
      capacity: "For basis size d: a continuous vector has d coordinates, a categorical belief has d−1 degrees of freedom, and a full complex density-state family has d²−1. The matrix needs O(d²) storage; dense updates can cost more, and an equal-memory vector can store a comparable number of scalars.",
      statusLead: "The floor stores spectrum; the lifted direction stores orientation.",
      statusDetail: "Two states on the same orbit can share eigenvalues yet differ under a later read-out.",
      legend: ["Eigenvalue spectrum", "Basis/coherence orbit", "Current matrix state", "Same-spectrum guide"],
      aria: "Interactive three-dimensional teaching projection of density-matrix spectrum and eigenbasis geometry."
    },
    psc: {
      title: "Purified Slot Core geometry",
      badge: "Woven structured subset",
      summary: "PSC divides the scene into semantic factors and uses tensor-network bonds to preserve selected dependencies without storing one unrestricted global matrix.",
      primaryLabel: "Bond capacity χ",
      secondaryLabel: "Local state spread (illustrative)",
      optionLabel: "Show an evidence pulse",
      formula: "ρ = X X<sup>†</sup> / Tr(X X<sup>†</sup>), &nbsp; X = TN(A<sub>1</sub>, …, A<sub>L</sub>; χ, κ)",
      formulaMeaning: "Each ribbon is a projected local slot-state family. χ is the tensor-network bond dimension and κ controls local purification capacity. The strands depict retained statistical dependence, not physical forces or literal quantum entanglement in the room.",
      explanationTitle: "Local state surfaces woven by compressed correlations",
      explanation: "Evidence enters one semantic lane and can travel only through dependencies retained by the bonds. Increasing χ enriches this restricted family but also raises memory and contraction cost.",
      capacity: "χ is a compression and correlation-capacity control. It is not a literal count of relationships, and larger χ does not guarantee better prediction.",
      statusLead: "Four semantic state surfaces remain locally structured.",
      statusDetail: "Orange strands show which cross-slot dependencies survive compression.",
      legend: ["Local slot surface", "Retained bond", "Evidence flow", "Compressed family"],
      aria: "Interactive three-dimensional teaching projection of purified tensor-network slot geometry."
    },
    tec: {
      title: "Trajectory Ensemble Core geometry",
      badge: "Weighted complete futures",
      summary: "TEC keeps several complete state trajectories separate. Each ribbon represents one internally consistent possible history of the room.",
      primaryLabel: "Number of future branches",
      secondaryLabel: "Sensor evidence balance",
      optionLabel: "Show the projected ensemble mean",
      formula: "μ = Σ<sub>m</sub>w<sub>m</sub>δ<sub>[ψ<sub>m</sub>]</sub>, &nbsp; Σ<sub>m</sub>w<sub>m</sub>=1<br>ρ<sub>μ</sub> = Σ<sub>m</sub>w<sub>m</sub>|ψ<sub>m</sub>⟩⟨ψ<sub>m</sub>|",
      formulaMeaning: "The surface is a 3D projection of a projective state manifold; [ψ] identifies state vectors that differ only by global phase. The ribbons are branch-conditioned trajectories, and their widths show weights rather than physical size.",
      explanationTitle: "A shared past that separates into complete futures",
      explanation: "Evidence changes the branch weights while each future stays internally consistent. The dashed projected mean can pass between alternatives and lose their branch identity; it is not itself a pure-state trajectory.",
      capacity: "Many ensembles can produce the same density matrix. TEC adds value only when branch-aware dynamics or read-outs make branch identity operational.",
      statusLead: "One observed history separates into weighted future trajectories.",
      statusDetail: "Ribbon width is belief weight; the dashed line is an illustrative projection of their ensemble mean.",
      legend: ["Projective-state surface", "Complete future branch", "Branch weight", "Projected ensemble mean"],
      aria: "Interactive three-dimensional teaching projection of a weighted trajectory ensemble on a projective-state manifold."
    }
  };

  const state = {
    method: "current",
    primary: defaults.current.primary,
    secondary: defaults.current.secondary,
    option: defaults.current.option,
    phase: 0.18,
    playing: false,
    yaw: 0.7,
    pitch: 0.42,
    radius: 8.6,
    dragging: false,
    touchExplore: false,
    pointerX: 0,
    pointerY: 0,
    frameRequested: false,
    animationFrame: 0,
    lastTime: performance.now()
  };

  // Canvas labels are screen-space annotations. Keep them legible as the
  // projected geometry rotates instead of letting independent 3D anchors
  // collapse onto the same pixels.
  const labelLayout = { width: 0, height: 0, boxes: [] };

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, amount) => a + (b - a) * amount;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const scale = (a, amount) => [a[0] * amount, a[1] * amount, a[2] * amount];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => {
    const length = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / length, a[1] / length, a[2] / length];
  };

  function parseColor(value) {
    const text = String(value || "").trim();
    if (text.startsWith("#")) {
      const hex = text.slice(1);
      const full = hex.length === 3 ? hex.split("").map((character) => character + character).join("") : hex;
      return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
    }
    const values = text.match(/[\d.]+/g);
    return values ? values.slice(0, 3).map(Number) : [80, 80, 80];
  }

  function rgba(color, alpha) {
    const [red, green, blue] = parseColor(color);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function mix(colorA, colorB, amount) {
    const first = parseColor(colorA);
    const second = parseColor(colorB);
    const result = first.map((value, index) => Math.round(lerp(value, second[index], amount)));
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  }

  function palette() {
    const computed = getComputedStyle(root);
    return {
      bg: computed.getPropertyValue("--room-card").trim() || "#ffffff",
      page: computed.getPropertyValue("--room-bg").trim() || "#faf9f5",
      fg: computed.getPropertyValue("--room-fg").trim() || "#252525",
      muted: computed.getPropertyValue("--room-muted-fg").trim() || "#5d5b58",
      border: computed.getPropertyValue("--room-border").trim() || "#d6d1c8",
      primary: computed.getPropertyValue("--series-1").trim() || "#d24726",
      blue: computed.getPropertyValue("--series-2").trim() || "#2f6f9f",
      green: computed.getPropertyValue("--series-3").trim() || "#43845b",
      purple: computed.getPropertyValue("--series-4").trim() || "#7b5aa6"
    };
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(300, Math.round(rect.width));
    const height = Math.max(300, Math.round(rect.height));
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { width, height };
  }

  function camera(width, height) {
    const horizontal = Math.cos(state.pitch) * state.radius;
    const position = [Math.sin(state.yaw) * horizontal, Math.sin(state.pitch) * state.radius, Math.cos(state.yaw) * horizontal];
    const target = [0, 0, 0];
    const forward = norm(sub(target, position));
    const right = norm(cross(forward, [0, 1, 0]));
    const up = cross(right, forward);
    return { position, forward, right, up, cx: width * 0.5, cy: height * 0.5, focal: Math.min(width, height) * 1.22 };
  }

  function project(point, cam) {
    const relative = sub(point, cam.position);
    const depth = dot(relative, cam.forward);
    if (depth <= 0.12) return null;
    const perspective = cam.focal / depth;
    return {
      x: cam.cx + dot(relative, cam.right) * perspective,
      y: cam.cy - dot(relative, cam.up) * perspective,
      depth,
      perspective
    };
  }

  function polygon(projected, fill, stroke, alpha = 1, lineWidth = 1) {
    if (projected.some((point) => !point)) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    ctx.restore();
  }

  function line3D(points, cam, color, width = 2, alpha = 1, dash = []) {
    const projected = points.map((point) => project(point, cam)).filter(Boolean);
    if (projected.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
  }

  function label3D(text, point, cam, colors, options = {}) {
    const projected = project(point, cam);
    if (!projected) return;
    ctx.save();
    ctx.font = `${options.bold ? 600 : 400} ${options.size || 12}px "Segoe UI", Arial, sans-serif`;
    const width = ctx.measureText(text).width + 14;
    const height = 22;
    const preferredX = projected.x + (options.offsetX || 0);
    const preferredY = projected.y - (options.offsetY || 0);
    const overlaps = (box) => labelLayout.boxes.some((placed) => (
      box.x < placed.x + placed.width + 4 &&
      box.x + box.width + 4 > placed.x &&
      box.y < placed.y + placed.height + 3 &&
      box.y + box.height + 3 > placed.y
    ));
    const verticalCandidates = [0, -26, 26, -52, 52, -78, 78, -104, 104, -130, 130];
    const horizontalCandidates = [0, -30, 30, -60, 60];
    let selected = null;
    for (const verticalShift of verticalCandidates) {
      for (const horizontalShift of horizontalCandidates) {
        const centre = clamp(preferredX + horizontalShift, width / 2 + 5, labelLayout.width - width / 2 - 5);
        const baseline = clamp(preferredY + verticalShift, 34, labelLayout.height - 70);
        const candidate = { x: centre - width / 2, y: baseline - 16, width, height, centre, baseline };
        if (!overlaps(candidate)) { selected = candidate; break; }
      }
      if (selected) break;
    }
    if (!selected) {
      const centre = clamp(preferredX, width / 2 + 5, labelLayout.width - width / 2 - 5);
      const baseline = clamp(preferredY, 34, labelLayout.height - 70);
      selected = { x: centre - width / 2, y: baseline - 16, width, height, centre, baseline };
    }
    labelLayout.boxes.push(selected);
    ctx.fillStyle = rgba(colors.bg, 0.9);
    ctx.fillRect(selected.x, selected.y, width, height);
    ctx.fillStyle = options.color || colors.fg;
    ctx.textAlign = "center";
    ctx.fillText(text, selected.centre, selected.baseline);
    ctx.restore();
  }

  function marker(point, cam, color, radius = 6, alpha = 1, fill = false) {
    const projected = project(point, cam);
    if (!projected) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = fill ? color : rgba(color, 0.12);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawSurface(cam, colors, uSteps, vSteps, pointFunction, color, alpha = 0.42, wireAlpha = 0.12) {
    const cells = [];
    for (let uIndex = 0; uIndex < uSteps; uIndex += 1) {
      for (let vIndex = 0; vIndex < vSteps; vIndex += 1) {
        const u0 = uIndex / uSteps;
        const u1 = (uIndex + 1) / uSteps;
        const v0 = vIndex / vSteps;
        const v1 = (vIndex + 1) / vSteps;
        const world = [pointFunction(u0, v0), pointFunction(u1, v0), pointFunction(u1, v1), pointFunction(u0, v1)];
        const projected = world.map((point) => project(point, cam));
        if (projected.some((point) => !point)) continue;
        const depth = projected.reduce((sum, point) => sum + point.depth, 0) / projected.length;
        const normal = norm(cross(sub(world[1], world[0]), sub(world[3], world[0])));
        const light = clamp((dot(normal, norm([0.4, 0.9, 0.25])) + 1) / 2, 0, 1);
        cells.push({ projected, depth, light });
      }
    }
    cells.sort((first, second) => second.depth - first.depth);
    cells.forEach((cell) => {
      const fill = mix(color, colors.bg, 0.38 + (1 - cell.light) * 0.2);
      polygon(cell.projected, fill, rgba(color, wireAlpha), alpha, 0.7);
    });
  }

  function drawAxes(cam, colors, scaleValue = 2.9) {
    line3D([[-scaleValue, -1.55, 0], [scaleValue, -1.55, 0]], cam, colors.border, 1, 0.68, [4, 4]);
    line3D([[0, -1.55, -scaleValue], [0, -1.55, scaleValue]], cam, colors.border, 1, 0.68, [4, 4]);
    line3D([[0, -1.55, 0], [0, 1.9, 0]], cam, colors.border, 1, 0.68, [4, 4]);
    label3D("projected coordinate 1", [scaleValue, -1.55, 0], cam, colors, { size: 11, color: colors.muted });
    label3D("coordinate 2", [0, -1.55, scaleValue], cam, colors, { size: 11, color: colors.muted });
    label3D("coordinate 3", [0, 1.9, 0], cam, colors, { size: 11, color: colors.muted });
  }

  function currentPoint(u, v) {
    return [u, 0.48 * Math.sin(u * 0.86) + 0.15 * v * Math.cos(u * 0.64) + 0.11 * Math.sin(v * 1.8), v + 0.34 * Math.sin(u * 0.58)];
  }

  function drawCurrent(cam, colors) {
    if (state.option) drawAxes(cam, colors, 3.05);
    drawSurface(cam, colors, 22, 11, (u, v) => currentPoint(-2.65 + u * 5.3, -1.55 + v * 3.1), colors.blue, 0.42, 0.17);

    const evolution = state.playing ? state.phase : state.secondary / 100;
    const uncertainty = 0.1 + state.primary / 100 * 0.56;
    drawSurface(cam, colors, 34, 3, (time, across) => {
      const u = -2.25 + time * 4.5;
      const centreV = 0.26 * Math.sin(time * Math.PI * 3.1 + 0.3);
      const v = centreV + (across - 0.5) * uncertainty * 2;
      const point = currentPoint(u, v);
      return [point[0], point[1] + 0.045, point[2]];
    }, colors.green, 0.32, 0.08);

    const path = Array.from({ length: 58 }, (_, index) => {
      const time = index / 57;
      const u = -2.25 + time * 4.5;
      const v = 0.26 * Math.sin(time * Math.PI * 3.1 + 0.3);
      const point = currentPoint(u, v);
      return [point[0], point[1] + 0.075, point[2]];
    });
    line3D(path, cam, colors.primary, 3.2, 0.92);
    const statePoint = path[Math.round(evolution * (path.length - 1))];
    marker(statePoint, cam, colors.primary, 6.5, 1, true);
    label3D("current compact state", add(statePoint, [0, 0.46, 0]), cam, colors, { bold: true, color: colors.primary });
    label3D("learned occupied manifold", currentPoint(1.92, 1.18), cam, colors, { color: colors.blue });
  }

  function barycentric(vertices, weights) {
    return vertices.reduce((sum, vertex, index) => add(sum, scale(vertex, weights[index])), [0, 0, 0]);
  }

  function orbitPoint(base, angle, orbitScale) {
    return [
      base[0] + orbitScale * (0.78 * Math.cos(angle) + 0.16 * Math.cos(angle * 2)),
      base[1] + 0.28 + orbitScale * (0.72 + 0.2 * Math.sin(angle * 2)),
      base[2] + orbitScale * 0.62 * Math.sin(angle)
    ];
  }

  function drawTriangleGrid(vertices, cam, colors) {
    polygon(vertices.map((point) => project(point, cam)), rgba(colors.blue, 0.13), rgba(colors.blue, 0.5), 1, 1.2);
    for (let step = 1; step < 4; step += 1) {
      const amount = step / 4;
      line3D([
        barycentric(vertices, [amount, 1 - amount, 0]),
        barycentric(vertices, [amount, 0, 1 - amount])
      ], cam, colors.blue, 0.8, 0.28);
      line3D([
        barycentric(vertices, [1 - amount, amount, 0]),
        barycentric(vertices, [0, amount, 1 - amount])
      ], cam, colors.blue, 0.8, 0.28);
      line3D([
        barycentric(vertices, [1 - amount, 0, amount]),
        barycentric(vertices, [0, 1 - amount, amount])
      ], cam, colors.blue, 0.8, 0.28);
    }
  }

  function drawQlc(cam, colors) {
    const vertices = [[-2.2, -1.08, -1.25], [2.2, -1.08, -1.25], [0, -1.08, 1.9]];
    if (state.option) {
      drawTriangleGrid(vertices, cam, colors);
    }

    const faintSpectra = [[0.62, 0.25, 0.13], [0.18, 0.66, 0.16], [0.2, 0.2, 0.6]];
    faintSpectra.forEach((weights, index) => {
      const base = barycentric(vertices, weights);
      const purityScale = 0.38 + Math.max(...weights) * 0.48;
      const loop = Array.from({ length: 64 }, (_, step) => orbitPoint(base, step / 63 * Math.PI * 2, purityScale));
      line3D(loop, cam, index % 2 ? colors.purple : colors.green, 4.5, 0.16);
      line3D(loop, cam, index % 2 ? colors.purple : colors.green, 1.1, 0.4);
    });

    const mixing = state.secondary / 100;
    const spectrum = [
      lerp(0.76, 1 / 3, mixing),
      lerp(0.16, 1 / 3, mixing),
      lerp(0.08, 1 / 3, mixing)
    ];
    const base = barycentric(vertices, spectrum);
    const orbitScale = (1 - mixing) * 1.07;
    const loop = Array.from({ length: 84 }, (_, step) => orbitPoint(base, step / 83 * Math.PI * 2, orbitScale));
    line3D(loop, cam, colors.primary, 8, 0.17);
    line3D(loop, cam, colors.primary, 2.8, 0.92);

    const angle = (state.playing ? state.phase : state.primary / 100) * Math.PI * 2;
    const current = orbitPoint(base, angle, orbitScale);
    const sameSpectrum = orbitPoint(base, angle + Math.PI, orbitScale);
    line3D([base, current], cam, colors.muted, 1.2, 0.62, [5, 5]);
    line3D([base, sameSpectrum], cam, colors.muted, 1, 0.38, [4, 5]);
    marker(base, cam, colors.blue, 5.5, 0.9, false);
    marker(current, cam, colors.primary, 7, 1, true);
    if (orbitScale > 0.08) {
      marker(sameSpectrum, cam, colors.purple, 6, 0.72, false);
      label3D("current ρ", current, cam, colors, { color: colors.primary, bold: true, offsetX: -42, offsetY: 30 });
      label3D("same spectrum, different basis", sameSpectrum, cam, colors, { color: colors.purple, offsetX: 145, offsetY: -48 });
      label3D("basis / coherence orbit", loop[Math.floor(loop.length * 0.46)], cam, colors, { color: colors.primary, offsetX: 34, offsetY: -28 });
    } else {
      label3D("maximally mixed: orientation disappears", add(base, [0, 0.3, 0]), cam, colors, { color: colors.primary, bold: true });
    }
    // Keep spectrum annotations above the subsequently drawn orbit geometry and
    // let the shared screen-space label layout separate them after rotation.
    if (state.option) {
      label3D("illustrative eigenvalue spectrum λ", [0, -1.12, 2.08], cam, colors, { color: colors.blue, bold: true });
      label3D("more mixed", barycentric(vertices, [1 / 3, 1 / 3, 1 / 3]), cam, colors, { color: colors.muted, offsetY: -18 });
      label3D("pure-state spectrum", vertices[1], cam, colors, { color: colors.muted, offsetY: -12 });
    }
  }

  const laneNames = ["room / layout", "technician", "cart", "sensor / route"];

  function pscLanePoint(lane, time, across = 0, spread = 0.2) {
    const baseY = -1.02 + lane * 0.68;
    const phaseOffset = lane * 0.92;
    return [
      -2.7 + time * 5.4,
      baseY + 0.18 * Math.sin(time * Math.PI * 2 + phaseOffset) + across * 0.07,
      0.72 * Math.sin(time * Math.PI * 1.35 + phaseOffset) + across * spread
    ];
  }

  function quadraticCurve(start, control, end, count = 24) {
    return Array.from({ length: count }, (_, index) => {
      const time = index / (count - 1);
      const inverse = 1 - time;
      return [
        inverse * inverse * start[0] + 2 * inverse * time * control[0] + time * time * end[0],
        inverse * inverse * start[1] + 2 * inverse * time * control[1] + time * time * end[1],
        inverse * inverse * start[2] + 2 * inverse * time * control[2] + time * time * end[2]
      ];
    });
  }

  function drawPsc(cam, colors) {
    const laneColors = [colors.blue, colors.green, colors.primary, colors.purple];
    const spread = 0.11 + state.secondary / 100 * 0.34;
    for (let lane = 0; lane < 4; lane += 1) {
      drawSurface(cam, colors, 30, 2, (time, across) => pscLanePoint(lane, time, across * 2 - 1, spread), laneColors[lane], 0.39, 0.08);
      const centre = Array.from({ length: 48 }, (_, index) => pscLanePoint(lane, index / 47, 0, spread));
      line3D(centre, cam, laneColors[lane], 1.4, 0.78);
      label3D(laneNames[lane], add(pscLanePoint(lane, 0.03, 0, spread), [-0.18, 0.18, 0]), cam, colors, { color: laneColors[lane], bold: true });
    }

    const chi = 1 + Math.round(state.primary / 100 * 7);
    const pairs = [[3, 2], [2, 1], [1, 0], [3, 0]];
    const connectors = [];
    for (let index = 0; index < chi + 2; index += 1) {
      const pair = pairs[index % pairs.length];
      const time = 0.16 + index / Math.max(1, chi + 1) * 0.68;
      const start = pscLanePoint(pair[0], time, 0, spread);
      const end = pscLanePoint(pair[1], time + 0.035 * Math.sin(index), 0, spread);
      const control = [(start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 0.25, (start[2] + end[2]) / 2 + 0.24 * Math.cos(index)];
      const curve = quadraticCurve(start, control, end);
      connectors.push(curve);
      line3D(curve, cam, colors.primary, 1.4 + chi * 0.08, 0.3 + chi * 0.045);
    }

    if (state.option) {
      const pulseTime = state.playing ? state.phase : 0.32;
      const pulseStart = clamp(pulseTime * 1.12, 0, 0.92);
      const pulse = Array.from({ length: 12 }, (_, index) => pscLanePoint(3, clamp(pulseStart + index / 110, 0, 1), 0, spread));
      line3D(pulse, cam, colors.primary, 8, 0.18);
      line3D(pulse, cam, colors.primary, 3.4, 1);
      if (pulseTime > 0.48 && connectors.length) {
        const connector = connectors[Math.floor((pulseTime * connectors.length) % connectors.length)];
        line3D(connector, cam, colors.primary, 5.5, 0.85);
      }
      label3D("evidence pulse", add(pulse[Math.floor(pulse.length / 2)], [0, 0.3, 0]), cam, colors, { color: colors.primary, bold: true });
    }
    label3D(`χ = ${chi}: richer bond space`, [0.1, 1.75, -1.15], cam, colors, { color: colors.primary, bold: true });
  }

  function tecSurfacePoint(u, v) {
    const x = -2.7 + u * 5.4;
    const z = -1.7 + v * 3.4;
    const y = -0.55 + 0.28 * Math.sin(x * 0.78) + 0.12 * Math.cos(z * 1.2) + 0.06 * x * z;
    return [x, y, z];
  }

  function tecBranchPoint(branch, count, time) {
    const target = count === 1 ? 0 : -1 + branch * 2 / (count - 1);
    const split = clamp((time - 0.34) / 0.66, 0, 1);
    const eased = split * split * (3 - 2 * split);
    const x = -2.45 + time * 4.9;
    const z = 0.12 * Math.sin(time * Math.PI * 2) + target * 1.45 * eased;
    const u = clamp((x + 2.7) / 5.4, 0, 1);
    const v = clamp((z + 1.7) / 3.4, 0, 1);
    const base = tecSurfacePoint(u, v);
    return [base[0], base[1] + 0.09, base[2]];
  }

  function normalizedBranchWeights(count) {
    const evidence = state.secondary / 100 * 2 - 1;
    const raw = Array.from({ length: count }, (_, index) => {
      const target = count === 1 ? 0 : -1 + index * 2 / (count - 1);
      return 0.12 + Math.exp(-Math.pow(target - evidence, 2) / 0.34);
    });
    const total = raw.reduce((sum, value) => sum + value, 0);
    return raw.map((value) => value / total);
  }

  function drawTec(cam, colors) {
    drawSurface(cam, colors, 22, 10, (u, v) => tecSurfacePoint(u, v), colors.purple, 0.28, 0.11);
    const count = 2 + Math.round(state.primary / 100 * 4);
    const weights = normalizedBranchWeights(count);
    const branchColors = [colors.blue, colors.green, colors.primary, colors.purple, colors.blue, colors.green];
    const allBranches = [];
    for (let branch = 0; branch < count; branch += 1) {
      const points = Array.from({ length: 60 }, (_, index) => tecBranchPoint(branch, count, index / 59));
      allBranches.push(points);
      const color = branchColors[branch];
      const width = 2.2 + weights[branch] * 15;
      line3D(points, cam, color, width + 6, 0.1 + weights[branch] * 0.16);
      line3D(points, cam, color, width, 0.72 + weights[branch] * 0.28);
      const end = points[points.length - 1];
      label3D(`${Math.round(weights[branch] * 100)}%`, add(end, [0, 0.28, 0]), cam, colors, { color, bold: true });
      if (state.playing) {
        const limit = Math.max(2, Math.round(state.phase * (points.length - 1)));
        line3D(points.slice(Math.max(0, limit - 8), limit + 1), cam, color, width + 3.5, 0.95);
      }
    }

    if (state.option) {
      const average = Array.from({ length: 60 }, (_, index) => {
        const points = allBranches.map((branch) => branch[index]);
        return points.reduce((sum, point, branchIndex) => add(sum, scale(point, weights[branchIndex])), [0, 0, 0]);
      });
      line3D(average, cam, colors.muted, 2.3, 0.9, [7, 6]);
      label3D("projected ensemble mean", add(average[35], [0, 0.34, 0]), cam, colors, { color: colors.muted, offsetX: -76, offsetY: -18 });
    }
    label3D("shared observed history", add(allBranches[0][10], [0, 0.32, 0]), cam, colors, { color: colors.fg, bold: true });
    label3D("projective-state projection", tecSurfacePoint(0.88, 0.9), cam, colors, { color: colors.purple, offsetX: 28, offsetY: -12 });
  }

  function drawGeometry() {
    state.frameRequested = false;
    const { width, height } = resizeCanvas();
    const colors = palette();
    const cam = camera(width, height);
    labelLayout.width = width;
    labelLayout.height = height;
    labelLayout.boxes = [{ x: Math.max(0, width - 250), y: 2, width: 246, height: 24 }];
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);

    if (state.method === "current") drawCurrent(cam, colors);
    if (state.method === "qlc") drawQlc(cam, colors);
    if (state.method === "psc") drawPsc(cam, colors);
    if (state.method === "tec") drawTec(cam, colors);

    ctx.save();
    ctx.fillStyle = colors.muted;
    ctx.font = '11px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "right";
    ctx.fillText("drag to rotate · wheel or +/− to zoom", width - 12, 20);
    ctx.restore();
  }

  function primaryValue() {
    if (state.method === "qlc") return `${Math.round(state.primary * 3.6)}°`;
    if (state.method === "psc") return `χ = ${1 + Math.round(state.primary / 100 * 7)}`;
    if (state.method === "tec") return `${2 + Math.round(state.primary / 100 * 4)} branches`;
    return `${Math.round(state.primary)}%`;
  }

  function secondaryValue() {
    if (state.method === "qlc") return `${Math.round(state.secondary)}% mixed`;
    if (state.method === "psc") return `${Math.round(state.secondary)}%`;
    if (state.method === "tec") {
      if (state.secondary < 43) return "left-favoured";
      if (state.secondary > 57) return "right-favoured";
      return "balanced";
    }
    return `${Math.round(state.secondary)}%`;
  }

  function updateGeometryUI() {
    const content = copy[state.method];
    $("#geometryMethodTitle").textContent = content.title;
    $("#geometryMethodBadge").textContent = content.badge;
    $("#geometrySummary").textContent = content.summary;
    $("#geometryPrimaryLabel").textContent = content.primaryLabel;
    $("#geometrySecondaryLabel").textContent = content.secondaryLabel;
    $("#geometryOptionLabel").textContent = content.optionLabel;
    $("#geometryFormula").innerHTML = content.formula;
    $("#geometryFormulaMeaning").textContent = content.formulaMeaning;
    $("#geometryExplanationTitle").textContent = content.explanationTitle;
    $("#geometryExplanationText").textContent = content.explanation;
    $("#geometryCapacityText").innerHTML = `<strong>Capacity:</strong> ${content.capacity}`;
    $("#geometryStatusLead").textContent = content.statusLead;
    $("#geometryStatusDetail").textContent = content.statusDetail;
    $("#geometryPrimaryValue").textContent = primaryValue();
    $("#geometrySecondaryValue").textContent = secondaryValue();
    $("#geometryPlayButton").textContent = state.playing ? "Pause evolution" : "Play evolution";
    $("#geometryPlayButton").setAttribute("aria-pressed", String(state.playing));
    $("#geometryOptionToggle").checked = state.option;
    canvas.setAttribute("aria-label", content.aria);
    content.legend.forEach((label, index) => {
      $("#geometryLegend" + ["One", "Two", "Three", "Four"][index]).textContent = label;
    });
    $$(".geometry-tab").forEach((button) => {
      const active = button.dataset.geometryMethod === state.method;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $("#geometryStage").setAttribute("aria-labelledby", `geometryTab${state.method === "qlc" ? "Qlc" : state.method === "psc" ? "Psc" : state.method === "tec" ? "Tec" : "Current"}`);
    requestGeometryDraw();
  }

  function requestGeometryDraw() {
    if (state.frameRequested) return;
    state.frameRequested = true;
    requestAnimationFrame(drawGeometry);
  }

  function stopAnimation() {
    state.playing = false;
    if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
    state.animationFrame = 0;
  }

  function animate(now) {
    if (!state.playing) { state.animationFrame = 0; return; }
    const delta = Math.min((now - state.lastTime) / 1000, 0.05);
    state.lastTime = now;
    state.phase = (state.phase + delta * 0.13) % 1;
    requestGeometryDraw();
    state.animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (reducedMotion || state.animationFrame) return;
    state.lastTime = performance.now();
    state.animationFrame = requestAnimationFrame(animate);
  }

  function selectMethod(method) {
    stopAnimation();
    state.method = method;
    Object.assign(state, defaults[method]);
    state.phase = 0.18;
    $("#geometryPrimaryRange").value = String(state.primary);
    $("#geometrySecondaryRange").value = String(state.secondary);
    updateGeometryUI();
  }

  $$(".geometry-tab").forEach((button, index, buttons) => {
    button.addEventListener("click", () => selectMethod(button.dataset.geometryMethod));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === "ArrowLeft") target = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") target = (index + 1) % buttons.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = buttons.length - 1;
      buttons[target].focus();
      selectMethod(buttons[target].dataset.geometryMethod);
    });
  });

  $("#geometryPlayButton").addEventListener("click", () => {
    if (reducedMotion) {
      state.phase = (state.phase + 0.12) % 1;
      requestGeometryDraw();
      return;
    }
    state.playing = !state.playing;
    if (state.playing) startAnimation(); else stopAnimation();
    updateGeometryUI();
  });

  $("#geometryResetButton").addEventListener("click", () => {
    stopAnimation();
    state.yaw = 0.7;
    state.pitch = 0.42;
    state.radius = 8.6;
    state.phase = 0.18;
    Object.assign(state, defaults[state.method]);
    $("#geometryPrimaryRange").value = String(state.primary);
    $("#geometrySecondaryRange").value = String(state.secondary);
    updateGeometryUI();
  });

  $("#geometryRotateButton").addEventListener("click", () => {
    state.touchExplore = !state.touchExplore;
    canvas.classList.toggle("is-touch-exploring", state.touchExplore);
    $("#geometryRotateButton").setAttribute("aria-pressed", String(state.touchExplore));
    $("#geometryRotateButton").textContent = state.touchExplore ? "Touch rotation on" : "Rotate on touch";
  });

  $("#geometryPrimaryRange").addEventListener("input", (event) => {
    state.primary = Number(event.target.value);
    stopAnimation();
    updateGeometryUI();
  });

  $("#geometrySecondaryRange").addEventListener("input", (event) => {
    state.secondary = Number(event.target.value);
    updateGeometryUI();
  });

  $("#geometryOptionToggle").addEventListener("change", (event) => {
    state.option = event.target.checked;
    requestGeometryDraw();
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" && !state.touchExplore) return;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const deltaX = event.clientX - state.pointerX;
    const deltaY = event.clientY - state.pointerY;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.yaw += deltaX * 0.008;
    state.pitch = clamp(state.pitch - deltaY * 0.006, 0.08, 1.08);
    requestGeometryDraw();
  });

  function finishPointer(event) {
    if (!state.dragging) return;
    state.dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  canvas.addEventListener("pointerup", finishPointer);
  canvas.addEventListener("pointercancel", finishPointer);
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    state.radius = clamp(state.radius + event.deltaY * 0.009, 6.2, 12.5);
    requestGeometryDraw();
  }, { passive: false });

  canvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") state.yaw -= 0.1;
    else if (event.key === "ArrowRight") state.yaw += 0.1;
    else if (event.key === "ArrowUp") state.pitch = clamp(state.pitch + 0.08, 0.08, 1.08);
    else if (event.key === "ArrowDown") state.pitch = clamp(state.pitch - 0.08, 0.08, 1.08);
    else if (["+", "="].includes(event.key)) state.radius = clamp(state.radius - 0.45, 6.2, 12.5);
    else if (["-", "_"].includes(event.key)) state.radius = clamp(state.radius + 0.45, 6.2, 12.5);
    else return;
    event.preventDefault();
    requestGeometryDraw();
  });

  const resizeObserver = new ResizeObserver(requestGeometryDraw);
  resizeObserver.observe(canvas);
  updateGeometryUI();
})();
