import React from "react";
import {
  CheckCircle2,
  MessageCircle,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { ProposalCardHeader, ProposalVideoPitch } from "./ProposalParts";
import {
  getVideoPitchMedia,
} from "../../../utils/proposalUtils";

const BIO_MAX_CHARACTERS = 250;

function truncateWords(text, maxCharacters = BIO_MAX_CHARACTERS) {
  if (!text) return "";
  const str = String(text).trim();
  if (str.length <= maxCharacters) {
    return str;
  }
  return `${str.slice(0, maxCharacters).trimEnd()}...`;
}

function ProposalSidebar({
  proposal,
  onAccept,
  onDecline,
  onSendMessage,
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 lg:min-w-[220px]">
      {proposal.status === "pending" ? (
        <div className="mt-4 space-y-2">
          <Button
            type="button"
            className="h-10 w-full gap-2 rounded-lg bg-emerald-600 text-sm hover:bg-emerald-700"
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(proposal);
            }}
          >
            <UserPlus className="h-4 w-4" />
            Accept Proposal
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full gap-2 rounded-lg border-red-200 text-sm text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDecline?.(proposal);
            }}
          >
            <UserMinus className="h-4 w-4" />
            Decline
          </Button>
        </div>
      ) : null}

      {proposal.status === "accepted" ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Proposal accepted
          </div>
          <Button
            type="button"
            className="h-10 w-full gap-2 rounded-lg bg-[#1E60DB] text-sm hover:bg-[#1850c4]"
            onClick={(e) => {
              e.stopPropagation();
              onSendMessage?.(proposal);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Send Message
          </Button>
        </div>
      ) : null}

      {proposal.status === "rejected" ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-600">
          <X className="h-4 w-4 shrink-0" />
          Proposal declined
        </div>
      ) : null}
    </div>
  );
}

export default function ProposalCard({
  proposal,
  expanded,
  onToggle,
  onViewCreator,
  onAccept,
  onDecline,
  onSendMessage,
}) {
  const videoPitch = getVideoPitchMedia(proposal.applicationMedia);

  return (
    <article
      className={`rounded-xl border bg-white p-4 transition-colors md:p-5 ${
        expanded ? "border-[#1E60DB]" : "border-gray-200"
      }`}
    >
      <ProposalCardHeader
        proposal={proposal}
        expanded={expanded}
        onToggle={onToggle}
        onViewCreator={onViewCreator}
      />

      {expanded ? (
        <div className="mt-5 flex flex-col gap-5 border-t border-gray-100 pt-5 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Creator Bio
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                {truncateWords(proposal.bio) || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Proposal Pitch
              </p>
              <div className="mt-1.5 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                &ldquo;{proposal.pitch || "No pitch provided."}&rdquo;
              </div>
            </div>
            <ProposalVideoPitch media={videoPitch} />
          </div>
          <ProposalSidebar
            proposal={proposal}
            onAccept={onAccept}
            onDecline={onDecline}
            onSendMessage={onSendMessage}
          />
        </div>
      ) : null}
    </article>
  );
}
