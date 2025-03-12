import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
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
    port: 8516, //端口号
    host: true,
    open: false, //是否自动启动
    proxy: {
      "/api": {
        target: "http://127.0.0.1:11434",
        changeOrigin: true, //是否跨域
        secure: false, //解决自签名证书错误
        rewrite: (p) => p.replace(/^\/api/, "api"), //重写路径
      },
      "/mySdApi": {
        target: "http://127.0.0.1:7860",
        changeOrigin: true, //是否跨域
        secure: false, //解决自签名证书错误
        rewrite: (p) => p.replace(/^\/mySdApi/, ""), //重写路径
        // bypass(req, res, options) {
        //   const proxyURL = options.target + options.rewrite(req.url);
        //   console.log("----",proxyURL)
        //   // res.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
        // },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
