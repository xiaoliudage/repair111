<template>
  <div class="register-container">
    <van-nav-bar title="用户注册" left-arrow @click-left="onClickLeft" />
    <div class="form-group">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" clearable />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" clearable />
      <van-field v-model="confirmPassword" type="password" label="确认密码" placeholder="请再次输入密码" clearable />

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
  if (!username.value || !password.value || !confirmPassword.value) {
    showToast('请填写所有字段');
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
      password: password.value
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

    if (response.data.success) {
      showToast('注册成功');
      router.push('/login');
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


<!-- <template>
  <div class="register-container">
    <van-nav-bar title="用户注册" left-arrow @click-left="onClickLeft" />
    <div class="form-group">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" clearable />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" clearable />
      <van-field v-model="confirmPassword" type="password" label="确认密码" placeholder="请再次输入密码" clearable />

      <van-cell-group title="选择角色">
        <van-select v-model="selectedRole" placeholder="请选择角色">
          <van-option name="0">普通用户</van-option>
          <van-option name="1">维修工人</van-option>
        </van-select>
      </van-cell-group>

      
      <van-field v-if="selectedRole === '1'" v-model="repairField" label="维修领域" placeholder="请输入维修领域" clearable />

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
const selectedRole = ref(''); // 单选角色，存储'0'或'1'
const repairField = ref(''); // 维修领域，仅维修工人需要
const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    showToast('请填写所有字段');
    return;
  }

  if (password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致');
    return;
  }

  if (!selectedRole.value) {
    showToast('请选择一个角色');
    return;
  }

  // 维修工人需要验证维修领域
  if (selectedRole.value === '1' && !repairField.value) {
    showToast('请输入维修领域');
    return;
  }

  try {
    let url = '';
    let data = {
      username: username.value,
      password: password.value
    };

    // 根据角色选择不同的API端点和数据
    if (selectedRole.value === '0') {
      url = '/api/user/add'; // 使用代理路径
    } else {
      url = '/api/user/repair_add'; // 使用代理路径
      data.repairField = repairField.value; // 添加维修领域字段
    }

    const response = await axios.post(url, data);

    // 假设后端返回{success: true}表示成功
    if (response.data.success) {
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
</style> -->

<!-- <template>
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
</style> -->