const LabelValueList = ({ items = [] }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        // <div key={item.label} className="grid grid-cols-2 gap-6 text-lg">
        <div key={item.label} className="flex gap-6 text-lg">
          <div className="font-['Manrope:Medium',sans-serif] text-[13px] text-[#64748b] sm:w-[30%] w-[40%]">{item.label}</div>
          <div className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#1a1a1a] sm:w-[70%] w-[60%]">{item.value || "—"}</div>
        </div>
      ))}
    </div>
  );
};

export default LabelValueList;
