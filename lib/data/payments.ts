import type { Paiement } from "@/components/functions2";

export async function getPaiements(): Promise<Paiement[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.paiement.findMany())
  return MOCK_PAIEMENTS;
}

const MOCK_PAIEMENTS: Paiement[] = [
  { id: "pay-001", ref: "PAY-2025-041", type: "FOURNISSEUR", tiers: "Ciments du Maroc", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot B", referenceDoc: "FAC-2025-0041", montantTotal: 50400, montantPaye: 50400, montantRestant: 0, dateEcheance: "2025-06-15", datePaiement: "2025-06-01", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0312" },
  { id: "pay-002", ref: "PAY-2025-042", type: "FOURNISSEUR", tiers: "Acier Atlas", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", referenceDoc: "FAC-2025-0042", montantTotal: 105000, montantPaye: 0, montantRestant: 105000, dateEcheance: "2025-07-10", statut: "EN_ATTENTE" },
  { id: "pay-003", ref: "PAY-2025-043", type: "FOURNISSEUR", tiers: "ElectroPro Maroc", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", referenceDoc: "FAC-2025-0044", montantTotal: 39840, montantPaye: 39840, montantRestant: 0, dateEcheance: "2025-06-30", datePaiement: "2025-06-15", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0389" },
  { id: "pay-004", ref: "PAY-2025-044", type: "SOUS_TRAITANT", tiers: "Metal Struct SA", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", referenceDoc: "CST-2024-008", montantTotal: 1260000, montantPaye: 0, montantRestant: 1260000, dateEcheance: "2025-07-01", statut: "EN_RETARD", notes: "Retard lié à la validation du décompte travaux n°3" },
  { id: "pay-005", ref: "PAY-2025-045", type: "SOUS_TRAITANT", tiers: "Électricité Moderne SARL", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", referenceDoc: "CST-2025-001", montantTotal: 356000, montantPaye: 356000, montantRestant: 0, dateEcheance: "2025-08-01", datePaiement: "2025-06-25", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-2025-0401" },
  { id: "pay-006", ref: "PAY-2025-046", type: "FOURNISSEUR", tiers: "Plomberie Générale SA", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", referenceDoc: "FAC-2025-0045", montantTotal: 26880, montantPaye: 13440, montantRestant: 13440, dateEcheance: "2025-07-20", statut: "PARTIELLEMENT_PAYE", modeReglement: "CHEQUE" },
  { id: "pay-007", ref: "PAY-2025-047", type: "SALAIRE", tiers: "Paie juin 2025 – Tous employés", referenceDoc: "PAIE-2025-06", montantTotal: 287540, montantPaye: 287540, montantRestant: 0, dateEcheance: "2025-06-28", datePaiement: "2025-06-28", statut: "PAYE", modeReglement: "VIREMENT", referenceVirement: "VIR-PAI-2025-06" },
  { id: "pay-008", ref: "PAY-2025-048", type: "FOURNISSEUR", tiers: "Bois & Bâti Sarl", chantierId: "ch-0004", chantierNom: "Villa Privée Souissi", referenceDoc: "FAC-2025-0043", montantTotal: 18000, montantPaye: 0, montantRestant: 18000, dateEcheance: "2025-07-12", statut: "EN_ATTENTE" },
];
