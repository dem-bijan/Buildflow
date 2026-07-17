"use client";

import { useState, useMemo } from "react";
import type { Employe, AnnuaireHydrated } from "@/components/functions2";
import { hydrate } from "@/components/functions2";
import { annuaireHydrationConfig } from "@/components/functions2";
import { ChartJsLoader, Section, Card, ChartCard, KpiGrid, HorizontalBarChart, PieChart, DonutChart, RefreshButton } from "@/components/Functions";

interface AnnuaireClientProps {
  employes: Employe[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

const STATUT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIF: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "#16a34a" },
  CONGE: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "#eda100" },
  INACTIF: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", dot: "#6b7280" },
};

export default function AnnuaireClient({ employes, onRefresh, refreshing }: AnnuaireClientProps) {
  const h = useMemo(() => hydrate<Employe, AnnuaireHydrated>(employes, annuaireHydrationConfig), [employes]);
  const [search, setSearch] = useState("");

  const filtered = search
    ? employes.filter(e =>
      e.matricule.toLowerCase().includes(search.toLowerCase()) ||
      e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.prenom.toLowerCase().includes(search.toLowerCase()) ||
      e.poste.toLowerCase().includes(search.toLowerCase())
    )
    : employes;

  return (
    <ChartJsLoader>
      <div className="bg-surface-page dark:bg-surface-page-dark min-h-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
              Tableau de bord — Annuaire RH
            </h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
              {employes.filter(e => e.statut === "ACTIF").length} actifs · {employes.length} employés au total
            </p>
          </div>
          {onRefresh && <RefreshButton onClick={onRefresh} loading={refreshing} />}
        </div>
        <Section title="Vue d'ensemble">
          <KpiGrid kpis={h.kpis} />
        </Section>
        <Section title="Masse salariale & effectifs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Masse salariale brute par rôle">
              <PieChart data={h.masseSalarialeParRole} />
            </ChartCard>
            <ChartCard title="Effectifs par département">
              <HorizontalBarChart data={h.employsParDept} />
            </ChartCard>
          </div>
        </Section>
        <Section title="Statuts & contrats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Statuts des employés">
              <DonutChart data={h.statutsEmployes} />
            </ChartCard>
            <ChartCard title="Répartition par type de contrat">
              <PieChart data={h.contratTypes} />
            </ChartCard>
          </div>
        </Section>
        <Section title="Ancienneté">
          <ChartCard title="Top 8 — ancienneté (années)">
            <HorizontalBarChart data={h.anciennete} />
          </ChartCard>
        </Section>

        <Section title="Liste des employés">
          <Card>
            <div className="px-4 pt-4 pb-3">
              <input
                type="text"
                placeholder="Rechercher par matricule, nom, poste…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
            </div>
            <EmployesTable employes={filtered} />
          </Card>
        </Section>
      </div>
    </ChartJsLoader>
  );
}

function EmployesTable({ employes }: { employes: Employe[] }) {
  if (employes.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-content-muted dark:text-content-muted-dark">Aucun employé trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
            {["Matricule", "Nom", "Poste", "Rôle", "Chantier actuel", "Contrat", "Statut"].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employes.map(e => {
            const style = STATUT_STYLES[e.statut] ?? STATUT_STYLES.ACTIF;
            return (
              <tr key={e.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
                <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{e.matricule}</td>
                <td className="px-3 py-3 font-medium text-content-primary dark:text-content-primary-dark whitespace-nowrap">{e.nom} {e.prenom}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{e.poste}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{e.role}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{e.chantierActuelNom ?? "—"}</td>
                <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark">{e.typeContrat}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                    {e.statut}
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
