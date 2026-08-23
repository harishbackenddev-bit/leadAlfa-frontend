export default function VideoPlayOverlay({ isPlaying, size = 40 }) {
  const className = `w-[${size}px] h-[${size}px] drop-shadow-md`;

  if (isPlaying) {
    return (
      <svg
        className={className}
        style={{ width: size, height: size }}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="24" cy="24" r="24" fill="white" />
        <rect x="17" y="16" width="4" height="16" fill="black" rx="1" />
        <rect x="27" y="16" width="4" height="16" fill="black" rx="1" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      style={{ width: size, height: size }}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="24" fill="white" />
      <path d="M20 16L32 24L20 32V16Z" fill="black" />
    </svg>
  );
}
