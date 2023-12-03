<script setup lang="ts">
import {userLogin} from "../../api/UserApi.ts";
import {onMounted, ref} from "vue";
import {Result} from "../../interfaces/Result.ts";
import ResultStatus from "../../enums/ResultStatus.ts";
import {elPrompt} from "../../utils/elPrompt.ts";
import router from "../../router/router.ts";
import {useRoute} from "vue-router";
import LoginType from "../../enums/LoginType.ts";

const account = ref('')
const password = ref('')
let loginType = LoginType.User as string
onMounted(() => {
  loginType = useRoute().params.type ? useRoute().params.type as string : LoginType.User
})

/**
 * 登录回调
 * @param result Result<token:string>
 */
function loginCallback(result: Result<string>) {
  if (result.status !== ResultStatus.SUCCESS) {
    return
  }
  localStorage.setItem('token', result.data)
  elPrompt('登录成功！', "success")
  router.push('/')
}

/**
 * 用户登录
 */
function login() {
  if (loginType === LoginType.User) {
    userLogin(account.value, password.value, loginCallback)
  } else if (loginType === LoginType.ADMIN) {
    // adminLogin(account.value, password.value, loginCallback)
  } else {
    elPrompt('没有该用户类型！', "error")
  }
}
</script>

<template>
  <div class="login">
    <h1>登录</h1>
    <div class="login-box">
      <el-form>
        <el-form-item prop="account">
          <el-input v-model="account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login {
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .el-button {
    width: 100%;
  }
}
</style>