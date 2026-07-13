"use client";
import { useState, useEffect } from "react";
import { getTransactions } from "@/lib/data/tresorerie";
import { hydrate } from "@/components/functions2";
import type { Transaction, TresorerieHydrated } from "@/components/functions2";
import { tresorerieHydrationConfig } from "@/components/functions2";
import { ChartCard, LineChart } from "@/components/Functions";

export default function CompTresorerie() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getTransactions().then(setTransactions);
    }, []);

    if (transactions.length === 0) return null;

    const h = hydrate<Transaction, TresorerieHydrated>(transactions, tresorerieHydrationConfig);

    return (
        <div className="h-full">
            <ChartCard title="Évolution quotidienne des flux (Trésorerie)" className="h-full">
                <LineChart data={h.encVsDecParJour} />
            </ChartCard>
        </div>
    );
}
