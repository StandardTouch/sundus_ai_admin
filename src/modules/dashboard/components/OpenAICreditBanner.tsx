import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { getOpenAICreditStatus } from "@/lib/api/settings";

export default function OpenAICreditBanner() {
  const [creditStatus, setCreditStatus] = useState<{
    credits_available: boolean;
    recharge_required: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchCreditStatus = async () => {
      try {
        setIsLoading(true);
        const response = await getOpenAICreditStatus();
        if (response.success) {
          setCreditStatus(response.data);
        }
      } catch (error: any) {
        // Silently fail - don't show error if endpoint doesn't exist or fails
        console.error("Failed to fetch OpenAI credit status:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

  // Don't show banner if loading, dismissed, or credits are available
  if (isLoading || isDismissed || !creditStatus) {
    return null;
  }

  // Only show if recharge is required (credits not available)
  if (!creditStatus.recharge_required && creditStatus.credits_available) {
    return null;
  }

  return (
    <div className="bg-red-500 text-white px-4 py-3 mb-6 rounded-lg flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3 flex-1">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm sm:text-base">
            Emergency: No credits available
          </p>
          <p className="text-xs sm:text-sm text-red-100 mt-0.5">
            OpenAI credits have been depleted. Please recharge immediately.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={handleRecharge}
          className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
          aria-label="Recharge now"
        >
          <span>Recharge Now</span>
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
  );
}

