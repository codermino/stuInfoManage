<template>
  <div class="resetpassword">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修在线后台管理</span>
        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="loginForm">
          <el-form-item label="用户名" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入新的密码"></el-input>
          </el-form-item>

          <el-form-item>
            <!--            这里的按钮应该修改成为60s中之后才能够再次点击的-->
            <el-button type="primary" class="submit_btn" @click.prevent="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: "ResetPassword",
  data(){
    return{
      ruleForm: {
        mail:'',
        username: '',
        password:''
      }
    }
  },
  methods:{
    async submitForm() {
      const token = localStorage.getItem('reset_token');
      const {username ,mail} = jwt_decode(token);
      this.ruleForm.username = username;
      this.ruleForm.mail = mail;
      const result = await this.axios.post('http://localhost:3000/user/reset_password_last', this.ruleForm);
      if (result.data.code === 200){
        localStorage.removeItem('reset_token');
        this.$message.success('重置密码成功');
        this.$router.replace('/login')
      }
    }
  }
}
</script>

<style scoped>
  .resetpassword {
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
</style>