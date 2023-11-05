<template>
  <div class="footer">
    <span class="beianhao">
      <a target="_blank" href="https://beian.miit.gov.cn">蜀ICP备2023003714号</a>
    </span>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  background: white;

  .beianhao {
    a {
      font-size: 14px;
      color: #333333;
      text-decoration: none;
    }
  }
}
</style>
