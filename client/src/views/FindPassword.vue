<template>
  <div class="findpassword">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修在线后台管理</span>
        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="ruleForm.mail" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item>
<!--            这里的按钮应该修改成为60s中之后才能够再次点击的-->
            <el-button type="primary" class="submit_btn" @click.prevent="submitForm">发送邮件</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "FindPassword",
  data(){
    return{
      ruleForm: {
        mail:'',
        username: ''
      }
    }
  },
  methods:{
    async submitForm() {
      const result = await this.axios.post('http://localhost:3000/user/reset_password', this.ruleForm);
      if (result.data.code === 200){
        this.$message.success('发送邮件成功,请注意查收');
        this.ruleForm = {};
        this.$router.replace('/login');
      }
    }
  }
}
</script>

<style scoped>
  .findpassword {
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