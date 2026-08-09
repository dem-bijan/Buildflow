import apiClient from "./client";

export interface DashboardKpisDTO {
  month: string | null;

  // Balance KPIs — as of now, not period-scoped.
  dettesFournisseursTtc: number;
  dettesSousTraitantsTtc: number;
  paieAPayerNet: number;
  attachementsEnCoursTtc: number;
  valeurStocksGlobaleHt: number;
  /** Split of the line above: still in the central dépôt. */
  valeurStocksDepotHt: number;
  /** Split of the line above: allocated to chantiers ("en travaux"). */
  valeurStocksEnTravauxHt: number;

  // Flow KPIs — scoped to `month` when provided, all-time otherwise.
  decaissementsCaisseTtc: number;
  encaissementsGlobauxTtc: number;
  decaissementsGlobauxTtc: number;

  // Margin formulas.
  margeNetteComptableHt: number;
  margeEnCoursPrevisionnelleHt: number;
}

/** GET /api/v1/dashboard/kpis?month=YYYY-MM (ADMIN/FINANCE/DIRECTEUR only) */
export async function fetchDashboardKpis(month?: string): Promise<DashboardKpisDTO> {
  const { data } = await apiClient.get<DashboardKpisDTO>("/dashboard/kpis", {
    params: month ? { month } : {},
  });
  return data;
}
