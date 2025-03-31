<script setup>
import { ref, toRaw, onMounted, nextTick } from "vue";
import {
  txt2img,
  progress,
  interrupt,
  interrogate,
  sysinfoDownload,
  getLoras,
  refreshLoras,
  lobeConfig,
  sdModels,
  //配置
  sdOptions,
  //重新加载模型
  refreshSdModels,
} from "@/api/sd/index";
//ollama
import { translateChat, listModels } from "@/api/aiSystem/ollama";
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
  steps: 20, // 生成步数
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
  sampler_index: "DPM++ 2M Karras", // 采样方法
  script_name: "",
  send_images: true, // 是否发送图像
  save_images: false, // 是否在服务端保存生成的图像
  alwayson_scripts: {}, // alwayson配置
  //模型
  model_name: "",
};
let img = ref("");
let imgBox = ref([""]);
let imgIndex = ref(0);
let timer = ref(null);
let progressNum = ref(0);

//模型
const moxing = ref("");
const moxingOptions = ref([]);

//ollama 模型
const ollamaModel = ref("qwen2.5:1.5b");

//预设风格
const styleOption = ref([
  {
    id: 1,
    name: "写实风格",
  },
  {
    id: 2,
    name: "甜美风格",
  },
  {
    id: 3,
    name: "性感风格",
  },
]);
let samplerList = ref([
  "DPM++ 2M Karras",
  "DPM++ SDE Karras",
  "DPM++ 2M SDE Exponential",
  "DPM++ 2M SDE Karras",
  "Euler a",
  "Euler",
  "LMS",
  "Heun",
  "DPM2",
  "DPM2 a",
  "DPM++ 2S a",
  "DPM++ 2M",
  "DPM++ SDE",
  "DPM++ 2M SDE",
  "DPM++ 2M SDE Heun",
  "DPM++ 2M SDE Heun Karras",
  "DPM++ 2M SDE Heun Exponential",
  "DPM++ 3M SDE",
  "DPM++ 3M SDE Karras",
  "DPM++ 3M SDE Exponential",
  "DPM fast",
  "DPM adaptive",
  "LMS Karras",
  "DPM2 Karras",
  "DPM2 a Karras",
  "DPM++ 2S a Karras",
  "Restart",
  "DDIM",
  "PLMS",
  "UniPC",
]);
//采样方法
const samplerIndexOptions = ref([]);
//采集
const samplerIndexFun = () => {
  samplerList.value.forEach((item) => {
    samplerIndexOptions.value.push({
      label: item,
      value: item,
    });
  });
};

//获得模型
const sdModelsFun = async () => {
  const response = await sdModels();
  moxingOptions.value = response.data.map((item) => {
    return {
      label: `${item.model_name}.safetensors`,
      value: item.title,
    };
  });
  console.log("response", response);
};
//选择模型
const sdModelsSelectFun = (Mode) => {
  let obj = moxingOptions.value.find((v) => v.value == Mode);
  txt2imgData.value.model_name = obj.label;
  // refreshSdModelsFun(e);
};

//刷新模型 废弃
const refreshSdModelsFun = async (Mode) => {
  const data = {
    prompt: "a girl",
    negative_prompt: "boy",
    seed: -1, // 随机种子
    sampler_name: "",
    cfg_scale: 7, // 提示词相关性 越大越接近提示词
    width: 512, // 宽 （注意要被16整除）
    height: 512, // 高 （注意要被16整除）
    override_settings: {
      sd_model_checkpoint: Mode, // 指定大模型
      sd_vae: "Automatic", // 指定vae 默认自动
    },
    override_settings_restore_afterwards: true, // override_settings 是否在之后恢复覆盖的设置 默认是True
  };
  const response = await refreshSdModels(data);
};
//配置
const sdOptionsFun = async () => {
  const response = await sdOptions();
  console.log("response.sd_model_checkpoint", response);

  moxing.value = response.data.sd_model_checkpoint;
  let obj = moxingOptions.value.find((v) => v.value == moxing.value);
  txt2imgData.value.model_name = obj.label;
};

