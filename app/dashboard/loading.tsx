"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Customizable variables on top
const colorDark = "255, 102, 0";   // Orange in RGB (for dark mode)
const colorLight = "235, 94, 0";   // Slightly deeper orange in RGB (for light mode)

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

export default function Loader({
    size = "md",
    className,
    ...props
}: LoaderProps) {
    const sizeConfig = {
        sm: { container: "size-20" },
        md: { container: "size-32" },
        lg: { container: "size-40" },
    };

    const config = sizeConfig[size];

    return (
        <div
            className={cn(
                "flex flex-col items-center h-full justify-center p-8",
                className
            )}
            {...props}
        >
            <motion.div
                animate={{
                    scale: [1, 1.02, 1],
                }}
                className={cn("relative", config.container)}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: [0.4, 0, 0.6, 1],
                }}
            >
                {/* --- LIGHT MODE RINGS --- */}
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 block rounded-full dark:hidden"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, rgb(${colorLight}) 90deg, transparent 180deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
                        opacity: 0.8,
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 block rounded-full dark:hidden"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, rgb(${colorLight}) 120deg, rgba(${colorLight}, 0.5) 240deg, transparent 360deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
                        opacity: 0.9,
                    }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: [0.4, 0, 0.6, 1] }}
                />

                <motion.div
                    animate={{ rotate: [0, -360] }}
                    className="absolute inset-0 block rounded-full dark:hidden"
                    style={{
                        background: `conic-gradient(from 180deg, transparent 0deg, rgba(${colorLight}, 0.6) 45deg, transparent 90deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
                        opacity: 0.35,
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: [0.4, 0, 0.6, 1] }}
                />

                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 block rounded-full dark:hidden"
                    style={{
                        background: `conic-gradient(from 270deg, transparent 0deg, rgba(${colorLight}, 0.4) 20deg, transparent 40deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 61%, black 62%, black 63%, transparent 64%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 61%, black 62%, black 63%, transparent 64%)",
                        opacity: 0.5,
                    }}
                    transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* --- DARK MODE RINGS --- */}
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 hidden rounded-full dark:block"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, rgb(${colorDark}) 90deg, transparent 180deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
                        opacity: 0.8,
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 hidden rounded-full dark:block"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, rgb(${colorDark}) 120deg, rgba(${colorDark}, 0.5) 240deg, transparent 360deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
                        opacity: 0.9,
                    }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: [0.4, 0, 0.6, 1] }}
                />

                <motion.div
                    animate={{ rotate: [0, -360] }}
                    className="absolute inset-0 hidden rounded-full dark:block"
                    style={{
                        background: `conic-gradient(from 180deg, transparent 0deg, rgba(${colorDark}, 0.6) 45deg, transparent 90deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
                        opacity: 0.35,
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: [0.4, 0, 0.6, 1] }}
                />

                <motion.div
                    animate={{ rotate: [0, 360] }}
                    className="absolute inset-0 hidden rounded-full dark:block"
                    style={{
                        background: `conic-gradient(from 270deg, transparent 0deg, rgba(${colorDark}, 0.4) 20deg, transparent 40deg)`,
                        mask: "radial-gradient(circle at 50% 50%, transparent 61%, black 62%, black 63%, transparent 64%)",
                        WebkitMask: "radial-gradient(circle at 50% 50%, transparent 61%, black 62%, black 63%, transparent 64%)",
                        opacity: 0.5,
                    }}
                    transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}