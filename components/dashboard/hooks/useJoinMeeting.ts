import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import {NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export const useJoinMeeting =  () => {
  const queryClient = useQueryClient()
  const userId =  useUserStore().getLoginData().userId
  const tenantId = useUserStore().getLoginData().tenantId
  return useMutation({
    mutationFn: (meetingId: string) => {
      return axiosInstance.post(`${NABU_MEETING_API_ENDPOINT}/${meetingId}/join`, {}, {
        headers: { 
            "X-User-Id": userId,
            "X-Tenant-Id": tenantId
        },
      });
    },
    onError: () => {
      toast.error("Failed to join meeting");
    },
    onSuccess: async (data, variables) => {
        
    },
  });
};
