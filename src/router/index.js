import Vue from "vue";
import Router from "vue-router";
import Main from "../views/Main.vue";
import Home from "../views/Home.vue";
import User from "../views/User.vue";
import Mall from "../views/Mall.vue";
import PageOne from "../views/PageOne.vue";
import PageTwo from "../views/PageTwo.vue";
import Login from "../views/login/index.vue";
import Ai from "../views/Ai.vue";
import Exam from "../views/Exam.vue";

Vue.use(Router);
let router;
export default router = new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
      redirect: "/home",
      children: [
        { path: "/home", name: "home", component: Home }, // 首页
        { path: "/user", name: "user", component: User }, // 用户管理
        { path: "/mall", name: "mall", component: Mall }, // 商品管理
        { path: "/ai", name: "ai", component: Ai }, // 商品管理
        { path: "/exam", name: "exam", component: Exam }, // 商品管理
        { path: "/page1", name: "page1", component: PageOne }, // 页面1
        { path: "/page2", name: "page2", component: PageTwo }, // 页面2
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
  ],
});

// 路由守卫:全局前置导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.name !== "Login") {
    next({ name: "Login" });
  } else if (token && to.name === "Login") {
    next({ name: "home" });
  } else {
    next();
  }
});
