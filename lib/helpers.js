import { usePost } from "~/lib/Fetch";
import { useUser } from "~/composables/useAuth";

const isGod = () => {
  return useUser().permission === Number(process.env.GOD_PERMISSION);
};

export async function getRoles(data = {}) {
  const roles = await usePost(`/role/get_roles`, data);
  roles.isGod = isGod();
  return roles;
}

export async function getPassedRoles(data = {}) {
  const roles = await usePost(`/role/get_roles`, { ...data, status: "通过" });
  roles.isGod = isGod();
  return roles;
}

export function isTopBranch() {
  const roles = useRoles();
  return roles.sys_admin || (roles.branch_admin && !roles.branch_admin.branch_id__pid);
}

export function IsLeaderBranch() {
  const roles = useRoles();
  return roles.sys_admin || (roles.branch_admin && roles.branch_admin.branch_id__type !== "团支部");
}
