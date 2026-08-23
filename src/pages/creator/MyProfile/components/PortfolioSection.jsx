import React, { useState } from "react";
import AddPortfolioItem from "./AddPortfolioItem";

export default function PortfolioSection({ user, profile }) {
  const [activeTab, setActiveTab] = useState("photos");
  const portfolioItems = profile?.media?.portfolio || [];
  const photos = portfolioItems.filter(
    (item) => item.mediaDetails.type === "image"
  );
  const videos = portfolioItems.filter(
    (item) => item.mediaDetails.type === "video"
  );

  const isEmpty =
    activeTab === "photos" ? photos.length === 0 : videos.length === 0;
  const [showAddModal, setShowAddModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-xl font-anton text-gray-900">
            Portfolio
          </h4>
          <p className="text-sm text-gray-500">
            Showcase your best work and creative projects
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 main-btn text-white rounded-full text-sm transition"
        >
          <span className="text-lg leading-none">+</span> Add Portfolio
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === "photos"
              ? "bg-white text-gray-900"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === "videos"
              ? "bg-white text-gray-900"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          Videos
        </button>
      </div>

      {/* Content area */}
      {isEmpty ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#1E60DB]"
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
          </div>
          <p className="text-gray-900 font-medium mb-1">No {activeTab} yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Start building your portfolio by adding your first{" "}
            {activeTab === "photos" ? "photo" : "video"}
          </p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E60DB] text-white rounded-full text-sm hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Add Your First{" "}
            {activeTab === "photos" ? "Photo" : "Video"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(activeTab === "photos" ? photos : videos).map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-sm"
            >
              {/* You can customize rendering for photo/video item here */}
              <img
                src={item.mediaDetails.url}
                alt={item.mediaDetails.name || "Portfolio"}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-xs text-gray-700">
                {item.mediaDetails.name || ""}
              </div>
            </div>
          ))}
        </div>
      )}
      {showAddModal && (
        <AddPortfolioItem
          isOpen={showAddModal}
          onClose={closeAddModal}
          initialType={activeTab === "photos" ? "photo" : "video"}
        />
      )}
    </div>
  );
}
