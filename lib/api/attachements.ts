import apiClient from "./client";

export type AttachementStatut = "SOUMIS" | "ENCAISSE";

export interface AttachementLigneDTO {
  id: string;
  bpuLigneId: string;
  bpuLigneRef: string;
  bpuLigneDesignation: string;
  ancienCumul: number;
  nouveauCumul: number;
  puHt: number;
  montantHt: number;
}

export interface AttachementDTO {
  id: string;
  chantierId: string;
  chantierNom: string;
  reference: string;
  dateAttachement: string;
  montantHt: number;
  tva: number;
  montantTtc: number;
  statut: AttachementStatut;
  dateEncaissement: string | null;
  lignes: AttachementLigneDTO[];
}

export interface CreateAttachementLigneDTO {
  bpuLigneId: string;
  nouveauCumul: number;
}

export interface CreateAttachementDTO {
  reference: string;
  dateAttachement: string;
  lignes: CreateAttachementLigneDTO[];
}

/** GET /api/v1/chantiers/{chantierId}/attachements */
export async function fetchAttachements(chantierId: string): Promise<AttachementDTO[]> {
  const { data } = await apiClient.get<AttachementDTO[]>(`/chantiers/${chantierId}/attachements`);
  return data ?? [];
}

/** POST /api/v1/chantiers/{chantierId}/attachements */
export async function createAttachement(
  chantierId: string,
  payload: CreateAttachementDTO
): Promise<AttachementDTO> {
  const { data } = await apiClient.post<AttachementDTO>(`/chantiers/${chantierId}/attachements`, payload);
  return data;
}

/** PATCH /api/v1/attachements/{id}/encaisser */
export async function encaisserAttachement(id: string): Promise<AttachementDTO> {
  const { data } = await apiClient.patch<AttachementDTO>(`/attachements/${id}/encaisser`);
  return data;
}
