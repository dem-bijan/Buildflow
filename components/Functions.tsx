"use client";

import { useEffect, useState, useRef, Fragment } from "react";
import { AchatStatus, Achat } from "@/app/utils/types";
import { fmt } from "@/app/utils/format";

// ─────────────────────────────────────────────────────────────────────────────
// 1. GENERIC PROP TYPES
//    Every chart accepts one of these — no domain knowledge inside the renderers.
// ─────────────────────────────────────────────────────────────────────────────

/** A single { label, value } pair used by bar / pie / donut charts. */
export interface DataPoint {
    label: string;
    value: number;
    /** Optional hex color override. Falls back to CHART_COLORS rotation. */
    color?: string;
}

export interface FournisseurHydrated {
    kpis: KpiItem[];

    // total CA per fournisseur (bar)
    caParFournisseur: DataPoint[];

    // HT vs TVA vs TTC per fournisseur (stacked)
    structureFinanciere: MultiSeriesData;

    // evolution command volume per fournisseur (line)
    volumeCommandes: MultiSeriesData;

    // market share (pie)
    partMarche: DataPoint[];

    // status distribution (global)
    status: StatusPoint[];

    // table view
    table: {
        id: string;
        nom: string;
        commandes: number;
        ht: number;
        tva: number;
        ttc: number;
        moyenneCommande: number;
    }[];
}

/** One series for a multi-dataset line / stacked-bar chart. */
export interface ChartSeries {
    label: string;
    data: number[];
    color: string;
    /** If true the dataset renders dashed (line charts). */
    dashed?: boolean;
    fill?: boolean;
}

/** Shape fed to every multi-series chart. */
export interface MultiSeriesData {
    labels: string[];
    series: ChartSeries[];
}

/** Shape fed to the KPI grid. */
export interface KpiItem {
    label: string;
    value: string;
    sub: string;
}

/** Shape fed to the payment-progress bar. */
export interface ProgressData {
    paidLabel: string;
    pendingLabel: string;
    paidPct: number;
    footerLabel: string;
}

/** Shape fed to StatusDonut — badge metadata lives here, not in the renderer. */
export interface StatusPoint extends DataPoint {
    badgeBg: string;
    badgeText: string;
}

/** Shape fed to CommandesTable — fully typed rows + expanded detail. */
export interface TableRow {
    id: string;
    ref: string;
    col1: string;   // fournisseur
    col2: string;   // chantier
    col3: string;   // date
    ht: number;
    tva: number;
    ttc: number;
    statusLabel: string;
    statusBg: string;
    statusText: string;
    statusDot: string;
    subRows: {
        code: string;
        designation: string;
        quantite: number;
        unite: string;
        prixUnitaire: number;
        total: number;
    }[];
    footnotes: { label: string; value: string }[];
}

