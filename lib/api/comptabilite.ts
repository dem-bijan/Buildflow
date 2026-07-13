import apiClient from "./client";
import type { EcritureComptable } from "@/components/functions2";

interface ApiResponse<T> {
    status: string;
    data: T;
    message: string | null;
}

export async function fetchEcritures(): Promise<EcritureComptable[]> {
    const response = await apiClient.get<ApiResponse<EcritureComptable[]>>(
        "/comptabilite/ecritures"
    );

    return response.data.data ?? [];
}