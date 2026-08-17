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
    mean_exclude = {("BMRF2", "L")}

    fig, axes = plt.subplots(2, 2, figsize=(11.5, 8.2), sharex=True, sharey=True)
    axes = axes.ravel()
    highlight = {"BZLF1", "BRLF1", "BMLF1", "BMRF1", "BALF5", "BXLF1", "BLLF1", "BFRF3"}
    class_colors = {"IE": "#d62728", "IE/E": "#d62728", "E": "#1f77b4", "L": "#2ca02c", "LT": "#9467bd", "U": "#7f7f7f"}

    def plot_class(ax, classes, title, labeled=False):
        n = 0
        for cls in classes:
            if cls not in log2.index.get_level_values("class"):
                continue
            sub = log2.xs(cls, level="class")
            for gene, row in sub.iterrows():
                n += 1
                is_hi = gene in highlight
                ax.plot(
                    HOURS,
                    row.values,
                    marker="o" if is_hi else ".",
                    markersize=5 if is_hi else 3,
                    linewidth=1.8 if is_hi else 0.9,
                    alpha=1.0 if is_hi else 0.45,
                    color=class_colors.get(cls, "0.4"),
                    label=gene if (labeled or is_hi) else None,
                )
        ax.axhline(0, color="0.65", linewidth=0.8, linestyle=":")
        ax.set_title(f"{title} (n={n})")
        handles, labels = ax.get_legend_handles_labels()
        if labels:
            ax.legend(fontsize=7, frameon=False, ncol=2, handlelength=1.4)
        ax.set_xticks(HOURS)

    plot_class(axes[0], ["IE", "IE/E"], "Immediate-early", labeled=True)
    plot_class(axes[1], ["E"], "Early")
    plot_class(axes[2], ["L"], "Late")

    ax = axes[3]
    for cls, label in [("IE", "IE mean"), ("E", "Early mean"), ("L", "Late mean"), ("LT", "Latent mean")]:
        idx = [i for i in log2.index if i[1] == cls and i not in mean_exclude]
        if cls == "IE":
            idx = [i for i in log2.index if i[1] in {"IE", "IE/E"}]
        if not idx:
            continue
        rows = log2.loc[idx]
        ax.plot(
            HOURS,
            rows.mean(axis=0).values,
            marker="o",
            markersize=5,
            linewidth=2.2,
            color=class_colors.get(cls, "C0"),
            label=f"{label} (n={len(rows)})",
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
