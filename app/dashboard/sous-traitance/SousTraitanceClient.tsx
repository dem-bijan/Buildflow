"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { hydrate } from "@/components/functions2";
import type {
  ContratSousTraitanceWithPaiements,
  SousTraitanceHydrated,
} from "@/components/functions2";
import { sousTraitanceHydrationConfig } from "@/components/functions2";
import {
  fetchPaiements,
  createContratSousTraitant,
  createPaiement,
  terminerContratSousTraitant,
  type ContratSousTraitantDTO,
  type PaiementSousTraitantDTO,
  type CreateContratSousTraitantDTO,
} from "@/lib/api/sousTraitance";
import { fetchSousTraitants, type SousTraitantDTO } from "@/lib/api/sousTraitants";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";
import {
  ChartJsLoader,
  Section,
  Card,
  ChartCard,
  KpiGrid,
  StackedBarChart,
  HorizontalBarChart,
  PaymentProgress,
  DonutChart,
  RefreshButton,
  PrimaryActionButton,
} from "@/components/Functions";

interface Props {
  contrats: ContratSousTraitantDTO[];
  onRefresh: () => void;
  refreshing: boolean;
}

const PAIEMENT_STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PAYE: { label: "Payé", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
  VALIDE: { label: "Validé", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb" },
  EN_ATTENTE: { label: "En attente", bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280" },
};

const CONTRAT_STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  EN_COURS: { label: "En cours", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb" },
  TERMINE: { label: "Terminé", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
  RESILIE: { label: "Résilié", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "#dc2626" },
};

export default function SousTraitanceClient({ contrats, onRefresh, refreshing }: Props) {
  const [enriched, setEnriched] = useState<ContratSousTraitanceWithPaiements[]>([]);
  const [loadingPaiements, setLoadingPaiements] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadPaiements = useCallback(async () => {
    setLoadingPaiements(true);
    const results = await Promise.all(
      (contrats ?? []).map(async (c) => {
        try {
          const paiements = await fetchPaiements(c.id);
          return { ...c, paiements: paiements ?? [] };
        } catch {
          return { ...c, paiements: [] };
        }
      })
    );
    setEnriched(results);
    setLoadingPaiements(false);
  }, [contrats]);

  useEffect(() => {
    if ((contrats ?? []).length > 0) {
      loadPaiements();
    } else {
      setEnriched([]);
      setLoadingPaiements(false);
    }
  }, [contrats, loadPaiements]);

  const h = useMemo(
    () => hydrate<ContratSousTraitanceWithPaiements, SousTraitanceHydrated>(enriched, sousTraitanceHydrationConfig),
    [enriched]
  );

  if (loadingPaiements) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
          Chargement des paiements sous-traitance…
        </p>
      </div>
    );
  }

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Sous-traitance
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {contrats.length} contrats · {contrats.filter((c) => c.statut === "EN_COURS").length} en cours
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={onRefresh} loading={refreshing} />
            <PrimaryActionButton onClick={() => setShowForm(!showForm)}>
              + Nouveau contrat
            </PrimaryActionButton>
          </div>
        </div>

        {/* ── Create Form ─────────────────────────────────────────────── */}
        {showForm && (
          <CreateContratForm
            onCreated={() => {
              setShowForm(false);
              onRefresh();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Avancement des paiements ST">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition des engagements">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montant TTC par sous-traitant">
              <HorizontalBarChart data={h.montantsParST} />
            </ChartCard>
            <ChartCard title="Payé vs restant par contrat">
              <StackedBarChart data={h.payeVsRestant} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & échéances">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des contrats">
              <DonutChart data={h.statutsContrats} />
            </ChartCard>
            <ChartCard title="Statuts des paiements">
              <DonutChart data={h.echeancesParStatut} />
            </ChartCard>
          </div>
        </Section>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <Section title="Liste des contrats">
          <Card>
            <ContratsTable contrats={enriched} onPaiementCreated={loadPaiements} onTerminated={onRefresh} />
          </Card>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

// ─── Contrats Table (expandable rows with inline payments) ─────────────────
function ContratsTable({
  contrats,
  onPaiementCreated,
  onTerminated,
}: {
  contrats: ContratSousTraitanceWithPaiements[];
  onPaiementCreated: () => void;
  onTerminated: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [terminatingId, setTerminatingId] = useState<string | null>(null);
  const [terminateError, setTerminateError] = useState<string | null>(null);

  if (contrats.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun contrat trouvé.</p>
      </div>
    );
  }

  async function handleTerminer(id: string) {
    setTerminatingId(id);
    setTerminateError(null);
    try {
      await terminerContratSousTraitant(id);
      onTerminated();
    } catch {
      setTerminateError("Impossible de terminer le contrat");
    } finally {
      setTerminatingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      {terminateError && <p className="px-4 pt-3 text-xs text-red-500">{terminateError}</p>}
      <table className="w-full text-sm border-collapse min-w-[950px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Référence", "Sous-traitant", "Chantier", "Objet", "TTC", "Payé", "Reste", "Statut", "Actions"].map((h) => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contrats.map((c) => {
            const isOpen = expanded === c.id;
            const meta = CONTRAT_STATUS_META[c.statut];
            const isTerminating = terminatingId === c.id;

            return (
              <React.Fragment key={c.id}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"}`}
                >
                  <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{c.reference}</td>
                  <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[180px] truncate">{c.sousTraitantRaisonSociale}</td>
                  <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark max-w-[160px] truncate">{c.chantierNom}</td>
                  <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark max-w-[200px] truncate">{c.objet}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{c.montantTtc.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-3 whitespace-nowrap text-green-600">{c.montantPaye.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-3 whitespace-nowrap text-red-500">{c.resteAPayer.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.text}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {c.statut === "EN_COURS" ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTerminer(c.id); }}
                        disabled={isTerminating}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                      >
                        {isTerminating ? "…" : "Terminer"}
                      </button>
                    ) : (
                      <span className="text-xs text-content-muted dark:text-content-muted-dark">—</span>
                    )}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={9} className="bg-surface-hover dark:bg-surface-hover-dark px-4 py-4">
                      <PaiementsPanel
                        contratId={c.id}
                        paiements={c.paiements}
                        onCreated={onPaiementCreated}
                      />
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

// ─── Payments Panel (inline, per contract) ──────────────────────────────────
function PaiementsPanel({
  contratId,
  paiements,
  onCreated,
}: {
  contratId: string;
  paiements: PaiementSousTraitantDTO[];
  onCreated: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [reference, setReference] = useState("");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  async function submit() {
    if (!reference || !montant || !motif) {
      setErr("Tous les champs sont obligatoires.");
      return;
    }
    if (parseFloat(montant) <= 0) {
      setErr("Le montant doit être supérieur à 0.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      await createPaiement(contratId, {
        reference,
        montant: parseFloat(montant),
        motif,
      });
      setReference("");
      setMontant("");
      setMotif("");
      setShowAdd(false);
      onCreated();
    } catch {
      setErr("Erreur lors de la création du paiement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark">
          Paiements ({paiements.length})
        </h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          + Ajouter un paiement
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 bg-surface-page dark:bg-surface-page-dark rounded-lg border border-edge-subtle dark:border-edge-subtle-dark">
          {err && <p className="text-xs text-red-500 mb-2">{err}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className={inputCls} required placeholder="Référence (ex: PAI-001)" value={reference} onChange={(e) => setReference(e.target.value)} />
            <input className={inputCls} type="number" min="0.01" step="0.01" required placeholder="Montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
            <input className={inputCls} required placeholder="Motif" value={motif} onChange={(e) => setMotif(e.target.value)} />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={submit}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors"
            >
              {submitting ? "Création…" : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {paiements.length === 0 ? (
        <p className="text-xs text-content-muted dark:text-content-muted-dark">Aucun paiement enregistré.</p>
      ) : (
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-edge-subtle dark:border-edge-subtle-dark">
              {["Référence", "Montant", "Motif", "Date", "Statut"].map((h) => (
                <th key={h} className="text-left px-2 py-1.5 font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paiements.map((p) => {
              const meta = PAIEMENT_STATUS_META[p.statut];
              return (
                <tr key={p.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                  <td className="px-2 py-2 font-mono">{p.reference}</td>
                  <td className="px-2 py-2">{p.montant.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-2 py-2">{p.motif}</td>
                  <td className="px-2 py-2">{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString("fr-MA") : "—"}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${meta.bg} ${meta.text}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Create Contract Form (dropdowns, no manual UUIDs) ──────────────────────
function CreateContratForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [sousTraitants, setSousTraitants] = useState<SousTraitantDTO[]>([]);
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState<CreateContratSousTraitantDTO>({
    reference: "",
    sousTraitantId: "",
    chantierId: "",
    objet: "",
    montantHt: 0,
    dateDebut: "",
    dateFin: "",
  });

  useEffect(() => {
    async function loadOptions() {
      setLoadingOptions(true);
      try {
        const [stList, chList] = await Promise.all([fetchSousTraitants(), fetchChantiers()]);
        setSousTraitants(stList ?? []);
        setChantiers(chList ?? []);
      } catch {
        setErr("Impossible de charger les sous-traitants / chantiers.");
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  const set = (key: keyof CreateContratSousTraitantDTO, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.reference || !form.sousTraitantId || !form.chantierId || !form.objet || !form.montantHt || !form.dateDebut || !form.dateFin) {
      setErr("Tous les champs sont obligatoires.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      await createContratSousTraitant(form);
      onCreated();
    } catch {
      setErr("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  return (
    <Card className="mb-6 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">Nouveau contrat de sous-traitance</h3>
        <button onClick={onCancel} className="text-xs text-content-muted hover:text-content-primary transition-colors">✕ Annuler</button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      {loadingOptions ? (
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Chargement des sous-traitants et chantiers…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Référence *</span>
            <input className={inputCls} value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="CST-2026-001" />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Sous-traitant *</span>
            <select className={inputCls} value={form.sousTraitantId} onChange={(e) => set("sousTraitantId", e.target.value)}>
              <option value="">Sélectionner…</option>
              {sousTraitants.map((st) => (
                <option key={st.id} value={st.id}>{st.raisonSociale}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Chantier *</span>
            <select className={inputCls} value={form.chantierId} onChange={(e) => set("chantierId", e.target.value)}>
              <option value="">Sélectionner…</option>
              {chantiers.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.nom}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 lg:col-span-3">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Objet *</span>
            <input className={inputCls} value={form.objet} onChange={(e) => set("objet", e.target.value)} placeholder="Lot Électricité — Résidence Al Firdaws" />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Montant HT *</span>
            <input className={inputCls} type="number" value={form.montantHt || ""} onChange={(e) => set("montantHt", parseFloat(e.target.value) || 0)} placeholder="450000" />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Date début *</span>
            <input className={inputCls} type="date" value={form.dateDebut} onChange={(e) => set("dateDebut", e.target.value)} />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Date fin *</span>
            <input className={inputCls} type="date" value={form.dateFin} onChange={(e) => set("dateFin", e.target.value)} />
          </label>
        </div>
      )}

      <div className="flex justify-end mt-5">
        <button onClick={submit} disabled={submitting || loadingOptions} className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors">
          {submitting ? "Création…" : "Enregistrer"}
        </button>
      </div>
    </Card>
  );
}