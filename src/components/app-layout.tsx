import { Icon } from "@iconify-icon/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useClickAway } from "@uidotdev/usehooks";
import { type PropsWithChildren, useEffect, useState } from "react";
import { ScrutzIcon, ScrutzText } from "~/assets/svgs";
import { SearchResults } from "~/components/search-results";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useSearch } from "~/lib/hooks/use-search";
import { cn } from "~/lib/utils";

export default function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchContainerRef = useClickAway<HTMLDivElement>(() => {
    setShowResults(false);
  });

  // Close sidebar on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: We specifically want to react to pathname changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    hasQuery,
    selectedIndex,
    handleKeyDown,
    resetSearch,
    totalCount,
    page,
    setPage,
    pageSize,
  } = useSearch();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);

    if (e.key === "Enter" && results.length > 0) {
      navigate({
        to: "/campaigns/$id",
        params: { id: results[selectedIndex].id },
      });
      resetSearch();
      setShowResults(false);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleSelect = () => {
    resetSearch();
    setShowResults(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 appearance-none bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-4/5 max-w-2xs flex-col overflow-auto bg-gray-100 transition-all duration-300 md:static",
          {
            "-translate-x-full invisible md:visible md:translate-x-0":
              !isSidebarOpen,
          }
        )}
      >
        <header className="px-5">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <ScrutzIcon className="hidden w-[1em] text-5xl lg:block" />
              <ScrutzText className="w-[1em] text-[6.5rem]" />
            </Link>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              className="md:hidden! rounded-full text-xl"
            >
              <Icon icon="material-symbols:close" />
            </Button>
          </div>
        </header>
        <div className="flex grow flex-col overflow-auto p-5">
          <nav className="mb-4 flex flex-col items-stretch gap-4 *:flex *:items-center *:gap-2 *:rounded *:px-8 *:py-2 *:font-medium *:text-sm *:transition-all *:duration-200 *:*:first:text-2xl *:hover:translate-x-1 *:hover:shadow-sm *:aria-[current='page']:bg-white *:aria-[current='page']:font-semibold *:aria-[current='page']:text-teal-600">
            <Link
              to="/campaigns/new"
              className="mb-6 justify-center bg-teal-600! text-white! hover:bg-teal-700! active:scale-95"
            >
              <Icon icon="material-symbols:add" />
              <span>New Campaign</span>
            </Link>
            <Link to="/">
              <Icon icon="ri:dashboard-2-line" />
              <span>Overview</span>
            </Link>
            <Link to="/campaigns">
              <Icon icon="material-symbols:campaign-outline" />
              <span>Campaigns</span>
            </Link>
            <button type="button" disabled>
              <Icon icon="iconoir:rss-feed" />
              <span>Feeds</span>
            </button>
            <button type="button" disabled>
              <Icon icon="material-symbols:home-health-outline-rounded" />
              <span>Brand Health</span>
            </button>
            <button type="button" disabled>
              <Icon icon="uil:users-alt" />
              <span>Influencers</span>
            </button>
            <button type="button" disabled className="mb-2">
              <Icon icon="fluent-mdl2:insights" />
              <span>Market Intelligence</span>
            </button>
            <button type="button" disabled>
              <Icon icon="ep:setting" />
              <span>Account Settings</span>
            </button>
          </nav>
          <div className="my-auto rounded bg-white px-10 py-7 text-center">
            <Icon
              icon="material-symbols:help-outline"
              className="inline-block text-2xl text-teal-600"
            />
            <p className="bg-linear-to-r from-teal-600 to-purple-700 bg-clip-text py-1 font-semibold text-sm text-transparent">
              Need help?
            </p>
            <p className="font-medium text-xs">
              We&apos;re readily available to provide help
            </p>
            <Button
              variant="outline"
              type="button"
              className="mt-4 px-6 py-1.75 font-semibold text-xs"
            >
              Get help
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex grow flex-col overflow-auto">
        <header className="border-b border-b-gray-200">
          <div className="container flex h-20 items-center justify-between gap-4 px-5">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="md:hidden! rounded-full text-xl"
            >
              <Icon icon="material-symbols:menu" />
            </Button>

            {/* Search */}
            <div ref={searchContainerRef} className="relative w-full max-w-72">
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="Search for anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setShowResults(true)}
                />
                <InputGroupAddon>
                  <Icon icon="material-symbols:search" />
                </InputGroupAddon>
              </InputGroup>
              {showResults && (
                <SearchResults
                  results={results}
                  isLoading={isLoading}
                  hasQuery={hasQuery}
                  onSelect={handleSelect}
                  selectedIndex={selectedIndex}
                  totalCount={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Icon icon="ic:outline-notifications" className="text-2xl" />
              </button>
              <button type="button" className="group flex items-center gap-3">
                <hr className="my-0.5 mr-1 h-auto self-stretch border-gray-100 border-t-0 border-r" />
                <Avatar>
                  <AvatarImage
                    src="https://github.com/purrrplelipton.png"
                    alt="@purrrplelipton"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hidden items-center gap-2 text-xs transition-all duration-200 group-hover:text-teal-600 md:flex lg:text-sm">
                  <span>purrrplelipton</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className="text-2xl text-teal-600"
                  />
                </div>
              </button>
            </div>
          </div>
        </header>
        <div className="container mx-auto flex grow flex-col overflow-auto p-5">
          {children}
        </div>
      </main>
    </>
  );
}
