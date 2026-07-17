"use client";
import { useState, useEffect, useMemo } from "react";
import { getAchats } from "@/lib/data/achats";
import { hydrate } from "@/components/functions2";
import type { Achat, AchatsHydrated } from "@/components/functions2";
import { achatsHydrationConfig } from "@/components/functions2";
import { ChartCard, PieChart, StackedBarChart } from "@/components/Functions";

export default function CompAchats() {
    const [achats, setAchats] = useState<Achat[]>([]);

    useEffect(() => {
        getAchats().then(setAchats);
    }, []);

    const hydrated = useMemo(() => hydrate<Achat, AchatsHydrated>(achats, achatsHydrationConfig), [achats]);

    if (achats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <ChartCard title="Montants TTC par fournisseur" className="h-full">
                <PieChart data={hydrated.fournisseurs} />
            </ChartCard>
            <ChartCard title="HT vs TVA par commande" className="h-full">
                <StackedBarChart data={hydrated.budgetStacks} />
            </ChartCard>
        </div>
    );
}
