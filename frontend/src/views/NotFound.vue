<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <el-button @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
}

h1 {
  font-size: 48px;
  color: #409eff;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>