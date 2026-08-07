"use client";

/**
 * Read-only stand-in for a code/référence/matricule field.
 *
 * Codes are assigned by the server on create and never change afterwards, so
 * there is nothing to type. Keeping a field in the grid (rather than deleting
 * it) preserves the form layout and tells the user where the code will appear.
 */
export function CodeField({
  label = "Code",
  value,
  hint = "Attribué automatiquement",
}: {
  label?: string;
  /** The existing code when editing; omit when creating. */
  value?: string | null;
  hint?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-content-muted dark:text-content-muted-dark">
        {label}
      </span>
      <div
        title={value ? undefined : "Le code est généré par le système à l'enregistrement"}
        className={`w-full px-3 py-2 text-sm rounded-lg border border-dashed border-edge-subtle dark:border-edge-subtle-dark bg-surface-hover dark:bg-surface-hover-dark ${
          value
            ? "font-mono text-content-primary dark:text-content-primary-dark"
            : "italic text-content-muted dark:text-content-muted-dark"
        }`}
      >
        {value || hint}
      </div>
    </label>
  );
}
