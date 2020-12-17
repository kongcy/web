<template>
  <div id="divContainer_Monitor">
    <div id="divMain_Monitor" :style="mainStyle">
       <!-- 云台控制 -->
      <div class="divHolderControl"   v-show="isShowHolderC"  :style="holderControlStyle">
         <HolderControl ref="holderControl" />
      </div>
      <div id="divImageContent_Monitor" :style="imageContentStyle">
        <div id="divImageShow_Monitor" :style="imageShowStyle">
          <div class="toLeft" :class="isShowResource?'':'toLeft_R'"  @click="expendResource"></div>
          <div class="toRight" :class="isShowHolderC?'':'toRight_L'" @click="expendTogetherHolder"></div>
          <image-show ref="imageShow" />
        </div>
        <div id="divImageBottomNav_Monitor" :style="imageFooterStyle">
           <image-bottom-nav ref="imageBottomNav" />
        </div>
      </div>
      
      <div id="divResourceArea_Monitor" v-show="isShowResource" :style="resourceAreaStyle">
        <resource-container3 ref="resourcecontainer" />
      </div>
     
    </div>
  </div>
</template>

<script>
import ImageNav from "@/components/home/layout/ImageNav.vue";
import ImageShow from "@/components/home/layout/ImageShow.vue";
import ImageOperate from "@/components/home/layout/ImageOperate.vue";
import ImageBottomNav from "@/components/home/layout/ImageBottomNav.vue";//wxx 2020.11.10
import ResourceContainer from "@/components/home/ResourceContainer.vue";
import ResourceContainer3 from "@/components/home/ResourceContainer3.vue";
import HolderControl from "@/components/home/HolderControl.vue";//云台控制组件
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import { clearInterval } from "timers";
import { playerSDKNew } from '@/sdk/player/playerSDK'

