<template>
  <!-- 将根元素class改为home-container -->
  <div class="home-container">
    <van-nav-bar class="custom-nav" title="维修工人平台" />

    <!-- 将hero改为hero-banner以匹配CSS -->
    <div class="hero-banner">
      <h1>寻找附近的维修师傅</h1>
      <p>快速解决您的维修需求</p>
      <div class="btn-group">
        <van-button type="primary" size="large" @click="goToServiceList">寻找服务</van-button>
        <van-button type="default" size="large" @click="goToPublishTask">发布任务</van-button>
        <van-button type="default" size="large" @click="goToLogin">用户登录</van-button>

      </div>
    </div>

    <!-- 将service-types改为functional-areas以匹配CSS -->
    <div class="functional-areas">
      <h2 class="section-title">热门维修类型</h2>
      <!-- 使用function-grid替代van-grid实现自适应布局 -->
      <div class="function-grid">
        <div v-for="service in serviceTypes" :key="service.id" class="function-card" @click="selectService(service)">
          <van-icon :name="service.icon" class="service-icon" />
          <span class="service-name">{{ service.name }}</span>
        </div>
      </div>
    </div>

    <van-tabbar route fixed>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/services">搜索</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceStore } from '../store';

const router = useRouter();
const serviceStore = useServiceStore();

const serviceTypes = ref([
  { id: 1, name: '水电维修', icon: 'water-o' },
  { id: 2, name: '家电维修', icon: 'monitor' },
  { id: 3, name: '管道疏通', icon: 'trash-o' },
  { id: 4, name: '开锁换锁', icon: 'lock' },
  { id: 5, name: '家具维修', icon: 'appreciate' },
  { id: 6, name: '墙面维修', icon: 'photo-o' }
]);

serviceStore.setServices(serviceTypes.value);

const goToServiceList = () => {
  router.push('/services');
};

const goToPublishTask = () => {
  router.push('/publish');
};

const goToLogin = () => {
  router.push('/login');
};

const selectService = (service) => {
  serviceStore.selectService(service);
  router.push('/services');
};
</script>

<style scoped>
/* 全局样式：移除scoped属性以修改body样式 */
body {
  margin: 0;
  padding: 0;
}

.custom-nav {
  padding: 0 !important;
}

/* 根容器样式 */
.home-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f7f8fa;
  padding-bottom: 50px;
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 添加盒模型设置 */
}

/* 确保根容器占满全屏 */
.home-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f7f8fa;
  padding-bottom: 50px; /* 为底部导航留出空间 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 顶部横幅区全屏样式 */
.hero-banner {
  text-align: center;
  padding: 60px 0; /* 修改：将水平内边距从5%改为0 */
  background: linear-gradient(135deg, #1989fa, #07c160);
  color: white;
  width: 100%;
  box-sizing: border-box;
}

/* 功能区自适应布局 */
.functional-areas {
  padding: 20px 0; /* 修改：将水平内边距从5%改为0 */
  width: 100%;
  box-sizing: border-box;
}

/* 顶部横幅区全屏样式 */
.hero-banner {
  text-align: center;
  padding: 60px 5%;
  background: linear-gradient(135deg, #1989fa, #07c160);
  color: white;
  width: 100%;
  box-sizing: border-box;
}

/* 功能区自适应布局 */
.functional-areas {
  padding: 20px 5%;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

/* 自适应网格布局 - 在不同屏幕宽度下自动调整列数 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  width: 100%;
}

.function-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.service-icon {
  font-size: 30px;
  color: #1989fa;
}

.service-name {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}

/* 按钮组样式 */
.btn-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>