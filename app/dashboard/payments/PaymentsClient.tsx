"use client";

import { hydrate } from "@/components/functions2";
import type { Paiement, PaiementsHydrated } from "@/components/functions2";
import { paiementsHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  PaymentProgress,
  StackedBarChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
} from "@/components/Functions";

export default function PaymentsClient({ paiements }: { paiements: Paiement[] }) {
  const h = hydrate<Paiement, PaiementsHydrated>(paiements, paiementsHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Paiements
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {paiements.length} paiements · {paiements.filter(p => p.statut === "EN_RETARD").length} en retard
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Avancement global">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition par type">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montants par type de paiement">
              <PieChart data={h.montantsParType} />
            </ChartCard>
            <ChartCard title="Payé vs restant par type">
              <StackedBarChart data={h.payeVsRestantParType} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & échéances proches">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts des paiements" className="sm:col-span-1">
              <DonutChart data={h.statutsPaiements} />
            </ChartCard>
            <ChartCard title="Prochaines échéances à régler" className="sm:col-span-2">
              <HorizontalBarChart data={h.echeancesProches} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}
