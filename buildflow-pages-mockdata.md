# BuildFlow ERP — Frontend Pages Mock Data

---

## `/dashboard/achats` — `app/dashboard/achats/page.tsx`

```tsx
"use client";

export type AchatStatus = "EN_COURS" | "LIVRE" | "FACTURE" | "PAYE";

export interface LigneAchat {
  id: string;
  articleCode: string;
  designation: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  total: number;
}

export interface Achat {
  id: string;
  ref: string;
  fournisseurNom: string;
  chantierNom: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  status: AchatStatus;
  ht: number;
  tva: number;
  ttc: number;
  lignes: LigneAchat[];
  bonLivraisonRef?: string;
  factureRef?: string;
}

const achats: Achat[] = [
  {
    id: "a1b2c3d4-0001",
    ref: "CMD-2025-0041",
    fournisseurNom: "Ciments du Maroc",
    chantierNom: "Résidence Al Fath – Lot B",
    dateCommande: "2025-06-01",
    dateLivraisonPrevue: "2025-06-08",
    status: "PAYE",
    ht: 42000,
    tva: 8400,
    ttc: 50400,
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
    ht: 87500,
    tva: 17500,
    ttc: 105000,
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
    ht: 15000,
    tva: 3000,
    ttc: 18000,
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
    ht: 33200,
    tva: 6640,
    ttc: 39840,
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
    ht: 22400,
    tva: 4480,
    ttc: 26880,
    lignes: [
      { id: "l10", articleCode: "TUB-PPR-32", designation: "Tube PPR Ø32", quantite: 300, unite: "ml", prixUnitaire: 28, total: 8400 },
      { id: "l11", articleCode: "VAN-SPH-1", designation: "Vanne sphérique 1\"", quantite: 40, unite: "pce", prixUnitaire: 350, total: 14000 },
    ],
  },
];

export default function AchatsPage() {
  return <div>{/* render achats */}</div>;
}
```

---

## `/dashboard/fournisseurs` — `app/dashboard/fournisseurs/page.tsx`

```tsx
"use client";

export type FournisseurStatut = "ACTIF" | "INACTIF" | "BLACKLISTE";

export interface Fournisseur {
  id: string;
  code: string;
  raisonSociale: string;
  ice: string;
  contact: string;
  telephone: string;
  email: string;
  ville: string;
  adresse: string;
  rib: string;
  banque: string;
  statut: FournisseurStatut;
  categorieArticles: string[];
  totalAchatsAnnee: number;
  soldeImpaye: number;
}

const fournisseurs: Fournisseur[] = [
  {
    id: "f-0001",
    code: "FRN-001",
    raisonSociale: "Ciments du Maroc",
    ice: "001234567000089",
    contact: "M. Rachid Bennani",
    telephone: "+212 522 45 67 89",
    email: "r.bennani@cimentsdumaroc.ma",
    ville: "Casablanca",
    adresse: "Zone Industrielle Ain Sebaâ, Lot 34",
    rib: "007 780 0001234567891234 56",
    banque: "Attijariwafa Bank",
    statut: "ACTIF",
    categorieArticles: ["Ciment", "Granulats", "Sable"],
    totalAchatsAnnee: 1240000,
    soldeImpaye: 50400,
  },
  {
    id: "f-0002",
    code: "FRN-002",
    raisonSociale: "Acier Atlas",
    ice: "002345678000012",
    contact: "Mme. Fatima Chraibi",
    telephone: "+212 537 22 33 44",
    email: "f.chraibi@acieratlas.ma",
    ville: "Rabat",
    adresse: "Route de Salé, Km 3",
    rib: "011 810 0002345678902345 67",
    banque: "BMCE Bank",
    statut: "ACTIF",
    categorieArticles: ["Fer à béton", "Profilés métalliques", "Treillis soudé"],
    totalAchatsAnnee: 870000,
    soldeImpaye: 105000,
  },
  {
    id: "f-0003",
    code: "FRN-003",
    raisonSociale: "Bois & Bâti Sarl",
    ice: "003456789000034",
    contact: "M. Karim Lahlou",
    telephone: "+212 528 77 88 99",
    email: "karim@boisbati.ma",
    ville: "Agadir",
    adresse: "Quartier Industriel Anza",
    rib: "021 827 0003456789013456 78",
    banque: "CIH Bank",
    statut: "ACTIF",
    categorieArticles: ["Bois de coffrage", "Contreplaqué", "Lambris"],
    totalAchatsAnnee: 320000,
    soldeImpaye: 0,
  },
  {
    id: "f-0004",
    code: "FRN-004",
    raisonSociale: "ElectroPro Maroc",
    ice: "004567890000056",
    contact: "M. Youssef Tazi",
    telephone: "+212 522 11 22 33",
    email: "y.tazi@electropro.ma",
    ville: "Casablanca",
    adresse: "Bd Zerktouni, Résidence Nour, Appt 3",
    rib: "007 780 0004567890024567 89",
    banque: "Attijariwafa Bank",
    statut: "ACTIF",
    categorieArticles: ["Câblage", "Appareillage électrique", "Éclairage"],
    totalAchatsAnnee: 510000,
    soldeImpaye: 39840,
  },
  {
    id: "f-0005",
    code: "FRN-005",
    raisonSociale: "Plomberie Générale SA",
    ice: "005678901000078",
    contact: "M. Hassan Alami",
    telephone: "+212 535 44 55 66",
    email: "h.alami@plombgenerale.ma",
    ville: "Fès",
    adresse: "Zone Franche, Bloc C, N°7",
    rib: "011 810 0005678901035678 90",
    banque: "BMCE Bank",
    statut: "ACTIF",
    categorieArticles: ["Tuyauterie", "Robinetterie", "Sanitaires"],
    totalAchatsAnnee: 275000,
    soldeImpaye: 26880,
  },
  {
    id: "f-0006",
    code: "FRN-006",
    raisonSociale: "Carrelages Prestige SARL",
    ice: "006789012000090",
    contact: "Mme. Nadia Fassi",
    telephone: "+212 522 99 00 11",
    email: "nadia@carrelages-prestige.ma",
    ville: "Casablanca",
    adresse: "Hay Mohammadi, Rue 43",
    rib: "021 827 0006789012046789 01",
    banque: "CIH Bank",
    statut: "INACTIF",
    categorieArticles: ["Carrelage sol", "Faïence", "Revêtements"],
    totalAchatsAnnee: 0,
    soldeImpaye: 0,
  },
];

export default function FournisseursPage() {
  return <div>{/* render fournisseurs */}</div>;
}
```

---

## `/dashboard/stocks` — `app/dashboard/stocks/page.tsx`

