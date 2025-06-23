import axios from "axios";
import { NABU_PUBLIC_API_ENDPOINT as publicApi } from "@/constants";
import {
  interceptorRequestFulfilled,
  interceptorRequestRejected,
  interceptorResponseFulfilled,
  interceptorResponseRejected,
} from "./interceptors";
import { useUserStore } from "@/store/useUserStore";

export const envBaseURL = !!publicApi ? `${publicApi}/api` : `/api`;

const axiosInstance = axios.create({
  // baseURL: envBaseURL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer "+useUserStore.getState().loginData.accessToken,
    "X-Tenant-Id": useUserStore.getState().loginData.tenantId
  },
  ...(!!publicApi && { withCredentials: true }),
});

axiosInstance.interceptors.request.use(interceptorRequestFulfilled, interceptorRequestRejected);
axiosInstance.interceptors.response.use(interceptorResponseFulfilled, interceptorResponseRejected);

export default axiosInstance;
