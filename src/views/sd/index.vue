<script setup>
import { ref, toRaw } from "vue";
import {
  txt2img,
  progress,
  interrupt,
  interrogate,
  sysinfoDownload,
  getLoras,
  refreshLoras,
  lobeConfig,
} from "@/api/sd/index";
//组件
import BearForm from "./components/bear-form.vue";
import BearCardOptions from "./components/bear-cardOptions.vue";

let taskId = 1;
let txt2imgData = ref([]);
txt2imgData.value = {
  enable_hr: false, // 开启高清hr
  denoising_strength: 0, // 降噪强度
  hr_scale: 2, // 高清级别
  hr_upscaler: "",
  hr_second_pass_steps: 0,
  hr_resize_x: 0,
  hr_resize_y: 0,
  hr_sampler_name: "",
  hr_prompt: "",
  hr_negative_prompt: "",
  prompt: "", // 正向关键字
  styles: [],
  seed: -1, // 随机种子
  subseed: -1, // 子级种子
  subseed_strength: 0, // 子级种子影响力度
  seed_resize_from_h: -1,
  seed_resize_from_w: -1,
  sampler_name: "",
  batch_size: 1, // 每次生成的张数
  n_iter: 1, // 生成批次
  steps: 50, // 生成步数
  cfg_scale: 7, // 关键词相关性
  width: 512, // 生成图像宽度
  height: 512, // 生成图像高度
  restore_faces: false, // 面部修复
  tiling: false, // 平铺
  do_not_save_samples: false,
  do_not_save_grid: false,
  negative_prompt: "", // 反向关键字
  eta: 0, // 等待时间
  s_min_uncond: 0,
  s_churn: 0,
  s_tmax: 0,
  s_tmin: 0,
  s_noise: 1,
  override_settings: {}, // 覆盖性配置
  override_settings_restore_afterwards: true,
  script_args: [], // lora 模型参数配置
  sampler_index: "Euler", // 采样方法
  script_name: "",
  send_images: true, // 是否发送图像
  save_images: false, // 是否在服务端保存生成的图像
  alwayson_scripts: {}, // alwayson配置
};
let img = ref("");
let timer = ref(null);
let progressNum = ref(0);

//模型
const moxing = ref("");
const moxingOptions = ref([]);

//预设风格
const styleOption = ref([
  {
    id:1,
    name: "写实风格",
  },
  {
    id:2,
    name: "甜美风格",
  },
  {
    id:3,
    name: "性感风格",
  },
])

const txt2imgFun = async () => {
  //监控
  timer.value = setInterval(async () => {
    let { data } = await progress();
    progressNum.value = parseInt(data.progress * 100);
    img.value = `data:image/png;base64,${data.current_image}`;
  }, 2000);
  const response = await txt2img(txt2imgData.value);
  //终止
  clearInterval(timer.value);
  if (response.status === 200 && response.data) {
    try {
      const images = response.data.images;
      if (images.length === 0) return;
      img.value = images.map((item) => `data:image/png;base64,${item}`);
      progressNum.value = 0;
    } catch (err) {
      console.log("err", err);
    }
  }
};
//当前配置详情
const sysinfoDownloadFun = async () => {
  await sysinfoDownload();
};
sysinfoDownloadFun();

//获得模型
const getLorasFun = async () => {
  await getLoras();
  await lobeConfig();
};
getLorasFun();
//刷新模型
const refreshLorasFun = async () => {
  await refreshLoras();
};
//终止
const termination = async () => {
  await interrupt();
};

