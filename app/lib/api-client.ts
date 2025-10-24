/**
 * API Client with Axios
 *
 * Advanced HTTP client with:
 * - Automatic retry with exponential backoff
 * - Request/Response interceptors
 * - Automatic toast notifications
 * - Request cancellation
 * - Request deduplication
 * - Automatic token refresh
 * - Typed responses
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "~/lib/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Extend Axios config to include custom metadata
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
    _retryCount?: number;
    showToast?: boolean;
    deduplicate?: boolean;
  }
}

interface ApiClientConfig extends AxiosRequestConfig {
  /** Show toast notifications automatically */
  showToast?: boolean;
  /** Enable request deduplication */
  deduplicate?: boolean;
}

// Pending requests map for deduplication
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Generate request key for deduplication
 */
function getRequestKey(config: InternalAxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(retryCount: number): number {
  return Math.min(1000 * 2 ** retryCount, 10000);
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Add auth token, track requests, handle deduplication
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    config.metadata = {
      startTime: Date.now(),
    };

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handle errors, log performance, auto-retry
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log request duration in dev mode
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(
        `✓ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("auth_token", data.accessToken);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Auto-retry on network errors or 5xx errors
    const retryCount = originalRequest._retryCount || 0;
    const shouldRetry =
      retryCount < 3 && (!error.response || error.response.status >= 500);

    if (shouldRetry) {
      originalRequest._retryCount = retryCount + 1;
      const delay = getRetryDelay(retryCount);

      if (import.meta.env.DEV) {
        console.log(
          `⟳ Retrying request (${retryCount + 1}/3) after ${delay}ms...`
        );
      }

      await sleep(delay);
      return axiosInstance(originalRequest);
    }

    // Handle network errors
    if (!error.response) {
      if (originalRequest.showToast !== false) {
        toast.error("Network error", {
          description: "Please check your internet connection",
        });
      }
      return Promise.reject(
        new ApiError("Network error", 0, undefined, error.code)
      );
    }

    // Show toast for errors
    if (originalRequest.showToast !== false) {
      const errorMessage =
        (error.response.data as { message?: string })?.message || error.message;
      toast.error("Request failed", {
        description: errorMessage,
      });
    }

    // Transform error
    const apiError = new ApiError(
      (error.response.data as { message?: string })?.message || error.message,
      error.response.status,
      error.response.data,
      error.code
    );

    return Promise.reject(apiError);
  }
);

/**
 * Make API request with optional deduplication
 */
async function request<T>(
  endpoint: string,
  config: ApiClientConfig = {}
): Promise<T> {
  const { showToast = false, deduplicate = false, ...axiosConfig } = config;

  // Build full Axios config
  const fullConfig: InternalAxiosRequestConfig = {
    ...axiosConfig,
    url: endpoint,
    showToast,
    deduplicate,
  } as InternalAxiosRequestConfig;

  // Handle request deduplication
  if (deduplicate) {
    const requestKey = getRequestKey(fullConfig);
    const existingRequest = pendingRequests.get(requestKey);

    if (existingRequest) {
      return existingRequest as Promise<T>;
    }

    const requestPromise = axiosInstance
      .request<T>(fullConfig)
      .then((response) => {
        pendingRequests.delete(requestKey);
        return response.data;
      })
      .catch((error) => {
        pendingRequests.delete(requestKey);
        throw error;
      });

    pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  // Normal request
  const response = await axiosInstance.request<T>(fullConfig);
  return response.data;
}

/**
 * API client with convenience methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: ApiClientConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, config?: ApiClientConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "POST",
      data,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, config?: ApiClientConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PUT",
      data,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown, config?: ApiClientConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PATCH",
      data,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: ApiClientConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};

/**
 * Helper to build query keys for React Query
 */
export const queryKeys = {
  campaigns: {
    all: ["campaigns"] as const,
    lists: () => [...queryKeys.campaigns.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.campaigns.lists(), filters] as const,
    details: () => [...queryKeys.campaigns.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  marketIntelligence: {
    all: ["market-intelligence"] as const,
    lists: () => [...queryKeys.marketIntelligence.all, "list"] as const,
    details: () => [...queryKeys.marketIntelligence.all, "detail"] as const,
  },
} as const;

/**
 * Create an abort controller for request cancellation
 */
export function createAbortSignal() {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    abort: () => controller.abort(),
  };
}
