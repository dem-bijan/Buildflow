import type { Transaction, Caisse } from "@/components/functions2";

export async function getTransactions(): Promise<Transaction[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.transaction.findMany())
  return MOCK_TRANSACTIONS;
}

export async function getCaisses(): Promise<Caisse[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.caisse.findMany())
  return MOCK_CAISSES;
}

const MOCK_CAISSES: Caisse[] = [
  { id: "cai-01", libelle: "Compte Bancaire Principal – AWB", type: "BANQUE", solde: 2340000, devise: "MAD" },
  { id: "cai-02", libelle: "Compte Bancaire Projet Anfa – BMCE", type: "BANQUE", solde: 890000, devise: "MAD" },
  { id: "cai-03", libelle: "Caisse Espèces Siège", type: "ESPECES", solde: 45000, devise: "MAD" },
  { id: "cai-04", libelle: "Caisse Chantier Al Fath", type: "ESPECES", solde: 12500, devise: "MAD" },
  { id: "cai-05", libelle: "Caisse Chantier Agadir", type: "ESPECES", solde: 8200, devise: "MAD" },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "trx-001", date: "2025-06-01", type: "DECAISSEMENT", categorie: "PAIEMENT_FOURNISSEUR", montant: 50400, libelle: "Règlement CMD-2025-0041 – Ciments du Maroc", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "FAC-2025-0041", tiers: "Ciments du Maroc", saisiePar: "Nadia Alaoui" },
  { id: "trx-002", date: "2025-06-04", type: "DECAISSEMENT", categorie: "PAIEMENT_SOUSTRAIT", montant: 248000, libelle: "Acompte CST-2025-002 – SaniTech Plomberie", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "CST-2025-002", tiers: "SaniTech Plomberie", saisiePar: "Nadia Alaoui" },
  { id: "trx-003", date: "2025-06-10", type: "ENCAISSEMENT", categorie: "ENCAISSEMENT_CLIENT", montant: 3300000, libelle: "Avancement 40% contrat École Publique – décompte 3", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", tiers: "Ministère de l'Éducation Nationale", saisiePar: "Nadia Alaoui" },
  { id: "trx-004", date: "2025-06-12", type: "DECAISSEMENT", categorie: "FRAIS_GENERAUX", montant: 3200, libelle: "Facture fournitures bureau – juin 2025", caisseId: "cai-03", caisseLibelle: "Caisse Espèces Siège", saisiePar: "Kamal Bennis" },
  { id: "trx-005", date: "2025-06-15", type: "DECAISSEMENT", categorie: "PAIEMENT_FOURNISSEUR", montant: 39840, libelle: "Règlement CMD-2025-0044 – ElectroPro Maroc", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", referenceDoc: "FAC-2025-0044", tiers: "ElectroPro Maroc", saisiePar: "Nadia Alaoui" },
  { id: "trx-006", date: "2025-06-20", type: "DECAISSEMENT", categorie: "FRAIS_GENERAUX", montant: 1800, libelle: "Carburant véhicules chantier – semaine 25", caisseId: "cai-04", caisseLibelle: "Caisse Chantier Al Fath", saisiePar: "Khalid Ouali" },
  { id: "trx-007", date: "2025-06-25", type: "DECAISSEMENT", categorie: "PAIEMENT_SOUSTRAIT", montant: 356000, libelle: "Acompte CST-2025-001 – Électricité Moderne", caisseId: "cai-02", caisseLibelle: "Compte Bancaire Projet Anfa – BMCE", referenceDoc: "CST-2025-001", tiers: "Électricité Moderne SARL", saisiePar: "Nadia Alaoui" },
  { id: "trx-008", date: "2025-06-28", type: "DECAISSEMENT", categorie: "PAIEMENT_SALAIRE", montant: 287540, libelle: "Virement salaires – juin 2025 (14 employés)", caisseId: "cai-01", caisseLibelle: "Compte Bancaire Principal – AWB", saisiePar: "Nadia Alaoui" },
];
