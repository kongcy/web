<template>
 <!-- style="display: none;" -->
  <div class="homebox" style="display: none;"  >
    <el-scrollbar class="homeContent hiddenXScroll">
      <div class="divHoveType" ><i class="type_icon icon_video"></i>视频融合应用</div>
      <div class="divHomeBox" :class="tabs.length>5?'spaceBetween':''">
        <el-card :body-style="{ padding: '0px' }"  v-for="(item, index) in tabs" :key="index" shadow="hover" >
            <img  :src="''+item.imgurl" class="image"  @click="sentPrantV(item)">
            <div class="textbox" style="padding: 14px 28px; color:#fff" @click="sentPrantV(item)">
              <span class="text-ellipsis text-title" :title="item.title">{{item.title}}</span>
              <span class=" text-introduce" :title="item.introduce"><span class="text_ellipsemore">{{item.introduce}}</span></span>
            </div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

import Fun from "@/common/fun";
import Enum from "@/common/enum";
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
        {
          title: '视频监控',
          imgurl:"static/home/monitor.png",
          titleurl:'static/home/monitor_title.png',
          name:'Monitor',
          content: 'Monitor',
          ref: 'Monitor',
          closable: true,
          tourl:'',
          introduce:"",
        },
        // {
        //   title: '视频会商(外部)',
        //   imgurl:"static/home/meeting.png",
        //   titleurl:'static/home/meeting_title.png',
        //   name:'MeetingOutside',
        //   content: 'MeetingOutside',
        //   ref: 'MeetingOutside',
        //   closable: true,
        //   tourl:'http://localhost:8080/',
        //   introduce:"",
        // },
        
         {
          title: '视频诊断',
          imgurl:"static/home/videoDiagnose.png",
          titleurl:'static/home/videoDiagnose_title.png',
          name:'waiting',
          content: 'waiting',
          ref: 'waiting',
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
    this.curUser = xtxk.cache.get('USER');
    console.log('--------'+this.curUser);
    let that = this;
    setTimeout(() => {
      that.sentPrantV(this.tabs[0]);
    },1000);
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
/* .el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 20px);
} */

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
  cursor:pointer;
  margin:0 24px 24px 0;
  width: 316px;
  height: 322px;
  text-align: center;
  background: url(../../../static/home/icon_bg.png);
  background-size: 316px 322px;
  border:none;
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
  width:160px;
  height: 160px;
  margin:46px auto 0;
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