<template>
  <div class="register-container">
    <van-nav-bar title="用户注册" left-arrow @click-left="onClickLeft" />
    <div class="form-group">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" clearable />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" clearable />
      <van-field v-model="confirmPassword" type="password" label="确认密码" placeholder="请再次输入密码" clearable />

      <van-cell-group title="选择角色">
        <van-checkbox-group v-model="selectedRoles" direction="horizontal">
          <van-checkbox :name="0" shape="square">普通用户</van-checkbox>
          <van-checkbox :name="1" shape="square">维修工人</van-checkbox>
        </van-checkbox-group>
      </van-cell-group>

      <van-button type="primary" size="large" @click="handleRegister">注册</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedRoles = ref([]); // 使用数组存储选中的角色ID
const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const handleRegister = async () => {
  // 表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    showToast('请填写所有字段');
    return;
  }

  if (password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致');
    return;
  }

  if (selectedRoles.value.length === 0) {
    showToast('请至少选择一个角色');
    return;
  }

  try {
    // 发送注册请求
    const response = await axios.post('/api/user/add', {
      username: username.value,
      password: password.value,
      role: selectedRoles.value[0] // 取第一个选中的角色ID（0或1）
    });

    if (response.data.code === 200) {
      showToast('注册成功');
      router.push('/login'); // 注册成功后跳转到登录页
    } else {
      showToast(response.data.message || '注册失败');
    }
  } catch (error) {
    console.error('注册请求失败:', error);
    showToast('注册请求失败，请稍后再试');
  }
};
</script>

<style scoped>
.register-container {
  padding: 16px;
}

.form-group {
  margin-top: 20px;
}

.van-button {
  margin-top: 20px;
}

.van-checkbox-group {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>