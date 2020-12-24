<template>
   <div id="CommonUse" class="treeBox" style="text-align:center">
     
        <!-- 筛选 -->
        <div class="serachWrap">
            <el-row :gutter="5" style="margin:0px">
                  <el-col :span="24">
                    <div class="search" >
                        <el-input v-model="input_device" placeholder="请输入关键字" @keyup.enter.native="handleSearchByKey">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 视频监控树 -->
        <el-scrollbar class="treeWrap hiddenXScroll" :style="{height:moreNum==1?'calc(100% - 167px)':'calc(100% - 127px)'}">
                <el-tree
                    :props="props"
                    :data="treeData"
                    node-key="nodeId"
                    ref="recently_tree"
                    :load="loadNodeMainDevice"
                    lazy
                    show-checkbox
                    :default-expanded-keys="expandedNodes"
                    :render-content="renderContent"
                    @node-click="handleNodeClick"
                    @node-contextmenu="handleNodeRightClick"
                    @check="handleNodeCheck"
                    @node-drag-start="nodeDragStart"
                    draggable
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                    :indent="26"
                >
                </el-tree>
        </el-scrollbar>
         <div v-show="moreNum==1">
           <el-button type="text" @click="seemore">查看更多<i class="icon-down el-icon-d-arrow-right"></i></el-button>  
        </div>
        <div class="treefoot">
            <!-- <div class="treeSelectedNum">已选中{{selectedNum}}个视频资源</div> -->
            <div class="treeOperate">
                <div class="treeOperate-l"  :title="'已选中'+selectedNum+'个视频资源'">
                    已选中<span class="treeSelectedNum">{{selectedNum}}</span>个视频资源
                </div>
                <div class="treeOperate-btn">
                    <el-button type="text"  @click="clearAllNum"><i class="icon-clear"></i>清空</el-button>
                    <el-button type="primary" size="small" @click="startPlays" style="margin-left:5px"><i class="icon-play"></i><span>点播</span></el-button>
                    <el-button v-if="!hasPlayD" type="danger" size="small" @click="stopAll" plain class="nobg"><i class="icon-stopPlay"></i><span>停止</span></el-button>
                    <el-button v-else type="danger" size="small" @click="stopAll"><i class="icon-stopPlay_bg"></i><span>停止</span></el-button>
                </div>
            </div>
        </div>
        <!-- 右键菜单 -->
         <tree-right-menu ref="rightMenu"  v-on="$listeners"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'CommonUse',
    components: {
        TreeRightMenu,
    },
    data () {
        return {
            hasPlayD:false,
            moreNum:1,
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

          selectedNum:0,
            automaticPlay: false
        };
    },
    methods: {
        // 自动点播 前9条数据或者9条以内
        isAutoPlay(){
            this.automaticPlay = true;
            this.$message({message: '正在点播您关注的常用资源...'})
        },
        //1119云调度拖动点播
        nodeDragStart(node, ev) {
            ev.dataTransfer.setData("item", JSON.stringify(node.data));
        },
        // 拖拽时判定目标节点能否被放置
        allowDrop(draggingNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {
            let nodeStatus = node.data.nodeStatus;
            //1126 同步云调度 1125 多通道数据判断条件修改---------
            if (nodeStatus.indexOf('online') !== -1 && !node.data.children) {
                return true;
            } else {
                return false;
            }
        },
         // 去重
        reduce(array) {
            let object = {}
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total
            }, [])
        },
        /**
         * @param  {String} resType [需返回的数据，默认为所有]
         * @return {Array}          [description]
         */
        mergeResourceData() {
            let nodes = [];
            nodes = this.$refs.recently_tree.getCheckedNodes();
            return this.reduce(nodes);
        },
         //批量点播
        startPlays(){
            var targetNodesP = [];
            var targetNodesD = [];

            var nodes = this.mergeResourceData();
            for( var i=0;i<nodes.length;i++ ){
                if( nodes[i].nodeStatus == "person_online" ){
                targetNodesP.push(nodes[i]);
                }
                if( nodes[i].nodeStatus == "device_online" || nodes[i].nodeStatus == 'channel_online'){
                targetNodesD.push(nodes[i]);
                }
            }
            if( targetNodesP.length + targetNodesD.length == 0 ){
                // var content = '请选择在线空闲的资源发起点播';
                // this.$message({message: content, type: 'warning'})
                return;
            }
          
            Fun.startPlayRess(this, targetNodesP.concat(targetNodesD));
        },
        //全部停止
        stopAll(){
            // var targetNodesP = [];
            // var targetNodesD = [];

            // var nodes = this.mergeResourceData();
            // console.log(nodes);
            // for( var i=0;i<nodes.length;i++ ){
            //     if( nodes[i].nodeStatus.indexOf("person_")>-1){
            //         if( nodes[i].nodeStatus != "person_online"){
            //             targetNodesP.push(nodes[i]);
            //         }
            //     }
            //     if(nodes[i].nodeStatus.indexOf("device_")>-1||nodes[i].nodeStatus.indexOf("channel_")>-1){
            //         if( nodes[i].nodeStatus != "device_online"&&nodes[i].nodeStatus != 'device_offline'&&nodes[i].nodeStatus != 'channel_online'&&nodes[i].nodeStatus != 'channel_offline'){
            //             targetNodesD.push(nodes[i]);
            //         }
            //     }
               
            // }
            // if( targetNodesP.length + targetNodesD.length == 0 ){
            //     var content = '请至少选择一个在线播放的资源发起停止点播';
            //     this.$message({message: content, type: 'warning'})
            //     return;
            // }
            //  Fun.stopPlayDevices(this,targetNodesP.concat(targetNodesD));
            // this.$listeners.StopAllHideHolder(targetNodesP.concat(targetNodesD));
             this.apiSDK.stopAll();  
            this.$listeners.StopAllHideHolder(true);
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
        //查看更多
        seemore(){
            this.moreNum="";
            this.getTreeNode()
        },
        //获取常用节点
        getTreeNode(){
            let self=this;
             this.apiSDK.getCommonUse(this.moreNum,function(obj){
                 console.log('常用资源',obj);
                  if (obj ) {
                    //设备组织
                    self.clearTree();
                    self.treeData = Fun._initCommonUseTreeData(obj);
                   // 默认展开一级节点
                    setTimeout(() => {
                        self.treeData.forEach(item => {
                            self.expandedNodes.push(item.nodeId);
                        });
                        setTimeout(()=> {
                            if( self.automaticPlay ){
                                 let node = {
                                     checkedKeys: [],
                                     checkedNodes: []
                                 }
                                self.treeData[0].children.forEach( ( item, index ) => {
                                    if( index < 9 ){
                                        node.checkedKeys.push(item.nodeId);
                                        node.checkedNodes.push(item);
                                    };
                                });
                                self.$refs.recently_tree.setCheckedKeys(node.checkedKeys);
                                self.handleNodeCheck({}, node);

                                // self.$refs.recently_tree.setCheckedKeys([self.treeData[0].id]);
                                // self.startPlays();
                            };
                        }, 1000);
                    }, 1000);

                    self.$nextTick(() => {
                        self.changeStatus()
                    })
            }
              
            });
        },
       
        changeStatus(){
            let self=this;
            let currentScreen=JSON.parse(sessionStorage.getItem('currentScreen'));
            console.log("-------"+currentScreen);
            if(currentScreen&&currentScreen.length>0){
                self.hasPlayD=true;
                self.treeData[0].children.forEach(item=>{
                    var n=currentScreen.findIndex(val=>item.id==val.resId);
                    if(n>-1){
                        if(item.nodeStatus.indexOf("device_")>-1){
                        item.nodeStatus="device_playing"
                        }else if(item.nodeStatus.indexOf("NVR_")>-1){
                        item.nodeStatus="NVR_playing"
                        }else if(item.nodeStatus.indexOf("channel_")>-1){
                        item.nodeStatus="channel_playing"
                        }
                    }else{
                        if(item.nodeStatus.indexOf("device_")>-1){
                            if(item.nodeStatus=='device_playing'||item.nodeStatus=='device_playWaiting')item.nodeStatus="device_online"
                        }else if(item.nodeStatus.indexOf("NVR_")>-1){
                                if(item.nodeStatus=='NVR_playing'||item.nodeStatus=='NVR_playWaiting')item.nodeStatus="NVR_online"
                        }else if(item.nodeStatus.indexOf("channel_")>-1){
                            if(item.nodeStatus=='channel_playing'||item.nodeStatus=='channel_playWaiting')item.nodeStatus="channel_online"
                        }
                    }
                })
            }else{
                self.hasPlayD=false;
                self.treeData[0].children.forEach(item=>{
                    if(item.nodeStatus.indexOf("device_")>-1){
                        if(item.nodeStatus=='device_playing'||item.nodeStatus=='device_playWaiting')item.nodeStatus="device_online"
                    }else if(item.nodeStatus.indexOf("NVR_")>-1){
                            if(item.nodeStatus=='NVR_playing'||item.nodeStatus=='NVR_playWaiting')item.nodeStatus="NVR_online"
                    }else if(item.nodeStatus.indexOf("channel_")>-1){
                        if(item.nodeStatus=='channel_playing'||item.nodeStatus=='channel_playWaiting')item.nodeStatus="channel_online"
                    }
                })
            }
        },
       //资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (obj.operate === "init") {
                    //this.initResourceStatus('MainDevicesStatus', list);
                }else if (obj.operate === "add") {
                    //this.addResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "remove") {
                  //  this.removeResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "refresh") {
                    this.refreshResourceStatus(obj.subscribeId, list);
                }
            }
        },
        //init
        initResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._appendCommonTreeData(this.$refs.recently_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            } 
        },
        //add
        addResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._appendCommonTreeData(this.$refs.recently_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._appendCommonTreeData(this.$refs.recently_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._appendCommonTreeData(this.$refs.recently_tree, list);
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._removeCommonTreeData(this.$refs.recently_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._removeCommonTreeData(this.$refs.recently_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._removeCommonTreeData(this.$refs.recently_tree, list);
            }
        },
        //refresh
        refreshResourceStatus(subscribeId, list) {
            let nodes = Fun.transformTreeToArray(this.treeData);
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._refreshCommonUseData(this.$refs.recently_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._refreshCommonUseData(this.$refs.recently_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._refreshCommonUseData(this.$refs.recently_tree, list);
            }
        },
       
        //加载节点
        loadNodeMainDevice(node, resolve){
            if(node.data.nodeStatus == 'department'){
                //加载设备
                //this.apiSDK.getCommonUse(node.data.id, Enum.enumSubscribeType.main.subscribeDevicesStatus);
                resolve(node.data.children);
            } else if (node.data.children) {
                resolve(node.data.children);
            }
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
                //NVR相关点击2020.12.2添加
                if(data.nodeStatus=="device_online"||data.nodeStatus=="NVR_online"){
                    Fun.startPlayDevice(this, data, null, 'unicast');
                }else if(data.nodeStatus=="device_playing"||data.nodeStatus=="NVR_playing"){
                    Fun.stopPlayDevice(this.apiSDK, data);
                }else if(data.nodeStatus=="device_offline"||data.nodeStatus=="NVR_offline"){
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
                    Fun.startPlayDevice(this, data, undefined, 'unicast');  //1126 同步云调度 1126 多通道修改------------
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
                        let playEl = this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$refs.imageShow.$el.children[0].children[ckResourceIndex]
                        playEl.click();
                    }
                }

            }
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();

            this.$refs.rightMenu.closeRightMenu();
            if( data.nodeStatus != 'department' ) {
              // node.checked = !node.checked;
            }
            //
            if( data.nodeStatus == 'department' ) {
               this.setDeviceAlarmStatusByClick(data)
            }
            this.$parent.isTreeItemShow=false;
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            //console.log(node.data.nodeStatus)
             event.stopPropagation();
            if(data.nodeStatus != 'department'){
                this.$refs.rightMenu.showRightMenu(event, data);
            }
            this.$parent.isTreeItemShow=false;
        },
        //当复选框被点击的时候触发
        handleNodeCheck(data,node){
            // wxx 2020.11.26
            let n=0;
            let resInfos = [];
            let nvrDevice = [];
            node.checkedNodes.forEach(item => {
                console.log('勾选数据-----', item);
                // nvr多通道批量点播
                if (item.resourceType == 'channel') {
                     ++n;
                } else  if(item.nodeStatus!="department"&&item.nodeStatus!="company"){
                     ++n;
                }
            })
            this.selectedNum=n;
            this.$parent.isTreeItemShow=false;
            this.automaticPlay && this.startPlays();
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            let icon = data.nodeStatus
            let alarm = data.alarm ? "alarm" : ''
            let title=""
            //wxx 2020.11.25
            let count='('+data.onLineCount+'/'+data.totalCount+')'
            if(data.nodeStatus=='department'||data.nodeStatus=='company'){
                return (<span class={"custom-tree-node " + icon + " " + alarm}>
                    <span class="node-icon"></span>
                    <span>{node.label}{count}</span>
                </span>);
            }else{
                //12.17 涉及到通道排序，暂时还原，等通道排序弄好再加
                 return (<span class={"custom-tree-node " + icon + " " + alarm}  title={'最近:'+data.time+' 频率:'+data.num+'次'}>
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
                //  if(data.deviceType=='GBNVREncoder'){
                //     return (<span class={"custom-tree-node " + icon + " " + alarm}  title={'最近:'+data.time+' 频率:'+data.num+'次'}>
                //         <span class="node-icon"></span>
                //         <span>{node.label}</span>
                //     </span>);
                // }else{
                //     return (<span class={"custom-tree-node " + icon + " " + alarm}  title={'最近:'+data.time+' 频率:'+data.num+'次'}>
                //       <span class="node-icon-holder"></span> 
                //         <span class="node-icon"></span>
                //         <span>{node.label}</span>
                //     </span>);
                // }

                //   return (<span class={"custom-tree-node " + icon + " " + alarm}  title={'最近:'+data.time+' 频率:'+data.num+'次'}>
                //     <span class="node-icon"></span>
                //   <el-tooltip effect="dark" content={'最近:'+data.time+' 频率:'+data.num+'次'} placement="bottom-start">
                //     <span>{node.label}</span>
                //     </el-tooltip>
                // </span>);
            }
                
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
                    let node = this.$refs.recently_tree.getNode(item);
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
                let node = this.$refs.recently_tree.getNode(item);
                node && this.$refs.recently_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        showremind(title,message){
            this.$notify({
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
        },
        clearAllNum(){
            this.$refs.recently_tree.setCheckedKeys([]);
             this.selectedNum=0;
        }
   },
}
</script>

<style>
#CommonUse  .el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 20px);
}
</style>

<style scoped>
#CommonUse /deep/ .custom-tree-node.company .node-icon{
    background: url("../../../../static/resource_tree/tab/emphasis.png");
}
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
.icon-down{
    transform: rotate(90deg);
}
.treeWrap{
    width:412px;
    height: calc(100% - 167px);
     padding: 0 5px;
    /* overflow: hidden; */
    /* padding: 0 0 0 16px; */
    box-sizing: border-box;
}
.divSearchBox {
  width: 100%;
  height: 40px;
  /* line-height: 40px; */
  /* overflow: hidden; */
  /* border: 1px solid #365076; */
  /* background-color: #dbf0fe; */
  box-sizing: border-box;
  position: relative;
}
.text-center{
  text-align: center;
}
.text-right{
  text-align: right;
}
.searchBtn{
   position: absolute;
  right: 0px;
  top: 0px;
  padding: 0px;
  border: 0px;
  width: 40px;
  height: 40px;
  background:#409EFF;
  text-align: center;
  
}
.searchBtn-command{
    width: 40px;
    height: 40px;
    outline: none;
    border-width: 0px;
    background:url(../../../../static/common/u106.png) no-repeat center;
    background-size: 20px;
    cursor: pointer;
}
.searchBtn:hover{
   background:#56a9ff;
}

.treeOperate{
   padding: 8px 12px;
    box-sizing: border-box;
}

/* ui tab样式11.16 */
.treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header{
    background: transparent!important;
}
.treeBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item{
  padding: 0 12px;
  color:#B7C1D0
}
.treeBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item::after{
  content:'';
  margin: 0;
}
.treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  font-weight: bold;
  color:#fff;
}
 .treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__active-bar{
  height: 3px;
}

