"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { hydrate } from "@/components/functions2";
import type {
  Achat, AchatsHydrated,
  Fournisseur, FournisseursHydrated,
  Chantier, ChantiersHydrated,
  Transaction, TresorerieHydrated,
  ContratSousTraitanceWithPaiements, SousTraitanceHydrated,
  FichePaie, SalairesHydrated,
  Article, CatalogueHydrated,
  Employe, AnnuaireHydrated,
  EcritureComptable, ComptabiliteHydrated,
  Paiement, PaiementsHydrated,
} from "@/components/functions2";
import {
  achatsHydrationConfig,
  fournisseursHydrationConfig,
  chantiersHydrationConfig,
  tresorerieHydrationConfig,
  sousTraitanceHydrationConfig,
  salairesHydrationConfig,
  catalogueHydrationConfig,
  annuaireHydrationConfig,
  comptabiliteHydrationConfig,
  paiementsHydrationConfig,
} from "@/components/functions2";

import { ChartJsLoader, Card, HorizontalBarChart, DonutChart, FadeSwap, Skeleton } from "@/components/Functions";

import { fetchAchats } from "@/lib/api/achats";
import { fetchFournisseurs } from "@/lib/api/fournisseurs";
import { fetchChantiers } from "@/lib/api/chantier";
import { fetchCaisses, fetchTransactions } from "@/lib/api/tresorerie";
import { fetchContratsSousTraitant, fetchPaiements } from "@/lib/api/sousTraitance";
import { fetchSalaires } from "@/lib/api/salaires";
import { fetchArticles } from "@/lib/api/articles";
import { fetchEmployes } from "@/lib/api/employes";
import { fetchEcritures } from "@/lib/api/comptabilite";
import { fetchStocksByChantier, type StockArticleDTO } from "@/lib/api/stocks";
import { fetchDashboardKpis, type DashboardKpisDTO } from "@/lib/api/dashboard";
import { fmt } from "@/components/functions2";

import { useAuth } from "@/lib/authContext";
import { isAllowed, type Role } from "@/lib/auth/permissions";

