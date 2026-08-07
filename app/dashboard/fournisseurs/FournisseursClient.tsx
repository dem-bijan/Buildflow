"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchFournisseurs,
  createFournisseur,
  updateFournisseur,
  deleteFournisseur,
  type CreateFournisseurDTO,
} from "@/lib/api/fournisseurs";
import { useAuth } from "@/lib/authContext";
import { hydrate } from "@/components/functions2";
import type { Fournisseur, FournisseursHydrated } from "@/components/functions2";
import { fournisseursHydrationConfig } from "@/components/functions2";
import { CodeField } from "@/components/CodeField";
import {
  ChartJsLoader,
  Section, Card, ChartCard,
  KpiGrid,
  PieChart,
  HorizontalBarChart,
  DonutChart,
  StackedBarChart,
  RefreshButton,
  PrimaryActionButton,
  FadeSwap,
  Skeleton,
  KpiGridSkeleton,
  ChartCardSkeleton,
  TableSkeleton,
} from "@/components/Functions";

export default function FournisseursClient() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "ACHAT";

  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Fournisseur | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFournisseurs();

      const mapped: Fournisseur[] = (data || []).map(f => ({
        ...f,
        totalAchatsAnnee: f.totalAchatsAnnee ?? 0,
        soldeImpaye: f.soldeImpaye ?? 0,
        categorieArticles: f.categorieArticles ?? [],
      }));
      setFournisseurs(mapped);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (f: Fournisseur) => {
    if (!confirm(`Supprimer le fournisseur "${f.raisonSociale}" ?`)) return;
    try {
      await deleteFournisseur(f.id);
      await load();
    } catch {
      setError("Impossible de supprimer ce fournisseur (peut-être référencé par des achats).");
    }
  };

  const filtered = search
    ? fournisseurs.filter(f =>
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.raisonSociale.toLowerCase().includes(search.toLowerCase()) ||
      f.ville.toLowerCase().includes(search.toLowerCase())
    )
    : fournisseurs;

  const h = useMemo(
    () => hydrate<Fournisseur, FournisseursHydrated>(fournisseurs, fournisseursHydrationConfig),
    [fournisseurs]
  );

  if (error && fournisseurs.length === 0) {
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
      <FadeSwap show={loading && fournisseurs.length === 0} skeleton={<FournisseursSkeleton />}>
      <ChartJsLoader>
        <>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Fournisseurs
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {fournisseurs.length} fournisseurs enregistrés
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={() => load()} loading={loading} />
            {canManage && (
              <PrimaryActionButton onClick={() => { setEditing(null); setShowForm(!showForm); }}>
                + Nouveau fournisseur
              </PrimaryActionButton>
            )}
          </div>
        </div>

        {/* ── Create/Edit Form ─────────────────────────────────────────── */}
        {showForm && canManage && (
          <CreateFournisseurForm
            editing={editing}
            onCreated={() => { setShowForm(false); setEditing(null); load(); }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}

        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        {/* ── Charts ───────────────────────────────────────────────────── */}
        <Section title="Volume d'achats & statuts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Achats annuels par fournisseur (HT)">
              <HorizontalBarChart data={h.caParFournisseur} />
            </ChartCard>
            <ChartCard title="Part de marché par fournisseur">
              <PieChart data={h.partMarche} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Soldes & statuts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts fournisseurs" className="sm:col-span-1">
              <DonutChart data={h.statuses} />
            </ChartCard>
            <ChartCard title="Soldes impayés par fournisseur" className="sm:col-span-2">
              <HorizontalBarChart data={h.impayes} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Top 5 & Catégories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Achats annuels vs solde impayé (top 5)">
              <StackedBarChart data={h.topFournisseurs} />
            </ChartCard>
            <ChartCard title="Nombre de fournisseurs par catégorie d'articles">
              <HorizontalBarChart data={h.categoriesCount} />
            </ChartCard>
          </div>
        </Section>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <Section title="Liste des fournisseurs">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par code, nom, ville…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <FournisseursTable
              fournisseurs={filtered}
              canManage={canManage}
              onEdit={(f) => { setEditing(f); setShowForm(true); }}
              onDelete={handleDelete}
            />
          </Card>
        </Section>
        </>
      </ChartJsLoader>
      </FadeSwap>
    </div>
  );
}

function FournisseursSkeleton() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Fournisseurs
          </h1>
          <Skeleton className="h-4 w-52 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
      </div>

      <Section title="Vue d'ensemble">
        <KpiGridSkeleton count={4} />
      </Section>

      <Section title="Volume d'achats & statuts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton title="Achats annuels par fournisseur (HT)" variant="hbar" rows={5} />
          <ChartCardSkeleton title="Part de marché par fournisseur" variant="pie" />
        </div>
      </Section>

      <Section title="Soldes & statuts">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChartCardSkeleton title="Statuts fournisseurs" className="sm:col-span-1" variant="donut" />
          <ChartCardSkeleton title="Soldes impayés par fournisseur" className="sm:col-span-2" variant="hbar" rows={5} />
        </div>
      </Section>

      <Section title="Top 5 & Catégories">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton title="Achats annuels vs solde impayé (top 5)" variant="bar" />
          <ChartCardSkeleton title="Nombre de fournisseurs par catégorie d'articles" variant="hbar" rows={4} />
        </div>
      </Section>

      <Section title="Liste des fournisseurs">
        <Card>
          <div className="px-4 pt-4 pb-3">
            <Skeleton className="h-9 w-full sm:w-80 rounded-lg" />
          </div>
          <TableSkeleton columns={7} rows={6} />
        </Card>
      </Section>
    </>
  );
}

