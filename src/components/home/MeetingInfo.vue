<template>
  <div id="MeetingInfo" class="mettingInfo">
    <el-scrollbar class="MeetingInfoScroll">
      <div class="main">
        <!-- 会议助手 + 会议管理 -->
        <div class="main-l">
            <!-- 会议助手 -->
            <div class="join-main">
                <!-- 左上角icon -->
                <div class="title-bg"></div>
                <div class="join-meeting-head">
                    <span>会议助手</span>          
                </div> 
                <div class="join-content">
                  <div class="start-meeting">
                      <div class="start-meeting-content">
                        <i class="icon-start"></i>
                        <span>发起会议</span>
                        <i class="icon-go" @click="startConference"></i>
                      </div>
                  </div>
                  <div class="join-meeting">
                      <div class="join-meeting-content">
                        <i class="icon-join"></i>
                        <span>加入会议</span>
                        <i class="icon-go" @click="joinConference"></i>
                      </div>
                  </div>
                </div>
            </div>
            <!-- 会议管理 -->
            <div class="meeting-manage">
                <!-- 左上角icon -->
                <div class="title-bg"></div>
                <div class="meeting-manage-head">
                    <span>会议管理</span>      
                    <i class="icon-meeting-manage" @click="goMeetingManage('meetingTemplate')"></i>    
                </div> 
                <div class="meeting-manage-content">
                  <el-tabs v-model="activeXC" @tab-click="handleClick">
                      <el-tab-pane name="historyMeeting" label="历史会议" style="height:100%">
                      </el-tab-pane>
                      <el-tab-pane name="templetMeeting" label="会议模板" style="height:100%">
                      </el-tab-pane>
                  </el-tabs>
                </div>
                <!-- 历史会议 -->
                <div class="historyMeeting" v-if="activeXC == 'historyMeeting'">
                  <div class="historyMeeting-box">
                    <ul class="historyMeeting-list">
                      <li class="historyMeeting-title">
                        <span class="meeting-name">会议名称</span>
                        <span class="start-time">开始时间</span>
                        <span class="time-count">会议时长</span>
                        <span class="meeting-id">会议ID</span>
                        <span class="meeting-operate">操作</span>
                      </li>
                      <li class="historyMeeting-item" v-for="item in historyArr" :key="item.conferenceId">
                        <span class="meeting-name">{{item.conferenceName}}</span>
                        <span class="start-time">{{item.conferenceTime}}</span>
                        <span class="time-count">{{item.conferenceDuration}}</span>
                        <span class="meeting-id">{{item.conferenceId}}</span>
                        <span class="meeting-operate">
                          <span @click="historyMeetingInfo(item)">详情</span>
                          <span @click="handleReStartMeeting(item)">重启</span>
                          <span @click="goAddTemplate(item)">转为模板</span>
                        </span>
                      </li>
                    </ul>
                    <div class="go-more" @click="goMeetingManage('historyMeeting')">查看更多>></div>
                  </div>
                </div>
                <!-- 会议模板 -->
                <div class="historyMeeting" v-else>
                  <div class="historyMeeting-box">
                    <ul class="historyMeeting-list">
                      <li class="historyMeeting-title">
                        <span class="meeting-name">会议名称</span>
                        <span class="start-time">创建者</span>
                        <span class="time-count">参会人数</span>
                        <span class="meeting-id">排序</span>
                        <span class="meeting-operate">操作</span>
                      </li>
                      <li class="historyMeeting-item" v-for="(item,index) in manageArr" :key="item.templateId">
                        <span class="meeting-name">{{item.templateName}}</span>
                        <span class="start-time"> {{item.creatorName}}</span>
                        <span class="time-count"> {{item.attendance}}</span>
                        <span class="meeting-id">{{index + 1}}</span>
                        <span class="meeting-operate">
                          <span @click="updateTemplate(item)">编辑</span>
                          <span @click="delTemplate(item)">删除</span>
                          <span @click="startConferenceByTemplate(item)">发起会议</span>
                        </span>
                      </li>
                    </ul>
                    <div class="go-more" @click="goMeetingManage('meetingTemplate')">查看更多>></div>
                  </div>
                </div>
            </div>
        </div>
        <!-- 我的会议 -->
        <div class="main-r">
          <!-- 左上角icon -->
          <div class="title-bg myMeeting-title-bg"></div>
          <div class="myMeeting-head">
            <span>我的会议</span>
          </div>
          <!-- 搜索  -->
          <div class="myMeeting">
            <!-- 筛选 -->
            <div class="serachWrap myMeeting-search">
                <el-row :gutter="24" style="margin:0px">
                    <el-col :span="14" style="padding-left: 0">
                        <div class="search" >
                            <el-input v-model="input_metting" placeholder="请输入搜索内容" @keyup.enter.native="handleSearchByKey">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :span="10" style="padding-left: 24px; " >
                      <div class="strategeInfo-type">
                          <el-select v-model="mettingType"  :popper-append-to-body="false">
                              <el-option label="全部" value="">
                                  <i v-if="mettingType == ''"></i>
                                  <span>全部</span>
                              </el-option>
                              <el-option label="仅显示今日会议" value="1">
                                  <i v-if="mettingType == '1'"></i>
                                  <span>仅显示今日会议</span>
                              </el-option>
                              <el-option label="仅显示我主持的会议" value="2">
                                  <i v-if="mettingType == '2'"></i>
                                  <span>仅显示我主持的会议</span>
                              </el-option>
                              <el-option label="仅显示我被邀请的会议" value="3">
                                  <i v-if="mettingType == '3'"></i>
                                  <span>仅显示我被邀请的会议</span>
                              </el-option>
                          </el-select>
                      </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 列表数据 -->
            <div class="myMeeting-List-box">
              <el-scrollbar class="innerScroll">
                  <div class="myMeeting-List">
                    <div class="myMeeting-item" v-for="(item,index) in myMeetingArr" :key="item.conferenceId">
                      <div class="item-box item-left">
                        <p class="myMeeting-day">11月3号 今天</p>
                        <p class="myMeeting-name">A项目会议11</p>
                        <p class="myMeeting-id">
                          <!-- <span >会议ID: xxxxxxxxxx</span> -->
                          <el-input type="text" :value="item.conferenceId" readonly :id="'conferenceInfoSceneID_' + index" class="copy-input" style="width:100px;"></el-input>
                          <i class="icon-copy" @click="copyID(index)"></i></p>
                      </div>
                      <div class="item-box item-center">
                        <p class="myMeeting-time">09:00-10:30</p>
                        <p class="myMeeting-compere">主持人：XXX</p>
                      </div>
                      <div class="item-box item-right">
                        <p class="myMeeting-statusIn" v-if="false"><i class="icon-statusIn"></i> <span>进行中...</span> </p>
                        <p class="myMeeting-statusWait" v-else><i class="icon-statusWait"></i><span>待开始</span></p>
                        <p class="myMeeting-join"> 
                          <el-button type="primary"><i class="btn-icon-add"></i><span>加入会议</span></el-button>
                        </p>
                      </div>
                    </div>
                  </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