```tsx
"use client";

export type MouvementType = "ENTREE" | "SORTIE" | "AJUSTEMENT";

export interface MouvementStock {
  id: string;
  date: string;
  type: MouvementType;
  quantite: number;
  motif: string;
  referenceDoc: string;
  chantierNom?: string;
}

export interface StockArticle {
  id: string;
  articleCode: string;
  designation: string;
  categorie: string;
  unite: string;
  quantiteDisponible: number;
  seuilAlerte: number;
  depot: string;
  chantierNom?: string;
  prixUnitaireMoyen: number;
  valeurStock: number;
  dernierMouvement: string;
  mouvements: MouvementStock[];
}

const stocks: StockArticle[] = [
  {
    id: "s-0001",
    articleCode: "CIM-CPJ45",
    designation: "Ciment CPJ 45 (sac 50kg)",
    categorie: "Liant",
    unite: "sac",
    quantiteDisponible: 420,
    seuilAlerte: 100,
    depot: "Dépôt Central Casablanca",
    prixUnitaireMoyen: 80,
    valeurStock: 33600,
    dernierMouvement: "2025-06-08",
    mouvements: [
      { id: "m1", date: "2025-06-08", type: "ENTREE", quantite: 300, motif: "Livraison CMD-2025-0041", referenceDoc: "BL-2025-0041" },
      { id: "m2", date: "2025-06-09", type: "SORTIE", quantite: 80, motif: "Consommation chantier", referenceDoc: "BON-S-0021", chantierNom: "Résidence Al Fath – Lot B" },
    ],
  },
  {
    id: "s-0002",
    articleCode: "FER-HA12",
    designation: "Fer à béton HA 12mm",
    categorie: "Métallurgie",
    unite: "T",
    quantiteDisponible: 3.2,
    seuilAlerte: 2,
    depot: "Chantier Centre Commercial Anfa",
    chantierNom: "Centre Commercial Anfa",
    prixUnitaireMoyen: 9500,
    valeurStock: 30400,
    dernierMouvement: "2025-06-10",
    mouvements: [
      { id: "m3", date: "2025-06-10", type: "ENTREE", quantite: 5, motif: "Livraison CMD-2025-0042", referenceDoc: "BL-2025-0042" },
      { id: "m4", date: "2025-06-11", type: "SORTIE", quantite: 1.8, motif: "Ferraillage semelles", referenceDoc: "BON-S-0022", chantierNom: "Centre Commercial Anfa" },
    ],
  },
  {
    id: "s-0003",
    articleCode: "GRA-0/25",
    designation: "Gravier 0/25",
    categorie: "Granulats",
    unite: "T",
    quantiteDisponible: 18,
    seuilAlerte: 20,
    depot: "Dépôt Central Casablanca",
    prixUnitaireMoyen: 600,
    valeurStock: 10800,
    dernierMouvement: "2025-06-08",
    mouvements: [
      { id: "m5", date: "2025-06-08", type: "ENTREE", quantite: 30, motif: "Livraison CMD-2025-0041", referenceDoc: "BL-2025-0041" },
      { id: "m6", date: "2025-06-10", type: "SORTIE", quantite: 12, motif: "Béton dallage RDC", referenceDoc: "BON-S-0023", chantierNom: "Résidence Al Fath – Lot B" },
    ],
  },
  {
    id: "s-0004",
    articleCode: "CAB-3G25",
    designation: "Câble 3G2.5mm²",
    categorie: "Électricité",
    unite: "ml",
    quantiteDisponible: 85,
    seuilAlerte: 50,
    depot: "Chantier Hôtel Prestige Agadir",
    chantierNom: "Hôtel Prestige Agadir",
    prixUnitaireMoyen: 18,
    valeurStock: 1530,
    dernierMouvement: "2025-06-12",
    mouvements: [
      { id: "m7", date: "2025-06-12", type: "ENTREE", quantite: 500, motif: "Livraison CMD-2025-0044", referenceDoc: "BL-2025-0044" },
      { id: "m8", date: "2025-06-13", type: "SORTIE", quantite: 415, motif: "Tirage gaines R+1", referenceDoc: "BON-S-0024", chantierNom: "Hôtel Prestige Agadir" },
    ],
  },
  {
    id: "s-0005",
    articleCode: "TUB-PPR-32",
    designation: "Tube PPR Ø32",
    categorie: "Plomberie",
    unite: "ml",
    quantiteDisponible: 12,
    seuilAlerte: 50,
    depot: "Chantier Résidence Al Fath – Lot A",
    chantierNom: "Résidence Al Fath – Lot A",
    prixUnitaireMoyen: 28,
    valeurStock: 336,
    dernierMouvement: "2025-06-14",
    mouvements: [
      { id: "m9", date: "2025-06-14", type: "SORTIE", quantite: 288, motif: "Réseau distribution eau froide", referenceDoc: "BON-S-0025", chantierNom: "Résidence Al Fath – Lot A" },
    ],
  },
];

export default function StocksPage() {
  return <div>{/* render stocks */}</div>;
}
```

---

## `/dashboard/catalogue` — `app/dashboard/catalogue/page.tsx`

```tsx
"use client";

export interface CategorieArticle {
  id: string;
  code: string;
  libelle: string;
  parentId?: string;
}

export interface Article {
  id: string;
  code: string;
  designation: string;
  description?: string;
  categorieId: string;
  categorieLibelle: string;
  unite: string;
  prixAchatRef: number;
  tvaRate: number;
  actif: boolean;
  fournisseursPreferentiels: string[];
}

const categories: CategorieArticle[] = [
  { id: "cat-01", code: "LIA", libelle: "Liants" },
  { id: "cat-02", code: "GRA", libelle: "Granulats" },
  { id: "cat-03", code: "MET", libelle: "Métallurgie" },
  { id: "cat-04", code: "BOI", libelle: "Bois & Coffrage" },
  { id: "cat-05", code: "ELE", libelle: "Électricité" },
  { id: "cat-06", code: "PLO", libelle: "Plomberie" },
  { id: "cat-07", code: "CAR", libelle: "Carrelage & Revêtements" },
  { id: "cat-08", code: "OUT", libelle: "Outillage" },
];

const articles: Article[] = [
  {
    id: "art-001",
    code: "CIM-CPJ45",
    designation: "Ciment CPJ 45 (sac 50kg)",
    categorieId: "cat-01",
    categorieLibelle: "Liants",
    unite: "sac",
    prixAchatRef: 80,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Ciments du Maroc"],
  },
  {
    id: "art-002",
    code: "CIM-CPJ35",
    designation: "Ciment CPJ 35 (sac 50kg)",
    categorieId: "cat-01",
    categorieLibelle: "Liants",
    unite: "sac",
    prixAchatRef: 72,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Ciments du Maroc"],
  },
  {
    id: "art-003",
    code: "GRA-0/25",
    designation: "Gravier 0/25",
    categorieId: "cat-02",
    categorieLibelle: "Granulats",
    unite: "T",
    prixAchatRef: 600,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Ciments du Maroc"],
  },
  {
    id: "art-004",
    code: "SAB-0/4",
    designation: "Sable de rivière 0/4",
    categorieId: "cat-02",
    categorieLibelle: "Granulats",
    unite: "T",
    prixAchatRef: 280,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Ciments du Maroc"],
  },
  {
    id: "art-005",
    code: "FER-HA12",
    designation: "Fer à béton HA 12mm",
    categorieId: "cat-03",
    categorieLibelle: "Métallurgie",
    unite: "T",
    prixAchatRef: 9500,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Acier Atlas"],
  },
  {
    id: "art-006",
    code: "FER-HA16",
    designation: "Fer à béton HA 16mm",
    categorieId: "cat-03",
    categorieLibelle: "Métallurgie",
    unite: "T",
    prixAchatRef: 10000,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Acier Atlas"],
  },
  {
    id: "art-007",
    code: "TRE-150",
    designation: "Treillis soudé ST40 150×150",
    categorieId: "cat-03",
    categorieLibelle: "Métallurgie",
    unite: "m²",
    prixAchatRef: 85,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Acier Atlas"],
  },
  {
    id: "art-008",
    code: "BOI-CHP-27",
    designation: "Panneau contreplaqué 27mm",
    categorieId: "cat-04",
    categorieLibelle: "Bois & Coffrage",
    unite: "pce",
    prixAchatRef: 180,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Bois & Bâti Sarl"],
  },
  {
    id: "art-009",
    code: "CAB-3G25",
    designation: "Câble 3G2.5mm²",
    categorieId: "cat-05",
    categorieLibelle: "Électricité",
    unite: "ml",
    prixAchatRef: 18,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["ElectroPro Maroc"],
  },
  {
    id: "art-010",
    code: "DIS-63A",
    designation: "Disjoncteur 63A différentiel",
    categorieId: "cat-05",
    categorieLibelle: "Électricité",
    unite: "pce",
    prixAchatRef: 725,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["ElectroPro Maroc"],
  },
  {
    id: "art-011",
    code: "TUB-PPR-32",
    designation: "Tube PPR Ø32",
    categorieId: "cat-06",
    categorieLibelle: "Plomberie",
    unite: "ml",
    prixAchatRef: 28,
    tvaRate: 20,
    actif: true,
    fournisseursPreferentiels: ["Plomberie Générale SA"],
  },
  {
    id: "art-012",
    code: "CAR-60-GRS",
    designation: "Carrelage grès cérame 60×60 gris",
    categorieId: "cat-07",
    categorieLibelle: "Carrelage & Revêtements",
    unite: "m²",
    prixAchatRef: 145,
    tvaRate: 20,
    actif: false,
    fournisseursPreferentiels: ["Carrelages Prestige SARL"],
  },
];

export default function CataloguePage() {
  return <div>{/* render catalogue */}</div>;
}
```

