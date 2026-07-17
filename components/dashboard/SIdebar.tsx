"use client";

import ShinyText from "@/components/ShinyText";
import { LayoutGroup } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import { isAllowed, type Role } from "@/lib/auth/permissions";
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
    BookOpen,
    Truck,
    ContactRound,
    Building2,
    Menu,
    User,
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
    { title: "Sous-traitants", href: "/dashboard/sous-traitants", icon: Building2 },
    { title: "Salaires", href: "/dashboard/salaires", icon: BadgeDollarSign },
    { title: "Catalogue Articles", href: "/dashboard/catalogue", icon: BookOpen },
    { title: "Fournisseurs", href: "/dashboard/fournisseurs", icon: Truck },
    { title: "Paiements", href: "/dashboard/payments", icon: Wallet },
    { title: "Annuaire", href: "/dashboard/annuaire", icon: ContactRound },
    { title: "Comptabilite", href: "/dashboard/comptabilite", icon: DollarSign },
    { title: "Approbations", href: "/dashboard/approbations", icon: User },
];

export default function Sidebar() {
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // All hooks are called above this line, unconditionally, every render.
    // Conditional returns can safely happen after this point.
    if (loading) return null;
    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";
    const visibleItems = sections.filter((section) => isAllowed(section.href, user?.role as Role | undefined));

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
                        speed={2}
                        delay={0}
                        color={isDark ? "#fff8f0" : "#1a1410"}
                        shineColor={isDark ? "#1a1410" : "#fff8f0"}
                        spread={45}
                        yoyo={true}
                        disabled={!mounted}
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col items-center w-[90%] overflow-y-auto pr-2 pb-6">
                    <LayoutGroup id="sidebar-navigation">
                        {visibleItems.map((section) => (
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