export default {
  name: "MeetingInfo",
  components: {
  },
  data() {
    return {
      activeXC:'historyMeeting',
      historyArr:[],
      manageArr:[],
      myMeetingArr:8,
      input_metting:'',
      mettingType:'',
      total:0,
      pageIndex:1,
      pageSize:3,
      confMode: 'speak', // confMode:speak(发言会议)   discuss(讨论会议)
    }
  },
  mounted() {
    const self = this;
    //会议管理
    this.getHistoryMeetingList('', '', '', this.pageIndex, this.pageSize, this.confMode);
    // 我的会议
    this.handleSearchByKey();
  },
  methods: {
    // 会议管理tab切换
    handleClick(val){
      this.activeXC = val.name;
      if(this.activeXC == "historyMeeting"){
        this.getHistoryMeetingList('', '', '', this.pageIndex, this.pageSize, this.confMode)
      }else{
        this.getManageQueryList();
      }
    },
    
    //我的会议 列表筛选
    handleSearchByKey(){
      this.apiSDK.getMyConferenceList(1,10,this.input_metting,this.mettingType,res => {
        console.log('vvvvvbbbbbbb',res)
        if(res.data){
          this.myMeetingArr = res.data
        }
      })
    },
    
    // 调接口  会议管理--历史会议
    getHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, page, pageSize, confMode){
        this.apiSDK.queryHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, page, pageSize, confMode, (res)=>{
            this.historyArr = [];
            if( res ){
                this.total = res.totalCnt;
                res.rows.forEach((item)=>{
                    let time1 = item.conferenceEndTime.replace(/\-/g,'/');
                    let time2 = item.conferenceTime.replace(/\-/g,'/');
                    let diff = ( new Date(time1).getTime() - new Date(time2).getTime() )/1000;
                    let diff_h = parseInt(diff/3600);
                    let diff_m = parseInt((diff - diff_h*3600)/60);
                    let dura = (diff_h>0?diff_h+"小时":"") + (diff_m>0?diff_m+"分":"1分")
                    item.conferenceDuration = dura;
                    this.historyArr.push(item);
                });
            }
        });
    },
    
    //调接口 模板 列表
    getManageQueryList(){
        let conferenceBeginTime = '';
        let conferenceEndTime = '';
        this.apiSDK.getConferenceTemplateList(conferenceBeginTime,conferenceEndTime,'',this.pageIndex, this.pageSize,res => {
          this.manageArr = [];
          if(res){
              this.manageArr = res.data;
          }
        })
    },
    
    // ID入会
    joinConference(){
      this.$parent.$refs.joinConferenceDialog.showDialog();
    },
    
    //发起会议
    startConference(){
      this.$parent.$refs.conferenceScene.showDialog();
    },
    
    //会议管理页   data  meetingTemplate模板  historyMeeting历史
    goMeetingManage(data){
      this.$parent.goMeetingManage(data);
    },
    
    //编辑 模板
    updateTemplate(item){
      let data = {
        title:'编辑模板',
        item:item
      }
      this.$parent.$refs.conferenceTemplateDialog.showDialog(data)
    },
    
    //删除模板
    delTemplate(item){
      console.log(item)
      this.$confirm('是否确定删除?', '信息提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false
      }).then(() => {
          this.apiSDK.deleteConferenceTemplate(item.templateId,res => {
              if(res.code == 1){
                  this.showremind('success',res.msg);
                  //成功刷新表格
                  this.getManageQueryList();
              }else{
                  this.showremind('error',res.msg);
              }
          })
      }).catch(() => {    
      });
    },
    
    //发起会议
    startConferenceByTemplate(val){
      let byTempalte = true;
      this.$parent.$refs.conferenceScene.showDialog(val,byTempalte);
    },

    //历史会议详情
    historyMeetingInfo(val){
      console.log(val)
      this.apiSDK.getHistoryInfoByHistoryId(val.conferenceId, (res) =>{
        if( res ){
            let data = {
                conferenceId    : val.conferenceId,
                groupName       : val.conferenceName,
                schemeName      : res.schemeName,
                password        : res.password,
                confMode        : val.confMode,
                meetingMode     : res.meetingMode,
                isAutoRecord    : res.isAutoRecord,
                chairMan        : val.chairMan,
                description     : val.description,
                beginTime       : val.conferenceTime,
                endTime         : res.endTime,
                needPassword    : res.needPassword,
                conferenceDuration: val.conferenceDuration,
                users           : res.users,
                devices         : res.devices,
                isHistoryMeetingDetail: true
            };
          this.$parent.$refs.detailDialog.showDialog(data)
        }
      });
    },
    
    //重开历史会议
    handleReStartMeeting(row){
        this.$parent.$refs.conferenceScene.showDialog(row);
    },
    
    //转为模板
    goAddTemplate(val){
      let data = {
        title:'新建会议模板',
        item:{
          templateId:'',
          templateName:val.conferenceName,
          describe:val.description,
          isPreMain:'0',
          isDefaultLock:'0',
          isNeedPwd:'0',
          password:'',
          isAutoMute:'0',
          isDefaultRecord:'0',
          userDtoList:val.members || [],
        }
      }
      this.$parent.$refs.conferenceTemplateDialog.showDialog(data)
    },
    
    //复制会议ID
    copyID(index) {
        let $node = document.getElementById('conferenceInfoSceneID_'+index);
        $node.select();
        if(document.execCommand('copy', true)){
            this.$message({
                type: 'success',
                message: '已成功复制到剪贴板'
            });
        }
    },
    
    showremind(type,message){
        this.$notify({
            message: message,
            type: type,
        });
    },
  }
};
</script>

