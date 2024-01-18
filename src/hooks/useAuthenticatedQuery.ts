import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface useAuthenticatedQueryProps {
  queryKey: string[];
  url: string;
  confing: AxiosRequestConfig;
}

const useAuthenticatedQuery = ({
  queryKey,
  url,
  confing,
}: useAuthenticatedQueryProps) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, confing);
      return data;
    },
  });
};
export default useAuthenticatedQuery;
