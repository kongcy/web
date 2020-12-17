<template>
  <div id="imageShowDialog" class="custom-dialog" style="z-index: 2000;position:absolute;top: 0px;">
    <div class="el-dialog" :style="'width:'+dialogWidth+'px;'" :aria-label="dialogTitle">
      <div class="el-dialog__header">
        <span class="el-dialog__title">{{dialogTitle}}</span>
        <button type="button" class="el-dialog__headerbtn" @click="closeDialog">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </button>
      </div>
      <div class="el-dialog__body">
        <div id="imageShowContainer" :style="'height:'+dialogHeight+'px'"></div>
      </div>
      <div class="el-dialog-rightMenu">
        <div class="button screenOne" title="一分屏" @click="handleClick('screenOne')"></div>
        <div class="button screenTwo" title="二分屏" @click="handleClick('screenTwo')"></div>
        <div class="button screenFour" title="四分屏" @click="handleClick('screenFour')"></div>
        <div class="button screenSix" title="六分屏" @click="handleClick('screenSix')"></div>
        <div class="button screenNine" title="九分屏" @click="handleClick('screenNine')"></div>
        <div class="button stopAll" title="全部停止" @click="handleClick('stopAll')"></div>
        <div class="button enlarge" title="放大" v-show="!isEnlarge" @click="enlargeDialog"></div>
        <div class="button narrow" title="缩小" v-show="isEnlarge" @click="narrowDialog"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";
