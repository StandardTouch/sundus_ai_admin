import { X } from "lucide-react";
import { SupportPhoneNumber, ToolsManagement } from "@/modules/settings/components";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)] sticky top-0 bg-[var(--admin-bg-secondary)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-sm text-[var(--admin-text-muted)]">
            Manage application settings and configurations
          </p>

          {/* Support Phone Number */}
          <SupportPhoneNumber />

          {/* Tools Management */}
          <ToolsManagement />
        </div>
      </div>
    </div>
  );
}

