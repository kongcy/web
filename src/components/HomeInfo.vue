<template>
  <div id="divContainer">
    <div id="divMain" :style="mainStyle">
      <el-tabs id="hometabs" type="card"   @tab-remove="removeTab"  v-model="activeName" style="height:100%">
         <el-tab-pane name="Home"  style="height:100%">
             <span slot="label"><i class="tabicon tabicon_home"></i>首页</span>
             <home-index ref="homeIndex" @TabV="updateTabV" @ShowMeetingBtn="ShowMeetingFun" />
            
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
import HomeIndex from "@/components/home/HomeIndex.vue";
import Monitor from "@/components/home/Monitor.vue";
// import Meeting from "@/components/home/Meeting.vue";
import MeetingIndex from "@/components/home/MeetingIndex.vue";
import MeetingOutside from "@/components/home/MeetingOutside.vue";
import diagnose from "@/components/home/diagnose.vue";
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import { clearInterval } from "timers";
export default {
  name: "HomeContainerMonitor",
  components: {
    HomeIndex,
    Monitor,
    // Meeting,
    MeetingIndex,
    MeetingOutside,
    diagnose
  },
  data() {
    return {
      activeName: 'Home',
      // editableTabs: [{
      //     title: '首页',
      //     name: 'Home',
      //     content: 'HomeIndex',
      //     ref: 'HomeIndex',
      //     closable:false
         
      // }],
      editableTabs:[],
      // headerStyle: "",
      // footerStyle: "",
       mainStyle: "",
      // resourceAreaStyle: "",
      // //图像底部区域
      // // imageFooterStyle   : '',
      // //图像区域
      // imageContentStyle: "",
      // //图像左侧区域
      // imageNavStyle: "",
      // //图像操作区域
      // imageOperateStyle: "",
      // //图像显示区域
      // imageShowStyle: "",
      // imageShowWidth: 0,
      // imageShowHeight: 0,
    }
  },
  mounted() {
    const self = this;
    //渲染页面
    this.initLayout();
    //事件
    window.onSessionEvent = this.onSessionEvent;

    // //在其它页面刷新后再进入本页面时执行，此时socket已连接
    // if (this.apiSDK.socketStatus != -1) {
    //   //媒体
    //   self.$refs.imageShow.initMXTC(this.imageShowWidth, this.imageShowHeight);
    //   //资源树
    //   self.$refs.resourcecontainer.initTree();
    // }

    // //socket状态
    // this.apiSDK.setSocketReconnectCallback("main", obj => {
    //   if (obj.state == -1) {
    //     //断开
    //     //将所有树状态变为离线
    //     self.$refs.resourcecontainer.offline();
    //     //停止所有图像
    //     self.apiSDK.stopPlayAllForPlugin();
    //   } else if (obj.state == 2) {
    //     let deviceSipInfo = xtxk.cache.get('DEVICESIPINFO');
    //     let localSipInfo = xtxk.cache.get('LOCALSIPINFO');
    //     if(deviceSipInfo) {
    //       this.apiSDK.publishUserStatus(0, deviceSipInfo.sipid);
    //     } else if(localSipInfo) {
    //       this.apiSDK.publishUserStatus(0, localSipInfo.sipid);
    //     } else{
    //       self.apiSDK.publishUserStatus(0);
    //     }
    //     //重连
    //     //资源树
    //     self.$refs.resourcecontainer.initTree();
    //   } else if (obj.state == 1) {
    //     //首次
    //     //媒体
    //     self.$refs.imageShow.initMXTC(
    //       this.imageShowWidth,
    //       this.imageShowHeight
    //     );
    //     //资源树
    //     self.$refs.resourcecontainer.initTree();
    //   }
    // });


     //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (this.apiSDK.socketStatus != -1) {
      //媒体
      
          //初始化插件
        if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion5){
            self.$store.commit("setMediaService", Enum.enumMediaService.Success);
        }else if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion6){
            self.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
        }
      //  this.apiSDK.initMXTC()
       this.initMXTC();
        this.initMedia()
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
         //初始化插件
        if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5){
            this.$store.commit("setMediaService", Enum.enumMediaService.Success);
        }else if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion6){
            this.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
        }
        //媒体
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
            hasIndex=this.editableTabs.findIndex((v)=>{return v.name=='MeetingIndex'});
            if(hasIndex>-1){
              this.showremind("warning",'请关闭视频会商，再开启视频监控……')
            }
          }else if(value.name=="MeetingIndex"){
            hasIndex=this.editableTabs.findIndex((v)=>{return v.name=='Monitor'});
             if(hasIndex>-1){
              this.showremind("warning",'请关闭视频监控，再开启视频会商……')
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
    //直接显示会议
    ShowMeetingFun(value){
      console.log("123")
        var n=this.editableTabs.findIndex((v)=>{return v.name==value.name});
        if(n==-1){
          let hasIndex=-1;
          if(value.name=="MeetingIndex"){
            hasIndex=this.editableTabs.findIndex((v)=>{return v.name=='Monitor'});
             if(hasIndex>-1){
              this.editableTabs.splice(hasIndex,1);
            }
          }
          this.editableTabs.push(value)
          this.activeName=value.name
          xtxk.cache.set('activeName',this.activeName);
        }else{
          this.activeName=value.name
          xtxk.cache.set('activeName',this.activeName);
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
      // var screenWidth        = window.screen.width;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
      var headerHeight = 72;
      var footerWidth = screenWidth;
      // var footerHeight = 5;
      var footerHeight = 0;
      var mainWidth = screenWidth;
      // var mainHeight         = screenHeight - headerHeight - footerHeight - 100;
      var mainHeight = screenHeight - headerHeight - footerHeight;
      // //资源区域
      // var resourceAreaWidth = 300;
      // var resourceAreaHeight = mainHeight;
      // //图像底部区域
      // // var imageFooterWidth   = mainWidth - resourceAreaWidth;
      // // var imageFooterHeight  = 150;
      // //图像区域
      // var imageContentWidth = mainWidth - resourceAreaWidth;
      // // var imageContentHeight = mainHeight - imageFooterHeight;
      // var imageContentHeight = mainHeight;
      // //图像左侧区域
      // var imageNavWidth = 40;
      // var imageNavHeight = imageContentHeight;
      // //图像操作区域
      // var imageOperateWidth = 40;
      // var imageOperateHeight = imageContentHeight;
      // //图像显示区域
      // var imageShowWidth =imageContentWidth - imageNavWidth - imageOperateWidth;
      // var imageShowHeight = imageContentHeight;
      // //解码器控制区
      // var decoderHeight = 240;
      // let $decoderControl = document.querySelector("#decoderControl");
      // if ($decoderControl) {
      //   // $decoderControl.style = "width:" + imageShowWidth + "px";
      //    $decoderControl.style.width = "" + imageShowWidth + "px"
      //   imageShowHeight = imageShowHeight - decoderHeight;
      // }

      // this.headerStyle ="width:" + headerWidth + "px" + ";height:" + headerHeight + "px";
      // this.footerStyle ="width:" + footerWidth + "px" + ";height:" + footerHeight + "px";
      this.mainStyle = "width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
      // this.resourceAreaStyle ="width:" +resourceAreaWidth +"px" +";height:" + resourceAreaHeight +"px";
      // //图像底部区域
      // // imageFooterStyle   : 'width:' + imageFooterWidth  + 'px' + ';height:' + imageFooterHeight  + 'px';
      // //图像区域
      // this.imageContentStyle ="width:" +imageContentWidth +"px" +";height:" +imageContentHeight +"px";
      // //图像左侧区域
      // this.imageNavStyle ="width:" + imageNavWidth + "px" + ";height:" + imageNavHeight + "px";
      // //图像操作区域
      // this.imageOperateStyle ="width:" +imageOperateWidth +"px" +";height:" +imageOperateHeight +"px";
      // // 如果是有插件版的
      // if (this.apiSDK.config.pluginVersion == 1) {
      //   // 根据浏览器的缩放比例 设置视频插件的宽高
      //   const getProportion = window.devicePixelRatio.toFixed(2);
      //   if (getProportion != 1) {
      //     imageShowWidth = imageShowWidth * getProportion;
      //     imageShowHeight = imageShowHeight * getProportion;
      //   }
      // }
      // //图像显示区域
      // this.imageShowStyle ="width:" + imageShowWidth + "px" + ";height:" + imageShowHeight + "px";
      // this.imageShowWidth = imageShowWidth;
      // this.imageShowHeight = imageShowHeight;
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
/deep/ #hometabs > .el-tabs__content{
  height:100%;
  background:url(../../static/main/screen/bg.png) no-repeat center;
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

/deep/ .el-tabs--card>.el-tabs__header{
    position: fixed;
    z-index: 1000;
    top: 32px;
    left: 440px;
    width: calc(100% - 440px - 140px);
    border:none;
}
/* tab边框 */
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border:none;
}
/deep/  .el-tabs--card>.el-tabs__header .el-tabs__item{
   border:none;
   color:#fff;
   width:140px;
   text-align: center;
}
/deep/  .el-tabs--card>.el-tabs__header .el-tabs__item>span:first-child{
  display: inline-block;
    width: 94px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
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
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin: -6px 8px 0 0;
  background:url(../../static/home/home_title.png) no-repeat center;
  background-size: 100% 100%;
  background-size: 16px;
  
}
/deep/ .el-tabs__item.is-active .tabicon_home,
/deep/ .el-tabs__item:hover .tabicon_home{
  background:url(../../static/home/home_title_active.png) no-repeat center;
   background-size: 100% 100%;
  background-size: 18px;
}

/* 视频监控 */
.tabicon_Monitor{
  display: inline-block;
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../static/home/monitor_title.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
/deep/ .el-tabs__item.is-active .tabicon_Monitor,
/deep/ .el-tabs__item:hover .tabicon_Monitor{
  background:url(../../static/home/monitor_title_active.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
/* 视频会议 */
.tabicon_Meeting,.tabicon_MeetingOutside{
  display: inline-block;
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../static/home/meeting_title.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
/deep/ .el-tabs__item.is-active .tabicon_Meeting,
/deep/ .el-tabs__item:hover .tabicon_Meeting,
/deep/ .el-tabs__item.is-active .tabicon_MeetingOutside,
/deep/ .el-tabs__item:hover .tabicon_MeetingOutside{
  background:url(../../static/home/meeting_title_active.png) no-repeat center;
  background-size: 100% 100%;
  background-size: 19px;
}
/* 视频诊断 */
.tabicon_Meeting,.tabicon_VideoDiagnose{
  display: inline-block;
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../static/home/videoDiagnose_title.png) no-repeat center;
  background-size: 100% 100%;
  background-size: 19px;
}
/deep/ .el-tabs__item.is-active .tabicon_VideoDiagnose,
/deep/ .el-tabs__item:hover .tabicon_VideoDiagnose{
  background:url(../../static/home/videoDiagnose_title_active.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
/* 视频分析 */
.tabicon_Meeting,.tabicon_VideoAnalysis{
  display: inline-block;
  width:16px;
  height: 16px;
  vertical-align: middle;
  margin: -4px 5px 0 0;
  background:url(../../static/home/videoAnalysis_title.png) no-repeat center;
  background-size: 100% 100%;
  background-size: 19px;
}
/deep/ .el-tabs__item.is-active .tabicon_VideoAnalysis,
/deep/ .el-tabs__item:hover .tabicon_VideoAnalysis{
  background:url(../../static/home/videoAnalysis_title_active.png) no-repeat center;
    background-size: 100% 100%;
  background-size: 19px;
}
</style>