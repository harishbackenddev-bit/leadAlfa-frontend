import { z } from "zod";

import { SECONDARY_NICHE_NONE } from "../data/creatorSignupOptions";
import { CITY_OTHER_VALUE } from "../utils/location";
import { validateSAIdNumber } from "../utils/validateSAIdNumber";

// File validation helpers
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB images / docs
const MAX_VIDEO_SIZE = 120 * 1024 * 1024; // 120MB intro video
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const videoFileRequiredSchema = z
  .instanceof(File, { message: "Intro video is required" })
  .refine((file) => file.size <= MAX_VIDEO_SIZE, "Video must be under 120MB")
  .refine(
    (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
    "Use MP4 or MOV format"
  );

const logoRequiredSchema = z
  .instanceof(File, { message: "Logo is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 8MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .gif formats are supported"
  );

const isValidOptionalHttpsUrl = (s) => {
  if (!s || !String(s).trim()) return true;
  const trimmed = String(s).trim();
  const withProto = /^https?:\/\//i.test(trimmed)
    ? trimmed.replace(/^http:\/\//i, "https://")
    : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    return u.protocol === "https:" && Boolean(u.hostname);
  } catch {
    return false;
  }
};

const isValidRequiredHttpsUrl = (s) =>
  Boolean(s && String(s).trim()) && isValidOptionalHttpsUrl(s);

/** Brand website / social URL: optional empty; if set, must parse as a URL (http or https). */
const isValidOptionalHttpOrHttpsUrl = (s) => {
  if (!s || !String(s).trim()) return true;
  const trimmed = String(s).trim();
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    return Boolean(u.hostname);
  } catch {
    return false;
  }
};

// Creator signup (ZA-focused — matches onboarding UI)
export const creatorBasicInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    publicCreatorName: z
      .string()
      .min(1, "Public / Creator name is required")
      .max(120),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((s) => {
        const d = new Date(`${s}T12:00:00`);
        if (Number.isNaN(d.getTime())) return false;
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return d <= endOfToday;
      }, "Date of birth cannot be in the future"),
    ethnicity: z.string().min(1, "Select ethnicity"),
    appearance: z.string().min(1, "Select appearance"),
    gender: z.string().min(1, "Select gender"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    saCitizen: z.enum(["yes", "no"], {
      message: "Please select Yes or No",
    }),
    saIdNumber: z.string().optional(),
    passportNumber: z.preprocess(
      (v) => (v == null ? "" : String(v)),
      z.string().optional()
    ),
    residencePermit: z.any().optional(),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City / Town is required"),
    streetNumber: z.string().min(1, "Street number / line is required"),
    postalCode: z.string().optional(),
    languageSpoken: z.string().min(1, "Language is required"),
    primaryNiche: z.string().min(1, "Primary niche is required"),
    secondaryNiche: z.preprocess(
      (v) =>
        v === "" || v === SECONDARY_NICHE_NONE ? undefined : v,
      z.string().optional()
    ),
    hasPets: z.enum(["yes", "no"], { message: "Please select Yes or No" }),
    hasChildren: z.enum(["yes", "no"], { message: "Please select Yes or No" }),
    tiktokUrl: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string()
        .optional()
        .refine(isValidOptionalHttpsUrl, {
          message: "Enter a valid URL starting with https://",
        })
    ),
    instagramUrl: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string()
        .optional()
        .refine(isValidOptionalHttpsUrl, {
          message: "Enter a valid URL starting with https://",
        })
    ),
    youtubeUrl: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string()
        .optional()
        .refine(isValidOptionalHttpsUrl, {
          message: "Enter a valid URL starting with https://",
        })
    ),
    skillsUrl: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string()
        .min(1, "Skills link is required")
        .refine(isValidRequiredHttpsUrl, {
          message: "Enter a valid URL starting with https://",
        })
    ),
    introVideo: videoFileRequiredSchema,
  })
  .superRefine((val, ctx) => {
    if (val.saCitizen === "yes") {
      const saIdResult = validateSAIdNumber(val.saIdNumber);
      if (!saIdResult.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: saIdResult.message,
          path: ["saIdNumber"],
        });
      }
    } else if (val.saCitizen === "no") {
      if (!val.passportNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passport number is required",
          path: ["passportNumber"],
        });
      }
      const permit = val.residencePermit;
      if (!(permit instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Upload residence permit (PDF)",
          path: ["residencePermit"],
        });
      } else {
        if (permit.type !== "application/pdf") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only PDF files are accepted",
            path: ["residencePermit"],
          });
        }
        if (permit.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "File must be less than 8MB",
            path: ["residencePermit"],
          });
        }
      }
    }
    if (
      val.primaryNiche &&
      val.secondaryNiche &&
      val.primaryNiche === val.secondaryNiche
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a different secondary niche",
        path: ["secondaryNiche"],
      });
    }
  });

// Brand onboarding (matches BRAND_ONBOARDING.md + company-focused UI)
export const brandBasicInfoSchema = z
  .object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.preprocess(
    (v) => (v == null ? "" : String(v).trim()),
    z
      .string()
      .min(1, "Company website or social URL is required")
      .refine(isValidOptionalHttpOrHttpsUrl, {
        message: "Enter a valid URL",
      })
  ),
  companyEmail: z.string().email("Invalid email address"),
  phoneNumber: z.preprocess(
    (v) => (v == null ? "" : String(v).trim()),
    z.union([
      z.literal(""),
      z.string().min(10, "Phone number must be at least 10 digits"),
    ])
  ),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),
  businessType: z.string().min(1, "Select business type"),
  jobRole: z.string().min(1, "Select job role"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  cityOther: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),
  postalCode: z.preprocess(
    (v) => (v == null || String(v).trim() === "" ? "0000" : v),
    z.string()
  ),
  primaryIndustries: z
    .array(z.string())
    .min(1, "Select at least one primary industry"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  logo: logoRequiredSchema,
  companyRegistrationNumber: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),
})
  .superRefine((val, ctx) => {
    if (val.city === CITY_OTHER_VALUE && !val.cityOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter your city",
        path: ["cityOther"],
      });
    }
  });

// Export schema selector helper
export const getBasicInfoSchema = (role) => {
  return role === "brand" ? brandBasicInfoSchema : creatorBasicInfoSchema;
};
