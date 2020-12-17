<template>
    <div class="conference">
        <p class="title" style="text-align:left;">【指挥】{{commandName}} {{ suspendCommand }}</p>
        <div class="content">
            <el-tree
                ref="source_tree"
                :data="treeData"
                :props="defaultProps"
                node-key="nodeId"
                :render-content="renderContent"
                show-checkbox
                @node-click="handleNodeClick"
                :check-strictly="true"
                default-expand-all>
            </el-tree>
        </div>
        <div class="btn-group" :class="commandBtn.length > 8 ? 'is-scroll' : ''">
            <el-button class="btn-group__prev" type="text" v-if="commandBtn.length > 8" @click="btnGroupPrev" :disabled="btnGroupScroll.prev" icon="el-icon-arrow-left"></el-button>
            <el-button class="btn-group__next" type="text" v-if="commandBtn.length > 8" @click="btnGroupNext" :disabled="btnGroupScroll.next" icon="el-icon-arrow-right"></el-button>
            <div class="btn-group-scroll">
                <div class="btn-group-list" :style="`width: ${commandBtn.length > 8 ? (Math.round(commandBtn.length/2)) * 75 + 'px' : 'auto'}; transform:translateX(${btnGroupTranslateLength}px)`">
                    <template v-for="item in commandBtn">
                        <el-button v-if="!item.isDropDown" :key="item.key" type="text" :title="item.title" :class="item.class" @click="getEvent(item)">{{item.title}}</el-button>
                        <div v-else class="dropdown">
                            <el-dropdown @command="dropMenuClick" trigger="click">
                              <el-button type="text" :title="item.title" :class="item.class">{{item.title}}</el-button>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="option in item.children" :key="option.key" :command="option.value">
                                    <span v-if="option.checked">√</span>{{option.label}}
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceEventData"/>
        <command-coordinate-dialog ref="CommandCoordinateDialog" :parent-msg="treeData"/>
        <command-concert-dialog ref="CommandConcertDialog" :parent-msg="treeData" />
        <command-distribute-dialog ref="CommandDistributeDialog"/>
        <command-forward-authorize-dialog ref="commandForwardAuthorizeDialog"/>
        <command-forward-dialog ref="commandForwardDialog"/>
        <meeting-massage-dialog ref="MeetingMassageDialog"/>
    </div>
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
import CommandCoordinateDialog from '@/components/videoCommand/CommandCoordinateDialog.vue';
import CommandConcertDialog from '@/components/videoCommand/CommandConcertDialog.vue';
import CommandDistributeDialog from '@/components/videoCommand/CommandDistributeDialog.vue';
import CommandForwardAuthorizeDialog from '@/components/videoCommand/CommandForwardAuthorizeDialog.vue';
import CommandForwardDialog from '@/components/videoCommand/CommandForwardDialog.vue';
import MeetingMassageDialog from '@/components/conference/MeetingMessageDialog.vue';
export default {
    name: 'videoCommandPanel',
    components: {
        SelectResource,
        CommandCoordinateDialog,
        CommandConcertDialog,
        CommandDistributeDialog,
        CommandForwardAuthorizeDialog,
        CommandForwardDialog,
        MeetingMassageDialog,
    },
    data () {
        return {
            isChairman: false,
            isCmdCalling: false, // 是否呼叫中
            isCmdCoordinating: false,
            treeData: [],
            commandId: '',
            commandName: '',
            senderId: xtxk.cache.get("USER").userId, // 发起者
            // receiverId: '', // 接收者
            // receiverId: '',
            defaultProps: {
                label: 'name',
                isLeaf: 'leaf'
            },
            commandBtn:  [],
            btnGroupScroll: {
                prev: true,
                next: false,
                currPage: 1,
            },
            btnGroupTranslateLength:0,
            scheme: {
                visible: false,
                data: [],
                schemeId: '',
            },
            // 被授权人id
            authorizeUserId:'',
            // 被接替人id
            takeoverId:'',
            suspendCommand: '',
            accreditList: {},
            supersedeList: {},

            isAuthorizedCommandForward:false,

            restoreData:[],

            remindCommandId:'',

            checkedUserId:null
        }
    },
    created() {

    },
    mounted() {
        if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
            this.apiSDK.queryCommandTransmitAuth(this.affairId);
            this.apiSDK.setReceiveCommandTransmitAuthCallBack((obj)=>{
                // console.log('获取指挥转发授权列表', JSON.stringify(obj));
                let arr = [];
                if( obj.length == 0 ){
                    this.isAuthorizedCommandForward = false;
                }else{
                    obj.forEach(item=>{
                        if( item.destId ){
                            this.isAuthorizedCommandForward = true;
                        }
                    });
                }
            });
        }
    },
    watch:{
        isAuthorizedCommandForward:{
            handler(){
                if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                    if( this.isAuthorizedCommandForward == true ){
                        this.commandBtn.splice(this.getCommandBtnIndex('结束指挥',this.commandBtn),0,{ title: '指挥转发', class: 'forword', event: 'memberCommandForward' })
                    }else{
                        this.commandBtn.splice(this.getCommandBtnIndex('指挥转发',this.commandBtn),1);
                    }
                }
            }
        },
    },
    methods: {
        toTree(data) {
            let result = [];
            if (!Array.isArray(data)) {
                return result;
            }
            data.forEach(item => {
                delete item.children;
            })
            let map = {};
            data.forEach(item => {
                map[item.id] = item;
            })
            data.forEach(item => {
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    result.push(item);
                }
            });
            return result;
        },
        // 数组转树格式
        composeTree(list, pid) {
            if(pid == undefined) pid = '';
            let tree = [];
            let temp;
            list.length && list.forEach((item, index) => {
                if (item.parentId ===  pid) { 
                    let obj = item;
                    if( !obj.children ){
                        obj.children = [];
                    }
                    temp = this.composeTree(list, item.id);
                    if (temp.length > 0) {
                        temp.forEach(element=>{
                            // obj.children.push(element);

                            //0619 修改
                            let isIN = obj.children.findIndex(item => item.id == element.id) 
                            if(isIN != -1){
                                obj.children.splice(isIN,1);
                            }
                            obj.children.push(element);
                        });
                    }
                    tree.push(obj);
                }
                // 0618 dj 修改 二级人员 添加成员  树形不显示问题
                else{   
                    if(item.parentId != '' && item.inGroup == true && temp){
                        if(!item.children){
                            item.children = []
                            this.fnTest(list,item)
                        }
                    }
                }
            });
            return tree;
            
        },
        // 0618 dj 修改 二级人员 添加成员  树形不显示问题
        fnTest(list,obj){
            for (let i in list) {
                if(list[i].id == obj.parentId && list[i].children) {
                        for (let j in list[i].children) {
                            if (list[i].children[j].id == obj.id) {
                                return
                            }
                        }
                        list[i].children.push(obj)
                    break;
                }else{
                    this.fnTest(list[i].children,obj)
                }
            }
            return list;
        },
        // 滚动按钮状态
        scrollBtnStatus(currpage, countPage) {
            if (currpage == 1) {
                this.btnGroupScroll.prev = true;
                this.btnGroupScroll.next = false;
                return;
            }
            if (currpage == countPage) {
                this.btnGroupScroll.prev = false;
                this.btnGroupScroll.next = true;
                return;
            }
            this.btnGroupScroll.prev = false;
            this.btnGroupScroll.next = false;
        },
        // 按钮上一页
        btnGroupPrev(event) {
            let pageCounts = Math.ceil(this.commandBtn.length/8);
            console.log('共'+pageCounts+'页');

            if (this.btnGroupScroll.currPage - 1 > 1 ) {
                if( this.commandBtn.length %8 == 0 ){
                    this.btnGroupTranslateLength = (this.btnGroupScroll.currPage - 1) * (-296);
                }else{
                    this.btnGroupTranslateLength = (this.btnGroupScroll.currPage - 2) * (-296);
                }
            }else if (this.btnGroupScroll.currPage - 1 == 1 ) {
                this.btnGroupTranslateLength = (this.btnGroupScroll.currPage - 2) * (-296);
            }
            console.log('this.btnGroupTranslateLength='+this.btnGroupTranslateLength);
            
            if (this.btnGroupScroll.currPage > 1) {
                this.btnGroupScroll.currPage -= 1;
                this.scrollBtnStatus(this.btnGroupScroll.currPage,pageCounts);
            }
            if (this.btnGroupScroll.currPage == 1) {
                this.btnGroupScroll.currPage = 1;
                this.scrollBtnStatus(this.btnGroupScroll.currPage,pageCounts);
            }

            let currentPage = this.btnGroupScroll.currPage;
            console.log('当前第'+currentPage+'页');
        },
        // 按钮下一页
        btnGroupNext(event) {
            let pageCounts = Math.ceil(this.commandBtn.length/8);
            console.log('共'+pageCounts+'页');

            if (this.btnGroupScroll.currPage + 1 < pageCounts ) {
                this.btnGroupTranslateLength = (this.btnGroupScroll.currPage) * (-296);
            }else if (this.btnGroupScroll.currPage + 1 == pageCounts ) {
                if( this.commandBtn.length %8 == 0 ){
                    this.btnGroupTranslateLength = (this.btnGroupScroll.currPage) * (-296);
                }else{
                    this.btnGroupTranslateLength = (Math.ceil(this.commandBtn.length/2) - 4) * (-296/4);
                }
            }
            console.log('this.btnGroupTranslateLength='+this.btnGroupTranslateLength);

            if (this.btnGroupScroll.currPage < pageCounts ) {
                this.btnGroupScroll.currPage += 1;
                this.scrollBtnStatus(this.btnGroupScroll.currPage,pageCounts);
            }
            if (this.btnGroupScroll.currPage == pageCounts) {
                this.btnGroupScroll.currPage = pageCounts;
                this.scrollBtnStatus(this.btnGroupScroll.currPage,pageCounts);
            }

            let currentPage = this.btnGroupScroll.currPage;
            console.log('当前第'+currentPage+'页');
        },
        getCommandBtnIndex(btnNameString, btnArray){
            let btnIndex = -1;
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
        initData(data_) {
            // console.log('------------------------ 指挥 init ------------------------');
            // console.log('初始化数据', JSON.stringify(data_) );
            if (data_ && data_.res) {
                let data = data_.res;
                this.commandId = data.conferenceId
                this.commandName = data.conferenceName

                if( data.operate === 'init' ){
                    this.clearTree();

                    if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                        if( data.authorize && data.authorize.resId ){
                            this.accreditList = {
                                userId: data.authorize.resId,
                                requestId:'',
                                type: 'StartAuthorize',
                            }
                        }
                        if( data.supersede && data.supersede.resId ){
                            this.supersedeList = {
                                userId: data.supersede.resId,
                                requestId:'',
                                type: 'StartSupersede',
                            }
                        }
                    }
                }

                if(data.init && data.init.members){
                    this.checkTreeNode(data.init.members);
                }
                if(data.init && data.init.devices){
                    this.checkTreeNode(data.init.devices);
                }

                if(data.refresh){
                    this.checkTreeNode(data.refresh);
                }

                if(data.addMember){
                    this.checkTreeNode(data.addMember);
                }
                if( data.operate === 'supersede' ) {
                        this.supersedeList = {
                            userId: data.upSilent.supersede.destId,
                            requestId: data.upSilent.supersede.requestId,
                            type: data.commandStatus
                        }
                       let supersede = [];
                       data.upSilent.supersede.users.forEach(item => {
                            var it ={}
                            it.resId = item.userId
                            it.resName = item.userName
                            if(item.status == "1"){
                            it.isOnline = "online";
                            }else if(item.status == "0"){
                            it.isOnline = "offline";
                            }else if(item.status == "2"){
                            it.isOnline ="breakdown"
                            }
                            it.inGroup = item.inGroup === "1" ? true : false;
                            //todo V5先当人处理
                            it.resType = 0
                            it.parentId = item.parentId
                            supersede.push(it)
                       });
                       this.checkTreeNode(supersede);
                        setTimeout(() => {
                            switch (this.supersedeList.type) {
                                case 'StartSupersede':
                                    if( this.supersedeList.requestId === xtxk.cache.get("USER").userId ) {
                                        // this.commandBtn.splice(8,1, { title: '停止接替', class: 'unTakeover', event: 'cancelTakeOverCommand' });
                                        this.commandBtn.splice(this.getCommandBtnIndex('接替指挥',this.commandBtn),1, { title: '停止接替', class: 'unTakeover', event: 'cancelTakeOverCommand' });
                                    }
                                    break;
                                case 'StopSupersede':
                                    if( this.supersedeList.requestId === xtxk.cache.get("USER").userId ) {
                                        // this.commandBtn.splice(8,1, { title: '接替指挥', class: 'takeover', event: 'startTakeOverCommand' });
                                        this.commandBtn.splice(this.getCommandBtnIndex('停止接替',this.commandBtn),1, { title: '接替指挥', class: 'takeover', event: 'startTakeOverCommand' });
                                    }
                                    break;
                            }
                        }, 0);
                }
                if( data.commandStatus === 'StartAuthorize' || data.commandStatus === 'StopAuthorize' ) {
                    if( data.upSilent.authorize ) {
                           this.accreditList = {
                               userId: data.upSilent.authorize.destId,
                               requestId: data.upSilent.authorize.requestId,
                               type: data.commandStatus
                           }
                        let addMembers = [];
                       data.upSilent.authorize.users.forEach(item => {
                            var it ={}
                            it.resId = item.userId
                            it.resName = item.userName
                            if(item.status == "1"){
                            it.isOnline = "online";
                            }else if(item.status == "0"){
                            it.isOnline = "offline";
                            }else if(item.status == "2"){
                            it.isOnline ="breakdown"
                            }
                            it.inGroup = item.inGroup === "1" ? true : false;
                            //todo V5先当人处理
                            it.resType = 0
                            it.parentId = item.parentId
                            addMembers.push(it)
                       });
                       this.checkTreeNode(addMembers);
                        setTimeout(() => {
                            switch (this.accreditList.type) {
                                case 'StartAuthorize':
                                    if( this.accreditList.requestId === xtxk.cache.get("USER").userId ) {
                                        // this.commandBtn.splice(7,1, { title: '停止授权', class: 'shouquan', event: 'cancelAuthorizeCommand' });
                                        this.commandBtn.splice(this.getCommandBtnIndex('授权指挥',this.commandBtn),1, { title: '停止授权', class: 'shouquan', event: 'cancelAuthorizeCommand' });
                                    }
                                    break;
                                case 'StopAuthorize':
                                    if( this.accreditList.requestId === xtxk.cache.get("USER").userId ) {
                                        // this.commandBtn.splice(7,1, { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' });
                                        this.commandBtn.splice(this.getCommandBtnIndex('停止授权',this.commandBtn),1, { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' });
                                    }
                                    break;
                            }
                        }, 0);
                    }
                }
                if(data.removeMember){
                    let treeObj = this.$refs.source_tree;
                    data.removeMember.forEach(item => {
                        var nodeId = item.resId + "_" + (item.resCh || 0);
                        const node = treeObj.getNode(nodeId);
                        // if(node) treeObj.remove(node.data);
                        if(node){
                            //图标处理
                            var resStatus = 0;
                            if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                            else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                            else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                            else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;
                            var busStatus = 0;
                            if(item.role == Enum.enumRoleType.speak) busStatus = Enum.enumBussStatus.Speaking;
                            var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus);

                            let namePrifex = "[未加入]";
                            node.data.nodeStatus = icon_;
                            node.data.name = item.resName + namePrifex;
                            node.data.inGroup = item.inGroup;
                        }
                    })
                }

                if( data.operate === 'pause' ){
                    // console.log('指挥返回暂停状态');
                    // data.pause.status: 0
                }

                if( data.operate === 'resume' ){
                    // console.log('指挥返回恢复状态');
                    // data.pause.status: 1
                }

                if( data.operate === 'upSilent' ){
                    console.log('指挥返回向上静默状态');
                    // data.upSilent.userId
                    // data.upSilent.isMute // true表示静默，false表示取消静默
                    // data.upSilent.model
                    if( data.upSilent.isMute ){
                        for( let i=0;i<this.commandBtn.length;i++ ){
                            let element = this.commandBtn[i];
                            if( element.children ){
                                for( let k=0;k<element.children.length;k++ ){
                                    let item = element.children[k];
                                    if( item.value.indexOf('upSilent') >-1 ){
                                        if( data.upSilent.model == item.id ){
                                            item.checked = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        for( let i=0;i<this.commandBtn.length;i++ ){
                            let element = this.commandBtn[i];
                            if( element.children ){
                                for( let k=0;k<element.children.length;k++ ){
                                    let item = element.children[k];
                                    if( item.value.indexOf('upSilent') >-1 ){
                                        if( data.upSilent.model == item.id ){
                                            item.checked = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if( data.operate === 'downSilent' ){
                    console.log('指挥返回向下静默状态');
                    // data.downSilent.userId
                    // data.downSilent.isMute // true表示静默，false表示取消静默
                    // data.downSilent.model
                    if( data.downSilent.isMute ){
                        for( let i=0;i<this.commandBtn.length;i++ ){
                            let element = this.commandBtn[i];
                            if( element.children ){
                                for( let k=0;k<element.children.length;k++ ){
                                    let item = element.children[k];
                                    if( item.value.indexOf('downSilent') >-1 ){
                                        if( data.downSilent.model == item.id ){
                                            item.checked = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        for( let i=0;i<this.commandBtn.length;i++ ){
                            let element = this.commandBtn[i];
                            if( element.children ){
                                for( let k=0;k<element.children.length;k++ ){
                                    let item = element.children[k];
                                    if( item.value.indexOf('downSilent') >-1 ){
                                        if( data.downSilent.model == item.id ){
                                            item.checked = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if( data.operate === 'authorize' ){
                    console.log('指挥返回授权状态');
                    if( data.authorize.status == '1' ){
                        this.authorizeUserId = data.authorize.destId;
                        this.commandBtn.forEach(item=>{
                            if( item.title.indexOf('授权') >-1 ){
                                // item.title = '取消授权指挥';
                                item.title = '停止授权';
                                item.class = 'unShouquan';
                                item.event = 'cancelAuthorizeCommand';
                            }
                        });
                    }else{
                        this.authorizeUserId = '';
                        this.commandBtn.forEach(item=>{
                            if( item.title.indexOf('授权') >-1 ){
                                item.title = '授权指挥';
                                item.class = 'shouquan';
                                item.event = 'startAuthorizeCommand';
                            }
                        });
                    }
                    if( data.authorize.users.length >0 ){
                        this.checkTreeNode(data.authorize.users);
                    }
                }

                if( data.operate === 'takeover' ){
                    console.log('指挥返回接替状态');
                    if( data.takeover.status == '1' ){
                        this.takeoverId = data.takeover.destId;
                        this.commandBtn.forEach(item=>{
                            if( item.title.indexOf('接替') >-1 ){
                                // item.title = '取消接替指挥';
                                item.title = '停止接替';
                                item.class = 'unTakeover';
                                item.event = 'cancelTakeOverCommand';
                            }
                        });
                    }else{
                        this.takeoverId = '';
                        this.commandBtn.forEach(item=>{
                            if( item.title.indexOf('接替') >-1 ){
                                item.title = '接替指挥';
                                item.class = 'takeover';
                                item.event = 'startTakeOverCommand';
                            }
                        });
                    }
                    if( data.takeover.users.length >0 ){
                        this.checkTreeNode(data.takeover.users);
                    }
                }
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                    this.treeData = this.composeTree(this.treeData)
                } else if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6&&data.operate === 'init'){
                    this.treeData = this.toTree(this.treeData);
                }
                let down = { title: '对下静默', class: 'down', event: 'down', value: 'downSilent2', checked: false, id:2};
                if (data.operate === 'init') {
                    if (this.isChairman) {
                        this.commandBtn = [
                            // { title: '添加成员', class: 'addUser', event: 'addMember' },
                            { title: this.isCmdCalling ? '结束呼叫' : '指挥呼叫', class: this.isCmdCalling ? 'stop_call' : 'call', event: 'callCommand' }, //startCommandCall
                            { title: this.isCmdCoordinating ? '结束越级' : '越级指挥', class: this.isCmdCoordinating ? 'all_stop_call' : 'all_call', event: 'crossCommand' },
                            // { title: '指挥强退', class: 'delete', event: 'kickCommandMember' },
                            // { title: '专向指挥', class: 'zhuanxiang', event: 'startSpecialCommand' },
                            // { title: '对下静默', class: 'down', isDropDown: true, children: [{ label: '音视频静默', value: 'downSilent0', id:0, checked:false },{ label: '音频静默', value: 'downSilent2', id:2, checked:false },{ label: '视频静默', value: 'downSilent1', id:1, checked:false }] },
                            // { title: '对上静默', class: 'up', isDropDown: true, children: [{ label: '音视频静默', value: 'upSilent0', id:0, checked:false },{ label: '音频静默', value: 'upSilent2', id:2, checked:false },{ label: '视频静默', value: 'upSilent1', id:1, checked:false }] },
                            // { title: '指挥转发', class: 'forword', event: 'commandForward' },
                            // { title: '指挥分派', class: 'fenpai', event: 'showDialog', openDialogName: 'CommandDistributeDialog' },
                            // { title: '协同指挥', class: 'xietong', event: 'showDialog', openDialogName: 'CommandCoordinateDialog' },
                            { title: '协调指挥', class: 'xietiao', event: 'showDialog', openDialogName: 'CommandConcertDialog' },//
                            // { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' },
                            // { title: '接替指挥', class: 'takeover', event: 'startTakeOverCommand' },
                            // { title: '暂停指挥', class: 'resume', event: 'pauseCommand' },
                            // { title: '恢复指挥', class: 'resume', event: 'resumeCommand' },
                            // { title: '指挥提醒', class: 'remind', event: 'stratRemindCommand' },
                            { title: '结束指挥', class: 'over', event: 'chairmanExitCommand' },
                            // { title: '即时消息', class: 'msg', event: 'showDialog', openDialogName: 'MeetingMassageDialog' },
                        ]
                       if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                            this.commandBtn = [
                                { title: '添加成员', class: 'addUser', event: 'addMember' },
                                // { title: '指挥呼叫', class: 'call', event: 'startCommandCall' },
                                { title: '指挥强退', class: 'delete', event: 'kickCommandMember' },
                                // { title: '专向指挥', class: 'zhuanxiang', event: 'startSpecialCommand' },
                                { title: '对下静默', class: 'down', isDropDown: true, children: [{ label: '音视频静默', value: 'downSilent0', id:0, checked:false },{ label: '音频静默', value: 'downSilent2', id:2, checked:false },{ label: '视频静默', value: 'downSilent1', id:1, checked:false }] },
                                // { title: '对上静默', class: 'up', isDropDown: true, children: [{ label: '音视频静默', value: 'upSilent0', id:0, checked:false },{ label: '音频静默', value: 'upSilent2', id:2, checked:false },{ label: '视频静默', value: 'upSilent1', id:1, checked:false }] },
                                { title: '指挥转发', class: 'forword', event: 'commandForward' },
                                // { title: '指挥分派', class: 'fenpai', event: 'showDialog', openDialogName: 'CommandDistributeDialog' },
                                { title: '协同指挥', class: 'xietong', event: 'showDialog', openDialogName: 'CommandCoordinateDialog' },
                                { title: '协调指挥', class: 'xietiao', event: 'showDialog', openDialogName: 'CommandConcertDialog' },//CommandConcertDialog
                                { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' },
                                { title: '接替指挥', class: 'takeover', event: 'startTakeOverCommand' },
                                { title: '暂停指挥', class: 'resume', event: 'pauseCommand' },
                                // { title: '恢复指挥', class: 'resume', event: 'resumeCommand' },
                                { title: '指挥提醒', class: 'remind', event: 'stratRemindCommand' },
                                { title: '结束指挥', class: 'over', event: 'chairmanExitCommand' },
                                // { title: '即时消息', class: 'msg', event: 'showDialog', openDialogName: 'MeetingMassageDialog' },
                            ]
                            // this.commandBtn.splice( 3, 1, down);
                            this.commandBtn.splice(this.getCommandBtnIndex('对下静默',this.commandBtn),1,down);
                            this.commandBtn.splice(this.getCommandBtnIndex('指挥转发',this.commandBtn),0,{ title: '转发授权', class: 'forword', event: 'commandForwardAuthorize' })
                       }
                    } else {
                        this.commandBtn = [
                            // { title: '添加成员', class: 'addUser', event: 'addMember' },
                            // { title: '指挥强退', class: 'delete', event: 'kickCommandMember' },
                            { title: this.isCmdCalling ? '结束呼叫' : '指挥呼叫', class: this.isCmdCalling ? 'stop_call' : 'call', event: 'callCommand' }, //startCommandCall
                            { title: this.isCmdCoordinating ? '结束越级' : '越级指挥', class: this.isCmdCoordinating ? 'all_stop_call' : 'all_call', event: 'crossCommand' },
                            { title: '协调指挥', class: 'xietiao', event: 'showDialog', openDialogName: 'CommandConcertDialog' },
                            // { title: '专向指挥', class: 'zhuanxiang', event: 'startSpecialCommand' },
                            // { title: '对上静默', class: 'up', isDropDown: true, children: [{ label: '音视频静默', value: 'upSilent0', id:0, checked:false },{ label: '音频静默', value: 'upSilent2', id:2, checked:false },{ label: '视频静默', value: 'upSilent1', id:1, checked:false }] },
                            // { title: '对下静默', class: 'down', isDropDown: true, children: [{ label: '音视频静默', value: 'downSilent0', id:0, checked:false },{ label: '音频静默', value: 'downSilent2', id:2, checked:false },{ label: '视频静默', value: 'downSilent1', id:1, checked:false }] },
                            // { title: '指挥分派', class: 'fenpai', event: 'showDialog', openDialogName: 'CommandDistributeDialog' },
                            // { title: '即时消息', class: 'msg', event: 'showDialog', openDialogName: 'MeetingMassageDialog' },
                            // { title: '协同指挥', class: 'xietong', event: 'showDialog', openDialogName: 'CommandCoordinateDialog' },
                            // { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' },
                            // { title: '协调指挥', class: 'xietiao', event: 'showDialog', openDialogName: 'CommandConcertDialog' },
                            // { title: '指挥转发', class: 'forword', event: 'showDialog', openDialogName: 'CommandForwardDialog' },
                            // { title: '指挥提醒', class: 'remind', event: 'stratRemindCommand' },
                            // { title: '结束指挥', class: 'over', event: 'memberExitCommand' },
                        ]
                        if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                            this.commandBtn = [
                                { title: '添加成员', class: 'addUser', event: 'addMember' },
                                { title: '指挥强退', class: 'delete', event: 'kickCommandMember' },
                                { title: '指挥呼叫', class: 'call', event: 'startCommandCall' },
                                // { title: '专向指挥', class: 'zhuanxiang', event: 'startSpecialCommand' },
                                { title: '对上静默', class: 'up', isDropDown: true, children: [{ label: '音视频静默', value: 'upSilent0', id:0, checked:false },{ label: '音频静默', value: 'upSilent2', id:2, checked:false },{ label: '视频静默', value: 'upSilent1', id:1, checked:false }] },
                                { title: '对下静默', class: 'down', isDropDown: true, children: [{ label: '音视频静默', value: 'downSilent0', id:0, checked:false },{ label: '音频静默', value: 'downSilent2', id:2, checked:false },{ label: '视频静默', value: 'downSilent1', id:1, checked:false }] },
                                // { title: '指挥分派', class: 'fenpai', event: 'showDialog', openDialogName: 'CommandDistributeDialog' },
                                // { title: '即时消息', class: 'msg', event: 'showDialog', openDialogName: 'MeetingMassageDialog' },
                                { title: '协同指挥', class: 'xietong', event: 'showDialog', openDialogName: 'CommandCoordinateDialog' },
                                // { title: '授权指挥', class: 'shouquan', event: 'startAuthorizeCommand' },
                                { title: '协调指挥', class: 'xietiao', event: 'showDialog', openDialogName: 'CommandConcertDialog' },
                                // { title: '指挥转发', class: 'forword', event: 'showDialog', openDialogName: 'CommandForwardDialog' },
                                { title: '指挥提醒', class: 'remind', event: 'stratRemindCommand' },
                                { title: '结束指挥', class: 'over', event: 'memberExitCommand' },
                            ]
                            // this.commandBtn.splice( 1, 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} )
                            this.commandBtn.splice( this.getCommandBtnIndex('对上静默',this.commandBtn), 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} )
                            
                            // this.commandBtn.splice( 2, 1, down );
                            this.commandBtn.splice( this.getCommandBtnIndex('对下静默',this.commandBtn), 1, down );

                            if( data.pause.status == 0 ){
                                this.suspendCommand = '(指挥暂停中)';
                            }else{
                                this.suspendCommand = '';
                            }
                        }
                    }
                }
                if( data.operate === 'pause'  ) {
                    this.suspendCommand = '(指挥暂停中)';
                    if( data.userId == xtxk.cache.get("USER").userId  ) {
                    //    this.commandBtn.splice( 9, 1, { title: '恢复指挥', class: 'pause', event: 'resumeCommand' });
                       this.commandBtn.splice( this.getCommandBtnIndex('暂停指挥',this.commandBtn), 1, { title: '恢复指挥', class: 'pause', event: 'resumeCommand' });
                    }
                } else if( data.operate === 'resume' ) {
                    this.suspendCommand = '';
                    if( data.userId == xtxk.cache.get("USER").userId ) {
                    //   this.commandBtn.splice( 9, 1, { title: '暂停指挥', class: 'resume', event: 'pauseCommand' });
                      this.commandBtn.splice( this.getCommandBtnIndex('恢复指挥',this.commandBtn), 1, { title: '暂停指挥', class: 'resume', event: 'pauseCommand' });
                    }
                }
                if( data.operate === 'startAndStop' ) {
                    if (this.isChairman) {
                            // 收到informCommandStatus时startdownslient时，若userid为自己则将对下静默改为停止对下静默，否则在指挥区域对人员显示对下静默状态
                            if(  this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5  ) {
                                if( data.upSilent && data.upSilent.userId == xtxk.cache.get("USER").userId  ) {
                                    if( data.commandStatus === 'StartDownSilent' ) {
                                    //   this.commandBtn.splice( 3, 1, { title: '停止对下静默', class: 'downStop', event: 'down', value: 'downSilent2', checked: true, id:2});
                                      this.commandBtn.splice( this.getCommandBtnIndex('对下静默',this.commandBtn), 1, { title: '停止对下静默', class: 'downStop', event: 'down', value: 'downSilent2', checked: true, id:2});
                                    } else if(data.commandStatus === 'StopDownSilent') {
                                    //    this.commandBtn.splice( 3, 1, down);
                                       this.commandBtn.splice( this.getCommandBtnIndex('停止对下静默',this.commandBtn), 1, down);
                                    }
                                } else {
                                    // this.commandBtn.splice( 3, 1, down);
                                    //0619dj 修改  结束指挥 被替换 对下静默      0620 下级成员点击对上静默后，主席不会停止对下静默
                                    // if(this.getCommandBtnIndex('停止对下静默',this.commandBtn) > -1)
                                    // this.commandBtn.splice( this.getCommandBtnIndex('停止对下静默',this.commandBtn), 1, down);
                                }
                            }
                    } else {
                            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5   ) {
                                if( data.upSilent && data.upSilent.userId == xtxk.cache.get("USER").userId  ) {
                                    switch (data.commandStatus) {
                                        case 'StartUpSilent':
                                            // this.commandBtn.splice( 1, 1, { title: '停止对上静默', class: 'upStop', event: 'upQuiet', value: 'upSilent2', checked: true , id:2} );
                                            this.commandBtn.splice( this.getCommandBtnIndex('对上静默',this.commandBtn), 1, { title: '停止对上静默', class: 'upStop', event: 'upQuiet', value: 'upSilent2', checked: true , id:2} );
                                            break;
                                        // case 'stopupslient':
                                        //         this.commandBtn.splice( 1, 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} )
                                        //     break;
                                        case 'StartDownSilent':
                                            // this.commandBtn.splice( 2, 1, { title: '停止对下静默', class: 'downStop', event: 'down', value: 'downSilent2', checked: true, id:2});
                                            this.commandBtn.splice( this.getCommandBtnIndex('对下静默',this.commandBtn), 1, { title: '停止对下静默', class: 'downStop', event: 'down', value: 'downSilent2', checked: true, id:2});
                                            break;
                                        case 'StopUpSilent':
                                                // this.commandBtn.splice( 1, 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} );
                                                this.commandBtn.splice( this.getCommandBtnIndex('停止对上静默',this.commandBtn), 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} );
                                            break;
                                        case 'StopDownSilent':
                                            //  this.commandBtn.splice( 2, 1, down );
                                             this.commandBtn.splice( this.getCommandBtnIndex('停止对下静默',this.commandBtn), 1, down );
                                            break;
                                    }
                                } else {
                                    // this.commandBtn.splice( 1, 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} )
                                    //0620 dj  对上静默，停止自己的上级图像
                                    //         对下静默，停止自己的下级图像
                                    // // 0619dj  修改静默 改变添加按钮
                                    // if(this.getCommandBtnIndex('停止对上静默',this.commandBtn) > -1)
                                    // this.commandBtn.splice( this.getCommandBtnIndex('停止对上静默',this.commandBtn), 1, { title: '对上静默', class: 'up', event: 'upQuiet', value: 'upSilent2', checked: false , id:2} )
                                    // // this.commandBtn.splice( 2, 1, down );
                                    // // 0619dj  修改静默 改变添加按钮
                                    // if(this.getCommandBtnIndex('停止对下静默',this.commandBtn) > -1)
                                    // this.commandBtn.splice( this.getCommandBtnIndex('停止对下静默',this.commandBtn), 1, down );
                                }
                            }
                    }
                }
                if( data.operate === 'commutateAndAuthorize' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                    // this.commandConcertList = data;
                    this.$refs.CommandConcertDialog.setList(data); 
                } else {
                    // 只可对自己的下级协调
                    // let suboridinate =this.treeData.find(item => (item.id === xtxk.cache.get("USER").userId)) 
                    // this.$refs.CommandConcertDialog.setList(data); 
                }
                if( data.operate === 'commandCoordinate' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                    this.$refs.CommandCoordinateDialog.setList(data);
                }

            }
        },
        getEvent(btn) {
            if( btn.event ){
                this[btn.event](btn);
            }
        },
        // 在版本5中 点击对下静默 等于直接点击 音频静默
        down() {
           this.dropMenuClick('downSilent2');
        },
        // 在版本5中 点击对上静默 等于直接点击 音频静默
        upQuiet() {
            this.dropMenuClick('upSilent2');
        },
        showDialog(btn) {
            this.$refs[btn.openDialogName].showDialog(this.commandId);
        },
        // 主席-指挥转发授权
        commandForwardAuthorize(){
            this.$refs.commandForwardAuthorizeDialog.showDialog(this.commandId,this.treeData);
        },
        // 主席-指挥转发
        commandForward(){
            this.$refs.commandForwardDialog.showDialog(this.commandId,this.treeData);
        },
        // 成员-指挥转发
        memberCommandForward(){
            // 获取指挥转发成员
            this.apiSDK.queryCommandTansmitMember(this.commandId);
            this.apiSDK.setReceiveCommandTransmitMemberCallBack((obj)=>{
                    // console.log('获取指挥转发成员', JSON.stringify(obj));
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
                    this.$refs.commandForwardDialog.showDialog(this.commandId,forwardTreeData);
                });
        },
        dropMenuClick(command) {
            // console.log(JSON.stringify(this.commandBtn));
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ) {
                for( let i=0;i<this.commandBtn.length;i++ ){
                    let element = this.commandBtn[i];
                    if( element.children ){
                        for( let k=0;k<element.children.length;k++ ){
                            let item = element.children[k];
                            if( item.checked === true ){
                                if( command.indexOf('downSilent' ) >-1){
                                    this.cancelCommandSilence(false, item.id);
                                }else if( command.indexOf('upSilent' ) >-1){
                                    this.cancelCommandSilence(true, item.id);
                                }
                            }
                        }
                    }
                }
                for( let i=0;i<this.commandBtn.length;i++ ){
                    let element = this.commandBtn[i];
                    if( element.children ){
                        for( let k=0;k<element.children.length;k++ ){
                            let item = element.children[k];
                            if( item.value === command ){
                                if( command.indexOf('downSilent' ) >-1){
                                    if( item.checked === true ){
                                        this.cancelCommandSilence(false, item.id);
                                    }else{
                                        this.startCommandSilence(false, item.id);
                                    }
                                }else if( command.indexOf('upSilent' ) >-1){
                                    if( item.checked === true ){
                                        this.cancelCommandSilence(true, item.id);
                                    }else{
                                        this.startCommandSilence(true, item.id);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            } else if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                // this.commandBtn.forEach(item => {
                //     if( item.checked === true ){
                //         if( command.indexOf('downSilent' ) >-1 ){
                //             this.cancelCommandSilence(false, item.id);
                //         }else if( command.indexOf('upSilent' ) >-1){
                //             this.cancelCommandSilence(true, item.id);
                //         }
                //     }
                // });
                console.log(command)
                for( let i=0;i<this.commandBtn.length;i++ ){
                    let item = this.commandBtn[i];
                    if( item.value === command ){
                        if( command.indexOf('downSilent') >-1){
                            if( item.checked === true ){
                                console.log('对下静默 关闭');
                                this.cancelCommandSilence(false, item.id);
                            }else{
                                console.log('对下静默 开启');
                                this.startCommandSilence(false, item.id);
                            }
                        }else if( command.indexOf('upSilent') >-1){
                            if( item.checked === true ){
                                console.log('对上静默 关闭');
                                this.cancelCommandSilence(true, item.id);
                            }else{
                                console.log('对上静默 开启');
                                this.startCommandSilence(true, item.id);
                            }
                        }
                        break;
                    }
                }
            }
        },
        // 标记授权
        accreditOperate(item) {
                let accredit = '';
                // item.checked = false;
                if ( this.accreditList.userId === item.resId ) {
                    switch (this.accreditList.type) {
                        case 'StartAuthorize':
                             accredit = "[被授权]";
                            break;
                    }
                }
                return accredit;
        },
        // 标记接替指挥
        supersedeOperate(item) {
                let supersede = '';
                // item.checked = false;
                if ( this.supersedeList.userId === item.resId ) {
                    switch (this.supersedeList.type) {
                        case 'StartSupersede':
                             supersede = "[被接替]";
                            break;
                    }
                }
                return supersede;
        },
        //node判断
        checkTreeNode: function(list){
            let treeObj = this.$refs.source_tree;
            let isChangeLevel = false;
            let treeData = [];
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                let nodeIds = item.resId + "_" + (item.resCh || 0);
                const node = treeObj.getNode(nodeIds);
                if(node){
                    if( node.data.parentId != item.parentId ){
                        isChangeLevel = true;
                    }
                }
            }
            // console.log('isChangeLevel='+isChangeLevel);
            // console.log(list)
            if( isChangeLevel === true ){
                this.treeData = [];
                for(var i = 0, l = list.length; i < l; i++){
                    var item = list[i];
                    let nodeId = item.resId + "_" + (item.resCh || 0);
                    //图标处理
                    var resStatus = 0;
                    if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;
                    var busStatus = 0;
                    if(item.role == Enum.enumRoleType.speak) busStatus = Enum.enumBussStatus.Speaking;
                    var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus);

                    var namePrifex = "";
                    if(resStatus == 1 && item.inGroup == true)  namePrifex = "[已加入]";
                    if(resStatus == 1 && item.inGroup == false)  namePrifex = "[未加入]";

                    // var status = "",statusObj={'cmdCalling':'[指挥呼叫中]','cmdCoordinating':'[协调指挥中]','cmdCrossing':'[越级指挥中]'};
                    // status=statusObj[item.status];
                    // 是否指挥呼叫中
                    if (item.resId === xtxk.cache.get('USER').userId) {
                        this.isCmdCalling = item.isOnline === 'cmdCalling' ? true : false;
                        this.isCmdCoordinating = item.isOnline === 'cmdCrossing' ? true : false;
                    }
                    let isAccredit = this.accreditOperate(item);
                    let isSupersede = this.supersedeOperate(item);
                    var data = {
                        nodeId:         nodeId,
                        id:             item.resId,
                        name:           item.resName + namePrifex + isAccredit + isSupersede + item.businessStatus ,
                        resourceType:   item.resType,
                        nodeStatus:     icon_,
                        resCh:          item.resCh || 0,
                        inGroup:        item.inGroup,
                        parentId:       item.parentId,
                        businessStatus: item.businessStatus
                    };
                    // console.log('terr111----', JSON.stringify(data));
                    this.treeData.push(data)                        

                }
            }else{
                for(var i = 0, l = list.length; i < l; i++){
                    var item = list[i];
                    let nodeIdSon = item.resId + "_" + (item.resCh || 0);

                    //主席节点
                    if (item.role === Enum.enumRoleType.chairman) {
                        this.isChairman = item.resId === xtxk.cache.get('USER').userId ? true : false
                    }

                    //图标处理
                    var resStatus = 0;
                    if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                    else if(item.isOnline =="cmdCalling") resStatus = 1;
                    else if(item.isOnline == "cmdCoordinating") resStatus = 1;
                    else if(item.isOnline == "cmdCrossing") resStatus = 1;
                    else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;
                    var busStatus = 0;
                    if(item.role == Enum.enumRoleType.speak) busStatus = Enum.enumBussStatus.Speaking;
                    var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus);

                    var namePrifex = "";
                    if(resStatus == 1 && item.inGroup == true)  namePrifex = "[已加入]";
                    if(resStatus == 1 && item.inGroup == false)  namePrifex = "[未加入]";

                    var status = "",statusObj={'cmdCalling':'[指挥呼叫中]','cmdCoordinating':'[协调指挥中]','cmdCrossing':'[越级指挥中]'};
                    status=statusObj[item.isOnline];
                    status?namePrifex='':status='';
                    
                    if (item.resId === xtxk.cache.get('USER').userId) {
                        this.isCmdCalling = item.isOnline === 'cmdCalling' ? true : false;
                        this.isCmdCoordinating = item.isOnline === 'cmdCrossing' ? true : false;
                    }
                    let isAccredit = this.accreditOperate(item);
                    let isSupersede = this.supersedeOperate(item);
                    const node = treeObj.getNode(nodeIdSon);
                    if(node){//刷新
                        node.data.nodeStatus = icon_;
                        node.data.name = item.resName + namePrifex + isAccredit + isSupersede +status;
                        node.data.inGroup = item.inGroup;
                    }else{//添加
                        var data = {
                            nodeId:         nodeIdSon,
                            id:             item.resId,
                            name:           item.resName + namePrifex + isAccredit + isSupersede +status,
                            resourceType:   item.resType,
                            nodeStatus:     icon_,
                            resCh:          item.resCh || 0,
                            inGroup:        item.inGroup,
                            parentId:       item.parentId,
                        };
                        this.treeData.push(data)
                    }
                    // console.log('=========================================='+ JSON.stringify(this.treeData));

                }
            }
            // console.log(treeData);
            // this.treeData=treeData;
            // this.treeData = JSON.parse(JSON.stringify(this.treeData));
            console.log('this.111111', JSON.parse(JSON.stringify(this.treeData)));
            console.log('this.222222', this.treeData);
        },
        // 从选择资源组件传出
        resourceEventData(resourceEvent){
          let members = []
          resourceEvent[0].forEach( (item,index) => {
            members.push({
                index: index,userId: item.id, userName: item.name
            })
          });
        //   this.apiSDK.startCommandCall(this.commandId, members);

        },
        // 验证选择人员设备
        valiChecked() {
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请至少选择一名参会成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能强退未入会成员', type: 'warning'});
                return;
            }
            if (checked.length > 1) {
                this.$message({message: '只能选择一名参会成员', type: 'warning'});
                return;
            }
            this.senderId = checked[0];
        },
        // 添加成员
        addMember(){
            if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
                let personArray = this.$refs.source_tree.getCheckedNodes();
                if( personArray.length ) {
                    let members = [];
                    personArray.forEach((item, index) => {
                        if (!item.inGroup) {
                            members.push({
                                index: index,userId: item.id, userName: item.name, resourceType: item.deviceType == Enum.enumDeviceType.HWMeetingTerminal ? 'Device' : 'User'
                            })
                        }
                    });
                    if(members.length > 0){
                        this.apiSDK.startCommandCall(this.commandId, members);
                    } else {
                        this.$message({message: '选择成员已入会！', type: 'warning'})
                    }
                } else {
                    this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.commandAddMember);
                }
            }else if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6){
                this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.commandAddMember,undefined,undefined,undefined,'指挥呼叫');
            }
        },
        // 指挥呼叫
        startCommandCall() {
            // this.valiChecked();
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请至少选择一名参加成员', type: 'warning'});
                return;
            }
            // 不能呼叫已加入成员
            if (checked.length === 1 && checked[0].inGroup == true) {
                this.$message({message: '不能呼叫已加入成员', type: 'warning'});
                return;
            }
            let isAllIn = 0;
            checked.forEach((item)=>{
                if( item.inGroup === true ){
                    isAllIn += 1;
                }
            });
            if( isAllIn === checked.length ){
                this.$message({message: '不能呼叫已加入成员', type: 'warning'});
                return;
            }
            // 只能呼叫下一级成员
            if (checked.length === 1 && checked[0].parentId != this.senderId) {
                this.$message({message: '只能呼叫下一级成员', type: 'warning'});
                return;
            }
            let isAllSub = 0;
            checked.forEach((item)=>{
                if( item.parentId != this.senderId ){
                    isAllSub += 1;
                }
            });
            if( isAllSub === checked.length ){
                this.$message({message: '只能呼叫下一级未加入成员', type: 'warning'});
                return;
            }

            let users = [];
            checked.forEach((item)=>{
                if( item.inGroup === false && item.parentId == this.senderId ){
                    users.push({
                        userId:item.id,
                    });
                }
            });
            this.apiSDK.startCommandCall(this.commandId, users);
        },
        callCommand(btn) {
            if (btn.class === 'call') {
                let checked = this.$refs.source_tree.getCheckedNodes()
                if (checked.length !== 1) {
                    this.$message({message: '请选择一名参加成员', type: 'warning'});
                    return;
                }
                // 只能呼叫下一级成员
                if (checked[0].parentId != this.senderId) {
                    this.$message({message: '只能选择下一级成员', type: 'warning'});
                    return;
                }
                this.checkedUserId=checked[0].id;
                this.apiSDK.startCommandCall(this.commandId, this.checkedUserId);
            } else {
                this.apiSDK.cancelCrossCommand(this.commandId, '');
            }
        },
        // 越级指挥
        crossCommand(btn) {
            if (btn.class === 'all_call') {
                let checked = this.$refs.source_tree.getCheckedNodes()
                if (checked.length!==1) {
                    this.$message({message: '请选择一名参加成员', type: 'warning'});
                    return;
                }
                // 只能呼叫下一级成员
                if (checked[0].parentId === this.senderId) {
                    this.$message({message: '只能选择非直接下级成员', type: 'warning'});
                    return;
                }
                this.checkedUserId=checked[0].id;
                this.apiSDK.startCrossCommand(this.commandId, this.checkedUserId);
            } else {
                this.apiSDK.cancelCrossCommand(this.commandId, '');
            }
        },
        // 开启专向指挥
        startSpecialCommand(btn) {
            // this.valiChecked();
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能选择未加入成员', type: 'warning'});
                return;
            }
            if (checked.length > 1){
                this.$message({message: '只能选择一名参加成员', type: 'warning'});
                return;
            }
            let userId = checked[0].id;
            let model = 1;
            this.apiSDK.startSpecialCommand(this.commandId, userId, model);
            btn.title = '取消专向';
            btn.class = 'quxiaozhuanxiang';
            btn.event = 'cancelSpecialCommand';
        },
        // 取消专向指挥
        cancelSpecialCommand(btn) {
            // this.valiChecked();
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能选择未加入成员', type: 'warning'});
                return;
            }
            if (checked.length > 1){
                this.$message({message: '只能选择一名参加成员', type: 'warning'});
                return;
            }
            let userId = checked[0].id;
            let model = 1;
            this.apiSDK.cancelSpecialCommand(this.commandId, userId, model);
            btn.title = '专向指挥';
            btn.class = 'zhuanxiang';
            btn.event = 'startSpecialCommand';
        },
        // 开启指挥静默
        startCommandSilence(upOrDown,mediaType){
            // upOrDown:true为对上静默,false是对下静默
            // mediaType: -1:无,2:音频,1:视频,0.音视频
            this.apiSDK.startCommandSilence(this.commandId, upOrDown, mediaType);
        },
        // 关闭指挥静默
        cancelCommandSilence(upOrDown,mediaType){
            // upOrDown:true为对上静默,false是对下静默
            // mediaType: -1:无,2:音频,1:视频,0.音视频
            this.apiSDK.cancelCommandSilence(this.commandId, upOrDown, mediaType);
        },
        // 开启授权指挥
        startAuthorizeCommand() {
            // this.valiChecked();
            // if( !this.authorizeUserId ){
                let checked = this.$refs.source_tree.getCheckedNodes()
                if (checked.length === 0) {
                    this.$message({message: '请选择一名参加成员', type: 'warning'});
                    return;
                }
                if (checked.length === 1 && checked[0].inGroup == false) {
                    this.$message({message: '不能选择未加入成员', type: 'warning'});
                    return;
                }
                if (checked.length > 1){
                    this.$message({message: '只能选择一名参加成员', type: 'warning'});
                    return;
                }
                let userId = checked[0].id;
                this.apiSDK.startAuthorizeCommand(this.commandId, userId);
            // }else{
                // this.cancelAuthorizeCommand();
            // }
        },
        // 停止授权指挥
        cancelAuthorizeCommand() {
            // console.log('commandId', this.commandId);
            // console.log('authorizeUserId', this.authorizeUserId);
            let checked = this.$refs.source_tree.getCheckedNodes()
                if (checked.length === 0) {
                    this.$message({message: '请选择一名参加成员', type: 'warning'});
                    return;
                }
                if (checked.length === 1 && checked[0].inGroup == false) {
                    this.$message({message: '不能选择未加入成员', type: 'warning'});
                    return;
                }
                if (checked.length > 1){
                    this.$message({message: '只能选择一名参加成员', type: 'warning'});
                    return;
                }
            let userId = checked[0].id;
            // let checked = this.$refs.source_tree.getCheckedNodes();
            this.apiSDK.cancelAuthorizeCommand(this.commandId, userId);
        },
        // 开启接替指挥
        startTakeOverCommand() {
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能选择未加入成员', type: 'warning'});
                return;
            }
            if (checked.length > 1){
                this.$message({message: '只能选择一名参加成员', type: 'warning'});
                return;
            }
            let userId = checked[0].id;
            this.apiSDK.startTakeOverCommand(this.commandId, userId);
        },
        // 停止接替指挥
        cancelTakeOverCommand() {
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能选择未加入成员', type: 'warning'});
                return;
            }
            if (checked.length > 1){
                this.$message({message: '只能选择一名参加成员', type: 'warning'});
                return;
            }
            let userId = checked[0].id;
            console.log('停止接替指挥', JSON.stringify(this.takeoverId));
            this.apiSDK.cancelTakeOverCommand(this.commandId, userId);
        },
        // 指挥强退
        kickCommandMember() {
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请至少选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能强退未加入成员', type: 'warning'});
                return;
            }
            let isAllIn = 0;
            checked.forEach((item)=>{
                if( item.inGroup === false ){
                    isAllIn += 1;
                }
            });
            if( isAllIn === checked.length ){
                this.$message({message: '不能强退未加入成员', type: 'warning'});
                return;
            }
            let users = [];
            checked.forEach((item)=>{
                if( item.inGroup === true ){
                    users.push({
                        userId:item.id,
                    });
                }
            });
            this.apiSDK.kickCommandMember(this.commandId, users);
        },
        // 暂停指挥
        pauseCommand(btn){
            this.apiSDK.pauseCommand(this.commandId);
            // btn.title = '恢复指挥';
            // btn.class = 'pause';
            // btn.event = 'resumeCommand';
        },
        // 恢复指挥
        resumeCommand(btn){
            this.apiSDK.resumeCommand(this.commandId);
            // btn.title = '暂停指挥';
            // btn.class = 'resume';
            // btn.event = 'pauseCommand';
        },
        // 结束指挥-发起者
        chairmanExitCommand(){
            this.apiSDK.stopCommand(this.commandId);
        },
        // 申请结束指挥-成员
        memberExitCommand(){
            this.apiSDK.applyLeaveCommand(this.commandId);
        },
        // 开启指挥提醒
        stratRemindCommand(btn){
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请选择一名参加成员', type: 'warning'});
                return;
            }
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '不能选择未加入成员', type: 'warning'});
                return;
            }
            if (checked.length > 1){
                this.$message({message: '只能选择一名参加成员', type: 'warning'});
                return;
            }
            // let userId = checked[0].id;
            this.remindCommandId = checked[0].id;
            this.apiSDK.startForespeakCommand(this.commandId, this.remindCommandId);
            btn.title = '停止指挥提醒';
            btn.class = 'remind';
            btn.event = 'stopRemindCommand';
        },
        // 停止指挥提醒
        stopRemindCommand(btn){
            // let checked = this.$refs.source_tree.getCheckedNodes()
            // if (checked.length === 0) {
            //     this.$message({message: '请选择一名参加成员', type: 'warning'});
            //     return;
            // }
            // if (checked.length === 1 && checked[0].inGroup == false) {
            //     this.$message({message: '不能选择未加入成员', type: 'warning'});
            //     return;
            // }
            // if (checked.length > 1){
            //     this.$message({message: '只能选择一名参加成员', type: 'warning'});
            //     return;
            // }
            // let userId = checked[0].id;
            this.apiSDK.stopForespeakCommand(this.commandId, this.remindCommandId);
            btn.title = '开启指挥提醒';
            btn.class = 'remind';
            btn.event = 'stratRemindCommand';
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
            return (
                <span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>
        );
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
.conference .content{}
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
.dropdown{
    padding: 18px 8px;
    display: inline-block;
}
.conference .btn-group-list .dropdown button{
    margin: 0;
}
.addUser{
    background: url(../../../static/resPanelControl/add.png) no-repeat center top;
}
.addUser:hover{
    background: url(../../../static/resPanelControl/add_hover.png) no-repeat center top;
}
.call{
    background: url(../../../static/resPanelControl/videoCommand/call.png) no-repeat center top;
}
.call:hover{
    background: url(../../../static/resPanelControl/videoCommand/call_hover.png) no-repeat center top;
}
.stop_call{
    background: url(../../../static/resPanelControl/stop_call.png) no-repeat center top;
}
.stop_call_hover:hover{
    background: url(../../../static/resPanelControl/stop_call_hover.png) no-repeat center top;
}
.all_call{
    background: url(../../../static/resPanelControl/all_call.png) no-repeat center top;
}
.all_call:hover{
    background: url(../../../static/resPanelControl/all_call_hover.png) no-repeat center top;
}
.all_stop_call{
    background: url(../../../static/resPanelControl/all_stop_call.png) no-repeat center top;
}
.all_stop_call_hover:hover{
    background: url(../../../static/resPanelControl/all_stop_call_hover.png) no-repeat center top;
}
.yueji{
    background: url(../../../static/resPanelControl/videoCommand/yueji.png) no-repeat center top;
}
.yueji:hover{
    background: url(../../../static/resPanelControl/videoCommand/yueji_hover.png) no-repeat center top;
}
.xietong{
    background: url(../../../static/resPanelControl/videoCommand/xietong.png) no-repeat center top;
}
.xietong:hover{
    background: url(../../../static/resPanelControl/videoCommand/xietong_hover.png) no-repeat center top;
}
.xietiao{
    background: url(../../../static/resPanelControl/videoCommand/xietiao.png) no-repeat center top;
}
.xietiao:hover{
    background: url(../../../static/resPanelControl/videoCommand/xietiao_hover.png) no-repeat center top;
}
.zhuanxiang{
    background: url(../../../static/resPanelControl/videoCommand/zhuanxiang.png) no-repeat center top;
}
.zhuanxiang:hover{
    background: url(../../../static/resPanelControl/videoCommand/zhuanxiang_hover.png) no-repeat center top;
}
.quxiaozhuanxiang{
    background: url(../../../static/resPanelControl/videoCommand/zhuanxiang.png) no-repeat center top;
}
.quxiaozhuanxiang:hover{
    background: url(../../../static/resPanelControl/videoCommand/zhuanxiang_hover.png) no-repeat center top;
}
.shouquan{
    background: url(../../../static/resPanelControl/videoCommand/shouquan.png) no-repeat center top;
}
.shouquan:hover{
    background: url(../../../static/resPanelControl/videoCommand/shouquan_hover.png) no-repeat center top;
}
.unShouquan{
    background: url(../../../static/resPanelControl/videoCommand/shouquan.png) no-repeat center top;
}
.unShouquan:hover{
    background: url(../../../static/resPanelControl/videoCommand/shouquan_hover.png) no-repeat center top;
}
.delete{
    background: url(../../../static/resPanelControl/videoCommand/delete.png) no-repeat center top;
}
.delete:hover{
    background: url(../../../static/resPanelControl/videoCommand/delete_hover.png) no-repeat center top;
}
.forword{
    background: url(../../../static/resPanelControl/videoCommand/forword.png) no-repeat center top;
}
.forword:hover{
    background: url(../../../static/resPanelControl/videoCommand/forword_hover.png) no-repeat center top;
}
.msg{
    background: url(../../../static/resPanelControl/videoCommand/msg.png) no-repeat center top;
}
.msg:hover{
    background: url(../../../static/resPanelControl/videoCommand/msg_hover.png) no-repeat center top;
}
.over{
    background: url(../../../static/resPanelControl/videoCommand/over.png) no-repeat center top;
}
.over:hover{
    background: url(../../../static/resPanelControl/videoCommand/over_hover.png) no-repeat center top;
}
.remind{
    background: url(../../../static/resPanelControl/videoCommand/remind.png) no-repeat center top;
}
.remind:hover{
    background: url(../../../static/resPanelControl/videoCommand/remind_hover.png) no-repeat center top;
}
.down{
    background: url(../../../static/resPanelControl/videoCommand/down.png) no-repeat center top;
}
.down:hover{
    background: url(../../../static/resPanelControl/videoCommand/down_hover.png) no-repeat center top;
}
.downStop {
    background: url(../../../static/resPanelControl/videoCommand/downStop.png) no-repeat center top;
}
.downStop:hover {
    background: url(../../../static/resPanelControl/videoCommand/downStop_hover.png) no-repeat center top;
}
.up{
    background: url(../../../static/resPanelControl/videoCommand/up.png) no-repeat center top;
}
.up:hover{
    background: url(../../../static/resPanelControl/videoCommand/up_hover.png) no-repeat center top;
}
.upStop{
    background: url(../../../static/resPanelControl/videoCommand/upStop.png) no-repeat center top;
}
.upStop:hover{
    background: url(../../../static/resPanelControl/videoCommand/upStop_hover.png) no-repeat center top;
}

.pause{
    background: url(../../../static/resPanelControl/videoCommand/huifu.png) no-repeat center top;
}
.pause:hover{
    background: url(../../../static/resPanelControl/videoCommand/huifu_hover.png) no-repeat center top;
}
.resume{
    background: url(../../../static/resPanelControl/videoCommand/stop.png) no-repeat center top;
}
.resume:hover{
    background: url(../../../static/resPanelControl/videoCommand/stop_hover.png) no-repeat center top;
}
.takeover{
    background: url(../../../static/resPanelControl/videoCommand/jieti.png) no-repeat center top;
}
.takeover:hover{
    background: url(../../../static/resPanelControl/videoCommand/jieti_hover.png) no-repeat center top;
}
.unTakeover{
    background: url(../../../static/resPanelControl/videoCommand/jieti.png) no-repeat center top;
}
.unTakeover:hover{
    background: url(../../../static/resPanelControl/videoCommand/jieti_hover.png) no-repeat center top;
}
.fenpai{
    background: url(../../../static/resPanelControl/videoCommand/fenpai.png) no-repeat center top;
}
.fenpai:hover{
    background: url(../../../static/resPanelControl/videoCommand/fenpai_hover.png) no-repeat center top;
}
</style>
