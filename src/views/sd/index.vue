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

  lobeConfig
} from "@/api/sd/index";
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
  await lobeConfig()
};
getLorasFun();
//刷新模型
const refreshLorasFun = async ()=>{
  await refreshLoras()
}
//终止
const termination = async () => {
  await interrupt();
};
</script>
<template>
  <div class="appClass">
    <button @click="txt2imgFun">开始生图</button>
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
    <span style="font-size: 40px; color: #000"> {{ progressNum }} %</span>
  </div>
</template>
<style scoped>
.appClass {
  width: 100vw;
  height: 100vh;
}
</style>
