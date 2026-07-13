"use client";

import { useState } from "react";
import Image from "next/image";
import google from "@/public/google.png";
import facebook from "@/public/facebook.png";
import { motion, AnimatePresence } from "framer-motion";
import { registerSchema } from "@/lib/validation/auth";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called after a successful registration. Use this to switch to the
     * sign-in modal instead of assuming the user should be auto-logged-in. */
    onRegistered?: () => void;
}

export default function SignUpModal({
    isOpen,
    onClose,
    onRegistered,
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
            setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
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
                setFormError(data.error ?? "Something went wrong. Please try again.");
                return;
            }

            const accessToken = data?.data?.accessToken;
            if (!accessToken) {
                setSuccessMessage("You have been registered successfully.");

                return;
            }

            onClose();
            if (onRegistered) {
                onRegistered();
            }
        } catch {
            setFormError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className="fixed flex flex-col inset-0 z-40 items-center justify-between bg-black/10 backdrop-blur-lg overflow-y-auto"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Header text */}
                    <div className="grid place-items-center w-full text-white text-base sm:text-2xl font-script font-bold px-4 pt-10 sm:pt-20 md:pt-40 text-center">
                        Create your account with Google or Facebook
                    </div>

                    {/* Form panel */}
                    <motion.div
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl mt-4 sm:mt-5 outline-0 backdrop-blur-2xl p-5 sm:p-8 shadow-2xl mx-auto"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                    >
                        <div className="sm:mx-auto sm:w-full">
                            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Email address
                                    </label>
                                    <div className="mt-1.5">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            aria-invalid={Boolean(fieldErrors.email)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Password
                                    </label>
                                    <div className="mt-1.5">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            aria-invalid={Boolean(fieldErrors.password)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field (client-side check only, not sent to backend) */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1.5">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                    {fieldErrors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Directeur">Directeur</option>
                                        <option value="CHEF_CHANTIER">Chef de Chantier</option>
                                        <option value="MAGASINIER">Magasinier</option>
                                        <option value="RH">RH</option>
                                        <option value="FINANCE">Finance</option>
                                        <option value="PM">PM</option>
                                        <option value="ACHAT">Achat</option>
                                        <option value="VIEWER">Viewer</option>
                                    </select>

                                </div>

                                {successMessage && (
                                    <div
                                        role="status"
                                        className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300"
                                    >
                                        {successMessage}
                                    </div>
                                )}

                                {formError && (
                                    <p role="alert" className="text-sm text-red-400">
                                        {formError}
                                    </p>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full justify-center rounded-md bg-black/50 px-3 py-1.5 text-sm/6 font-semibold text-white hover:text-black hover:bg-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? "Creating account…" : "Register"}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-6 sm:mt-8 text-center font-mono text-sm/6 text-gray-900">
                                Already have an account?{' '}
                                <a href="#" className="font-semibold text-white hover:text-cyan-400">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    {/* Social auth — placeholders; wire these up once you add OAuth endpoints on the backend */}
                    <div className="flex flex-col items-center justify-center w-full font-mono text-sm text-center pb-6 sm:pb-8 px-4">
                        <div className="mb-4 text-white font-mono">Or sign up with</div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full justify-center items-center">
                            <button
                                type="button"
                                disabled
                                title="Coming soon"
                                className="flex w-full sm:w-auto max-w-[200px] justify-center gap-2 rounded-md bg-red-900/90 px-4 py-1.5 text-sm font-mono text-white opacity-60 cursor-not-allowed"
                            >
                                <Image className="pr-2" src={google} alt="google" height={30} width={30} />
                                Google
                            </button>
                            <button
                                type="button"
                                disabled
                                title="Coming soon"
                                className="flex w-full sm:w-auto max-w-[200px] justify-center gap-2 rounded-md bg-blue-900/90 px-4 py-1.5 text-sm font-mono text-white opacity-60 cursor-not-allowed"
                            >
                                <Image className="pr-2" src={facebook} alt="facebook" height={30} width={30} />
                                Facebook
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}