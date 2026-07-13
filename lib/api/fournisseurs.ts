import apiClient from "./client";

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

/**
 * Fetch all fournisseurs.
 * GET /api/v1/fournisseurs
 */
export async function fetchFournisseurs(): Promise<FournisseurDTO[]> {
  const { data } = await apiClient.get<FournisseurDTO[]>("/fournisseurs");
  // If the backend returns a page object, we extract the content. 
  // We'll handle both arrays and Page<T> just in case.
  if (data && typeof data === 'object' && 'content' in data) {
    return (data as any).content;
  }
  return data;
}

/**
 * Fetch a single fournisseur by ID.
 * GET /api/v1/fournisseurs/{id}
 */
export async function fetchFournisseurById(id: string): Promise<FournisseurDTO> {
  const { data } = await apiClient.get<FournisseurDTO>(`/fournisseurs/${id}`);
  return data;
}

/**
 * Create a new fournisseur.
 * POST /api/v1/fournisseurs
 */
export async function createFournisseur(payload: CreateFournisseurDTO): Promise<FournisseurDTO> {
  const { data } = await apiClient.post<FournisseurDTO>("/fournisseurs", payload);
  return data;
}
