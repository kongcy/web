<template>
<!-- style="display: none;" -->
  <div id="divContainer" class="monitoringHome">
    <div id="divMain" :style="mainStyle">
      <el-tabs id="hometabs" type="card"   @tab-remove="removeTab"  v-model="activeName" style="height:100%;">
         <el-tab-pane name="Home"  style="height:100%;display: none;">
             <span slot="label"><i class="tabicon tabicon_home"></i>首页</span>
             <home-index ref="homeIndex" @TabV="updateTabV"  />
          </el-tab-pane>

          <el-tab-pane
              :key="item.name"
              v-for="item in editableTabs"
              :name="item.name"
              style="height:100%"
              :closable="item.closable"
            >
            <span slot="label"><i class="tabicon" :class="'tabicon_'+item.name"></i> {{item.title}}</span>
              <component  :is="item.content" :ref="item.ref" :data='item'></component>
          </el-tab-pane>
      </el-tabs> 

    </div>
  </div>
</template>

<script>
import HomeIndex from "@/components/monitoring/HomeIndex.vue";
import Monitor from "@/components/monitoring/Monitor.vue";

// import MeetingInfo from "@/components/home/MeetingInfo.vue";
// import MeetingOutside from "@/components/home/MeetingOutside.vue";

import Fun from "@/common/fun";
import Enum from "@/common/enum";
import { clearInterval } from "timers";
export default {
  name: "HomeInfo",
  components: {
    HomeIndex,
    Monitor,
    // Meeting,
    // MeetingInfo,
    // MeetingOutside
  },
  data() {
    return {
      activeName: 'Home',
      editableTabs:[],
      mainStyle: "",
    }
  },
  mounted() {
    const self = this;
    //渲染页面
    this.initLayout();
    //事件
    window.onSessionEvent = this.onSessionEvent;

     //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (this.apiSDK.socketStatus != -1) {
      //媒体
          //初始化插件
        if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion5){
            self.$store.commit("setMediaService", Enum.enumMediaService.Success);
        }else if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion6){
            self.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
        }
        console.log('主流-----1111');
        // this.apiSDK.initMXTC();
        this.initMXTC();
    }

    //socket状态
    this.apiSDK.setSocketReconnectCallback("main", obj => {
      if (obj.state == -1) {
      } else if (obj.state == 2) {
        let deviceSipInfo = xtxk.cache.get('DEVICESIPINFO');
        let localSipInfo = xtxk.cache.get('LOCALSIPINFO');
        if(deviceSipInfo) {
          // this.apiSDK.publishUserStatus(0, deviceSipInfo.sipid);
          this.apiSDK.setUserStatus('BusinessOnline', deviceSipInfo.sipid); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else if(localSipInfo) {
          // this.apiSDK.publishUserStatus(0, localSipInfo.sipid);
          this.apiSDK.setUserStatus('BusinessOnline', localSipInfo.sipid); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else{
          // self.apiSDK.publishUserStatus(0);
          this.apiSDK.setUserStatus('BusinessOnline'); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        }
      } else if (obj.state == 1) {
        //首次
        //媒体
        console.log('主流-----2222');
        this.initMXTC()
        this.initMedia()
      }
    });

    // 事件
    window.addEventListener("resize", this.resize);
  },
  methods: {
    initMXTC(){
      this.apiSDK.initMedia(self.onSessionEvent);
    },
    initMedia(){
      let that = this;
      var sipInfo = xtxk.cache.get('SIPINFO');
      if(sipInfo){
          //刷新时，用缓存的sip信息注册插件
          var sipInfo = xtxk.cache.get('SIPINFO');
          this.apiSDK.registerForPlguin(sipInfo);
      }else{
          //初始化媒体
          this.apiSDK.publishInitMediaByCustom();
      }
      
      //回调
      this.apiSDK.setInformInitMediaCallback(function(obj) {
          //SIPID:"",serverID:"",serverIP:"",serverPort:"", clientPassword:""
          console.log("收到媒体初始化反馈------")
          //businessSDK.publishSplitScreen(4);
          if (obj && obj.serverIP) {
              let mediaServiceEnable = that.$store.getters.getMediaService
              if(mediaServiceEnable == Enum.enumMediaService.Success || mediaServiceEnable == Enum.enumMediaService.Registering){
                  that.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
                  that.apiSDK.unregisterForPlugin();
              }
              var info = { userName: obj.SIPID, pwd: obj.clientPassword, ip: obj.serverIP, port: obj.serverPort };
              that.$store.commit("setMediaService", Enum.enumMediaService.Registering);
              console.log(that.$store.getters.getMediaService)
              xtxk.cache.set('SIPINFO', info);
              that.apiSDK.registerForPlguin(info);
          }
      });
    },

    //播放器回调
    //eventType: 0, status_code: 1 播放；0 停止播放；-1 断流
    //eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
    onSessionEvent: function(eventType, sessionid, status_code, msg, wgtpos) {
        console.log("播放器回调------eventType:" + eventType + "--sessionid：" + sessionid + "--status_code:" + status_code + "--msg:" + msg + "--wgtpos:" + wgtpos);
        // if (eventType == 0) {
        //     switch (status_code) {
        //         case 1: //点播成功
        //             let curObj = this.currentPlayScreens.find(item => wgtpos == item.screenIndex)
        //             if (curObj) this.apiSDK.sendForceIFrame(curObj.resId, curObj.resCh, curObj.resType);
        //             break;
        //         case 0: //点播失败
        //             // this.apiSDK.stopPlayByIndex(wgtpos);
        //             break;
        //         case -1: break;
        //     }
        // } else if (eventType == 1) {
        //     switch (status_code) {
        //         case 2:  break;//注销成功
        //         case 1:  this.$store.commit("setMediaService", Enum.enumMediaService.Success); break;//注册成功
        //         case -1: this.$store.commit("setMediaService", Enum.enumMediaService.Unregister); break;//注册失败
        //         case -2: break;
        //         case -3: break;
        //     }
        // }
        if (eventType == 1) {
          switch (status_code) {
              case 2:  break;//注销成功
              case 1:  this.$store.commit("setMediaService", Enum.enumMediaService.Success); break;//注册成功
              case -1: this.$store.commit("setMediaService", Enum.enumMediaService.Unregister); break;//注册失败
              case -2: break;
              case -3: break;
          }
        }
    },


     //关闭标签
     removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.activeName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }else{
                activeName ="Home";
              }
            }
          });
        }
        this.activeName = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        xtxk.cache.set('activeName',this.activeName);


          //取消订阅
        var subscribeType = Enum.enumSubscribeType.main;
        const subIDs = new Array(
          subscribeType.subscribeOrganizationUser,
          subscribeType.subscribeUsersStatus,
          subscribeType.subscribeUsersStatusByKey,
          subscribeType.subscribeUsersStatusByStatus,
          subscribeType.subscribeOrganizationDevice,
          subscribeType.subscribeDevicesStatus,
          subscribeType.subscribeDevicesStatusByKey,
          subscribeType.subscribeDevicesStatusByStatus,
          subscribeType.subscribeCommonResources,
          subscribeType.subscribeCommonResourcesByKey,
          subscribeType.subscribeCommonResourcesByStatus
        );
        this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
        //停止所有业务
       this.apiSDK.stopAll();
      },
    //更新首页tab标签
    updateTabV(value){
      if(value.name!='waiting'){
        var n=this.editableTabs.findIndex((v)=>{return v.name==value.name});
        if(n==-1){
          let hasIndex=-1;
          if(value.name=="Monitor"){
            hasIndex=this.editableTabs.findIndex((v)=>{return v.name=='Meeting'});
            if(hasIndex>-1){
              this.showremind("warning",'请关闭视频会议，再开启视频监控……')
            }
          }else if(value.name=="Meeting"){
            hasIndex=this.editableTabs.findIndex((v)=>{return v.name=='Monitor'});
             if(hasIndex>-1){
              this.showremind("warning",'请关闭视频监控，再开启视频会议……')
              // this.editableTabs.splice(hasIndex,1);
            }
          }
          if(hasIndex==-1){
            this.editableTabs.push(value)
            this.activeName=value.name
            xtxk.cache.set('activeName',this.activeName);
          }
        }else{
          this.activeName=value.name
          xtxk.cache.set('activeName',this.activeName);
        }
      }else{
        // this.showremind("warning",'此模块开发中……')
      }
    
    },
    // // 分时防抖函数
    // debounce(event, time) {
    //   let timer = null;
    //   return function(...args) {
    //     clearTimeout(timer);
    //     timer = setTimeout(() => {
    //       event.apply(this, args);
    //     }, time);
    //   };
    // },
    // //窗口大小变动
    resize() {
      let self = this;
      self.initLayout();
      // self.apiSDK.changeSizeForPlugin(
      //   self.imageShowWidth,
      //   self.imageShowHeight
      // );
      // // self.debounce(function() {
      // //   self.initLayout();
      // //   self.apiSDK.onChangeSizeForPlugin(self.imageShowWidth, self.imageShowHeight);
      // // }, 200)();
    },
    // //初始化布局
    initLayout() {
      var screenWidth = document.body.clientWidth;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
      var headerHeight = 72;
      var footerWidth = screenWidth;
      var footerHeight = 0;
      var mainWidth = screenWidth;
      var mainHeight = screenHeight - headerHeight - footerHeight;
      this.mainStyle = "width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
    },
    showremind(type,message){
      this.$notify({
        message: message,
        type: type,
      });
    },
  },
  destroyed: function() {
    //注销事件
     window.removeEventListener("resize", this.resize);
  },
  beforeRouteLeave(to, from, next) {
    //取消订阅
    // var subscribeType = Enum.enumSubscribeType.main;
    // const subIDs = new Array(
    //   subscribeType.subscribeOrganizationUser,
    //   subscribeType.subscribeUsersStatus,
    //   subscribeType.subscribeUsersStatusByKey,
    //   subscribeType.subscribeUsersStatusByStatus,
    //   subscribeType.subscribeOrganizationDevice,
    //   subscribeType.subscribeDevicesStatus,
    //   subscribeType.subscribeDevicesStatusByKey,
    //   subscribeType.subscribeDevicesStatusByStatus,
    //   subscribeType.subscribeCommonResources,
    //   subscribeType.subscribeCommonResourcesByKey,
    //   subscribeType.subscribeCommonResourcesByStatus
    // );
    // this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
    // //停止所有业务
    // this.apiSDK.stopAll();


    // //注销插件
    // //this.apiSDK.unInitMXTC();
    next();
  },
 
       
};
</script>

