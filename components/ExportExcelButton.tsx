"use client";

import { useState } from "react";
import { exportDashboard, exportSection, type ExportSection } from "@/lib/api/export";
import { extractApiErrorMessage } from "@/lib/api/client";

/**
 * Downloads an Excel export.
 *
 * Omit `section` for the whole dashboard, pass one to export just that part.
 * Two sizes so the same control can sit on a page header or inside a card
 * without competing with the card's own content.
 */
export function ExportExcelButton({
  section,
  month,
  label,
  size = "sm",
  onError,
}: {
  section?: ExportSection;
  month?: string;
  label?: string;
  size?: "sm" | "md";
  onError?: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const run = async (e: React.MouseEvent) => {
    // These buttons often sit inside clickable cards.
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      await (section ? exportSection(section, month) : exportDashboard(month));
    } catch (err) {
      onError?.(extractApiErrorMessage(err, "Export impossible pour le moment."));
    } finally {
      setBusy(false);
    }
  };

  const text = label ?? (section ? "Excel" : "Exporter en Excel");

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      title={section ? "Télécharger cette section au format Excel" : "Télécharger tout le tableau de bord au format Excel"}
      className={
        size === "md"
          ? "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-edge-subtle dark:border-edge-subtle-dark text-content-primary dark:text-content-primary-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark disabled:opacity-50 disabled:cursor-wait transition-colors"
          : "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-edge-subtle dark:border-edge-subtle-dark text-content-muted dark:text-content-muted-dark hover:text-content-primary dark:hover:text-content-primary-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark disabled:opacity-50 disabled:cursor-wait transition-colors"
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "md" ? "w-4 h-4" : "w-3 h-3"}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {busy ? "Export…" : text}
    </button>
  );
}
