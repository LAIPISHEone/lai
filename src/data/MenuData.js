const MenuData = [
  {
    path: "/",
    name: "home",
    label: "课程管理",
    icon: "s-home",
    url: "Home/Home",
  },
  {
    path: "/mall",
    name: "mall",
    label: "学习工具",
    icon: "menu",
    url: "MallManage/MallManage",
  },
  {
    path: "/ai",
    name: "ai",
    label: "AI学习助手",
    icon: "chat-dot-round",
    url: "MallManage/MallManage",
  },
  {
    path: "/exam",
    name: "exam",
    label: "考试信息",
    icon: "date",
    url: "ExamManage/ExamManage",
  },
  {
    path: "/user",
    name: "user",
    label: "日程管理",
    icon: "setting",
    url: "UserManage/UserManage",
  },
  {
    label: "其他",
    icon: "location",
    children: [
      {
        path: "/page1",
        name: "page1",
        label: "个人信息",
        icon: "user",
        url: "Other/PageOne",
      },
      // {
      //   path: "/page2",
      //   name: "page2",
      //   label: "页面2",
      //   icon: "setting",
      //   url: "Other/PageTwo",
      // },
    ],
  },
];

export default MenuData;
