import { z } from "zod";

export const guestMeetingSchema = z.object({
  participantLanguage: z.string().min(1, {
    message: "Required",
  }),
  participantAudioHeardAs: z.string().min(1, {
    message: "Required",
  }),
});
