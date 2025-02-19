import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 为./src配置别名，以后可用@引入文件
    },
  },
  //配置跨域的地方
  server: {
    port: 8516,//端口号
    host: true,
    open: false,//是否自动启动
    proxy: {
      "/api": {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true, //是否跨域
        secure:false,//解决自签名证书错误
        rewrite: (p) => p.replace(/^\/api/, "api"), //重写路径
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  }
})
