import { Download, FileText, Video } from "lucide-react";

const iconMap = {
  video: Video,
  document: FileText,
};

const FileItem = ({ name, type = "document", url = "#" }) => {
  const Icon = iconMap[type] || FileText;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-500">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-base font-medium text-gray-800">{name}</div>
          <div className="text-sm text-gray-500">{type === "video" ? "Video file" : "Document"}</div>
        </div>
      </div>
      <Download className="h-4 w-4 text-gray-500" />
    </a>
  );
};

export default FileItem;
