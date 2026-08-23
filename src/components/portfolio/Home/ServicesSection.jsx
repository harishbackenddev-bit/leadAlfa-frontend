import TitleWithLine from "../../common/TitleWithLine";

export default function ServicesSection() {
  return (
    <div className="flex flex-col md:flex-row! flex-wrap p-[4vh_5vw] bg-white">
      {/* Box-1 */}
      <div className=" md:w-1/2! p-4 flex gap-5 md:gap-12! max-md:w-full max-md:flex-col">
        <div className="flex items-center gap-2 text-[12px] text-gray-600 self-start">
          <TitleWithLine text="Why Choose Us" align="right" width="140px" />
        </div>
        <h2 className="text-[1.8em] md:text-[38px] font-bold">
          What We Can{" "}
          <span className="text-[#0c7bb3] font-semibold">
            Do <br /> For You
          </span>
        </h2>
      </div>

      {/* Box-2 */}
      <div className="md:w-1/2! p-4 text-[10px] md:text-[12px] font-light leading-relaxed flex items-center self-start max-md:w-full max-md:pt-0">
        <p>
          Establish customer relationships through public conversations by
          choosing from a diverse selection of micro-influencers and
          user-generated content creators to enhance brand loyalty. Expand into
          new global markets with Creatrend extensive network of UGC
          creators in targeted countries. Our creators have the potential to
          support brand sales and conversions through various approaches,
          including but not limited to
        </p>
      </div>
    </div>
  );
}
