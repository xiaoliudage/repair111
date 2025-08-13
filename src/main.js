import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

// 按需引入 Vant 组件（按字母顺序排序，方便维护）
import {
  Button,
  Card,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Field,
  Form,
  List,
  NavBar,
  Picker,
  Popup,
  Search,  // 新增 Search 组件
  Tabbar,
  TabbarItem,
  Toast,
  // 可根据需要继续添加其他组件
} from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);

// 全局注册 Vant 组件（按字母顺序排序）
[
  Button,
  Card,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Field,
  Form,
  List,
  NavBar,
  Picker,
  Popup,
  Search,  // 注册 Search 组件
  Tabbar,
  TabbarItem,
  Toast,
].forEach(component => {
  app.use(component);
});

// 注册路由和状态管理
app.use(router);
app.use(pinia);

app.mount('#app');