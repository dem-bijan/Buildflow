// Server Component – no "use client"
import { getTransactions, getCaisses } from "@/lib/data/tresorerie";
import TresorerieClient from "./TresorerieClient";

export default async function TresoreriePage() {
  const [transactions, caisses] = await Promise.all([
    getTransactions(),
    getCaisses(),
  ]);
  return <TresorerieClient transactions={transactions} caisses={caisses} />;
}