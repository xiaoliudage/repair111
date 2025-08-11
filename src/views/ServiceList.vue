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
              <img :src="item.avatar" alt="头像" class="avatar" />
              <div class="service-info">
                <div class="name-rating">
                  <span class="name">{{ item.name }}</span>
                  <van-rate v-model="item.rating" readonly size="16" />
                </div>
                <div class="service-type">{{ item.serviceType }}</div>
                <div class="distance-price">
                  <span class="distance">{{ item.distance }}km</span>
                  <span class="price">{{ item.price }}元起</span>
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

const router = useRouter();
const serviceStore = useServiceStore();

const searchValue = ref('');
const activeTab = ref(0);
const loading = ref(false);
const finished = ref(false);
const serviceList = ref([]);

// 模拟服务列表数据
const mockServices = [
  { id: 1, name: '张师傅', avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg', rating: 5, serviceType: '水电维修', distance: 0.8, price: 80 },
  { id: 2, name: '李师傅', avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg', rating: 4.5, serviceType: '家电维修', distance: 1.2, price: 60 },
  { id: 3, name: '王师傅', avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg', rating: 4, serviceType: '管道疏通', distance: 1.5, price: 100 },
  { id: 4, name: '赵师傅', avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg', rating: 5, serviceType: '水电维修', distance: 2.0, price: 80 },
  { id: 5, name: '陈师傅', avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg', rating: 4.5, serviceType: '家具维修', distance: 2.5, price: 70 }
];

onMounted(() => {
  // 初始化加载数据
  serviceList.value = mockServices;
});

const onSearch = (value) => {
  // 搜索逻辑
  console.log('搜索:', value);
};

const onTabChange = (tabIndex) => {
  // 标签切换逻辑
  console.log('切换标签:', tabIndex);
};

const onLoad = () => {
  // 加载更多逻辑
  setTimeout(() => {
    serviceList.value.push(...mockServices);
    loading.value = false;
    if (serviceList.value.length >= 15) {
      finished.value = true;
    }
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