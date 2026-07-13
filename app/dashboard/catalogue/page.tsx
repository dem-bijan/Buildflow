// Server Component – no "use client"
import { getArticles } from "@/lib/data/catalogue";
import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage() {
  const articles = await getArticles();
  return <CatalogueClient articles={articles} />;
}
