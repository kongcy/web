<template>
  <div>
    <el-dialog :visible.sync="visible"  title="我的预约会议" width="730px" center class="custom-dialog">
        <el-table :data="tableData" border class="custom-table">
            <el-table-column label="会议ID" align="center" prop="sceneID" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="copy-input">
                        <el-input type="text" v-model="scope.row.sceneID" readonly :id="`arrangeSceneID${scope.$index}`"></el-input>
                        <el-button @click="copyID(scope.$index, scope.row)" class="btn btn-copy" title="复制ID"></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="会议名称" align="center" prop="sceneName" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column label="预约时间" align="center" prop="arrangeTime" width="180"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="150">
              <template slot-scope="scope">
                <el-button @click="addMembers(scope.$index, scope.row)" class="btn btn-add" title="邀请人员"></el-button>
                <el-button @click="start(scope.$index, scope.row)" class="btn btn-entry" title="入会"></el-button>
                <el-button @click="showScencInfo(scope.$index, scope.row)" class="btn btn-info" title="会议信息"></el-button>
                <el-button @click="cancel(scope.$index, scope.row)" class="btn btn-cancel" title="取消"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <center style="margin-top:10px;">
          <el-pagination
            background
            :page-size="pageSize"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
          </center>
    </el-dialog>
    <conference-info-dialog ref="conferenceInfo"></conference-info-dialog>
    <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceSelectData"/>
  </div>
</template>

<script>
import Enum from "@/common/enum";
import DetailDialog from '@/components/conference/DetailDialog.vue';
import ConferenceInfoDialog from '@/components/conference/ConferenceInfoDialog.vue';
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
export default {
  name: "ArrangeConferenceDialog",
  components: {
    DetailDialog,
    ConferenceInfoDialog,
    SelectResource
  },
  data() {
    return {
      visible: false,
      tableData: [],
      total:0,// 分页总数
      pageIndex:0,
      pageSize:10,
      currenRow: null,
      USER: xtxk.cache.get("USER"),
    };
  },
  methods: {
    showDialog() {
      this.$emit('closeOtherDialog');
      this.getTableData();
      this.visible = true;
      // this.$nextTick(() => {
      //     xtxk.media.setDialogTop('我的预约会议');
      // });
    },
    closeDialog() {
        this.visible = false;
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pageIndex = (val-1) * 10;
      this.getTableData();
    },
    // 请求列表数据 刷新
    getTableData() {
      this.tableData = [];
      this.apiSDK.getArrangeConferenceList(this.pageIndex, this.pageSize,res => {
        if (res.Ret === 0) {
          this.tableData = res.data;
          this.total = res.total;
        }
      });
      // this.tableData = [{sceneID: 'test'}];
    },
    copyID(index, row) {
        let $node = document.querySelector('#arrangeSceneID'+ index);
        $node.select();
        if(document.execCommand('copy', true)){
            this.$message({
                type: 'success',
                message: '已成功复制到剪贴板'
            });
        }
    },
    showScencInfo(index, row) {
        this.apiSDK.getArrangeConferenceDetail(row.sceneID, async(res) => {
            let data = {
                sceneID: row.sceneID,
                sceneName: row.sceneName,
                password: res.pwd,
                chairman: res.creatorName,
                desc: res.description
            };
            this.$refs.conferenceInfo.showDialog(data);
        })
    },
    addMembers(index, row) {
        this.currenRow = row;
        this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.meetingAddMember);
    },
    // 从选择资源组件传出
    resourceSelectData(resourceEvent){
        let members = []
        resourceEvent[0].forEach( (item, index) => {
            let resType = "User"
            if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                resType = "Device"
            members.push({
                index: index,userId: item.id, userName: item.name, resourceType: resType
            })
        });
        if (members.length) {
            this.imSendMessage(members);
        } else {
            this.$message({
                type: 'warning',
                message: '请选择成员'
            });
        }
        // return members;
    },
    // 即时通讯发送消息
    imSendMessage(members) {
        this.apiSDK.getArrangeConferenceDetail(this.currenRow.sceneID, async(res) => {
            if (res.Ret === 0) {
                let content = `<p>邀请您参加“${res.arrangeTime}”的部门例会，请准时进场！</p>
                        <p>会议ID：<span data-c-scene style="color: #0f5794;cursor:pointer">${res.sceneID}</span></p>
                        <p>会议时长：${res.arrangeLength}分钟</p>
                        <p>会议密码：${res.pwd ? res.pwd : '无'}</p>`;
                for (let item of members) {
                    if (item.userId !== this.USER.userId) {
                        let msg = await this.imSDK.sendMessageTo(content, '5', item.userId + '@' + startalkNav.baseaddess.domain);
                        // console.log('即时消息反馈'+ JSON.stringify(msg));
                    } 
                }
                this.$message({
                    type: 'success',
                    message: '消息发送成功'
                });
                this.closeDialog();
            } else {
                console.log('会议详情查询错误！！！')
            }
        })
    },
    start(index, row) {
        this.apiSDK.publishDiscussConference(row.sceneID, row.sceneName, '', '', '', '', '', '', 'immediately', row.arrangeTime, '', []);
        // this.getTableData();
        this.closeDialog();
    },
    cancel(index, row) {
        this.apiSDK.cancelArrangeConference(row.sceneID, (res) => {
            if (res.Ret === 0) {
                this.getTableData();
                this.$message({
                    message: '取消成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '取消失败',
                    type: 'warning'
                });
            }
        });
    }
  }
};
</script>

<style scoped>
.btn{
  width: 24px;
  height: 24px;
  border: 0;
  padding: 0;
  margin-left: 5px;
}
.btn-copy{
  background: url(../../../static/scene/ico_table_copy_id.png) no-repeat;
}
.btn-add{
  background: url(../../../static/scene/ico_table_invite.png) no-repeat;
}
.btn-entry{
  background: url(../../../static/scene/ico_table_join.png) no-repeat;
}
.btn-cancel{
  background: url(../../../static/scene/ico_table_cancel.png) no-repeat;
}
.btn-info{
  background: url(../../../static/scene/ico_table_information.png) no-repeat;
}
.copy-input{
    position: relative;
}
.copy-input:hover .btn-copy{
    display: block;
}
/deep/ .copy-input input{
    width:100%;
    border: 0;
    background-color: transparent;
    padding-right: 35px;
}
.copy-input .btn-copy{
    display: none;
    position: absolute;
    right: 0;
    top: 10px;
}
</style>