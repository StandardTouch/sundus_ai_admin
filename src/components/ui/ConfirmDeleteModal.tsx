import { X, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    isLoading?: boolean;
    warning?: ReactNode;
    maxWidth?: string;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Delete",
    isLoading = false,
    warning,
    maxWidth = "max-w-md",
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full ${maxWidth} shadow-xl`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">
                                {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    <div className="text-sm text-[var(--admin-text)] mb-4">
                        {description}
                    </div>

                    {warning && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <div className="text-xs text-red-400">
                                {warning}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-[var(--admin-border)]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
