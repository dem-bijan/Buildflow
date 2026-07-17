"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchSousTraitants,
  createSousTraitant,
  type SousTraitantDTO,
  type CreateSousTraitantDTO,
  type SousTraitantStatut,
} from "@/lib/api/sousTraitants";
import {
  Section, Card,
  KpiGrid,
  RefreshButton,
  PrimaryActionButton,
} from "@/components/Functions";
import type { KpiItem } from "@/components/Functions";

const STATUT_STYLES: Record<SousTraitantStatut, { bg: string; text: string; dot: string; label: string }> = {
  ACTIF: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a", label: "Actif" },
  INACTIF: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280", label: "Inactif" },
  BLACKLISTE: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "#dc2626", label: "Blacklisté" },
};

export default function SousTraitantsClient() {
  const [sousTraitants, setSousTraitants] = useState<SousTraitantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSousTraitants();
      setSousTraitants(data ?? []);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? sousTraitants.filter(s =>
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.raisonSociale.toLowerCase().includes(search.toLowerCase()) ||
      s.specialite.toLowerCase().includes(search.toLowerCase())
    )
    : sousTraitants;

  const kpis: KpiItem[] = useMemo(() => {
    const actifs = sousTraitants.filter(s => s.statut === "ACTIF");
    const totalPaye = sousTraitants.reduce((s, st) => s + st.montantTotalPaye, 0);
    const contratsActifs = sousTraitants.reduce((s, st) => s + st.nombreContratsActifs, 0);
    return [
      { label: "Sous-traitants", value: `${sousTraitants.length}`, sub: `${actifs.length} actifs` },
      { label: "Contrats en cours", value: `${contratsActifs}`, sub: "tous sous-traitants" },
      { label: "Montant total payé", value: `${totalPaye.toLocaleString("fr-FR")} MAD`, sub: "cumulé" },
    ];
  }, [sousTraitants]);

  if (loading && sousTraitants.length === 0) {
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

  if (error && sousTraitants.length === 0) {
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
    <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Sous-traitants
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            {sousTraitants.length} sous-traitants enregistrés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onClick={() => load()} loading={loading} />
          <PrimaryActionButton onClick={() => setShowForm(v => !v)}>
            {showForm ? "Fermer" : "+ Nouveau sous-traitant"}
          </PrimaryActionButton>
        </div>
      </div>

      {showForm && (
        <CreateSousTraitantForm
          onCreated={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Section title="Vue d'ensemble">
        <KpiGrid kpis={kpis} />
      </Section>

      <Section title="Liste des sous-traitants">
        <Card>
          <div className="px-4 pt-4 pb-3">
            <input
              type="text"
              placeholder="Rechercher par code, nom, spécialité…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
            />
          </div>
          <SousTraitantsTable sousTraitants={filtered} />
        </Card>
      </Section>
    </div>
  );
}

function SousTraitantsTable({ sousTraitants }: { sousTraitants: SousTraitantDTO[] }) {
  if (sousTraitants.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun sous-traitant trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Raison Sociale", "Spécialité", "Contact", "Téléphone", "Contrats actifs", "Montant payé", "Statut"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sousTraitants.map(s => {
            const style = STATUT_STYLES[s.statut] ?? STATUT_STYLES.ACTIF;
            return (
              <tr key={s.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{s.code}</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[200px] truncate">{s.raisonSociale}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.specialite}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.contact}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{s.telephone}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{s.nombreContratsActifs}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{s.montantTotalPaye.toLocaleString("fr-FR")} MAD</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                    {style.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Create Form ────────────────────────────────────────────────────────────
function CreateSousTraitantForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<CreateSousTraitantDTO>({
    code: "", raisonSociale: "", ice: "", specialite: "",
    contact: "", telephone: "", email: "", ville: "", adresse: "",
    statut: "ACTIF",
  });

  const set = <K extends keyof CreateSousTraitantDTO>(key: K, val: CreateSousTraitantDTO[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.code || !form.raisonSociale || !form.ice || !form.specialite) {
      setErr("Veuillez remplir les champs obligatoires (Code, Raison sociale, ICE, Spécialité).");
      return;
    }
    setSubmitting(true); setErr("");
    try {
      await createSousTraitant(form);
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
        <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">Ajouter un sous-traitant</h3>
        <button onClick={onCancel} className="text-xs text-content-muted hover:text-content-primary transition-colors">✕ Annuler</button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Code *</span>
          <input className={inputCls} value={form.code} onChange={e => set("code", e.target.value)} placeholder="STR-001" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Raison Sociale *</span>
          <input className={inputCls} value={form.raisonSociale} onChange={e => set("raisonSociale", e.target.value)} placeholder="Electro Bat SARL" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">ICE *</span>
          <input className={inputCls} value={form.ice} onChange={e => set("ice", e.target.value)} placeholder="001234567000012" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Spécialité *</span>
          <input className={inputCls} value={form.specialite} onChange={e => set("specialite", e.target.value)} placeholder="Électricité" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Contact</span>
          <input className={inputCls} value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="Ahmed Benali" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Téléphone</span>
          <input className={inputCls} value={form.telephone} onChange={e => set("telephone", e.target.value)} placeholder="+212 522 123456" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Email</span>
          <input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} placeholder="contact@electrobat.ma" />
        </label>
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Adresse complète</span>
          <div className="flex gap-2">
            <input className={`${inputCls} w-1/3`} value={form.ville} onChange={e => set("ville", e.target.value)} placeholder="Ville (ex: Rabat)" />
            <input className={`${inputCls} w-2/3`} value={form.adresse} onChange={e => set("adresse", e.target.value)} placeholder="Adresse" />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Statut</span>
          <select className={inputCls} value={form.statut} onChange={e => set("statut", e.target.value as SousTraitantStatut)}>
            <option value="ACTIF">Actif</option>
            <option value="INACTIF">Inactif</option>
            <option value="BLACKLISTE">Blacklisté</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end mt-5">
        <button onClick={submit} disabled={submitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors">
          {submitting ? "Création…" : "Enregistrer"}
        </button>
      </div>
    </Card>
  );
}
