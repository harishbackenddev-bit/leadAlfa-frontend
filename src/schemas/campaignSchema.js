import * as z from "zod";

export const campaignSchema = z
  .object({
    campaignTitle: z.string().min(1, "Campaign title is required"),
    deliverables: z.string().min(1, "Deliverables are required"),
    dos: z.string().min(1, "Do's are required"),
    donts: z.string().min(1, "Don'ts are required"),
    productInformation: z.string().min(1, "Product information is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    applicationDeadline: z.date({
      required_error: "Application deadline is required",
    }),
    whoCanApply: z.enum(["Any Creator", "Invite Only"]),
    compensation: z.enum(["Paid", "Gifting"]),
    amount: z.number().optional(),
    productImage: z
      .any()
      .refine((file) => file?.length == 1, "Product image is required."),
    moodboards: z.any().optional(),
    exampleVideos: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.compensation === "Paid") {
        return data.amount !== undefined && data.amount > 0;
      }
      return true;
    },
    {
      message: "Amount is required for paid compensation",
      path: ["amount"],
    }
  );
