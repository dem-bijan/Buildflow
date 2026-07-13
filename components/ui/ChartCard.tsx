export function ChartCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "var(--color-surface-card)",
                border: "1px solid var(--color-edge-subtle)",
                borderRadius: 12,
                padding: 16,
            }}
        >
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>{title}</h3>
            {children}
        </div>
    );
}