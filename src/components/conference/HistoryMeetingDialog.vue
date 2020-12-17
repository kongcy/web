<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="历史会议" width="1000px" height="800px"
            class="custom-dialog">
            <div class="historyMeetingWrap">
                <div class="historyMeetingTop">
                    <el-form :inline="true" :model="queryHistoryForm" ref="queryHistoryForm" class="demo-form-inline" label-width="64px"
                        status-icon :show-message=false>
                        <el-form-item label="会议名称" prop="meetingName" class="meetingNameItem">
                            <el-input v-model="queryHistoryForm.meetingName" placeholder="请输入会议名称关键字" class="meetingNameInput"></el-input>
                            <i></i>
                        </el-form-item>
                        <el-form-item label="开会时间" prop="meetingTime" class="meetingTimeItem">
                            <el-date-picker
                                class="meetingTimeInput"
                                v-model="queryHistoryForm.meetingTime"
                                type="datetimerange"
                                range-separator="~"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间">
                            </el-date-picker>
                            <!-- <i></i> -->
                        </el-form-item>
                        <el-form-item class="meetingBtnItem">
                            <el-button type="primary" @click="handleQueryHistoryMeeting">检索</el-button>
                            <el-button @click="handleCancelQueryHistoryMeeting">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="historyMeetingMain">
                    <div class="tableBox">
                        <el-table :data="historyMeetingTableData" border class="custom-table">
                            <el-table-column prop="conferenceName" label="分组名" align="center">
                            </el-table-column>
                            <el-table-column prop="chairMan" label="主席" align="center" width="180">
                            </el-table-column>
                            <el-table-column label="开会时间" align="center" width="220">
                                <template slot-scope="scope">
                                    <span>{{scope.row.conferenceTime}}</span><br>
                                    <span>{{scope.row.conferenceEndTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="operat" label="操作" align="center" width="260">
                                <template slot-scope="scope">
                                    <div class="historyMeetingBtn" v-if="scope.row.chairManId == userId" @click="handleReStartMeeting(scope.row)">重开</div>
                                    <div class="historyMeetingBtn" @click="handleClickHistoryMeetingDetail(scope.row)">详情</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pageBox">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            :current-page="pageIndex"
                            :total="total"
                             @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <detail-dialog ref="detailDialog" />
    </div>
</template>

<script>
import DetailDialog from "@/components/conference/DetailDialog.vue";
export default {
    name: "HistoryMeetingDialog",
    components: {
        DetailDialog,
    },
    data(){
        return{
            isVisible:false,
            userId:'',
            queryHistoryForm:{
                meetingName:'',
                meetingTime:[],
            },
            historyMeetingTableData:[],
            total:0,
            pageIndex:1,
            pageSize:10,
        }
    },
    methods:{
        showDialog(){
            this.isVisible = true;
            this.userId = xtxk.cache.get("USER").userId;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('历史会议');
            });
            this.getHistoryMeetingList('', '', '', this.pageIndex, this.pageSize);
        },
        // 调接口
        getHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, page, pageSize){
            this.apiSDK.queryHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, page, pageSize, (res)=>{
                this.historyMeetingTableData = [];
                if( res ){
                    this.total = res.totalCnt;
                    res.rows.forEach((item)=>{
                        this.historyMeetingTableData.push(item);
                    });
                }
            });
        },
        //分页
        handleCurrentChange(val){
            //console.log(`当前页: ${val}`);
            this.pageIndex = val;
            let conferenceName = this.queryHistoryForm.meetingName;
            let conferenceBeginTime = '';
            let conferenceEndTime = '';
            if( this.queryHistoryForm.meetingTime.length >0 ){
                conferenceBeginTime = this.queryHistoryForm.meetingTime[0];
                conferenceEndTime = this.queryHistoryForm.meetingTime[1];
            }
            this.getHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, this.pageIndex, this.pageSize);
        },
        //检索
        handleQueryHistoryMeeting(){
            this.pageIndex = 1;
            let conferenceName = this.queryHistoryForm.meetingName;
            let conferenceBeginTime = '';
            let conferenceEndTime = '';
            if( this.queryHistoryForm.meetingTime.length >0 ){
                conferenceBeginTime = this.queryHistoryForm.meetingTime[0];
                conferenceEndTime = this.queryHistoryForm.meetingTime[1];
            }
            this.getHistoryMeetingList(conferenceName, conferenceBeginTime, conferenceEndTime, this.pageIndex, this.pageSize);
        },
        // 重置
        handleCancelQueryHistoryMeeting(queryHistoryForm){
            this.$refs.queryHistoryForm.resetFields();
        },
        // 重开会议按钮
        handleReStartMeeting(row){
            this.apiSDK.startHistoryMeeting(row.conferenceId);
            this.isVisible = false;
        },
        // 详情
        handleClickHistoryMeetingDetail(row){
            // console.log(JSON.stringify(row));
            if( row.conferenceId ){
                this.apiSDK.getHistoryInfoByHistoryId(row.conferenceId, (res) =>{
                    if( res ){
                        let time1 = row.conferenceEndTime.replace(/\-/g,'/');
                        let time2 = row.conferenceTime.replace(/\-/g,'/');
                        let diff = ( new Date(time1).getTime() - new Date(time2).getTime() )/1000;
                        let diff_h = parseInt(diff/3600);
                        let diff_m = parseInt((diff - diff_h*3600)/60);
                        let dura = (diff_h>0?diff_h+"小时":"") + (diff_m>0?diff_m+"分":"1分")
                        // console.log('dura='+dura);
                        let data = {
                            groupName       : res.conferenceName,
                            schemeName      : res.schemeName,
                            password        : res.password,
                            meetingMode     : res.meetingMode,
                            isAutoRecord    : res.isAutoRecord,
                            chairMan        : res.chairMan,
                            description     : res.description,
                            beginTime       : res.beginTime,
                            conferenceDuration: dura,
                            users           : res.users,
                            devices         : res.devices,
                            isHistoryMeetingDetail: true
                        };
                        this.$refs.detailDialog.showDialog(data);
                    }
                });
            }
        },
    },
}
</script>

