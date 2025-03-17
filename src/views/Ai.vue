<template>
  <div class="mall-container">
  
  <div class="mall-container">
    <!-- 现有内容保持不变 -->
    
    <!-- AI对话历史区域 -->
    <div class="ai-chat-section">
      <h2 class="section-title">AI学习助手</h2>
      <div class="chat-history" ref="chatHistory">
        <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.type]">
          <div v-if="message.type === 'ai'" style="display: flex;align-items: center;" >
            <img src="../assets/ai_logo.png" class="ai-logo">
           <div class="message-content-ai">{{ message.content }}</div> 
          </div>
          <div  v-else style="display: flex;align-items: center;" >
           
            <div class="message-content-user" >{{ message.content }}</div>
            <img src="../assets/user.png" class="user-logo">
          </div>
        </div>
      </div>
    </div>

    <!-- AI问答输入框 -->
    <div class="ai-input-section">
      <el-input
        v-model="userInput"
        placeholder="请输入您的问题..."
        @keyup.enter.native="sendMessage"
      >
        <el-button slot="append" icon="el-icon-s-promotion" @click="sendMessage">发送</el-button>
      </el-input>
    </div>

  </div>
  </div>
</template>

<script>
export default {
  name: 'Mall',
  data() {
    return {
           // 现有的data保持不变
           userInput: '',
        chatHistory: [{ type: 'ai', content: "可以向我提问，例如：“如何提高学习效率？”" }],
        // 模拟API请求的延迟
        isWaitingForResponse: false,

    
    };
  },
  methods: {


    async sendMessage() {
        if (!this.userInput.trim() || this.isWaitingForResponse) return;
  
        // 添加用户消息到对话历史
        this.chatHistory.push({ type: 'user', content: this.userInput });
        const userQuestion = this.userInput;
        this.userInput = '';
        this.isWaitingForResponse = true;
  
        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
  
        try {
          // 这里应该是实际的API调用，现在用setTimeout模拟
          setTimeout(() => {
            // 模拟AI响应
            const aiResponse = `这是对 "${userQuestion}" 的AI回答。实际实现时，这里应该是从后端API获取的响应。`;
            this.chatHistory.push({ type: 'ai', content: aiResponse });
            this.isWaitingForResponse = false;
  
            // 再次滚动到底部
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }, 1000); // 模拟1秒的延迟
        } catch (error) {
          console.error('Error fetching AI response:', error);
          this.isWaitingForResponse = false;
        }
      },
      scrollToBottom() {
        const chatHistory = this.$refs.chatHistory;
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    

  }
};
</script>

<style scoped>

.ai-chat-section {
    margin-top: 40px;
    height: 400px;
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
  .message-content-ai{
    border-radius: 10px;
    padding: 10px;
    margin-left: 10px;
    background-color: #f0f0f0;
  }

  .message-content-user{
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




  

  
