<template>
<div>
  <el-dialog  :visible.sync="visible" :title="popTitle" width="600px" center class="custom-dialog" @close="closeDialog">
        <div class="topBtn">
            <div v-for="item in meetingBtns"  :key="item.key" :title="item.title" :class="item.class" >
                <el-button @click="handleClick(item)">
                    <i class="icon-button" ></i>{{item.title}}
                </el-button>
            </div>
            
        </div>

        <el-tabs v-model="tabsActive" class="no-border ToastmasterTab">
            <el-tab-pane name="first" >
                <span slot="label">已入会<span>({{treeData.length+1}})</span></span>
                <el-scrollbar  class="personList hiddenXScroll">
                    <div class="custom-tree-node">
                        <span class="node-icon chairman-mini"></span>
                        <span class="node-label">{{chairmanInfo.name}}【主席】<span v-if='chairmanInfo.id == currentUser.userId'>【本人】</span></span>
                        <span class="node-btn-right" v-if='chairmanInfo.id == currentUser.userId' @click="publishMemberMicrophone(chairmanInfo)">
                             <i  :title='chairmanInfo.microphoneAbility=="false" ? "放音" : "静音"' :class="chairmanInfo.microphoneAbility=='false'  ? 'open-microphone' : 'close-microphone'"></i>
                        </span>
                        <span class="node-btn-right node-btn-more" @click="showRightBtn(chairmanInfo,IschairManPop,true)" v-if='chairmanInfo.id == currentUser.userId'>
                            <i title='更多' class='btn-more'></i>
                        </span>
                        <!-- <span class="node-btn-right">
                             <i :class="chairmanInfo.audioAbility ? 'close-audio' : 'open-audio'"></i>
                        </span>
                        <span class="node-btn-right">
                            <i :class="chairmanInfo.videoAbility ? 'close-video' : 'open-video'"></i>
                        </span>
                        <span class="node-btn-right" v-if="chairmanInfo.isJoinWhiteBoard == 'true' ">
                            <i :class="chairmanInfo.isJoinWhiteBoard == 'true' ? 'whiteboard' : 'set-hide'"></i>
                        </span> -->
                        <!-- <span @click="(event) => {showMenu(chairmanInfo, chairmanInfo, event)}" class="set" v-if="isChairman"></span> -->
                    </div>
                     <el-tree
                        ref="source_tree"
                        :data="treeData"
                        :props="defaultProps"
                        node-key="nodeId"
                        :render-content="renderContent" 
                        @node-click="handleNodeClick">
                    </el-tree>


                    <!-- <div class="item" v-for="item in data.inGroup" :key="item.key">
                        <div class="name-icon">
                            <span class="node-icon chairman-mini" v-if="item.id == chairmanInfo.id"></span>
                            <span class="node-icon" :class="item.nodeStatus" v-else></span>
                            <span class="name">{{item.userName}}&nbsp;
                                <span v-if="item.role == 'chairman'">(主持人)</span>
                                <span v-if="item.id == chairmanInfo.id">(主持人)</span>
                            </span>
                        </div>
                        <div class="item-menu" v-if="IsChairman">
                            <div class="item-menu-btn">
                                <div class="item-menu-btn_content">
                                    <span class="btn-mic" title="静音" :class="{'ckMic':item.microphoneAbility == 'true'}" @click="changeMIC(item,'inGroup')"></span>
                                </div>
                                 <div class="item-menu-btn_content">
                                    <span class="btn-more" title="更多" :class="{'ckMic':item.microphoneAbility == 'true'}" @click="changeMIC(item,'inGroup')"></span>
                                </div>
                                <span class="btn-video" title="开启关闭画面" :class="{'ckVideo':item.videoAbility == 'true'}" @click="changeVideo(item,'inGroup')"></span>
                                <span class="btn-meetingPlace" title="指定次会场" @click="changeMeetingPlace(item,'inGroup')"></span>
                                <span class="btn-ckUserSpeak" :title="ckSpeak == item.id?'收回发言':'指定发言'" :class="{'ckSpeak':ckSpeak == item.id}" @click="changeSpeak(item,'inGroup')"></span>
                                <span class="btn-outUser" title="强退成员"  @click="outUser(item,'inGroup')"></span>
                                <span class="btn-edit" title="改名" @click="changeEdit(item,'inGroup')" ></span>
                            </div>
                        </div>
                        <div class="item-menu" v-else>
                            <div class="item-menu-btn">
                                <span class="btn-mic" title="静音" :class="{'ckMic':item.microphoneAbility == 'true'}" @click="changeMIC(item,'inGroup')"></span>
                                <span class="btn-video" title="开启关闭画面"  :class="{'ckVideo':item.videoAbility == 'true'}" @click="changeVideo(item,'inGroup')"></span>
                                <span class="btn-edit" title="改名" @click="changeEdit(item,'inGroup')" ></span>
                            </div>
                            
                        </div>
                    </div>   -->
                                                                                                                                                                
                </el-scrollbar>

                 <div class="btn-box" >
                      <el-button  v-if='chairmanInfo.id == currentUser.userId' type="primary" @click="publishMemberAudioAbility">{{SoundBtn}}</el-button>
                    <!-- <el-button   v-if='chairmanInfo.id == currentUser.userId' type="primary" @click="closeVoice()">全员静音</el-button> -->
                    <!-- <el-button @click="openVoice()">解除全体静音 </el-button> -->
                    <!-- <el-button @click="startConferenceDiscussion()">开启自由发言</el-button>
                    <el-button style="margin-left:200px">更多></el-button> -->
                </div>           
            </el-tab-pane>
            <el-tab-pane name="second" >
                 <span slot="label">未入会<span>({{unIntreeData.length}})</span></span>
                  <el-tree class="sourceTreeUnin"
                        ref="source_tree_unIn"
                        :data="unIntreeData"
                        :props="defaultProps"
                        node-key="nodeId"
                        :render-content="renderContent" 
                        @node-click="handleNodeClick">
                    </el-tree>

                <!-- <div class="personList">
                    <div class="item" v-for="item in data.outGroup" :key="item.key">
                        <div class="name-icon">
                            <span class="node-icon" :class="item.nodeStatus"></span>
                            <span class="name">{{item.name}}</span>
                        </div>
                        <div class="item-menu" v-if="item.id == chairmanInfo.id">
                            <div class="item-menu-btn">
                                <span class="btn-mic" title="静音" :class="{'ckMic':item.microphoneAbility == 'true'}" @click="changeMIC(item,'outGrop')"></span>
                                <span class="btn-video" title="开启关闭画面" ></span>
                                <span class="btn-edit" title="改名" @click="changeEdit(item,'outGrop')" ></span>
                            </div>
                        </div>
                        <div class="item-menu" v-else>
                            <div class="item-menu-btn">
                                <span class="btn-mic" title="静音" :class="{'ckMic':item.microphoneAbility == 'true'}" @click="changeMIC(item,'outGrop')"></span>
                                <span class="btn-video" title="开启关闭画面" ></span>
                                <span class="btn-meetingPlace" title="指定次会场"></span>
                                <span class="btn-ckUserSpeak" :title="ckSpeak == item.id?'收回发言':'指定发言'" ></span>
                                <span class="btn-outUser" title="强退成员" ></span>
                                <span class="btn-edit" title="改名" @click="changeEdit(item,'outGrop')" ></span>
                            </div>
                        </div>
                    </div>
                </div> -->
            </el-tab-pane>
        </el-tabs>
      <!-- 右键菜单 -->
     <tree-right-btn ref="rightBtn"/>
    </el-dialog>
    <select-resource ref="selectResourceDialog" v-on:resourceEvent="resourceEventData"/>
   </div> 
