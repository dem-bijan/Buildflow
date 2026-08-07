import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";
import type { Achat } from "@/components/functions2";

export interface CreateLigneAchatDTO {
  articleId: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  bpuLigneId?: string;
}

export interface CreateAchatDTO {
  fournisseurId: string;
  chantierId: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  lignes: CreateLigneAchatDTO[];
  /** "L'achat a-t-il réellement servi au chantier ?" — defaults to false server-side. */
  impactAnalytiqueChantier?: boolean;
  /** "Y a-t-il une facture officielle à déclarer ?" — defaults to false server-side. */
  impactComptableFiscal?: boolean;
}

/** Partial update: omit a field to leave it untouched. */
export interface UpdateIndicateursDTO {
  impactAnalytiqueChantier?: boolean;
  impactComptableFiscal?: boolean;
}

export async function fetchAchats(): Promise<Achat[]> {
  const { data } = await apiClient.get<unknown>("/achats");
  return toArrayPayload<Achat>(data);
}

export async function createAchat(
  payload: CreateAchatDTO
): Promise<Achat> {
  const { data } = await apiClient.post<unknown>("/achats", payload);
  return unwrapApiPayload<Achat>(data);
}

/**
 * Toggle the operational billing indicators on an existing achat.
 * PATCH /api/v1/achats/{id}/indicateurs
 */
export async function updateAchatIndicateurs(
  id: string,
  payload: UpdateIndicateursDTO
): Promise<Achat> {
  const { data } = await apiClient.patch<unknown>(`/achats/${id}/indicateurs`, payload);
  return unwrapApiPayload<Achat>(data);
}

/**
 * Change the unit price of one order line. The server recomputes the line
 * total and the order's HT/TVA/TTC and returns the whole updated order.
 *
 * Allowed at any statut; once the order is invoiced or paid the server sends
 * back a `warning` explaining what is now out of step downstream.
 * PATCH /api/v1/achats/{achatId}/lignes/{ligneId}/prix
 */
export async function updateLignePrix(
  achatId: string,
  ligneId: string,
  prixUnitaire: number
): Promise<{ achat: Achat; warning: string | null }> {
  // The response interceptor unwraps `data`, discarding the envelope's
  // `message` — read it off the raw body before that happens.
  const { data } = await apiClient.patch<unknown>(
    `/achats/${achatId}/lignes/${ligneId}/prix`,
    { prixUnitaire },
    { transformResponse: [(raw) => raw] }
  );

  const body = typeof data === "string" ? JSON.parse(data) : data;
  return {
    achat: unwrapApiPayload<Achat>(body),
    warning: (body as { message?: string | null })?.message ?? null,
  };
}