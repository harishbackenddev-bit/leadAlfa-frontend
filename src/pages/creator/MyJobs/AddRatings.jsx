import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "../../../components/ui/button";

const RATING_CATEGORIES = [
  {
    key: "communication",
    title: "Communication",
    description: "How responsive and clear was the brand?",
  },
  {
    key: "clarity",
    title: "Clarity of Brief",
    description: "How clear were the campaign requirements?",
  },
  {
    key: "payment",
    title: "Payment Experience",
    description: "How smooth was the payment process?",
  },
  {
    key: "overall",
    title: "Overall Experience",
    description: "Rate your overall experience with this brand",
    required: true,
  },
];

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`h-6 w-6 sm:h-7 sm:w-7 ${
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function AddRatings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState({
    communication: 0,
    clarity: 0,
    payment: 0,
    overall: 0,
  });

  const setRating = (key, val) => {
    setRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ratings.overall) return;
    alert("Rating submitted (mock) for job " + id);
    navigate("/creator/my-jobs");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/creator/my-jobs")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to My Jobs
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-anton text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Rate & Review
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Rate the brand to get more benefits & perks
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/creator/my-jobs")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleSubmit}
            >
              Submit Proposal
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Rate Your Experience
            </h2>
            <div className="divide-y divide-gray-100">
              {RATING_CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {cat.title}
                      {cat.required ? (
                        <span className="text-red-500"> *</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {cat.description}
                    </p>
                  </div>
                  <StarRating
                    value={ratings[cat.key]}
                    onChange={(v) => setRating(cat.key, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Written Review (Optional)
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Share details about your experience to help other creators
            </p>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience working with this brand. What went well? What could be improved?"
              className="mt-4 min-h-[140px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end sm:hidden">
            <Button type="submit" className="w-full rounded-xl">
              Submit Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
