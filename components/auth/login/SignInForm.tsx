"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInFormSchema } from "./schema";
import AuthWrapper from "../components/AuthWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignIn } from "./hooks/useSignIn";
import { useRouter } from "next/navigation"
import { useMeetingStore } from "@/store/useMeetingStore";
import { useUserStore } from "@/store/useUserStore";


const SignInForm = () => {
  const hasInitialized = useRef(false);
  const router = useRouter();
  const { mutate: handleSignIn } = useSignIn({ router });

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      useMeetingStore.setState(useMeetingStore.getInitialState())
      useUserStore.setState(useUserStore.getInitialState())
    }
  })
  // useMeetingStore.setState(useMeetingStore.getInitialState())
  // useUserStore.setState(useUserStore.getInitialState())
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    },
  });
  const onSubmit = async (formData: z.infer<typeof SignInFormSchema>) => {
    const { email, password } = formData;
    handleSignIn({ email, password })
  };

  return (<AuthWrapper bannerHeading="" bannerDescription="Speak Locally, Connect Globally"
    heading="Sign In" description="Enter your email and password to sign in!">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input id="email" type="email" placeholder="info@gmail.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" size="sm" type="submit">
          Sign in
        </Button>

      </form>
    </Form>
    <div className="mt-5">
      <p className="text-theme-xl font-normal text-gray-700 dark:text-gray-400 sm:text-start">
        Don&apos;t have an account? {""}
        <Link
          href="/signup"
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </AuthWrapper>
  );
}
export { SignInForm }
