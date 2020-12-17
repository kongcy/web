<template>
  <div>
    <el-popover
      popper-class="custom-popover"
      placement="right-start"
      :visible-arrow="false"
      v-model="visible"
      width="780"
      title="当前会议"
      @show="showDialog"
      trigger="manual">
      <el-button type="text" class="btn-close" icon="el-icon-close" @click="visible = false"></el-button>

        <el-table :data="tableData" border class="custom-table" :height="430">
          <el-table-column label="会议名称" align="center" prop="conferenceName" width="200"></el-table-column>
          <el-table-column label="主席" align="center" prop="chairManName" width="180"></el-table-column>
          <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="100" header-align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="entrance(scope.$index, scope.row)">进入</el-button>
            </template>
          </el-table-column>
        </el-table>
	<!--
        <el-pagination
          background
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
	-->
      <span slot="reference" @click="visible = !visible">当前会议</span>
    </el-popover>
    <detail-dialog ref="detail"></detail-dialog>
  </div>
</template>

<script>
import Enum from "@/common/enum";
import DetailDialog from '@/components/conference/DetailDialog.vue';

export default {
  name: "PresentMeetingDialog",
  components: {
    DetailDialog,
  },
  data() {
    return {
      visible: false,
      tableData: [],
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
      this.tableData = [];
      let conferenceName = '';
      this.apiSDK.getAllOnMeeting(conferenceName,res => {
         this.tableData = res;
      });
    },
    // 进入
    entrance(index, row){
      // 如果需要密码
      if (row.isNeedPwd) {
        this.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.joinConference(row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      } else {
        // 不需要密码
        this.joinConference(row);
      }
    },
    // 进入会议接口
    joinConference(row) {
      this.apiSDK.joinConference(row.conferenceId);
      this.$message({
        message: "进入会议中",
        type: 'success',
        duration: 3000,
      });
      this.visible = false;
    }
  }
};
</script>

<style scoped>
  /deep/.el-table {
    margin: 0 10px;
    width: 760px;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  /deep/.el-table td {
    padding: 6px 0;
  }
  
</style>