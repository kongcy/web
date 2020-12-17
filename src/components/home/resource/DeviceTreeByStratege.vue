<template>
   <div class="treeBox" style="text-align:center">
        <!-- 视频监控搜索 -->
        <div class="divSearchBox TreeStratege text-center divDevices">
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
            <el-tabs v-model="activeName">
                 <el-tab-pane v-for="(item, index) in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%">
                      <span slot="label"><i class="tabtree-icon" :class="item.icon"></i> {{item.title}}</span>
                 </el-tab-pane>
            </el-tabs>
             <!-- 设备资源树筛选弹出框 -->
           <device-tree-popper ref="devicetreepopper"/>
        </div>
       
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
        <div class="treeWrap">
            <el-scrollbar class="hiddenXScroll" style="height:100%">
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
                    @check="handleNodeCheck"
                >
                </el-tree>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import Enum from '@/common/enum'
import Fun from '@/common/fun'
import DeviceTreePopper from "@/components/home/resource/DeviceTreePopper.vue";

export default {
    name: 'DeviceTreeByStratege',
    components: {
        DeviceTreePopper
    },
    data () {
        return {
            activeName:"department",
            editableTabs: [
                {
                    title: '',
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
        //点击tab按钮功能
        handleClick(tab, event){
            console.log(tab, event);
            var list=this.editableTabs.filter(item=>item.name==tab.name)
            this.$parent.$parent.$parent.searchValuChangeFun(list[0]);
        },
        //修改
        searchValuChangeFun(value){
        console.log(value)
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
        handleChangeSerachWrap(){
            this.searchChange = !this.searchChange;
            if( this.searchChange == false ){
                this.input_device = "";
                this.statusValue = "all";
                this.treeType = "all";
                let self = this;
                let organId = "";
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.group.subscribeOrganizationDevice, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
            }
        },
        //组织回调
        setReceiveInformAddDepartmentCallback(obj) {
            if (obj && obj.rows) {
                //设备组织
                if (obj.subscribeId == Enum.enumSubscribeType.group.subscribeOrganizationDevice) {
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
            if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
                // 根据关键字订阅用户状态
            }else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            } 
        },
        //add
        addResourceStatus(subscribeId, list) {
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                Fun._appendDeviceTreeData(this.$refs.main_device_tree, list);
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.main_device_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
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
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
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
                this.apiSDK.subscribeDeviceStatus(node.data.id, Enum.enumSubscribeType.group.subscribeDevicesStatus);
                resolve(node.data.children);
            } else if (node.data.children) {
                resolve(node.data.children);
            }
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            //console.log(data)
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
               
            }else {
            }
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();

            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        //当复选框被点击的时候触发
        handleNodeCheck(data,node){
            console.log("当复选框被点击的时候触发---")
            this.selectedNum=node.checkedKeys.length;
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
                this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.group.subscribeOrganizationDevice, subjectId, function(obj) {
                    self.setReceiveInformAddDepartmentCallback(obj);
                });
            }else{
                this.clearTree();
                if(this.treeType=="all"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.group.subscribeUserStatus,"device");
                }
                if(this.treeType=="status"){
                    this.apiSDK.cancelSubscribeResourceStatus(Enum.enumSubscribeType.group.subscribeUsersStatusByStatus,"devicequery");
                }
                this.apiSDK.subscribeDeviceQuery("text", this.input_device, "", 0, Enum.enumSubscribeType.group.subscribeDevicesStatusByKey, organId)
                this.treeType="text";                
            }
        },
        //点击tab按钮功能
        handleClick(tab, event){
            var list=this.editableTabs.filter(item=>item.name==tab.name)
            this.$refs.devicetreepopper.showpop(list[0]);
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
    },
}
</script>

<style scoped>

.treeBox{
    height: 100%;
    background: url(../../../../static/main/screen/resource_bg.png) no-repeat top;
    margin-top: -2px;
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
    height: calc(100% - 158px);
    padding: 0 5px;
    box-sizing: border-box;
}
.divSearchBox {
  width: 100%;
  height: 40px;
  line-height: 40px;
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
    padding: 9px 0;
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
    width:12px;
    height: 12px;
    vertical-align: middle;
    background: url(../../../../static/common/reset.png) no-repeat center;
    background-size: 12px;
}
.treefoot /deep/ .el-button--text{
  color:#D3DCF0;
  font-size: 12px;
}
.treeSelectedNum{
  color:#1bd1eb;  
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

.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    height: calc(100% + 17px);
}
</style>