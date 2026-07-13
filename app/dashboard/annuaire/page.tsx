import { getEmployes } from "@/lib/data/annuaire";
import AnnuaireClient from "@/app/dashboard/annuaire/AnnuaireClient";

export default async function AnnuairePage() {
  const employes = await getEmployes();
  return <AnnuaireClient employes={employes} />;
}
