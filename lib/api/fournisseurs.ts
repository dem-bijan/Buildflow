import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

export interface FournisseurDTO {
  id: string;
  code: string;
  raisonSociale: string;
  ice: string;
  contact: string;
  telephone: string;
  email: string;
  ville: string;
  adresse: string;
  rib: string;
  banque: string;
  statut: "ACTIF" | "INACTIF" | "BLACKLISTE";
  categorieArticles: string[];
  totalAchatsAnnee?: number;
  soldeImpaye?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFournisseurDTO {
  code: string;
  raisonSociale: string;
  ice: string;
  contact: string;
  telephone: string;
  email: string;
  ville: string;
  adresse: string;
  rib: string;
  banque: string;
  statut: "ACTIF" | "INACTIF" | "BLACKLISTE";
  categorieArticles: string[];
}

export async function fetchFournisseurs(): Promise<FournisseurDTO[]> {
  const { data } = await apiClient.get<unknown>('/fournisseurs');
  return toArrayPayload<FournisseurDTO>(data);
}

/**
 * Fetch a single fournisseur by ID.
 * GET /api/v1/fournisseurs/{id}
 */
export async function fetchFournisseurById(id: string): Promise<FournisseurDTO> {
  const { data } = await apiClient.get<unknown>(`/fournisseurs/${id}`);
  return unwrapApiPayload<FournisseurDTO>(data);
}

/**
 * Create a new fournisseur.
 * POST /api/v1/fournisseurs
 */
export async function createFournisseur(payload: CreateFournisseurDTO): Promise<FournisseurDTO> {
  const { data } = await apiClient.post<unknown>("/fournisseurs", payload);
  return unwrapApiPayload<FournisseurDTO>(data);
}

/**
 * Update an existing fournisseur.
 * PUT /api/v1/fournisseurs/{id}
 */
export async function updateFournisseur(id: string, payload: CreateFournisseurDTO): Promise<FournisseurDTO> {
  const { data } = await apiClient.put<unknown>(`/fournisseurs/${id}`, payload);
  return unwrapApiPayload<FournisseurDTO>(data);
}

/**
 * Delete a fournisseur.
 * DELETE /api/v1/fournisseurs/{id}
 */
export async function deleteFournisseur(id: string): Promise<void> {
  await apiClient.delete(`/fournisseurs/${id}`);
}
