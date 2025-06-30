import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_MEETING_API_ENDPOINT, NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export type UseNewMeetingPayload = {
    agenda: string;
    hostLanguage: string;
    hostHeardAs: string;
    participants: any;
};

export const useNewMeeting = () => {
    const loginData = useUserStore().getLoginData();
    const userId = useUserStore().getLoginData().userId
  const tenantId = useUserStore().getLoginData().tenantId
  const accessToken = useUserStore().getLoginData().accessToken
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UseNewMeetingPayload) => {
       return axiosInstance.post(
        `${NABU_MEETING_API_ENDPOINT}/trial`,
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
      toast.error("Failed to create new meeting");
    },
    onSuccess: async (data, variables) => {
      toast.success("Meeting created successfully")
        queryClient.invalidateQueries({
            queryKey: ['get-meetings'],
            exact: true, // only if key must match exactly
        });
         queryClient.invalidateQueries({
            queryKey: ['get-meeting-stats'],
            exact: true, // only if key must match exactly
        });
    },
  });
};
