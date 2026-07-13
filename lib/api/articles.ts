import apiClient from "./client";

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
  const { data } = await apiClient.get<PagedResponse<ArticleDTO>>("/articles", {
    params: { page, size, sort },
  });
  return data;
}

/**
 * Fetch a single article by ID.
 * GET /api/v1/articles/{id}
 */
export async function fetchArticleById(id: string): Promise<ArticleDTO> {
  const { data } = await apiClient.get<ArticleDTO>(`/articles/${id}`);
  return data;
}

/**
 * Create a new article.
 * POST /api/v1/articles
 */
export async function createArticle(
  payload: CreateArticleDTO
): Promise<ArticleDTO> {
  const { data } = await apiClient.post<ArticleDTO>("/articles", payload);
  return data;
}
