import { useNavigate } from "react-router-dom";
import TitleWithLine from "../../common/TitleWithLine";
import { MapPin, Timer, TrendingUp } from "lucide-react";
import ActionButton from "../../common/ActionButton";


export const WhyUgcWinSA = () => {
    const navigate = useNavigate();
    const handleFindCreatorClick = () => {
        navigate("/login");
    };

    const features = [
        {
            title: "Trust is the New Currency",
            bullets: [
                "Research shows that over 80% of consumers trust peer recommendations over brand advertising.",
                "When a real user shares a video of how a product solved their problem, the audience sees truth. Authenticity is the new currency.",
            ],
        },
        {
            title: "Social Proof Drives Sales (Not Just Likes)",
            bullets: [
                "When a potential customer lands on your product page and sees a real photo or video, skepticism drops.",
                "Including UGC on product pages can boost conversion rates by up to 161% — turning browsers into buyers.",
            ],
        },
        {
            title: "An Unbeatable SEO Boost",
            bullets: [
                "Google loves fresh, relevant content. UGC is a goldmine for Search Engine Optimization.",
                "Customer reviews and captions often contain long-tail keywords and local phrasing customers use to search.",
            ],
        },
        {
            title: "The Budget-Friendly Powerhouse",
            bullets: [
                "UGC is highly cost-effective — you get a library of creative assets you own forever.",
                "Test multiple creative angles for the price of one influencer post and improve ROI.",
            ],
        },
    ];

    return (
        <div className="py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
                    Why UGC Wins In <span className="text-[#0c7bb3]">South Africa</span>
                </h2>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 min-h-[220px] shadow-sm">
                        <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                        <ul className="text-gray-600 text-xs leading-relaxed list-disc pl-5 space-y-2">
                            {item.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="text-center my-6">
                <p className="text-sm font-semibold ">Ready to Turn Your Customers into Your Best Marketers?</p>
            </div>
            <div className="mt-2 flex items-center justify-center">
                <ActionButton label={"Get started"} onClick={handleFindCreatorClick} />
            </div>
        </div>
    );
}