---

## `/dashboard/suivi-chantiers` — `app/dashboard/suivi-chantiers/page.tsx`

```tsx
"use client";

export type ChantierStatut = "EN_PREPARATION" | "EN_COURS" | "EN_PAUSE" | "TERMINE" | "ANNULE";

export interface Jalon {
  id: string;
  libelle: string;
  datePrevue: string;
  dateReelle?: string;
  statut: "A_FAIRE" | "EN_COURS" | "TERMINE" | "EN_RETARD";
}

export interface Chantier {
  id: string;
  code: string;
  nom: string;
  client: string;
  adresse: string;
  ville: string;
  statut: ChantierStatut;
  dateDebut: string;
  dateFin: string;
  budgetHT: number;
  depensesHT: number;
  avancement: number;
  chefProjetNom: string;
  nombreOuvriers: number;
  jalons: Jalon[];
  soustraitantsActifs: string[];
}

const chantiers: Chantier[] = [
  {
    id: "ch-0001",
    code: "CHT-2024-001",
    nom: "Résidence Al Fath – Lot A",
    client: "Groupe Addoha",
    adresse: "Route de l'Aéroport, Km 7",
    ville: "Casablanca",
    statut: "EN_COURS",
    dateDebut: "2024-09-01",
    dateFin: "2026-03-31",
    budgetHT: 12500000,
    depensesHT: 7340000,
    avancement: 62,
    chefProjetNom: "Ing. Mehdi Fassi",
    nombreOuvriers: 34,
    jalons: [
      { id: "j1", libelle: "Terrassement et fondations", datePrevue: "2024-11-30", dateReelle: "2024-12-10", statut: "TERMINE" },
      { id: "j2", libelle: "Structure béton armé (R+4)", datePrevue: "2025-05-31", dateReelle: "2025-06-05", statut: "TERMINE" },
      { id: "j3", libelle: "Maçonnerie et cloisonnement", datePrevue: "2025-10-31", statut: "EN_COURS" },
      { id: "j4", libelle: "Second œuvre (plomberie, élec)", datePrevue: "2026-01-31", statut: "A_FAIRE" },
      { id: "j5", libelle: "Finitions et livraison", datePrevue: "2026-03-31", statut: "A_FAIRE" },
    ],
    soustraitantsActifs: ["Électricité Moderne SARL", "SaniTech Plomberie"],
  },
  {
    id: "ch-0002",
    code: "CHT-2024-002",
    nom: "Résidence Al Fath – Lot B",
    client: "Groupe Addoha",
    adresse: "Route de l'Aéroport, Km 7",
    ville: "Casablanca",
    statut: "EN_COURS",
    dateDebut: "2025-01-15",
    dateFin: "2026-08-31",
    budgetHT: 9800000,
    depensesHT: 2100000,
    avancement: 23,
    chefProjetNom: "Ing. Mehdi Fassi",
    nombreOuvriers: 22,
    jalons: [
      { id: "j6", libelle: "Terrassement et fondations", datePrevue: "2025-04-30", dateReelle: "2025-04-28", statut: "TERMINE" },
      { id: "j7", libelle: "Structure béton armé (R+3)", datePrevue: "2025-09-30", statut: "EN_COURS" },
      { id: "j8", libelle: "Maçonnerie", datePrevue: "2026-02-28", statut: "A_FAIRE" },
      { id: "j9", libelle: "Second œuvre et finitions", datePrevue: "2026-08-31", statut: "A_FAIRE" },
    ],
    soustraitantsActifs: [],
  },
  {
    id: "ch-0003",
    code: "CHT-2024-003",
    nom: "Centre Commercial Anfa",
    client: "Anfa Invest SARL",
    adresse: "Boulevard d'Anfa, N°220",
    ville: "Casablanca",
    statut: "EN_COURS",
    dateDebut: "2024-06-01",
    dateFin: "2026-12-31",
    budgetHT: 38000000,
    depensesHT: 18500000,
    avancement: 49,
    chefProjetNom: "Ing. Sara El Amrani",
    nombreOuvriers: 68,
    jalons: [
      { id: "j10", libelle: "Fondations spéciales", datePrevue: "2024-10-31", dateReelle: "2024-11-15", statut: "TERMINE" },
      { id: "j11", libelle: "Structure métallique", datePrevue: "2025-06-30", statut: "EN_RETARD" },
      { id: "j12", libelle: "Façades et toiture", datePrevue: "2025-12-31", statut: "A_FAIRE" },
      { id: "j13", libelle: "Aménagements intérieurs", datePrevue: "2026-09-30", statut: "A_FAIRE" },
      { id: "j14", libelle: "VRD et espaces communs", datePrevue: "2026-12-31", statut: "A_FAIRE" },
    ],
    soustraitantsActifs: ["Metal Struct SA", "Façadiers du Nord", "Acier Atlas Montage"],
  },
  {
    id: "ch-0004",
    code: "CHT-2025-001",
    nom: "Villa Privée Souissi",
    client: "M. Karim Bensouda",
    adresse: "Rue des Orangers, N°14",
    ville: "Rabat",
    statut: "EN_COURS",
    dateDebut: "2025-03-01",
    dateFin: "2025-12-31",
    budgetHT: 4200000,
    depensesHT: 980000,
    avancement: 28,
    chefProjetNom: "Ing. Omar Tazi",
    nombreOuvriers: 12,
    jalons: [
      { id: "j15", libelle: "Gros œuvre", datePrevue: "2025-08-31", statut: "EN_COURS" },
      { id: "j16", libelle: "Second œuvre", datePrevue: "2025-11-30", statut: "A_FAIRE" },
      { id: "j17", libelle: "Finitions & aménagement", datePrevue: "2025-12-31", statut: "A_FAIRE" },
    ],
    soustraitantsActifs: ["Carrelages Prestige SARL"],
  },
  {
    id: "ch-0005",
    code: "CHT-2023-004",
    nom: "École Publique Hay Riad",
    client: "Ministère de l'Éducation Nationale",
    adresse: "Hay Riad, Secteur 7",
    ville: "Rabat",
    statut: "TERMINE",
    dateDebut: "2023-04-01",
    dateFin: "2024-12-15",
    budgetHT: 6700000,
    depensesHT: 6450000,
    avancement: 100,
    chefProjetNom: "Ing. Sara El Amrani",
    nombreOuvriers: 0,
    jalons: [
      { id: "j18", libelle: "Gros œuvre", datePrevue: "2023-12-31", dateReelle: "2024-01-10", statut: "TERMINE" },
      { id: "j19", libelle: "Second œuvre", datePrevue: "2024-09-30", dateReelle: "2024-10-05", statut: "TERMINE" },
      { id: "j20", libelle: "Finitions et réception", datePrevue: "2024-12-15", dateReelle: "2024-12-12", statut: "TERMINE" },
    ],
    soustraitantsActifs: [],
  },
  {
    id: "ch-0006",
    code: "CHT-2025-002",
    nom: "Hôtel Prestige Agadir",
    client: "Tourisme Sud SARL",
    adresse: "Corniche d'Agadir",
    ville: "Agadir",
    statut: "EN_COURS",
    dateDebut: "2025-02-01",
    dateFin: "2027-06-30",
    budgetHT: 55000000,
    depensesHT: 6200000,
    avancement: 11,
    chefProjetNom: "Ing. Omar Tazi",
    nombreOuvriers: 45,
    jalons: [
      { id: "j21", libelle: "Fondations et sous-sol", datePrevue: "2025-08-31", statut: "EN_COURS" },
      { id: "j22", libelle: "Structure R+12", datePrevue: "2026-06-30", statut: "A_FAIRE" },
      { id: "j23", libelle: "Façades et enveloppe", datePrevue: "2026-12-31", statut: "A_FAIRE" },
      { id: "j24", libelle: "Aménagements intérieurs", datePrevue: "2027-04-30", statut: "A_FAIRE" },
      { id: "j25", libelle: "Piscine, spa & espaces communs", datePrevue: "2027-06-30", statut: "A_FAIRE" },
    ],
    soustraitantsActifs: ["ElectroPro Maroc", "SaniTech Plomberie"],
  },
];

export default function SuiviChantiersPage() {
  return <div>{/* render chantiers */}</div>;
}
```

