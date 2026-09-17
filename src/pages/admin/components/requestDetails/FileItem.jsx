import { Download, FileText, Video } from "lucide-react";

const FileItem = ({ name, type = "document", url = "#", onPreview }) => {
  const isPdf = /\.pdf$/i.test(url?.split("?")[0] || "") || name?.toLowerCase().endsWith(".pdf");
  const Icon = type === "video" ? Video : FileText;

  const handleClick = (e) => {
    if (onPreview) {
      e.preventDefault();
      onPreview({ url, title: name });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex max-w-md items-center justify-between rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
            isPdf
              ? "bg-[#fee2e2] text-[#ef4444]"
              : type === "video"
              ? "bg-[#dbeafe] text-[#2563eb]"
              : "bg-[#fef3c7] text-[#d97706]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-gray-800 group-hover:text-gray-900">
            {name}
          </div>
          <div className="text-[12px] font-normal text-gray-400">
            {isPdf ? "PDF Document" : type === "video" ? "Video file" : "Document"}
          </div>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        title="Open in new tab / Download"
      >
        <Download className="h-4.5 w-4.5" />
      </a>
    </div>
  );
};

export default FileItem;
