<template>
  <div class="user-profile-container">
    <van-nav-bar title="修改个人信息" left-text="返回" @click-left="goBack">
      <!-- 消息通知按钮 -->
      <template #right>
        <van-icon
          name="message"
          class="message-icon"
          @click="goToMessageList"
        />
      </template>
    </van-nav-bar>
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
        <!-- 维修人员特有字段 -->
        <van-field
          v-if="form.repairField !== undefined"
          v-model="form.repairField"
          name="repairField"
          label="维修领域"
          placeholder="请输入维修领域"
          :rules="[{ required: true, message: '请输入维修领域' }]"
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
        <!-- 维修人员特有字段 -->
        <van-field
          v-if="['worker', 'repairman'].includes(userType)"
          v-model="form.baseFee"
          name="baseFee"
          label="基本费用"
          type="number"
          placeholder="请输入基本费用"
          :rules="[{ required: true, message: '请输入基本费用' }, { type: 'number', min: 0, message: '基本费用不能为负数' }]"
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, Icon } from 'vant';
import { useUserStore } from '../store';
import request from '../utils/request';

const router = useRouter();
const userStore = useUserStore();
const userType = computed(() => {
  const type = userStore.user?.type || localStorage.getItem('userType') || '';
  console.log('Current user type:', type);
  return type;
});

const form = ref({
  username: '',
  password: '',
  phone: '',
  address: '',
  userId: null,
  // 维修人员特有字段
  repairField: '',
  baseFee: 0
});

// 页面加载时从后端获取用户信息
onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showToast('用户未登录');
    router.push('/login');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    // 获取用户基本信息判断用户类型
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // 根据用户类型选择不同的API路径
    const isRepairWorker = userInfo.repairField !== undefined;
    const url = isRepairWorker
      ? '/repair/update/getById'
      : '/user/update/getById';

    const response = await request.get(url, {
      params: { id: userId },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    form.value = response.data;
    form.value.userId = Number(userId); // 确保userId正确设置
  } catch (error) {
    showToast('获取用户信息失败');
    console.error('Failed to fetch user info:', error);
  }
});

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

    // 根据用户类型选择不同的API路径
    // 根据用户对象是否包含repairField字段判断身份
    const apiPath = form.value.repairField !== undefined ? '/repair/update' : '/user/update';
    const response = await request.post(apiPath, form.value, {
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

// 跳转到消息列表页面
const goToMessageList = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showToast('用户未登录');
    router.push('/login');
    return;
  }
  // 跳转到消息列表页面并传递当前用户ID
  router.push({ path: '/message-list', query: { id: userId } });
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

.message-icon {
  margin-right: 15px;
  font-size: 20px;
}
</style>