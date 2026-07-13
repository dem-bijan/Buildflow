"use client";

import type { Employe, AnnuaireHydrated } from "@/components/functions2";
import { hydrate } from "@/components/functions2";
import { annuaireHydrationConfig } from "@/components/functions2";
import { ChartJsLoader, Section, Card, ChartCard, KpiGrid, HorizontalBarChart, PieChart, DonutChart } from "@/components/Functions";

interface AnnuaireClientProps {
  employes: Employe[];
}

export default function AnnuaireClient({ employes }: AnnuaireClientProps) {
  const h = hydrate<Employe, AnnuaireHydrated>(employes, annuaireHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Annuaire RH
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {employes.filter(e => e.statut === "ACTIF").length} actifs · {employes.length} employés au total
          </p>
        </div>
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>
        <Section title="Masse salariale & effectifs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Masse salariale brute par rôle">
              <PieChart data={h.masseSalarialeParRole} />
            </ChartCard>
            <ChartCard title="Effectifs par département">
              <HorizontalBarChart data={h.employsParDept} />
            </ChartCard>
          </div>
        </Section>
        <Section title="Statuts & contrats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des employés">
              <DonutChart data={h.statutsEmployes} />
            </ChartCard>
            <ChartCard title="Répartition par type de contrat">
              <PieChart data={h.contratTypes} />
            </ChartCard>
          </div>
        </Section>
        <Section title="Ancienneté">
          <ChartCard title="Top 8 — ancienneté (années)">
            <HorizontalBarChart data={h.anciennete} />
          </ChartCard>
        </Section>
      </div>
    </ChartJsLoader>
  );
}
