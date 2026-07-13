"use client";

import { useEffect, useState } from "react";
import { hydrate } from "@/components/functions2";
import type { FichePaie, SalairesHydrated } from "@/components/functions2";
import { salairesHydrationConfig } from "@/components/functions2";
import { ChartCard, StackedBarChart } from "@/components/Functions";
import { getFichesPaie } from "@/lib/data/salaires";

export function GetStackBarchart() {
  const [data, setData] = useState<FichePaie[]>([]);

  useEffect(() => {
    getFichesPaie().then((res) => {
      setData(res);
    });
  }, []);

  if (data.length === 0) {
    return (
      <ChartCard title="Gains vs retenues par employé">
        <div className="flex h-48 items-center justify-center text-sm text-content-muted">
          Chargement...
        </div>
      </ChartCard>
    );
  }

  const h = hydrate<FichePaie, SalairesHydrated>(data, salairesHydrationConfig);

  return (
    <ChartCard title="Gains vs retenues par employé">
      <StackedBarChart data={h.gainsVsRetenues} />
    </ChartCard>
  );
}
