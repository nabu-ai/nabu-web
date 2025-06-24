import axiosInstance from "@/services/axios-service";
import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export const useSignOut = ({ router }) => {
  return useMutation({
    mutationFn: () => {
      return axiosInstance.post(`${NABU_USER_API_ENDPOINT}user/logout`, {
        headers: { "Content-Type": undefined },
      });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;

      if (results.accessToken) {
        useUserStore.setState(useUserStore.getInitialState());
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      }
    },
  });
};
