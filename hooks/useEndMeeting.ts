import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMeetingStore } from "@/store/useMeetingStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

type SignInResponse = {
    accessToken: string;
};

export type EndMeetingPayload = {
    meetingId: string;
    duration: number;
    trialDuration: number;
};

export const useEndMeeting = ({ router }) => {
    const userId = useUserStore().getLoginData().userId
    const tenantId = useUserStore().getLoginData().tenantId
    const accessToken = useUserStore().getLoginData().accessToken

    return useMutation({
        mutationFn: (payload: EndMeetingPayload) => {
            return axiosInstance.post(
                `${NABU_MEETING_API_ENDPOINT}/end`,
                payload,
                {
                    headers: {
                        "X-User-Id": userId,
                        "X-Tenant-Id": tenantId,
                        "Authorization": "Bearer " + accessToken
                    },
                },
            );
        },
        onError: () => {
            toast.error("Failed to end meeting");
        },
        onSuccess: async (data, variables) => {
            router.push("/dashboard")
        },
    });
};
