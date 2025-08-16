<template>
  <div class="chat-page-container">
    <van-nav-bar 
      :title="contact?.username || '聊天'" 
      left-text="返回" 
      left-arrow
      @click-left="goBack"
    />
    
    <div class="chat-container">
      <div class="message-list">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          :class="['message-item', msg.senderId === currentUserId ? 'sent' : 'received']"
        >
          <div class="message-bubble">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
        </div>
      </div>
      
      <div class="message-input-area">
        <van-field
          v-model="messageContent"
          rows="2"
          autosize
          type="textarea"
          placeholder="输入消息..."
          @keyup.enter="handleSend"
        />
        <van-button 
          type="primary" 
          size="small" 
          @click="handleSend"
          :disabled="!messageContent.trim()"
        >
          发送
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import request from '../utils/request';

const props = defineProps({
  contact: Object,
  currentUserId: String
});

const router = useRouter();
const route = useRoute();

const messageContent = ref('');
const messages = ref([]);
const loading = ref(false);

// 从路由参数或props获取联系人信息
const contactInfo = computed(() => {
  return props.contact || (route.query.contact ? JSON.parse(route.query.contact) : null);
});

// 获取对方用户ID
const receiverId = computed(() => {
  return contactInfo.value?.id;
});

// 获取聊天记录
const fetchMessages = async () => {
  if (!receiverId.value || !props.currentUserId) {
    showToast('无法获取聊天对象');
    return;
  }

  try {
    loading.value = true;
    
    // 获取双向消息
    const [sentRes, receivedRes] = await Promise.all([
      request.get('/common/chat/get', { 
        params: { 
          senderId: props.currentUserId, 
          receiverId: receiverId.value 
        } 
      }),
      request.get('/common/chat/get1', { 
        params: { 
          senderId: receiverId.value, 
          receiverId: props.currentUserId 
        } 
      })
    ]);

    // 合并、过滤并排序消息
    messages.value = [...sentRes.data, ...receivedRes.data]
      .filter(msg => {
        const msgSender = Number(msg.senderId);
        const msgReceiver = Number(msg.receiverId);
        return (msgSender === Number(props.currentUserId) && msgReceiver === receiverId.value) || 
               (msgSender === receiverId.value && msgReceiver === Number(props.currentUserId));
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  } catch (error) {
    console.error('获取消息失败:', error);
    showToast('获取聊天记录失败');
  } finally {
    loading.value = false;
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
      senderId: props.currentUserId,
      receiverId: receiverId.value,
      content: messageContent.value
    });
    
    messages.value.push(response.data);
    messageContent.value = '';
    
    // 滚动到底部
    setTimeout(() => {
      const messageList = document.querySelector('.message-list');
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }, 50);
    
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

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  if (!contactInfo.value) {
    showToast('无效的聊天对象');
    router.push('/message-list');
    return;
  }
  
  fetchMessages();
});
</script>

<style scoped>
.chat-page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  max-width: 80%;
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
  max-width: 100%;
}

.message-item.sent .message-bubble {
  background-color: #1989fa;
  color: white;
}

.message-item.received .message-bubble {
  background-color: white;
  border: 1px solid #ebedf0;
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
  align-items: flex-end;
}

.message-input-area .van-field {
  flex: 1;
  margin-right: 10px;
}

.message-input-area .van-button {
  margin-bottom: 4px;
  height: 36px;
}
</style>