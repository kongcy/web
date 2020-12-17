<template>
   <div id="deviceTree3" class="treeBox" style="text-align:center">
       <!-- <el-scrollbar style="height:325px;width:300px">
           <div style="width:500px;height:370px;line-height:300px;text-algin:center;"></div>
        </el-scrollbar>  -->

        <!-- 视频监控搜索 -->
        <!-- <div  class="divSearchBox text-center divDevices">
            <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tabs v-model="activeName" >
                 <el-tab-pane v-for="(item, index) in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%">
                      <span slot="label"><i class="tabtree-icon" :class="item.icon"></i> {{item.title}}</span>
                 </el-tab-pane>
            </el-tabs>
             设备资源树筛选弹出框
           <device-tree-popper ref="devicetreepopper"/>
        </div> -->
       
        <!-- 筛选 -->
        <div class="serachWrap">
            <el-row :gutter="5" style="margin:0px">
                <!-- <el-col :span="7" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && !searchChange">
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
                </el-col> -->
                <!-- <el-col :span="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6?10:20" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 || (apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && searchChange)"> -->
                    <el-col :span="24">
                    <div class="search" >
                        <el-input v-model="input_device" placeholder="请输入关键字" @keyup.enter.native="handleSearchByKey">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                        </el-input>
                    </div>
                </el-col>
                <!-- <el-col :span="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6?6:5" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 || (apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && !searchChange)">
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
                </el-col> -->
            </el-row>
        </div>
        <!-- 视频监控树 -->
        <el-scrollbar class="treeWrap hiddenXScroll">
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
                    @check="handleNodeCheck"
                    @node-drag-start="nodeDragStart"
                    draggable
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                >
                </el-tree>
        </el-scrollbar>
        <div class="treefoot">
            <!-- <div class="treeSelectedNum">已选中{{selectedNum}}个视频资源</div> -->
            <div class="treeOperate">
                <div class="treeOperate-l">
                    已选中<span class="treeSelectedNum">{{selectedNum}}</span>个视频资源
                    <el-button type="text"  @click="clearAllNum"><i class="icon-clear"></i>清空</el-button>
                </div>
                <div class="treeOperate-btn">
                    <el-button type="primary" size="small" @click="startPlays"><i class="icon-play"></i><span>点播</span></el-button>
                    <el-button v-if="!hasPlayD" type="danger" size="small" @click="stopAll" plain class="nobg"><i class="icon-stopPlay"></i><span>停止</span></el-button>
                    <el-button v-else type="danger" size="small" @click="stopAll"><i class="icon-stopPlay_bg"></i><span>停止</span></el-button>
                </div>
            </div>
        </div>
       
        <!-- 右键菜单 -->
        <tree-right-menu ref="rightMenu" v-on="$listeners"/>
        <virtual-device @closeVirtaul="closeVirtualContent" :virtualId="virtualTreeId" v-show="showVirtual" ref="virtualDevice"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import VirtualDevice from '@/components/home/resource/virtualDevice.vue'
