import apiClient from "./client";

export type ChantierStatut = "EN_PREPARATION" | "EN_COURS" | "EN_PAUSE" | "TERMINE" | "ANNULE";

export interface JalonDTO {
    id: string;
    libelle: string;
    datePrevue: string;
    dateReelle?: string;
    statut: "A_FAIRE" | "EN_COURS" | "TERMINE" | "EN_RETARD";
}

export interface ChantierDTO {
    id: string;
    code: string;
    nom: string;
    client: string;
    adresse: string;
    ville: string;
    statut: ChantierStatut;
    dateDebut: string;
    dateFin: string;
    budgetHt: number;
    depensesHt: number;
    avancement: number;
    chefProjetNom: string;
    nombreOuvriers: number;
    soustraitantsActifs: string[];
    jalons: JalonDTO[];
}

/**
 * Fetch all chantiers (master data), used to populate the
 * "chantier" dropdown when creating a contract.
 * GET /api/v1/chantiers
 */
export async function fetchChantiers(): Promise<ChantierDTO[]> {
    const { data } = await apiClient.get<ChantierDTO[]>("/chantiers");
    return data ?? [];
}