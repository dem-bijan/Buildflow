import type { FichePaie } from "@/components/functions2";

export async function getFichesPaie(periode?: string): Promise<FichePaie[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.fichePaie.findMany(...))
  const data = MOCK_FICHES_PAIE;
  return periode ? data.filter((fp) => fp.periode === periode) : data;
}

const MOCK_FICHES_PAIE: FichePaie[] = [
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
    employe: { id: "emp-002", matricule: "EMP-002", nom: "El Amrani", prenom: "Sara", poste: "Ingénieure Chef de Projet", departement: "Génie Civil", dateEmbauche: "2020-07-15", rib: "011 810 0002222222222222 22", banque: "BMCE Bank" },
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
    salaireBrut: 14600,
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
