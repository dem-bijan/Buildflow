"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X } from "lucide-react";
import { loginSchema } from "@/lib/validation/auth";

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called when the user clicks "S'inscrire" to switch to the sign-up modal. */
    onSwitchToSignUp?: () => void;
}

const inputClass =
    "block w-full rounded-lg bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent transition-all";

export default function SignInModal({
    isOpen,
    onClose,
    onSwitchToSignUp,
}: SignInModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            setFormError("Entrez un email et un mot de passe valides.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });
            const data = await res.json();

            if (!res.ok) {

                if (!res.ok && data.pending) {
                    onClose();
                    router.push("/compte-en-attente");
                    return;
                }
                // Deliberately generic — don't reveal whether email or password was wrong.
                setFormError(data.error ?? "Email ou mot de passe invalide");
                return;
            }

            onClose();
            const next = searchParams.get("next") || "/dashboard";
            router.push(next);
            router.refresh();
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
                            <h2 className="text-xl font-mono font-bold text-white">Connexion</h2>
                            <p className="mt-1 text-sm text-gray-400">Accédez à votre espace Buildflow</p>
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
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-xs font-mono font-semibold text-gray-300">
                                        Mot de passe
                                    </label>
                                    <a href="#" className="text-xs font-medium text-accent hover:text-accent/80 transition-colors">
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

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
                                {isSubmitting ? "Connexion…" : "Se connecter"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-400">
                            Pas encore de compte ?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToSignUp}
                                className="font-semibold text-white hover:text-accent transition-colors"
                            >
                                S&apos;inscrire
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
