import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export const useCancelMeeting = () => {
  const queryClient = useQueryClient()
  const userId = useUserStore().getLoginData().userId
  const tenantId = useUserStore().getLoginData().tenantId
  const accessToken = useUserStore().getLoginData().accessToken
  return useMutation({
    mutationFn: (meetingId: string) => {
      return axiosInstance.post(`${NABU_MEETING_API_ENDPOINT}/${meetingId}/cancel`, {}, {
        headers: {
          "X-User-Id": userId,
          "X-Tenant-Id": tenantId,
          "Authorization": "Bearer " + accessToken
        },
      });
    },
    onError: () => {
      toast.error("Failed to cancel meeting");
    },
    onSuccess: async (data, variables) => {
      toast.success("Meeting cancelled successfully")
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
