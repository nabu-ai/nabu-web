"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

import { IS_DEVELOPMENT_ENV } from "@/constants";
import { getQueryClient } from "@/helpers/queryClient";


export function ReactQueryProvider({ children }: PropsWithChildren) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {IS_DEVELOPMENT_ENV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
