<template>
  <div>
    <el-popover
      popper-class="custom-popover"
      placement="right-start"
      v-model="visible"
      width="780"
      title="会议分组"
      @show="showDialog"
      trigger="manual">
      <el-button type="text" class="btn-close" icon="el-icon-close" @click="visible = false"></el-button>

        <el-table :data="tableData" border class="custom-table">
          <el-table-column label="分组名称" align="center" prop="groupName" width="180"></el-table-column>
          <el-table-column label="描述" align="center" prop="groupDescription" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="300" header-align="center">
            <template slot-scope="scope">
              <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6" @click="start('Audio', scope.row)">语音会议</el-button>
              <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6" @click="start('AV', scope.row)">视频会议</el-button>
	      
              <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && scope.row.isGroupOperator == true" @click="start('AV', scope.row)">启用</el-button>
              <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && scope.row.isGroupOperator == false" disabled>启用</el-button>
              <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>

      <span slot="reference" @click="visible = !visible" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6">会议分组</span>
      <el-button slot="reference" class="conference" title="视频会议"  @click="visible = !visible" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5"></el-button>
    </el-popover>
    <detail-dialog ref="detail"></detail-dialog>
  </div>
</template>

<script>
import Enum from "@/common/enum";
import DetailDialog from '@/components/conference/DetailDialog.vue';

export default {
  name: "ConferenceGroupDialog",
  components: {
    DetailDialog,
  },
  data() {
    return {
      visible: false,
      tableData: [],
      detailVisible: false,
      total:0,// 分页总数
      pageIndex:1,
      pageSize:10,
    };
  },
  methods: {
    showDialog() {
      this.$emit('closeOtherDialog');
      this.getTableData();
      // this.$emit('closeMenu');
      this.visible = true;
    },
    closeDialog() {
          this.visible = false;
        },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pageIndex = val
      this.getTableData();
    },
    // 请求列表数据 刷新
    getTableData() {
      let that = this;
      this.tableData = [];
      this.apiSDK.getAllGroupInfo(Enum.enumGroupType.GroupMeeting, this.pageIndex, this.pageSize, res => {
        this.busTableData = [];
        if(res){
          this.total =  res.totalCnt;
          //console.log(res);
          res.rows && res.rows.forEach(item => {
              that.tableData.push(item);
              //console.log(that.tableData)
          })
        }
      })
    },
    start(meetingModeRadio, row) {
        this.apiSDK.startPresetConference(row.groupId,row.groupName, meetingModeRadio);
        if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
            this.visible = false;
        }
      // this.$message({
      //   message: "会议开启中",
      //   type: 'success',
      //   duration: 3000,
      // });
    },
    // 详情
    detail(index, row) {
      //this.visible = false;
      // 获取会议组信息
      this.apiSDK.getMeetingGroupInfoByGroupId(row.groupId, res => {
        this.$refs.detail.showDialog(res);
      });
    },
  }
};
</script>

<style scoped>
  /deep/.el-table {
    margin: 0 10px;
    width: 760px;
    height: 450px;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  /deep/.el-table td {
    padding: 6px 0;
  }
  .conference{
     border: 0;
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin: 0;
  }
  .conference{
    background: url(../../../static/main/leftBar/conference.png) no-repeat;
  }
  .conference:hover, .conference:focus{
    background: url(../../../static/main/leftBar/conference_hover.png) no-repeat;
  }
</style>
