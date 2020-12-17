<template>
    <div class="imageNav">
        <div class="top">
          <!-- <top-nav ref="topNav"   v-if="activetabName=='Monitor'"/> -->
            <!-- <el-button class="localOutput" title="本地输出"></el-button> -->
        </div>
        <div class="bottom">
            <bus-manager-dialog ref="trainningDialog" @closeOtherDialog='changeShow' v-if="activetabName!='Monitor'" /> 
            <div class="nav-dropdown" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6&&activetabName!='Monitor'">
              <el-button class="conference" title="视频会议" ></el-button>
              <ul class="nav-dropdown-menu" >
                <li><conference-group-dialog ref="conferenceGroupDialog"  @closeOtherDialog='changeShow'/></li>
                <!-- <li @click="showDialog('applyJoinGroupDialog')">申请入会</li> -->
                <!-- <li @click="showDialog('historyMeetingDialog')">历史会议</li> -->
                <li @click="showDialog('historyConferenceDialog')">历史会议</li>
                <!-- <li @click="showDialog('presentMeetingDialog')">当前会议</li> -->
                <li><present-meeting-dialog ref="presentMeetingDialog" @closeOtherDialog='changeShow' /></li>
                <li @click="showDialog('joinConferenceDialog')">ID入会</li>
                <li @click="showDialog('arrangeConferenceDialog')">预约会议</li>
              </ul>
            </div>

            <conference-group-dialog v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5"  ref="conferenceGroupDialog" @closeOtherDialog='changeShow'/>

            <command-group-dialog ref="commandGroupDialog" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" @closeOtherDialog='changeShow'/>
            <!-- 呼叫分组 -->
            <!-- <call-business-dialog ref="callBusinessDialog" @closeOtherDialog='changeShow'  /> -->
            <play-group-dialog ref="playGroupDialog" @closeOtherDialog='changeShow'/>
            <div class="nav-dropdown">
              <el-button class="bag" title="常用功能"></el-button>
              <ul class="nav-dropdown-menu">
                <li @click="showDialog('groupManagerDialog')">分组管理</li>
                <li v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" @click="showDialog('SendRequestDialog')">即时消息</li>
                <li v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" @click="showDialog('im6Dialog')">即时消息</li>
                <li @click="showDialog('planVideoDialog')">计划录像</li>
                <li @click="showDialog('videoForwardDialog')" v-if="this.apiSDK.config.platformVersion == 0 && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5">视频转发</li>
                <li @click="showDialog('fileManageDialog')">频道管理</li>
                <!-- <li @click="showDialog('screenShotManageDialog')">截图管理</li> -->
                <!-- <li @click="showDialog('notificationDialog', {title: '广播通知', module: 'Broad'})">发送通知</li> -->
                <li @click="showDialog(apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6?'osdManageDialog':'osdManageDialogByVrsion5')">字幕管理</li>
                <li v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" @click="showDialog('alarmMessageDialog')">告警记录</li>
              </ul>
            </div>
            <el-button class="decoder" title="解码器控制" @click="showDialog('decoderControl')"></el-button>
        </div>
        <!-- 常用功能弹框 -->
        <!-- 分组管理 -->
        <group-manager-dialog ref="groupManagerDialog" @closeOtherDialog='changeShow'/>
        <!-- 即时消息 5 6  -->
        <send-request-dialog ref="SendRequestDialog"></send-request-dialog>
        <Im6-dialog ref="im6Dialog" />   
        <!-- 字幕管理 5 6-->
        <osd-manage-dialog-version5 ref="osdManageDialogByVrsion5"></osd-manage-dialog-version5>
        <osd-manage-dialog ref="osdManageDialog"/>
        <!-- 计划录像 -->
        <plan-video-dialog ref="planVideoDialog"/>
        <!-- 视频转发 -->
        <video-forward-dialog ref="videoForwardDialog" />
        <!-- 常用功能弹框结束 -->

        <decoder-control ref="decoderControl" />
        <!-- 视频会议popover -->
        <!-- <el-popover
          ref="conferenceDropMenu"
          popper-class="nav-drop-menu"
          placement="right"
          :visible-arrow="false"
          width="80"
          trigger="click">
          <conference-group-dialog ref="conferenceGroupDialog"/>
          <el-button @click="showDialog('applyJoinGroupDialog')">申请入会</el-button>
          <el-button @click="showDialog('historyMeetingDialog')">历史会议</el-button>
        </el-popover> -->

        <scheme-manage-dialog ref="schemeManageDialog" />
        <!-- <history-meeting-dialog ref="historyMeetingDialog" /> -->
        <history-conference-dialog ref="historyConferenceDialog" />
        <apply-join-group-dialog ref="applyJoinGroupDialog" />
        <notification-dialog ref="notificationDialog" />
        <file-manage-dialog ref="fileManageDialog" />
        <screen-shot-manage-dialog ref="screenShotManageDialog" />
        <!-- 告警 0624dj -->
        <alarm-message-dialog ref="alarmMessageDialog"/>
        <join-conference-dialog ref="joinConferenceDialog" />
        <arrange-conference-dialog ref="arrangeConferenceDialog" />

    </div>
