<script setup lang="ts">
import Icp from "../Icp.vue";
import { computed, onMounted, Ref, ref } from "vue";
import { User } from "../../interfaces/entity/User.ts";
import { getUserSelf, userLogout } from "../../api/UserApi.ts";
import { Result } from "../../interfaces/Result.ts";
import router from "../../router/router.ts";
import Login from "../../views/user/Login.vue";
import LocalStorageKey from "../../enums/LocalStorageKey.ts";
import { showUserLogin, showUserRegister } from "../../utils/showLogin.ts";
import { elPrompt } from "../../utils/elPrompt.ts";
import Register from "../../views/user/Register.vue";
import { loginListener } from "../../utils/loginListener.ts";

// head
const user: Ref<User | undefined | null> = ref();
const avatarContent = ref("登录");
onMounted(() => {
    getUserInfo();
});

const removeLoginListener = loginListener(() => {
    getUserInfo();
});

const getUserInfo = () => {
    const token = localStorage.getItem(LocalStorageKey.TOKEN);
    if (!token) return;
    getUserSelf((result: Result<User>) => {
        user.value = result.data;
        avatarContent.value = user.value.name?.charAt(0);
    });
};

const showLogin = computed(() => {
    return !user.value;
});

const logout = () => {
    userLogout((result: Result<any>) => {
        localStorage.removeItem(LocalStorageKey.TOKEN);
        user.value = null;
        avatarContent.value = "登录";
        elPrompt.success("注销成功！");
    });
};

// left menu
const screenWidth = ref(0);
onMounted(() => {
    screenWidth.value = window.innerWidth;
});
const showAsideMenu = computed(() => {
    return screenWidth.value > 450;
});

const showDrawerMenu = ref(false);

const menus = ref([
    {
        title: "笔记",
        index: "1",
        event: () => {},
        children: [
            {
                title: "发布笔记",
                index: "1-1",
                event: () => router.push("/edit/"),
            },
            {
                title: "我的笔记",
                index: "1-2",
                event: () => router.push(`/notes/user`),
            },
        ],
    },
]);

//content
</script>

<template>
    <div class="layout">
        <Login />
        <Register />
        <el-container>
            <el-header>
                <div class="head">
                    <h1>XNote</h1>
                    <div class="avatar">
                        <el-dropdown>
                            <el-avatar>
                                <div>{{ avatarContent }}</div>
                            </el-avatar>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-if="showLogin"
                                        @click="showUserLogin()"
                                        >登录</el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        v-if="showLogin"
                                        @click="showUserRegister()"
                                        >注册</el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        v-if="!showLogin"
                                        @click="logout"
                                        >注销</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
            <el-container>
                <button
                    class="menu-button"
                    v-show="!showAsideMenu"
                    @click="showDrawerMenu = true"
                >
                    菜单
                </button>
                <div v-if="showAsideMenu">
                    <el-aside>
                        <div class="menu">
                            <el-menu>
                                <el-menu-item
                                    index="0"
                                    @click="router.push('/')"
                                    >首页</el-menu-item
                                >
                                <el-sub-menu
                                    v-for="menu in menus"
                                    :index="menu.index"
                                >
                                    <template #title
                                        ><span>{{ menu.title }}</span></template
                                    >
                                    <el-menu-item
                                        v-for="menuChild in menu.children"
                                        :index="menuChild.index"
                                        @click="menuChild.event"
                                    >
                                        <span>{{ menuChild.title }}</span>
                                    </el-menu-item>
                                </el-sub-menu>
                            </el-menu>
                        </div>
                    </el-aside>
                </div>
                <div v-else>
                    <el-drawer
                        class="el-drawer"
                        v-model="showDrawerMenu"
                        title="菜单"
                        size="150"
                        direction="ltr"
                    >
                        <div class="menu">
                            <el-menu>
                                <el-menu-item
                                    index="0"
                                    @click="router.push('/')"
                                    >首页</el-menu-item
                                >
                                <el-sub-menu
                                    v-for="menu in menus"
                                    :index="menu.index"
                                >
                                    <template #title
                                        ><span>{{ menu.title }}</span></template
                                    >
                                    <el-menu-item
                                        v-for="menuChild in menu.children"
                                        :index="menuChild.index"
                                        @click="menuChild.event"
                                    >
                                        <span>{{ menuChild.title }}</span>
                                    </el-menu-item>
                                </el-sub-menu>
                            </el-menu>
                        </div>
                    </el-drawer>
                </div>
                <el-main>
                    <div class="view">
                        <RouterView />
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <Icp />
    </div>
</template>

<style scoped lang="less">
.layout {
    width: 100%;
    height: 100%;

    .el-container {
        .el-header {
            border: #dcdfe6 1px solid;

            .head {
                display: flex;
                align-items: center;

                h1 {
                    margin: 15px 0;
                }

                .avatar {
                    font-size: 25px;
                    position: absolute;
                    right: 15px;
                }
            }
        }

        .el-container {
            .menu {
                .el-menu {
                    border: none;

                    .el-sub-menu {
                        .el-menu-item {
                            padding: 0 30px;
                        }
                    }
                }
            }

            .el-aside {
                width: 100px;
                height: 100%;
            }

            .el-drawer {
            }

            .menu-button {
                padding: 5px;
                font-size: 16px;
                position: absolute;
                left: 0;
                top: 60px;
                border: none;
                z-index: 20;
                background: none;

                &:hover {
                    transition: color linear 0.2s;
                    color: var(--color-vue);
                }
            }

            .el-main {
                .view {
                    height: calc(100vh - 120px);
                }
            }
        }
    }
}
</style>
