import { SignInForm } from "@/components/auth/login/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nabu",
  description: "Multilingual Calling Solution",
};

export default function SignIn() {
  return <SignInForm  />;
}
