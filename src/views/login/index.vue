<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- 顶部标题区域 -->
        <div class="login-header">
          <h2 class="login-title">{{ isLogin ? '欢迎回来' : '加入我们' }}</h2>
          <p class="login-subtitle">{{ isLogin ? '请登录您的账户' : '创建新账户' }}</p>
        </div>
        
        <!-- 表单区域 -->
        <div class="login-body">
          <el-form
            :rules="rules"
            ref="loginForm"
            :model="loginForm"
            label-width="80px"
            class="login-form"
            label-position="top"
          >
            <!-- 用户名输入 -->
            <el-form-item label="用户名" prop="userName" class="form-item">
              <el-input
                v-model="loginForm.userName"
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
                clearable
              ></el-input>
            </el-form-item>
            
            <!-- 密码输入 -->
            <el-form-item label="密码" prop="passWord" class="form-item">
              <el-input
                placeholder="请输入密码"
                type="password"
                prefix-icon="el-icon-lock"
                clearable
                show-password
                @keyup.enter.native="submitForm('loginForm')"
                v-model="loginForm.passWord"
              ></el-input>
            </el-form-item>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button
                :type="isLogin ? 'primary' : 'success'"
                class="submit-btn"
                @click="submitForm('loginForm')"
                :loading="loading"
              >
                {{ isLogin ? '登录' : '注册' }}
              </el-button>
            </div>
            
            <!-- 切换链接 -->
            <div class="toggle-action">
              <span class="toggle-text">
                {{ isLogin ? '还没有账号？' : '已有账号？' }}
                <a @click="isLogin = !isLogin" class="toggle-link">
                  {{ isLogin ? '立即注册' : '立即登录' }}
                </a>
              </span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerApi, loginApi } from "../../api/user/index.js";
import { getUserInfo } from "../../api/index.js";
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
      isLogin: true,
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isLogin) {
            getUserInfo(this.loginForm).then((res) => {
              this.loading = false;
              if (res.data.code == 0) {
                this.$message.success(res.data.message);
                localStorage.setItem("token", res.data.data.token);
                sessionStorage.setItem("userName", res.data.data.userName);
                this.$router.push("/home");
                this.$notify.info({
                  title: '公告',
                  message: 'AI助手已上线，快去试试吧！',
                  duration: 0
                });
                setTimeout(() => {
                  this.$notify({
                  title: '复习提醒',
                  message: '您今天有2项复习任务，快去复习吧！',
                   type: 'warning',
                   duration: 0
                });
                }, 1000);
               
              } else {
                this.$message.error(res.data.message);
              }
            }).catch(() => {
              this.loading = false;
            });
          } else {
            registerApi(this.loginForm)
              .then((res) => {
                this.loading = false;
                if (res.data.code == 200) {
                  this.$message.success(res.data.message);
                  this.isLogin = true;
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err);
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped >
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
}

.login-header {
  padding: 30px 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.login-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.login-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.login-body {
  padding: 30px;
}

.login-form {
  .form-item {
    margin-bottom: 22px;
    
    >>> .el-form-item__label {
      padding-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    
    >>> .el-input__inner {
      height: 42px;
      line-height: 42px;
      border-radius: 6px;
    }
    
    >>> .el-input__prefix {
      display: flex;
      align-items: center;
      left: 10px;
    }
  }
}

.form-actions {
  margin-top: 30px;
  text-align: center;
  
  .submit-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    border-radius: 6px;
    transition: all 0.3s;
  }
}

.toggle-action {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  
  .toggle-text {
    color: #666;
  }
  
  .toggle-link {
    color: #667eea;
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    border-radius: 0;
  }
  
  .login-header, .login-body {
    padding: 25px 20px;
  }
}
</style>