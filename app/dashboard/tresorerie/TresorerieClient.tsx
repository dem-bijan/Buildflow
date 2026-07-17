"use client";

import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { hydrate, hydratedSoldeCaisses } from "@/components/functions2";
import type { Transaction, TresorerieHydrated, Caisse } from "@/components/functions2";
import { tresorerieHydrationConfig } from "@/components/functions2";
import {
  fetchCaisses,
  fetchTransactions,
  createCaisse,
  createTransaction,
  type CreateCaisseDTO,
  type CreateTransactionDTO,
  type TypeTransaction,
} from "@/lib/api/tresorerie";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";
import {
  ChartJsLoader, Section, Card, ChartCard,
  KpiGrid,
  LineChart,
  HorizontalBarChart,
  DonutChart,
  RefreshButton,
  PrimaryActionButton,
} from "@/components/Functions";

export default function TresorerieClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const caissesData = await fetchCaisses();
      const lists = await Promise.all(
        (caissesData ?? []).map(async (c) => {
          const tx = await fetchTransactions(c.id);
          return (tx ?? []).map((t) => ({
            ...t,
            montant: t.montant ?? 0,
            caisseId: c.id,
            caisseLibelle: c.libelle,
          }));
        })
      );
      setCaisses(caissesData ?? []);
      setTransactions(lists.flat());
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const h = useMemo(() => hydrate<Transaction, TresorerieHydrated>(transactions, tresorerieHydrationConfig), [transactions]);
  const soldeCaisses = useMemo(() => hydratedSoldeCaisses(caisses), [caisses]);

  if (loading && transactions.length === 0 && caisses.length === 0) {
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

  if (error && transactions.length === 0 && caisses.length === 0) {
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

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Trésorerie
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {transactions.length} transactions · {caisses.length} caisses
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={() => load()} loading={loading} />
            <PrimaryActionButton onClick={() => setShowForm(!showForm)}>
              + Nouvelle caisse
            </PrimaryActionButton>
          </div>
        </div>

        {showForm && (
          <CreateCaisseForm
            onCreated={() => { setShowForm(false); load(); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Flux encaissements vs décaissements">
          <ChartCard title="Évolution quotidienne des flux">
            <LineChart data={h.encVsDecParJour} />
          </ChartCard>
        </Section>

        <Section title="Répartition des flux">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Encaissements vs décaissements" className="sm:col-span-1">
              <DonutChart data={h.repartitionFlux} />
            </ChartCard>
            <ChartCard title="Volume par caisse" className="sm:col-span-2">
              <HorizontalBarChart data={h.fluxParCaisse} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Soldes & top décaissements">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Solde par caisse">
              <HorizontalBarChart data={soldeCaisses} />
            </ChartCard>
            <ChartCard title="Top 6 décaissements">
              <HorizontalBarChart data={h.topDecaissements} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Liste des caisses">
          <Card>
            <CaissesTable caisses={caisses} transactions={transactions} onChanged={load} />
          </Card>
        </Section>

      </div>
    </ChartJsLoader>
  );
}

// ─── Caisses Table (expandable rows with inline transactions) ──────────────
function CaissesTable({
  caisses,
  transactions,
  onChanged,
}: {
  caisses: Caisse[];
  transactions: Transaction[];
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (caisses.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucune caisse trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Libellé", "Chantier", "Solde", "Seuil min.", "Alerte"].map((h) => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {caisses.map((c) => {
            const isOpen = expanded === c.id;
            const tx = transactions.filter((t) => t.caisseId === c.id);
            return (
              <Fragment key={c.id}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"}`}
                >
                  <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{c.code}</td>
                  <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[200px] truncate">{c.libelle}</td>
                  <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.chantierNom}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{c.solde.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-3 whitespace-nowrap text-content-secondary dark:text-content-secondary-dark">{c.seuilMinimum.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-3">
                    {c.enAlerte ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Alerte
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> OK
                      </span>
                    )}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={6} className="bg-surface-hover dark:bg-surface-hover-dark px-4 py-4">
                      <TransactionsPanel caisseId={c.id} transactions={tx} onCreated={onChanged} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Transactions Panel (inline, per caisse) ────────────────────────────────
function TransactionsPanel({
  caisseId,
  transactions,
  onCreated,
}: {
  caisseId: string;
  transactions: Transaction[];
  onCreated: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [typeTransaction, setTypeTransaction] = useState<TypeTransaction>("CREDIT");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [referenceDocument, setReferenceDocument] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  async function submit() {
    if (!montant || !motif) {
      setErr("Montant et motif sont obligatoires.");
      return;
    }
    if (parseFloat(montant) <= 0) {
      setErr("Le montant doit être supérieur à 0.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      const payload: CreateTransactionDTO = {
        typeTransaction,
        montant: parseFloat(montant),
        motif,
        ...(referenceDocument ? { referenceDocument } : {}),
      };
      await createTransaction(caisseId, payload);
      setMontant("");
      setMotif("");
      setReferenceDocument("");
      setShowAdd(false);
      onCreated();
    } catch {
      setErr("Erreur lors de la création (solde insuffisant ?)");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark">
          Transactions ({transactions.length})
        </h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          + Ajouter une transaction
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 bg-surface-page dark:bg-surface-page-dark rounded-lg border border-edge-subtle dark:border-edge-subtle-dark">
          {err && <p className="text-xs text-red-500 mb-2">{err}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select className={inputCls} value={typeTransaction} onChange={(e) => setTypeTransaction(e.target.value as TypeTransaction)}>
              <option value="CREDIT">Crédit</option>
              <option value="DEBIT">Débit</option>
            </select>
            <input className={inputCls} type="number" min="0.01" step="0.01" required placeholder="Montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
            <input className={inputCls} required placeholder="Motif" value={motif} onChange={(e) => setMotif(e.target.value)} />
            <input className={inputCls} placeholder="Référence (optionnel)" value={referenceDocument} onChange={(e) => setReferenceDocument(e.target.value)} />
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

      {transactions.length === 0 ? (
        <p className="text-xs text-content-muted dark:text-content-muted-dark">Aucune transaction enregistrée.</p>
      ) : (
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-edge-subtle dark:border-edge-subtle-dark">
              {["Type", "Montant", "Motif", "Référence", "Date"].map((h) => (
                <th key={h} className="text-left px-2 py-1.5 font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                <td className="px-2 py-2">
                  <span className={`font-semibold ${t.typeTransaction === "CREDIT" ? "text-green-600" : "text-red-500"}`}>
                    {t.typeTransaction === "CREDIT" ? "Crédit" : "Débit"}
                  </span>
                </td>
                <td className="px-2 py-2">{t.montant.toLocaleString("fr-MA")} MAD</td>
                <td className="px-2 py-2">{t.motif}</td>
                <td className="px-2 py-2 font-mono">{t.referenceDocument ?? "—"}</td>
                <td className="px-2 py-2">{new Date(t.createdAt).toLocaleDateString("fr-MA")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Create Caisse Form (chantier dropdown, no manual UUID) ─────────────────
function CreateCaisseForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<CreateCaisseDTO>({ code: "", libelle: "", chantierId: "", seuilMinimum: 0 });

  useEffect(() => {
    fetchChantiers()
      .then((list) => setChantiers(list ?? []))
      .catch(() => setErr("Impossible de charger les chantiers."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const set = (key: keyof CreateCaisseDTO, val: string | number) => setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.code || !form.libelle || !form.chantierId) {
      setErr("Code, libellé et chantier sont obligatoires.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      await createCaisse(form);
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
        <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">Nouvelle caisse</h3>
        <button onClick={onCancel} className="text-xs text-content-muted hover:text-content-primary transition-colors">✕ Annuler</button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      {loadingOptions ? (
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Chargement des chantiers…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Code *</span>
            <input className={inputCls} value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="CAISSE-002" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Libellé *</span>
            <input className={inputCls} value={form.libelle} onChange={(e) => set("libelle", e.target.value)} placeholder="Caisse chantier X" />
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
          <label className="space-y-1">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Seuil minimum</span>
            <input className={inputCls} type="number" value={form.seuilMinimum || ""} onChange={(e) => set("seuilMinimum", parseFloat(e.target.value) || 0)} placeholder="50000" />
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