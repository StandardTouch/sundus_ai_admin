import { LineChart } from "lucide-react";

export default function ResponseTimeChart() {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-[var(--admin-text)]">Response Time Trend</h3>
      <div className="h-40 sm:h-48 flex items-center justify-center text-[var(--admin-text-dim)] text-sm">
        <LineChart className="w-6 h-6 mr-2 text-[var(--admin-secondary-light)]" />
        <span className="hidden sm:inline">Line chart placeholder (backend data integration ready)</span>
        <span className="sm:hidden">Chart placeholder</span>
      </div>
    </div>
  );
}