---

## `/dashboard/affectation` — `app/dashboard/affectation/page.tsx`

```tsx
"use client";

export type RessourceType = "OUVRIER" | "CHEF_EQUIPE" | "CONDUCTEUR_TRAVAUX" | "ENGIN";

export interface Ressource {
  id: string;
  nom: string;
  type: RessourceType;
  specialite: string;
  telephone?: string;
}

export interface Affectation {
  id: string;
  ressourceId: string;
  ressourceNom: string;
  ressourceType: RessourceType;
  chantierId: string;
  chantierNom: string;
  dateDebut: string;
  dateFin: string;
  tauxOccupation: number;
  notes?: string;
}

const ressources: Ressource[] = [
  { id: "res-01", nom: "Khalid Ouali", type: "CHEF_EQUIPE", specialite: "Béton armé", telephone: "+212 661 11 22 33" },
  { id: "res-02", nom: "Mourad Benhajj", type: "OUVRIER", specialite: "Maçonnerie", telephone: "+212 662 22 33 44" },
  { id: "res-03", nom: "Abdelatif Ziani", type: "OUVRIER", specialite: "Ferraillage", telephone: "+212 663 33 44 55" },
  { id: "res-04", nom: "Yassine El Idrissi", type: "OUVRIER", specialite: "Coffrage", telephone: "+212 664 44 55 66" },
  { id: "res-05", nom: "Hamid Chakir", type: "CONDUCTEUR_TRAVAUX", specialite: "Gros œuvre", telephone: "+212 665 55 66 77" },
  { id: "res-06", nom: "Said Mrani", type: "OUVRIER", specialite: "Plomberie", telephone: "+212 666 66 77 88" },
  { id: "res-07", nom: "Bouchaib Rafi", type: "OUVRIER", specialite: "Électricité", telephone: "+212 667 77 88 99" },
  { id: "res-08", nom: "Pelle hydraulique CAT 320", type: "ENGIN", specialite: "Terrassement" },
  { id: "res-09", nom: "Grue Liebherr 100T", type: "ENGIN", specialite: "Levage" },
  { id: "res-10", nom: "Bétonnière 500L", type: "ENGIN", specialite: "Malaxage" },
];

const affectations: Affectation[] = [
  { id: "aff-01", ressourceId: "res-01", ressourceNom: "Khalid Ouali", ressourceType: "CHEF_EQUIPE", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", dateDebut: "2025-06-01", dateFin: "2025-08-31", tauxOccupation: 100 },
  { id: "aff-02", ressourceId: "res-02", ressourceNom: "Mourad Benhajj", ressourceType: "OUVRIER", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", dateDebut: "2025-06-01", dateFin: "2025-09-30", tauxOccupation: 100 },
  { id: "aff-03", ressourceId: "res-03", ressourceNom: "Abdelatif Ziani", ressourceType: "OUVRIER", chantierId: "ch-0002", chantierNom: "Résidence Al Fath – Lot B", dateDebut: "2025-06-01", dateFin: "2025-07-31", tauxOccupation: 100 },
  { id: "aff-04", ressourceId: "res-04", ressourceNom: "Yassine El Idrissi", ressourceType: "OUVRIER", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-05-01", dateFin: "2025-09-30", tauxOccupation: 100 },
  { id: "aff-05", ressourceId: "res-05", ressourceNom: "Hamid Chakir", ressourceType: "CONDUCTEUR_TRAVAUX", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-01-01", dateFin: "2026-12-31", tauxOccupation: 100 },
  { id: "aff-06", ressourceId: "res-06", ressourceNom: "Said Mrani", ressourceType: "OUVRIER", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", dateDebut: "2025-06-01", dateFin: "2025-10-31", tauxOccupation: 100 },
  { id: "aff-07", ressourceId: "res-07", ressourceNom: "Bouchaib Rafi", ressourceType: "OUVRIER", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", dateDebut: "2025-06-15", dateFin: "2025-09-30", tauxOccupation: 100 },
  { id: "aff-08", ressourceId: "res-08", ressourceNom: "Pelle hydraulique CAT 320", ressourceType: "ENGIN", chantierId: "ch-0002", chantierNom: "Résidence Al Fath – Lot B", dateDebut: "2025-06-01", dateFin: "2025-06-30", tauxOccupation: 100 },
  { id: "aff-09", ressourceId: "res-09", ressourceNom: "Grue Liebherr 100T", ressourceType: "ENGIN", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-03-01", dateFin: "2026-06-30", tauxOccupation: 100 },
  { id: "aff-10", ressourceId: "res-10", ressourceNom: "Bétonnière 500L", ressourceType: "ENGIN", chantierId: "ch-0004", chantierNom: "Villa Privée Souissi", dateDebut: "2025-03-01", dateFin: "2025-08-31", tauxOccupation: 100 },
];

export default function AffectationPage() {
  return <div>{/* render affectations */}</div>;
}
```

