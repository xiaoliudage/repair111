<template>
  <div class="worker-detail-container">
    <van-nav-bar title="师傅详情" />
    <div class="worker-header" v-if="workerDetail">
      <div class="worker-info">
        <h2 class="name">{{ workerDetail.username }}</h2>
        <div class="service-type">电话: {{ workerDetail.phone }}</div>
        <div class="price">地址: {{ workerDetail.address }}</div>
        <div class="price">价格: {{ workerDetail.baseFee }}元起</div>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>
    <div v-if="workerDetail" class="worker-content">
      <van-tabs v-model="activeTab">
        <van-tab title="服务介绍">
          <div class="introduction">
            <h3>服务领域</h3>
            <p>{{ workerDetail.repairField }}</p>
            <h3>基础费用</h3>
            <p>￥{{ workerDetail.baseFee }}元起</p>
          </div>
        </van-tab>
        <van-tab title="用户评价">
          <div class="reviews">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell v-for="review in reviews" :key="review.id">
                <template #default>
                  <div class="review-item">
                    <div class="review-header">
                      <span class="reviewer">{{ review.reviewer }}</span>
                      <van-rate v-model="review.rating" readonly size="14" />
                    </div>
                    <div class="review-content">{{ review.content }}</div>
                    <div class="review-time">{{ review.time }}</div>
                  </div>
                </template>
              </van-cell>
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="contact-buttons">
      <van-button type="primary" block @click="makePhoneCall">电话联系</van-button>
      <van-button type="default" block @click="sendMessage">发送消息</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';

const route = useRoute();
const workerId = route.params.id;
const workerDetail = ref(null);

console.log('路由参数ID:', workerId);
console.log('请求URL:', `/api/repair/getById/${workerId}`);

onMounted(async () => {
  try {
    const response = await axios.get(`/api/repair/getById/${workerId}`);
    console.log('API响应:', response.data);
    workerDetail.value = response.data;
  } catch (error) {
    console.error('请求错误详情:', error);
    showToast(`获取失败: ${error.message}`);
  }
});

// 用户评价相关数据
const reviews = ref([]);
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);

const onLoad = () => {
  // 实际项目中应从API加载评价数据
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 1000);
};

const makePhoneCall = () => {
  showToast('正在拨打...');
};

const sendMessage = () => {
  showToast('跳转到消息界面');
};
</script>

<style scoped>
.worker-detail-container {
  padding-bottom: 100px;
}

.worker-header {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}

.worker-info {
  flex: 1;
}

.name {
  font-size: 20px;
  margin-bottom: 5px;
}

.rating-distance {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.distance {
  margin-left: 10px;
  color: #666;
  font-size: 14px;
}

.service-type,
.price {
  color: #666;
  margin-bottom: 3px;
}

.worker-content {
  padding: 10px;
}

.introduction {
  padding: 15px;
}

.introduction h3 {
  font-size: 16px;
  margin: 15px 0 5px;
}

.introduction p {
  color: #666;
  line-height: 1.6;
}

.review-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.reviewer {
  font-weight: bold;
}

.review-content {
  margin-bottom: 5px;
}

.review-time {
  color: #999;
  font-size: 12px;
}

.contact-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.contact-buttons van-button {
  margin: 0 5px;
}
</style>