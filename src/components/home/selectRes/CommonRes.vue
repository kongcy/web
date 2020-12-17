<template>
	<div class="treeBox noSearchBox" style="text-align:center">
        <div style="margin: 5px 0 0"></div>
        <div class="treeWrap">
	        <el-tree
		        :props="props"
		        :data="treeData"
		        node-key="nodeId"
		        ref="SelectResCommonsStatus"
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
    name: 'CommonTree',
    components: {
    },
    props: ['subscribeType'],
    data () {
        return {
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            treeData: [],//整个树data
            expandedNodes: [],//默认张开的id集合
            isShowCheck:true,  //dj 版本5 字幕 组织单选
        };
    },
    mounted() {

    },
    methods: {
        // 常用资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (list.length == 0) return;
                if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
                    if (obj.operate === "init") {
                        this.addResourceStatus(obj.subscribeId, list);
                    } else if (obj.operate === "refresh") {
                        this.refreshResourceStatus(obj.subscribeId, list);
                    }
                }

                if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                    if (obj.operate === "init") {
                        this.initResourceStatus(obj.subscribeId, list);
                    }else if (obj.operate === "add") {
                        this.addResourceStatus(obj.subscribeId, list);
                    } else if (obj.operate === "refresh") {
                        this.refreshResourceStatus(obj.subscribeId, list);
                    } else if (obj.operate === "remove") {
                        this.removeResourceStatus(obj.subscribeId, list);
                    }
                }
            }
        },
        // operate: init
        initResourceStatus(subscribeId, list) {
            /*
            // 订阅资源状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.main_common_tree, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //会议发起
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //视频转发
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //会议-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //指挥-添加成员
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //计划录像
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //即时通讯 
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //截图管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //osd管理
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
            //广播通知
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            }
        },
        // operate: add
        addResourceStatus(subscribeId, list) {
            if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
                // 订阅资源状态
                if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //分组
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //会议发起
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //转发
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //会议添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //指挥添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //计划录像
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                //即时通讯
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                // 截图管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                // osd管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                // 广播通知
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResources) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByKey) {
                    this.treeData = Fun._initCommonTreeData(list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByStatus) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
            }
                
            if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                /*
                // 订阅资源状态
                if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
                }
                */ 
                //分组
                // 订阅用户状态
                if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //会议发起
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //视频转发
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //会议-添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //指挥-添加成员
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //计划录像
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //即时通讯
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //截图管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //osd管理
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
                //广播通知
                // 订阅用户状态
                else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResources) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据关键字订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByKey) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                // 根据资源状态订阅常用资源状态
                } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByStatus) {
                    Fun._appendCommonTreeData(this.$refs.SelectResCommonsStatus,list);
                }
            }
        },
        // operate: refresh
        refreshResourceStatus(subscribeId, list) {
            /*
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //会议发起
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //转发
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //会议-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //指挥-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //计划录像
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            // 即时通讯
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            // 截图管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            // osd管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            // 广播通知
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
        },
        // operate: remove
        removeResourceStatus(subscribeId, list) {
            /*
            // 订阅资源状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            }
            */ 
            //分组
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.group.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //会议发起
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.meeting.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //视频转发
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.transmit.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //会议-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.meetingAddMember.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //指挥-添加成员
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.commandAddMember.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //计划录像
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.planVideo.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //即时通讯
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.sendRequest.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //截图管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.screenShot.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //osd管理
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.osdMng.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
            //广播通知
            // 订阅用户状态
            else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.notification.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.SelectResCommonsStatus, list);
            }
        },
	//单击事件
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            
        },
        //勾选事件
        handleNodeCheck(data, checkeds){
            if(checkeds.checkedKeys.indexOf(data.nodeId) > -1) this.$refs.SelectResCommonsStatus.setCurrentKey(data.nodeId)
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
                let node = that.$refs.SelectResCommonsStatus.getNode(item);
                that.$refs.SelectResCommonsStatus.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
    },
}
</script>

<style scoped>
.treeBox{
    height: 100%;
}
.noSearchBox .treeWrap{
    height: calc(100% - 0px);
    overflow: auto;
}
</style>