---

## `/dashboard/sous-traitance` — `app/dashboard/sous-traitance/page.tsx`

```tsx
"use client";

export type ContratSTStatut = "EN_COURS" | "TERMINE" | "SUSPENDU" | "RESILIE";
export type PaiementSTStatut = "EN_ATTENTE" | "PAYE" | "EN_RETARD";

export interface EcheanceST {
  id: string;
  montant: number;
  datePrevue: string;
  datePaiement?: string;
  statut: PaiementSTStatut;
  referenceVirement?: string;
}

export interface ContratSousTraitance {
  id: string;
  ref: string;
  soustraitantNom: string;
  soustraitantIce: string;
  chantierId: string;
  chantierNom: string;
  objet: string;
  dateDebut: string;
  dateFin: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  montantPaye: number;
  statut: ContratSTStatut;
  echeances: EcheanceST[];
}

const contratsST: ContratSousTraitance[] = [
  {
    id: "cst-0001",
    ref: "CST-2025-001",
    soustraitantNom: "Électricité Moderne SARL",
    soustraitantIce: "010203040000011",
    chantierId: "ch-0001",
    chantierNom: "Résidence Al Fath – Lot A",
    objet: "Installations électriques courants forts et faibles — Bâtiments A1 à A4",
    dateDebut: "2025-04-01",
    dateFin: "2025-12-31",
    montantHT: 890000,
    tva: 178000,
    montantTTC: 1068000,
    montantPaye: 356000,
    statut: "EN_COURS",
    echeances: [
      { id: "e1", montant: 356000, datePrevue: "2025-05-01", datePaiement: "2025-05-03", statut: "PAYE", referenceVirement: "VIR-2025-0312" },
      { id: "e2", montant: 356000, datePrevue: "2025-08-01", statut: "EN_ATTENTE" },
      { id: "e3", montant: 356000, datePrevue: "2026-01-01", statut: "EN_ATTENTE" },
    ],
  },
  {
    id: "cst-0002",
    ref: "CST-2025-002",
    soustraitantNom: "SaniTech Plomberie",
    soustraitantIce: "020304050000022",
    chantierId: "ch-0001",
    chantierNom: "Résidence Al Fath – Lot A",
    objet: "Plomberie sanitaire, réseau eau froide/chaude et évacuations",
    dateDebut: "2025-05-01",
    dateFin: "2026-01-31",
    montantHT: 620000,
    tva: 124000,
    montantTTC: 744000,
    montantPaye: 248000,
    statut: "EN_COURS",
    echeances: [
      { id: "e4", montant: 248000, datePrevue: "2025-06-01", datePaiement: "2025-06-04", statut: "PAYE", referenceVirement: "VIR-2025-0398" },
      { id: "e5", montant: 248000, datePrevue: "2025-10-01", statut: "EN_ATTENTE" },
      { id: "e6", montant: 248000, datePrevue: "2026-02-01", statut: "EN_ATTENTE" },
    ],
  },
  {
    id: "cst-0003",
    ref: "CST-2024-008",
    soustraitantNom: "Metal Struct SA",
    soustraitantIce: "030405060000033",
    chantierId: "ch-0003",
    chantierNom: "Centre Commercial Anfa",
    objet: "Charpente métallique et bardage façades",
    dateDebut: "2025-01-15",
    dateFin: "2026-03-31",
    montantHT: 4200000,
    tva: 840000,
    montantTTC: 5040000,
    montantPaye: 1680000,
    statut: "EN_COURS",
    echeances: [
      { id: "e7", montant: 1260000, datePrevue: "2025-03-01", datePaiement: "2025-03-05", statut: "PAYE", referenceVirement: "VIR-2025-0201" },
      { id: "e8", montant: 420000, datePrevue: "2025-05-01", datePaiement: "2025-05-10", statut: "PAYE", referenceVirement: "VIR-2025-0314" },
      { id: "e9", montant: 1260000, datePrevue: "2025-07-01", statut: "EN_RETARD" },
      { id: "e10", montant: 2100000, datePrevue: "2026-04-01", statut: "EN_ATTENTE" },
    ],
  },
  {
    id: "cst-0004",
    ref: "CST-2025-003",
    soustraitantNom: "Carrelages Prestige SARL",
    soustraitantIce: "006789012000090",
    chantierId: "ch-0004",
    chantierNom: "Villa Privée Souissi",
    objet: "Pose carrelage sol et faïence toutes pièces",
    dateDebut: "2025-09-01",
    dateFin: "2025-11-30",
    montantHT: 145000,
    tva: 29000,
    montantTTC: 174000,
    montantPaye: 0,
    statut: "EN_COURS",
    echeances: [
      { id: "e11", montant: 87000, datePrevue: "2025-10-01", statut: "EN_ATTENTE" },
      { id: "e12", montant: 87000, datePrevue: "2025-12-01", statut: "EN_ATTENTE" },
    ],
  },
];

export default function SousTraitancePage() {
  return <div>{/* render contratsST */}</div>;
}
```

---

## `/dashboard/salaires` — `app/dashboard/salaires/page.tsx`

