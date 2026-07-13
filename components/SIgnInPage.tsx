"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import google from "@/public/google.png";
import facebook from "@/public/facebook.png";
import { motion, AnimatePresence } from "framer-motion";
import { loginSchema } from "@/lib/validation/auth";

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignInModal({
    isOpen,
    onClose,
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
            setFormError("Enter a valid email and password.");
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
                setFormError(data.error ?? "Invalid email or password");
                return;
            }

            onClose();
            const next = searchParams.get("next") || "/dashboard";
            router.push(next);
            router.refresh();
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
                        Sign In with Google or Facebook
                    </div>

                    {/* Form panel */}
                    <motion.div
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md border-2 border-black/5 rounded-2xl mt-4 sm:mt-5 outline-0 backdrop-blur-2xl p-5 sm:p-8 shadow-white shadow-2xl/30 mx-auto"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.6, ease: "easeIn", delay: 0.05 }}
                    >
                        <div className="sm:mx-auto sm:w-full">
                            <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm/6 font-mono font-bold text-gray-100">
                                            Password
                                        </label>
                                        <div className="text-sm">
                                            <a href="#" className="font-semibold text-accent-50 hover:text-cyan-400">
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                {formError && (
                                    <p role="alert" className="text-sm text-red-400">
                                        {formError}
                                    </p>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full justify-center rounded-md bg-black/40 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-white/90 hover:text-black transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? "Signing in…" : "Sign in"}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-8 sm:mt-10 text-center font-mono text-sm/6 text-gray-900">
                                Not a member?{' '}
                                <a href="#" className="font-semibold text-white hover:text-cyan-400">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    {/* Social auth — placeholders; wire these up once you add OAuth endpoints on the backend */}
                    <div className="flex flex-col items-center justify-center w-full font-mono text-sm text-center pb-6 sm:pb-8 px-4">
                        <div className="mb-4 font-mono text-white">Or continue with</div>
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