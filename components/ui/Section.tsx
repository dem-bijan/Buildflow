export function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section style={{ marginBottom: 32 }}>
            <h2 className="text-content dark:text-white" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                {title}
            </h2>
            {children}
        </section>
    );
}