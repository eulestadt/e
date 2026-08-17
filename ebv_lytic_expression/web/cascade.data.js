window.CASCADE = {
  "sources": [
    {
      "id": "yuan2006",
      "cite": "Yuan et al. J Virol 2006;80:2548\u20132565",
      "doi": "10.1128/JVI.80.5.2548-2565.2006",
      "note": "Akata + anti-IgG cytoplasmic RNA fold vs 0 h (Table 1)."
    },
    {
      "id": "djavadian2018",
      "cite": "Djavadian, Hayes, Johannsen. PLOS Pathog 2018;14:e1007114",
      "doi": "10.1371/journal.ppat.1007114",
      "note": "HEK293 CAGE-seq TSS class by DNA replication (BALF2) and vPIC (BDLF4), 48 h after Rta+Zta. Not a time series."
    },
    {
      "id": "ersing2017",
      "cite": "Ersing, Nobre, Gewurz, Weekes et al. Cell Rep 2017;19:1479\u20131493",
      "doi": "10.1016/j.celrep.2017.04.062",
      "note": "TMT of gp350+ cells. Akata: 0 vs 48 h anti-IgG (same trigger as Yuan). P3HR1-ZHT/RHT: 0/24/48/72 h. Not paired with Yuan RNA aliquots. Protein temporal classes complement IE/E/L RNA (Ersing; Weekes et al. Cell 2014 CMV)."
    }
  ],
  "genes": [
    {
      "gene": "BZLF1",
      "yuan_class": "IE",
      "cage": null,
      "protein": {
        "gene": "BZLF1",
        "source_id": "BZLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1721.4980103744163,
          8614.317606351688,
          7959.466777134119,
          7253.485789061975
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          175.82785196361098,
          9455.35080523755
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 2.9,
      "akata_protein_fold_48h": 53.77618335003269
    },
    {
      "gene": "BRLF1",
      "yuan_class": "IE",
      "cage": {
        "gene": "BRLF1",
        "orf": "BRLF1",
        "kinetics": "early",
        "balf2_ratio": 1.07,
        "bdlf4_ratio": 1.96,
        "wt_tpm": 5,
        "annotation": "Rta",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BRLF1",
        "source_id": "BRLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          3892.9515323079204,
          18710.429463627093,
          19458.343778807168,
          13275.583522788613
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          150.77874716031127,
          951.8930624602408
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 2.7,
      "akata_protein_fold_48h": 6.313177953708339
    },
    {
      "gene": "BMLF1",
      "yuan_class": "IE/E",
      "cage": {
        "gene": "BMLF1",
        "orf": "SM",
        "kinetics": "early",
        "balf2_ratio": 1.05,
        "bdlf4_ratio": 1.08,
        "wt_tpm": 969,
        "annotation": "lytic RNA export (BMLF1)",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BMLF1",
        "source_id": "BMLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1118.043411533191,
          20711.139079680386,
          18466.417979360485,
          17548.891729126233
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          605.915771968321,
          24224.801903213985
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 3.9,
      "akata_protein_fold_48h": 39.98047752498598
    },
    {
      "gene": "BCRF2",
      "yuan_class": "U",
      "cage": null,
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.0,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "EBNALP",
      "yuan_class": "LT",
      "cage": null,
      "protein": {
        "gene": "EBNALP",
        "source_id": "EBNA-LP",
        "peptides_expts": 3,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          197.39527534434723,
          125.1459175048711,
          128.26840782962338,
          131.4748143896989
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          null,
          null
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.1,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "EBNA2",
      "yuan_class": "LT",
      "cage": null,
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.4,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BHLF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BHLF1",
        "orf": "BHLF1",
        "kinetics": "early",
        "balf2_ratio": 0.51,
        "bdlf4_ratio": 1.8,
        "wt_tpm": 65,
        "annotation": "OriLyt transcript",
        "vpic_independent_late": false
      },
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 8.4,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BHRF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BHRF1",
        "orf": "BHRF1",
        "kinetics": "early",
        "balf2_ratio": 0.81,
        "bdlf4_ratio": 1.25,
        "wt_tpm": 758,
        "annotation": "v-Bcl2",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BHRF1",
        "source_id": "BHRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          187.40820431979338,
          971.9500718486142,
          1122.673898869493,
          880.8664880031293
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          80.0818049257515,
          1395.1112564115456
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.2,
      "akata_protein_fold_48h": 17.421076581690865
    },
    {
      "gene": "BFLF2",
      "yuan_class": "E",
      "cage": {
        "gene": "BFLF2",
        "orf": "BFLF2",
        "kinetics": "early",
        "balf2_ratio": 0.79,
        "bdlf4_ratio": 0.41,
        "wt_tpm": 187,
        "annotation": "capsid nuclear egress",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BFLF2",
        "source_id": "BFLF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          582.6229785251097,
          13068.728066602474,
          15110.961140950376,
          8238.065800037342
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          8.759662674357276,
          1958.073835390964
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 7.1,
      "akata_protein_fold_48h": 223.5330181289925
    },
    {
      "gene": "BFLF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BFLF1",
        "orf": "BFLF1",
        "kinetics": "leaky",
        "balf2_ratio": 0.19,
        "bdlf4_ratio": 0.14,
        "wt_tpm": 6,
        "annotation": "packaging protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BFLF1",
        "source_id": "BFLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          682.9660528514127,
          16219.48509345272,
          13458.210173855177,
          10784.936179236305
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          126.86963634460379,
          3206.924896982355
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 2.9,
      "akata_protein_fold_48h": 25.277323947486487
    },
    {
      "gene": "BFRF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BFRF1",
        "orf": "BFRF1",
        "kinetics": "late",
        "balf2_ratio": 0.01,
        "bdlf4_ratio": 0.0,
        "wt_tpm": 104,
        "annotation": "capsid nuclear egress",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BFRF1",
        "source_id": "BFRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          944.6491404856235,
          27821.2763042337,
          37656.18890638144,
          27294.063061921497
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          283.68561059544254,
          19890.861304652375
        ]
      },
      "array_vs_cage_mismatch": true,
      "rna_fold_48h": 6.9,
      "akata_protein_fold_48h": 70.11586263717221
    },
    {
      "gene": "BFRF2",
      "yuan_class": "E",
      "cage": null,
      "protein": {
        "gene": "BFRF2",
        "source_id": "BFRF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          89.74464346378407,
          1216.4376272078232,
          943.0104247847609,
          746.0802965438169
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          18.075400127208205,
          348.78107002376214
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.5,
      "akata_protein_fold_48h": 19.295897604986095
    },
    {
      "gene": "BFRF3",
      "yuan_class": "L",
      "cage": {
        "gene": "BFRF3",
        "orf": "BFRF3",
        "kinetics": "late",
        "balf2_ratio": 0.02,
        "bdlf4_ratio": 0.0,
        "wt_tpm": 346,
        "annotation": "capsid hexon tip",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BFRF3",
        "source_id": "BFRF3",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          267.0362089470794,
          6528.142529109496,
          7524.251546413748,
          3837.6467332476586
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          233.5817930861307,
          7892.826345521102
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.1,
      "akata_protein_fold_48h": 33.79041765729878
    },
    {
      "gene": "BPLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BPLF1",
        "orf": "BPLF1",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.01,
        "wt_tpm": 5,
        "annotation": "largest tegument protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BPLF1",
        "source_id": "BPLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          900.2261601671016,
          26767.601751902752,
          25298.120278528804,
          14904.448466266074
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          907.2192628656851,
          26739.651983677657
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.0,
      "akata_protein_fold_48h": 29.474299188945345
    },
    {
      "gene": "BNRF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BNRF1",
        "orf": "BNRF1",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.01,
        "wt_tpm": 25,
        "annotation": "major tegument protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BNRF1",
        "source_id": "BNRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          2118.173945119397,
          50543.07710223947,
          55012.832782847494,
          38059.186334098
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          1787.8261693028517,
          38954.88650616296
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.8,
      "akata_protein_fold_48h": 21.78896761610392
    },
    {
      "gene": "BOLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BOLF1",
        "orf": "BOLF1",
        "kinetics": "late",
        "balf2_ratio": 0.01,
        "bdlf4_ratio": 0.01,
        "wt_tpm": 6,
        "annotation": "tegument, binds BPLF1",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BOLF1",
        "source_id": "BOLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          653.6831261468536,
          8771.241532542383,
          9193.860201766931,
          5755.137625336311
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          15.571442439868743,
          1142.701677788862
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 2.3,
      "akata_protein_fold_48h": 73.38444605896731
    },
    {
      "gene": "BORF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BORF1",
        "orf": "BORF1",
        "kinetics": "leaky",
        "balf2_ratio": 0.19,
        "bdlf4_ratio": 0.05,
        "wt_tpm": 72,
        "annotation": "capsid 1x triplex",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BORF1",
        "source_id": "BORF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          196.7258753186157,
          9137.580973773622,
          9055.619594918187,
          6090.562625906503
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          571.9393802943798,
          13279.55406883733
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.7,
      "akata_protein_fold_48h": 23.2184642750116
    },
    {
      "gene": "BORF2",
      "yuan_class": "E",
      "cage": {
        "gene": "BORF2",
        "orf": "BORF2",
        "kinetics": "early",
        "balf2_ratio": 1.05,
        "bdlf4_ratio": 1.3,
        "wt_tpm": 161,
        "annotation": "RNR large subunit",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BORF2",
        "source_id": "BORF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          3409.086866823235,
          64706.79887901229,
          80510.51578554424,
          55444.094771368305
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          806.1079320290271,
          29482.31759139034
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.6,
      "akata_protein_fold_48h": 36.57366020103709
    },
    {
      "gene": "BaRF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BaRF1",
        "orf": "BaRF1",
        "kinetics": "early",
        "balf2_ratio": 0.93,
        "bdlf4_ratio": 1.26,
        "wt_tpm": 279,
        "annotation": "RNR small subunit",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BaRF1",
        "source_id": "BaRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1182.0168176776606,
          25905.108551986123,
          28473.996988222698,
          18598.288950549937
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          381.7425557231635,
          14358.500144690139
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.5,
      "akata_protein_fold_48h": 37.61304557069818
    },
    {
      "gene": "BMRF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BMRF1",
        "orf": "BMRF1",
        "kinetics": "early",
        "balf2_ratio": 1.29,
        "bdlf4_ratio": 1.31,
        "wt_tpm": 171,
        "annotation": "DNA polymerase processivity",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BMRF1",
        "source_id": "BMRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          3351.8745954638543,
          93934.42023041705,
          101166.29829710566,
          70999.77291070136
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          1244.0207557697986,
          48819.55344842439
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.3,
      "akata_protein_fold_48h": 39.243359262293744
    },
    {
      "gene": "BMRF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BMRF2",
        "orf": "BMRF2",
        "kinetics": "early",
        "balf2_ratio": 0.64,
        "bdlf4_ratio": 0.84,
        "wt_tpm": 158,
        "annotation": "virion glycoprotein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BMRF2",
        "source_id": "BMRF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          60.80424435979389,
          3332.2007575659827,
          3135.385774862305,
          2096.290061564052
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          66.61248119709323,
          1172.473430906624
        ]
      },
      "array_vs_cage_mismatch": true,
      "rna_fold_48h": 5.2,
      "akata_protein_fold_48h": 17.60140757161568
    },
    {
      "gene": "BLLF3",
      "yuan_class": "E",
      "cage": {
        "gene": "BLLF3",
        "orf": "BLLF3",
        "kinetics": "early",
        "balf2_ratio": 1.07,
        "bdlf4_ratio": 1.16,
        "wt_tpm": 229,
        "annotation": "dUTPase",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BLLF3",
        "source_id": "BLLF3",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1507.2840354413597,
          23611.975257225957,
          20415.51876290559,
          16366.506525300196
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          594.9201700700157,
          17515.69816465279
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.8,
      "akata_protein_fold_48h": 29.4420983618548
    },
    {
      "gene": "BLRF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BLRF1",
        "orf": "BLRF1",
        "kinetics": "leaky",
        "balf2_ratio": 0.36,
        "bdlf4_ratio": 0.27,
        "wt_tpm": 66,
        "annotation": "glycoprotein N",
        "vpic_independent_late": false
      },
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.0,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BLRF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BLRF2",
        "orf": "BLRF2",
        "kinetics": "leaky",
        "balf2_ratio": 0.1,
        "bdlf4_ratio": 0.04,
        "wt_tpm": 366,
        "annotation": "tegument protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BLRF2",
        "source_id": "BLRF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          823.4833849567792,
          21327.15585027052,
          25040.793807449372,
          13787.665191577524
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          718.3670317192668,
          38273.53820525814
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.0,
      "akata_protein_fold_48h": 53.27852826661343
    },
    {
      "gene": "BLLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BLLF1",
        "orf": "BLLF1",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.01,
        "wt_tpm": 171,
        "annotation": "gp350",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BLLF1",
        "source_id": "BLLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          117.98232893787674,
          4655.958111286784,
          3517.2959713633086,
          1461.0196518834755
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          20.69856100206843,
          2728.9306327916356
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.0,
      "akata_protein_fold_48h": 131.84156292405692
    },
    {
      "gene": "BZLF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BZLF2",
        "orf": "BZLF2",
        "kinetics": "late",
        "balf2_ratio": 0.02,
        "bdlf4_ratio": 0.0,
        "wt_tpm": 210,
        "annotation": "gp42",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BZLF2",
        "source_id": "BZLF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          125.88176642044414,
          8311.340377783066,
          6542.447313393052,
          4399.4503775069925
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          34.810907758187234,
          4316.5373693600495
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.1,
      "akata_protein_fold_48h": 123.99956356624558
    },
    {
      "gene": "BRRF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BRRF1",
        "orf": "BRRF1",
        "kinetics": "early",
        "balf2_ratio": 0.98,
        "bdlf4_ratio": 1.07,
        "wt_tpm": 200,
        "annotation": "Na",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BRRF1",
        "source_id": "BRRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          454.05242734650886,
          10925.946459097082,
          10864.07478260522,
          8898.74689775177
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          161.30604381657474,
          7679.971505274759
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.2,
      "akata_protein_fold_48h": 47.61118259157017
    },
    {
      "gene": "BRRF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BRRF2",
        "orf": "BRRF2",
        "kinetics": "leaky",
        "balf2_ratio": 0.28,
        "bdlf4_ratio": 0.34,
        "wt_tpm": 42,
        "annotation": "tegument protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BRRF2",
        "source_id": "BRRF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          524.5180602266361,
          6970.15542282054,
          5975.352597770237,
          3249.1383536006288
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          281.06571898313496,
          7741.863495998093
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.7,
      "akata_protein_fold_48h": 27.54467362297796
    },
    {
      "gene": "BKRF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BKRF2",
        "orf": "BKRF2",
        "kinetics": "leaky",
        "balf2_ratio": 0.35,
        "bdlf4_ratio": 0.57,
        "wt_tpm": 22,
        "annotation": "glycoprotein L",
        "vpic_independent_late": false
      },
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.4,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BKRF3",
      "yuan_class": "E",
      "cage": {
        "gene": "BKRF3",
        "orf": "BKRF3",
        "kinetics": "early",
        "balf2_ratio": 1.24,
        "bdlf4_ratio": 1.04,
        "wt_tpm": 300,
        "annotation": "uracil DNA glycosylase",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BKRF3",
        "source_id": "BKRF3",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          667.7150036591482,
          13987.342736216577,
          12275.623414045096,
          10838.878578501366
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          103.29242114069939,
          7591.855995136911
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 7.0,
      "akata_protein_fold_48h": 73.4986740682135
    },
    {
      "gene": "BKRF4",
      "yuan_class": "L",
      "cage": {
        "gene": "BKRF4",
        "orf": "BKRF4",
        "kinetics": "early",
        "balf2_ratio": 0.95,
        "bdlf4_ratio": 1.18,
        "wt_tpm": 167,
        "annotation": "tegument protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BKRF4",
        "source_id": "BKRF4",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          595.3532192635923,
          10072.547800361312,
          4938.332966473789,
          3030.6506740081063
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          93.07708807357554,
          7932.566727174516
        ]
      },
      "array_vs_cage_mismatch": true,
      "rna_fold_48h": 4.5,
      "akata_protein_fold_48h": 85.22577243611214
    },
    {
      "gene": "BBLF4",
      "yuan_class": "E",
      "cage": {
        "gene": "BBLF4",
        "orf": "BBLF4",
        "kinetics": "early",
        "balf2_ratio": 1.05,
        "bdlf4_ratio": 1.15,
        "wt_tpm": 74,
        "annotation": "helicase",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BBLF4",
        "source_id": "BBLF4",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          469.5038404531729,
          9058.059942703729,
          7520.561492362565,
          5015.868806643393
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          296.7901669082353,
          4048.1804530711192
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 3.8,
      "akata_protein_fold_48h": 13.639873905670125
    },
    {
      "gene": "BBRF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BBRF1",
        "orf": "BBRF1",
        "kinetics": "leaky",
        "balf2_ratio": 0.24,
        "bdlf4_ratio": 0.14,
        "wt_tpm": 11,
        "annotation": "portal",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BBRF1",
        "source_id": "BBRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          429.13448978495325,
          15970.267575423997,
          11325.524454051354,
          6882.567562874928
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          66.92418031769714,
          5146.818706136974
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.8,
      "akata_protein_fold_48h": 76.90521843830444
    },
    {
      "gene": "BBRF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BBRF2",
        "orf": "BBRF2",
        "kinetics": "leaky",
        "balf2_ratio": 0.47,
        "bdlf4_ratio": 0.4,
        "wt_tpm": 6,
        "annotation": "",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BBRF2",
        "source_id": "BBRF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          399.03284191895983,
          13612.302464607079,
          11687.85652517985,
          8199.791607044548
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          109.75505234644513,
          6364.2005930374235
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.4,
      "akata_protein_fold_48h": 57.98549093620431
    },
    {
      "gene": "BBLF2",
      "yuan_class": "E",
      "cage": {
        "gene": "BBLF2",
        "orf": "BBLF2/3",
        "kinetics": "early",
        "balf2_ratio": 1.25,
        "bdlf4_ratio": 1.08,
        "wt_tpm": 203,
        "annotation": "helicase-primase accessory",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BBLF2",
        "source_id": "BBLF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          800.7080075823174,
          12442.079456506193,
          8373.948939705808,
          6821.052847250008
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          238.94045958464702,
          3618.0788176136193
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.0,
      "akata_protein_fold_48h": 15.142177360430995
    },
    {
      "gene": "BBRF3",
      "yuan_class": "L",
      "cage": {
        "gene": "BBRF3",
        "orf": "BBRF3",
        "kinetics": "leaky",
        "balf2_ratio": 0.23,
        "bdlf4_ratio": 0.29,
        "wt_tpm": 93,
        "annotation": "glycoprotein M",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BBRF3",
        "source_id": "BBRF3",
        "peptides_expts": 1,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          47.85762720099955,
          517.4173297939403,
          824.068376627544,
          437.1601982593972
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          null,
          null
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.0,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BGLF5",
      "yuan_class": "E",
      "cage": {
        "gene": "BGLF5",
        "orf": "BGLF5",
        "kinetics": "early",
        "balf2_ratio": 1.34,
        "bdlf4_ratio": 1.1,
        "wt_tpm": 95,
        "annotation": "alkaline exonuclease",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BGLF5",
        "source_id": "BGLF5",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          759.2330745268569,
          14638.814278089556,
          15108.998829302318,
          12835.925869413235
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          235.71096525325248,
          8714.790656867559
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.0,
      "akata_protein_fold_48h": 36.97235997274975
    },
    {
      "gene": "BGLF3",
      "yuan_class": "U",
      "cage": {
        "gene": "BGLF3",
        "orf": "BGLF3",
        "kinetics": "early",
        "balf2_ratio": 0.72,
        "bdlf4_ratio": 1.0,
        "wt_tpm": 19,
        "annotation": "vPIC component",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BGLF3",
        "source_id": "BGLF3",
        "peptides_expts": 3,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          49.70861582999995,
          1626.1255743990907,
          628.5205345423451,
          636.1578077480598
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          null,
          null
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.7,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BGRF1",
      "yuan_class": "L",
      "cage": null,
      "protein": {
        "gene": "BGRF1",
        "source_id": "BDRF1 (same ORF as BdRF1)",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          207.71137786029803,
          3159.3389411952194,
          2162.7374530031793,
          1630.5414112201327
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          62.1353472453314,
          1057.8284277212028
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.2,
      "akata_protein_fold_48h": 17.024583825765674
    },
    {
      "gene": "BGLF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BGLF2",
        "orf": "BGLF2",
        "kinetics": "late",
        "balf2_ratio": 0.03,
        "bdlf4_ratio": 0.01,
        "wt_tpm": 59,
        "annotation": "virion protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BGLF2",
        "source_id": "BGLF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          238.1181253213751,
          10801.134285954902,
          11074.278100373906,
          7080.017671715101
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          232.3629352356394,
          11076.755370635743
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.2,
      "akata_protein_fold_48h": 47.67006131766582
    },
    {
      "gene": "BGLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BGLF1",
        "orf": "BGLF1",
        "kinetics": "late",
        "balf2_ratio": 0.04,
        "bdlf4_ratio": 0.05,
        "wt_tpm": 3,
        "annotation": "",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BGLF1",
        "source_id": "BGLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          52.84229557095584,
          4301.473548925015,
          2022.1355356983238,
          1939.5291788515572
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          94.7733907924853,
          2291.335005192447
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 3.8,
      "akata_protein_fold_48h": 24.17698666294981
    },
    {
      "gene": "BDLF4",
      "yuan_class": "E",
      "cage": null,
      "protein": {
        "gene": "BDLF4",
        "source_id": "BDLF4",
        "peptides_expts": 3,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          16.321331943115784,
          715.338398389017,
          226.78510110250681,
          260.9470724115835
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          null,
          null
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.5,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BDLF3",
      "yuan_class": "L",
      "cage": {
        "gene": "BDLF3",
        "orf": "BDLF3",
        "kinetics": "leaky",
        "balf2_ratio": 0.15,
        "bdlf4_ratio": 0.27,
        "wt_tpm": 89,
        "annotation": "gp150",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BDLF3",
        "source_id": "BDLF3",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          47.719333969964595,
          1966.7808846964817,
          1818.7422386735027,
          1757.461136676734
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          22.488366275585204,
          2021.6066001073089
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.8,
      "akata_protein_fold_48h": 89.89566317683527
    },
    {
      "gene": "BDLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BDLF1",
        "orf": "BDLF1",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.0,
        "wt_tpm": 55,
        "annotation": "capsid 2x triplex",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BDLF1",
        "source_id": "BDLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          87.78379978662831,
          4334.384274453511,
          3676.6681177737814,
          3105.5652217825386
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          57.61065044139175,
          9851.424145286723
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 7.5,
      "akata_protein_fold_48h": 171.0000506817526
    },
    {
      "gene": "BcLF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BcLF1",
        "orf": "BcLF1",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.02,
        "wt_tpm": 70,
        "annotation": "major capsid protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BcLF1",
        "source_id": "BcLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          2026.7260124753097,
          80634.9995375006,
          82155.32866078157,
          41668.28890225705
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          1336.3323245765023,
          38862.40250990508
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.0,
      "akata_protein_fold_48h": 29.081390755268142
    },
    {
      "gene": "BXLF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BXLF2",
        "orf": "BXLF2",
        "kinetics": "leaky",
        "balf2_ratio": 0.13,
        "bdlf4_ratio": 0.11,
        "wt_tpm": 20,
        "annotation": "glycoprotein H",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BXLF2",
        "source_id": "BXLF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          358.53842306985894,
          14721.86001175418,
          10788.018601726244,
          7692.606578019396
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          165.61353064808787,
          13898.094407588915
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.3,
      "akata_protein_fold_48h": 83.9188341266691
    },
    {
      "gene": "BXLF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BXLF1",
        "orf": "BXLF1",
        "kinetics": "early",
        "balf2_ratio": 0.9,
        "bdlf4_ratio": 1.36,
        "wt_tpm": 196,
        "annotation": "thymidine kinase",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BXLF1",
        "source_id": "BXLF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1807.9242369301737,
          40094.90695766085,
          44120.549777003886,
          32365.356543791717
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          371.7724269327068,
          13000.011842334132
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.1,
      "akata_protein_fold_48h": 34.967660053732864
    },
    {
      "gene": "BVRF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BVRF1",
        "orf": "BVRF1",
        "kinetics": "early",
        "balf2_ratio": 0.98,
        "bdlf4_ratio": 0.63,
        "wt_tpm": 9,
        "annotation": "portal cork",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BVRF1",
        "source_id": "BVRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          127.3291265241181,
          3796.1434433722693,
          3033.5885381830144,
          2289.696605503456
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          175.80979211368305,
          1806.783059174373
        ]
      },
      "array_vs_cage_mismatch": true,
      "rna_fold_48h": 3.9,
      "akata_protein_fold_48h": 10.276919376629838
    },
    {
      "gene": "BdRF1",
      "yuan_class": "L",
      "cage": {
        "gene": "BdRF1",
        "orf": "BdRF1",
        "kinetics": "leaky",
        "balf2_ratio": 0.27,
        "bdlf4_ratio": 0.26,
        "wt_tpm": 52,
        "annotation": "capsid scaffold",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BdRF1",
        "source_id": "BDRF1",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          207.71137786029803,
          3159.3389411952194,
          2162.7374530031793,
          1630.5414112201327
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          62.1353472453314,
          1057.8284277212028
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.8,
      "akata_protein_fold_48h": 17.024583825765674
    },
    {
      "gene": "BILF2",
      "yuan_class": "L",
      "cage": {
        "gene": "BILF2",
        "orf": "BILF2",
        "kinetics": "late",
        "balf2_ratio": 0.0,
        "bdlf4_ratio": 0.0,
        "wt_tpm": 197,
        "annotation": "vGPCR",
        "vpic_independent_late": false
      },
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.4,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "LF3",
      "yuan_class": "E",
      "cage": null,
      "protein": {
        "gene": "LF3",
        "source_id": "LF3",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          87.09784370343142,
          3759.093805409188,
          5685.734563638027,
          3236.9842632309033
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          34.58585048248152,
          1683.6171170695413
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 7.6,
      "akata_protein_fold_48h": 48.67936146090523
    },
    {
      "gene": "LF2",
      "yuan_class": "U",
      "cage": null,
      "protein": {
        "gene": "LF2",
        "source_id": "LF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          548.5048503096889,
          8218.232396820327,
          8850.700936072275,
          6644.194330454132
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          150.2881649537576,
          2176.140661795155
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 5.0,
      "akata_protein_fold_48h": 14.479787297055198
    },
    {
      "gene": "BALF5",
      "yuan_class": "E",
      "cage": null,
      "protein": {
        "gene": "BALF5",
        "source_id": "BALF5",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1900.630432058125,
          53786.612955552504,
          47468.7565461183,
          39820.1948397717
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          727.642398888513,
          42662.55639007465
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.3,
      "akata_protein_fold_48h": 58.63121288045128
    },
    {
      "gene": "BALF4",
      "yuan_class": "L",
      "cage": {
        "gene": "BALF4",
        "orf": "BALF4",
        "kinetics": "leaky",
        "balf2_ratio": 0.34,
        "bdlf4_ratio": 0.14,
        "wt_tpm": 50,
        "annotation": "glycoprotein B",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BALF4",
        "source_id": "BALF4",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          1206.6516800565844,
          31953.16326047129,
          33829.62016869923,
          19939.59503355081
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          312.2119083156407,
          19029.812877433615
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.8,
      "akata_protein_fold_48h": 60.95159207763085
    },
    {
      "gene": "BALF2",
      "yuan_class": "E",
      "cage": {
        "gene": "BALF2",
        "orf": "BALF2",
        "kinetics": "early",
        "balf2_ratio": 1.61,
        "bdlf4_ratio": 0.86,
        "wt_tpm": 44,
        "annotation": "ssDNA binding protein",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BALF2",
        "source_id": "BALF2",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          5002.303911305815,
          133262.63508577223,
          141567.88820678883,
          84569.68154389622
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          1979.7477348089683,
          76925.12453281754
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.9,
      "akata_protein_fold_48h": 38.85602351263216
    },
    {
      "gene": "BALF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BALF1",
        "orf": "BALF1",
        "kinetics": "early",
        "balf2_ratio": 1.94,
        "bdlf4_ratio": 0.87,
        "wt_tpm": 127,
        "annotation": "putative vBcl-2",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BALF1",
        "source_id": "BALF1",
        "peptides_expts": 3,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          51.39207835234844,
          717.7399015555088,
          372.79196640977,
          260.130519518773
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          34.38184387892331,
          265.4657170973202
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.4,
      "akata_protein_fold_48h": 7.721101812694095
    },
    {
      "gene": "BARF1",
      "yuan_class": "E",
      "cage": {
        "gene": "BARF1",
        "orf": "BARF1",
        "kinetics": "early",
        "balf2_ratio": 1.29,
        "bdlf4_ratio": 1.06,
        "wt_tpm": 186,
        "annotation": "CSF-1 decoy receptor",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BARF1",
        "source_id": "BARF1",
        "peptides_expts": 3,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          15.155135472177104,
          900.4465132908363,
          957.0717603505724,
          647.0451533741186
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          null,
          null
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 3.8,
      "akata_protein_fold_48h": null
    },
    {
      "gene": "BNLF2b",
      "yuan_class": "E",
      "cage": {
        "gene": "BNLF2b",
        "orf": "BNLF2a/b",
        "kinetics": "early",
        "balf2_ratio": 0.66,
        "bdlf4_ratio": 0.21,
        "wt_tpm": 198,
        "annotation": "TAP inhibitor/unknown",
        "vpic_independent_late": false
      },
      "protein": {
        "gene": "BNLF2b",
        "source_id": "BNLF2b",
        "peptides_expts": 4,
        "p3hr1_hours": [
          0,
          24,
          48,
          72
        ],
        "p3hr1_signal": [
          101.06518159887612,
          3926.070351062606,
          2030.1855468233043,
          1905.1361720609193
        ],
        "akata_hours": [
          0,
          48
        ],
        "akata_signal": [
          60.140449631400145,
          1427.202952441314
        ]
      },
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 6.1,
      "akata_protein_fold_48h": 23.73116531699743
    },
    {
      "gene": "BNLF2a",
      "yuan_class": "E",
      "cage": {
        "gene": "BNLF2a",
        "orf": "BNLF2a",
        "kinetics": "early",
        "balf2_ratio": 0.64,
        "bdlf4_ratio": 2.41,
        "wt_tpm": 6,
        "annotation": "TAP inhibitor",
        "vpic_independent_late": false
      },
      "protein": null,
      "array_vs_cage_mismatch": false,
      "rna_fold_48h": 4.9,
      "akata_protein_fold_48h": null
    }
  ]
};
