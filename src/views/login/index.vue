<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-header"><h3>用户登录</h3></div>
      <div class="login-form-body">
        <el-form
          :rules="rules"
          ref="loginForm"
          :model="loginForm"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              clearable
              show-password
              @keyup.enter.native="submitForm('loginForm')"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>

          <el-row type="flex" justify="center">
            <el-col :span="7">
              <el-button
                type="primary"
                style="width: 100%"
                @click="submitForm('loginForm')"
                >登录</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "../../api/index.js";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        password: "",
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserInfo(this.loginForm).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message.success(res.data.message);
              localStorage.setItem("token", res.data.data.token);
              this.$router.push("/home");
            } else {
              this.$message.error(res.data.message);
              return false;
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login-form {
    width: 400px;
    height: 300px;
    border-radius: 20px;
    box-shadow: 0px 0px 7px #7c7c7c;
    background-color: rgb(255, 255, 255);
    .login-form-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;

      padding: 5px;
      border-bottom: 1px solid #e5e5e5;
    }
    .login-form-body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 240px;
    }
  }
}
</style>
