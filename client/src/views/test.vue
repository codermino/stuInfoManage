<template>
  <div class="container">
<!--    <div style="width:100%;height:500px">-->
<!--      <vue-cropper ref="cropper" autoCrop img="https://shnhz.github.io/shn-ui/img/Koala.jpg" centerBox/>-->
<!--    </div>-->
<!--    <el-button @click="getData" ref="cropperButton" style="margin:10px 0" type="primary">获取截图后的图片</el-button>-->
    <el-button @click.prevent="openDialog">打开对话框</el-button>
    <croppershow :title="'裁剪图片'" :file-type="'base64'" :showUpload="showDialog" @upload-close="closeDialog" @save_file="savefile"></croppershow>
  </div>
</template>

<script>
import croppershow from './cutpic'
export default {
  name: "InfoShow2",
  components:{
    croppershow
  },
  data(){
    return{
      showDialog:false
    }
  },
  methods:{
    openDialog(){
      this.showDialog = true;
    },
    closeDialog(){
      this.showDialog = false;
    },
    savefile(file,filename){
      console.log(typeof file);
      // let data = new FormData();
      // if(file){
      //   data.append("file", file, filename);//很重要 data.append("file", file);不成功
      //   // console.log(data.get('file'));
      //   // console.log(data);
      //   this.axios.post("/api/user/avatar2", data, {
      //     headers: { "content-type": "multipart/form-data" }
      //   }).then(res=>{
      //     this.$message.success("图片上传成功");
      //   });
      // }
    }
    // getData() {
    //   this.$refs.cropper.getCropBlob((data) => {
    //     // do something
    //     console.log(data)
    //   })
    // }
  }
}
</script>

<style scoped>

</style>