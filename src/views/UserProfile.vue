<template>
  <div class="user-profile-container">
    <van-nav-bar title="修改个人信息" left-text="返回" @click-left="goBack" />
    <div class="profile-form">
      <van-form @submit="handleSubmit">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="form.password"
          name="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="电话"
          placeholder="请输入电话"
          :rules="[{ required: true, message: '请输入电话' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
        />
        <van-field
          v-model="form.address"
          name="address"
          label="地址"
          placeholder="请输入地址"
          :rules="[{ required: true, message: '请输入地址' }]"
        />
        <div class="form-actions">
          <van-button type="default" @click="goBack">取消</van-button>
          <van-button type="primary" native-type="submit">保存修改</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import request from '../utils/request';

const router = useRouter();
const form = ref({
  username: '',
  password: '',
  phone: '',
  address: '',
  userId: null
});

// 页面加载时获取当前用户ID
onMounted(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    form.value.userId = Number(userId);
    // 暂时注释掉获取用户信息的逻辑，因为后端未提供对应接口
    // fetchUserInfo();
  } else {
    showToast('用户未登录');
    router.push('/login');
  }
});

// 获取用户信息用于表单预填 - 暂时注释，后端未提供接口
// const fetchUserInfo = async () => {
//   try {
//     const res = await request.get('/user/info', {
//       params: {
//         userId: form.value.userId
//       }
//     });
//     if (res.data) {
//       form.value.username = res.data.username || '';
//       form.value.phone = res.data.phone || '';
//       form.value.address = res.data.address || '';
//       // 密码不预填
//     }
//   } catch (error) {
//     console.error('获取用户信息失败:', error);
//     showToast('获取用户信息失败');
//   }
// };

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证用户ID
    if (!form.value.userId || isNaN(form.value.userId)) {
      showToast('用户ID无效');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('请先登录');
      router.push('/login');
      return;
    }

    const response = await request.post('/user/update', form.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data) {
      showToast('修改成功');
      router.go(-1); // 返回上一页
    }
  } catch (error) {
    console.error('修改失败:', error);
    showToast('修改失败，请重试');
  }
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.user-profile-container {
  padding-bottom: 60px;
}

.profile-form {
  padding: 16px;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}
</style>