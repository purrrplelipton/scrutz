import { Icon } from "@iconify-icon/react";
import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
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

export default function AppLayout() {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useClickAway<HTMLDivElement>(() => {
    setShowResults(false);
  });

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
      navigate(`/campaign/${results[selectedIndex].id}`);
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
      <aside className="grow overflow-auto w-1/5 max-w-2xs bg-gray-100 flex flex-col">
        <header className="px-5">
          <div className="flex items-center h-20">
            <Link to="/" className="flex items-center gap-4">
              <ScrutzIcon className="hidden lg:block text-5xl w-[1em]" />
              <ScrutzText className="text-[6.5rem] w-[1em]" />
            </Link>
          </div>
        </header>
        <div className="p-5 grow overflow-auto flex flex-col">
          <nav className="flex flex-col items-stretch gap-4 *:flex *:items-center *:aria-[current='page']:text-teal-600 *:aria-[current='page']:bg-white *:rounded *:px-8 *:py-2 *:text-sm *:*:first:text-2xl *:font-medium *:aria-[current='page']:font-semibold *:gap-2 *:transition-all *:duration-200 *:hover:translate-x-1 *:hover:shadow-sm">
            <NavLink
              to="/new-campaign"
              className="mb-6 bg-teal-600! text-white! justify-center hover:bg-teal-700! active:scale-95"
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
              className="text-2xl inline-block text-teal-600"
            />
            <p className="text-sm bg-clip-text text-transparent bg-linear-to-r from-teal-600 to-purple-700 font-semibold py-1">
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
        <header className="border-b border-b-gray-200">
          <div className="h-20 flex items-center justify-between px-5 container">
            <div ref={searchContainerRef} className="relative w-full max-w-72">
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="Search for anything..."
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
              <div className="flex items-center gap-3">
                <hr className="self-stretch border-t-0 border-r border-gray-100 mr-1 h-auto my-0.5" />
                <Avatar>
                  <AvatarImage
                    src="https://github.com/purrrplelipton.png"
                    alt="@purrrplelipton"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm transition-all duration-200 hover:text-teal-600"
                >
                  <span>purrrplelipton</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className="text-2xl text-teal-600"
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
