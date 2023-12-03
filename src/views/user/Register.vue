<script setup lang="ts">
import {ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {UserDTO} from "../../interfaces/entity/dto/UserDTO.ts";
import {userRegister} from "../../api/UserApi.ts";
import {Result} from "../../interfaces/Result.ts";
import {User} from "../../interfaces/entity/User.ts";
import router from "../../router/router.ts";
import {elPrompt} from "../../utils/elPrompt.ts";

const registerFormRef = ref<FormInstance>()
const registerForm = ref<UserDTO>({
  name: '',
  account: '',
  password: '',
  password2: '',
  email: ''
})
const rules = ref<FormRules<UserDTO>>({
  name: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        rule = rule
        let pattern = /^\w{2,30}$/g
        if (!pattern.test(value)) callback(new Error())
        return true
      },
      message: '2-30位的数字、字母或下划线',
      trigger: 'blur'
    },
  ],
  account: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        rule = rule
        let pattern = /^\w{6,30}$/g
        if (!pattern.test(value)) callback(new Error())
        return true
      },
      message: '6-30位的数字、字母或下划线',
      trigger: 'blur'
    },
  ],
  password: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        rule = rule
        let pattern = /^[\w\.\*]{6,30}$/g
        if (!pattern.test(value)) callback(new Error())
        return true
      },
      message: '6-30位的数字、字母、下划线、"."或"*"',
      trigger: 'blur'
    },
  ],
  password2: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        rule = rule
        if (value !== registerForm.value.password) callback(new Error())
        return true
      },
      message: '密码和确认密码不一致',
      trigger: 'blur'
    },
  ],
  email: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        rule = rule
        let pattern = /^[\w-]+@((\w+)\.)+([a-zA-Z]{2,4})$/g
        if (!pattern.test(value)) callback(new Error())
        return true
      },
      message: '邮箱格式错误',
      trigger: 'blur'
    },
  ],
})

function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (!valid) return
    userRegister(registerForm.value, (result: Result<User>) => {
      if (result.status !== 200) return
      elPrompt('注册成功！', 'success')
      router.push('/login/user')
    })
  })
}
function resetForm (formEl: FormInstance | undefined)  {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div class="register">
    <h1>注册</h1>
    <el-form ref="registerFormRef" :model="registerForm" :rules="rules" label-width="120px" status-icon>
      <el-form-item label="用户名" label-width="70px" label-position="left" prop="name">
        <el-input v-model.trim="registerForm.name"/>
      </el-form-item>
      <el-form-item label="账号" label-width="70px" label-position="left" prop="account">
        <el-input v-model.trim="registerForm.account"/>
      </el-form-item>
      <el-form-item label="密码" label-width="70px" prop="password">
        <el-input type="password" v-model.trim="registerForm.password"/>
      </el-form-item>
      <el-form-item label="确认密码" label-width="70px" prop="password2">
        <el-input type="password" v-model.trim="registerForm.password2"/>
      </el-form-item>
      <el-form-item label="邮箱" label-width="70px" prop="email">
        <el-input v-model.trim="registerForm.email"/>
      </el-form-item>
      <el-button type="danger" @click="resetForm(registerFormRef)">重置</el-button>
      <el-button type="primary" @click="submitForm(registerFormRef)">注册</el-button>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.register {
  h1 {
    text-align: center;
  }

  .el-form {
    .el-form-item__label {
      width: 100px;
      padding: 0;
    }
    .el-button {
      width: 50%;
      margin: 0;
    }
  }
}
</style>