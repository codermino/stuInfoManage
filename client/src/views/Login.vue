<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修在线后台管理</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="loginForm">
          <el-form-item label="学号" prop="userId">
            <el-input v-model="ruleForm.userId" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="passwordInput">
            <el-input :type="type" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
            <div class="switch-show">
              <img @click="changeToHidden" :hidden="type === 'password'" src="./images/show_pwd.png" alt="" width="20">
              <img @click="changeToShow" :hidden="type === 'text'" src="./images/hide_pwd.png" alt="" width="20">
            </div>
          </el-form-item>

          <el-form-item>
            <Vcode
              :imgs="[Img1,Img2, Img3]"
              :show="isShow"
              @onSuccess="onSuccess"
              @onClose="onClose"
            />
<!--            <el-button type="primary" class="submit_btn" @click="submitForm('ruleForm')">登录</el-button>-->
            <el-button type="primary" class="submit_btn" @click="onSubmit">登录</el-button>
            <el-button class="submit_btn" @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>

          <div class="tiparea">
            <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
            <p>忘记密码？<router-link to='/fpassword'>点击找回</router-link></p>
          </div>

        </el-form>

      </div>
    </section>
  </div>
</template>

<script>
  import jwt_decode from 'jwt-decode'
  import Vcode from "vue-puzzle-vcode";
  import Img1 from '../assets/checkImg/bg1.jpg';
  import Img2 from '../assets/checkImg/bg2.jpg';
  import Img3 from '../assets/checkImg/bg3.jpg';

  export default {
    name: "Login",
    components:{
      Vcode
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

      return {
        //滑动验证的背景图片
        Img1,
        Img2,
        Img3,
        //控制密码的显示与隐藏
        type:'password',
        //控制滑动验证的验证框是否显示
        isShow:false,
        ruleForm: {
          userId:'',
          password: '',
        },
        rules: {
          userId: [
            {required:true,validator: checkNumber, trigger:"blur"}
          ],
          password: [
            { required:true,validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //当使用cors或者请求头跨域的时候的请求语句
            // this.axios.post('http://localhost:5000/api/user/login',this.ruleForm)
            this.axios.post('/api/user/login',this.ruleForm)
            //当跨域文件中的代码是下面的代码的时候使用的请求语句
            // this.axios.post('user/login',this.ruleForm)
              .then(res=>{
                this.$message({
                  message:"登录成功",
                  type: 'success'
                });

                // console.log(res);
                const {token}=res.data;
                localStorage.setItem('eleToken',token);

                const decoded = jwt_decode(token);
                // console.log(decoded);
                this.$store.dispatch("setAuthenticated",!this.isEmpty(localStorage.eleToken));
                this.$store.dispatch("setUser",decoded);

                this.$router.push('/index');
              })
          }
        });
      },

      isEmpty(value) {
        return (
          value === undefined ||
          value === null ||
          (typeof value === "object" && Object.keys(value).length === 0) ||
          (typeof value === "string" && value.trim().length === 0)
        );
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //控制密码框显示与隐藏的方法
      changeToShow(){
        this.type = 'text'
      },

      changeToHidden(){
        this.type = 'password'
      },

      //控制滑动验证框的方法
      onSubmit(){
        this.isShow = true;
      },
      // 用户通过了验证
      onSuccess(msg){
        this.isShow = false; // 通过验证后，需要手动隐藏模态框
        this.submitForm("ruleForm");
      },
      // 用户点击遮罩层，应该关闭模态框
      onClose(){
        this.isShow = false;
      }
    }
  }
</script>

<style scoped>
  .login {
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
    top: 20%;
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
  .loginForm {
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
  .passwordInput{
    position: relative;
  }

  .passwordInput .switch-show{
    position: absolute;
    right: 10px;
    top: 5px;
  }
</style>