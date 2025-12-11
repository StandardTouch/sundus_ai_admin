import { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import MessageVolumeChart from "../components/MessageVolumeChart";
import ResponseTimeChart from "../components/ResponseTimeChart";
import RecentConversations from "../components/RecentConversations";
import DashboardHeader from "../components/DashboardHeader";
import { DashboardSkeleton } from "../components/shimmer";
import { getDashboardData } from "@/lib/api/dashboard";
import {
  transformStatsData,
  transformRecentConversations,
  transformMessageVolume,
  transformResponseTimeTrend,
} from "../utils/dashboardUtils";
import { showError } from "@/lib/utils/toast";
import type { DashboardData } from "@/lib/api/dashboard";

interface DashboardProps {
  onMenuClick: () => void;
}

export default function Dashboard({ onMenuClick }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardData();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          const errorMsg = "Failed to load dashboard data. Please try again later.";
          setError(errorMsg);
          showError(errorMsg);
        }
      } catch (err: any) {
        // Log error details to console for debugging
        console.error("Dashboard API Error:", {
          message: err.message,
          response: err.response,
          responseData: err.response?.data,
          responseStatus: err.response?.status,
          responseHeaders: err.response?.headers,
          request: err.request,
          config: err.config,
        });
        
        let errorMessage = "Failed to load dashboard data";
        
        if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          console.error(`API Error Status: ${status}`, err.response.data);
          
          if (status === 500) {
            errorMessage = "Server error. Please try again later or contact support.";
          } else if (status === 401) {
            errorMessage = "Unauthorized. Please log in again.";
          } else if (status === 403) {
            errorMessage = "Access denied. Admin privileges required.";
          } else if (status === 404) {
            errorMessage = "Dashboard endpoint not found.";
          } else {
            errorMessage = err.response.data?.error || err.response.data?.message || `Server error (${status})`;
          }
        } else if (err.request) {
          // Request made but no response received
          console.error("No response received:", err.request);
          errorMessage = "No response from server. Please check your connection.";
        } else {
          // Error setting up request
          console.error("Request setup error:", err.message);
          errorMessage = err.message || "An unexpected error occurred";
        }
        
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <DashboardHeader onMenuClick={onMenuClick} />
        <DashboardSkeleton />
      </main>
    );
  }

  if (error || !dashboardData) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <DashboardHeader onMenuClick={onMenuClick} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <p className="text-lg font-semibold text-[var(--admin-text)] mb-2">
              Failed to load dashboard
            </p>
            <p className="text-sm text-[var(--admin-text-muted)] mb-4">
              {error || "Unknown error"}
            </p>
            <button
              onClick={async () => {
                setError(null);
                setIsLoading(true);
                try {
                  const response = await getDashboardData();
                  if (response.success) {
                    setDashboardData(response.data);
                  } else {
                    setError("Failed to load dashboard data. Please try again later.");
                  }
                } catch (err: any) {
                  // Log error details to console for debugging
                  console.error("Dashboard API Error (Retry):", {
                    message: err.message,
                    response: err.response,
                    responseData: err.response?.data,
                    responseStatus: err.response?.status,
                    responseHeaders: err.response?.headers,
                    request: err.request,
                    config: err.config,
                  });
                  
                  let errorMessage = "Failed to load dashboard data";
                  
                  if (err.response) {
                    const status = err.response.status;
                    console.error(`API Error Status (Retry): ${status}`, err.response.data);
                    
                    if (status === 500) {
                      errorMessage = "Server error. Please try again later or contact support.";
                    } else {
                      errorMessage = err.response.data?.error || err.response.data?.message || `Server error (${status})`;
                    }
                  } else if (err.request) {
                    console.error("No response received (Retry):", err.request);
                    errorMessage = "No response from server. Please check your connection.";
                  } else {
                    console.error("Request setup error (Retry):", err.message);
                    errorMessage = err.message || "An unexpected error occurred";
                  }
                  
                  setError(errorMessage);
                  showError(errorMessage);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const statsData = transformStatsData(dashboardData);
  const messageVolumeData = transformMessageVolume(dashboardData.messageVolume);
  const responseTimeData = transformResponseTimeTrend(dashboardData.responseTimeTrend);
  const recentConversations = transformRecentConversations(dashboardData.recentConversations);

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
        <MessageVolumeChart data={messageVolumeData} />
        <ResponseTimeChart data={responseTimeData} />
      </div>

      {/* Recent Conversations */}
      <RecentConversations conversations={recentConversations} />
    </main>
  );
}

