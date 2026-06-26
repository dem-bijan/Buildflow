"use client"
import { usePathname } from "next/navigation";
import { Search, Settings, UserRoundPen } from "lucide-react";
import ThemeToggle from "../themeprovider";

export default function Header() {
    const pathname = usePathname();
    const page = pathname.split("/")[2];

    return (
        <div className="w-full flex flex-row  justify-between md:justify-between items-center  z-0 px-4 md:px-6 py-3">

            {/* Left Section: Breadcrumbs - Shifts right on mobile to avoid the hamburger button */}
            <div className="flex flex-col justify-start text-[14px] font-sans font-bold ml-14 md:ml-0 transition-all duration-300">
                <span className="font-normal text-shadow-black text-black "><span className="text-zinc-500 font-normal ">{pathname.split("/")[1]}</span> / {pathname.split("/")[2]}</span>
                <div className="capitalize">{page !== undefined ? page : "dashboard"}</div>
            </div>


            {/* Right Section: User & Settings */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex flex-row h-10 flex-1 max-w-xs md:max-w-sm mx-4 justify-start pl-3 gap-2 bg-white rounded-3xl items-center border border-gray-100 shadow-sm">
                    <Search size={18} color="gray" strokeWidth={3} className="ml-2 text-zinc-900 shrink-0" />
                    <input
                        type="text"
                        placeholder="rechercher ici"
                        className="w-full h-full font-mono bg-white outline-0 rounded-3xl pr-4 text-[12px]"
                    />
                </div>

                <ThemeToggle />

                <div className="flex flex-row items-center text-zinc-700 font-sans gap-2">
                    <UserRoundPen size={18} color="gray" strokeWidth={2} className="text-zinc-900" />
                    <a className="text-sm font-medium hidden xs:inline">User</a>
                </div>
                <Settings size={18} color="black" strokeWidth={2} className="text-zinc-900 cursor-pointer hover:rotate-45 transition-transform duration-200" />
            </div>

        </div>
    );
}