import { Icon } from "@iconify-icon/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

// Lazy load the heavy Lottie library
const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((module) => ({
    default: module.DotLottieReact,
  }))
);

function Home() {
  return (
    <AppLayout>
      <header>
        <div className="flex items-center justify-between">
          <p className="font-bold font-general-sans text-2xl text-teal-600">
            Overview
          </p>
          <div>
            <Button
              type="button"
              variant="ghost"
              className="px-8 font-semibold"
            >
              <Icon icon="uil:export" className="text-xl" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </header>
      <div className={cn("grow overflow-auto", "content-center text-center")}>
        <Suspense
          fallback={
            <div className="mx-auto flex h-104 max-w-104 items-center justify-center">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-4xl text-teal-600"
              />
            </div>
          }
        >
          <DotLottieReact
            className="mx-auto max-w-104"
            src="/lotties/empty.lottie"
            loop
            autoplay
          />
        </Suspense>
        <p className="mt-11 mb-9 font-semibold text-sm">
          No activity yet. Create a new campaign to get started
        </p>
        <Link to="/campaigns/new">
          <Button type="button" className="gap-2.5 px-8.25">
            <Icon icon="material-symbols:add" className="text-xl" />
            <span>New Campaign</span>
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
