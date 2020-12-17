<template>
    <div class="callGroup">
        <p class="title" style="text-align:left;">【呼叫】{{groupName}}</p>
        <div class="content">
            <el-tree
                ref="source_tree"
                :data="treeData"
                :props="defaultProps"
                node-key="nodeId"
                :render-content="renderContent"
                show-checkbox
                @node-click="handleNodeClick">
            </el-tree>
        </div>
        <div class="btn-group">
            <el-button v-for="(item, index) in callGroupBtn" :key="index" type="text" :title="item.title" :class="item.class" @click="getEvent(item.event)">{{item.title}}</el-button>
        </div>
        <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceEventData"/>
    </div>
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
export default {
    name: 'GroupCallPanel',
    components: {
        SelectResource
    },
    data () {
        return {
            chairmanInfo: {},
            isChairman: false,
            treeData: [],
            groupId: '',
            groupName: '',
            defaultProps: {
                label: 'name',
                isLeaf: 'leaf'
            },
            callGroupBtn: [],
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 初始化数据
        initData(data_) {
            console.log("分组呼叫-开启呼叫-初始化数据");
            console.log(data_);
            if(data_ && data_.res){
                let data = data_.res;
                this.groupId = data.groupId
                this.groupName = data.groupName
                if( data.operate === 'init' ){
                    this.clearTree();
                }

                if(data.operate === 'remove'){
                    let treeObj = this.$refs.source_tree;
                    data.members.forEach((item, index) => {
                        let nodeId = item.userId + "_" + index;
                        const node = treeObj.getNode(nodeId);
                        if(node) treeObj.remove(node.data);
                    })
                }else{//init/add/refresh
                    if (data.members) {
                        this.checkTreeNode(data.members);
                    }
                }

                this.callGroupBtn = [
                    { title: '添加成员', class: 'add-user', event: 'addMember' },
                    { title: '强退成员', class: 'delete-user', event: 'removeCallGroupMember' },
                    { title: '呼叫', class: 'call', event: 'startGroupCallByMembers' },
                    { title: '停止呼叫', class: 'stop-call', event: 'stopGroupCallByMembers' },
                    { title: '全部呼叫', class: 'all-call', event: 'allStartGroupCallByMembers' },
                    { title: '全部停呼', class: 'all-stop-call', event: 'stopGroupCall' },
                    { title: '退出分组', class: 'exit', event: 'exitGroupCall' }
                ]
            }
        },
        getEvent(event) {
            this[event]()
        },
        //node判断
        checkTreeNode: function(list){
            let treeObj = this.$refs.source_tree;
            list.forEach((item, index) => {
                let nodeId = item.userId;
                //图标处理 isCalling:0.未呼叫 1.呼叫中,2.呼叫完成
                let resStatus = 0;
                let busStatus = 0;
                if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                if (item.isCalling === 1) {
                    busStatus = Enum.enumBussStatus.CallWaiting
                } else if(item.isCalling === 2) {
                    busStatus = Enum.enumBussStatus.Calling
                }
                let icon_ = Fun._getNodeStatus(0, resStatus, busStatus);

                const node = treeObj.getNode(nodeId);
                if(node){
                    //刷新
                    node.data.nodeStatus = icon_;
                }else{
                    //添加
                    let data = {
                        nodeId:         nodeId,
                        id:             item.userId,
                        name:           item.userName,
                        nodeStatus:     icon_
                    };
                    this.treeData.push(data)
                }
            })
        },
        //添加成员
        addMember() {
            this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.meetingAddMember);
        },
        // 从选择资源组件传出
        resourceEventData(resourceEvent){
          let members = []
          members = resourceEvent[0].map( item => {
            return { resId: item.id, resName: item.name }
          });
          this.apiSDK.addCallGroupMember(this.groupId, members)
        },
        getMembers() {
            let personArray = this.$refs.source_tree.getCheckedNodes()
            if (!personArray.length) {
                this.$message({message: '必须指定一名成员', type: 'warning'});
                return false;
            } else {
                let members = [];
                members = personArray.map(item => {
                    return { resId: item.id, resName: item.name };
                });
                return members;
            }
        },
        // 分组呼叫，移除成员
        removeCallGroupMember() {
            let members = this.getMembers();
            if (members) {
                this.$confirm('确定强退选定成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.apiSDK.removeCallGroupMember(this.groupId, members);
                })
            }
        },
        // 分组呼叫，勾选成员呼叫
        startGroupCallByMembers() {
            let members = this.getMembers();
            if (members) {
                this.apiSDK.startGroupCallByMembers(this.groupId, members);
            }
        },
        // 全部呼叫
        allStartGroupCallByMembers() {
            let members = [];
            members = this.treeData.map(item => {
                return { resId: item.id, resName: item.name };
            })
            if (members) {
                this.apiSDK.startGroupCallByMembers(this.groupId, members);
            }
        },
        // 分组呼叫，停止勾选成员呼叫
        stopGroupCallByMembers() {
            let members = this.getMembers();
            if (members) {
                this.apiSDK.stopGroupCallByMembers(this.groupId, members);
            }
        },
        // 停止所有呼叫
        stopGroupCall() {
            this.apiSDK.stopGroupCall(this.groupId);
        },
        // 退出分组呼叫
        exitGroupCall() {
            this.apiSDK.ExitGroupCall(this.groupId);
        },
        //清空树
        clearTree(){
            //清空node
            let tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.source_tree.getNode(item);
                node && this.$refs.source_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
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
    }
}
</script>
<style scoped>
.callGroup{
    position: relative;
    height: 100%;
}
.callGroup .title{
    background-color: #e9f3fa;
    height: 24px;
    overflow: hidden;
    line-height: 24px;
    font-size: 12px;
    padding: 0 10px;
    color: #2e3c42;
    margin: 0;
}
.callGroup .content .hr{
    height: 1px;
    border: 0;
    background: #c1cfd6;
}
.callGroup .btn-group{
    background-color: #e9f3fa;
    text-align: left;
    border-top: 1px solid #c1cfd6;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-left: 3px;
}
.callGroup .btn-group button{
    width: 58px;
    padding: 50px 0 0;
    color: #666;
    margin: 18px 8px;
    font-size: 12px;
}
.callGroup .btn-group button:hover{
    color: #666;
}
.add-user{
    background: url(../../../../static/resPanelControl/add.png) no-repeat center top;
}
.add-user:hover{
    background: url(../../../../static/resPanelControl/add_hover.png) no-repeat center top;
}
.delete-user{
    background: url(../../../../static/resPanelControl/delete.png) no-repeat center top;
}
.delete-user:hover{
    background: url(../../../../static/resPanelControl/delete_hover.png) no-repeat center top;
}
.call{
    background: url(../../../../static/resPanelControl/call.png) no-repeat center top;
}
.call:hover{
    background: url(../../../../static/resPanelControl/call_hover.png) no-repeat center top;
}
.all-call{
    background: url(../../../../static/resPanelControl/all_call.png) no-repeat center top;
}
.all-call:hover{
    background: url(../../../../static/resPanelControl/all_call_hover.png) no-repeat center top;
}
.all-stop-call{
    background: url(../../../../static/resPanelControl/all_stop_call.png) no-repeat center top;
}
.all-stop-call:hover{
    background: url(../../../../static/resPanelControl/all_stop_call_hover.png) no-repeat center top;
}
.stop-call{
    background: url(../../../../static/resPanelControl/stop_call.png) no-repeat center top;
}
.stop-call:hover{
    background: url(../../../../static/resPanelControl/stop_call_hover.png) no-repeat center top;
}
.exit{
    background: url(../../../../static/resPanelControl/stop.png) no-repeat center top;
}
.exit:hover{
    background: url(../../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
</style>
