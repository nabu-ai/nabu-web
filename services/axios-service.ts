import axios from "axios";
import { NEXT_PUBLIC_API_ENDPOINT as publicApi } from "@/constants";
import {
  interceptorRequestFulfilled,
  interceptorRequestRejected,
  interceptorResponseFulfilled,
  interceptorResponseRejected,
} from "./interceptors";

export const envBaseURL = !!publicApi ? `${publicApi}/api` : `/api`;

const axiosInstance = axios.create({
  baseURL: envBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  ...(!!publicApi && { withCredentials: true }),
});

axiosInstance.interceptors.request.use(interceptorRequestFulfilled, interceptorRequestRejected);
axiosInstance.interceptors.response.use(interceptorResponseFulfilled, interceptorResponseRejected);

export default axiosInstance;
