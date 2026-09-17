import { z } from "zod";

import { SECONDARY_NICHE_NONE } from "../data/creatorSignupOptions";
import { CITY_OTHER_VALUE } from "../utils/location";
import { isE164Phone, normalizeOptionalE164Phone } from "../utils/phone";
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

const profilePhotoRequiredSchema = z
  .instanceof(File, { message: "Profile photo is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 8MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .gif formats are supported"
  );

const profilePhotoOptionalSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 8MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .gif formats are supported"
  )
  .optional();

const introVideoOptionalSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_VIDEO_SIZE, "Video must be under 120MB")
  .refine(
    (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
    "Use MP4 or MOV format"
  )
  .optional();

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

const creatorProfileCoreSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .refine(isE164Phone, "Enter a valid South African mobile number"),
  publicCreatorName: z
    .string()
    .min(1, "Public / Creator Name is required")
    .min(2, "Public name must be between 2 and 50 characters.")
    .max(50, "Public name must be between 2 and 50 characters."),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((s) => {
      const d = new Date(`${s}T12:00:00`);
      if (Number.isNaN(d.getTime())) return false;
      const today = new Date();
      const cutoff18Years = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return d <= cutoff18Years;
    }, "You must be at least 18 years old to apply"),
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
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),
  suburb: z.string().min(1, "Suburb is required"),
  city: z.string().min(1, "City / Town is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(
      /^\d{4}$/,
      "Postal code must be a 4-digit South African postal code (e.g. 8001)"
    ),
  deliveryInstructions: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),
  languageSpoken: z
    .array(z.string())
    .min(1, "Select at least one language"),
  primaryNiche: z.string().min(1, "Primary niche is required"),
  secondaryNiche: z.preprocess(
    (v) => (v === "" || v === SECONDARY_NICHE_NONE ? undefined : v),
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
});

const refineCreatorProfile = (
  val,
  ctx,
  { requireFiles = true, isEdit = false } = {}
) => {
  if (!isEdit) {
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
      if (requireFiles) {
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
      } else if (permit instanceof File) {
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
};

// Creator signup (ZA-focused — matches onboarding UI)
export const creatorBasicInfoSchema = creatorProfileCoreSchema
  .extend({
    profilePhoto: profilePhotoRequiredSchema,
    introVideo: videoFileRequiredSchema,
  })
  .superRefine((val, ctx) =>
    refineCreatorProfile(val, ctx, { requireFiles: true, isEdit: false })
  );

/** Edit profile — files optional when already uploaded; identity docs disabled/read-only from backend. */
export const creatorEditProfileSchema = creatorProfileCoreSchema
  .extend({
    profilePhoto: profilePhotoOptionalSchema,
    introVideo: introVideoOptionalSchema,
  })
  .superRefine((val, ctx) =>
    refineCreatorProfile(val, ctx, { requireFiles: false, isEdit: true })
  );

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
    (v) => normalizeOptionalE164Phone(v),
    z.union([
      z.literal(""),
      z.string().refine(isE164Phone, "Enter a valid South African mobile number"),
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
