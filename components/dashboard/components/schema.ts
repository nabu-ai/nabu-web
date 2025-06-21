import { z } from "zod";

export const newMeetingSchema = z.object({
  agenda: z.string().min(1, {
    message: "Required",
  }),
  language: z.string().min(1, {
    message: "Required",
  }),
  audioHeardAs: z.string().min(1, {
    message: "Required",
  }),
  participantName: z.string().min(1, {
    message: "Required",
  }),
  participantEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
});
