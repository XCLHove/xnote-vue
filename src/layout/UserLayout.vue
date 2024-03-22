<script setup lang="ts">
import Icp from "../component/Footer.vue";
import { computed, onMounted, ref } from "vue";
import Login from "../views/user/Login.vue";
import Register from "../views/user/Register.vue";
import Menu from "@/component/Menu.vue";
import {
    useShowUserLogin,
    useShowUserRegister,
} from "@/stores/useShowUserLoginAndRegister.ts";
import { storeToRefs } from "pinia";
import { useUser } from "@/stores/useUser.ts";

// head
const { value: user } = storeToRefs(useUser());
const avatarContent = computed(() => {
    const c = user.value?.name?.charAt(0);
    return c ? c : "登录";
});

// left menu
const screenWidth = ref(0);
onMounted(() => {
    screenWidth.value = window.innerWidth;
});
const showAsideMenu = computed(() => {
    return screenWidth.value > 450;
});

const showDrawerMenu = ref(false);

//content
</script>

<template>
    <div class="layout">
        <Login />
        <Register />
        <el-container>
            <el-header>
                <div class="head">
                    <i
                        class="menu-button iconfont icon-menu"
                        v-show="!showAsideMenu"
                        @click="showDrawerMenu = true"
                    />
                    <h1>XNote</h1>
                    <div class="avatar">
                        <el-dropdown>
                            <el-avatar>
                                <div>{{ avatarContent }}</div>
                            </el-avatar>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-if="!user"
                                        @click="useShowUserLogin().show()"
                                        >登录</el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        v-if="!user"
                                        @click="useShowUserRegister().show()"
                                        >注册</el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        v-if="user"
                                        @click="useUser().logout()"
                                        >注销</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>

            <el-container>
                <div class="menu">
                    <div class="aside" v-if="showAsideMenu">
                        <el-aside>
                            <Menu />
                        </el-aside>
                    </div>
                    <div class="drawer" v-else>
                        <el-drawer
                            v-model="showDrawerMenu"
                            title="菜单"
                            size="150"
                            direction="ltr"
                        >
                            <Menu />
                        </el-drawer>
                    </div>
                </div>
                <el-main>
                    <el-scrollbar>
                        <div class="view">
                            <RouterView />
                        </div>
                    </el-scrollbar>
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
        width: 100%;
        height: 100%;

        .el-header {
            border: var(--color-lightGray) 1px solid;

            .head {
                display: flex;
                align-items: center;

                .menu-button {
                    margin-right: 10px;

                    &:hover {
                        transition: color linear 0.2s;
                    }
                }

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
                .aside {
                    width: 120px;
                    height: calc(100vh - 90px);
                    border-right: var(--color-lightGray) solid 1px;

                    .el-aside {
                        width: 100%;
                    }
                }
            }

            .el-main {
                .el-scrollbar {
                    height: calc(100vh - 120px);

                    .view {
                        width: 99%;
                    }
                }
            }
        }
    }
}
</style>
