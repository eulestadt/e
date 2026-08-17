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

  function drawAlignedSparklines(host, g) {
    const cas = cascadeOf(g.gene);
    const prot = cas?.protein;
    const w = 268;
    const h = 92;
    const m = { t: 8, r: 8, b: 16, l: 28 };
    const svg = svgEl("svg", { class: "mini", viewBox: `0 0 ${w} ${h}` });
    const x = (hr) => m.l + (hr / 72) * (w - m.l - m.r);
    const rnaFolds = g.hours.map((hr, i) => ({ hour: hr, fold: g.linear_fold[i] }));
    const ak = proteinFolds(prot, "akata");
    const p3 = proteinFolds(prot, "p3hr1");
    const allF = [...rnaFolds.map((d) => d.fold), ...ak.map((d) => d.fold), ...p3.map((d) => d.fold)];
    const useLog = state.yMode === "log2";
    const yv = (f) => (useLog ? Math.log2(Math.max(f, 1e-6)) : f);
    let yMin = Math.min(...allF.map(yv));
    let yMax = Math.max(...allF.map(yv));
    const pad = (yMax - yMin) * 0.12 || 0.2;
    yMin -= pad;
    yMax += pad;
    const y = (f) => m.t + ((yMax - yv(f)) / (yMax - yMin)) * (h - m.t - m.b);
    const line = (pts, color, dash) => {
      if (pts.length < 2) return;
      const p = svgEl("path", {
        d: pts.map((d, i) => `${i ? "L" : "M"}${x(d.hour).toFixed(1)},${y(d.fold).toFixed(1)}`).join(" "),
        fill: "none",
        stroke: color,
        "stroke-width": "1.8",
        "stroke-dasharray": dash || "",
      });
      svg.appendChild(p);
    };
    const dots = (pts, color, r) => {
      pts.forEach((d) => {
        const c = svgEl("circle", { cx: x(d.hour), cy: y(d.fold), r, fill: color });
        svg.appendChild(c);
      });
    };
    [0, 24, 48, 72].forEach((hr) => {
      const t = svgEl("text", { x: x(hr), y: h - 3, "text-anchor": "middle", fill: "#8b9aab", "font-size": "9" });
      t.textContent = hr + "h";
      svg.appendChild(t);
    });
    line(rnaFolds, "#5eb0ff");
    dots(rnaFolds, "#5eb0ff", 2.2);
    if (p3.length) {
      line(p3, "#7dce9a", "3 2");
      dots(p3, "#7dce9a", 2.2);
    }
    if (ak.length) dots(ak, "#f0a04b", 3.2);
    host.replaceChildren(svg);
  }

  function scatterPoints() {
    return (window.CASCADE?.genes || []).filter((c) => c.rna_fold_48h && c.akata_protein_fold_48h);
  }

  function drawScatter(host, highlight) {
    const pts = scatterPoints();
    const w = 268;
    const h = 220;
    const m = { t: 16, r: 12, b: 32, l: 40 };
    const svg = svgEl("svg", { class: "scatter", viewBox: `0 0 ${w} ${h}` });
    const lx = (f) => Math.log2(Math.max(f, 1e-6));
    const xs = pts.map((p) => lx(p.rna_fold_48h));
    const ys = pts.map((p) => lx(p.akata_protein_fold_48h));
    const xMin = Math.min(0, ...xs) - 0.4;
    const xMax = Math.max(1, ...xs) + 0.4;
    const yMin = Math.min(0, ...ys) - 0.4;
    const yMax = Math.max(1, ...ys) + 0.4;
    const X = (f) => m.l + ((lx(f) - xMin) / (xMax - xMin)) * (w - m.l - m.r);
    const Y = (f) => m.t + ((yMax - lx(f)) / (yMax - yMin)) * (h - m.t - m.b);
    const xlab = svgEl("text", { x: m.l + (w - m.l - m.r) / 2, y: h - 6, "text-anchor": "middle", fill: "#8b9aab", "font-size": "10" });
    xlab.textContent = "RNA 48 h (log2 fold, Yuan)";
    svg.appendChild(xlab);
    const ylab = svgEl("text", { x: 12, y: m.t + (h - m.t - m.b) / 2, "text-anchor": "middle", fill: "#8b9aab", "font-size": "10", transform: `rotate(-90 12 ${m.t + (h - m.t - m.b) / 2})` });
    ylab.textContent = "protein 48 h (log2 fold, Akata TMT)";
    svg.appendChild(ylab);
    const diag = svgEl("line", {
      x1: X(2 ** xMin), y1: Y(2 ** xMin), x2: X(2 ** xMax), y2: Y(2 ** xMax),
      stroke: "#334155", "stroke-dasharray": "3 3",
    });
    svg.appendChild(diag);
    pts.forEach((p) => {
      const on = p.gene === highlight;
      const c = svgEl("circle", {
        cx: X(p.rna_fold_48h),
        cy: Y(p.akata_protein_fold_48h),
        r: on ? 5 : 3.2,
        fill: on ? "#5eb0ff" : "#6b7c8d",
        opacity: on ? 1 : 0.55,
        "data-gene": p.gene,
      });
      svg.appendChild(c);
    });
    svg.onclick = (ev) => {
      const t = ev.target;
      if (t && t.dataset && t.dataset.gene) togglePin(t.dataset.gene);
    };
    svg.onmousemove = (ev) => {
      const gene = ev.target && ev.target.dataset ? ev.target.dataset.gene : null;
      if (gene && gene !== state.hovered) {
        state.hovered = gene;
        renderListHover();
      }
    };
    svg.onmouseleave = () => {
      state.hovered = null;
      renderListHover();
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
      <h2>${g.gene} ${mismatch}</h2>
      <dl class="kv">
        <dt>Array</dt><dd class="cls-${g.class}">${g.class} · peak ${g.peak_fold.toFixed(1)}× at ${g.peak_hour} h</dd>
        ${cageBits}
        ${protBits}
        <dt>Oligo</dt><dd>nt ${g.probe_nt || "—"}</dd>
      </dl>
      <div class="mini-block">
        <h3>RNA vs protein vs hour</h3>
        <div id="spark-host"></div>
        <div class="legend-mini"><span class="rna">Yuan RNA</span><span class="p3">P3HR1 protein</span><span class="akata">Akata protein (0, 48 h)</span></div>
      </div>
      <div class="mini-block">
        <h3>48 h RNA vs Akata protein</h3>
        <div id="scatter-host"></div>
      </div>
      <table class="pts">
        <thead><tr><th>Hour</th><th>RNA fold</th><th>log2</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">Yuan RNA is Akata cytoplasmic fold vs 0 h. Ersing protein is TMT in gp350<sup>+</sup> cells (Akata anti-IgG 0 vs 48 h; P3HR1-ZHT/RHT 0/24/48/72 h) — not paired aliquots. Djavadian CAGE class is HEK293 at 48 h by DNA-replication dependence. ${rna48 && akF ? `At 48 h this gene is ${rna48.toFixed(1)}× RNA vs ${akF.toFixed(1)}× protein.` : ""} Nested lytic RNAs can look “early” on arrays while CAGE and protein are late (Djavadian Fig. 1).</p>`;
    drawAlignedSparklines($("#spark-host"), g);
    drawScatter($("#scatter-host"), name);
  }

  function render() {
    drawChart();
    renderList();
    if (state.hovered) showDetail(state.hovered);
    else if (state.pinned.size === 1) showDetail([...state.pinned][0]);
    else {
      $("#detail-body").innerHTML = `<p class="empty">Hover a faint line to identify it. Click to pin (color). Context: all 59 genes as ghosts + 10–90 percentile band and dashed median. Default pins are MultiCAST calibrators.</p>
        <div class="mini-block">
          <h3>48 h RNA vs Akata protein</h3>
          <p class="empty" style="margin:0 0 8px">Each point is one gene with both Yuan RNA and Ersing Akata TMT at 48 h. Diagonal = equal fold. IE RNAs often peak before 24 h, so 48 h RNA can look modest while protein is still high.</p>
          <div id="scatter-host"></div>
        </div>
        <p class="note">Pinned now: ${[...state.pinned].join(", ") || "none"}</p>`;
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
