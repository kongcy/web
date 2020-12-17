<template>
  <div class="MeetingManagebox"  style="height:100%">
      <div class="meetingNav">
          <span class="goback-span" @click="goBackMeetingInfo">
            <i class="icon-goback"></i>
            <span class="goback">返回会议首页</span>
          </span>
          <span>--会议管理</span>
      </div>
      <div class="manageList-content">
            <!-- 左上角icon -->
            <div class="title-bg myMeeting-title-bg"></div>
            <div class="manageList-head">
                <span class="clickChange" :class="{'title-act':checkWho == 'historyMeeting'}" @click="refreshTableData('historyMeeting',true)">历史会议</span>
                <span>/</span>
                <span class="clickChange" :class="{'title-act':checkWho == 'meetingTemplate'}" @click="refreshTableData('meetingTemplate',true)">会议模板</span>
            </div>
            <!-- 会议模板 -->
            <div class="tb-manageList" v-if="checkWho=='meetingTemplate'">
                <div class="filter-div">
                  <div class="filter-item">
                    <span class="label-filter">时间范围</span>
                    <el-date-picker
                        class="meetingTimeInput"
                        v-model="meetingTime"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="handleSearchByKey">
                    </el-date-picker>
                  </div>
                  <div class="filter-item inp">
                    <span class="label-filter">模板名称</span>
                    <el-input v-model="templateName" placeholder="请输入模板名称" >
                      <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                    </el-input>
                  </div>
                  <div class="myMeeting-join"  @keyup.enter.native="handleSearchByKey"> 
                      <el-button type="primary" @click="addTemplate"><i class="btn-icon-add"></i><span>新建会议模板</span></el-button>
                  </div>
                </div>
                <!-- 表格  模板-->
                <el-table :data="tableData" key="tableData" style="width: 100%" :header-cell-style="operateCell">
                  <el-table-column prop="templateName" label="会议名称" > </el-table-column>
                  <el-table-column prop="creatorName" label="创建者" > </el-table-column>
                  <el-table-column prop="attendance" label="参会人数"> </el-table-column>
                  <el-table-column type="index" label="排序" width="180px"> </el-table-column>
                  <el-table-column label="操作" >
                      <template slot-scope="scope">
                          <span class="meeting-operate">
                          <span @click="updateTemplate(scope.row)">编辑</span>
                          <span @click="delTemplate(scope.row)">删除</span>
                          <span @click="startConferenceByTemplate(scope.row)">发起会议</span>
                      </span>
                      </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination class="pagination" key="paginationtemplate" background layout="prev, pager, next" 
                :total="total"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                > </el-pagination>
            </div>
            <!-- 历史会议 -->
            <div class="tb-manageList" v-if="checkWho=='historyMeeting'">
                <div class="filter-div">
                  <div class="filter-item">
                    <span class="label-filter">时间范围</span>
                    <el-date-picker
                        class="meetingTimeInput"
                        v-model="meetingHistoryTime"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="handleSearchByKey">
                    </el-date-picker>
                  </div>
                  <div class="filter-item inp">
                    <span class="label-filter">会议名称</span>
                    <el-input v-model="templateName" placeholder="请输入会议名称" >
                      <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                    </el-input>
                  </div>
                </div>
                <el-table :data="tableDataHistory"  key="tableDataHistory" style="width: 100%" :header-cell-style="operateCell">
                  <el-table-column prop="conferenceName" label="会议名称" > </el-table-column>
                  <el-table-column prop="conferenceTime" label="开始时间" > </el-table-column>
                  <el-table-column prop="conferenceDuration" label="会议时长"> </el-table-column>
                  <el-table-column prop="conferenceId" label="会议ID" width="180px"> </el-table-column>
                  <el-table-column label="操作" >
                      <template slot-scope="scope">
                          <span class="meeting-operate">
                          <span @click="historyMeetingInfo(scope.row)">详情</span>
                          <span @click="handleReStartMeeting(scope.row)">重启</span>
                          <span @click="goAddTemplate(scope.row)">转为模板</span>
                      </span>
                      </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination class="pagination" key="paginationHistory"  background layout="prev, pager, next" 
                :total="total"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                > </el-pagination>
            </div>
      </div>
  </div>
