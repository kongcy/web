<template>
  <div class="homebox">
    <el-scrollbar class="homeContent hiddenXScroll">
      <div class="divHoveType" ><i class="type_icon icon_video"></i>视频融合应用</div>
      <div class="divHomeBox" :class="tabs.length>5?'spaceBetween':''">
        <el-card :body-style="{ padding: '0px' }"  v-for="(item, index) in tabs" :key="index" shadow="hover"  @click.native="sentPrantV(item)">
            <img  :src="''+item.imgurl" class="image" >
            <div class="textbox" style="color:#fff" >
              <span class="text-ellipsis text-title" :title="item.title">{{item.title}}</span>
              <!-- <span class=" text-introduce" :title="item.introduce"><span class="text_ellipsemore">{{item.introduce}}</span></span> -->
            </div>
        </el-card>
        <!-- <el-card  :body-style="{ padding: '0px' }" shadow="hover" >
            <i class="addimage"></i>
            <div  class="textbox textadd" style="padding: 14px;color:#fff;" >
              <span class="text-ellipsis text-title" title="添加应用" >添加应用</span>
            </div>
        </el-card> -->
      </div>
       <!--<div class="divHoveType" ><i class="type_icon icon_voice"></i>语言通讯应用</div>
      <div class="divHomeBox" :class="VoiceTabs.length>5?'spaceBetween':''">
        <el-card :body-style="{ padding: '0px' }"  v-for="(item, index) in VoiceTabs" :key="index" shadow="hover" >
            <img  :src="'../../../'+item.imgurl" class="image"  @click="sentPrantV(item)">
            <div class="textbox" style="padding: 14px 28px; color:#fff" @click="sentPrantV(item)">
              <span class="text-ellipsis text-title" :title="item.title">{{item.title}}</span>
              <span class=" text-introduce" :title="item.introduce"><span class="text_ellipsemore">{{item.introduce}}</span></span>
            </div>
        </el-card>
      </div> -->
    </el-scrollbar>
  </div>
</template>

<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";
import { clearInterval } from "timers";
export default {
  name: "HomeIndex",
  components: {
    // ResourceContainer
  },
  data() {
    return {
      curUser: {},
      dataTime:new Date().formatDate('yyyy-MM-dd HH:mm:ss'),
      activeName: "PersonTree",
      tabs: [
        // {
        //   title: '控制中心',
        //   imgurl:"../../../static/decoderGroup/view.png",
        //   id: 'CZZX',
        //   ref: 'personTree',
        //   treeId: 'MainUsersStatus'
        // },
        {
          title: '视频监控',
          imgurl:"static/home/monitor.png",
          titleurl:'static/home/monitor_title.png',
          name:'Monitor',
          content: 'Monitor',
          ref: 'Monitor',
          closable: true,
          tourl:'',
          introduce:"智慧监控，守护园区安全",
        },
        // {
        //   title: '视频会商',
        //   imgurl:"static/home/meeting.png",
        //   titleurl:'static/home/meeting_title.png',
        //   name:'MeetingIndex',
        //   content: 'MeetingIndex',
        //   ref: 'MeetingIndex',
        //   closable: true,
        //   tourl:'',
        //   introduce:"打造多互动协作空间，远程交流如当面",
        // },
        // {
        //   title: '视频会商',
        //   imgurl:"static/home/meeting.png",
        //   titleurl:'static/home/meeting_title.png',
        //   name:'Meeting',
        //   content: 'Meeting',
        //   ref: 'meeting',
        //   closable: true,
        //   tourl:'',
        //   introduce:"打造多互动协作空间，远程交流如当面",
        // },
        {
          title: '视频会议',
          imgurl:"static/home/meeting.png",
          titleurl:'static/home/meeting_title.png',
          name:'MeetingOutside',
          content: 'MeetingOutside',
          ref: 'MeetingOutside',
          closable: true,
          tourl:'http://localhost:8080/',
          introduce:"打造多互动协作空间，远程交流如当面",
        },
        
         {
          title: '视频诊断',
          imgurl:"static/home/videoDiagnose.png",
          titleurl:'static/home/videoDiagnose_title.png',
          name:'diagnose',
          content: 'diagnose',
          ref: 'diagnose',
          closable: true,
          tourl:'',
          introduce:"打造多互动协作空间，远程交流如当面",
        },
         {
          title: '视频分析',
          imgurl:"static/home/videoAnalysis.png",
          titleurl:'static/home/videoAnalysis_title.png',
          name:'waiting',
          content: 'waiting',
          ref: 'waiting',
          closable: true,
          tourl:'',
          introduce:"打造多互动协作空间，远程交流如当面",
        },
       
       
      ],
      VoiceTabs: [
        
        {
          title: '语音高度',
          imgurl:"static/home/u46.png",
          name:'Monitor',
          content: 'Monitor',
          ref: 'Monitor',
          closable: true,
          introduce:"智慧监控，守护园区安全",
        },
        {
          title: '地图调度',
          imgurl:"static/home/u50.png",
          name:'Meeting',
          content: 'Meeting',
          ref: 'Meeting',
          closable: true,
          introduce:"打造多互动协作空间，远程交流如当面",
        },
        {
          title: '短信调度',
          imgurl:"static/home/u56.png",
          name:'Meeting',
          content: 'Meeting',
          ref: 'Meeting',
          closable: true,
          introduce:"打造多互动协作空间，远程交流如当面",
        },
         {
          title: '轨迹回放',
          imgurl:"static/home/u59.png",
          name:'Meeting',
          content: 'Meeting',
          ref: 'Meeting',
          closable: true,
          introduce:"打造多互动协作空间，远程交流如当面",
        },
        {
          title: '录音回放',
          imgurl:"static/home/u58.png",
          name:'Meeting',
          content: 'Meeting',
          ref: 'Meeting',
          closable: true,
          introduce:"打造多互动协作空间，远程交流如当面",
        },
      ]
    
    };
  },
  mounted() {
    let self=this;
    this.curUser = xtxk.cache.get('USER');
    console.log('--------'+this.curUser)
   
      

 // 视频会议状态推送回调
    this.apiSDK.setInformRefreshMeetingStatusCallback((res) => {
      if (res && res.operate === 'stop') {
        //停止会议了
        // this.deletePanel('VideoPanel');
        // this.deletePanel('ConferenceDiscuss');
        console.log('停止会议了....',res)
        console.log( this.$parent.$parent.$parent)
        let editableTabs=this.$parent.$parent.$parent.editableTabs;
        if(editableTabs.length>0){
          let n=editableTabs.findIndex(item=>item.name=='MeetingIndex')
          if(n>-1){
            this.$parent.$parent.$parent.$refs.MeetingIndex[0].goMeetingInfo();
          }
        }
        
       
      } else {
        if (res.sceneType == 0 || res.sceneType == 2) {
          //有会议消息
        let datas=this.tabs.filter(item=>item.name=='MeetingIndex')
        this.$emit("ShowMeetingBtn",datas[0])
        this.$nextTick(()=>{
          this.$parent.$parent.$parent.$refs.MeetingIndex[0].goMeeting();
          let IsInit=this.$parent.$parent.$parent.$refs.MeetingIndex[0].isInit
          this.$parent.$parent.$parent.$refs.MeetingIndex[0].$refs.meeting.initData({res: res},IsInit)
          // this.$parent.$parent.$parent.$refs.MeetingIndex[0].isInit = false;
        })


          
         
          // this.addPanel({res: res}, {title: '视频会议', name: 'VideoPanel'});
        } else {
          // this.addPanel({res: res}, {title: '视频会议', name: 'ConferenceDiscuss'});
        }
      }
    });





  },
  methods: {
     sentPrantV(data){
      if(data.name=='MeetingOutside'){
        let meetirnOutsideUrl='http://10.79.25.136';
        data.tourl=meetirnOutsideUrl+'?nickname='+this.curUser.userName;
      }
      this.$emit("TabV",data)
    }
   

  },
  destroyed: function() {
   
  },
  // beforeRouteLeave(to, from, next) {
   
  // }
};
</script>

