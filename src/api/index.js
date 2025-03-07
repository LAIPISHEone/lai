import http from "../utils/request.js";

export const getUserInfo = (data) => {
  return http({
    url: "/user/info",
    method: "get",
    data,
  });
};
