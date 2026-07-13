"use client";

import { hydrate } from "@/components/functions2";
import type { Article, CatalogueHydrated } from "@/components/functions2";
import { catalogueHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  PieChart,
  DonutChart,
  HorizontalBarChart,
} from "@/components/Functions";

export default function CatalogueClient({ articles }: { articles: Article[] }) {
  const h = hydrate<Article, CatalogueHydrated>(articles, catalogueHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Catalogue
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {articles.length} articles · {articles.filter(a => a.actif).length} actifs
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Répartition du catalogue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Articles par catégorie">
              <PieChart data={h.articlesParCategorie} />
            </ChartCard>
            <ChartCard title="Prix de référence moyen par catégorie (MAD HT)">
              <HorizontalBarChart data={h.prixParCategorie} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & prix">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Actifs / Inactifs" className="sm:col-span-1">
              <DonutChart data={h.statuses} />
            </ChartCard>
            <ChartCard title="Top articles par prix de référence" className="sm:col-span-2">
              <HorizontalBarChart data={h.topArticlesPrix} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Fournisseurs préférentiels">
          <ChartCard title="Nombre d'articles couverts par fournisseur préférentiel">
            <HorizontalBarChart data={h.fournisseursPreferentiels} />
          </ChartCard>
        </Section>

      </div>
    </ChartJsLoader>
  );
}
