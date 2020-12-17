<template>
    <div class="conference" id="conferencePanel">
        <p class="title" style="text-align:left;">【会议】{{conferenceName}}</p>
        <div class="content">
            <div class="custom-tree-node" style="justify-content: flex-start;padding: 5px 10px 5px 20px;">
                <span class="node-icon chairman-mini"></span>
                <span>{{chairmanInfo.name}}</span>【主席】
                <span :class="chairmanInfo.microphoneAbility ? 'close-microphone' : 'open-microphone'"></span>
                <span :class="chairmanInfo.audioAbility ? 'close-audio' : 'open-audio'"></span>
                <span :class="chairmanInfo.videoAbility ? 'close-video' : 'open-video'"></span>
                <span :class="chairmanInfo.isJoinWhiteBoard == 'true' ? 'whiteboard' : 'set-hide'"></span>
                <!-- <span @click="(event) => {showMenu(chairmanInfo, chairmanInfo, event)}" class="set" v-if="isChairman"></span> -->
            </div>
            <el-tree
                ref="source_tree"
                :data="treeData"
                :props="defaultProps"
                :style="'height:'+ treeHeight + 'px'"
                node-key="nodeId"
                :render-content="renderContent" 
                @node-click="handleNodeClick"
                show-checkbox>
            </el-tree>
        </div>
        <div class="btn-group" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6">
            <div class="btn-group-list">
                <template  v-for="item in conferenceBtn">
                    <el-button v-if="item.isShow" :key="item.key" type="text" :title="item.title" :class="item.class" @click="getEvent(item)">{{item.title}}</el-button>
                </template>
            </div>
        </div>
        <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceEventData"/>
        <!-- <div class="setting-menu" v-if="setting.visible" :style="setting.style">
            <div class="item" @click="apiSDK.publishMemberMicrophone(conferenceId, [currentNode.id], !currentNode.microphoneAbility)">{{currentNode && currentNode.microphoneAbility ? '闭麦' : '开麦'}}</div>
            <div class="item" @click="apiSDK.publishMemberAudioAbility(conferenceId, [currentNode.id], !currentNode.audioAbility)">{{currentNode && currentNode.audioAbility ? '闭音' : '开音'}}</div>
            <div class="item" @click="apiSDK.publishMemberVideoAbility(conferenceId, [currentNode.id], !currentNode.videoAbility)">{{currentNode && currentNode.videoAbility ? '关闭视频' : '开启视频'}}</div>
        </div> -->
        <conference-info-dialog ref="conferenceInfo"></conference-info-dialog>
        <conference-person-dialog ref="conferencePerson"></conference-person-dialog>
        <set-chairman-dialog ref="conferenceChairman"></set-chairman-dialog>
        <user-manage-dialog ref="userManage"></user-manage-dialog>
        <electron-blackboard-dialog ref="electronBlackboard"></electron-blackboard-dialog>
        <!-- 切换会商 -->
        <change-meeting ref="changeMeeting"></change-meeting>
        <!-- 主持会商 -->
        <toastmaster-meeting ref="toastmasterMeeting"></toastmaster-meeting>
        <!-- 共享 -->
        <share-dialog ref="shareDialog"/>
        <!-- 任务安排 -->
        <task-arrangement-dialog ref="taskArrangement"/>
        <!-- 大屏同步 -->
        <el-card id="treeRightMenu" v-show="isMenuShow" :style="menuLoc" class="treeRightMenu"  :body-style="{padding:'0px'}">
            <div class="card-content">
                <div class="title-cardScreen">选择大屏同步画面布局</div>
                <div class="screen-box">
                    <div class="screenBtn-box" :class="{'screen-act':ckScreen == item.id}"  v-for="item in ScreenBtn" :key="item.key" @click="ckScreenFn(item)">
                        <img :src="item.img" alt="" class="img-screen">
                        <p>{{item.title}}</p>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- 设置 -->
        <setting-dialog ref="settingDialog"/>
    </div>
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
import ConferenceInfoDialog from '@/components/conference/ConferenceInfoDialog.vue';
import ConferencePersonDialog from '@/components/conference/ConferencePersonDialog.vue';
import SetChairmanDialog from '@/components/conference/SetChairmanDialog.vue';
import UserManageDialog from '@/components/conference/UserManageDialog.vue';
import ElectronBlackboardDialog from '@/components/conference/ElectronBlackboardDialog.vue';

