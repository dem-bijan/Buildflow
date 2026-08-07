"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchAttachements,
  createAttachement,
  encaisserAttachement,
} from "@/lib/api/attachements";
import type { AttachementDTO } from "@/lib/api/attachements";
import type { BpuLigneDTO } from "@/lib/api/bpu";
import { fmt } from "@/components/functions2";
import { Card, PrimaryActionButton, TableSkeleton } from "@/components/Functions";
import { CodeField } from "@/components/CodeField";

const STATUT_STYLES: Record<AttachementDTO["statut"], { bg: string; text: string; dot: string; label: string }> = {
  SOUMIS: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-600", label: "Soumis" },
  ENCAISSE: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-600", label: "Encaissé" },
};

export default function AttachementsPanel({
  chantierId,
  bpuLignes,
  canManage,
  canEncaisser,
}: {
  chantierId: string;
  bpuLignes: BpuLigneDTO[];
  canManage: boolean;
  canEncaisser: boolean;
}) {
  const [attachements, setAttachements] = useState<AttachementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [dateAttachement, setDateAttachement] = useState(new Date().toISOString().slice(0, 10));
  const [cumuls, setCumuls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [encaissingId, setEncaissingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAttachements(await fetchAttachements(chantierId));
    } catch {
      setError("Impossible de charger les attachements.");
    } finally {
      setLoading(false);
    }
  }, [chantierId]);

  useEffect(() => { load(); }, [load]);

  // Latest known cumulative quantity per BPU line, derived from the most
  // recently submitted attachement that references it (used as the "Ancien
  // Cumul" starting point shown in the create form).
  const ancienCumulByBpuLigne = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of attachements) {
      for (const l of a.lignes) {
        if (!(l.bpuLigneId in map)) map[l.bpuLigneId] = l.nouveauCumul;
      }
    }
    return map;
  }, [attachements]);

  const startCreate = () => {
    setDateAttachement(new Date().toISOString().slice(0, 10));
    setCumuls({});
    setFormError(null);
    setShowForm(v => !v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const lignes = bpuLignes
      .map(bl => {
        const ancien = ancienCumulByBpuLigne[bl.id] ?? 0;
        const nouveau = Number(cumuls[bl.id] ?? ancien);
        return { bpuLigneId: bl.id, nouveauCumul: nouveau, ancien };
      })
      .filter(l => l.nouveauCumul > l.ancien)
      .map(({ bpuLigneId, nouveauCumul }) => ({ bpuLigneId, nouveauCumul }));

    if (lignes.length === 0) {
      setFormError("Renseignez au moins un nouveau cumul supérieur à l'ancien cumul.");
      return;
    }

    setSubmitting(true);
    try {
      await createAttachement(chantierId, { dateAttachement, lignes });
      setShowForm(false);
      await load();
    } catch {
      setFormError("Impossible de créer l'attachement (référence dupliquée ou cumul invalide ?)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEncaisser = async (id: string) => {
    setEncaissingId(id);
    try {
      await encaisserAttachement(id);
      await load();
    } catch {
      setError("Impossible d'encaisser cet attachement.");
    } finally {
      setEncaissingId(null);
    }
  };

  if (loading && attachements.length === 0) {
    return (
      <Card>
        <TableSkeleton columns={5} rows={3} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <PrimaryActionButton onClick={startCreate}>
            {showForm ? "Fermer" : "+ Créer un attachement"}
          </PrimaryActionButton>
        </div>
      )}

      {canManage && showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark p-4 space-y-5"
        >
          <h3 className="text-sm font-semibold text-content-primary dark:text-content-primary-dark">
            Nouvel attachement (situation de travaux)
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <CodeField label="Référence" />

            <label className="text-sm space-y-1">
              <span className="text-content-muted">Date</span>
              <input
                type="date"
                required
                value={dateAttachement}
                onChange={(e) => setDateAttachement(e.target.value)}
                className="w-full rounded-lg border border-edge-subtle px-3 py-2"
              />
            </label>
          </div>

          {bpuLignes.length === 0 ? (
            <p className="text-sm text-content-muted dark:text-content-muted-dark">
              Aucune ligne BPU sur ce chantier — ajoutez-en avant de créer un attachement.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
                    {["Réf BPU", "Désignation", "Prévu", "Ancien Cumul", "Nouveau Cumul"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bpuLignes.map(bl => {
                    const ancien = ancienCumulByBpuLigne[bl.id] ?? 0;
                    return (
                      <tr key={bl.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                        <td className="px-3 py-2 font-mono text-xs font-semibold text-accent whitespace-nowrap">{bl.ref}</td>
                        <td className="px-3 py-2 text-content-secondary dark:text-content-secondary-dark">{bl.designation}</td>
                        <td className="px-3 py-2 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{bl.qtePrevue} {bl.unite}</td>
                        <td className="px-3 py-2 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{ancien} {bl.unite}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={ancien}
                            max={bl.qtePrevue}
                            step="0.001"
                            value={cumuls[bl.id] ?? ""}
                            placeholder={String(ancien)}
                            onChange={(e) => setCumuls(v => ({ ...v, [bl.id]: e.target.value }))}
                            className="w-28 rounded-lg border border-edge-subtle px-2 py-1"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || bpuLignes.length === 0}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Enregistrement…" : "Créer l'attachement"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-content-muted">
              Annuler
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Card>
        {attachements.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-content-muted dark:text-content-muted-dark">
              Aucun attachement enregistré pour ce chantier.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
                  {["Référence", "Date", "Montant HT", "TVA", "Montant TTC", "Statut", ...(canEncaisser ? ["Actions"] : [])].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attachements.map(a => {
                  const style = STATUT_STYLES[a.statut];
                  return (
                    <tr key={a.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors duration-150">
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-accent whitespace-nowrap">{a.reference}</td>
                      <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{new Date(a.dateAttachement).toLocaleDateString("fr-MA")}</td>
                      <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{fmt(a.montantHt)} MAD</td>
                      <td className="px-3 py-3 text-content-secondary dark:text-content-secondary-dark whitespace-nowrap">{fmt(a.tva)} MAD</td>
                      <td className="px-3 py-3 font-semibold text-content-primary dark:text-content-primary-dark whitespace-nowrap">{fmt(a.montantTtc)} MAD</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                      </td>
                      {canEncaisser && (
                        <td className="px-3 py-3 whitespace-nowrap">
                          {a.statut === "SOUMIS" && (
                            <button
                              onClick={() => handleEncaisser(a.id)}
                              disabled={encaissingId === a.id}
                              className="text-xs text-accent font-semibold disabled:opacity-50"
                            >
                              {encaissingId === a.id ? "Encaissement…" : "Encaisser"}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
