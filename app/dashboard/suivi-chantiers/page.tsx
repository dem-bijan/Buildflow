"use client";


import type {
  Chantier, ChantiersHydrated,
} from "@/components/functions2";
import {
  chantiersHydrationConfig,
} from "@/components/functions2";
import { hydrate } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  StackedBarChart,
  LineChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  CommandesTable,
} from "@/components/Functions";

export default function ChantiersPage() {

  const RAW_CHANTIERS: Chantier[] = [
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
      budgetHT: 2500000,
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
  const h = hydrate<Chantier, ChantiersHydrated>(RAW_CHANTIERS, chantiersHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Suivi chantiers
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {RAW_CHANTIERS.filter(c => c.statut === "EN_COURS").length} chantiers en cours · {RAW_CHANTIERS.length} au total
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Budget vs dépenses">
          <ChartCard title="Budget HT vs dépenses engagées par chantier">
            <StackedBarChart data={h.budgetVsDepenses} />
          </ChartCard>
        </Section>

        <Section title="Avancement & statuts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts chantiers" className="sm:col-span-1">
              <DonutChart data={h.statutsChantiers} />
            </ChartCard>
            <ChartCard title="Avancement par chantier (%)" className="sm:col-span-2">
              <HorizontalBarChart data={h.avancement} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Jalons & répartition géographique">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des jalons (tous chantiers)">
              <DonutChart data={h.jalonsSummary} />
            </ChartCard>
            <ChartCard title="Dépenses engagées par ville">
              <PieChart data={h.depensesParVille} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}
