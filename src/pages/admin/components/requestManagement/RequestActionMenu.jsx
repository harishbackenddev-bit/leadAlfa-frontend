import { useEffect, useRef } from "react";
import { CheckCircle2, Eye, Mail, MoreVertical, Trash2, XCircle } from "lucide-react";

const actionItems = [
  { key: "view", label: "View Details", icon: Eye, tone: "neutral" },
  { key: "approve", label: "Approve", icon: CheckCircle2, tone: "success" },
  { key: "reject", label: "Reject", icon: XCircle, tone: "danger" },
  { key: "send-email", label: "Request Info", icon: Mail, tone: "neutral" },
  { key: "delete", label: "Delete", icon: Trash2, tone: "danger" },
];

const toneClassMap = {
  neutral: "text-[#2f3b4f] hover:bg-gray-50",
  success: "text-[#16a34a] hover:bg-emerald-50",
  danger: "text-[#ef4444] hover:bg-red-50",
};

const terminalStatuses = new Set(["approved", "rejected"]);

const RequestActionMenu = ({ isOpen, onToggle, onAction, status }) => {
  const menuRef = useRef(null);
  const isTerminalStatus = terminalStatuses.has(String(status || "").toLowerCase());
  const visibleActionItems = actionItems.filter((item) => {
    if (!isTerminalStatus) return true;
    return !["approve", "reject", "send-email"].includes(item.key);
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={menuRef} className="relative flex justify-end">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        aria-label="Open request actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
          {visibleActionItems.map((item, index) => {
            const Icon = item.icon;
            const addSeparator = item.key === "view" && visibleActionItems.length > 1;

            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => onAction(item.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${toneClassMap[item.tone]}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
                {addSeparator && <div className="my-1 border-t border-gray-100" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestActionMenu;
