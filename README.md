## Language
- [中文](https://github.com/LovelittleBears/ollama-chat-ui-vue/blob/main/README.md)
- [English](https://github.com/LovelittleBears/ollama-chat-ui-vue/blob/main/README_en.md)
---

## ollama-chat-ui-vue
使用`vue3 + vite + elementUi` 搭建的前端chat,通过ollama可与模型对话,目前支持独立思考,切换模型(联网查询后续支持)

## 前置工作
安装`ollama`,[ollama官网地址](https://ollama.com/)
安装完`ollama`后，打开`cmd`，下载模型(我选了个最小的模型，[模型地址](https://ollama.com/library/deepseek-r1:1.5b))

```bash
ollama run deepseek-r1:1.5b
```

等待下载完成

##  启动ollama
cmd打开输入

```bash
ollama serve
```

等待服务启动

## 启动前端ollama-chat-ui-vue

注意：node版本选择 18.10.0

打开项目`cmd`安装依赖 
```bash
npm install
```

启动项目
```bash
npm run dev
```

## 配置文件
src-api-aiSystem-ollama.js
vite.config

## 效果图

![image-2025219001](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/962ea5381b71705703fe71d230863a3.png)

![image-2025219002](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/ffb7499ec0eeaccfa348422faaf9b1b.png)

![image-2025219003](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/1fba9f96a2cdfdd7592a97fdbc89617.png)


## 欢迎 Issues 交流
