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
                <div class="review-item">
                  <div class="review-header">
                    <span class="reviewer">{{ review.reviewer }}</span>
                    <van-rate v-model="review.rating" readonly size="14" />
                  </div>
                  <div class="review-content">{{ review.content }}</div>
                  <div class="review-time">{{ review.time }}</div>
                </div>
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

    <!-- 聊天界面 -->
    <div v-if="showChat" class="chat-container">
      <div class="message-list">
        <div v-for="msg in messages" :key="msg.id" 
             :class="['message-item', msg.senderId === currentUserId ? 'sent' : 'received']">
          <div class="message-sender">{{ msg.senderId === currentUserId ? '我' : workerDetail.username }}</div>
          <div class="message-bubble">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
        </div>
      </div>
      <div class="message-input-area">
        <textarea v-model="messageContent" @keyup.enter.prevent="handleSend" placeholder="输入消息..."></textarea>
        <button @click="handleSend">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';
import request from '../utils/request';

const route = useRoute();
const workerId = Number(route.params.id);
const workerDetail = ref(null);
const showMessagePopup = ref(false);
const showChat = ref(false);
const messageContent = ref('');
const currentUserId = ref(Number(localStorage.getItem('userId')));
const messages = ref([]);

// 用户评价相关数据
const reviews = ref([
  { id: 1, reviewer: '用户A', rating: 5, content: '师傅技术很好，解决问题很快！', time: '2023-05-15' },
  { id: 2, reviewer: '用户B', rating: 4, content: '服务态度不错，就是价格稍贵', time: '2023-04-20' }
]);
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/repair/getById/${workerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    workerDetail.value = response.data;
  } catch (error) {
    console.error('请求错误:', error);
    showToast('获取师傅详情失败');
  }
});

const onLoad = () => {
  setTimeout(() => { loading.value = false; finished.value = true; }, 1000);
};

const makePhoneCall = () => {
  workerDetail.value?.phone ? showToast(`正在呼叫: ${workerDetail.value.phone}`) : showToast('电话号码不可用');
};

const sendMessage = () => { showChat.value = true; fetchMessages(); };

// 监听聊天界面显示状态，获取历史消息
watch(showChat, (newVal) => { if (newVal) fetchMessages(); });

// 获取聊天记录
const fetchMessages = async () => {
  try {
    // 验证用户ID有效性
    if (isNaN(currentUserId.value) || isNaN(workerId)) {
      showToast('用户ID无效，无法获取消息');
      return;
    }

    // 获取双向消息
    const [sentRes, receivedRes] = await Promise.all([
      request.get('/common/chat/get', { params: { senderId: currentUserId.value, receiverId: workerId } }),
      request.get('/common/chat/get1', { params: { senderId: workerId, receiverId: currentUserId.value } })
    ]);

    // 合并、过滤并排序消息
    messages.value = [...sentRes.data, ...receivedRes.data]
      .filter(msg => {
        const msgSender = Number(msg.senderId);
        const msgReceiver = Number(msg.receiverId);
        return (msgSender === currentUserId.value && msgReceiver === workerId) || 
               (msgSender === workerId && msgReceiver === currentUserId.value);
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (messages.value.length === 0) showToast('暂无聊天记录');
  } catch (error) {
    console.error('获取消息失败:', error);
    showToast('获取聊天历史失败，请重试');
  }
};

// 发送消息
const handleSend = async () => {
  if (!messageContent.value.trim()) {
    showToast('请输入消息内容');
    return;
  }

  try {
    const response = await request.post('/common/chat', {
      senderId: currentUserId.value,  // 添加发送者ID
      receiverId: workerId,
      content: messageContent.value
    });
    messages.value.push(response.data);
    messageContent.value = '';
  } catch (error) {
    console.error('发送失败:', error);
    showToast('发送失败，请重试');
  }
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
</script>

<style scoped>
/* 原有样式保持不变 */
.worker-detail-container {
  padding-bottom: 100px;
}

.worker-header {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

/* 新增聊天界面样式 */
.chat-container {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  top: 0;
  background: white;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.message-item {
  margin-bottom: 15px;
  display: flex;
  max-width: 70%;
}

.message-item.sent {
  margin-left: auto;
  flex-direction: column;
  align-items: flex-end;
}

.message-item.received {
  margin-right: auto;
  flex-direction: column;
  align-items: flex-start;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  word-break: break-word;
}

.message-item.sent .message-bubble {
  background-color: #007bff;
  color: white;
}

.message-item.received .message-bubble {
  background-color: white;
  border: 1px solid #ddd;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.message-input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background: white;
}

.message-input-area textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  resize: none;
  outline: none;
  height: 40px;
}

.message-input-area button {
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  cursor: pointer;
}
</style>