</template>

<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import SelectResource from '@/components/home/selectRes/SelectResource.vue';
import TreeRightBtn from '@/components/conference/TreeRightBtn.vue'
export default {
    name:'ToastmasterMeeting',
    components: {
        SelectResource,
        TreeRightBtn,
    },
    data () {
        return {
            popTitle:'主持会商',
            currentUser:{
                token:'',
                userId:'',
                userName:'',
                validTime:'',
            },
            IschairManPop:false,//是主持会商（true）还是成员列表（false）
            IsChairman:false,//是为主席
            visible:false,
            meetingBtns:[
                {title:'锁定会议', class: 'icon_LockMeeting', event: 'publishLockMeeting'},
                {title:'邀请入会', class: 'icon_InviteMeeting', event: 'publishaddMember'},
            ],
            SoundBtn:'全员静音',
            isOpenSound:true,//是否放音
            tabsActive: 'first',
            data: {
                inGroup: [],
                outGroup: []
            },

            ckSpeak:'', //选中发言的人
            initrantNum:0,//入会人数
            uninitrantNum:0,//未入会人数

            USER: xtxk.cache.get("USER"),
            treeData: [],
            unIntreeData:[],
            members: [],
            conferenceId: '',//会议ID
            chairmanInfo:{}, //主席信息
            conferenceName: '',
            mediaType: '', // 会议类型
            isMP: false, //是否拼接会议
            isSpectator:false,
            defaultProps: {
                nodeId: 'nodeId',
                label: 'name',
                isLeaf: 'leaf'
            },
        }
    },
    mounted(){
      this.currentUser = xtxk.cache.get('USER') || {};
      console.log( this.currentUser)
    },
   methods:{
        //显示
        showDialog(meetingPersonD,IschairManPop) {
            this.visible = true;
            this.IschairManPop=IschairManPop;
            this.popTitle=IschairManPop?"主持会商":'成员列表';
            this.$nextTick(() => {
                this.initData(meetingPersonD)
            })
            if(IschairManPop){
                //主持会商
                
            }else{
                //成员列表
            }
           
        },
          // 初始化数据
        initData(data) {
            console.log("已入会-----------")
            if (data) {
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

              
               
            }
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
         //node判断
        checkTreeNode: function(list){
            let treeObj = this.$refs.source_tree;
            let  hasMicrophoneAbility=0;
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                var nodeId = item.resId + "_" + (item.resCh || 0);

                //主席节点
                if (item.role == Enum.enumRoleType.chairman) {
                    this.chairmanInfo = {
                        nodeId:nodeId,
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
                //自己是否为旁观
                this.isSpectator = item.resId == xtxk.cache.get('USER').userId ? item.isSpectator : false
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
                    node.data.microphoneAbility=item.microphoneAbility;
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
                    item.microphoneAbility=='true';
                    ++hasMicrophoneAbility;
                    this.treeData.push(data)
                }

            }
            console.log(this.treeData)
           if(this.chairmanInfo.microphoneAbility=='true') ++hasMicrophoneAbility;
           if(hasMicrophoneAbility>0)  this.SoundBtn='全员静音';
            this.initrantNum=this.treeData.length+1;
        },
        //树显示模版
        renderContent(h, { node, data, store }) {
            console.log(data.microphoneAbility )
            console.log(data.microphoneAbility=='true' ? "放音" : "静音")
            let isCurrentUser=data.id==this.currentUser.userId?'【本人】':'';
            if(this.isChairman){
                return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span class="node-label">{node.label} 
                       <span>{isCurrentUser}</span>
                    </span>
                    <span class="node-btn-right">
                        <i  title={data.microphoneAbility=='false' ? "放音" : "静音"} class={data.microphoneAbility=='false' ? "open-microphone" : "close-microphone"}  on-click={ () => this.publishMemberMicrophone(data) }></i>
                    </span>
                    <span class="node-btn-right" on-click={ () => this.showRightBtn(data,this.IschairManPop,false) }>
                        <i title="更多" class='btn-more'></i>
                    </span>
                </span>);
            }else{
                  return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span class="node-label">{node.label} 
                       <span>{isCurrentUser}</span>
                    </span>
                    <span class="node-btn-right">
                        <i title={data.microphoneAbility=='false' ? "放音" : "静音"} class={data.microphoneAbility=='false' ? "open-microphone" : "close-microphone"} on-click={ () => this.publishMemberMicrophone(data) }></i>
                    </span>
                    <span class="node-btn-right">
                         <i title={data.nodeStatus=='person_online'? "申请发言": "结束发言"} class={data.nodeStatus=='person_online'? "btn-applySpeaking": "btn-finishSpeaking"} on-click={()=>this.SpeakingFun(data)}></i>
                    </span>
                    <span class="node-btn-right" on-click={ () => this.showRightBtn(data,this.IschairManPop,false) }>
                        <i title="更多" class='btn-more'></i>
                    </span>
                </span>);
            }
            
            // return (<span class={"custom-tree-node " + data.nodeStatus} >
            //         <span class="node-icon"></span>
            //         <span class="node-label">{node.label}</span>
            //         <span class="node-btn-right">
            //             <i class={data.microphoneAbility ? "close-microphone" : "open-microphone"}></i>
            //         </span>
            //         <span class="node-btn-right">
            //              <i class={data.audioAbility ? "close-audio floatR" : "open-audio floatR"}></i>
            //         </span>
            //         <span class="node-btn-right">
            //             <i class={data.videoAbility ? "close-video floatR" : "open-video floatR"}></i>
            //         </span>
            //         <span class="node-btn-right">
            //             <i class={data.isJoinWhiteBoard == 'true' ? "whiteboard floatR"  : "set-hide floatR"}></i>
            //         </span>
            //     </span>);
                 
            // <span on-click={(event) => {this.showMenu(node, data, event)}} class={this.isChairman || node.id ==  this.USER.userId ? "set" : "set-hide"}></span>
        },
        //树节点点击事件
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
         //关闭
        closeDialog(){
            this.visible = false;
            this.tabsActive="first"
            this.$refs.rightBtn.isMenuShow = false;
        },
        //头部按钮点击事件锁定会议邀请入会
        handleClick(item){
            this[item.event]();
        },
        //锁定会议、解除锁定
        publishLockMeeting(){

        },
        //邀请入会
        publishaddMember(){
            if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
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
        //从选择资源组件传出
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
        
        
        //显示更多按钮
        showRightBtn(item,isCharimanPop,isChairman){
            this.$refs.rightBtn.showRightMenu(item,isCharimanPop,isChairman,this.conferenceId);
        },

        //成员发言方法
        SpeakingFun(data){
            if(data.nodeStatus=='person_online'){
                 //申请发言
                console.log('申请发言')
                this.applySpeaking()
            }else{
                //结束发言
                console.log('结束发言')
                this.finishSpeaking()
            }
        },
        // 成员-申请发言
        applySpeaking() {
            this.apiSDK.applySpeakingByMember(this.conferenceId)
        },
        // 成员-取消发言
        finishSpeaking() {
            this.apiSDK.finishSpeaking(this.conferenceId)
        },
           

        //开启/关闭 成员 麦克风
        changeMIC(item,type){
            let memberIDs = [];
            memberIDs.push(item.id);
            this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, true);
        },
        //开启/关闭 摄像头
        changeVideo(item,type){
            let memberIDs = [];
            memberIDs.push(item.id);
            this.apiSDK.publishMemberVideoAbility(this.conferenceId, memberIDs, true);
        },
        
        // 主席,成员闭麦
        publishMemberMicrophone(item) {
            console.log(item);
             let memberIDs = []
            memberIDs.push(item.nodeId);
            if (item.microphoneAbility) {
                 this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, true);
                // this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, true);
            } else {
                 this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, false);
                // this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, false);
            }
            item.microphoneAbility=item.microphoneAbility=='true'?'false':'true';
        },
       
        //全员静音/全员放音
        publishMemberAudioAbility(){
            // let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
            // if (screenArr.length > 0) {
            //     this.apiSDK.setVolumeAllForPlugin(0);
            //     this.apiSDK.publishAllVolume(false,0);
            // }
           
             let memberIDs=[];
            this.treeData.forEach(item=>{
                 if(item.inGroup) memberIDs.push(item.nodeId)
            })
            memberIDs.push(this.chairmanInfo.nodeId)
            if(this.isOpenSound){
                 this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, false);
                 this.SoundBtn="全员放音";
                   this.treeData.forEach(item=>{
                       item.microphoneAbility='true';
                   })
                   this.chairmanInfo.microphoneAbility='true';
            }else{
                this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, true);
                this.SoundBtn="全员静音";
                this.treeData.forEach(item=>{
                   item.microphoneAbility='false';
                })
                 this.chairmanInfo.microphoneAbility='false';
            }
            this.isOpenSound=!this.isOpenSound;
            console.log(this.treeData);
            // if (btn.title === '开音') {
            //     this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, true);
            //     btn.title = '闭音'
            //     btn.class = 'close-audio-mid'
            // } else {
            //     this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, false);
            //     btn.title = '开音'
            //     btn.class = 'open-audio-mid'
            // }
        },
        //全员放音
        // openVoice(){
        //     let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
        //     if (screenArr.length > 0) {
        //         this.apiSDK.setVolumeAllForPlugin(1);
        //         this.apiSDK.publishAllVolume(true,255);
        //     }
        // },
       
        

    }
}
</script>
<style scoped>
    /* 树样式 */
     .custom-tree-node{
         width: 100%;
          border-bottom: 1px solid #365076;
         padding:8px 0 8px 24px!important;
         box-sizing: border-box;
     }
    .el-tree /deep/ .custom-tree-node{
        width: 86%;
        vertical-align: middle;
        /* padding: 8px 0!important; */
    }
    .custom-tree-node span.node-label{
        display: inline-block;
        width: calc(100% - 134px);
        /* padding: 0 2px; */
    }
  .el-tree /deep/ span.node-label{
        display: inline-block;
        width: calc(100% - 73px);
        padding: 0 3px;
    }
    .personTreeDialog /deep/ .el-tree-node__content{
        border-bottom: none;
    }
    /deep/ .el-tree-node__content{
        border-bottom: 1px solid #365076;
      padding: 8px 0 10px 0!important;
    }
     /deep/ .el-scrollbar__view{
    padding: 5px 15px;
    box-sizing: border-box;
        }
  .el-tree /deep/ .custom-tree-node span.node-btn-right{
       margin-right:3px;
   }
   .el-tree /deep/ .custom-tree-node span.node-btn-right:last-child{
       margin-right:0;
   }
   .node-btn-right,
  /deep/ .custom-tree-node span.node-btn-right{
       display: inline-block;
       width: 34px;
       height: 34px;
       text-align: center;
       vertical-align: middle;
       /* line-height: 32px; */
   }
   .node-btn-right:hover,
   /deep/ .custom-tree-node span.node-btn-right:hover{
        background: url("../../../static/meeting/takeChairbtn_bg_hover.png") no-repeat center;
         background-size: 100% 100%;
   }
