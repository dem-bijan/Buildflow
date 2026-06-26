"use client";

import { LayoutGroup } from "framer-motion";
import SidebarItem from "./SidebarItem";
import {
    LayoutDashboard, ShoppingCart, DollarSign, Warehouse, HardHat,
    Wallet, Wrench, BadgeDollarSign, FolderKanban, BookOpen, Truck,
    ContactRound, Menu, X
} from "lucide-react";
import { useState } from "react";

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

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-black rounded-md md:hidden shadow-md border border-gray-200"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
    fixed inset-y-0 left-0 z-40 bg-surface-100 flex flex-col gap-1 pl-4 pt-16 md:pt-4
    border-zinc-800
    transition-transform duration-300 ease-in-out
    w-64 lg:w-72 md:sticky md:top-0 md:h-screen md:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
`}>
                <div className="hidden md:flex h-12 justify-center items-center font-bold text-xl font-mono mb-4 text-brand-500 tracking-tight">
                    Builflow
                </div>
                <nav className="flex-1 flex flex-col justify-start items-center w-[90%] overflow-y-auto pr-2 pb-6">
                    <LayoutGroup id="sidebar-navigation">
                        {sections.map((section) => (
                            <SidebarItem key={section.href} {...section} onClick={() => setIsOpen(false)} />
                        ))}
                    </LayoutGroup>
                </nav>
            </div>
        </>
    );
}