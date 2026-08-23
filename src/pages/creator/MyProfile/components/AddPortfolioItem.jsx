import React, { useState, useRef, useEffect } from "react";

export default function AddPortfolioItem({
  isOpen,
  onClose,
  initialType = "photo",
}) {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setType(initialType);
    setTitle("");
    setFiles([]);
  }, [initialType, isOpen]);

  // lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const handleChoose = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleUpload = () => {
    console.log("Uploading", { type, title, files });
    // TODO: wire API upload
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden z-10">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-anton font-semibold">
              Add Portfolio Item
            </h3>
            <p className="text-sm text-gray-500">
              Upload your creative work to showcase in your portfolio
            </p>
          </div>
        </div>
        {/* Close button positioned at the top-right of the modal box */}
        <button
          onClick={onClose}
          aria-label="Close add portfolio dialog"
          className="absolute cursor-pointer top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-2 block">Type</label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setType("photo")}
              className={`flex-1 py-3 rounded-lg border-2 ${
                type === "photo"
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-1 text-sm text-blue-900">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Photo
              </div>
            </button>
            <button
              onClick={() => setType("video")}
              className={`flex-1 py-3 rounded-lg border-2 ${
                type === "video"
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-1 text-sm text-blue-900">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM4 6h8v12H4z"
                  />
                </svg>
                Video
              </div>
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-100 p-3 text-sm bg-gray-100 focus:outline-none focus:border-gray-500"
              placeholder="Enter title"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-700">Upload File</label>
              <span className="text-xs text-gray-400">Max 5 photos</span>
            </div>
            <div className="border-dashed border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="mb-3">
                {type === "photo" ? (
                  <svg
                    className="mx-auto w-10 h-10 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mx-auto w-10 h-10 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM4 6h8v12H4z"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Upload a {type === "photo" ? "photo" : "video"}
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={type === "photo" ? "image/*" : "video/*"}
                multiple
                className="hidden"
                onChange={onFileChange}
              />
              <button
                onClick={handleChoose}
                className="px-4 py-2 main-btn text-white rounded-full"
              >
                Choose File
              </button>
              {files.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  Selected: {files.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-full text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`px-6 py-3 rounded-full text-sm font-semibold ${
              files.length === 0 ? "bg-blue-100 text-white" : "main-btn"
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
