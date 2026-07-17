"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, UserRound, X } from "lucide-react";
import { registerSchema } from "@/lib/validation/auth";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called after a successful registration. Use this to switch to the
     * sign-in modal instead of assuming the user should be auto-logged-in. */
    onRegistered?: () => void;
    /** Called when the user clicks "Se connecter" to switch to the sign-in modal. */
    onSwitchToSignIn?: () => void;
}

const inputClass =
    "block w-full rounded-lg bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent transition-all";

export default function SignUpModal({
    isOpen,
    onClose,
    onRegistered,
    onSwitchToSignIn,
}: SignUpModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [role, setRole] = useState("VIEWER");
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);
        setFieldErrors({});

        if (password !== confirmPassword) {
            setFieldErrors((prev) => ({ ...prev, confirmPassword: "Les mots de passe ne correspondent pas" }));
            return;
        }

        // Client-side check only — the server re-validates everything.
        const result = registerSchema.safeParse({ email, password, role: role.toUpperCase() });
        if (!result.success) {
            const errs = result.error.flatten().fieldErrors;
            setFieldErrors({
                email: errs.email?.[0],
                password: errs.password?.[0],
            });
            return;
        }
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });
            const data = await res.json();

            if (!res.ok) {
                setFormError(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
                return;
            }

            const accessToken = data?.data?.accessToken;
            if (!accessToken) {
                setSuccessMessage("Votre compte a été créé avec succès.");

                return;
            }

            onClose();
            if (onRegistered) {
                onRegistered();
            }
        } catch {
            setFormError("Erreur réseau. Veuillez vérifier votre connexion et réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl my-8"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fermer"
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-mono font-bold text-white">Créer un compte</h2>
                            <p className="mt-1 text-sm text-gray-400">Rejoignez Buildflow en quelques secondes</p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-xs font-mono font-semibold text-gray-300 mb-1.5">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-invalid={Boolean(fieldErrors.email)}
                                        className={inputClass}
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-mono font-semibold text-gray-300 mb-1.5">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-invalid={Boolean(fieldErrors.password)}
                                        className={inputClass}
                                    />
                                </div>
                                {fieldErrors.password && (
                                    <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-mono font-semibold text-gray-300 mb-1.5">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                        className={inputClass}
                                    />
                                </div>
                                {fieldErrors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-xs font-mono font-semibold text-gray-300 mb-1.5">
                                    Rôle
                                </label>
                                <div className="relative">
                                    <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="DIRECTEUR">Directeur</option>
                                        <option value="CHEF_CHANTIER">Chef de Chantier</option>
                                        <option value="MAGASINIER">Magasinier</option>
                                        <option value="RH">RH</option>
                                        <option value="FINANCE">Finance</option>
                                        <option value="PM">PM</option>
                                        <option value="ACHAT">Achat</option>
                                        <option value="VIEWER">Viewer</option>
                                    </select>
                                </div>
                            </div>

                            {successMessage && (
                                <div
                                    role="status"
                                    className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300"
                                >
                                    {successMessage}
                                </div>
                            )}

                            {formError && (
                                <p role="alert" className="text-sm text-red-400">
                                    {formError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Création du compte…" : "S'inscrire"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-400">
                            Déjà un compte ?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToSignIn}
                                className="font-semibold text-white hover:text-accent transition-colors"
                            >
                                Se connecter
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
