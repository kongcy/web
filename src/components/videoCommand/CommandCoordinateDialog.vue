<template>
    <el-dialog
        :visible.sync="visible"
        title="协同指挥"
        width="1300px"
        class="custom-dialog">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="custom-card">
                    <div class="title">指挥组成员</div>
                    <el-tree
                        ref="personTree"
                        style="height: 600px;"
                        :data="personData"
                        show-checkbox
                        check-strictly
                        node-key="resourceId"
                        :props="defaultProps"
                        :render-content="renderContent"
                        :default-expanded-keys="expandedNodes"
                        @node-click="handleNodeClick">
                    </el-tree>
                    <!-- <person-tree ref="personTree" :subscribeType="subscribeType" style="height: 600px;"/> -->
                    <div class="footer-btn">
                        <el-button type="primary" @click="startCoordinateCommand">发起协同</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="custom-card">
                    <el-table
                        :data="tableData"
                        ref="table"
                        highlight-current-row
                        tooltip-effect="dark"
                        :default-sort="{prop: 'date', order: 'descending'}"
                        height="640px"
                    >
                        <el-table-column label="接受协同指挥员" prop="receiverName1" min-width="150px"></el-table-column>
                        <el-table-column label="请求协同指挥员" prop="receiverName2" min-width="180"></el-table-column>
                        <el-table-column label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-circle-close" title="删除" @click="cancelCooperateCommand(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer-btn">
                        <!-- <el-button type="primary" @click="cancelCooperateCommand">取消协同</el-button> -->
                        <el-button type="primary" @click="cancelAllCooperate()">全部取消</el-button>
                        <el-button @click="visible = false">关闭</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import Enum from "@/common/enum";
export default {
    props:['parentMsg'],
    name: "CollaborativeCommandDialog",
    components: {
        PersonTree,
    },
    data() {
        return {
            visible: false,

            subscribeType: '',
            commandId: '',

         /*   personData: [],*/
            personData: [],
            tableData: [],

            defaultProps:{
                label: 'name',
                children: 'children',
                // isLeaf: 'leaf'
            },
            expandedNodes: [],//默认张开的id集合
        }
    },
    create(){

    },
    mounted() {

    },
    methods:{
        showDialog(commandId) {
            this.commandId = commandId;
            this.visible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('协同指挥');
                this.getCommandResources();
                this.getCoordinateCommandResources();
            });
        },
        // 5 版本 设置
        setList(listInit) {
            let userId = xtxk.cache.get("USER").userId;
            let commutate = listInit.upSilent.cooperate;
            // 若RequestId，destId中任意一个为自己则在列表中增加记录
            console.log('setList----111', JSON.stringify(listInit) );
            switch (listInit.upSilent.commandStatus) {
                case 'StartCooperate': 
                // 新增
                if( commutate.requestId == userId ||  commutate.destId == userId) {
                this.tableData.push(
                    { 
                        'receiverId1': commutate.destId,
                        'receiverName1': commutate.destName,
                        'receiverId2': commutate.requestId,
                        'receiverName2': commutate.requestName
                    });
                };
                break;
                case 'StopCooperate':
                    // 删除
                    let tableData = [];
                    this.tableData.forEach(item => {
                    //  return !(commutate.userId == userId ||  commutate.requestId == userId ||  commutate.destId == userId) && item;
                    if( !( commutate.requestId == userId ||  commutate.destId == userId ) ) {
                        tableData.push(item);
                    }
                    });
                    this.tableData = tableData;
                break;
            }
        },
        // 获取指挥组成员列表
        getCommandResources() {
          this.personData = this.parentMsg;
            //　默认展开一级节点
          this.expandedNodes = this.personData.map(item =>  item.resourceId );
          if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
            //   let checkData = this.$refs.personTree.getCheckedNodes();
              this.apiSDK.startCooperateCommand(this.commandId, '', 1);
          }
        },
        // 数组转树格式
        composeTree(list, pid = '0') {
            let tree = [];
            let temp;
            list.length && list.forEach((item, index) => {
                if (item.parentId ===  pid) {
                    let obj = item;
                    temp = this.composeTree(list, item.resourceId);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    tree.push(obj);
                }
            });
            return tree;
        },
        // 获取指挥组协同资源
        getCoordinateCommandResources() {
            // Testing-----------------------
           /* this.tableData = [
                { receiverId1: '1', receiverName1: '同级指挥者1', receiverId2: '1', receiverName2: '同级指挥者2' },
                { receiverId1: '2', receiverName1: '同级指挥者3', receiverId2: '1', receiverName2: '同级指挥者4' }
            ];*/
            // ------------------------------
            this.apiSDK.getCooperateCommandResources(this.commandId, res => {
                this.tableData = res;
            });
        },
        // 开始协同指挥
        startCoordinateCommand() {
            var flag = 0;
            let checkData = this.$refs.personTree.getCheckedNodes();
            if (checkData.length !== 1) {
                this.$message({message: '请选择一位指挥组成员', type: 'warning'});
                return;
            }
            if (checkData.length > 0) {
              checkData.forEach((item) => {
                if(item.id == xtxk.cache.get("USER").userId){
                  this.$message({
                    type: "warning",
                    message: "不能勾选自己!!!"
                  });
                  flag = 1
                  return
                };
                if(item.nodeStatus == "person_offline"){
                  this.$message({
                    type: "warning",
                    message: item.name +"不在线！"
                  });
                  flag = 1
                  return
                }
              });
            }
            
            if(flag != 1){
              let receiverId = checkData[0].id;
              this.apiSDK.startCooperateCommand(this.commandId, receiverId, 2);
            }
        },
        // 取消协同指挥
      cancelCooperateCommand(row) {
        this.$confirm("确认取消吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "关闭",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
            this.apiSDK.cancelCooperateCommand(this.commandId, row.receiverId2,row.receiverId1);
          })
        },
        // 取消全部协同
        cancelAllCooperate(){
          this.$confirm("确认取消全部协同吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "关闭",
            type: "warning",
            closeOnClickModal: false
          }).then(()=>{
            // 循环调用取消单个协同接口
            if(this.tableData.length == 0){
              this.$message({message: '没有正在协同的队列', type: 'warning'});
              return;
            }
            this.tableData.forEach((item)=>{
              this.apiSDK.cancelCooperateCommand(this.commandId,item.receiverId2,item.receiverId1);
            });
          }) .catch(() => {
            this.$message({
              type: "warning",
              message: "已取消"
            });
          });
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        }
    },
}
</script>
<style scoped>
.custom-card{
    border: 1px solid #c8cdd5;
}
.custom-card .title{
    height: 39px;
    background-color: #e9f3fa;
    font-size: 14px;
    color: #2e3c42;
    line-height: 39px;
    padding-left: 15px;
    border-bottom: 1px solid #c8cdd5;
}
.footer-btn{
    padding: 20px;
    border-top: 1px solid #c8cdd5;
    text-align: right;
}
.custom-card  /deep/ .el-table td,
.custom-card  /deep/ .el-table th{
    padding: 0;
    height: 36px;
    line-height: 36px;
}
/*.el-table td,*/
.custom-card  /deep/ .el-table th{
    border-color: #c8cdd5;
    background-color: #e9f3fa;
}
.custom-card  /deep/ .el-table::before{
    background-color: transparent;
}
.custom-dialog /deep/ .el-button--text{
    font-size: 22px;
    font-weight: bold;
}

</style>
