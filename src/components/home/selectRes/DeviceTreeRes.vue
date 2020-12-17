<template>
   <div class="treeResBox" style="text-align:center">
        <!-- 视频监控搜索 -->
        <div  class="divSearchBox text-center divDevices">
            <!-- <el-tabs v-model="activeName"   @tab-click="handleClick"> -->
            <el-tabs v-model="activeName" > 
                 <el-tab-pane v-for="item in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%">
                      <span slot="label"><i class="tabtree-icon" :class="item.icon"></i> {{item.title}}</span>
                 </el-tab-pane>
            </el-tabs>
             <!-- 设备资源树筛选弹出框 -->
           <device-tree-popper ref="devicetreepopper"/>
        </div>
        
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
                :load="loadNodeSelectDevice"
                node-key="nodeId"
                ref="SelectResDevicesStatus"
                lazy
                :show-checkbox = isShowCheck
                :default-expanded-keys="expandedNodes"
                :render-content="renderContent"
                @node-click="handleNodeClick"
                @current-change="currentChange"
                @check="handleNodeCheck"
                >
            </el-tree>
        </el-scrollbar>
       
        <!-- 右键菜单 -->
        <!-- <tree-right-menu ref="rightMenu"/> -->
       
    </div>
</template>

<script>
import Enum from '@/common/enum'
import Fun from '@/common/fun'
import DeviceTreePopper from "@/components/home/resource/DeviceTreePopper.vue";
export default {
    name: 'DeviceTreeRes',
    components: {
        DeviceTreePopper
    },
    props: ['subscribeType'],
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
            treeType:"all",
            input_device:'',
            statusValue:'all',
            levelValue: '',

            searchChange:false,
            relationshipValue:0,
            isShowCheck:true,  //dj 版本5 字幕 组织单选
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
    mounted() {
        
    },
 
    methods: {
        //点击tab按钮功能
        handleClick(tab, event){
            console.log(tab, event);
            var list=this.editableTabs.filter(item=>item.name==tab.name)
            // this.$parent.$parent.$parent.searchValuChangeFun(list[0]);
            this.$refs.devicetreepopper.showpop(list[0]);
        },
        //修改
        searchValuChangeFun(value){
        console.log(value)
        this.searchV=value.checkedtab;
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
            this.apiSDK.getOrganizationDevice(organId, this.$props.subscribeType.subscribeOrganizationDevice, subjectId, function(obj) {
                self.setReceiveInformAddDepartmentCallback(obj);
            });
        },
        //组织回调
        setReceiveInformAddDepartmentCallback(obj) {
            console.log("123")
            if (obj && obj.rows) {
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                    //设备组织
                    if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //分组
                    else if (obj.subscribeId == Enum.enumSubscribeType.group.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议发起
                    else if (obj.subscribeId == Enum.enumSubscribeType.meeting.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //视频转发
                    else if (obj.subscribeId == Enum.enumSubscribeType.transmit.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //指挥-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //计划录像
                    else if (obj.subscribeId == Enum.enumSubscribeType.planVideo.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //即时通讯
                    else if (obj.subscribeId == Enum.enumSubscribeType.sendRequest.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 截图管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.screenShot.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // osd管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.osdMng.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 广播通知
                    else if (obj.subscribeId == Enum.enumSubscribeType.notification.subscribeOrganizationDevice) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                }

                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                    /*
                    //设备组织
                    if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    */ 
                    // 分组
                    if (obj.subscribeId == Enum.enumSubscribeType.group.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议发起
                    else if (obj.subscribeId == Enum.enumSubscribeType.meeting.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //视频转发
                    else if (obj.subscribeId == Enum.enumSubscribeType.transmit.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //指挥-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //计划录像
                    else if (obj.subscribeId == Enum.enumSubscribeType.planVideo.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //即时通讯
                    else if (obj.subscribeId == Enum.enumSubscribeType.sendRequest.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //截图管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.screenShot.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //osd管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.osdMng.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //广播通知
                    else if (obj.subscribeId == Enum.enumSubscribeType.notification.subscribeOrganizationDevice) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                }
            }
        },
        //资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (list.length == 0) return;
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                    if (obj.operate === "init") {
                        this.addResourceStatus(obj.subscribeId, list);
                    } else if (obj.operate === "refresh") {
                        this.refreshResourceStatus(obj.subscribeId, list);
                    }else if (obj.operate === "add") {
                        this.addResourceStatus(obj.subscribeId, list);
                    }
                 }
                
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
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
            }
          
        },
        //init
        initResourceStatus(subscribeId, list) {
            /*
            //主页
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
            */ 
            // 分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 会议发起
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 视频转发
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 会议-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 指挥-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 计划录像
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 即时通讯
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 截图管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // osd管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
            // 广播通知
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatus) {
                Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initDeviceTreeData(list);
            }
        },
        //add
        addResourceStatus(subscribeId, list) {
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //分组
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //会议发起
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //转发
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //会议添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //指挥添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //计划录像
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                //即时通讯
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                // 截图管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                // osd管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
                // 广播通知
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByKey) {
                    this.treeData = Fun._initDeviceTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByStatus) {
                    this.treeData = Fun._initDeviceTreeData(list);
                }
            }

            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                /*
                // 主页
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
                */ 
                // 分组
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 会议发起
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 视频转发
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 会议-添加成员
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 指挥-添加成员
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 计划录像
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 即时通讯
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 截图管理
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // osd管理
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
                // 广播通知
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByKey) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByStatus) {
                    Fun._appendDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
                }
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            /*
            // 主页
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
            */ 
            // 分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 会议发起
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 视频转发
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 会议-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 指挥-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 计划录像
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 即时通讯
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 截图管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // osd管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 广播通知
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByKey) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByStatus) {
                Fun._removeDeviceTreeData(this.$refs.SelectResUsersStatus, list);
            }
        },
        //refresh
        refreshResourceStatus(subscribeId, list) {
            /*
            // 主页
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //会议发起
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //转发
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //会议-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //指挥-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //计划录像
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            //即时通讯
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            // 截图管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            // osd管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
            // 广播通知
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByKey) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeDevicesStatusByStatus) {
                Fun._refreshDeviceTreeData(this.$refs.SelectResDevicesStatus, list);
            }
        },
        //加载节点
        loadNodeSelectDevice(node, resolve){
            if(node.data.nodeStatus == 'department'){
                //加载设备
                this.apiSDK.subscribeDeviceStatus(node.data.id, this.$props.subscribeType.subscribeDevicesStatus);
                resolve(node.data.children);
            } else if (node.data.children) {
                resolve(node.data.children);
            }
        },
         //单击事件
        handleNodeClick(data, node, tree){
            //console.log(node.data)
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        }, 
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            // console.log(node.data.nodeStatus)
        },
        //当复选框被点击的时候触发
        handleNodeCheck(data,node){
            console.log("当复选框被点击的时候触发---")
             if(checkeds.checkedKeys.indexOf(data.nodeId) > -1) this.$refs.SelectResDevicesStatus.setCurrentKey(data.nodeId)
        },
        // 当前选中节点变化时触发的事件
        currentChange(data, node) {
            this.$emit('currentChange', {data: data, node: node});
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            //console.log(data.nodeStatus, data.alarm, '------------')
             return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        //关键字搜索
        handleSearchByKey(){
            let that = this;
            let organId = "";
            if( this.treeType=="all" && !this.input_device ){
                this.showRemind('提示','请输入关键字');
                return;
            }
            if( this.treeType!="all" && !this.input_device ){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationDevice(organId, this.$props.subscribeType.subscribeOrganizationDevice, subjectId, function(obj) {
                    that.setReceiveInformAddDepartmentCallback(obj);
                });
                return;
            }
            this.clearTree();
            // console.log('this.treeType='+this.treeType);
            if(this.treeType=="all"){
                this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUserStatus,"device");
            }
            if(this.treeType=="status"){
                this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByStatus,"devicequery");
            }
            this.apiSDK.subscribeDeviceQuery("text", this.input_device, "", 0, this.$props.subscribeType.subscribeDevicesStatusByKey, organId)
            this.treeType="text";
        },
        //状态搜索
        handleSelectStatusChange(val){
           if(this.statusValue == val) return;
            this.statusValue = val;
            
            let that = this;
            let organId = "";
            // console.log('this.treeType='+this.treeType);
            if(val == this.treeType) return;
            if(val == "all"){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationDevice(organId, this.$props.subscribeType.subscribeOrganizationDevice, subjectId, function(obj) {
                    that.setReceiveInformAddDepartmentCallback(obj);
                });
                //取消状态订阅
                if(this.treeType == "text"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByKey,"devicequery");
                }
                if(this.treeType == "status"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByStatus,"devicequery");
                }
                this.treeType = "all"
            }else{
                this.clearTree();
                if(this.treeType == "all"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUserStatus,"device");
                }
                if(this.treeType == "text"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByKey,"devicequery");
                }
                this.apiSDK.subscribeDeviceQuery("online", "", val, 0, this.$props.subscribeType.subscribeDevicesStatusByStatus, organId)
                this.treeType = "status";
            }
        },
        //目录搜索
        handleDirChange(val){
             // console.log('click on item ' + command);
            if(this.levelValue == command) return;
            if(this.treeType=="all"){
                this.levelValue = command;

                this.expandedNodes = [];
                let arrayData = Fun.transformTreeToArray(this.treeData);
                arrayData.forEach(item => {
                    let node = this.$refs.SelectResDevicesStatus.getNode(item);
                    if(node){
                        if(node.level < command){
                            if(node.data.nodeStatus == 'department'){
                                if(node.data.children.length == 0){
                                    //加载设备
                                    this.apiSDK.subscribeDeviceStatus(node.data.id, this.$props.subscribeType.subscribeDevicesStatus);
                                    node.expanded = true
                                }else{
                                    this.expandedNodes.push(node.data.nodeId);
                                }
                            }
                        }else{
                            node.expanded = false;
                        }
                    }
                });
            }else{
                this.showRemind("提示","请切换至全部");
            }
        },
        //清空树
        clearTree(){
            var that = this;
            var tempData = [];
            Object.assign(tempData, this.treeData);
            //清空node
            tempData.forEach(item => {
                let node = that.$refs.SelectResDevicesStatus.getNode(item);
                that.$refs.SelectResDevicesStatus.remove(node);
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
    },
}
</script>

<style scoped>
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 17px);
}
.treeResBox{
    height: 538px;
    background: url(../../../../static/main/screen/resource_bg4.png) no-repeat top;
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
    width:100%;
    height: calc(100% - 102px);
    box-sizing: border-box;
    padding:0 0 0 16px;
}
.divSearchBox {
  width: 100%;
  height: 40px;
  /* line-height: 40px; */
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


/* ui tab样式11.16 */
.treeResBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header{
    background: transparent!important;
}
.treeResBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item{
  padding: 0 12px;
  color:#B7C1D0
}
.treeResBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item::after{
  content:'';
  margin: 0;
}
.treeResBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  font-weight: bold;
  color:#fff;
}
.setting .custom-dialog .treeResBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__active-bar{
  min-width:46px;
  height: 3px!important;
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
</style>