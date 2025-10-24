import { Icon } from "@iconify-icon/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

export default function Overview() {
  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <p className="font-bold font-general-sans text-2xl text-[#247B7B]">
            Overview
          </p>
          <div>
            <button
              type="button"
              className="text-sm font-semibold text-[#247B7B] bg-[#F0F4F4] rounded py-2.5 px-8 flex items-center gap-2"
            >
              <Icon icon="uil:export" className="text-xl" />
              <span>Export</span>
            </button>
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
        <Link
          to="/new-campaign"
          className="inline-flex items-center gap-2.5 text-white bg-[#247B7B] rounded px-8.5 py-2.5 text-sm"
        >
          <Icon icon="material-symbols:add" className="text-xl" />
          <span>New Campaign</span>
        </Link>
      </div>
    </>
  );
}