export default {
  name: "HomeContainer",
  components: {
    ImageNav,
    ImageShow,
    ImageOperate,
    ImageBottomNav,
    ResourceContainer3,
    ResourceContainer,
    HolderControl
  },
  data() {
    return {
      headerStyle: "",
      footerStyle: "",
      mainStyle: "",
      resourceAreaStyle: "",
      //图像底部区域
      imageFooterStyle   : '',
      //图像区域
      imageContentStyle: "",
      //图像左侧区域
      // imageNavStyle: "",
      //图像操作区域
      // imageOperateStyle: "",
      //图像显示区域
      imageShowStyle: "",
      imageShowWidth: 0,
      imageShowHeight: 0,
     //云台控制区域
      holderControlStyle:'',
      isShowHolder:true,
      isShowHolderC:false,
      isShowResource:true,
      
    }
  },
  mounted() {
    const self = this;
    //渲染页面
    this.initLayout();

    //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (self.apiSDK.socketStatus != -1) {
      //媒体
      self.$refs.imageShow.initMXTC(self.imageShowWidth, self.imageShowHeight, "MonitorId");
      //资源树
      self.$refs.resourcecontainer.initTree();
    }
    //socket状态
    this.apiSDK.setSocketReconnectCallback("main", obj => {
      if (obj.state == -1) {
        //断开
        //将所有树状态变为离线
        self.$refs.resourcecontainer.offline();
        //停止所有图像
        self.apiSDK.stopPlayAllForPlugin();
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
        //重连
        //资源树
        self.$refs.resourcecontainer.initTree();
      } else if (obj.state == 1) {
        //首次
        //媒体
        self.$refs.imageShow.initMXTC(
          self.imageShowWidth,
          self.imageShowHeight
        );
        //资源树
        self.$refs.resourcecontainer.initTree();
      }
    });

    // 事件
    window.addEventListener("resize", this.resize);


    // let beforeUnloadTime = 0,gapTime=0;
    // window.onunload = function(){
    //     gapTime = new Date().getTime() - beforeUnloadTime
    //     if(gapTime<=5){
    //         //停止定时器
    //         clearInterval(this.Timer);
    //         clearInterval(this.tokenTime);
    //         // 退出
    //         this.apiSDK.publishLeave(function(){});
    //         // 关闭点播
    //         this.apiSDK.stopAll();
    //     }
    // }
    let that = this;
    window.onbeforeunload = function(){
        that.$message.closeAll();
    };
    this.openMeeting();
  },
  methods: {
    // 视频插件 点击开启会议回调
    openMeeting(){
      playerSDKNew.setPlayerBtnEventCallback((screenIndex, btnKey) => {
         debugger;
      });
    },
    // 分时防抖函数
    debounce(event, time) {
      let timer = null;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          event.apply(this, args);
        }, time);
      };
    },
    //窗口大小变动
    resize() {
      let self = this;
      self.initLayout();
      self.apiSDK.changeSizeForPlugin(
        self.imageShowWidth,
        self.imageShowHeight
      );
      // self.debounce(function() {
      //   self.initLayout();
      //   self.apiSDK.onChangeSizeForPlugin(self.imageShowWidth, self.imageShowHeight);
      // }, 200)();
    },
    //初始化布局
    initLayout() {
     
      var screenWidth = document.body.clientWidth;
      // var screenWidth        = window.screen.width;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
      var headerHeight = 72;
      var footerWidth = screenWidth;
      var footerHeight =0;
      var mainWidth = screenWidth;
      // var mainHeight = screenHeight - headerHeight - footerHeight;
      var mainHeight = screenHeight;

      //资源区域
      var resourceAreaWidth = this.isShowResource?414+24:0;
      var resourceAreaHeight = mainHeight;
      //云台控制区域 11.23
      var holderControlWidth=this.isShowHolderC?412+24:0;
      var holderControlHeight=mainHeight;

      var paddingW=40;
      var margigMiddle=this.isShowHolderC?40:20;
      //图像底部区域
      var imageFooterWidth   = mainWidth - resourceAreaWidth-holderControlWidth-paddingW;
      var imageFooterHeight  = 58;
      //图像区域
      var imageContentWidth = mainWidth - resourceAreaWidth-holderControlWidth;
      var imageContentHeight = mainHeight;
      //图像左侧区域
      // var imageNavWidth = 40;
      var imageNavWidth = 0;
      var imageNavHeight = imageContentHeight;
      //图像操作区域
      // var imageOperateWidth = 40;
       var imageOperateWidth = 0;
      var imageOperateHeight = imageContentHeight;
      //图像显示区域
      var imageShowWidth =imageContentWidth - imageNavWidth - imageOperateWidth-paddingW;
      var imageShowHeight = imageContentHeight-imageFooterHeight;
      //解码器控制区
      // var decoderHeight = 240;
      // // let $decoderControl = document.querySelector("#decoderControl");
      // let $decoderControl = document.querySelector("#decoderControl");
      // if ($decoderControl) {
      //   // $decoderControl.style = "width:" + imageShowWidth + "px";
      //    $decoderControl.style.width = "" + imageShowWidth + "px"
      //   imageShowHeight = imageShowHeight - decoderHeight;
      // }
  
      this.headerStyle ="width:" + headerWidth + "px" + ";height:" + headerHeight + "px";
      this.footerStyle ="width:" + footerWidth + "px" + ";height:" + footerHeight + "px";
      this.mainStyle ="width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
      this.resourceAreaStyle ="width:" +resourceAreaWidth +"px" +";height:" +resourceAreaHeight +"px";
      this.holderControlStyle="width:" +holderControlWidth +"px" +";height:" +holderControlHeight +"px";
      //图像底部区域
      this.imageFooterStyle='width:' + imageFooterWidth  + 'px' + ';height:' + imageFooterHeight  + 'px';
      //图像区域
      this.imageContentStyle ="width:" +imageContentWidth +"px" +";height:" +imageContentHeight +"px";
      //图像左侧区域
      this.imageNavStyle ="width:" + imageNavWidth + "px" + ";height:" + imageNavHeight + "px";
      //图像操作区域
      this.imageOperateStyle ="width:" +imageOperateWidth +"px" +";height:" +imageOperateHeight +"px";
      // 如果是有插件版的
      if (this.apiSDK.config.pluginVersion == 1) {
        // 根据浏览器的缩放比例 设置视频插件的宽高
        const getProportion = window.devicePixelRatio.toFixed(2);
        if (getProportion != 1) {
          imageShowWidth = imageShowWidth * getProportion;
          imageShowHeight = imageShowHeight * getProportion;
        }
      }
      //图像显示区域
      this.imageShowStyle ="width:" + imageShowWidth + "px" + ";height:" + imageShowHeight + "px";
      this.imageShowWidth = imageShowWidth-16;
      this.imageShowHeight = imageShowHeight-8-20-24;
    },
    //展开/隐藏资源
    expendResource(){
      this.isShowResource=!this.isShowResource;
      this.isShowHolderC=!this.isShowHolderC;
      this.resize();
    },
     //展开云台控制
    expendHolder(){
      // this.isShowHolder=true;
      this.isShowHolderC=true;
      this.isShowResource=false;
      this.resize();
    },
    //隐藏云台控制
    HideHolder(){
      // this.isShowHolder=false;
      this.isShowHolderC=false;
      this.isShowResource=true;
      this.resize();
      this.$refs.holderControl.closedDialog();
    },
    //展开/隐藏云台控制
    expendTogetherHolder(){
      this.isShowHolderC=!this.isShowHolderC;
       this.isShowResource=!this.isShowResource;
      this.resize();
    },
  
  },
  destroyed: function() {
    //注销事件
    window.removeEventListener("resize", this.resize);
  },
  beforeRouteLeave(to, from, next) {
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


    //注销插件
    //this.apiSDK.unInitMXTC();
    next();
  }
};
</script>

