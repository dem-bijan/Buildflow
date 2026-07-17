"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchContratsSousTraitant,
  type ContratSousTraitantDTO,
  fetchPaiements as fetchPaiementsContrat,
  createPaiement,
  validerPaiement,
  payerPaiement,
} from "@/lib/api/sousTraitance";
import { hydrate, fmt } from "@/components/functions2";
import type { Paiement, PaiementsHydrated, PaiementType } from "@/components/functions2";
import { paiementsHydrationConfig } from "@/components/functions2";

import {
  ChartJsLoader,
  Section,
  Card,
  ChartCard,
  KpiGrid,
  PaymentProgress,
  StackedBarChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  RefreshButton,
  PrimaryActionButton,
} from "@/components/Functions";

export default function PaymentsClient() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [contrats, setContrats] = useState<ContratSousTraitantDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    contratId: "",
    reference: "",
    montant: "",
    motif: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const contrats = await fetchContratsSousTraitant();
      const paiementsArrays = await Promise.all(
        contrats.map((contrat) =>
          fetchPaiementsContrat(contrat.id).then((paiements) =>
            paiements.map((p): Paiement => ({
              id: p.id,
              ref: p.reference,

              type: "SOUS_TRAITANT",

              tiers: contrat.sousTraitantRaisonSociale,

              chantierId: contrat.chantierId,
              chantierNom: contrat.chantierNom,

              montantTotal: p.montant,
              montantPaye: p.statut === "PAYE" ? p.montant : 0,
              montantRestant: p.statut === "PAYE" ? 0 : p.montant,

              dateEcheance: p.datePaiement ?? "",
              datePaiement: p.datePaiement ?? undefined,

              statut: p.statut,

              referenceDoc: contrat.reference,
            }))
          )
        )
      );
      setContrats(contrats);
      setPaiements(paiementsArrays.flat());
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePay = async (id: string) => {
    setActionLoading(true);
    try {
      await payerPaiement(id);
      await load();
      setSelectedPaiement(null);
    } catch {
      alert("Erreur lors du paiement.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    setActionLoading(true);
    try {
      await validerPaiement(id);
      await load();
    } catch {
      alert("Erreur lors de la validation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.contratId || !form.reference || !form.montant || !form.motif) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }
    if (Number(form.montant) <= 0) {
      setFormError("Le montant doit être supérieur à 0.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createPaiement(form.contratId, {
        reference: form.reference,
        montant: Number(form.montant),
        motif: form.motif,
      });

      setForm({
        contratId: "",
        reference: "",
        montant: "",
        motif: "",
      });

      setShowForm(false);
      await load();
    } catch {
      setFormError("Erreur lors de la création du paiement.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedContrat = contrats.find((c) => c.id === form.contratId);

  const remaining = selectedContrat
    ? Number(selectedContrat.montantTtc) - Number(selectedContrat.montantPaye)
    : 0;

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedPaiement) return;
    const fresh = paiements.find((p) => p.id === selectedPaiement.id);
    if (fresh) setSelectedPaiement(fresh);
  }, [paiements, selectedPaiement?.id]);

  const filtered = search
    ? paiements.filter((p) =>
      [p.ref, p.tiers, p.chantierNom ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    : paiements;

  const h = useMemo(() => hydrate<Paiement, PaiementsHydrated>(paiements, paiementsHydrationConfig), [paiements]);

  if (loading && paiements.length === 0) {
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

  if (error && paiements.length === 0) {
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

  const inputCls =
    "w-full px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Paiements
            </h1>

            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {paiements.length} paiements ·{" "}
              {paiements.filter((p) => p.statut === "EN_RETARD").length} en retard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RefreshButton onClick={load} loading={loading} />
            <PrimaryActionButton onClick={() => setShowForm((v) => !v)}>
              + Nouveau paiement
            </PrimaryActionButton>
          </div>
        </div>

        {/* Create Form */}

        {showForm && (
          <Card className="mb-6 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">
                  Nouveau paiement
                </h3>

                <p className="text-xs text-content-muted dark:text-content-muted-dark mt-1">
                  Ajouter un paiement à un contrat de sous-traitance.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-content-muted hover:text-content-primary transition-colors"
              >
                ✕ Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <label className="space-y-1">
                <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
                  Contrat *
                </span>

                <select
                  className={inputCls}
                  required
                  value={form.contratId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      contratId: e.target.value,
                    }))
                  }
                >
                  <option value="">
                    Sélectionner...
                  </option>

                  {contrats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.reference} • {c.sousTraitantRaisonSociale}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
                  Référence *
                </span>

                <input
                  className={inputCls}
                  required
                  value={form.reference}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      reference: e.target.value,
                    }))
                  }
                  placeholder="PAY-ST-2026-001"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
                  Montant *
                </span>

                <input
                  className={inputCls}
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.montant}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      montant: e.target.value,
                    }))
                  }
                  placeholder="25000"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
                  Motif *
                </span>

                <input
                  className={inputCls}
                  required
                  value={form.motif}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      motif: e.target.value,
                    }))
                  }
                  placeholder="Avancement gros œuvre"
                />
              </label>

            </div>

            {selectedContrat && (
              <div className="mt-5 rounded-xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-card dark:bg-surface-card-dark p-5">

                <div className="grid grid-cols-2 gap-5">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-content-muted">
                      Sous-traitant
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedContrat.sousTraitantRaisonSociale}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-content-muted">
                      Chantier
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedContrat.chantierNom}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-content-muted">
                      Montant TTC
                    </p>

                    <p className="font-semibold mt-1">
                      {fmt(selectedContrat.montantTtc)} MAD
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-content-muted">
                      Déjà payé
                    </p>

                    <p className="font-semibold mt-1">
                      {fmt(selectedContrat.montantPaye)} MAD
                    </p>
                  </div>

                </div>

                <div className="mt-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-5 py-4">

                  <p className="text-sm text-green-700 dark:text-green-300">
                    Reste à payer
                  </p>

                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {fmt(remaining)} MAD
                  </p>

                </div>

              </div>
            )}

            {formError && <p className="text-sm text-red-500 mt-3">{formError}</p>}

            <div className="flex justify-end mt-5 gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark"
              >
                Annuler
              </button>

              <button
                onClick={handleCreate}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors"
              >
                {submitting ? "Création…" : "Enregistrer"}
              </button>
            </div>
          </Card>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-300">
            {error}
          </div>
        )}

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Avancement global">
          <PaymentProgress data={h.progress} />
        </Section>

        <Section title="Répartition par type">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montants par type de paiement">
              <PieChart data={h.montantsParType} />
            </ChartCard>
            <ChartCard title="Payé vs restant par type">
              <StackedBarChart data={h.payeVsRestantParType} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & échéances proches">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts des paiements" className="sm:col-span-1">
              <DonutChart data={h.statutsPaiements} />
            </ChartCard>
            <ChartCard title="Prochaines échéances à régler" className="sm:col-span-2">
              <HorizontalBarChart data={h.echeancesProches} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Liste des paiements">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par référence, tiers ou chantier…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <PaymentsTable
              paiements={filtered}
              onValidate={handleValidate}
              onPay={handlePay}
              onSelect={setSelectedPaiement}
            />
          </Card>
        </Section>
      </div>

      {selectedPaiement && (
        <PaiementDetailsModal
          paiement={selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          onValidate={handleValidate}
          onPay={handlePay}
          loading={actionLoading}
        />
      )}
    </ChartJsLoader>
  );
}

