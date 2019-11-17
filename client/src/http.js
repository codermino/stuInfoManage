import axios from 'axios'
import { Loading, Message } from 'element-ui';


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
  return Promise.reject(err);
});

export default axios;