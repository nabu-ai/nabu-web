import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import { NABU_AUTH_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export const useSignOut = ({ router }) => {
  const userId = useUserStore().getLoginData().userId
  const tenantId = useUserStore().getLoginData().tenantId
  const accessToken = useUserStore().getLoginData().accessToken
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => {
      return axiosInstance.post(`${NABU_AUTH_API_ENDPOINT}/logout`, {}, {
        headers: {
          "X-User-Id": userId,
          "X-Tenant-Id": tenantId,
          "Authorization": "Bearer " + accessToken
        },
      });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
    onSuccess: async (data, variables) => {
      queryClient.removeQueries()
      useUserStore.setState(useUserStore.getInitialState());
      setTimeout(() => {
        router.push("/signin");
      }, 1000);

    },
  });
};
