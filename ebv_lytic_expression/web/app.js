(() => {
  const DATA = window.YUAN2006;
  const HOURS = DATA.hours;
  const GENES = DATA.genes;
  const BY_NAME = Object.fromEntries(GENES.map((g) => [g.gene, g]));
  const CASCADE = Object.fromEntries((window.CASCADE?.genes || []).map((g) => [g.gene, g]));

  const CALIBRATORS = ["BZLF1", "BRLF1", "BMRF1", "BALF5", "BXLF1", "BLLF1", "BFRF3"];
  const PALETTE = [
    "#5eb0ff", "#f0a04b", "#7dce9a", "#e07a7a", "#c9a0e8",
    "#f2d06b", "#6ad0d2", "#f09ac0", "#a3c4ff", "#b8e986",
    "#ffb07c", "#9aa6b4",
  ];

  const state = {
    pinned: new Set(CALIBRATORS.filter((g) => BY_NAME[g])),
    hovered: null,
    yMode: "log2", // linear | log2
    showGhosts: true,
    showBand: true,
    classFilter: "all",
    cageFilter: "all",
    search: "",
  };

  function cascadeOf(name) {
    return CASCADE[name] || null;
  }

  function cageKin(name) {
    return cascadeOf(name)?.cage?.kinetics || null;
  }

  function cageLabel(kin) {
    if (kin === "early") return "CAGE E";
    if (kin === "leaky") return "CAGE LL";
    if (kin === "late") return "CAGE L";
    if (kin === "latent") return "CAGE lat";
    return "";
  }

  function cageColor(kin) {
    if (kin === "early") return "#5eb0ff";
    if (kin === "leaky") return "#f2d06b";
    if (kin === "late") return "#7dce9a";
    if (kin === "latent") return "#c9a0e8";
    return "#6b7c8d";
  }

  function pearson(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      const a = xs[i] - mx;
      const b = ys[i] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    const den = Math.sqrt(dx * dy);
    return den ? num / den : null;
  }

  function heatFill(log2fold) {
    const t = Math.max(0, Math.min(1, log2fold / 5));
    const stops = [
      [16, 22, 32],
      [36, 74, 110],
      [94, 176, 255],
      [242, 208, 107],
    ];
    const x = t * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(x));
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `rgb(${r},${g},${bl})`;
  }

  function highlightOnChart(name) {
    if (state.hovered === name) return;
    state.hovered = name;
    renderChartOnly();
    document.querySelectorAll(".gene-row").forEach((row) => {
      const n = row.querySelector(".name")?.textContent;
      row.classList.toggle("hovered", state.hovered === n);
    });
  }

  function proteinFolds(p, key) {
    if (!p) return [];
    const hours = p[key + "_hours"];
    const sig = p[key + "_signal"];
    if (!hours || !sig || !sig[0] || sig[0] <= 0) return [];
    return hours.map((hr, i) => {
      const v = sig[i];
      if (v == null || v <= 0) return null;
      return { hour: hr, fold: v / sig[0] };
    }).filter(Boolean);
  }

  const $ = (sel) => document.querySelector(sel);

  function linear(g) {
    return g.linear_fold;
  }

  function yValue(g, i) {
    const v = linear(g)[i];
    return state.yMode === "log2" ? Math.log2(Math.max(v, 1e-6)) : v;
  }

  function seriesYs(g) {
    return g.hours.map((_, i) => yValue(g, i));
  }

  function percentile(arr, p) {
    const s = [...arr].sort((a, b) => a - b);
    if (!s.length) return 0;
    const idx = (s.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return s[lo];
    return s[lo] * (hi - idx) + s[hi] * (idx - lo);
  }

  function bandStats() {
    return HOURS.map((_, i) => {
      const vals = GENES.map((g) => yValue(g, i));
      return {
        p10: percentile(vals, 0.1),
        p50: percentile(vals, 0.5),
        p90: percentile(vals, 0.9),
      };
    });
  }

  function colorFor(gene) {
    const pinned = [...state.pinned];
    const i = pinned.indexOf(gene);
    if (i < 0) return "#6b7c8d";
    return PALETTE[i % PALETTE.length];
  }

  function filteredGenes() {
    const q = state.search.trim().toLowerCase();
    return GENES.filter((g) => {
      if (state.classFilter !== "all" && g.class !== state.classFilter) return false;
      if (state.cageFilter !== "all" && cageKin(g.gene) !== state.cageFilter) return false;
      if (q && !g.gene.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function togglePin(gene) {
    if (state.pinned.has(gene)) state.pinned.delete(gene);
    else state.pinned.add(gene);
    render();
  }

  function pinClass(cls) {
    GENES.filter((g) => g.class === cls).forEach((g) => state.pinned.add(g.gene));
    render();
  }

  function pinCage(kin) {
    GENES.filter((g) => cageKin(g.gene) === kin).forEach((g) => state.pinned.add(g.gene));
    render();
  }

  function pinOnly(list) {
    state.pinned = new Set(list.filter((g) => BY_NAME[g]));
    render();
  }

  function layout() {
    const svg = $("#chart");
    const w = svg.clientWidth || 800;
    const h = svg.clientHeight || 520;
    const m = { t: 28, r: 18, b: 42, l: 54 };
    const iw = Math.max(40, w - m.l - m.r);
    const ih = Math.max(40, h - m.t - m.b);
    const xMin = 0;
    const xMax = 72;
    const allY = GENES.flatMap(seriesYs);
    let yMin = Math.min(...allY);
    let yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.06 || 0.2;
    yMin -= pad;
    yMax += pad;
    const x = (hr) => m.l + ((hr - xMin) / (xMax - xMin)) * iw;
    const y = (v) => m.t + ((yMax - v) / (yMax - yMin)) * ih;
    return { svg, w, h, m, iw, ih, x, y, yMin, yMax };
  }

  function pathFor(g, L) {
    const pts = g.hours.map((hr, i) => `${i ? "L" : "M"}${L.x(hr).toFixed(1)},${L.y(yValue(g, i)).toFixed(1)}`);
    return pts.join(" ");
  }

  function bandPath(L) {
    const stats = bandStats();
    const top = HOURS.map((hr, i) => `${i ? "L" : "M"}${L.x(hr).toFixed(1)},${L.y(stats[i].p90).toFixed(1)}`);
    const bot = [...HOURS].reverse().map((hr, i) => {
      const idx = HOURS.length - 1 - i;
      return `L${L.x(hr).toFixed(1)},${L.y(stats[idx].p10).toFixed(1)}`;
    });
    return `${top.join(" ")} ${bot.join(" ")} Z`;
  }

  function medianPath(L) {
    const stats = bandStats();
    return HOURS.map((hr, i) => `${i ? "L" : "M"}${L.x(hr).toFixed(1)},${L.y(stats[i].p50).toFixed(1)}`).join(" ");
  }

  function ticksY(yMin, yMax) {
    if (state.yMode === "log2") {
      const lo = Math.floor(yMin);
      const hi = Math.ceil(yMax);
      const t = [];
      for (let i = lo; i <= hi; i++) t.push(i);
      return t.length ? t : [0];
    }
    const span = yMax - yMin;
    const step = span > 40 ? 10 : span > 20 ? 5 : 2;
    const t = [];
    const start = Math.floor(yMin / step) * step;
    for (let v = start; v <= yMax + 1e-6; v += step) t.push(v);
    return t;
  }

  function fmtY(v) {
    if (state.yMode === "log2") {
      const fold = 2 ** v;
      if (v === 0) return "1×";
      return (v > 0 ? "+" : "") + v + "  (" + (fold >= 10 ? fold.toFixed(0) : fold.toFixed(1)) + "×)";
    }
    return (Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1)) + "×";
  }

  function nearestGene(px, py, L) {
    let best = null;
    let bestD = 18;
    const pool = state.showGhosts ? GENES : GENES.filter((g) => state.pinned.has(g.gene));
    for (const g of pool) {
      for (let i = 0; i < g.hours.length; i++) {
        const dx = L.x(g.hours[i]) - px;
        const dy = L.y(yValue(g, i)) - py;
        const d = Math.hypot(dx, dy);
        if (d < bestD) {
          bestD = d;
          best = { gene: g.gene, i, d };
        }
      }
    }
    return best;
  }

  function drawChart() {
    const L = layout();
    const svg = L.svg;
    svg.setAttribute("viewBox", `0 0 ${L.w} ${L.h}`);
    const ns = "http://www.w3.org/2000/svg";
    svg.replaceChildren();

    const gGrid = document.createElementNS(ns, "g");
    gGrid.setAttribute("class", "grid");
    for (const hr of HOURS) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", L.x(hr));
      line.setAttribute("x2", L.x(hr));
      line.setAttribute("y1", L.m.t);
      line.setAttribute("y2", L.m.t + L.ih);
      gGrid.appendChild(line);
    }
    svg.appendChild(gGrid);

    if (state.showBand) {
      const band = document.createElementNS(ns, "path");
      band.setAttribute("class", "band");
      band.setAttribute("d", bandPath(L));
      svg.appendChild(band);
      const med = document.createElementNS(ns, "path");
      med.setAttribute("class", "median");
      med.setAttribute("d", medianPath(L));
      svg.appendChild(med);
    }

    if (state.showGhosts) {
      const gGhost = document.createElementNS(ns, "g");
      for (const gene of GENES) {
        if (state.pinned.has(gene.gene)) continue;
        const p = document.createElementNS(ns, "path");
        p.setAttribute("class", "ghost" + (state.hovered === gene.gene ? " hovered" : ""));
        p.setAttribute("d", pathFor(gene, L));
        p.dataset.gene = gene.gene;
        gGhost.appendChild(p);
      }
      svg.appendChild(gGhost);
    }

    const gFocus = document.createElementNS(ns, "g");
    for (const name of state.pinned) {
      const gene = BY_NAME[name];
      if (!gene) continue;
      const faded = state.hovered && state.hovered !== name;
      const p = document.createElementNS(ns, "path");
      p.setAttribute("class", "focus" + (state.hovered === name ? " hovered" : ""));
      p.setAttribute("d", pathFor(gene, L));
      p.setAttribute("stroke", colorFor(name));
      p.setAttribute("opacity", faded ? 0.18 : 1);
      p.dataset.gene = name;
      gFocus.appendChild(p);
      gene.hours.forEach((hr, i) => {
        const c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", L.x(hr));
        c.setAttribute("cy", L.y(yValue(gene, i)));
        c.setAttribute("r", state.hovered === name ? 4 : 2.6);
        c.setAttribute("fill", colorFor(name));
        c.setAttribute("opacity", faded ? 0.18 : 1);
        c.dataset.gene = name;
        gFocus.appendChild(c);
      });
    }
    svg.appendChild(gFocus);

    const gAxis = document.createElementNS(ns, "g");
    gAxis.setAttribute("class", "axis");
    HOURS.forEach((hr) => {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", L.x(hr));
      t.setAttribute("y", L.m.t + L.ih + 18);
      t.setAttribute("text-anchor", "middle");
      t.textContent = hr + " h";
      gAxis.appendChild(t);
    });
    ticksY(L.yMin, L.yMax).forEach((v) => {
      const yy = L.y(v);
      if (yy < L.m.t - 2 || yy > L.m.t + L.ih + 2) return;
      const tick = document.createElementNS(ns, "line");
      tick.setAttribute("x1", L.m.l - 4);
      tick.setAttribute("x2", L.m.l);
      tick.setAttribute("y1", yy);
      tick.setAttribute("y2", yy);
      gAxis.appendChild(tick);
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", L.m.l - 8);
      t.setAttribute("y", yy + 4);
      t.setAttribute("text-anchor", "end");
      t.textContent = state.yMode === "log2" ? (v === 0 ? "1×" : (v > 0 ? "2^" + v : "2^" + v)) : fmtY(v);
      gAxis.appendChild(t);
    });
    const ylab = document.createElementNS(ns, "text");
    ylab.setAttribute("x", 14);
    ylab.setAttribute("y", L.m.t + L.ih / 2);
    ylab.setAttribute("transform", `rotate(-90 14 ${L.m.t + L.ih / 2})`);
    ylab.setAttribute("text-anchor", "middle");
    ylab.textContent = state.yMode === "log2" ? "log2 fold vs 0 h" : "linear fold vs 0 h";
    gAxis.appendChild(ylab);
    svg.appendChild(gAxis);

    svg.onmousemove = (ev) => {
      const rect = svg.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * L.w;
      const py = ((ev.clientY - rect.top) / rect.height) * L.h;
      const hit = nearestGene(px, py, L);
      const next = hit ? hit.gene : null;
      if (next !== state.hovered) {
        state.hovered = next;
        renderChartOnly();
        renderListHover();
      }
      const tip = $("#tooltip");
      if (hit) {
        const g = BY_NAME[hit.gene];
        const hr = g.hours[hit.i];
        const fold = g.linear_fold[hit.i];
        tip.style.display = "block";
        tip.style.left = ev.clientX - rect.left + 14 + "px";
        tip.style.top = ev.clientY - rect.top + 14 + "px";
        const ckin = cageKin(hit.gene);
        tip.innerHTML = `<strong>${g.gene}</strong> · ${g.class}${ckin ? " · CAGE " + ckin : ""}<br>${hr} h → ${fold.toFixed(1)}× RNA vs 0 h`;
      } else {
        tip.style.display = "none";
      }
    };
    svg.onmouseleave = () => {
      state.hovered = null;
      $("#tooltip").style.display = "none";
      render();
    };
    svg.onclick = (ev) => {
      const rect = svg.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * L.w;
      const py = ((ev.clientY - rect.top) / rect.height) * L.h;
      const hit = nearestGene(px, py, L);
      if (hit) togglePin(hit.gene);
    };
  }

  function renderChartOnly() {
    drawChart();
  }

  function renderList() {
    const list = $("#gene-list");
    const rows = filteredGenes();
    list.replaceChildren();
    for (const g of rows) {
      const row = document.createElement("div");
      row.className = "gene-row";
      if (state.pinned.has(g.gene)) row.classList.add("pinned");
      if (state.hovered === g.gene) row.classList.add("hovered");
        const ckin = cageKin(g.gene);
        const mm = cascadeOf(g.gene)?.array_vs_cage_mismatch;
        row.innerHTML = `
        <span class="swatch" style="background:${state.pinned.has(g.gene) ? colorFor(g.gene) : "#3a4654"}"></span>
        <span class="name">${g.gene}</span>
        <span class="meta cls-${g.class}">${g.class}${ckin ? ` · <span class="cage-${ckin}">${cageLabel(ckin)}</span>` : ""}${mm ? " · ≠" : ""} · pk ${g.peak_hour}h</span>`;
      row.onmouseenter = () => {
        state.hovered = g.gene;
        renderChartOnly();
        renderListHover();
        showDetail(g.gene);
      };
      row.onmouseleave = () => {
        state.hovered = null;
        renderChartOnly();
        renderListHover();
      };
      row.onclick = () => togglePin(g.gene);
      list.appendChild(row);
    }
    $("#count").textContent = `${rows.length} shown · ${state.pinned.size} pinned`;
  }

  function renderListHover() {
    document.querySelectorAll(".gene-row").forEach((row) => {
      const name = row.querySelector(".name").textContent;
      row.classList.toggle("hovered", state.hovered === name);
    });
    if (state.hovered) showDetail(state.hovered);
    else if (state.pinned.size === 1) showDetail([...state.pinned][0]);
  }

  function svgEl(name, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function drawTrack(svg, pts, x, yOf, color, dash, r) {
    if (pts.length >= 2) {
      const p = svgEl("path", {
        d: pts.map((d, i) => `${i ? "L" : "M"}${x(d.hour).toFixed(1)},${yOf(d.fold).toFixed(1)}`).join(" "),
        fill: "none",
        stroke: color,
        "stroke-width": "1.8",
        "stroke-dasharray": dash || "",
      });
      svg.appendChild(p);
    }
    pts.forEach((d) => {
      svg.appendChild(svgEl("circle", { cx: x(d.hour), cy: yOf(d.fold), r: r || 2.2, fill: color }));
    });
  }

  function trackYScale(folds, y0, y1) {
    const useLog = state.yMode === "log2";
    const yv = (f) => (useLog ? Math.log2(Math.max(f, 1e-6)) : f);
    let yMin = Math.min(...folds.map(yv));
    let yMax = Math.max(...folds.map(yv));
    const pad = (yMax - yMin) * 0.16 || 0.2;
    yMin -= pad;
    yMax += pad;
    return (f) => y0 + ((yMax - yv(f)) / (yMax - yMin)) * (y1 - y0);
  }

  function drawAlignedSparklines(host, g) {
    const cas = cascadeOf(g.gene);
    const prot = cas?.protein;
    const w = 268;
    const h = 132;
    const m = { t: 6, r: 8, b: 16, l: 28 };
    const svg = svgEl("svg", { class: "mini tracks", viewBox: `0 0 ${w} ${h}` });
    const x = (hr) => m.l + (hr / 72) * (w - m.l - m.r);
    const rnaFolds = g.hours.map((hr, i) => ({ hour: hr, fold: g.linear_fold[i] }));
    const ak = proteinFolds(prot, "akata");
    const p3 = proteinFolds(prot, "p3hr1");
    const split = 58;
    const yRna = trackYScale(rnaFolds.map((d) => d.fold), m.t + 10, split - 4);
    const protF = [...ak.map((d) => d.fold), ...p3.map((d) => d.fold)];
    [0, 24, 48, 72].forEach((hr) => {
      const t = svgEl("text", { x: x(hr), y: h - 3, "text-anchor": "middle", fill: "#8b9aab", "font-size": "9" });
      t.textContent = hr + "h";
      svg.appendChild(t);
    });
    const labR = svgEl("text", { x: 4, y: m.t + 8, fill: "#8b9aab", "font-size": "9" });
    labR.textContent = "RNA";
    svg.appendChild(labR);
    const labP = svgEl("text", { x: 4, y: split + 12, fill: "#8b9aab", "font-size": "9" });
    labP.textContent = "prot.";
    svg.appendChild(labP);
    const divider = svgEl("line", { x1: m.l, x2: w - m.r, y1: split, y2: split, stroke: "#2a3544" });
    svg.appendChild(divider);
    drawTrack(svg, rnaFolds, x, yRna, "#5eb0ff", "", 2.2);
    if (protF.length) {
      const yProt = trackYScale(protF, split + 10, h - m.b - 2);
      if (p3.length) drawTrack(svg, p3, x, yProt, "#7dce9a", "3 2", 2.2);
      if (ak.length) {
        ak.forEach((d) => {
          svg.appendChild(svgEl("circle", { cx: x(d.hour), cy: yProt(d.fold), r: 3.2, fill: "#f0a04b" }));
        });
      }
    } else {
      const miss = svgEl("text", { x: m.l + 8, y: split + 28, fill: "#6b7c8d", "font-size": "10" });
      miss.textContent = "not quantified in Ersing WCL";
      svg.appendChild(miss);
    }
    host.replaceChildren(svg);
  }

  function scatterPoints() {
    return (window.CASCADE?.genes || []).filter((c) => c.rna_fold_48h && c.akata_protein_fold_48h);
  }

  function bindPlotHover(svg, status) {
    svg.onmousemove = (ev) => {
      const gene = ev.target && ev.target.dataset ? ev.target.dataset.gene : null;
      if (status) status.textContent = gene ? gene : status.dataset.idle;
      highlightOnChart(gene);
    };
    svg.onmouseleave = () => {
      if (status) status.textContent = status.dataset.idle;
      highlightOnChart(null);
    };
    svg.onclick = (ev) => {
      const gene = ev.target && ev.target.dataset ? ev.target.dataset.gene : null;
      if (gene) togglePin(gene);
    };
  }

  function drawScatter(host, highlight) {
    const pts = scatterPoints();
    const wrap = document.createElement("div");
    const w = 268;
    const h = 210;
    const m = { t: 14, r: 12, b: 30, l: 40 };
    const svg = svgEl("svg", { class: "scatter", viewBox: `0 0 ${w} ${h}` });
    const lx = (f) => Math.log2(Math.max(f, 1e-6));
    const xs = pts.map((p) => lx(p.rna_fold_48h));
    const ys = pts.map((p) => lx(p.akata_protein_fold_48h));
    const r = pearson(xs, ys);
    const xMin = Math.min(0, ...xs) - 0.4;
    const xMax = Math.max(1, ...xs) + 0.4;
    const yMin = Math.min(0, ...ys) - 0.4;
    const yMax = Math.max(1, ...ys) + 0.4;
    const X = (f) => m.l + ((lx(f) - xMin) / (xMax - xMin)) * (w - m.l - m.r);
    const Y = (f) => m.t + ((yMax - lx(f)) / (yMax - yMin)) * (h - m.t - m.b);
    const xlab = svgEl("text", { x: m.l + (w - m.l - m.r) / 2, y: h - 6, "text-anchor": "middle", fill: "#8b9aab", "font-size": "10" });
    xlab.textContent = "RNA 48 h (log2 fold, Yuan)";
    svg.appendChild(xlab);
    const ylab = svgEl("text", {
      x: 12,
      y: m.t + (h - m.t - m.b) / 2,
      "text-anchor": "middle",
      fill: "#8b9aab",
      "font-size": "10",
      transform: `rotate(-90 12 ${m.t + (h - m.t - m.b) / 2})`,
    });
    ylab.textContent = "protein 48 h (log2 fold, Akata TMT)";
    svg.appendChild(ylab);
    svg.appendChild(svgEl("line", {
      x1: X(2 ** xMin), y1: Y(2 ** xMin), x2: X(2 ** xMax), y2: Y(2 ** xMax),
      stroke: "#334155", "stroke-dasharray": "3 3",
    }));
    const eq = svgEl("text", { x: X(2 ** (xMax - 0.15)), y: Y(2 ** (xMax - 0.15)) - 4, fill: "#6b7c8d", "font-size": "9" });
    eq.textContent = "equal fold";
    svg.appendChild(eq);
    pts.forEach((p) => {
      const kin = p.cage?.kinetics;
      const on = p.gene === highlight || state.pinned.has(p.gene);
      const c = svgEl("circle", {
        cx: X(p.rna_fold_48h),
        cy: Y(p.akata_protein_fold_48h),
        r: p.gene === highlight ? 5.5 : on ? 4.2 : 3.3,
        fill: cageColor(kin),
        opacity: p.gene === highlight ? 1 : on ? 0.95 : 0.55,
        stroke: state.pinned.has(p.gene) ? colorFor(p.gene) : "none",
        "stroke-width": state.pinned.has(p.gene) ? 1.6 : 0,
        "data-gene": p.gene,
      });
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${p.gene}: RNA ${p.rna_fold_48h.toFixed(1)}× · protein ${p.akata_protein_fold_48h.toFixed(1)}×`;
      c.appendChild(title);
      svg.appendChild(c);
    });
    const status = document.createElement("div");
    status.className = "plot-status";
    status.dataset.idle = r == null ? `${pts.length} genes with both measures` : `n=${pts.length} · Pearson r=${r.toFixed(2)} on log2 (plotted axes)`;
    status.textContent = status.dataset.idle;
    bindPlotHover(svg, status);
    wrap.appendChild(svg);
    wrap.appendChild(status);
    host.replaceChildren(wrap);
  }

  function drawCageMap(host, highlight) {
    const pts = (window.CASCADE?.genes || []).filter((c) => c.cage && c.cage.kinetics && c.cage.kinetics !== "latent");
    const wrap = document.createElement("div");
    const w = 268;
    const h = 196;
    const m = { t: 12, r: 12, b: 28, l: 36 };
    const svg = svgEl("svg", { class: "scatter cage-map", viewBox: `0 0 ${w} ${h}` });
    const xs = pts.map((p) => p.cage.balf2_ratio);
    const ys = pts.map((p) => p.cage.bdlf4_ratio);
    const xMin = -0.05;
    const xMax = Math.max(1.6, ...xs) + 0.15;
    const yMin = -0.05;
    const yMax = Math.max(1.6, ...ys) + 0.15;
    const X = (v) => m.l + ((v - xMin) / (xMax - xMin)) * (w - m.l - m.r);
    const Y = (v) => m.t + ((yMax - v) / (yMax - yMin)) * (h - m.t - m.b);
    [0.1, 0.5].forEach((cut) => {
      svg.appendChild(svgEl("line", {
        x1: X(cut), x2: X(cut), y1: m.t, y2: m.t + (h - m.t - m.b),
        stroke: "#334155", "stroke-dasharray": "3 3",
      }));
    });
    const lateL = svgEl("text", { x: X(0.05), y: m.t + 10, fill: "#7dce9a", "font-size": "9" });
    lateL.textContent = "true late";
    svg.appendChild(lateL);
    const leakL = svgEl("text", { x: X(0.3), y: m.t + 10, fill: "#f2d06b", "font-size": "9" });
    leakL.textContent = "leaky";
    svg.appendChild(leakL);
    const earlyL = svgEl("text", { x: X(1.05), y: m.t + 10, fill: "#5eb0ff", "font-size": "9" });
    earlyL.textContent = "early";
    svg.appendChild(earlyL);
    const xlab = svgEl("text", { x: m.l + (w - m.l - m.r) / 2, y: h - 6, "text-anchor": "middle", fill: "#8b9aab", "font-size": "10" });
    xlab.textContent = "BALF2 ratio (DNA replication)";
    svg.appendChild(xlab);
    const ylab = svgEl("text", {
      x: 11,
      y: m.t + (h - m.t - m.b) / 2,
      "text-anchor": "middle",
      fill: "#8b9aab",
      "font-size": "10",
      transform: `rotate(-90 11 ${m.t + (h - m.t - m.b) / 2})`,
    });
    ylab.textContent = "BDLF4 ratio (vPIC)";
    svg.appendChild(ylab);
    pts.forEach((p) => {
      const on = p.gene === highlight || state.pinned.has(p.gene);
      const c = svgEl("circle", {
        cx: X(p.cage.balf2_ratio),
        cy: Y(p.cage.bdlf4_ratio),
        r: p.gene === highlight ? 5.5 : on ? 4.2 : 3.3,
        fill: cageColor(p.cage.kinetics),
        opacity: p.gene === highlight ? 1 : on ? 0.95 : 0.6,
        stroke: state.pinned.has(p.gene) ? colorFor(p.gene) : "none",
        "stroke-width": state.pinned.has(p.gene) ? 1.6 : 0,
        "data-gene": p.gene,
      });
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${p.gene} · BALF2 ${p.cage.balf2_ratio.toFixed(2)} · BDLF4 ${p.cage.bdlf4_ratio.toFixed(2)}`;
      c.appendChild(title);
      svg.appendChild(c);
    });
    const status = document.createElement("div");
    status.className = "plot-status";
    status.dataset.idle = "Djavadian Fig. 4 · dashed at 0.1 / 0.5";
    status.textContent = status.dataset.idle;
    bindPlotHover(svg, status);
    wrap.appendChild(svg);
    wrap.appendChild(status);
    host.replaceChildren(wrap);
  }

  function drawPinHeatmap(host, highlight) {
    const names = [...state.pinned].filter((n) => BY_NAME[n]);
    names.sort((a, b) => {
      const da = BY_NAME[a].peak_hour - BY_NAME[b].peak_hour;
      return da || a.localeCompare(b);
    });
    if (!names.length) {
      host.replaceChildren();
      const p = document.createElement("p");
      p.className = "empty";
      p.style.margin = "0";
      p.textContent = "Pin genes to see their RNA cascade as a heatmap (sorted by peak hour).";
      host.appendChild(p);
      return;
    }
    const rowH = 14;
    const m = { t: 16, r: 8, b: 6, l: 52 };
    const w = 268;
    const h = m.t + m.b + names.length * rowH;
    const svg = svgEl("svg", { class: "heat", viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "xMidYMin meet" });
    svg.style.height = `${h}px`;
    HOURS.forEach((hr, i) => {
      const x = m.l + (i + 0.5) * ((w - m.l - m.r) / HOURS.length);
      const t = svgEl("text", { x, y: 11, "text-anchor": "middle", fill: "#8b9aab", "font-size": "9" });
      t.textContent = hr;
      svg.appendChild(t);
    });
    names.forEach((name, ri) => {
      const g = BY_NAME[name];
      const y = m.t + ri * rowH;
      const lab = svgEl("text", {
        x: m.l - 4,
        y: y + rowH * 0.72,
        "text-anchor": "end",
        fill: name === highlight ? "#e7ecf1" : "#8b9aab",
        "font-size": "9",
        "font-family": "ui-monospace, monospace",
        "data-gene": name,
      });
      lab.textContent = name;
      svg.appendChild(lab);
      g.hours.forEach((hr, i) => {
        const cw = (w - m.l - m.r) / HOURS.length;
        const rect = svgEl("rect", {
          x: m.l + i * cw + 0.6,
          y: y + 1,
          width: cw - 1.2,
          height: rowH - 2,
          rx: 1.5,
          fill: heatFill(Math.log2(Math.max(g.linear_fold[i], 1e-6))),
          stroke: name === highlight ? "#e7ecf1" : "none",
          "stroke-width": name === highlight ? 0.8 : 0,
          "data-gene": name,
        });
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${name} · ${hr} h · ${g.linear_fold[i].toFixed(1)}×`;
        rect.appendChild(title);
        svg.appendChild(rect);
      });
    });
    svg.onmousemove = (ev) => {
      const gene = ev.target && ev.target.dataset ? ev.target.dataset.gene : null;
      highlightOnChart(gene);
    };
    svg.onmouseleave = () => highlightOnChart(null);
    svg.onclick = (ev) => {
      const gene = ev.target && ev.target.dataset ? ev.target.dataset.gene : null;
      if (gene) showDetail(gene);
    };
    host.replaceChildren(svg);
  }

  function showDetail(name) {
    const g = BY_NAME[name];
    const el = $("#detail-body");
    if (!g) {
      el.innerHTML = `<p class="empty">Hover a line or pin a gene. Faint traces are the other 59 RNAs (10–90% band = typical range).</p>`;
      return;
    }
    const cas = cascadeOf(name);
    const cage = cas?.cage;
    const prot = cas?.protein;
    const peakMark = g.peak_hour;
    const rows = g.hours
      .map(
        (hr, i) =>
          `<tr class="${hr === peakMark ? "peak" : ""}"><td>${hr} h</td><td>${g.linear_fold[i].toFixed(1)}×</td><td>${Math.log2(Math.max(g.linear_fold[i], 1e-6)).toFixed(2)}</td></tr>`
      )
      .join("");
    const akF = cas?.akata_protein_fold_48h;
    const rna48 = cas?.rna_fold_48h;
    const cageBits = cage
      ? `<dt>CAGE</dt><dd class="cage-${cage.kinetics}">${cage.kinetics}${cage.vpic_independent_late ? " · vPIC-indep. late" : ""}</dd>
         <dt>BALF2</dt><dd>${cage.balf2_ratio.toFixed(2)} (DNA-rep. ratio)</dd>
         <dt>BDLF4</dt><dd>${cage.bdlf4_ratio.toFixed(2)} (vPIC ratio)</dd>`
      : `<dt>CAGE</dt><dd>not in Djavadian Table 2</dd>`;
    const mismatch = cas?.array_vs_cage_mismatch
      ? `<span class="pill warn">array class ≠ CAGE class</span>`
      : "";
    const protBits = prot
      ? `<dt>Protein 48 h</dt><dd>${akF ? akF.toFixed(1) + "× Akata TMT" : "Akata 0 h not detected"}</dd>`
      : `<dt>Protein</dt><dd>not quantified in Ersing WCL</dd>`;
    el.innerHTML = `
      <div class="detail-nav">${state.pinned.size > 1 ? `<button class="chip" id="back-overview" type="button">Pinned overview</button>` : ""}</div>
      <h2>${g.gene} ${mismatch}</h2>
      <dl class="kv">
        <dt>Array</dt><dd class="cls-${g.class}">${g.class} · peak ${g.peak_fold.toFixed(1)}× at ${g.peak_hour} h</dd>
        ${cageBits}
        ${protBits}
        <dt>Oligo</dt><dd>nt ${g.probe_nt || "—"}</dd>
      </dl>
      <div class="mini-block">
        <h3>RNA and protein vs hour</h3>
        <div id="spark-host"></div>
        <div class="legend-mini"><span class="rna">Yuan RNA</span><span class="p3">P3HR1 protein</span><span class="akata">Akata protein (0, 48 h)</span></div>
        <p class="empty" style="margin:6px 0 0">Separate tracks, independent y (Weekes QTV / Ersing): shape, not magnitude. Same hour axis as the main chart.</p>
      </div>
      <div class="mini-block">
        <h3>CAGE kinetic map</h3>
        <div id="cage-host"></div>
      </div>
      <div class="mini-block">
        <h3>48 h RNA vs Akata protein</h3>
        <div class="legend-mini"><span class="rna">CAGE early</span><span class="leaky">leaky</span><span class="p3">true late</span></div>
        <div id="scatter-host"></div>
      </div>
      <table class="pts">
        <thead><tr><th>Hour</th><th>RNA fold</th><th>log2</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">Yuan RNA is Akata cytoplasmic fold vs 0 h. Ersing protein is TMT in gp350<sup>+</sup> cells (Akata anti-IgG 0 vs 48 h; P3HR1-ZHT/RHT 0/24/48/72 h) — not paired aliquots. Djavadian CAGE class is HEK293 at 48 h by DNA-replication dependence. ${rna48 && akF ? `At 48 h this gene is ${rna48.toFixed(1)}× RNA vs ${akF.toFixed(1)}× protein.` : ""} Nested lytic RNAs can look “early” on arrays while CAGE and protein are late (Djavadian Fig. 1).</p>`;
    drawAlignedSparklines($("#spark-host"), g);
    drawCageMap($("#cage-host"), name);
    drawScatter($("#scatter-host"), name);
    const back = $("#back-overview");
    if (back) {
      back.onclick = () => {
        state.hovered = null;
        render();
      };
    }
  }

  function render() {
    drawChart();
    renderList();
    if (state.hovered) showDetail(state.hovered);
    else if (state.pinned.size === 1) showDetail([...state.pinned][0]);
    else {
      $("#detail-body").innerHTML = `<p class="empty">Hover a faint line to identify it. Click to pin (color). Context: all 59 genes as ghosts + 10–90 percentile band and dashed median. Default pins are MultiCAST calibrators.</p>
        <div class="mini-block">
          <h3>Pinned RNA cascade</h3>
          <p class="empty" style="margin:0 0 8px">Log2 fold vs 0 h, genes ordered by peak hour (Yuan-style cascade; Weekes/Ersing heatmap of temporal profiles). Main line chart is unchanged.</p>
          <div id="heat-host"></div>
        </div>
        <div class="mini-block">
          <h3>CAGE kinetic map</h3>
          <p class="empty" style="margin:0 0 8px">BALF2 vs BDLF4 ratios (Djavadian Fig. 4). True late &lt; 0.1, early &gt; 0.5, leaky in between. Not a time series.</p>
          <div id="cage-host"></div>
        </div>
        <div class="mini-block">
          <h3>48 h RNA vs Akata protein</h3>
          <p class="empty" style="margin:0 0 8px">Same cell/trigger, not paired aliquots (Ersing; Weekes 2014 CMV). Color = CAGE class. Diagonal = equal fold. IE RNA often peaks before 24 h, so 48 h RNA can look modest while protein is still high.</p>
          <div class="legend-mini"><span class="rna">CAGE early</span><span class="leaky">leaky</span><span class="p3">true late</span></div>
          <div id="scatter-host"></div>
        </div>
        <p class="note">Pinned now: ${[...state.pinned].join(", ") || "none"}</p>`;
      drawPinHeatmap($("#heat-host"), null);
      drawCageMap($("#cage-host"), null);
      drawScatter($("#scatter-host"), null);
    }
    $("#y-linear").classList.toggle("active", state.yMode === "linear");
    $("#y-log2").classList.toggle("active", state.yMode === "log2");
    $("#ghosts").classList.toggle("active", state.showGhosts);
    $("#band").classList.toggle("active", state.showBand);
  }

  function bind() {
    $("#search").oninput = (e) => {
      state.search = e.target.value;
      renderList();
    };
    document.querySelectorAll("[data-class]").forEach((btn) => {
      btn.onclick = () => {
        const cls = btn.dataset.class;
        if (cls === "all") {
          state.classFilter = "all";
        } else if (btn.dataset.action === "pin") {
          pinClass(cls);
          return;
        } else {
          state.classFilter = state.classFilter === cls ? "all" : cls;
        }
        document.querySelectorAll("[data-class]").forEach((b) => {
          if (b.dataset.action === "pin") return;
          b.classList.toggle("active", b.dataset.class === state.classFilter);
        });
        renderList();
      };
    });
    $("#preset-cal").onclick = () => pinOnly(CALIBRATORS);
    $("#preset-none").onclick = () => pinOnly([]);
    $("#preset-peaks").onclick = () => {
      const top = [...GENES].sort((a, b) => b.peak_fold - a.peak_fold).slice(0, 8).map((g) => g.gene);
      pinOnly(top);
    };
    $("#preset-protein").onclick = () => {
      pinOnly(["BZLF1", "BRLF1", "BMRF1", "BFRF1", "BLLF1", "BFRF3"]);
    };
    $("#preset-mismatch").onclick = () => {
      pinOnly(GENES.filter((g) => cascadeOf(g.gene)?.array_vs_cage_mismatch).map((g) => g.gene));
    };
    document.querySelectorAll("[data-cage]").forEach((btn) => {
      btn.onclick = () => {
        const kin = btn.dataset.cage;
        if (btn.dataset.action === "pin-cage") {
          pinCage(kin);
          return;
        }
        if (kin === "all") state.cageFilter = "all";
        else state.cageFilter = state.cageFilter === kin ? "all" : kin;
        document.querySelectorAll("#cage-filter [data-cage]").forEach((b) => {
          b.classList.toggle("active", b.dataset.cage === state.cageFilter);
        });
        renderList();
      };
    });
    $("#y-linear").onclick = () => {
      state.yMode = "linear";
      render();
    };
    $("#y-log2").onclick = () => {
      state.yMode = "log2";
      render();
    };
    $("#ghosts").onclick = () => {
      state.showGhosts = !state.showGhosts;
      render();
    };
    $("#band").onclick = () => {
      state.showBand = !state.showBand;
      render();
    };
    window.addEventListener("resize", () => drawChart());
  }

  bind();
  render();
})();
