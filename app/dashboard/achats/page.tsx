"use client";

import { useEffect, useRef, useState } from "react";

export type AchatStatus = "EN_COURS" | "LIVRE" | "FACTURE" | "PAYE";

export interface LigneAchat {
    id: string;
    articleCode: string;
    designation: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    total: number;
}

export interface Achat {
    id: string;
    ref: string;
    fournisseurNom: string;
    chantierNom: string;
    dateCommande: string;
    dateLivraisonPrevue: string;
    status: AchatStatus;
    ht: number;
    tva: number;
    ttc: number;
    lignes: LigneAchat[];
    bonLivraisonRef?: string;
    factureRef?: string;
}

const achats: Achat[] = [
    {
        id: "a1b2c3d4-0001",
        ref: "CMD-2025-0041",
        fournisseurNom: "Ciments du Maroc",
        chantierNom: "Résidence Al Fath – Lot B",
        dateCommande: "2025-06-01",
        dateLivraisonPrevue: "2025-06-08",
        status: "PAYE",
        ht: 42000,
        tva: 8400,
        ttc: 50400,
        bonLivraisonRef: "BL-2025-0041",
        factureRef: "FAC-2025-0041",
        lignes: [
            { id: "l1", articleCode: "CIM-CPJ45", designation: "Ciment CPJ 45 (sac 50kg)", quantite: 300, unite: "sac", prixUnitaire: 80, total: 24000 },
            { id: "l2", articleCode: "GRA-0/25", designation: "Gravier 0/25", quantite: 30, unite: "T", prixUnitaire: 600, total: 18000 },
        ],
    },
    {
        id: "a1b2c3d4-0002",
        ref: "CMD-2025-0042",
        fournisseurNom: "Acier Atlas",
        chantierNom: "Centre Commercial Anfa",
        dateCommande: "2025-06-03",
        dateLivraisonPrevue: "2025-06-10",
        status: "LIVRE",
        ht: 87500,
        tva: 17500,
        ttc: 105000,
        bonLivraisonRef: "BL-2025-0042",
        lignes: [
            { id: "l3", articleCode: "FER-HA12", designation: "Fer à béton HA 12mm", quantite: 5, unite: "T", prixUnitaire: 9500, total: 47500 },
            { id: "l4", articleCode: "FER-HA16", designation: "Fer à béton HA 16mm", quantite: 4, unite: "T", prixUnitaire: 10000, total: 40000 },
        ],
    },
    {
        id: "a1b2c3d4-0003",
        ref: "CMD-2025-0043",
        fournisseurNom: "Bois & Bâti Sarl",
        chantierNom: "Villa Privée Souissi",
        dateCommande: "2025-06-05",
        dateLivraisonPrevue: "2025-06-12",
        status: "EN_COURS",
        ht: 15000,
        tva: 3000,
        ttc: 18000,
        lignes: [
            { id: "l5", articleCode: "BOI-CHP-27", designation: "Panneau contreplaqué 27mm", quantite: 50, unite: "pce", prixUnitaire: 180, total: 9000 },
            { id: "l6", articleCode: "BOI-SAP-8", designation: "Planche sapin 8cm", quantite: 200, unite: "ml", prixUnitaire: 30, total: 6000 },
        ],
    },
    {
        id: "a1b2c3d4-0004",
        ref: "CMD-2025-0044",
        fournisseurNom: "ElectroPro Maroc",
        chantierNom: "Hôtel Prestige Agadir",
        dateCommande: "2025-06-07",
        dateLivraisonPrevue: "2025-06-15",
        status: "FACTURE",
        ht: 33200,
        tva: 6640,
        ttc: 39840,
        bonLivraisonRef: "BL-2025-0044",
        factureRef: "FAC-2025-0044",
        lignes: [
            { id: "l7", articleCode: "CAB-3G25", designation: "Câble 3G2.5mm²", quantite: 500, unite: "ml", prixUnitaire: 18, total: 9000 },
            { id: "l8", articleCode: "TAB-4C", designation: "Tableau électrique 4 circuits", quantite: 8, unite: "pce", prixUnitaire: 850, total: 6800 },
            { id: "l9", articleCode: "DIS-63A", designation: "Disjoncteur 63A différentiel", quantite: 24, unite: "pce", prixUnitaire: 725, total: 17400 },
        ],
    },
    {
        id: "a1b2c3d4-0005",
        ref: "CMD-2025-0045",
        fournisseurNom: "Plomberie Générale SA",
        chantierNom: "Résidence Al Fath – Lot A",
        dateCommande: "2025-06-09",
        dateLivraisonPrevue: "2025-06-20",
        status: "EN_COURS",
        ht: 22400,
        tva: 4480,
        ttc: 26880,
        lignes: [
            { id: "l10", articleCode: "TUB-PPR-32", designation: "Tube PPR Ø32", quantite: 300, unite: "ml", prixUnitaire: 28, total: 8400 },
            { id: "l11", articleCode: "VAN-SPH-1", designation: "Vanne sphérique 1\"", quantite: 40, unite: "pce", prixUnitaire: 350, total: 14000 },
        ],
    },
];

