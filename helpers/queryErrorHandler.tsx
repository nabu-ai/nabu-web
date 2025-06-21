import { DefaultError } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CircleX } from "lucide-react";

import { toast } from "sonner";
import { UNKNOWN_ERROR_MESSAGE } from "../constants";
import { handleAuthError } from "./authErrorHandler";

function extractErrorMessage(error: AxiosError<unknown, any>) {
    try {
        const data = error?.response?.data;
        const hasData = data && typeof data === "object";
        const hasErrorDescription = hasData && "errorDescription" in data;
        const isDataString = typeof data === "string";

        if (hasErrorDescription) {
            const { errorDescription } = data;

            return typeof errorDescription === "string" ? errorDescription : JSON.stringify(errorDescription);
        }

        if (isDataString) {
            return String(data);
        }

        if (hasData) {
            return JSON.stringify(data);
        }

        return error.message || UNKNOWN_ERROR_MESSAGE;
    } catch (e) {
        return UNKNOWN_ERROR_MESSAGE;
    }
}

function handleAxiosError(error: AxiosError) {
    if ([401, 403].includes(error.response?.status || 0)) {
        handleAuthError(error.response?.status);
        return;
    }

    const errorMessage = extractErrorMessage(error);

    toast({
        title: errorMessage,
        icon: <CircleX />,
        variant: "negative",
    });

    return;
}

export function handleQueryError(error: DefaultError) {
    console.log("⛔ ~ handleQueryError ~ error:", error);
    if (error instanceof AxiosError) {
        handleAxiosError(error);
        return;
    }

    toast({
        title: error.message || UNKNOWN_ERROR_MESSAGE,
        icon: <CircleX />,
        variant: "negative",
    });
}
