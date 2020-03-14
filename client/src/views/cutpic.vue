<template>
  <div class="upload_con">
    <el-dialog
      :title="title"
      :visible.sync="isShowUpload"
      @close="close"
      :width="dialogWidth+'px'"
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :close-on-click-modal="false">

      <div style="text-align:left">
        <el-button type="primary" round size="mini" @click="clickUpload" style="float: right;margin-right: 30px;">选择图片</el-button>
        <input
          type="file"
          ref="uploads"
          style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        >
        <span style="margin-left: 10px;">{{fielName}}</span>
      </div>

      <div class="cut clearfix">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          @realTime="realTime"
          @imgLoad="imgLoad"
          :high="option.high"
        ></vue-cropper>

        <div
          ref="preview"
          class="show-preview"
          :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}"
        >
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img" alt="图片">
          </div>
        </div>
      </div>

      <div class="test-button clearfix">
        <!-- <button @click="startCrop" v-if="!crap" class="btn">开始截图</button>
        <button @click="stopCrop" v-else class="btn">停止截图</button>
        <button @click="clearCrop" class="btn">清除截图</button>-->
        <el-button size="mini" @click="rotateLeft" icon="el-icon-refresh-left" typeof="primart">向左旋转</el-button>
        <el-button size="mini" @click="rotateRight" icon="el-icon-refresh-right" typeof="primart">向右旋转</el-button>
        <el-button size="mini" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
        <el-button size="mini" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="refreshCrop"></el-button>
        <el-button size="mini" @click="finish(fileType)">保存</el-button>
        <!-- <a @click="down('base64')" class="btn">download(base64)</a>
        <a @click="down('blob')" class="btn">download(blob)</a>-->
      </div>

    </el-dialog>
  </div>
</template>
<script>
import {VueCropper} from 'vue-cropper'

export default {
  name: 'cutpic',
  components: {
    VueCropper
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    showUpload: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      default: 'base64'
    }
  },
  //通过watch将父组件传递过来的参数转为data对象,因为不建议直接修改父组件传递过来的参数
  //不建议直接修改props中的属性
  watch:{
    showUpload:function(newVal,oldVal){
      this.isShowUpload = newVal;
    },
    previews:function (newVal,oldVal) {
      this.dialogWidth = 430 + 70 + newVal.w;
    }
  },
  data () {
    return {
      previewsW:0,
      dialogWidth:430,
      isShowUpload:false,
      modelSrc: '',
      crap: false,
      previews: {},
      fielName: '',
      option: {
        img: '',
        size: 1,
        outputType: 'png',
        info: true,
        canScale: true,
        full: false,
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        centerBox: false,
        high: true
      },
      show: true
    }
  },
  methods: {
    // 点击上传图片
    uploadImg (e, num) {
      const file = e.target.files[0];
      // console.log(file);
      this.fielName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.warning('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
      };
      reader.readAsArrayBuffer(file)
    },

    // 刷新重新裁剪
    refreshCrop () {
      this.$refs.cropper.refresh()
    },

    // 放大、缩小
    changeScale (num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num)
    },

    // 左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },

    // 右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 保存
    finish (type) {
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(async (data) => {
          // var img = window.URL.createObjectURL(data)
          // console.log(data);
          data.name = this.fielName;
          const formData = new FormData();
          formData.append("file", data);
          this.uploadToApi(formData);
        })
      } else {
        // 获取截图信息(base64位)
        this.$refs.cropper.getCropData(async (data) => {
          // 将base64转换成文件
          //将option中的图片清空，防止重复
          this.option.img = "";
          //将剪裁后base64的图片转化为file格式
          let file = this.convertBase64UrlToBlob(data);
          file.name = this.fielName;
          const formData = new FormData();
          formData.append("file", file);
          this.uploadToApi(formData);
        })
      }
    },
    // 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      let type = urlData.split(",")[0].match(/:(.*?);/)[1];
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: type });
    },

    //上传文件接口调用
    async uploadToApi(formData) {
      const result = await this.axios.post("/api/user/avatar2", formData, {
        headers: {"content-type": "multipart/form-data"}
      });
      this.fielName = '';
      this.isShowUpload = false;
      // console.log(result);
      if (!result) {
        this.$message.error('修改头像失败');
      } else {
        this.$message.success("修改头像成功,请重新登录");
        this.$store.dispatch("clearCurrentState");
        localStorage.removeItem("eleToken");
        this.$router.push('/login');
      }
    },

    imgLoad (msg) {
      // console.log(msg)
    },
    // 实时裁剪
    realTime (data) {
      this.previews = data;
      this.$set(this.previews, 'url', data.url)
    },

    close () {
      this.option.img = '';
      this.fielName = '';
      this.$emit('upload-close')
    },

    clickUpload(){
      this.$refs.uploads.click();
    }

  }
}
</script>
<style>
  .upload_con .cut {
    width: 100%;
    height: 220px;
    margin: 30px auto;
  }

  .upload_con .cut .vue-cropper {
    width: 430px;
    float: left;
    margin-right: 25px;
  }

  .upload_con .test-button {
    padding-right: 20px;
  }

</style>