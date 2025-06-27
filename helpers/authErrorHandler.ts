import { NABU_PUBLIC_BASE_PATH } from "@/constants"
import { useMeetingStore } from "@/store/useMeetingStore";
import { useUserStore } from "@/store/useUserStore";

export function handleAuthError(status?: number) {
    switch (status) {
        case 401:
            //useMemberStore.setState({ loggedIn: false, firstName: null, authorities: [] });
            // clear the store
            useUserStore.setState(useUserStore.getInitialState())
            useMeetingStore.setState(useMeetingStore.getInitialState())
            window.location.replace(`${window.location.origin}/nabu-web/signin`);
            break;
        case 403:
            window.location.replace(`${window.location.origin}${NABU_PUBLIC_BASE_PATH}/403`);
            break;
        default:
            break;
    }
}
