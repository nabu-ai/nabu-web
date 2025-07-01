import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_AUTH_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";
import { useGetUserProfile } from "@/components/user-profile/hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";

type SignInResponse = {
  accessToken: string;
};

export type UseLoginPayload = {
  email: string;
  password: string;
};

export const useSignIn = ({router}) => {

  const loginData = useUserStore().getLoginData();

  useEffect(() => {
    if(loginData.accessToken){
      router.push("/dashboard");
    }
  }, [loginData.accessToken])

  
    
  //const { data: userInfo, isLoading, isSuccess } = useGetUserProfile(userId);

  return useMutation({
    mutationFn: ({ email, password }: UseLoginPayload) => {
     
      return axiosInstance.post(
        `${NABU_AUTH_API_ENDPOINT}/login`,
        { email, password },
        {
          headers: { 
            "Content-Type": undefined ,
          },
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
          useMeetingStore.setState(useMeetingStore.getInitialState());
      }
    },
  });
};
