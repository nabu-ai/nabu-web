import axiosInstance from "@/services/axios-service";
import { useMutation } from "@tanstack/react-query";

type SignInResponse = {
  accessToken: string;
};

export type UseLoginPayload = {
  email: string;
  password: string;
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: UseLoginPayload) => {
      return axiosInstance.post(
        `/auth/login`,
        { email, password },
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
      if (results.accessToken) {
        window.location.href = "/dashboard";
      }
      alert("Successfully logged in.");
    },
  });
};
