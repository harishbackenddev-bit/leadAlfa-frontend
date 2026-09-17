import { Check } from "lucide-react";

function formatRelativeTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (elapsedMinutes < 1) return "now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

export default function MessageItem({ message, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[104px] w-full items-center gap-3 border-b border-l-4 px-5 py-4 text-left transition-colors ${
        isSelected
          ? "border-b-gray-200 border-l-[#0c7bb3] bg-[#e8f1fd]"
          : "border-b-gray-200 border-l-transparent bg-white hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        <img 
          src={message.avatar} 
          alt={message.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        {message.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-[#0f172a]">
            {message.name}
          </h3>
          <span className="shrink-0 text-xs text-[#8da0bb]">
            {formatRelativeTime(message.time)}
          </span>
        </div>
        {message.campaignTitle ? (
          <p className="mb-1 truncate text-sm text-[#52749b]">
            {message.campaignTitle}
          </p>
        ) : null}
        <p className="truncate text-sm text-[#8da0bb]">
          {message.lastMessage || message.message || "No messages yet"}
        </p>
      </div>
      
      {isSelected ? (
        <span className="h-2.5 w-2.5 shrink-0 rounded-full btn-gradient" />
      ) : (
        <Check className="h-4 w-4 shrink-0 text-[#0c7bb3]" strokeWidth={2} />
      )}
    </button>
  );
}
