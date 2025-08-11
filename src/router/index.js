import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ServiceList from '../views/ServiceList.vue';
import WorkerDetail from '../views/WorkerDetail.vue';
import TaskPublish from '../views/TaskPublish.vue';
import Profile from '../views/Profile.vue'; // 添加这行导入

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/services', name: 'ServiceList', component: ServiceList },
  { path: '/worker/:id', name: 'WorkerDetail', component: WorkerDetail },
  { path: '/publish', name: 'TaskPublish', component: TaskPublish },
  { path: '/profile', name: 'Profile', component: Profile } // 添加这行路由配置
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;