#!/usr/bin/env python3
"""Curate Djavadian 2018 CAGE classes + Ersing 2017 EBV protein TMT for the viewer.

Sources (do not redistribute the 7 MB Ersing workbook):
  Djavadian, Hayes, Johannsen. PLOS Pathog. 2018;14:e1007114. Table 2.
  Ersing et al. Cell Rep. 2017;19:1479–1493. Table S1 (gp350+ WCL TMT).
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ERSING_XLSX = Path("/tmp/ebv-supp/epmc/mmc2.xlsx")

# Djavadian et al. 2018 Table 2 (CAGE-seq TSS).
DJAV = [
    (1709, 1729, "+", "late", 0.00, 0.01, 25, "BNRF1", "major tegument protein"),
    (11330, 11349, "+", "latent", 1.02, 0.81, 184, "Cp", "latency promoter"),
    (53782, 53794, "+", "early", 0.81, 1.25, 758, "BHRF1", "v-Bcl2"),
    (58113, 58119, "+", "late", 0.00, 0.00, 22, "BFRF0.5", "terminase subunit"),
    (58581, 58593, "+", "early", 0.98, 1.18, 151, "BFRF0.5?", "terminase subunit"),
    (58860, 58867, "+", "late", 0.01, 0.00, 104, "BFRF1", "capsid nuclear egress"),
    (61372, 61381, "+", "late", 0.02, 0.00, 346, "BFRF3", "capsid hexon tip"),
    (62231, 62239, "+", "early", 1.18, 0.88, 78, "Fp", ""),
    (75047, 75054, "+", "leaky", 0.19, 0.05, 72, "BORF1", "capsid 1x triplex"),
    (76198, 76213, "+", "early", 1.05, 1.30, 161, "BORF2", "RNR large subunit"),
    (78831, 78840, "+", "early", 0.93, 1.26, 279, "BaRF1", "RNR small subunit"),
    (79869, 79874, "+", "early", 1.29, 1.31, 171, "BMRF1", "DNA polymerase processivity"),
    (80811, 80863, "+", "early", 0.64, 0.84, 158, "BMRF2", "virion glycoprotein"),
    (86914, 86917, "+", "early", 0.57, 0.24, 30, "BSRF1", "virion protein"),
    (88540, 88546, "+", "leaky", 0.36, 0.27, 66, "BLRF1", "glycoprotein N"),
    (88894, 88898, "+", "leaky", 0.10, 0.04, 366, "BLRF2", "tegument protein"),
    (105040, 105049, "+", "early", 0.98, 1.07, 200, "BRRF1", "Na"),
    (106271, 106278, "+", "leaky", 0.28, 0.34, 42, "BRRF2", "tegument protein"),
    (109934, 109941, "+", "leaky", 0.35, 0.57, 22, "BKRF2", "glycoprotein L"),
    (110175, 110180, "+", "early", 1.24, 1.04, 300, "BKRF3", "uracil DNA glycosylase"),
    (110924, 110929, "+", "early", 0.95, 1.18, 167, "BKRF4", "tegument protein"),
    (113906, 113915, "+", "leaky", 0.24, 0.14, 11, "BBRF1", "portal"),
    (115794, 115797, "+", "leaky", 0.47, 0.40, 6, "BBRF2", ""),
    (119129, 119134, "+", "leaky", 0.23, 0.29, 93, "BBRF3", "glycoprotein M"),
    (137247, 137251, "+", "leaky", 0.23, 2.20, 12, "BcRF1", "vTBP; vPIC component"),
    (144610, 144618, "+", "late", 0.01, 0.00, 5, "BXRF1", ""),
    (145333, 145340, "+", "early", 0.98, 0.63, 9, "BVRF1", "portal cork"),
    (147752, 147758, "+", "late", 0.02, 0.01, 16, "BVRF2", "scaffold protease"),
    (148650, 148655, "+", "leaky", 0.27, 0.26, 52, "BdRF1", "capsid scaffold"),
    (165497, 165499, "+", "early", 1.29, 1.06, 186, "BARF1", "CSF-1 decoy receptor"),
    (167605, 167603, "-", "early", 0.64, 2.41, 6, "BNLF2a", "TAP inhibitor"),
    (167499, 167485, "-", "early", 0.66, 0.21, 198, "BNLF2a/b", "TAP inhibitor/unknown"),
    (165414, 165410, "-", "early", 1.94, 0.87, 127, "BALF1", "putative vBcl-2"),
    (164786, 164778, "-", "early", 1.61, 0.86, 44, "BALF2", "ssDNA binding protein"),
    (161637, 161632, "-", "leaky", 0.46, 0.98, 9, "BALF3", "terminase subunit"),
    (159340, 159332, "-", "leaky", 0.34, 0.14, 50, "BALF4", "glycoprotein B"),
    (150544, 150530, "-", "late", 0.00, 0.00, 197, "BILF2", "vGPCR"),
    (148156, 148151, "-", "early", 1.08, 1.41, 16, "BVLF1", "vPIC component"),
    (145119, 145100, "-", "early", 0.90, 1.36, 196, "BXLF1", "thymidine kinase"),
    (143282, 143257, "-", "leaky", 0.13, 0.11, 20, "BXLF2", "glycoprotein H"),
    (137683, 137669, "-", "late", 0.00, 0.02, 70, "BcLF1", "major capsid protein"),
    (133323, 133316, "-", "late", 0.00, 0.00, 55, "BDLF1", "capsid 2x triplex"),
    (132448, 132441, "-", "late", 0.01, 0.33, 80, "BDLF2", "virion glycoprotein"),
    (131078, 131070, "-", "leaky", 0.15, 0.27, 89, "BDLF3", "gp150"),
    (129350, 129343, "-", "early", 1.29, 1.02, 38, "BDLF3.5", "vPIC component"),
    (128404, 128398, "-", "late", 0.04, 0.05, 3, "BGLF1", ""),
    (126902, 126893, "-", "late", 0.03, 0.01, 59, "BGLF2", "virion protein"),
    (125140, 125083, "-", "early", 0.72, 1.00, 19, "BGLF3", "vPIC component"),
    (124087, 124083, "-", "early", 0.73, 0.66, 34, "BGLF3.5", "vPIC component"),
    (123871, 123809, "-", "early", 1.21, 1.17, 94, "BGLF4", "protein kinase"),
    (122429, 122417, "-", "early", 1.34, 1.10, 95, "BGLF5", "alkaline exonuclease"),
    (121303, 121121, "-", "leaky", 0.50, 0.37, 111, "BBLF1", "myristoylated virion protein"),
    (119044, 119040, "-", "early", 1.25, 1.08, 203, "BBLF2/3", "helicase-primase accessory"),
    (114445, 114361, "-", "early", 1.05, 1.15, 74, "BBLF4", "helicase"),
    (106186, 106182, "-", "early", 1.07, 1.96, 5, "BRLF1", "Rta"),
    (102129, 102126, "-", "late", 0.02, 0.00, 210, "BZLF2", "gp42"),
    (92163, 92158, "-", "late", 0.00, 0.01, 171, "BLLF1", "gp350"),
    (90027, 90019, "-", "early", 1.11, 1.40, 133, "BLLF2", ""),
    (88489, 88480, "-", "early", 1.07, 1.16, 229, "BLLF3", "dUTPase"),
    (87030, 87023, "-", "early", 1.07, 1.16, 14, "BSLF1", "primase"),
    (84330, 84323, "-", "early", 1.05, 1.08, 969, "SM", "lytic RNA export (BMLF1)"),
    (75294, 75281, "-", "late", 0.01, 0.01, 6, "BOLF1", "tegument, binds BPLF1"),
    (72163, 72156, "-", "late", 0.00, 0.01, 5, "BPLF1", "largest tegument protein"),
    (58539, 58534, "-", "leaky", 0.19, 0.14, 6, "BFLF1", "packaging protein"),
    (57130, 57048, "-", "early", 0.79, 0.41, 187, "BFLF2", "capsid nuclear egress"),
    (52821, 52315, "-", "early", 0.51, 1.80, 65, "BHLF1", "OriLyt transcript"),
]

ORF_TO_YUAN = {
    "SM": "BMLF1",
    "BBLF2/3": "BBLF2",
    "BNLF2a/b": "BNLF2b",
}


def linear_fold(signed: float) -> float:
    return 1.0 / abs(signed) if signed < 0 else signed


def mean_pos(vals):
    xs = [float(v) for v in vals if v is not None and v != "" and float(v) > 0]
    if not xs:
        return None
    return sum(xs) / len(xs)


def load_yuan():
    genes = []
    seen = set()
    rna48 = {}
    with (ROOT / "data" / "yuan2006_table1_curated.csv").open() as f:
        for row in csv.DictReader(f):
            g = row["gene"]
            hr = int(float(row["hours"]))
            fold = linear_fold(float(row["signed_fold"]))
            if hr == 48:
                rna48[g] = fold
            if g not in seen:
                seen.add(g)
                genes.append({"gene": g, "class": row["class"]})
    return genes, rna48


def cage_for_yuan(yuan_names: set[str]) -> dict:
    best = {}
    for start, end, strand, kin, b2, b4, tpm, orf, ann in DJAV:
        gene = ORF_TO_YUAN.get(orf, orf)
        if gene not in yuan_names:
            continue
        rec = {
            "gene": gene,
            "orf": orf,
            "kinetics": kin,
            "balf2_ratio": b2,
            "bdlf4_ratio": b4,
            "wt_tpm": tpm,
            "annotation": ann,
            "vpic_independent_late": bool(kin == "late" and b4 >= 0.2),
        }
        prev = best.get(gene)
        if prev is None or tpm > prev["wt_tpm"]:
            best[gene] = rec
    return best


def load_ersing(yuan_names: set[str]) -> dict:
    import openpyxl

    alias = {
        "EBNA-LP": "EBNALP",
        "BDRF1": "BdRF1",
        "BdRF1": "BdRF1",
    }
    wb = openpyxl.load_workbook(ERSING_XLSX, read_only=True, data_only=True)
    ws = wb["Data"]
    proteins = {}
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        vals = list(row)
        sp = vals[2]
        if not sp or str(sp).upper() == "HUMAN":
            continue
        gs = vals[12]
        if not gs or str(gs).startswith("Frame"):
            continue
        gene = alias.get(gs, gs)
        if gene not in yuan_names:
            continue
        pep = [vals[14], vals[15], vals[16], vals[19]]
        pep_n = sum(1 for p in pep if p and p > 0)
        rec = {
            "gene": gene,
            "source_id": gs,
            "peptides_expts": pep_n,
            "p3hr1_hours": [0, 24, 48, 72],
            "p3hr1_signal": [
                mean_pos([vals[22], vals[32], vals[33], vals[42]]),
                mean_pos([vals[29], vals[39], vals[49]]),
                mean_pos([vals[30], vals[40], vals[50]]),
                mean_pos([vals[31], vals[41], vals[51]]),
            ],
            "akata_hours": [0, 48],
            "akata_signal": [
                mean_pos([vals[71], vals[72]]),
                mean_pos([vals[75], vals[76]]),
            ],
        }
        prev = proteins.get(gene)
        if prev is None or pep_n > prev["peptides_expts"]:
            proteins[gene] = rec
    return proteins


def fold(a, b):
    if a is None or b is None or a <= 0 or b <= 0:
        return None
    return b / a


def main():
    yuan, rna48 = load_yuan()
    names = {g["gene"] for g in yuan}
    cage = cage_for_yuan(names)
    prot = load_ersing(names)
    # BGRF1/BDRF1 is one spliced terminase; Yuan lists both oligos.
    if "BGRF1" in names and "BdRF1" in prot and "BGRF1" not in prot:
        shared = dict(prot["BdRF1"])
        shared["gene"] = "BGRF1"
        shared["source_id"] = prot["BdRF1"]["source_id"] + " (same ORF as BdRF1)"
        prot["BGRF1"] = shared

    genes = []
    for g in yuan:
        name = g["gene"]
        c = cage.get(name)
        p = prot.get(name)
        yuan_cls = g["class"]
        cage_kin = c["kinetics"] if c else None
        mismatch = False
        if cage_kin:
            # Compare Yuan array class vs CAGE DNA-replication class.
            y = yuan_cls
            if y in ("IE", "IE/E"):
                y_bin = "early"
            elif y == "E":
                y_bin = "early"
            elif y == "L":
                y_bin = "late"
            else:
                y_bin = None
            if y_bin and cage_kin in ("early", "leaky", "late"):
                if y_bin == "early" and cage_kin == "late":
                    mismatch = True
                if y_bin == "late" and cage_kin == "early":
                    mismatch = True
        ak_fold = None
        if p:
            ak_fold = fold(p["akata_signal"][0], p["akata_signal"][1])
        genes.append(
            {
                "gene": name,
                "yuan_class": yuan_cls,
                "cage": c,
                "protein": p,
                "array_vs_cage_mismatch": mismatch,
                "rna_fold_48h": rna48.get(name),
                "akata_protein_fold_48h": ak_fold,
            }
        )

    out = {
        "sources": [
            {
                "id": "yuan2006",
                "cite": "Yuan et al. J Virol 2006;80:2548–2565",
                "doi": "10.1128/JVI.80.5.2548-2565.2006",
                "note": "Akata + anti-IgG cytoplasmic RNA fold vs 0 h (Table 1).",
            },
            {
                "id": "djavadian2018",
                "cite": "Djavadian, Hayes, Johannsen. PLOS Pathog 2018;14:e1007114",
                "doi": "10.1371/journal.ppat.1007114",
                "note": "HEK293 CAGE-seq TSS class by DNA replication (BALF2) and vPIC (BDLF4), 48 h after Rta+Zta. Not a time series.",
            },
            {
                "id": "ersing2017",
                "cite": "Ersing, Nobre, Gewurz, Weekes et al. Cell Rep 2017;19:1479–1493",
                "doi": "10.1016/j.celrep.2017.04.062",
                "note": "TMT of gp350+ cells. Akata: 0 vs 48 h anti-IgG (same trigger as Yuan). P3HR1-ZHT/RHT: 0/24/48/72 h. Not paired with Yuan RNA aliquots. Protein temporal classes complement IE/E/L RNA (Ersing; Weekes et al. Cell 2014 CMV).",
            },
        ],
        "genes": genes,
    }

    js_path = ROOT / "web" / "cascade.data.js"
    js_path.write_text(
        "window.CASCADE = " + json.dumps(out, indent=2) + ";\n",
        encoding="utf-8",
    )

    csv_path = ROOT / "data" / "cascade_annotations.csv"
    with csv_path.open("w", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "gene",
                "yuan_class",
                "cage_kinetics",
                "balf2_ratio",
                "bdlf4_ratio",
                "wt_tpm",
                "array_vs_cage_mismatch",
                "rna_fold_48h",
                "akata_protein_fold_48h",
                "p3hr1_0",
                "p3hr1_24",
                "p3hr1_48",
                "p3hr1_72",
            ],
        )
        w.writeheader()
        for g in genes:
            c = g["cage"] or {}
            p = g["protein"] or {}
            sig = p.get("p3hr1_signal") or [None, None, None, None]
            w.writerow(
                {
                    "gene": g["gene"],
                    "yuan_class": g["yuan_class"],
                    "cage_kinetics": c.get("kinetics"),
                    "balf2_ratio": c.get("balf2_ratio"),
                    "bdlf4_ratio": c.get("bdlf4_ratio"),
                    "wt_tpm": c.get("wt_tpm"),
                    "array_vs_cage_mismatch": g["array_vs_cage_mismatch"],
                    "rna_fold_48h": g["rna_fold_48h"],
                    "akata_protein_fold_48h": g["akata_protein_fold_48h"],
                    "p3hr1_0": sig[0],
                    "p3hr1_24": sig[1],
                    "p3hr1_48": sig[2],
                    "p3hr1_72": sig[3],
                }
            )

    n_cage = sum(1 for g in genes if g["cage"])
    n_prot = sum(1 for g in genes if g["protein"])
    n_ak = sum(1 for g in genes if g["akata_protein_fold_48h"])
    n_mm = sum(1 for g in genes if g["array_vs_cage_mismatch"])
    print(f"wrote {js_path} and {csv_path}")
    print(f"genes={len(genes)} cage={n_cage} protein={n_prot} akata_48h_fold={n_ak} mismatches={n_mm}")
    print("mismatches:", [g["gene"] for g in genes if g["array_vs_cage_mismatch"]])


if __name__ == "__main__":
    main()
