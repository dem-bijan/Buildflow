import apiClient from "./client";

export interface BpuLigneDTO {
  id: string;
  ref: string;
  designation: string;
  unite: string;
  qtePrevue: number;
  puHt: number;
  budgetPrevuHt: number;
  montantEngageHt: number;
  tauxConsommation: number;
  alerteDepassement: boolean;
}

export interface CreateBpuLigneDTO {
  ref: string;
  designation: string;
  unite: string;
  qtePrevue: number;
  puHt: number;
}

/** GET /api/v1/chantiers/{chantierId}/bpu-lignes */
export async function fetchBpuLignes(chantierId: string): Promise<BpuLigneDTO[]> {
  const { data } = await apiClient.get<BpuLigneDTO[]>(`/chantiers/${chantierId}/bpu-lignes`);
  return data ?? [];
}

/** POST /api/v1/chantiers/{chantierId}/bpu-lignes */
export async function createBpuLigne(
  chantierId: string,
  payload: CreateBpuLigneDTO
): Promise<BpuLigneDTO> {
  const { data } = await apiClient.post<BpuLigneDTO>(`/chantiers/${chantierId}/bpu-lignes`, payload);
  return data;
}

/** PUT /api/v1/chantiers/{chantierId}/bpu-lignes/{id} */
export async function updateBpuLigne(
  chantierId: string,
  ligneId: string,
  payload: CreateBpuLigneDTO
): Promise<BpuLigneDTO> {
  const { data } = await apiClient.put<BpuLigneDTO>(
    `/chantiers/${chantierId}/bpu-lignes/${ligneId}`,
    payload
  );
  return data;
}

/** DELETE /api/v1/chantiers/{chantierId}/bpu-lignes/{id} */
export async function deleteBpuLigne(chantierId: string, ligneId: string): Promise<void> {
  await apiClient.delete(`/chantiers/${chantierId}/bpu-lignes/${ligneId}`);
}

/** POST /api/v1/chantiers/{chantierId}/bpu-lignes/import (multipart) */
export async function importBpuExcel(chantierId: string, file: File): Promise<BpuLigneDTO[]> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<BpuLigneDTO[]>(
    `/chantiers/${chantierId}/bpu-lignes/import`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data ?? [];
}