```tsx
"use client";

export type StatutSalaire = "EN_ATTENTE" | "VALIDE" | "PAYE";

export interface LigneSalaire {
  libelle: string;
  montant: number;
  type: "GAIN" | "RETENUE";
}

export interface FichePaie {
  id: string;
  employe: {
    id: string;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    departement: string;
    dateEmbauche: string;
    rib: string;
    banque: string;
  };
  periode: string;
  salaireBrut: number;
  lignes: LigneSalaire[];
  totalGains: number;
  totalRetenues: number;
  salaireNet: number;
  statut: StatutSalaire;
  datePaiement?: string;
  referenceVirement?: string;
}

const fichesPaie: FichePaie[] = [
  {
    id: "fp-2025-06-001",
    employe: { id: "emp-001", matricule: "EMP-001", nom: "Fassi", prenom: "Mehdi", poste: "Ingénieur Chef de Projet", departement: "Travaux", dateEmbauche: "2019-03-01", rib: "007 780 0001111111111111 11", banque: "Attijariwafa Bank" },
    periode: "2025-06",
    salaireBrut: 22000,
    lignes: [
      { libelle: "Salaire de base", montant: 22000, type: "GAIN" },
      { libelle: "Prime chantier", montant: 2500, type: "GAIN" },
      { libelle: "CNSS salariale (4.48%)", montant: -986, type: "RETENUE" },
      { libelle: "AMO salariale (2.26%)", montant: -497, type: "RETENUE" },
      { libelle: "IGR", montant: -2840, type: "RETENUE" },
    ],
    totalGains: 24500,
    totalRetenues: 4323,
    salaireNet: 20177,
    statut: "PAYE",
    datePaiement: "2025-06-28",
    referenceVirement: "VIR-PAI-2025-06-001",
  },
  {
    id: "fp-2025-06-002",
    employe: { id: "emp-002", matricule: "EMP-002", nom: "El Amrani", prenom: "Sara", poste: "Ingénieure Chef de Projet", departement: "Travaux", dateEmbauche: "2020-07-15", rib: "011 810 0002222222222222 22", banque: "BMCE Bank" },
    periode: "2025-06",
    salaireBrut: 21000,
    lignes: [
      { libelle: "Salaire de base", montant: 21000, type: "GAIN" },
      { libelle: "Prime chantier", montant: 2000, type: "GAIN" },
      { libelle: "CNSS salariale (4.48%)", montant: -941, type: "RETENUE" },
      { libelle: "AMO salariale (2.26%)", montant: -475, type: "RETENUE" },
      { libelle: "IGR", montant: -2610, type: "RETENUE" },
    ],
    totalGains: 23000,
    totalRetenues: 4026,
    salaireNet: 18974,
    statut: "PAYE",
    datePaiement: "2025-06-28",
    referenceVirement: "VIR-PAI-2025-06-002",
  },
  {
    id: "fp-2025-06-003",
    employe: { id: "emp-003", matricule: "EMP-003", nom: "Tazi", prenom: "Omar", poste: "Ingénieur Chef de Projet", departement: "Travaux", dateEmbauche: "2022-01-10", rib: "021 827 0003333333333333 33", banque: "CIH Bank" },
    periode: "2025-06",
    salaireBrut: 19500,
    lignes: [
      { libelle: "Salaire de base", montant: 19500, type: "GAIN" },
      { libelle: "CNSS salariale (4.48%)", montant: -874, type: "RETENUE" },
      { libelle: "AMO salariale (2.26%)", montant: -441, type: "RETENUE" },
      { libelle: "IGR", montant: -2210, type: "RETENUE" },
    ],
    totalGains: 19500,
    totalRetenues: 3525,
    salaireNet: 15975,
    statut: "VALIDE",
  },
  {
    id: "fp-2025-06-004",
    employe: { id: "emp-004", matricule: "EMP-004", nom: "Ouali", prenom: "Khalid", poste: "Chef d'équipe", departement: "Travaux", dateEmbauche: "2018-09-01", rib: "007 780 0004444444444444 44", banque: "Attijariwafa Bank" },
    periode: "2025-06",
    salaireBrut: 8500,
    lignes: [
      { libelle: "Salaire de base", montant: 8500, type: "GAIN" },
      { libelle: "Heures supplémentaires (18h)", montant: 720, type: "GAIN" },
      { libelle: "Prime présence", montant: 300, type: "GAIN" },
      { libelle: "CNSS salariale (4.48%)", montant: -381, type: "RETENUE" },
      { libelle: "AMO salariale (2.26%)", montant: -192, type: "RETENUE" },
      { libelle: "IGR", montant: -428, type: "RETENUE" },
    ],
    totalGains: 9520,
    totalRetenues: 1001,
    salaireNet: 8519,
    statut: "EN_ATTENTE",
  },
  {
    id: "fp-2025-06-005",
    employe: { id: "emp-005", matricule: "EMP-005", nom: "Chakir", prenom: "Hamid", poste: "Conducteur de Travaux", departement: "Travaux", dateEmbauche: "2021-04-01", rib: "011 810 0005555555555555 55", banque: "BMCE Bank" },
    periode: "2025-06",
    salaireBrut: 14000,
    lignes: [
      { libelle: "Salaire de base", montant: 14000, type: "GAIN" },
      { libelle: "Indemnité déplacement", montant: 1200, type: "GAIN" },
      { libelle: "CNSS salariale (4.48%)", montant: -627, type: "RETENUE" },
      { libelle: "AMO salariale (2.26%)", montant: -316, type: "RETENUE" },
      { libelle: "IGR", montant: -1480, type: "RETENUE" },
    ],
    totalGains: 15200,
    totalRetenues: 2423,
    salaireNet: 12777,
    statut: "VALIDE",
  },
];

export default function SalairesPage() {
  return <div>{/* render fichesPaie */}</div>;
}
```

---

## `/dashboard/tresorerie` — `app/dashboard/tresorerie/page.tsx`

```tsx
"use client";

export type TransactionType = "ENCAISSEMENT" | "DECAISSEMENT";
export type TransactionCategorie =
  | "PAIEMENT_FOURNISSEUR"
  | "PAIEMENT_SOUSTRAIT"
  | "PAIEMENT_SALAIRE"
  | "ENCAISSEMENT_CLIENT"
  | "FRAIS_GENERAUX"
  | "DEPOT_BANQUE"
  | "RETRAIT_BANQUE"
  | "AUTRE";

export interface Caisse {
  id: string;
  libelle: string;
  type: "BANQUE" | "ESPECES";
  solde: number;
  devise: "MAD";
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  categorie: TransactionCategorie;
  montant: number;
  libelle: string;
  caisseId: string;
  caisseLibelle: string;
  referenceDoc?: string;
  tiers?: string;
  saisiePar: string;
}

const caisses: Caisse[] = [
  { id: "cai-01", libelle: "Compte Bancaire Principal – AWB", type: "BANQUE", solde: 2340000, devise: "MAD" },
  { id: "cai-02", libelle: "Compte Bancaire Projet Anfa – BMCE", type: "BANQUE", solde: 890000, devise: "MAD" },
  { id: "cai-03", libelle: "Caisse Espèces Siège", type: "ESPECES", solde: 45000, devise: "MAD" },
  { id: "cai-04", libelle: "Caisse Chantier Al Fath", type: "ESPECES", solde: 12500, devise: "MAD" },
  { id: "cai-05", libelle: "Caisse Chantier Agadir", type: "ESPECES", solde: 8200, devise: "MAD" },
];

const transactions: Transaction[] = [
  { id: "trx-001", date: "2025-06-01", type: "DECAISSEMENT", categorie: "PAIEMENT_FOURNISSEUR", montant: 50400, libelle: "Règlement CMD-2025-0041 – Ciments du Maroc", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "FAC-2025-0041", tiers: "Ciments du Maroc", saisiePar: "Nadia Alaoui" },
  { id: "trx-002", date: "2025-06-04", type: "DECAISSEMENT", categorie: "PAIEMENT_SOUSTRAIT", montant: 248000, libelle: "Acompte CST-2025-002 – SaniTech Plomberie", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "CST-2025-002", tiers: "SaniTech Plomberie", saisiePar: "Nadia Alaoui" },
  { id: "trx-003", date: "2025-06-10", type: "ENCAISSEMENT", categorie: "ENCAISSEMENT_CLIENT", montant: 1500000, libelle: "Avancement 40% contrat École Publique – décompte 3", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", tiers: "Ministère de l'Éducation Nationale", saisiePar: "Nadia Alaoui" },
  { id: "trx-004", date: "2025-06-12", type: "DECAISSEMENT", categorie: "FRAIS_GENERAUX", montant: 3200, libelle: "Facture fournitures bureau – juin 2025", caisseId: "cai-03", caisseLibelle: "Caisse Espèces Siège", saisiePar: "Kamal Bennis" },
  { id: "trx-005", date: "2025-06-15", type: "DECAISSEMENT", categorie: "PAIEMENT_FOURNISSEUR", montant: 39840, libelle: "Règlement CMD-2025-0044 – ElectroPro Maroc", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "FAC-2025-0044", tiers: "ElectroPro Maroc", saisiePar: "Nadia Alaoui" },
  { id: "trx-006", date: "2025-06-20", type: "DECAISSEMENT", categorie: "FRAIS_GENERAUX", montant: 1800, libelle: "Carburant véhicules chantier – semaine 25", caisseId: "cai-04", caisseLibelle: "Caisse Chantier Al Fath", saisiePar: "Khalid Ouali" },
  { id: "trx-007", date: "2025-06-25", type: "DECAISSEMENT", categorie: "PAIEMENT_SOUSTRAIT", montant: 356000, libelle: "Acompte CST-2025-001 – Électricité Moderne", caisseId: "cai-02", caisseLibelle: "Compte Bancaire Projet Anfa – BMCE", referenceDoc: "CST-2025-001", tiers: "Électricité Moderne SARL", saisiePar: "Nadia Alaoui" },
  { id: "trx-008", date: "2025-06-28", type: "DECAISSEMENT", categorie: "PAIEMENT_SALAIRE", montant: 287540, libelle: "Virement salaires – juin 2025 (14 employés)", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", saisiePar: "Nadia Alaoui" },
];

export default function TresoreriePage() {
  return <div>{/* render caisses + transactions */}</div>;
}
```

