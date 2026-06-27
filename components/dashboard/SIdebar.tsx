"use client";

import ShinyText from "@/components/ShinyText";
import { LayoutGroup } from "framer-motion";
import SidebarItem from "./SidebarItem";
import {
    LayoutDashboard,
    ShoppingCart,
    DollarSign,
    Warehouse,
    HardHat,
    Wallet,
    Wrench,
    BadgeDollarSign,
    FolderKanban,
    BookOpen,
    Truck,
    ContactRound,
    Menu,
    X,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const sections = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Achats", href: "/dashboard/achats", icon: ShoppingCart },
    { title: "Gestion des Stocks", href: "/dashboard/stocks", icon: Warehouse },
    { title: "Suivi Chantiers", href: "/dashboard/suivi-chantiers", icon: HardHat },
    { title: "Tresorerie et Caisse", href: "/dashboard/tresorerie", icon: Wallet },
    { title: "Sous Traitance", href: "/dashboard/sous-traitance", icon: Wrench },
    { title: "Salaires", href: "/dashboard/salaires", icon: BadgeDollarSign },
    { title: "Affectation (Projets)", href: "/dashboard/affectation", icon: FolderKanban },
    { title: "Catalogue Articles", href: "/dashboard/catalogue", icon: BookOpen },
    { title: "Fournisseurs", href: "/dashboard/fournisseurs", icon: Truck },
    { title: "Annuaire", href: "/dashboard/annuaire", icon: ContactRound },
    { title: "Comptabilite", href: "/dashboard/comptabilite", icon: DollarSign },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-black rounded-md md:hidden shadow-md border border-gray-200 dark:border-zinc-700"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col
          w-64 lg:w-72
          bg-surface-page
          dark:bg-surface-page-dark
          border-r 
          border-edge-default
          dark:border-edge-default-dark
          pt-16 md:pt-4
          pl-4
          
          transition-all
          md:sticky md:top-0 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
                <div className="hidden md:flex h-12 justify-center font-mono items-center mb-4">
                    <ShinyText
                        text="Buildflow"
                        speed={1.4}
                        delay={0}
                        color={isDark ? "#c17c2c" : "#00000"}
                        shineColor="#ffffff"
                        spread={60}
                        direction="right"
                        yoyo={false}
                        pauseOnHover
                        disabled={false}
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col items-center w-[90%] overflow-y-auto pr-2 pb-6">
                    <LayoutGroup id="sidebar-navigation">
                        {sections.map((section) => (
                            <SidebarItem
                                key={section.href}
                                {...section}
                                onClick={() => setIsOpen(false)}
                            />
                        ))}
                    </LayoutGroup>
                </nav>
            </aside>
        </>
    );
}