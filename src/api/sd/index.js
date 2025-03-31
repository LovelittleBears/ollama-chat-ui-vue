import service from "@/utils/axios/sd/request";
import fetchService from "@/utils/fetch/index";
//文字生成图片
export const txt2img = async (data) => {
  return await service({
    url: "/sdapi/v1/txt2img",
    method: "post",
    data,
  });
};
//进度条
export const progress = async (data) => {
  return await service({
    url: "/sdapi/v1/progress",
    method: "get",
    data,
  });
};
//中断生图
export const interrupt = async (data) => {
  return await service({
    url: "/sdapi/v1/interrupt",
    method: "post",
    data,
  });
};
//轮询
export const interrogate = async (data) => {
  return await service({
    url: "/sdapi/v1/interrogate",
    method: "post",
    data,
  });
};
//当前电脑配置详情
export const sysinfoDownload = async (data) => {
  return await service({
    url: "/internal/sysinfo-download",
    method: "get",
    data,
  });
};
//获得小模型
export const getLoras = async (data) => {
  return await service({
    url: "/sdapi/v1/loras",
    method: "get",
    data,
  });
};
//刷新小模型
export const refreshLoras = async (data) => {
  return await service({
    url: "/sdapi/v1/refresh-loras",
    method: "get",
    data,
  });
};
//cs
export const lobeConfig = async (data) => {
  return await service({
    url: "/lobe/config",
    method: "get",
    data,
  });
};
//获得大模型
export const sdModels = async (data) => {
  return await service({
    url: "/sdapi/v1/sd-models",
    method: "get",
    data,
  });
};
//刷新大模型
export const refreshSdModels = async (data) => {
  return await service({
    url: "/sdapi/v1/refresh-checkpoints",
    method: "post",
    data,
  });
};
//获得配置
export const sdOptions = async (data) => {
  return await service({
    url: "/sdapi/v1/options",
    method: "get",
    data,
  });
};

// 获得 大模型 Vaes
// export const sdVae = async (data) => {
//   return await service({
//     url: "/sdapi/v1/sd-vae",
//     method: "get",
//     data,
//   });
// }

//文字生成图片 fetch
// export const txt2imgFetch = (data) => {
//   fetchService('/sdapi/v1/txt2img',{
//     method: "post",
//     responseType: 'stream',
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body:JSON.stringify({data}),
//   });
// }
