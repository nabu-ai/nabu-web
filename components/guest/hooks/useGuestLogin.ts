import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore"; 
import { NABU_AUTH_API_ENDPOINT, NABU_GUEST_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";
import { useGetUserProfile } from "@/components/user-profile/hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";

export type UseGuestLoginPayload = {
  email: string;
};

export const useGuestLogin = () => {

  const [userId, setUserId] = useState()
  const queryClient = useQueryClient()
  const tenantId = useMeetingStore().meetingInfo.tenantId;
  
  
    
  //const { data: userInfo, isLoading, isSuccess } = useGetUserProfile(userId);

  return useMutation({
    mutationFn: (email:string) => {
     
      return axiosInstance.get(
        `${NABU_GUEST_API_ENDPOINT}/access-token?name=${email}`,
        {
          headers: { "X-Tenant-Id": tenantId },
        },
      );
    },
    onError: () => {
      toast.error("Failed to login guest");
    },
    onSuccess: async (data, variables) => {
      const results = data.data;

      if (results.accessToken) {
       
         useUserStore.setState({
              loginData: {
                accessToken: results.accessToken,
                tenantId: results.tenantId
              }})
      }
    },
  });
};
