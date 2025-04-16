<template>
  <div class="header-container">
    <div class="navbar-container">
      <div class="navbar-left" style="display: flex; justify-items: center">
        <el-button
          v-if="!isCollapse"
          icon="el-icon-s-fold"
          circle
          class="custom-button"
          @click="handleMenu"
        ></el-button>
        <el-button
          v-else
          icon="el-icon-s-unfold"
          circle
          class="custom-button"
          @click="handleMenu"
        ></el-button>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in tags"
            :key="item.path"
            :to="{ path: item.path }"
          >
            {{ item.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
     
      <el-dropdown trigger="click" @command="handleCommand">
        
        <span style="display: flex; align-items: center" class="el-dropdown-link">
          <!-- <span>{{ userName || "lai" }}</span> -->
          <span>{{ "lai" }}</span>
          <img class="user" src="../assets/user.png" alt="图片加载失败" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <img
              class="loginOutImg"
              src="../assets/loginOut.png"
              style="
                width: 20px;
                height: 20px;
                margin-right: 10px;
                vertical-align: middle;
              "
            />退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <div class="tags-container">
      <el-tag
        class="tag-item"
        v-for="(item, index) in tags"
        :key="item.path"
        :closable="item.name !== 'home'"
        :effect="item.name === $route.name ? 'dark' : 'plain'"
        @click="clickItem(item)"
        @close="handleClose(item, index)"
      >
        {{ item.label }}
      </el-tag>
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Header",
  data() {
    return {
      userName: sessionStorage.getItem("userName"),
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
    ...mapState({
      tags: (state) => state.tab.tabList,
    }),
  },
  methods: {
    handleMenu() {
      this.$store.commit("CollapseMenu");
    },
    clickItem(item) {
      // 防止自己跳自己的报错
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path);
      }
    },

    handleClose(item, index) {
      // 删除面包屑数据
      this.$store.commit("closeTag", item);
      // 如果删除的刚好是自己
      if (item.name === this.$route.name) {
        const length = this.tags.length;
        // 如果删除的是最后一个:跳到前一个
        if (length === index) {
          this.$router.push({ name: this.tags[index - 1].name });
        }
        // 不是最后一个:往后一个
        else {
          this.$router.push({ name: this.tags[index].name });
        }
      }
    },
    handleCommand() {
      localStorage.removeItem("token");

      this.$router.push({ path: "/login" });
      this.$message.success("退出登录成功");
    },
  },
};
</script>

<style  scoped>
.header-container {
width: 100%;
}
.navbar-container {
display: flex;
justify-content: space-between;
align-items: center;
padding: 0px;
border-bottom: 1px solid #e6e6e6;
width: 100%;

}
.custom-button {
padding: 0;
border: 0;
margin: 0 20px;
font-size: 16px;
}
.user {
width: 40px;
height: 40px;
margin-right: 20px;
margin: 3px 20px;

border-radius: 50%;
}
.tags-container {
margin: 5px 0px 5px 20px;

}
.tag-item {
margin-right: 10px;
cursor: pointer;
}
</style>
