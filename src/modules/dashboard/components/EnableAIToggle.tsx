import { useState, useEffect } from "react";
import { getWebhookStatus, toggleWebhookStatus } from "@/lib/api/settings";
import { showSuccess, showError } from "@/lib/utils/toast";
import { Loader2 } from "lucide-react";

export default function EnableAIToggle() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch initial status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const response = await getWebhookStatus();
        if (response.success) {
          setIsEnabled(response.data.value);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch AI status";
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // Handle toggle
  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      const response = await toggleWebhookStatus();
      if (response.success) {
        setIsEnabled(response.data.value);
        showSuccess(
          response.data.value ? "WhatsApp AI enabled" : "WhatsApp AI disabled"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to toggle AI status";
      showError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg">
        <Loader2 className="w-4 h-4 text-[var(--admin-text-muted)] animate-spin" />
        <span className="text-sm text-[var(--admin-text-muted)]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg">
      <span className="text-sm font-medium text-[var(--admin-text)]">Enable AI</span>
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary-dark)] focus:ring-offset-2 ${
          isEnabled
            ? "bg-[var(--admin-primary)]"
            : "bg-[var(--admin-border)]"
        } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={isEnabled ? "Disable AI" : "Enable AI"}
        role="switch"
        aria-checked={isEnabled}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            isEnabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      {isUpdating && (
        <Loader2 className="w-4 h-4 text-[var(--admin-text-muted)] animate-spin" />
      )}
    </div>
  );
}

