import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

export type AxiosRequestOptionsType<T = unknown> = {
  method: Method;
  url: string;
  data?: T;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export type AxiosHttpResponseType<R = unknown> = {
  data: R;
  status: number;
  statusText: string;
}

const baseUrl = "http://localhost:5000/api/v1";

export async function apiService<T = unknown, R = unknown>(
  options: AxiosRequestOptionsType<T>,
): Promise<AxiosHttpResponseType<R>> {
  const {
    method,
    url,
    data,
    headers = {},
    signal,
  } = options;

  const config: AxiosRequestConfig = {
    method,
    url: `${baseUrl}/${url}`,
    headers: {
      "Accept": "application/json",
      ...(method !== "GET" && method !== "HEAD"
        ? { "Content-Type" : "application/json" }
        : {}
      ),
      ...headers,
    },
    data,
    signal,
    withCredentials: true,
  }

  try {
    const response: AxiosResponse<R> = await axios(config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data.message || error.message;
      throw new Error(
        `Request failed: ${message}`
      )
    } else {
      throw error;
    }
  }
}