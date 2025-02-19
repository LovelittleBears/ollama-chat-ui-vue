<!--  -->
<script setup>
import { ref, onMounted } from "vue";
const dirs = ref([
  {
    id: 0,
    title: "对话",
    classNN: "icon-chat",
    path: "/aiSystem/chat",
  },
  {
    id: 1,
    title: "代理",
    classNN: "icon-robot",
    path: "/aiSystem/agent",
  },
]);

const currentGroup = ref("");
const imgSrcClick = () => {
  let url = "github.com/LovelittleBears/ollama-chat-ui-vue"; // 不需要添加'http://'或'https://'
  let path = window.location.protocol + "//" + url;
  window.location.href = path;
};
</script>

<template>
  <div class="view-container invisible-scrollbar">
    <RouterLink to="/" class="emboss">
      <div class="emboss-title">
        <img src="@/assets/aiSystem/ai.png" @click="imgSrcClick" alt="" />
      </div>
    </RouterLink>
    <ul class="menu-wrapper" v-if="dirs.length">
      <li class="menu-group" v-for="v in dirs" :key="v.id">
        <RouterLink
          class="menu-item"
          style="cursor: pointer"
          :to="{ path: v.path }"
          @click="currentGroup = v.id"
        >
          <div class="icon-menu">
            <div
              class="icon-box"
              :class="currentGroup == v.id ? 'icon-box-bg' : ''"
            >
              <div class="icon iconsize" :class="v.classNN"></div>
            </div>
            <div class="menu-item-title">
              {{ v.title }}
            </div>
          </div>
        </RouterLink>
      </li>
    </ul>
    <div class="sidebar-empty"></div>
    <img  @click="imgSrcClick" class="imgCss" src="@/assets/github.png" alt="">
  </div>
</template>

<style scoped lang="scss">
.view-container {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  width: 80px;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--site-menu-bgc);
  box-shadow: 0px 2px 6px var(--shadow-01);
  border-right: 1px solid var(--border-secondary);
}

.emboss {
  z-index: 110;
  min-height: 70px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  .emboss-title {
    color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .emboss-subtitle {
    color: var(--subtitle-tc-01);
  }
}

.icon-robot {
  mask-image: url("@/assets/svg/robot.svg");
  background: #fff;
}

.icon-chat {
  mask-image: url("@/assets/svg/chat.svg");
  background: #fff;
}

.icon-prompt {
  mask-image: url("@/assets/svg/prompt.svg");
  background: #fff;
}

.icon-setting {
  mask-image: url("@/assets/svg/setting.svg");
  background: #fff;
}

.icon-storage {
  mask-image: url("@/assets/svg/storage.svg");
  background: #fff;
}

.menu-wrapper {
  padding-top: 30px;

  .show {
    display: block;
  }

  .hide {
    max-height: 0 !important;
  }

  .open {
    color: #fff;
  }
}

.menu-group {
  overflow: hidden;
}

.menu-item {
  height: 100%;
  cursor: default;

  .menu-item-title {
    flex: 1;
    vertical-align: middle;
    font-size: 12px;
    color: var(--text-02);
  }
}

.single-menu-item-active {
  color: var(--text-02);
  // background: var(--linear-02) !important;
}

.link-active {
}

.sidebar-bottom-fixed {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .bottom-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 20px;
    margin-left: 10px;
    margin-bottom: 10px;

    .icon-container {
      display: flex;
      align-items: center;
      justify-self: center;
      border-radius: 10%;
      transition: background-color 0.15s linear;
      & > div {
        margin: 5px;
      }
    }
  }

  .bottom-right {
    flex: 1;
  }
}
.icon-menu {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 30px;
}
.iconsize {
  width: 25px;
  height: 25px;
  margin-right: 7px;
}
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 5px;
}
.icon-box-bg {
  background: rgba(255, 255, 255, 0.1);
}
.imgCss{
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>
