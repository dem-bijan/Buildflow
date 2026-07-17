import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";
import type { Achat } from "@/components/functions2";

export interface CreateLigneAchatDTO {
  articleId: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export interface CreateAchatDTO {
  ref: string;
  fournisseurId: string;
  chantierId: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  lignes: CreateLigneAchatDTO[];
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