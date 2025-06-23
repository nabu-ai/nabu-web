"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer text-theme-lg border-gray-300 dark:bg-gray-700 data-[state=checked]:bg-transparent data-[state=checked]:text-gray-800 dark:data-[state=checked]:bg-gray-900",
        " dark:data-[state=checked]:text-white focus-visible:border-3 focus-visible:ring-brand-500/10 aria-invalid:ring-error-500/20 dark:aria-invalid:aria-invalid:ring-error-500/40",
        " aria-invalid:border-error-500 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        "border-2 mt-1 checked:bg-blue-800 checked:border-0 shrink-0 w-6 h-6  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 ",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
