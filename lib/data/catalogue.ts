import type { Article } from "@/components/functions2";

export async function getArticles(): Promise<Article[]> {
  // MOCK data – replace with real DB call later (e.g. prisma.article.findMany())
  return MOCK_ARTICLES;
}

const MOCK_ARTICLES: Article[] = [
  { id: "art-001", code: "CIM-CPJ45", designation: "Ciment CPJ 45 (sac 50kg)", categorieId: "cat-01", categorieLibelle: "Liants", unite: "sac", prixAchatRef: 80, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Ciments du Maroc"] },
  { id: "art-002", code: "CIM-CPJ35", designation: "Ciment CPJ 35 (sac 50kg)", categorieId: "cat-01", categorieLibelle: "Liants", unite: "sac", prixAchatRef: 72, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Ciments du Maroc"] },
  { id: "art-003", code: "GRA-0/25", designation: "Gravier 0/25", categorieId: "cat-02", categorieLibelle: "Granulats", unite: "T", prixAchatRef: 600, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Ciments du Maroc"] },
  { id: "art-004", code: "SAB-0/4", designation: "Sable de rivière 0/4", categorieId: "cat-02", categorieLibelle: "Granulats", unite: "T", prixAchatRef: 280, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Ciments du Maroc"] },
  { id: "art-005", code: "FER-HA12", designation: "Fer à béton HA 12mm", categorieId: "cat-03", categorieLibelle: "Métallurgie", unite: "T", prixAchatRef: 9500, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Acier Atlas"] },
  { id: "art-006", code: "FER-HA16", designation: "Fer à béton HA 16mm", categorieId: "cat-03", categorieLibelle: "Métallurgie", unite: "T", prixAchatRef: 10000, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Acier Atlas"] },
  { id: "art-007", code: "TRE-150", designation: "Treillis soudé ST40 150×150", categorieId: "cat-03", categorieLibelle: "Métallurgie", unite: "m²", prixAchatRef: 85, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Acier Atlas"] },
  { id: "art-008", code: "BOI-CHP-27", designation: "Panneau contreplaqué 27mm", categorieId: "cat-04", categorieLibelle: "Bois & Coffrage", unite: "pce", prixAchatRef: 180, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Bois & Bâti Sarl"] },
  { id: "art-009", code: "CAB-3G25", designation: "Câble 3G2.5mm²", categorieId: "cat-05", categorieLibelle: "Électricité", unite: "ml", prixAchatRef: 18, tvaRate: 20, actif: true, fournisseursPreferentiels: ["ElectroPro Maroc"] },
  { id: "art-010", code: "DIS-63A", designation: "Disjoncteur 63A différentiel", categorieId: "cat-05", categorieLibelle: "Électricité", unite: "pce", prixAchatRef: 725, tvaRate: 20, actif: true, fournisseursPreferentiels: ["ElectroPro Maroc"] },
  { id: "art-011", code: "TUB-PPR-32", designation: "Tube PPR Ø32", categorieId: "cat-06", categorieLibelle: "Plomberie", unite: "ml", prixAchatRef: 28, tvaRate: 20, actif: true, fournisseursPreferentiels: ["Plomberie Générale SA"] },
  { id: "art-012", code: "CAR-60-GRS", designation: "Carrelage grès cérame 60×60 gris", categorieId: "cat-07", categorieLibelle: "Carrelage & Revêtements", unite: "m²", prixAchatRef: 145, tvaRate: 20, actif: false, fournisseursPreferentiels: ["Carrelages Prestige SARL"] },
];
