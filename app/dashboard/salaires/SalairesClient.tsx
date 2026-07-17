"use client";

import { useState, useMemo } from "react";
import { hydrate } from "@/components/functions2";
import type { FichePaie, SalairesHydrated } from "@/components/functions2";
import { salairesHydrationConfig } from "@/components/functions2";
import { validerSalarie, payerSalarie, type SalarieDTO } from "@/lib/api/salaires";
import {
  ChartJsLoader, Section, ChartCard, Card,
  KpiGrid,
  PaymentProgress,
  PieChart,
  StackedBarChart,
  HorizontalBarChart,
  DonutChart,
  RefreshButton,
} from "@/components/Functions";

// ─── Main client component ────────────────────────────────────────────────────
export default function SalairesClient({
  fiches,
  onRefresh,
  refreshing,
}: {
  fiches: SalarieDTO[];
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const h = useMemo(
    () => hydrate<FichePaie, SalairesHydrated>(fiches as unknown as FichePaie[], salairesHydrationConfig),
    [fiches]
  );
  const [search, setSearch] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = search
    ? fiches.filter(f =>
      f.reference.toLowerCase().includes(search.toLowerCase()) ||
      (f.employe ? `${f.employe.nom} ${f.employe.prenom}`.toLowerCase().includes(search.toLowerCase()) : f.employeId.toLowerCase().includes(search.toLowerCase()))
    )
    : fiches;

  const runAction = async (id: string, action: "valider" | "payer") => {
    setActioningId(id);
    setActionError(null);
    try {
      if (action === "valider") await validerSalarie(id);
      else await payerSalarie(id);
      onRefresh?.();
    } catch {
      setActionError("Action impossible");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Salaires
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              Période {fiches[0]?.periode ?? "—"} · {fiches.length} fiches de paie
            </p>
          </div>
          {onRefresh && <RefreshButton onClick={onRefresh} loading={refreshing} />}
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

        <Section title="Liste des fiches de paie">
          <Card>
            <div className="px-4 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher par référence ou employé…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
              {actionError && <p className="text-xs text-red-500">{actionError}</p>}
            </div>
            <FichesTable fiches={filtered} actioningId={actioningId} onAction={runAction} />
          </Card>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

function FichesTable({
  fiches,
  actioningId,
  onAction,
}: {
  fiches: SalarieDTO[];
  actioningId: string | null;
  onAction: (id: string, action: "valider" | "payer") => void;
}) {
  if (fiches.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucune fiche de paie trouvée.</p>
      </div>
    );
  }

  const statutStyle: Record<SalarieDTO["statut"], { bg: string; text: string; dot: string; label: string }> = {
    BROUILLON: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280", label: "Brouillon" },
    VALIDE: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb", label: "Validée" },
    PAYEE: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a", label: "Payée" },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Référence", "Employé", "Période", "Salaire base", "Net à payer", "Statut", "Actions"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fiches.map(f => {
            const style = statutStyle[f.statut] ?? statutStyle.BROUILLON;
            const isBusy = actioningId === f.id;
            return (
              <tr key={f.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{f.reference}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">
                  {f.employe ? `${f.employe.nom} ${f.employe.prenom}` : f.employeId}
                </td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{f.periode}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{f.salaireBase.toLocaleString("fr-FR")} MAD</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark whitespace-nowrap">{f.netAPayer.toLocaleString("fr-FR")} MAD</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                    {style.label}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {f.statut === "BROUILLON" && (
                    <button
                      onClick={() => onAction(f.id, "valider")}
                      disabled={isBusy}
                      className="px-3 py-1.5 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 disabled:opacity-50 transition-colors"
                    >
                      {isBusy ? "…" : "Valider"}
                    </button>
                  )}
                  {f.statut === "VALIDE" && (
                    <button
                      onClick={() => onAction(f.id, "payer")}
                      disabled={isBusy}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {isBusy ? "…" : "Payer"}
                    </button>
                  )}
                  {f.statut === "PAYEE" && (
                    <span className="text-xs text-content-muted dark:text-content-muted-dark">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
