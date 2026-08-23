import ActionButton from "../../common/ActionButton";
import { useNavigate } from "react-router-dom";

// Icon Component
const Icon = ({ plan }) => (
  <>
    {plan?.option !== "recommended" ? (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 7.5C0 5.51088 0.790176 3.60322 2.1967 2.1967C3.60322 0.790176 5.51088 0 7.5 0C9.48912 0 11.3968 0.790176 12.8033 2.1967C14.2098 3.60322 15 5.51088 15 7.5C15 9.48912 14.2098 11.3968 12.8033 12.8033C11.3968 14.2098 9.48912 15 7.5 15C5.51088 15 3.60322 14.2098 2.1967 12.8033C0.790176 11.3968 0 9.48912 0 7.5ZM7.072 10.71L11.39 5.312L10.61 4.688L6.928 9.289L4.32 7.116L3.68 7.884L7.072 10.71Z"
          fill="#232825"
        />
      </svg>
    ) : (
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.669922 7.5C0.669922 5.51088 1.4601 3.60322 2.86662 2.1967C4.27314 0.790176 6.1808 0 8.16992 0C10.159 0 12.0667 0.790176 13.4732 2.1967C14.8797 3.60322 15.6699 5.51088 15.6699 7.5C15.6699 9.48912 14.8797 11.3968 13.4732 12.8033C12.0667 14.2098 10.159 15 8.16992 15C6.1808 15 4.27314 14.2098 2.86662 12.8033C1.4601 11.3968 0.669922 9.48912 0.669922 7.5ZM7.74192 10.71L12.0599 5.312L11.2799 4.688L7.59792 9.289L4.98992 7.116L4.34992 7.884L7.74192 10.71Z"
          fill="white"
        />
      </svg>
    )}
  </>
);

// Pricing Card Component
export default function PricingCard({ plan }) {
  const navigate = useNavigate();
  const handleActionClick = () => {
    navigate("/login");
  };
  return (
    <div
      className={`max-w-[360px] mx-auto flex flex-col gap-4 rounded-2xl ${
        plan?.option === "recommended"
          ? "bg-[#0c7bb3] text-white p-2"
          : "bg-white text-black"
      }`}
    >
      <div
        className={`flex flex-col gap-2 rounded-lg p-6 ${
          plan?.option === "recommended" ? "bg-[#1F8FC8]" : "bg-[#efeeea]"
        }`}
      >
        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium w-fit ${
            plan?.option === "recommended"
              ? "bg-[#62b1d9] text-white"
              : "bg-white text-black"
          }`}
        >
          <svg
            width="6"
            height="6"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="8"
              height="8"
              rx="4"
              fill={plan?.option === "recommended" ? "#FFFFFF" : "#36A379"}
            />
          </svg>
          {plan.label}
        </span>

        <h4 className="text-[18px] font-medium">{plan.title}</h4>
        <p className="text-[12px] font-light">{plan.bonus}</p>
        <p className="text-[28px] font-semibold">${plan.price}</p>

        <ActionButton
          label="Add To Wallet"
          arrow_bg="#FFFFFF"
          stroke="#4C86F3"
          bg={plan?.option === "recommended" ? "#5f91ed" : "#1E60DB"}
          onClick={handleActionClick}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2 text-[14px]">
            <Icon plan={plan} />
            {feat}
          </li>
        ))}
      </ul>
    </div>
  );
}