<style scoped>
#MeetingInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  margin: 0px auto;
  padding: 20px 25px;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
#MeetingInfo .main{
  height: 100%;
  width: calc(966px + 886px + 18px);
  display: flex;
}
/* 左侧排版 */
.main .main-l{
  width: 966px;
  display: inline-block;
}
/* 会议助手   */
.join-main{
  width: 100%;
  height: 322px;
  background-color: #0c1c3f;
  border:2px solid #265a86;
  color: #fff;
  position: relative;
  box-sizing: border-box;
}
/* 会议助手 左上角图标  */
.title-bg{
  position: absolute;
  top:-2px;
  left:-2px;
  width: 124px;
  height: 6px;
  background: url(../../../static/main/screen/title_bg.png);
  background-size: 124px 6px;
}
/* 会议助手  头部 */
.join-meeting-head{
  width: 100%;
  height: 42px;
  line-height: 48px;
  padding-left: 24px;
  font-size: 18px;
  box-sizing: border-box;
}
/* 会议助手  内容 */
.join-content{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 42px);
  padding: 14px 24px 0px;
  box-sizing: border-box;
}
/* 会议助手  加入 + 开始 背景图*/
.start-meeting,.join-meeting{
  width: 450px;
  height: 234px;
  background: url(../../../static/meeting/join-bg.png) no-repeat;
  font-size: 26px;
  letter-spacing: 5px;
}
/* 会议助手 选中背景图  */
.start-meeting:hover,
.join-meeting:hover,
.join-meeting-act{
  background: url(../../../static/meeting/join-bg-act.png) no-repeat;
}
.start-meeting-content,.join-meeting-content{
  width: 100%;
  height: 100%;
  padding: 47px 50px;
  box-sizing: border-box;
  vertical-align: middle;
}
/* 会议助手  开始+加入图标 */
.icon-start,.icon-join{
  display: inline-block;
  width: 160px;
  height: 140px;
  vertical-align: middle;
}
.icon-start{
  background: url(../../../static/meeting/icon-start.png) no-repeat;
}
.icon-join{
  background: url(../../../static/meeting/icon-join.png) no-repeat;
}
.icon-go{
  display: inline-block;
  width: 26px;
  height: 26px;
  background: url(../../../static/meeting/icon-go.png) no-repeat;
  vertical-align: middle;
}
.icon-go:hover,
.icon-go-act{
  cursor: pointer;
  background: url(../../../static/meeting/icon-go-act.png) no-repeat;
}

