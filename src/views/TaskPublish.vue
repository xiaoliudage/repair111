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
          v-model="taskDescription"
          name="taskDescription"
          label="任务描述"
          type="textarea"
          rows="4"
          placeholder="请详细描述您的需求"
          :rules="[{ required: true, message: '请输入任务描述' }]"
        />
        <van-field
          v-model="contactPhone"
          name="contactPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          :rules="[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]"
        />
        <van-field
          v-model="address"
          name="address"
          label="服务地址"
          placeholder="请输入服务地址"
          :rules="[{ required: true, message: '请输入服务地址' }]"
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

const router = useRouter();

const taskTitle = ref('');
const serviceType = ref('');
const taskDescription = ref('');
const contactPhone = ref('');
const address = ref('');
const budget = ref('');

const serviceTypes = ref([
  { id: 1, name: '水电维修' },
  { id: 2, name: '家电维修' },
  { id: 3, name: '管道疏通' },
  { id: 4, name: '开锁换锁' },
  { id: 5, name: '家具维修' },
  { id: 6, name: '墙面维修' }
]);

const onSubmit = () => {
  // 这里应该有实际的发布任务逻辑
  showToast('任务发布成功');
  router.push('/');
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