---

## `/dashboard/payments` — `app/dashboard/payments/page.tsx`

```tsx
"use client";

export type PaiementStatut = "EN_ATTENTE" | "PAYE" | "EN_RETARD" | "PARTIELLEMENT_PAYE";
export type PaiementType = "FOURNISSEUR" | "SOUS_TRAITANT" | "SALAIRE" | "AUTRE";

export interface Paiement {
  id: string;
  ref: string;
  type: PaiementType;
  tiers: string;
  chantierId?: string;
  chantierNom?: string;
  referenceDoc: string;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  dateEcheance: string;
  datePaiement?: string;
  statut: PaiementStatut;
  modeReglement?: "VIREMENT" | "CHEQUE" | "ESPECES";
  referenceVirement?: string;
  notes?: string;
}

const paiements: Paiement[] = [
  { id: "pay-001", ref: "PAY-2025-041", type: "FOURNISSEUR", tiers: "Ciments du Maroc", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot B", referenceDoc: "FAC-2025-0041", montantTotal: 50400, montantPaye: 50400, montantRestant: 0, dateEcheance: "2025-06-15", datePaiement: "2025-06-01", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0312" },
  { id: "pay-002", ref: "PAY-2025-042", type: "FOURNISSEUR", tiers: "Acier Atlas", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", referenceDoc: "FAC-2025-0042", montantTotal: 105000, montantPaye: 0, montantRestant: 105000, dateEcheance: "2025-07-10", statut: "EN_ATTENTE" },
  { id: "pay-003", ref: "PAY-2025-043", type: "FOURNISSEUR", tiers: "ElectroPro Maroc", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", referenceDoc: "FAC-2025-0044", montantTotal: 39840, montantPaye: 39840, montantRestant: 0, dateEcheance: "2025-06-30", datePaiement: "2025-06-15", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0389" },
  { id: "pay-004", ref: "PAY-2025-044", type: "SOUS_TRAITANT", tiers: "Metal Struct SA", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", referenceDoc: "CST-2024-008", montantTotal: 1260000, montantPaye: 0, montantRestant: 1260000, dateEcheance: "2025-07-01", statut: "EN_RETARD", notes: "Retard lié à la validation du décompte travaux n°3" },
  { id: "pay-005", ref: "PAY-2025-045", type: "SOUS_TRAITANT", tiers: "Électricité Moderne SARL", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", referenceDoc: "CST-2025-001", montantTotal: 356000, montantPaye: 356000, montantRestant: 0, dateEcheance: "2025-08-01", datePaiement: "2025-06-25", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0401" },
  { id: "pay-006", ref: "PAY-2025-046", type: "FOURNISSEUR", tiers: "Plomberie Générale SA", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", referenceDoc: "FAC-2025-0045", montantTotal: 26880, montantPaye: 13440, montantRestant: 13440, dateEcheance: "2025-07-20", statut: "PARTIELLEMENT_PAYE", modeReglement: "CHEQUE" },
  { id: "pay-007", ref: "PAY-2025-047", type: "SALAIRE", tiers: "Paie juin 2025 – Tous employés", referenceDoc: "PAIE-2025-06", montantTotal: 287540, montantPaye: 287540, montantRestant: 0, dateEcheance: "2025-06-28", datePaiement: "2025-06-28", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-PAI-2025-06" },
  { id: "pay-008", ref: "PAY-2025-048", type: "FOURNISSEUR", tiers: "Bois & Bâti Sarl", chantierId: "ch-0004", chantierNom: "Villa Privée Souissi", referenceDoc: "FAC-2025-0043", montantTotal: 18000, montantPaye: 0, montantRestant: 18000, dateEcheance: "2025-07-12", statut: "EN_ATTENTE" },
];

export default function PaymentsPage() {
  return <div>{/* render paiements */}</div>;
}
```

---

## `/dashboard/comptabilite` — `app/dashboard/comptabilite/page.tsx`

```tsx
"use client";

export type EcritureType = "DEBIT" | "CREDIT";
export type JournalCode = "ACH" | "VTE" | "BNQ" | "CAI" | "OD" | "SAL";

export interface LigneEcriture {
  id: string;
  compteNum: string;
  compteLibelle: string;
  debit: number;
  credit: number;
}

export interface EcritureComptable {
  id: string;
  date: string;
  journal: JournalCode;
  pieceRef: string;
  libelle: string;
  lignes: LigneEcriture[];
  montant: number;
  saisiePar: string;
}

export interface CompteResultat {
  categorie: string;
  libelle: string;
  montantN: number;
  montantN1: number;
}

const ecritures: EcritureComptable[] = [
  {
    id: "ec-001", date: "2025-06-01", journal: "ACH", pieceRef: "FAC-2025-0041", libelle: "Achat ciment et gravier – Ciments du Maroc",
    lignes: [
      { id: "le1", compteNum: "612100", compteLibelle: "Achats matières premières", debit: 42000, credit: 0 },
      { id: "le2", compteNum: "345200", compteLibelle: "TVA récupérable sur achats", debit: 8400, credit: 0 },
      { id: "le3", compteNum: "441100", compteLibelle: "Fournisseurs", debit: 0, credit: 50400 },
    ],
    montant: 50400, saisiePar: "Nadia Alaoui",
  },
  {
    id: "ec-002", date: "2025-06-04", journal: "BNQ", pieceRef: "VIR-2025-0398", libelle: "Paiement acompte SaniTech Plomberie",
    lignes: [
      { id: "le4", compteNum: "441100", compteLibelle: "Fournisseurs", debit: 248000, credit: 0 },
      { id: "le5", compteNum: "514100", compteLibelle: "Banque AWB", debit: 0, credit: 248000 },
    ],
    montant: 248000, saisiePar: "Nadia Alaoui",
  },
  {
    id: "ec-003", date: "2025-06-10", journal: "VTE", pieceRef: "DEC-003", libelle: "Décompte travaux n°3 – École Publique Hay Riad",
    lignes: [
      { id: "le6", compteNum: "342100", compteLibelle: "Clients", debit: 1500000, credit: 0 },
      { id: "le7", compteNum: "711100", compteLibelle: "Chiffre d'affaires – travaux", debit: 0, credit: 1250000 },
      { id: "le8", compteNum: "445710", compteLibelle: "TVA collectée", debit: 0, credit: 250000 },
    ],
    montant: 1500000, saisiePar: "Nadia Alaoui",
  },
  {
    id: "ec-004", date: "2025-06-28", journal: "SAL", pieceRef: "PAIE-2025-06", libelle: "Charge salariale juin 2025",
    lignes: [
      { id: "le9", compteNum: "641100", compteLibelle: "Rémunérations du personnel", debit: 287540, credit: 0 },
      { id: "le10", compteNum: "443000", compteLibelle: "CNSS à payer", debit: 0, credit: 48200 },
      { id: "le11", compteNum: "444000", compteLibelle: "IGR à payer", debit: 0, credit: 31800 },
      { id: "le12", compteNum: "443100", compteLibelle: "AMO à payer", debit: 0, credit: 12600 },
      { id: "le13", compteNum: "444200", compteLibelle: "Salaires nets à payer", debit: 0, credit: 194940 },
    ],
    montant: 287540, saisiePar: "Nadia Alaoui",
  },
];

const compteResultat: CompteResultat[] = [
  { categorie: "PRODUIT", libelle: "Chiffre d'affaires travaux", montantN: 8750000, montantN1: 6200000 },
  { categorie: "PRODUIT", libelle: "Produits financiers", montantN: 12000, montantN1: 9500 },
  { categorie: "CHARGE", libelle: "Achats matières et fournitures", montantN: 3240000, montantN1: 2180000 },
  { categorie: "CHARGE", libelle: "Sous-traitance", montantN: 1680000, montantN1: 980000 },
  { categorie: "CHARGE", libelle: "Charges de personnel", montantN: 1724000, montantN1: 1450000 },
  { categorie: "CHARGE", libelle: "Dotations amortissements", montantN: 215000, montantN1: 198000 },
  { categorie: "CHARGE", libelle: "Frais généraux", montantN: 320000, montantN1: 285000 },
  { categorie: "CHARGE", libelle: "Charges financières", montantN: 48000, montantN1: 52000 },
];

export default function ComptabilitePage() {
  return <div>{/* render ecritures + compteResultat */}</div>;
}
```

