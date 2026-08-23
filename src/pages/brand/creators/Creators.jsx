import React, { useEffect, useState } from "react";
import { Search, ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import CreatorsCard from "./components/CreatorsCard";
import CreatorsPagination from "./components/CreatorsPagination";
import CreatorVideoModal from "./components/CreatorVideoModal";
import CreatorsFilters, { emptyCreatorFilters } from "./components/CreatorsFilters";
import SendInviteModal from "./components/SendInviteModal";
import { useBrandCreators } from "./hooks/useBrandCreators";

export default function Creators() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [videoModal, setVideoModal] = useState({ open: false, url: "", title: "" });
  const [inviteCreatorId, setInviteCreatorId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 639;
  });
  const [draftFilters, setDraftFilters] = useState(emptyCreatorFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyCreatorFilters);
  const creatorsPerPage = 9;

  const {
    creators,
    industryOptions,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useBrandCreators({
    page: currentPage,
    limit: creatorsPerPage,
    search: searchQuery,
    filters: appliedFilters,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, appliedFilters]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const syncFiltersPanel = () => {
      setFiltersOpen(!mediaQuery.matches);
    };

    syncFiltersPanel();
    mediaQuery.addEventListener("change", syncFiltersPanel);

    return () => mediaQuery.removeEventListener("change", syncFiltersPanel);
  }, []);

  const handleViewDetails = (creatorId) => {
    navigate(`/brand/creators/${creatorId}/view`);
  };

  const handleSendInvite = (creatorId) => {
    if (!creatorId) return;
    setInviteCreatorId(creatorId);
  };

  const closeInviteModal = () => setInviteCreatorId(null);

  const handlePlayVideo = ({ url, title }) => {
    if (!url) return;
    setVideoModal({ open: true, url, title: title || "Creator video" });
  };

  const closeVideoModal = () => {
    setVideoModal({ open: false, url: "", title: "" });
  };

  const handleSeeInvites = () => navigate("/brand/creators/allInvites");

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setDraftFilters(emptyCreatorFilters);
    setAppliedFilters(emptyCreatorFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="mx-auto max-w-[19200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-['Manrope:Bold',sans-serif] text-[26px] font-bold text-[#1a1a1a] sm:text-[30px]">
              View Creators
            </h1>
            <p className="mt-1 font-['Manrope:Regular',sans-serif] text-[14px] text-[#64748b]">
              Explore creators and hire as per your convenience
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:min-w-[520px]">
            <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search creators by name..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-4 font-['Manrope:Regular',sans-serif] text-[14px] text-[#1e293b] outline-none transition focus:border-[#1E60DB] focus:ring-2 focus:ring-[#1E60DB]/20"
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border bg-white transition ml-auto ${
                filtersOpen || hasActiveFilters
                  ? "border-[#1E60DB] text-[#1E60DB]"
                  : "border-[#e5e7eb] text-[#64748b] hover:bg-[#f8fafc]"
              }`}
              aria-label="Toggle filters"
              aria-expanded={filtersOpen}
            >
              <ListFilter className="h-5 w-5" />
            </button>
</div>
            <Button
              type="button"
              onClick={handleSeeInvites}
              className="h-11 flex-shrink-0 rounded-lg bg-gradient-to-b from-[#0353a4] to-[#4b96e3] px-6 font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold sm:px-8"
            >
              See Invites
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen ? (
          <CreatorsFilters
            values={draftFilters}
            onChange={setDraftFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            onClose={() => setFiltersOpen(false)}
            industryOptions={industryOptions}
          />
        ) : null}

        {/* Creators grid */}
        {isLoading && (
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: creatorsPerPage }).map((_, index) => (
              <div
                key={`creator-loading-${index}`}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse"
              >
                <div className="aspect-[16/10] bg-gray-200 sm:aspect-[5/3]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </div>
                  <div className="h-10 rounded bg-gray-200" />
                  <div className="h-11 rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-white py-12 text-center">
            <p className="mb-4 text-red-500">
              {error?.message || "Unable to load creators right now."}
            </p>
            <Button type="button" onClick={refetch}>
              Try Again
            </Button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {!isLoading &&
            !isError &&
            creators.map((creator) => (
              <CreatorsCard
                key={creator.id}
                creator={creator}
                onViewDetails={handleViewDetails}
                onPlayVideo={handlePlayVideo}
                onSendInvite={handleSendInvite}
              />
            ))}
        </div>

        {!isLoading && !isError && creators.length === 0 && (
          <div className="rounded-2xl bg-white py-12 text-center">
            <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#64748b]">
              No creators found matching your search or filters.
            </p>
          </div>
        )}

        {!isLoading && isFetching && (
          <p className="mb-4 text-center text-sm text-[#64748b]">Refreshing creators...</p>
        )}

        {!isLoading && !isError && creators.length > 0 && (
          <CreatorsPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <CreatorVideoModal
        open={videoModal.open}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={closeVideoModal}
      />

      <SendInviteModal
        open={Boolean(inviteCreatorId)}
        onClose={closeInviteModal}
        presetCreatorId={inviteCreatorId}
      />
    </div>
  );
}