// ─── derived metrics ─────────────────────────────────────────────────────────
const totalTTC = achats.reduce((s, a) => s + a.ttc, 0);
const totalHT = achats.reduce((s, a) => s + a.ht, 0);
const totalTVA = achats.reduce((s, a) => s + a.tva, 0);
const paidTTC = achats.filter(a => a.status === "PAYE").reduce((s, a) => s + a.ttc, 0);
const pendingTTC = totalTTC - paidTTC;

const statusColors: Record<AchatStatus, string> = {
    PAYE: "#16a34a",
    LIVRE: "#2563eb",
    FACTURE: "#d97706",
    EN_COURS: "#6b7280",
};
const statusLabels: Record<AchatStatus, string> = {
    PAYE: "Payé", LIVRE: "Livré", FACTURE: "Facturé", EN_COURS: "En cours",
};

const fmt = (n: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);

// ─── chart hook ──────────────────────────────────────────────────────────────
function useChart(
    ref: React.RefObject<HTMLCanvasElement | null>,
    config: () => object,
    deps: unknown[]
) {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const win = window as unknown as { Chart: new (...a: unknown[]) => { destroy(): void } };
        if (!win.Chart || !ref.current) return;
        const chart = new win.Chart(ref.current, (config as () => object)());
        return () => chart.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

// ─── KPI card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            borderLeft: accent ? `4px solid ${accent}` : undefined,
        }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value}</span>
            {sub && <span style={{ fontSize: 12, color: "#6b7280" }}>{sub}</span>}
        </div>
    );
}

// ─── section title ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#2563eb", borderRadius: 2 }} />
                {title}
            </h2>
            {children}
        </div>
    );
}

// ─── chart card ──────────────────────────────────────────────────────────────
function ChartCard({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 24px",
            ...style,
        }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 16 }}>{title}</p>
            {children}
        </div>
    );
}

// ─── charts ──────────────────────────────────────────────────────────────────

function TtcByDateChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "bar",
        data: {
            labels: achats.map(a => new Date(a.dateCommande).toLocaleDateString("fr-MA", { day: "2-digit", month: "short" })),
            datasets: [
                {
                    label: "HT",
                    data: achats.map(a => a.ht),
                    backgroundColor: "#bfdbfe",
                    borderRadius: 4,
                    stack: "s",
                },
                {
                    label: "TVA",
                    data: achats.map(a => a.tva),
                    backgroundColor: "#2563eb",
                    borderRadius: 4,
                    stack: "s",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: { dataset: { label: string }; parsed: { y: number } }) =>
                            `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: { stacked: true, ticks: { font: { size: 11 }, color: "#9ca3af" }, grid: { display: false } },
                y: { stacked: true, ticks: { font: { size: 11 }, color: "#9ca3af", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "#f3f4f6" } },
            },
        },
    }), []);

    return (
        <>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                {[{ label: "HT", color: "#bfdbfe" }, { label: "TVA", color: "#2563eb" }].map(l => (
                    <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
                    </span>
                ))}
            </div>
            <div style={{ position: "relative", height: 220 }}>
                <canvas ref={ref} />
            </div>
        </>
    );
}

function StatusDonutChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    const statuses = Object.keys(statusColors) as AchatStatus[];
    const counts = statuses.map(s => achats.filter(a => a.status === s).length);

    useChart(ref, () => ({
        type: "doughnut",
        data: {
            labels: statuses.map(s => statusLabels[s]),
            datasets: [{
                data: counts,
                backgroundColor: statuses.map(s => statusColors[s]),
                borderWidth: 2,
                borderColor: "#fff",
                hoverOffset: 4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { label: string; parsed: number }) => `${ctx.label}: ${ctx.parsed} commande(s)` } },
            },
        },
    }), []);

    return (
        <>
            <div style={{ position: "relative", height: 180, display: "flex", justifyContent: "center" }}>
                <canvas ref={ref} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12 }}>
                {statuses.map((s, i) => (
                    <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[s], display: "inline-block" }} />
                        {statusLabels[s]} — {counts[i]}
                    </span>
                ))}
            </div>
        </>
    );
}

function FournisseurBarChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    const byF = achats.reduce<Record<string, number>>((acc, a) => {
        acc[a.fournisseurNom] = (acc[a.fournisseurNom] ?? 0) + a.ttc;
        return acc;
    }, {});
    const sorted = Object.entries(byF).sort((a, b) => b[1] - a[1]);

    useChart(ref, () => ({
        type: "bar",
        data: {
            labels: sorted.map(([k]) => k),
            datasets: [{
                label: "TTC",
                data: sorted.map(([, v]) => v),
                backgroundColor: ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#dc2626"],
                borderRadius: 4,
            }],
        },
        options: {
            indexAxis: "y" as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { parsed: { x: number } }) => fmt(ctx.parsed.x) } },
            },
            scales: {
                x: { ticks: { font: { size: 11 }, color: "#9ca3af", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "#f3f4f6" } },
                y: { ticks: { font: { size: 11 }, color: "#374151" }, grid: { display: false } },
            },
        },
    }), []);

    return (
        <div style={{ position: "relative", height: sorted.length * 44 + 40 }}>
            <canvas ref={ref} />
        </div>
    );
}

function ChantierPieChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    const byC = achats.reduce<Record<string, number>>((acc, a) => {
        acc[a.chantierNom] = (acc[a.chantierNom] ?? 0) + a.ttc;
        return acc;
    }, {});
    const entries = Object.entries(byC).sort((a, b) => b[1] - a[1]);
    const colors = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#dc2626"];

    useChart(ref, () => ({
        type: "pie",
        data: {
            labels: entries.map(([k]) => k),
            datasets: [{
                data: entries.map(([, v]) => v),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: "#fff",
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: { label: string; parsed: number; dataset: { data: number[] } }) => {
                            const pct = ((ctx.parsed / ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                            return `${ctx.label}: ${fmt(ctx.parsed)} (${pct}%)`;
                        },
                    },
                },
            },
        },
    }), []);

    return (
        <>
            <div style={{ position: "relative", height: 200 }}>
                <canvas ref={ref} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                {entries.map(([name, val], i) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
                        <span style={{ flex: 1, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                        <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{fmt(val)}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

function ArticleBreakdownChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    const allLignes = achats.flatMap(a => a.lignes);
    const byArticle = allLignes.reduce<Record<string, number>>((acc, l) => {
        acc[l.designation] = (acc[l.designation] ?? 0) + l.total;
        return acc;
    }, {});
    const sorted = Object.entries(byArticle).sort((a, b) => b[1] - a[1]);
    const colors = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#dc2626", "#0891b2", "#9a3412"];

    useChart(ref, () => ({
        type: "bar",
        data: {
            labels: sorted.map(([k]) => k.length > 24 ? k.slice(0, 22) + "…" : k),
            datasets: [{
                label: "Montant HT",
                data: sorted.map(([, v]) => v),
                backgroundColor: sorted.map((_, i) => colors[i % colors.length]),
                borderRadius: 4,
            }],
        },
        options: {
            indexAxis: "y" as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { parsed: { x: number } }) => fmt(ctx.parsed.x) } },
            },
            scales: {
                x: { ticks: { font: { size: 11 }, color: "#9ca3af", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "#f3f4f6" } },
                y: { ticks: { font: { size: 11 }, color: "#374151" }, grid: { display: false } },
            },
        },
    }), []);

    return (
        <div style={{ position: "relative", height: sorted.length * 38 + 40 }}>
            <canvas ref={ref} />
        </div>
    );
}

function TvaVsHtChart() {
    const ref = useRef<HTMLCanvasElement>(null);
    useChart(ref, () => ({
        type: "line",
        data: {
            labels: achats.map(a => a.ref),
            datasets: [
                {
                    label: "Montant HT",
                    data: achats.map(a => a.ht),
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.08)",
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: "#2563eb",
                    pointRadius: 5,
                },
                {
                    label: "TVA",
                    data: achats.map(a => a.tva),
                    borderColor: "#d97706",
                    backgroundColor: "rgba(217,119,6,0.06)",
                    tension: 0.35,
                    fill: true,
                    borderDash: [5, 4],
                    pointBackgroundColor: "#d97706",
                    pointRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx: { dataset: { label: string }; parsed: { y: number } }) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` } },
            },
            scales: {
                x: { ticks: { font: { size: 11 }, color: "#9ca3af", maxRotation: 20 }, grid: { display: false } },
                y: { ticks: { font: { size: 11 }, color: "#9ca3af", callback: (v: number) => `${(v / 1000).toFixed(0)}k` }, grid: { color: "#f3f4f6" } },
            },
        },
    }), []);

    return (
        <>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                {[{ label: "Montant HT", color: "#2563eb" }, { label: "TVA", color: "#d97706" }].map(l => (
                    <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
                    </span>
                ))}
            </div>
            <div style={{ position: "relative", height: 220 }}>
                <canvas ref={ref} />
            </div>
        </>
    );
}

