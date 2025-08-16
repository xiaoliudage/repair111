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
        :title="item.name"
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

    // 添加详细调试日志查看API返回的完整数据结构
    console.log('API返回的完整数据:', response);
    console.log('消息列表项数据结构:', response.data.length > 0 ? response.data[0] : '空列表');
    messageList.value = response.data
    finished.value = true
  } catch (error) {
    showToast('获取消息列表失败')
    console.error('Failed to fetch message list:', error)
  } finally {
    loading.value = false
  }
};

const goToChat = (contact) => {
  // 添加详细调试日志查看联系人数据的所有属性
  console.log('联系人数据完整结构:', contact);
  console.log('可用的属性:', Object.keys(contact));
  
  // 尝试从多个可能的字段获取用户名
  const possibleNameFields = ['username', 'name', 'userName', 'nickname'];
  let contactName = null;
  for (const field of possibleNameFields) {
    if (contact[field]) {
      contactName = contact[field];
      console.log(`从${field}字段获取到用户名:`, contactName);
      break;
    }
  }
  
  if (!contactName) {
    console.error('无法从联系人数据中获取用户名', contact);
    showToast('无法获取联系人名称');
    return;
  }

  // 验证必要字段
  if (!contact || typeof contact !== 'object' || !contact.id) {
    showToast('联系人数据无效或缺少ID');
    return;
  }

  // 构建跳转参数，使用找到的字段作为用户名
  const contactData = {
    id: contact.id,
    username: contactName,
    phone: contact.phone || '',
    address: contact.address || ''
  };

  // 使用encodeURIComponent确保特殊字符正确传递
  router.push({
    path: '/chat',
    query: {
      contact: encodeURIComponent(JSON.stringify(contactData)),
      currentUserId: localStorage.getItem('userId') || ''
    }
  });
};

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  loadMessageList()
})
</script>

<style scoped>
.message-list-container {
  padding-bottom: 60px;
}
</style>