<template>
  <div id="divContainer">
    <!-- :style="mainStyle" -->
    <div id="divMain" >
      <!-- :style="imageContentStyle" -->
      <div id="divImageContent" >
          <!-- :style="imageShowStyle" -->
        <div id="divImageShow" >
          <automatic-play ref="automaticPlay" />
        </div>
        <div id="divImageOperate" :style="imageOperateStyle" style="display: none;">
          <image-operate />
        </div>
      </div>
      <div id="divResourceArea" :style="resourceAreaStyle">
        <resource-container ref="resourcecontainer" />
      </div> 
    </div>
  </div>
</template>

<script>
import ImageNav from "@/components/home/layout/ImageNav.vue";
import ImageShow from "@/components/home/layout/ImageShow.vue";
import ImageOperate from "@/components/home/layout/ImageOperate.vue";
import ResourceContainer from "@/components/home/ResourceContainer.vue";
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import { clearInterval } from "timers";
import AutomaticPlay from "@/components/AutomaticPlay/ImageShow.vue"

export default {
  name: "HomeContainerPlay",
  components: {
    ImageNav,
    ImageShow,
    ImageOperate,
    ResourceContainer,
    AutomaticPlay
  },
  data() {
    return {
      headerStyle: "",
      footerStyle: "",
      mainStyle: "",
      resourceAreaStyle: "",
      //图像底部区域
      // imageFooterStyle   : '',
      //图像区域
      imageContentStyle: "",
      //图像左侧区域
      imageNavStyle: "",
      //图像操作区域
      imageOperateStyle: "",
      //图像显示区域
      imageShowStyle: "",
      imageShowWidth: 0,
      imageShowHeight: 0,
      form:{} // url参数
    }
  },
  mounted() {
    
    const self = this;
    //渲染页面
    this.initLayout();
    this.getUserAndPsw()
    //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (this.apiSDK.socketStatus != -1) {
      //媒体
      // self.$refs.imageShow.initMXTC(this.imageShowWidth, this.imageShowHeight);
      self.$refs.automaticPlay.initMXTC(this.imageShowWidth, this.imageShowHeight);
      
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
          this.apiSDK.setUserStatus('BusinessOnline', deviceSipInfo.sipid);// 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else if(localSipInfo) {
          // this.apiSDK.publishUserStatus(0, localSipInfo.sipid);
          this.apiSDK.setUserStatus('BusinessOnline', localSipInfo.sipid);// 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else{
          // self.apiSDK.publishUserStatus(0);
          this.apiSDK.setUserStatus('BusinessOnline');// 11.26 同步云调度 1124 用户状态上报从ws改成http
        }
        //重连
        //资源树
        self.$refs.resourcecontainer.initTree();
      } else if (obj.state == 1) {
        //首次
        //媒体
        self.$refs.automaticPlay.initMXTC(this.imageShowWidth, this.imageShowHeight);
        // self.$refs.imageShow.initMXTC(
        //   this.imageShowWidth,
        //   this.imageShowHeight
        // );
        //资源树
        self.$refs.resourcecontainer.initTree();
      }
    });

    // 事件
    window.addEventListener("resize", this.resize);
  },
  methods: {
    // 免插登录
    noPluginLogin(account){
        let that = this;
        this.apiSDK.noPluginLogin(account,(res)=>{
            that.apiSDK.playType = res.code
        })
    },
    // 通过url获取相关信息
    getUserAndPsw(){
        let url = window.location.href.split('?')[1];
        if( url ){
        let vars = url.split('&'); // 去掉问号, 问号为第一个字符
        for( let i = 0; i < vars.length; i++ ){
            let pair = vars[i].split('=');
            if( pair[0] === 'userName' ){ this.form.username = pair[1]; 
            this.noPluginLogin(this.form.username)}
            else if( pair[0] === 'passWord' ){ this.form.password = pair[1]; }
            else if( pair[0] === 'ip' ){ this.form.AutomaticPlayIp = pair[1]; }
            else if( pair[0] === 'strategeId' ){ this.form.AutomaticPlayStrategeId = pair[1]; }
            else if( pair[0] === 'resourceId' ){ this.form.AutomaticPlayResourceId = pair[1]; }
        }
        console.log('url获取的用户', this.form.username);
        }
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
      var headerHeight = 42;
      var footerWidth = screenWidth;
      var footerHeight = 5;
      var mainWidth = screenWidth;
      // var mainHeight         = screenHeight - headerHeight - footerHeight - 100;
      var mainHeight = screenHeight - headerHeight - footerHeight;
      //资源区域
      var resourceAreaWidth = 300;
      var resourceAreaHeight = mainHeight;
      //图像底部区域
      // var imageFooterWidth   = mainWidth - resourceAreaWidth;
      // var imageFooterHeight  = 150;
      //图像区域
      var imageContentWidth = mainWidth - resourceAreaWidth;
      // var imageContentHeight = mainHeight - imageFooterHeight;
      var imageContentHeight = mainHeight;
      //图像左侧区域
      // var imageNavWidth = 40;
       var imageNavWidth = 0;
      var imageNavHeight = imageContentHeight;
      //图像操作区域
      var imageOperateWidth = 40;
      var imageOperateHeight = imageContentHeight;
      //图像显示区域
      var imageShowWidth =
        imageContentWidth - imageNavWidth - imageOperateWidth;
      var imageShowHeight = imageContentHeight;
      //解码器控制区
      var decoderHeight = 240;
      let $decoderControl = document.querySelector("#decoderControl");
      if ($decoderControl) {
        // $decoderControl.style = "width:" + imageShowWidth + "px";
         $decoderControl.style.width = "" + imageShowWidth + "px"
        imageShowHeight = imageShowHeight - decoderHeight;
      }

      this.headerStyle =
        "width:" + headerWidth + "px" + ";height:" + headerHeight + "px";
      this.footerStyle =
        "width:" + footerWidth + "px" + ";height:" + footerHeight + "px";
      this.mainStyle =
        "width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
      this.resourceAreaStyle =
        "width:" +
        resourceAreaWidth +
        "px" +
        ";height:" +
        resourceAreaHeight +
        "px";
      //图像底部区域
      // imageFooterStyle   : 'width:' + imageFooterWidth  + 'px' + ';height:' + imageFooterHeight  + 'px';
      //图像区域
      this.imageContentStyle =
        "width:" +
        imageContentWidth +
        "px" +
        ";height:" +
        imageContentHeight +
        "px";
      //图像左侧区域
      this.imageNavStyle =
        "width:" + imageNavWidth + "px" + ";height:" + imageNavHeight + "px";
      //图像操作区域
      this.imageOperateStyle =
        "width:" +
        imageOperateWidth +
        "px" +
        ";height:" +
        imageOperateHeight +
        "px";
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
      this.imageShowStyle =
        "width:" + imageShowWidth + "px" + ";height:" + imageShowHeight + "px";
      this.imageShowWidth = imageShowWidth;
      this.imageShowHeight = imageShowHeight;
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
    
    const USER = xtxk.cache.get("USER");
    if(this.playType==1){
        this.noPluginLoginOut(USER.userName)
    }

    //注销插件
    //this.apiSDK.unInitMXTC();
    next();
  }
};
</script>

<style scoped>
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
#divMain {
  padding: 0px;
  margin: 0px;
  /* position: absolute; */
  /* height: calc(100% - 65px) !important; */
  overflow: hidden;
}
#divImageContent {
  float: right;
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: calc(100% - 302px);
}
#divImageContent,
#divImageContent > div {
  /*height: 100% !important;*/
  background-color: #dbf0fe;
}
#divImageOperate,
#divImageNav {
  width: 40px !important;
}
#divImageNav {
  float: left;
  padding: 0px;
  margin: 0px;
}
div > div#divImageContent > div#divImageShow {
  float: left;
  padding: 0px;
  margin: 0px;
  /* zld 调整插件自适应所改 */
  height: 100% !important;
  width: calc(100% - 84px) !important;
  border: 1px solid #358bd5;
  border-top: none;
  border-bottom: none;
}
#divImageFooter {
  padding: 0px;
  margin: 0px;
  color: #fff;
}
#divImageOperate {
  float: right;
  padding: 0px;
  margin: 0px;
}
#divResourceArea {
  display: none;
  float: left;
  padding: 0px;
  margin: 0px;
  height: 100% !important;
}
</style>