import axios from 'axios'
import { Loading, Message } from 'element-ui';
import router from './router'


let loading;
function startLoading() {
  loading=Loading.service({
    lock:true,
    text:'拼命加载中...',
    background:'rgba(0,0,0,0.7)'
  });
}

function endLoading() {
  loading.close();
}

//请求拦截
axios.interceptors.request.use(request=>{
  // 加载loading
  startLoading();

  if(localStorage.eleToken){
    request.headers.Authorization=localStorage.eleToken;
  }

  return request;

},err=>{
  return Promise.reject(error);
});


// 响应拦截
axios.interceptors.response.use(response=>{
  // 结束loading
  endLoading();
  return response;

},err=>{
  endLoading();
  Message.error(err.response.data);

  //获取状态码，如果状态码是401的话，那么就是未验证身份，那么就需要用户重新进行登录
  const {status}=err.response;
  if(status===401){
    Message.error("token已经失效，请重新进行登录");
    localStorage.removeItem("eleToken");
    router.push('/login');
  }

  return Promise.reject(err);
});

export default axios;