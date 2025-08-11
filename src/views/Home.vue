<template>
  <div class="home">
    <van-nav-bar title="维修工人平台" />

    <div class="hero">
      <h1>寻找附近的维修师傅</h1>
      <p>快速解决您的维修需求</p>
      <div class="btn-group">
        <van-button type="primary" size="large" @click="goToServiceList">寻找服务</van-button>
        <van-button type="default" size="large" @click="goToPublishTask">发布任务</van-button>
      </div>
    </div>

    <div class="service-types">
      <h2>热门维修类型</h2>
      <van-grid :column-num="3">
        <van-grid-item v-for="service in serviceTypes" :key="service.id" @click="selectService(service)">
          <van-icon :name="service.icon" class="service-icon" />
          <span class="service-name">{{ service.name }}</span>
        </van-grid-item>
      </van-grid>
    </div>

    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/services">搜索</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceStore } from '../store';

const router = useRouter();
const serviceStore = useServiceStore();

const serviceTypes = ref([
  { id: 1, name: '水电维修', icon: 'water-o' },
  { id: 2, name: '家电维修', icon: 'monitor' },
  { id: 3, name: '管道疏通', icon: 'trash-o' },
  { id: 4, name: '开锁换锁', icon: 'lock' },
  { id: 5, name: '家具维修', icon: 'appreciate' },
  { id: 6, name: '墙面维修', icon: 'photo-o' }
]);

serviceStore.setServices(serviceTypes.value);

const goToServiceList = () => {
  router.push('/services');
};

const goToPublishTask = () => {
  router.push('/publish');
};

const selectService = (service) => {
  serviceStore.selectService(service);
  router.push('/services');
};
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 40px 20px;
  background-color: #f5f5f5;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.service-types {
  padding: 20px;
}

.service-icon {
  font-size: 30px;
}

.service-name {
  margin-top: 5px;
  font-size: 14px;
}
</style>