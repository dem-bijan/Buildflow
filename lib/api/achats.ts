import apiClient from "./client";
import type { Achat } from "@/components/functions2";

export async function fetchAchats(): Promise<any> {
  const { data } = await apiClient.get("/achats");
  return data;
}
