export type Role =
    | "ADMIN"
    | "DIRECTEUR"
    | "CHEF_CHANTIER"
    | "MAGASINIER"
    | "RH"
    | "FINANCE"
    | "PM"
    | "ACHAT"
    | "VIEWER";

// Every protected section, mapped to the roles allowed to see it.
// Add a new dashboard page? Add one line here — nothing else to touch.
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
    "/dashboard": ["ADMIN", "DIRECTEUR", "CHEF_CHANTIER", "MAGASINIER", "RH", "FINANCE", "PM", "ACHAT", "VIEWER"], // dashboard home, everyone
    "/dashboard/achats": ["ADMIN", "ACHAT", "PM"],
    "/dashboard/fournisseurs": ["ADMIN", "ACHAT"],
    "/dashboard/catalogue": ["ADMIN", "ACHAT"],
    "/dashboard/stocks": ["ADMIN", "MAGASINIER", "PM", "CHEF_CHANTIER"],
    "/dashboard/suivi-chantiers": ["ADMIN", "DIRECTEUR", "PM", "CHEF_CHANTIER"],
    "/dashboard/tresorerie": ["ADMIN", "FINANCE", "DIRECTEUR", "CHEF_CHANTIER"],
    "/dashboard/sous-traitance": ["ADMIN", "DIRECTEUR", "FINANCE", "CHEF_CHANTIER"],
    "/dashboard/salaires": ["ADMIN", "RH", "FINANCE", "DIRECTEUR"],
    "/dashboard/affectation": ["ADMIN", "PM", "DIRECTEUR", "CHEF_CHANTIER"],
    "/dashboard/annuaire": ["ADMIN", "RH", "DIRECTEUR"],
    "/dashboard/payments": ["ADMIN", "FINANCE"],
    "/dashboard/comptabilite": ["ADMIN", "FINANCE", "DIRECTEUR"],
    "dashboard/approbations": ["ADMIN", "DIRECTEUR", "RH", "PM"]
};

// Returns true if the role is allowed on the given pathname.
// Matches by longest prefix, so /dashboard/fournisseurs/123 inherits
// the rule for /dashboard/fournisseurs.
export function isAllowed(pathname: string, role: Role | undefined): boolean {
    if (!role) return false;

    const matches = Object.keys(ROUTE_PERMISSIONS)
        .filter((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))
        .sort((a, b) => b.length - a.length); // longest/most specific match first

    if (matches.length === 0) return true; // unlisted routes = no restriction
    const allowedRoles = ROUTE_PERMISSIONS[matches[0]];
    return allowedRoles.includes(role);
}