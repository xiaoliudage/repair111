import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import { Button, Tabbar, TabbarItem, NavBar, Field, Form, Toast, List, Card } from 'vant';
import 'vant/lib/index.css';
import { Checkbox, CheckboxGroup } from 'vant';
/* import { RadioGroup, Radio, Select } from 'vant'; */

const app = createApp(App);

app.use(Checkbox);
app.use(CheckboxGroup);

// 注册Vant组件
app.use(Button);
app.use(Tabbar);
app.use(TabbarItem);
app.use(NavBar);
app.use(Field);
app.use(Form);
app.use(Toast);
app.use(List);
app.use(Card);

/* app.use(RadioGroup);
app.use(Radio);
app.use(Select); */
app.use(router);
app.use(pinia);
app.mount('#app');