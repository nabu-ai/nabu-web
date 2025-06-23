import axiosInstance from "@/services/axios-service";
import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";

type SignInResponse = {
  accessToken: string;
};

export type UseProfileUpdatePayload = {
    id: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phoneNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export const useUpdateUserProfile = () => {
    const loginData = useUserStore.getState().loginData;

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
      alert("Failed to login");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;

      
      //alert("Successfully logged in.");
    },
  });
};
