import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Backend DTO shapes — matched exactly to CaisseResponse and
// CaisseTransactionResponse. No fictional fields (no "categorie", "tiers",
// "saisiePar", "devise", "type" on Caisse — the backend doesn't have these).
// ─────────────────────────────────────────────────────────────────────────────

export type TypeTransaction = "CREDIT" | "DEBIT";

export interface Transaction {
  id: string;
  typeTransaction: TypeTransaction;
  montant: number;
  motif: string;
  referenceDocument?: string;
  createdAt: string;
  caisseId: string;
  caisseLibelle: string;
}

export interface Caisse {
  id: string;
  code: string;
  libelle: string;
  chantierId: string;
  chantierNom: string;
  solde: number;
  seuilMinimum: number;
  enAlerte: boolean;
}

export interface CaisseTransactionDTO {
  id: string;
  typeTransaction: TypeTransaction;
  montant: number;
  motif: string;
  referenceDocument?: string;
  createdAt: string;
}

export interface CaisseDTO {
  id: string;
  code: string;
  libelle: string;
  chantierId: string;
  chantierNom: string;
  solde: number;
  seuilMinimum: number;
  enAlerte: boolean;
  dernieresTransactions: CaisseTransactionDTO[];
}

export interface CreateCaisseDTO {
  code: string;
  libelle: string;
  chantierId: string;
  seuilMinimum: number;
}

export interface CreateTransactionDTO {
  typeTransaction: TypeTransaction;
  montant: number;
  motif: string;
  referenceDocument?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all caisses. Each includes chantier info and its most recent
 * transactions embedded (dernieresTransactions).
 * GET /api/v1/caisses
 */
export async function fetchCaisses(): Promise<CaisseDTO[]> {
  const { data } = await apiClient.get("/caisses");
  return toArrayPayload<CaisseDTO>(data);
}

/**
 * Fetch a single caisse by ID (includes its transactions).
 * GET /api/v1/caisses/{id}
 */
export async function fetchCaisseById(id: string): Promise<CaisseDTO> {
  const { data } = await apiClient.get(`/caisses/${id}`);
  return unwrapApiPayload<CaisseDTO>(data);
}

/**
 * Fetch full transaction history for a caisse (separate from the
 * "dernieresTransactions" preview embedded on the caisse itself).
 * GET /api/v1/caisses/{id}/transactions
 */
export async function fetchTransactions(caisseId: string): Promise<CaisseTransactionDTO[]> {
  const { data } = await apiClient.get(`/caisses/${caisseId}/transactions`);
  return toArrayPayload<CaisseTransactionDTO>(data);
}

/**
 * Create a new caisse.
 * POST /api/v1/caisses
 */
export async function createCaisse(payload: CreateCaisseDTO): Promise<CaisseDTO> {
  const { data } = await apiClient.post("/caisses", payload);
  return unwrapApiPayload<CaisseDTO>(data);
}

/**
 * Create a credit or debit transaction on a caisse.
 * POST /api/v1/caisses/{id}/transactions
 */
export async function createTransaction(
  caisseId: string,
  payload: CreateTransactionDTO
): Promise<CaisseTransactionDTO> {
  const { data } = await apiClient.post(`/caisses/${caisseId}/transactions`, payload);
  return unwrapApiPayload<CaisseTransactionDTO>(data);
}