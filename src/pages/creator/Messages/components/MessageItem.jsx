export default function MessageItem({ message, isSelected, onSelect }) {
  return (
    <div 
      onClick={onSelect}
      className={`flex items-center gap-3 p-5 cursor-pointer transition-colors border-b border-gray-900 mb-1 ${isSelected ? 'rounded-lg' : ''}`}
      style={isSelected ? { backgroundColor: 'rgba(30,96,219,0.15)' } : undefined}
    >
      <div className="relative">
        <img 
          src={message.avatar} 
          alt={message.name}
          className="w-11 h-11 rounded-xl object-cover"
        />
        {message.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-1 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 truncate text-sm">{message.name}</h3>
          <span className="text-[12px] text-gray-500 flex-shrink-0">{message.time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{message.lastMessage}</p>
      </div>
      
      <div className="flex items-center">
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}