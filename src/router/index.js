import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ServiceList from '../views/ServiceList.vue';
import WorkerDetail from '../views/WorkerDetail.vue';
import TaskPublish from '../views/TaskPublish.vue';
import UserProfile from '../views/UserProfile.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/services', name: 'ServiceList', component: ServiceList },
  { path: '/worker/:id', name: 'WorkerDetail', component: WorkerDetail },
  { path: '/publish', name: 'TaskPublish', component: TaskPublish },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/user/profile', name: 'UserProfile', component: UserProfile },
  { path: '/edit-profile', redirect: '/user/profile' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;