import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuth } from "../types/UserTypes";

type IAxiosFetch = (
  url: string,
  options?: AxiosRequestConfig
) => Promise<AxiosResponse<any>>;

const axiosFetch: IAxiosFetch = async (url, options) => {
  const authStorage = localStorage.getItem("auth");
  /**
   * Configuraciíon para request web
   */
  if (authStorage) {
    const authWeb: IAuth = JSON.parse(authStorage);
    const headers = {
      ...options?.headers,
      authorization: `Bearer ${authWeb.csrfToken}`,
    };
    return await axios(url, {
      ...options,
      headers,
      withCredentials: true,
    }).then((response) => response.data);
  }

  return await axios(url, options);
};

export default axiosFetch;