---

## `/dashboard/annuaire` — `app/dashboard/annuaire/page.tsx`

```tsx
"use client";

export type EmployeRole = "ADMIN" | "RH" | "FINANCE" | "PM" | "ACHAT" | "CONDUCTEUR_TRAVAUX" | "CHEF_EQUIPE" | "OUVRIER";
export type EmployeStatut = "ACTIF" | "CONGE" | "INACTIF";

export interface Employe {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  role: EmployeRole;
  poste: string;
  departement: string;
  telephone: string;
  email: string;
  dateEmbauche: string;
  chantierActuelId?: string;
  chantierActuelNom?: string;
  statut: EmployeStatut;
  salaireBrut: number;
  typeContrat: "CDI" | "CDD" | "ANAPEC" | "JOURNALIER";
}

const employes: Employe[] = [
  { id: "emp-001", matricule: "EMP-001", nom: "Fassi", prenom: "Mehdi", role: "PM", poste: "Ingénieur Chef de Projet", departement: "Travaux", telephone: "+212 661 10 20 30", email: "m.fassi@buildflow.ma", dateEmbauche: "2019-03-01", chantierActuelId: "ch-0001", chantierActuelNom: "Résidence Al Fath – Lot A", statut: "ACTIF", salaireBrut: 22000, typeContrat: "CDI" },
  { id: "emp-002", matricule: "EMP-002", nom: "El Amrani", prenom: "Sara", role: "PM", poste: "Ingénieure Chef de Projet", departement: "Travaux", telephone: "+212 661 20 30 40", email: "s.elamrani@buildflow.ma", dateEmbauche: "2020-07-15", chantierActuelId: "ch-0003", chantierActuelNom: "Centre Commercial Anfa", statut: "ACTIF", salaireBrut: 21000, typeContrat: "CDI" },
  { id: "emp-003", matricule: "EMP-003", nom: "Tazi", prenom: "Omar", role: "PM", poste: "Ingénieur Chef de Projet", departement: "Travaux", telephone: "+212 661 30 40 50", email: "o.tazi@buildflow.ma", dateEmbauche: "2022-01-10", chantierActuelId: "ch-0006", chantierActuelNom: "Hôtel Prestige Agadir", statut: "ACTIF", salaireBrut: 19500, typeContrat: "CDI" },
  { id: "emp-004", matricule: "EMP-004", nom: "Ouali", prenom: "Khalid", role: "CHEF_EQUIPE", poste: "Chef d'équipe béton armé", departement: "Travaux", telephone: "+212 661 40 50 60", email: "k.ouali@buildflow.ma", dateEmbauche: "2018-09-01", chantierActuelId: "ch-0001", chantierActuelNom: "Résidence Al Fath – Lot A", statut: "ACTIF", salaireBrut: 8500, typeContrat: "CDI" },
  { id: "emp-005", matricule: "EMP-005", nom: "Chakir", prenom: "Hamid", role: "CONDUCTEUR_TRAVAUX", poste: "Conducteur de Travaux", departement: "Travaux", telephone: "+212 661 50 60 70", email: "h.chakir@buildflow.ma", dateEmbauche: "2021-04-01", chantierActuelId: "ch-0003", chantierActuelNom: "Centre Commercial Anfa", statut: "ACTIF", salaireBrut: 14000, typeContrat: "CDI" },
  { id: "emp-006", matricule: "EMP-006", nom: "Alaoui", prenom: "Nadia", role: "FINANCE", poste: "Responsable Financière", departement: "Finance", telephone: "+212 661 60 70 80", email: "n.alaoui@buildflow.ma", dateEmbauche: "2017-05-01", statut: "ACTIF", salaireBrut: 18000, typeContrat: "CDI" },
  { id: "emp-007", matricule: "EMP-007", nom: "Bennis", prenom: "Kamal", role: "ACHAT", poste: "Responsable Achats", departement: "Achats", telephone: "+212 661 70 80 90", email: "k.bennis@buildflow.ma", dateEmbauche: "2020-02-01", statut: "ACTIF", salaireBrut: 12000, typeContrat: "CDI" },
  { id: "emp-008", matricule: "EMP-008", nom: "Benhajj", prenom: "Mourad", role: "OUVRIER", poste: "Maçon qualifié", departement: "Travaux", telephone: "+212 662 11 22 33", email: "", dateEmbauche: "2021-06-01", chantierActuelId: "ch-0001", chantierActuelNom: "Résidence Al Fath – Lot A", statut: "ACTIF", salaireBrut: 6200, typeContrat: "CDI" },
  { id: "emp-009", matricule: "EMP-009", nom: "Ziani", prenom: "Abdelatif", role: "OUVRIER", poste: "Ferrailleur", departement: "Travaux", telephone: "+212 662 22 33 44", email: "", dateEmbauche: "2023-03-15", chantierActuelId: "ch-0002", chantierActuelNom: "Résidence Al Fath – Lot B", statut: "ACTIF", salaireBrut: 5800, typeContrat: "CDI" },
  { id: "emp-010", matricule: "EMP-010", nom: "Chrifi", prenom: "Amine", role: "RH", poste: "Responsable RH", departement: "RH", telephone: "+212 661 80 90 01", email: "a.chrifi@buildflow.ma", dateEmbauche: "2019-11-01", statut: "CONGE", salaireBrut: 14500, typeContrat: "CDI" },
];

export default function AnnuairePage() {
  return <div>{/* render employes */}</div>;
}
```
