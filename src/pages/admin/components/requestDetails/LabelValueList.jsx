const LabelValueList = ({ items = [] }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        // <div key={item.label} className="grid grid-cols-2 gap-6 text-lg">
        <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          <div className="text-[12px] text-[#64748b] sm:w-[30%] sm:text-[13px]">
            {item.label}
          </div>
          <div className="min-w-0 break-words text-[13px] text-[#1a1a1a] sm:w-[70%] sm:text-[14px]">
            {item.value || "—"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabelValueList;
