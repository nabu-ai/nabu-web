"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "../label"
function RadioGroup({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    const { orientation } = props;
    const orientationClass = orientation === "vertical" ? "flex flex-col" : "flex";
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn("grid gap-2", className, orientationClass)}
            {...props}
        />
    )
}
const RadioGroupLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return (
            <Label
                ref={ref}
                className={cn(
                    "text-gray-800 dark:text-white/90 text-lg font-normal peer-disabled:tw-cursor-not-allowed peer-disabled:tw-opacity-70",
                    className,
                )}
                {...props}
            />
        );
    },
);
type RadioGroupItemRef = React.ElementRef<typeof RadioGroupPrimitive.Item>;
type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string | React.ReactNode;
};
const RadioGroupItem = React.forwardRef<RadioGroupItemRef, RadioGroupItemProps>(
    ({ id, label, className, children, ...props }, ref) => {
        const hasLabel = Boolean(label);
        return (
            <div className={cn("flex items-center gap-2")}>
                <RadioGroupPrimitive.Item
                    data-slot="radio-group-item"
                    className={cn(
                        "border-gray-300 text-gray-800 focus-visible:border-brand-500/10 focus-visible:ring-brand-500/10",
                        "aria-invalid:ring-error-500/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error-500",
                        "dark:bg-gray-900/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs",
                        "transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed ",
                        "disabled:opacity-50",
                        className
                    )}
                    {...props}
                >
                    <RadioGroupPrimitive.Indicator
                        data-slot="radio-group-indicator"
                        className="relative flex items-center justify-center"
                    >
                        <CircleIcon className=" dark:fill-white fill-brand-500 absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
                    </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>
                {hasLabel && <RadioGroupLabel htmlFor={id}>{label}</RadioGroupLabel>}
                {children}
            </div>
        );
    },
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem }
