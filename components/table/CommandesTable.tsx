import { Achat } from "@/data/achats";

export function CommandesTable({ achats }: { achats: Achat[] }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-edge-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: 8 }}>Référence</th>
                        <th style={{ padding: 8 }}>Fournisseur</th>
                        <th style={{ padding: 8 }}>Chantier</th>
                        <th style={{ padding: 8 }}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {achats.map((achat) => (
                        <tr key={achat.id} style={{ borderBottom: '1px solid var(--color-edge-subtle)' }}>
                            <td style={{ padding: 8 }}>{achat.ref}</td>
                            <td style={{ padding: 8 }}>{achat.fournisseurNom}</td>
                            <td style={{ padding: 8 }}>{achat.chantierNom}</td>
                            <td style={{ padding: 8 }}>{achat.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}