</template>
<script>

import Fun from "@/common/fun";
import Enum from "@/common/enum";
export default {
  name: "MeetingManage",
  components: {
  },
  data() {
    return {
        checkWho:'meetingTemplate',
        total:0,
        pageSize:9,
        tableData: [],
        tableDataHistory: [],
        currentPage:1,
        meetingHistoryTime:[], //历史会议 时间筛选
        meetingTime:[], //模板 时间筛选
        templateName:''
    };
  },
  mounted() {
  },
  methods: {
    showManage(data){
      this.refreshTableData(data)
    },
    //tab切换
    refreshTableData(ckWho,selfPage){
      if(selfPage && this.checkWho == ckWho){
        return;
      }
      this.resetData();
      this.currentPage = 1;
      this.meetingHistoryTime = []; //历史会议 时间筛选
      this.meetingTime = []; //模板 时间筛选
      this.templateName = '';
      this.checkWho = ckWho;
      if(ckWho == 'meetingTemplate'){
        this.getQueryList();
      }else{
        this.getQueryListHistory();
      }
    },
    
    // 获取 模板 列表数据
    getQueryList(){
        let conferenceBeginTime = '';
        let conferenceEndTime = '';
        if(this.meetingTime&&this.meetingTime.length > 0 ){
            conferenceBeginTime = this.meetingTime[0];
            conferenceEndTime = this.meetingTime[1];
        }
        this.apiSDK.getConferenceTemplateList(conferenceBeginTime,conferenceEndTime,this.templateName,this.currentPage,this.pageSize,res => {
          this.resetData();
          if(res){
            this.total = res.total;
            this.tableData = res.data;
          }
        })
    },
    
    // 获取 历史会议 列表数据
    getQueryListHistory(){
      let conferenceBeginTime = '';
      let conferenceEndTime = '';
      if( this.meetingHistoryTime && this.meetingHistoryTime.length > 0 ){
          conferenceBeginTime = this.meetingHistoryTime[0];
          conferenceEndTime = this.meetingHistoryTime[1];
      }
      //speak(发言会议)   discuss(讨论会议)
      this.apiSDK.queryHistoryMeetingList(this.templateName, conferenceBeginTime, conferenceEndTime, this.currentPage, this.pageSize, 'speak', (res)=>{
          this.resetData();
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
                  this.tableDataHistory.push(item);
              });
          }
      });
    },
    
    // 新建 会议模板
    addTemplate(){
        this.$parent.$refs.conferenceTemplateDialog.showDialog();
    },
    
    //删除 会议模板
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
                  this.getQueryList();
              }else{
                  this.showremind('error',res.msg);
              }
          })
      }).catch(() => {    
      });
    },
    
    //发起会议
    startConferenceByTemplate(val){
      console.log('bbbbbb',val)
      let byTempalte = true;
      this.$parent.$refs.conferenceScene.showDialog(val,byTempalte);
    },

    //历史会议详情
    historyMeetingInfo(val){
      this.$parent.$refs.meetingInfo.historyMeetingInfo(val)
    },
    
    //重开历史会议
    handleReStartMeeting(row){
        console.log('ddddd',row)
        this.$parent.$refs.conferenceScene.showDialog(row);
        // if(row.confMode === 'speak') {
        //     this.apiSDK.startHistoryMeeting(row.conferenceId);
        //     this.isVisible = false;
        // } else if (row.confMode === 'discuss') {
        //     let USER = xtxk.cache.get("USER");
        //     if(row.chairManId && row.chairManId === this.userId) {
        //         this.apiSDK.publishRestartHistoryDiscussConference(row.conferenceId);
        //     } else {
        //         this.imSendMessage(row);
        //     }
        // }
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

    //编辑 模板
    updateTemplate(val){
      let data = {
        title:'编辑模板',
        item:val
      }
      this.$parent.$refs.meetingInfo.updateTemplate(val)
    },
    
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      if(this.checkWho == 'meetingTemplate'){
        this.getQueryList();
      }else{
        this.getQueryListHistory();
      }
    },

    //搜索
    handleSearchByKey(){
      this.resetData();
      this.currentPage = 1;
      if(this.checkWho == 'meetingTemplate'){
        this.getQueryList();
      }else{
        this.getQueryListHistory();
      }
    },
    
    // 返回首页
    goBackMeetingInfo(){
        this.checkWho = 'meetingTemplate';
        this.$parent.goMeetingInfo();
    },
    //重置数据
    resetData(){
        this.total = 0;
        this.tableData = [];
        this.tableDataHistory = [];
    },
    showremind(type,message){
        this.$notify({
            message: message,
            type: type,
        });
    },
    // 表格 头部 操作栏 字符递进6px
    operateCell({row, column, rowIndex, columnIndex}) {
        if(columnIndex == 4){
            return "text-indent: 6px;"
        }
        return '';
    },
  },
  destroyed: function() {
   
  },
};
</script>