</template>

<script>
import CommandGroupDialog from "@/components/videoCommand/CommandGroupDialog.vue";
import CallBusinessDialog from "@/components/home/CallGroupDialog.vue";
import PlayGroupDialog from "@/components/home/PlayGroupDialog.vue";
import GroupManagerDialog from "@/components/home/GroupManageDialog.vue";
import BusManagerDialog from "@/components/home/BusManageDialog.vue";
import PlanVideoDialog  from '@/components/home/PlanVideoDialog.vue';
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import DecoderControl from '@/components/matrix/DecoderControl.vue';
import VideoForwardDialog from '@/components/home/VideoForwardDialog.vue';
import OsdManageDialog from '@/components/home/OsdManageDialog.vue';
import ConferenceGroupDialog from '@/components/conference/ConferenceGroupDialog.vue';
// import HistoryMeetingDialog from '@/components/conference/HistoryMeetingDialog.vue';
import HistoryConferenceDialog from '@/components/conference/HistoryConferenceDialog.vue';
import PresentMeetingDialog from '@/components/conference/PresentMeetingDialog.vue';
import ApplyJoinGroupDialog from '@/components/conference/ApplyJoinGroupDialog.vue';
import NotificationDialog from '@/components/notification/NotificationDialog.vue';
import FileManageDialog from "@/components/home/FileManageDialog.vue";
import ScreenShotManageDialog from "@/components/home/ScreenShotManageDialog.vue";
import SendRequestDialog from '@/components/home/SendMessageDialog.vue';
import Im6Dialog from '@/components/home/Im6Dialog.vue';
// import Im6Dialog from '@/test/Im6Dialog.vue';
import OsdManageDialogVersion5 from '@/components/home/OsdManageDialogByVrsion5.vue';
//告警记录
import AlarmMessageDialog from "@/components/map/AlarmMessageDialog";
import JoinConferenceDialog from "@/components/conference/JoinConferenceDialog";
import ArrangeConferenceDialog from "@/components/conference/ArrangeConferenceDialog";
// import TopNav from "@/components/home/layout/MonitorNavTop.vue";



export default {
    name: "ImageNav",
    components: {
      // TopNav,
        CommandGroupDialog,
        CallBusinessDialog,
        PlayGroupDialog,
        GroupManagerDialog,
        BusManagerDialog,
        PlanVideoDialog,
        SchemeManageDialog,
        DecoderControl,
        VideoForwardDialog,
        OsdManageDialog,
        ConferenceGroupDialog,
        // HistoryMeetingDialog,
        HistoryConferenceDialog,
        PresentMeetingDialog,
        ApplyJoinGroupDialog,
        // BroadNotificationDialog,
        NotificationDialog,
        FileManageDialog,
        ScreenShotManageDialog,
        SendRequestDialog,
        Im6Dialog,
        OsdManageDialogVersion5,
        //告警记录
        AlarmMessageDialog,
        JoinConferenceDialog,
        ArrangeConferenceDialog,
    },
    data() {
      return {
        activetabName:'',
      }
    },
    mounted(){
	    this.activetabName=xtxk.cache.get('activeName');
    },
    methods: {
        showDialog(name, data) {
          this.changeShow(name)
          if (!data) {
            this.$refs[name].showDialog();
          } else {
            this.$refs[name].showDialog(data);
          }
        },
        // 在版本5中 触发
        videoFrequency() {
            this.$refs.conferenceGroupDialog.visible = true;
        },
        changeShow(name){
            //业务场景
            if(this.activetabName!="Monitor"){
              if(this.$refs.trainningDialog.visible == true) this.$refs.trainningDialog.closeDialog()
            }
            //视频会议
            if(this.activetabName!="Monitor"){
              if(this.$refs.conferenceGroupDialog.visible == true)this.$refs.conferenceGroupDialog.closeDialog()
            }
            
            //呼叫分组
            // if(this.$refs.callBusinessDialog.visible == true)this.$refs.callBusinessDialog.visible = false
            //监看分组
            if(this.$refs.playGroupDialog.visible == true)this.$refs.playGroupDialog.visible = false
            //分组管理
            if(this.$refs.groupManagerDialog.isVisible == true)this.$refs.groupManagerDialog.handleClose();
            //解码器
            if(name != 'decoderControl' && this.$refs.decoderControl.visible == true)this.$refs.decoderControl.showDialog();

            if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6){
              //历史会议
              // if(this.$refs.historyMeetingDialog.isVisible == true) this.$refs.historyMeetingDialog.isVisible =false
              //当前会议
              if(this.activetabName!="Monitor"){
                if(this.$refs.presentMeetingDialog.visible == true) this.$refs.presentMeetingDialog.visible =false
              }
              //字幕管理 6
              if(this.$refs.osdManageDialog.isVisible == true){
                this.$refs.osdManageDialog.closedDialog();
                this.$refs.osdManageDialog.isVisible = false;
              }
              //即时消息  6
              if(this.$refs.im6Dialog.isVisible == true)this.$refs.im6Dialog.closedDialog();
              //告警
              if(this.$refs.alarmMessageDialog.visible == true){
                  this.$refs.alarmMessageDialog.visible  = false;
                  this.$refs.alarmMessageDialog.clear();
              }   
            }else{
              //视频指挥
              if(this.$refs.commandGroupDialog.visible == true)this.$refs.commandGroupDialog.visible = false
              //计划录像
              if(this.$refs.planVideoDialog.visible == true){
                this.$refs.planVideoDialog.closedDialog();
                this.$refs.planVideoDialog.visible = false;
              }
              //视频转发
              if(this.$refs.videoForwardDialog.isVisible == true){
                this.$refs.videoForwardDialog.closeDialog()
                this.$refs.videoForwardDialog.isVisible = false;
              };
              //字幕管理 5
              if(this.$refs.osdManageDialogByVrsion5.isVisible == true){
                this.$refs.osdManageDialogByVrsion5.closedDialog();
                this.$refs.osdManageDialogByVrsion5.isVisible = false;
              }
              //即时消息 5
              if(this.$refs.SendRequestDialog.isVisible == true)this.$refs.SendRequestDialog.closedDialog();
            }
            
        }
    }
};
</script>

