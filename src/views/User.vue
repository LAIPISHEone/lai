<template>
  <div class="user-page">
    <!-- 日历 -->
    <el-calendar v-model="value">
      <template slot="dateCell" slot-scope="{ date, data }">
        <p :class="data.isSelected ? 'is-selected' : ''" @click="handleDateClick(data.day)">
          {{ data.day.split('-').slice(1).join('-') }}
          <span v-if="data.type === 'prev-month'" class="prev-month">前月</span>
          <span v-if="data.type === 'next-month'" class="next-month">下月</span>
          <span v-for="item in events" :key="item.date">
            <span v-if="item.date === data.day">{{ item.title }}</span>
          </span>
        </p>
      </template>
    </el-calendar>
    <div>
      <!-- 复习时间设置 -->
      <el-card class="review-time">
        <div slot="header" class="clearfix">
          <span>复习时间设置</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="每日复习时间段">
            <el-time-picker v-model="reviewTime" placeholder="选择时间"></el-time-picker>
          </el-form-item>
          <el-form-item label="开启提醒">
            <el-switch v-model="reminderEnabled"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 复习周期配置 -->
      <el-card class="review-cycle">
        <div slot="header" class="clearfix">
          <span>复习周期配置</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="间隔天数">
            <el-input-number v-model="intervalDays" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="复习次数">
            <el-input-number v-model="reviewCount" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 学习统计 -->
      <el-card class="learning-stats">
        <div slot="header" class="clearfix">
          <span>学习统计</span>
        </div>
        <div id="chart" style="width: 400px; height: 300px;"></div>
        <div class="stats-numbers">
          <span>待复习：{{ pendingReviews }}</span>
          <span>已完成：{{ completedReviews }}</span>
        </div>
      </el-card>

      <!-- 添加复习内容表单 -->
      <el-card class="add-review">
        <div slot="header" class="clearfix">
          <span>添加复习内容</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="日期">
            <el-date-picker v-model="newEventDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="newEventTitle" placeholder="输入复习内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addEvent">添加</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 修改复习内容弹窗 -->
      <el-dialog title="修改复习内容" :visible.sync="dialogVisible" width="30%">
        <el-form label-width="100px">
          <el-form-item label="日期">
            <el-date-picker v-model="editingEvent.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="editingEvent.title" placeholder="输入复习内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEvent">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import echarts from 'echarts';

export default {
  data() {
    return {
      value: new Date(),
      reviewTime: '',
      reminderEnabled: false,
      intervalDays: 7,
      reviewCount: 3,
      pendingReviews: 12,
      completedReviews: 45,
      events: [
        { date: '2025-03-01', title: '英语单词复习' },
        // 添加其他事件...
      ],
      newEventDate: '',
      newEventTitle: '',
      dialogVisible: false,
      editingEvent: { date: '', title: '' }
    };
  },
  mounted() {
    // this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [9, 12, 15, 6, 9, 12, 15],
          type: 'line'
        }]
      };
      chart.setOption(option);
    },
    addEvent() {
      if (this.newEventDate && this.newEventTitle) {
        const formattedDate = this.$moment(this.newEventDate).format('YYYY-MM-DD');
        this.events.push({ date: formattedDate, title: this.newEventTitle });
        this.newEventDate = '';
        this.newEventTitle = '';
      }
    },
    handleDateClick(date) {
      console.log('Clicked date:', date);
      const event = this.events.find(e => e.date === date);
      console.log('Found event:', event);
      if (event) {
        this.editingEvent = { ...event };
      } else {
        this.editingEvent = { date: date, title: '' };
      }
      this.dialogVisible = true;
    },
    saveEvent() {
      const index = this.events.findIndex(e => e.date === this.editingEvent.date);
      if (index !== -1) {
        this.events.splice(index, 1, this.editingEvent);
      } else {
        this.events.push(this.editingEvent);
      }
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.user-page {
  display: flex;
  justify-content: space-between;
}

.el-calendar {
  width: 60%;
}

.review-time, .review-cycle, .learning-stats, .add-review {
  margin-left: 20px;
}

.stats-numbers span {
  display: block;
  margin-bottom: 10px;
}
</style>