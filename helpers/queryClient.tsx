import { queryClientOptions } from "@/constants/queryClientOptions";
import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient(queryClientOptions);
}
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}
