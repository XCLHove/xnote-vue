<script setup lang="ts">

import Beianhao from "../Beianhao.vue";
import LeftMenu from "./LeftMenu.vue";
import Head from "./Head.vue";
import {computed, onMounted, ref} from "vue";

const screenWidth = ref(0)
const showDrawerMenu = ref(false)
const showAsideMenu = computed(() => {
  return screenWidth.value > 450
})
onMounted(() => {
  screenWidth.value = window.innerWidth
})
</script>

<template>
  <div class="layout">
    <el-container>
      <el-header>
        <Head/>
      </el-header>
      <el-container>
        <button class="menu-button" v-show="!showAsideMenu" @click="showDrawerMenu = true">菜单</button>
        <div v-if="showAsideMenu"><el-aside><LeftMenu/></el-aside></div>
        <div v-else><el-drawer class="el-drawer" v-model="showDrawerMenu" title="菜单" size="150" direction="ltr"><LeftMenu/></el-drawer></div>
        <el-main><div class="view"><RouterView/></div></el-main>
      </el-container>
    </el-container>
    <Beianhao/>
  </div>
</template>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;

  .el-container {
    .el-header {
      border: #DCDFE6 1px solid;
    }

    .el-container {
      .el-aside {
        width: 100px;
        height: 100%;
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
          transition: color linear .2s;
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