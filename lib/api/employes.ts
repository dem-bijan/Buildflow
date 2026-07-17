import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Backend DTO shape returned by GET /api/v1/employes and GET /api/v1/employes/{id}
// ─────────────────────────────────────────────────────────────────────────────

export interface EmployeDTO {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  role: string; // In backend: ADMIN, RH, FINANCE, PM, ACHAT, CONDUCTEUR_TRAVAUX, CHEF_EQUIPE, OUVRIER
  poste: string;
  departement: string;
  telephone: string;
  email: string;
  dateEmbauche: string; // ISO date string
  chantierActuelId?: string;
  chantierActuelNom?: string;
  statut: "ACTIF" | "INACTIF"; // From backend: ACTIF, INACTIF
  salaireBrut: number;
  typeContrat: "CDI" | "CDD" | "ANAPEC" | "JOURNALIER";
  createdAt?: string;
  updatedAt?: string;
}

/** Shape sent when creating / updating an employe (POST /api/v1/employes). */
export interface CreateEmployeDTO {
  matricule: string;
  nom: string;
  prenom: string;
  role: string;
  poste: string;
  departement: string;
  telephone: string;
  email: string;
  dateEmbauche: string;
  chantierActuelId?: string;
  statut: "ACTIF" | "INACTIF";
  salaireBrut: number;
  typeContrat: "CDI" | "CDD" | "ANAPEC" | "JOURNALIER";
}

/** Paginated wrapper returned by GET /api/v1/employes (Spring Boot Page<T>). */
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
 * Fetch list of employes.
 * GET /api/v1/employes
 */
export async function fetchEmployes(): Promise<EmployeDTO[]> {
  const { data } = await apiClient.get<unknown>("/employes");
  return toArrayPayload<EmployeDTO>(data);
}

/**
 * Fetch a single employe by ID.
 * GET /api/v1/employes/{id}
 */
export async function fetchEmployeById(id: string): Promise<EmployeDTO> {
  const { data } = await apiClient.get<unknown>(`/employes/${id}`);
  return unwrapApiPayload<EmployeDTO>(data);
}

/**
 * Create a new employe.
 * POST /api/v1/employes
 */
export async function createEmploye(
  payload: CreateEmployeDTO
): Promise<EmployeDTO> {
  const { data } = await apiClient.post<unknown>("/employes", payload);
  return unwrapApiPayload<EmployeDTO>(data);
}