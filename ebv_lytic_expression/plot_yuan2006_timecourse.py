#!/usr/bin/env python3
"""Plot Yuan et al. 2006 JVI Table 1 EBV RNA fold-changes.

Only genes with a complete measured series at 0, 4, 8, 12, 24, 48, and 72 h
are plotted. Signed fold values < 0 are converted to 1/|x| (Yuan's notation
for downregulation). Source: Yuan, Cahir-McFarland, Zhao, Kieff. J Virol
2006;80:2548-2565. Table 1, Akata + anti-IgG.
"""
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent
CSV = ROOT / "data" / "yuan2006_table1_curated.csv"
OUT = ROOT / "figures" / "yuan2006_ebv_lytic_rna_timecourse.png"

HOURS = [0, 4, 8, 12, 24, 48, 72]


def signed_to_linear(x: float) -> float:
    return float(x) if x > 0 else 1.0 / abs(float(x))


def main() -> None:
    df = pd.read_csv(CSV)
    wide = (
        df.pivot_table(index=["gene", "class"], columns="hours", values="signed_fold")
        .reindex(columns=HOURS)
    )
    if wide.isna().any().any():
        missing = wide[wide.isna().any(axis=1)]
        raise SystemExit(f"Incomplete series, not plotting those genes:\n{missing}")

    linear = wide.map(signed_to_linear)
    log2 = np.log2(linear)

    class_order = ["IE", "IE/E", "E", "L"]
    class_title = {
        "IE": "Immediate-early",
        "IE/E": "IE / early (BMLF1)",
        "E": "Early",
        "L": "Late",
    }
    # BMRF2 oligo also detects coterminal early BaRF1/BMRF1 (Yuan text) — keep
    # the line but exclude from the late class mean.
    mean_exclude = {("BMRF2", "L")}

    fig, axes = plt.subplots(2, 2, figsize=(11.5, 8.2), sharex=True, sharey=True)
    axes = axes.ravel()
    panel_map = {"IE": 0, "IE/E": 0, "E": 1, "L": 2}

    # Individual genes in three class panels
    for cls in ["IE", "IE/E", "E", "L"]:
        ax = axes[panel_map[cls]]
        sub = log2.xs(cls, level="class") if cls in log2.index.get_level_values("class") else None
        if sub is None:
            continue
        for gene, row in sub.iterrows():
            ax.plot(
                HOURS,
                row.values,
                marker="o",
                markersize=4,
                linewidth=1.35,
                label=gene,
            )
        ax.axhline(0, color="0.65", linewidth=0.8, linestyle=":")
        ax.set_title(class_title[cls] if cls != "IE/E" else "Immediate-early")
        ncol = 3 if cls in {"E", "L"} else 1
        ax.legend(fontsize=6.7, frameon=False, ncol=ncol, handlelength=1.4)
        ax.set_xticks(HOURS)

    # Class means (equalized genes only)
    ax = axes[3]
    colors = {"IE": "#d62728", "IE/E": "#d62728", "E": "#1f77b4", "L": "#2ca02c"}
    for cls, label in [("IE", "IE mean (BZLF1, BRLF1)"), ("IE/E", "BMLF1"), ("E", "Early mean"), ("L", "Late mean")]:
        if cls == "IE":
            rows = log2.loc[(["BZLF1", "BRLF1"], "IE"), :]
        elif cls == "IE/E":
            rows = log2.loc[(["BMLF1"], "IE/E"), :]
        else:
            idx = [i for i in log2.index if i[1] == cls and i not in mean_exclude]
            rows = log2.loc[idx]
        mean = rows.mean(axis=0)
        ax.plot(
            HOURS,
            mean.values,
            marker="o",
            markersize=5,
            linewidth=2.2,
            color=colors[cls],
            label=label + f" (n={len(rows)})",
        )
    ax.axhline(0, color="0.65", linewidth=0.8, linestyle=":")
    ax.set_title("Class means (same time points)")
    ax.legend(fontsize=8, frameon=False)
    ax.set_xticks(HOURS)

    for ax in axes:
        ax.set_xlim(-1, 76)
        ax.set_ylabel("log2 fold vs 0 h")
    for ax in (axes[2], axes[3]):
        ax.set_xlabel("Hours after anti-IgG (Akata)")

    fig.suptitle(
        "EBV lytic RNA kinetics (Yuan et al. 2006 Table 1)\n"
        "Akata + anti-IgG; only genes with measured values at every plotted hour",
        fontsize=12,
    )
    fig.tight_layout()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, dpi=180)
    print(f"Wrote {OUT}")
    print("Genes plotted:", sorted({i[0] for i in log2.index}))


if __name__ == "__main__":
    main()
