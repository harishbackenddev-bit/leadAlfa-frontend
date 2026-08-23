import { useState } from "react";

const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const isFileTooLarge = (file) => file && file.size > MAX_FILE_BYTES;

const parsePositiveNumber = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parsePositiveInteger = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const match = raw.match(/\d+/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const isValidHttpUrl = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return false;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const initialFormData = {
  campaignTitle: "",
  deliverables: "",
  platforms: [],
  usageRights: "",
  customUsageRights: "",
  productServiceUrl: "",
  compensationType: "",
  minBudget: "",
  maxBudget: "",
  giftName: "",
  otherPlatform: "",
  productStatus: "",
  whitelisting: "",
  campaignGoal: "",
  ageRange: "",
  gender: "",
  locationCountry: "",
  numberOfCreators: "",
  followerCount: "",
  engagementRate: "",
  additionalAudienceDetails: "",
  keyMessage: "",
  campaignBrief: "",
  hook: "",
  problem: "",
  solution: "",
  cta: "",
  aestheticVibe: "",
  toneVoice: "",
  dos: "",
  donts: "",
  addOns: [],
  campaignStarts: "",
  applicationDeadline: "",
  petsRequired: "yes",
  typeOfPet: "",
  moodboardSource: "url",
  moodboardUrl: "",
};

export function useCampaignForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [coverImage, setCoverImage] = useState(null);
  const [moodboards, setMoodboards] = useState([null, null, null]);
  const [addOnInput, setAddOnInput] = useState("");
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
      minBudget: type === "cash" ? prev.minBudget : "",
      maxBudget: type === "cash" ? prev.maxBudget : "",
      giftName: type === "gift" ? prev.giftName : "",
    }));
  };

  const handleFileDrop = (event, callback) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({ ...prev, coverImage: `File "${file.name}" exceeds 8 MB limit.` }));
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.coverImage; return n; });
    callback(file);
  };

  const handleCoverImageChange = (file) => {
    if (!file) return;
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({ ...prev, coverImage: `File "${file.name}" exceeds 8 MB limit.` }));
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.coverImage; return n; });
    setCoverImage(file);
  };

  const handleMoodboardChange = (index, file) => {
    if (!file) {
      setMoodboards((prev) => { const n = [...prev]; n[index] = null; return n; });
      return;
    }
    if (isFileTooLarge(file)) {
      setErrors((prev) => ({
        ...prev,
        [`moodboard_${index}`]: `File "${file.name}" exceeds 8 MB limit.`,
      }));
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n[`moodboard_${index}`]; return n; });
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

  const handleAddOnKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = addOnInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      addOns: [...prev.addOns, value],
    }));
    setAddOnInput("");
  };

  const handleRemoveAddOn = (index) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    // Keep validation minimal: only required fields.
    if (!formData.campaignTitle.trim()) nextErrors.campaignTitle = "Required";
    if (!formData.deliverables) nextErrors.deliverables = "Required";
    if (!formData.platforms.length) nextErrors.platforms = "Required";

    if (formData.platforms.includes("other") && !formData.otherPlatform.trim()) {
      nextErrors.otherPlatform = "Required";
    }

    if (!formData.usageRights) nextErrors.usageRights = "Required";
    if (formData.usageRights === "custom" && !formData.customUsageRights.trim()) {
      nextErrors.customUsageRights = "Required";
    }
    if (!formData.compensationType) nextErrors.compensationType = "Required";

    if (formData.compensationType === "cash") {
      if (!formData.minBudget) nextErrors.minBudget = "Required";
      if (!formData.maxBudget) nextErrors.maxBudget = "Required";

      const minBudget = parsePositiveNumber(formData.minBudget);
      const maxBudget = parsePositiveNumber(formData.maxBudget);

      if (formData.minBudget && minBudget === null) {
        nextErrors.minBudget = "Enter a valid budget amount";
      }
      if (formData.maxBudget && maxBudget === null) {
        nextErrors.maxBudget = "Enter a valid budget amount";
      }
      if (minBudget !== null && maxBudget !== null && maxBudget <= minBudget) {
        nextErrors.maxBudget = "Max budget must be greater than min budget.";
      }
    }

    if (
      formData.numberOfCreators &&
      parsePositiveInteger(formData.numberOfCreators) === null
    ) {
      nextErrors.numberOfCreators = "Number of creators must be a positive integer.";
    }

    if (formData.moodboardSource === "url") {
      if (!formData.moodboardUrl?.trim()) {
        nextErrors.moodboardUrl = "Required";
      } else if (!isValidHttpUrl(formData.moodboardUrl)) {
        nextErrors.moodboardUrl = "Must provide a valid URL for moodboard inspiration.";
      }
    }

    if (!formData.productStatus) nextErrors.productStatus = "Required";
    if (!formData.campaignBrief.trim()) nextErrors.campaignBrief = "Required";

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
    addOnInput,
    setAddOnInput,
    errors,
    setErrors,
    handleChange,
    handleCompensationChange,
    handleFileDrop,
    handleCoverImageChange,
    handleMoodboardChange,
    handleMoodboardDrop,
    handleAddOnKeyDown,
    handleRemoveAddOn,
    validateForm,
  };
}
