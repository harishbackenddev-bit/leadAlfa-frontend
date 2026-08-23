import { ExternalLink } from "lucide-react";

const SocialLinkItem = ({ platform, value, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
    >
      <div>
        <div className="text-sm text-gray-500">{platform}</div>
        <div className="font-['Manrope:SemiBold' font-medium sans-serif] text-[#1a1a1a] text-[16px] text-gray-800 text-xl">{value}</div>
      </div>
      <ExternalLink className="h-4 w-4 text-blue-600" />
    </a>
  );
};

export default SocialLinkItem;
