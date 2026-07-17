import apiClient, { toArrayPayload } from "./client";
import type { EcritureComptable } from "@/components/functions2";

export async function fetchEcritures(): Promise<EcritureComptable[]> {
    const { data } = await apiClient.get<unknown>(
        "/comptabilite/ecritures"
    );

    return toArrayPayload<EcritureComptable>(data);
}