import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_GUEST_MEETING_API_ENDPOINT, NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";
import { useMeetingStore } from "@/store/useMeetingStore";


export type GuestMeetingUpdatePayload = {
    language: string;
    voiceHeardAs: string;
    name: string;
};

export const useUpdateGuestMeeting = () => {
    const meetingInfo = useMeetingStore().meetingInfo
    const tenantId = meetingInfo.tenantId
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GuestMeetingUpdatePayload) => {
      return axiosInstance.put(
        `${NABU_GUEST_MEETING_API_ENDPOINT}/trial`,
        payload,
        {
          headers: { "X-Tenant-Id": tenantId },
        },
      );
    },
    onError: () => {
      toast.error("Failed to update guest profile information");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;
       
    },
  });
};
