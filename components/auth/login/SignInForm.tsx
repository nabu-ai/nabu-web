"use client";
import Link from "next/link";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SignInFormSchema } from "./schema";
import AuthWrapper from "../components/AuthWrapper";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import { useSignIn } from "./hooks/useSignIn";

const SignInForm = () => {
  const { isPending, mutate: handleSignIn, isSuccess, data } = useSignIn();
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
    // toast("You submitted the following values", {
    //   description: (
    //     <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
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
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-4"
                />
              </FormControl>
              <FormLabel htmlFor="login-remember" className="text-muted-foreground ml-1 text-theme-xl font-medium">
                Keep me logged in
              </FormLabel>
            </FormItem>
          )}
        /><Button className="w-full" size="sm" type="submit">
          Sign in
        </Button>

      </form>
    </Form>
    <div className="mt-5">
      <p className="text-lg font-normal text-gray-700 dark:text-gray-400 sm:text-start">
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
