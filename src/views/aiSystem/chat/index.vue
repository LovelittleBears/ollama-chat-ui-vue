<!--  -->
<script setup>
import SubmitBtn from "@/views/aiSystem/components/button/SubmitBtn.vue";
import PromptInfo from "../template/components/PromptInfo.vue";
import { useChatStore, useSiteStore, useAgentStore } from "@/stores";
import { nextTick, onMounted, ref } from "vue";
import { useScroll } from "@/hooks/useScroll";
import { local } from "@/utils/storage";
import { chatWithHistory, abort } from "@/api/aiSystem/ollama";
import { render } from "@/utils/markdown";
import { ElMessage } from "element-plus";
import moment from "moment";
import useEvent from "./hooks/useEvent";
import useActiveAgentInfo from "./composable/useActiveAgentInfo";
import useChatHistory from "./composable/useChatHistory";
import getChatHistory from "./helper";
import {
  useTemplateInfo,
  updateTemplateInfo,
} from "./composable/useTemplateInfo";
import stop from "@/assets/aiSystem/stop.svg";
const input = defineModel();
const chatStore = useChatStore();
const agentStore = useAgentStore();
const siteStore = useSiteStore();
const leftPanel = ref(null);
const sending = ref(false);
const agentInfo = useActiveAgentInfo();
const chatHistory = useChatHistory(agentInfo.value?.id);
const { prompt } = useTemplateInfo(agentInfo.value?.agentPersona);
const { scrollRef, scrollToBottom } = useScroll();
const detailWindowVisible = ref(null);
const importInput = ref(null);
const autoScrollSwitch = ref(siteStore.siteState.autoScroll);
//是否显示思考
const isReflectionBtn = ref(true);
//计算盒子宽度
const chatAreaWidth = ref(500);
onMounted(async () => {
  if (agentInfo.value) {
    await nextTick();
    leftPanel.value.style.width = siteStore.siteState.chatBarW;
    scrollToBottom();
    useEvent();
  }
  getDivWidth();
});
//监听屏幕宽度
onMounted(() => {
  window.onresize = () => {
    return (() => {
      getDivWidth();
    })();
  };
});
function addUserChat(msg) {
  const userChat = {
    inversion: false,
    text: msg,
  };
  chatStore.addChat(agentInfo.value.id, userChat);
}

function addEmptyBotChat() {
  const botChat = {
    inversion: true,
    text: "",
    timestamp: new Date().toISOString(),
    //think
    think: "",
  };
  chatHistory.value.push(botChat); // Will not save immediately
}

async function SubmitChat() {
  if (sending.value) return;
  const userMsg = input.value;
  if (!userMsg || userMsg.trim() === "") return;
  (sending.value = true), (input.value = "");
  const history = getChatHistory(chatHistory.value, chatHistory.value.length);
  addUserChat(userMsg);
  addEmptyBotChat();
  scrollToBottom(true);
  _chat(userMsg, -1, history);
}

function reGenerate(idx) {
  if (sending.value || idx < 1) return;
  sending.value = true;
  const userChat = chatHistory.value[idx - 1];
  if (userChat.inversion) {
    ElMessage({
      message: "Chat has been deleted.",
      type: "warning",
    });
    sending.value = false;
    return;
  }
  const history = getChatHistory(chatHistory.value, idx);
  _chat(userChat.text, idx, history);
}

function delChat(idx) {
  if (sending.value || idx < 0) return;
  chatStore.removeChatItem(agentInfo.value.id, idx);
  ElMessage({
    message: "Chat has been deleted.",
    type: "success",
  });
}

