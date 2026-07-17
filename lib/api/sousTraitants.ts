import apiClient from "./client";

export type SousTraitantStatut = "ACTIF" | "INACTIF" | "BLACKLISTE";

export interface SousTraitantDTO {
    id: string;
    code: string;
    raisonSociale: string;
    ice: string;
    specialite: string;
    contact: string;
    telephone: string;
    email: string;
    ville: string;
    adresse: string;
    statut: SousTraitantStatut;
    nombreContratsActifs: number;
    montantTotalPaye: number;
}

/** Shape sent when creating a sous-traitant (POST /api/v1/sous-traitants). */
export interface CreateSousTraitantDTO {
    code: string;
    raisonSociale: string;
    ice: string;
    specialite: string;
    contact?: string;
    telephone?: string;
    email?: string;
    ville?: string;
    adresse?: string;
    statut?: SousTraitantStatut;
}

/**
 * Fetch all sous-traitants (master data), used to populate the
 * "sous-traitant" dropdown when creating a contract.
 * GET /api/v1/sous-traitants
 */
export async function fetchSousTraitants(): Promise<SousTraitantDTO[]> {
    const { data } = await apiClient.get<SousTraitantDTO[]>("/sous-traitants");
    return data ?? [];
}

/**
 * Create a new sous-traitant (master data).
 * POST /api/v1/sous-traitants
 */
export async function createSousTraitant(payload: CreateSousTraitantDTO): Promise<SousTraitantDTO> {
    const { data } = await apiClient.post<SousTraitantDTO>("/sous-traitants", payload);
    return data;
}