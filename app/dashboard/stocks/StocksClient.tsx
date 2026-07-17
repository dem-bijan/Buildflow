"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchStocksByChantier, type StockArticleDTO } from "@/lib/api/stocks";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";
import {
  Section, Card,
  KpiGrid,
  RefreshButton,
} from "@/components/Functions";
import type { KpiItem } from "@/components/Functions";

export default function StocksClient() {
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [chantierId, setChantierId] = useState<string>("");
  const [stocks, setStocks] = useState<StockArticleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadChantiers = useCallback(async () => {
    try {
      const data = await fetchChantiers();
      setChantiers(data);
      if (data.length > 0) {
        setChantierId((prev) => prev || data[0].id);
      }
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    }
  }, []);

  const loadStocks = useCallback(async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStocksByChantier(id);
      setStocks(data);
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChantiers(); }, [loadChantiers]);
  useEffect(() => { if (chantierId) loadStocks(chantierId); }, [chantierId, loadStocks]);

  const filtered = search
    ? stocks.filter(s =>
      s.articleCode.toLowerCase().includes(search.toLowerCase()) ||
      s.designation.toLowerCase().includes(search.toLowerCase())
    )
    : stocks;

  const enAlerte = stocks.filter(s => s.enAlerte);
  const kpis: KpiItem[] = [
    { label: "Articles en stock", value: `${stocks.length}`, sub: chantiers.find(c => c.id === chantierId)?.nom ?? "" },
    { label: "Alertes seuil", value: `${enAlerte.length}`, sub: "articles à réapprovisionner" },
    { label: "Quantité théorique totale", value: `${stocks.reduce((s, a) => s + a.quantiteTheorique, 0).toLocaleString("fr-FR")}`, sub: "toutes unités confondues" },
  ];

  if (chantiers.length === 0 && !error && loading) {
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

  if (error && stocks.length === 0 && chantiers.length === 0) {
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
        <button onClick={() => loadChantiers()} className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors">
          Réessayer
        </button>
      </div>
    );
  }

  return (
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Stocks
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {stocks.length} articles · {enAlerte.length} alertes seuil
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={chantierId}
              onChange={(e) => setChantierId(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
            >
              {chantiers.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
            <RefreshButton onClick={() => loadStocks(chantierId)} loading={loading} />
          </div>
        </div>

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={kpis} />
        </Section>

        <Section title="Liste des articles en stock">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par code ou désignation…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <StocksTable stocks={filtered} />
          </Card>
        </Section>
      </div>
  );
}

function StocksTable({ stocks }: { stocks: StockArticleDTO[] }) {
  if (stocks.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun article en stock pour ce chantier.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Désignation", "Unité", "Chantier", "Qté théorique", "Seuil alerte", "Statut"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
              <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{s.articleCode}</td>
              <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[240px] truncate">{s.designation}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.unite}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.chantierNom}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.quantiteTheorique.toLocaleString("fr-FR")}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.seuilAlerte.toLocaleString("fr-FR")}</td>
              <td className="px-3 py-3">
                {s.enAlerte ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                    En alerte
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
