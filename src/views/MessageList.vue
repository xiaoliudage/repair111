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
  console.log('准备跳转的联系人:', contact); // 调试用
  
  // 确保传递了正确的数据结构
  const contactData = {
    id: Number(contact.id),  // 确保转换为数字
    username: contact.username,
    phone: contact.phone,
    address: contact.address
  };
  
  router.push({ 
    path: '/chat', 
    query: { 
      contact: JSON.stringify(contactData),
      currentUserId: localStorage.getItem('userId') // 显式传递当前用户ID
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