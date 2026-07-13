export const fmt = (n: number) =>
    new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        maximumFractionDigits: 0,
    }).format(n);

export const shortDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-MA", {
        day: "2-digit",
        month: "short",
    });