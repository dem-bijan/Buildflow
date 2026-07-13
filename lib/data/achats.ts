import type { Achat } from "@/components/functions2";

export async function getAchats(): Promise<Achat[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.achat.findMany())
  return MOCK_ACHATS;
}

const MOCK_ACHATS: Achat[] = [
  {
    id: "a1b2c3d4-0001",
    ref: "CMD-2025-0041",
    fournisseurNom: "Ciments du Maroc",
    chantierNom: "Résidence Al Fath – Lot B",
    dateCommande: "2025-06-01",
    dateLivraisonPrevue: "2025-06-08",
    status: "PAYE",
    ht: 42000, tva: 8400, ttc: 50400,
    bonLivraisonRef: "BL-2025-0041",
    factureRef: "FAC-2025-0041",
    lignes: [
      { id: "l1", articleCode: "CIM-CPJ45", designation: "Ciment CPJ 45 (sac 50kg)", quantite: 300, unite: "sac", prixUnitaire: 80, total: 24000 },
      { id: "l2", articleCode: "GRA-0/25", designation: "Gravier 0/25", quantite: 30, unite: "T", prixUnitaire: 600, total: 18000 },
    ],
  },
  {
    id: "a1b2c3d4-0002",
    ref: "CMD-2025-0042",
    fournisseurNom: "Acier Atlas",
    chantierNom: "Centre Commercial Anfa",
    dateCommande: "2025-06-03",
    dateLivraisonPrevue: "2025-06-10",
    status: "LIVRE",
    ht: 87500, tva: 17500, ttc: 105000,
    bonLivraisonRef: "BL-2025-0042",
    lignes: [
      { id: "l3", articleCode: "FER-HA12", designation: "Fer à béton HA 12mm", quantite: 5, unite: "T", prixUnitaire: 9500, total: 47500 },
      { id: "l4", articleCode: "FER-HA16", designation: "Fer à béton HA 16mm", quantite: 4, unite: "T", prixUnitaire: 10000, total: 40000 },
    ],
  },
  {
    id: "a1b2c3d4-0003",
    ref: "CMD-2025-0043",
    fournisseurNom: "Bois & Bâti Sarl",
    chantierNom: "Villa Privée Souissi",
    dateCommande: "2025-06-05",
    dateLivraisonPrevue: "2025-06-12",
    status: "EN_COURS",
    ht: 15000, tva: 3000, ttc: 18000,
    lignes: [
      { id: "l5", articleCode: "BOI-CHP-27", designation: "Panneau contreplaqué 27mm", quantite: 50, unite: "pce", prixUnitaire: 180, total: 9000 },
      { id: "l6", articleCode: "BOI-SAP-8", designation: "Planche sapin 8cm", quantite: 200, unite: "ml", prixUnitaire: 30, total: 6000 },
    ],
  },
  {
    id: "a1b2c3d4-0004",
    ref: "CMD-2025-0044",
    fournisseurNom: "ElectroPro Maroc",
    chantierNom: "Hôtel Prestige Agadir",
    dateCommande: "2025-06-07",
    dateLivraisonPrevue: "2025-06-15",
    status: "FACTURE",
    ht: 33200, tva: 6640, ttc: 39840,
    bonLivraisonRef: "BL-2025-0044",
    factureRef: "FAC-2025-0044",
    lignes: [
      { id: "l7", articleCode: "CAB-3G25", designation: "Câble 3G2.5mm²", quantite: 500, unite: "ml", prixUnitaire: 18, total: 9000 },
      { id: "l8", articleCode: "TAB-4C", designation: "Tableau électrique 4 circuits", quantite: 8, unite: "pce", prixUnitaire: 850, total: 6800 },
      { id: "l9", articleCode: "DIS-63A", designation: "Disjoncteur 63A différentiel", quantite: 24, unite: "pce", prixUnitaire: 725, total: 17400 },
    ],
  },
  {
    id: "a1b2c3d4-0005",
    ref: "CMD-2025-0045",
    fournisseurNom: "Plomberie Générale SA",
    chantierNom: "Résidence Al Fath – Lot A",
    dateCommande: "2025-06-09",
    dateLivraisonPrevue: "2025-06-20",
    status: "EN_COURS",
    ht: 22400, tva: 4480, ttc: 26880,
    lignes: [
      { id: "l10", articleCode: "TUB-PPR-32", designation: "Tube PPR Ø32", quantite: 300, unite: "ml", prixUnitaire: 28, total: 8400 },
      { id: "l11", articleCode: "VAN-SPH-1", designation: "Vanne sphérique 1\"", quantite: 40, unite: "pce", prixUnitaire: 350, total: 14000 },
    ],
  },
];
