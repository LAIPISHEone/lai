<template>
  <div class="mall-container">
    <div class="mall-container">
      <!-- 现有内容保持不变 -->

      <!-- AI对话历史区域 -->
      <div class="ai-chat-section">
        <h2 class="section-title">AI学习助手</h2>
        <div class="chat-history" ref="chatHistory">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.type]"
          >
            <div
              v-if="message.type === 'ai'"
              style="display: flex; align-items: center"
            >
              <img src="../assets/ai_logo.png" class="ai-logo" />
              <div class="message-content-ai">{{ message.content }}</div>
            </div>

            <div v-else style="display: flex; align-items: center">
              <div class="message-content-user">{{ message.content }}</div>
              <img src="../assets/user.png" class="user-logo" />
            </div>
          </div>
          <div
            v-if="isAiLoading"
            style="display: flex; align-items: center; margin-left: 10px"
          >
            <img src="../assets/ai_logo.png" class="ai-logo" />
            <div class="message-content-ai"><span>加载中，请稍后...</span></div>
          </div>
        </div>
      </div>

      <!-- AI问答输入框 -->
      <div class="ai-input-section">
        <el-input
          v-model="userInput"
          type="textarea"
          autosize
          maxlength="3000"
          show-word-limit
          placeholder="请输入您的问题..."
          @keyup.enter.native="sendMessage"
        >
        </el-input>
        <el-button
          style="height: 34px"
          slot="append"
          icon="el-icon-s-promotion"
          @click="sendMessage"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mall",
  data() {
    return {
      // 现有的data保持不变
      userInput: "",
      chatHistory: [
        { type: "ai", content: "可以向我提问，例如：“如何提高学习效率？”" },
      ],
      // 模拟API请求的延迟
      isWaitingForResponse: false,
      isAiLoading: false,
    };
  },
  methods: {
    async sendMessage() {
      if(!this.userInput) {
        this.$message.error("请输入您的问题");
        return;
      }


      this.isAiLoading = true;

      if (!this.userInput.trim() || this.isWaitingForResponse) return;

      // 添加用户消息到对话历史
      this.chatHistory.push({ type: "user", content: this.userInput });
      const userQuestion = this.userInput;
      this.userInput = "";
      this.isWaitingForResponse = true;

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        // 这里应该是实际的API调用，现在用setTimeout模拟
        setTimeout(() => {
          // 模拟AI响应
          // const aiResponse = `这是对 "${userQuestion}" 的AI回答。实际实现时，这里应该是从后端API获取的响应。`;
          const aiResponse = "Vue.js 是一个用于构建用户界面的渐进式 JavaScript 框架，由尤雨溪于 2014 年创建。它以简洁、灵活和高效著称，采用响应式数据绑定和虚拟 DOM 技术，使得数据变化时视图能够自动更新，同时通过组件化开发模式，将应用拆分为可复用的组件，提升代码的可维护性。Vue.js 提供了丰富的指令系统（如 `v-if`、`v-for` 等），支持单文件组件，将模板、逻辑和样式封装在一起，便于开发。其生态系统包括 Vue Router、Vuex 等官方工具，社区插件丰富，适用于从简单页面到复杂单页应用的开发。Vue.js 学习曲线平缓，API 设计直观，文档详尽，深受开发者喜爱，是一个既能快速上手又能满足复杂需求的前端框架。";
    
          this.chatHistory.push({ type: "ai", content: aiResponse });
          this.isWaitingForResponse = false;

          // 再次滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom();
          });
          this.isAiLoading = false;
        }, 1000); // 模拟1秒的延迟
      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.isWaitingForResponse = false;
      }
    },
    scrollToBottom() {
      const chatHistory = this.$refs.chatHistory;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    },
  },
};
</script>

<style scoped>
.ai-chat-section {
  /* margin-top: 40px; */
  /* height: 600px; */
  height: 72vh;
  overflow-y: auto;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 20px;
}

.chat-history {
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
}

.user {
  align-self: flex-end;
}

.ai {
  align-self: flex-start;
}
.message-content-ai {
  border-radius: 10px;
  padding: 10px;
  margin-left: 10px;
  background-color: #f0f0f0;
}

.message-content-user {
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  background-color: #09b1ff;
}

.ai-input-section {
  /* position: fixed; */
  bottom: 20px;
  left: 20px;
  right: 20px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
}

.el-input {
  width: 100%;
}

.ai-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.user-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
