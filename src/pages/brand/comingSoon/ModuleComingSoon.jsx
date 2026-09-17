import { Clock } from "lucide-react";

export default function ModuleComingSoon({ title, description }) {
  return (
    <div className="min-h-screen bg-[#f8f8f8] font-manrope">
      <div className="mx-auto max-w-[1182px] px-4 py-6 md:px-8 lg:p-10">
        <h1 className="text-[24px] font-bold leading-[36px] tracking-[-0.8px] text-[#1f1f1f] sm:text-[28px] sm:leading-[42px]">
          {title}
        </h1>
        <p className="pt-1 text-[14px] leading-[21px] text-[#64748b]">{description}</p>

        <div className="mt-8 flex flex-col items-center rounded-[14px] border border-[#e5e7eb] bg-white px-6 py-16 text-center">
          <span className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[#eef9ff]">
            <Clock className="h-8 w-8 text-[#0353a4]" />
          </span>
          <h2 className="mb-2 text-[20px] font-bold leading-[30px] text-[#1e293b]">Coming soon</h2>
          <p className="max-w-[460px] text-[14px] leading-[23.8px] text-[#64748b]">
            This module is still in design. It will appear here once the workflow is ready.
          </p>
        </div>
      </div>
    </div>
  );
}
