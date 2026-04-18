import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
// Router will be added in Plan 04

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);
// app.use(router); // Plan 04

app.mount('#app');