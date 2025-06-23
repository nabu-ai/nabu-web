import { z } from "zod";

export const ProfileUpdateSchema = z.object({
    id: z.string().min(1, {
        message: "Required",
    }),
    firstName: z.string().min(1, {
        message: "Required",
    }),
    lastName: z.string().min(1, {
        message: "Required",
    }),
    phoneCode: z.string().min(1, {
        message: "Required",
    }),
    phoneNumber: z.string().min(1, {
        message: "Required",
    }),
    address: z.string().min(1, {
        message: "Required",
    }),
    city: z.string().min(1, {
        message: "Required",
    }),
    state: z.string().min(1, {
        message: "Required",
    }),
    postalCode: z.string().min(1, {
        message: "Required",
    }),
    country: z.string().min(1, {
        message: "Required",
    }),
    nonVerbal : z.boolean().optional(),
    hearingImpaired: z.boolean().optional(),
});