import DeviceTreePopper from "@/components/home/resource/DeviceTreePopper.vue";
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'DeviceTree3',
    components: {
        TreeRightMenu,
        VirtualDevice,
        DeviceTreePopper
    },
    data () {
        return {
            activeName:"department",
            editableTabs: [
                {   
                    //先屏蔽调部门
                    title: '部门',
                    icon:"icontree-department",
                    name:"department",
                    isIndeterminate:false,
                    checkAll:false,
                    content:[
                        {text:'克拉',id:'Dkl'},
                        {text:'迪那',id:'Ddn'},
                        {text:'英买',id:'Dym'},
                        {text:'塔中',id:'Dtz'},
                        {text:'哈得',id:'Dhd'},
                        {text:'东河',id:'Ddh'},
                        {text:'轮南',id:'Dln'},
                        {text:'博大',id:'Dbd'},
                        {text:'泽普',id:'Dzp'},
                        {text:'运销',id:'Dyx'},
                        {text:'塔石化',id:'Ddsh'},
                        {text:'南疆利民',id:'Dnjlm'},
                        {text:'基地',id:'Djd'},
                    ]
                },
                // {
                //     title: '类型',
                //     icon:"icontree-types",
                //     name:"types",
                //     isIndeterminate:false,
                //     checkAll:false,
                //     content:[
                //         {text:'生产',id:'Tsc'},
                //         {text:'安防',id:'Taf'},
                //         {text:'环保',id:'Thb'},
                //         {text:'基地',id:'Tjd'},
                //     ]
                // },
                // {
                //     title: '场站',
                //     icon:"icontree-depot",
                //     name:"depot",
                //     isIndeterminate:false,
                //     checkAll:false,
                //     content:[
                //         {text:'克拉',id:'Ckl'},
                //         {text:'迪那',id:'Cdn'},
                //         {text:'英买',id:'Cym'},
                //         {text:'塔中',id:'Ctz'},
                //         {text:'哈得',id:'Chd'}
                //     ]
                // },
                // {
                //     title: '重点',
                //     icon:"icontree-emphasis",
                //     name:"emphasis",
                //     isIndeterminate:false,
                //     checkAll:false,
                //     content:[
                //     {text:'重点生产井',id:'Iscj'},
                //     {text:'事故井',id:'Isgj'}
                //     ]
            
                // },
                //   {
                //     title: '区域',
                //     icon:"icontree-area",
                //     name:"area",
                //     isIndeterminate:false,
                //     checkAll:false,
                //     content:[
                //         {text:'克拉',id:'Qkl'},
                //         {text:'迪那',id:'Qdn'},
                //         {text:'英买',id:'Qym'},
                //         {text:'塔中',id:'Qtz'},
                //         {text:'哈得',id:'Qhd'},
                //         {text:'东河',id:'Qdh'},
                //         {text:'轮南',id:'Qln'},
                //         {text:'博大',id:'Qbd'},
                //         {text:'泽普',id:'Qzp'},
                //     ]
                // },
                // {
                //     title: '事件',
                //     icon:"icontree-events",
                //     name:"events",
                //     isIndeterminate:false,
                //     checkAll:false,
                //     content:[
                //         {text:'区域入侵',id:'Eqyrq'},
                //         {text:'安全帽预警',id:'Eaqmyj'}
                //     ]
            
                // }
            ],
            tablist:[{
                tabname:"",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'克拉',id:'Dkl'},
                {text:'迪那',id:'Ddn'},
                {text:'英买',id:'Dym'},
                {text:'塔中',id:'Dtz'},
                {text:'哈得',id:'Dhd'},
                {text:'东河',id:'Ddh'},
                {text:'轮南',id:'Dln'},
                {text:'博大',id:'Dbd'},
                {text:'泽普',id:'Dzp'},
                {text:'运销',id:'Dyx'},
                {text:'塔石化',id:'Ddsh'},
                {text:'南疆利民',id:'Dnjlm'},
                {text:'基地',id:'Djd'},
                ]
            },{
                tabname:"类型",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'生产',id:'Tsc'},
                {text:'安防',id:'Taf'},
                {text:'环保',id:'Thb'},
                {text:'基地',id:'Tjd'},
                ]
            },{
                tabname:"区域",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'克拉',id:'Qkl'},
                {text:'迪那',id:'Qdn'},
                {text:'英买',id:'Qym'},
                {text:'塔中',id:'Qtz'},
                {text:'哈得',id:'Qhd'},
                {text:'东河',id:'Qdh'},
                {text:'轮南',id:'Qln'},
                {text:'博大',id:'Qbd'},
                {text:'泽普',id:'Qzp'},
                ]
            },{
                tabname:"场站",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'克拉',id:'Ckl'},
                {text:'迪那',id:'Cdn'},
                {text:'英买',id:'Cym'},
                {text:'塔中',id:'Ctz'},
                {text:'哈得',id:'Chd'}
                ]
            },{
                tabname:"事件",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'区域入侵',id:'Eqyrq'},
                {text:'安全帽预警',id:'Eaqmyj'}
                ]
            },{
                tabname:"重点",
                isIndeterminate:false,
                checkAll:false,
                content:[
                {text:'重点生产井',id:'Iscj'},
                {text:'事故井',id:'Isgj'}
                ]
            }],
      
            hasPlayD:false,
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

            selectedNum:0
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
        //点击tab按钮功能
        handleClick(tab, event){
            var list=this.editableTabs.filter(item=>item.name==tab.name)
            this.$refs.devicetreepopper.showpop(list[0]);
            // var list=this.editableTabs.filter(item=>item.name==tab.name)
            // this.$parent.$parent.$parent.searchValuChangeFun(list[0]);
        },
        //修改
        searchValuChangeFun(value){
        this.searchV=value.checkedtab;
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
            nodes = this.$refs.main_device_tree.getCheckedNodes();
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
                var content = '请选择在线空闲的资源发起点播';
                this.$message({message: content, type: 'warning'})
                return;
            }
            // let targetNodes=targetNodesP.concat(targetNodesD);

            // let selectNum=targetNodesP.concat(targetNodesD).length;
            // let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')).length; 
            // if(selectNum+screenArr>9){
            //      var content = '最大只支持9分屏,超过最大分屏';
            //      this.$message({message: content, type: 'warning'})
            //       return;
            // }
            Fun.startPlayRess(this, targetNodesP.concat(targetNodesD));
        },
        //全部停止
        stopAll(){
            this.apiSDK.stopAll();  
            this.$listeners.StopAllHideHolder();
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
            console.log(obj)
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
               node.checked = !node.checked;
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
            console.log("当复选框被点击的时候触发---")
            // wxx 2020.11.26
            let n=0;
            let resInfos = [];
            let nvrDevice = [];
            node.checkedNodes.forEach(item => {
                // nvr多通道批量点播
                if (item.resourceType == 'channel') {
                    let obj = nvrDevice.find(it => it.nvrDeviceId === item.pid);
                    if (obj) {
                        let channel = obj.channels.find(i => i === item.id)
                        if (!channel) {
                            obj.channels.push(item.id);
                            ++n;
                        }
                    } else {
                        nvrDevice.push({nvrDeviceId: item.pid, channels: [item.id]});
                        ++n;
                    }
                   
                } else if (item.children && item.children.length) {
                    n+=item.children.length;
                    let channels = item.children && item.children.map(item => item.id)
                    nvrDevice.push({nvrDeviceId: item.id, channels: channels})
                } else {
                    if(item.nodeStatus!="department"){
                        ++n;
                    }
                }
            })
            this.selectedNum=n;
            this.$parent.isTreeItemShow=false;
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            //console.log(data.nodeStatus, data.alarm, '------------')
            let icon = data.nodeStatus
            let alarm = data.alarm ? "alarm" : ''
            //wxx 2020.11.25
            let count='('+data.onLineCount+'/'+data.totalCount+')'
            if(data.nodeStatus=='department'||data.nodeStatus=='company'){
                return (<span class={"custom-tree-node " + icon + " " + alarm} >
                    <span class="node-icon"></span>
                    <span>{node.label}{count}</span>
                </span>);
            }else{
                  return (<span class={"custom-tree-node " + icon + " " + alarm} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
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
            this.$refs.main_device_tree.setCheckedKeys([]);
             this.selectedNum=0;
        }
   },
}
</script>

