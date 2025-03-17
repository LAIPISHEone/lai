<template>
  <el-container style="height: 100vh;">
    <el-aside class="aside" style="width: auto">
      <CommonAside />
    </el-aside>
    <el-container>
      <el-header class="header" style="height: auto"
        ><CommonHeader
      /></el-header>
      <el-main style="background-color:#F9FAFB ;"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
export default {
  data() {
    return {};
  },
  components: {
    CommonAside,
    CommonHeader,
  },
};
</script>

<style scoped>
.aside {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  padding: 0px;
  border-bottom: 1px solid #e6e6e6;
}
</style>
