<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Config, getConfig} from "../utils/config.ts";

const icp = ref('')

onMounted(() => {
    getConfig((config: Config) => {
        icp.value = config.icp
    })
})
</script>

<template>
  <div class="footer" v-if="icp">
    <span class="icp">
      <a target="_blank" href="https://beian.miit.gov.cn" v-text="icp"></a>
    </span>
  </div>
</template>

<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  background: white;

  .icp {
    a {
      font-size: 14px;
      color: #333333;
      text-decoration: none;
    }
  }
}
</style>
