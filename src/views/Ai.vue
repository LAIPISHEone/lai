<template>
  <div class="mall-container">
    <div class="mall-container">
      <!-- 现有内容保持不变 -->

      <!-- AI对话历史区域 -->
      <div class="ai-chat-section">
        <h2 class="section-title">AI学习助手</h2>
        
        <div class="chat-history" ref="chatHistory">
          <div
          
              style="display: flex; margin-left: 10px;"
            >
              <img src="../assets/ai_logo.png" class="ai-logo" />
              <div class="message-content-ai" >可以向我提问，例如：“如何提高学习效率？”</div>
            </div>
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.type]"
          >
            <div
              v-if="message.type === 'ai'"
              style="display: flex; "
            >
              <img src="../assets/ai_logo.png" class="ai-logo" />
              <div class="message-content-ai" v-html="message.content"></div>
            </div>

            <div v-else style="display: flex;">
              <div class="message-content-user">{{ message.content }}</div>
              <img src="../assets/user.png" class="user-logo" />
            </div>
          </div>
          <div
            v-if="isAiLoading"
            style="display: flex;  margin-left: 10px"
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
import { deepseekApi } from "../api/ai/index";
import marked from 'marked'
export default {
  name: "Mall",
  data() {
    return {
      // 现有的data保持不变
      userInput: "",
      chatHistory:  JSON.parse( localStorage.getItem("chatHistory")) || [],
      // 模拟API请求的延迟
      isWaitingForResponse: false,
      isAiLoading: false,
    };
  },
  methods: {
    async sendMessage() {
    if (!this.userInput) {
      this.$message.error("请输入您的问题");
      return;
    }
    this.$nextTick(() => {
      this.scrollToBottom();
    });
    this.isAiLoading = true;

    if (!this.userInput.trim() || this.isWaitingForResponse) return;

    // 添加用户消息到对话历史
    this.chatHistory.push({ type: "user", content: this.userInput });
    localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
    const userQuestion = this.userInput;

    deepseekApi({ query: this.userInput }).then((response) => {
      console.log("##", response);
      this.isAiLoading = false;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      if (response.status === 200) {
        // 处理富文本内容
        const content = this.processResponseData(response.data);
        this.chatHistory.push({ type: "ai", content });
        localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
      } else {
        this.chatHistory.push({ type: "ai", content: "系统繁忙，请稍后再试。" });
        localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
      }
      this.isWaitingForResponse = false;
    }).catch((error) => {
     message.error("网络请求失败，请稍后再试。");
     this.isAiLoading = false;
})

    this.userInput = "";
    this.isWaitingForResponse = true;
  },
  processResponseData(data) {
    // 这里可以对 data 进行处理，确保它适合在 HTML 中显示
    // 例如，替换换行符为 <br>
    return  marked(data);
  },
  scrollToBottom() {
    const chatHistory = this.$refs.chatHistory;
    chatHistory.scrollTop = chatHistory.scrollHeight;
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