<style scoped>
#divContainer_Monitor {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  margin: 0px auto;
  /* padding: 20px 24px; */
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  height: calc(100% + 30px);
}
#divHeader {
  padding: 0px;
  margin: 0px;
}
#divFooter {
  padding: 0px;
  margin: 0px;
  color: #ffffff;
  background: #0f5794;
  /* height: 5px !important; */
  /* position: absolute; */
  /* bottom: 0; */
}
#divMain_Monitor {
  padding: 0px;
  margin: 0px;
  /* position: absolute; */
  /* height: calc(100% - 65px) !important; */
  /* overflow: hidden; */
}
#divImageContent_Monitor {
  float: right;
  padding: 20px 20px 22px 20px;
  box-sizing: border-box;
  margin:0px;
  height: 100%;
  width: calc(100% - 302px);
}
#divImageContent_Monitor,
#divImageContent_Monitor > div {
  /*height: 100% !important;*/
  /* background-color: #dbf0fe; */
}
#divImageOperate_Monitor,
#divImageNav_Monitor {
  width: 40px !important;
}
#divImageNav_Monitor {
  float: left;
  padding: 0px;
  margin: 0px;
}
div > div#divImageContent_Monitor > div#divImageShow_Monitor {
  float: left;
 padding: 0px;
  margin: 0px;
  /* zld 调整插件自适应所改 */
  height: 100% !important;
  position: relative;
  /* width: calc(100% - 84px) !important; */
  /* border: 1px solid #358bd5; */
  /* border-top: none; */
  /* border-bottom: none; */
}
#divImageFooter {
  padding: 0px;
  margin: 0px;
  color: #fff;
}
#divImageOperate_Monitor {
  float: right;
  padding: 0px;
  margin: 0px;
}
#divResourceArea_Monitor {
  float: left;
  
  padding: 20px 0 24px 24px;
  box-sizing: border-box;
  margin: 0px;
  height: 100% !important;
}
#divImageBottomNav_Monitor{
  position: absolute;
  bottom:52px;
  padding: 0px;
  margin: 0px;
}
.toLeft,.toRight{
  position:absolute;
  top: calc(50% - 20px);
  width:20px;
  height: 40px;
  cursor: pointer;
}
.toLeft{
  left:-20px;
  background: url(../../../static/common/toLeft.png) no-repeat center;
}
.toLeft:hover{
  left:-20px;
  background: url(../../../static/common/toLeft_active.png) no-repeat center;
}
.toRight{
  right:-20px;
  background: url(../../../static/common/toRight.png) no-repeat center;
}
.toRight:hover{
   right:-20px;
  background: url(../../../static/common/toRight_active.png) no-repeat center;
}
.divHolderControl{
  float:right;
  padding:20px 24px 24px 0;
  box-sizing: border-box;
}


.toLeft.toLeft_R{
  right:-20px;
  background: url(../../../static/common/toRight.png) no-repeat center;
}
.toLeft.toLeft_R:hover{
  right:-20px;
  background: url(../../../static/common/toRight_active.png) no-repeat center;
}

.toRight.toRight_L{
  right:-20px;
  background: url(../../../static/common/toLeft.png) no-repeat center;
}
.toRight.toRight_L:hover{
  right:-20px;
  background: url(../../../static/common/toLeft_active.png) no-repeat center;
}
</style>