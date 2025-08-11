<template>
  <div class="profile-container">
    <van-nav-bar title="个人中心" />
    <div v-if="!isLogin" class="login-prompt">
      <div class="prompt-content">
        <img src="@/assets/logo.svg" alt="logo" class="logo" />
        <p class="prompt-text">请先登录，享受更多服务</p>
        <div class="login-buttons">
          <van-button type="primary" @click="goToLogin">登录</van-button>
          <van-button type="default" @click="goToRegister">注册</van-button>
        </div>
      </div>
    </div>
    <div v-else class="profile-content">
      <div class="user-info">
        <img :src="userInfo.avatar" alt="头像" class="avatar" />
        <div class="user-details">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="user-type">{{ userTypeText }}</p>
        </div>
      </div>
      <van-cell-group class="profile-menu">
        <van-cell title="我的订单" icon="order-o" @click="goToOrders" />
        <van-cell title="我的收藏" icon="star-o" @click="goToFavorites" />
        <van-cell title="消息通知" icon="bell-o" @click="goToNotifications" />
        <van-cell title="设置" icon="setting-o" @click="goToSettings" />
        <van-cell title="帮助中心" icon="question-o" @click="goToHelp" />
        <van-cell title="关于我们" icon="info-o" @click="goToAbout" />
        <van-cell title="退出登录" icon="logout" @click="logout" class="logout-cell" />
      </van-cell-group>
    </div>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/services">搜索</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';
import { showToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();

const isLogin = computed(() => userStore.isLogin);
const userInfo = computed(() => userStore.userInfo);
const userType = computed(() => userStore.userType);

const userTypeText = computed(() => {
  return userType.value === 'customer' ? '普通用户' : '维修师傅';
});

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};

const goToOrders = () => {
  showToast('跳转到我的订单页面');
};

const goToFavorites = () => {
  showToast('跳转到我的收藏页面');
};

const goToNotifications = () => {
  showToast('跳转到消息通知页面');
};

const goToSettings = () => {
  showToast('跳转到设置页面');
};

const goToHelp = () => {
  showToast('跳转到帮助中心页面');
};

const goToAbout = () => {
  showToast('跳转到关于我们页面');
};

const logout = () => {
  userStore.logout();
  showToast('退出登录成功');
  router.push('/');
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding-bottom: 50px;
}

.login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 150px);
}

.prompt-content {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.prompt-text {
  margin-bottom: 20px;
  color: #666;
}

.login-buttons {
  display: flex;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}

.username {
  font-size: 20px;
  margin-bottom: 5px;
}

.user-type {
  color: #666;
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.profile-menu {
  margin-top: 10px;
}

.logout-cell {
  color: #f53f3f;
}
</style>