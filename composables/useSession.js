import { reactive } from "vue";
import { useCookies } from "@vueuse/integrations/useCookies";

const cookies = useCookies();
const sessionCookie = cookies.get("session");
const sessionStorage = localStorage.getItem("session");

const getAnonymousSession = () =>
  reactive({
    user: {
      nickname: "游客",
      username: "",
      xm: "",
      id: null,
      permission: 0,
      openid: "",
      avatar: "",
    },
    roles: {},
  });

const removeSession = () => {
  localStorage.removeItem("session");
  cookies.remove("session");
};

const refreshSession = () => {
  removeSession();
  return getAnonymousSession();
};

const getSession = () => {
  if (!sessionCookie || !sessionStorage) {
    console.log("没有从localStorage或cookie解析到session");
    return refreshSession();
  }
  try {
    const session = JSON.parse(sessionStorage);
    if (typeof session !== "object" || typeof session.user !== "object") {
      console.log("没有从localStorage解析到session");
      return refreshSession();
    }
    if (!session.expire) {
      console.log("客户端未设置expire字段，SESSION过期");
      return refreshSession();
    }
    if (new Date().getTime() > session.expire) {
      console.log("客户端SESSION过期");
      return refreshSession();
    }
    if (typeof session.user !== "object" || !session.user.id) {
      console.log("没有从session找到登陆user");
      return refreshSession();
    }
    console.log("session有效期内");
    return reactive(session);
  } catch (error) {
    return refreshSession();
  }
};

const session = getSession();

const useSession = () => {
  console.log("useSession called");
  return session;
};

export { getAnonymousSession, removeSession, useSession };
export default useSession;
