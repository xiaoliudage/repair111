<template>
  <div class="login-container">
    <van-nav-bar title="用户登录" />
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请输入密码' }]" />

        <!-- 用户角色选择 -->
        <van-field
          readonly
          clickable
          name="role"
          :model-value="selectedRoleText"
          label="用户角色"
          placeholder="请选择角色"
          @click="showRolePicker = true"
        />
        <van-popup v-model:show="showRolePicker" position="bottom">
          <van-picker
            :columns="roleOptions"
            @confirm="onRoleConfirm"
            @cancel="showRolePicker = false"
          />
        </van-popup>

        <div class="login-buttons">
          <van-button type="primary" block native-type="submit">登录</van-button>
          <van-button type="default" block @click="goToRegister">注册账号</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';
import { showToast } from 'vant';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const selectedRole = ref('');
const selectedRoleText = computed(() => selectedRole.value);
const showRolePicker = ref(false);
const roleOptions = [
  { text: '普通用户', value: 'customer' },
  { text: '维修师傅', value: 'worker' }
];

const onRoleConfirm = ({ selectedOptions }) => {
  selectedRole.value = selectedOptions[0]?.value || '';
  showRolePicker.value = false;
};

const onSubmit = async () => {
  if (!selectedRole.value) {
    showToast('请选择用户角色');
    return;
  }

  const loginDto = {
    username: username.value,
    password: password.value
  };

  // 使用相对路径通过代理发送请求
  const url = selectedRole.value === 'customer' ? '/api/user/login' : '/api/repair/login';

  try {
    const response = await axios.post(url, loginDto);
    const userData = response.data;

    if (!userData) {
      showToast('用户名或密码错误');
      return;
    }

    userStore.login({
      ...userData,
      type: selectedRole.value
    });
    showToast('登录成功');
    router.push('/');
  } catch (error) {
    showToast('登录失败，请重试');
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  padding-bottom: 50px;
  padding-top: 46px;
}

.login-form {
  padding: 16px;
}

.login-buttons {
  margin-top: 20px;
  gap: 10px;
  display: flex;
}
</style>