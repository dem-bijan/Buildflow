import apiClient, { toArrayPayload, unwrapApiPayload } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Backend DTO shape returned by GET /api/v1/articles and GET /api/v1/articles/{id}
// ─────────────────────────────────────────────────────────────────────────────

export interface ArticleDTO {
  id: string;
  code: string;
  designation: string;
  description?: string;
  categorieId: string;
  categorieLibelle?: string;
  unite: string;
  prixAchatRef: number;
  tvaRate: number;
  actif?: boolean;
  fournisseursPreferentiels: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface ArticleForm {
  code: string;
  designation: string;
  description?: string;

  // The user types the category name
  categorie: string;

  unite: string;
  prixAchatRef: number;
  tvaRate: number;
  fournisseursPreferentiels: string[];
}
/** Shape sent when creating / updating an article (POST /api/v1/articles). */
export interface CreateArticleDTO {
  code: string;
  designation: string;
  description?: string;
  categorieId: string;
  unite: string;
  prixAchatRef: number;
  tvaRate: number;
  fournisseursPreferentiels: string[];
}

/** Paginated wrapper returned by GET /api/v1/articles (Spring Boot Page<T>). */
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
 * Fetch a paginated list of articles.
 * GET /api/v1/articles?page=0&size=20&sort=designation,asc
 */
export async function fetchArticles(
  page = 0,
  size = 50,
  sort = "designation,asc"
): Promise<PagedResponse<ArticleDTO>> {
  const { data } = await apiClient.get<unknown>("/articles", {
    params: { page, size, sort },
  });
  const payload = unwrapApiPayload<PagedResponse<ArticleDTO> | { content?: ArticleDTO[] }>(data);
  const maybePage = payload as Partial<PagedResponse<ArticleDTO>> | null;
  return {
    content: Array.isArray(maybePage?.content) ? maybePage.content : toArrayPayload<ArticleDTO>(payload),
    totalElements: maybePage?.totalElements ?? 0,
    totalPages: maybePage?.totalPages ?? 0,
    number: maybePage?.number ?? 0,
    size: maybePage?.size ?? 0,
    first: maybePage?.first ?? true,
    last: maybePage?.last ?? true,
  };
}

/**
 * Fetch a single article by ID.
 * GET /api/v1/articles/{id}
 */
export async function fetchArticleById(id: string): Promise<ArticleDTO> {
  const { data } = await apiClient.get<unknown>(`/articles/${id}`);
  return unwrapApiPayload<ArticleDTO>(data);
}

/**
 * Create a new article.
 * POST /api/v1/articles
 */
export async function createArticle(
  payload: CreateArticleDTO
): Promise<ArticleDTO> {
  const { data } = await apiClient.post<unknown>("/articles", payload);
  return unwrapApiPayload<ArticleDTO>(data);
}
