import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "./assets/css/main.css";
import App from "./App.vue";
// 从 router 文件夹下引入路由实例
import router from "./router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);

//全局方法

// 注册对象
app.use(router);
app.use(createPinia());
app.use(ElementPlus);
// 挂载到 Dom 元素中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
