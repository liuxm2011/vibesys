<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1 class="title">页面走丢了</h1>
      <p class="desc">抱歉，您访问的页面不存在或已被移除。</p>
      <el-button
        type="primary"
        size="large"
        class="home-btn"
        @click="$router.push('/')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 20px;
}

.content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 24px;
}

.title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.desc {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
}

.home-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 12px;
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  font-weight: 600;
}
</style>