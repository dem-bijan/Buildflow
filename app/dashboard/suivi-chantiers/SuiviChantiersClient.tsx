"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchChantiers, createChantier, updateChantier, deleteChantier, demarrerChantier } from "@/lib/api/chantier";
import { extractApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/lib/authContext";
import { hydrate } from "@/components/functions2";
import type { Chantier, ChantiersHydrated } from "@/components/functions2";
import { chantiersHydrationConfig } from "@/components/functions2";
import {
  ChartJsLoader, Section, ChartCard, Card,
  KpiGrid,
  StackedBarChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  RefreshButton,
  PrimaryActionButton,
  FadeSwap,
  Skeleton,
  KpiGridSkeleton,
  ChartCardSkeleton,
  TableSkeleton,
} from "@/components/Functions";
import type { ChantierDTO, CreateChantierDTO, ChantierStatut } from "@/lib/api/chantier";
import { CodeField } from "@/components/CodeField";

const STATUT_LABELS: Record<string, string> = {
  EN_PREPARATION: "En préparation",
  EN_COURS: "En cours",
  EN_PAUSE: "En pause",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const STATUT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  EN_PREPARATION: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "#2563eb" },
  EN_COURS: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
  EN_PAUSE: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "#eda100" },
  TERMINE: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280" },
  ANNULE: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "#dc2626" },
};

