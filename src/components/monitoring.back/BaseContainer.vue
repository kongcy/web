<template>
  <section class="el-container is-vertical wrapper">
    <header class="header" style="display: none;">
      <header-area />
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer" style="display: none;"></footer>
    <show-message-dialog :ref="showMessageId" style="display: none;"/>
  </section>
</template>
<script>
import HeaderArea from "@/components/base/HeaderArea.vue";
import ShowMessageDialog from "@/components/receiveMessage/ShowMessageDialog"
export default {
  name: "BaseContainerMonitor",
  components: {
    HeaderArea,
    ShowMessageDialog
  },
  data() {
    return {
      leaveDialog: null,
      socketStatusDialog: null,
      alarmMessageList: [],
      showAlarmTimer: null,
      showMessageId: null,
      form: {}
    };
  },
//   beforeRouteEnter(to, from, next) {
//     const USER = xtxk.cache.get("USER");
//     // console.log('toName-----------',to.name)
//     // let whiteList = ['AutomaticPlay'];
//     // if(whiteList.indexOf(to.name) !== -1){
//     //   next()
//     // } else 
//     if (!USER || !USER.token) {
//       next({
//         path: "/Login"
//       });
//     } else {
//       next(true);
//     }
//   },
  created() {
    // this.getUserAndPsw();
    const USER = xtxk.cache.get("USER");
    this.apiSDK.initUserInfo(USER.userId, USER.userName, USER.token);
    //定时刷新token
    this.apiSDK.refreshToken(USER.validTime);
  },
  mounted() {
    const self = this;
    const organId = "";
    this.apiSDK.initSocket(function(obj) {});

    //弹窗消息
    // this.apiSDK.setInformShowMessageCallback(function(obj) {
    //   if (obj) {
    //     self.$confirm(obj.content, obj.title, {
    //         confirmButtonText: obj.submitText,
    //         cancelButtonText: obj.cancelText,
    //         type: "info",
    //         showClose: false,
    //         closeOnClickModal: false,
    //         center: true
    //       }).then(() => {
    //         obj.success();
    //       }).catch(() => {
    //         obj.cancel();
    //       });
    //   }
    // });
    //弹窗消息 Dialog
    this.apiSDK.setInformShowMessageCallback((obj) => {
      this.showMessageId = obj.sessionId;
      // console.log(this.showMessageId);
      this.$nextTick(() => {
        // console.log(this.$refs[obj.sessionId]);
        obj && this.$refs[obj.sessionId].showDialog(obj);
        // 30秒后超时关闭窗口
        // setTimeout(() => {
        //     console.log('呼叫超时关闭窗口--------------')
        //     this.$refs[obj.sessionId] && this.$refs[obj.sessionId].closeDialog();      
        // }, 30000)
      })
    });

    //通知消息
    this.apiSDK.setInformShowRemindCallback((obj) => {
      if (obj) {
        self.$notify({
          title: "提示",
          message: obj.text,
          position: "bottom-right",
          type: "warning",
          duration: 1000 //obj.closeTime
        });
      }
    });

    //声音消息
    this.apiSDK.setInformVoiceRemindCallback((obj) => {
      // console.log(this.$refs.showMessage.$refs[obj.sessionID])
      // 关闭呼叫弹框
      if (obj) {
        if (obj.isRemind == true) {
          //self.callAudioElement = document.querySelector("#callAudioElement")
          self.callAudioElement = new Audio("static/audioRes/MusicWait.mp3");
          // self.callAudioElement.loop = true;
          self.callAudioElement.play();
        } else {
          if (self.callAudioElement) self.callAudioElement.pause();
          self.$refs[obj.sessionID] && self.$refs[obj.sessionID].closeDialog();
        }
      }
    });

    //被迫下线
    this.apiSDK.setLeaveCallback(function(obj) {
      if (obj) {
        if (self.leaveDialog) return;
        self.leaveDialog = true;
        self.$confirm(obj.msg, "提示", {
            confirmButtonText: "确认",
            type: "info",
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            center: true
          }).then(() => {
            setTimeout(() => {
              self.leaveDialog = null;
              // self.apiSDK.publishLeave();
              const USER = xtxk.cache.get("USER");
              if(self.apiSDK.playType == 1){
                self.apiSDK.noPluginLoginOut(USER.userName)
              }
              self.$router.push("Login");
            }, 200);
          });
      }
    });

    //socket状态
    this.apiSDK.setSocketReconnectCallback("base", obj => {
      if (obj.state == -1) {
        //断开
        if (!self.socketStatusDialog) {
          //异常提示
          self.socketStatusDialog = self.$message({
            dangerouslyUseHTMLString: true,
            message: "<strong>与服务器连接断开，正在重连...</strong>",
            type: "error",
            duration: 0,
            showClose: true
          });
        }
      } else if (obj.state == 2) {
        //重连
        //关闭弹窗
        if (self.socketStatusDialog) {
          self.socketStatusDialog.close();
          self.socketStatusDialog = null;
          //成功提示
          self.$message({
            message: "与服务器重连成功！",
            type: "success",
            duration: 3000
          });
        }

        if ( this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5 ) {
          location.reload();
        }
      }
    });
    //刷新时，用缓存的软编信息注册,编码器设备上线上报
    let localSipInfo = xtxk.cache.get('LOCALSIPINFO');
    if (localSipInfo) {
      if (localSipInfo.type === 'softEncoder') {
        this.apiSDK.initEncoder(localSipInfo.sipid, localSipInfo.pwd, localSipInfo.ip, localSipInfo.port);
      }
    }
    //软编注册
    this.apiSDK.setInformInitMediaForEncoderCallback((obj) => {
        if (obj && obj.encoderSipId) {
          let sipid = obj.encoderSipId;
          let passwd = obj.encoderPassword;
          let ip = obj.encoderDomain;
          let port = obj.encoderPort;
          xtxk.cache.set('LOCALSIPINFO', { sipid: sipid, pwd: passwd, ip: ip, port: port, type: 'softEncoder' });
          this.apiSDK.initEncoder(sipid, passwd, ip, port);
          // this.apiSDK.publishUserStatus(0, obj.encoderSipId); // 11.26 同步云调度 1124 用户状态上报从ws改成http
          this.apiSDK.setUserStatus('BusinessOnline', obj.encoderSipId);// 11.26 同步云调度 1124 用户状态上报从ws改成http
        }
    });
    this.apiSDK.setInformInitMediaForBindingEncoderCallback(obj => {
      if (obj && obj.SIPID) {
        xtxk.cache.set('LOCALSIPINFO', { sipid: obj.SIPID, type: 'bindEncoder' });
        // this.apiSDK.publishUserStatus(0, obj.SIPID);// 11.26 同步云调度 1124 用户状态上报从ws改成http
        this.apiSDK.setUserStatus('BusinessOnline', obj.SIPID);// 11.26 同步云调度 1124 用户状态上报从ws改成http
      }
    });
    //滚动通知
    this.apiSDK.setReceiverNotificationCallback(function(obj) {
      if (obj && obj.length) {
        obj.forEach(item => {
          let direction =
            item.style.direction == "fromLeftToRight" ? "right" : "left";
          //content: "通知通知通知！！", fontFamily, fontSize, fontStyle, fontColor, direction, position, speed, time=0
          self.showMarqueeNotify(
            item.content,
            Fun.filterForFontFamily(item.style.fontFamlily),
            item.style.fontSize,
            item.style.fontStyle,
            `rgb(${item.style.fontColorR}, ${item.style.fontColorG}, ${item.style.fontColorB})`,
            direction,
            item.style.aligning,
            item.style.speed,
            item.style.scrollInterval,
            item.style.isScrollTime
          );
        });
      }
    });

    //0624 dj   告警弹窗在主页和地图页都能弹出，移到baseContainer里
    //告警
    //告警弹窗消息带msgID，前端要根据msgID是否已显示来决定是否显示弹窗  alarmAsgId   dj0613
    this.apiSDK.setReceiveInformAlarmInfoCallback(res => {
      if (res.alarmInfo.alarmMsgId) {
        let data = {
          alarmMsgId: res.alarmInfo.alarmMsgId,
          occurDatetime: res.alarmInfo.occurDatetime,
          deviceName: res.alarmInfo.deviceName,
          alarmEvent: res.alarmInfo.alarmEvent,
          alarmLevel: res.alarmInfo.alarmLevel,
          deviceId: res.alarmInfo.deviceId,
          locationId: res.locationId
        };
        //在baseContainer里新增一个list，用于接收弹窗消息
        this.alarmMessageList.push(data);
      }
    });
    // 清除所有业务 1118 云调度 修改
    this.apiSDK.setInformClearAllCallback();

    //轮循显示告警消息
    this.showAlarmTimer = setInterval(() => {
      let num = 0;
      while (num < 3) {
        num++;
        setTimeout(() => {
          if (this.alarmMessageList.length > 0) {
            this.alarmMessageAlert(this.alarmMessageList[0], 5000);
            //其他告警响应
            this.$root.$emit('alarmEvent', this.alarmMessageList[0])
            //剔除
            this.alarmMessageList.splice(0, 1);
          }
        }, num * 1000);
      }
    }, 8000);

    // 事件
    window.addEventListener("unload", this.unloadHandler);
  },
  methods: {
    //显示滚动通知：内容，字体，字号，字型，颜色，方向，位置，速度，时间
    showMarqueeNotify( content, fontFamily, fontSize, fontStyle, fontColor, direction, position, speed, time, isScrollTime ) {
      let textContent = document.createTextNode(content);

      let marquee = document.createElement("marquee");
      marquee.style.fontFamily = fontFamily;
      marquee.style.fontSize = fontSize + "px";
      if (fontStyle === "bold") {
        marquee.style.fontWeight = fontStyle;
      } else if (fontStyle === "BoldItalic") {
        marquee.style.fontWeight = "bold";
        marquee.style.fontStyle = "italic";
      } else {
        marquee.style.fontStyle = fontStyle;
      }
      marquee.style.color = fontColor;
      marquee.setAttribute("direction", direction); //up,down,left,right
      //速度
      if (speed == "normal") marquee.setAttribute("scrollAmount", 6);
      else if (speed == "fast") marquee.setAttribute("scrollAmount", 10);
      else if (speed == "slow") marquee.setAttribute("scrollAmount", 2);

      // 关闭按钮
      let closeBtn = document.createElement("span");
      closeBtn.className = "el-icon-close";
      closeBtn.onclick = function() {
        marqueeNotify.remove();
      };

      let marqueeNotify = document.createElement("div");
      marqueeNotify.className = "marqueeNotify";

      //位置
      if (position == "top") marqueeNotify.style.top = "0px";
      //42
      else if (position == "center") marqueeNotify.style.top = "40%";
      else if (position == "bottom") marqueeNotify.style.bottom = "0px";

      let divContainer = document.querySelector("#divContainer");

      marquee.appendChild(textContent);
      marqueeNotify.appendChild(marquee);
      marqueeNotify.appendChild(closeBtn);
      divContainer.appendChild(marqueeNotify);

      if (!isScrollTime) {
        setTimeout(() => {
          marqueeNotify.remove();
        }, time * 60 * 1000);
      }
    },

    //页面刷新或离开
    unloadHandler() {
      //e = e || window.event
      console.log("刷新页面==================");
      xtxk.cache.set("REFRESH", true);
      let url = localStorage.getItem('url');
      this.$router.push('../Login2?' + url);
    },

    //告警弹窗不自动关闭，必须手动关闭，关闭时调用设置   告警消息已读接口
    alarmMessageAlert(data, closeTime) {
      let eventList = [
        { label: "越界", value: "ECrossBorder" },
        { label: "攀高", value: "EClimbedUp" },
        { label: "滞留", value: "ERetention" },
        { label: "徘徊", value: "EWander" },
        { label: "聚众", value: "EGatherCrowd" },
        { label: "盗移", value: "EStealMove" },
        { label: "快速移动", value: "EFastMove" },
        { label: "斗殴", value: "EFight" },
        { label: "逆行", value: "EReverseDirection" },
        { label: "起身", value: "EGetup" },
        { label: "离岗", value: "EOffPosition" },
        { label: "落单", value: "EBeAlone" }
      ];
      let eObj = eventList.find(item => item.value === data.alarmEvent);
      let alarmEvent = (eObj && eObj.label) || "";

      let levelList = [
        { label: "高", value: "EHigh" },
        { label: "中", value: "ENormal" },
        { label: "低", value: "ELow" }
      ];
      let lObj = levelList.find(item => item.value === data.alarmLevel);
      let alarmLevel = (lObj && lObj.label) || "";

      let strHtml =
        '<el-form :label-position="right" style="margin-top:10px">' +
        '<div class="el-form-item"><label class="el-form-item__label">告警时间</label><div class="el-form-item__content">' +
        data.occurDatetime +
        "</div></div>" +
        '<div class="el-form-item"><label class="el-form-item__label">告警源</label><div class="el-form-item__content">' +
        data.deviceName +
        "</div></div>" +
        '<div class="el-form-item"><label class="el-form-item__label">触发事件</label><div class="el-form-item__content">' +
        alarmEvent +
        "</div></div>" +
        '<div class="el-form-item"><label class="el-form-item__label">告警级别</label><div class="el-form-item__content">' +
        alarmLevel +
        "</div></div>" +
        "</el-form>";

      this.$notify({
        title: "监控告警",
        message: strHtml,
        dangerouslyUseHTMLString: true,
        customClass: "alarm_message",
        position: "bottom-right",
        type: "warning",
        duration: closeTime,
        onClick: () => {
          //关闭时调用设置   告警消息已读接口   0613dj
          this.apiSDK.publishSetMessageReaded(data.alarmMsgId);
        }
      });
    },
  },
  destroyed: function() {
    //注销事件
    window.removeEventListener("unload", this.unloadHandler);
    //注销插件
    this.apiSDK.unregisterForPlugin();
    //退出
    this.apiSDK.publishLeave(() => {
      xtxk.cache.clear();
      this.$store.commit("clear");
    });

    //退出时，清除定时器，清空告警list
    clearInterval(this.showAlarmTimer);
    this.alarmMessageList = [];
    // 退出即时通讯服务
    this.imSDK && this.imSDK.connection.disConnection();
  }
};
</script>
<style>
.wrapper {
  height: 100%;
}

.el-tree {
    /* 0630dj 横向滚动条 */
    display: inline-block;
    min-width: 100%;
    margin-bottom: 10px;
}
</style>