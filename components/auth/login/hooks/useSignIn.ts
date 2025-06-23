import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

type SignInResponse = {
  accessToken: string;
};

export type UseLoginPayload = {
  email: string;
  password: string;
};

export const useSignIn = ({router}) => {
  const queryClient = useQueryClient()
    const loginData = useUserStore.getState().loginData;
  return useMutation({
    mutationFn: ({ email, password }: UseLoginPayload) => {
     
      return axiosInstance.post(
        `${NABU_USER_API_ENDPOINT}auth/login`,
        { email, password },
        {
          headers: { "Content-Type": undefined },
        },
      );
    },
    onError: () => {
      toast.error("Failed to login");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;

      if (results.accessToken) {
        
        useUserStore.setState({
              loginData: {
                accessToken: results.accessToken,
                userId: results.userId,
                tenantId: results.tenantId
              }})
      setTimeout(() => {
       router.push("/dashboard");
      }, 1000);
       
      }
    },
  });
};
