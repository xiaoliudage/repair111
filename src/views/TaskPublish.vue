<template>
  <div class="task-publish-container">
    <van-nav-bar title="发布任务" />
    <div class="publish-form">
      <van-form @submit="onSubmit">
        <van-field
          v-model="taskTitle"
          name="taskTitle"
          label="任务标题"
          placeholder="请输入任务标题"
          :rules="[{ required: true, message: '请输入任务标题' }]"
        />
        
        <van-field
          v-model="serviceType"
          name="serviceType"
          label="服务类型"
          placeholder="请输入服务类型（如：水电维修、家电维修等）"
          :rules="[{ required: true, message: '请输入服务类型' }]"
        />
        
        <van-field
          v-model="taskDescription"
          name="taskDescription"
          label="任务描述"
          type="textarea"
          rows="4"
          placeholder="请详细描述您的需求"
          :rules="[{ required: true, message: '请输入任务描述' }]"
        />
        
        <van-field
          v-model="budget"
          name="budget"
          label="预算金额"
          placeholder="请输入预算金额"
          :rules="[
            { required: true, message: '请输入预算金额' },
            { pattern: /^\d+$/, message: '请输入有效的金额' }
          ]"
        >
          <template #label>
            <span>预算金额</span>
            <span class="unit">(元)</span>
          </template>
        </van-field>
        
        <van-button type="primary" block native-type="submit">发布任务</van-button>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';

const router = useRouter();

const taskTitle = ref('');
const serviceType = ref('');  // 改为文本输入
const taskDescription = ref('');
const budget = ref('');

const onSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/repair/publish', {
      taskTitle: taskTitle.value,
      serviceType: serviceType.value,
      taskDescription: taskDescription.value,
      budget: budget.value
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    showToast('任务发布成功');
    router.push('/');
  } catch (error) {
    showToast('发布失败，请重试');
    console.error('发布错误:', error);
  }
};
</script>

<style scoped>
.task-publish-container {
  padding-bottom: 50px;
}

.publish-form {
  padding: 20px;
}

.unit {
  color: #999;
  margin-left: 5px;
  font-size: 14px;
}
</style>