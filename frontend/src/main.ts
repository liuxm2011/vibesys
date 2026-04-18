import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { setupRouterGuards } from './router/guards';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);
app.use(router);

// Setup navigation guards after router is installed
setupRouterGuards(router);

app.mount('#app');