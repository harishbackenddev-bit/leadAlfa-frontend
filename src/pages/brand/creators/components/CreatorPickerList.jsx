import React, { useMemo } from "react";
import { Search } from "lucide-react";

function CreatorAvatar({ creator }) {
  if (creator?.avatar) {
    return (
      <img
        src={creator.avatar}
        alt={creator.name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353A4] to-[#4b96e3] text-sm font-semibold text-white"
      aria-hidden
    >
      {creator?.initials ||
        String(creator?.name || "C")
          .charAt(0)
          .toUpperCase()}
    </span>
  );
}

export default function CreatorPickerList({
  creators = [],
  searchQuery = "",
  onSearchChange,
  mode = "single",
  selectedIds = [],
  onToggle,
  loading = false,
  conflictIds = [],
}) {
  const conflictSet = useMemo(() => {
    if (!Array.isArray(conflictIds) || conflictIds.length === 0) return null;
    return new Set(conflictIds.map((id) => Number(id)));
  }, [conflictIds]);
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return creators;
    return creators.filter((c) =>
      [c.name, c.handle, c.location].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [creators, searchQuery]);

  const renderEmpty = () => {
    if (loading) {
      return (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          Loading creators...
        </p>
      );
    }
    if (creators.length === 0) {
      return (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          No creators available
        </p>
      );
    }
    return (
      <p className="px-4 py-6 text-center text-sm text-gray-500">
        No creators match your search
      </p>
    );
  };

  return (
    <div>
      <div className="relative mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search creator by name..."
          disabled={loading}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-3 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
        <Search
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </div>

      <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200">
        {filtered.length === 0
          ? renderEmpty()
          : filtered.map((creator) => {
              const isSelected = selectedIds.includes(creator.id);
              const isConflict = conflictSet?.has(Number(creator.id));
              const rowBg = isConflict
                ? "bg-red-50/70 hover:bg-red-50"
                : isSelected
                  ? "bg-blue-50 hover:bg-blue-50"
                  : "hover:bg-gray-50";
              return (
                <button
                  key={creator.id}
                  type="button"
                  onClick={() => onToggle(creator.id, mode)}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${rowBg}`}
                >
                  {mode === "bulk" ? (
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                      aria-hidden
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                  ) : null}
                  <CreatorAvatar creator={creator} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {creator.name}
                      </p>
                      {isConflict ? (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          Conflict
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      {[creator.handle, creator.location]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
