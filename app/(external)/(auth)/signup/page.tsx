import { SignUpForm } from "@/components/auth/register/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nabu Registration",
  description: "Nabu Registration"
};

export default function SignUp() {
  return <SignUpForm />;
}
