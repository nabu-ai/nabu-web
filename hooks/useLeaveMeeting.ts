import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMeetingStore } from "@/store/useMeetingStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

export type LeaveMeetingPayload = {
    meetingId: string;
    participantId: string;
    duration: number;
};

export const useLeaveMeeting = () => {
   
    const userId =  useUserStore().getLoginData().userId 
    const tenantId = useUserStore().getLoginData().tenantId
    
    return useMutation({
        mutationFn: (payload: LeaveMeetingPayload) => {
            return axiosInstance.post(
                `${NABU_MEETING_API_ENDPOINT}/leave`,
                payload,
                {
                     headers: { 
                        "X-User-Id": userId,
                        "X-Tenant-Id" : tenantId
                    },
                },
            );
        },
        onError: () => {
            toast.error("Failed to leave meeting");
        },
        onSuccess: async (data, variables) => {
            const results = data.data;
           window.location.href = "nabu-io.com";
        },
    });
};
