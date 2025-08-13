<template>
  <div class="profile-container">
    <van-nav-bar title="个人中心" />
    <div v-if="!isLogin" class="login-prompt">
      <div class="prompt-content">
        <p class="prompt-text">请先登录，享受更多服务</p>
        <van-button type="primary" @click="goToLogin">立即登录</van-button>
      </div>
    </div>
    <div v-else class="profile-content">
      <div class="user-info">
        <div class="user-details">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="user-type">{{ userTypeText }}</p>
          <p class="user-contact">{{ userInfo.phone }}</p>
          <p class="user-address">{{ userInfo.address }}</p>
        </div>
      </div>
      <van-cell-group class="profile-menu">
        <van-cell title="查看订单" icon="order-o" @click="goToOrders" />
        <van-cell title="修改个人信息" icon="edit" @click="goToEditProfile" />
        <van-cell title="消息通知" icon="bell-o" @click="goToNotifications" />
        <van-cell title="我的评价" icon="comment-o" @click="goToMyReviews" />
        <van-cell v-if="userType === 'repair-worker'" title="查看发布任务" icon="task" @click="goToPublishedTasks" />
        <van-cell title="注销账号" icon="delete" @click="deleteAccount" class="danger-cell" />
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
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const userStore = useUserStore();

const isLogin = computed(() => userStore.isLogin);
const userInfo = computed(() => userStore.userInfo);
const userType = computed(() => userStore.userType);

/* const userTypeText = computed(() => {
  return userType.value === 'customer' ? '普通用户' : '维修师傅';
}); */

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

// 添加新方法
const goToEditProfile = () => {
  router.push('/edit-profile');
};

const goToMyReviews = () => {
  router.push('/my-reviews');
};

const goToPublishedTasks = () => {
  router.push('/published-tasks');
};

const deleteAccount = async () => {
  try {
    await showConfirmDialog({
      title: '确认注销',
      message: '注销后将删除所有数据，不可恢复',
    });
    // 调用注销API
    await axios.post('/api/user/delete');
    userStore.logout();
    showToast('注销成功');
    router.push('/login');
  } catch (error) {
    showToast('已取消');
  }
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

/* 移除头像相关样式 */
.user-info {
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

.user-details {
  text-align: left;
}

.user-contact,
.user-address {
  margin: 5px 0;
  color: #666;
}

/* 添加危险操作样式 */
.danger-cell {
  color: #f53f3f;
}

.logout-cell {
  color: #f53f3f;
}
</style>