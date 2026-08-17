(() => {
  const DATA = window.YUAN2006;
  const HOURS = DATA.hours;
  const GENES = DATA.genes;
  const BY_NAME = Object.fromEntries(GENES.map((g) => [g.gene, g]));

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
    search: "",
  };

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
        tip.innerHTML = `<strong>${g.gene}</strong> · ${g.class}<br>${hr} h → ${fold.toFixed(1)}× vs 0 h`;
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
      row.innerHTML = `
        <span class="swatch" style="background:${state.pinned.has(g.gene) ? colorFor(g.gene) : "#3a4654"}"></span>
        <span class="name">${g.gene}</span>
        <span class="meta cls-${g.class}">${g.class} · pk ${g.peak_hour}h</span>`;
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

  function showDetail(name) {
    const g = BY_NAME[name];
    const el = $("#detail-body");
    if (!g) {
      el.innerHTML = `<p class="empty">Hover a line or pin a gene. Faint traces are the other 59 RNAs (10–90% band = typical range).</p>`;
      return;
    }
    const peakMark = g.peak_hour;
    const rows = g.hours
      .map(
        (hr, i) =>
          `<tr class="${hr === peakMark ? "peak" : ""}"><td>${hr} h</td><td>${g.linear_fold[i].toFixed(1)}×</td><td>${Math.log2(Math.max(g.linear_fold[i], 1e-6)).toFixed(2)}</td></tr>`
      )
      .join("");
    el.innerHTML = `
      <h2>${g.gene}</h2>
      <dl class="kv">
        <dt>Class</dt><dd class="cls-${g.class}">${g.class}</dd>
        <dt>Peak</dt><dd>${g.peak_fold.toFixed(1)}× at ${g.peak_hour} h</dd>
        <dt>Oligo</dt><dd>nt ${g.probe_nt || "—"}</dd>
        <dt>Pinned</dt><dd>${state.pinned.has(g.gene) ? "yes — click to unpin" : "no — click list/line to pin"}</dd>
      </dl>
      <table class="pts">
        <thead><tr><th>Hour</th><th>Fold</th><th>log2</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">${g.source_note}. Yuan signed-fold converted to linear (negatives inverted). Missing Table 1 genes are not shown.</p>`;
  }

  function render() {
    drawChart();
    renderList();
    if (state.hovered) showDetail(state.hovered);
    else if (state.pinned.size === 1) showDetail([...state.pinned][0]);
    else {
      $("#detail-body").innerHTML = `<p class="empty">Hover a faint line to identify it. Click to pin (color). Context: all 59 genes as ghosts + 10–90 percentile band and dashed median. Default pins are MultiCAST calibrators.</p>
        <p class="note">Pinned now: ${[...state.pinned].join(", ") || "none"}</p>`;
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
