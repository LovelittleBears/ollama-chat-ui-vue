
const fetchService = async (url, options) => {
    const response = await fetch("/mySdApi" + url, options);
    console.log("response.ok", response.ok);
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    // 用来获取一个可读的流的读取器（Reader）以流的方式处理响应体数据
    const reader = response.body.getReader();
    const docoder = new TextDecoder();
    const {done,value} =  await reader.read();
    console.log(done,value)
    const txt =  docoder.decode(value);
    console.log(txt)
};
export default fetchService;
// try {
//   // 发送请求
//   let response = await fetch("", {
//     method: "post",
//     responseType: "stream",
//     headers: {
//       Authorization: "Bearer " + "token",
//       "Content-Type": "application/json",
//     },
//     body: {},
//   });
//   // ok字段判断是否成功获取到数据流
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   // 用来获取一个可读的流的读取器（Reader）以流的方式处理响应体数据
//   const reader = response.body.getReader();
//   // 将流中的字节数据解码为文本字符串
//   const textDecoder = new TextDecoder();
//   let result = true;
//   let sqlValue = "";
//   while (result) {
//     // done表示流是否已经完成读取  value包含读取到的数据块
//     const { done, value } = await reader.read();
//     if (done) {
//       result = false;
//       break;
//     }
//     // 拿到的value就是后端分段返回的数据，大多是以data:开头的字符串
//     // 需要通过decode方法处理数据块，例如转换为文本或进行其他操作
//     const chunkText = textDecoder
//       .decode(value)
//       .split("\n")
//       .forEach((val) => {
//         if (!val) return;
//         try {
//           // 后端返回的流式数据一般都是以data:开头的字符，排除掉data:后就是需要的数据
//           // 具体返回结构可以跟后端约定
//           let text = val?.replace("data:", "") || "";
//           console.log(val, text, "输出分段返回的数据");
//           sqlValue += text;
//         } catch (err) {}
//       });
//   }
//   console.log(sqlValue, "输出所有返回数据");
// } catch (err) {}
