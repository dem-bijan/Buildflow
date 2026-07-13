"use client";

import { hydrate } from "@/components/functions2";
import type { FichePaie, SalairesHydrated } from "@/components/functions2";
import { salairesHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  PaymentProgress,
  PieChart,
  StackedBarChart,
  HorizontalBarChart,
  DonutChart,
} from "@/components/Functions";

// ─── Main client component ────────────────────────────────────────────────────
export default function SalairesClient({ fiches }: { fiches: FichePaie[] }) {
  const h = hydrate<FichePaie, SalairesHydrated>(fiches, salairesHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Salaires
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            Période {fiches[0]?.periode ?? "—"} · {fiches.length} fiches de paie
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Avancement des virements">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition de la masse salariale">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Masse brute par département">
              <PieChart data={h.masseSalarialeParDept} />
            </ChartCard>
            <ChartCard title="Gains vs retenues par employé">
              <StackedBarChart data={h.gainsVsRetenues} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & top salaires">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts des fiches" className="sm:col-span-1">
              <DonutChart data={h.statutsFiches} />
            </ChartCard>
            <ChartCard title="Salaires nets" className="sm:col-span-2">
              <HorizontalBarChart data={h.topSalaires} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

// ─── Re-usable widget (used on the main dashboard page) ───────────────────────
// Receives pre-fetched fiches as props so it can be embedded anywhere.
export function GetStackBarchart({ fiches }: { fiches: FichePaie[] }) {
  const h = hydrate<FichePaie, SalairesHydrated>(fiches, salairesHydrationConfig);
  return (
    <ChartCard title="Gains vs retenues par employé">
      <StackedBarChart data={h.gainsVsRetenues} />
    </ChartCard>
  );
}
