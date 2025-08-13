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
                <div class="name">
                  <span class="name">{{ item.username }}</span>
                </div>
                <div class="contact-info">
                  <span class="phone">{{ item.phone }}</span>
                  <span class="address">{{ item.address }}</span>
                  <span class="price">{{ item.baseFee }}元起</span>
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

const router = useRouter();
const serviceStore = useServiceStore();

const searchValue = ref('');
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);
const serviceList = ref([]);
const allWorkers = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/api/repair/getAll');
    allWorkers.value = response.data;
    serviceList.value = allWorkers.value;
  } catch (error) {
    console.error('Error fetching repair workers:', error);
  }
});

const onSearch = (value) => {
  if (!value) {
    serviceList.value = allWorkers.value;
    return;
  }
  const searchTerm = value.toLowerCase();
  serviceList.value = allWorkers.value.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm) || 
    worker.serviceType.toLowerCase().includes(searchTerm)
  );
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
}

.search-bar {
  padding: 10px;
}

.service-filter {
  border-bottom: 1px solid #eee;
}

.service-item {
  display: flex;
  padding: 10px 0;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.service-info {
  flex: 1;
}

.name-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.name {
  font-weight: bold;
}

.service-type {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.distance-price {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

.distance {
  color: #fa550f;
}

.price {
  color: #f53f3f;
}
</style>