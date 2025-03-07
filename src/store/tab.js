export default {
  state: {
    isCollapse: JSON.parse(localStorage.getItem("isCollapse")) || false, //导航栏是否折叠
    tabList: JSON.parse(localStorage.getItem("tabList")) || [
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "s-home",
        url: "Home/Home",
      },
    ],
  },
  mutations: {
    // 修改导航栏展开和收起的方法
    CollapseMenu(state) {
      state.isCollapse = !state.isCollapse;
      localStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
    },
    // 更新面包屑的数据
    SelectMenu(state, item) {
      const index = state.tabList.findIndex((val) => val.name === item.name);
      if (index === -1) {
        state.tabList.push(item);
      }
      localStorage.setItem("tabList", JSON.stringify(state.tabList));
    },
    // 删除tag:删除tabList中对应的item
    closeTag(state, item) {
      const index = state.tabList.findIndex((val) => val.name === item.name);
      state.tabList.splice(index, 1);
      localStorage.setItem("tabList", JSON.stringify(state.tabList));
    },
  },
};
