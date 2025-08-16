<template>
  <div class="message-list-container">
    <van-nav-bar title="消息列表" left-text="返回" @click-left="goBack" />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多消息"
      @load="loadMessageList"
    >
      <van-cell
        v-for="(item, index) in messageList"
        :key="index"
        :title="item.username"
        :value="`电话: ${item.phone}`"
        :label="`地址: ${item.address}`"
        @click="goToChat(item)"
        is-link
      />
    </van-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import request from '../utils/request'

const router = useRouter()
const route = useRoute()
const messageList = ref([])
const loading = ref(false)
const finished = ref(false)

const loadMessageList = async () => {
  try {
    loading.value = true
    const userId = route.query.id
    if (!userId) {
      showToast('用户ID无效')
      router.push('/login')
      return
    }

    const token = localStorage.getItem('token')
    const response = await request.get('/common/searchmessage', {
      params: { id: userId },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    messageList.value = response.data
    finished.value = true
  } catch (error) {
    showToast('获取消息列表失败')
    console.error('Failed to fetch message list:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

/* const goToChat = (contact) => {
  router.push({ 
    path: '/chat', 
    query: { 
      contact: JSON.stringify({
        id: contact.id,
        username: contact.username,
        phone: contact.phone,
        address: contact.address
      }) 
    } 
  });
}; */


const goToChat = (contact) => {
  console.log('原始联系人数据:', contact); // 调试
  
  // 验证必要字段
  if (!contact || typeof contact !== 'object') {
    showToast('联系人数据无效');
    return;
  }

  // 确保必要字段存在
  const requiredFields = ['id', 'username'];
  const missingFields = requiredFields.filter(field => !contact[field]);
  
  if (missingFields.length > 0) {
    console.error('缺少必要字段:', missingFields);
    showToast('联系人信息不完整');
    return;
  }

  // 构建跳转参数
  const contactData = {
    id: contact.id, // 不强制转为数字，后端可能期望字符串
    username: contact.username || '未知用户',
    phone: contact.phone || '',
    address: contact.address || ''
  };

  // 直接传递对象，不使用encodeURIComponent
  router.push({
    path: '/chat',
    query: {
      contact: JSON.stringify(contactData),
      currentUserId: localStorage.getItem('userId') || '' // 防止undefined
    }
  });
};

onMounted(() => {
  loadMessageList()
})
</script>

<style scoped>
.message-list-container {
  padding-bottom: 60px;
}
</style>