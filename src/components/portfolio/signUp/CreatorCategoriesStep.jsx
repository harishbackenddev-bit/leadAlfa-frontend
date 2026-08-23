import React, { useEffect } from "react";
import { getCatagories } from "../../../services/api/publicApi";

const CreatorCategoriesStep = ({
  formData,
  onFormDataChange,
  onNext,
  onBack,
  submitting = false,
}) => {
  const [selectedCategories, setSelectedCategories] = React.useState(
    formData.categories || []
  );
  const [categories, setCategories] = React.useState([]);
  useEffect(() => {
    getCatagory();
  }, []);

  const getCatagory = async () => {
    try {
      const response = await getCatagories();
      console.log(response.data);

      setCategories(response.data);
    } catch (error) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  };
  const handleCategoryClick = (categoryId) => {
    let updated;
    if (selectedCategories.includes(categoryId)) {
      updated = selectedCategories.filter((id) => id !== categoryId);
    } else {
      updated = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updated);
    onFormDataChange({
      ...formData,
      categories: updated,
    });
  };

  const handleSubmit = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#5B576F]">
          Choose Your{" "}
          <span className="font-bold text-[#161C2B]">Categories</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`text-center grid align-center gap-1 p-2 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
              selectedCategories.includes(category.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto ${
                selectedCategories.includes(category.id)
                  ? "text-[#0c7bb3] bg-blue-100"
                  : "text-gray-500 bg-gray-100"
              }`}
            >
              <img src={category.iconUrl} alt="" />
              {/* <CategoryIcon name={category.id} /> */}
            </div>
            <p
              className={`text-xs ${
                selectedCategories.includes(category.id)
                  ? "text-black-600"
                  : "text-gray-800"
              }`}
            >
              {category.name}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={submitting}
          className="px-10 py-3 text-sm font-medium text-[#5B576F] rounded-full transition shadow-md border border-[#D8D8D8] hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-10 py-3 text-sm font-medium text-white main-btn rounded-full transition shadow-md disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Please wait..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
};

export default CreatorCategoriesStep;
