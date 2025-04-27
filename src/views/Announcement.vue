<template>
  <div>
    <h1>系统公告管理</h1>
    <el-form :inline="true" :model="announcementForm">
      <el-form-item label="公告状态">
        <el-switch
          v-model="announcementForm.status"
          active-text="开启"
          inactive-text="关闭"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateAnnouncement">保存</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="announcementForm">
      <el-form-item label="公告内容">
        <el-input
          type="textarea"
          v-model="announcementForm.content"
          :rows="10"
          placeholder="请输入公告内容"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getNotices, updateNotices } from "@/api/announ/index.js";
export default {
  data() {
    return {
      announcementForm: {
        status: true,
        content: "",
      },
    };
  },
  created() {
    this.fetchAnnouncement();
  },
  methods: {
    fetchAnnouncement() {
      getNotices().then((res) => {
        if (res.data.code == 200) {
          this.announcementForm.status = res.data.data[0] ? true : false;
          this.announcementForm.content = res.data.data[0].notice;
        }
      });
    },
    updateAnnouncement() {
      const response = {
        id: 1,
        notice_state: this.announcementForm.status ? 1 : 0,
        notice: this.announcementForm.content,
      };

      updateNotices(response).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "更新成功！",
          });
        } else {
          this.$message.error("更新失败");
        }
      });
      // 这里需要调用后端接口更新公告信息
      console.log("Updating announcement:", this.announcementForm);
      // 假设后端接口返回的数据格式为 { status: true, content: '公告内容' }
    },
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>