<style>
#deviceTree3  .el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 20px);
}
</style>

<style scoped>
.treeBox{
    height: 100%;
    /* background: url(../../../../static/main/screen/resource_bg.png) no-repeat top; */
    /* margin-top: -2px;
    padding-top:2px; */
    background-size: 100% 100%;
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
    width:414px;
    height: calc(100% - 124px);
    /* overflow: hidden; */
    padding: 0 0 0 16px;
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
    padding: 8px 17px;
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
    height: 58px;
    background: url(../../../../static/main/screen/resource_bottom_bg.png) no-repeat top;
    background-size: 100% 58px;
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
  margin-left:14px;
}
.treeSelectedNum{
  color:#599AFF;  
  font-size: 14px;
}
.icon-play{
    display: inline-block;
     width: 20px;
    height: 13px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-play.png) no-repeat center;
        background-size: 21px
}
.icon-stopPlay{
    display: inline-block;
    width: 20px;
    height: 13px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-stopPlay.png) no-repeat center;
        background-size: 21px
}
.icon-stopPlay_bg{
     display: inline-block;
    width: 20px;
    height: 13px;
    vertical-align: middle;
    background: url(../../../../static/main/res/icon-stopPlay1.png) no-repeat center;
        background-size: 21px
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
    width: 182px;
    text-align: left;
}
.treeOperate-btn{
    width: 191px;
}
.treeOperate-l,.treeOperate-btn{
    display: inline-block;
    height: 41px;
    line-height: 41px;
}
.icon-play+span,.icon-stopPlay+span,.icon-stopPlay_bg+span{
    display: inline-block;
    line-height: 22px;
    height: 22px;
    vertical-align: middle;
    margin-left: 5px;
}
</style>