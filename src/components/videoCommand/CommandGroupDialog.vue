<template>
  <div>
    <el-popover
      popper-class="custom-popover"
      width="780"
      :offset="30"
      placement="right-start"
      ref="trainning"
      title="指挥分组"
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
            <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6" @click="handleStart(scope.row)">启用</el-button>
            <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && scope.row.isGroupOperator == true" @click="handleStart(scope.row)">启用</el-button>
            <el-button size="mini" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && scope.row.isGroupOperator == false" disabled>启用</el-button>
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
    <el-button v-popover:trainning class="btn" @click="visible = !visible" title="视频指挥"></el-button>

    
    <el-dialog
      title="指挥详情"
      :visible.sync="centerDialogVisible"
      class="custom-dialog"
      width="560px"
      height="522px"
      :modal="false"
      center>
      <!-- 文字展示 -->
      <div><span>业务名称：</span> {{groupName}} <span style="margin-left: 116px;">显示方案：</span>{{showPlan}}</div>
      <div style="margin-top: 10px;margin-bottom: 20px;">简要描述： {{description}}</div>
      <!-- 参会人员 参会设备-->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div class="card-title">
              分组人员
            </div>
            <div class="card-body">
              <div class="people-resource">
                <el-tree
                  :props="props"
                  :data="loopData"
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
        <el-col :span="12">
          <el-card>
            <div class="card-title">
              分组设备
            </div>
            <div class="card-body">
              <div class="people-resource">
                <el-tree
                  :props="props"
                  :data="fixData"
                  :render-content="renderContent"
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                >
                </el-tree>
              </div>
              <!--<div v-for="(obj, index) in fixData" :key="obj.key" class="fix-resource">
                <span :class="`custom-tree-node ${obj.nodeStatus}`">
                  <span class="node-icon"></span>
                  <span>{{obj.name}}</span>
                </span>
              </div>-->
            </div>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
         <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "CommandGroupDialog",
        data() {
        return {
          visible: false,
          busTableData: [],
          centerDialogVisible: false,
          props: {
            label: "name",
            children: "children",
            isLeaf: "leaf"
          },
          loopData:[],
          fixData:[],
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
          this.$emit('closeOtherDialog');
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
          let pageIndex = this.pageIndex;
          let pageSize = this.pageSize;
          // resp =  {total:0, list:[{groupId:"", groupName: "",description: ""}]}
          this.apiSDK.queryCommandGroup(pageIndex, pageSize, res => {
            this.busTableData = [];
            if(res){
              this.total =  res.total;
              res.rows && res.rows.forEach(item => {
                  this.busTableData.push(item);
              })
            }
          });
        },
        //启用
        handleStart(row){
            this.apiSDK.startGroupCommand(row.groupName, row.groupId);
            if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
                this.visible = false;
            }
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
          // 调用 通过组 id 获取指挥分组的详细信息	getCommandGroupById
          this.apiSDK.getCommandGroupById(row.groupId,res => {
            let loopRersources = res.users.map(item => {
              let nodeStatus = item.resourceType === 0 ? 'person_online' : 'device_online';
              return {
                id: item.resourceId,
                name: item.resourceName,
                resCh: item.resourceCh,
                resourceType: item.resourceType,
                parentId : item.parentId,
                parentName : item.parentName,
                nodeStatus: nodeStatus
              };
            });

            let fixResources = res.resource.map(item => {
              let nodeStatus = item.resourceType === 0 ? 'person_online' : 'device_online';
              return {
                id: item.resourceId,
                name: item.resourceName,
                resCh: item.resourceCh,
                resourceType: item.resourceType,
                nodeStatus: nodeStatus
              };
            });
            this.loopData = this.composeTree(loopRersources);
            this.fixData = fixResources;
            this.groupName = res.groupName;
            this.description = res.description;
            this.showPlan = res.schemeName;

          });
        },
          // 数组转树格式
          composeTree: function(list, parentId){
            if(parentId == undefined) parentId = "";
            var zNodes = [];
            for(var i = 0, l = list.length; i < l; i++){
              var item = list[i];
              if(item.parentId == parentId){
                var obj = {
                  nodeId : item.id,
                  id : item.id,
                  name : item.name,
                  leaf : false,
                  nodeStatus : 'person_online',
                };
                obj.children = this.composeTree(list, item.id);
                zNodes.push(obj);
              }
            }
            return zNodes;
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
  /deep/.el-table td {
    padding: 6px 0;
  }
  .btn {
    border: 0;
    height: 40px;
    width: 40px;
    background: url(../../../static/main/leftBar/videoCommand.png) no-repeat;
  }
  .btn:hover {
    background: url(../../../static/main/leftBar/videoCommand_hover.png) no-repeat;
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
  
  .fix-resource{
    margin: 10px;
    border: 1px solid #ddd;
    background-color: #fcfcfc;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
  }

  .fix-resource .index{
    display: inline-block;
    width: 30px;
    border-right: 1px solid #ddd;
    text-align: center;
    background-color: #f7fAFD;
  }

  /* 0629 360兼容样式 dj  */
  .el-dialog__body div{
    text-align: left;
  }
</style>
