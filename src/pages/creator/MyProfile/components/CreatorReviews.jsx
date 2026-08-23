import reviewImage from "../../../../assets/images/creator/reviewImage.png";
import starIcon from "../../../../assets/images/creator/ratingStar.svg";

const sampleReviews = [
  {
    id: 1,
    name: "Marcus Lipshutz",
    text: "Working with Adison Septimus was a seamless experience. The content exceeded our expectations—visually stunning, on-brand, and performance-driven. The content exceeded our expectations—visually stunning, on-brand, and performance-driven.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Lipshutz",
    text: "Working with Adison Septimus was a seamless experience. The content exceeded our expectations—visually stunning, on-brand, and performance-driven. The content exceeded our expectations—visually stunning, on-brand, and performance-driven.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus Lipshutz",
    text: "Working with Adison Septimus was a seamless experience. The content exceeded our expectations—visually stunning, on-brand, and performance-driven. The content exceeded our expectations—visually stunning, on-brand, and performance-driven.",
    rating: 5,
  },
];

export default function CreatorReviews() {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
      <h4 className="text-lg sm:text-xl font-anton text-gray-900 mb-6">
        My Reviews
      </h4>

      <div className="space-y-6">
        {sampleReviews.map((r) => (
          <div
            key={r.id}
            className="bg-[#F0F0F0] rounded-2xl p-3 sm:p-4 flex gap-2 items-start"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={reviewImage}
                alt={r.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-row items-center gap-1.5">
                <div className="font-medium text-gray-900 text-[14px] sm:text-sm">
                  {r.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5 sm:mt-0">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= r.rating;
                    return (
                      <img
                        key={star}
                        src={starIcon}
                        alt={`Star ${star}`}
                        className={`w-2 h-2 sm:w-3.5 sm:h-3.5 ${
                          filled ? "opacity-100" : "opacity-30"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <p className="text-gray-400 text-[13px] sm:text-xs leading-relaxed mt-1">
                "{r.text}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
