"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchEcritures } from "@/lib/api/comptabilite";
import { hydrate } from "@/components/functions2";
import type { EcritureComptable, ComptabiliteHydrated } from "@/components/functions2";
import { comptabiliteHydrationConfig } from "@/components/functions2";
import {
    ChartJsLoader,
    Section,
    ChartCard,
    KpiGrid,
    StackedBarChart,
    HorizontalBarChart,
} from "@/components/Functions";

export default function ComptabiliteClient() {
    const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ecrituresData = await fetchEcritures();
            setEcritures(ecrituresData ?? []);
        } catch (err: unknown) {
            console.error("[ComptabiliteClient] Error loading data:", err);
            const msg = err instanceof Error ? err.message : "Erreur de connexion au serveur";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (loading && ecritures.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
                </div>
                <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
                    Chargement de la comptabilité depuis le serveur…
                </p>
            </div>
        );
    }

    if (error && ecritures.length === 0) {
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

    const h = hydrate<EcritureComptable, ComptabiliteHydrated>(ecritures, comptabiliteHydrationConfig);

    return (
        <ChartJsLoader>
            <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

                {/* ── Header ──────────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
                            Tableau de bord — Comptabilité
                        </h1>
                        <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
                            {ecritures.length} écritures · {new Set(ecritures.map(e => e.journal)).size} journaux · Données temps réel
                        </p>
                    </div>
                    <button
                        onClick={() => load()}
                        disabled={loading}
                        className="px-4 py-2 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "…" : "↻ Actualiser"}
                    </button>
                </div>

                {/* ── KPIs ─────────────────────────────────────────────────────── */}
                <Section title="Vue d'ensemble des écritures">
                    <KpiGrid kpis={h.kpis} />
                </Section>

                {/* ── Charts ───────────────────────────────────────────────────── */}
                <Section title="Mouvements par journal">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ChartCard title="Volume total par journal">
                            <HorizontalBarChart data={h.volumeParJournal} />
                        </ChartCard>
                        <ChartCard title="Débits vs crédits par journal">
                            <StackedBarChart data={h.debitsVsCredits} />
                        </ChartCard>
                    </div>
                </Section>

                <Section title="Top comptes débités">
                    <ChartCard title="Comptes les plus mouvementés (débit)">
                        <HorizontalBarChart data={h.topComptes} />
                    </ChartCard>
                </Section>

            </div>
        </ChartJsLoader>
    );
}