<style scoped>
.historyMeetingWrap{
    height: 730px;
    background-color: #ffffff;
	/* border: solid 1px #c8cdd5; */
    box-sizing: border-box;
}
.historyMeetingTop{
    height: 40px;
    background-color: #e9f3fa;
	border: solid 1px #c2dff3;
    padding: 0 20px;
}
.historyMeetingTop .el-form .el-form-item{
    margin-bottom: 0;
    margin-right: 0;
}
/deep/.historyMeetingTop .el-form-item__label{
    padding: 0 5px 0 0;
}
/deep/.historyMeetingTop .el-input__inner{
    height: 32px;
    margin-top: 4px;
    box-sizing: border-box;
    padding: 0 25px 0 5px;
}
/deep/.historyMeetingTop .el-input__icon.el-range__close-icon{
    display: none;
}
.historyMeetingTop .meetingNameItem{
    position: relative;
}
.historyMeetingTop .meetingNameItem .meetingNameInput{
    position: relative;
    width: 206px;
}
.historyMeetingTop .meetingNameItem i{
    position: absolute;
    top:13px;
    right:7px;
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url(../../../static/common/search.png) no-repeat;
}
.historyMeetingTop .meetingTimeItem{
    position: relative;
    margin-left: 50px;
}
.historyMeetingTop .meetingTimeItem .meetingTimeInput{
    position: relative;
    width: 315px;
    padding: 0 0 0 5px;
}
.historyMeetingTop .meetingTimeItem i{
    position: absolute;
    top:13px;
    right:7px;
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url(../../../static/common/search.png) no-repeat;
}
.historyMeetingTop .meetingBtnItem{
    margin-left: 76px;
}
.historyMeetingTop .meetingBtnItem .el-button{
    width: 60px;
	height: 32px;
    line-height: 32px;
    padding: 0;
    margin-top: 4px;
}
.historyMeetingMain{
    height: calc(100% - 40px);
	border-left: solid 1px #c8cdd5;
	border-right: solid 1px #c8cdd5;
	border-bottom: solid 1px #c8cdd5;
    box-sizing: border-box;
}
.historyMeetingMain .tableBox{
    height: calc(100% - 40px);
    padding: 10px;
    box-sizing: border-box;
}
.historyMeetingMain .tableBox .historyMeetingBtn{
    display: inline-block;
    width: 70px;
	height: 22px;
	background-color: #fff;
	border-radius: 6px;
    border: solid 1px #c2dff3;
    cursor: pointer;
}
.historyMeetingMain .tableBox .historyMeetingBtn:hover{
    background-color: #e9f3fa;
}
.historyMeetingMain .tableBox .historyMeetingBtn:active{
    background-color: #128bf1;
}
.historyMeetingMain .pageBox{
    height: 40px;
    text-align: center;
    border-top: solid 1px #c8cdd5;
}
.historyMeetingMain .pageBox .el-pagination{
    margin-top: 5px;
}
</style>