export interface TableData {
    rows: TableRow[];
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HYDRATION FUNCTION
//    Single input (Achat[]) → all derived props. Zero domain logic leaks out.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_META: Record<AchatStatus, { label: string; bg: string; text: string; dot: string }> = {
    PAYE: { label: "Payé", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
    LIVRE: { label: "Livré", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb" },
    FACTURE: { label: "Facturé", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "#d97706" },
    EN_COURS: { label: "En cours", bg: "bg-surface-raised dark:bg-surface-raised-dark", text: "text-content-muted dark:text-content-muted-dark", dot: "#7a6050" },
};

const CHART_COLORS = ["#e2630a", "#c05a00", "#f5843a", "#7a2e00", "#ffd4b0"] as const;

export interface AchatsHydrated {
    kpis: KpiItem[];
    progress: ProgressData;
    budgetStacks: MultiSeriesData;   // stacked bar  HT + TVA per order
    budgetTrend: MultiSeriesData;   // line         HT vs TVA per order
    fournisseurs: DataPoint[];       // horizontal bar
    chantiers: DataPoint[];       // pie
    statuses: StatusPoint[];     // donut
    articles: DataPoint[];       // horizontal bar
    table: TableData;
}


export function hydrateAchats(achats: Achat[]): AchatsHydrated {
    // ── aggregates ──────────────────────────────────────────────────────────
    const totalTTC = achats.reduce((s, a) => s + a.ttc, 0);
    const totalHT = achats.reduce((s, a) => s + a.ht, 0);
    const totalTVA = achats.reduce((s, a) => s + a.tva, 0);
    const paidTTC = achats.filter(a => a.status === "PAYE").reduce((s, a) => s + a.ttc, 0);
    const pendingTTC = totalTTC - paidTTC;
    const paidPct = totalTTC > 0 ? Math.round((paidTTC / totalTTC) * 100) : 0;
    const enCours = achats.filter(a => a.status === "EN_COURS").length;
    const tvaPct = totalHT > 0 ? ((totalTVA / totalHT) * 100).toFixed(0) : "0";

    // ── kpis ────────────────────────────────────────────────────────────────
    const kpis: KpiItem[] = [
        { label: "Total TTC", value: fmt(totalTTC), sub: `HT : ${fmt(totalHT)}` },
        { label: "TVA déductible", value: fmt(totalTVA), sub: `${tvaPct}% du HT` },
        { label: "Encaissé", value: fmt(paidTTC), sub: `${paidPct}% du total` },
        { label: "En attente", value: fmt(pendingTTC), sub: "à régler" },
        { label: "Commandes", value: `${achats.length}`, sub: `${enCours} en cours` },
    ];

    // ── progress ────────────────────────────────────────────────────────────
    const progress: ProgressData = {
        paidLabel: `Payé : ${fmt(paidTTC)}`,
        pendingLabel: `En attente : ${fmt(pendingTTC)}`,
        paidPct,
        footerLabel: `${paidPct}% du total TTC encaissé`,
    };

    // ── budget stacked bar ──────────────────────────────────────────────────
    const orderLabels = achats.map(a => a.ref.replace("CMD-2025-", ""));
    const budgetStacks: MultiSeriesData = {
        labels: orderLabels,
        series: [
            { label: "HT", data: achats.map(a => a.ht), color: "#e2630a", fill: false },
            { label: "TVA", data: achats.map(a => a.tva), color: "#ffd4b0", fill: false },
        ],
    };

    // ── budget trend line ───────────────────────────────────────────────────
    const budgetTrend: MultiSeriesData = {
        labels: orderLabels,
        series: [
            { label: "HT", data: achats.map(a => a.ht), color: "#e2630a", fill: true, dashed: false },
            { label: "TVA", data: achats.map(a => a.tva), color: "#c05a00", fill: true, dashed: true },
        ],
    };

    // ── fournisseurs ────────────────────────────────────────────────────────
    const fournMap = achats.reduce<Record<string, number>>((acc, a) => {
        acc[a.fournisseurNom] = (acc[a.fournisseurNom] ?? 0) + a.ttc;
        return acc;
    }, {});
    const fournisseurs: DataPoint[] = Object.entries(fournMap)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }));

    // ── chantiers ───────────────────────────────────────────────────────────
    const chantMap = achats.reduce<Record<string, number>>((acc, a) => {
        acc[a.chantierNom] = (acc[a.chantierNom] ?? 0) + a.ttc;
        return acc;
    }, {});
    const chantiers: DataPoint[] = Object.entries(chantMap)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }));

    // ── statuses ─────────────────────────────────────────────────────────────
    const statusOrder: AchatStatus[] = ["PAYE", "LIVRE", "FACTURE", "EN_COURS"];
    const statuses: StatusPoint[] = statusOrder.map(s => ({
        label: STATUS_META[s].label,
        value: achats.filter(a => a.status === s).length,
        color: STATUS_META[s].dot,
        badgeBg: STATUS_META[s].bg,
        badgeText: STATUS_META[s].text,
    }));

    // ── articles ─────────────────────────────────────────────────────────────
    const artMap = achats.flatMap(a => a.lignes).reduce<Record<string, number>>((acc, l) => {
        const key = l.designation.length > 26 ? l.designation.slice(0, 24) + "…" : l.designation;
        acc[key] = (acc[key] ?? 0) + l.total;
        return acc;
    }, {});
    const articles: DataPoint[] = Object.entries(artMap)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }));

    // ── table ─────────────────────────────────────────────────────────────────
    const rows: TableRow[] = achats.map(a => {
        const m = STATUS_META[a.status];
        return {
            id: a.id,
            ref: a.ref,
            col1: a.fournisseurNom,
            col2: a.chantierNom,
            col3: new Date(a.dateCommande).toLocaleDateString("fr-MA"),
            ht: a.ht,
            tva: a.tva,
            ttc: a.ttc,
            statusLabel: m.label,
            statusBg: m.bg,
            statusText: m.text,
            statusDot: m.dot,
            subRows: a.lignes.map(l => ({
                code: l.articleCode,
                designation: l.designation,
                quantite: l.quantite,
                unite: l.unite,
                prixUnitaire: l.prixUnitaire,
                total: l.total,
            })),
            footnotes: [
                ...(a.bonLivraisonRef ? [{ label: "BL", value: a.bonLivraisonRef }] : []),
                ...(a.factureRef ? [{ label: "Facture", value: a.factureRef }] : []),
            ],
        };
    });

    const table: TableData = { rows, totalHT, totalTVA, totalTTC };

    return { kpis, progress, budgetStacks, budgetTrend, fournisseurs, chantiers, statuses, articles, table };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CHART.JS INFRASTRUCTURE
