import { NEXT_PUBLIC_BASE_PATH } from "@/constants"

export function handleAuthError(status?: number) {
    switch (status) {
        case 401:
            //useMemberStore.setState({ loggedIn: false, firstName: null, authorities: [] });
            window.location.replace(`${window.location.origin}${NEXT_PUBLIC_BASE_PATH}/login`);
            break;
        case 403:
            window.location.replace(`${window.location.origin}${NEXT_PUBLIC_BASE_PATH}/403`);
            break;
        default:
            break;
    }
}