/* 会议助手  结束 */

/* 会议管理开始 */
.meeting-manage{
  width: 100%;
  background:url(../../../static/meeting/manage-bg.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  position: relative;
}
.meeting-manage-head{
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #ffffff;
  font-size: 18px;
  background:url(../../../static/meeting/manage-title-bg.png) no-repeat;
  background-size: 100% 40px;
  padding-left: 24px;
  box-sizing: border-box;
}
.icon-meeting-manage{
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  background:url(../../../static/meeting/icon-meeting-manage.png) no-repeat;
  background-size:20px  20px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top:10px;
}
.icon-meeting-manage:hover{
  background:url(../../../static/meeting/icon-meeting-manage-act.png) no-repeat;
  background-size:20px  20px;
}
/* tab切换 */
.meeting-manage-content{
    width: 100%;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    border: 1px solid#365076;
    background: none;
    box-sizing: border-box;
    position: relative;
}
.meeting-manage-content /deep/ .el-tabs>.el-tabs__header{
    background: transparent!important;
    padding-left: 24px;
}
.meeting-manage-content /deep/ .el-tabs__item{
  padding: 0 12px;
  color:#B7C1D0;
  font-size: 16px;
}
.meeting-manage-content /deep/ .el-tabs--top .el-tabs__item.is-top:last-child{
  padding-left: 46px;
}
.meeting-manage-content /deep/ .el-tabs__item::after{
  content:'';
  margin: 0;
}
.meeting-manage-content /deep/ .el-tabs__item.is-active{
  color:#fff;
}
.meeting-manage-content /deep/ .el-tabs__active-bar{
  height: 5px;
}
.el-tabs__item.is-active .icontree-events{
    background:url(../../../static/resource_tree/tab/events_active.png) no-repeat center;
    background-size: 18px;
}
.meeting-manage-content /deep/ .el-icon-arrow-left:before,
/deep/ .el-icon-arrow-right:before {
    color: #D7E7FF;
}

/deep/ .el-tabs__active-bar{
    background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%);
}