</style>
<style scoped>
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    margin-right: -17px!important;
    overflow-x: hidden;
    /* height: calc(100% + 17px); */
}
.custom-dialog /deep/ .el-dialog__body{
    padding:0;
}
.floatR{
    float:right;
}
.topBtn{
    width: 300px;
    height: 110px;
    display: flex;
    justify-content: space-between;
    margin:10px  auto 0;
}
.topBtn button{
   width: 110px;
   height:110px;
   padding:70px 0 0 0;
   color: #d7e7ff;
    /* margin: 5px 12px; */
    font-size: 12px;
    background: transparent;
    border: 1px solid transparent;
}
.topBtn>div.active{
     background:url(../../../static/meeting/meetBtn_bg_active.png) no-repeat center;
}
.topBtn>div:hover{
    background:url(../../../static/meeting/meetBtn_bg_hove.png) no-repeat center;
}
.topBtn .icon_LockMeeting button{
    background: url(../../../static/meeting/LockMeeting.png) no-repeat center 10px;
}
.topBtn .icon_unLockMeeting button{
    background: url(../../../static/meeting/unLockMeeting.png) no-repeat center 10px;
}
.topBtn .icon_InviteMeeting button{
    background: url(../../../static/meeting/InviteMeeting.png) no-repeat center 10px;
}

