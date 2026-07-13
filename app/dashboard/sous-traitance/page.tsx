// Server Component – no "use client"
import { getContratsST } from "@/lib/data/sousTraitance";
import SousTraitanceClient from "./SousTraitanceClient";

export default async function SousTraitancePage() {
  const contrats = await getContratsST();
  return <SousTraitanceClient contrats={contrats} />;
}