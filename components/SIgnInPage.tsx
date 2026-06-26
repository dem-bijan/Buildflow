import Image from "next/image";
import google from "@/public/google.png";
import facebook from "@/public/facebook.png";
import { motion, AnimatePresence } from "framer-motion";

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignInModal({
    isOpen,
    onClose,
}: SignInModalProps) {
    return (

        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className="fixed flex flex-col inset-0 z-40 items-center justify-between bg-black/10 backdrop-blur-lg overflow-y-auto"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, animationDuration: 0.5 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Header text */}
                    <div className="grid place-items-center w-full text-base sm:text-2xl font-script font-bold px-4 pt-10 sm:pt-20 md:pt-40 text-center">
                        Sign In with Google or Facebook
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
                            <form action="#" method="POST" className="space-y-5 sm:space-y-6">
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
                                            <a href="#" className="font-semibold text-red-600 hover:text-red-300">
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
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/90 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-black/40 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/90"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <p className="mt-8 sm:mt-10 text-center font-mono text-sm/6 text-gray-400">
                                Not a member?{' '}
                                <a href="#" className="font-semibold text-red-600 hover:text-red-800">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    {/* Social auth */}
                    <div className="flex flex-col items-center justify-center w-full font-mono text-sm text-center pb-6 sm:pb-8 px-4">
                        <div className="mb-4">Or continue with</div>
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