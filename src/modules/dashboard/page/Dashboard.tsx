import React from "react";
import StatsCard from "../components/StatsCard";
import MessageVolumeChart from "../components/MessageVolumeChart";
import ResponseTimeChart from "../components/ResponseTimeChart";
import RecentConversations from "../components/RecentConversations";
import DashboardHeader from "../components/DashboardHeader";
import { getStatsData } from "../utils/dashboardUtils";

interface DashboardProps {
  onMenuClick: () => void;
}

export default function Dashboard({ onMenuClick }: DashboardProps) {
  const statsData = getStatsData();

  // Debug: Check CSS variables in Dashboard
  React.useEffect(() => {
    const root = document.documentElement;
    const bgValue = getComputedStyle(root).getPropertyValue("--admin-bg").trim();
    const bgSecondary = getComputedStyle(root).getPropertyValue("--admin-bg-secondary").trim();
    const textValue = getComputedStyle(root).getPropertyValue("--admin-text").trim();
    
    console.log("=== Dashboard Component Debug ===");
    console.log("--admin-bg:", bgValue);
    console.log("--admin-bg-secondary:", bgSecondary);
    console.log("--admin-text:", textValue);
    console.log("HTML has dark class:", root.classList.contains("dark"));
  });

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <DashboardHeader onMenuClick={onMenuClick} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {statsData.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <MessageVolumeChart />
        <ResponseTimeChart />
      </div>

      {/* Recent Conversations */}
      <RecentConversations />
    </main>
  );
}

