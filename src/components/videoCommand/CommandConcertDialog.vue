<template>
  <div>
    <el-dialog
      :visible.sync="isVisible"
      title="协调指挥"
      width="1300px"
      customClass="commandConcertPopUp">
      <!-- 左侧的列表 -->
      <div class="commandConcertTree">
        <div class="left-top">
          <span class="left-title">指挥组成员</span>
        </div>
        <el-alert style='border-top: solid 1px #c8cdd5;'
          title="请选择两人进行协调指挥"
          type="warning"
          :closable="false">
        </el-alert>
        <div class="left-middle">
          <el-tree
            :data="treeData"
            ref="personTree"
            :props="defaultProps"
            show-checkbox
            node-key="nodeId"
            check-strictly
            :default-expanded-keys="expandedNodes"
            :render-content="renderContent"
            @node-click="handleNodeClick"
            >
          ></el-tree>
        </div>
        <div class="left-bottom">
          <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="onStartConcert()">发起协调</el-button>
          </span>
        </div>
      </div>
      <!-- 右侧的表单 -->
      <div class="commandConcertTable">
        <div class="right-top">
          <el-table
            :data="tableData"
            ref="concertTable"
            stripe
            border
            highlight-current-row
            tooltip-effect="dark"
            :default-sort="{prop: 'date', order: 'descending'}"
            height="100%"
          >
            <el-table-column label="发起协调人员" prop="operateName" align="center"></el-table-column>
            <el-table-column label="参与协调人员" prop="receiverName1" align="center"></el-table-column>
            <el-table-column label="参与协调人员" prop="receiverName2" align="center"></el-table-column>
            <el-table-column fixed="right" width="138px" label="操作" align="center">
              <template slot-scope="scope">
                <i class="operateCancel" title="取消协调" @click="onCancelConert(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="right-bottom">
          <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="onAllCancelConert()">全部取消</el-button>
            <el-button class="btn-close" @click="isVisible = false">关 闭</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:['parentMsg'],
  name: "CommandConcertDialog",
  components: {},
  data() {
    return {
      isVisible: false,
      tableData: [],
      treeData: [],
      expandedNodes: [],//默认张开的id集合
      commandId: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      USER: xtxk.cache.get('USER')
    };
  },
  mounted() {
    if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
      this.initTable(); //加载表格数据
    }
  },
  watch: {
    parentMsg: function(val) {
      this.initTree();
    }
  },
  methods: {
    // 初始化树 Testing
    initTree() {
      this.$nextTick(() => {
        //  this.treeData = this.parentMsg;
        　//　默认展开一级节点
        // console.log( this.treeData)
        if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
          this.parentMsg[0].children.forEach(each=>{
             if(each.children) delete each.children; 
             this.treeData.push(each);
          })
          this.expandedNodes = this.treeData.map(item =>  item.nodeId );
          // let expandedNodes = this.setExpandedNodes(this.treeData);
          // this.expandedNodes.push(expandedNodes);
        } else {
          let data = this.findToTree(this.parentMsg, this.USER.userId);
          this.treeData = data.children || [];
        }
      });
    },
    findToTree(data, id) {
      let res = null;
      if (!data) {
        return;
      }
      for (let item of data) {
        if (res !== null) {
          break;
        }
        if (item.id === id) {
          res = item;
          break;
        } else if (item.children.length > 0) {
          // console.log(item.children)
          res = this.findToTree(item.children, id);
        }
      }
      return res;
    },
    // 默认展开所有
    // setExpandedNodes(items) {
    //   items.forEach(item => {
    //     this.expandedNodes.push(item.nodeId);
    //     if( item.children && item.children.length ) {
    //       this.setExpandedNodes(item.children);
    //     }
    //   });
    // },
    // 5.x里面 的一些操作
    setList(listInit) {
      console.log('listInit', JSON.stringify(listInit) );
      let userId = xtxk.cache.get("USER").userId;
      // let userId;
      let commutate = listInit.upSilent.commutate;
      // 若userId，RequestId，destId中任意一个为自己则在列表中增加记录
      switch (listInit.commandStatus) {
        case 'StartCommutate':
          // 新增
          if( commutate.userId == userId ||  commutate.requestId == userId ||  commutate.destId == userId) {
           this.tableData.push(
             {
              'operateId': commutate.userId,
              'operateName': commutate.userName ,
              'receiverId1': commutate.requestId,
              'receiverName1': commutate.requestName,
              'receiverId2': commutate.destId,
              'receiverName2': commutate.destName
             }
           );
          };
          break;
         case 'StopCommutate':
            // 删除
            let tableData = [];
            this.tableData.forEach(item => {
              //  return !(commutate.userId == userId ||  commutate.requestId == userId ||  commutate.destId == userId) && item;
               if( !(commutate.userId == userId ||  commutate.requestId == userId ||  commutate.destId == userId) ) {
                  tableData.push(item);
               }
            });
            this.tableData = tableData;
           break;
          // case 'StartAuthorize':

          //   break;
          // case 'StopAuthorize':
          //   break;
      }
    },
    /**封装树形组件需要的结构数据 */
    getTreeData: function(list, parentId) {
      if (parentId == undefined) {
        parentId = "";
      }
      var zNodes = [];
      for (var i = 0, l = list.length; i < l; i++) {
        var item = list[i];
        if (item.parentId === parentId) {
          var obj = {
            resourceId: item.resourceId,
            resourceName: item.resourceName
          };
          obj.children = this.getTreeData(list, item.resourceId);
          zNodes.push(obj);
        }
      }
      return zNodes;
    },
    /** 发起协调按钮点击事件 */
    onStartConcert() {
      var flag = 0;
      //获取树形被勾选数据
      let checkUsers = this.$refs.personTree.getCheckedNodes();
      if (!checkUsers || checkUsers.length !== 2) {
        //判断是否是选择的两个指挥人员
        this.$message({
          type: "warning",
          message: "请选择两个指挥人员开启协调业务!!!"
        });
        return;
      }
      if (checkUsers.length > 0) {
        if(checkUsers[0].nodeStatus == "person_offline"){
          this.$message({
            type: "warning",
            message: checkUsers[0].name +"不在线！"
          });
          return
        }
        if(checkUsers[1].nodeStatus == "person_offline"){
          this.$message({
            type: "warning",
            message: checkUsers[1].name +"不在线！"
          });
          return
        }
        checkUsers.forEach((item) => {
          if(item.id == xtxk.cache.get("USER").userId){
            this.$message({
              type: "warning",
              message: "不能勾选自己!!!"
            });
            flag = 1
            return;
          }
        });
      }
      if(flag != 1){
        //调用SDK开启协调接口
        this.apiSDK.startCoordinateCommand(this.commandId,checkUsers[0].id,checkUsers[1].id);
      }
    },
    /** 初始化表格 */
    initTable() {
      this.tableData = [];
      //调用SDK获取协调资源接口
      this.apiSDK.getCoordinateCommandResources(this.commandId, obj => {
        console.log('调用SDK获取协调资源接口', JSON.stringify(obj));
        if (obj) {
          this.tableData = obj;
        }
      });
    },
    /** 显示弹窗 */
    showDialog(commandId) {
      this.commandId = commandId
      this.isVisible = true;
      this.$nextTick(() => {
          xtxk.media.setDialogTop('协调指挥');
      });
      this.initTree(); //加载树数据
      if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
        this.initTable(); //加载表格数据
      } else {
        this.apiSDK.publishCoordinateList(this.commandId);
      }
    },
    /** 取消全部协调 */
    onAllCancelConert() {
      this.$confirm("确认取消全部协调吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          // 循环调用取消单个协同接口
          if(this.tableData.length == 0){
            //this.$message({message: '没有正在协调的队列', type: 'warning'});
            return;
          }
          let users=[];
          this.tableData.forEach((item)=>{
            users.push(item.receiverId1+'_'+item.receiverId2)
          });
          this.apiSDK.cancelAllCoordinateCommand(this.commandId,users);
        })
        .catch(() => {
          // this.$message({
          //   type: "warning",
          //   message: "已取消"
          // });
        });
    },
    //树行样式
    renderContent(h, { node, data, store }) {
      return (<span class={"custom-tree-node " + data.nodeStatus} >
        <span class="node-icon"></span>
        <span>{node.label}</span>
      </span>);
    },
    /** 取消单个协调 */
    onCancelConert(data) {
      this.$confirm("确认取消吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          console.log('取消单个协调', JSON.stringify(data) );
          if (data) {
            var receiverId1 = data.receiverId1;
            var receiverId2 = data.receiverId2;
            var operateId = data.operateId;
            this.apiSDK.cancelCoordinateCommand(this.commandId,operateId,receiverId1,receiverId2);
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除"
          });
        });
    },
    handleNodeClick(data, node, tree){
      if( data.nodeStatus != 'department' ) {
          node.checked = !node.checked;
      }
    }
  }
};
</script>

<style>
.commandConcertPopUp .el-dialog__header {
  padding: 0 20px 0;
}
.commandConcertPopUp .el-dialog__body {
  padding: 15px 16px;
}
.commandConcertPopUp .el-dialog__footer {
  padding: 25px 20px 10px;
}
.commandConcertPopUp div.el-dialog__header {
  height: 43px;
  background: rgb(15, 87, 148);
}
.commandConcertPopUp div.el-dialog__header > span {
  color: #ffffff;
  float: left;
  font-weight: 600;
  font-size: 18px;
  margin-top: 12px;
}
.commandConcertPopUp .el-dialog__headerbtn {
  top: 10px;
  font-size: 22px;
}
.commandConcertPopUp .commandConcertTable thead.is-group th {
  background: #fff;
}
.commandConcertPopUp .commandConcertTable .el-table th {
  background: #e9f3fa;
  font-weight: 100;
}
.commandConcertPopUp .commandConcertTable .el-table td,
.commandConcertPopUp .commandConcertTable .el-table th {
  padding: 0;
  color: #333;
  height: 40px;
  line-height: 40px;
}
</style>

<style scoped>
/** 左侧树列表样式 */
.commandConcertPopUp .commandConcertTree {
  width: 299px;
  height: 680px;
  border: solid 1px #c8cdd5;
}
/**左侧上部div样式 */
.left-top {
  height: 40px;
}
/**左侧中部div样式 */
.left-middle {
  height: calc(100% - 154px);
  border-top: solid 1px #c8cdd5;
}
/**底部div 样式 */
.left-bottom,
.right-bottom {
  border-top: solid 1px #c8cdd5;
  height: 80px;
}
/**左侧上部div中span样式 */
.commandConcertPopUp .commandConcertTree .left-title {
  display: block;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  background-color: #e9f3fa;
}
/**右侧div样式 */
.commandConcertTable {
  width: 950px;
  height: 680px;
  border: solid 1px #c8cdd5;
  position: absolute;
  left: 330px;
  top: 58px;
}
/**右侧上部div样式 */
.right-top {
  height: calc(100% - 80px);
}
.commandConcertPopUp .el-dialog__close {
  color: #ffffff;
}
.commandConcertPopUp .dialog-footer .el-button--primary {
  width: 100px;
  height: 40px;
  background-color: #128bf1;
  border-radius: 6px;
}
/**按钮所在span样式 */
.dialog-footer {
  width: 100%;
  line-height: 80px;
  padding-right: 20px;
  box-sizing: border-box;
}
/** 表格操作按钮样式 */
.operateCancel {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-image: url("../../../static/common/delete_03_01.png");
}

.operateCancel:hover {
  background-image: url("../../../static/common/delete_03_02.png");
}
/**关闭按钮样式 */
.btn-close {
  width: 100px;
  height: 40px;
}
</style>
