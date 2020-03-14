<template>
  <!--  <div class="home">-->
  <!--    <div class="container">-->
  <!--      <h1 class="title">米修在线</h1>-->
  <!--      <p class="lead"> 专注于线上教育, 用心做课程, 用心做服务! </p>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="container2">
    <swiper :options="swiperOption" ref="mySwiper" >
      <!-- slides -->
      <swiper-slide v-for="(item,index) in rowing" :key="index">
        <img :src="'/api/rowing/'+item" alt="" width="100%">
      </swiper-slide>
<!--      <div class="swiper-pagination"  slot="pagination"></div>-->
<!--      <div class="swiper-button-prev" slot="button-prev"></div>-->
<!--      <div class="swiper-button-next" slot="button-next"></div>-->
      <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
    </swiper>
  </div>

</template>

<script>
import s1 from '../assets/rowing/s1.png'
import s2 from '../assets/rowing/s2.png'
import s3 from '../assets/rowing/s3.png'
import s4 from '../assets/rowing/s4.png'
import s5 from '../assets/rowing/s5.png'
import s6 from '../assets/rowing/s6.png'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: "Index",
  created(){
    this.getRowing();
  },
  data() {
    return {
      picList:[s1, s2, s3, s4, s5, s6],
      rowing:[],
      swiperOption: { //更多的参数的配置看swiper4官网介绍：http://www.swiper.com.cn/api/navigation/210.html
        autoplay: {
          delay: 5000,//1秒切换一次
        },
        grabCursor: true,
        loop:true,
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
          clickable :true
        },
        effect : 'fade'
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods:{
    async getRowing() {
      const data = await this.axios.post('/api/commondata/rowing');
      if(data.data.code === 200){
        this.rowing.push(...data.data.data.readDir);
      }else {
        this.$message.warning('获取轮播图数据失败');
      }
    }
  }
}
</script>

<style scoped>
  /*.home {*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  background: url(../assets/showcase.png) no-repeat;*/
  /*  background-size: 100% 100%;*/
  /*}*/
  /*.container {*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  box-sizing: border-box;*/
  /*  padding-top: 100px;*/
  /*  background-color: rgba(0, 0, 0, 0.7);*/
  /*  text-align: center;*/
  /*  color: white;*/
  /*}*/
  /*.title {*/
  /*  font-size: 30px;*/
  /*}*/
  /*.lead {*/
  /*  margin-top: 50px;*/
  /*  font-size: 22px;*/
  /*}*/

  .container2{
    height: 100%;
    width: 100%;
  }

  .container2 >>> .swiper-wrapper{
    height: 100% !important;
  }

  .container2 >>> .swiper-slide{
    height: inherit !important;
  }

  .container2 >>> .swiper-container{
    height: 100%;
    width: 100%;
  }

  .container2 >>> .swiper-pagination-bullet-active{
    background: rgba(255,0,0,0.4);
  }


  >>> .swiper-pagination-bullet{
    width :14px;
    height :14px;
  }

  img{
    /*width: 100%;*/
    height: inherit;
    /*object-fit: cover;*/
  }

</style>