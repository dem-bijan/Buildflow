import apiClient, { unwrapApiPayload, toArrayPayload } from "./client";
import type { ModePaiement } from "@/components/ModePaiementDialog";

/** Which document a payment-mode change refers to. */
export type TypeDocumentPaiement = "ACHAT" | "FICHE_PAIE" | "PAIEMENT_SOUS_TRAITANT";

export interface ModePaiementChangeDTO {
  typeDocument: TypeDocumentPaiement;
  documentId: string;
  documentRef: string;
  ancienMode?: ModePaiement | null;
  nouveauMode: ModePaiement;
  /** Set when the change leaves the caisse out of step; null otherwise. */
  avertissement?: string | null;
}

export interface ModePaiementHistoriqueDTO {
  id: string;
  ancienMode?: ModePaiement | null;
  nouveauMode: ModePaiement;
  modifiePar?: string | null;
  dateModification: string;
}

/**
 * Change the payment mode of an already-settled document.
 * PATCH /api/v1/mode-paiement/{typeDocument}/{documentId}
 *
 * The caisse balance is deliberately never adjusted by this call; when the
 * change leaves it out of step the response carries an `avertissement`.
 */
export async function changerModePaiement(
  typeDocument: TypeDocumentPaiement,
  documentId: string,
  modePaiement: ModePaiement
): Promise<ModePaiementChangeDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/mode-paiement/${typeDocument}/${documentId}`,
    { modePaiement }
  );
  return unwrapApiPayload<ModePaiementChangeDTO>(data);
}

/**
 * Audit trail of every mode assignment and change on one document.
 * GET /api/v1/mode-paiement/{typeDocument}/{documentId}/historique
 */
export async function fetchModePaiementHistorique(
  typeDocument: TypeDocumentPaiement,
  documentId: string
): Promise<ModePaiementHistoriqueDTO[]> {
  const { data } = await apiClient.get<unknown>(
    `/mode-paiement/${typeDocument}/${documentId}/historique`
  );
  return toArrayPayload<ModePaiementHistoriqueDTO>(data);
}
