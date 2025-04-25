<template>
  <div class="dashboard-container">
    <!-- 数据概览卡片 -->
    <div class="stats-row">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon" :style="{ backgroundColor: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-trend" :class="stat.trend >= 0 ? 'up' : 'down'">
            <i :class="stat.trend >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            {{ Math.abs(stat.trend) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <!-- 登录趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>七日登录趋势</h3>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="generateLoginTrendData"
            size="small"
          />
        </div>
        <div class="chart-container" ref="lineChart"></div>
      </div>

      <!-- 用户来源图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户来源分布</h3>
        </div>
        <div class="chart-container" ref="pieChart"></div>
      </div>
    </div>

    <!-- 最近登录用户表格 -->
    <div class="table-card">
      <div class="table-header">
        <h3>最近登录用户</h3>
        <el-button type="text" @click="generateRecentLogins">刷新</el-button>
      </div>
      <el-table :data="recentLogins" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="loginTime" label="登录时间" width="180"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="device" label="设备"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totalLogins"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      // 统计数据
      stats: [
        { title: '总注册用户', value: 0, icon: 'el-icon-user-solid', color: '#36a3f7', trend: 0 },
        { title: '当日登录人数', value: 0, icon: 'el-icon-sunny', color: '#34bfa3', trend: 0 },
        { title: '七日登录人数', value: 0, icon: 'el-icon-date', color: '#f4516c', trend: 0 },
        { title: '当日新注册', value: 0, icon: 'el-icon-circle-plus', color: '#ffb822', trend: 0 }
      ],
      
      // 图表数据
      loginTrendData: {
        dates: [],
        counts: []
      },
      userSourceData: [],
      
      // 最近登录用户
      recentLogins: [],
      currentPage: 1,
      pageSize: 10,
      totalLogins: 50,
      
      // 日期范围
      dateRange: [
        new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
        new Date()
      ],
      
      // ECharts实例
      lineChart: null,
      pieChart: null
    }
  },
  mounted() {
    this.generateStatsData()
    this.generateLoginTrendData()
    this.generateUserSourceData()
    this.generateRecentLogins()
    
    // 初始化图表
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  methods: {
    // 生成统计数据
    generateStatsData() {
      const totalUsers = Math.floor(Math.random() * 10000) + 5000
      const todayLogins = Math.floor(Math.random() * 500) + 200
      const weeklyLogins = Math.floor(Math.random() * 3000) + 1500
      const todayRegistrations = Math.floor(Math.random() * 100) + 50
      
      this.stats[0].value = totalUsers
      this.stats[1].value = todayLogins
      this.stats[2].value = weeklyLogins
      this.stats[3].value = todayRegistrations
      
      // 随机生成趋势数据
      this.stats[0].trend = (Math.random() * 10).toFixed(1)
      this.stats[1].trend = (Math.random() * 15 - 5).toFixed(1)
      this.stats[2].trend = (Math.random() * 12 - 3).toFixed(1)
      this.stats[3].trend = (Math.random() * 20 - 5).toFixed(1)
    },
    
    // 生成登录趋势数据
    generateLoginTrendData() {
      const dates = []
      const counts = []
      const [startDate, endDate] = this.dateRange
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toLocaleDateString()
        dates.push(dateStr)
        counts.push(Math.floor(Math.random() * 200) + 100)
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      this.loginTrendData = { dates, counts }
      this.updateLineChart()
    },
    
    // 生成用户来源数据
    generateUserSourceData() {
      this.userSourceData = [
        { name: '直接访问', value: Math.floor(Math.random() * 1000) + 500 },
        { name: '搜索引擎', value: Math.floor(Math.random() * 800) + 400 },
        { name: '社交媒体', value: Math.floor(Math.random() * 600) + 300 },
        { name: '邮件营销', value: Math.floor(Math.random() * 400) + 200 },
        { name: '广告推广', value: Math.floor(Math.random() * 300) + 100 }
      ]
      this.updatePieChart()
    },
    
    // 生成最近登录用户
    generateRecentLogins() {
      const devices = ['Windows', 'Mac', 'iPhone', 'Android', 'iPad']
      const logins = []
      
      for (let i = 0; i < this.pageSize; i++) {
        const offset = (this.currentPage - 1) * this.pageSize + i
        if (offset >= this.totalLogins) break
        
        logins.push({
          username: `user${Math.floor(Math.random() * 10000)}`,
          loginTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          device: devices[Math.floor(Math.random() * devices.length)]
        })
      }
      
      this.recentLogins = logins
    },
    
    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.generateRecentLogins()
    },
    
    handleCurrentChange(val) {
      this.currentPage = val
      this.generateRecentLogins()
    },
    
    // 初始化图表
    initCharts() {
      // 动态引入ECharts
      import('echarts').then(echarts => {
        this.lineChart = echarts.init(this.$refs.lineChart)
        this.pieChart = echarts.init(this.$refs.pieChart)
        this.updateLineChart()
        this.updatePieChart()
        
        // 窗口大小变化时重绘图表
        window.addEventListener('resize', () => {
          this.lineChart.resize()
          this.pieChart.resize()
        })
      })
    },
    
    // 更新折线图
    updateLineChart() {
      if (!this.lineChart) return
      
      this.lineChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.loginTrendData.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.loginTrendData.counts,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(58, 77, 233, 0.8)'
              }, {
                offset: 1,
                color: 'rgba(58, 77, 233, 0.1)'
              }]
            }
          },
          itemStyle: {
            color: '#3a4de9'
          }
        }]
      })
    },
    
    // 更新饼图
    updatePieChart() {
      if (!this.pieChart) return
      
      this.pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: this.userSourceData.map(item => item.name)
        },
        series: [{
          name: '用户来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.userSourceData
        }]
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 统计数据卡片样式 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #303133;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.up {
  color: #f56c6c;
}

.stat-trend.down {
  color: #67c23a;
}

/* 图表区域样式 */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.chart-container {
  height: 300px;
  width: 100%;
}

/* 表格区域样式 */
.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
  
  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>