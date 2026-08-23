const normalizeTagItem = (item) => {
  if (item === null || item === undefined) return "";

  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item);

  if (typeof item === "object") {
    const value = item.label || item.name || item.value || item.title || "";
    return String(value).trim();
  }

  return "";
};

const TagList = ({ items = [] }) => {
  const safeItems = (Array.isArray(items) ? items : [])
    .map(normalizeTagItem)
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {safeItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex items-center h-[28px] px-3 bg-[#f0f7ff] text-[#0353a4] rounded-full font-['Manrope:Medium',sans-serif] text-[12px] capitalize"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default TagList;
