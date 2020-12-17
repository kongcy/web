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
                        <el-input v-model="input_device" placeholder="请输入关键字" @keyup.enter.native="handleSearchByKey">
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
                    :load="loadNodeMainDevice"
                    node-key="nodeId"
                    ref="main_device_tree"
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
        <virtual-device @closeVirtaul="closeVirtualContent" :virtualId="virtualTreeId" v-show="showVirtual" ref="virtualDevice"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import VirtualDevice from '@/components/home/resource/virtualDevice.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'DeviceTree',
    components: {
        TreeRightMenu,
        VirtualDevice
    },
    data () {
        return {
            props: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            treeData: [],//整个树data
            expandedNodes: [],//默认张开的id集合
            currentNode: {
                id: null,
                time: null,//点击时间
            },

            treeType:"all",
            input_device:'',
            statusValue:'all',
            levelValue: '',

            showVirtual: false,
            virtualTreeId: '',

            searchChange:false,
            relationshipValue:0,
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
            ev.dataTransfer.setData("item", JSON.stringify(node.data));
        },
        // 拖拽时判定目标节点能否被放置
        allowDrop(draggingNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {
            let nodeStatus = node.data.nodeStatus;
            if (nodeStatus.indexOf('online') !== -1 && !node.data.children) {
                return true;
            } else {
                return false;
            }
        },
        handleChangeSerachWrap(){
            this.searchChange = !this.searchChange;
            if( this.searchChange == false ){
                this.input_device = "";
                this.statusValue = "all";
                this.treeType = "all";
                let self = this;
                let organId = "";
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj) {
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
            this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj) {
                self.setReceiveInformAddDepartmentCallback(obj);
            });
        },
        //组织回调
        setReceiveInformAddDepartmentCallback(obj) {
            if (obj && obj.rows) {
                //设备组织
                if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationDevice) {
                    this.clearTree();
                    this.treeData = Fun._initDepartmentTreeData(obj.rows);
                    //默认展开一级节点
                    setTimeout(() => {
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }, 1000);
                } 
            }
        },
        //资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (obj.operate === "init") {
                    this.initResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "add") {
                    this.addResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "remove") {
                    this.removeResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "refresh") {
                    this.refreshResourceStatus(obj.subscribeId, list);
                }
            }
        },
        //init
        initResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            } 

            if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                // console.log(list);
                // console.log(this.treeData);
                let treeObj = this.$refs.main_device_tree;
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
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.main_device_tree, list);
            }
        },
        //refresh
        refreshResourceStatus(subscribeId, list) {
            let nodes = Fun.transformTreeToArray(this.treeData);
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                const onlines = Fun._refreshDeviceTreeData(this.$refs.main_device_tree, list);
                this.onlineNotify(onlines);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.main_device_tree, list);
            }
        },
        //设备上线通知
        onlineNotify(list){
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                this.$notify({
                    title: '上线通知',
                    message: "【"+item.resName+"】上线了",
                    position: 'bottom-right',
                    type: 'info',
                  });
            }
        },
        //加载节点
        loadNodeMainDevice(node, resolve){
            if(node.data.nodeStatus == 'department'){
                //加载设备
                this.apiSDK.subscribeDeviceStatus(node.data.id, Enum.enumSubscribeType.main.subscribeDevicesStatus);
                resolve(node.data.children);
            } else if (node.data.children) {
                resolve(node.data.children);
            }
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            //console.log(data)
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
                if(data.nodeStatus=="device_online"){
                    Fun.startPlayDevice(this, data);
                }else if(data.nodeStatus=="device_playing"){
                    Fun.stopPlayDevice(this.apiSDK, data);
                }else if(data.nodeStatus=="device_offline"){
                    this.showremind("点播提示","设备不在线，不允许点播！")
                }else if(data.nodeStatus=="virtual_online"){
                    Fun.startPlayDevice(this, data);
                }else if(data.nodeStatus=="virtual_playing"){
                    Fun.stopPlayDevice(this.apiSDK, data);
                }else if(data.nodeStatus=="virtual_offline"){
                    this.showremind("点播提示","设备不在线，不允许点播！")
                }else if(data.nodeStatus=="channel_offline"){
                    this.showremind("点播提示","设备不在线，不允许点播！")
                }else if(data.nodeStatus=="channel_online"){
                    Fun.startPlayDevice(this, data);
                }else if(data.nodeStatus=="channel_playing"){
                    Fun.stopPlayDevice(this.apiSDK, data);
                }else if(data.nodeStatus=="channel_playWaiting"){
                    Fun.stopPlayDevice(this.apiSDK, data);
                }
            }else {
                if(data.nodeStatus=="virtual_online" || data.nodeStatus=="virtual_playing"){
                    this.virtualTreeId = data.id;
                    this.showVirtual = true;
                }
                 //点击播放中的 设备节点 相对应的屏幕被选中
                //获取选中的设备ID
                let deviceID = data.id 
                //获取所有正在播放的屏幕
                let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
                if (screenArr.length != 0) {
                    let ckResource  = screenArr.find(item => item.resId == deviceID)
                    if(typeof(ckResource) != 'undefined'){
                        let ckResourceIndex = ckResource.screenIndex
                        let playEl = this.$parent.$parent.$parent.$parent.$refs.imageShow.$el.children[0].children[ckResourceIndex]
                        playEl.click();
                    }
                }
            }
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();

            this.$refs.rightMenu.closeRightMenu();
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
            //
            if( data.nodeStatus == 'department' ) {
               this.setDeviceAlarmStatusByClick(data)
            }
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            //console.log(node.data.nodeStatus)
             event.stopPropagation();
            if(data.nodeStatus != 'department'){
                this.$refs.rightMenu.showRightMenu(event, data);
            }
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            //console.log(data.nodeStatus, data.alarm, '------------')
            let icon = data.nodeStatus
            let alarm = data.alarm ? "alarm" : ''
            return (<span class={"custom-tree-node " + icon + " " + alarm} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        //关键字搜索
        handleSearchByKey(){
            var self = this;
            var organId = "";
            if( this.treeType=="all" && !this.input_device ){
                this.showremind('提示','请输入关键字');
            }else if( this.treeType!="all" && !this.input_device ){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
            }else{
                this.clearTree();
                if(this.treeType=="all"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUserStatus,"device");
                }
                if(this.treeType=="status"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByStatus,"devicequery");
                }
                this.apiSDK.subscribeDeviceQuery("text", this.input_device, "", 0, Enum.enumSubscribeType.main.subscribeDevicesStatusByKey, organId)
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
                this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
                //取消状态订阅
                if(this.treeType=="text"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByKey,"devicequery");
                }

                if(this.treeType=="status"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByStatus,"devicequery");
                }

                this.treeType="all"
            }else{
                this.clearTree();
                if(this.treeType=="all"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUserStatus,"device");
                }
                if(this.treeType=="text"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.main.subscribeUsersStatusByKey,"devicequery");
                }
                this.apiSDK.subscribeDeviceQuery("online", "", val, 0, Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus, organId)

                this.treeType="status";                    
            }
        },
        //目录搜索
        handleSelectDir(val){
            //console.log('click on item ' + val);
            this.treeType = 'all'
            this.statusValue = 'all'
            // this.handleSelectStatus("all")
            if(this.levelValue == val) return;
            if(this.treeType=="all"){
                this.levelValue = val;

                this.expandedNodes = [];
                let arrayData = Fun.transformTreeToArray(this.treeData);
                arrayData.forEach(item => {
                    let node = this.$refs.main_device_tree.getNode(item);
                    if(node){
                        if(node.level < val){
                            if(node.data.nodeStatus == 'department'){
                                if(node.data.children.length == 0){
                                    //加载
                                    this.apiSDK.subscribeDeviceStatus(node.data.id, Enum.enumSubscribeType.main.subscribeDevicesStatus);
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
                let node = this.$refs.main_device_tree.getNode(item);
                node && this.$refs.main_device_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        showremind(title,message){
            this.$notify({
                    title: title,
                    message: message,
                    type: 'warning',
                  });
        },
        closeVirtualContent() {
            this.showVirtual = false;
        },
        //设置告警标示
        setDeviceAlarmStatusByTip(departId, deviceId) {
            //标示部门
            let orgDataArr = Fun.transformTreeToArray(this.treeData);
            let index = orgDataArr.findIndex(item => item.id === departId);
            if(index > -1) orgDataArr[index].alarm = true;
            //标示设备
            let dIndex = orgDataArr.findIndex(item => item.id === deviceId);
            if(dIndex > -1) orgDataArr[dIndex].alarm = true;
        },
        setDeviceAlarmStatusByClick(data){
            let departId = data.id
            setTimeout(() => {
                // 点击部门，设备资源返回后，再调  获取部门下未读告警设备接口
                this.apiSDK.queryResourceReaded(departId, res => {
                    if (res.responseCode && res.responseCode == 0 && res.data && res.data.length > 0) {
                        let treeDataArr = Fun.transformTreeToArray(this.treeData);
                        data.alarm = true;
                        res.data.forEach(dataItem => {
                            let dIndex = treeDataArr.findIndex(item => item.id == dataItem.deviceID);
                            treeDataArr[dIndex].alarm = true;
                        });
                    } else {
                        data.alarm = false;
                        data.children && data.children.forEach(dataItem => {
                            dataItem.alarm = false;
                        });
                    }
                });
            }, 1000);
        }
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