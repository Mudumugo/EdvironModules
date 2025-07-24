import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Global state to track logout
let isGlobalLogout = false;

export const setGlobalLogout = (value: boolean) => {
  isGlobalLogout = value;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Block API requests during logout
  if (isGlobalLogout) {
    throw new Error("Request blocked during logout");
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Block requests during logout
    if (isGlobalLogout) {
      return null;
    }

    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of infinity for better performance
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: (failureCount, error) => {
        // Never retry during logout
        if (isGlobalLogout) return false;
        return false;
      },
      enabled: () => !isGlobalLogout, // Globally disable all queries during logout
    },
    mutations: {
      retry: false,
    },
  },
});
