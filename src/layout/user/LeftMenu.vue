<script setup lang="ts">
import {ref} from "vue";
import router from "../../router/router.ts";

const menus = ref([
  {
    title: '用户', index: '1', event: () => {
    },
    children: [
      {title: '登录', index: '1-1', event: toLogin},
      {title: '注册', index: '1-2', event: toRegister},
    ]
  },
  {
    title: '笔记', index: '2', event: () => {
    },
    children: [
      {title: '发布笔记', index: '2-1', event: postNote},
      {title: '我的笔记', index: '2-2', event: toMyNotes},
    ]
  }
])

function toHome() {
  router.push('/')
}

function toLogin() {
  router.push('/login/user')
}

function toRegister() {
  router.push('/register')
}

function toMyNotes() {
  router.push(`/notes/user`)
}
function postNote() {
  router.push('/edit/')
}
</script>

<template>
  <div class="menu">
    <el-menu>
      <el-menu-item index="0" @click="toHome">首页</el-menu-item>
      <el-sub-menu v-for="menu in menus" :index="menu.index">
        <template #title><span>{{ menu.title }}</span></template>
        <el-menu-item v-for="menuChild in menu.children" :index="menuChild.index" @click="menuChild.event">
          <span>{{ menuChild.title }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="less">
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
</style>