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

//获取登录用户信息
export const getUserData = () => {
  return http({
    url: "/user/me",
    method: "get",
  });
};

//获取用户列表
export const getUserList = (data) => {
  return http({
    url: "/user/list",
    method: "get",
    params: data,
  });
};

//设置管理员权限
export const setAdmin = (data) => {
  return http({
    url: "/user/setAdmin",
    method: "post",
    params: data,
  });
};

//新增用户
export const addUser = (data) => {
  return http({
    url: "/user/add",
    method: "post",
    data,
  });
};

//修改用户
export const updateUser = (data) => {
  return http({
    url: "/user/update",
    method: "post",
    data,
  });
};

//删除用户
export const deleteUser = (id) => {
  return http({
    url: `/user/${id}`,
    method: "delete",
  });
};

//修改用户密码
export const setUserPassWord = (data) => {
  return http({
    url: `/user/updatePassword`,
    method: "post",
    params: data,
  });
};

//修改用户状态
export const updateUserStatus = (data) => {
  return http({
    url: `/user/updateStatus`,
    method: "post",
    params: data,
  });
};
