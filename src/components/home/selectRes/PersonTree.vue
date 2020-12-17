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
                    <el-dropdown placement="bottom" @command="handleSelectStatusChange">
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
                    <el-dropdown placement="bottom" @command="handleCommandChange">
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
                :props="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5?personProps5:personProps6"
                :data="treeData"
                :load="loadNodeSelectUser"
                node-key="nodeId"
                ref="SelectResUsersStatus"
                lazy
                :show-checkbox = isShowCheck
                :default-expanded-keys="expandedNodes"
                :render-content="renderContent"
                @node-click="handleNodeClick"
                @current-change="currentChange"
                @check="handleNodeCheck"
            >
            </el-tree>
        </div>
    </div>
</template>

<script>
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'PersonTree',
    components: {
    },
    props: ['subscribeType'],
    data () {
        return {
            personProps6: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf',
                disabled: function(data, node){
                    //自己不可选
                    if(data.id == xtxk.cache.get('USER').userId) return true;
                    else return false;
                }
            },
            personProps5: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf',
            },
            treeData: [],//整个树data
            expandedNodes: [],//默认张开的id集合
            treeType:"all",
            input_person:'',
            statusValue:'all',
            levelValue: '',

            searchChange:false,
            relationshipValue:0,
            isShowCheck:true, //dj 版本5 字幕 组织单选
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
        handleChangeSerachWrap(){
            this.searchChange = !this.searchChange;
            if( this.searchChange == false ){
                this.input_person = "";
                this.statusValue = "all";
                this.treeType = "all";
                let self = this;
                let organId = "";
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, this.$props.subscribeType.subscribeOrganizationUser, subjectId, function(obj) {
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
            this.apiSDK.getOrganizationUser(organId, this.$props.subscribeType.subscribeOrganizationUser, subjectId, function(obj) {
                self.setReceiveInformAddDepartmentCallback(obj);
            });
        },
        // 重置筛选
        resetSearch(){
            this.input_person = '';
            this.statusValue = 'all';
            this.treeType = 'all';
            this.handleCommandChange(2);
            this.levelValue = '目录层级';
        },
        //组织回调
        setReceiveInformAddDepartmentCallback(obj) {
            if (obj && obj.rows) {
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                    //人员组织
                    //主页
                    if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //分组
                    else if (obj.subscribeId == Enum.enumSubscribeType.group.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议发起
                    else if (obj.subscribeId == Enum.enumSubscribeType.meeting.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //视频转发
                    else if (obj.subscribeId == Enum.enumSubscribeType.transmit.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //指挥-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //计划录像
                    else if (obj.subscribeId == Enum.enumSubscribeType.planVideo.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 即时通讯
                    else if (obj.subscribeId == Enum.enumSubscribeType.sendRequest.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 截图管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.screenShot.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // osd管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.osdMng.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 广播通知
                    else if (obj.subscribeId == Enum.enumSubscribeType.notification.subscribeOrganizationUser) {
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                }
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                    /*
                     //人员组织
                    if (obj.subscribeId == Enum.enumSubscribeType.main.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    */ 
                    //分组
                    if (obj.subscribeId == Enum.enumSubscribeType.group.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议发起
                    else if (obj.subscribeId == Enum.enumSubscribeType.meeting.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //视频转发
                    else if (obj.subscribeId == Enum.enumSubscribeType.transmit.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //会议-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //指挥-添加成员
                    else if (obj.subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    //计划录像
                    else if (obj.subscribeId == Enum.enumSubscribeType.planVideo.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 即时通讯
                    else if (obj.subscribeId == Enum.enumSubscribeType.sendRequest.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 截图管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.screenShot.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // osd管理
                    else if (obj.subscribeId == Enum.enumSubscribeType.osdMng.subscribeOrganizationUser) {
                        this.clearTree();
                        this.treeData = Fun._initDepartmentTreeData(obj.rows);
                        //默认展开一级节点
                        this.treeData.forEach(item => {
                            this.expandedNodes.push(item.nodeId);
                        });
                    }
                    // 广播通知
                    else if (obj.subscribeId == Enum.enumSubscribeType.notification.subscribeOrganizationUser) {
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
                    } else if (obj.operate === "add") {
                        this.addResourceStatus(obj.subscribeId, list);
                    }
                }

                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
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
            }
        },
        //init
        initResourceStatus(subscribeId, list) {
            /*
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
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //会议发起
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //视频转发
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //会议-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //指挥-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //计划录像
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            //即时通讯
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            // 截图管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            // osd管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
            // 广播通知
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatus) {
                Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByKey) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByStatus) {
                this.clearTree();
                this.treeData = Fun._initPersonTreeData(list);
            }
        },
        //add
        addResourceStatus(subscribeId, list) {
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                //主页
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //分组
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //会议发起
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //转发
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //会议添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //指挥添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                //计划录像
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                // 即时通讯
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                // 截图管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                // osd管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
                // 广播通知
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByKey) {
                    this.treeData = Fun._initPersonTreeData(list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByStatus) {
                    this.treeData = Fun._initPersonTreeData(list);
                }
            }

            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                /*
                // 主页
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
                */ 
                //分组
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                //会议发起
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                //视频转发
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                //会议-添加成员
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                //指挥-添加成员
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                //计划录像
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                // 即时通讯
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                // 截图管理
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                // osd管理
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
                // 广播通知
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据关键字订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByKey) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                // 根据资源状态订阅用户状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByStatus) {
                    Fun._appendPersonTreeData(this.$refs.SelectResUsersStatus, list);
                }
            }
        },
        //remove
        removeResourceStatus(subscribeId, list) {
            /*
            // 主页
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
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //会议发起
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //视频转发
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //会议-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //指挥-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //计划录像
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 即时通讯
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 截图管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // osd管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 广播通知
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByKey) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByStatus) {
                Fun._removePersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
        },
        //refresh
        refreshResourceStatus(subscribeId, list) {
            /*
            //主页
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //会议发起
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //转发
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //会议-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            //指挥-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 计划录像
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 即时通讯
            else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 截图管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // osd管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
            // 广播通知
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByKey) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeUsersStatusByStatus) {
                Fun._refreshPersonTreeData(this.$refs.SelectResUsersStatus, list);
            }
        },
        //加载节点
        loadNodeSelectUser(node, resolve){
            const self = this;
            if(node.data.nodeStatus == 'department'){
                //加载人员
                this.apiSDK.subscribeUserStatus(node.data.id, this.$props.subscribeType.subscribeUsersStatus);
                resolve(node.data.children);
            }
        },
        //单击事件
        handleNodeClick(data, node, tree){
            if(data.nodeStatus != 'department'&&data.id!== xtxk.cache.get('USER').userId){
                node.checked = !node.checked;
            }
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            //console.log(node.data.nodeStatus)
        },
        //勾选事件
        handleNodeCheck(data, checkeds){
            if(checkeds.checkedKeys.indexOf(data.nodeId) > -1) this.$refs.SelectResUsersStatus.setCurrentKey(data.nodeId)
        },
        // 当前选中节点变化时触发的事件
        currentChange(data, node) {
            this.$emit('currentChange', {data: data, node: node});
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        //清空树
        clearTree(){
            var that = this;
            var tempData = [];
            Object.assign(tempData, this.treeData);
            //清空node
            tempData.forEach(item => {
                let node = that.$refs.SelectResUsersStatus.getNode(item);
                if(node)  //dj 0622  id重复node==underfind 会在这里报错 导致树没有清空  树结构显示错误
                that.$refs.SelectResUsersStatus.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        // 搜索按钮
        handleSearchByKey(){
            let that = this;
            let organId = "";
            if( this.treeType=="all" && !this.input_person ){
                this.showRemind('提示','请输入关键字');
                return;
            }
            if( this.treeType!="all" && !this.input_person ){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, this.$props.subscribeType.subscribeOrganizationUser, subjectId, function(obj) {
                    that.setReceiveInformAddDepartmentCallback(obj);
                });
                return;
            }
            this.clearTree();
            // console.log('this.treeType='+this.treeType);
            if(this.treeType=="all"){
                this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatus,"person");
            }
            if(this.treeType=="status"){
                this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByStatus,"personquery");
            }
            this.apiSDK.subscribeUserQuery("text", this.input_person, "", 0, this.$props.subscribeType.subscribeUsersStatusByKey, organId);
            this.treeType="text";
        },
        // 资源状态
        handleSelectStatusChange(val){
            if(this.statusValue == val) return;
            this.statusValue = val;

            let that = this;
            let organId = "";
            // console.log('this.treeType='+this.treeType);
            if(val == this.treeType) return;
            if(val == "all"){
                let subjectId = this.relationshipValue;
                this.apiSDK.getOrganizationUser(organId, this.$props.subscribeType.subscribeOrganizationUser, subjectId, function(obj) {
                    that.setReceiveInformAddDepartmentCallback(obj);
                });
                //取消状态订阅
                if(this.treeType == "text"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByKey,"personquery");
                }
                if(this.treeType == "status"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByStatus,"personquery");
                }
                this.treeType = "all"
            }else{
                this.clearTree();
                if(this.treeType == "all"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatus,"person");
                }
                if(this.treeType == "text"){
                    this.apiSDK.cancelSubscribeResourceStatus(this.$props.subscribeType.subscribeUsersStatusByKey,"personquery");
                }
                this.apiSDK.subscribeUserQuery("online", "", val, 0, this.$props.subscribeType.subscribeUsersStatusByStatus, organId)
                this.treeType = "status";
            }
        },
        // 资源层级
        handleCommandChange(command){
            // console.log('click on item ' + command);
            if(this.levelValue == command) return;
            if(this.treeType=="all"){
                this.levelValue = command;

                this.expandedNodes = [];
                let arrayData = Fun.transformTreeToArray(this.treeData);
                arrayData.forEach(item => {
                    let node = this.$refs.SelectResUsersStatus.getNode(item);
                    if(node){
                        if(node.level < command){
                            if(node.data.nodeStatus == 'department'){
                                if(node.data.children.length == 0){
                                    //加载人员
                                    this.apiSDK.subscribeUserStatus(node.data.id, this.$props.subscribeType.subscribeUsersStatus);
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
        showRemind(title,message){
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
    width:100%;
    height: calc(100% - 40px);
    overflow: auto;
}
</style>
