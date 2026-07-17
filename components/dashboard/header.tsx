"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
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
                <SearchBar />

                <ThemeToggle variant="hexagon" duration={400} fromCenter={true} />
                <ProfileDropdown />
            </div>
        </div>
    );
}