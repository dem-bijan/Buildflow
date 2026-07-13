import type { Affectation } from "@/components/functions2";

export function getAffectations(): Affectation[] {
  return [
    { id: "aff-01", ressourceId: "res-01", ressourceNom: "Khalid Ouali", ressourceType: "CHEF_EQUIPE", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", dateDebut: "2025-06-01", dateFin: "2025-08-31", tauxOccupation: 100 },
    { id: "aff-02", ressourceId: "res-02", ressourceNom: "Mourad Benhajj", ressourceType: "OUVRIER", chantierId: "ch-0001", chantierNom: "Résidence Al Fath – Lot A", dateDebut: "2025-06-01", dateFin: "2025-09-30", tauxOccupation: 100 },
    { id: "aff-03", ressourceId: "res-03", ressourceNom: "Abdelatif Ziani", ressourceType: "OUVRIER", chantierId: "ch-0002", chantierNom: "Résidence Al Fath – Lot B", dateDebut: "2025-06-01", dateFin: "2025-07-31", tauxOccupation: 100 },
    { id: "aff-04", ressourceId: "res-04", ressourceNom: "Yassine El Idrissi", ressourceType: "OUVRIER", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-05-01", dateFin: "2025-09-30", tauxOccupation: 100 },
    { id: "aff-05", ressourceId: "res-05", ressourceNom: "Hamid Chakir", ressourceType: "CONDUCTEUR_TRAVAUX", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-01-01", dateFin: "2026-12-31", tauxOccupation: 100 },
    { id: "aff-06", ressourceId: "res-06", ressourceNom: "Said Mrani", ressourceType: "OUVRIER", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", dateDebut: "2025-06-01", dateFin: "2025-10-31", tauxOccupation: 100 },
    { id: "aff-07", ressourceId: "res-07", ressourceNom: "Bouchaib Rafi", ressourceType: "OUVRIER", chantierId: "ch-0006", chantierNom: "Hôtel Prestige Agadir", dateDebut: "2025-06-15", dateFin: "2025-09-30", tauxOccupation: 100 },
    { id: "aff-08", ressourceId: "res-08", ressourceNom: "Pelle hydraulique CAT 320", ressourceType: "ENGIN", chantierId: "ch-0002", chantierNom: "Résidence Al Fath – Lot B", dateDebut: "2025-06-01", dateFin: "2025-06-30", tauxOccupation: 100 },
    { id: "aff-09", ressourceId: "res-09", ressourceNom: "Grue Liebherr 100T", ressourceType: "ENGIN", chantierId: "ch-0003", chantierNom: "Centre Commercial Anfa", dateDebut: "2025-03-01", dateFin: "2026-06-30", tauxOccupation: 100 },
    { id: "aff-10", ressourceId: "res-10", ressourceNom: "Bétonnière 500L", ressourceType: "ENGIN", chantierId: "ch-0004", chantierNom: "Villa Privée Souissi", dateDebut: "2025-03-01", dateFin: "2025-08-31", tauxOccupation: 100 }
  ];
}
