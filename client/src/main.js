import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http'
import VueAxios from 'vue-axios'
import swiper from 'swiper/dist/css/swiper.css' //需要在单独把这个css引入
import VueAwesomeSwiper from 'vue-awesome-swiper' //引入这个npm包
Vue.use(VueAwesomeSwiper);
import VueCropper from 'vue-cropper'
Vue.use(VueCropper);

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
