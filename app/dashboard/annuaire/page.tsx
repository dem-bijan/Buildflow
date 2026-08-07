"use client";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { createEmploye, fetchEmployes, type CreateEmployeDTO } from "@/lib/api/employes";
import AnnuaireClient from "./AnnuaireClient";
import {
  PrimaryActionButton,
  FadeSwap,
  Skeleton,
  KpiGridSkeleton,
  ChartCardSkeleton,
  TableSkeleton,
  Section,
  Card,
} from "@/components/Functions";
import type { Employe } from "@/components/functions2";
import { CodeField } from "@/components/CodeField";

const emptyEmployeForm: CreateEmployeDTO = {
  nom: "",
  prenom: "",
  role: "OUVRIER",
  poste: "",
  departement: "",
  telephone: "",
  email: "",
  dateEmbauche: new Date().toISOString().slice(0, 10),
  chantierActuelId: "",
  statut: "ACTIF",
  salaireBrut: 0,
  typeContrat: "CDI",
};

export default function AnnuairePage() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateEmployeDTO>(emptyEmployeForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [employesData, chantierData] = await Promise.all([
        fetchEmployes(),
        fetchChantiers(),
      ]);

      const items = (employesData || []).map((item) => ({
        ...item,
        statut: item.statut ?? "ACTIF",
        role: (item.role as Employe["role"]) ?? "OUVRIER",
      }));

      setEmployes(items);
      setChantiers(chantierData);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createEmploye({
        ...form,
        salaireBrut: Number(form.salaireBrut),
        chantierActuelId: form.chantierActuelId || undefined,
      });
      setShowForm(false);
      setForm(emptyEmployeForm);
      await load();
    } catch {
      setFormError("Impossible d’enregistrer l’employé");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && employes.length === 0) {
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
      <FadeSwap show={loading && employes.length === 0} skeleton={<AnnuaireSkeleton />}>
      <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">Annuaire RH</h2>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">Ajoutez et consultez les employés.</p>
        </div>
        <PrimaryActionButton onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Fermer" : "+ Nouvel employé"}
        </PrimaryActionButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 mx-4 sm:mx-6 lg:mx-8 p-5 rounded-xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-card dark:bg-surface-card-dark space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">Nouvel employé</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-content-muted dark:text-content-muted-dark hover:text-content-primary dark:hover:text-content-primary-dark transition-colors">✕ Annuler</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CodeField label="Matricule" />
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Nom</span><input required value={form.nom} onChange={(event) => setForm((value) => ({ ...value, nom: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Prénom</span><input required value={form.prenom} onChange={(event) => setForm((value) => ({ ...value, prenom: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1">
              <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Rôle</span>

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    role: event.target.value as CreateEmployeDTO["role"],
                  }))
                }
                className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              >
                <option value="OUVRIER">Ouvrier</option>
                <option value="CHEF_EQUIPE">Chef d&apos;équipe</option>
                <option value="CONDUCTEUR_TRAVAUX">Conducteur de travaux</option>
                <option value="PM">Chef de projet</option>
                <option value="ACHAT">Achats</option>
                <option value="FINANCE">Finance</option>
                <option value="RH">Ressources Humaines</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Poste</span><input required value={form.poste} onChange={(event) => setForm((value) => ({ ...value, poste: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Département</span><input required value={form.departement} onChange={(event) => setForm((value) => ({ ...value, departement: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Téléphone</span><input required value={form.telephone} onChange={(event) => setForm((value) => ({ ...value, telephone: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Email</span><input type="email" required value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Date d’embauche</span><input type="date" required value={form.dateEmbauche} onChange={(event) => setForm((value) => ({ ...value, dateEmbauche: event.target.value }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1">
              <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Chantier actuel</span>

              <select
                value={form.chantierActuelId ?? ""}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    chantierActuelId: event.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              >
                <option value="">Aucun</option>

                {chantiers.map((chantier) => (
                  <option key={chantier.id} value={chantier.id}>
                    {chantier.code} - {chantier.nom}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Statut</span><select value={form.statut} onChange={(event) => setForm((value) => ({ ...value, statut: event.target.value as CreateEmployeDTO["statut"] }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"><option value="ACTIF">ACTIF</option><option value="INACTIF">INACTIF</option></select></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Salaire brut</span><input type="number" min="0" step="0.01" required value={form.salaireBrut} onChange={(event) => setForm((value) => ({ ...value, salaireBrut: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow" /></label>
            <label className="text-sm space-y-1"><span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Type de contrat</span><select value={form.typeContrat} onChange={(event) => setForm((value) => ({ ...value, typeContrat: event.target.value as CreateEmployeDTO["typeContrat"] }))} className="w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"><option value="CDI">CDI</option><option value="CDD">CDD</option><option value="ANAPEC">ANAPEC</option><option value="JOURNALIER">JOURNALIER</option></select></label>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex justify-end"><button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors">{submitting ? "Enregistrement…" : "Enregistrer"}</button></div>
        </form>
      )}

      <AnnuaireClient employes={employes} onRefresh={load} refreshing={loading} />
      </>
      </FadeSwap>
    </div>
  );
}

function AnnuaireSkeleton() {
  return (
    <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Annuaire RH
          </h1>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <Section title="Vue d'ensemble">
        <KpiGridSkeleton count={4} />
      </Section>

      <Section title="Masse salariale & effectifs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton title="Masse salariale brute par rôle" variant="pie" />
          <ChartCardSkeleton title="Effectifs par département" variant="hbar" rows={5} />
        </div>
      </Section>

      <Section title="Statuts & contrats">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton title="Statuts des employés" variant="donut" />
          <ChartCardSkeleton title="Répartition par type de contrat" variant="pie" />
        </div>
      </Section>

      <Section title="Ancienneté">
        <ChartCardSkeleton title="Top 8 — ancienneté (années)" variant="hbar" rows={8} />
      </Section>

      <Section title="Liste des employés">
        <Card>
          <div className="px-4 pt-4 pb-3">
            <Skeleton className="h-9 w-full sm:w-80 rounded-lg" />
          </div>
          <TableSkeleton columns={7} rows={6} />
        </Card>
      </Section>
    </div>
  );
}