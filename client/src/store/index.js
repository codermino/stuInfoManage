import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
  isAuthenticated:false,
  user:{}
};

const getters={
  isAuthenticated:state=>state.isAuthenticated,
  user:state=>state.user
};

const mutations={
  set_authenticated(state,isAuthenticated){
    if(isAuthenticated){
      state.isAuthenticated=isAuthenticated;
    }else{
      state.isAuthenticated=false;
    }
  },

  set_user(state,user){
    if(user){
      state.user=user;
    }else{
      state.user={};
    }
  }
};

const actions={
  setAuthenticated:({commit},isAuthenticated)=>{
    commit('set_authenticated',isAuthenticated);
  },
  setUser:({commit},user)=>{
    commit('set_user',user);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
})
