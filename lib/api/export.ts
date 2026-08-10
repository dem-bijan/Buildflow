import apiClient from "./client";

/** A dashboard section that can be exported on its own. */
export type ExportSection =
  | "INDICATEURS"
  | "ACHATS"
  | "CHANTIERS"
  | "FOURNISSEURS"
  | "ARTICLES"
  | "EMPLOYES"
  | "CAISSES"
  | "SALAIRES"
  | "SOUS_TRAITANCE";

/**
 * Downloads an .xlsx and hands it to the browser.
 *
 * The response is a binary blob, so this bypasses the usual JSON envelope
 * handling with `responseType: "blob"`. The filename comes from the server's
 * Content-Disposition when present, which is where the date suffix lives.
 */
async function download(path: string, fallbackName: string, month?: string): Promise<void> {
  const { data, headers } = await apiClient.get(path, {
    responseType: "blob",
    params: month ? { month } : undefined,
    // The response interceptor unwraps JSON envelopes; a Blob must pass through
    // untouched or it arrives corrupted.
    transformResponse: [(raw) => raw],
  });

  const disposition = String(headers?.["content-disposition"] ?? "");
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const filename = match?.[1] ?? fallbackName;

  const url = URL.createObjectURL(data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Every section, one sheet each. */
export function exportDashboard(month?: string): Promise<void> {
  return download("/export/xlsx", "buildflow-tableau-de-bord.xlsx", month);
}

/** One section on its own. */
export function exportSection(section: ExportSection, month?: string): Promise<void> {
  return download(
    `/export/${section}/xlsx`,
    `buildflow-${section.toLowerCase().replace(/_/g, "-")}.xlsx`,
    month
  );
}
