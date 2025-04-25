<template>
  <div>
    <h1>用户管理</h1>
    <el-form
      :inline="true"
      :model="searchForm"
      @submit.native.prevent="fetchUsers"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="searchForm.id" placeholder="请输入用户ID"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="active"></el-option>
          <el-option label="禁用" value="inactive"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchUsers">查询</el-button>
        <el-button type="success" @click="addUser">新增用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="users" style="width: 100%">
      <el-table-column prop="user_id" label="用户ID"></el-table-column>
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="user_status" label="状态">
        <template slot-scope="scope">
          <span
            :style="{
              color: scope.row.user_status === 1 ? 'green' : 'red',
            }"
          >
            {{ scope.row.user_status === 1 ? "启用" : "禁用" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="is_admin" label="管理员">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.is_admin ? 'blue' : 'black' }">
            {{ scope.row.is_admin ? "是" : "否" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editUser(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteUser(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type=""
            @click="toggleStatus(scope.$index, scope.row)"
          >
            {{ scope.row.user_status ? "禁用" : "启用" }}
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="changePassword(scope.$index, scope.row)"
            >修改密码</el-button
          >
          <el-button size="mini" @click="setAdmin(scope.$index, scope.row)">
            {{ scope.row.is_admin ? "取消管理员" : "设置为管理员" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 新增/修改用户信息的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="启用" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员">
          <el-switch
            v-model="userForm.isAdmin"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogTitle === '新增用户'">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码的对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
    >
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="新密码">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  setAdmin,
  setUserPassWord,
  updateUserStatus,
} from "@/api/user/index.js";
export default {
  data() {
    return {
      searchForm: {
        username: "",
        id: "",
        status: "",
      },
      users: [],
      dialogVisible: false,
      dialogTitle: "",
      userForm: {
        id: "",
        username: "",
        status: "",
        isAdmin: false,
        password: "",
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      passwordDialogVisible: false,
      passwordForm: {
        id: "",
        newPassword: "",
      },
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      let params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        userName: this.searchForm.username || undefined, // 根据用户名筛选
        userId: this.searchForm.id || undefined, // 根据用户ID筛选
        userStatus:
          this.searchForm.status === "active"
            ? true
            : this.searchForm.status === "inactive"
            ? false
            : undefined, // 根据状态筛选
      };

      getUserList(params).then((res) => {
        console.log("&&&", res);
        if (res.data.code == 200) {
          this.users = res.data.data.records;
          this.pagination.total = res.data.data.total;
        }
      });
    },
    handleSizeChange(newSize) {
      this.pagination.pageSize = newSize;
      this.fetchUsers();
    },
    handleCurrentChange(newPage) {
      this.pagination.currentPage = newPage;
      this.fetchUsers();
    },
    addUser() {
      this.dialogTitle = "新增用户";
      this.dialogVisible = true;
      this.userForm = {
        id: "",
        username: "",
        status: "active",
        isAdmin: false,
        password: "",
      };
    },
    editUser(index, row) {
      this.dialogTitle = "修改用户";
      this.dialogVisible = true;
      this.userForm = { ...row };
    },
    deleteUser(index, row) {
      deleteUser(row.user_id).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功！",
          });
        } else {
          this.$message.error("删除失败，请稍后再试");
        }
        this.fetchUsers();
      });
    },
    toggleStatus(index, row) {
      updateUserStatus({
        id: row.user_id,
        enable: row.user_status ? 0 : 1,
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "状态更新成功！",
          });
          this.fetchUsers();
        } else {
          this.$message.error("状态更新失败，请稍后再试");
        }
      });

      // 这里需要调用后端接口更新用户状态
      console.log("Toggling status for user:", row);
      row.status = row.status === "active" ? "inactive" : "active";
      this.users.splice(index, 1, row);
    },
    changePassword(index, row) {
      this.passwordDialogVisible = true;
      this.passwordForm.id = row.user_id;
    },
    saveUser() {
      if (this.dialogTitle === "新增用户") {
        let params = {
          user_name: this.userForm.username,
          password: this.userForm.password,
          user_status: this.userForm.status === "active" ? 1 : 0,
          is_admin: this.userForm.isAdmin ? 1 : 0,
        };
        addUser(params).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功！",
            });
          } else {
            this.$message.error("新增失败，请稍后再试");
          }
          this.fetchUsers();
        });
      } else {
        let params = {
          user_name: this.userForm.username,
          password: this.userForm.password,
          user_status: this.userForm.status === "active" ? 1 : 0,
          is_admin: this.userForm.isAdmin ? 1 : 0,
          user_id: this.userForm.user_id,
        };
        updateUser(params).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功！",
            });
            this.fetchUsers();
          } else {
            this.$message.error("修改失败，请稍后再试");
          }
        });
        // 这里需要调用后端接口修改用户信息
        // console.log("Updating user:", this.userForm);
        // const index = this.users.findIndex(
        //   (user) => user.id === this.userForm.id
        // );
        // if (index !== -1) {
        //   this.users.splice(index, 1, { ...this.userForm });
        // }
      }
      this.dialogVisible = false;
    },
    updatePassword() {
      setUserPassWord(this.passwordForm).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "修改成功！",
          });
        } else {
          this.$message.error("修改失败，请稍后再试");
        }
      });
      this.passwordDialogVisible = false;
    },
    setAdmin(index, row) {
      setAdmin({ id: row.user_id, isAdmin: row.is_admin ? 0 : 1 }).then(
        (res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "设置成功！",
            });
            this.fetchUsers();
          } else {
            this.$message.error("设置失败，请稍后再试");
          }
        }
      );
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>