.tabtree-icon{
    display: inline-block;
    width:14px;
    height: 14px;
    vertical-align: middle;
    cursor: pointer;
}
/* 部门 */
.icontree-department{
    background:url(../../../../static/resource_tree/tab/department.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-department{
    background:url(../../../../static/resource_tree/tab/department_active.png) no-repeat center;
    background-size: 18px;
}
/* 类型 */
.icontree-types{
     background:url(../../../../static/resource_tree/tab/types.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-types{
    background:url(../../../../static/resource_tree/tab/types_active.png) no-repeat center;
    background-size: 18px;
}
/*场站 */
.icontree-depot{
     background:url(../../../../static/resource_tree/tab/depot.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-depot{
    background:url(../../../../static/resource_tree/tab/depot_active.png) no-repeat center;
    background-size: 18px;
}
/*重点 */
.icontree-emphasis{
     background:url(../../../../static/resource_tree/tab/emphasis.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-emphasis{
    background:url(../../../../static/resource_tree/tab/emphasis_active.png) no-repeat center;
    background-size: 18px;
}
/*区域 */
.icontree-area{
     background:url(../../../../static/resource_tree/tab/area.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-area{
    background:url(../../../../static/resource_tree/tab/area_active.png) no-repeat center;
    background-size: 18px;
}
/*事件*/
.icontree-events{
     background:url(../../../../static/resource_tree/tab/events.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-events{
    background:url(../../../../static/resource_tree/tab/events_active.png) no-repeat center;
    background-size: 18px;
}
/deep/ .el-icon-arrow-left:before,
/deep/ .el-icon-arrow-right:before {
    color: #D7E7FF;
}

/deep/ .el-tabs__active-bar{
    background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%);
}

.treefoot{
    width: 100%;
    height: 59px;
    background: url(../../../../static/main/screen/resource_bottom_bg.png) no-repeat top;
    background-size: 100% 60px;
    color:#D3DCF0;
    font-size: 12px;
}
.icon-clear{
    display: inline-block;
    width:14px;
    height: 14px;
    vertical-align: middle;
    background: url(../../../../static/common/reset.png) no-repeat center;
    background-size: 14px;
    margin-right:3px;
}
.treefoot /deep/ .el-button--text{
  color: #599AFF;
  font-size: 14px;
  padding: 0;
  height: 41px;
}
.treeSelectedNum{
  color:#599AFF;  
  font-size: 14px;
}
.icon-play{
    display: inline-block;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-play.png) no-repeat center;
        background-size: 22px
}
.icon-stopPlay{
    display: inline-block;
     width: 22px;
    height: 22px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-stopPlay.png) no-repeat center;
        background-size: 22px
}
.icon-stopPlay_bg{
     display: inline-block;
     width: 22px;
    height: 22px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-stopPlay1.png) no-repeat center;
        background-size: 22px
}

.el-tree /deep/ .el-tree-node.is-current.is-focusable > .el-tree-node__content{
    background: transparent;
    /* background: #5C98FF; */
    color: #fff;
}

/* 弹出框样式 */
.popover{
       width: 396px;
    height: 400px;
    position: absolute;
    top: 41px;
    left: 10px;
    display: block;
    z-index: 10;
    background: url(../../../../static/main/screen/resource_bg2.png) no-repeat top;
    background-size: 100% 400px;
    opacity: 0.9;
    color: #fff;
}



.treeOperate-l{
    width: 135px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    line-height: 41px;
    float: left;
}
.treeOperate-btn{
    width: 245px;
    vertical-align: middle;
    float: right;
}
.treeOperate-l,.treeOperate-btn{
    display: inline-block;
    height: 41px;
}
.icon-play+span,.icon-stopPlay+span,.icon-stopPlay_bg+span{
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
}
</style>