//生成数量方法
const generateQuantityChange = async (value) => {
  console.log(value);
};
</script>
<template>
  <div class="sdClassBox">
    <div class="sdClass">
      <div class="left">
        <div class="left-top mb20">
          <!-- 正面描述词 -->
          <div class="front mb20">
            <div class="title mb10">正面提示词</div>
            <div class="inputBox">
              <el-input
                class="input"
                type="textarea"
                :rows="6"
                v-model="txt2imgData.prompt"
                placeholder="请输入描述词"
              ></el-input>
            </div>
          </div>
          <!-- 负面描述词 -->
          <div class="front">
            <div class="title mb10">负面提示词</div>
            <div class="inputBox">
              <el-input
                class="input"
                type="textarea"
                :rows="6"
                v-model="txt2imgData.prompt"
                placeholder="请输入描述词"
              ></el-input>
            </div>
          </div>
        </div>
        <!-- 其他参数 -->
        <div class="left-form">
          <BearForm label="图片尺寸" class="mb20">
            <div class="resolution">
              <div>
                <el-input
                  v-model="txt2imgData.height"
                  class="input"
                  placeholder="高度"
                />
              </div>
              <div class="ml10 mr10">×</div>
              <div>
                <el-input
                  v-model="txt2imgData.width"
                  class="input"
                  placeholder="宽度"
                />
              </div>
            </div>
          </BearForm>
          <BearForm label="生成数量" class="mb20">
            <el-input-number
              v-model="txt2imgData.batch_size"
              @change="generateQuantityChange"
              :min="1"
              :max="10"
              label="生成数量"
            ></el-input-number>
          </BearForm>
          <BearForm label="采样步数" class="mb20">
            <el-slider
              style="width: 200px"
              v-model="txt2imgData.steps"
            ></el-slider>
          </BearForm>
          <BearForm label="随机种子" class="mb20">
            <el-input type="number" v-model="txt2imgData.seed"></el-input>
          </BearForm>
          <BearForm label="生成模型" class="mb20">
            <el-select class="select" v-model="moxing" placeholder="请选择模型">
              <el-option
                v-for="item in moxingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </BearForm>
        </div>
        <!-- 按钮 -->
        <div class="left-btnBox">
          <el-button class="generateBtn" type="primary">生成图片</el-button>
          <el-button class="interruptBtn" type="primary">中断</el-button>
        </div>
      </div>
      <div class="right ml20">
        <!-- 生成主图片 -->
        <div class="right-imgBox mb10">
          <el-image class="img" :src="img"> </el-image>
          <div class="progressBar">
            <div class="progress" :style="{ width: `${progressNum}%` }"></div>
          </div>
        </div>
        <!-- 图片选择 -->
        <div class="imageSelection mb20">
          <div class="imageSelection-imgBox"  v-for="(item, index) in 9" :key="index">
            <el-image class="img " :src="item"> </el-image>
          </div>
        </div>
        <!-- 风格 -->
        <div class="stylePreset mb20">
          <div class="title  mb10">风格预设</div>
          <BearCardOptions :option="['1']"></BearCardOptions>
        </div>
      </div>
    </div>

    <!-- <button @click="txt2imgFun">开始生图</button>
    <button @click="termination">终止生图</button>
    <button @click="refreshLorasFun">刷新模型</button>
    <el-form ref="form" label-width="80px">
      <el-form-item label="正面描述词">
        <el-input
          v-model="txt2imgData.prompt"
          placeholder="正面描述词"
        ></el-input>
      </el-form-item>
      <el-form-item label="负面描述词">
        <el-input
          v-model="txt2imgData.negative_prompt"
          placeholder="负面描述词"
        ></el-input>
      </el-form-item>
    </el-form>
    <img style="width: 500px; height: 500px" :src="img" alt="" />
    <span style="font-size: 40px; color: #000"> {{ progressNum }} %</span> -->
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/css/bearCss.css";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.sdClassBox {
  background: #f9fafb;
}
.title {
  color: #4f5966;
  font-size: 15px;
  font-weight: bold;
}
.sdClass {
  width: 95%;
  height: 100vh;
  margin: auto;
  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;

  .left {
    flex: 1;
    background: #fff;
    box-shadow: 0 0 10px rgb(224, 226, 226);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    .input {
      border-radius: 10px;
    }
    .left-top {
    }

    .left-form {
      flex: 1;
      overflow-y: auto;
      .select {
        width: 180px;
      }
    }
    .left-btnBox {
      display: flex;
      width: 100%;
      .generateBtn {
        height: 50px;
        background: #6366f1;
        flex: 1;
      }
      .generateBtn:hover {
        background: rgba($color: #6366f1, $alpha: 0.8);
      }
      .interruptBtn {
        height: 50px;
        background: #f3f4f6;
        color: #4f5966;
        border: none;
      }
      .interruptBtn:hover {
        background: rgba($color: #dde2ec, $alpha: 0.8);
      }
    }
  }
  .right {
    width: 550px;
    background: #fff;
    box-shadow: 0 0 10px rgb(224, 226, 226);
    border-radius: 10px;
    padding: 20px;
    .right-imgBox {
      height: 300px;
      display: flex;
      background: #f5f7fa;
      justify-content: center;
      position: relative;
      .img {
        height: 100%;
        min-width: 200px;
      }
    }
    // 进度条
    .progressBar {
      width: 95%;
      height: 15px;
      background: rgba($color: #030303, $alpha: 0.1);
      position: absolute;
      bottom: 5px;
      border-radius: 25px;
      overflow: hidden;
      .progress {
        height: 100%;
        background: #6366f1;
      }
    }
    .imageSelection {
      width: 500px;
      height: 160px;
      display: flex;
      align-items: center;
      overflow-x: auto;
      &-imgBox {
        width: 120px;
        height: 120px;
        margin-right: 10px;
        .img {
          width: 120px;
          height: 120px;
        }
      }
    }
  }
}
.resolution {
  display: flex;
  align-items: center;
  .input {
    width: 80px;
  }
}
</style>
