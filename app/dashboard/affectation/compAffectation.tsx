"use client";
import { getAffectations } from "@/lib/data/affectation";
import { hydrate } from "@/components/functions2";
import type { Affectation, AffectationHydrated } from "@/components/functions2";
import { affectationHydrationConfig } from "@/components/functions2";
import {
    ChartCard,
    HorizontalBarChart,
    DonutChart,
} from "@/components/Functions";


export default function CompAffectation() {
    const affectations = getAffectations();
    const h = hydrate<Affectation, AffectationHydrated>(affectations, affectationHydrationConfig);

    return (
        <div >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ChartCard title="Types de ressources affectées" className="sm:col-span-1">
                    <DonutChart data={h.ressourcesParType} />
                </ChartCard>
                <ChartCard title="Affectations par chantier" className="sm:col-span-2">
                    <HorizontalBarChart data={h.affectationsParChantier} />
                </ChartCard>
            </div>
        </div>

    )


}