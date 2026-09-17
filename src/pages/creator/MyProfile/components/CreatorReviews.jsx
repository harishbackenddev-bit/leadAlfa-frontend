import reviewImage from "../../../../assets/images/creator/reviewImage.png";
import starIcon from "../../../../assets/images/creator/ratingStar.svg";


export default function CreatorReviews({ profile, user, reviews: reviewsProp }) {
  const reviews = Array.isArray(reviewsProp)
    ? reviewsProp
    : Array.isArray(profile?.reviews)
    ? profile.reviews
    : Array.isArray(user?.reviews)
    ? user.reviews
    : [];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm border border-gray-100">
      <h4 className="text-lg sm:text-xl text-gray-900 mb-4">
        My Reviews
      </h4>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r, index) => {
            const reviewerName = r.name || r.reviewerName || r.brandName || "Brand";
            const comment = r.text || r.comment || r.review || "";
            const rating = r.rating || 5;
            const avatar = r.avatar || r.image || reviewImage;

            return (
              <div
                key={r.id || index}
                className="bg-[#F0F0F0] rounded-2xl p-3 sm:p-4 flex gap-3 items-start"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  <img
                    src={avatar}
                    alt={reviewerName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-row items-center gap-1.5">
                    <div className="font-medium text-gray-900 text-[14px] sm:text-sm">
                      {reviewerName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 sm:mt-0">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = star <= rating;
                        return (
                          <img
                            key={star}
                            src={starIcon}
                            alt={`Star ${star}`}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                              filled ? "opacity-100" : "opacity-30"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {comment ? (
                    <p className="text-gray-500 text-[13px] sm:text-xs leading-relaxed mt-1">
                      "{comment}"
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 px-4 text-center">
          <p className="font-medium text-gray-900 mb-1">No reviews yet</p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Reviews from brands will appear here once you complete collaborations.
          </p>
        </div>
      )}
    </div>
  );
}