import changeMeeting from '@/components/conference/ChangeMeetingDialog';
import toastmasterMeeting from '@/components/conference/ToastmasterMeeting';
import TaskArrangementDialog from "@/components/conference/TaskArrangementDialog";
import ShareDialog from "@/components/conference/ShareDialog";
import settingDialog from "@/components/conference/settingConference.vue"
export default {
    name: 'ConferenceDiscussActived',
    components: {
        SelectResource,
        ConferenceInfoDialog,
        ConferencePersonDialog,
        SetChairmanDialog,
        UserManageDialog,
        ElectronBlackboardDialog,
        changeMeeting,
        toastmasterMeeting,
        ShareDialog,
        TaskArrangementDialog,
        settingDialog
    },
    data () {
        return {
            chairmanInfo: {},
            isChairman: false,
            isSpectator: false,
            treeData: [],
            members: [],
            conferenceId: '',
            conferenceName: '',
            mediaType: '', // 会议类型
            isMP: false, //是否拼接会议
            defaultProps: {
                nodeId: 'nodeId',
                label: 'name',
                isLeaf: 'leaf'
            },
            conferenceBtn: [],
            btnGroupScroll: {
                prev: true,
                next: false,
                currPage: 0,
            },
            scheme: {
                visible: false,
                data: [],
                schemeId: '',
            },
            treeHeight: 300,
            isAuthorizedConferenceForward:false,
            shareScreenStatus: 0,
            currentNode: null,
            setting: {
                visible: false,
                style: '',
            },
            description: '',
            USER: xtxk.cache.get("USER"),
            isShareScreen: false,
            
            isMenuShow: false,
            menuLoc: '',
            ScreenBtn:[{
                id:'1',title:'会场轮巡', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                id:'2',title:'主会场(2*4)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                id:'3',title:'主会场(2*7)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                id:'4',title:'主次会场(2*2)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                id:'5',title:'主会场全屏', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            }],
            ckScreen:'',
        }
    },
    mounted() {
        //初始化共享按钮状态，异步的
        this.apiSDK.getStatusOfShareScreen(obj => {
            this.shareScreenStatus = obj.status
            let sIndex = this.conferenceBtn.findIndex(item => item.class == 'noShareScreen');
            if (sIndex !== -1) {
                this.$set(this.conferenceBtn, sIndex, this.getShareScreenBtn() );
            }
        });
        //点击其他地方隐藏右键菜单
        // document.addEventListener('click', e => {
        //     if(e.target.className != 'setting-menu' && e.target.className != 'set'){
        //       this.setting.visible = false;
        //       this.currentNode = null;
        //     }
        // });
    },
    methods: {
        // 电子白板入口
        electronBlackboard () {
            let data = {
                sceneID: this.conferenceId,
                sceneName: this.conferenceName,
                password: this.password,
                chairman: this.chairmanInfo.name,
                desc: this.description
            };
            this.$refs.electronBlackboard.showDialog(data);
        },
        // 滚动按钮状态
        scrollBtnStatus(currpage, countPage) {
            if (currpage === 0) {
                this.btnGroupScroll.prev = true;
                this.btnGroupScroll.next = false;
                return;
            }
            if (currpage === countPage) {
                this.btnGroupScroll.prev = false;
                this.btnGroupScroll.next = true;
                return
            }
            this.btnGroupScroll.prev = false;
            this.btnGroupScroll.next = false;
        },
        // 按钮上一页
        btnGroupPrev(event) {
            let countPage = (this.conferenceBtn.length/2) - 4;
            if (this.btnGroupScroll.currPage > 0) {
                this.btnGroupScroll.currPage -= 1;
                this.scrollBtnStatus(this.btnGroupScroll.currPage, countPage);
            }
        },
        // 按钮下一页
        btnGroupNext(event) {
            let countPage = (this.conferenceBtn.length/2) - 4;
            if (this.btnGroupScroll.currPage < countPage) {
                this.btnGroupScroll.currPage += 1;
                this.scrollBtnStatus(this.btnGroupScroll.currPage, countPage);
            }
        },
        getConferenceBtnIndex(btnNameString, btnArray){
            let btnIndex = 0;
            for(let i=0;i<btnArray.length;i++){
                let str = btnArray[i].title;
                if( str.indexOf(btnNameString) > -1 ){
                    btnIndex = i;
                    break;
                }
            }
            // console.log('btnNameString：'+btnNameString+',btnIndex='+btnIndex);
            return Number(btnIndex);
        },
        // 初始化数据
        initData(data_, isOpen) {
            // console.log("刷新会议树");
            // console.log(data_);
            if (data_ && data_.res) {
                let data = data_.res;
                this.conferenceId = data.conferenceId;
                this.conferenceName = data.conferenceName;
                this.description = data.description;
                this.mediaType = data.mediaType;
                this.chairmanInfo = {};
                this.isMP = (data.isMP && data.isMP.status == 1) || false

                if( data.operate === 'init' ){
                    this.clearTree();
                }

                if(data.init && data.init.members){
                    this.members = data.init.members;
                    this.checkTreeNode(data.init.members);
                }
                if(data.init && data.init.devices){
                    this.checkTreeNode(data.init.devices);
                }

                if( data.operate == "discuss" ){
                    if( data.discuss && data.discuss.status == 1 ){
                        this.conferenceName = data.conferenceName + ' [讨论中]';
                    }else{
                        this.conferenceName = data.conferenceName;
                    }
                }

                if(data.refresh){
                    this.checkTreeNode(data.refresh);
                }

                if(data.addMember){
                    this.checkTreeNode(data.addMember);
                }
                
                if( data.rows ) {
                    // data.rows.users[0].role = Enum.enumRoleType.chairman;
                    let users = data.rows.users.map( (item, index) => {
                       if( !index ) { item.role = Enum.enumRoleType.chairman }
                        if (item.status == 0) {
                            item.isOnline = "offline"
                        } else if (item.status == 1) {
                            item.isOnline = "online"
                        }
                       return { ...item , resId: item.userId, resName: item.userName , resType: 0};
                    })
                    this.checkTreeNode(users);
                }

                if(data.removeMember){
                    let treeObj = this.$refs.source_tree;
                    data.removeMember.forEach(item => {
                        var nodeId = item.resId + "_" + (item.resCh || 0);
                        const node = treeObj.getNode(nodeId);
                        if(node) treeObj.remove(node.data);
                    })
                }

                if (data.operate === 'init') {
                    this.btnGroupScroll.currPage = 0;
                    this.conferenceBtn = [
                        { title: '麦克风', class: 'close-microphone-mid', event: 'publishMemberMicrophone', isShow: true },
                        { title: '摄像头',  class: 'close-video-mid', event: 'publishMemberVideoAbility', isShow: this.mediaType === 'VideoAndAudio' },
                        { title: '大屏同步', class: 'scheme-btn', event: 'publishScreen' , isShow: true},
                        { title: '录制', class: 'start-playing', event: 'startMeetRecording' , isShow: true},
                        { title: '会商切换', class: 'scenemanager', event: 'publishChangeMeeting', isShow: true},
                        { title: '邀请', class: 'add-user', event: 'addMember', isShow: this.isChairman},
                        { title: '主持会商', class: 'setchairman', event: 'publishToastmasterMeeting',isShow: this.isChairman},
                        { title: '共享', class: 'shareScreen', event: 'shareFun', isShow: true},
                        { title: '视频调度', class: 'video-dispatch', event: '', isShow: true},
                        { title: '聊天', class: 'meetingMassage', event: '', isShow: true},
                        { title: '记录', class: 'talk', event: '', isShow: true},
                        { title: '任务安排', class: 'task-arrangement', event: 'taskArrangement',isShow: this.isChairman},
                        { title: '会议信息', class: 'sceneinfo', event: 'showSceneInfo', isShow: true },
                        { title: '设置', class: 'more', event: 'publishSetting', isShow: true},
                        { title: '退出会议', class: 'exit', event: 'publishChairmanQuitConference', isShow: !this.isChairman },
                        { title: '结束会议',  class: 'stop', event: 'stopConference', isShow: this.isChairman },

                        // { title: '电子白板', class: 'blackboard', event: 'electronBlackboard', isShow: true },
                        // { title: '邀请成员', class: 'add-user', event: 'addMember', isShow: true },
                        // { title: '强退成员', class: 'delete-user', event: 'removeMember', isShow: this.isChairman },
                        // { title: '闭麦', class: 'close-microphone-mid', event: 'publishMemberMicrophone', isShow: true },
                        // { title: '闭音', class: 'close-audio-mid', event: 'publishMemberAudioAbility', isShow: true },
                        // { title: '关闭视频', class: 'close-video-mid', event: 'publishMemberVideoAbility', isShow: this.mediaType === 'VideoAndAudio'},
                        // // { title: '开启录像', class: 'delete-speak', event: '' },
                        // { title: this.isShareScreen == true ? '结束共享' : '共享屏幕', class: this.isShareScreen == true ? 'stopShareScreen' : 'shareScreen', event: 'publishShareScreen', isShow: this.mediaType === 'VideoAndAudio' },
                       
                        // { title: '会议点名', class: 'sceneperson', event: 'showScenePerson', isShow: this.isChairman },
                        // { title: '管理成员', class: 'scenemanager', event: 'showUserManage', isShow: this.isChairman },
                        // { title: '指定主持人', class: 'setchairman', event: 'showSetChairman', isShow: this.isChairman },
                        // { title: '退出会议', class: 'exit', event: 'publishChairmanQuitConference', isShow: true },
                        // { title: '结束会议', class: 'stop', event: 'stopConference', isShow: this.isChairman },
                    ]
                }
            }
            this.setTreeHeigth();
        },
        // 主席-强退成员
        removeMember() {
            let self = this
            let personArray = this.$refs.source_tree.getCheckedNodes()
            if (personArray.length === 0) {
                this.$message({message: '请至少选择一名参会成员', type: 'warning'})
            } 
            //else if (personArray.length === 1 && personArray[0].inGroup == false) {
            //    this.$message({message: '不能强退未入会成员', type: 'warning'})
            //} 
            else {
                this.$confirm('确定强退选定成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let memberIds = []
                    personArray.forEach(item => {
                        //if(item.inGroup) memberIds.push({ userId: item.id })
                        memberIds.push({ userId: item.id })
                    })
                    self.apiSDK.removeMember(self.conferenceId, memberIds)
                })
            }
        },
        setTreeHeigth() {
            let contentHeight = document.querySelector('#conferencePanel').offsetHeight;
            let btnGroupHeight = document.querySelector('.conference .btn-group').offsetHeight;
            this.treeHeight =  contentHeight - btnGroupHeight - 54;
        },
        getEvent(btn) {
            if(btn.event) this[btn.event](btn);
        },
        //node判断
        checkTreeNode: function(list){
            let treeObj = this.$refs.source_tree;
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                var nodeId = item.resId + "_" + (item.resCh || 0);

                //主席节点
                if (item.role == Enum.enumRoleType.chairman) {
                    this.chairmanInfo = {
                        id: item.resId, 
                        name: item.resName, 
                        audioAbility:   item.audioAbility,
                        videoAbility:   item.videoAbility,
                        microphoneAbility: item.microphoneAbility,
                        isJoinWhiteBoard: item.isJoinWhiteBoard
                    }
                    //自己是否为主席
                    this.isChairman = item.resId == xtxk.cache.get('USER').userId ? true : false
                }

                // 是否共享屏幕
                if(item.resId === this.USER.userId) {
                    this.isShareScreen = item.isShare;
                }

                //主席节点后续不会更新
                if(item.resId == this.chairmanInfo.id){
                    continue
                }

                //图标处理
                var resStatus = 0;
                if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                else if(item.isOnline == Enum.enumMerberStatus.offline) resStatus = 0;
                else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;

                var busStatus = 0;
                if(item.role == Enum.enumRoleType.speak) {resStatus = 1; busStatus = Enum.enumBussStatus.Speaking};
                if(item.isOnline == Enum.enumMerberStatus.playing) {resStatus = 1; busStatus = Enum.enumBussStatus.Playing};

                var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus, item.deviceType);
                
                const node = treeObj.getNode(nodeId);
                if(node){//刷新
                    node.data.nodeStatus = icon_;
                    node.data.name = item.resName;
                    node.data.inGroup = item.inGroup;
                    node.data.isJoinWhiteBoard = item.isJoinWhiteBoard;
                }else{//添加
                    var data = {
                        nodeId:         nodeId,
                        id:             item.resId,
                        name:           item.resName,
                        resourceType:   item.resType,
                        deviceType:     item.deviceType,
                        nodeStatus:     icon_,
                        resCh:          item.resCh || 0,
                        inGroup:        item.inGroup,
                        audioAbility:   item.audioAbility,
                        videoAbility:   item.videoAbility,
                        microphoneAbility: item.microphoneAbility,
                        isJoinWhiteBoard: item.isJoinWhiteBoard
                    };
                    this.treeData.push(data)
                }

            }
            
            //刷新的数据传给主持会商
            let toastmasterData= {inGroup: [], outGroup: []};
            this.treeData.forEach(item => {
                if (item.inGroup) {
                    toastmasterData.inGroup.push(item);
                } else {
                    toastmasterData.outGroup.push(item);
                }
            })
            this.$refs.toastmasterMeeting.getGroupData(toastmasterData)
        },
        //添加成员
        addMember() {
            if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                let personArray = this.$refs.source_tree.getCheckedNodes();
                // 在资源树选资源
                if (personArray.length) {
                    let members = [];
                    personArray.forEach((item, index) => {
                        if (!item.inGroup) {
                            members.push({
                                index: index,userId: item.id, userName: item.name, resourceType: item.deviceType == Enum.enumDeviceType.HWMeetingTerminal ? 'Device' : 'User'
                            })
                        }
                    });
                    if(members.length > 0){
                        this.apiSDK.addMember(this.conferenceId, members);
                    } else {
                        this.$message({message: '选择成员已入会！', type: 'warning'})
                    }
                } else {
                    this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.meetingAddMember);
                }
            } else if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6  ) {
                this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.meetingAddMember);
            }
        },
        // 显示用户管理
        showUserManage() {
            let data = {
                conferenceId: this.conferenceId,
                members: this.treeData
            }
            this.$refs.userManage.showDialog(data);
        },
        // 显示会议信息
        showSceneInfo() {
            let data = {
                sceneID: this.conferenceId,
                sceneName: this.conferenceName,
                password: this.password,
                chairman: this.chairmanInfo.name,
                desc: this.description
            };
            this.$refs.conferenceInfo.showDialog(data);
        },
        // 显示指定主持人
        showSetChairman() {
            let data = {
                conferenceId: this.conferenceId,
                members: this.members
            };
            this.$refs.conferenceChairman.showDialog(data);
        },
        // 显示会议点名
        showScenePerson() {
            let data = {inGroup: [], outGroup: []};
            this.treeData.forEach(item => {
                if (item.inGroup) {
                    data.inGroup.push(item);
                } else {
                    data.outGroup.push(item);
                }
            })
            this.$refs.conferencePerson.showDialog(data);
        },
        // 从选择资源组件传出
        resourceEventData(resourceEvent){
          let members = []
          resourceEvent[0].forEach( (item, index) => {
            let resType = "User"
            if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                resType = "Device"
            members.push({
                index: index,userId: item.id, userName: item.name, resourceType: resType
            })
          });
          if(members.length > 0)
            this.apiSDK.addMember(this.conferenceId, members)
        },
        //清空树
        clearTree(){
            //清空node
            var tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.source_tree.getNode(item);
                node && this.$refs.source_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        // 主席,成员闭音
        publishMemberAudioAbility(btn) {
            let memberIDs, ability;
            memberIDs = [this.USER.userId];
            if (btn.title === '开音') {
                ability = false;
                btn.title = '闭音'
                btn.class = 'close-audio-mid'
            } else {
                ability = true;
                btn.title = '开音'
                btn.class = 'open-audio-mid'
            }
            this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, ability);
        },
        // 主席,成员闭麦
        publishMemberMicrophone(btn) {
            let memberIDs, ability;
            memberIDs = [this.USER.userId];
            if (btn.title === '开麦') {
                ability = false;
                btn.title = '闭麦'
                btn.class = 'close-microphone-mid'
            } else {
                ability = true;
                btn.title = '开麦'
                btn.class = 'open-microphone-mid'
            }
            this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, ability);
        },
        // 主席,成员关闭视频
        publishMemberVideoAbility(btn) {
            let memberIDs, ability;
            memberIDs = [this.USER.userId];
            if (btn.title === '开启视频') {
                ability = false;
                btn.title = '关闭视频';
                btn.class = 'close-video-mid'
            } else {
                ability = true;
                btn.title = '开启视频';
                btn.class = 'open-video-mid'
            }
            this.apiSDK.publishMemberVideoAbility(this.conferenceId, memberIDs, ability);
        },
        showMenu(node, data, event) {
            event.preventDefault();
            this.currentNode = data;
            let left_ = event.clientX - 90;
            let top_ = event.clientY + 10;
            this.setting.style = 'left: '+ left_ +'px; top: '+top_+'px';
            this.setting.visible = true;
        },
        // 共享屏幕
        getShareScreenBtn(){
            let shareBtn = { title: '共享屏幕', class: 'noShareScreen', event: '' }
            if(this.shareScreenStatus == 0 || this.shareScreenStatus == 1){}
            else if(this.shareScreenStatus == 2){
                shareBtn = { title: '共享摄像头', class: 'shareCamera', event: 'shareScreen' }
            }
            else if(this.shareScreenStatus == 3){
                shareBtn = { title: '共享屏幕', class: 'shareScreen', event: 'shareScreen' }
            }
            return shareBtn;
        },
        // 共享屏幕
        publishShareScreen(btn) {
            let isShare;
            if(btn.class === 'shareScreen') {
                isShare = true;
                btn.title = '结束共享';
                btn.class = 'stopShareScreen'
            } else {
                isShare = false;
                btn.title = '共享屏幕';
                btn.class = 'shareScreen'
            }
            this.apiSDK.publishShareScreen(this.conferenceId, isShare);
        },
        // 退出会议
        publishChairmanQuitConference() {
            this.apiSDK.publishChairmanQuitConference(this.conferenceId);
        },
        // 主席-结束会议
        stopConference() {
            this.apiSDK.stopConference(this.conferenceId);
        },
        // 成员-退出会议
        applyLeaveConference() {
            this.apiSDK.applyLeaveConference(this.conferenceId, false);
        },

        //切换会商
        publishChangeMeeting(){
            this.$refs.changeMeeting.showDialog();
        },
        //主持会商
        publishToastmasterMeeting(){
            let data = {inGroup: [], outGroup: []};
            data.inGroup.push(this.chairmanInfo)
            this.treeData.forEach(item => {
                if (item.inGroup) {
                    data.inGroup.push(item);
                } else {
                    data.outGroup.push(item);
                }
            })
            this.$refs.toastmasterMeeting.showDialog(data,this.conferenceId,this.chairmanInfo);
        },
         //共享
        shareFun(){
            this.$refs.shareDialog.showDialog();
        },
        //任务安排
        taskArrangement(){
             this.$refs.taskArrangement.showDialog();
        },
        //大屏同步
        publishScreen(){
            this.isMenuShow = !this.isMenuShow;
            this.menuLoc = 'left: '+ 210 +'px; bottom: '+ 380 +'px';
        },
        //点击大屏
        ckScreenFn(item){
            this.ckScreen = item.id
        },
        // 主席-开启录像（会议中）
        startMeetRecording(btn) {
            this.apiSDK.startMeetRecording(this.conferenceId)
            btn.title = '停止录制';
            btn.class = 'stop-playing';
            btn.event = 'stopMeetRecording';
            // let index = this.conferenceBtn.findIndex(item => item.event === 'startMeetRecording')
            // this.$set(this.conferenceBtn, index, { title: '关闭录像', class: 'stop-playing', event: 'stopMeetRecording' })
        },
        // 主席-关闭录像（会议中）
        stopMeetRecording(btn) {
            this.apiSDK.stopMeetRecording(this.conferenceId)
            // let index = this.conferenceBtn.findIndex(item => item.event === 'stopMeetRecording')
            // this.$set(this.conferenceBtn, index, { title: '开启录像', class: 'start-playing', event: 'startMeetRecording' })
            btn.title = '录制';
            btn.class = 'start-playing';
            btn.event = 'startMeetRecording';
        },
        //设置
        publishSetting(btn){
            this.$refs.settingDialog.showDialog();
        },
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <span class={data.microphoneAbility ? "close-microphone" : "open-microphone"}></span>
                    <span class={data.audioAbility ? "close-audio" : "open-audio"}></span>
                    <span class={data.videoAbility ? "close-video" : "open-video"}></span>
                    <span class={data.isJoinWhiteBoard == 'true' ? "whiteboard" : "set-hide"}></span>
                </span>);
            // <span on-click={(event) => {this.showMenu(node, data, event)}} class={this.isChairman || node.id ==  this.USER.userId ? "set" : "set-hide"}></span>
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
.conference{
    position: relative;
    height: 100%;
}
.conference .title{
    background-color: #e9f3fa;
    height: 24px;
    overflow: hidden;
    line-height: 24px;
    font-size: 12px;
    padding: 0 10px;
    color: #2e3c42;
    margin: 0;
}
.conference .content{
    overflow: auto;
    // max-height: 666px;
}
.conference .content .hr{
    height: 1px;
    border: 0;
    background: #c1cfd6;
}
.conference .btn-group{
    background-color: #e9f3fa;
    text-align: left;
    border-top: 1px solid #c1cfd6;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-left: 3px;
}
.conference .btn-group-list button{
    width: 58px;
    padding: 50px 0 0;
    color: #666;
    margin: 18px 8px;
    font-size: 12px;
}
.conference .btn-group button:hover{
    color: #666;
}
.conference .btn-group-scroll{
    transition: transform .3s;
}
.conference .btn-group.is-scroll .btn-group-list{
    transition: transform .3s;
}
.btn-group__prev,
.btn-group__next{
    position:absolute;
    cursor:pointer;
    top: 81px;
    z-index: 1;
}
.scheme{
    max-height: 280px;
    overflow: auto;
}
.scheme .item{
    padding: 8px 10px;
}
.btn-group__next{right: 5px;}
.add-user{
    background: url(../../../static/resPanelControl/add.png) no-repeat center top;
}
.add-user:hover{
    background: url(../../../static/resPanelControl/add_hover.png) no-repeat center top;
}
.open-audio-mid{
    background: url(../../../static/scene/ico_menu_opentone.png) no-repeat center top;
}
.open-audio-mid:hover{
    background: url(../../../static/scene/ico_menu_opentone_active.png) no-repeat center top;
}
.close-audio-mid{
    background: url(../../../static/scene/ico_menu_closedtone.png) no-repeat center top;
}
.close-audio-mid:hover{
    background: url(../../../static/scene/ico_menu_closedtone_active.png) no-repeat center top;
}
.open-video-mid{
    background: url(../../../static/scene/ico_menu_openvideo.png) no-repeat center top;
}
.open-video-mid:hover{
    background: url(../../../static/scene/ico_menu_openvideo_active.png) no-repeat center top;
}
.close-video-mid{
    background: url(../../../static/scene/ico_menu_closevideo_active.png) no-repeat center top;
}
.close-video-mid:hover{
    background: url(../../../static/scene/ico_menu_closevideo.png) no-repeat center top;
}
.open-microphone-mid{
    background: url(../../../static/scene/ico_menu_openwheat.png) no-repeat center top;
}
.open-microphone-mid:hover{
    background: url(../../../static/scene/ico_menu_openwheat_active.png) no-repeat center top;
}
.close-microphone-mid{
    background: url(../../../static/scene/ico_menu_closedwheat.png) no-repeat center top;
}
.close-microphone-mid:hover{
    background: url(../../../static/scene/ico_menu_closedwheat_active.png) no-repeat center top;
}
.record{
    background: url(../../../static/scene/ico_menu_recordingstart.png) no-repeat center top;
}
.record:hover{
    background: url(../../../static/scene/ico_menu_recordingstart_active.png) no-repeat center top;
}
.recording{
    background: url(../../../static/scene/ico_menu_recording.png) no-repeat center top;
}
.recording:hover{
    background: url(../../../static/scene/ico_menu_closedwheat.png) no-repeat center top;
}
.sceneinfo{
    background: url(../../../static/scene/ico_menu_information.png) no-repeat center top;
}
.sceneinfo:hover{
    background: url(../../../static/scene/ico_menu_information_active.png) no-repeat center top;
}
.sceneperson{
    background: url(../../../static/scene/ico_menu_rollcall.png) no-repeat center top;
}
.sceneperson:hover{
    background: url(../../../static/scene/ico_menu_rollcall_active.png) no-repeat center top;
}
.scenemanager{
    background: url(../../../static/scene/ico_menu_management.png) no-repeat center top;
}
.scenemanager:hover{
    background: url(../../../static/scene/ico_menu_management_active.png) no-repeat center top;
}
.setchairman{
    background: url(../../../static/scene/ico_menu_host.png) no-repeat center top;
}
.setchairman:hover{
    background: url(../../../static/scene/ico_menu_host_active.png) no-repeat center top;
}
.stop{
    background: url(../../../static/resPanelControl/stop.png) no-repeat center top;
}
.stop:hover{
    background: url(../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
.exit{
    background: url(../../../static/resPanelControl/exit.png) no-repeat center top;
}
.blackboard{
    background: url(../../../static/resPanelControl/stop.png) no-repeat center top;
}
.blackboard:hover{
    background: url(../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
.exit:hover{
    background: url(../../../static/resPanelControl/exit_hover.png) no-repeat center top;
}

.shareScreen{
    background: url(../../../static/resPanelControl/share_screen.png) no-repeat center top;
}
.shareScreen:hover{
    background: url(../../../static/resPanelControl/share_screen_hover.png) no-repeat center top;
}
.noShareScreen{
    background: url(../../../static/resPanelControl/share_screen_no.png) no-repeat center top;
}
.stopShareScreen{
    background: url(../../../static/scene/ico_menu_share_end.png) no-repeat center top;
}
.stopShareScreen:hover{
    background: url(../../../static/scene/ico_menu_share_end_active.png) no-repeat center top;
}
.shareCamera{
    background: url(../../../static/resPanelControl/share_camera.png) no-repeat center top;
}
.shareCamera:hover{
    background: url(../../../static/resPanelControl/share_camera_hover.png) no-repeat center top;
}
.chairman-mini{
    background: url(../../../static/resPanelControl/chairman-mini.png) no-repeat center top;
}
.delete-user{
    background: url(../../../static/resPanelControl/delete.png) no-repeat center top;
}
.delete-user:hover{
    background: url(../../../static/resPanelControl/delete_hover.png) no-repeat center top;
}
.start-playing{
    background: url(../../../static/resPanelControl/start_playing.png) no-repeat center top;
}
.stop-playing{
    background: url(../../../static/resPanelControl/stop_playing.png) no-repeat center top;
}
.talk{
    background: url(../../../static/resPanelControl/talk.png) no-repeat center top;
}
.meetingMassage{
    background: url(../../../static/resPanelControl/videoCommand/msg.png) no-repeat center top;
}
.meetingMassage:hover{
    background: url(../../../static/resPanelControl/videoCommand/msg_hover.png) no-repeat center top;
}
.scheme-btn{
    background: url(../../../static/resPanelControl/scheme.png) no-repeat center top;
}
.scheme-btn:hover{
    background: url(../../../static/resPanelControl/scheme_hover.png) no-repeat center top;
}
.task-arrangement{
    background: url(../../../static/resPanelControl/videoCommand/fenpai.png) no-repeat center top;
}
.task-arrangement:hover{
    background: url(../../../static/resPanelControl/videoCommand/fenpai_hover.png) no-repeat center top;
}
.more{
    background: url(../../../static/resPanelControl/videoCommand/remind.png) no-repeat center top;
}.more:hover{
    background: url(../../../static/resPanelControl/videoCommand/remind.png) no-repeat center top;
}
.video-dispatch{
    background: url(../../../static/resPanelControl/videoCommand/jieti.png) no-repeat center top;
}.video-dispatch:hover{
    background: url(../../../static/resPanelControl/videoCommand/jieti_hover.png) no-repeat center top;
}
.setting-menu{
    position: fixed;
    width: 80px;
    z-index: 99999;
    background-color: #fafafa;
    border-radius: 5px;
    border: solid 1px #c2dff3;
    font-size: 14px;
}
.setting-menu .item{
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    padding: 0 5px;
}
.setting-menu .item:hover{
    background-color: #dbf0fe;
}
/deep/ .el-tree__empty-text{
    display:none;
}

/* 大屏同步 */
.treeRightMenu {
    width: 550px;
    height: 150px;
    position: fixed;
}
.card-content{
    width: 550px;
    height: 150px;
}
.title-cardScreen{
    width: 100%;
    height: 30px;
    line-height: 30PX;
    text-align: center;
    border-bottom: 1px solid #c8ccd5 ;
}
.screen-box{
    width: 100%;
    height: calc(100% - 30px);
    padding: 10px 22px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.screenBtn-box{
    display: inline-block;
    width: 85px;
    font-size: 13px;
    text-align: center;
}
.screenBtn-box .img-screen{
    width: 70px;
}
.screenBtn-box p{
    margin-top: 5px;
}
.screen-act{
    color: #409EFF;
}
</style>
