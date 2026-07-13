/**
 * KPI Card
 * Simple display component for metrics.
 */
export function KpiCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string;
    sub?: string;
    accent?: string;
}) {
    return (
        <div
            style={{
                background: "var(--color-surface-card)",
                border: "1px solid var(--color-edge-subtle)",
                borderRadius: 12,
                padding: 20,
                borderLeft: accent ? `4px solid ${accent}` : undefined,
            }}
        >
            <div style={{ fontSize: 11, color: "var(--color-content-muted)" }}>
                {label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>
                {value}
            </div>
            {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
        </div>
    );
}