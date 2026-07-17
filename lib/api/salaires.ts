import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Backend DTO shape returned by GET /api/v1/salaires and GET /api/v1/salaires/{id}
// ─────────────────────────────────────────────────────────────────────────────

export interface SalarieDTO {
  id: string;
  reference: string;
  employeId: string;
  chantierId?: string;
  periode: string;
  joursTravailles?: number;
  salaireBase: number;
  heuresSupplementaires?: number;
  montantHeuresSupp?: number;
  primeTransport?: number;
  primePanier?: number;
  autresPrimes?: number;
  avance?: number;
  deductionsCnss?: number;
  deductionsIr?: number;
  netAPayer: number; // computed server-side
  // Additional fields that might be present in the response
  employe?: {
    id: string;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    departement: string;
    dateEmbauche: string;
    rib: string;
    banque: string;
  };
  chantier?: {
    id: string;
    nom: string;
  };
  lignes?: Array<{
    libelle: string;
    montant: number;
    type: "GAIN" | "RETENUE";
  }>;
  totalGains?: number;
  totalRetenues?: number;
  salaireNet?: number;
  statut: "BROUILLON" | "VALIDE" | "PAYEE"; // from API: BROUILLON → VALIDEE → PAYEE
  datePaiement?: string;
  referenceVirement?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Shape sent when creating a new salaire (POST /api/v1/salaires). */
export interface CreateSalarieDTO {
  reference: string;
  employeId: string;
  chantierId?: string;
  periode: string;
  joursTravailles?: number;
  salaireBase: number;
  heuresSupplementaires?: number;
  montantHeuresSupp?: number;
  primeTransport?: number;
  primePanier?: number;
  autresPrimes?: number;
  avance?: number;
  deductionsCnss?: number;
  deductionsIr?: number;
}

/** Paginated wrapper returned by GET /api/v1/salaires (Spring Boot Page<T>). */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // current page (0-based)
  size: number;
  first: boolean;
  last: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch list of salaires (payslips).
 * GET /api/v1/salaires
 */
export async function fetchSalaires(periode?: string): Promise<SalarieDTO[]> {
  const { data } = await apiClient.get<unknown>("/salaires", {
    params: periode ? { periode } : {},
  });
  return toArrayPayload<SalarieDTO>(data);
}

/**
 * Fetch a single salaire by ID.
 * GET /api/v1/salaires/{id}
 */
export async function fetchSalarieById(id: string): Promise<SalarieDTO> {
  const { data } = await apiClient.get<unknown>(`/salaires/${id}`);
  return unwrapApiPayload<SalarieDTO>(data);
}

/**
 * Create a new salaire (payslip).
 * POST /api/v1/salaires
 */
export async function createSalarie(
  payload: CreateSalarieDTO
): Promise<SalarieDTO> {
  const { data } = await apiClient.post<unknown>("/salaires", payload);
  return unwrapApiPayload<SalarieDTO>(data);
}

/**
 * Validate a salaire (HR step).
 * PATCH /api/v1/salaires/{id}/valider
 */
export async function validerSalarie(id: string): Promise<SalarieDTO> {
  const { data } = await apiClient.patch<unknown>(`/salaires/${id}/valider`);
  return unwrapApiPayload<SalarieDTO>(data);
}

/**
 * Pay a salaire (Finance step).
 * PATCH /api/v1/salaires/{id}/payer
 */
export async function payerSalarie(id: string): Promise<SalarieDTO> {
  const { data } = await apiClient.patch<unknown>(`/salaires/${id}/payer`);
  return unwrapApiPayload<SalarieDTO>(data);
}