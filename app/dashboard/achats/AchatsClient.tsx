"use client";


import { createAchat } from "@/lib/api/achats";
import { fetchFournisseurs } from "@/lib/api/fournisseurs";
import { fetchChantiers } from "@/lib/api/chantier";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchAchats } from "@/lib/api/achats";
import { hydrate } from "@/components/functions2";
import type { Achat, AchatsHydrated } from "@/components/functions2";
import { achatsHydrationConfig } from "@/components/functions2";
import { fetchArticles } from "@/lib/api/articles";
import { fmt } from "@/components/functions2";
import {
  ChartJsLoader,
  Section, Card, ChartCard,
  KpiGrid,
  PieChart,
  HorizontalBarChart,
  DonutChart,
  StackedBarChart,
  LineChart,
  RefreshButton,
  PrimaryActionButton,
} from "@/components/Functions";

export default function AchatsClient() {
  const [achats, setAchats] = useState<Achat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [articles, setArticles] = useState<
    {
      id: string;
      designation: string;
      prixAchatRef: number;
    }[]
  >([]);
  const [fournisseurs, setFournisseurs] = useState<
    { id: string; raisonSociale: string }[]
  >([]);

  const [chantiers, setChantiers] = useState<
    { id: string; nom: string }[]
  >([]);

  const [submitting, setSubmitting] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    ref: "",
    fournisseurId: "",
    chantierId: "",
    dateCommande: new Date().toISOString().slice(0, 10),
    dateLivraisonPrevue: new Date().toISOString().slice(0, 10),
    lignes: [
      {
        articleId: "",
        designation: "",
        quantite: 1,
        prixUnitaire: 0
      }
    ]
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        achatsData,
        fournisseursData,
        chantiersData,
        articlesData
      ] = await Promise.all([
        fetchAchats(),
        fetchFournisseurs(),
        fetchChantiers(),
        fetchArticles(),
      ]);

      setAchats(achatsData ?? []);

      setFournisseurs(
        fournisseursData.map(f => ({
          id: f.id,
          raisonSociale: f.raisonSociale,
        }))
      );

      setChantiers(
        chantiersData.map(c => ({
          id: c.id,
          nom: c.nom,
        }))
      );

      setArticles(
        articlesData.content.map(a => ({
          id: a.id,
          designation: a.designation,
          prixAchatRef: a.prixAchatRef,
        }))
      );

    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setFormError(null);

    try {

      await createAchat({
        ...form,
        lignes: form.lignes.map(l => ({
          articleId: l.articleId,
          designation: l.designation,
          quantite: Number(l.quantite),
          prixUnitaire: Number(l.prixUnitaire)
        }))
      });

      setShowForm(false);

      setForm({
        ref: "",
        fournisseurId: "",
        chantierId: "",
        dateCommande: new Date().toISOString().slice(0, 10),
        dateLivraisonPrevue: new Date().toISOString().slice(0, 10),
        lignes: [
          {
            articleId: "",
            designation: "",
            quantite: 1,
            prixUnitaire: 0
          }
        ]
      });

      await load();

    } catch {
      setFormError("Impossible de créer l'achat");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => (
    search
      ? achats.filter(a =>
        a.ref.toLowerCase().includes(search.toLowerCase()) ||
        a.fournisseurNom.toLowerCase().includes(search.toLowerCase()) ||
        a.chantierNom.toLowerCase().includes(search.toLowerCase())
      )
      : achats
  ), [achats, search]);

  const h = useMemo(() => hydrate<Achat, AchatsHydrated>(achats, achatsHydrationConfig), [achats]);

  if (loading && achats.length === 0) {
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

  if (error && achats.length === 0) {
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

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Achats — Commandes
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {achats.length} commandes enregistrées
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton onClick={() => load()} loading={loading} />
            <PrimaryActionButton onClick={() => setShowForm(v => !v)}>
              {showForm ? "Fermer" : "+ Nouvelle commande"}
            </PrimaryActionButton>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-5"
          >
            <h2 className="text-sm font-semibold text-content-primary dark:text-content-primary-dark">
              Nouvelle commande achat
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="text-sm space-y-1">
                <span className="text-content-muted">Référence</span>
                <input
                  required
                  value={form.ref}
                  onChange={(e) =>
                    setForm(v => ({ ...v, ref: e.target.value }))
                  }
                  className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                  placeholder="ACH-001"
                />
              </label>


              <label className="text-sm space-y-1">
                <span className="text-content-muted">Fournisseur</span>
                <select
                  required
                  value={form.fournisseurId}
                  onChange={(e) =>
                    setForm(v => ({
                      ...v,
                      fournisseurId: e.target.value
                    }))
                  }
                  className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                >
                  <option value="">Choisir un fournisseur</option>

                  {fournisseurs.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.raisonSociale}
                    </option>
                  ))}
                </select>
              </label>


              <label className="text-sm space-y-1">
                <span className="text-content-muted">Chantier</span>
                <select
                  required
                  value={form.chantierId}
                  onChange={(e) =>
                    setForm(v => ({
                      ...v,
                      chantierId: e.target.value
                    }))
                  }
                  className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                >
                  <option value="">Choisir un chantier</option>

                  {chantiers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </label>


              <label className="text-sm space-y-1">
                <span className="text-content-muted">Date commande</span>
                <input
                  type="date"
                  required
                  value={form.dateCommande}
                  onChange={(e) =>
                    setForm(v => ({
                      ...v,
                      dateCommande: e.target.value
                    }))
                  }
                  className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                />
              </label>


              <label className="text-sm space-y-1">
                <span className="text-content-muted">
                  Date livraison prévue
                </span>

                <input
                  type="date"
                  required
                  value={form.dateLivraisonPrevue}
                  onChange={(e) =>
                    setForm(v => ({
                      ...v,
                      dateLivraisonPrevue: e.target.value
                    }))
                  }
                  className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                />
              </label>

            </div>


            <div className="space-y-3">

              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">
                  Lignes de commande
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setForm(v => ({
                      ...v,
                      lignes: [
                        ...v.lignes,
                        {
                          articleId: "",
                          designation: "",
                          quantite: 1,
                          prixUnitaire: 0
                        }
                      ]
                    }))
                  }
                  className="text-xs text-accent font-semibold"
                >
                  + Ajouter une ligne
                </button>
              </div>


              {form.lignes.map((ligne, index) => (

                <div
                  key={index}
                  className="grid gap-3 md:grid-cols-4 items-end"
                >
                  <label className="text-sm space-y-1 md:col-span-2">
                    <span className="text-content-muted">
                      Désignation
                    </span>

                    <label className="text-sm space-y-1 md:col-span-2">
                      <span className="text-content-muted">Article</span>

                      <select
                        required
                        value={ligne.articleId}
                        onChange={(e) => {
                          const article = articles.find(a => a.id === e.target.value);

                          setForm(v => ({
                            ...v,
                            lignes: v.lignes.map((l, i) =>
                              i === index
                                ? {
                                  ...l,
                                  articleId: article?.id ?? "",
                                  designation: article?.designation ?? "",
                                  prixUnitaire: article?.prixAchatRef ?? 0,
                                }
                                : l
                            ),
                          }));
                        }}
                        className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                      >
                        <option value="">Choisir un article</option>

                        {articles.map(article => (
                          <option key={article.id} value={article.id}>
                            {article.designation}
                          </option>
                        ))}
                      </select>
                    </label>
                  </label>


                  <label className="text-sm space-y-1">
                    <span className="text-content-muted">
                      Quantité
                    </span>

                    <input
                      type="number"
                      min="1"
                      required
                      value={ligne.quantite}
                      onChange={(e) =>
                        setForm(v => ({
                          ...v,
                          lignes: v.lignes.map((l, i) =>
                            i === index
                              ? { ...l, quantite: Number(e.target.value) }
                              : l
                          )
                        }))
                      }
                      className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                    />
                  </label>


                  <label className="text-sm space-y-1">
                    <span className="text-content-muted">
                      Prix HT
                    </span>

                    <div className="w-full rounded-lg border border-edge-subtle px-3 py-2 bg-gray-100">
                      {ligne.prixUnitaire} DH
                    </div>
                  </label>


                  {form.lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm(v => ({
                          ...v,
                          lignes: v.lignes.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-xs text-red-500"
                    >
                      Supprimer
                    </button>
                  )}

                </div>

              ))}

            </div>


            {formError && (
              <p className="text-sm text-red-500">
                {formError}
              </p>
            )}


            <div className="flex gap-3">

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting ? "Enregistrement…" : "Créer la commande"}
              </button>


              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-content-muted"
              >
                Annuler
              </button>

            </div>

          </form>
        )}
        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>

        {/* ── Charts ───────────────────────────────────────────────────── */}
        <Section title="Analyse financière">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="HT vs TVA par commande (MAD)">
              <StackedBarChart data={h.budgetStacks} />
            </ChartCard>
            <ChartCard title="Tendance HT vs TVA">
              <LineChart data={h.budgetTrend} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Répartition des achats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Montants TTC par fournisseur">
              <PieChart data={h.fournisseurs} />
            </ChartCard>
            <ChartCard title="Montants TTC par chantier">
              <HorizontalBarChart data={h.chantiers} />
            </ChartCard>
          </div>
        </Section>

        <Section title="Statuts & Articles">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChartCard title="Statuts des commandes" className="sm:col-span-1">
              <DonutChart data={h.statuses} />
            </ChartCard>
            <ChartCard title="Top articles commandés (Valeur)" className="sm:col-span-2">
              <HorizontalBarChart data={h.articles} />
            </ChartCard>
          </div>
        </Section>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <Section title="Liste des commandes">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par référence, fournisseur, chantier…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <AchatsTable achats={filtered} />
          </Card>
        </Section>
      </div>
    </ChartJsLoader>
  );
}

function AchatsTable({ achats }: { achats: Achat[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const hTable = useMemo(() => achatsHydrationConfig.table(achats), [achats]);

  if (achats.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Réf", "Fournisseur", "Chantier", "Date", "HT", "TVA", "TTC", "Statut"].map(title => (
              <th key={title} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hTable.rows.map(row => {
            const isOpen = expanded === row.id;
            return (
              <tr
                key={row.id}
                onClick={() => setExpanded(isOpen ? null : row.id)}
                className={`border-b border-edge-subtle dark:border-edge-subtle-dark cursor-pointer transition-colors duration-150 ${isOpen ? "bg-accent-50 dark:bg-accent-950/30" : "hover:bg-surface-hover dark:hover:bg-surface-hover-dark"}`}
              >
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{row.ref}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col1}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col2}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{row.col3}</td>
                <td className="px-3 py-3 font-semibold text-content-primary dark:text-content-primary-dark">{fmt(row.ht)}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{fmt(row.tva)}</td>
                <td className="px-3 py-3 font-bold text-content-primary dark:text-content-primary-dark">{fmt(row.ttc)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${row.statusBg} ${row.statusText}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.statusDot }} />
                    {row.statusLabel}
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