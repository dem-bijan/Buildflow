"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { ArticleForm, createArticle, fetchArticles, type CreateArticleDTO } from "@/lib/api/articles";
import CatalogueClient from "./CatalogueClient";
import { PrimaryActionButton } from "@/components/Functions";

import type { Article } from "@/components/functions2";
import {
  fetchCategoriesArticles,
  createCategorieArticle,
  type CategorieArticleDTO
} from "@/lib/api/categoriesArticles";
import { fetchFournisseurs, type FournisseurDTO } from "@/lib/api/fournisseurs";


const emptyArticleForm: ArticleForm = {
  code: "",
  designation: "",
  description: "",
  categorie: "",
  unite: "pièce",
  prixAchatRef: 0,
  tvaRate: 20,
  fournisseursPreferentiels: [],
};

function generateCategoryCode(libelle: string) {
  return libelle
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .split(/\s+/)
    .map((word) => word.substring(0, 3).toUpperCase())
    .join("")
    .substring(0, 12);
}

export default function CataloguePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ArticleForm>(emptyArticleForm);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategorieArticleDTO[]>([]);
  const [fournisseurs, setFournisseurs] = useState<FournisseurDTO[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [articlesRes, categoriesRes, fournisseursRes] = await Promise.all([
        fetchArticles(0, 100, "designation,asc"),
        fetchCategoriesArticles(),
        fetchFournisseurs(),
      ]);

      setCategories(categoriesRes.content);
      setFournisseurs(fournisseursRes ?? []);

      const items = articlesRes.content.map((item) => ({
        ...item,
        categorieLibelle: item.categorieLibelle ?? "Autre",
        actif: item.actif ?? true,
        fournisseursPreferentiels: item.fournisseursPreferentiels ?? [],
      })) satisfies Article[];

      setArticles(items);
    } catch {
      const msg =
        "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
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
      let categorieId = "";

      const existingCategory = categories.find(
        (c) =>
          c.libelle.trim().toLowerCase() ===
          form.categorie.trim().toLowerCase()
      );

      if (existingCategory) {
        categorieId = existingCategory.id;
      } else {
        const created = await createCategorieArticle({
          code: generateCategoryCode(form.categorie),
          libelle: form.categorie,
          parentId: null,
        });

        categorieId = created.id;

        setCategories((prev) => [...prev, created]);
      }

      await createArticle({
        code: form.code,
        designation: form.designation,
        description: form.description,

        categorieId,

        unite: form.unite,
        prixAchatRef: Number(form.prixAchatRef),
        tvaRate: Number(form.tvaRate),

        fournisseursPreferentiels: form.fournisseursPreferentiels,
      });

      setShowForm(false);
      setForm(emptyArticleForm);
      await load();
    } catch {
      const msg =
        "Impossible d’enregistrer l’article";

      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && articles.length === 0) {
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

  if (error && articles.length === 0) {
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
          <h2 className="text-xl font-semibold text-content-primary dark:text-content-primary-dark">Catalogue</h2>
          <p className="text-sm text-content-muted dark:text-content-muted-dark">Ajoutez et consultez vos articles .</p>
        </div>
        <PrimaryActionButton onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Fermer" : "+ Nouvel article"}
        </PrimaryActionButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Code</span>
              <input required value={form.code ?? ""} onChange={(event) => setForm((value) => ({ ...value, code: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" />
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Désignation</span>
              <input required value={form.designation ?? ""} onChange={(event) => setForm((value) => ({ ...value, designation: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" />
            </label>
            <label className="text-sm space-y-1 md:col-span-2">
              <span className="text-content-muted">Description</span>
              <textarea value={form.description ?? ""} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" rows={3} />
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Catégorie</span>

              <input
                list="categories"
                value={form.categorie ?? ""}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    categorie: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
                placeholder="Choisir ou créer..."
              />

              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category.id} value={category.libelle} />
                ))}
              </datalist>
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Unité</span>
              <input required value={form.unite ?? ""} onChange={(event) => setForm((value) => ({ ...value, unite: event.target.value }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" />
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">Prix d’achat de référence</span>
              <input type="number" min="0" step="0.01" required value={form.prixAchatRef ?? 0} onChange={(event) => setForm((value) => ({ ...value, prixAchatRef: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" />
            </label>
            <label className="text-sm space-y-1">
              <span className="text-content-muted">TVA (%)</span>
              <input type="number" min="0" step="0.01" required value={form.tvaRate ?? 0} onChange={(event) => setForm((value) => ({ ...value, tvaRate: Number(event.target.value) }))} className="w-full rounded-lg border border-edge-subtle px-3 py-2" />
            </label>
            <div className="text-sm space-y-1 md:col-span-2">
              <span className="text-content-muted">Fournisseurs préférentiels</span>
              {fournisseurs.length === 0 ? (
                <p className="text-xs text-content-muted">Aucun fournisseur enregistré.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {fournisseurs.map((f) => {
                    const checked = form.fournisseursPreferentiels.includes(f.raisonSociale);
                    return (
                      <label
                        key={f.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer border transition-colors ${checked ? "bg-accent/10 border-accent text-accent" : "border-edge-subtle text-content-muted"}`}
                      >
                        <input
                          type="checkbox"
                          className="accent-accent"
                          checked={checked}
                          onChange={() =>
                            setForm((value) => ({
                              ...value,
                              fournisseursPreferentiels: checked
                                ? value.fournisseursPreferentiels.filter((name) => name !== f.raisonSociale)
                                : [...value.fournisseursPreferentiels, f.raisonSociale],
                            }))
                          }
                        />
                        {f.raisonSociale}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-content-muted">Annuler</button>
          </div>
        </form>
      )}

      <CatalogueClient articles={articles} onRefresh={load} refreshing={loading} />
    </div>
  );
}