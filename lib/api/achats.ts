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
  ref: string;
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