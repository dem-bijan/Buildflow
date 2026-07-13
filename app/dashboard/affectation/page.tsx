// Server Component – no "use client"
import { getAffectations } from "@/lib/data/affectation";
import AffectationClient from "./AffectationClient";

export default async function AffectationPage() {
  const affectations = await getAffectations();
  return <AffectationClient affectations={affectations} />;
}