function PaiementDetailsModal({
  paiement,
  onClose,
  onValidate,
  onPay,
  loading,
}: {
  paiement: Paiement;
  onClose: () => void;
  onValidate: (id: string) => void;
  onPay: (id: string) => void;
  loading: boolean;
}) {
  const meta = statutMeta(paiement.statut);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface-card dark:bg-surface-card-dark border border-edge-subtle dark:border-edge-subtle-dark p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-content-muted dark:text-content-muted-dark">
              Paiement
            </p>
            <p className="font-mono text-sm font-semibold text-accent mt-1">
              {paiement.ref}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
              Statut
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.text}`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
              {meta.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
              Tiers
            </span>
            <span className="text-sm font-medium">{paiement.tiers}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
              Chantier
            </span>
            <span className="text-sm">{paiement.chantierNom ?? "—"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
              Montant
            </span>
            <span className="text-sm font-semibold">{fmt(paiement.montantTotal)} MAD</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
              Date de paiement
            </span>
            <span className="text-sm">
              {paiement.datePaiement
                ? new Date(paiement.datePaiement).toLocaleDateString("fr-MA")
                : "Non payé"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {paiement.statut === "EN_ATTENTE" && (
            <button
              disabled={loading}
              onClick={() => onValidate(paiement.id)}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              Valider
            </button>
          )}
          {paiement.statut === "VALIDE" && (
            <button
              disabled={loading}
              onClick={() => onPay(paiement.id)}
              className="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              Payer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function statutMeta(statut: Paiement["statut"]) {
  switch (statut) {
    case "PAYE":
      return {
        label: "Payé",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        dot: "#16a34a",
      };
    case "VALIDE":
      return {
        label: "Validé",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        dot: "#2563eb",
      };
    case "EN_RETARD":
      return {
        label: "En retard",
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        dot: "#dc2626",
      };
    case "PARTIELLEMENT_PAYE":
      return {
        label: "Partiellement payé",
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "#d97706",
      };
    default:
      return {
        label: "En attente",
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
        dot: "#6b7280",
      };
  }
}

function PaymentsTable({
  paiements,
  onValidate,
  onPay,
  onSelect,
}: {
  paiements: Paiement[];
  onValidate: (id: string) => void;
  onPay: (id: string) => void;
  onSelect: (p: Paiement) => void;
}) {
  if (paiements.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">
          Aucun paiement trouvé.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[1050px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {[
              "Réf",
              "Type",
              "Tiers",
              "Chantier",
              "Échéance",
              "Total",
              "Payé",
              "Restant",
              "Statut",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paiements.map((p) => {
            const meta = statutMeta(p.statut);

            return (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors cursor-pointer"
              >
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent">
                  {p.ref}
                </td>

                <td className="px-3 py-3">{p.type}</td>

                <td className="px-3 py-3 font-medium">{p.tiers}</td>

                <td className="px-3 py-3">
                  {p.chantierNom ?? "—"}
                </td>

                <td className="px-3 py-3">
                  {p.dateEcheance
                    ? new Date(p.dateEcheance).toLocaleDateString("fr-MA")
                    : "—"}
                </td>

                <td className="px-3 py-3 font-semibold">
                  {fmt(p.montantTotal)} MAD
                </td>

                <td className="px-3 py-3">
                  {fmt(p.montantPaye)} MAD
                </td>

                <td className="px-3 py-3">
                  {fmt(p.montantRestant)} MAD
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.text}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: meta.dot }}
                    />
                    {meta.label}
                  </span>
                </td>

                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">

                    {p.statut === "EN_ATTENTE" && (
                      <button
                        onClick={() => onValidate(p.id)}
                        className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                      >
                        Valider
                      </button>
                    )}

                    {p.statut === "VALIDE" && (
                      <button
                        onClick={() => onPay(p.id)}
                        className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        Payer
                      </button>
                    )}

                    {p.statut === "PAYE" && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Terminé
                      </span>
                    )}

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}