export default function BoostedIcon({ className = 'w-5 h-5', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M12 2l8 4v6c0 5-3.582 9.8-8 10C7.582 21.8 4 17 4 12V6l8-4z"
        fill="currentColor"
      />
      <polygon
        points="12,8.5 13.6,11.6 16.9,11.9 14.2,13.9 15.1,17.2 12,15.2 8.9,17.2 9.8,13.9 7.1,11.9 10.4,11.6"
        fill="#ffffff"
      />
    </svg>
  );
}
