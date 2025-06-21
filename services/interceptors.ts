import { handleAuthError } from "@/helpers";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";


/**
 * Handles fulfilled requests and adds an Authorization header if a token is present.
 * @param config - The Axios request configuration.
 * @returns The modified or unmodified Axios request configuration.
 */
function interceptorRequestFulfilled(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (typeof window !== "undefined") {
        const token = localStorage?.getItem("authToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
    return config;
}

/**
 * Handles rejected request errors.
 * @param error - The Axios error object related to the request failure.
 * @returns A promise that rejects with the provided Axios error.
 */
function interceptorRequestRejected(error: AxiosError) {
    return Promise.reject(error);
}

/**
 * Handles fulfilled responses.
 * @param response - The Axios response object.
 * @returns The Axios response object.
 */
function interceptorResponseFulfilled(response: AxiosResponse): AxiosResponse {
    return response;
}

/**
 * Handles rejected responses.
 * @param error - The Axios error object related to the response failure.
 * @returns A promise that rejects with the provided Axios error.
 */
function interceptorResponseRejected(error: AxiosError): Promise<never> | undefined {
    console.log("🚫 ~ interceptorResponseRejected ~ error:", error);
    if (typeof window !== "undefined" && error instanceof AxiosError) {
        const status = error?.response?.status;

        if (typeof status !== "number") return Promise.reject(error);

        handleAuthError(status);
        return Promise.reject(error);
    }
    return Promise.reject(error);
}

export {
    interceptorRequestFulfilled,
    interceptorRequestRejected,
    interceptorResponseFulfilled,
    interceptorResponseRejected,
};