// ─── commands table ───────────────────────────────────────────────────────────
function CommandesTable() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                        {["Réf.", "Fournisseur", "Chantier", "Date cmd.", "HT", "TVA", "TTC", "Statut"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {achats.map(a => (
                        <div key={a.id}>
                            <>
                                <tr
                                    key={a.id}
                                    onClick={() => setSelected(selected === a.id ? null : a.id)}
                                    style={{
                                        borderBottom: "1px solid #f3f4f6",
                                        cursor: "pointer",
                                        background: selected === a.id ? "#eff6ff" : "transparent",
                                        transition: "background 0.15s",
                                    }}
                                >
                                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#2563eb" }}>{a.ref}</td>
                                    <td style={{ padding: "10px 12px", color: "#374151" }}>{a.fournisseurNom}</td>
                                    <td style={{ padding: "10px 12px", color: "#374151" }}>{a.chantierNom}</td>
                                    <td style={{ padding: "10px 12px", color: "#6b7280" }}>{new Date(a.dateCommande).toLocaleDateString("fr-MA")}</td>
                                    <td style={{ padding: "10px 12px", color: "#374151", fontVariantNumeric: "tabular-nums" }}>{fmt(a.ht)}</td>
                                    <td style={{ padding: "10px 12px", color: "#374151", fontVariantNumeric: "tabular-nums" }}>{fmt(a.tva)}</td>
                                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(a.ttc)}</td>
                                    <td style={{ padding: "10px 12px" }}>
                                        <span style={{
                                            display: "inline-block",
                                            padding: "2px 10px",
                                            borderRadius: 999,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: statusColors[a.status] + "18",
                                            color: statusColors[a.status],
                                        }}>
                                            {statusLabels[a.status]}
                                        </span>
                                    </td>
                                </tr>
                                {selected === a.id && (
                                    <tr key={`${a.id}-detail`} style={{ background: "#f8faff" }}>
                                        <td colSpan={8} style={{ padding: "12px 24px 16px" }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>Lignes de commande</p>
                                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                                        {["Code", "Désignation", "Qté", "Unité", "PU HT", "Total HT"].map(h => (
                                                            <th key={h} style={{ textAlign: "left", padding: "4px 8px", color: "#9ca3af", fontWeight: 600 }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {a.lignes.map(l => (
                                                        <tr key={l.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                                            <td style={{ padding: "6px 8px", color: "#9ca3af", fontFamily: "monospace" }}>{l.articleCode}</td>
                                                            <td style={{ padding: "6px 8px", color: "#374151" }}>{l.designation}</td>
                                                            <td style={{ padding: "6px 8px", color: "#374151" }}>{l.quantite}</td>
                                                            <td style={{ padding: "6px 8px", color: "#6b7280" }}>{l.unite}</td>
                                                            <td style={{ padding: "6px 8px", color: "#374151" }}>{fmt(l.prixUnitaire)}</td>
                                                            <td style={{ padding: "6px 8px", fontWeight: 600, color: "#111827" }}>{fmt(l.total)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {a.bonLivraisonRef && (
                                                <p style={{ marginTop: 8, fontSize: 11, color: "#9ca3af" }}>
                                                    BL: <strong style={{ color: "#374151" }}>{a.bonLivraisonRef}</strong>
                                                    {a.factureRef && <> &nbsp;|&nbsp; Facture: <strong style={{ color: "#374151" }}>{a.factureRef}</strong></>}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>

                        </div>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: "2px solid #e5e7eb", background: "#f9fafb" }}>
                        <td colSpan={4} style={{ padding: "10px 12px", fontWeight: 700, color: "#374151" }}>Total</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111827" }}>{fmt(totalHT)}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111827" }}>{fmt(totalTVA)}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111827" }}>{fmt(totalTTC)}</td>
                        <td />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// ─── payment progress bar ────────────────────────────────────────────────────
function PaymentProgress() {
    const pct = Math.round((paidTTC / totalTTC) * 100);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#374151" }}>Payé <strong style={{ color: "#16a34a" }}>{fmt(paidTTC)}</strong></span>
                <span style={{ color: "#6b7280" }}>En attente <strong style={{ color: "#d97706" }}>{fmt(pendingTTC)}</strong></span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: "#f3f4f6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #16a34a, #22c55e)", borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>{pct}% du total TTC encaissé</p>
        </div>
    );
}

// ─── Script loader ───────────────────────────────────────────────────────────
function ChartJsLoader({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if ((window as unknown as { Chart?: unknown }).Chart) { setLoaded(true); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
    }, []);

    if (!loaded) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#9ca3af", fontSize: 13 }}>
            Chargement des graphiques…
        </div>
    );
    return <>{children}</>;
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function AchatsPage() {
    return (
        <ChartJsLoader>
            <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 24px", fontFamily: "Inter, system-ui, sans-serif" }}>
                {/* header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Tableau de bord — Achats</h1>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Juin 2025 · {achats.length} commandes</p>
                </div>

                {/* KPIs */}
                <Section title="Vue d'ensemble">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 0 }}>
                        <KpiCard label="Total TTC" value={fmt(totalTTC)} sub={`dont TVA : ${fmt(totalTVA)}`} accent="#2563eb" />
                        <KpiCard label="Total HT" value={fmt(totalHT)} sub={`TVA déductible : ${fmt(totalTVA)}`} accent="#7c3aed" />
                        <KpiCard label="Encaissé" value={fmt(paidTTC)} sub="commandes payées" accent="#16a34a" />
                        <KpiCard label="En attente" value={fmt(pendingTTC)} sub="à régler" accent="#d97706" />
                        <KpiCard label="Commandes" value={`${achats.length}`} sub={`${achats.filter(a => a.status === "EN_COURS").length} en cours`} accent="#6b7280" />
                    </div>
                </Section>

                {/* progress */}
                <Section title="Avancement des paiements">
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px" }}>
                        <PaymentProgress />
                    </div>
                </Section>

                {/* row 1 */}
                <Section title="Répartition budgétaire">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <ChartCard title="Montants HT + TVA par commande (empilé)">
                            <TtcByDateChart />
                        </ChartCard>
                        <ChartCard title="HT vs TVA par commande (courbe)">
                            <TvaVsHtChart />
                        </ChartCard>
                    </div>
                </Section>

                {/* row 2 */}
                <Section title="Analyse fournisseurs & chantiers">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <ChartCard title="Volume TTC par fournisseur">
                            <FournisseurBarChart />
                        </ChartCard>
                        <ChartCard title="Répartition par chantier">
                            <ChantierPieChart />
                        </ChartCard>
                    </div>
                </Section>

                {/* row 3 */}
                <Section title="Statuts & articles">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                        <ChartCard title="Répartition des statuts">
                            <StatusDonutChart />
                        </ChartCard>
                        <ChartCard title="Top articles par montant HT commandé">
                            <ArticleBreakdownChart />
                        </ChartCard>
                    </div>
                </Section>

                {/* table */}
                <Section title="Détail des commandes">
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px" }}>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>Cliquez sur une ligne pour voir le détail des articles.</p>
                        <CommandesTable />
                    </div>
                </Section>
            </div>
        </ChartJsLoader>
    );
}