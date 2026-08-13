import axios, { AxiosInstance, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import config from "../../config";
import { currentTokenVar } from "../../apollo/cache/auth";

const mockAssetUrl = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`;

// Terminating "adapter" used while the real backend is unreachable — answers
// file-upload requests with a fake response instead of hitting the network.
// Reads whatever field names were appended to the outgoing FormData and
// echoes back a matching `{ [field]: [{ url }] }` shape, since that's what
// every upload call site (buses/drivers/user-details forms) expects back.
const mockAdapter = (requestConfig: any): Promise<AxiosResponse> => {
  const data: Record<string, { url: string }[]> = {};
  const formData = requestConfig.data;
  if (formData && typeof formData.forEach === "function") {
    let i = 0;
    formData.forEach((_value: unknown, key: string) => {
      data[key] = [{ url: mockAssetUrl(`${key}-${i++}`) }];
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: { data },
        status: 200,
        statusText: "OK",
        headers: {},
        config: requestConfig,
      });
    }, 400);
  });
};

export default function useApi(): AxiosInstance {
  console.log("config", config.asset.uri);

  const batman = axios.create({
    baseURL: "http://localhost:80/api/v2",
    // timeout: 5000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
    },
    ...(config.mockBackend ? { adapter: mockAdapter } : {}),
  });

  batman.interceptors.request.use(
    function (config) {
      const authorization = currentTokenVar();
      if (authorization) {
        config = {
          ...config,
          headers: {
            ...config.headers,
            authorization,
          } as any,
        };
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  batman.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.message === "Network Error") {
        toast(
          JSON.stringify({
            type: "error",
            title: "Network connection lost. Connect and try again",
          })
        );
        return;
      } else if (
        error.response.status === 401 ||
        error.response.data.response ===
          "Sorry, we couldn't verify your identity. Please try again" ||
        error.response.data.response ===
          "Please attach authorization token to your headers"
      ) {
        toast(
          JSON.stringify({ type: "error", title: error.response.data.response })
        );
      }
      return Promise.reject(error);
    }
  );

  return batman;
}
