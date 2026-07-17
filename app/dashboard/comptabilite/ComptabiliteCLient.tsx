"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { fetchEcritures } from "@/lib/api/comptabilite";
import { hydrate } from "@/components/functions2";
import type { EcritureComptable, ComptabiliteHydrated } from "@/components/functions2";
import { comptabiliteHydrationConfig } from "@/components/functions2";
import {
    ChartJsLoader,
    Section,
    ChartCard,
    Card,
    KpiGrid,
    StackedBarChart,
    HorizontalBarChart,
    RefreshButton,
} from "@/components/Functions";

export default function ComptabiliteClient() {
    const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchEcritures();
            setEcritures(data ?? []);
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const h = useMemo(
        () => hydrate<EcritureComptable, ComptabiliteHydrated>(ecritures, comptabiliteHydrationConfig),
        [ecritures]
    );

    if (loading && ecritures.length === 0) {
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

    if (error && ecritures.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                    </svg>
                </div>

                <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-content-primary dark:text-content-primary-dark">
                        Connexion impossible
                    </p>

                    <p className="text-sm text-content-muted dark:text-content-muted-dark max-w-md">
                        {error}
                    </p>
                </div>

                <button
                    onClick={() => load()}
                    className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const filtered = search
        ? ecritures.filter(e =>
            e.pieceRef.toLowerCase().includes(search.toLowerCase()) ||
            e.libelle.toLowerCase().includes(search.toLowerCase()) ||
            e.journal.toLowerCase().includes(search.toLowerCase())
        )
        : ecritures;

    return (
        <ChartJsLoader>
            <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
                            Tableau de bord — Comptabilité
                        </h1>

                        <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
                            {ecritures.length} écritures ·{" "}
                            {new Set(ecritures.map((e) => e.journal)).size} journaux
                        </p>
                    </div>

                    <RefreshButton onClick={() => load()} loading={loading} />
                </div>


                <Section title="Vue d'ensemble des écritures">
                    <KpiGrid kpis={h.kpis} />
                </Section>


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

                <Section title="Liste des écritures">
                    <Card>
                        <div className="px-4 pt-4 pb-3">
                            <input
                                type="text"
                                placeholder="Rechercher par pièce, libellé, journal…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
                            />
                        </div>
                        <EcrituresTable ecritures={filtered} expanded={expanded} onToggle={(id) => setExpanded(prev => prev === id ? null : id)} />
                    </Card>
                </Section>

            </div>
        </ChartJsLoader>
    );
}

function EcrituresTable({
    ecritures,
    expanded,
    onToggle,
}: {
    ecritures: EcritureComptable[];
    expanded: string | null;
    onToggle: (id: string) => void;
}) {
    if (ecritures.length === 0) {
        return (
            <div className="px-4 py-12 text-center">
                <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucune écriture trouvée.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
                        {["Date", "Journal", "Pièce", "Libellé", "Montant", "Saisie par"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ecritures.map(e => {
                        const isOpen = expanded === e.id;
                        return (
                            <React.Fragment key={e.id}>
                                <tr
                                    onClick={() => onToggle(e.id)}
                                    className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"}`}
                                >
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{e.date}</td>
                                    <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{e.journal}</td>
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{e.pieceRef}</td>
                                    <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[240px] truncate">{e.libelle}</td>
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{e.montant.toLocaleString("fr-FR")} MAD</td>
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{e.saisiePar}</td>
                                </tr>
                                {isOpen && (
                                    <tr className="bg-surface-hover/50 dark:bg-surface-hover-dark/50">
                                        <td colSpan={6} className="px-3 py-3">
                                            <table className="w-full text-xs border-collapse">
                                                <thead>
                                                    <tr className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                                                        {["Compte", "Libellé", "Débit", "Crédit"].map(h => (
                                                            <th key={h} className="text-left px-2 py-1 font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(e.lignes ?? []).map(l => (
                                                        <tr key={l.id}>
                                                            <td className="px-2 py-1 font-mono text-content-secondary dark:text-content-secondary-dark">{l.compteNum}</td>
                                                            <td className="px-2 py-1 text-content-secondary dark:text-content-secondary-dark">{l.compteLibelle}</td>
                                                            <td className="px-2 py-1 text-content-secondary dark:text-content-secondary-dark">{l.debit ? l.debit.toLocaleString("fr-FR") : "—"}</td>
                                                            <td className="px-2 py-1 text-content-secondary dark:text-content-secondary-dark">{l.credit ? l.credit.toLocaleString("fr-FR") : "—"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}