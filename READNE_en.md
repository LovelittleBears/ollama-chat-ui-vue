## Language
- [中文](https://github.com/LovelittleBears/ollama-chat-ui-vue/blob/main/README.md)
- [English](https://github.com/LovelittleBears/ollama-chat-ui-vue/blob/main/README_en.md)
---

## ollama-chat-ui-vue
The front-end chat built with `vue3 + vite + elementUi` can talk to the model through ollama, and currently supports independent thinking and switching models (follow-up support for online queries)

## Front-loading work
Installation `ollama`,[ollama](https://ollama.com/)
After installing `ollama`, open `cmd` and download the model(I chose the smallest model,[The address of the model](https://ollama.com/library/deepseek-r1:1.5b))

```bash
ollama run deepseek-r1:1.5b
```

Wait for the download to complete

##  Start ollama
cmd to open the input

```bash
ollama serve
```

Wait for the service to start

## Launch the program ollama-chat-ui-vue

Note: Node version is 18.10.0

Open the project 'cmd' to install the dependencies

```bash
npm install
```

Start the project

```bash
npm run dev
```

## Profiles
src-api-aiSystem-ollama.js
vite.config

## Renderings

![image-2025219001](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/962ea5381b71705703fe71d230863a3.png)

![image-2025219002](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/ffb7499ec0eeaccfa348422faaf9b1b.png)

![image-2025219003](https://raw.githubusercontent.com/LovelittleBears/ollama-chat-ui-vue/refs/heads/main/1fba9f96a2cdfdd7592a97fdbc89617.png)

## Feel free to exchange issues

