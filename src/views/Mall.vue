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

    <!-- 倒计时工具弹窗 -->
    <el-dialog
      :title="currentTool.name"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="tool-dialog-content">
        <p>{{ currentTool.description }}</p>
        <h4>主要功能：</h4>
        <ul>
          <li v-for="(feature, index) in currentTool.features" :key="index">
            {{ feature }}
          </li>
        </ul>
        <div v-if="currentTool.name === '倒计时'">
          <h4>已设置的倒计时：</h4>
          <ul>
            <li v-for="(countdown, index) in countdowns" :key="index">
              {{ countdown.label }} - 剩余时间:
              {{ (countdown.time - Date.now()) | timeRemaining }}
            </li>
          </ul>
        </div>
        <div v-else-if="currentTool.name === '计算器'">
          <calculator></calculator>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="startUseTool">开始使用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Calculator from '@/components/Calculator.vue';

export default {
  name: "Mall",
  components: {
    Calculator
  },
  data() {
    return {
      dialogVisible: false,
      currentTool: {},
      commonTools: [
        { name: "思维导图", icon: "el-icon-share", bgColor: "#FF4D4D" }, // 加深颜色
        { name: "笔记本", icon: "el-icon-notebook-2", bgColor: "#4DA6FF" }, // 加深颜色
        { name: "计算器", icon: "el-icon-money", bgColor: "#4DFF99" }, // 加深颜色
        { name: "翻译器", icon: "el-icon-chat-dot-square", bgColor: "#FF8C00" }, // 加深颜色
        { name: "倒计时", icon: "el-icon-time", bgColor: "#FF8C00" }, // 加深颜色
      ],
      allTools: [
        { name: "思维导图", icon: "el-icon-share", bgColor: "#FF4D4D" }, // 加深颜色
        { name: "笔记本", icon: "el-icon-notebook-2", bgColor: "#4DA6FF" }, // 加深颜色
        { name: "计算器", icon: "el-icon-money", bgColor: "#4DFF99" }, // 加深颜色
        { name: "翻译器", icon: "el-icon-chat-dot-square", bgColor: "#FF8C00" }, // 加深颜色
        { name: "词典", icon: "el-icon-collection", bgColor: "#A64DFF" }, // 加深颜色
        { name: "日程表", icon: "el-icon-date", bgColor: "#4DFFFF" }, // 加深颜色
        { name: "闹钟", icon: "el-icon-alarm-clock", bgColor: "#FF8C00" }, // 加深颜色
        {
          name: "待办事项",
          icon: "el-icon-document-checked",
          bgColor: "#4DFFA6",
        }, // 加深颜色
        { name: "倒计时", icon: "el-icon-time", bgColor: "#FF8C00" }, // 加深颜色
      ],
      countdowns: [], // 用于存储倒计时数据
    };
  },
  methods: {
    openToolDialog(tool) {
      if (tool.name === "倒计时") {
        this.currentTool = {
          ...tool,
          description: "这是一个倒计时工具，允许你添加和查看倒计时。",
          features: ["添加倒计时", "查看已设置的倒计时"],
        };
        this.dialogVisible = true;
      } else {
        this.currentTool = {
          ...tool,
          description: `这是${tool.name}工具的详细描述。`,
          features: ["功能1", "功能2", "功能3"],
        };
        this.dialogVisible = true;
      }
    },
    startUseTool() {
      if (this.currentTool.name === "倒计时") {
        this.$prompt(
          "请输入倒计时时间（格式：YYYY-MM-DD HH:MM:SS）",
          "添加倒计时",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            inputErrorMessage: "时间格式不正确",
          }
        )
          .then(({ value }) => {
            const countdownTime = new Date(value).getTime();
            if (countdownTime <= Date.now()) {
              this.$message.error("倒计时时间必须晚于当前时间");
              return;
            }
            this.countdowns.push({
              time: countdownTime,
              label: value,
            });
            this.$message({
              message: "倒计时已添加",
              type: "success",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        this.$message({
          message: `${this.currentTool.name}功能正在开发中，敬请期待！`,
          type: "success",
        });
        this.dialogVisible = false;
      }
    },
  },
  filters: {
    timeRemaining(value) {
      const seconds = Math.floor((value / 1000) % 60);
      const minutes = Math.floor((value / (1000 * 60)) % 60);
      const hours = Math.floor((value / (1000 * 60 * 60)) % 24);
      const days = Math.floor(value / (1000 * 60 * 60 * 24));
      return `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    },
  },
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
