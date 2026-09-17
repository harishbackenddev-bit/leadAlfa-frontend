import { useState, useCallback } from "react";
import { validateFullCampaignForm } from "../utils/campaignCreateStepUtils";

const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const isFileTooLarge = (file) => file && file.size > MAX_FILE_BYTES;

export const initialFormData = {
  campaignTitle: "",
  deliverables: "",
  platform: [],
  videoLength: "",
  productServiceUrl: "",
  compensationType: "cash",
  giftName: "",
  productStatus: "",
  campaignGoal: "",
  ageRange: "",
  gender: "",
  locationCountry: "",
  numberOfCreators: "",
  followerCount: "",
  engagementRate: "",
  keyMessage: "",
  campaignBrief: "",
  hook: "",
  problem: "",
  solution: "",
  cta: "",
  aestheticVibe: "",
  toneVoice: "",
  campaignStarts: "",
  applicationDeadline: "",
  petsRequired: false,
  typeOfPet: "",
  moodboardSource: "url",
  moodboardUrl: "",
  selectedAddOns: [],
  // Legacy fields kept for API compatibility
  platforms: [],
  usageRights: "",
  customUsageRights: "",
  otherPlatform: "",
  whitelisting: "",
  additionalAudienceDetails: "",
  dos: "",
  donts: "",
  addOns: [],
};

export function useCampaignForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [coverImage, setCoverImage] = useState(null);
  const [moodboards, setMoodboards] = useState([null, null, null]);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleCompensationChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      compensationType: type,
      videoLength: type === "cash" ? prev.videoLength : "",
      giftName: type === "gift" ? prev.giftName : "",
      selectedAddOns: type === "gift" ? [] : prev.selectedAddOns,
    }));
  };

  const handleToggleAddOn = useCallback((addOnId) => {
    setFormData((prev) => {
      const current = prev.selectedAddOns || [];
      const next = current.includes(addOnId)
        ? current.filter((id) => id !== addOnId)
        : [...current, addOnId];
      return { ...prev, selectedAddOns: next };
    });
  }, []);

  const handleFileDrop = (event, callback) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({
        ...prev,
        coverImage: `File "${file.name}" exceeds 8 MB limit.`,
      }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coverImage;
      return next;
    });
    callback(file);
  };

  const handleCoverImageChange = (file) => {
    if (!file) return;
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({
        ...prev,
        coverImage: `File "${file.name}" exceeds 8 MB limit.`,
      }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coverImage;
      return next;
    });
    setCoverImage(file);
  };

  const handleMoodboardChange = (index, file) => {
    if (!file) {
      setMoodboards((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
      return;
    }
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({
        ...prev,
        [`moodboard_${index}`]: `File "${file.name}" exceeds 8 MB limit.`,
      }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`moodboard_${index}`];
      delete next.moodboards;
      return next;
    });
    setMoodboards((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const handleMoodboardDrop = (event, index) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleMoodboardChange(index, file);
  };

  const validateForm = () => {
    const nextErrors = validateFullCampaignForm(formData, { coverImage, moodboards });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    coverImage,
    setCoverImage,
    moodboards,
    setMoodboards,
    errors,
    setErrors,
    handleChange,
    handleCompensationChange,
    handleToggleAddOn,
    handleFileDrop,
    handleCoverImageChange,
    handleMoodboardChange,
    handleMoodboardDrop,
    validateForm,
  };
}
