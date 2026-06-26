import fs from "fs";
import path from "path";

const sections = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Achats", href: "/dashboard/achats" },
  { title: "Gestion des Stocks", href: "/dashboard/stocks" },
  { title: "Suivi Chantiers", href: "/dashboard/suivi-chantiers" },
  { title: "Tresorerie et Caisse", href: "/dashboard/tresorerie" },
  { title: "Sous Traitance", href: "/dashboard/sous-traitance" },
  { title: "Salaires", href: "/dashboard/salaires" },
  { title: "Affectation (Projets)", href: "/dashboard/affectation" },
  { title: "Catalogue Articles", href: "/dashboard/catalogue" },
  { title: "Fournisseurs", href: "/dashboard/fournisseurs" },
  { title: "Annuaire", href: "/dashboard/annuaire" },
  { title: "Comptabilite", href: "/dashboard/payments" },
];

// Root of your Next.js project — adjust if needed
const APP_DIR = path.resolve("./app");

function toComponentName(title) {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, "")   // strip special chars
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function pageContent(title, componentName) {
  return `export default function ${componentName}Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">${title}</h1>
      <p className="text-muted-foreground mt-2">
        Bienvenue sur la page <strong>${title}</strong>.
      </p>
    </div>
  );
}
`;
}

let created = 0;
let skipped = 0;

for (const section of sections) {
  const relativePath = section.href.startsWith("/")
    ? section.href.slice(1)
    : section.href;

  const dir = path.join(APP_DIR, relativePath);
  const file = path.join(dir, "page.tsx");

  if (fs.existsSync(file)) {
    console.log(`⏭  skipped  ${file}`);
    skipped++;
    continue;
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, pageContent(section.title, toComponentName(section.title)));
  console.log(`✅ created  ${file}`);
  created++;
}

console.log(`\nDone — ${created} created, ${skipped} skipped.`);
