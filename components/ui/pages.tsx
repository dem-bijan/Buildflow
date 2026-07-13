"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENTS — one per route, following the achats pattern exactly.
// Each file imports from functions2 (hydration) and Functions (chart components).
// Replace the RAW_* array with your API response; nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

import { hydrate, hydratedSoldeCaisses, hydratedResultatN, hydratedComparaisonNN1 } from "@/components/functions2";
import type {
  Fournisseur, FournisseursHydrated,
  StockArticle, StocksHydrated,
  Article, CatalogueHydrated,
  Chantier, ChantiersHydrated,
  Affectation, AffectationHydrated,
  ContratSousTraitance, SousTraitanceHydrated,
  FichePaie, SalairesHydrated,
  Transaction, Caisse, TresorerieHydrated,
  Paiement, PaiementsHydrated,
  EcritureComptable, CompteResultat, ComptabiliteHydrated,
  Employe, AnnuaireHydrated,
} from "@/components/functions2";
import {
  fournisseursHydrationConfig,
  stocksHydrationConfig,
  catalogueHydrationConfig,
  chantiersHydrationConfig,
  affectationHydrationConfig,
  sousTraitanceHydrationConfig,
  salairesHydrationConfig,
  tresorerieHydrationConfig,
  paiementsHydrationConfig,
  comptabiliteHydrationConfig,
  annuaireHydrationConfig,
} from "@/components/functions2";
import {
  ChartJsLoader,
  Section, Card, ChartCard,
  KpiGrid,
  PaymentProgress,
  StackedBarChart,
  LineChart,
  HorizontalBarChart,
  PieChart,
  DonutChart,
  CommandesTable,
} from "@/components/Functions";

