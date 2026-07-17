"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchContratsSousTraitant } from "@/lib/api/sousTraitance";
import SousTraitanceClient from "./SousTraitanceClient";
import type { ContratSousTraitantDTO } from "@/lib/api/sousTraitance";

export default function SousTraitancePage() {
  const [contrats, setContrats] = useState<ContratSousTraitantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContratsSousTraitant();

      // Normalize at the fetch boundary — never let a null numeric field
      // crash a downstream sum/reduce in the hydration config.
      const mapped: ContratSousTraitantDTO[] = (data ?? []).map((c) => ({
        ...c,
        montantHt: c.montantHt ?? 0,
        tva: c.tva ?? 0,
        montantTtc: c.montantTtc ?? 0,
        montantPaye: c.montantPaye ?? 0,
        resteAPayer: c.resteAPayer ?? 0,
      }));

      setContrats(mapped);
    } catch {
      const msg = "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && contrats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
        </div>
        <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
          Chargement…
        </p>
      </div>
    );
  }

  if (error && contrats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-content-primary dark:text-content-primary-dark">Connexion impossible</p>
          <p className="text-sm text-content-muted dark:text-content-muted-dark max-w-md">{error}</p>
        </div>
        <button onClick={() => load()} className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors">
          Réessayer
        </button>
      </div>
    );
  }

  return <SousTraitanceClient contrats={contrats} onRefresh={load} refreshing={loading} />;
}