<style scoped>
.image{
  width:19px;
  height: 19px;
  margin: -3px 5px 0 0 ;
  display: inline-block;
  vertical-align: middle;
}
/deep/ .el-tabs__header{
  margin:0 0 0px!important;
}
/deep/  #hometabs > .el-tabs__content{
  height:100%;
  /* background:url(../../../static/main/screen/bg.png) no-repeat center; */
  background:url(../../../static/common/bg.png) no-repeat center;
}
#divContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  margin: 0px auto;
  padding: 0px;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}
#divMain {
  padding: 0px;
  margin: 0px;
  /* position: absolute; */
  /* height: calc(100% - 65px) !important; */
  overflow: hidden;
}

/* tab标签icon  */
/* /deep/  .monitoringHome  #hometabs > div.is-top {
     display: none !important;
} */
/deep/  .el-tabs--card > .el-tabs__header{
    position: fixed;
    z-index: 1000;
    top: 32px;
    left: 440px;
    width: calc(100% - 440px - 140px);
    border:none;
}
/* tab边框 */
/deep/   .el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close{
  font-size: 14px;
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border:none;
}
/deep/  .el-tabs--card>.el-tabs__header .el-tabs__item{
   border:none;
   color:#fff;
   width:158px;
   text-align: center;
}
/deep/  .el-tabs--card>.el-tabs__header .el-tabs__item>span:first-child{
    display: inline-block;
    width:113px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    font-size: 18px;
}
/deep/  #hometabs >.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:hover{
  background:#2e476f;
  color:#fff;
}

