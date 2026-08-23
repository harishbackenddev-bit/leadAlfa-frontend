// Shared section header. Pass the accent word as <span className="text-[#0c7bb3]">.
export default function SectionHead({
  eyebrow,
  children,
  subtitle,
  size = "default",
  className = "",
}) {
  const headingSize =
    size === "large"
      ? "text-[30px] sm:text-[42px] lg:text-[54px]"
      : "text-[28px] sm:text-[38px] lg:text-[48px]";

  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="mb-5 flex items-center justify-center gap-2.5 text-[15px] font-medium text-[#1A1A1A] sm:text-[16px]">
          <span className="h-px w-8 bg-[#1A1A1A] sm:w-10" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-[#1A1A1A] sm:w-10" aria-hidden="true" />
        </p>
      )}

      <h2 className={`font-bold leading-[1.15] tracking-[-0.03em] text-[#1A1A1A] ${headingSize}`}>
        {children}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.6] text-[#64748A] sm:text-[17px] lg:text-[18px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
