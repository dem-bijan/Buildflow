"use client";

import { motion } from "framer-motion";
import TrendChart from "@/components/Trendchart";
import LatestPurchasesCard from "@/app/dashboard/timestamper";

export default function DashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="
                grid grid-cols-1 gap-4 px-4 
                xl:grid-cols-8
            "
        >
            <section className="grid grid-cols-2 gap-3  md:grid-cols-4 xl:col-span-8">
                <KpiCard title="Dettes Fournisseurs" value="$200 000" change="+32%" positive />
                <KpiCard title="Décaissements caisse" value="$357 263" change="+12%" positive />
                <KpiCard title="Dettes sous-traitants" value="$12 042" change="-24%" positive={false} />
                <KpiCard title="Paiements" value="$540 000" change="+30%" positive />
            </section>

            <section className="flex flex-col gap-3 xl:flex-row xl:col-span-8">
                <div className="flex-[5.5] min-w-0"><TrendChart /></div>
                <div className="flex-[2.5] min-w-0"><LatestPurchasesCard /></div>
            </section>

            <div className="xl:col-span-2 min-h-55 rounded-xl bg-white dark:bg-zinc-800 shadow">Widget A</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-blue-100 dark:bg-blue-950 shadow">Widget B</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-green-100 dark:bg-green-950 shadow">Widget C</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-yellow-100 dark:bg-yellow-950 shadow">Widget D</div>
            <div className="xl:col-span-4 min-h-55 rounded-xl bg-pink-100 dark:bg-pink-950 shadow">Widget E</div>
            <div className="xl:col-span-4 min-h-55 rounded-xl bg-pink-200 dark:bg-pink-900 shadow">Widget F</div>

            <div className="xl:col-span-2 min-h-55 rounded-xl bg-white dark:bg-zinc-800 shadow">Widget A</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-blue-100 dark:bg-blue-950 shadow">Widget B</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-green-100 dark:bg-green-950 shadow">Widget C</div>
            <div className="xl:col-span-2 min-h-55 rounded-xl bg-yellow-100 dark:bg-yellow-950 shadow">Widget D</div>
            <div className="xl:col-span-4 min-h-55 rounded-xl bg-pink-100 dark:bg-pink-950 shadow">Widget E</div>
            <div className="xl:col-span-4 min-h-55 rounded-xl bg-pink-200 dark:bg-pink-900 shadow">Widget F</div>
        </motion.div>
    );
}

function KpiCard({
    title,
    value,
    change,
    positive,
}: {
    title: string;
    value: string;
    change: string;
    positive: boolean;
}) {
    return (
        <div className="
            dark:bg-surface-card-dark bg-surface-card
            rounded-lg border border-edge-default dark-border-edge-default-dark dark:border-zinc-700
            shadow-md p-3 h-16
            flex flex-col justify-between transition-all duration-100 
        ">
            <div className="text-[10px] font-bold text-content-primary dark:text-content-primary-dark">
                {title}
            </div>
            <div className="flex items-center justify-between">
                <div className="text-base sm:text-lg font-bold font-mono text-content-secondary dark:text-content-secondary-dark">
                    {value}
                </div>
                <div className={`hidden lg:block text-xs font-semibold ${positive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                    }`}>
                    {change}
                </div>
            </div>
        </div>
    );
}