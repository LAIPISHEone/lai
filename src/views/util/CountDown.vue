<template>
  <div class="countdown-container">
    <!-- 倒计时显示区域 -->
    <div class="countdown-display" :style="{ color: isCounting ? 'red' : 'black' }">
      {{ formattedTime }}
    </div>

    <!-- 操作按钮 -->
    <div class="controls">
      <el-button type="primary" @click="startCountdown" :disabled="isCounting || isPaused">开始</el-button>
      <!-- <el-button type="primary" @click="pauseCountdown" :disabled="!isCounting || isPaused">暂停</el-button> -->
      <el-button type="primary" @click="pauseCountdown" :disabled="!isCounting">暂停</el-button>
    </div>

    <!-- 时间设置区域 -->
    <div class="settings">
      <h3>设置</h3>
      <el-form label-width="80px">
        <!-- 秒输入框 -->
        <el-form-item label="秒">
          <el-input @input="quickSelect = ''" v-model.number="seconds" placeholder="请输入秒数"></el-input>
        </el-form-item>

        <!-- 分输入框 -->
        <el-form-item label="分">
          <el-input @input="quickSelect = ''" v-model.number="minutes" placeholder="请输入分钟数"></el-input>
        </el-form-item>

        <!-- 时输入框 -->
        <el-form-item label="时">
          <el-input @input="quickSelect = ''" v-model.number="hours" placeholder="请输入小时数"></el-input>
        </el-form-item>

        <!-- 快捷选项 -->
        <el-form-item label="快捷选项">
          <el-radio-group v-model="quickSelect">
            <el-radio label="180">3 分钟</el-radio>
            <el-radio label="300">5 分钟</el-radio>
            <el-radio label="600">10 分钟</el-radio>
            <el-radio label="1800">30 分钟</el-radio>
            <el-radio label="3600">1 小时</el-radio>
            <el-radio label="7200">2 小时</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 应用设置按钮 -->
      <el-button type="primary" @click="applySettings">应用设置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalSeconds: 0, // 初始倒计时时间为 30 秒
      isCounting: false, // 是否正在倒计时
      isPaused: false, // 是否暂停倒计时
      intervalId: null, // 定时器 ID
      seconds: 0, // 用户输入的秒数
      minutes: 0, // 用户输入的分钟数
      hours: 0, // 用户输入的小时数
      quickSelect: "30", // 快捷选项，默认为 30 秒
      time: '', // 最终计算的总秒数

    };
  },
  computed: {
    // 格式化倒计时时间
    formattedTime() {
      const time = this.totalSeconds;
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      const s = time % 60;
      return `${this.padZero(h)}:${this.padZero(m)}:${this.padZero(s)}`;
    },
  },

  methods: {
    // 开始倒计时
    startCountdown() {
      if (this.isCounting || this.isPaused) return;
      if (this.totalSeconds <= 0){
        this.$message.error('请先设置倒计时时间！');
        return;
      } 

      this.isCounting = true;
      this.isPaused = false;
      this.intervalId = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
        } else {
          this.stopCountdown();
        }
      }, 1000);
    },

    // 暂停倒计时
    // pauseCountdown() {
    //   if (!this.isCounting || this.isPaused) return;

    //   this.isPaused = true;
    //   clearInterval(this.intervalId);
    // },

    // 停止倒计时
    stopCountdown() {
      clearInterval(this.intervalId);
      this.isCounting = false;
      this.isPaused = false;
      this.$notify({
          title: '提示',
          message: `${this.time} 的倒计时结束啦!`,
          duration: 0
        });
    },
    //暂停倒计时
    pauseCountdown() {
      clearInterval(this.intervalId);
      this.isCounting = false;
      this.isPaused = false;

    },

    // 应用用户设置的时间
    applySettings() {
      let total = 0;

      // 计算总秒数
      total += this.seconds || 0;
      total += (this.minutes || 0) * 60;
      total += (this.hours || 0) * 3600;

      // 如果选择了快捷选项，则覆盖用户输入
      if (this.quickSelect) {
        total = parseInt(this.quickSelect, 10);
      }

      this.totalSeconds = total;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      this.time = `${this.padZero(h)}:${this.padZero(m)}:${this.padZero(s)}`;
    },

    // 补零函数，用于格式化时间
    padZero(num) {
      return num.toString().padStart(2, "0");
    },
  },
};
</script>

<style scoped>
.countdown-container {
  text-align: center;
}

.countdown-display {
  font-size: 2rem;
  margin: 20px 0;
}

.controls {
  margin: 20px 0;
}

.settings {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>