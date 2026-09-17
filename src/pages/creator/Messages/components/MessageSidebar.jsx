import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageItem from "./MessageItem";

export default function MessageSidebar({ messages, selectedMessageId, onSelectMessage, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const query = searchQuery.trim().toLowerCase();
  const filteredMessages = messages.filter((message) =>
    [
      message.name,
      message.campaignTitle,
      message.lastMessage,
      message.message,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="h-[157px] shrink-0 border-b border-gray-200 px-6 pb-9 pt-7">
        <div className="mb-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-medium leading-none text-[#0f172a]">
            Messages
          </h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-[#8da0bb]" strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Search messages or campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block h-11 w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2 pl-10 pr-3 text-sm text-gray-700 placeholder:text-[#8da0bb] focus:border-[#0c7bb3] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMessages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isSelected={selectedMessageId === message.id}
            onSelect={() => onSelectMessage(message.id)}
          />
        ))}
      </div>
    </div>
  );
}