export default {
  data() {
    return {
      currentUser: null,
      visible: true,
      dialogTitle: "图像输出",
      dialogWidth: 200,
      dialogHeight: 200,
      isEnlarge: true
    };
  },
  mounted() {
    this.currentUser = xtxk.cache.get("USER") || {};
    //事件
    window.onSessionEvent = this.onSessionEvent;
    window.onBtnEvent = this.onBtnEvent;
    //默认隐藏弹窗
    this.changeLayout(false);
  },
  methods: {
    showDialog(data) {
      let mediaServiceEnable = this.$store.getters.getMediaService;
      if (mediaServiceEnable == Enum.enumMediaService.Success) {
        this.$nextTick(() => {
          this.startBusiness(data);
        });
      } else {
        this.$notify({
          title: "插件注册服务失败",
          message: "不能发起业务操作",
          type: "warning",
          position: "bottom-right"
        });
      }
    },
    closeDialog() {
      this.isEnlarge = true;
      //this.apiSDK.stopPlayByIndex(0);
      this.apiSDK.stopAll();
      this.changeLayout(false);
    },
    startBusiness(data) {
      let nodeStatus = data.nodeStatus;
      let operateType = data.operateType;
      //console.log("-------------", nodeStatus, operateType)
      if (nodeStatus == "person_online" && operateType == "call") {
        Fun.startCallPerson(this, data, this.currentUser.userName, false);
      } else if (nodeStatus == "person_online") {
        Fun.startPlayPerson(this, data);
      } else if (nodeStatus == "device_online") {
        Fun.startPlayDevice(this, data);
      }
    },
    changeLayout(isShow) {
      if (isShow) {
        this.visible = true;
        var screenWidth = document.body.clientWidth; //页面宽
        var screenHeight = document.body.clientHeight; //页面高
        var resourWidth = document.getElementById("resourceWidget").offsetWidth; //组织架构宽
        var dialogWidth = parseInt(screenWidth - resourWidth - 400); //弹窗主体
        var dialogHeight = parseInt((dialogWidth * 9) / 16); //宽高 16：9
        var headeHeight = document.querySelector(".el-dialog__header").offsetHeight; //弹窗头部高度
        var rightMenuHeight = document.querySelector(".el-dialog-rightMenu").offsetWidth; //操作栏宽度

        var dialogLeft = (screenWidth - dialogWidth - resourWidth) / 2;
        var dialogTop = (screenHeight - dialogHeight - 100) / 2;
        let elObj = document.getElementById("imageShowDialog");
        
        if (this.isEnlarge) {
        //  elObj.style = "z-index: 2000;position:absolute;";
          elObj.style.zIndex = "2000";
          elObj.style.position = "absolute"
          elObj.style.top = dialogTop + "px";
          elObj.style.left = dialogLeft + "px";
          this.dialogWidth = dialogWidth;
          this.dialogHeight = dialogHeight;
          //console.log(this.dialogWidth - rightMenuHeight, this.dialogHeight - headeHeight, "=============")
          this.apiSDK.changeSizeForPlugin( this.dialogWidth - rightMenuHeight, this.dialogHeight - headeHeight );
        } else {
          let leftMenu = document.querySelector(".left_menu").offsetWidth;
        //  elObj.style = "z-index: 2000;position:absolute;";
          elObj.style.zIndex = "2000";
          elObj.style.position = "absolute"
          elObj.style.bottom = "5px";
          elObj.style.left = (leftMenu + 5) + "px";

          this.dialogWidth =  parseInt((280 * 16) / 9) + rightMenuHeight;
          this.dialogHeight = 280;
          this.apiSDK.changeSizeForPlugin( parseInt((280 * 16) / 9), 280 );
        }
      } else {
        this.visible = false;
        let elObj = document.getElementById("imageShowDialog");
        elObj.style.left = "10000px";
      }
    },
    //窗口大小变动
    resize() {
      if (this.visible) {
        this.changeLayout(true);
      }
    },
    initMXTC: function(width, height) {
      //初始化插件
      if ( this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5 ) {
        this.$store.commit("setMediaService", Enum.enumMediaService.Success);
      } else if ( this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion6 ) {
        this.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
      }
      setTimeout(() => {
        this.apiSDK.initMXTC("imageShowContainer", width, height, this.onBtnEvent, this.onSessionEvent);
        this.initMedia();
      }, 2000);
    },
    initMedia: function() {
      let that = this;
      var sipInfo = xtxk.cache.get("SIPINFO");
      if (sipInfo) {
        //刷新时，用缓存的sip信息注册插件
        var sipInfo = xtxk.cache.get("SIPINFO");
        this.apiSDK.registerForPlguin(sipInfo);
      } else {
        //初始化媒体
        this.apiSDK.publishInitMediaByCustom();
      }

      //回调
      this.apiSDK.setInformInitMediaCallback(function(obj) {
        //SIPID:"",serverID:"",serverIP:"",serverPort:"", clientPassword:""
        console.log("收到媒体初始化反馈------");
        if (obj && obj.serverIP) {
          let mediaServiceEnable = that.$store.getters.getMediaService;
          if (
            mediaServiceEnable == Enum.enumMediaService.Success ||
            mediaServiceEnable == Enum.enumMediaService.Registering
          ) {
            that.$store.commit(
              "setMediaService",
              Enum.enumMediaService.Unregister
            );
            that.apiSDK.unregisterForPlugin();
          }
          var info = {
            userName: obj.SIPID,
            pwd: obj.clientPassword,
            ip: obj.serverIP,
            port: obj.serverPort
          };
          that.$store.commit(
            "setMediaService",
            Enum.enumMediaService.Registering
          );
          xtxk.cache.set("SIPINFO", info);
          that.apiSDK.registerForPlguin(info);
        }
      });

      this.apiSDK.setInformStartMediaByLocalCallback(obj => {
        console.log("收到开启媒体(软解)");
        if (obj) {
          that.apiSDK.startPlayForPlugin(
            obj.screenIndex,
            obj.videoRTPId || "",
            obj.audioRTPId || "",
            obj.encoderSipID,
            obj.localVPort,
            obj.fIPS,
            obj.fCH,
            0,
            obj.resId,
            obj.resCh,
            "",
            obj.resType
          );

          if (this.visible == false) {
            this.changeLayout(true);
          }
        }
      });

      this.apiSDK.setInformStopMediaByLocalCallback(function(obj) {
        console.log("收到停止媒体(软解)");
        if (obj) {
          that.apiSDK.stopPlayForPlugin(obj.screenIndex);
        }
      });

      this.apiSDK.setInformSplitScreenByLocalCallback(function (obj) {
          console.log("收到分屏(软解)");
          if (obj) {
            that.apiSDK.splitWidowForPlugin(obj.splitType)
          }
      });

      this.apiSDK.setInformFullScreenByLocalCallback(function(obj) {
        console.log("收到全屏(软解)");
        if (obj) {
          that.apiSDK.setFullScreenForPlugin(obj.screenIndex, obj.isFullScreen);
        }
      });

      //osd
      this.apiSDK.setInformOsdStatusCallback(function(obj) {
        if (obj) {
          obj.forEach(function(item) {
            //字号转像素
            let fontSize = Fun.filterForFontSize(item.fontSize);
            that.apiSDK.setOSDForPlugin(
              item.screenIndex,
              item.osdIndex,
              item.caption,
              item.fontColor,
              item.bold,
              item.italic,
              item.width,
              item.height,
              item.relativeX,
              item.relativeY,
              item.basePoint,
              fontSize,
              item.fontFamily
            );
          });
        }
      });
    },

    //播放器回调
    //eventType: 0, status_code: 1 播放；0 停止播放；-1 断流
    //eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
    onSessionEvent: function(eventType, sessionid, status_code, msg, wgtpos) {
      console.log(
        "播放器回调------eventType:" +
          eventType +
          "--sessionid：" +
          sessionid +
          "--status_code:" +
          status_code +
          "--msg:" +
          msg +
          "--wgtpos:" +
          wgtpos
      );
      if (eventType == 0) {
        switch (status_code) {
          case 1: //点播成功
            // let curObj = this.currentPlayScreens.find(item => wgtpos == item.screenIndex)
            // if (curObj) this.apiSDK.sendForceIFrame(curObj.resId, curObj.resCh, curObj.resType);
            break;
          case 0: //点播失败
            // this.apiSDK.stopPlayByIndex(wgtpos);
            break;
          case -1:
            break;
        }
      } else if (eventType == 1) {
        switch (status_code) {
          case 2:
            break; //注销成功
          case 1: {
            //注册成功
            this.$store.commit(
              "setMediaService",
              Enum.enumMediaService.Success
            );
            break;
          }
          case -1:
            this.$store.commit(
              "setMediaService",
              Enum.enumMediaService.Unregister
            );
            break; //注册失败
          case -2:
            break;
          case -3:
            break;
        }
      }
    },
    //播放器按钮回调事件
    //wgtpos:窗口索引，btnpos：按钮索引
    onBtnEvent: function(wgtpos, isLeft, btnpos, btnkey) {
      console.log("播放器点击按钮回调-------", wgtpos, isLeft, btnpos, btnkey);
      if (btnkey == "Nor_StopPlay") {
        //停止视频
        this.apiSDK.stopPlayByIndex(wgtpos);
      } else if (btnkey == "Nor_VolOn") {
        //关声音
        this.apiSDK.publishVolume(wgtpos, false, 0);
      } else if (btnkey == "Nor_VolOff") {
        //开声音
        this.apiSDK.publishVolume(wgtpos, true, 255);
      } else if (btnkey == "Volume_Progress") {
        //声音值调节
      } else if (btnkey == "Nor_PTZ") {
        //云台
      } else if (btnkey == "Nor_FullScreen") {
        //全屏
        this.apiSDK.setFullScreenForPlugin(wgtpos, true);
        this.apiSDK.changeButtonForPlugin(
          wgtpos,
          isLeft,
          btnpos,
          "Nor_CancelFull"
        );
      } else if (btnkey == "Nor_CancelFull") {
        this.apiSDK.setFullScreenForPlugin(wgtpos, false);
        this.apiSDK.changeButtonForPlugin(
          wgtpos,
          isLeft,
          btnpos,
          "Nor_FullScreen"
        );
      }
    },
    //缩小
    narrowDialog() {
      this.isEnlarge = !this.isEnlarge;
      this.changeLayout(true);
    },
    //放大
    enlargeDialog() {
      this.isEnlarge = !this.isEnlarge;

      this.changeLayout(true);
    },
    handleClick(type){
        var param = 4;
				if(type == "stopAll"){
          this.apiSDK.stopAll();
        } else {
          if(type == "screenOne"){
            param = 1;
          }else if(type == "screenTwo"){
            param = 12;
          }else if(type == "screenFour"){
            param = 4;
          }else if(type == "screenSix"){
            param = 100;
          }else if(type == "screenNine"){
            param = 9;
          }
          this.apiSDK.splitWidowForPlugin(param);
          this.apiSDK.publishSplitScreen(param);
        }
    }
  },
  destroyed: function() {}
};
</script>
<style scoped>
#imageShowDialog {
  background-color: #dbf0fe;
}
/deep/.custom-dialog .el-dialog__body {
  width: calc(100% - 40px);
  padding: 0px;
  float: left;
  display: inline-block;
}
.el-dialog-rightMenu {
  width: 40px;
  float: left;
  display: inline-block;
}
div.button {
  width: 100%;
  height: 40px;
  cursor: pointer;
}
/* 一分屏 */
div.screenOne {
  background: url(../../../static/main/screen/screenOne.png) no-repeat;
}
div.screenOne:hover {
  background: url(../../../static/main/screen/screenOne_active.png) no-repeat;
}
/* 二分屏 */
div.screenTwo {
  background: url(../../../static/main/screen/screenTwo.png) no-repeat;
}
div.screenTwo:hover {
  background: url(../../../static/main/screen/screenTwo_active.png) no-repeat;
}
/* 四分屏 */
div.screenFour {
  background: url(../../../static/main/screen/screenFour.png) no-repeat;
}
div.screenFour:hover {
  background: url(../../../static/main/screen/screenFour_active.png) no-repeat;
}
/* 六分屏 */
div.screenSix {
  background: url(../../../static/main/screen/screenSix.png) no-repeat;
}
div.screenSix:hover {
  background: url(../../../static/main/screen/screenSix_active.png) no-repeat;
}
/* 九分屏 */
div.screenNine {
  background: url(../../../static/main/screen/screenNine.png) no-repeat;
}
div.screenNine:hover {
  background: url(../../../static/main/screen/screenNine_active.png) no-repeat;
}
/* 放大 */
div.enlarge {
  background: url(../../../static/map/enlarge.png) no-repeat;
}
div.enlarge:hover {
  background: url(../../../static/map/enlarge-act.png) no-repeat;
}
/* 缩小 */
div.narrow {
  background: url(../../../static/map/narrow.png) no-repeat;
}
div.narrow:hover {
  background: url(../../../static/map/narrow-act.png) no-repeat;
}
/* 全部停止 */
div.stopAll {
	background:url(../../../static/main/screen/stopAll.png) no-repeat;
}
div.stopAll:hover {
	background:url(../../../static/main/screen/stopAll_active.png) no-repeat;
}
</style>