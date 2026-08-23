export default function MessageBubble({ message, isOwn, showTime = true }) {
  // Treat both single-file messages and grouped media as "has media"
  const hasMedia = !!(
    (message && message.file) ||
    (message && message.fileType === 'media-group') ||
    (message && Array.isArray(message.files) && message.files.length > 0)
  );
  
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-2`}>
      {/* Message Content */}
      <div
        className={`max-w-xs lg:max-w-md ${
          hasMedia
            ? `bg-transparent p-0 ${isOwn ? 'ml-auto' : 'mr-auto'}`
            : isOwn
            ? 'bg-[rgba(30,96,219,0.15)] text-gray-900 rounded-xl rounded-tr-none px-4 py-4'
            : 'bg-gray-200 text-gray-900 rounded-xl rounded-tl-none px-4 py-4'
        }`}
      >
        {/* Single file image/video */}
        {message.file && message.fileType === 'image' ? (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={message.file}
              alt={message.fileName || 'Image'}
              className="w-full h-auto max-h-[300px] object-contain rounded-2xl"
            />
          </div>
        ) : null}

        {message.file && message.fileType === 'video' ? (
          <div className="overflow-hidden rounded-2xl">
            <video
              src={message.file}
              controls
              className="w-full h-auto max-h-[300px] object-contain rounded-2xl"
            />
          </div>
        ) : null}

        {/* Grouped media: show two-up layout when there are two files, otherwise grid.
            If there's only one file in the group, render it as a single media block so alignment works consistently. */}
        {message.fileType === 'media-group' && Array.isArray(message.files) ? (
          message.files.length === 1 ? (
            <div className="overflow-hidden rounded-2xl">
              {message.files[0].fileType === 'image' ? (
                <img src={message.files[0].file} alt={message.files[0].fileName || 'img-0'} className="w-full h-auto max-h-[300px] object-contain rounded-2xl" />
              ) : (
                <video src={message.files[0].file} controls className="w-full h-auto max-h-[300px] object-contain rounded-2xl" />
              )}
            </div>
          ) : (
            <div className={`mb-2 grid grid-cols-2 gap-4 ${message.files.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
              {message.files.map((file, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl">
                  {file.fileType === 'image' ? (
                    <img src={file.file} alt={file.fileName || `img-${idx}`} className="w-full h-auto max-h-[300px] object-contain rounded-2xl" />
                  ) : file.fileType === 'video' ? (
                    <video src={file.file} controls className="w-full h-auto max-h-[300px] object-contain rounded-2xl" />
                  ) : null}
                </div>
              ))}
            </div>
          )
        ) : null}
        
        {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
      </div>
      
      {/* Time - Outside bubble (show only when showTime is true) */}
      {showTime && (
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {message.time}
        </p>
      )}
    </div>
  );
}