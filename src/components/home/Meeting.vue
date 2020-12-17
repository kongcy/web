<template>
  <div id="divContainer">
    <div id="divMain" :style="mainStyle">
      <div id="divImageContent" :style="imageContentStyle">
         <div id="divImageTopTitle" :style="imageTopStyle">
            <div class="floatL meetingTopL imageTop">
              <span class="imageTop">{{conferenceName}}</span>
              <span class="meetingID imageTop">会议ID:{{conferenceId}} <i class="icons icon_copy imageTop"></i></span>
            </div>
            <div  class="floatR meetingTopR imageTop">
              <span class="imageTop">{{meetingTime_h}}:{{meetingTime_m}}:{{meetingTime_s}}</span>
              <span class="imageTop">
                <i class="icons icon_Full imageTop" @click="Allfullscreen"></i>
              </span>
            </div>
        </div>
        <div id="divImageShow" :style="imageShowStyle">
          <image-show ref="imageShow" />
        </div>
        <div id="footerMenu" class="footerMenu" :style="imageFooterStyle">
           <conference-footer-menu ref="conferenceFooterMenu" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageShow from "@/components/home/layout/ImageShow.vue";
import conferenceFooterMenu from "@/components/conference/conferenceFooterMenu.vue";
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import { clearInterval } from "timers";
export default {
  name: "Meeting",
  components: {
    ImageShow,
    conferenceFooterMenu
  },
  data() {
    return {
      activetabName:'',
      headerStyle: "",
      mainStyle: "",
      //图像顶部区域
      imageTopStyle:'',
      //图像底部区域
      imageFooterStyle   : '',
      //图像区域
      imageContentStyle: "",
      //图像显示区域
      imageShowStyle: "",
      imageShowWidth: 0,
      imageShowHeight: 0,
      conferenceName:'A项目会议',
      conferenceId:'XXXXXXX',
      meetingTime_s:'00',
      meetingTime_m:'00',
      meetingTime_h:'00',
      count:0,
      isFull:false,
      timer:null,
      // isMP: false, //是否拼接会议
      // chairmanInfo: {}, //主席
      // isChairman: false, //是否是主席
      // conferenceBtn: [], //功能按钮
    }
  },
  mounted() {
    this.activetabName=xtxk.cache.get('activeName');
    const self = this;
    //渲染页面
    this.initLayout();
    
    
    //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (this.apiSDK.socketStatus != -1) {
      //媒体
      self.$refs.imageShow.initMXTC(this.imageShowWidth, this.imageShowHeight,"MeetingContainer");
    }

    //socket状态
    this.apiSDK.setSocketReconnectCallback("main", obj => {
      if (obj.state == -1) {
        //断开
        //停止所有图像
        self.apiSDK.stopPlayAllForPlugin();
      } else if (obj.state == 2) {
        let deviceSipInfo = xtxk.cache.get('DEVICESIPINFO');
        let localSipInfo = xtxk.cache.get('LOCALSIPINFO');
        if(deviceSipInfo) {
          this.apiSDK.setUserStatus('BusinessOnline', deviceSipInfo.sipid); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else if(localSipInfo) {
          this.apiSDK.setUserStatus('BusinessOnline', localSipInfo.sipid); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        } else{
          this.apiSDK.setUserStatus('BusinessOnline'); // 11.26 同步云调度 1124 用户状态上报从ws改成http
        }
        //重连
      } else if (obj.state == 1) {
        //首次
        //媒体
        self.$refs.imageShow.initMXTC(
          this.imageShowWidth,
          this.imageShowHeight
        );
      }
    });
    // 事件
    window.addEventListener("resize", this.resize);
    //鼠标移入移出时会议title显示/隐藏
    let element=document.getElementsByClassName("imageDiv")[0]
    if(element){
        document.addEventListener("mouseover", e => {
            if(e.target.id.indexOf("playerChild")>-1||e.target.id=="divImageTopTitle"||e.target.className.indexOf("imageTop")>-1){
                if( document.getElementById("divImageTopTitle")){
                  document.getElementById("divImageTopTitle").style.display = 'block';
                }
            }
          })
        document.addEventListener("mouseout", e => {
            if( document.getElementById("divImageTopTitle")){
                document.getElementById("divImageTopTitle").style.display = 'none';
            }
        })
    }

  },
  methods: {
    //窗口大小变动
    resize() {
      let self = this;
      self.initLayout();
      self.apiSDK.changeSizeForPlugin(
        self.imageShowWidth,
        self.imageShowHeight
      );
    },
    //初始化布局
    initLayout() {
      var screenWidth = document.body.clientWidth;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
      var headerHeight = 72;
      var paddingW=48;
      var paddingH=44;
      var mainWidth = screenWidth;
      var mainHeight = screenHeight - headerHeight;

      //图像区域
      var imageContentWidth = mainWidth;
      var imageContentHeight =  mainHeight

      //图像显示区域
      var imageShowWidth =imageContentWidth-paddingW;
      var imageShowHeight = imageContentHeight-paddingH;

      //图像顶部区域
      var imageTopWidth   = imageShowWidth-16
      var imageTopHeight  = 40;
      //图像底部区域
      var imageFooterWidth   = imageShowWidth-16
      var imageFooterHeight  = 58;
      
     
      this.mainStyle ="width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
       //图像顶部区域
      this.imageTopStyle='width:' + imageTopWidth  + 'px' + ';height:' + imageTopHeight  + 'px';
      //图像底部区域
      this.imageFooterStyle='width:' + imageFooterWidth  + 'px' + ';height:' + imageFooterHeight  + 'px';
      //图像区域
      this.imageContentStyle ="width:" +imageContentWidth +"px" +";height:" +imageContentHeight +"px";
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
      this.imageShowHeight = imageShowHeight-imageFooterHeight-8;
    },
    //点击全屏
    Allfullscreen(isFull){
      this.apiSDK.setAllFullScreenForPlugin(true);
    },
    //计显器
    startTime(){
      let that=this;
      this.timer=setInterval(()=>{
          that.count++;
          that.meetingTime_s=that.showNum(that.count%60);
          that.meetingTime_m=that.showNum(parseInt(that.count/60)%60);
          that.meetingTime_h=that.showNum(parseInt(that.count/60/60));
       },1000)
    },
    showNum(num){
      return num<10?'0'+num:num;
    },
    //重置时间
    resetTime(){
      this.count=0;
      this.meetingTime_s='00';
      this.meetingTime_m='00';
      this.meetingTime_h='00';
      window.clearInterval(this.timer);
      this.timer=null;
    },
    // 初始化数据
    initData(data_, isOpen) {
      this.$refs.conferenceFooterMenu.initData(data_,isOpen);
        console.log("刷新会议树",data_);
        if (data_ && data_.res) {
            if(this.$refs.conferenceFooterMenu.$refs.toastmasterMeeting.visible){
              this.$refs.conferenceFooterMenu.$refs.toastmasterMeeting.initData(data_.res);
            }
            let data = data_.res;
            this.conferenceId = data.conferenceId;
            this.description = data.description;
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ) {
                this.conferenceName = data.conferenceName
            }
        //     this.isMP = (data.isMP && data.isMP.status == 1) || false

        //     if( data.operate === 'init' ){
        //         // this.clearTree();
        //     }

        //     if(data.init && data.init.members){
        //         // this.checkTreeNode(data.init.members);
        //     }
        //     if(data.init && data.init.devices){
        //         // this.checkTreeNode(data.init.devices);
        //     }

            if( data.operate == "discuss" ){
                if( data.discuss && data.discuss.status == 1 ){
                    this.conferenceName = data.conferenceName + ' [讨论中]';
                }else{
                    this.conferenceName = data.conferenceName;
                }
            }

        //     if(data.refresh){
        //         // this.checkTreeNode(data.refresh);
        //     }

        //     if(data.addMember){
        //         // this.checkTreeNode(data.addMember);
        //     }
            
        //     if( data.rows ) {
        //         // data.rows.users[0].role = Enum.enumRoleType.chairman;
        //         let users = data.rows.users.map( (item, index) => {
        //             if( !index ) { item.role = Enum.enumRoleType.chairman }
        //             if (item.status == 0) {
        //                 item.isOnline = "offline"
        //             } else if (item.status == 1) {
        //                 item.isOnline = "online"
        //             }
        //             return { ...item , resId: item.userId, resName: item.userName , resType: 0};
        //         })
        //         // this.checkTreeNode(users);
        //     }

        //     if(data.removeMember){
        //         // let treeObj = this.$refs.source_tree;
        //         // data.removeMember.forEach(item => {
        //         //     var nodeId = item.resId + "_" + (item.resCh || 0);
        //         //     const node = treeObj.getNode(nodeId);
        //         //     if(node) treeObj.remove(node.data);
        //         // })
        //     }

        //     if (data.operate === 'init' && isOpen) {
        //         if (this.isChairman) {
        //           this.conferenceBtn = [
        //               { title: '麦克风', class: 'close-microphone-mid', event: 'publishMemberMicrophone'},
        //               { title: '摄像头', class: 'close-video-mid', event: 'publishMemberVideoAbility' },
        //               { title: '大屏同步', class: 'scheme-btn', event: 'publishScreen' },
        //               { title: '录制', class: 'start-playing', event: 'startMeetRecording' },
        //               { title: '会商切换', class: 'scenemanager', event: 'publishChangeMeeting'},
        //               { title: '邀请', class: 'add-user', event: 'addMember' },
        //               { title: '主持会商', class: 'setchairman', event: 'publishToastmasterMeeting'},
        //               { title: '共享', class: 'shareScreen', event: 'shareFun'},
        //               { title: '视频调度', class: 'video-dispatch', event: ''},
        //               { title: '聊天', class: 'meetingMassage', event: ''},
        //               { title: '记录', class: 'talk', event: ''},
        //               { title: '任务安排', class: 'task-arrangement', event: 'taskArrangement'},
        //               { title: '会议信息', class: 'sceneinfo', event: 'showSceneInfo' },
        //               { title: '设置', class: 'more', event: ''},
        //               { title: '结束会议', class: 'stop', event: 'stopConference' },

        //               // { title: '电子白板', class: 'blackboard', event: 'electronBlackboard' },
        //               // { title: '添加成员', class: 'add-user', event: 'addMember' },
        //               // { title: '强退成员', class: 'delete-user', event: 'removeMember' },
        //               // { title: '指定发言', class: 'add-speak', event: 'appointSpeaking' },
        //               // { title: '收回发言', class: 'delete-speak', event: 'cancelSpeakingByChairman' },
        //               // { title: '闭麦', class: 'open-microphone-mid', event: 'publishMemberMicrophone' },
        //               // { title: '闭音', class: 'open-audio-mid', event: 'publishMemberAudioAbility' },
        //               // { title: '关闭视频', class: 'open-video-mid', event: 'publishMemberVideoAbility' },
        //               // // { title: '开启录像', class: 'delete-speak', event: '' },
        //               // { title: '共享屏幕', class: 'noShareScreen', event: 'publishShareScreen' },
        //               // { title: '会议点名', class: 'sceneperson', event: 'showScenePerson' },
        //               // // { title: '控制云台', class: 'ytcontrol', event: 'ytcontrol' },
        //               // // { title: '讨论模式', class: 'talk', event: 'startConferenceDiscussion' },
        //               // // { title: '全场静音', class: 'mute', event: 'muteConferenceAll' },
        //               // // { title: '暂停会议', class: 'pause', event: 'pauseConference' },
        //               // // { title: '显示方案', class: 'scheme-btn', event: 'openSchemeDialog' },
        //               // // { title: '指定主席', class: 'chairman', event: 'appointChairman' },
        //               // // { title: '会议录像', class: 'start-playing', event: 'startMeetRecording' },
        //               // // { title: '会场转发', class: 'meetingForward', event: 'chairmanMeetingForward' },
        //               // // { title: '会场通知', class: 'meetingMassage', event: 'MeetingMassage' },
        //               // // { title: '共享屏幕', class: 'noShareScreen', event: '' },
        //               // { title: '结束会议', class: 'stop', event: 'stopConference' },
        //           ]

        //           if(this.isMP == 1){//mp会议
        //               this.conferenceBtn.splice(this.getConferenceBtnIndex('指定发言',this.conferenceBtn),1);
        //               this.conferenceBtn.splice(this.getConferenceBtnIndex('收回发言',this.conferenceBtn),1);
        //           }
        //         } else {
        //             this.conferenceBtn = [
        //                 { title: '麦克风', class: 'open-microphone-mid', event: 'publishMemberMicrophone' },
        //                 { title: '摄像头', class: 'open-video-mid', event: 'publishMemberVideoAbility' },
        //                 { title: '大屏同步', class: 'scheme-btn', event: 'publishScreen' },
        //                 { title: '录制', class: 'start-playing', event: 'startMeetRecording' },
        //                 { title: '会商切换', class: 'scenemanager', event: 'publishChangeMeeting'},
        //                 // { title: '闭音', class: 'open-audio-mid', event: 'publishMemberAudioAbility' },
        //                 // { title: '电子白板', class: 'blackboard', event: 'electronBlackboard' },
        //                 // { title: '申请发言', class: 'applyspeak', event: 'applySpeaking' },
        //                 // // { title: '开启录像', class: 'delete-speak', event: '' },
        //                 // { title: '共享屏幕', class: 'shareScreen', event: 'publishShareScreen' },
        //                 { title: '共享', class: 'shareScreen', event: 'shareFun'},
        //                 { title: '视频调度', class: 'video-dispatch', event: ''},
        //                 { title: '聊天', class: 'meetingMassage', event: ''},
        //                 { title: '记录', class: 'talk', event: ''},
        //                 { title: '会议信息', class: 'sceneinfo', event: 'showSceneInfo' },
        //                 { title: '设置', class: 'more', event: ''},
        //                 // { title: '控制云台', class: 'ytcontrol', event: 'ytcontrol' },
        //                 // { title: '申请主席', class: 'chairman', event: 'applyChairman' },
        //                 // { title: '旁观会议', class: 'look', event: 'openSpectateConference' },
        //                 // { title: '会场转发', class: 'meetingForward', event: 'memberMeetingForward' },
        //                 { title: '退出会议', class: 'exit', event: 'applyLeaveConference' },
        //             ]

        //             if(this.isMP == 1){//mp会议
        //                 this.conferenceBtn.splice(this.getConferenceBtnIndex('申请发言',this.conferenceBtn),1);
        //             }
        //         }
        //     }
        }


    },
    //获取按钮下标
    getConferenceBtnIndex(btnNameString, btnArray){
        let btnIndex = 0;
        for(let i=0;i<btnArray.length;i++){
            let str = btnArray[i].title;
            if( str.indexOf(btnNameString) > -1 ){
                btnIndex = i;
                break;
            }
        }
        // console.log('btnNameString：'+btnNameString+',btnIndex='+btnIndex);
        return Number(btnIndex);
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
  float: left;
  padding: 20px 24px 24px 24px;
  margin: 0px;
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
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
   position: relative;
  /* zld 调整插件自适应所改 */
  /* height: 100% !important; */
  /* width: calc(100% - 84px) !important; */
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
  float: left;
  padding: 0px;
  margin: 0px;
  height: 100% !important;
}
#divImageTopTitle{
  position: absolute;
  top:28px;
  left:32px;
  padding: 0px;
  margin: 0px;
  background: url(../../../static/main/screen/imgshow_title_bg.png) no-repeat center;
  background-size: 100% 100%;
  z-index: 1;
  display: none;
}
#divImageTopTitle>div{
  line-height: 40px;
  color:#fff;
}
.floatL{
  float:left;
}
.floatR{
  float:right;
}
.meetingTopL{
  margin-left:20px;
  font-size: 18px;
}
.conferenceId{
  color:#6f84a3;
  font-size: 16px;
  margin-left:10px
}
.icons{
  display: inline-block;
  width:15px;
  height: 15px;
  vertical-align: middle;
  cursor: pointer;
}
.icon_copy{
  background: url(../../../static/meeting/copy.png) no-repeat center;
  background-size: 100% 100%;
}
.icon_copy:hover{
  background: url(../../../static/meeting/copy_active.png) no-repeat center;
  background-size: 100% 100%;
}
.icon_Full{
   width:18px;
  height: 18px;
  background: url(../../sdk/player/img/img_fullscreen.png) no-repeat center;
  background-size: 100% 100%;
}
.icon_Full:hover{
  width:18px;
  height: 18px;
  background: url(../../sdk/player/img/img_fullscreen_hover.png) no-repeat center;
  background-size: 100% 100%;
}
.icon_NoFull{
  background: url(../../../static/meeting/copy.png) no-repeat center;
  background-size: 100% 100%;
}
.icon_NoFull:hover{
  background: url(../../../static/meeting/copy.png) no-repeat center;
  background-size: 100% 100%;
}
.meetingTopR{
  margin-right:20px;
}
.footerMenu{
  position: absolute;
  bottom: 24px;
  left: 32px;
  padding: 0px;
  margin: 0px;
  background:#324d78
}
</style>