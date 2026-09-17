import { CONTACT_STATUS_BADGE_CLASS } from "../../../../constants/contactRequest";

const ContactRequestStatusBadge = ({ status, label }) => {
  const badgeClass =
    CONTACT_STATUS_BADGE_CLASS[status] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
    >
      {label}
    </span>
  );
};

export default ContactRequestStatusBadge;
