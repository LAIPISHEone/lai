<template>
  <div>
    <h2 style="margin-left: 20px">考试信息</h2>
    <el-input
      v-model="searchKeyword"
      placeholder="请输入考试名称搜索"
      style="margin-bottom: 20px; width: 300px; margin-left: 20px"
      @input="updateFilteredExams"
    />
    <div
      v-for="(category, categoryIndex) in examCategories"
      :key="categoryIndex"
    >
      <h3 style="margin-left: 20px">{{ category.title }}</h3>
      <el-collapse
        style="
          margin-left: 20px;
          display: flex;
          flex-wrap: wrap;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #fff;
        "
      >
        <el-collapse-item
          v-for="(exam, index) in filteredExamsByCategory(category.exams)"
          :key="index"
          :title="exam.exam_name"
          style="margin: 20px; width: 350px"
        >
          <div class="exam-info">
            <p><strong>考试时间:</strong> {{ exam.exam_date }}</p>
            <p>
              <strong>报名网站:</strong>
              <a :href="exam.registration_url" target="_blank">{{
                exam.registration_url
              }}</a>
            </p>
            <p>
              <strong>报名截止时间:</strong> {{ exam.registration_deadline }}
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { getExamList } from "@/api/exam/index.js";
export default {
  data() {
    return {
      searchKeyword: "",
      examCategories: [],
    };
  },
  created() {
    this.getExamData();
  },
  methods: {
    getExamData() {
      getExamList().then((res) => {
        console.log("**", res);
        if (res.data.code === 200) {
          console.log("examCategories");
          let array = [
            {
              title: "国家教育考试",
              exams: [],
            },
            { title: "社会证书考试", exams: [] },
            { title: "海外考试", exams: [] },
          ];

          res.data.data.records.forEach((category) => {
            if (category.exam_type === "国家教育考试") {
              category.exam_date = category.exam_date.slice(0, 10);
              category.registration_deadline =
                category.registration_deadline.slice(0, 10);

              array[0].exams.push(category);
            } else if (category.exam_type === "社会证书考试") {
              array[1].exams.push(category);
            } else if (category.exam_type === "海外考试") {
              array[2].exams.push(category);
            }
          });
          console.log("examCategories", array);
          this.examCategories = array;
        } else {
          console.error("Failed to fetch exam data");
        }
      });
    },

    updateFilteredExams() {
      // 触发计算属性的重新计算
    },
    filteredExamsByCategory(exams) {
      return exams.filter((exam) =>
        exam.exam_name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.exam-info {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 300px;
  margin: 20px;
  background-color: rgba(255, 255, 255, 1);
  background-size: cover; /* 背景图覆盖整个卡片 */
  background-position: center; /* 背景图居中 */
  transition: transform 0.3s; /* 添加过渡效果 */
  cursor: pointer;
}

.exam-info:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 鼠标移入时添加阴影效果 */
  transform: translateY(-5px);
  cursor: pointer; /* 鼠标移入时变成小手 */
}

.exam-info h3 {
  margin-top: 0;
}

.exam-info p {
  margin: 5px 0;
}
</style>
