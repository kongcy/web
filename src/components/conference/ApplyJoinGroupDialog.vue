<template>
    <div>
        <el-dialog :visible.sync="visible" title="申请入会" width="1000px" class="custom-dialog">
            <div class="historyMeetingWrap">
                <div class="historyMeetingTop">
                    <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline" label-width="64px">
                        <el-form-item label="会议名称" prop="conferenceName" class="meetingNameItem">
                            <el-input v-model="searchForm.conferenceName" placeholder="请输入会议名称关键字" class="meetingNameInput"></el-input>
                        </el-form-item>
                        <el-form-item class="meetingBtnItem">
                            <el-button type="primary" @click="getSearchOnMeetign">检索</el-button>
                            <el-button @click="empty">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="historyMeetingMain">
                    <div class="tableBox">
                        <el-table :data="tableData" highlight-current-row border class="custom-table" height="580px" @row-click="rowClick">
                            <el-table-column prop="conferenceName" label="会议组名" align="center"></el-table-column>
                            <el-table-column prop="chairManName" label="会议主席" align="center" width="180"></el-table-column>
                            <el-table-column prop="isNeedPwd" label="需要密码" align="center" width="150">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isNeedPwd" class="icon-locked"></span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="meetingTime" label="开会时间" align="center" width="180"></el-table-column>
                            <el-table-column label="操作" align="center" width="80">
                                <template slot-scope="scope">
                                  <el-button size="mini" @click="queryOnMeeting(scope.$index, scope.row)">详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-row class="form-footer">
                        <el-col :span="8">
                            <el-checkbox v-model="isSpectator">以旁观者入会</el-checkbox>
                        </el-col>
                        <el-col :span="16">
                            <span style="float:left;">会议密码：</span>
                            <el-input v-model="password" placeholder="请输入会议密码" style="width: 200px;"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" @click="applyJoinMeetingByUser">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
            </div>
        </el-dialog>
        <detail-dialog ref="detail"></detail-dialog>
    </div>
</template>

<script>
import DetailDialog from '@/components/conference/DetailDialog.vue';
export default {
    name: "ApplyJoinGroupDialog",
    components: {
        DetailDialog,
    },
    data(){
        return{
            visible:false,
            conferenceId: '',
            searchForm:{
                conferenceName:'',
            },
            isSpectator: false,
            password: '',
            tableData:[],
            total:0,
            pageSize:15,
        }
    },
    methods:{
        showDialog(){
            this.getAllOnMeeting("");
            this.visible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('申请入会');
            });
        },
        // 行点击
        rowClick(row) {
            this.conferenceId = row.conferenceId;
        },
        // 调接口
        getAllOnMeeting(conferenceName){
            this.apiSDK.getAllOnMeeting(conferenceName, (res)=>{
                this.tableData = res;
            });
             // 测试数据
            this.tableData = [
                {
                    conferenceId:'001',
                    conferenceName:'测试会议001',
                    meetingTime:'2019-11-14 14:23:55',
                    chairManName:'张三',
                    isNeedPwd: true,
                },
                {
                    conferenceId:'002',
                    conferenceName:'测试会议001',
                    meetingTime:'2019-11-14 14:23:55',
                    chairManName:'张三',
                    isNeedPwd: false,
                },
            ];
        },
        // 根据条件查询正在开的会议
        getSearchOnMeetign(){
            let conferenceName = this.searchForm.conferenceName;
            this.getAllOnMeeting(conferenceName);
        },
        // 通过ID 查询正在进行会议的明细
        queryOnMeeting(index, row) {
            this.apiSDK.queryOnMeeting(row.conferenceId, res => {
                let data = {
                    groupName       : res.conferenceName,
                    schemeName      : res.schemeName,
                    password        : res.password,
                    meetingMode     : res.meetingMode,
                    isAutoRecord    : res.isAutoRecord,
                    chairMan        : res.chairMan,
                    description     : res.description,
                    beginTime       : res.conferenceTime,
                    users           : res.users,
                    devices         : res.devices,
                };
                this.$refs.detail.showDialog(data);
            });
        },
        // 用户申请入会
        applyJoinMeetingByUser() {
            if (!this.conferenceId) {
                this.$message({
                    type: "warning",
                    message: "请选择需要加入的会议"
                });
                return;
            }
            let ind = this.tableData.findIndex(item => item.conferenceId == this.conferenceId);
            if(ind != -1 && this.tableData[ind].isNeedPwd && !this.password){
                this.$message({
                    type: "warning",
                    message: "请输入密码"
                });
                return;
            }
            let userInfo = xtxk.cache.get("USER");
            let clientUser = {
                userId: userInfo.userId,
                userName: userInfo.userName,
                isSpectator: this.isSpectator,
                password: this.password
            };
            this.apiSDK.applyJoinMeetingByUser(this.conferenceId, clientUser);
            this.visible = false;
        },
        // 重置
        empty(){
            this.searchForm.conferenceName = '';
        },
    },
}
</script>

<style scoped>
.historyMeetingWrap{
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
/deep/.historyMeetingTop .el-date-editor .el-range-input{
    width:138px;
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
    margin-left: 55px;
}
.historyMeetingTop .meetingTimeItem .meetingTimeInput{
    position: relative;
    width: 310px;
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
.icon-locked{
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(../../../static/common/locked.png) no-repeat;
    vertical-align: middle;
}
.historyMeetingTop .meetingBtnItem{
    margin-left: 50px;
}
.historyMeetingTop .meetingBtnItem .el-button{
    width: 60px;
	height: 32px;
    line-height: 32px;
    padding: 0;
    margin-top: 4px;
}
.historyMeetingMain{
    padding: 10px;
    height: calc(100% - 60px);
	border-left: solid 1px #c8cdd5;
	border-right: solid 1px #c8cdd5;
	border-bottom: solid 1px #c8cdd5;
    box-sizing: border-box;
}
.historyMeetingMain .tableBox{
    height: calc(100% - 70px);
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
    height: 70px;
    text-align: center;
    border-top: solid 1px #c8cdd5;
}
.historyMeetingMain .pageBox .el-pagination{
    margin-top: 20px;
}
.form-footer{
    padding: 15px;
    height: 70px;
    background-color: #eeeeee;
    border-style: solid;
    border-width: 0 1px 1px;
    border-color: #d3dbe4;
    line-height: 40px;
}
</style>