<style scoped>
.imageNav {
  height: 100%;
  position: relative;
}
.imageNav .bottom{
  position: absolute;
  bottom: 0;
}
.imageNav button{
  border: 0;
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin: 0;
}
.localOutput {
  background: url(../../../../static/main/leftBar/computer.png) no-repeat;
}
.localOutput:hover, .localOutput:focus {
  background: url(../../../../static/main/leftBar/computer_hover.png) no-repeat;
}
.monitor{
  background: url(../../../../static/main/leftBar/grouping.png) no-repeat;
}
.monitor:hover, .monitor:focus {
  background: url(../../../../static/main/leftBar/grouping_hover.png) no-repeat;
}
.plan {
  background: url(../../../../static/main/leftBar/plan.png) no-repeat;
}
.plan:hover, .plan:focus {
  background: url(../../../../static/main/leftBar/plan_hover.png) no-repeat;
}
.scheme{
  background: url(../../../../static/main/leftBar/scheme.png) no-repeat;
}
.scheme:hover, .scheme:focus {
  background: url(../../../../static/main/leftBar/scheme_hover.png) no-repeat;
}
.decoder{
  background: url(../../../../static/main/leftBar/decoderControl.png) no-repeat;
}
.decoder:hover, .decoder:focus {
  background: url(../../../../static/main/leftBar/decoderControl_hover.png) no-repeat;
}
.videoForward {
  background: url(../../../../static/main/leftBar/videoForward.png) no-repeat;
}
.videoForward:hover, .videoForward:focus {
  background: url(../../../../static/main/leftBar/videoForward_hover.png) no-repeat;
}
.conference{
  background: url(../../../../static/main/leftBar/conference.png) no-repeat;
}
.conference:hover, .conference:focus{
  background: url(../../../../static/main/leftBar/conference_hover.png) no-repeat;
}
.bag{
  background: url(../../../../static/main/leftBar/bag.png) no-repeat;
}
.bag:hover, .bag:focus{
  background: url(../../../../static/main/leftBar/bag_hover.png) no-repeat;
}
.video-command{
  background: url(../../../../static/main/leftBar/videoCommand.png) no-repeat;
}
.video-command:hover{
  background: url(../../../../static/main/leftBar/videoCommand_hover.png) no-repeat;
}
.nav-drop{
  /*top: 820px !important;*/
  left: 44px !important;
  padding: 0;
  overflow: hidden;
}
.nav-dropdown{
  position: relative;
  width: 42px;
}
.nav-dropdown:hover .nav-dropdown-menu{
  display: block;
}
.nav-dropdown .nav-dropdown-menu{
  display: none;
  position: absolute;
  background-color: #fff;
  left: 40px;
  overflow: hidden;
  bottom: 5px;
  width: 85px;
  font-size: 12px;
  margin: 0;
  padding: 0;
  border: solid 1px #c2dff3;
  z-index: 999999;
}
.nav-dropdown .nav-dropdown-menu li{
  cursor: pointer;
  padding: 5px 15px;
  min-width:  55px;
}
.nav-dropdown .nav-dropdown-menu li:hover{
  background-color: #dbf0fe;
}
</style>
