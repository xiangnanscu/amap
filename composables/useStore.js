import { ref } from "vue";
import useAuth from "~/composables/useAuth";
import { version } from "../package.json";

const { session, login, logout } = useAuth();

const siderKeys = ref([]);
const headerLeftKeys = ref([]);
const headerRightKeys = ref([]);
const loading = ref(false);
const disableLoading = ref(false);

const useStore = () => {
  return {
    version: ref(version),
    session,
    login,
    logout,
    siderKeys,
    headerLeftKeys,
    headerRightKeys,
    loading,
    disableLoading,
  };
};

export default useStore;
