<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修在线后台管理</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="registerForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="userId">
            <el-input v-model="ruleForm.userId" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <div style="margin-left: 60px;margin-bottom:5px;margin-top: -20px;">
            <div class="input_span">
              <!--            <label>强度:</label>-->
              <span id="one"></span>
              <span id="two"></span>
              <span id="three"></span>
            </div>
            <div id="font">
              <span>弱</span>
              <span>中</span>
              <span>强</span>
            </div>
          </div>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="请确认密码"></el-input>
          </el-form-item>
          <el-form-item label="选择身份" prop="identity">
            <el-select v-model="ruleForm.identity" placeholder="请选择身份" value="identity">
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="学生" value="student"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm('ruleForm')">注册</el-button>
            <el-button class="submit_btn" @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>

          <div class="tiparea">
            <p>已有账号 现在<router-link to='/login'>返回登录</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: "Register",
    computed: {
      password() {
        return this.ruleForm.password;
      }
    },
    watch:{
      password(newname, oldname) {
        this.msgText = this.checkStrong(newname);
        if (this.msgText > 1 || this.msgText === 1) {
          document.getElementById("one").style.background = "red";
        } else {
          document.getElementById("one").style.background = "#eee";
        }
        if (this.msgText > 2 || this.msgText === 2) {
          document.getElementById("two").style.background = "orange";
        } else {
          document.getElementById("two").style.background = "#eee";
        }
        if (this.msgText === 4) {
          document.getElementById("three").style.background = "#00D1B2";
        } else {
          document.getElementById("three").style.background = "#eee";
        }
      }
    },
    data() {
      let checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('学号不能为空'));
        }
        setTimeout(() => {
          if (Number.isNaN(value)) {
            callback(new Error('请输入正确的学号(11位数字)'));
          } else {
            const numberLen=value.length;
            if (numberLen !== 11) {
              callback(new Error('请输入正确的学号(11位数字)'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        msgText: "",
        pwdee: "",
        ruleForm: {
          name:'',
          userId:'',
          password: '',
          checkPass: '',
          identity:''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          userId: [
            {required:true,validator: checkNumber, trigger:"blur"}
          ],
          identity: [
            { required: true, message: '请选择身份', trigger: 'change' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('api/user/register',this.ruleForm)
              .then(res=>{
                // 注册成功
                this.$message({
                  message:"注册成功",
                  type: 'success'
                });
                this.$router.push('/login');
              })
          }

        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //密码强度检验工具
      checkStrong(sValue) {
        let modes = 0;
        //正则表达式验证符合要求的
        if (sValue.length < 1) return modes;
        if (/\d/.test(sValue)) modes++; //数字
        if (/[a-z]/.test(sValue)) modes++; //小写
        if (/[A-Z]/.test(sValue)) modes++; //大写
        if (/\W/.test(sValue)) modes++; //特殊字符

        //逻辑处理
        switch (modes) {
          case 1:
            return 1;
            break;
          case 2:
            return 2;
            break;
          case 3:
          case 4:
            return sValue.length < 6 ? 3 : 4;
            break;
        }
        return modes;
      }
    }
  }
</script>

<style scoped>
  .register {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
  }
  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 10%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
  }
  .form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }
  .registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
  }
  .tiparea p a {
    color: #409eff;
  }

  .input_span span {
    display: inline-block;
    width: 75px;
    height: 10px;
    background: #eee;
    line-height: 20px;
  }

  #one {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-right: 0px solid;
    margin-left: 20px;
    margin-right: 3px;
  }

  #two {
    border-left: 0px solid;
    border-right: 0px solid;
    margin-left: -5px;
    margin-right: 3px;
  }

  #three {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-left: 0px solid;
    margin-left: -5px;
  }
  #font span:nth-child(1) {
    color: red;
    margin-left: 80px;
  }
  #font span:nth-child(2) {
    color: orange;
    margin: 0 60px;
  }
  #font span:nth-child(3) {
    color: #00d1b2;
  }

</style>