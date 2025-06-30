"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        />
    )
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "border-brand-500 bg-gray-100 dark:bg-gray-800 dark:text-white/90 text-gray-300 inline-flex h-14 w-fit",
                " items-center justify-center rounded-lg p-[3px]",
                className
            )}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "data-[state=active]:border-b-4 data-[state=active]:border-b-brand-500 dark:data-[state=active]:text-white focus:border-b-gray-100 ",
                " dark:data-[state=active]:border-b-brand-500 text-gray-800 dark:text-white/90 ",
                "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5  px-2 py-1 text-md font-medium ",
                "whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 ",
                " [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        />
    )
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 outline-none", className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
