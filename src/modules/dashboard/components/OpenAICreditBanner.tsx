import { useState, useEffect } from "react";
import { AlertTriangle, X, CheckCircle } from "lucide-react";
import { getOpenAICreditStatus, resetOpenAICreditStatus } from "@/lib/api/settings";
import { toast } from "react-toastify";

export default function OpenAICreditBanner() {
  const [creditStatus, setCreditStatus] = useState<{
    credits_available: boolean;
    recharge_required: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchCreditStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getOpenAICreditStatus();
      if (response.success) {
        setCreditStatus(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch OpenAI credit status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditStatus();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchCreditStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRecharge = () => {
    const phoneNumber = "917676079163";
    const message = "I need to recharge my openai credits for Sundus AI";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleResetStatus = async () => {
    try {
      setIsResetting(true);
      const response = await resetOpenAICreditStatus();
      if (response.success) {
        toast.success("Credits status updated successfully");
        setShowConfirmDialog(false);
        fetchCreditStatus(); // Refresh status
      } else {
        toast.error(response.message || "Failed to update credits status");
      }
    } catch (error: any) {
      toast.error("An error occurred while updating status");
      console.error("Reset status error:", error);
    } finally {
      setIsResetting(false);
    }
  };

  // Don't show banner if loading, dismissed, or credits are available
  if (isLoading || isDismissed || !creditStatus) {
    return null;
  }

  // Only show if recharge is required (credits not available)
  if (!creditStatus.recharge_required && creditStatus.credits_available) {
    return null;
  }

  return (
    <>
      <div className="bg-red-500 text-white px-4 py-3 mb-6 rounded-lg flex items-center justify-between gap-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">
              Emergency: No credits available
            </p>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              OpenAI credits have been depleted. Please recharge immediately to restore service.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleRecharge}
            className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-neutral-100 transition-colors font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            aria-label="Recharge now"
          >
            <span>Recharge Now</span>
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmDialog(true)}
            className="px-4 py-2 bg-red-600 text-white border border-red-400 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            aria-label="Already recharged"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">I Have Recharged</span>
            <span className="sm:hidden">Recharged</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Recharge</h3>
              <p className="text-gray-500 mb-8">
                Are you sure you have recharged the OpenAI credits? This will enable AI features for all users.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleResetStatus}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? "Updating..." : "Yes, I'm sure"}
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

