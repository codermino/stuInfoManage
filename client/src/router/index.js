import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Register from '../views/Register'
import NotFound from '../views/NotFound/404'
import Login from '../views/Login'
import Home from '../views/Home'
import InfoShow from '../views/InfoShow'
import Score from '../views/Score/Score'
import Course from '../views/Course/Course'
import FindPassword from '../views/FindPassword'
import Check from '../views/Check'
import ResetPassword from "../views/ResetPassword";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect:"/index"
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children:[
      {path:'',component:Home},
      {path:'/home',name:'home',component:Home},
      {path:'/infoshow',name:'infoshow',component:InfoShow},
      {path:'/score',name:'score',component:Score},
      {path:'/course',name:'course',component:Course}
    ]
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
    path: '/fpassword',
    name: 'fpassword',
    component: FindPassword
  },
  {
    path: '/check',
    name: 'check',
    component: Check
  },
  {
    path: '/rpassword',
    name: 'rpassword',
    component: ResetPassword
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

  if(to.path==='/login'||to.path==='/register'||to.path === '/fpassword'||to.path === '/check'||to.path === '/rpassword'){
    next();
  }else{
    isLogin ? next():next('/login');
  }

});

export default router