export default function SuiviChantiersClient() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "DIRECTEUR" || user?.role === "PM" || user?.role === "CHEF_CHANTIER";
  const canDelete = user?.role === "ADMIN" || user?.role === "DIRECTEUR";

  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ChantierDTO | null>(null);
  // Action feedback (delete/démarrer). Kept apart from `error`, which is the
  // "could not load the page at all" state and only renders on an empty list —
  // a failed delete used to be written there and was therefore never displayed.
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Same trap as the BPU view: the form sits above the KPIs, so opening it from
  // a row button lower down the table left it off-screen and "Modifier" looked
  // dead. Scroll it into view whenever it opens or switches row.
  useEffect(() => {
    if (!showForm) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [showForm, editing]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChantiers();

      const mapped: ChantierDTO[] = (data || []).map(c => ({
        ...c,
        depensesHT: c.depensesHt ?? 0,
        budgetHT: c.budgetHt ?? 0,
        avancement: c.avancement ?? 0,
        jalons: c.jalons ?? [],
        soustraitantsActifs: c.soustraitantsActifs ?? []
      }));

      setChantiers(mapped);
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (c: ChantierDTO) => {
    if (!confirm(`Supprimer le chantier "${c.nom}" ?\n\nLes jalons, lignes BPU et la caisse (si elle n'a aucune opération) seront supprimés avec le chantier.`)) return;
    setNotice(null);
    try {
      await deleteChantier(c.id);
      await load();
      setNotice({ kind: "success", text: `Chantier "${c.nom}" supprimé.` });
    } catch (err) {
      // The backend names exactly what still references the chantier — show it
      // instead of a generic guess.
      setNotice({
        kind: "error",
        text: extractApiErrorMessage(
          err,
          "Impossible de supprimer ce chantier. Vérifiez qu'aucun achat, contrat ou opération de caisse n'y est rattaché."
        ),
      });
    }
  };

  const handleDemarrer = async (c: ChantierDTO) => {
    setNotice(null);
    try {
      await demarrerChantier(c.id);
      await load();
    } catch (err) {
      setNotice({ kind: "error", text: extractApiErrorMessage(err, "Impossible de démarrer ce chantier.") });
    }
  };

  const h = useMemo(
    () => hydrate<Chantier, ChantiersHydrated>(chantiers as unknown as Chantier[], chantiersHydrationConfig),
    [chantiers]
  );

  if (error && chantiers.length === 0) {
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

  const filtered = search
    ? chantiers.filter(c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase())
    )
    : chantiers;

  return (
    <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
      <FadeSwap show={loading && chantiers.length === 0} skeleton={<SuiviChantiersSkeleton />}>
      <ChartJsLoader>
        <>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Suivi chantiers
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {chantiers.filter(c => c.statut === "EN_COURS").length} chantiers en cours · {chantiers.length} au total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={() => load()} loading={loading} />
            {canManage && (
              <PrimaryActionButton onClick={() => { setEditing(null); setShowForm(v => !v); }}>
                {showForm ? "Fermer" : "+ Nouveau chantier"}
              </PrimaryActionButton>
            )}
          </div>
        </div>

        {notice && (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
              notice.kind === "error"
                ? "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                : "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            }`}
          >
            <span>{notice.text}</span>
            <button
              onClick={() => setNotice(null)}
              aria-label="Fermer"
              className="shrink-0 font-semibold opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )}

        {showForm && canManage && (
          <div ref={formRef}>
            <CreateChantierForm
              editing={editing}
              onCreated={() => { setShowForm(false); setEditing(null); load(); }}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        )}

        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        <Section title="Budget vs dépenses">
          <ChartCard title="Budget HT vs dépenses engagées par chantier">
            <StackedBarChart data={h.budgetVsDepenses} />
          </ChartCard>
        </Section>

        <Section title="Avancement & statuts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts chantiers" className="sm:col-span-1">
              <DonutChart data={h.statutsChantiers} />
            </ChartCard>
            <ChartCard title="Avancement par chantier (%)" className="sm:col-span-2">
              <HorizontalBarChart data={h.avancement} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Jalons & répartition géographique">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des jalons (tous chantiers)">
              <DonutChart data={h.jalonsSummary} />
            </ChartCard>
            <ChartCard title="Dépenses engagées par ville">
              <PieChart data={h.depensesParVille} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Liste des chantiers">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par code, nom, client, ville…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <ChantiersTable
              chantiers={filtered}
              canManage={canManage}
              canDelete={canDelete}
              onEdit={(c) => { setEditing(c); setShowForm(true); }}
              onDelete={handleDelete}
              onDemarrer={handleDemarrer}
            />
          </Card>
        </Section>

        </>
      </ChartJsLoader>
      </FadeSwap>
    </div>
  );
}

function SuiviChantiersSkeleton() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Tableau de bord — Suivi chantiers
          </h1>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
      </div>

      <Section title="Vue d'ensemble">
        <KpiGridSkeleton count={4} />
      </Section>

      <Section title="Budget vs dépenses">
        <ChartCardSkeleton title="Budget HT vs dépenses engagées par chantier" variant="bar" />
      </Section>

      <Section title="Avancement & statuts">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChartCardSkeleton title="Statuts chantiers" className="sm:col-span-1" variant="donut" />
          <ChartCardSkeleton title="Avancement par chantier (%)" className="sm:col-span-2" variant="hbar" rows={5} />
        </div>
      </Section>

      <Section title="Jalons & répartition géographique">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton title="Statuts des jalons (tous chantiers)" variant="donut" />
          <ChartCardSkeleton title="Dépenses engagées par ville" variant="pie" />
        </div>
      </Section>

      <Section title="Liste des chantiers">
        <Card>
          <div className="px-4 pt-4 pb-3">
            <Skeleton className="h-9 w-full sm:w-80 rounded-lg" />
          </div>
          <TableSkeleton columns={9} rows={6} />
        </Card>
      </Section>
    </>
  );
}

function ChantiersTable({
  chantiers,
  canManage,
  canDelete,
  onEdit,
  onDelete,
  onDemarrer,
}: {
  chantiers: ChantierDTO[];
  canManage: boolean;
  canDelete: boolean;
  onEdit: (c: ChantierDTO) => void;
  onDelete: (c: ChantierDTO) => void;
  onDemarrer: (c: ChantierDTO) => void;
}) {
  const router = useRouter();

  if (chantiers.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun chantier trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Code", "Nom", "Client", "Ville", "Statut", "Début", "Fin prévue", "Budget HT", "Avancement", ...(canManage ? ["Actions"] : [])].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chantiers.map(c => {
            const style = STATUT_STYLES[c.statut] ?? STATUT_STYLES.EN_PREPARATION;
            return (
              <tr
                key={c.id}
                onClick={() => router.push(`/dashboard/suivi-chantiers/${c.id}`)}
                className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150 cursor-pointer"
              >
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{c.code}</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark max-w-[220px] truncate">{c.nom}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.client}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.ville}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                    {STATUT_LABELS[c.statut] ?? c.statut}
                  </span>
                </td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.dateDebut}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.dateFin}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{c.budgetHt.toLocaleString("fr-FR")} MAD</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{c.avancement}%</td>
                {canManage && (
                  <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    {c.statut === "EN_PREPARATION" && (
                      <button onClick={() => onDemarrer(c)} className="text-xs text-green-600 dark:text-green-400 font-semibold mr-3">
                        Démarrer
                      </button>
                    )}
                    <button onClick={() => onEdit(c)} className="text-xs text-accent font-semibold mr-3">
                      Modifier
                    </button>
                    {canDelete && (
                      <button onClick={() => onDelete(c)} className="text-xs text-red-500 font-semibold">
                        Supprimer
                      </button>
                    )}
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
function CreateChantierForm({
  editing,
  onCreated,
  onCancel,
}: {
  editing: ChantierDTO | null;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<CreateChantierDTO>(() =>
    editing
      ? {
          code: editing.code, nom: editing.nom, client: editing.client,
          adresse: editing.adresse ?? "", ville: editing.ville ?? "", statut: editing.statut,
          dateDebut: editing.dateDebut, dateFin: editing.dateFin,
          budgetHt: editing.budgetHt, chefProjetNom: editing.chefProjetNom ?? "",
        }
      : {
          nom: "", client: "", adresse: "", ville: "",
          statut: "EN_PREPARATION", dateDebut: "", dateFin: "", budgetHt: 0, chefProjetNom: "",
        }
  );

  const set = <K extends keyof CreateChantierDTO>(key: K, val: CreateChantierDTO[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.nom || !form.client || !form.dateDebut || !form.dateFin || !form.budgetHt) {
      setErr("Veuillez remplir les champs obligatoires (Nom, Client, Dates, Budget).");
      return;
    }
    setSubmitting(true); setErr("");
    try {
      if (editing) {
        await updateChantier(editing.id, form);
      } else {
        await createChantier(form);
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
          {editing ? "Modifier le chantier" : "Ajouter un chantier"}
        </h3>
        <button onClick={onCancel} className="text-xs text-content-muted hover:text-content-primary transition-colors">✕ Annuler</button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CodeField value={editing?.code} />
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Nom *</span>
          <input className={inputCls} value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Résidence Al Manar" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Client *</span>
          <input className={inputCls} value={form.client} onChange={e => set("client", e.target.value)} placeholder="Groupe Al Omrane" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Ville</span>
          <input className={inputCls} value={form.ville} onChange={e => set("ville", e.target.value)} placeholder="Casablanca" />
        </label>
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Adresse</span>
          <input className={inputCls} value={form.adresse} onChange={e => set("adresse", e.target.value)} placeholder="Zone industrielle Ain Sebaa" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Date de début *</span>
          <input type="date" className={inputCls} value={form.dateDebut} onChange={e => set("dateDebut", e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Date de fin prévue *</span>
          <input type="date" className={inputCls} value={form.dateFin} onChange={e => set("dateFin", e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Budget HT (MAD) *</span>
          <input type="number" min="0" step="0.01" className={inputCls} value={form.budgetHt || ""} onChange={e => set("budgetHt", Number(e.target.value))} placeholder="1500000" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Chef de projet</span>
          <input className={inputCls} value={form.chefProjetNom} onChange={e => set("chefProjetNom", e.target.value)} placeholder="Nom du chef de projet" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">Statut</span>
          <select className={inputCls} value={form.statut} onChange={e => set("statut", e.target.value as ChantierStatut)}>
            <option value="EN_PREPARATION">En préparation</option>
            <option value="EN_COURS">En cours</option>
            <option value="EN_PAUSE">En pause</option>
            <option value="TERMINE">Terminé</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end mt-5">
        <button onClick={submit} disabled={submitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg disabled:opacity-50 transition-colors">
          {submitting ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Enregistrer"}
        </button>
      </div>
    </Card>
  );
}
