<template>
    <div class="infoshow">
       <el-row type="flex" class="row-bg" justify="center">
           <el-col :span="8">
             <div class="user">
               <input type="file" name="file" accept=".jpg, .jpeg, .png" @change="uploadAvatar" ref="inputAvatar" hidden>
               <img :src="avatar" alt="" class="avatar" @click="changeAvatar"/>
             </div>
           </el-col>

           <el-col :span='16'>
               <div class="userinfo">
                  <div class="user-item">
                    <i class="fa fa-user"></i>
                   <span>{{user.name}}</span>
                  </div>
                  <div class="user-item">
                    <i class="fa fa-cog"></i>
                    <span>{{user.identity === 'manager' ? '管理员' : '学生'}}</span>
                  </div>
               </div>
           </el-col>
       </el-row>
    </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
  name: "infoshow",
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  data(){
    return{
      avatar:'/api/static/'+this.$store.getters.user.avatar
    }
  },
  methods:{
    uploadAvatar(avatar) {
      let file = avatar.target.files[0];
      let data = new FormData();
      if(file){
        data.append("file", file, file.name);//很重要 data.append("file", file);不成功
        // console.log(data.get('file'));
        this.axios.post("/api/user/avatar", data, {
          headers: { "content-type": "multipart/form-data" }
        }).then(res=>{
          this.$message.success("修改头像成功,请重新登录");
          this.$store.dispatch("clearCurrentState");
          localStorage.removeItem("eleToken");
          this.$router.push('/login');
        });
      }
    },
    changeAvatar(){
      this.$refs.inputAvatar.click();
    }
  }
};
</script>
<style scoped>
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.row-bg {
  width: 100%;
  height: 100%;
}
.user {
  text-align: center;
  position: relative;
  top: 30%;
}
.user img {
  width: 150px;
  border-radius: 50%;
}
.user span {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}
.userinfo {
  height: 100%;
  background-color: #eee;
}
.user-item {
  position: relative;
  top: 30%;
  padding: 26px;
  font-size: 28px;
  color: #333;
}
.user {
  text-align: center;
  position: relative;
  top: 30%;
}
.user img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>
