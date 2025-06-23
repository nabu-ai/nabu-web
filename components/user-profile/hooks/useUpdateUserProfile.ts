import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

type SignInResponse = {
  accessToken: string;
};

export type UseProfileUpdatePayload = {
    id: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export const useUpdateUserProfile = () => {
    const loginData = useUserStore.getState().loginData;
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UseProfileUpdatePayload) => {
      return axiosInstance.put(
        `${NABU_USER_API_ENDPOINT}users/${loginData.userId}/update`,
        payload,
        {
          headers: { "Content-Type": undefined },
        },
      );
    },
    onError: () => {
      toast.error("Failed to update user profile information");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;
        queryClient.invalidateQueries({
            queryKey: ['get-user-profile'],
            exact: true, // only if key must match exactly
        });
    },
  });
};
