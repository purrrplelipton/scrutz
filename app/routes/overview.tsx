import { Icon } from "@iconify-icon/react";
import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Lazy load the heavy Lottie library
const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((module) => ({
    default: module.DotLottieReact,
  }))
);

export default function Overview() {
  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <p className="font-bold font-general-sans text-2xl text-teal-600">
            Overview
          </p>
          <div>
            <Button
              type="button"
              variant="ghost"
              className="font-semibold px-8"
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
            <div className="max-w-104 mx-auto h-104 flex items-center justify-center">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-4xl text-teal-600"
              />
            </div>
          }
        >
          <DotLottieReact
            className="max-w-104 mx-auto"
            src="/lotties/empty.lottie"
            loop
            autoplay
          />
        </Suspense>
        <p className="font-semibold text-sm mt-11 mb-9">
          No activity yet. Create anew campaign to get started
        </p>
        <Link to="/new-campaign">
          <Button type="button" className="px-8.25 gap-2.5">
            <Icon icon="material-symbols:add" className="text-xl" />
            <span>New Campaign</span>
          </Button>
        </Link>
      </div>
    </>
  );
}
