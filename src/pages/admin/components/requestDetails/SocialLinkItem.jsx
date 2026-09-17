import { ExternalLink } from "lucide-react";

const SocialLinkItem = ({ platform, value, url }) => {
  const targetUrl = url || value || "";
  const formattedUrl =
    targetUrl && !/^https?:\/\//i.test(targetUrl)
      ? `https://${targetUrl}`
      : targetUrl;

  return (
    <a
      href={formattedUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs sm:text-sm text-gray-500">{platform}</div>
        <div className="mt-0.5 font-medium text-[#1a1a1a] text-sm sm:text-base break-all">
          {value || targetUrl}
        </div>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-blue-600" />
    </a>
  );
};

export default SocialLinkItem;
