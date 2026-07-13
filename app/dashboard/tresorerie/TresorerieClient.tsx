"use client";

import { hydrate, hydratedSoldeCaisses } from "@/components/functions2";
import type { Transaction, TresorerieHydrated, Caisse } from "@/components/functions2";
import { tresorerieHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard,
  KpiGrid,
  StackedBarChart,
  LineChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
} from "@/components/Functions";

interface Props {
  transactions: Transaction[];
  caisses: Caisse[];
}

export default function TresorerieClient({ transactions, caisses }: Props) {
  const h = hydrate<Transaction, TresorerieHydrated>(transactions, tresorerieHydrationConfig);
  const soldeCaisses = hydratedSoldeCaisses(caisses);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Trésorerie
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {transactions.length} transactions · {caisses.length} caisses / comptes
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Flux encaissements vs décaissements">
          <ChartCard title="Évolution quotidienne des flux">
            <LineChart data={h.encVsDecParJour} />
          </ChartCard>
        </Section>

        <Section title="Répartition des flux">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Encaissements vs décaissements" className="sm:col-span-1">
              <DonutChart data={h.repartitionFlux} />
            </ChartCard>
            <ChartCard title="Volume par catégorie" className="sm:col-span-2">
              <HorizontalBarChart data={h.fluxParCategorie} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Soldes & top décaissements">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Solde par caisse / compte bancaire">
              <HorizontalBarChart data={soldeCaisses} />
            </ChartCard>
            <ChartCard title="Top 6 décaissements du mois">
              <HorizontalBarChart data={h.topDecaissements} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}
