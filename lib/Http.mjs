import { createFetch } from "@vueuse/core";
import useStore from "~/composables/useStore";
import router from "@/router";

// https://vueuse.org/core/useFetch/#type-declarations

const viteEnv = import.meta.env;
const scheme = viteEnv.VITE_HTTPS === "on" ? "https" : "http";
const scheme_dev = viteEnv.VITE_HTTPS_DEV === "on" ? "https" : "http";
const baseUrl =
  process.env.NODE_ENV === "production"
    ? `${scheme}://${window.location.host}`
    : `${scheme_dev}://${window.location.host}${viteEnv.VITE_PROXY_PREFIX || ""}`;

const useFetch = createFetch({
  baseUrl,
  options: {
    timeout: 0,
    beforeFetch({ url, options, cancel }) {
      const { loading, version } = useStore();
      loading.value = true;
      options.headers = {
        ...options.headers,
        "X-Version": version.value,
        "X-Requested-With": "XMLHttpRequest",
      };
      return { options };
    },
    afterFetch({ data }) {
      const { loading } = useStore();
      loading.value = false;
      return { data };
    },
    onFetchError({ error, response, data }) {
      const { loading } = useStore();
      loading.value = false;
      console.error("Fetch 错误捕获:", error, response, data);
      if (response) {
        const { data, status, url } = response;
        const currentUrl = router.currentRoute.value.fullPath;
        if (status === 403 && data === process.env.INSUFFICIENT_PERMISSION_TEXT) {
          const realUrl =
            process.env.NODE_ENV === "production"
              ? url
              : url.slice(process.env.VITE_PROXY_PREFIX.length);
          router.push({
            name: realUrl.startsWith("/admin") ? "AdminUserLogin" : "UserLogin",
            query: { redirect: currentUrl },
          });
        }
      }

      return { error, data };
    },
  },
  fetchOptions: {
    mode: "cors",
    credentials: "include",
  },
});

async function post(url, payload, config = {}) {
  const result = await useFetch(url, config).post(payload).json();
  const { data, error, response, statusCode } = result;
  if (error.value) {
    throw error.value;
  }
  return { data, response, statusCode };
}

async function get(url, config = {}) {
  const result = await useFetch(url, config).get().json();
  const { data, error, response, statusCode } = result;
  if (error.value) {
    throw error.value;
  }
  return { data, response, statusCode };
}

const Http = {
  post,
  get,
};

export const usePost = async (url, payload, config = {}) => {
  const { data } = await post(url, payload, config);
  return data.value;
};
export const useGet = async (url, config = {}) => {
  const { data } = await get(url, config);
  return data.value;
};
export default Http;
