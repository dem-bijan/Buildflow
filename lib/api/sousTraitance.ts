import type { ModePaiement } from "@/components/ModePaiementDialog";
import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Backend DTO shapes — matched exactly to ContratSousTraitantResponse and
// PaiementSousTraitantResponse (Java records, no pagination, no nested payments).
// ─────────────────────────────────────────────────────────────────────────────

export type ContratStatut = "EN_COURS" | "TERMINE" | "RESILIE";
export type PaiementStatut = "EN_ATTENTE" | "VALIDE" | "PAYE" | "EN_RETARD" | "PARTIELLEMENT_PAYE";
export type DossierStatut = "COMPLET" | "INCOMPLET";

export interface ContratSousTraitantDTO {
  id: string;
  reference: string;
  sousTraitantId: string;
  sousTraitantRaisonSociale: string;
  chantierId: string;
  chantierNom: string;
  objet: string;
  montantHt: number;
  tva: number;
  montantTtc: number;
  montantPaye: number;
  resteAPayer: number;
  dateDebut: string; // ISO date
  dateFin: string;   // ISO date
  statut: ContratStatut;
  avanceDemandeeHt: number;
  retenueGarantieHt: number;
  montantRealiseHt: number;
  dossierStatut: DossierStatut;
  bpuLigneRef?: string;
}

export interface PaiementSousTraitantDTO {
  id: string;
  reference: string;
  montant: number;
  motif: string;
  statut: PaiementStatut;
  datePaiement: string | null; // null until actually paid
  modePaiement?: ModePaiement | null; // null until actually paid
}

export interface CreateContratSousTraitantDTO {
  sousTraitantId: string;
  chantierId: string;
  objet: string;
  montantHt: number;
  dateDebut: string;
  dateFin: string;
  bpuLigneId?: string;
}

export interface CreatePaiementDTO {
  montant: number;
  motif: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls — every path is relative to apiClient's baseURL ("/api"), which
// the Next.js proxy forwards to the backend's "/api/v1/..." routes. NEVER
// add a "/v1" prefix here — the proxy already does that.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all sous-traitant contracts. NOT paginated — the backend returns a
 * plain list wrapped in ApiResponse. Optional chantierId filters server-side.
 * GET /api/v1/contrats-sous-traitant?chantierId=uuid
 */
export async function fetchContratsSousTraitant(
  chantierId?: string
): Promise<ContratSousTraitantDTO[]> {
  const params = chantierId ? { chantierId } : undefined;
  const { data } = await apiClient.get<unknown>(
    "/contrats-sous-traitant",
    { params }
  );
  return toArrayPayload<ContratSousTraitantDTO>(data);
}

/**
 * Fetch a single sous-traitant contract by ID.
 * GET /api/v1/contrats-sous-traitant/{id}
 */
export async function fetchContratSousTraitantById(
  id: string
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.get<unknown>(
    `/contrats-sous-traitant/${id}`
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Fetch payments for a specific contract — NOT bundled with the contract
 * itself, this is a separate call per the backend's nested route.
 * GET /api/v1/contrats-sous-traitant/{contratId}/paiements
 */
export async function fetchPaiements(
  contratId: string
): Promise<PaiementSousTraitantDTO[]> {
  const { data } = await apiClient.get<unknown>(
    `/contrats-sous-traitant/${contratId}/paiements`
  );
  return toArrayPayload<PaiementSousTraitantDTO>(data);
}

/**
 * Create a new sous-traitant contract.
 * POST /api/v1/contrats-sous-traitant
 */
export async function createContratSousTraitant(
  payload: CreateContratSousTraitantDTO
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.post<unknown>(
    "/contrats-sous-traitant",
    payload
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Create a payment for a contract.
 * POST /api/v1/contrats-sous-traitant/{contratId}/paiements
 */
export async function createPaiement(
  contratId: string,
  payload: CreatePaiementDTO
): Promise<PaiementSousTraitantDTO> {
  const { data } = await apiClient.post<unknown>(
    `/contrats-sous-traitant/${contratId}/paiements`,
    payload
  );
  return unwrapApiPayload<PaiementSousTraitantDTO>(data);
}

/**
 * Terminate a sous-traitant contract.
 * PATCH /api/v1/contrats-sous-traitant/{id}/terminer
 */
export async function terminerContratSousTraitant(
  id: string
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/${id}/terminer`
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Field ops (PM): record a cash advance request against the contract.
 * PATCH /api/v1/contrats-sous-traitant/{id}/avance
 */
export async function demanderAvance(
  id: string,
  avanceDemandeeHt: number
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/${id}/avance`,
    { avanceDemandeeHt }
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Field ops (PM): validate the amount of work actually completed.
 * PATCH /api/v1/contrats-sous-traitant/{id}/travaux
 */
export async function validerTravaux(
  id: string,
  montantRealiseHt: number
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/${id}/travaux`,
    { montantRealiseHt }
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Finance: set the guarantee retention and dossier completeness status.
 * PATCH /api/v1/contrats-sous-traitant/{id}/retenue
 */
export async function ajusterRetenue(
  id: string,
  retenueGarantieHt: number,
  dossierStatut: DossierStatut
): Promise<ContratSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/${id}/retenue`,
    { retenueGarantieHt, dossierStatut }
  );
  return unwrapApiPayload<ContratSousTraitantDTO>(data);
}

/**
 * Approve (valider) a pending payment.
 * PATCH /api/v1/contrats-sous-traitant/paiements/{id}/valider
 */
export async function validerPaiement(
  id: string
): Promise<PaiementSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/paiements/${id}/valider`
  );
  return unwrapApiPayload<PaiementSousTraitantDTO>(data);
}

/**
 * Pay a validated payment with an explicit mode. Only CAISSE debits the
 * chantier's caisse; a virement, cheque or effet clears through the bank.
 * PATCH /api/v1/contrats-sous-traitant/paiements/{id}/payer
 */
export async function payerPaiement(
  id: string,
  modePaiement: ModePaiement
): Promise<PaiementSousTraitantDTO> {
  const { data } = await apiClient.patch<unknown>(
    `/contrats-sous-traitant/paiements/${id}/payer`,
    null,
    { params: { modePaiement } }
  );
  return unwrapApiPayload<PaiementSousTraitantDTO>(data);
}