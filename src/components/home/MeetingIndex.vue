<template>
  <div class="meetingbox"  style="height:100%">
    <div style="height:100%" v-show="content == 'MeetingInfo'">
      <meeting-info ref="meetingInfo"></meeting-info>
    </div> 
    <div style="height:100%" v-show="content == 'Meeting'">
      <meeting ref="meeting"></meeting>
    </div> 
    <div style="height:100%" v-show="content == 'MeetingManage'">
      <meeting-manage ref="meetingManage"></meeting-manage>
    </div> 

    <!-- ID入会 -->
    <join-conference-dialog ref="joinConferenceDialog" />
    <!-- 发起会议 -->
    <conference-scene-dialog ref="conferenceScene"></conference-scene-dialog>
    
    <conference-template-dialog ref="conferenceTemplateDialog"></conference-template-dialog>
    <detail-dialog ref="detailDialog" />
  </div>
</template>

<script>

import Fun from "@/common/fun";
import Enum from "@/common/enum";
import MeetingInfo from '@/components/home/MeetingInfo.vue';
import Meeting from '@/components/home/Meeting.vue';
import MeetingManage from '@/components/home/MeetingManage.vue';
import JoinConferenceDialog from "@/components/conference/JoinConferenceDialog";
import ConferenceSceneDialog from "@/components/conference/ConferenceSceneDialog.vue";
//添加编辑模板
import ConferenceTemplateDialog from '@/components/conference/ConferenceTemplateDialog.vue'
//会议详情
import DetailDialog from "@/components/conference/DetailDialog.vue";
export default {
  name: "MeetingIndex",
  components: {
      MeetingInfo,
      Meeting,
      MeetingManage,
      JoinConferenceDialog,
      ConferenceSceneDialog,
      ConferenceTemplateDialog,
      DetailDialog,
  },
  data() {
    return {
      content:'MeetingInfo',
      isInit:true, //是否第一次进入会议
      dataTime:new Date().formatDate('yyyy-MM-dd HH:mm:ss'),
    };
  },
  mounted() {
    this.curUser = xtxk.cache.get('USER');
    // 时间动态加载
    var _this = this;
    _this.timer = setInterval(function () {
        _this.dataTime = new Date().formatDate('yyyy-MM-dd HH:mm:ss'); // 修改date 数据
    },1000);
  },
  methods: {
    goMeeting(){
      this.content = 'Meeting';
    },
    goMeetingInfo(){
      this.content = 'MeetingInfo';
      this.$refs.meetingInfo.handleClick({name:'historyMeeting'})
    },
    goMeetingManage(data){
      this.content = 'MeetingManage';
      this.$refs.meetingManage.showManage(data);
    }
  },
  watch:{
    content(newVal,oldVal){
      if(newVal=='Meeting'){
        this.$refs.meeting.startTime();
      }else{
        this.$refs.meeting.resetTime();
      }
    }
  },
  destroyed: function() {
   
  },
};
</script>

<style scoped>
</style>