function botThinking(idx) {
  const thinkingText = ["⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏", "⠋", "⠙", "⠹"];
  let i = 0;
  const loadingInterval = setInterval(() => {
    chatHistory.value.at(idx).text = thinkingText[i];
    i = (i + 1) % thinkingText.length;
  }, 100);
  return () => {
    clearInterval(loadingInterval);
    chatHistory.value.at(idx).text = "";
  };
}
let isThink = ref(false);
//判断是否deepseek
let testRegex = /deepseek/;
function _chat(userMsg, idx, history) {
  const thinkingDone = botThinking(idx);
  chatWithHistory(agentInfo.value.model, userMsg, history, prompt.value.value)
    .then(async (stream) => {
      thinkingDone();
      console.log("agentInfo.value.model", agentInfo.value.model);
      for await (const part of stream) {
        // chatHistory.value.at(idx).text += part.message.content;
        let tep_mesg = part.message.content;
        //判断是否是deepseek模型
        if (testRegex.test(agentInfo.value.model)) {
          if (tep_mesg == "\u003cthink\u003e") {
            isThink.value = true;
          }
          if (isThink.value) {
            //清除think
            if (
              tep_mesg == "\u003cthink\u003e" ||
              tep_mesg == "\u003c/think\u003e"
            ) {
              chatHistory.value.at(idx).think += "";
            } else {
              chatHistory.value.at(idx).think += tep_mesg;
            }
            //如果结尾标签则停止拼接
            if (tep_mesg == "\u003c/think\u003e") {
              isThink.value = false;
            }
          } else {
            chatHistory.value.at(idx).text += tep_mesg;
          }
        } else {
          chatHistory.value.at(idx).text += tep_mesg;
        }
        autoScrollSwitch.value && scrollToBottom(true);
      }
      chatStore.updateChat(agentInfo.value.id);
      sending.value = false;
      useEvent();
    })
    .catch((error) => {
      const generatedText = chatHistory.value.at(idx).text;
      thinkingDone();
      if (error.name === "AbortError") {
        chatHistory.value.at(idx).text +=
          generatedText + "[Request have been aborted.]";
      } else {
        chatHistory.value.at(idx).text = "[Request failed.]";
      }
      chatStore.updateChat(agentInfo.value.id);
      sending.value = false;
    });
}

function handleCopy(text) {
  navigator.clipboard.writeText(text);
  ElMessage({
    message: "Copied.",
    type: "success",
  });
}

function modifyPrompt() {
  if (prompt.value.key === "" || prompt.value.value === "") {
    ElMessage({
      message: "Please fill in the prompt.",
      type: "warning",
    });
    return;
  }
  agentInfo.value.prompt = prompt.value.key;
  agentStore.updateAgent(agentInfo.value);
  updateTemplateInfo(prompt.value);
  detailWindowVisible.value = false;
}

function clearChatHistory(e) {
  e();
  chatStore.removeChat(agentInfo.value.id);
  sending.value = false
  abort()
}

function inputKeyDown(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    SubmitChat();
  }
}

function exportChatData() {
  const data = {};
  data.chatData = chatHistory.value;
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chatHistory.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importChatData(e) {
  const target = e.target;
  if (!target || !target.files) return;
  const file = target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);
    data.chatData.forEach((item) =>
      chatStore.addChat(agentInfo.value.id, item)
    );
  };
  reader.readAsText(file);
  ElMessage({
    message: "Imported!",
    type: "success",
  });
}

function switchAutoScroll() {
  autoScrollSwitch.value = !autoScrollSwitch.value;
  siteStore.setAutoScroll(autoScrollSwitch.value);
}
//是否关闭思考按钮
function reflectionBtn() {
  isReflectionBtn.value = !isReflectionBtn.value;
}

//计算div宽度
function getDivWidth() {
  const el = document.getElementById("chat-area");
  chatAreaWidth.value = el.getBoundingClientRect().width - 78 + "px";
}
</script>

