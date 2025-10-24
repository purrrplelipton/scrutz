import { Icon } from "@iconify-icon/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link, NavLink, Outlet } from "react-router";
import { ScrutzIcon, ScrutzText } from "~/assets/svgs";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

export default function AppLayout() {
  return (
    <>
      <aside className="grow overflow-auto w-1/5 max-w-2xs bg-[#F0F4F4] flex flex-col">
        <header className="px-5">
          <div className="flex items-center h-20">
            <Link to="/" className="flex items-center gap-4">
              <ScrutzIcon className="hidden lg:block text-5xl w-[1em]" />
              <ScrutzText className="text-[6.5rem] w-[1em]" />
            </Link>
          </div>
        </header>
        <div className="p-5 grow overflow-auto flex flex-col">
          <nav className="flex flex-col items-stretch gap-4 *:flex *:items-center *:aria-[current='page']:text-[#247B7B] *:aria-[current='page']:bg-white *:rounded *:px-8 *:py-2 *:text-sm *:*:first:text-2xl *:font-medium *:aria-[current='page']:font-semibold *:gap-2">
            <NavLink
              to="/new-campaign"
              className="mb-6 bg-[#247B7B]! text-white! justify-center"
            >
              <Icon icon="material-symbols:add" />
              <span>New Campaign</span>
            </NavLink>
            <NavLink to="/">
              <Icon icon="ri:dashboard-2-line" />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/campaign">
              <Icon icon="material-symbols:campaign-outline" />
              <span>Campaign</span>
            </NavLink>
            <NavLink inert to="/feeds">
              <Icon icon="iconoir:rss-feed" />
              <span>Feeds</span>
            </NavLink>
            <NavLink inert to="/brand-health">
              <Icon icon="material-symbols:home-health-outline-rounded" />
              <span>Brand Health</span>
            </NavLink>
            <NavLink inert to="/influencers">
              <Icon icon="uil:users-alt" />
              <span>Influencers</span>
            </NavLink>
            <NavLink inert to="/market-intelligence" className="mb-2">
              <Icon icon="fluent-mdl2:insights" />
              <span>Market Intelligence</span>
            </NavLink>
            <NavLink inert to="/account-settings">
              <Icon icon="ep:setting" />
              <span>Account Settings</span>
            </NavLink>
          </nav>
          <div className="bg-white rounded text-center px-10 py-7 my-auto">
            <Icon
              icon="material-symbols:help-outline"
              className="text-2xl inline-block text-[#247B7B]"
            />
            <p className="text-sm bg-clip-text text-transparent bg-linear-to-r from-[#247B7B] to-[#3B247B] font-semibold py-1">
              Need help?
            </p>
            <p className="font-medium text-xs">
              We&apos;re readily available to provide help
            </p>
            <Button
              variant="outline"
              type="button"
              className="font-semibold px-6 py-1.75 mt-4 text-xs"
            >
              Get help
            </Button>
          </div>
        </div>
      </aside>
      <main className="grow overflow-auto flex flex-col">
        <header className="border-b border-b-[#F3F3F3]">
          <div className="h-20 flex items-center justify-between px-5 container">
            <InputGroup className="max-w-72">
              <InputGroupInput type="search" placeholder="Search" />
              <InputGroupAddon>
                <Icon icon="material-symbols:search" />
              </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center gap-2">
              <button type="button">
                <Icon icon="ic:outline-notifications" className="text-2xl" />
              </button>
              <div className="flex items-center gap-3">
                <hr className="self-stretch border-t-0 border-r border-[#F0F4F4] mr-1 h-auto my-0.5" />
                <Avatar className="size-9">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm"
                >
                  <span>BigTech</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className="text-2xl text-[#247B7B]"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="p-5 container mx-auto flex flex-col grow overflow-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
