"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type CheckboxRef = React.ElementRef<typeof CheckboxPrimitive.Root>;
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const Checkbox = React.forwardRef<CheckboxRef, CheckboxProps>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center justify-center text-sm h-6 w-6 shrink-0 rounded border-3 border-brand-500 dark:bg-transparent peer",
      "focus-visible:ring-ring data-[state=checked]:bg-transparent data-[state=checked]:text-gray-300 data-[state=checked]:border-brand-500",
      "focus-visible:outline-none focus-visible:ring-6 focus-visible:ring-offset-3 disabled:cursor-not-allowed disabled:opacity-50",
      "focus:ring-1 focus:ring-offset-gray-300 focus:ring-offset-4 focus:ring-brand-500",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center transition-none  ">
      <CheckIcon className="size-4 text-gray-800 dark:text-white"  strokeWidth={5}/>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxGroup = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className="flex flex-col gap-3"
  >
    {children}
  </div>
));

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };

