<template>
  <div class="holder">
    <el-dialog :visible.sync="isVisible" title="指挥分派" width="1299px" 
    customClass="CommandDistributePopUp" class="custom-dialog" left @closed="closedDialog">
        <!-- 左边的tree -->
        <el-row>
            <div class="command-distribute-left">
                <div class="data-tree" >
                    <div class="el-card__header">指挥组成员</div>
                    <el-tree
                        :data="treeData"
                        show-checkbox
                        node-key="resourceId"
                        :props="defaultProps"
                        :render-content="renderContent"
                         @node-click="handleNodeClick"
                         @check-change="handleCheckChange">
                    </el-tree>
                </div>
                <!-- 选择指挥员 -->
                <div class="select-tree-data-command">
                    <div class="el-card__header">指挥员:
                        <el-button v-if="!commandBtn" type="text" class="add-btn addUser" style="float: right;" @click="commandOperate"></el-button>
                        <el-button v-if="commandBtn" type="text" class="remove-btn" style="float: right;" @click="commandOperate"></el-button>
                    </div>
                    <div class="command">
                        <!-- <tr v-for="item in "></tr> -->
                        <p v-for="(item,index) in selectCommand" :key="index" class="command-user member-user">
                            <img src="../../../static/resource_tree/person_online.png">
                            <span>{{ item.resourceName }}</span>
                        </p>
                    </div>
                </div>
                <!-- 选择成员 -->
                <div class="select-tree-data-member">
                    <div class="el-card__header">被指派人员:
                        <el-button type="text" class="remove-btn" style="float: right;" @click="memberDel"></el-button>
                        <el-button type="text" class="add-btn addUser" style="float: right;" @click="memberAdd"></el-button>
                    </div>
                    <div class="member">
                        <p v-for="(item,index) in selectMember" :key="index" class="member-user" :class="item.class" @click="clickMemberNode(index)">
                            <img src="../../../static/resource_tree/person_online.png">
                            <span>{{ item.resourceName }}</span>
                            <img v-if="item.class === 'active'" src="../../../static/prepointsManage/delPrepare.png" @click="delMember(index)">
                        </p>
                    </div>
                </div>
                
                <el-button type="primary" class="execute-distribute-btn" @click="clickExecute">执行分派</el-button>
            </div>
            <!-- 右边的列表 -->
            <div class="command-distribute-right">
                  <el-table
                    :data="tableData"
                    ref="table"
                    stripe
                    border
                    highlight-current-row
                    tooltip-effect="dark"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    >
                    <el-table-column
                        prop="resName"
                        label="指挥员"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="dispatcherName"
                        label="被指派人员"
                        width="413">
                    </el-table-column>
                    <el-table-column fixed="right" width="83px">
                    <template slot="header" slot-scope="scope">操 作</template>
                        <template slot-scope="scope">
                            <!-- <img
                                class="operate"
                                src="../../../static/prepointsManage/delectRowList.png"
                                title="停止"
                                @click="removeClick(scope.row)"
                            /> -->
                            <div class="operate" title="停止" @click="removeClick(scope.row)"></div>
                        </template>
                    </el-table-column>

                </el-table>
                <el-row class="buttons">
                    <el-button type="primary"  @click="clickCancelDispatchCommand" >取消分派</el-button>
                    <el-button type="primary"  @click="clickCancelAllDispatch" >全部取消</el-button>
                    <el-button @click="closedDialog" >关闭</el-button>
                </el-row>
            </div>
        </el-row>

    </el-dialog>
  </div>
</template>

<script>

