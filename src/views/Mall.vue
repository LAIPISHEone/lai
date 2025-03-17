<template>
  <div class="mall-container">
    <!-- 常用工具 -->
    <div class="section">
      <h2 class="section-title">常用工具</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(tool, index) in commonTools" :key="index">
          <div class="tool-card" @click="openToolDialog(tool)">
            <div class="tool-icon" :style="{ backgroundColor: tool.bgColor }">
              <i :class="tool.icon"></i>
            </div>
            <div class="tool-name">{{ tool.name }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 全部工具 -->
    <div class="section">
      <h2 class="section-title">全部工具</h2>
      <el-row :gutter="20">
        <el-col :span="4" v-for="(tool, index) in allTools" :key="index">
          <div class="tool-card" @click="openToolDialog(tool)">
            <div class="tool-icon" :style="{ backgroundColor: tool.bgColor }">
              <i :class="tool.icon"></i>
            </div>
            <div class="tool-name">{{ tool.name }}</div>
          </div>
        </el-col>
      </el-row>
    </div>



    <!-- 工具弹窗 -->
    <el-dialog :title="currentTool.name" :visible.sync="dialogVisible" width="30%">
      <div class="tool-dialog-content">
        <p>{{ currentTool.description }}</p>
        <h4>主要功能：</h4>
        <ul>
          <li v-for="(feature, index) in currentTool.features" :key="index">{{ feature }}</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="startUseTool">开始使用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Mall',
  data() {
    return {
      dialogVisible: false,
      currentTool: {},
      commonTools: [
        { name: '思维导图', icon: 'el-icon-share', bgColor: '#FFE8E8' },
        { name: '笔记本', icon: 'el-icon-notebook-2', bgColor: '#E8F4FF' },
        { name: '计算器', icon: 'el-icon-money', bgColor: '#E8FFF3' },
        { name: '翻译器', icon: 'el-icon-chat-dot-square', bgColor: '#FFF3E8' }
      ],
      allTools: [
        { name: '思维导图', icon: 'el-icon-share', bgColor: '#FFE8E8' },
        { name: '笔记本', icon: 'el-icon-notebook-2', bgColor: '#E8F4FF' },
        { name: '计算器', icon: 'el-icon-money', bgColor: '#E8FFF3' },
        { name: '翻译器', icon: 'el-icon-chat-dot-square', bgColor: '#FFF3E8' },
        { name: '词典', icon: 'el-icon-collection', bgColor: '#F4E8FF' },
        { name: '日程表', icon: 'el-icon-date', bgColor: '#E8FFFF' },
        { name: '闹钟', icon: 'el-icon-alarm-clock', bgColor: '#FFF8E8' },
        { name: '待办事项', icon: 'el-icon-document-checked', bgColor: '#E8FFE8' }
      ]
    };
  },
  methods: {
    openToolDialog(tool) {
      this.currentTool = {
        ...tool,
        description: `这是${tool.name}工具的详细描述。`,
        features: ['功能1', '功能2', '功能3']
      };
      this.dialogVisible = true;
    },
    startUseTool() {
      this.$message({
        message: `${this.currentTool.name}功能正在开发中，敬请期待！`,
        type: 'success'
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.mall-container {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.tool-card {
  text-align: center;
  cursor: pointer;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.tool-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
}

.tool-icon i {
  font-size: 30px;
  color: #fff;
}

.tool-name {
  font-size: 14px;
}




.tool-dialog-content ul {
  padding-left: 20px;
}
</style>