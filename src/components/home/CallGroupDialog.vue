<template>
  <div>
    <el-popover
      popper-class="custom-popover"
      width="780"
      :offset="30"
      placement="right-start"
      ref="trainning"
      title="呼叫分组"
      trigger="manual"
      @show="showDialog"
      v-model="visible"
    >
      <el-button type="text" class="btn-close" icon="el-icon-close" @click="visible = false"></el-button>
      <el-table :data="busTableData" border class="custom-table">
        <el-table-column label="分组名称" prop="groupName" width="200"></el-table-column>
        <el-table-column label="描述" prop="groupDescription" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleStart(scope.row)">启用</el-button>
            <el-button size="mini" @click="getDetailsById(scope.row)">详情</el-button>
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
    </el-popover>
    <el-button v-popover:trainning class="btn" @click="visible = !visible" title="呼叫分组"></el-button>


    <el-dialog
      title="业务详情"
      :visible.sync="centerDialogVisible"
      class="custom-dialog"
      width="560px"
      :modal="false"
      center>
      <!-- 文字展示 -->
      <el-row class="ie-align">
        <el-col :span="12">
          <span class="label">业务名称：</span>
          <span class="value">{{groupName}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">显示方案：</span>
          <span class="value">{{showPlan}}</span>
        </el-col>
      </el-row>
      <div  class="ie-align" style="margin-top: 10px;margin-bottom: 20px;">简要描述： {{description}}</div>
      <el-row :gutter="20">
        <el-col>
          <el-card>
            <div class="card-title">
              组内资源
            </div>
            <div class="card-body">
              <div class="people-resource">
                <el-tree
                  :props="props"
                  :data="resourceDate"
                  :render-content="renderContent"
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                >
                </el-tree>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
         <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <group-call-dialog ref="groupCallDialog"/>
  </div>
</template>

<script>
  import GroupCallDialog from "@/components/home/StartGroupCallDialog.vue";
  import Fun from "@/common/fun";
  import Enum from "@/common/enum";

    export default {
        name: "CallBusinessDialog",
        components: {
          GroupCallDialog
        },
        data() {
          return {
            visible: false,
            busTableData: [],
            resourceDate:[],
            enumGroupType: Enum.enumGroupType,
            centerDialogVisible: false,
            props: {
              label: "name",
              children: "children",
              isLeaf: "leaf"
            },
            groupName:'',// 分组名称
            description:'',// 描述
            showPlan:'',// 显示方案
            total:0,// 分页总数
            pageIndex:1,
            pageSize:10
          };
        },
      methods: {
        showDialog() {
          this.$emit('closeOtherDialog')
          this.getBusTableData();
          this.visible = true;
        },
        closeDialog() {
          this.visible = false;
        },
        handleCurrentChange(val) {
          //console.log(`当前页: ${val}`);
          this.pageIndex = val
          this.getBusTableData();

        },
        getBusTableData() {
          // 请求列表数据 刷新
          let pageIndex = this.pageIndex;
          let pageSize = this.pageSize;
          this.apiSDK.getAllGroupInfo(Enum.enumGroupType.GroupCall, pageIndex, pageSize, res => {
            this.busTableData = [];
            if(res){
              this.total =  res.totalCnt;
              //this.busTableData = res.rows;
              res.rows && res.rows.forEach(item => {
                  this.busTableData.push(item)
              })
            }
          });
        },

        // 树行样式(用户)
        renderContent(h, { node, data, store }) {
          return (
            <span class={"custom-tree-node " + data.nodeStatus}>
            <span class="node-icon"></span>
            <span>{node.label}</span>
          </span>
        );
        },
        getDetailsById(row){
          this.centerDialogVisible = true;
          // 调用 分组呼叫，根据组id获取呼叫资源 getResourcesByGroupId
          this.apiSDK.getResourcesByGroupId(row.groupId, res => {
             let peopleData = res.resources.map(item => {
                let nodeStatus = 'person_online';
                if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                  nodeStatus = "hwMeeting_online"
                return { id: item.resID, name: item.resName, nodeStatus: nodeStatus}
             })
             this.resourceDate = peopleData;
             this.groupName = res.groupName;
             this.description = res.description;
              this.showPlan = res.schemeName;
          })
        },
        //启用
        handleStart(row) {
          let id = row.groupId;
          this.$refs.groupCallDialog.showDialog(id);
          this.closeDialog();
        },
      }
    }
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
  /deep/.el-table .el-table__header th {
    padding: 0;
    height: 36px;
    background: #e9f3fa;
  }
  /deep/.el-table td {
    padding: 6px 0;
  }
  /******** 详情页面样式 **********/
  .tree_title {
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    line-height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    color: #0f5794;
    border: 1px solid #c2dff3;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .card-title {
    position: relative;
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    background: #e9f3fa;
  }
  .card-body{
    border-top: 1px solid #c2dff3;
    overflow: auto;
  }

  .btn {
    border: 0;
    height: 40px;
    width: 40px;
    background: url(../../../static/main/leftBar/callbusiness.png) no-repeat;
  }
  .btn:hover {
    background: url(../../../static/main/leftBar/callbusiness_hove.png) no-repeat;
  }
  /* 0629 dj */
  .ie-align{
    text-align: left;
  }
</style>