export default function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const role = user?.role as Role | undefined;

  const [achats, setAchats] = useState<Achat[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contratsST, setContratsST] = useState<ContratSousTraitanceWithPaiements[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [fiches, setFiches] = useState<FichePaie[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
  const [stocks, setStocks] = useState<StockArticleDTO[]>([]);
  const [stocksChantierNom, setStocksChantierNom] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canFinanceKpis = role === "ADMIN" || role === "FINANCE" || role === "DIRECTEUR";
  const [kpisMonth, setKpisMonth] = useState("");
  const [kpis, setKpis] = useState<DashboardKpisDTO | null>(null);
  const [kpisLoading, setKpisLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Each domain is gated by its own backend role check, and not every role
    // can see every domain (e.g. a VIEWER can't list achats or salaires).
    // A 403 on one domain must never blank out the domains the role *can*
    // see, so every fetch below is isolated and skipped up front when the
    // role isn't allowed on that page.
    async function safe<T>(allowed: boolean, fn: () => Promise<T>, fallback: T): Promise<T> {
      if (!allowed) return fallback;
      try {
        return await fn();
      } catch {
        return fallback;
      }
    }

    const canAchats = isAllowed("/dashboard/achats", role);
    const canFournisseurs = isAllowed("/dashboard/fournisseurs", role);
    const canChantiers = isAllowed("/dashboard/suivi-chantiers", role);
    const canStocks = isAllowed("/dashboard/stocks", role);
    const canTresorerie = isAllowed("/dashboard/tresorerie", role);
    const canSousTraitance = isAllowed("/dashboard/sous-traitance", role) || isAllowed("/dashboard/payments", role);
    const canSalaires = isAllowed("/dashboard/salaires", role);
    const canCatalogue = isAllowed("/dashboard/catalogue", role);
    const canAnnuaire = isAllowed("/dashboard/annuaire", role);
    const canComptabilite = isAllowed("/dashboard/comptabilite", role);

    try {
      const [
        achatsData,
        fournisseursData,
        chantiersData,
        caissesData,
        contratsData,
        fichesData,
        articlesRes,
        employesData,
        ecrituresData,
      ] = await Promise.all([
        safe(canAchats, () => fetchAchats(), []),
        safe(canFournisseurs, () => fetchFournisseurs(), []),
        safe(canChantiers || canStocks, () => fetchChantiers(), []),
        safe(canTresorerie, () => fetchCaisses(), []),
        safe(canSousTraitance, () => fetchContratsSousTraitant(), []),
        safe(canSalaires, () => fetchSalaires(), []),
        safe(canCatalogue, () => fetchArticles(0, 100, "designation,asc"), {
          content: [], totalElements: 0, totalPages: 0, number: 0, size: 0, first: true, last: true,
        }),
        safe(canAnnuaire, () => fetchEmployes(), []),
        safe(canComptabilite, () => fetchEcritures(), []),
      ]);

      setAchats(achatsData);

      setFournisseurs(
        fournisseursData.map((f) => ({
          ...f,
          totalAchatsAnnee: f.totalAchatsAnnee ?? 0,
          soldeImpaye: f.soldeImpaye ?? 0,
        })) as unknown as Fournisseur[]
      );

      const mappedChantiers = chantiersData.map((c) => ({
        ...c,
        depensesHT: c.depensesHt ?? 0,
        budgetHT: c.budgetHt ?? 0,
        avancement: c.avancement ?? 0,
        jalons: c.jalons ?? [],
        soustraitantsActifs: c.soustraitantsActifs ?? [],
      })) as unknown as Chantier[];
      setChantiers(mappedChantiers);

      setFiches(fichesData as unknown as FichePaie[]);

      setArticles(
        articlesRes.content.map((a) => ({
          ...a,
          categorieLibelle: a.categorieLibelle ?? "Autre",
          actif: a.actif ?? true,
          fournisseursPreferentiels: a.fournisseursPreferentiels ?? [],
        })) as unknown as Article[]
      );

      setEmployes(
        employesData.map((e) => ({
          ...e,
          statut: e.statut ?? "ACTIF",
          role: (e.role as Employe["role"]) ?? "OUVRIER",
        })) as unknown as Employe[]
      );

      setEcritures(ecrituresData);

      // Cash flow: transactions live under each caisse.
      const txLists = await Promise.all(
        (caissesData ?? []).map((c) =>
          safe(
            canTresorerie,
            () => fetchTransactions(c.id),
            []
          ).then((tx) =>
            tx.map((t) => ({
              ...t,
              montant: t.montant ?? 0,
              caisseId: c.id,
              caisseLibelle: c.libelle,
            }))
          )
        )
      );
      setTransactions(txLists.flat() as unknown as Transaction[]);

      // Paiements live under each sous-traitance contract — fetch once and
      // reuse both for the sous-traitance chart (contrat.paiements) and the
      // flattened payments-domain view.
      const contratsWithPaiements = await Promise.all(
        (contratsData ?? []).map(async (contrat) => {
          const ps = await safe(canSousTraitance, () => fetchPaiements(contrat.id), []);
          return { ...contrat, paiements: ps };
        })
      );
      setContratsST(contratsWithPaiements as unknown as ContratSousTraitanceWithPaiements[]);

      const paiementLists = contratsWithPaiements.map((contrat) =>
        contrat.paiements.map(
          (p): Paiement => ({
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
          })
        )
      );
      setPaiements(paiementLists.flat());

      // Stocks are chantier-scoped — show the first chantier as a representative sample.
      if (canStocks && mappedChantiers.length > 0) {
        const first = chantiersData[0];
        const stocksData = await safe(true, () => fetchStocksByChantier(first.id), []);
        setStocks(stocksData);
        setStocksChantierNom(first.nom);
      } else {
        setStocks([]);
        setStocksChantierNom("");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  useEffect(() => {
    if (authLoading || !canFinanceKpis) return;
    setKpisLoading(true);
    fetchDashboardKpis(kpisMonth || undefined)
      .then(setKpis)
      .catch(() => setKpis(null))
      .finally(() => setKpisLoading(false));
  }, [authLoading, canFinanceKpis, kpisMonth]);

  const hAchats = useMemo(() => hydrate<Achat, AchatsHydrated>(achats, achatsHydrationConfig), [achats]);
  const hFournisseurs = useMemo(() => hydrate<Fournisseur, FournisseursHydrated>(fournisseurs, fournisseursHydrationConfig), [fournisseurs]);
  const hChantiers = useMemo(() => hydrate<Chantier, ChantiersHydrated>(chantiers, chantiersHydrationConfig), [chantiers]);
  const hTresorerie = useMemo(() => hydrate<Transaction, TresorerieHydrated>(transactions, tresorerieHydrationConfig), [transactions]);
  const hSousTraitance = useMemo(() => hydrate<ContratSousTraitanceWithPaiements, SousTraitanceHydrated>(contratsST, sousTraitanceHydrationConfig), [contratsST]);
  const hSalaires = useMemo(() => hydrate<FichePaie, SalairesHydrated>(fiches, salairesHydrationConfig), [fiches]);
  const hCatalogue = useMemo(() => hydrate<Article, CatalogueHydrated>(articles, catalogueHydrationConfig), [articles]);
  const hAnnuaire = useMemo(() => hydrate<Employe, AnnuaireHydrated>(employes, annuaireHydrationConfig), [employes]);
  const hComptabilite = useMemo(() => hydrate<EcritureComptable, ComptabiliteHydrated>(ecritures, comptabiliteHydrationConfig), [ecritures]);
  const hPaiements = useMemo(() => hydrate<Paiement, PaiementsHydrated>(paiements, paiementsHydrationConfig), [paiements]);

  const stocksEnAlerte = stocks.filter((s) => s.enAlerte);

  const topCards = [
    {
      title: "Dettes Fournisseurs",
      value: hFournisseurs.kpis[2]?.value ?? "—",
      sub: hFournisseurs.kpis[2]?.sub ?? "",
      href: "/dashboard/fournisseurs",
    },
    {
      title: "Décaissements caisse",
      value: hTresorerie.kpis[1]?.value ?? "—",
      sub: hTresorerie.kpis[1]?.sub ?? "",
      href: "/dashboard/tresorerie",
    },
    {
      title: "Dettes sous-traitants",
      value: hSousTraitance.kpis[3]?.value ?? "—",
      sub: hSousTraitance.kpis[3]?.sub ?? "",
      href: "/dashboard/sous-traitance",
    },
    {
      title: "Paiements",
      value: hPaiements.kpis[1]?.value ?? "—",
      sub: hPaiements.kpis[1]?.sub ?? "",
      href: "/dashboard/payments",
    },
  ].filter((c) => isAllowed(c.href, role));

  const domainCards: {
    href: string;
    title: string;
    kpi: string;
    sub: string;
    chart: ReactNode;
  }[] = [
    {
      href: "/dashboard/achats",
      title: "Achats",
      kpi: hAchats.kpis[0]?.value ?? "—",
      sub: hAchats.kpis[0]?.sub ?? "",
      chart: hAchats.statuses.length > 0 ? <DonutChart data={hAchats.statuses} /> : null,
    },
    {
      href: "/dashboard/fournisseurs",
      title: "Fournisseurs",
      kpi: hFournisseurs.kpis[0]?.value ?? "—",
      sub: hFournisseurs.kpis[0]?.sub ?? "",
      chart: hFournisseurs.statuses.length > 0 ? <DonutChart data={hFournisseurs.statuses} /> : null,
    },
    {
      href: "/dashboard/stocks",
      title: "Gestion des Stocks",
      kpi: `${stocks.length}`,
      sub: stocksChantierNom ? `articles — ${stocksChantierNom}` : "articles en stock",
      chart: (
        <div className="text-xs text-content-muted dark:text-content-muted-dark space-y-2 mt-1">
          <div className="flex items-center justify-between">
            <span>Alertes seuil</span>
            <span className="font-semibold text-red-600 dark:text-red-400">{stocksEnAlerte.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Quantité théorique</span>
            <span className="font-semibold text-content-primary dark:text-content-primary-dark">
              {stocks.reduce((s, a) => s + a.quantiteTheorique, 0).toLocaleString("fr-FR")}
            </span>
          </div>
        </div>
      ),
    },
    {
      href: "/dashboard/suivi-chantiers",
      title: "Suivi Chantiers",
      kpi: hChantiers.kpis[0]?.value ?? "—",
      sub: hChantiers.kpis[0]?.sub ?? "",
      chart: hChantiers.statutsChantiers.length > 0 ? <DonutChart data={hChantiers.statutsChantiers} /> : null,
    },
    {
      href: "/dashboard/tresorerie",
      title: "Trésorerie et Caisse",
      kpi: hTresorerie.kpis[2]?.value ?? "—",
      sub: hTresorerie.kpis[2]?.sub ?? "",
      chart: hTresorerie.repartitionFlux.length > 0 ? <DonutChart data={hTresorerie.repartitionFlux} /> : null,
    },
    {
      href: "/dashboard/sous-traitance",
      title: "Sous Traitance",
      kpi: hSousTraitance.kpis[1]?.value ?? "—",
      sub: hSousTraitance.kpis[1]?.sub ?? "",
      chart: hSousTraitance.statutsContrats.length > 0 ? <DonutChart data={hSousTraitance.statutsContrats} /> : null,
    },
    {
      href: "/dashboard/salaires",
      title: "Salaires",
      kpi: hSalaires.kpis[0]?.value ?? "—",
      sub: hSalaires.kpis[0]?.sub ?? "",
      chart: hSalaires.statutsFiches.length > 0 ? <DonutChart data={hSalaires.statutsFiches} /> : null,
    },
    {
      href: "/dashboard/catalogue",
      title: "Catalogue Articles",
      kpi: hCatalogue.kpis[0]?.value ?? "—",
      sub: hCatalogue.kpis[0]?.sub ?? "",
      chart: hCatalogue.statuses.length > 0 ? <DonutChart data={hCatalogue.statuses} /> : null,
    },
    {
      href: "/dashboard/payments",
      title: "Paiements",
      kpi: hPaiements.kpis[0]?.value ?? "—",
      sub: hPaiements.kpis[0]?.sub ?? "",
      chart: hPaiements.statutsPaiements.length > 0 ? <DonutChart data={hPaiements.statutsPaiements} /> : null,
    },
    {
      href: "/dashboard/annuaire",
      title: "Annuaire",
      kpi: hAnnuaire.kpis[0]?.value ?? "—",
      sub: hAnnuaire.kpis[0]?.sub ?? "",
      chart: hAnnuaire.statutsEmployes.length > 0 ? <DonutChart data={hAnnuaire.statutsEmployes} /> : null,
    },
    {
      href: "/dashboard/comptabilite",
      title: "Comptabilite",
      kpi: hComptabilite.kpis[0]?.value ?? "—",
      sub: hComptabilite.kpis[0]?.sub ?? "",
      chart: hComptabilite.volumeParJournal.length > 0 ? <HorizontalBarChart data={hComptabilite.volumeParJournal.slice(0, 4)} /> : null,
    },
  ].filter((card) => isAllowed(card.href, role));

  const showSkeleton = loading && achats.length === 0 && fournisseurs.length === 0 && chantiers.length === 0;

  if (error && achats.length === 0 && fournisseurs.length === 0) {
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
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <FadeSwap show={showSkeleton} skeleton={<DashboardSkeleton />}>
    <ChartJsLoader>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
            Vue d&apos;ensemble
          </h1>
          <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
            Indicateurs clés de tous les modules.
          </p>
        </div>

        {canFinanceKpis && (
          <FinanceKpisSection
            kpis={kpis}
            loading={kpisLoading}
            month={kpisMonth}
            onMonthChange={setKpisMonth}
          />
        )}

        {topCards.length === 0 && domainCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2 text-center">
            <p className="text-sm font-medium text-content-primary dark:text-content-primary-dark">
              Aucun module accessible avec votre rôle actuel.
            </p>
            <p className="text-xs text-content-muted dark:text-content-muted-dark">
              Contactez un administrateur si vous pensez que c&apos;est une erreur.
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              {topCards.map((c) => (
                <TopKpiCard key={c.title} {...c} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {domainCards.map((c) => (
                <DomainCard key={c.href} {...c} />
              ))}
            </section>
          </>
        )}
      </motion.div>
    </ChartJsLoader>
      </FadeSwap>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
          Vue d&apos;ensemble
        </h1>
        <Skeleton className="h-4 w-56 mt-2" />
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dark:bg-surface-card-dark bg-surface-card rounded-lg border border-edge-default dark:border-zinc-700 shadow-md p-3 h-25 flex flex-col justify-between">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 mt-2" />
            <Skeleton className="h-3 w-28 mt-2 mb-3" />
            <Skeleton className="h-24 w-full rounded-full" />
          </Card>
        ))}
      </section>
    </>
  );
}

function TopKpiCard({
  title,
  value,
  sub,
  href,
}: {
  title: string;
  value: string;
  sub: string;
  href: string;
}) {
  return (
    <Link href={href} className="block group">
      <div
        className="
          dark:bg-surface-card-dark bg-surface-card
          rounded-lg border border-edge-default dark:border-zinc-700
          shadow-md p-3 h-25
          flex flex-col justify-between transition-all duration-150
          group-hover:shadow-lg group-hover:border-accent/50
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-content-primary dark:text-content-primary-dark uppercase tracking-wide">
            {title}
          </span>
          <span className="text-content-muted group-hover:text-accent transition-colors text-xs">→</span>
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-content-secondary dark:text-content-secondary-dark">
          {value}
        </div>
        <div className="text-[11px] text-content-muted dark:text-content-muted-dark truncate">
          {sub}
        </div>
      </div>
    </Link>
  );
}

function FinanceKpisSection({
  kpis,
  loading,
  month,
  onMonthChange,
}: {
  kpis: DashboardKpisDTO | null;
  loading: boolean;
  month: string;
  onMonthChange: (month: string) => void;
}) {
  const balanceKpis = [
    { label: "Dettes Fournisseurs (TTC)", value: kpis?.dettesFournisseursTtc },
    { label: "Dettes Sous-traitants (TTC)", value: kpis?.dettesSousTraitantsTtc },
    { label: "Paie à Payer (NET)", value: kpis?.paieAPayerNet },
    { label: "Attachements en Cours (TTC)", value: kpis?.attachementsEnCoursTtc },
    { label: "Valeur Stocks Globale (HT)", value: kpis?.valeurStocksGlobaleHt },
  ];

  const flowKpis = [
    { label: "Décaissements Caisse (TTC)", value: kpis?.decaissementsCaisseTtc },
    { label: "Encaissements Globaux (TTC)", value: kpis?.encaissementsGlobauxTtc },
    { label: "Décaissements Globaux (TTC)", value: kpis?.decaissementsGlobauxTtc },
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-content-secondary dark:text-content-secondary-dark">
          Finance &amp; Marges
        </h2>
        <label className="flex items-center gap-2 text-xs text-content-muted dark:text-content-muted-dark">
          Période (flux)
          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark px-2 py-1"
          />
          {month && (
            <button type="button" onClick={() => onMonthChange("")} className="text-accent font-semibold">
              Tout
            </button>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-5 mb-3">
        {balanceKpis.map((k) => (
          <FinanceKpiCard key={k.label} label={k.label} value={k.value} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-3">
        {flowKpis.map((k) => (
          <FinanceKpiCard key={k.label} label={k.label} value={k.value} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FinanceKpiCard
          label="Marge Nette Comptable (HT)"
          value={kpis?.margeNetteComptableHt}
          loading={loading}
          highlight
        />
        <FinanceKpiCard
          label="Marge en Cours Prévisionnelle (HT)"
          value={kpis?.margeEnCoursPrevisionnelleHt}
          loading={loading}
          highlight
        />
      </div>
    </section>
  );
}

function FinanceKpiCard({
  label,
  value,
  loading,
  highlight,
}: {
  label: string;
  value: number | undefined;
  loading: boolean;
  highlight?: boolean;
}) {
  const negative = typeof value === "number" && value < 0;
  return (
    <Card className={`p-4 ${highlight ? "border-accent/40" : ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-content-muted dark:text-content-muted-dark mb-1">
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <p className={`text-lg font-bold font-mono ${negative ? "text-red-600 dark:text-red-400" : "text-content-primary dark:text-content-primary-dark"}`}>
          {typeof value === "number" ? `${fmt(value)} MAD` : "—"}
        </p>
      )}
    </Card>
  );
}

function DomainCard({
  href,
  title,
  kpi,
  sub,
  chart,
}: {
  href: string;
  title: string;
  kpi: string;
  sub: string;
  chart: ReactNode;
}) {
  return (
    <Link href={href} className="block group h-full">
      <Card className="p-4 sm:p-5 h-full transition-all duration-150 group-hover:shadow-lg group-hover:border-accent/50">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark uppercase tracking-wide">
            {title}
          </p>
          <span className="text-content-muted group-hover:text-accent transition-colors text-xs">→</span>
        </div>
        <p className="text-lg font-bold text-content-primary dark:text-content-primary-dark mb-0.5">{kpi}</p>
        <p className="text-xs text-content-muted dark:text-content-muted-dark mb-3">{sub}</p>
        {chart}
      </Card>
    </Link>
  );
}
