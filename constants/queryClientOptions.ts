import { DefaultOptions, QueryCache, QueryClientConfig } from "@tanstack/react-query";
import { handleQueryError } from "../helpers";

export const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

const queryCacheInstance = new QueryCache({
    onError: handleQueryError,
});

export const defaultQueryOptions: DefaultOptions = {
    queries: {
        staleTime: ONE_MINUTE_IN_MILLISECONDS,
        retry: false,
    },
};

export const queryClientOptions: QueryClientConfig = {
    defaultOptions: defaultQueryOptions,
    queryCache: queryCacheInstance,
};
