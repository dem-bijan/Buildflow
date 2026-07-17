"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { createSalarie, fetchSalaires, type CreateSalarieDTO } from "@/lib/api/salaires";
import SalairesClient from "./SalairesClient";
import { PrimaryActionButton } from "@/components/Functions";
import type { SalarieDTO } from "@/lib/api/salaires";
import { fetchEmployes, type EmployeDTO } from "@/lib/api/employes";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";

const emptySalarieForm: CreateSalarieDTO = {
  reference: "",
  employeId: "",
  chantierId: "",
  periode: new Date().toISOString().slice(0, 7),
  joursTravailles: 22,
  salaireBase: 0,
  heuresSupplementaires: 0,
  montantHeuresSupp: 0,
  primeTransport: 0,
  primePanier: 0,
  autresPrimes: 0,
  avance: 0,
  deductionsCnss: 0,
  deductionsIr: 0,
};

export default function SalairesPage() {
  const [salaireData, setSalaireData] = useState<SalarieDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periode, setPeriode] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateSalarieDTO>(emptySalarieForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [employes, setEmployes] = useState<EmployeDTO[]>([]);
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSalaires(periode);
      setSalaireData(data || []);
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [periode]);

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [employesData, chantiersData] = await Promise.all([fetchEmployes(), fetchChantiers()]);
      setEmployes(employesData || []);
      setChantiers(chantiersData || []);
    } catch {
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadOptions(); }, [loadOptions]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createSalarie({
        ...form,
        chantierId: form.chantierId || undefined,
        joursTravailles: Number(form.joursTravailles),
        salaireBase: Number(form.salaireBase),
        heuresSupplementaires: Number(form.heuresSupplementaires || 0),
        montantHeuresSupp: Number(form.montantHeuresSupp || 0),
        primeTransport: Number(form.primeTransport || 0),
        primePanier: Number(form.primePanier || 0),
        autresPrimes: Number(form.autresPrimes || 0),
        avance: Number(form.avance || 0),
        deductionsCnss: Number(form.deductionsCnss || 0),
        deductionsIr: Number(form.deductionsIr || 0),
      });
      setShowForm(false);
      setForm(emptySalarieForm);
      await load();
    } catch {
      const msg = "Impossible d’enregistrer la fiche de paie";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && salaireData.length === 0) {
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

  if (error && salaireData.length === 0) {
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-content-primary dark:text-content-primary-dark">Salaires</h2>
          <p className="text-sm text-content-muted dark:text-content-muted-dark">Ajoutez et consultez les fiches de paie.</p>
        </div>
        <PrimaryActionButton onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Fermer" : "+ Nouvelle fiche"}
        </PrimaryActionButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm space-y-1"><span className="text-content-muted">Référence</span><input required value={form.reference} onChange={(event) => setForm((value) => ({ ...value, reference: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" placeholder="FP-2026-001" /></label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Employé</span>
              <select
                required
                value={form.employeId}
                onChange={(event) => setForm((value) => ({ ...value, employeId: event.target.value }))}
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                disabled={loadingOptions}
              >
                <option value="">{loadingOptions ? "Chargement…" : "Sélectionner…"}</option>
                {employes.map((e) => (
                  <option key={e.id} value={e.id}>{e.matricule} — {e.nom} {e.prenom}</option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Chantier</span>
              <select
                value={form.chantierId ?? ""}
                onChange={(event) => setForm((value) => ({ ...value, chantierId: event.target.value || undefined }))}
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                disabled={loadingOptions}
              >
                <option value="">Aucun</option>
                {chantiers.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.nom}</option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Période</span><input type="month" required value={form.periode} onChange={(event) => setForm((value) => ({ ...value, periode: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Jours travaillés</span><input type="number" min="0" value={form.joursTravailles ?? 0} onChange={(event) => setForm((value) => ({ ...value, joursTravailles: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Salaire de base</span><input type="number" min="0" step="0.01" required value={form.salaireBase} onChange={(event) => setForm((value) => ({ ...value, salaireBase: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Heures supplémentaires</span><input type="number" min="0" value={form.heuresSupplementaires ?? 0} onChange={(event) => setForm((value) => ({ ...value, heuresSupplementaires: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Montant HS</span><input type="number" min="0" step="0.01" value={form.montantHeuresSupp ?? 0} onChange={(event) => setForm((value) => ({ ...value, montantHeuresSupp: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Prime transport</span><input type="number" min="0" step="0.01" value={form.primeTransport ?? 0} onChange={(event) => setForm((value) => ({ ...value, primeTransport: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Prime panier</span><input type="number" min="0" step="0.01" value={form.primePanier ?? 0} onChange={(event) => setForm((value) => ({ ...value, primePanier: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Autres primes</span><input type="number" min="0" step="0.01" value={form.autresPrimes ?? 0} onChange={(event) => setForm((value) => ({ ...value, autresPrimes: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Avance</span><input type="number" min="0" step="0.01" value={form.avance ?? 0} onChange={(event) => setForm((value) => ({ ...value, avance: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Déductions CNSS</span><input type="number" min="0" step="0.01" value={form.deductionsCnss ?? 0} onChange={(event) => setForm((value) => ({ ...value, deductionsCnss: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Déductions IR</span><input type="number" min="0" step="0.01" value={form.deductionsIr ?? 0} onChange={(event) => setForm((value) => ({ ...value, deductionsIr: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex items-center gap-3"><button type="submit" disabled={submitting} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Enregistrement…" : "Enregistrer"}</button><button type="button" onClick={() => setShowForm(false)} className="text-sm text-content-muted">Annuler</button></div>
        </form>
      )}

      <SalairesClient fiches={salaireData} onRefresh={load} refreshing={loading} />
    </div>
  );
}