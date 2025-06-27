import { z } from "zod";

export const guestMeetingSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  language: z.string().min(1, {
    message: "Required",
  }),
  voiceHeardAs: z.string().min(1, {
    message: "Required",
  }),
  nonVerbal: z.boolean().optional(),
  hearingImpaired: z.boolean().optional(),
});