/* tab切换  结束*/
/* 列表样式开始 */
.historyMeeting{
  min-height: 400px;
}
.historyMeeting-box{
  width: 100%;
  padding: 27px 24px 0;
  box-sizing: border-box;
}
.historyMeeting-title{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #324d78;
  font-size: 14px;
  color: #9eabc0;
  display: flex;
  justify-content: space-between;
  padding:0 17px;
  box-sizing: border-box;
}
.historyMeeting-list{
  list-style: none;
  height: 254px;
}

.historyMeeting-title span,
.historyMeeting-item span{
  display: inline-block;
  width: 164px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
  box-sizing: border-box;
}
.historyMeeting-item {
  width: 100%;
  height: 68px;
  font-size: 14px;
  color: #d7e7ff;
  padding:0 17px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.historyMeeting-item:nth-child(odd){
  background: url(../../../static/common/reminder_bg.png) no-repeat -5px;
  background-size: 105% 105%;
}
.historyMeeting-item span{
  height: 68px;
  line-height: 68px;
}
.meeting-name{
  width: 190px!important;
}
.meeting-operate{
  width: 230px!important;
  padding-right: 0px!important;
}
.meeting-operate span{
  width: 50px;
  height: 32px;
  cursor: pointer;
  color: #5d98ff;
  line-height: 32px;
  text-align: center;
  margin-right: 5px;
  margin-top: 18px;
  padding-right: 0px;
}
.historyMeeting-title .meeting-operate{
  text-indent: 11px;
}
.time-count{
  text-indent: 30px;
}
.meeting-operate span:last-child{
  width: 85px;
  margin-right: 0;
}
.meeting-operate span:last-child:hover{
  width: 85px;
  margin-right: 0;
}
.meeting-operate span:hover{
  background-color: #5d98ff;
  border-radius: 2px;
  width: 50px;
  height: 32px;
  line-height: 32px;
  color: #ffffff;
}
.go-more{
  width: 100%;
  height: 68px;
  line-height: 68px;
  color: #5d98ff;
  font-size: 14px;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
}
/* 左侧排版   结束*/

/* 右侧排版 */
.main-r{
  display: inline-block;
  width: 886px;
  background:url(../../../static/meeting/my-meeting-bg.png) no-repeat;
  background-size: 100% 100%;
  margin-left: 18px;
  position: relative;
}
.myMeeting-title-bg{
  left: 0px;
  top:0px;
}
.myMeeting-head{
  width: 890px;
  height: 40px;
  line-height: 45px;
  background:url(../../../static/meeting/manage-title-bg.png) no-repeat;
  background-size: 100% 40px;
  font-size: 18px;
  color: #ffffff;
  padding-left: 22px;
  box-sizing: border-box;
}
/* 条件搜索 开始 */
.el-select,.serachWrap .search{
  width: 100%;
  height: 44px;
}

#MeetingInfo /deep/ .el-select .el-input, #MeetingInfo /deep/ .search .el-input{
  height: 44px;
}

#MeetingInfo /deep/ .el-select .el-input__inner, #MeetingInfo /deep/ .search .el-input__inner{
  height: 44px!important;
  background: #11274C!important;
}
.myMeeting-search{
  width: 100%;
  height: 72px;
  border-bottom: 1px solid #365076;
  padding: 14px 20px;
  box-sizing: border-box;
}
/* 条件搜索 结束 */

