import React, { useEffect, useState } from "react";
import { getAllSkills } from "../../../services/api/publicApi";

const getAvailableSkills = async () => {
  try {
    const response = await getAllSkills();
    return response.data;
  } catch (error) {
    console.error("Error fetching available skills:", error);
    return [];
  }
};

const AddSkillStep = ({
  onNext,
  onBack,
  formData,
  onFormDataChange,
  submitting = false,
}) => {
  const [selectedSkills, setSelectedSkills] = useState(formData?.skills || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  useEffect(() => {
    getAvailableSkills().then((skills) => {
      setAvailableSkills(skills);
    });
  }, []);

  const filteredSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSkillToggle = (skill) => {
    if (submitting) return;
    const updatedSkills = selectedSkills.includes(skill.id)
      ? selectedSkills.filter((s) => s !== skill.id)
      : [...selectedSkills, skill.id];

    setSelectedSkills(updatedSkills);
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        skills: updatedSkills,
      });
    }
  };

  const handleRemoveSkill = (skill) => {
    if (submitting) return;
    const updatedSkills = selectedSkills.filter((s) => s !== skill.id);
    setSelectedSkills(updatedSkills);
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        skills: updatedSkills,
      });
    }
  };

  const handleBack = () => {
    if (submitting) return;
    if (onBack) {
      onBack();
    }
  };

  const handleNext = () => {
    if (submitting) return;
    if (onNext) {
      onNext();
    }
  };

  const getskillNameById = (id) => {
    const skill = availableSkills.find((skill) => skill.id === id);
    return skill ? skill.name : "";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#5B576F]">
          Choose Your <span className="font-bold text-[#161C2B]">Skills</span>
        </h2>
        <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">
          Please choose your interested skills
        </p>
      </div>

      {/* Selected Skills Display */}
      <div className="relative">
        <p className="text-sm text-gray-600 mb-2">
          Please choose your interested skills
        </p>
        <div className="border border-gray-300 rounded-lg p-4 min-h-[70px] bg-white">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ">
              <svg
                className="w-5 h-5 text-[#0c7bb3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            {selectedSkills.length === 0 ? (
              <span className="text-gray-400 text-sm">Select skills</span>
            ) : (
              selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-white text-[#0c7bb3] px-3 py-1.5 rounded-full text-sm font-medium border border-blue-600"
                >
                  <span>{getskillNameById(skill)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-blue-800 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <button
          type="button"
          className="absolute right-4 top-[50%] text-red-500 hover:text-red-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Search and Skills List */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search your skills here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Skills Checkboxes */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {filteredSkills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.id)}
                onChange={() => handleSkillToggle(skill)}
                className="w-5 h-5 text-[#0c7bb3] border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{skill.name}</span>
            </label>
          ))}
          {filteredSkills.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No skills found
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
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
          onClick={handleNext}
          disabled={submitting}
          className="px-10 py-3 text-sm font-medium text-white main-btn rounded-full transition shadow-md disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Please wait..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
};

export default AddSkillStep;
