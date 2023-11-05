<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import User from "../interfaces/User.ts";
import {getUserSelf} from "../api/UserApi.ts";
import Result from "../interfaces/Result.ts";

const user: Ref<User | undefined> = ref()
const avatarContent = ref('X')
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) return
  getUserSelf(((result:Result<User>) => {
    user.value = result.data
    avatarContent.value = user.value.name?.charAt(0)
  }))
})
</script>

<template>
<span class="head">
  <h1>XNote</h1>
  <el-avatar>{{ avatarContent }}</el-avatar>
</span>
</template>

<style scoped lang="less">
.head {
  display: flex;
  align-items: center;
  h1 {
    margin: 15px 0;
  }
  .el-avatar {
    font-size: 25px;
    position: absolute;
    right: 15px;
  }
}
</style>