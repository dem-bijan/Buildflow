"use client";

import { hydrate } from "@/components/functions2";
import type { ContratSousTraitance, SousTraitanceHydrated } from "@/components/functions2";
import { sousTraitanceHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  StackedBarChart,
  HorizontalBarChart,
  PaymentProgress,
  DonutChart,
} from "@/components/Functions";

export default function SousTraitanceClient({ contrats }: { contrats: ContratSousTraitance[] }) {
  const h = hydrate<ContratSousTraitance, SousTraitanceHydrated>(contrats, sousTraitanceHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Sous-traitance
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {contrats.length} contrats · {contrats.filter(c => c.statut === "EN_COURS").length} en cours
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Avancement des paiements ST">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition des engagements">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montant TTC par sous-traitant">
              <HorizontalBarChart data={h.montantsParST} />
            </ChartCard>
            <ChartCard title="Payé vs restant par contrat">
              <StackedBarChart data={h.payeVsRestant} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & échéances">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des contrats">
              <DonutChart data={h.statutsContrats} />
            </ChartCard>
            <ChartCard title="Statuts des échéances">
              <DonutChart data={h.echeancesParStatut} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}
