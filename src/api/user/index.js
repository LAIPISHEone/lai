import http from "../../utils/request.js";

export const loginApi = (data) => {
  return http({
    url: "/user/login",
    method: "post",
    data,
  });
};

export const logoutApi = () => {
  return http({
    url: "/user/info",
    method: "post",
  });
};

export const registerApi = (data) => {
  return http({
    url: "/user/register",
    method: "post",
    data,
  });
};

export const getUserData = () => {
  return http({
    url: "/user/me",
    method: "get",
  });
};
