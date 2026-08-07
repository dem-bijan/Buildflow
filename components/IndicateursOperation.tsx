"use client";

/**
 * Shared UI for the two operational billing indicators carried by every
 * "opération" (achat, opération de caisse):
 *
 *   Impact_Analytique_Chantier — "L'achat a-t-il réellement servi au chantier ?"
 *   Impact_Comptable_Fiscal    — "Y a-t-il une facture officielle à déclarer ?"
 *
 * Used by the Achats and Trésorerie views so both read identically.
 */

export const INDICATEURS = {
  analytique: {
    key: "impactAnalytiqueChantier",
    short: "Chantier",
    label: "Impact analytique chantier",
    tooltip: "L'achat a-t-il réellement servi au chantier ?",
    abbr: "AC",
  },
  fiscal: {
    key: "impactComptableFiscal",
    short: "Fiscal",
    label: "Impact comptable / fiscal",
    tooltip: "Y a-t-il une facture officielle à déclarer ?",
    abbr: "CF",
  },
} as const;

/** Tri-state filter value: no filter / only true / only false. */
export type IndicateurFilterValue = "ALL" | "YES" | "NO";

export function matchesIndicateurFilter(value: boolean, filter: IndicateurFilterValue): boolean {
  if (filter === "ALL") return true;
  return filter === "YES" ? value : !value;
}

/** Labelled checkbox for the create/edit forms. */
export function IndicateurCheckbox({
  variant,
  checked,
  onChange,
  disabled = false,
}: {
  variant: keyof typeof INDICATEURS;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const meta = INDICATEURS[variant];
  return (
    <label
      title={meta.tooltip}
      className="flex items-start gap-2.5 cursor-pointer select-none rounded-lg border border-edge-subtle dark:border-edge-subtle-dark px-3 py-2.5 hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors"
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent cursor-pointer disabled:cursor-not-allowed"
      />
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-content-primary dark:text-content-primary-dark">
          {meta.label}
        </span>
        <span className="block text-[11px] text-content-muted dark:text-content-muted-dark">
          {meta.tooltip}
        </span>
      </span>
    </label>
  );
}

/**
 * Read-only badge for table cells. Renders as a button when `onToggle` is
 * supplied, which is how the Achats / Caisse lists edit the flag in place.
 */
export function IndicateurBadge({
  variant,
  value,
  onToggle,
  pending = false,
}: {
  variant: keyof typeof INDICATEURS;
  value: boolean;
  onToggle?: () => void;
  pending?: boolean;
}) {
  const meta = INDICATEURS[variant];
  const cls = value
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400";

  const content = (
    <>
      <span aria-hidden="true">{value ? "✓" : "—"}</span>
      <span>{meta.abbr}</span>
    </>
  );

  const shared = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls} ${pending ? "opacity-50" : ""}`;
  const title = `${meta.tooltip} — ${value ? "Oui" : "Non"}`;

  if (!onToggle) {
    return (
      <span className={shared} title={title} aria-label={title}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      title={`${title} (cliquer pour modifier)`}
      aria-label={`${title} (cliquer pour modifier)`}
      aria-pressed={value}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`${shared} cursor-pointer hover:ring-2 hover:ring-accent/40 transition-shadow disabled:cursor-wait`}
    >
      {content}
    </button>
  );
}

/** Tri-state <select> used to filter a list on one indicator. */
export function IndicateurFilterSelect({
  variant,
  value,
  onChange,
}: {
  variant: keyof typeof INDICATEURS;
  value: IndicateurFilterValue;
  onChange: (next: IndicateurFilterValue) => void;
}) {
  const meta = INDICATEURS[variant];
  return (
    <label className="flex items-center gap-2" title={meta.tooltip}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted dark:text-content-muted-dark whitespace-nowrap">
        {meta.short}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as IndicateurFilterValue)}
        className="px-2.5 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
      >
        <option value="ALL">Tous</option>
        <option value="YES">Oui</option>
        <option value="NO">Non</option>
      </select>
    </label>
  );
}
