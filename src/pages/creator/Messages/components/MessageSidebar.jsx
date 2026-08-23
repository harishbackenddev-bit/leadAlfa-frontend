import MessageItem from './MessageItem';

export default function MessageSidebar({ messages, selectedMessageId, onSelectMessage, searchQuery, setSearchQuery }) {
  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-4 border-b border-gray-200">
        <h1 className="text-3xl font-anton font-extrabold text-gray-900 mb-4 mt-3">Messages
</h1>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search in messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full bg-gray-100 pl-10 pr-3 py-4 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-4 py-1">
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