import http from "../../utils/request.js";

//获取课程信息
export const getExamList = (data) => {
  return http({
    url: "/exams/list",
    method: "get",
    params: data,
  });
};

//新增课程
export const addCourses = (data) => {
  return http({
    url: "/courses/add",
    method: "post",
    data: data,
  });
};

//修改课程
export const updateCourses = (data) => {
  return http({
    url: "/courses/update",
    method: "post",
    data: data,
  });
};

//删除课程
export const deleteCourses = (id) => {
  return http({
    url: `/courses/${id}`,
    method: "DELETE",
  });
};
