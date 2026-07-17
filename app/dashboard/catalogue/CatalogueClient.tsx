"use client";

import { useState, useMemo } from "react";
import { hydrate } from "@/components/functions2";
import type { Article, CatalogueHydrated } from "@/components/functions2";
import { catalogueHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard, Card,
  KpiGrid,
  PieChart,
  DonutChart,
  HorizontalBarChart,
  RefreshButton,
} from "@/components/Functions";

export default function CatalogueClient({
  articles,
  onRefresh,
  refreshing,
}: {
  articles: Article[];
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const h = useMemo(() => hydrate<Article, CatalogueHydrated>(articles, catalogueHydrationConfig), [articles]);
  const [search, setSearch] = useState("");

  const filtered = search
    ? articles.filter(a =>
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.categorieLibelle.toLowerCase().includes(search.toLowerCase())
    )
    : articles;

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Catalogue
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {articles.length} articles · {articles.filter(a => a.actif).length} actifs
            </p>
          </div>
          {onRefresh && <RefreshButton onClick={onRefresh} loading={refreshing} />}
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

        <Section title="Liste des articles">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par code, désignation, catégorie…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <ArticlesTable articles={filtered} />
          </Card>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

function ArticlesTable({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun article trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Désignation", "Catégorie", "Unité", "Prix réf. HT", "TVA", "Statut"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
              <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{a.code}</td>
              <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[240px] truncate">{a.designation}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{a.categorieLibelle}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{a.unite}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{a.prixAchatRef.toLocaleString("fr-FR")} MAD</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{a.tvaRate}%</td>
              <td className="px-3 py-3">
                {a.actif ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280]" />
                    Inactif
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
