import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, X } from "lucide-react";
import proposalsData from "./proposals";
import CampaignsSectionShell from "../components/CampaignsSectionShell";

export default function ProposalsAndOffers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const proposals = useMemo(() => {
    const countries = [
      "United Kingdom",
      "United States",
      "Spain",
      "Canada",
      "South Korea",
      "Australia",
    ];
    const ethnicities = ["Black", "Asian", "Hispanic", "White", "Asian", "White"];

    return proposalsData.flatMap((campaign, campaignIndex) =>
      campaign.proposals.map((proposal, proposalIndex) => {
        const idx = (campaignIndex + proposalIndex) % countries.length;
        return {
          ...proposal,
          creatorCode: `#12536${90 + proposal.id}`,
          country: proposal.country || countries[idx],
          ethnicity: proposal.ethnicity || ethnicities[idx],
          campaignId: campaign.campaignId,
        };
      }),
    );
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return proposals;
    const t = searchTerm.toLowerCase();
    return proposals.filter(
      (item) =>
        item.name.toLowerCase().includes(t) ||
        String(item.creatorCode).toLowerCase().includes(t) ||
        String(item.campaignId).toLowerCase().includes(t),
    );
  }, [proposals, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const handleDecision = (type, proposal) => {
    console.log(type, proposal);
  };

  return (
    <CampaignsSectionShell
      subtitle="Review and manage creator proposals and offers"
      searchPlaceholder="Search by creator, campaign, or ID..."
      searchValue={searchTerm}
      onSearchChange={(value) => {
        setSearchTerm(value);
        setPage(1);
      }}
      primaryAction={{
        label: "View Offers",
        onClick: () => navigate("/brand/campaigns/proposals/all"),
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      <section className="space-y-3">
        {paginated.map((proposal) => (
          <article
            key={`${proposal.campaignId}-${proposal.id}`}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm md:px-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <img
                    src={proposal.avatar}
                    alt={proposal.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#1E60DB]">{proposal.creatorCode}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[22px] font-semibold leading-tight text-gray-900 md:text-xl">
                        {proposal.name}
                      </h3>
                      {proposal.skills?.slice(0, 2).map((skill, i) => (
                        <span
                          key={`${skill}-${i}`}
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            i % 2 === 0
                              ? "bg-orange-50 text-orange-500"
                              : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-500">{proposal.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>
                    Ethnicity: <span className="font-medium text-gray-700">{proposal.ethnicity}</span>
                  </span>
                  <span>
                    Country: <span className="font-medium text-gray-700">{proposal.country}</span>
                  </span>
                </div>
              </div>

              <div className="mt-1 flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision("reject", proposal)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-400 hover:bg-red-100"
                  aria-label="Reject proposal"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("approve", proposal)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-500 hover:bg-green-100"
                  aria-label="Approve proposal"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}

        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 ${
              page === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                p === page
                  ? "bg-[#1E84D6] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 ${
              page === totalPages ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ›
          </button>
        </div>
      </section>
    </CampaignsSectionShell>
  );
}
