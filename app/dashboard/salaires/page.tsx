// Server Component – no "use client"
import { getFichesPaie } from "@/lib/data/salaires";
import SalairesClient from "./SalairesClient";

export default async function SalairesPage() {
  const fiches = await getFichesPaie("2025-06");
  return <SalairesClient fiches={fiches} />;
}
