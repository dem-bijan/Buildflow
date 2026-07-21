"use client";
import { fetchChantiers, type ChantierDTO } from "@/lib/api/chantier";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { createEmploye, fetchEmployes, type CreateEmployeDTO } from "@/lib/api/employes";
import AnnuaireClient from "./AnnuaireClient";
import { PrimaryActionButton } from "@/components/Functions";
import type { Employe } from "@/components/functions2";

const emptyEmployeForm: CreateEmployeDTO = {
  matricule: "",
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

  if (loading && employes.length === 0) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-content-primary dark:text-content-primary-dark">Annuaire RH</h2>
          <p className="text-sm text-content-muted dark:text-content-muted-dark">Ajoutez et consultez les employés.</p>
        </div>
        <PrimaryActionButton onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Fermer" : "+ Nouvel employé"}
        </PrimaryActionButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm space-y-1"><span className="text-content-muted">Matricule</span><input required value={form.matricule} onChange={(event) => setForm((value) => ({ ...value, matricule: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Nom</span><input required value={form.nom} onChange={(event) => setForm((value) => ({ ...value, nom: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Prénom</span><input required value={form.prenom} onChange={(event) => setForm((value) => ({ ...value, prenom: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Rôle</span>

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    role: event.target.value as CreateEmployeDTO["role"],
                  }))
                }
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
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
            <label className="text-sm space-y-1"><span className="text-content-muted">Poste</span><input required value={form.poste} onChange={(event) => setForm((value) => ({ ...value, poste: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Département</span><input required value={form.departement} onChange={(event) => setForm((value) => ({ ...value, departement: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Téléphone</span><input required value={form.telephone} onChange={(event) => setForm((value) => ({ ...value, telephone: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Email</span><input type="email" required value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Date d’embauche</span><input type="date" required value={form.dateEmbauche} onChange={(event) => setForm((value) => ({ ...value, dateEmbauche: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Chantier actuel</span>

              <select
                value={form.chantierActuelId ?? ""}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    chantierActuelId: event.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
              >
                <option value="">Aucun</option>

                {chantiers.map((chantier) => (
                  <option key={chantier.id} value={chantier.id}>
                    {chantier.code} - {chantier.nom}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Statut</span><select value={form.statut} onChange={(event) => setForm((value) => ({ ...value, statut: event.target.value as CreateEmployeDTO["statut"] }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2"><option value="ACTIF">ACTIF</option><option value="INACTIF">INACTIF</option></select></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Salaire brut</span><input type="number" min="0" step="0.01" required value={form.salaireBrut} onChange={(event) => setForm((value) => ({ ...value, salaireBrut: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" /></label>
            <label className="text-sm space-y-1"><span className="text-content-muted">Type de contrat</span><select value={form.typeContrat} onChange={(event) => setForm((value) => ({ ...value, typeContrat: event.target.value as CreateEmployeDTO["typeContrat"] }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2"><option value="CDI">CDI</option><option value="CDD">CDD</option><option value="ANAPEC">ANAPEC</option><option value="JOURNALIER">JOURNALIER</option></select></label>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex items-center gap-3"><button type="submit" disabled={submitting} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Enregistrement…" : "Enregistrer"}</button><button type="button" onClick={() => setShowForm(false)} className="text-sm text-content-muted">Annuler</button></div>
        </form>
      )}

      <AnnuaireClient employes={employes} onRefresh={load} refreshing={loading} />
    </div>
  );
}