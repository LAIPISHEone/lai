import http from "../../utils/request.js";

//获取公告信息
export const getNotices = () => {
  return http({
    url: "/notices/list",
    method: "get",
  });
};

//修改公告信息

export const updateNotices = (data) => {
  return http({
    url: "/notices/update",
    method: "POST",
    data: data,
  });
};
