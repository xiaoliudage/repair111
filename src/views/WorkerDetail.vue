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

    <!-- 消息弹出层 -->
    <van-popup v-model:show="showMessagePopup" position="bottom" round>
      <div class="message-popup">
        <van-field
          v-model="messageContent"
          placeholder="请输入消息内容"
          rows="4"
          type="textarea"
          autosize
        />
        <div class="popup-buttons">
          <van-button type="default" @click="showMessagePopup = false">取消</van-button>
          <van-button type="primary" @click="handleSend">发送</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';
import request from '../utils/request';

const route = useRoute();
const workerId = route.params.id;
const workerDetail = ref(null);
const showMessagePopup = ref(false);
const messageContent = ref('');

// 用户评价相关数据
const reviews = ref([
  {
    id: 1,
    reviewer: '用户A',
    rating: 5,
    content: '师傅技术很好，解决问题很快！',
    time: '2023-05-15'
  },
  {
    id: 2,
    reviewer: '用户B',
    rating: 4,
    content: '服务态度不错，就是价格稍贵',
    time: '2023-04-20'
  }
]);
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/repair/getById/${workerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    workerDetail.value = response.data;
  } catch (error) {
    console.error('请求错误:', error);
    showToast('获取师傅详情失败');
  }
});

const onLoad = () => {
  // 模拟加载更多评价
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 1000);
};

const makePhoneCall = () => {
  if (workerDetail.value?.phone) {
    showToast(`正在呼叫: ${workerDetail.value.phone}`);
    // 实际项目中这里可以调用打电话功能
    // window.location.href = `tel:${workerDetail.value.phone}`;
  } else {
    showToast('电话号码不可用');
  }
};

const sendMessage = () => {
  showMessagePopup.value = true;
};

const handleSend = async () => {
  if (!messageContent.value.trim()) {
    showToast('请输入消息内容');
    return;
  }
  
  try {
    const response = await request.post('/common/chat', {
      receiverId: workerId,
      content: messageContent.value
    });
    showToast('发送成功');
    messageContent.value = '';
    showMessagePopup.value = false;
  } catch (error) {
    console.error('发送失败:', error);
    showToast('发送失败，请重试');
  }
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

.worker-info {
  flex: 1;
}

.name {
  font-size: 20px;
  margin-bottom: 5px;
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
  gap: 10px;
}

.message-popup {
  padding: 16px;
  background: #fff;
  min-height: 200px;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>