<style scoped>
.MeetingManagebox{
    padding:15px 25px 20px 25px;
    box-sizing: border-box;
}
.meetingNav{
    height: 30px;
    line-height: 30px;
}
.meetingNav span{
    font-size: 16px;
    color: #ffffff;
}
.meetingNav .goback-span{
    cursor: pointer;
}
.meetingNav .goback{
    font-size: 14px;
    color: #528de7;
}
.icon-goback:hover,.goback-span:hover .icon-goback{
    background: url(../../../static/stratege/hover-sBack.png) no-repeat top;
}
.icon-goback{
    display: inline-block;
    width: 20px;
    height: 30px;
    background: url(../../../static/stratege/stratege-back.png) no-repeat top;
    background-size: 24px 24px;
    vertical-align: middle;
}
.manageList-content{
    width: 100%;
    height: calc(100% - 40px);
    margin-top: 10px;
    background: url(../../../static/meeting/meeting-manage-bg.png) no-repeat; 
    background-size: 100% 100%;
    position: relative;
}

/* 左上角图标  */
.title-bg{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 124px;
  height: 6px;
  background: url(../../../static/main/screen/title_bg.png);
  background-size: 124px 6px;
}
.manageList-head{
  width: 100%;
  height: 40px;
  line-height: 45px;
  background:url(../../../static/meeting/manage-title-bg.png) no-repeat;
  background-size: 100% 40px;
  font-size: 18px;
  color: #b7c1d0;
  padding-left: 22px;
  box-sizing: border-box;
}
.clickChange{
    cursor: pointer;
}
.manageList-head .title-act{
   color: #ffffff;
}
.filter-div{
    width: 100%;
    height: 75px;
    position: relative;
}
/* 表格样式 */
.tb-manageList{
  padding: 0 22px;
  position: relative;
  height: calc(100% - 75px);
}
.meeting-operate,.meeting-operate span{
    display: inline-block;
}
.meeting-operate span{
  width: 50px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  color: #5d98ff;
  text-align: center;
  margin-right: 5px;
  padding-right: 0px;
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
  color: #ffffff;
}
.el-table--border::after, .el-table--group::after, .el-table::before{
    background-color:transparent
}
.pagination{
    position:absolute;
    right: 20px;
}
.el-table{
    height: calc(100% - 95px);
}
.myMeeting-join{
    position: absolute;
    right:0px ;
    top: 20px;
}
.myMeeting-join button{
  width: 142px;
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
.label-filter{
  display: inline-block;
  width: 68px;
  color:#d3dcf0;
}
.filter-item{
  display: inline-block;
  margin-top: 16px;
}
.filter-item.inp{
  width: 365px;
  margin-left: 30px;
}
.filter-item.inp .el-input{
  width: 280px;
}
</style>