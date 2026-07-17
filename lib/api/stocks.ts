import apiClient, { toArrayPayload } from "./client";

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
