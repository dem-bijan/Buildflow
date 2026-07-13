"use client";

import { hydrate } from "@/components/functions2";
import type {
  StockArticle, StocksHydrated,
} from "@/components/functions2";
import {
  stocksHydrationConfig,
} from "@/components/functions2";
import {
  ChartJsLoader,
  Section, ChartCard,
  KpiGrid,
  PaymentProgress,
  HorizontalBarChart,
  PieChart,
  DonutChart,
} from "@/components/Functions";

export default function StocksPage() {

  const RAW_STOCKS: StockArticle[] = [
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
      valeurStock: 30030,
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
      valeurStock: 33603,
      dernierMouvement: "2025-06-14",
      mouvements: [
        { id: "m9", date: "2025-06-14", type: "SORTIE", quantite: 288, motif: "Réseau distribution eau froide", referenceDoc: "BON-S-0025", chantierNom: "Résidence Al Fath – Lot A" },
      ],
    },
    {
      id: "s-0006",
      articleCode: "DIP-CDR-25",
      designation: "DIPALIME CDR 25 ",
      categorie: "RANG",
      unite: "gr",
      quantiteDisponible: 1930,
      seuilAlerte: 140,
      depot: "Dépôt Central RABAT",
      prixUnitaireMoyen: 40,
      valeurStock: 97200,
      dernierMouvement: "2025-09-12",
      mouvements: [
        { id: "m1", date: "2025-06-08", type: "ENTREE", quantite: 300, motif: "Livraison CMD-2025-0041", referenceDoc: "BL-2025-0041" },
        { id: "m2", date: "2025-06-09", type: "SORTIE", quantite: 80, motif: "Consommation chantier", referenceDoc: "BON-S-0021", chantierNom: "Résidence Al Fath – Lot B" },
      ],
    },
  ];


  const h = hydrate<StockArticle, StocksHydrated>(RAW_STOCKS, stocksHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Stocks
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {RAW_STOCKS.length} articles · {RAW_STOCKS.filter(s => s.quantiteDisponible <= s.seuilAlerte).length} alertes seuil
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Niveaux de stock">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition & alertes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Valeur du stock par catégorie">
              <PieChart data={h.valeurParCategorie} />
            </ChartCard>
            <ChartCard title="Articles sous le seuil d'alerte (écart)">
              <HorizontalBarChart data={h.alertes} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Mouvements & dépôts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Types de mouvements" className="sm:col-span-1">
              <DonutChart data={h.mouvementsParType} />
            </ChartCard>
            <ChartCard title="Valeur stock par dépôt" className="sm:col-span-2">
              <HorizontalBarChart data={h.stockParDepot} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}