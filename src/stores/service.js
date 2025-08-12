import { defineStore } from 'pinia';

// 定义并导出store
export const useServiceStore = defineStore('service', {
  // 状态管理
  state: () => ({
    // 维修师傅列表数据
    workers: [
      {
        id: 1,
        name: '张师傅',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        rating: 4.9,
        serviceType: '水电维修',
        experience: '10年经验',
        price: 80,
        distance: '0.8km',
        online: true
      },
      // 可以添加更多示例数据...
    ],
    // 分页相关状态
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }),
  // 计算属性
  getters: {
    // 分页后的数据
    paginatedWorkers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.workers.slice(startIndex, startIndex + this.itemsPerPage);
    }
  },
  // 方法
  actions: {
    // 获取维修师傅数据
    fetchWorkers() {
      // 这里可以添加API调用逻辑
      this.totalItems = this.workers.length;
    },
    // 更改每页显示数量
    setItemsPerPage(count) {
      this.itemsPerPage = count;
      this.currentPage = 1; // 重置到第一页
    },
    // 更改当前页码
    setCurrentPage(page) {
      this.currentPage = page;
    }
  }
});