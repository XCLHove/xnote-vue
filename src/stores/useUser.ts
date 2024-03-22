import { defineStore } from "pinia";
import { onBeforeMount, onUnmounted, Ref, ref } from "vue";
import { User } from "@/interfaces/entity/User.ts";
import LocalStorageKey from "@/enums/LocalStorageKey.ts";
import { getUserSelfInfo, userLogout } from "@/api/UserApi.ts";
import { elPrompt } from "@/utils/elPrompt.ts";
import { useShowUserLogin } from "@/stores/useShowUserLoginAndRegister.ts";
import { onLogin } from "@/utils/onLogin.ts";
import { onLogout } from "@/utils/onLogout.ts";

export const useUser = defineStore("user", () => {
    const value: Ref<User | null | undefined> = ref();

    const getUserInfo = () => {
        const token = localStorage.getItem(LocalStorageKey.TOKEN);
        if (!token) return;
        getUserSelfInfo().then((result) => {
            value.value = result.data;
        });
    };
    const removeLoginListener = onLogin(() => {
        getUserInfo();
    });
    const removeLogoutListener = onLogout(() => {
        value.value = null;
    });

    onBeforeMount(() => {
        getUserInfo();
    });
    onUnmounted(() => {
        removeLoginListener();
        removeLogoutListener();
    });

    const logout = () => {
        userLogout().then(() => {
            localStorage.removeItem(LocalStorageKey.TOKEN);
            elPrompt.success("注销成功！");
            useShowUserLogin().hide();
        });
    };

    return {
        value,
        logout,
    };
});
