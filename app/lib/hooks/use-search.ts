import lodash from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useCampaigns } from "./use-campaigns";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedSetQuery = useCallback(
    lodash.debounce((value: string) => {
      setDebouncedQuery(value);
      setPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  const { data, isLoading, error } = useCampaigns({
    search: debouncedQuery,
    pageSize,
    page,
  });

  const results = data?.data || [];
  const totalCount = data?.total;

  useEffect(() => {
    if (debouncedQuery) {
      setSelectedIndex(0);
    }
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const resultCount = results.length;
    if (!resultCount) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % resultCount);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + resultCount) % resultCount);
        break;
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedIndex(0);
    setPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    error,
    hasQuery: debouncedQuery.length >= 2,
    selectedIndex,
    handleKeyDown,
    resetSearch,
    totalCount,
    page,
    setPage,
    pageSize,
    totalPages: totalCount ? Math.ceil(totalCount / pageSize) : 0,
  };
}
