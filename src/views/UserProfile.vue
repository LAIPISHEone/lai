<template>
  <div class="user-profile">
    <!-- 用户信息头部 -->
    <el-row :gutter="20" class="header">
      <el-col :span="6">
        <el-avatar :size="80" src="https://placehold.co/80x80?text=Avatar"></el-avatar>
      </el-col>
      <el-col :span="12">
        <h2>{{ userName }}</h2>
        <p>产品设计师 @ 科技公司</p>
        <p><i class="el-icon-location-outline"></i> 上海市 &nbsp; <i class="el-icon-message"></i> chen.sy@example.com</p>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="editProfile">编辑个人资料</el-button>
      </el-col>
    </el-row>

    <!-- 基本信息 -->
    <el-row :gutter="20" class="content">
      <el-col :span="16">
        <el-card>
          <div slot="header"><strong>基本信息</strong></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <p><strong>真实姓名</strong></p>
              <p>林子晨</p>
            </el-col>
            <el-col :span="12">
              <p><strong>性别</strong></p>
              <p>男</p>
            </el-col>
            <el-col :span="12">
              <p><strong>生日</strong></p>
              <p>2002 年 5 月 20 日</p>
            </el-col>
            <el-col :span="12">
              <p><strong>手机号码</strong></p>
              <p>156 **** 3456</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 学习信息 -->
      <el-col :span="8">
        <el-card>
          <div slot="header"><strong>学习信息</strong></div>
          <p><strong>就读学校</strong></p>
          <p>复旦大学</p>
          <p><strong>专业</strong></p>
          <p>计算机科学与技术</p>
          <p><strong>年级</strong></p>
          <p>大三</p>
          <p><strong>学生身份</strong></p>
          <p>本科生</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 账号设置和通知设置 -->
    <el-row :gutter="20" class="settings">
      <el-col :span="8">
        <el-card>
          <div slot="header"><strong>账号设置</strong></div>
          <el-row>
            <el-col>
              <p>账号安全</p>
              <el-button type="text" icon="el-icon-arrow-right"></el-button>
            </el-col>
            <el-col>
              <p>隐私设置</p>
              <el-button type="text" icon="el-icon-arrow-right"></el-button>
            </el-col>
            <el-col>
              <p>学生认证</p>
              <el-button type="text" icon="el-icon-arrow-right"></el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header"><strong>通知设置</strong></div>
          <el-row>
            <el-col>
              <p>系统通知</p>
              <el-switch v-model="systemNotification"></el-switch>
            </el-col>
            <el-col>
              <p>课程提醒</p>
              <el-switch v-model="courseReminder"></el-switch>
            </el-col>
            <el-col>
              <p>活动通知</p>
              <el-switch v-model="activityNotification"></el-switch>
            </el-col>
            <el-col>
              <p>邮件通知</p>
              <el-switch v-model="emailNotification"></el-switch>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑个人资料弹窗 -->
    <el-dialog title="编辑个人资料" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemNotification: true,
      courseReminder: true,
      activityNotification: true,
      emailNotification: false,
      dialogVisible: false,
      form: {
        nickname: '陈思远',
        name: '林子晨'
      },
      userName: '陈思远'
    };
  },
  methods: {
    editProfile() {
      this.dialogVisible = true;
    },
    handleEdit() {
      this.userName = this.form.name;
      this.dialogVisible = false;
      // 这里可以添加保存到服务器的逻辑
      console.log('保存修改后的昵称和姓名:', this.form);
    }
  }
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.content {
  margin-bottom: 20px;
}

.settings {
  margin-bottom: 20px;
}
</style>