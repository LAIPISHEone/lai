<template>
  <div>
    <h1>系统公告管理</h1>
    <el-form :inline="true" :model="announcementForm">
      <el-form-item label="公告状态">
        <el-switch v-model="announcementForm.status" active-text="开启" inactive-text="关闭"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateAnnouncement">保存</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="announcementForm">
      <el-form-item label="公告内容">
        <el-input type="textarea" v-model="announcementForm.content" :rows="10" placeholder="请输入公告内容"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      announcementForm: {
        status: true,
        content: ''
      }
    };
  },
  created() {
    this.fetchAnnouncement();
  },
  methods: {
    fetchAnnouncement() {
      // 这里需要调用后端接口获取公告信息
      console.log('Fetching announcement');
      // 假设后端接口返回的数据格式为 { status: true, content: '公告内容' }
      const response = {
        status: true,
        content: 'AI助手已上线，快去试试吧！'
      };
      this.announcementForm.status = response.status;
      this.announcementForm.content = response.content;
    },
    updateAnnouncement() {
      // 这里需要调用后端接口更新公告信息
      console.log('Updating announcement:', this.announcementForm);
      // 假设后端接口返回的数据格式为 { status: true, content: '公告内容' }
      const response = {
        status: this.announcementForm.status,
        content: this.announcementForm.content
      };
      this.announcementForm.status = response.status;
      this.announcementForm.content = response.content;
      this.$message.success('公告更新成功');
      // 实时更新到用户端的逻辑需要根据具体情况进行实现
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
</style>