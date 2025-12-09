import { toast } from "react-toastify";
import "./toast.css";

// Toast options interface
interface ToastOptions {
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number | undefined;
  theme?: "light" | "dark" | "colored";
}

// Toast configuration - Modern styling
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

/**
 * Show success toast notification
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

/**
 * Show error toast notification
 */
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

/**
 * Show info toast notification
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

/**
 * Show warning toast notification
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

/**
 * Show default toast notification
 */
export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, { ...defaultOptions, ...options });
};

