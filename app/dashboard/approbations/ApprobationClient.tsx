"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/authContext";

interface PendingUser {
    id: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function ApprobationsClient() {
    const { user } = useAuth();
    const [pending, setPending] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actingOn, setActingOn] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/users/pending", { cache: "no-store" });
            const data = await res.json();
            console.log("DATA = ", res.status, data);
            if (!res.ok) throw new Error(data?.message ?? "Erreur de chargement");
            setPending(data?.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function handleAction(id: string, action: "approve" | "reject") {
        setActingOn(id);
        try {
            const res = await fetch(`/api/users/${id}/${action}`, { method: "POST" });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message ?? "Action impossible");
            }
            setPending((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erreur");
        } finally {
            setActingOn(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-sm text-content-muted dark:text-content-muted-dark animate-pulse">
                    Chargement des demandes en attente…
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <p className="text-sm text-red-500">{error}</p>
                <button onClick={load} className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-content-primary dark:text-content-primary-dark">
                    Approbations en attente
                </h1>
                <p className="text-sm text-content-muted dark:text-content-muted-dark mt-1">
                    {pending.length} demande{pending.length !== 1 ? "s" : ""} à traiter · Connecté en tant que {user?.role}
                </p>
            </div>

            {pending.length === 0 ? (
                <div className="px-4 py-12 text-center">
                    <p className="text-sm text-content-muted dark:text-content-muted-dark">
                        Aucune demande en attente pour votre niveau d'accès.
                    </p>
                </div>
            ) : (
                <div className="bg-surface-page dark:bg-surface-page-dark rounded-xl border border-edge-subtle dark:border-edge-subtle-dark overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b-2 border-edge-default dark:border-edge-default-dark">
                                {["Email", "Rôle demandé", "Date", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-content-muted dark:text-content-muted-dark"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map((u) => (
                                <tr key={u.id} className="border-b border-edge-subtle dark:border-edge-subtle-dark">
                                    <td className="px-4 py-3 font-medium text-content-primary dark:text-content-primary-dark">
                                        {u.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-content-secondary dark:text-content-secondary-dark">
                                        {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(u.id, "approve")}
                                                disabled={actingOn === u.id}
                                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                                            >
                                                Approuver
                                            </button>
                                            <button
                                                onClick={() => handleAction(u.id, "reject")}
                                                disabled={actingOn === u.id}
                                                className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                                            >
                                                Rejeter
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}