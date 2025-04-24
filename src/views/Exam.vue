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
          :title="exam.name"
          style="margin: 20px; width: 350px"
        >
          <div class="exam-info">
            <p><strong>考试时间:</strong> {{ exam.date }}</p>
            <p>
              <strong>报名网站:</strong>
              <a :href="exam.registrationUrl" target="_blank">{{
                exam.registrationUrl
              }}</a>
            </p>
            <p>
              <strong>报名截止时间:</strong> {{ exam.registrationDeadline }}
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: "",
      examCategories: [
        {
          title: "国家教育考试",
          exams: [
            {
              name: "普通高考",
              date: "2025-6-7",
              registrationUrl: "https://gaokao.neea.edu.cn/",
              registrationDeadline: "各省份不同，请查看官网",
              backgroundImage: "../assets/english-bg.png",
            },
            {
              name: "成人高考",
              date: "2025-6-7",
              registrationUrl: "https://chengkao.neea.edu.cn/",
              registrationDeadline: "各省份不同，请查看官网",
              backgroundImage: "../assets/english-bg.png",
            },
            {
              name: "研究生考试",
              date: "2025-6-7",
              registrationUrl: "https://yankao.neea.edu.cn/",
              registrationDeadline: "各省份不同，请查看官网",
              backgroundImage: "../assets/english-bg.png",
            },
            {
              name: "自学考试",
              date: "2025-6-14",
              registrationUrl: "https://zikao.neea.edu.cn/",
              registrationDeadline: "各考点不同，请查看官网",
              backgroundImage: "../assets/english-bg.png",
            },
            {
              name: "中小学教师资格考试",
              date: "2025-3-29",
              registrationUrl: "https://ntce.neea.edu.cn/",
              registrationDeadline: "登录各省级承办机构网站查询",
              backgroundImage:
                "https://img.peapix.com/8a0558c856a74b5885aefa42d74e3935_1080.jpg",
            },
            {
              name: "同等学力申请硕士学位考试",
              date: "2025-3-29",
              registrationUrl: "https://tdxl.neea.edu.cn/",
              registrationDeadline: "登录各省级承办机构网站查询",
              backgroundImage:
                "https://img.peapix.com/8a0558c856a74b5885aefa42d74e3935_1080.jpg",
            },
          ],
        },
        {
          title: "社会证书考试",
          exams: [
            {
              name: "全国计算机等级考试(NCRE)",
              date: "2025-3-29",
              registrationUrl: "https://ncre.neea.edu.cn/",
              registrationDeadline: "登录各省级承办机构网站查询",
              backgroundImage:
                "https://img.peapix.com/8a0558c856a74b5885aefa42d74e3935_1080.jpg",
            },
            {
              name: "全国大学英语四、六级考试(CET) ",
              date: "2023-11-01",
              registrationUrl: "https://cet.neea.edu.cn/",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "全国计算机应用水平考试(NIT)",
              date: "2023-11-01",
              registrationUrl: "https://nit.neea.edu.cn/",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "全国英语等级考试(PETS)",
              date: "2023-11-01",
              registrationUrl: "https://pets.neea.edu.cn/",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "全国外语水平考试(WSK)",
              date: "2023-11-01",
              registrationUrl: "http://example.com/register2",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "书画等级考试(CCPT)",
              date: "2023-11-01",
              registrationUrl: "http://example.com/register2",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "中国少数民族汉语水平等级考试(MHK)",
              date: "2023-11-01",
              registrationUrl: "http://example.com/register2",
              registrationDeadline: "2023-10-15",
              backgroundImage: "http://example.com/background3.jpg",
            },
          ],
        },
        {
          title: "海外考试",
          exams: [
            {
              name: "托福网考®(TOEFL iBT®)",
              date: "多场考试，请查看官网",
              registrationUrl: "https://toefl-main.neea.cn/",
              registrationDeadline: "多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "雅思(IELTS)",
              date: "2025年4-6月，多场考试，请查看官网",
              registrationUrl: "https://ielts-main.neea.cn/",
              registrationDeadline: "2025年3-6月，多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "德福(TestDaF)",
              date: "2025年4-6月，多场考试，请查看官网",
              registrationUrl: "https://ielts-main.neea.cn/",
              registrationDeadline: "2025年3-6月，多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "日本语能力测试(JLPT)",
              date: "2025年4-6月，多场考试，请查看官网",
              registrationUrl: "https://ielts-main.neea.cn/",
              registrationDeadline: "2025年3-6月，多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "韩国语能力考试 (TOPIK)",
              date: "2025年4-6月，多场考试，请查看官网",
              registrationUrl: "https://ielts-main.neea.cn/",
              registrationDeadline: "2025年3-6月，多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
            {
              name: "美国研究生入学考试(GRE)",
              date: "2025年4-6月，多场考试，请查看官网",
              registrationUrl: "https://ielts-main.neea.cn/",
              registrationDeadline: "2025年3-6月，多场考试，请查看官网",
              backgroundImage: "http://example.com/background3.jpg",
            },
          ],
        },
      ],
    };
  },
  methods: {
    updateFilteredExams() {
      // 触发计算属性的重新计算
    },
    filteredExamsByCategory(exams) {
      return exams.filter((exam) =>
        exam.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
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