.el-tabs.no-border /deep/ .el-tabs__header{
    padding:0 15px;
}
.ToastmasterTab.no-border /deep/ .el-tabs__content{
   background:transparent;
}
/deep/ .el-tabs__item{
    color:#b7c1d0;
}
/deep/ .el-tabs__item.is-active{
    color:#fff;
}
/deep/ .el-tabs__active-bar{
     /* background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%); */
     background: url(../../../static/common/tabtitle_bg_active.png) no-repeat center;
     background-size: 100% 100%;
}
.custom-dialog /deep/ .el-tabs__nav-wrap::after{
    background:transparent;
}
.personList{
    height: 260px;
    background:rgba(18,42,81,.4);
    /* background: url(../../../static/stratege/main-bg.png) no-repeat center; */
    border-top:1px solid #365076;
}







.personList .item{
    font-size: 16px;
   padding:5px 0;
    border-bottom: 1px solid #365076;
}
.item .name-icon{
    width: calc(100% - 130px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.name{
    display: inline-block;
    height: 40px;
    line-height: 40px;
}
.personList .node-icon,
/deep/ .custom-tree-node .node-icon {
    margin-right: 2px;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-size: cover;
    width: 14px;
    height: 16px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
}
.chairman-mini{
    background: url(../../../static/meeting/icon-member.png) no-repeat center;
    background-size: 100% 100%;
}
/deep/ .custom-tree-node.person_online .node-icon{
    background: url(../../../static/meeting/icon-member.png) no-repeat center;
    background-size: 100% 100%;
}
.personTreeDialog /deep/ .custom-tree-node.person_online .node-icon{
    background: url(../../../static/resource_tree/person_online.png) no-repeat center;
}
.personList .person_offline{
    background: url(../../../static/meeting/icon-member.png) no-repeat center;
    background-size: 100% 100%;
}
.personList .person_speaking{
    background: url("../../../static/resource_tree/person_speaking.png") no-repeat center;
    background-size: 100% 100%;
}
/deep/ .el-tree-node__content:hover,
/deep/ .el-tree-node:focus>.el-tree-node__content{
    background:transparent!important;
}

.sourceTreeUnin{
    min-height: 260px;
}

.item-menu{
    display: inline-block;
    width: 125px;
}
.item-menu-btn{
    width: 100%;
    display: flex;
    margin-right: 10px;
}
.item-menu-btn_content{
    background:transparent;
}
.item-menu-btn_content:hover{
     background: url("../../../static/meeting/takeChairbtn_bg_hover.png") no-repeat center;
     background-size: 100% 100%;
}
.item-menu-btn span{
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
}
.item-menu .btn-mic,
/deep/  .open-microphone{
    background: url("../../../static/meeting/unmute.png") no-repeat center !important;
    background-size: 100%;
}
.item-menu .btn-unmic,
/deep/ .close-microphone{
    background: url("../../../static/meeting/mute.png") no-repeat center !important;
    background-size: 100%;
}
.item-menu .btn-more,
/deep/ .btn-more{
    background: url("../../../static/meeting/icon_more.png") no-repeat center;
      background-size: 100%;
}
/deep/ .btn-applySpeaking{
    background: url("../../../static/meeting/applySpeak.png") no-repeat center;
     background-size: 30px;
}
/deep/ .btn-finishSpeaking{
    background: url("../../../static/meeting/applySpeak.png") no-repeat center;
     background-size: 30px;
}
.item-menu .btn-ckUserSpeak{
    background: url("../../../static/scene/ico_menu_host.png") no-repeat center;
      background-size: 100%;
}
.item-menu .btn-outUser{
    background: url("../../../static/resPanelControl/delete.png") no-repeat center;
      background-size: 100%;
}
.item-menu .btn-edit{
    background: url("../../../static/scene/ico_menu_quitmeeting.png") no-repeat center;
     background-size: 100%;
}

.personList /deep/ .custom-tree-node .node-btn-right>i {
    margin: 2px 0;
    width:34px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
}
.btn-box{
    margin: 44px 0;
    text-align: center;
}
/* .item-menu .item-menu-btn .ckMic{
    background: url("../../../static/resPanelControl/addspeak.png") no-repeat center;
}
.item-menu .item-menu-btn .ckVideo{
    background: url("../../../static/resPanelControl/share_camera.png") no-repeat center;
}
.item-menu .item-menu-btn .meetingPlace{
    background: url("../../../static/scene/ico_menu_management_active.png") no-repeat center;
}
.item-menu .item-menu-btn .ckUserSpeak{
    background: url("../../../static/scene/ico_menu_host_active.png") no-repeat center;
}
.item-menu .item-menu-btn .ckOutUser{
    background: url("../../../static/scene/ico_menu_quit_active.png") no-repeat center;
}
.item-menu .item-menu-btn .ckEdit{
    background: url("../../../static/scene/ico_menu_quitmeeting_active.png") no-repeat center;
}
.item-menu .item-menu-btn .ckSpeak{
    background: url("../../../static/scene/ico_menu_host_active.png") no-repeat center;
} */



</style>