export default {
    data() {
      return {
        isVisible: false,
        commandBtn: false,
        // 左侧的tree的数据 假数据
        treeData: [{
          resourceId: 1,
          resourceName: '一级 1',
          children: [{
            resourceId: 4,
            resourceName: '二级 1-1',
            children: [{
              resourceId: 9,
              resourceName: '三级 1-1-1'
            }, {
              resourceId: 10,
              resourceName: '三级 1-1-2'
            }]
          }]
        }, {
          resourceId: 2,
          resourceName: '一级 2',
          children: [{
            resourceId: 5,
            resourceName: '二级 2-1'
          }, {
            resourceId: 6,
            resourceName: '二级 2-2'
          }]
        }, { 
          resourceId: 3,
          resourceName: '一级 3',
          children: [{
            resourceId: 7,
            resourceName: '二级 3-1'
          }, {
            resourceId: 8,
            resourceName: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'resourceName'
        },

        // 已经选择的被指派人员
        selectMember: [],
        // 已经选择的指挥员 最多只能一个
        selectCommand: [],

        // 右侧列表的数据 (假数据)
        tableData: [{
          resId: '01',
          resName: '指挥员01',
          dispatcherId: '101',
          dispatcherName: '张三',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          resId: '02',
          resName: '指挥员02',
          dispatcherId: '102',
          dispatcherName: '李四',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          resId: '03',
          resName: '指挥员03',
          dispatcherId: '103',
          dispatcherName: '王五',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          resId: '04',
          resName: '指挥员04',
          dispatcherId: '104',
          dispatcherName: '赵六',
          address: '上海市普陀区金沙江路 1516 弄'
        }],

        selectTreeData: []
      }
    },
    methods: {
        showDialog() {
            this.isVisible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('指挥分派');
            });
            this.getList();
        },
        // 关闭弹框
        closedDialog() {
            this.isVisible = false;
            this.selectMember = [];
            this.selectCommand = [];
            this.getTreeData();
        },
        // 获取左侧的tree信息
        getTreeData() {
            var commandId = '';
            this.apiSDK.getCommandResources(commandId, function (obj) {
                // this.tableData = obj;
                this.treeData = this.composeTree(obj, '0');
            })
        },
        // 数组转树格式
        composeTree(list, pid = '0') {
            let tree = [];
            let temp;
            list.length && list.forEach((item, index) => {
                if ( pid !== '0' && item.parentId ===  pid) {
                    temp = this.composeTree(list, item.resourceId);
                    if (temp.length > 0) {
                        item.children = temp;
                    }
                    tree.push(item);
                }
            });
            return tree;
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + 'person_online'} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        // 点击左侧的tree 触发
        handleNodeClick(data) {
            //console.log(data);
            this.selectTreeData = [{
                'resourceId': data.resourceId,
                'resourceName': data.resourceName
            }];
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        commandOperate() {
            if(this.commandBtn) {
                // 删除
               this.selectCommand = [];
               this.commandBtn = !this.commandBtn;           
            } else {
                if( this.selectTreeData.length === 1 ) {
                    // 添加
                    this.selectCommand = this.selectTreeData;
                    this.selectTreeData = [];
                    this.commandBtn = !this.commandBtn;
                }
            }
        },
        // 左侧的tree勾选数据变化时 触发
        handleCheckChange(data, checked, indeterminate){
            if( checked ) {
               var selectMemberId = this.selectMember.map(item => item.resourceId);
               if( selectMemberId.indexOf(data.resourceId) === -1 ) {
                   this.selectTreeData.push({
                       'resourceId': data.resourceId,
                       'resourceName': data.resourceName
                   });
               }
            } else {
                this.selectMember.filter(item => item.resourceId !== data.resourceId)
            }
        },
        // 被指派人员 添加
        memberAdd() {
            this.selectMember = this.selectTreeData;
            this.selectTreeData = [];
        },
        // 被指派人员 删除
        memberDel() {
            this.selectMember = [];
        },
        // 点击分派人员
        clickExecute() {
           if( !this.selectCommand.length ) {
                this.$message({
                    message: '指挥员不能为空',
                    type: 'warning'
                });
           } else if( !this.selectMember.length ) {
                this.$message({
                    message: '被指派人员不能为空',
                    type: 'warning'
                });
           } else {
                /**
                 *  执行分派 
                 *  this.selectCommand 为指挥员
                 *  this.selectMember 被指派人员
                 *  执行分派成功后 刷新右侧列表
                 *  
                 *  */ 
                this.apiSDK.startDispatchCommand(this.getCommandId(), this.getDispatchers(), function (obj) {
                    this.getList();
                });
           }
        },
        // 点击被指派的人员 tree
        clickMemberNode(index) {
             this.selectMember[index].class = 'active';
             this.selectMember = this.selectMember.slice();
        },
        // 删除单个被指派人员
        delMember(index){
            // delete this.selectMember[index].class;
            this.selectMember.splice(index, 1);
            // this.selectMember = this.selectMember.slice();
        },

        // 右侧指挥分派列表
        getList() {
            this.apiSDK.getDispatchCommandResources(this.getCommandId(), function (obj) {
                this.tableData = obj;
            })
        },
        // 取消分派
        clickCancelDispatchCommand() {
            this.apiSDK.cancelDispatchCommand(this.getCommandId(), this.getDispatchers(), function (obj) {
                // this.tableData = obj;
                this.$message({
                    message: '取消分派成功',
                    type: 'success'
                });
            })
        },
        // 全部取消 取消所有指挥分派
        clickCancelAllDispatch() {
            this.apiSDK.cancelAllDispatch(this.getCommandId(), function (obj) {
                // this.tableData = obj;
                this.$message({
                    message: '取消所有指挥分派成功',
                    type: 'success'
                });
            })
        },
        // 停止 row 为当前点击的这条数据
        removeClick(row) {
          
        },
        // 获取指挥id
        getCommandId() {
           return this.selectCommand[0].resourceId;
        },
        // 获取 被分派的人的id
        getDispatchers() {
            return this.selectMember.map(item => {
                return { 'dispatcherId': item.resourceId };
            });
        },
    }
}
</script>

<style scoped>
.CommandDistributePopUp .el-dialog__body {
    height: 760px;
}
/* 左侧的tree 和相关操作 */
.command-distribute-left {
   width: 639px;
   height: 730px;
   border: 1px solid #c8cdd5;
   position: relative;
   float: left;
}
.command-distribute-left > .data-tree {
    width: 299px;
    height: 649px;
    border-right: 2px solid #c9cdd5;
    border-bottom: 1px solid #c9cdd5;
    float: left;
}
.custom-dialog .el-card__header {
    border-bottom: 2px solid #c9cdd5;
}
.select-tree-data-command {
    width: 330px;
    height: 81px;
    border-bottom: 1px solid #c9cdd5;
    border-left: 1px solid #c9cdd5;
    float: right;
}
.select-tree-data-member {
    width: 330px;
    height: 549px;
    border-bottom: 1px solid #c9cdd5;
    border-left: 1px solid #c9cdd5;
    border-top: 1px solid #c9cdd5;
    float: right;
    margin-top: 18px;
}
.addUser {
    margin-top: 2px;
}
.execute-distribute-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
}

/* 右侧的列表 */
.command-distribute-right {
    width: 599px;
    height: 730px;
    border: 1px solid #c8cdd5;
    border-left: 2px solid #c8cdd5;
    float: right;
}
.command-distribute-right > div.el-table {
    height: 650px;
    border-bottom: 1px solid #c8cdd5;
}
.command-distribute-right > div.buttons {
    margin-top: 20px;
    margin-right: 20px;
    float: right;
}
.command .command-user {
    cursor: context-menu;
}
.member > p.active {
    background: #b1e0ff;
}
.member > .member-user {
    height: 40px;
    line-height: 40px;
    margin: 0;
}
.member-user {
    cursor: pointer;
    position: relative;
}
.member > .member-user  > img:nth-child(1) {
    top: 10px;
}
.member > .member-user  > img:nth-child(3) {
    position: absolute;
    top: 10px;
    right: 10px;
}
.member-user > img:nth-child(1) {
    position: absolute;
    left: 10px;
    top: -2px;
}
.member-user > span {
    margin-left: 40px;
}
/* .operate {
  margin: 0 10px;
  cursor: pointer;
} */
.operate {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    background: url('../../../static/prepointsManage/delectRowList.png');
    cursor: pointer;
}
.operate:hover {
    background: url('../../../static/prepointsManage/delectRowList_active.png');
}
</style>

<style>
.command-distribute-right  .el-table th.is-leaf {
    background: #e9f3fa;
    font-weight: 100;
    color: #606266;
}
.CommandDistributePopUp tr > th,
.CommandDistributePopUp tr > td {
    text-align: center;
}
</style>