import Mock from "mockjs";
import JSON from "json5";

// // 定义mock拦截
// Mock.mock("/api/user/info", function (options) {
//   console.log(JSON.parse(options.body));
//   if (
//     JSON.parse(options.body).passWord == "123456" &&
//     JSON.parse(options.body).userName == "admin"
//   ) {
//     return Mock.mock({
//       code: 0,
//       data: {
//         name: "张三",
//         age: 18,
//         token: "1234567890",
//       },
//       message: "登录成功",
//     });
//   } else {
//     return Mock.mock({
//       code: 400,
//       data: {},
//       message: "用户名或密码错误",
//     });
//   }
//   // mock的逻辑
// });

// Mock.mock("/api/user/login", function (options) {
// });

// export const loginApi = (data) => {
//   return http({
//     url: "/user/login",
//     method: "post",
//     data,
//   });
// };
