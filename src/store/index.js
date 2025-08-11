import { createPinia } from 'pinia';
import { defineStore } from 'pinia';

// 用户状态
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLogin: false,
    userType: '' // 'customer' or 'worker'
  }),
  actions: {
    login(userInfo, type) {
      this.userInfo = userInfo;
      this.isLogin = true;
      this.userType = type;
    },
    logout() {
      this.userInfo = null;
      this.isLogin = false;
      this.userType = '';
    }
  }
});

// 服务状态
export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    selectedService: null,
    nearbyWorkers: []
  }),
  actions: {
    setServices(services) {
      this.services = services;
    },
    selectService(service) {
      this.selectedService = service;
    },
    setNearbyWorkers(workers) {
      this.nearbyWorkers = workers;
    }
  }
});

export default createPinia();