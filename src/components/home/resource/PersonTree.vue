<template>
    <div class="treeBox" style="text-align:center">
        <div class="serachWrap">
            <el-row :gutter="5" style="margin:0px">
                <el-col :span="7" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && !searchChange">
                    <el-dropdown placement="bottom" @command="handleSelectRelationship">
                        <span class="el-dropdown-link">
                            {{relationshipValue | filterRelationship}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">行政隶属</el-dropdown-item>
                            <el-dropdown-item command="1">指挥隶属</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6?10:20" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 || (apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && searchChange)">
                    <div class="search" >
                        <el-input v-model="input_person" placeholder="请输入关键字" @keyup.enter.native="handleSearchByKey">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6?6:5" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 || (apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && !searchChange)">
                    <el-dropdown placement="bottom" @command="handleSelectStatus">
                        <span class="el-dropdown-link">
                            {{statusValue | filterStatus}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="all">全部</el-dropdown-item>
                            <el-dropdown-item command="true">在线</el-dropdown-item>
                            <el-dropdown-item command="false">离线</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="8" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 || (apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && !searchChange)">
                    <el-dropdown placement="bottom" @command="handleSelectDir">
                        <span class="el-dropdown-link">
                            {{levelValue | filterLevel}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">1级</el-dropdown-item>
                            <el-dropdown-item command="2">2级</el-dropdown-item>
                            <el-dropdown-item command="3">3级</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="4" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5">
                    <div class="newSearchBtn" :class="!searchChange ? 'searchStatus' :'backStatus' " :title="!searchChange ? '搜索' :'返回' " @click="handleChangeSerachWrap"></div>
                </el-col>
            </el-row>
        </div>
        <div class="treeWrap">
            <el-tree
                :props="props"
                :data="treeData"
                :load="loadNodeMainUser"
                node-key="nodeId"
                ref="main_user_tree"
                lazy
                show-checkbox
                :default-expanded-keys="expandedNodes"
                :render-content="renderContent"
                @node-click="handleNodeClick"
                @node-contextmenu="handleNodeRightClick"
            >
            </el-tree>
        </div>
        <tree-right-menu ref="rightMenu"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'PersonTree',
    components: {
        TreeRightMenu
    },
    data () {
        return {
            props: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            treeData: [],   // 整个树data
            expandedNodes: [],   // 默认张开的id集合
            currentNode: {
                id: null,
                time: null,   // 点击时间
            },
            treeType:"all",
            input_person:'',
            statusValue:'all',
            levelValue: '',

            searchChange:false,
            relationshipValue:0,
            USER: this.$store.getters.getUserinfo,
        };
    },
    filters: {
        filterStatus(status) {
            let res = "状态"
            if(status == 'all') res = "全部"
            else if(status == 'true') res = "在线"
            else if(status == 'false') res = "离线"
            return res;
        },
        filterLevel(level) {
            let res = "目录层级"
            if(level == 1) res = "1级"
            else if(level == 2) res = "2级"
            else if(level == 3) res = "3级"
            return res;
        },
        filterRelationship(relationship){
            let res = "行政隶属"
            if(relationship == 0) res = "行政隶属"
            else if(relationship == 1) res = "指挥隶属"
            return res;
        },
    },
    methods: {
        nodeDragStart(node, ev) {
            ev.dataTransfer.setData("Text", JSON.stringify(node.data));
        },
        // 拖拽时判定目标节点能否被放置
        allowDrop(draggingNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {
            let nodeStatus = node.data.nodeStatus;
            if (nodeStatus.indexOf('online') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        handleChangeSerachWrap(){
            this.searchChange = !this.searchChange;
            if( this.searchChange == false ){
                this.input_person = "";
                this.statusValue = "all";
                this.treeType = "all";
                let self = this;
                let organId = "";
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.main.subscribeOrganizationUser, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
            }
        },
        handleSelectRelationship(val){
            if(this.relationshipValue == val) return;
            this.relationshipValue = val;
            this.statusValue = "all";
            this.treeType = "all";
            let self = this;
            let organId = "";
            let subjectId = this.relationshipValue;
            this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.main.subscribeOrganizationUser, subjectId, function(obj) {
                self.setReceiveInformAddDepartmentCallback(obj);
            });
        },
        //组织回调
        setReceiveInformAddDepartmentCallback(obj) {
            if (obj && obj.rows) {
                //人员组织
                //主页
                if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationUser) {
                    this.clearTree();
                    this.treeData = Fun._initDepartmentTreeData(obj.rows);
                    //默认展开一级节点
                    this.treeData.forEach(item => {
                        this.expandedNodes.push(item.nodeId);
                    });
                }
            }
        },
        //资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (obj.operate === "init") {
                    this.initResourceStatus(obj.subscribeId, list);
                } else if (obj.operate === "add") {
                    this.addResourceStatus(obj.subscribeId, list);
                } else if (obj.operate === "remove") {
                    this.removeResourceStatus(obj.subscribeId, list);
                } else if (obj.operate === "refresh") {
                    this.refreshResourceStatus(obj.subscribeId, list);
                }
            }
        },
        //init
        initResourceStatus(subscribeId, list) {
            //主页
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.main_user_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }

            if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                // console.log(list);
                // console.log(this.treeData);
                let treeObj = this.$refs.main_user_tree;
                let checkedArr = [];
                checkedArr = treeObj.getCheckedNodes();
                list.length >0 && list.forEach(item=>{
                    var nodeId = item.parentId;
                    var node = treeObj.getNode(nodeId);
                    if( node && node.checked == true ){
                        node.data.children.length>0 && node.data.children.forEach(item2=>{
                            checkedArr.push(item2);
                        });
                    }
                })
                treeObj.setCheckedNodes(checkedArr); 
            }
        },
        //add
        addResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.main_user_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                Fun._appendPersonTreeData(this.$refs.main_user_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                Fun._appendPersonTreeData(this.$refs.main_user_tree, list);
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.main_user_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.main_user_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.main_user_tree, list);
            }
        },
        //refresh
        refreshResourceStatus(subscribeId, list) {
            //主页
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                const onlines = Fun._refreshPersonTreeData(this.$refs.main_user_tree, list);
                this.onlineNotify(onlines);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.main_user_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.main_user_tree, list);
            }
        },
        //人员上线通知
        onlineNotify(list){
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                if (item.resId !== this.USER.userID) {
                    this.$notify({
                        title: '上线通知',
                        message: "【"+item.resName+"】上线了",
                        position: 'bottom-right',
                        type: 'info',
                    });
                }
            }
        },
        //加载节点
        loadNodeMainUser(node, resolve){
            if(node.data.nodeStatus == 'department'){
                //加载人员
                this.apiSDK.subscribeUserStatus(node.data.id, Enum.enumSubscribeType.main.subscribeUsersStatus);
                resolve(node.data.children);
            }
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            //console.log(node.data)
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
                if(data.nodeStatus=="person_online"){
                    Fun.startPlayPerson(this, data);
                }else if(data.nodeStatus=="person_playing"){
                    Fun.stopPlayPerson(this.apiSDK, data);
                }else if(data.nodeStatus=="person_offline"){
                    this.showremind("点播提示","人员不在线，不允许点播！")
                }else if(data.nodeStatus=="person_fault"){
                    this.showremind("点播提示","人员绑定设备异常，不允许点播！")
                }
            }
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();

            this.$refs.rightMenu.closeRightMenu();
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            //console.log(node.data.nodeStatus)
            if(data.nodeStatus != 'department'){
                this.$refs.rightMenu.showRightMenu(event, data);
            }
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        //关键字搜索
        handleSearchByKey(){
            var self = this;
            var organId = "";
            if( this.treeType=="all" && !this.input_person){
                this.showremind("提示", "请输入需要检索的关键字！");
            }else if( this.treeType!="all" && !this.input_person ){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.main.subscribeOrganizationUser, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
            }else{
                this.clearTree();
                //console.log(this.treeType)

                if(this.treeType=="all"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUserStatus,"person");
                }
                if(this.treeType=="status"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByStatus,"personquery");
                }
                this.apiSDK.subscribeUserQuery("text", this.input_person, "", 0, Enum.enumSubscribeType.main.subscribeUsersStatusByKey, organId)
                this.treeType="text";
            }
        },
        //状态搜索
        handleSelectStatus(val){
            if(this.statusValue == val) return;
            this.statusValue = val;

            var self = this;
            var organId = "";
            if(val==this.treeType) return;
            if(val == "all"){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.main.subscribeOrganizationUser, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });

                //console.log(this.treeType)
                //取消状态订阅
                if(this.treeType=="text"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByKey,"personquery");
                }

                if(this.treeType=="status"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByStatus,"personquery");
                }

                this.treeType="all"
            }else{
                this.clearTree();

                //console.log(this.treeType)
                if(this.treeType=="all"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUserStatus,"person");
                }
                if(this.treeType=="text"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByKey,"personquery");
                }
                this.apiSDK.subscribeUserQuery("online", "", val, 0, Enum.enumSubscribeType.main.subscribeUsersStatusByStatus, organId)

                this.treeType="status";
            }
        },
        //目录搜索
        handleSelectDir(val){
            //console.log('click on item ' + val);
            this.treeType = 'all'
            this.statusValue = 'all'
            if(this.levelValue == val) return;
            if(this.treeType=="all"){
                this.levelValue = val;

                this.expandedNodes = [];
                let arrayData = Fun.transformTreeToArray(this.treeData);
                arrayData.forEach(item => {
                    let node = this.$refs.main_user_tree.getNode(item);

                    if(node){
                        if(node.level < val){
                            if(node.data.nodeStatus == 'department'){
                                if(node.data.children.length == 0){
                                    //加载人员
                                    this.apiSDK.subscribeUserStatus(node.data.id, Enum.enumSubscribeType.main.subscribeUsersStatus);
                                    node.expanded = true
                                }else{
                                    this.expandedNodes.push(node.data.nodeId);
                                }
                            }
                        }else{
                            node.expanded = false
                        }
                    }
                });
            }
        },
        //清空树
        clearTree(){
            //清空node
            var tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.main_user_tree.getNode(item);
                node && this.$refs.main_user_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        showremind(title, message){
            this.$notify({
                    title: title,
                    message: message,
                    position: 'bottom-right',
                    type: 'warning',
                  });
        },
    },
}
</script>

<style scoped>
.treeBox{
    height: 100%;
}
.newSearchBtn{
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    padding: 12px;
    border:1px solid #DCDFE6;
    border-radius: 5px;
    box-sizing: border-box;
}
.searchStatus{
    background: url(../../../../static/common/search.png) no-repeat center center;
}
.backStatus{
    background: url(../../../../static/common/back_btn.png) no-repeat center center;
}
.treeWrap{
    width:300px;
    height: calc(100% - 45px);
    overflow: auto;
}
</style>
