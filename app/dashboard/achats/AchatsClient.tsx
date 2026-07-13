"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAchats } from "@/lib/api/achats";
import { hydrate } from "@/components/functions2";
import type { Achat, AchatsHydrated } from "@/components/functions2";
import { achatsHydrationConfig } from "@/components/functions2";
import { fmt } from "@/components/functions2";
import {
  ChartJsLoader,
  Section, Card, ChartCard,
  KpiGrid,
  PieChart,
  HorizontalBarChart,
  DonutChart,
  StackedBarChart,
  LineChart
} from "@/components/Functions";

export default function AchatsClient() {
  const [achats, setAchats] = useState<Achat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAchats();
      let items: any[] = [];
      
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        if ('content' in data && Array.isArray((data as any).content)) {
          items = (data as any).content;
        } else if ('data' in data && Array.isArray((data as any).data)) {
          items = (data as any).data;
        }
      }

      setAchats(items);
    } catch (err: unknown) {
      console.error("[AchatsClient] Error loading data:", err);
      const msg = err instanceof Error ? err.message : "Erreur de connexion au serveur";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? achats.filter(a =>
        a.ref.toLowerCase().includes(search.toLowerCase()) ||
        a.fournisseurNom.toLowerCase().includes(search.toLowerCase()) ||
        a.chantierNom.toLowerCase().includes(search.toLowerCase())
      )
    : achats;

  if (loading && achats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
        </div>
        <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
          Chargement des achats depuis le serveur…
        </p>
      </div>
    );
  }

  if (error && achats.length === 0) {
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

  const h = hydrate<Achat, AchatsHydrated>(achats, achatsHydrationConfig);

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Achats — Commandes
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {achats.length} commandes enregistrées · Données temps réel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => load()}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 disabled:opacity-50 transition-colors"
            >
              {loading ? "…" : "↻ Actualiser"}
            </button>
          </div>
        </div>

        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        {/* ── Charts ───────────────────────────────────────────────────── */}
        <Section title="Analyse financière">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="HT vs TVA par commande (MAD)">
              <StackedBarChart data={h.budgetStacks} />
            </ChartCard>
            <ChartCard title="Tendance HT vs TVA">
              <LineChart data={h.budgetTrend} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Répartition des achats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montants TTC par fournisseur">
              <PieChart data={h.fournisseurs} />
            </ChartCard>
            <ChartCard title="Montants TTC par chantier">
              <HorizontalBarChart data={h.chantiers} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & Articles">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts des commandes" className="sm:col-span-1">
              <DonutChart data={h.statuses} />
            </ChartCard>
            <ChartCard title="Top articles commandés (Valeur)" className="sm:col-span-2">
              <HorizontalBarChart data={h.articles} />
            </ChartCard>
          </div>
        </Section>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <Section title="Liste des commandes">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par référence, fournisseur, chantier…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <AchatsTable achats={filtered} />
          </Card>
        </Section>
      </div>
    </ChartJsLoader>
  );
}

function AchatsTable({ achats }: { achats: Achat[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (achats.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucune commande trouvée.</p>
      </div>
    );
  }

  const hTable = hydrate<Achat, AchatsHydrated>(achats, achatsHydrationConfig).table;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Réf", "Fournisseur", "Chantier", "Date", "HT", "TVA", "TTC", "Statut"].map(title => (
              <th key={title} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hTable.rows.map(row => {
            const isOpen = expanded === row.id;
            return (
              <tr
                key={row.id}
                onClick={() => setExpanded(isOpen ? null : row.id)}
                className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"}`}
              >
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{row.ref}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col1}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col2}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col3}</td>
                <td className="px-3 py-3 font-semibold text-content-primary dark:text-content-primary-dark">{fmt(row.ht)}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{fmt(row.tva)}</td>
                <td className="px-3 py-3 font-bold text-content-primary dark:text-content-primary-dark">{fmt(row.ttc)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${row.statusBg} ${row.statusText}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.statusDot }} />
                    {row.statusLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}