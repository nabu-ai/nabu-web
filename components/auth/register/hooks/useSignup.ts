import axiosInstance from "@/services/axios-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/store/useUserStore";
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { toast } from "sonner";

export type UseNewRegistrationPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
    phoneNumber: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export const useNewRegistration = () => {

    return useMutation({
        mutationFn: (payload: UseNewRegistrationPayload) => {
            return axiosInstance.post(
                `${NABU_USER_API_ENDPOINT}/register`,
                payload,
                {

                },
            );
        },
        onError: (data) => {
            const errorMsg = data?.response?.data?.error?": "+data?.response?.data?.error:""
            toast.error("Failed registration" + errorMsg);
        },
        onSuccess: async (data, variables) => {
            toast.success("User registered successfully")

        },
    });
};
