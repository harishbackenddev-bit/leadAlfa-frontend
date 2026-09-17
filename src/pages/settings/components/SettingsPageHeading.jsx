export default function SettingsPageHeading({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
