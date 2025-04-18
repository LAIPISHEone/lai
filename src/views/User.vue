<template>
  <div class="ebbinghaus-page">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 日历视图 -->
      <el-card class="calendar-card">
        <div slot="header" class="clearfix">
          <span>复习日历</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="generateSchedule"
            >生成复习计划</el-button
          >
        </div>
        <el-calendar v-model="currentDate">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div class="calendar-day" @click="handleDateClick(data.day)">
              <div class="day-number">
                {{ data.day.split("-").slice(2).join("-") }}
              </div>
              <div class="day-events">
                <el-tag
                  v-for="(item, index) in getDayEvents(data.day)"
                  :key="index"
                  :type="getTagType(item.type)"
                  size="mini"
                  class="event-tag"
                >
                  {{ item.title }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-card>

      <!-- 学习统计 -->
      <el-card class="stats-card">
        <div slot="header" class="clearfix">
          <span>学习统计</span>
        </div>
        <div class="stats-container">
          <div class="chart-container" ref="chart"></div>
          <div class="numbers-container">
            <div class="stat-item">
              <div class="stat-value">{{ pendingReviews }}</div>
              <div class="stat-label">待复习</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedReviews }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ reviewEfficiency }}%</div>
              <div class="stat-label">复习进度</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 侧边配置区 -->
    <div class="sidebar">
      <!-- 复习内容管理 -->
      <el-card class="content-card">
        <div slot="header" class="clearfix">
          <span>复习内容管理</span>
        </div>
        <el-input
          v-model="newMaterial.title"
          placeholder="输入学习内容"
          class="input-item"
        ></el-input>
        <el-input
          v-model="newMaterial.description"
          placeholder="输入内容描述"
          type="textarea"
          :rows="2"
          class="input-item"
        ></el-input>
        <el-date-picker
          v-model="newMaterial.firstStudyDate"
          type="date"
          placeholder="首次学习日期"
          class="input-item"
        ></el-date-picker>
        <el-button
          type="primary"
          @click="addMaterial"
          class="add-btn"
          :disabled="!newMaterial.title"
        >
          添加学习内容
        </el-button>
      </el-card>

      <!-- 复习计划配置 -->
      <el-card class="settings-card">
        <div slot="header" class="clearfix">
          <span>复习计划配置</span>
        </div>
        <el-form label-width="120px">
          <el-form-item label="艾宾浩斯周期">
            <el-checkbox-group v-model="selectedEbbinghausStages">
              <el-checkbox
                v-for="stage in ebbinghausStages"
                :key="stage.days"
                :label="stage.days"
              >
                {{ stage.label }} ({{ stage.days }}天后)
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="每日提醒时间">
            <el-time-picker
              v-model="reminderTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择提醒时间"
            ></el-time-picker>
          </el-form-item> -->
          <el-form-item label="启用提醒">
            <el-switch v-model="reminderEnabled"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 近期复习任务 -->
      <el-card class="tasks-card">
        <div slot="header" class="clearfix">
          <span>近期复习任务 (7天内)</span>
        </div>
        <el-table :data="upcomingReviews" style="width: 100%">
          <el-table-column prop="date" label="日期" width="100">
            <template slot-scope="{ row }">
              {{ formatDate(row.date, "MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="内容"></el-table-column>
          <el-table-column prop="type" label="类型" width="80">
            <template slot-scope="{ row }">
              <el-tag :type="getTagType(row.type)" size="mini">
                {{ getReviewTypeName(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click="completeReview(row)">
                完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 内容详情对话框 -->
    <el-dialog
      :title="`复习内容详情 (${selectedDate})`"
      :visible.sync="detailDialogVisible"
      width="60%"
    >
      <el-table :data="selectedDayEvents" style="width: 100%">
        <el-table-column prop="title" label="内容"></el-table-column>
        <!-- <el-table-column prop="material" label="所属材料"></el-table-column> -->
        <el-table-column prop="type" label="类型">
          <template slot-scope="{ row }">
            <el-tag :type="getTagType(row.type)" size="mini">
              {{ getReviewTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="completeReview(row)">
              标记完成
            </el-button>
            <el-button type="text" size="mini" @click="editReview(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";

export default {
  data() {
    return {
      currentDate: new Date(),
      selectedDate: "",
      detailDialogVisible: false,

      // 学习材料数据
      learningMaterials: [],
      newMaterial: {
        title: "",
        description: "",
        firstStudyDate: new Date(),
      },

      // 复习计划数据
      reviewSchedule: [],

      // 配置数据
      selectedEbbinghausStages: [1, 2, 4, 7, 15, 30], // 默认选择艾宾浩斯推荐的6个复习点
      ebbinghausStages: [
        { days: 1, label: "第一次复习" },
        { days: 2, label: "第二次复习" },
        { days: 4, label: "第三次复习" },
        { days: 7, label: "第四次复习" },
        { days: 15, label: "第五次复习" },
        { days: 30, label: "第六次复习" },
      ],
      reminderTime: "20:00",
      reminderEnabled: true,

      // 图表实例
      chartInstance: null,
    };
  },

  computed: {
    // 待复习数量
    pendingReviews() {
      return this.reviewSchedule.filter(
        (item) =>
          !item.completed && moment(item.date).isSameOrBefore(moment(), "day")
      ).length;
    },

    // 已完成数量
    completedReviews() {
      return this.reviewSchedule.filter((item) => item.completed).length;
    },

    // 复习效率 (已完成/总计划)
    reviewEfficiency() {
      const total = this.reviewSchedule.length;
      if (total === 0) return 0;
      return Math.round((this.completedReviews / total) * 100);
    },

    // 近期(7天内)复习任务
    upcomingReviews() {
      const endDate = moment().add(7, "days");
      return this.reviewSchedule
        .filter(
          (item) =>
            !item.completed &&
            moment(item.date).isBetween(moment(), endDate, "day", "[]")
        )
        .slice(0, 5); // 只显示最多5条
    },

    // 选中日期的复习任务
    selectedDayEvents() {
      if (!this.selectedDate) return [];
      return this.reviewSchedule.filter(
        (item) => item.date === this.selectedDate
      );
    },
  },

  mounted() {
    this.initChart();
    this.loadData();
  },

  methods: {
    // 初始化图表
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.updateChart();
    },

    // 更新图表数据
    updateChart() {
      // 按周分组数据
      const weekData = {};
      const now = moment();

      this.reviewSchedule.forEach((item) => {
        const weekNumber = moment(item.date).diff(now.startOf("week"), "weeks");
        if (!weekData[weekNumber]) {
          weekData[weekNumber] = { completed: 0, pending: 0 };
        }

        if (item.completed) {
          weekData[weekNumber].completed++;
        } else if (moment(item.date).isSameOrBefore(now, "day")) {
          weekData[weekNumber].pending++;
        }
      });

      // 准备图表数据
      const weeks = Object.keys(weekData).sort();
      const completedData = weeks.map((week) => weekData[week].completed);
      const pendingData = weeks.map((week) => weekData[week].pending);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          // data: ['已完成', '待复习']
          data: ["已完成"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: weeks.map((week) => `第${parseInt(week) + 1}周`),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "已完成",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
            data: completedData,
            itemStyle: {
              color: "#67C23A",
            },
          },
          // {
          //   name: '待复习',
          //   type: 'bar',
          //   stack: 'total',
          //   emphasis: {
          //     focus: 'series'
          //   },
          //   data: pendingData,
          //   itemStyle: {
          //     color: '#F56C6C'
          //   }
          // }
        ],
      };

      this.chartInstance.setOption(option);
    },

    // 加载数据
    loadData() {
      // 这里应该是从API加载数据，暂时用模拟数据
      const savedMaterials = localStorage.getItem("learningMaterials");
      if (savedMaterials) {
        this.learningMaterials = JSON.parse(savedMaterials);
      }

      const savedSchedule = localStorage.getItem("reviewSchedule");
      if (savedSchedule) {
        this.reviewSchedule = JSON.parse(savedSchedule);
      }

      this.updateChart();
    },

    // 保存数据
    saveData() {
      localStorage.setItem(
        "learningMaterials",
        JSON.stringify(this.learningMaterials)
      );
      localStorage.setItem(
        "reviewSchedule",
        JSON.stringify(this.reviewSchedule)
      );
    },

    // 添加学习材料
    addMaterial() {
      const newMaterial = {
        id: Date.now(),
        title: this.newMaterial.title,
        description: this.newMaterial.description,
        firstStudyDate: moment(this.newMaterial.firstStudyDate).format(
          "YYYY-MM-DD"
        ),
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      this.learningMaterials.push(newMaterial);
      this.newMaterial = {
        title: "",
        description: "",
        firstStudyDate: new Date(),
      };
      this.saveData();

      this.$message.success("学习内容添加成功");
    },

    // 生成复习计划
    generateSchedule() {
      if (this.learningMaterials.length === 0) {
        this.$message.warning("请先添加学习内容");
        return;
      }

      // 清空现有计划
      this.reviewSchedule = [];

      // 为每个学习材料生成复习计划
      this.learningMaterials.forEach((material) => {
        this.selectedEbbinghausStages.forEach((days) => {
          const reviewDate = moment(material.firstStudyDate)
            .add(days, "days")
            .format("YYYY-MM-DD");

          this.reviewSchedule.push({
            id: `${material.id}-${days}`,
            materialId: material.id,
            title: material.title,
            material: material.title,
            date: reviewDate,
            type: this.getReviewTypeByDays(days),
            completed: false,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
        });
      });

      // 按日期排序
      this.reviewSchedule.sort((a, b) => moment(a.date).diff(moment(b.date)));

      this.saveData();
      this.updateChart();

      this.$message.success("复习计划生成成功");
    },

    // 根据天数获取复习类型
    getReviewTypeByDays(days) {
      const stage = this.ebbinghausStages.find((s) => s.days === days);
      return stage ? stage.label : `${days}天后复习`;
    },

    // 获取某天的所有复习事件
    getDayEvents(date) {
      return this.reviewSchedule.filter((item) => item.date === date);
    },

    // 处理日期点击
    handleDateClick(date) {
      this.selectedDate = date;
      this.detailDialogVisible = true;
    },

    // 标记复习完成
    completeReview(review) {
      const index = this.reviewSchedule.findIndex(
        (item) => item.id === review.id
      );
      if (index !== -1) {
        this.reviewSchedule[index].completed = true;
        this.saveData();
        this.updateChart();
        this.$message.success("复习任务标记完成");
      }
    },

    // 编辑复习任务
    editReview(review) {
      this.$prompt("请输入新的复习内容", "编辑复习任务", {
        inputValue: review.title,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          const index = this.reviewSchedule.findIndex(
            (item) => item.id === review.id
          );
          if (index !== -1) {
            this.reviewSchedule[index].title = value;
            this.saveData();
            this.$message.success("复习任务更新成功");
          }
        })
        .catch(() => {});
    },

    // 格式化日期
    formatDate(date, format = "YYYY-MM-DD") {
      return moment(date).format(format);
    },

    // 获取标签类型
    getTagType(reviewType) {
      if (reviewType.includes("第一次")) return "danger";
      if (reviewType.includes("第二次")) return "warning";
      if (reviewType.includes("第三次")) return "primary";
      if (reviewType.includes("第四次")) return "success";
      if (reviewType.includes("第五次")) return "info";
      return "";
    },

    // 获取复习类型名称
    getReviewTypeName(reviewType) {
      if (reviewType.includes("复习")) return reviewType;
      return reviewType.replace("天后", "天");
    },
  },
};
</script>

<style scoped>
.ebbinghaus-page {
  display: flex;
  padding: 20px;
  background-color: #f5f7fa;
}

.main-content {
  flex: 3;
  margin-right: 20px;
}

.sidebar {
  flex: 1;
}

.calendar-card,
.stats-card,
.content-card,
.settings-card,
.tasks-card {
  margin-bottom: 20px;
}

.calendar-day {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.day-number {
  font-weight: bold;
  margin-bottom: 5px;
}

.day-events {
  flex: 1;
  overflow: hidden;
}

.event-tag {
  margin: 2px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-container {
  display: flex;
}

.chart-container {
  flex: 2;
  height: 300px;
}

.numbers-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stat-item {
  text-align: center;
  margin: 15px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.input-item {
  margin-bottom: 15px;
}

.add-btn {
  width: 100%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>