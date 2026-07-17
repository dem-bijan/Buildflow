"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchChantiers } from "@/lib/api/chantier";
import { hydrate } from "@/components/functions2";
import type { Chantier, ChantiersHydrated } from "@/components/functions2";
import { chantiersHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard, Card,
  KpiGrid,
  StackedBarChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  RefreshButton,
} from "@/components/Functions";
import type { ChantierDTO } from "@/lib/api/chantier";

const STATUT_LABELS: Record<string, string> = {
  EN_PREPARATION: "En préparation",
  EN_COURS: "En cours",
  EN_PAUSE: "En pause",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const STATUT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  EN_PREPARATION: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb" },
  EN_COURS: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
  EN_PAUSE: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "#eda100" },
  TERMINE: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280" },
  ANNULE: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "#dc2626" },
};

export default function SuiviChantiersClient() {
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChantiers();

      const mapped: ChantierDTO[] = (data || []).map(c => ({
        ...c,
        depensesHT: c.depensesHt ?? 0,
        budgetHT: c.budgetHt ?? 0,
        avancement: c.avancement ?? 0,
        jalons: c.jalons ?? [],
        soustraitantsActifs: c.soustraitantsActifs ?? []
      }));

      setChantiers(mapped);
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const h = useMemo(
    () => hydrate<Chantier, ChantiersHydrated>(chantiers as unknown as Chantier[], chantiersHydrationConfig),
    [chantiers]
  );

  if (loading && chantiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
        </div>
        <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
          Chargement…
        </p>
      </div>
    );
  }

  if (error && chantiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-content-primary dark:text-content-primary-dark">Connexion impossible</p>
          <p className="text-sm text-content-muted dark:text-content-muted-dark max-w-md">{error}</p>
        </div>
        <button onClick={() => load()} className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors">
          Réessayer
        </button>
      </div>
    );
  }

  const filtered = search
    ? chantiers.filter(c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase())
    )
    : chantiers;

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Suivi chantiers
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {chantiers.filter(c => c.statut === "EN_COURS").length} chantiers en cours · {chantiers.length} au total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={() => load()} loading={loading} />
          </div>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Budget vs dépenses">
          <ChartCard title="Budget HT vs dépenses engagées par chantier">
            <StackedBarChart data={h.budgetVsDepenses} />
          </ChartCard>
        </Section>

        <Section title="Avancement & statuts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts chantiers" className="sm:col-span-1">
              <DonutChart data={h.statutsChantiers} />
            </ChartCard>
            <ChartCard title="Avancement par chantier (%)" className="sm:col-span-2">
              <HorizontalBarChart data={h.avancement} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Jalons & répartition géographique">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des jalons (tous chantiers)">
              <DonutChart data={h.jalonsSummary} />
            </ChartCard>
            <ChartCard title="Dépenses engagées par ville">
              <PieChart data={h.depensesParVille} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Liste des chantiers">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par code, nom, client, ville…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <ChantiersTable chantiers={filtered} />
          </Card>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

function ChantiersTable({ chantiers }: { chantiers: ChantierDTO[] }) {
  if (chantiers.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun chantier trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Nom", "Client", "Ville", "Statut", "Début", "Fin prévue", "Budget HT", "Avancement"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chantiers.map(c => {
            const style = STATUT_STYLES[c.statut] ?? STATUT_STYLES.EN_PREPARATION;
            return (
              <tr key={c.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{c.code}</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[220px] truncate">{c.nom}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.client}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.ville}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                    {STATUT_LABELS[c.statut] ?? c.statut}
                  </span>
                </td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.dateDebut}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.dateFin}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.budgetHt.toLocaleString("fr-FR")} MAD</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.avancement}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
