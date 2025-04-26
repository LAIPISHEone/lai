import http from "../../utils/request.js";

export const deepseekApi = (data) => {
  const formData = new FormData(); // 创建 FormData 对象
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]); // 将数据添加到 FormData 对象中
    }
  }

  return http({
    url: "/deepseek/send",
    method: "post",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data' // 让 axios 自动设置正确的 boundary
    },
    timeout: 120000, // 设置超时时间（例如：120秒）
  });
};