const txt2imgFun = async () => {
  //图片占位
  let arr = [];
  for (let i = 0; i < txt2imgData.value.batch_size; i++) {
    arr.push("");
  }
  imgBox.value = arr;
  img.value = "";

  //监控
  timer.value = setInterval(async () => {
    let { data } = await progress();
    progressNum.value = parseInt(data.progress * 100);
    img.value = `data:image/png;base64,${data.current_image}`;
  }, 2000);
  const response = await txt2img(txt2imgData.value);
  //终止
  clearInterval(timer.value);
  imgIndex.value = 0;
  if (response.status === 200 && response.data) {
    try {
      const images = response.data.images;
      if (images.length === 0) return;
      // img.value = images.map((item) => `data:image/png;base64,${item}`);
      // console.log("----",img.value)
      imgBox.value = images.map((item) => `data:image/png;base64,${item}`);
      img.value = imgBox.value[0];
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

//获得模型
const getLorasFun = async () => {
  await getLoras();
  // await lobeConfig();
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

//生成数量方法  废弃
const generateQuantityChange = async (value) => {
  let arr = [];
  for (let i = 0; i < value; i++) {
    arr.push("");
  }
  imgBox.value = arr;
};
//切换图片
const imgBoxFun = (value) => {
  img.value = imgBox.value[value];
  imgIndex.value = value;
};
//调用ollama模型 舍弃
const listModelsFun = async () => {
  const response = await listModels();
  console.log(response);
  if (response && response.length > 0) {
    ollamaModel.value = response[0].model;
  }
};
//翻译
const translateBtn = async (e) => {
  let prompt =
    txt2imgData.value[e] +
    ",以上文字翻译成英文,只显示对应的英文,不要显示多余的英文";
  const response = await translateChat(ollamaModel.value, prompt);
  txt2imgData.value[e] = response.response;
};

onMounted(async () => {
  await samplerIndexFun();
  await sysinfoDownloadFun();
  await sdModelsFun();
  await sdOptionsFun();
  //舍弃
  // await listModelsFun();
});
</script>
<template>
  <div class="sdClassBox">
    <div class="sdClass">
      <div class="left">
        <div class="left-top mb20">
          <!-- 正面描述词 -->
          <div class="front mb20">
            <div class="title mb10 titleBox">
              <div>正面提示词</div>
              <div>
                <el-button
                  type="primary"
                  class="btn"
                  @click="translateBtn('prompt')"
                  >翻译</el-button
                >
              </div>
            </div>
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
            <div class="title mb10 titleBox">
              <div>负面提示词</div>
              <div>
                <el-button
                  type="primary"
                  class="btn"
                  @click="translateBtn('negative_prompt')"
                  >翻译</el-button
                >
              </div>
            </div>
            <div class="inputBox">
              <el-input
                class="input"
                type="textarea"
                :rows="6"
                v-model="txt2imgData.negative_prompt"
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
            <el-select
              class="select"
              v-model="moxing"
              placeholder="请选择模型"
              @change="sdModelsSelectFun"
            >
              <el-option
                v-for="item in moxingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </BearForm>
          <BearForm label="面部修复" class="mb20">
            <el-switch
              v-model="txt2imgData.restore_faces"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </BearForm>
          <BearForm label="开启高清" class="mb20">
            <el-switch
              v-model="txt2imgData.enable_hr"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </BearForm>
          <BearForm label="高清级别" class="mb20">
            <el-input type="number" v-model="txt2imgData.hr_scale"></el-input>
          </BearForm>
          <BearForm label="关键词相关性" class="mb20">
            <el-input type="number" v-model="txt2imgData.cfg_scale"></el-input>
          </BearForm>
          <BearForm label="采样方法" class="mb20">
            <el-select
              v-model="txt2imgData.sampler_index"
              placeholder="Select"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in samplerIndexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </BearForm>
        </div>
        <!-- 按钮 -->
        <div class="left-btnBox mt30">
          <el-button class="generateBtn" @click="txt2imgFun" type="primary"
            >生成图片</el-button
          >
          <el-button class="interruptBtn" @click="termination" type="primary"
            >中断</el-button
          >
        </div>
      </div>
      <div class="right ml20">
        <!-- 生成主图片 -->
        <div class="right-imgBox mb10">
          <el-image
            class="img"
            :src="img"
            :preview-src-list="imgBox"
            :initial-index="imgIndex"
          >
          </el-image>
          <div class="progressBar">
            <div class="progress" :style="{ width: `${progressNum}%` }"></div>
          </div>
        </div>
        <!-- 图片选择 -->
        <div class="imageSelection mb20">
          <div
            class="imageSelection-imgBox"
            v-for="(item, index) in imgBox"
            :key="index"
            @click="imgBoxFun(index)"
          >
            <el-image class="img" :src="item"> </el-image>
          </div>
        </div>
        <!-- 风格 -->
        <div class="stylePreset mb20">
          <div class="title mb10">风格预设</div>
          <BearCardOptions :option="styleOption"></BearCardOptions>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
  user-select: none;
}
@import "@/assets/css/bearCss.css";
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
      padding-right: 20px;
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
        font-weight: bold;
        flex: 1;
      }
      .generateBtn:hover {
        background: rgba($color: #6366f1, $alpha: 0.8);
      }
      .interruptBtn {
        height: 50px;
        width: 200px;
        background: #d0d1d4;
        font-weight: bold;
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
.titleBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    padding: 10px 10px;
  }
}
</style>
