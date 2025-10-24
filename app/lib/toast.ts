/**
 * Creative Toast System with Sonner
 *
 * Features:
 * - Themed toasts with icons and colors
 * - Auto-dismissing with custom durations
 * - Action buttons (undo, retry, etc.)
 * - Promise-based toasts for async operations
 * - Rich content support
 */

import { type ExternalToast, toast as sonnerToast } from "sonner";

// Custom toast themes
const themes = {
  success: {
    icon: "✓",
    className: "bg-green-50 border-green-200 text-green-900",
    duration: 4000,
  },
  error: {
    icon: "✕",
    className: "bg-red-50 border-red-200 text-red-900",
    duration: 6000,
  },
  warning: {
    icon: "⚠",
    className: "bg-yellow-50 border-yellow-200 text-yellow-900",
    duration: 5000,
  },
  info: {
    icon: "ℹ",
    className: "bg-blue-50 border-blue-200 text-blue-900",
    duration: 4000,
  },
  loading: {
    icon: "⏳",
    className: "bg-gray-50 border-gray-200 text-gray-900",
    duration: Number.POSITIVE_INFINITY,
  },
} as const;

interface ToastOptions extends ExternalToast {
  /** Custom icon override */
  icon?: string;
  /** Undo callback */
  onUndo?: () => void;
  /** Retry callback */
  onRetry?: () => void;
  /** View details callback */
  onView?: () => void;
}

/**
 * Show a success toast
 */
function success(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    ...options,
    duration: options?.duration ?? themes.success.duration,
    icon: options?.icon ?? themes.success.icon,
    classNames: {
      toast: themes.success.className,
    },
  });
}

/**
 * Show an error toast with retry option
 */
function error(message: string, options?: ToastOptions) {
  const { onRetry, ...restOptions } = options || {};

  return sonnerToast.error(message, {
    ...restOptions,
    duration: restOptions?.duration ?? themes.error.duration,
    icon: restOptions?.icon ?? themes.error.icon,
    classNames: {
      toast: themes.error.className,
    },
    action: onRetry
      ? {
          label: "Retry",
          onClick: onRetry,
        }
      : undefined,
  });
}

/**
 * Show a warning toast
 */
function warning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    ...options,
    duration: options?.duration ?? themes.warning.duration,
    icon: options?.icon ?? themes.warning.icon,
    classNames: {
      toast: themes.warning.className,
    },
  });
}

/**
 * Show an info toast
 */
function info(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    ...options,
    duration: options?.duration ?? themes.info.duration,
    icon: options?.icon ?? themes.info.icon,
    classNames: {
      toast: themes.info.className,
    },
  });
}

/**
 * Show a loading toast that can be updated
 */
function loading(message: string, options?: ToastOptions) {
  return sonnerToast.loading(message, {
    ...options,
    icon: options?.icon ?? themes.loading.icon,
    classNames: {
      toast: themes.loading.className,
    },
  });
}

/**
 * Toast for async promises with automatic state updates
 */
function promise<T>(
  promise: Promise<T> | (() => Promise<T>),
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  },
  options?: ToastOptions
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    ...options,
  });
}

/**
 * Show a toast with undo functionality
 */
function undoable(message: string, onUndo: () => void, options?: ToastOptions) {
  return sonnerToast.success(message, {
    ...options,
    duration: options?.duration ?? 5000,
    icon: options?.icon ?? themes.success.icon,
    action: {
      label: "Undo",
      onClick: onUndo,
    },
    classNames: {
      toast: themes.success.className,
    },
  });
}

/**
 * Dismiss a specific toast or all toasts
 */
function dismiss(toastId?: string | number) {
  sonnerToast.dismiss(toastId);
}

/**
 * Custom toast for API operations
 */
function api(
  operation: "create" | "update" | "delete",
  resource: string,
  status: "success" | "error",
  details?: string
) {
  const messages = {
    create: {
      success: `${resource} created successfully`,
      error: `Failed to create ${resource}`,
    },
    update: {
      success: `${resource} updated successfully`,
      error: `Failed to update ${resource}`,
    },
    delete: {
      success: `${resource} deleted successfully`,
      error: `Failed to delete ${resource}`,
    },
  };

  const message = messages[operation][status];
  const description = details || undefined;

  if (status === "success") {
    return success(message, { description });
  }
  return error(message, { description });
}

/**
 * Show a custom toast with rich content
 */
function custom(
  content: (id: string | number) => React.ReactElement,
  options?: ToastOptions
) {
  return sonnerToast.custom(content, options);
}

/**
 * Batch multiple toasts (useful for bulk operations)
 */
function batch(
  messages: Array<{ type: "success" | "error"; message: string }>,
  summary?: string
) {
  const successCount = messages.filter((m) => m.type === "success").length;
  const errorCount = messages.filter((m) => m.type === "error").length;

  if (summary) {
    if (errorCount === 0) {
      success(summary);
    } else if (successCount === 0) {
      error(summary);
    } else {
      warning(summary);
    }
  } else {
    const summaryMessage = `${successCount} succeeded, ${errorCount} failed`;
    if (errorCount === 0) {
      success(summaryMessage);
    } else {
      warning(summaryMessage);
    }
  }
}

/**
 * Creative themed toasts for specific actions
 */
const themed = {
  /** Campaign-specific toasts */
  campaign: {
    created: () =>
      success("🎉 Campaign launched successfully!", {
        description: "Your campaign is now live and tracking",
      }),
    updated: () =>
      success("✨ Campaign updated", {
        description: "Changes saved successfully",
      }),
    deleted: () =>
      undoable(
        "🗑️ Campaign deleted",
        () => {
          info("Undo functionality coming soon!");
        },
        { description: "This action can be undone" }
      ),
  },

  /** User action toasts */
  user: {
    login: (username: string) => success(`Welcome back, ${username}! 👋`),
    logout: () => info("See you soon! 👋"),
    profileUpdated: () => success("Profile updated successfully ✓"),
  },

  /** Data sync toasts */
  sync: {
    start: () => loading("Syncing data..."),
    complete: () => success("Data synced ✓"),
    failed: (retry: () => void) => error("Sync failed", { onRetry: retry }),
  },
};

/**
 * Main toast export
 */
export const toast = {
  success,
  error,
  warning,
  info,
  loading,
  promise,
  undoable,
  dismiss,
  api,
  custom,
  batch,
  themed,
};