// ─── Fournisseurs Table ─────────────────────────────────────────────────────
function FournisseursTable({
  fournisseurs,
  canManage,
  onEdit,
  onDelete,
}: {
  fournisseurs: Fournisseur[];
  canManage: boolean;
  onEdit: (f: Fournisseur) => void;
  onDelete: (f: Fournisseur) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (fournisseurs.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun fournisseur trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Raison Sociale", "Ville", "Contact", "Téléphone", "Catégories", "Statut", ...(canManage ? ["Actions"] : [])].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fournisseurs.map(f => {
            const isOpen = expanded === f.id;
            let statusColor = "";
            let statusBg = "";
            let dotColor = "";
            switch (f.statut) {
              case "ACTIF":
                statusColor = "text-green-700 dark:text-green-400";
                statusBg = "bg-green-100 dark:bg-green-900/30";
                dotColor = "#16a34a";
                break;
              case "INACTIF":
                statusColor = "text-gray-600 dark:text-gray-400";
                statusBg = "bg-gray-100 dark:bg-gray-800";
                dotColor = "#6b7280";
                break;
              case "BLACKLISTE":
                statusColor = "text-red-700 dark:text-red-400";
                statusBg = "bg-red-100 dark:bg-red-900/30";
                dotColor = "#dc2626";
                break;
            }

            return (
              <tr
                key={f.id}
                onClick={() => setExpanded(isOpen ? null : f.id)}
                className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"
                  }`}
              >
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{f.code}</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[200px] truncate">{f.raisonSociale}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{f.ville}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{f.contact}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{f.telephone}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {f.categorieArticles.slice(0, 2).map(cat => (
                      <span key={cat} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                        {cat}
                      </span>
                    ))}
                    {f.categorieArticles.length > 2 && (
                      <span className="text-[10px] text-content-muted">+{f.categorieArticles.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBg} ${statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
                    {f.statut === "ACTIF" ? "Actif" : f.statut === "INACTIF" ? "Inactif" : "Blacklisté"}
                  </span>
                </td>
                {canManage && (
                  <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(f)} className="text-xs text-accent font-semibold mr-3">
                      Modifier
                    </button>
                    <button onClick={() => onDelete(f)} className="text-xs text-red-500 font-semibold">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Create Form ────────────────────────────────────────────────────────────
function CreateFournisseurForm({
  editing,
  onCreated,
  onCancel,
}: {
  editing: Fournisseur | null;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<CreateFournisseurDTO>(() =>
    editing
      ? {
          code: editing.code, raisonSociale: editing.raisonSociale, ice: editing.ice ?? "",
          contact: editing.contact ?? "", telephone: editing.telephone ?? "", email: editing.email ?? "",
          ville: editing.ville ?? "", adresse: editing.adresse ?? "", rib: editing.rib ?? "", banque: editing.banque ?? "",
          statut: editing.statut, categorieArticles: editing.categorieArticles ?? [],
        }
      : {
          code: "", raisonSociale: "", ice: "", contact: "", telephone: "",
          email: "", ville: "", adresse: "", rib: "", banque: "",
          statut: "ACTIF", categorieArticles: [],
        }
  );
  const [categorieInput, setCategorieInput] = useState("");

  const set = (key: keyof CreateFournisseurDTO, val: string | string[]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const addCategorie = () => {
    const v = categorieInput.trim();
    if (v && !form.categorieArticles.includes(v)) {
      setForm(prev => ({ ...prev, categorieArticles: [...prev.categorieArticles, v] }));
    }
    setCategorieInput("");
  };

  const removeCategorie = (c: string) =>
    setForm(prev => ({ ...prev, categorieArticles: prev.categorieArticles.filter(x => x !== c) }));

  const submit = async () => {
    if (!form.raisonSociale || !form.ice) {
      setErr("Veuillez remplir les champs obligatoires (Raison sociale, ICE).");
      return;
    }
    setSubmitting(true); setErr("");
    try {
      if (editing) {
        await updateFournisseur(editing.id, form);
      } else {
        await createFournisseur(form);
      }
      onCreated();
    } catch {
      setErr(editing ? "Erreur lors de la modification" : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  return (
    <Card className="mb-6 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark">
          {editing ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
        </h3>
        <button onClick={onCancel} className="text-xs text-content-muted hover:text-content-primary transition-colors">✕ Annuler</button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CodeField value={editing?.code} />
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Raison Sociale *</span>
          <input className={inputCls} value={form.raisonSociale} onChange={e => set("raisonSociale", e.target.value)} placeholder="Lafarge Maroc" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">ICE *</span>
          <input className={inputCls} value={form.ice} onChange={e => set("ice", e.target.value)} placeholder="001234567000012" />
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
          <input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} placeholder="contact@lafarge.ma" />
        </label>
        <label className="space-y-1 lg:col-span-3">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Adresse complète</span>
          <div className="flex gap-2">
            <input className={`${inputCls} w-1/3`} value={form.ville} onChange={e => set("ville", e.target.value)} placeholder="Ville (ex: Casablanca)" />
            <input className={`${inputCls} w-2/3`} value={form.adresse} onChange={e => set("adresse", e.target.value)} placeholder="Adresse (ex: Zone industrielle Ain Sebaa)" />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Banque</span>
          <input className={inputCls} value={form.banque} onChange={e => set("banque", e.target.value)} placeholder="Attijariwafa Bank" />
        </label>
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">RIB</span>
          <input className={inputCls} value={form.rib} onChange={e => set("rib", e.target.value)} placeholder="007 780 0001234567890 12" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Statut</span>
          <select className={inputCls} value={form.statut} onChange={e => set("statut", e.target.value as "ACTIF" | "INACTIF" | "BLACKLISTE")}>
            <option value="ACTIF">Actif</option>
            <option value="INACTIF">Inactif</option>
            <option value="BLACKLISTE">Blacklisté</option>
          </select>
        </label>
        <div className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Catégories d&apos;articles</span>
          <div className="flex gap-2">
            <input className={inputCls} value={categorieInput} onChange={e => setCategorieInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCategorie())} placeholder="Ex: Ciment" />
            <button type="button" onClick={addCategorie} className="px-3 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 shrink-0 transition-colors">+</button>
          </div>
          {form.categorieArticles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.categorieArticles.map(c => (
                <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  {c}
                  <button type="button" onClick={() => removeCategorie(c)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button onClick={submit} disabled={submitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors">
          {submitting ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Enregistrer"}
        </button>
      </div>
    </Card>
  );
}
