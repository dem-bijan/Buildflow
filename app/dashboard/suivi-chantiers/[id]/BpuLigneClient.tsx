"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { fetchChantiers } from "@/lib/api/chantier";
import type { ChantierDTO } from "@/lib/api/chantier";
import {
  fetchBpuLignes,
  createBpuLigne,
  updateBpuLigne,
  deleteBpuLigne,
  importBpuExcel,
} from "@/lib/api/bpu";
import type { BpuLigneDTO, CreateBpuLigneDTO } from "@/lib/api/bpu";
import AttachementsPanel from "./AttachementsPanel";
import { fmt } from "@/components/functions2";
import { useAuth } from "@/lib/authContext";
import {
  Section,
  Card,
  KpiGrid,
  RefreshButton,
  PrimaryActionButton,
  FadeSwap,
  Skeleton,
  KpiGridSkeleton,
  TableSkeleton,
} from "@/components/Functions";
import type { KpiItem } from "@/components/Functions";

const EMPTY_FORM: CreateBpuLigneDTO = {
  ref: "",
  designation: "",
  unite: "",
  qtePrevue: 0,
  puHt: 0,
};

export default function BpuLigneClient({ chantierId }: { chantierId: string }) {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "PM";
  const canEncaisser = user?.role === "ADMIN" || user?.role === "FINANCE" || user?.role === "DIRECTEUR";

  const [chantier, setChantier] = useState<ChantierDTO | null>(null);
  const [lignes, setLignes] = useState<BpuLigneDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateBpuLigneDTO>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [chantiers, bpuLignes] = await Promise.all([
        fetchChantiers(),
        fetchBpuLignes(chantierId),
      ]);
      setChantier(chantiers.find(c => c.id === chantierId) ?? null);
      setLignes(bpuLignes);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [chantierId]);

  useEffect(() => { load(); }, [load]);

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(v => !v);
  };

  const startEdit = (ligne: BpuLigneDTO) => {
    setEditingId(ligne.id);
    setForm({
      ref: ligne.ref,
      designation: ligne.designation,
      unite: ligne.unite,
      qtePrevue: ligne.qtePrevue,
      puHt: ligne.puHt,
    });
    setFormError(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: CreateBpuLigneDTO = {
        ref: form.ref,
        designation: form.designation,
        unite: form.unite,
        qtePrevue: Number(form.qtePrevue),
        puHt: Number(form.puHt),
      };
      if (editingId) {
        await updateBpuLigne(chantierId, editingId, payload);
      } else {
        await createBpuLigne(chantierId, payload);
      }
      cancelForm();
      await load();
    } catch {
      setFormError(editingId ? "Impossible de modifier la ligne BPU" : "Impossible de créer la ligne BPU");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ligne: BpuLigneDTO) => {
    if (!confirm(`Supprimer la ligne BPU "${ligne.ref}" ?`)) return;
    try {
      await deleteBpuLigne(chantierId, ligne.id);
      await load();
    } catch {
      setError("Impossible de supprimer cette ligne BPU.");
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    setImportError(null);
    try {
      await importBpuExcel(chantierId, file);
      await load();
    } catch {
      setImportError("Import impossible. Vérifiez le format du fichier (Réf, Désignation, Unité, Qté Prévu, PU HT).");
    } finally {
      setImporting(false);
    }
  };

  const totals = useMemo(() => {
    const budget = lignes.reduce((sum, l) => sum + l.budgetPrevuHt, 0);
    const engage = lignes.reduce((sum, l) => sum + l.montantEngageHt, 0);
    const depassements = lignes.filter(l => l.alerteDepassement).length;
    return { budget, engage, depassements };
  }, [lignes]);

  const kpis: KpiItem[] = [
    { label: "Budget prévu total HT", value: `${fmt(totals.budget)} MAD`, sub: `${lignes.length} lignes BPU` },
    { label: "Engagé total HT", value: `${fmt(totals.engage)} MAD`, sub: totals.budget > 0 ? `${Math.round((totals.engage / totals.budget) * 100)}% du budget` : "—" },
    { label: "Lignes en dépassement", value: String(totals.depassements), sub: totals.depassements > 0 ? "à surveiller" : "aucune alerte" },
  ];

  if (error && lignes.length === 0 && !chantier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
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
    <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
      <FadeSwap show={loading && lignes.length === 0 && !chantier} skeleton={<BpuSkeleton />}>
        <>
          <Link
            href="/dashboard/suivi-chantiers"
            className="text-sm text-accent hover:underline mb-3 inline-block"
          >
            ← Retour aux chantiers
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
                {chantier ? `${chantier.nom} — BPU & Budget` : "Chantier introuvable"}
              </h1>
              {chantier && (
                <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
                  {chantier.code} · {chantier.client}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <RefreshButton onClick={() => load()} loading={loading} />
              {canManage && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                  <button
                    type="button"
                    onClick={handleImportClick}
                    disabled={importing}
                    className="rounded-lg border border-edge-subtle dark:border-edge-subtle-dark px-3 py-2 text-sm font-medium text-content-primary dark:text-content-primary-dark disabled:opacity-50"
                  >
                    {importing ? "Import…" : "Importer Excel"}
                  </button>
                  <PrimaryActionButton onClick={startCreate}>
                    {showForm && !editingId ? "Fermer" : "+ Ligne BPU"}
                  </PrimaryActionButton>
                </>
              )}
            </div>
          </div>

          {importError && (
            <p className="text-sm text-red-500 mb-4">{importError}</p>
          )}

          {canManage && showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-5"
            >
              <h2 className="text-sm font-semibold text-content-primary dark:text-content-primary-dark">
                {editingId ? "Modifier la ligne BPU" : "Nouvelle ligne BPU"}
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm space-y-1">
                  <span className="text-content-muted">Réf</span>
                  <input
                    required
                    value={form.ref}
                    onChange={(e) => setForm(v => ({ ...v, ref: e.target.value }))}
                    className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                    placeholder="GO-03"
                  />
                </label>

                <label className="text-sm space-y-1 md:col-span-2">
                  <span className="text-content-muted">Désignation</span>
                  <input
                    required
                    value={form.designation}
                    onChange={(e) => setForm(v => ({ ...v, designation: e.target.value }))}
                    className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                    placeholder="Poteaux béton armé"
                  />
                </label>

                <label className="text-sm space-y-1">
                  <span className="text-content-muted">Unité</span>
                  <input
                    required
                    value={form.unite}
                    onChange={(e) => setForm(v => ({ ...v, unite: e.target.value }))}
                    className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                    placeholder="m³, u, ml…"
                  />
                </label>

                <label className="text-sm space-y-1">
                  <span className="text-content-muted">Qté prévue</span>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    required
                    value={form.qtePrevue}
                    onChange={(e) => setForm(v => ({ ...v, qtePrevue: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                  />
                </label>

                <label className="text-sm space-y-1">
                  <span className="text-content-muted">PU HT</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.puHt}
                    onChange={(e) => setForm(v => ({ ...v, puHt: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                  />
                </label>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Enregistrement…" : editingId ? "Enregistrer" : "Créer la ligne"}
                </button>
                <button type="button" onClick={cancelForm} className="text-sm text-content-muted">
                  Annuler
                </button>
              </div>
            </form>
          )}

          <Section title="Vue d'ensemble">
            <KpiGrid kpis={kpis} />
          </Section>

          <Section title="Lignes BPU & consommation">
            <Card>
              <BpuTable
                lignes={lignes}
                canManage={canManage}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            </Card>
          </Section>

          <Section title="Attachements & Encaissements">
            <AttachementsPanel
              chantierId={chantierId}
              bpuLignes={lignes}
              canManage={canManage}
              canEncaisser={canEncaisser}
            />
          </Section>
        </>
      </FadeSwap>
    </div>
  );
}

function BpuSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-32 mb-3" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
      <Section title="Vue d'ensemble">
        <KpiGridSkeleton count={3} />
      </Section>
      <Section title="Lignes BPU & consommation">
        <Card>
          <TableSkeleton columns={9} rows={5} />
        </Card>
      </Section>
    </>
  );
}

function BpuTable({
  lignes,
  canManage,
  onEdit,
  onDelete,
}: {
  lignes: BpuLigneDTO[];
  canManage: boolean;
  onEdit: (ligne: BpuLigneDTO) => void;
  onDelete: (ligne: BpuLigneDTO) => void;
}) {
  if (lignes.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">
          Aucune ligne BPU. Importez un marché Excel ou ajoutez une ligne.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[960px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Réf", "Désignation", "U", "Qté Prévue", "PU HT", "Budget Prévu HT", "Engagé HT", "Taux", "Alerte", ...(canManage ? ["Actions"] : [])].map(title => (
              <th key={title} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map(l => (
            <tr key={l.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
              <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{l.ref}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark max-w-[240px] truncate">{l.designation}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{l.unite}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{l.qtePrevue}</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{fmt(l.puHt)} MAD</td>
              <td className="px-3 py-3 font-semibold text-content-primary dark:text-content-primary-dark whitespace-nowrap">{fmt(l.budgetPrevuHt)} MAD</td>
              <td className="px-3 py-3 font-semibold text-content-primary dark:text-content-primary-dark whitespace-nowrap">{fmt(l.montantEngageHt)} MAD</td>
              <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{Math.round(l.tauxConsommation * 100)}%</td>
              <td className="px-3 py-3">
                {l.alerteDepassement ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    Dépassement
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    OK
                  </span>
                )}
              </td>
              {canManage && (
                <td className="px-3 py-3 whitespace-nowrap">
                  <button onClick={() => onEdit(l)} className="text-xs text-accent font-semibold mr-3">
                    Modifier
                  </button>
                  <button onClick={() => onDelete(l)} className="text-xs text-red-500 font-semibold">
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
