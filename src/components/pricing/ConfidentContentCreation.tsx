import { Smartphone, MapPin } from "lucide-react";
import confidentVideo from "../../imports/video-1.MP4";
import CreatorLocationCard from "../common/CreatorLocationCard";

export default function ConfidentContentCreation() {
    return (
        <section className="py-14 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12" style={{ background: "#EAF6FB" }}>
            <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div>
                    <div
                        className="inline-flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
                        style={{
                            background: "rgba(3,83,164,0.08)",
                            color: "#0353A4",
                            border: "1px solid rgba(3,83,164,0.15)",
                        }}
                    >
                        <Smartphone size={11} />
                        Creator Network
                    </div>
                    <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold mb-5 leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727]">
                        Confident Content Creation
                    </h2>
                    <p className="text-[15px] leading-[1.8] mb-8 text-[#606977]">
                        From Cape Town to Johannesburg, the modern consumer craves authenticity.
                        Creatrend empowers you to launch user-generated content campaigns that feel real,
                        perform exceptionally well, and scale alongside your business.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-[#101727]">
                        {["Cape Town", "Johannesburg", "Durban", "Pretoria"].map((city) => (
                            <div
                                key={city}
                                className="bg-white rounded-2xl px-4 py-3 text-sm font-bold border border-zinc-400/20 flex items-center gap-2 hover:shadow-md transition-all duration-200"
                            >
                                {/* MapPin (Location) Icon with size 16 and custom color */}
                                <MapPin size={16} style={{ color: "#0c7bb3" }} className="flex-shrink-0" />

                                {city}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <CreatorLocationCard video={confidentVideo} />
                </div>
            </div>
        </section>
    )
}