"use client";

import { ShoppingBag, ArrowUpRight } from "lucide-react";

// Mock Data structure mirroring a practical real-world dashboard state
const latestPurchases = [
    { id: "1", item: "Ciment CPJ45", category: "Matériaux", price: "$4,500", time: "Il y a 12 min", status: "Livré" },
    { id: "2", item: "Tubes PVC Ø110", category: "Plomberie", price: "$1,200", time: "Il y a 45 min", status: "En cours" },
    { id: "3", item: "Briques Rouges x1000", category: "Structure", price: "$3,800", time: "Il y a 2 h", status: "Livré" },
    { id: "4", item: "Câbles Électriques 2.5mm", category: "Électricité", price: "$950", time: "Il y a 3 h", status: "Livré" },
    { id: "5", item: "Peinture Blanche Mat 30L", category: "Finition", price: "$1,650", time: "Hier", status: "En attente" },
    { id: "6", item: "Gravier G1 (Tonne)", category: "Terrassement", price: "$2,100", time: "Hier", status: "Livré" },
];

export default function LatestPurchasesCard() {
    return (
        <div className=" p-6 border bg-linear-to-l from-red-200/30 to-transparent transition-all hover:bg-red-500/5 rounded-xl shadow-none border-white/5 flex flex-col h-[320px] w-full overflow-hidden">

            {/* Header Area (Static / Fixed position) */}
            <div className="flex flex-row justify-between items-center mb-8 relative z-10 ">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/30 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239, 68, 68,0.2)]">
                        <ShoppingBag size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-black tracking-wide">Derniers Achats</h3>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Flux d'activité en temps réel</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors">
                    <ArrowUpRight size={18} />
                </button>
            </div>

            {/* Scrollable Content Stream */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
                {latestPurchases.map((purchase) => (
                    <div
                        key={purchase.id}
                        className="p-3 sm:p-4 flex flex-row items-center justify-between hover:bg-red-200/70  gap-3"
                    >
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-zinc-800 truncate">
                                {purchase.item}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] sm:text-xs text-zinc-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {purchase.category}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                    {purchase.time}
                                </span>
                            </div>
                        </div>

                        {/* Pricing & Status Meta */}
                        <div className="text-right flex flex-col items-end justify-center shrink-0">
                            <span className="text-xs sm:text-sm font-bold font-mono text-zinc-900">
                                {purchase.price}
                            </span>
                            <span className={`text-[10px] font-medium mt-0.5 ${purchase.status === "Livré" ? "text-green-600" :
                                purchase.status === "En cours" ? "text-amber-600" : "text-gray-500"
                                }`}>
                                {purchase.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}