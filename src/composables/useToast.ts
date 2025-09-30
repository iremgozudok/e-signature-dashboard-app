import { useToast as usePrimeToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  customSummary?: string;
}

export function useToast() {
  const toast = usePrimeToast();
  const { t } = useI18n();

  const showToast = (options: ToastOptions) => {
    const {
      message,
      type = "success",
      duration = 3000,
      customSummary,
    } = options;

    const severity = type === "warning" ? "warn" : type;

    const summary = customSummary || t(`toast.${type}`);

    toast.add({
      severity,
      summary,
      detail: message,
      life: duration,
    });
  };

  const success = (message: string, duration?: number) => {
    showToast({ message, type: "success", duration });
  };

  const error = (message: string, duration?: number) => {
    showToast({ message, type: "error", duration });
  };

  const warning = (message: string, duration?: number) => {
    showToast({ message, type: "warning", duration });
  };

  const info = (message: string, duration?: number) => {
    showToast({ message, type: "info", duration });
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
}