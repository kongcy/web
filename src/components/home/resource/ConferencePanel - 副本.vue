<template>
    <div class="conference" id="conferencePanel">
        <p class="title" style="text-align:left;">【会议】{{conferenceName}}</p>
        <div class="content">
            <div class="custom-tree-node" style="justify-content: flex-start;padding: 5px 10px 5px 20px;">
                <span class="node-icon chairman-mini"></span>
                <span>{{chairmanInfo.name}}</span>【主席】
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
        <div class="btn-group" :class="conferenceBtn.length > 8 ? 'is-scroll' : ''"  v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5">
            <el-button class="btn-group__prev" type="text" v-if="conferenceBtn.length > 8" @click="btnGroupPrev" :disabled="btnGroupScroll.prev" icon="el-icon-arrow-left"></el-button>
            <el-button class="btn-group__next" type="text" v-if="conferenceBtn.length > 8" @click="btnGroupNext" :disabled="btnGroupScroll.next" icon="el-icon-arrow-right"></el-button>
            <div class="btn-group-scroll" :style="`width: ${conferenceBtn.length > 8 ? (Math.ceil(conferenceBtn.length/2)) * 74 + 'px' : 'auto'}; transform:translateX(-${btnGroupScroll.currPage*74}px)`">
                <div class="btn-group-list">
                    <el-button v-for="item in conferenceBtn" :key="item.key" type="text" :title="item.title" :class="item.class" @click="getEvent(item)">{{item.title}}</el-button>
                </div>
            </div>
        </div>
        <div class="btn-group" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6">
            <div class="btn-group-list">
                <template v-for="item in conferenceBtn">
                    <el-button v-if="item.isShow" :key="item.key" type="text" :title="item.title" :class="item.class" @click="getEvent(item)">{{item.title}}</el-button>
                </template>
            </div>
        </div>
        <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceEventData"/>
        <conference-forward-authorize-dialog ref="conferenceForwardAuthorizeDialog"/>
        <meeting-forward-dialog ref="meetingForwardDialog"/>
        <meeting-massage-dialog ref="meetingMassageDialog"/>
        <!-- 显示方案 -->
        <el-dialog
            customClass="custom-dialog"
            title="显示方案"
            width="300px"
            :visible.sync="scheme.visible">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>分组名</span>
                </div>
                <div class="scheme">
                    <div class="item" v-for="item in scheme.data">
                        <el-radio v-model="scheme.schemeId" :label="item.schemeId" :key="item.schemeId">{{item.schemeName}}</el-radio>
                    </div>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button type="primary" @click="createLoopDBGrpScheme">新建</el-button>
                <el-button type="primary" :disabled="scheme.data.length === 0" @click="switchScheme">应用</el-button>
                <el-button @click="scheme.visible = false">取消</el-button>
            </div>
        </el-dialog>
        <scheme-manage-dialog ref="schemeManageDialog" />
        <conference-info-dialog ref="conferenceInfo"></conference-info-dialog>
        <conference-person-dialog ref="conferencePerson"></conference-person-dialog>
        <electron-blackboard-dialog ref="electronBlackboard"></electron-blackboard-dialog>
    </div>
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import ConferenceForwardAuthorizeDialog  from '@/components/conference/ConferenceForwardAuthorizeDialog.vue';
import MeetingForwardDialog from '@/components/conference/MeetingForwardDialog.vue';
import MeetingMassageDialog from '@/components/conference/MeetingMessageDialog.vue';
import ConferenceInfoDialog from '@/components/conference/ConferenceInfoDialog.vue';
import ConferencePersonDialog from '@/components/conference/ConferencePersonDialog.vue';
import ElectronBlackboardDialog from '@/components/conference/ElectronBlackboardDialog.vue';
export default {
    name: 'ConferencePanel',
    components: {
        SelectResource,
        SchemeManageDialog,
        ConferenceForwardAuthorizeDialog,
        MeetingForwardDialog,
        MeetingMassageDialog,
        ConferenceInfoDialog,
        ConferencePersonDialog,
        ElectronBlackboardDialog
    },
    data () {
        return {
            chairmanInfo: {},
            isChairman: false,
            isSpectator: false,
            isSpeaking: false,
            treeData: [],
            conferenceId: '',
            conferenceName: '',
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
            description: '',
        }
    },
    mounted() {
        if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
            this.apiSDK.queryMeetingTransmitAuth(this.affairId);
            this.apiSDK.setReceiveMeetingTransmitAuthCallBack((obj)=>{
                // console.log('获取会场转发授权列表', JSON.stringify(obj));
                let arr = [];
                if( obj.length == 0 ){
                    this.isAuthorizedConferenceForward = false;
                }else{
                    obj.forEach(item=>{
                        if( item.destId ){
                            this.isAuthorizedConferenceForward = true;
                        }
                    });
                }
            });
        }
        //初始化共享按钮状态，异步的
        this.apiSDK.getStatusOfShareScreen(obj => {
            this.shareScreenStatus = obj.status
            let sIndex = this.conferenceBtn.findIndex(item => item.class == 'noShareScreen');
            if (sIndex !== -1) {
                this.$set(this.conferenceBtn, sIndex, this.getShareScreenBtn() );
            }
        });
    },
    watch:{
        isAuthorizedConferenceForward:{
            handler(){
                if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                    if( this.isAuthorizedConferenceForward == true ){
                        this.conferenceBtn.splice(this.getConferenceBtnIndex('退出会议',this.conferenceBtn),0,{ title: '会场转发', class: 'meetingForward', event: 'memberMeetingForward' })
                    }else{
                        this.conferenceBtn.splice(this.getConferenceBtnIndex('会场转发',this.conferenceBtn),1);
                    }
                }
            }
        },
    },
    methods: {
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
            console.log("刷新会议树");
            // console.log(data_);
            if (data_ && data_.res) {
                let data = data_.res;
                this.conferenceId = data.conferenceId;
                this.description = data.description;
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ) {
                    this.conferenceName = data.conferenceName
                }
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                    if( data.discuss && data.discuss.status == 1 ){
                        this.conferenceName = data.conferenceName + ' [讨论中]';
                    }else{
                        this.conferenceName = data.conferenceName;
                    }
                }
                this.isMP = (data.isMP && data.isMP.status == 1) || false

                if( data.operate === 'init' ){
                    this.clearTree();
                }

                if(data.init && data.init.members){
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

                if (data.operate === 'init' && isOpen) {
                    let isVersion5 = this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5;
                    this.conferenceBtn = [
                        { title: '电子白板', class: 'blackboard', event: 'electronBlackboard', isShow: true },
                        { title: '添加成员', class: 'add-user', event: 'addMember', isShow: true },
                        { title: '强退成员', class: 'delete-user', event: 'removeMember', isShow: true },
                        { title: '申请发言', class: this.isSpeaking ? 'applyspeak' : 'unspeak', event: this.isSpeaking ? 'applySpeaking' : 'finishSpeaking', isShow: this.isMP !== 1 && !this.isChairman },
                        { title: '指定发言', class: 'add-speak', event: 'appointSpeaking', isShow: this.isMP !== 1 },
                        { title: '收回发言', class: 'delete-speak', event: 'cancelSpeakingByChairman', isShow: this.isMP !== 1 },
                        { title: '闭麦', class: 'open-microphone-mid', event: 'publishMemberMicrophone', isShow: !isVersion5 },
                        { title: '闭音', class: 'open-audio-mid', event: 'publishMemberAudioAbility', isShow: !isVersion5 },
                        { title: '关闭视频', class: 'open-video-mid', event: 'publishMemberVideoAbility', isShow: !isVersion5 },
                        // { title: '讨论模式', class: 'talk', event: 'startConferenceDiscussion' },
                        // { title: '全场静音', class: 'mute', event: 'muteConferenceAll' },
                        // { title: '暂停会议', class: 'pause', event: 'pauseConference' },
                        { title: '显示方案', class: 'scheme-btn', event: 'openSchemeDialog', isShow: isVersion5 },
                        // { title: '指定主席', class: 'chairman', event: 'appointChairman' },
                        // { title: '会议录像', class: 'start-playing', event: 'startMeetRecording' },
                        { title: '转发授权', class: 'meetingForward', event: 'conferenceForwardAuthorize', isShow: isVersion5 },
                        { title: '会场转发', class: 'meetingForward', event: 'chairmanMeetingForward', isShow: isVersion5 },
                        // { title: '会场通知', class: 'meetingMassage', event: 'MeetingMassage' },
                        { title: '共享屏幕', class: 'noShareScreen', event: 'publishShareScreen', isShow: !isVersion5 && this.isSpeaking },
                        { title: '会议信息', class: 'sceneinfo', event: 'showSceneInfo', isShow: !isVersion5 },
                        { title: '会议点名', class: 'sceneperson', event: 'showScenePerson', isShow: !isVersion5 && this.isChairman },
                        // { title: '控制云台', class: 'ytcontrol', event: 'ytcontrol' },
                        { title: '结束会议', class: 'stop', event: 'stopConference', isShow: this.isChairman },
                        { title: '退出会议', class: 'exit', event: 'applyLeaveConference', isShow: !this.isChairman },
                    ]
                }
            }
            this.setTreeHeigth();
        },
        // 电子白板入口
        electronBlackboard () {
            let data = {
                sceneID: this.conferenceId,
                sceneName: this.conferenceName,
                password: this.password,
                chairman: this.chairmanInfo.name,
                desc: this.description,
                sceneType: 0,
            };
            this.$refs.electronBlackboard.showDialog(data);
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
                    this.chairmanInfo = {id: item.resId, name: item.resName}
                    //自己是否为主席
                    this.isChairman = item.resId == xtxk.cache.get('USER').userId ? true : false
                }

                //主席节点后续不会更新
                if(item.resId == this.chairmanInfo.id){
                    continue
                }

                //自己是否为旁观
                this.isSpectator = item.resId == xtxk.cache.get('USER').userId ? item.isSpectator : false

                //主席同意后，申请发言图标改为退出发言
                if(item.role == Enum.enumRoleType.speak && item.resId == xtxk.cache.get('USER').userId){
                    this.isSpeaking = true;
                }else if(item.role == Enum.enumRoleType.member && item.resId == xtxk.cache.get('USER').userId){
                    this.isSpeaking = false;
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

                var namePrifex = "";
                if(resStatus == 1 && item.inGroup == true)  namePrifex = "[已入会]";
                if(resStatus == 1 && item.inGroup == false)  namePrifex = "[未入会]";

                const node = treeObj.getNode(nodeId);
                if(node){//刷新
                    node.data.nodeStatus = icon_;
                    node.data.name = item.resName + namePrifex;
                    node.data.inGroup = item.inGroup;
                    node.data.isJoinWhiteBoard = item.isJoinWhiteBoard;
                }else{//添加
                    var data = {
                        nodeId:         nodeId,
                        id:             item.resId,
                        // name:           item.resName + namePrifex,
                        name:           item.resName,
                        resourceType:   item.resType,
                        deviceType:     item.deviceType,
                        nodeStatus:     icon_,
                        resCh:          item.resCh || 0,
                        inGroup:        item.inGroup,
                        isJoinWhiteBoard: item.isJoinWhiteBoard
                    };
                    this.treeData.push(data)
                }
            }
        },
        // 打开显示方案弹框
        openSchemeDialog() {
            this.apiSDK.getDisplaySchemeBySchemeType(Enum.enumSchemeType.GroupMeeting, 1, 1024,res => {
                this.scheme.data = res;
                this.scheme.visible = true;
            });
        },
        // 应用显示方案
        switchScheme() {
            if (this.scheme.schemeId === '') {
                this.$message({message: '请选择显示方案', type: 'warning'});
            } else {
                this.apiSDK.switchMeetingDisplayScheme(this.conferenceId, this.scheme.schemeId)
                this.scheme.visible = false;
                this.scheme.schemeId = '';
            }

        },
        //新建
        createLoopDBGrpScheme() {
            this.$refs.schemeManageDialog.showDialog();
        },
        // 显示会议信息
        showSceneInfo() {
            let data = {
                sceneID: this.conferenceId,
                sceneName: this.conferenceName,
                password: this.password,
                chairman: this.chairmanInfo.name,
                desc: this.description,
                sceneType: 0,
            };
            this.$refs.conferenceInfo.showDialog(data);
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
        // 共享屏幕
        getShareScreenBtn(){
            let shareBtn = { title: '共享屏幕', class: 'noShareScreen', event: '' }
            if(this.shareScreenStatus == 0 || this.shareScreenStatus == 1){
                
            }
            else if(this.shareScreenStatus == 2){
                shareBtn = { title: '共享摄像头', class: 'shareCamera', event: 'shareScreen' }
            }
            else if(this.shareScreenStatus == 3){
                shareBtn = { title: '共享屏幕', class: 'shareScreen', event: 'shareScreen' }
            }
            return shareBtn;
        },
        shareScreen(btn) {
            this.apiSDK.switchSourceOfShareScreen((res) => {
                if (res.code == 0) {
                    this.$message({message: res.msg, type: 'error'});
                }
            });
            if(btn.class == 'shareCamera'){
                btn.title = '共享屏幕';
                btn.class = 'shareScreen';
            }else if(btn.class == 'shareScreen'){
                btn.title = '共享摄像头';
                btn.class = 'shareCamera';
            }
        },
        // 云台控制
        ytcontrol() {

        },
        // 共享屏幕
        publishShareScreen() {
            this.apiSDK.publishShareScreen(this.conferenceId);
        },
        // 主席,成员闭音
        publishMemberAudioAbility(btn) {
            let memberIDs = this.$refs.source_tree.getCheckedKeys();
            if (btn.title === '开音') {
                this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, true);
                btn.title = '闭音'
                btn.class = 'close-audio-mid'
            } else {
                this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, false);
                btn.title = '开音'
                btn.class = 'open-audio-mid'
            }
        },
        // 主席,成员闭麦
        publishMemberMicrophone(btn) {
            let memberIDs = this.$refs.source_tree.getCheckedKeys();
            if (btn.title === '开麦') {
                this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, true);
                btn.title = '闭麦'
                btn.class = 'close-microphone-mid'
            } else {
                this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, false);
                btn.title = '开麦'
                btn.class = 'open-microphone-mid'
            }
        },
        // 主席,成员关闭视频
        publishMemberVideoAbility(btn) {
            let memberIDs = this.$refs.source_tree.getCheckedKeys();
            if (btn.title === '开启视频') {
                this.apiSDK.publishMemberVideoAbility(this.conferenceId, memberIDs, true);
                btn.title = '关闭视频';
                btn.class = 'close-video-mid'
            } else {
                this.apiSDK.publishMemberVideoAbility(this.conferenceId, memberIDs, false);
                btn.title = '开启视频';
                btn.class = 'open-video-mid'
            }
        },
        // 主席-指定主席
        appointChairman() {
            let personArray = this.$refs.source_tree.getCheckedNodes()
            if (personArray.length !== 1) {
                this.$message({message: '必须指定一名成员', type: 'warning'})
            } else if (personArray.length === 1 && personArray[0].inGroup == false) {
                this.$message({message: '未入会成员不能指定主席', type: 'warning'})
            } else {
                let memberIds = []
                personArray.forEach(item => {
                    if(item.inGroup) memberIds.push({ userId: item.id })
                })
                if(memberIds.length > 0) this.apiSDK.appointChairman(this.conferenceId, memberIds);
            }
        },
        // 主席-开启录像（会议中）
        startMeetRecording(btn) {
            this.apiSDK.startMeetRecording(this.conferenceId)
            btn.title = '关闭录像';
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
            btn.title = '开启录像';
            btn.class = 'start-playing';
            btn.event = 'startMeetRecording';
        },
        // 主席-会场转发授权
        conferenceForwardAuthorize(){
            this.$refs.conferenceForwardAuthorizeDialog.showDialog(this.conferenceId,this.treeData);
        },
        // 主席-会场转发
        chairmanMeetingForward(){
            this.$refs.meetingForwardDialog.showDialog(this.conferenceId,this.treeData);
        },
        // 主席-会场通知
        MeetingMassage(){
            this.$refs.meetingMassageDialog.showDialog();
        },
        // 成员-会场转发
        memberMeetingForward(){
            // 获取会场转发成员
            this.apiSDK.queryMeetingTansmitMember(this.conferenceId);
            this.apiSDK.setReceiveMeetingTransmitMemberCallBack((obj)=>{
                    // console.log('获取会场转发成员', JSON.stringify(obj));
                    let forwardTreeData = [];
                    obj.forEach(item=>{
                        let nodeId = item.resId + "_" + (item.resCh || 0);
                        //图标处理
                        var resStatus = 0;
                        if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                        else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                        else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                        else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;
                        var busStatus = 0;
                        var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus);
                        var data = {
                            nodeId:         nodeId,
                            id:             item.resId,
                            name:           item.resName,
                            resourceType:   item.resType || 0,
                            nodeStatus:     icon_,
                            resCh:          item.resCh || 0,
                            inGroup:        item.inGroup,
                            parentId:       item.parentId,
                        };
                        forwardTreeData.push(data)
                    });
                    this.$refs.meetingForwardDialog.showDialog(this.conferenceId,forwardTreeData);
                });
        },
        // 成员-申请主席
        applyChairman() {
            this.apiSDK.applyChairman(this.conferenceId);
        },
        // 成员-启用旁观会议
        openSpectateConference(btn) {
            this.apiSDK.openSpectateConference(this.conferenceId)
            // let index = this.conferenceBtn.findIndex(item => item.event === 'openSpectateConference')
            // this.$set(this.conferenceBtn, index, { title: '退出旁观', class: 'unlook', event: 'closeSpectateConference' })
            btn.title = '退出旁观';
            btn.class = 'unlook';
            btn.event = 'closeSpectateConference';
        },
        // 成员-关闭旁观会议
        closeSpectateConference(btn) {
            this.apiSDK.closeSpectateConference(this.conferenceId)
            // let index = this.conferenceBtn.findIndex(item => item.event === 'closeSpectateConference')
            // this.$set(this.conferenceBtn, index, { title: '旁观会议', class: 'look', event: 'openSpectateConference' })
            btn.title = '旁观会议';
            btn.class = 'look';
            btn.event = 'openSpectateConference';
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
        // 主席-指定发言
        appointSpeaking() {
            let personArray = this.$refs.source_tree.getCheckedNodes()
            if (personArray.length == 0) {
                this.$message({message: '请指定一名成员', type: 'warning'})
            } else if (personArray.length != 1) {
                this.$message({message: '仅能指定一名成员发言', type: 'warning'})
            } else {
                if (personArray[0].inGroup == false) {
                    this.$message({message: '未入会成员不能指定发言', type: 'warning'})
                }
		        //else if (personArray[0].deviceType == Enum.enumDeviceType.HWMeetingTerminal) {
                //    this.$message({message: '一体机不能指定发言', type: 'warning'})
                //} 
		        else {
                    let memberIds = []
                    personArray.forEach(item => {
                        if(item.inGroup) memberIds.push({ userId: item.id })
                    })
                    if(memberIds.length > 0) this.apiSDK.appointSpeaking(this.conferenceId, memberIds)
                }
            }   
        },
        // 主席-收回发言
        cancelSpeakingByChairman() {
            this.apiSDK.cancelSpeakingByChairman(this.conferenceId)
        },
        // 主席-开启会议讨论
        startConferenceDiscussion(btn) {
            // let index = this.conferenceBtn.findIndex(item => item.event === 'startConferenceDiscussion')
            // this.$set(this.conferenceBtn, index, { title: '讨论模式', class: 'untalk', event: 'stopConferenceDiscussion' })
            this.apiSDK.startConferenceDiscussion(this.conferenceId);
            // btn.title = '讨论模式';
            btn.class = 'untalk';
            btn.event = 'stopConferenceDiscussion';
        },
        // 主席-关闭会议讨论
        stopConferenceDiscussion(btn) {
            // let index = this.conferenceBtn.findIndex(item => item.event === 'stopConferenceDiscussion')
            // this.$set(this.conferenceBtn, index, { title: '讨论模式', class: 'talk', event: 'startConferenceDiscussion' })
            this.apiSDK.stopConferenceDiscussion(this.conferenceId);
            // btn.title = '讨论模式';
            btn.class = 'talk';
            btn.event = 'startConferenceDiscussion';
        },
        pauseConference(btn){
            // let index = this.conferenceBtn.findIndex(item => item.event === 'pauseConference')
            // this.$set(this.conferenceBtn, index, { title: '恢复会议', class: 'resume', event: 'resumeConference' })
            this.apiSDK.pauseConference(this.conferenceId);
            btn.title = '恢复会议';
            btn.class = 'resume';
            btn.event = 'resumeConference';
        },
        resumeConference(btn){
            // let index = this.conferenceBtn.findIndex(item => item.event === 'resumeConference')
            // this.$set(this.conferenceBtn, index, { title: '暂停会议', class: 'pause', event: 'pauseConference' })
            this.apiSDK.resumeConference(this.conferenceId);
            btn.title = '暂停会议';
            btn.class = 'pause';
            btn.event = 'pauseConference';
        },
        // 主席-禁音所有成员
        muteConferenceAll(btn) {
            this.apiSDK.muteConferenceAll(this.conferenceId);
            btn.class = 'unmute';
            btn.event = 'cancelMuteConferenceAll';
        },
        // 主席-取消禁音所有成员
        cancelMuteConferenceAll(btn) {
            this.apiSDK.cancelMuteConferenceAll(this.conferenceId);
            btn.class = 'mute';
            btn.event = 'muteConferenceAll';
        },
        // 主席-关闭(临时/预设)会议
        stopConference() {
            this.apiSDK.stopConference(this.conferenceId);
        },
        // 成员-申请退出会议
        applyLeaveConference() {
            this.apiSDK.applyLeaveConference(this.conferenceId, this.isSpectator)
        },
        // 成员-申请发言
        applySpeaking() {
            this.apiSDK.applySpeakingByMember(this.conferenceId)
        },
        // 成员-取消发言
        finishSpeaking() {
            this.apiSDK.finishSpeaking(this.conferenceId)
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
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <span class={data.isJoinWhiteBoard == 'true' ? "whiteboard" : "set-hide"}></span>
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
    background: url(../../../../static/resPanelControl/add.png) no-repeat center top;
}
.add-user:hover{
    background: url(../../../../static/resPanelControl/add_hover.png) no-repeat center top;
}
.delete-user{
    background: url(../../../../static/resPanelControl/delete.png) no-repeat center top;
}
.blackboard{
    background: url(../../../../static/resPanelControl/stop.png) no-repeat center top;
}
.blackboard:hover{
    background: url(../../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
.delete-user:hover{
    background: url(../../../../static/resPanelControl/delete_hover.png) no-repeat center top;
}
.add-speak{
    background: url(../../../../static/resPanelControl/addspeak.png) no-repeat center top;
}
.add-speak:hover{
    background: url(../../../../static/resPanelControl/addspeak_hover.png) no-repeat center top;
}
.delete-speak{
    background: url(../../../../static/resPanelControl/deleteunspeak.png) no-repeat center top;
}
.delete-speak:hover{
    background: url(../../../../static/resPanelControl/deleteunspeak_hover.png) no-repeat center top;
}
.talk{
    background: url(../../../../static/resPanelControl/talk.png) no-repeat center top;
}
.untalk{
    background: url(../../../../static/resPanelControl/untalk.png) no-repeat center top;
}
.pause{
    background: url(../../../../static/resPanelControl/pause.png) no-repeat center top;
}
.resume{
    background: url(../../../../static/resPanelControl/resume.png) no-repeat center top;
}
.mute{
    background: url(../../../../static/resPanelControl/mute.png) no-repeat center top;
}
.unmute{
    background: url(../../../../static/resPanelControl/unmute.png) no-repeat center top;
}
.stop{
    background: url(../../../../static/resPanelControl/stop.png) no-repeat center top;
}
.stop:hover{
    background: url(../../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
.exit{
    background: url(../../../../static/resPanelControl/exit.png) no-repeat center top;
}
.exit:hover{
    background: url(../../../../static/resPanelControl/exit_hover.png) no-repeat center top;
}
.applyspeak{
    background: url(../../../../static/resPanelControl/addspeak.png) no-repeat center top;
}
.applyspeak:hover{
    background: url(../../../../static/resPanelControl/addspeak_hover.png) no-repeat center top;
}
.unspeak{
    background: url(../../../../static/resPanelControl/unspeak.png) no-repeat center top;
}
.unspeak:hover{
    background: url(../../../../static/resPanelControl/unspeak_hover.png) no-repeat center top;
}
.scheme-btn{
    background: url(../../../../static/resPanelControl/scheme.png) no-repeat center top;
}
.scheme-btn:hover{
    background: url(../../../../static/resPanelControl/scheme_hover.png) no-repeat center top;
}
.chairman{
    background: url(../../../../static/resPanelControl/chairman.png) no-repeat center top;
}
.chairman:hover{
    background: url(../../../../static/resPanelControl/chairman_hover.png) no-repeat center top;
}
.look{
    background: url(../../../../static/resPanelControl/look.png) no-repeat center top;
}
.unlook{
    background: url(../../../../static/resPanelControl/unlook.png) no-repeat center top;
}
.start-playing{
    background: url(../../../../static/resPanelControl/start_playing.png) no-repeat center top;
}
.stop-playing{
    background: url(../../../../static/resPanelControl/stop_playing.png) no-repeat center top;
}
.chairman-mini{
    background: url(../../../../static/resPanelControl/chairman-mini.png) no-repeat center top;
}
.meetingForward{
    background: url(../../../../static/resPanelControl/meetingForward.png) no-repeat center top;
}
.meetingForward:hover{
    background: url(../../../../static/resPanelControl/meetingForward_hover.png) no-repeat center top;
}
.meetingMassage{
    background: url(../../../../static/resPanelControl/meetingMassage.png) no-repeat center top;
}
.meetingMassage:hover{
    background: url(../../../../static/resPanelControl/meetingMassage_hover.png) no-repeat center top;
}
.shareScreen{
    background: url(../../../../static/resPanelControl/share_screen.png) no-repeat center top;
}
.shareScreen:hover{
    background: url(../../../../static/resPanelControl/share_screen_hover.png) no-repeat center top;
}
.noShareScreen{
    background: url(../../../../static/resPanelControl/share_screen_no.png) no-repeat center top;
}
.shareCamera{
    background: url(../../../../static/resPanelControl/share_camera.png) no-repeat center top;
}
.shareCamera:hover{
    background: url(../../../../static/resPanelControl/share_camera_hover.png) no-repeat center top;
}
.open-audio-mid{
    background: url(../../../../static/scene/ico_menu_opentone.png) no-repeat center top;
}
.open-audio-mid:hover{
    background: url(../../../../static/scene/ico_menu_opentone_active.png) no-repeat center top;
}
.close-audio-mid{
    background: url(../../../../static/scene/ico_menu_closedtone.png) no-repeat center top;
}
.close-audio-mid:hover{
    background: url(../../../../static/scene/ico_menu_closedtone_active.png) no-repeat center top;
}
.open-video-mid{
    background: url(../../../../static/scene/ico_menu_openvideo.png) no-repeat center top;
}
.open-video-mid:hover{
    background: url(../../../../static/scene/ico_menu_openvideo_active.png) no-repeat center top;
}
.close-video-mid{
    background: url(../../../../static/scene/ico_menu_closevideo_active.png) no-repeat center top;
}
.close-video-mid:hover{
    background: url(../../../../static/scene/ico_menu_closevideo.png) no-repeat center top;
}
.open-microphone-mid{
    background: url(../../../../static/scene/ico_menu_openwheat.png) no-repeat center top;
}
.open-microphone-mid:hover{
    background: url(../../../../static/scene/ico_menu_openwheat_active.png) no-repeat center top;
}
.close-microphone-mid{
    background: url(../../../../static/scene/ico_menu_closedwheat.png) no-repeat center top;
}
.close-microphone-mid:hover{
    background: url(../../../../static/scene/ico_menu_closedwheat_active.png) no-repeat center top;
}
.record{
    background: url(../../../../static/scene/ico_menu_recordingstart.png) no-repeat center top;
}
.record:hover{
    background: url(../../../../static/scene/ico_menu_recordingstart_active.png) no-repeat center top;
}
.recording{
    background: url(../../../../static/scene/ico_menu_recording.png) no-repeat center top;
}
.recording:hover{
    background: url(../../../../static/scene/ico_menu_closedwheat.png) no-repeat center top;
}
.sceneinfo{
    background: url(../../../../static/scene/ico_menu_information.png) no-repeat center top;
}
.sceneinfo:hover{
    background: url(../../../../static/scene/ico_menu_information_active.png) no-repeat center top;
}
.sceneperson{
    background: url(../../../../static/scene/ico_menu_rollcall.png) no-repeat center top;
}
.sceneperson:hover{
    background: url(../../../../static/scene/ico_menu_rollcall_active.png) no-repeat center top;
}
.ytcontrol{
     background: url(../../../../static/scene/ico_menu_controlpanell.png) no-repeat center top;
}
.ytcontrol:hover{
     background: url(../../../../static/scene/ico_menu_controlpanell_active.png) no-repeat center top;
}
</style>
