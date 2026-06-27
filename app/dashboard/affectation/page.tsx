"use client";

import { motion } from "framer-motion";

export default function AffectationPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen"
        >
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Affectation</h1>
            <p className="text-gray-700 dark:text-gray-300">Cette section affichera les affectations.</p>
        </motion.div>
    );
}

