// Server Component – no "use client"
import { getPaiements } from "@/lib/data/payments";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const paiements = await getPaiements();
  return <PaymentsClient paiements={paiements} />;
}