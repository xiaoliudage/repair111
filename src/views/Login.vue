<template>
  <div class="login-container">
    <van-nav-bar title="用户登录" />
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <van-radio-group v-model="userType" class="user-type-radio">
          <van-radio name="customer">普通用户</van-radio>
          <van-radio name="worker">维修师傅</van-radio>
        </van-radio-group>
        <div class="login-buttons">
          <van-button type="primary" block native-type="submit">登录</van-button>
          <van-button type="default" block @click="goToRegister">注册账号</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';
import { showToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const userType = ref('customer');

const onSubmit = () => {
  // 这里应该有实际的登录逻辑
  // 暂时使用模拟数据
  if (username.value && password.value) {
    userStore.login({
      username: username.value,
      type: userType.value
    }, userType.value);
    showToast('登录成功');
    router.push('/');
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  padding-bottom: 50px;
}

.login-form {
  padding: 20px;
}

.user-type-radio {
  margin: 20px 0;
}

.login-buttons {
  margin-top: 20px;
  gap: 10px;
  display: flex;
}
</style>