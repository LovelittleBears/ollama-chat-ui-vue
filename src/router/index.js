// 从 vue-router 中引入 createRouter, createWebHashHistory 方法
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入组件
import aiSystem from './routerList/aiSystem/index'



import aiSystemHome from '@/views/aiSystem/layout/index.vue'
// 定义一个路由数组，统一管理路由
const routes = [
    {
        path: '/', // 登录页
        name: 'aiSystem',
        component: aiSystemHome, // 对应的组件
        children: [
            ...aiSystem
        ],
    }
]

// 使用 createRouter 方法创建路由实例
const router = createRouter({
    history: createWebHashHistory(), // 指定 history 模式，这里采用的是 hash 模式
    routes // 定义路由数组，相当于 routes: routes 的简写模式
})

// ES6 模块导出语句，它用于将 router 对象导出，以便其他文件可以导入和使用这个对象
export default router
