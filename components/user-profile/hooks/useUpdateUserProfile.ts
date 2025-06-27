import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";


export type UseProfileUpdatePayload = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  nonVerbal: boolean;
  hearingImpaired: boolean;
};

export const useUpdateUserProfile = () => {
  const loginData = useUserStore().getLoginData();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UseProfileUpdatePayload) => {
      return axiosInstance.put(
        `${NABU_USER_API_ENDPOINT}/${loginData.userId}/update`,
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
      toast.success("Profile updated successfully")
      queryClient.invalidateQueries({
        queryKey: ['get-user-profile'],
        exact: true, // only if key must match exactly
      });
    },
  });
};
