import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {}, //用户信息
    mediaServiceEnable: "unregister", //媒体服务是否可用
    decoderPos: '', // 解码器下标
    decoderMatrixId: '', //解码器ID
    cartographic: {}, //地图节点信息
    hasUnreadMsg: false, //即时通讯未读消息
  },
  //获取
  getters: {
    // this.$store.getters.getUserinfo;
    getUserinfo: function(state){
      return state.userinfo;
    },

    // this.$store.getters.getMediaService;
    getMediaService: function(state){
      return state.mediaServiceEnable;
    },

    // this.$store.getters.getDecoderPos;
    getDecoderPos: function(state){
      return state.decoderPos;
    },

    // this.$store.getters.getDecoderMatrixId;
    getDecoderMatrixId: function(state){
      return state.decoderMatrixId;
    },

    // this.$store.getters.getCartographic;
    getCartographic: function(state){
      return state.cartographic;
    },
    hasUnreadMsg: function(state){
      return state.hasUnreadMsg
    }
  },
  //更新
  mutations: {
    //清空,调用 this.$store.commit("clear");
    clear(state){
      state.userinfo = {};
      //state.mediaServiceEnable = 'unregister';
      state.decoderPos = '';
      state.decoderPos = '';
    },
    
    //调用 this.$store.commit("updateUserinfo", params);
    updateUserinfo(state, params){
      state.userinfo = params;
    },

    //调用 this.$store.commit("setMediaService", params);
    setMediaService(state, params){
      state.mediaServiceEnable = params;
    },

    //调用 this.$store.commit("setDecoderPos", params);
    setDecoderPos(state, params){
      state.decoderPos = params;
    },

    //调用 this.$store.commit("setDecoderMatrixId", params);
    setDecoderMatrixId(state, params){
      state.decoderMatrixId = params;
    },

    //调用 this.$store.commit("setCartographic", params);
    setCartographic(state, params){
      state.cartographic = params;
    },
    //调用 this.$store.commit("setHasUnreadMsg", params);
    setHasUnreadMsg(state, params){
      state.hasUnreadMsg = params;
    }
  }
})
