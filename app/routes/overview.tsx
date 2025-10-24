import { Icon } from "@iconify-icon/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

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
        <DotLottieReact
          className="max-w-104 mx-auto"
          src="/lotties/empty.lottie"
          loop
          autoplay
        />
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
