<template>
  <div>
    <h1>考试信息管理</h1>
    <!-- 搜索和筛选表单 -->
    <el-form
      :inline="true"
      :model="searchForm"
      @submit.native.prevent="fetchExams"
    >
      <el-form-item label="考试名称">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入考试名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="考试类别">
        <el-select clearable v-model="searchForm.category" placeholder="请选择考试类别">
          <el-option label="国家教育考试" value="国家教育考试"></el-option>
          <el-option label="社会证书考试" value="社会证书考试"></el-option>
          <el-option label="海外考试" value="海外考试"></el-option>
          <!-- 其他类别选项 -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchExams">查询</el-button>
        <el-button type="success" @click="addExam">新增考试</el-button>
      </el-form-item>
    </el-form>

    <!-- 考试信息列表 -->
    <el-table :data="exams" style="width: 100%">
      <el-table-column prop="exam_id" label="id"></el-table-column>
      <el-table-column prop="exam_name" label="考试名称"></el-table-column>
      <el-table-column prop="exam_type" label="考试类别"></el-table-column>
      <el-table-column prop="exam_date" label="考试时间"></el-table-column>
      <el-table-column
        prop="registration_deadline"
        label="报名时间"
      ></el-table-column>
      <el-table-column
        prop="registration_url"
        label="报名网址"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editExam(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteExam(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    >
    </el-pagination>

    <!-- 新增/修改考试信息的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="examForm" label-width="100px">
        <el-form-item label="考试名称">
          <el-input v-model="examForm.name"></el-input>
        </el-form-item>
        <el-form-item label="考试类别">
          <el-select v-model="examForm.category" placeholder="请选择考试类别">
            <el-option label="国家教育考试" value="国家教育考试"></el-option>
            <el-option label="社会证书考试" value="社会证书考试"></el-option>
            <el-option label="海外考试" value="海外考试"></el-option>
            <!-- 其他类别选项 -->
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间">
          <el-date-picker
            v-model="examForm.examTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="examForm.registrationTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报名网址">
          <el-input v-model="examForm.registrationUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveExam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamList,
  addExam,
  updateExam,
  deleteExam,
} from "@/api/exam/index.js";
export default {
  data() {
    return {
      searchForm: {
        name: "",
        category: "",
      },
      exams: [],
      dialogVisible: false,
      dialogTitle: "",
      examForm: {
        id: "",
        name: "",
        category: "",
        examTime: "",
        registrationTime: "",
        registrationUrl: "",
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.fetchExams();
  },
  methods: {
    fetchExams() {
      let params = {
        examName: this.searchForm.name,
        examType: this.searchForm.category,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      };

      getExamList(params).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          this.exams = res.data.data.records;
          this.pagination.total = res.data.data.total;
        }
      });
      // 这里需要调用后端接口获取考试信息列表
      console.log("Fetching exams with filters:", this.searchForm);
      // 假设后端接口返回的数据格式为 { exams: [...], total: ... }
      // const response = {
      //   exams: [
      //     {
      //       id: 1,
      //       name: "英语四六级",
      //       category: "国家教育考试",
      //       examTime: "2023-10-01 10:00",
      //       registrationTime: "2023-09-01 10:00",
      //       registrationUrl: "http://example.com",
      //     },
      //     {
      //       id: 2,
      //       name: "全国计算机等级考试",
      //       category: "国家教育考试",
      //       examTime: "2023-10-02 10:00",
      //       registrationTime: "2023-09-02 10:00",
      //       registrationUrl: "http://example.com",
      //     },

      //     {
      //       id: 3,
      //       name: "托福网考®(TOEFL iBT®)",
      //       category: "海外考试",
      //       examTime: "2023-10-02 10:00",
      //       registrationTime: "2023-09-02 10:00",
      //       registrationUrl: "http://example.com",
      //     },
      //     {
      //       id: 4,
      //       name: "雅思(IELTS)",
      //       category: "海外考试",
      //       examTime: "2023-10-02 10:00",
      //       registrationTime: "2023-09-02 10:00",
      //       registrationUrl: "http://example.com",
      //     },

      //     // 其他考试信息
      //   ],
      //   total: 2,
      // };
      // this.exams = response.exams;
      // this.pagination.total = response.total;
    },
    handleSizeChange(newSize) {
      this.pagination.pageSize = newSize;
      this.fetchExams();
    },
    handleCurrentChange(newPage) {
      this.pagination.currentPage = newPage;
      this.fetchExams();
    },
    addExam() {
      this.dialogTitle = "新增考试";
      this.dialogVisible = true;
      this.examForm = {
        id: "",
        name: "",
        category: "",
        examTime: "",
        registrationTime: "",
        registrationUrl: "",
      };
    },
    editExam(index, row) {
      this.dialogTitle = "修改考试";
      this.dialogVisible = true;
      this.examForm = { ...row };
    },
    deleteExam(index, row) {
      deleteExam(row.exam_id).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功！",
          });
          this.fetchExams();
        } else {
          this.$message.error("删除失败，请稍后再试");
        }
      });
    },
    saveExam() {
      if (this.dialogTitle === "新增考试") {
        // 这里需要调用后端接口新增考试信息
        console.log("Adding exam:", this.examForm);
        let params = {
          exam_name: this.examForm.name,
          exam_type: this.examForm.category,
          exam_date: this.examForm.examTime,
          registration_deadline: this.examForm.registrationTime,
          registration_url: this.examForm.registrationUrl,
        };
        addExam(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "新增成功！",
            });
            this.fetchExams();
            this.dialogVisible = false;
          } else {
            this.$message({
              type: "error",
              message: "新增失败！",
            });
          }
        });
      } else {
        let params = {
          exam_id: this.examForm.exam_id,
          exam_name: this.examForm.name,
          exam_type: this.examForm.category,
          exam_date: this.examForm.examTime,
          registration_deadline: this.examForm.registrationTime,
          registration_url: this.examForm.registrationUrl,
        };
        updateExam(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "修改成功！",
            });
            this.fetchExams();
            this.dialogVisible = false;
          } else {
            this.$message({
              type: "error",
              message: "修改失败！",
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>