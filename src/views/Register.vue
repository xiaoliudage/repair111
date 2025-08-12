<template>
  <div class="register-container">
    <van-nav-bar title="用户注册" class="custom-nav" />
    <div class="register-form">
      <van-field
        v-model="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      />
      <van-field
        v-model="password"
        label="密码"
        type="password"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }]"
      />
      <!-- 身份选择单选框 -->
      <div class="role-selection">
        <van-radio-group v-model="role" direction="horizontal">
          <van-radio name="0">普通用户</van-radio>
          <van-radio name="1">维修工人</van-radio>
        </van-radio-group>
      </div>
      <van-button type="primary" @click="handleRegister" class="register-btn">注册</van-button>
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
const role = ref('0'); // 默认普通用户
const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:8080/user/add', {
      username: username.value,
      password: password.value,
      role: parseInt(role.value) // 转换为数字类型
    });
    if (response.data) {
      showToast('注册成功');
      router.push('/login'); // 跳转到登录页
    }
  } catch (error) {
    showToast('注册失败：' + (error.response?.data?.message || error.message));
  }
};
</script>

<style scoped>
/* 添加单选框样式确保可见 */
.role-selection {
  margin: 15px 0;
}

.role-radio-group {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.role-radio {
  display: flex;
  align-items: center;
}

.register-container {
  min-height: 100vh;
  box-sizing: border-box;
}

.register-form {
  padding: 20px;
}

.role-selection {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.register-btn {
  margin-top: 20px;
}
</style>



<!-- <template>
  <div class="register-container">
    <van-nav-bar title="用户注册" />
    <div class="register-form">
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
        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator, message: '两次密码输入不一致' }
          ]"
        />
        <van-field
          v-model="phone"
          name="phone"
          label="手机号码"
          placeholder="请输入手机号码"
          :rules="[
            { required: true, message: '请输入手机号码' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]"
        />
        <van-radio-group v-model="userType" class="user-type-radio">
          <van-radio name="customer">普通用户</van-radio>
          <van-radio name="worker">维修师傅</van-radio>
        </van-radio-group>
        <div v-if="userType === 'worker'" class="worker-info">
          <van-field
            v-model="serviceType"
            name="serviceType"
            label="服务类型"
            placeholder="请选择服务类型"
            :rules="[{ required: true, message: '请选择服务类型' }]"
          >
            <template #input>
              <van-select v-model="serviceType" placeholder="请选择服务类型">
                <van-option v-for="item in serviceTypes" :key="item.id" :value="item.id" :label="item.name" />
              </van-select>
            </template>
          </van-field>
          <van-field
            v-model="introduction"
            name="introduction"
            label="个人简介"
            type="textarea"
            rows="3"
            placeholder="请输入个人简介"
          />
        </div>
        <van-button type="primary" block native-type="submit">注册</van-button>
      </van-form>
      <div class="login-link">
        已有账号？<a @click="goToLogin">立即登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const userType = ref('customer');
const serviceType = ref('');
const introduction = ref('');

const serviceTypes = ref([
  { id: 1, name: '水电维修' },
  { id: 2, name: '家电维修' },
  { id: 3, name: '管道疏通' },
  { id: 4, name: '开锁换锁' },
  { id: 5, name: '家具维修' },
  { id: 6, name: '墙面维修' }
]);

const validator = (val) => {
  return val === password.value;
};

const onSubmit = () => {
  // 这里应该有实际的注册逻辑
  showToast('注册成功，请登录');
  router.push('/login');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  padding-bottom: 50px;
}

.register-form {
  padding: 20px;
}

.user-type-radio {
  margin: 20px 0;
}

.worker-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.login-link {
  margin-top: 20px;
  text-align: center;
}

.login-link a {
  color: #1989fa;
}
</style> -->