<template>
  <div class="view-container">
    <PromptInfo
      :condition="detailWindowVisible"
      :form="prompt"
      @submit="modifyPrompt"
      @close="detailWindowVisible = false"
    />
    <div v-if="!agentInfo" class="main-panel">
      <div class="empty-panel">
        <div class="empty-text">选择一个代理进行聊天</div>
        <RouterLink to="/aiSystem/agent">
          <SubmitBtn class="select-btn">选择</SubmitBtn>
        </RouterLink>
      </div>
    </div>
    <div v-else class="main-panel">
      <div class="left-panel" ref="leftPanel">
        <div class="left-panel-footer">
          <div class="ops">
            <el-popconfirm
              width="220"
              :hide-after="0"
              :hide-icon="true"
              title="确定清除记录?"
            >
              <template #reference>
                <div class="icon icon-clear icon-size2" title="清除聊天记录"></div>
              </template>
              <template #actions="{ cancel, confirm }">
                <el-button size="small" @click="cancel">否</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="clearChatHistory(confirm)"
                  >是</el-button
                >
              </template>
            </el-popconfirm>
            <input
              ref="importInput"
              type="file"
              style="display: none"
              @change="importChatData"
            />
            <div
              class="icon icon-export icon-size2"
              title="导出聊天记录"
              @click="exportChatData"
            ></div>
            <div
              class="icon icon-import icon-size2"
              title="导入聊天记录"
              @click="importInput.click()"
            ></div>
            <div
              class="icon icon-scroll icon-size2"
              title="自动滚动"
              @click="switchAutoScroll"
              :class="{ red: autoScrollSwitch }"
            ></div>
          </div>
        </div>
      </div>
      <!-- 主窗口 -->
      <div class="chat-panel">
        <div class="model-info">
           {{ agentInfo.model }}
          </div>
        <div ref="scrollRef" class="chat-area" id="chat-area">
          <div
            v-for="(v, i) in chatHistory"
            :key="i"
            :class="v.inversion ? 'bot-msg' : 'user-msg'"
          >
            <div class="msg-info">
              <!-- <div class="timestamp">{{ moment(v.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</div> -->
            </div>
            <div class="msg-container">
              <div class="icon-position">
                <img
                  class="icon icon-size icon-top"
                  v-if="v.inversion"
                  src="@/assets/aiSystem/ai.png"
                  alt=""
                />
              </div>
              <div v-if="v.inversion" class="msg-content">
                <div>
                  <el-button
                    class="reflectionBtn"
                    type="primary"
                    v-if="v.think && v.think.length > 2"
                    @click="reflectionBtn"
                    :icon="isReflectionBtn ? 'ArrowUp' : 'ArrowDown'"
                    >深度思考</el-button
                  >
                </div>
                <div class="think" v-if="v.think.length > 2 && isReflectionBtn">
                  {{ v.think }}
                </div>
                <div v-html="render(v.text)"></div>
              </div>
              <div v-else class="msg-content">{{ v.text }}</div>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <div class="chat-input-top">
            <el-button type="primary" class="reflectionBtn" plain
              >深度思考</el-button
            >
            <!-- <el-button type="primary" class="reflectionBtn" plain
              >联网查询</el-button
            > -->
          </div>
          <el-input
            placeholder="遇事不绝找小熊"
            @keydown="inputKeyDown($event)"
            v-model="input"
            clearable
            class="chat-inputBox"
          >
            <template #suffix>
              <div v-if="sending" class="chat-icon-box" @click="abort">
                <img
                  class="chat-icon chat-stop chat-stop-animation"
                  :src="stop"
                  alt=""
                />
              </div>
              <div
                v-else
                class="chat-icon-box"
                @click="SubmitChat"
                :style="input ? 'background:#615ced' : 'background:#d6d5de'"
              >
                <el-icon
                  class="chat-icon"
                  size="20"
                  style="margin: 2px 2px 0 0"
                  color="#fff"
                  ><Position
                /></el-icon>
              </div>
            </template>
            <template #prefix>
              <el-icon class="chat-icon" size="20" color="#353535"
                ><Link
              /></el-icon>
            </template>
          </el-input>
          <div class="chat-input-bottom">
            服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-panel {
  .title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    color: var(--text-03);
  }

  .agent-id {
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1rem;
    color: #999;
  }
}

.main-panel {
  flex: 1;
  display: flex;
  overflow-y: auto;
  background-color: #f6f7fb;

  .empty-panel {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;

    .select-btn {
      display: block;
    }
  }
}

.left-panel {
  width: 200px;
  padding: 10px 0 10px 10px;
  position: sticky;
  overflow: auto;
  display: flex;
  flex-direction:column-reverse;
  background-color: #ffffff;
  z-index: 10;

  .left-panel-footer {
    .ops {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
  }
}

.chat-panel {
  flex: 1;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  .model-info{
    position: absolute;
    left: 20px;
    top:20px;
    font-size:20px;
  }

  .chat-input {
    position: relative;
    padding: 0;
    width: 70%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    .chat-input-top {
      height: 50px;
      display: flex;
      align-items: center;
    }
    .chat-inputBox {
      width: 100%;
      height: 50px;
    }

    .chat-icon {
      margin: 0 10px;
      cursor: pointer;
    }
    .chat-stop {
      width: 100%;
      height: 100%;
    }
    .chat-icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      border-radius: 35px;
      cursor: pointer;
    }

    .chat-input-bottom {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8d8fa6;
      font-size: 12px;
      user-select:none;
    }
    .edit-input {
      max-height: 100%;
      background: #f6f7fb;
      color: var(--title-tc-01);
      outline: none;
      border: none;
      resize: none;
      caret-color: #000;
      padding: 5px;
      font-size: 16px;
      line-height: 1.6;
    }

    .submit-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }

    .stop-btn {
      position: absolute;
      right: 50%;
      bottom: 120%;
      transform: translateX(50%);
    }
  }
}

.chat-area {
  flex: 1;
  padding: 0.5em;
  overflow-y: auto;
  padding-bottom: 4em;
  width: 70%;
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */

  .user-msg,
  .bot-msg {
    width: 100%;
    margin-bottom: 1em;
  }

  .user-msg {
    .msg-info {
      flex-direction: row-reverse;
    }

    .msg-container {
      flex-direction: row-reverse;
    }

    .msg-content {
      white-space: break-spaces;
      background-color: #e0dfff !important;
      color: #2c2c36;
      line-height: 27px;
      max-width: v-bind("chatAreaWidth");
    }
  }

  .msg-info {
    display: flex;
    align-items: center;

    .timestamp {
      font-size: 10px;
      color: #999;
    }
  }

  .msg-container {
    display: flex;
    margin: 0 0px;

    .fast-op {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease-out;

      &:hover {
        opacity: 1;
      }
    }

    .msg-content {
      // background-color: var(--chat-bot-msg-bgc);
      background-color: rgb(255, 255, 255);
      box-shadow: 0px 1px 4px rgba(65, 65, 65, 0.339);
      padding: 0.6em 1.4em;
      border-radius: 5px;
    }

    .msg-operation {
      margin-top: auto;
    }

    .dropdown-item {
      transition: background-color 0.1s ease-out;
      padding: 5px 10px;
      cursor: pointer;

      &:hover {
        background-color: #84c99b;
      }
    }
  }
}

.icon-cat {
  margin: 5px;
  mask-image: url("@/assets/svg/cat1.svg");
}
.icon-size {
  width: 40px;
  height: 40px;
}
.icon-size2{
  width: 20px;
  height: 20px;
}
.icon-robot {
  margin: 5px;
  mask-image: url("@/assets/aiSystem/ai.png");
}

.icon-pen {
  mask-image: url("@/assets/svg/pen.svg");
}

.icon-refresh {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  mask-image: url("@/assets/svg/refresh.svg");
}

.icon-clear {
  margin: 0;
  mask-image: url("@/assets/svg/clear.svg");
  background-color: #9073f3;
}

.icon-export {
  margin: 0;
  mask-image: url("@/assets/svg/export.svg");
  background-color: #9073f3;
}

.icon-import {
  margin: 0;
  mask-image: url("@/assets/svg/import.svg");
  background-color: #9073f3;
}

.icon-scroll {
  margin: 0;
  mask-image: url("@/assets/svg/scroll.svg");
  background-color: #9073f3;
}

.icon-arrow {
  margin: 0;
  mask-image: url("@/assets/svg/arrow.svg");
}

.red {
  background-color: red !important;
  color: red !important;
}

.icon-pen,
.icon-refresh,
.icon-clear,
.icon-export,
.icon-import,
.icon-scroll,
.icon-arrow {
  cursor: pointer;

  &:hover {
    background-color: rgb(57, 58, 57);
  }
}
.icon-position {
  height: 100%;
}
.think {
  color: #8b8b8b;
  padding: 0 0 20px 0;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 14px;
  line-height: 30px;
}
.reflectionBtn {
  width: 80px;
  height: 30px;
  font-size: 12px;
  margin-bottom: 10px;
}

/*搜索组件最外层div */

/*搜索input框 */
:deep(.el-input__wrapper) {
  background-color: #fff; /*覆盖原背景颜色，设置成透明 */
  border-radius: 95px;
}
/*搜索button按钮 */
:deep(.el-input-group__append) {
  background: rgb(0 234 245 / 48%);
  border-radius: 95px;
}
/* 隐藏 Chrome、Safari 和 Opera 的滚动条 */
.chat-area::-webkit-scrollbar {
  // display: none;
}
</style>
