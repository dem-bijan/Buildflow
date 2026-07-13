import type { Employe } from "@/components/functions2";

export async function getEmployes(): Promise<Employe[]> {
  // MOCK data – replace with real DB call later
  return [
    {
      id: "emp-001",
      matricule: "EMP-001",
      nom: "Fassi",
      prenom: "Mehdi",
      role: "PM",
      poste: "Ingénieur Chef de Projet",
      departement: "Travaux",
      telephone: "+212 661 10 20 30",
      email: "m.fassi@buildflow.ma",
      dateEmbauche: "2019-03-01",
      chantierActuelId: "ch-0001",
      chantierActuelNom: "Résidence Al Fath – Lot A",
      statut: "ACTIF",
      salaireBrut: 22000,
      typeContrat: "CDI",
    },
    {
      id: "emp-002",
      matricule: "EMP-002",
      nom: "El KENANNI",
      prenom: "Sara",
      role: "PM",
      poste: "Ingénieure Chef de Projet",
      departement: "Travaux",
      telephone: "+212 661 20 30 40",
      email: "s.elamrani@buildflow.ma",
      dateEmbauche: "2020-07-15",
      chantierActuelId: "ch-0003",
      chantierActuelNom: "Centre Commercial Anfa",
      statut: "ACTIF",
      salaireBrut: 21000,
      typeContrat: "CDI",
    },
    {
      id: "emp-003",
      matricule: "EMP-003",
      nom: "Tazi",
      prenom: "Omar",
      role: "PM",
      poste: "Ingénieur Chef de Projet",
      departement: "Travaux",
      telephone: "+212 661 30 40 50",
      email: "o.tazi@buildflow.ma",
      dateEmbauche: "2022-01-10",
      chantierActuelId: "ch-0006",
      chantierActuelNom: "Hôtel Prestige Agadir",
      statut: "ACTIF",
      salaireBrut: 19500,
      typeContrat: "CDI",
    },
    // ... add remaining employees as needed ...
  ];
}
