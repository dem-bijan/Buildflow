"use client";

import Image from "next/image";
import google from "@/public/google.png";
import facebook from "@/public/facebook.png";
import { motion, AnimatePresence } from "framer-motion";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignUpModal({
    isOpen,
    onClose,
}: SignUpModalProps) {
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
                    <div className="grid place-items-center w-full text-base sm:text-2xl font-script font-bold px-4 pt-6 sm:pt-12 md:pt-20 text-center">
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
                            <form action="#" method="POST" className="space-y-4 sm:space-y-5">
                                {/* Full Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm/6 font-mono font-bold text-gray-100">
                                        Full Name
                                    </label>
                                    <div className="mt-1.5">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

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
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
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
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
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
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-black/50 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>

                            <p className="mt-6 sm:mt-8 text-center font-mono text-sm/6 text-gray-400">
                                Already have an account?{' '}
                                <a href="#" className="font-semibold text-red-600 hover:text-red-800">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    {/* Social auth */}
                    <div className="flex flex-col items-center justify-center w-full font-mono text-sm text-center pb-6 sm:pb-8 px-4">
                        <div className="mb-4">Or sign up with</div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full justify-center items-center">
                            <button
                                className="flex w-full sm:w-auto max-w-[200px] justify-center gap-2 rounded-md bg-red-900/90 px-4 py-1.5 text-sm font-mono text-white hover:bg-red-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90"
                            >
                                <Image className="pr-2" src={google} alt="google" height={30} width={30} />
                                Google
                            </button>
                            <button
                                className="flex w-full sm:w-auto max-w-[200px] justify-center gap-2 rounded-md bg-blue-900/90 px-4 py-1.5 text-sm font-mono text-white hover:bg-red-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90"
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