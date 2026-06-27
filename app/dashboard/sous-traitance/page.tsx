function SousTraitancePage() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((month) => (
        <div key={month} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              M{month}/2024
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prévision de trésorerie
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {month * 125} K DT
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              à régler
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SousTraitancePage;