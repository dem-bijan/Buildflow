"use client";

import { usePathname } from "next/navigation";
import { Search, Settings, UserRoundPen } from "lucide-react";
import ThemeToggle from "../themeprovider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ProfileDropdown from "../kokonutui/profile-dropdown";


export default function Header() {
    const pathname = usePathname();
    const page = pathname.split("/")[2];

    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="w-full flex flex-row justify-between items-center px-4 md:px-6 py-3 h-18" />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <div className="w-full flex flex-row justify-between transition-all duration-200 items-center px-4 md:px-6 py-3">
            {/* Left */}
            <div className="flex flex-col ml-14 md:ml-0 text-[14px] font-sans font-bold">
                <span className="font-normal">
                    <span className="text-zinc-500">
                        {pathname.split("/")[1]}
                    </span>

                    <span className="text-orange-400"> / </span>

                    {pathname.split("/")[2]}
                </span>

                <div className="capitalize">
                    {page ?? "dashboard"}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex h-10 max-w-sm w-72 items-center gap-2 rounded-3xl border border-gray-100 bg-white px-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
                    <Search
                        size={18}
                        strokeWidth={3}
                        className={isDark ? "text-white" : "text-gray-500"}
                    />

                    <input
                        type="text"
                        placeholder="rechercher ici"
                        className="w-full bg-transparent outline-none text-[12px] font-mono text-black dark:text-white placeholder:text-gray-400"
                    />
                </div>

                <ThemeToggle variant="hexagon" duration={400} fromCenter={true} />



                {/* <div className="flex items-center gap-2 text-zinc-700">
                    <UserRoundPen
                        size={18}
                        strokeWidth={2}
                        className={isDark ? "text-white" : "text-black"}
                    />
                </div>

                <Settings
                    size={18}
                    strokeWidth={2}
                    className={`cursor-pointer transition-transform duration-200 hover:rotate-45 ${isDark ? "text-white" : "text-black"
                        }`}
                /> */}
                <ProfileDropdown />
            </div>
        </div>
    );
}