// ─────────────────────────────────────────────────────────────────────────────

export function ChartJsLoader({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if ((window as unknown as { Chart?: unknown }).Chart) { setLoaded(true); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        s.onload = () => setLoaded(true);
        document.head.appendChild(s);
    }, []);
    if (!loaded) return (
        <div className="flex items-center justify-center min-h-screen bg-surface-page dark:bg-surface-page-dark">
            <p className="text-content-muted dark:text-content-muted-dark text-sm animate-pulse">Chargement des graphiques…</p>
        </div>
    );
    return <>{children}</>;
}

function useChart(
    ref: React.RefObject<HTMLCanvasElement | null>,
    config: () => object,
    deps: unknown[]
) {
    useEffect(() => {
        const win = window as unknown as { Chart: new (...a: unknown[]) => { destroy(): void } };
        if (!win.Chart || !ref.current) return;
        const chart = new win.Chart(ref.current, (config as () => object)());
        return () => chart.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LAYOUT PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="block w-0.5 h-3.5 rounded-sm bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-content-muted dark:text-content-muted-dark">
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-surface-card dark:bg-surface-card-dark border border-edge-subtle dark:border-edge-subtle-dark rounded-xl ${className}`}>
            {children}
        </div>
    );
}

export function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <Card className={`p-4 sm:p-5 ${className}`}>
            <p className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark mb-4 uppercase tracking-wide">
                {title}
            </p>
            {children}
        </Card>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KPI GRID
// ─────────────────────────────────────────────────────────────────────────────

export function KpiGrid({ kpis }: { kpis: KpiItem[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpis.map(({ label, value, sub }) => (
                <Card key={label} className="flex flex-col p-4 justify-center items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted dark:text-content-muted-dark mb-1 text-center">{label}</p>
                    <p className="text-lg sm:text-xl font-bold text-content-primary dark:text-content-primary-dark leading-tight">{value}</p>
                    <p className="text-[11px] text-content-muted dark:text-content-muted-dark mt-1">{sub}</p>
                </Card>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PAYMENT PROGRESS
// ─────────────────────────────────────────────────────────────────────────────

export function PaymentProgress({ data }: { data: ProgressData }) {
    return (
        <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{data.paidLabel}</span>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{data.pendingLabel}</span>
            </div>
            <div className="h-2.5 rounded-full bg-surface-raised dark:bg-surface-raised-dark overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${data.paidPct}%`, background: "linear-gradient(90deg,#16a34a,#22c55e)" }}
                />
            </div>
            <p className="text-xs text-content-muted dark:text-content-muted-dark mt-2">{data.footerLabel}</p>
        </Card>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. STACKED BAR CHART  (MultiSeriesData)
// ─────────────────────────────────────────────────────────────────────────────

export function StackedBarChart({ data }: { data: MultiSeriesData }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "bar",
        data: {
            labels: data.labels,
            datasets: data.series.map(s => ({
                label: s.label,
                data: s.data,
                backgroundColor: s.color,
                borderRadius: 3,
                stack: "s",
            })),
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { dataset: { label: string }; parsed: { y: number } }) => `${ctx.dataset.label} : ${fmt(ctx.parsed.y)}` } },
            },
            scales: {
                x: { stacked: true, ticks: { font: { size: 11 }, color: "#7a6050" }, grid: { display: false } },
                y: { stacked: true, ticks: { font: { size: 11 }, color: "#7a6050", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "rgba(0,0,0,0.06)" } },
            },
        },
    }), [data]);

    return (
        <>
            <SeriesLegend series={data.series} />
            <div className="relative h-48 sm:h-56"><canvas ref={ref} /></div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LINE CHART  (MultiSeriesData)
// ─────────────────────────────────────────────────────────────────────────────

export function LineChart({ data }: { data: MultiSeriesData }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "line",
        data: {
            labels: data.labels,
            datasets: data.series.map(s => ({
                label: s.label,
                data: s.data,
                borderColor: s.color,
                backgroundColor: s.color + "14",
                tension: 0.35,
                fill: s.fill ?? false,
                borderDash: s.dashed ? [5, 4] : [],
                pointBackgroundColor: s.color,
                pointRadius: 5,
            })),
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { dataset: { label: string }; parsed: { y: number } }) => `${ctx.dataset.label} : ${fmt(ctx.parsed.y)}` } },
            },
            scales: {
                x: { ticks: { font: { size: 11 }, color: "#7a6050", maxRotation: 0 }, grid: { display: false } },
                y: { ticks: { font: { size: 11 }, color: "#7a6050", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "rgba(0,0,0,0.06)" } },
            },
        },
    }), [data]);

    return (
        <>
            <SeriesLegend series={data.series} />
            <div className="relative h-48 sm:h-56"><canvas ref={ref} /></div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. HORIZONTAL BAR CHART  (DataPoint[])
// ─────────────────────────────────────────────────────────────────────────────

export function HorizontalBarChart({ data }: { data: DataPoint[] }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "bar",
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color ?? "#e2630a"),
                borderRadius: 4,
            }],
        },
        options: {
            indexAxis: "y" as const,
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: { parsed: { x: number } }) => fmt(ctx.parsed.x) } } },
            scales: {
                x: { ticks: { font: { size: 11 }, color: "#7a6050", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "rgba(0,0,0,0.06)" } },
                y: { ticks: { font: { size: 11 }, color: "#4a3020" }, grid: { display: false } },
            },
        },
    }), [data]);

    return <div className="relative" style={{ height: data.length * 46 + 32 }}><canvas ref={ref} /></div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. PIE CHART  (DataPoint[]) — with legend below
