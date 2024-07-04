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

const useMyFetch = createFetch({
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
    afterFetch({ data, response }) {
      const { loading } = useStore();
      loading.value = false;
      return { data };
    },
    onFetchError({ error, response, data }) {
      console.log("onFetchError", response);
      const { loading } = useStore();
      loading.value = false;
      const { status, url } = response;
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

      return { error, data };
    },
  },
  fetchOptions: {
    mode: "cors",
    credentials: "include",
  },
});

async function post(url, payload, config = {}) {
  const result = await useMyFetch(url, config).post(payload).json();
  const { data, error, response, statusCode } = result;
  if (error.value) {
    throw error.value;
  }
  return { data: data.value, response: response.value, statusCode: statusCode.value };
}

async function get(url, config = {}) {
  const result = await useMyFetch(url, config).get().json();
  const { data, error, response, statusCode } = result;
  if (error.value) {
    throw error.value;
  }
  return { data: data.value, response: response.value, statusCode: statusCode.value };
}

const Fetch = {
  post,
  get,
};

export { useMyFetch };
export const usePost = async (url, payload, config = {}) => {
  const { data } = await post(url, payload, config);
  return data;
};
export const useGet = async (url, config = {}) => {
  const { data } = await get(url, config);
  return data;
};
export default Fetch;
