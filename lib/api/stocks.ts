import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

export type TypeMouvement = "ENTREE" | "SORTIE" | "AJUSTEMENT";

export interface CreateMouvementStockDTO {
  articleId: string;
  chantierId: string;
  typeMouvement: TypeMouvement;
  quantite: number;
  documentRef?: string;
}

export interface StockArticleDTO {
  id: string;
  articleCode: string;
  designation: string;
  unite: string;
  chantierId: string;
  chantierNom: string;
  quantiteTheorique: number;
  seuilAlerte: number;
  enAlerte: boolean;
}

/**
 * GET /api/v1/stocks/chantiers/{chantierId}
 * Backend only exposes stock levels scoped to a single chantier (paginated).
 */
export async function fetchStocksByChantier(
  chantierId: string,
  page = 0,
  size = 100,
  sort = "article.designation"
): Promise<StockArticleDTO[]> {
  const { data } = await apiClient.get<unknown>(`/stocks/chantiers/${chantierId}`, {
    params: { page, size, sort },
  });
  return toArrayPayload<StockArticleDTO>(data);
}

/**
 * Create a manual stock movement (entrée/sortie/ajustement).
 * POST /api/v1/stocks/mouvements
 */
export async function createMouvementStock(payload: CreateMouvementStockDTO): Promise<StockArticleDTO> {
  const { data } = await apiClient.post<unknown>("/stocks/mouvements", payload);
  return unwrapApiPayload<StockArticleDTO>(data);
}
