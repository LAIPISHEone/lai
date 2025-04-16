<template>
    <div class="drawing-board">
      <div class="toolbar">
        <div style="display:flex;align-items: center;">
       
  
        <!-- 颜色选择器 -->
        <el-color-picker v-model="strokeColor" size="mini"></el-color-picker>
         <!-- 工具栏 -->
         <el-button-group>
          <el-button style="margin-left: 10px;" @click="clearCanvas">清除</el-button>
          <!-- <el-button @click="undo">撤销</el-button>
          <el-button @click="redo">重做</el-button> -->
        </el-button-group>
    </div>
        <!-- 线条宽度选择器 -->
        <el-slider v-model="lineWidth" :min="1" :max="10" size="mini"></el-slider>
      </div>
  
      <!-- 画布 -->
      <canvas  ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseout="stopDrawing"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        strokeColor: '#000', // 默认笔刷颜色
        lineWidth: 5, // 默认线条宽度
        isDrawing: false, // 是否正在绘制
        history: [], // 操作历史记录
        currentStep: -1, // 当前步骤索引
      };
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
    },
    methods: {
      resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
      },
      startDrawing(event) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(event.offsetX, event.offsetY);
      },
      draw(event) {
        if (!this.isDrawing) return;
  
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.stroke();
  
        // 记录操作历史
        const action = {
          type: 'draw',
          x: event.offsetX,
          y: event.offsetY,
          color: this.strokeColor,
          width: this.lineWidth
        };
        this.history.push(action);
        this.currentStep++;
      },
      stopDrawing() {
        this.isDrawing = false;
        this.ctx.closePath();
      },
      clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.history = [];
        this.currentStep = -1;
      },
      undo() {
        if (this.currentStep >= 0) {
          this.history.pop();
          this.currentStep--;
          this.redraw();
        }
      },
      redo() {
        if (this.currentStep < this.history.length - 1) {
          this.currentStep++;
          this.redraw();
        }
      },
      redraw() {
        this.clearCanvas();
        for (let i = 0; i <= this.currentStep; i++) {
          const action = this.history[i];
          if (action.type === 'draw') {
            this.ctx.beginPath();
            this.ctx.moveTo(action.x, action.y);
            this.ctx.lineTo(action.x + 1, action.y + 1); // 这里需要根据实际需求调整
            this.ctx.strokeStyle = action.color;
            this.ctx.lineWidth = action.width;
            this.ctx.stroke();
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .drawing-board {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .toolbar {
    /* margin-bottom: 20px; */
  }
  
  canvas {
    border: 1px solid #ccc;
  }
  </style>