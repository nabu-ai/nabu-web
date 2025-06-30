import z from "zod";

const SignUpFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(3, { message: "Password must be at least 3 characters." }),
    confirmPassword: z.string().min(3, { message: "Confirm Password must be at least 3 characters." }),
    companyName: z.string().optional(),
    phoneNumber: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export { SignUpFormSchema };