<style scoped>
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 17px);
}

.homebox{
  height: 100%;
  background:url(../../../static/main/screen/bg.png) no-repeat center;
  padding:35px 78px;
 box-sizing: border-box;
}
.homeContent{
  width: 100%;
  height: 100%;
  /* overflow-y: auto; */
}
.divHomeBox{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin:25px 0 0 0;
  
}
.divHomeBox.spaceBetween{
  justify-content: space-between;
}
.divHoveType{
  font-weight:600;
  color:#1296db;
  font-size: 18px;
}
.type_icon{
  display: inline-block;
  width: 26px;
  height: 23px;
      vertical-align: middle;
    margin: -5px 5px 0 0;
}
.icon_video{
   background: url(../../../static/home/icon_video.png);
     background-size:26px 23px;
}
.icon_voice{
   background: url(../../../static/home/icon_voice.png);
    background-size:26px 23px;
}
.divHomeBox .el-card{
    cursor: pointer;
    margin: 0 24px 24px 0;
    width: 250px;
    height: 240px;
    text-align: center;
  background: url(../../../static/home/icon_bg.png);
    background-size: contain;
    border: none;
}
#divHomeBox .el-card:hover{
 background: url(../../../static/home/icon_bg_hover.png);
  background-size: 316px 322px;
}
.text-title{
  font-size: 22px;
}
.el-card:hover .text-title{
 
  color:#fff;
}
.divHomeBox .image{
    width: 135px;
    height: 135px;
    /* margin: 30px auto 0; */
    margin: 25px auto;
    display: block;
}

.text-ellipsis{
  text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
}
.text-bold{
  font-weight: bold;
}

.text-introduce{
  color:#c2d7d7;
      display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-line-pack: justify;
    justify-content: center;
    height: 48px;
    margin-top:5px;
    font-size: 16px;
}
.text_ellipsemore{
  display: -webkit-box;
-webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
        overflow: hidden;
    text-overflow: ellipsis;
}
.textadd{
      height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.divHomeBox  .addimage{
  display: block;
    padding: 2px;
    width: 160px;
    height: 160px;
    color:#fff;
    background: url(../../../static/home/u64.png) no-repeat center;
    background-size: 100px 100px;
    margin: 46px 78px 0;
}


</style>