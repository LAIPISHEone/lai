<template>
  <div>
    <el-menu
      :default-active="$route.name"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#304156"
      text-color="#BFCBD9"
      active-text-color="#79BBFF"
      :collapse="isCollapse"
    >
      <transition name="slide-left">
        <h3 v-if="!isCollapse" key="full">辅助学习系统管理后台</h3>
        <h3 v-else key="collapsed">后台</h3>
      </transition>
      <el-menu-item
        @click="clickItem(item)"
        v-for="item in noChildren"
        :key="item.name"
        :index="item.name"
      >
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
      <el-submenu
        v-for="item in hasChildren"
        :key="item.name"
        :index="item.name"
      >
        <template slot="title">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.label }}</span>
        </template>
        <el-menu-item-group
          v-for="subItem in item.children"
          :key="subItem.name"
        >
          <el-menu-item @click="clickItem(subItem)" :index="subItem.name">{{
            subItem.label
          }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import MenuData from "../data/MenuData";
export default {
  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
    noChildren() {
      // 如果没有children则返回true,会被过滤器留下
      return MenuData.filter((item) => !item.children);
    },
    hasChildren() {
      return MenuData.filter((item) => item.children);
    },
  },
  data() {
    return {};
  },
  methods: {
    clickItem(item) {
      // 防止自己跳自己的报错
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path);
      }
      // 设置面包屑
      this.$store.commit("SelectMenu", item);
    },
  },
};
</script>
<style scoped>
.el-menu {
  height: 100vh;

  h3 {
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
    background-color: #2d3748;
    margin: 0px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

/* 文本从左边进入的动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px); /* 从左边偏移 */
}

.slide-left-enter-to,
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0); /* 恢复到原位 */
}
</style>