// ─────────────────────────────────────────────────────────────────────────────

export function PieChart({ data }: { data: DataPoint[] }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const total = data.reduce((s, d) => s + d.value, 0);
    useChart(ref, () => ({
        type: "pie",
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color ?? "#e2630a"),
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.8)",
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: { label: string; parsed: number }) =>
                            `${ctx.label} : ${fmt(ctx.parsed)} (${total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0}%)`,
                    },
                },
            },
        },
    }), [data]);

    return (
        <>
            <div className="relative h-44 sm:h-52 mb-4"><canvas ref={ref} /></div>
            <div className="flex flex-col gap-2">
                {data.map(d => (
                    <div key={d.label} className="flex items-center gap-2 text-xs">
                        <span className="shrink-0 w-2 h-2 rounded-sm" style={{ background: d.color }} />
                        <span className="flex-1 text-content-secondary dark:text-content-secondary-dark truncate">{d.label}</span>
                        <span className="text-content-muted dark:text-content-muted-dark tabular-nums">{fmt(d.value)}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. DONUT CHART  (StatusPoint[]) — knows about badge metadata
// ─────────────────────────────────────────────────────────────────────────────

export function DonutChart({ data }: { data: StatusPoint[] }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "doughnut",
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color ?? "#e2630a"),
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.9)",
                hoverOffset: 4,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: "65%",
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { label: string; parsed: number }) => `${ctx.label} : ${ctx.parsed}` } },
            },
        },
    }), [data]);

    return (
        <>
            <div className="relative h-40 flex justify-center"><canvas ref={ref} /></div>
            <div className="flex flex-col gap-2 mt-3">
                {data.map(d => (
                    <div key={d.label} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                            <span className="text-content-secondary dark:text-content-secondary-dark">{d.label}</span>
                        </span>
                        <span className="font-semibold text-content-primary dark:text-content-primary-dark">{d.value}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. COMMANDES TABLE  (TableData)
// ─────────────────────────────────────────────────────────────────────────────

export function CommandesTable({ data }: { data: TableData }) {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm border-collapse min-w-[640px]">
                <thead>
                    <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
                        {["Réf.", "Fournisseur", "Chantier", "Date", "HT", "TVA", "TTC", "Statut"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map(row => {
                        const isOpen = open === row.id;
                        return (
                            <Fragment key={row.id}>
                                <tr
                                    onClick={() => setOpen(isOpen ? null : row.id)}
                                    className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150
                                        ${isOpen
                                            ? "bg-accent-50 dark:bg-accent-950/30"
                                            : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"
                                        }`}
                                >
                                    <td className="px-3 py-3 font-semibold text-accent whitespace-nowrap">{row.ref}</td>
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{row.col1}</td>
                                    <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark max-w-[180px] truncate">{row.col2}</td>
                                    <td className="px-3 py-3 text-content-muted dark:text-content-muted-dark whitespace-nowrap">{row.col3}</td>
                                    <td className="px-3 py-3 tabular-nums text-content-secondary dark:text-content-secondary-dark">{fmt(row.ht)}</td>
                                    <td className="px-3 py-3 tabular-nums text-content-secondary dark:text-content-secondary-dark">{fmt(row.tva)}</td>
                                    <td className="px-3 py-3 tabular-nums font-bold text-content-primary dark:text-content-primary-dark">{fmt(row.ttc)}</td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${row.statusBg} ${row.statusText}`}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.statusDot }} />
                                            {row.statusLabel}
                                        </span>
                                    </td>
                                </tr>

                                {isOpen && (
                                    <tr className="bg-surface-raised dark:bg-surface-raised-dark">
                                        <td colSpan={8} className="px-4 sm:px-8 py-4">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-content-muted dark:text-content-muted-dark mb-3">
                                                Lignes de commande
                                            </p>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs border-collapse min-w-[420px]">
                                                    <thead>
                                                        <tr className="border-b border-edge-default dark:border-edge-default-dark">
                                                            {["Code", "Désignation", "Qté", "Unité", "PU HT", "Total HT"].map(h => (
                                                                <th key={h} className="text-left px-2 py-1.5 font-semibold text-content-muted dark:text-content-muted-dark">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {row.subRows.map(l => (
                                                            <tr key={l.code} className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                                                                <td className="px-2 py-2 font-mono text-content-muted dark:text-content-muted-dark">{l.code}</td>
                                                                <td className="px-2 py-2 text-content-secondary dark:text-content-secondary-dark">{l.designation}</td>
                                                                <td className="px-2 py-2 tabular-nums text-content-secondary dark:text-content-secondary-dark">{l.quantite}</td>
                                                                <td className="px-2 py-2 text-content-muted dark:text-content-muted-dark">{l.unite}</td>
                                                                <td className="px-2 py-2 tabular-nums text-content-secondary dark:text-content-secondary-dark">{fmt(l.prixUnitaire)}</td>
                                                                <td className="px-2 py-2 tabular-nums font-bold text-content-primary dark:text-content-primary-dark">{fmt(l.total)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {row.footnotes.length > 0 && (
                                                <p className="mt-3 text-[11px] text-content-muted dark:text-content-muted-dark flex flex-wrap gap-x-4 gap-y-1">
                                                    {row.footnotes.map(f => (
                                                        <span key={f.label}>
                                                            {f.label} : <strong className="text-content-secondary dark:text-content-secondary-dark">{f.value}</strong>
                                                        </span>
                                                    ))}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-edge-default dark:border-edge-default-dark bg-surface-raised dark:bg-surface-raised-dark">
                        <td colSpan={4} className="px-3 py-3 font-bold text-content-secondary dark:text-content-secondary-dark text-xs uppercase tracking-wide">Total</td>
                        <td className="px-3 py-3 font-bold tabular-nums text-content-primary dark:text-content-primary-dark">{fmt(data.totalHT)}</td>
                        <td className="px-3 py-3 font-bold tabular-nums text-content-primary dark:text-content-primary-dark">{fmt(data.totalTVA)}</td>
                        <td className="px-3 py-3 font-bold tabular-nums text-content-primary dark:text-content-primary-dark">{fmt(data.totalTTC)}</td>
                        <td />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SeriesLegend({ series }: { series: ChartSeries[] }) {
    return (
        <div className="flex gap-4 mb-3">
            {series.map(s => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs text-content-muted dark:text-content-muted-dark">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                    {s.label}
                </span>
            ))}
        </div>
    );
}