<template>
  <div class="check">
    <h1>正在验证...</h1>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: "Check",
  data(){
    return{
      token:''
    }
  },
  mounted() {
    this.token = this.$route.query.token;
    this.checkToken();
  },
  methods:{
    async checkToken() {
      const result = await this.axios.post(`http://127.0.0.1:3000/user/reset/${this.token}`);
      if (result.data.code === 200){
        localStorage.setItem('reset_token',this.token);
        this.$router.replace('/rpassword')
      }
    }
  }
}
</script>

<style scoped>

</style>