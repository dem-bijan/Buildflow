import apiClient, { unwrapApiPayload } from "./client";

export interface CategorieArticleDTO {
    id: string;
    code: string;
    libelle: string;
    parentId: string | null;
}

export interface CreateCategorieArticleDTO {
    code: string;
    libelle: string;
    parentId: string | null;
}

export interface CategoriesPage {
    content: CategorieArticleDTO[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export async function fetchCategoriesArticles() {
    const { data } = await apiClient.get("/categories-articles?page=0&size=100");

    return unwrapApiPayload<CategoriesPage>(data);
}

export async function createCategorieArticle(
    payload: CreateCategorieArticleDTO
): Promise<CategorieArticleDTO> {
    const { data } = await apiClient.post(
        "/categories-articles",
        payload
    );

    return unwrapApiPayload<CategorieArticleDTO>(data);
}