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
  const userId = useUserStore().getLoginData().userId
  const tenantId = useUserStore().getLoginData().tenantId
  const accessToken = useUserStore().getLoginData().accessToken
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UseProfileUpdatePayload) => {
      return axiosInstance.put(
        `${NABU_USER_API_ENDPOINT}/${userId}/update`,
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
