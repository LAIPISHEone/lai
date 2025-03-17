<template>
  <div class="login">
    <div class="login-form">
      <div v-if="isLogin" class="login-form-header"><h3>用户登录</h3></div>
      <div v-else class="login-form-header"><h3>用户注册</h3></div>
      <div class="login-form-body">
        <el-form
          :rules="rules"
          ref="loginForm"
          :model="loginForm"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="loginForm.userName"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input
              placeholder="请输入密码"
              type="passWord"
              clearable
              show-passWord
              @keyup.enter.native="submitForm('loginForm')"
              v-model="loginForm.passWord"
            ></el-input>
          </el-form-item>

          <el-row type="flex" justify="center">
            <el-col :span="7">
              <el-button
              v-if="isLogin"
                type="primary"
                style="width: 100%"
                @click="submitForm('loginForm')"
                >登录</el-button
              >
              <el-button
              v-else
                type="primary"
                style="width: 100%"
                @click="submitForm('loginForm')"
                >注册</el-button
              >
            </el-col>
          </el-row>
          <el-form-item>
            <a v-if="isLogin" @click="isLogin= false" style="color: red;">还没有账号？点击去注册</a>
            <a v-else @click="isLogin= true" style="color: red;">已有账号？点击去登录</a>
          </el-form-item>
        </el-form>
        
      </div>
    </div>
  </div>
</template>

<script>
import {  registerApi, loginApi } from "../../api/user/index.js";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        passWord: "",
        userName: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      isLogin:true,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isLogin) {
            loginApi(this.loginForm).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              console.log(res);
              this.$message.success(res.data.message);
              localStorage.setItem("token", res.data.data.token);
              sessionStorage.setItem("userName", res.data.data.userName);
              this.$router.push("/home");
            } else {
              this.$message.error(res.data.message);
              return false;
            }
          });
        }else {
          registerApi(this.loginForm).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message.success(res.data.message);
              this.isLogin = true;
              // localStorage.setItem("token", res.data.data.token);
              // this.$router.push("/home");
            } else {
              this.$message.error(res.data.message);
              return false;
            }
          }).catch((err) => {
            this.$message.error(err);
          });
          
        }






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


}
.login-form {
width: 400px;
height: 300px;
border-radius: 20px;
box-shadow: 0px 0px 7px #7c7c7c;
background-color: rgb(255, 255, 255);
}

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
</style>
