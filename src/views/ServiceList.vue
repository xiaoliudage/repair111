<template>
  <div class="service-list-container">
    <van-nav-bar title="维修服务" />
    <div class="search-bar">
      <van-search
        v-model="searchValue"
        placeholder="搜索服务类型或维修师傅"
        @search="onSearch"
      />
    </div>
    <div class="service-filter">
      <van-tabs v-model="activeTab" @change="onTabChange">
        <van-tab title="全部服务" />
        <van-tab title="附近师傅" />
        <van-tab title="热门推荐" />
      </van-tabs>
    </div>
    <div class="service-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in serviceList" :key="item.id" @click="goToWorkerDetail(item.id)">
          <template #default>
            <div class="service-item">
              <div class="service-info">
                <div class="name">{{ item.username }}</div>
                <div class="contact-info">
                  <div class="contact-row">
                    <span class="phone"><van-icon name="phone" class="icon" /> {{ item.phone }}</span>
                    <span class="address"><van-icon name="location" class="icon" /> {{ item.address }}</span>
                  </div>
                  <span class="price"><van-icon name="credit-card" class="icon" /> {{ item.baseFee }}元起</span>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/services">搜索</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceStore } from '../store';
import axios from 'axios';
import { Icon as VanIcon, showToast } from 'vant';

const router = useRouter();
const serviceStore = useServiceStore();

const searchValue = ref('');
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);
const serviceList = ref([]);

onMounted(async () => {
  try {
    // 初始加载所有维修人员
    const response = await axios.get('/api/repair/find', { params: { type: '' } });
    serviceList.value = response.data;
  } catch (error) {
    console.error('Error fetching repair workers:', error);
    showToast('加载失败，请重试');
  }
});

const onSearch = async (value) => {
  try {
    loading.value = true;
    const response = await axios.get('/api/repair/find', { params: { type: value } });
    serviceList.value = response.data;
    if (response.data.length === 0) {
      showToast('未找到匹配的维修师傅');
    }
  } catch (error) {
    console.error('搜索失败:', error);
    showToast('搜索失败，请重试');
  } finally {
    loading.value = false;
  }
};

const onTabChange = (tabIndex) => {
  // 标签切换逻辑
  console.log('切换标签:', tabIndex);
};

const onLoad = () => {
  // 加载更多逻辑
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 1000);
};

const goToWorkerDetail = (id) => {
  router.push(`/worker/${id}`);
};
</script>

<style scoped>
.service-list-container {
  padding-bottom: 50px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  padding: 15px;
  background-color: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.service-filter {
  background-color: white;
  border-bottom: 1px solid #eee;
}

.service-list {
  padding: 10px;
}

.service-item {
  display: flex;
  padding: 25px;
  margin: 0 0 18px 0;
  background-color: white;
  border-radius: 18px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.service-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.name {
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 20px;
  color: #222;
  letter-spacing: 0.3px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.price {
  color: #f53f3f;
  font-weight: 600;
  font-size: 19px;
  padding: 12px 0;
  margin-top: 5px;
  border-top: 1px dashed #f2f2f2;
  padding-top: 15px;
}
</style>