import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ServiceList from '../views/ServiceList.vue';
import WorkerDetail from '../views/WorkerDetail.vue';
import TaskPublish from '../views/TaskPublish.vue';
import UserProfile from '../views/UserProfile.vue';
import Profile from '../views/Profile.vue';
// 导入消息列表组件
import MessageList from '../views/MessageList.vue';
import ChatPage from '../views/ChatPage.vue'; // 新增聊天页面


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/services', name: 'ServiceList', component: ServiceList },
  { path: '/worker/:id', name: 'WorkerDetail', component: WorkerDetail },
  { path: '/publish', name: 'TaskPublish', component: TaskPublish },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/user/profile', name: 'UserProfile', component: UserProfile },
  { path: '/edit-profile', redirect: '/user/profile' },
  // 添加消息列表路由
  { path: '/message-list', name: 'MessageList', component: MessageList },
  { 
    path: '/chat', 
    name: 'ChatPage',
    component: ChatPage,
    /* props: (route) => ({ 
      contact: route.query.contact ? JSON.parse(route.query.contact) : null,
      currentUserId: localStorage.getItem('userId')
    }) */
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;