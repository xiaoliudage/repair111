<template>
  <div class="worker-detail-container">
    <van-nav-bar title="师傅详情" />
    <div class="worker-header">
      <img :src="workerInfo.avatar" alt="头像" class="avatar" />
      <div class="worker-info">
        <h2 class="name">{{ workerInfo.name }}</h2>
        <div class="rating-distance">
          <van-rate v-model="workerInfo.rating" readonly size="16" />
          <span class="distance">{{ workerInfo.distance }}km</span>
        </div>
        <div class="service-type">服务类型: {{ workerInfo.serviceType }}</div>
        <div class="price">价格: {{ workerInfo.price }}元起</div>
      </div>
    </div>
    <div class="worker-content">
      <van-tabs v-model="activeTab">
        <van-tab title="服务介绍">
          <div class="introduction">
            <h3>个人简介</h3>
            <p>{{ workerInfo.introduction }}</p>
            <h3>服务内容</h3>
            <van-cell-group>
              <van-cell v-for="item in workerInfo.services" :key="item.id" :title="item" />
            </van-cell-group>
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

const route = useRoute();
const workerId = route.params.id;

// 模拟维修师傅数据
const workerInfo = ref({
  id: 1,
  name: '张师傅',
  avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
  rating: 5,
  distance: 0.8,
  serviceType: '水电维修',
  price: 80,
  introduction: '从事水电维修工作10年，经验丰富，技术过硬，服务周到。擅长水管维修、电路故障排查、灯具安装等。',
  services: ['水管维修', '电路维修', '灯具安装', '开关插座更换', '水龙头更换', '马桶维修']
});

// 模拟评价数据
const reviews = ref([
  {
    id: 1,
    reviewer: '李先生',
    rating: 5,
    content: '师傅技术很好，很快就修好了我的水管，价格也合理。',
    time: '2023-10-15'
  },
  {
    id: 2,
    reviewer: '王女士',
    rating: 4,
    content: '服务很及时，态度也很好，就是来的时候稍微晚了一点。',
    time: '2023-10-10'
  }
]);

const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);

onMounted(() => {
  // 在实际应用中，这里应该通过API获取真实数据
  console.log('获取维修师傅详情，ID:', workerId);
});

const onLoad = () => {
  // 加载更多评价
  setTimeout(() => {
    reviews.value.push(...reviews.value);
    loading.value = false;
    if (reviews.value.length >= 6) {
      finished.value = true;
    }
  }, 1000);
};

const makePhoneCall = () => {
  // 模拟电话联系
  showToast('正在拨打张师傅电话...');
};

const sendMessage = () => {
  // 模拟发送消息
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