/* 我的回忆 列表 */
.myMeeting{
  height: calc(822px - 40px);
  overflow: hidden;
}
.myMeeting-List-box{
  width: 100%;
  height: calc(822px - 112px);
  overflow: hidden;
}
.myMeeting-List{
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}
.myMeeting-item{
  width: 100%;
  height: 150px;
  background: url(../../../static/meeting/myMeeting-bg.png) no-repeat center;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 15px 35px;
  box-sizing: border-box;
}
.myMeeting-item:hover {
  background: url(../../../static/meeting/myMeeting-bg-act.png) no-repeat center;
  background-size: 100% 100%;
}
.myMeeting-item:last-child{
  margin-bottom: 40px;
}
.item-box {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.item-box p{
  width: 100%;
  height: 38px;
  line-height: 38px;
}

.item-left{
  width: 45%;
}
.item-center{
  width: 33%;
}
.item-right{
  width: 18%;
  text-align: right;
}
.myMeeting-day{
  font-size: 18px;
  color: #ebf0f8;
}
.myMeeting-name{
  font-size: 18px;
  color: #ffffff;
}
.myMeeting-id{
  font-size: 16px;
  color: #6f84a3;
}
.myMeeting-id span{
  display: inline-block;
  vertical-align: middle;
}
.myMeeting-id .icon-copy{
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(../../../static/meeting/copy.png) no-repeat center;
  background-size: 100% 100%;
  vertical-align: middle;
  margin-left: 4px;
}
.myMeeting-id .icon-copy:hover{
  background: url(../../../static/meeting/copy_active.png) no-repeat center;
  background-size: 100% 100%;
  cursor: pointer;
}

.myMeeting-time{
  font-size: 18px;
  color: #9aa9c0;
}
.myMeeting-compere{
  font-size: 16px;
  color: #9aa9c0;
}
.item-right .myMeeting-statusIn{
  font-size: 14px;
  line-height: 20px;
  color: #f19738;
}
.myMeeting-statusIn .icon-statusIn,.myMeeting-statusWait .icon-statusWait{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.myMeeting-statusIn .icon-statusIn{
  background: url(../../../static/meeting/icon-statusIn.png) no-repeat center;
  background-size: 100% 100%;
  margin-right: 2px;
}
.item-right .myMeeting-statusWait{
  font-size: 14px;
  line-height: 20px;
  color: #5de2ff;
}
.myMeeting-statusWait .icon-statusWait{
  background: url(../../../static/meeting/icon-statusWait.png) no-repeat center;
  background-size: 100% 100%;
  margin-right: 6px;
}
.myMeeting-join button{
  width: 118px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  padding:0px;
  vertical-align: middle;
}
.btn-icon-add{
  display: inline-block;
  width: 14px;
  height: 16px;
  background: url(../../../static/meeting/btn-icon-add.png) no-repeat top;
  background-size: 14px 14px;
  vertical-align: middle;
  margin-right: 14px;
}

/* 外层滚动条 */
.MeetingInfoScroll.el-scrollbar{
    height: calc(100% + 17px);
    width: calc(100% + 14px);
}
.MeetingInfoScroll.el-scrollbar /deep/ .el-scrollbar__wrap{
    height: calc(100% + 17px);
}
/* 内层滚动条 */
.innerScroll.el-scrollbar{
    height: 100%;
}
.innerScroll.el-scrollbar /deep/ .el-scrollbar__wrap{
    height: calc(100% + 17px);
}

/* 滚动条宽度，位置 */
.MeetingInfoScroll /deep/ .el-scrollbar__bar.is-horizontal{
  height: 8px;
}
.MeetingInfoScroll /deep/ .el-scrollbar__bar.is-vertical{
  width: 8px;
  right: 2px;
}
.innerScroll.el-scrollbar /deep/ .el-scrollbar__bar.is-vertical {
  right: 7px;
}

.myMeeting-search /deep/ .el-select .el-select-dropdown{
  left: 0!important;
}

/deep/.copy-input input{
  max-width: 260px;
  border: 0;
  padding: 0;
  overflow: hidden;
}
</style>