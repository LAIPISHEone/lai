import http from "../../utils/request.js";

//获取考试信息
export const getExamList = (data) => {
  return http({
    url: "/exams/list",
    method: "get",
    params: data,
  });
};

//新增考试信息

export const addExam = (data) => {
  return http({
    url: "/exams/add",
    method: "post",
    data: data,
  });
};

//修改考试信息

export const updateExam = (data) => {
  return http({
    url: "/exams/update",
    method: "POST",
    data: data,
  });
};

//删除考试信息
export const deleteExam = (id) => {
  return http({
    url: `/exams/${id}`, // 确保URL格式正确，使用模板字符串动态插入ID
    method: "DELETE", // 修正方法名为DELETE
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
export const deleteCourses = (data) => {
  return http({
    url: "/courses/{id}",
    method: "delete",
    data: data,
  });
};
