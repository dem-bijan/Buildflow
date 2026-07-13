export interface SearchItem {
    title: string;
    href: string;
    keywords: string[];
}



export const SEARCH_INDEX: SearchItem[] = [
    { title: "Dashboard", href: "/dashboard", keywords: ["accueil", "home", "overview"] },
    { title: "Achats", href: "/dashboard/achats", keywords: ["purchases", "commandes", "achat"] },
    { title: "Gestion des Stocks", href: "/dashboard/stocks", keywords: ["inventory", "stock", "warehouse"] },
    { title: "Suivi Chantiers", href: "/dashboard/suivi-chantiers", keywords: ["sites", "projects", "chantier"] },
    { title: "Tresorerie et Caisse", href: "/dashboard/tresorerie", keywords: ["cash", "treasury", "caisse"] },
    { title: "Sous Traitance", href: "/dashboard/sous-traitance", keywords: ["subcontracting", "contractors"] },
    { title: "Salaires", href: "/dashboard/salaires", keywords: ["payroll", "wages", "salary"] },
    { title: "Affectation (Projets)", href: "/dashboard/affectation", keywords: ["assignment", "projects"] },
    { title: "Catalogue Articles", href: "/dashboard/catalogue", keywords: ["catalog", "products", "articles"] },
    { title: "Fournisseurs", href: "/dashboard/fournisseurs", keywords: ["suppliers", "vendors"] },
    { title: "Paiements", href: "/dashboard/payments", keywords: ["payments", "invoices"] },
    { title: "Annuaire", href: "/dashboard/annuaire", keywords: ["directory", "contacts", "employees"] },
    { title: "Comptabilite", href: "/dashboard/comptabilite", keywords: ["accounting", "finance"] },
    { title: "Approbations", href: "/dashboard/approbations", keywords: ["approvals", "pending", "requests"] },
];
