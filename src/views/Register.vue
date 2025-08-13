<template>
  <div class="register-container">
    <van-nav-bar title="用户注册" left-arrow @click-left="onClickLeft" />
    <div class="form-group">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" clearable />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" clearable />
      <van-field v-model="confirmPassword" type="password" label="确认密码" placeholder="请再次输入密码" clearable />
      <van-field v-model="phone" label="电话" placeholder="请输入手机号码" clearable />
      <van-field v-model="address" label="地址" placeholder="请输入详细地址" clearable />

      <!-- 角色选择字段 -->
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

      <!-- 维修领域输入框 -->
      <van-field 
        v-if="selectedRole === '维修工人'" 
        v-model="repairField" 
        label="维修领域" 
        placeholder="请输入维修领域" 
        clearable 
      />

      <van-button type="primary" size="large" @click="handleRegister">注册</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const address = ref('');
const selectedRole = ref(''); // 存储'普通用户'或'维修工人'
const selectedRoleText = computed(() => selectedRole.value); // 直接显示选中文本
const repairField = ref('');
const showRolePicker = ref(false);
const router = useRouter();

// 角色选项（直接使用文本作为value）
const roleOptions = [
  { text: '普通用户', value: '普通用户' },
  { text: '维修工人', value: '维修工人' }
];

const onClickLeft = () => {
  router.back();
};

// 角色选择确认
const onRoleConfirm = ({ selectedOptions }) => {
  selectedRole.value = selectedOptions[0]?.value || '';
  showRolePicker.value = false;
  console.log('已选择:', selectedRole.value); // 调试用
};

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value || !phone.value || !address.value) {
    showToast('请填写所有必填字段');
    return;
  }

  if (password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致');
    return;
  }

  if (!selectedRole.value) {
    showToast('请选择角色');
    return;
  }

  // 维修工人需要验证维修领域
  if (selectedRole.value === '维修工人' && !repairField.value) {
    showToast('请输入维修领域');
    return;
  }

  try {
    let url = '';
    let data = {
      username: username.value,
      password: password.value,
      phone: phone.value,
      address: address.value
      // 不再传递role字段
    };

    // 根据角色选择不同的API
    if (selectedRole.value === '普通用户') {
      // url = 'http://localhost:8080/user/add';
      url = '/api/user/add'; 
    } else {
      // url = 'http://localhost:8080/user/repair_add';
      url = '/api/user/repair_add';
      data.repairField = repairField.value;
    }

    const response = await axios.post(url, data);
    
    // 添加调试日志查看完整响应
    console.log('注册响应数据:', response.data);
    
    // 修改成功条件判断，兼容不同后端响应格式
    if (response.data.success || response.data.code === 200 || response.status === 200) {
      showToast('注册成功');
      router.push('/profile');
    } else {
      showToast(response.data.message || '注册失败');
    }
  } catch (error) {
    console.error('注册请求失败:', error);
    showToast(error.response?.data?.message || '注册请求失败，请稍后再试');
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

.van-field__control--readonly {
  color: #323233;
}
</style>