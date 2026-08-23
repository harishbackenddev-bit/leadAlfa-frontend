export default function JobCard({
  campaign,
  onViewDetailsClick,
  className = "",
}) {
  const { id, title, budget, originalPrice, description, image, status } =
    campaign;

  const getStatusStyles = (status) => {
    switch (status) {
      case "Applied":
        return "bg-[#AFC5EE] text-[#1E60DB]";
      case "Ongoing":
        return "bg-[#F5D7CB] text-[#ED926E]";
      case "Completed":
        return "bg-[#B7D9C0] text-[#0C8B1D]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 p-4 sm:p-5">
        {/* Image Section */}
        <div className="relative w-full sm:w-72  flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-4 sm:mb-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />

          {/* Status Badge */}
          {status && (
            <div
              className={`absolute top-2.5 left-2.5 px-3 py-2 rounded-full text-sm font-medium ${getStatusStyles(
                status
              )}`}
            >
              {status}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Title */}
          <h2 className="font-anton font-extrabold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-2 sm:mb-2.5">
            {title}
          </h2>

          {/* Budget */}
          <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl lg:text-xl font-bold text-[#0c7bb3]">
              {budget}
            </span>
            {originalPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-auto">
            <button
              onClick={() => onViewDetailsClick(id)}
              className="w-full sm:w-auto main-btn text-white font-semibold px-6 py-5 rounded-full text-sm sm:text-sm leading-none transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
