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
};

export const useEndMeeting = () => {
    const meetingId = useMeetingStore.getState().meetingId;
    const duration = useMeetingStore.getState().duration;
    const userId =  useUserStore().getLoginData().userId 
    
    return useMutation({
        mutationFn: (payload: EndMeetingPayload) => {
            return axiosInstance.post(
                `${NABU_MEETING_API_ENDPOINT}/end`,
                payload,
                {
                     headers: { "X-User-Id": userId},
                },
            );
        },
        onError: () => {
            toast.error("Failed to end meeting");
        },
        onSuccess: async (data, variables) => {
            const results = data.data;
           
        },
    });
};
