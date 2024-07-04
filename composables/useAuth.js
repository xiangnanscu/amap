import { timeParser } from "~/lib/utils";
import { useSession, getAnonymousSession, removeSession } from "~/composables/useSession";

const LIFETIME_SECONDS = timeParser(process.env.COOKIE_EXPIRES || "30d");

const session = useSession();

function login({ user, roles }) {
  if (user) {
    Object.assign(session.user, user);
  }
  if (roles) {
    Object.assign(session.roles, roles);
  }
  session.expire = LIFETIME_SECONDS * 1000 + new Date().getTime();
  const sessionStr = JSON.stringify({
    user: session.user,
    roles: session.roles,
    expire: session.expire,
  });
  localStorage.setItem("session", sessionStr);
}

function logout() {
  session.user = getAnonymousSession().user;
  session.roles = {};
  removeSession();
}

export const useUser = () => {
  const { user } = useSession();
  return user;
};

export const useRoles = () => {
  const { roles } = useSession();
  return roles;
};

export default () => {
  return {
    session,
    login,
    logout,
  };
};