/* tab选中 */
/deep/  #hometabs >.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  background:#09275b;
  color:#fff;
}

 /* 首页 */
.tabicon_home{
  display: inline-block;
  width:20px;
  height: 20px;
  vertical-align: middle;
  margin: -6px 8px 0 0;
  background:url(../../../static/home/home_title.png) no-repeat center;
  /* background-size: 100% 100%;
  background-size: 20px; */
  
}
/deep/ .el-tabs__item.is-active .tabicon_home,
/deep/ .el-tabs__item:hover .tabicon_home{
  background:url(../../../static/home/home_title_active.png) no-repeat center;
   /* background-size: 100% 100%;
  background-size: 20px; */
}

/* 视频监控 */
.tabicon_Monitor{
  display: inline-block;
  width:20px;
  height: 20px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../../static/home/monitor_title.png) no-repeat center;
    /* background-size: 100% 100%;
  background-size: 19px; */
}
/deep/ .el-tabs__item.is-active .tabicon_Monitor,
/deep/ .el-tabs__item:hover .tabicon_Monitor{
  background:url(../../../static/home/monitor_title_active.png) no-repeat center;
    /* background-size: 100% 100%;
  background-size: 19px; */
}
/* 视频会议 */
.tabicon_Meeting,.tabicon_MeetingOutside{
  display: inline-block;
  width:20px;
  height: 20px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../../static/home/meeting_title.png) no-repeat center;
    /* background-size: 100% 100%;
  background-size: 19px; */
}
/deep/ .el-tabs__item.is-active .tabicon_Meeting,
/deep/ .el-tabs__item:hover .tabicon_Meeting,
/deep/ .el-tabs__item.is-active .tabicon_MeetingOutside,
/deep/ .el-tabs__item:hover .tabicon_MeetingOutside{
  background:url(../../../static/home/meeting_title_active.png) no-repeat center;
  /* background-size: 100% 100%;
  background-size: 19px; */
}
/* 视频诊断 */
.tabicon_Meeting,.tabicon_VideoDiagnose{
  display: inline-block;
  width:20px;
  height: 20px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../../static/home/videoDiagnose_title.png) no-repeat center;
  /* background-size: 100% 100%;
  background-size: 19px; */
}
/deep/ .el-tabs__item.is-active .tabicon_VideoDiagnose,
/deep/ .el-tabs__item:hover .tabicon_VideoDiagnose{
  background:url(../../../static/home/videoDiagnose_title_active.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
/* 视频分析 */
.tabicon_Meeting,.tabicon_VideoAnalysis{
  display: inline-block;
  width:20px;
  height: 20px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../../static/home/videoAnalysis_title.png) no-repeat center;
  background-size: 100% 100%;
  background-size: 19px;
}
/deep/ .el-tabs__item.is-active .tabicon_VideoAnalysis,
/deep/ .el-tabs__item:hover .tabicon_VideoAnalysis{
  background:url(../../../static/home/videoAnalysis_title_active.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
</style>