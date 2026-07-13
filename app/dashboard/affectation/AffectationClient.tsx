"use client";

import { hydrate } from "@/components/functions2";
import type { Affectation, AffectationHydrated } from "@/components/functions2";
import CompAffectation from "./compAffectation";
import { affectationHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader,
  Section, ChartCard,
  KpiGrid,
  StackedBarChart,
  HorizontalBarChart,
  DonutChart,
} from "@/components/Functions";

export default function AffectationClient({ affectations }: { affectations: Affectation[] }) {
  const h = hydrate<Affectation, AffectationHydrated>(affectations, affectationHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Affectation ressources
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {new Set(affectations.map(a => a.ressourceId)).size} ressources · {new Set(affectations.map(a => a.chantierId)).size} chantiers
          </p>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <CompAffectation></CompAffectation>

        <Section title="Charge & composition">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Durée d'affectation par ressource (jours)">
              <HorizontalBarChart data={h.chargeParRessource} />
            </ChartCard>
            <ChartCard title="Composition des équipes par chantier">
              <StackedBarChart data={h.typesParChantier} />
            </ChartCard>
          </div>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

