import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Register from '../views/Register'
import NotFound from '../views/404'
import Login from '../views/Login'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect:"/index"
  },
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFound
  }
];



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

//路由守卫
router.beforeEach((to,from,next)=>{
  const isLogin=!!localStorage.getItem("eleToken");

  if(to.path==='/login'||to.path==='/register'){
    next();
  }else{
    isLogin ? next():next('/login');
  }

});

export default router
