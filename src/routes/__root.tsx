import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router";
import { lazy, type PropsWithChildren, Suspense, useState } from "react";
import { Toaster } from "sonner";
import appCss from "~/styles.css?url";

// Lazy load React Query Devtools only in development
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((module) => ({
          default: module.TanStackRouterDevtools,
        }))
      );

function RootComponent({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              classNames: {
                toast: "border shadow-lg rounded-lg",
                title: "font-semibold",
                description: "text-sm opacity-90",
                actionButton: "bg-teal-600 text-white",
                cancelButton: "bg-gray-100",
              },
            }}
          />
          {process.env.NODE_ENV === "development" && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
              <TanStackRouterDevtools />
            </Suspense>
          )}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" style={{ marginTop: "1rem", color: "#0066cc" }}>
          Go back home
        </Link>
      </div>
    );
  },
  head: () => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title: "Scrutz - Campaign Management Platform" },
        {
          name: "description",
          content:
            "Manage your campaigns, track performance, and analyze market intelligence with Scrutz.",
        },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Syne:wght@400..800&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/scrutz.icon.svg", type: "image/svg+xml" },
      ],
    };
  },
  shellComponent: RootComponent,
});
