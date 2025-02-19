export default [
  {
    path: "/aiSystem/index",
    name: "aiSystem-index",
    meta: { title: "ai对话" },
    component: (resolve) =>
      require([
        /* webpackChunkName: "user" */ "@/views/aiSystem/index.vue",
      ], resolve),
  },
  {
    path: "",
    component: () => import("@/views/aiSystem/chat/index.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/aiSystem/agent",
    component: () => import("@/views/aiSystem/agent/index.vue"),
    meta: { title: "代理" },
  },
  {
    path: "/aiSystem/chat",
    component: () => import("@/views/aiSystem/chat/index.vue"),
    meta: { title: "聊天" },
  }
];
