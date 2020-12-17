<template>
  <div id="conferenceFooterMenu">
      <el-tabs class="conferenceFooterTab" :style="{'width':footbarW,'margin':footbarMargin}" @tab-click="handleClick">
        <el-tab-pane v-for="item in meetingBnt" :key="item.key" :title="item.title" > 
            <span slot="label">
                <el-button  :class="item.class" >
                    <i class="icon-button" ></i>{{item.title}}
                </el-button>
            </span>
        </el-tab-pane>
    </el-tabs>
    <div class="btn-box" >
            <el-button v-for="item in outMeetingBnt" :key="item.key" :title="item.title" :class="item.class" :style="item.style" v-show="item.isShow" @click="getEvent(item,$event)">
                {{item.title}}
            </el-button>
      </div>
      <!-- <div class="btn-box" >
            <el-button v-for="item in meetingBnt" :key="item.key" :title="item.title" :class="item.class" @click="getEvent(item,$event)">
                <i v-if="item.class.indexOf('icon_out')==-1" class="icon-button" ></i>{{item.title}}
            </el-button>
      </div> -->
      <!-- <el-card id="treeRightMenu" v-show="isMenuShow" :style="menuLoc" class="treeRightMenu"  :body-style="{padding:'0px'}">
          <div class="card-content">
              <div class="title-cardScreen">选择大屏同步画面布局</div>
              <div class="screen-box">
                <div class="screenBtn-box" v-for="item in ScreenBtn" :key="item.key">
                    <img :src="item.img" alt="" class="img-screen">
                    <p>{{item.title}}</p>
                </div>
              </div>
          </div>
      </el-card> -->
      <change-meeting ref="changeMeeting"></change-meeting>
      <!-- 主持会商 -->
      <toastmaster-meeting ref="toastmasterMeeting"></toastmaster-meeting>
      <!-- 会议共享 -->
      <share-dialog ref="shareDialog"/>
      <!-- 任务安排 -->
      <task-arrangement-dialog ref="taskArrangement"/>
      <!-- 共享电子白板 -->
      <electron-blackboard-dialog ref="electronBlackboard"></electron-blackboard-dialog>
      
  </div>
</template>

<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";
import changeMeeting from '@/components/conference/ChangeMeetingDialog'
import toastmasterMeeting from '@/components/conference/ToastmasterMeeting'
import TaskArrangementDialog from "@/components/conference/TaskArrangementDialog";
import ShareDialog from "@/components/conference/ShareDialog";
import ElectronBlackboardDialog from '@/components/conference/ElectronBlackboardDialog.vue';
export default {
    name:'conferenceFooterMenu',
    components:{
        changeMeeting,
        toastmasterMeeting,
        ShareDialog,
        TaskArrangementDialog,
        ElectronBlackboardDialog
        
    },
    data () {
        return {
            footbarW:'900px',
            footbarMargin:'2px auto',
            isChairman:true,//是否为主席
            meetingBnt:[],
            outMeetingBnt:[],
            menuLoc: '',
            isMenuShow: false,
            mediaType:'',// 会议类型
            conferenceId:'',//会议ID
            conferenceName:'',
             description: "",
            chairmanInfo: {},
            ScreenBtn:[{
                title:'会场轮巡', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                title:'主会场(2*4)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                title:'主会场(2*7)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                title:'主次会场(2*2)', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            },{
                title:'主会场全屏', img: '../../../static/scene/ico_menu_openwheat.png', event: 'publishMemberMicrophone'
            }],
            meetingPersonD:{
                operate:'',
                operateId: "",
                conferenceId: "",
                conferenceName: "",
                description: "",
                mediaType: "VideoAndAudio",
                sceneType:'3',
                init:{
                    members:[
                        {
                            resId: "856307f208e043d3937fcf8767c88656",
                            resName: "会议04",
                            isOnline: "onlineInMeeting",
                            role: "chairman",
                            resType: 0,
                            deviceType: "",
                            isSpectator:false,
                            inGroup: true,
                            audioAbility: "false",
                            videoAbility: "false",
                            microphoneAbility: "false",
                            isShare:"false",
                            isJoinWhiteBoard:"false"
                        }
                    ],
                    devices:'',
                }
               },
               isMP:{
                   status:0
               }
       }
    },
    created () {
        
    },
    mounted () {
        this.init();
        // this.initBtn();
         // 事件
        window.addEventListener("resize", this.resize);
    },
    watch:{
        conferenceId(newVal,oldVal){
            if(newVal=='') this.$parent.$parent.goMeetingInfo();
        }
    },
    methods: {
        init() {
            var screenWidth = document.body.clientWidth;
            var paddingW=48;
            //图像显示区域
            var letBtnWByChairman=this.isChairman?250:150;
            var leftPartw=screenWidth-paddingW-16-letBtnWByChairman;
            var footbarWidth=leftPartw>948?948:screenWidth-paddingW-16-letBtnWByChairman-20
            this.footbarW = footbarWidth+"px";
            if(leftPartw>948){
                let LR=(leftPartw-footbarWidth)/2
                if(LR>letBtnWByChairman){
                    this.footbarMargin="2px auto";
                }else{
                    this.footbarMargin="2px "+LR+"px";
                }
            }else{
                this.footbarMargin="2px 10px";
            }
        },
        initBtn(){
            this.meetingBnt=[
               {title:'主持会商', class: 'icon_hostMeeting', event: 'publishToastmasterMeeting'},
                 {title:'视频调试', class: 'icon_videoDispatch', event: 'publishMemberMicrophone'},
                {title:'会议共享', class: 'icon_shareMeeting', event: 'shareFun'},
                {title:'聊天室', class: 'icon_chartRoom', event: ''},
                {title:'窗口布局', class: 'icon_screen', event: 'setWindowLayout'},
                {title:'更多', class: 'icon_more', event: ''},
                {title:'麦克风', class: 'icon_microphone', event: 'publishMemberMicrophone'},
                {title:'摄像头', class: 'icon_videoAbility', event: 'publishMemberVideoAbility'},
                {title:'扬声器', class: 'icon_voice', event: 'publishMemberVideoAbility'},
                {title:'开始录制', class: 'icon_startRecord', event: 'startMeetRecording'},
                {title:'我的设置', class: 'icon_myset', event: 'startMeetRecording'},
            ];
            this.outMeetingBnt=[
                {title:'退出会商', class: 'icon_out outConference', event: 'publishChairmanQuitConference',style:"right:143px",isShow:true},
                {title:'结束会商', class: 'icon_out exitConference', event: 'stopConference',style:"right:30px",isShow:true},
            ]

        },
        resize() {
            let self = this;
            self.init();
        },
        //node判断
        checkTreeNode(list){
           
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
                    // let index = this.conferenceBtn.findIndex(item => item.event == 'applySpeaking')
                    // if(index !== -1) {
                    //     this.$set(this.conferenceBtn, index, { title: '退出发言', class: 'unspeak', event: 'finishSpeaking' } );
                    // }
                    // 发言人添加共享屏幕
                    // this.conferenceBtn.splice(this.getConferenceBtnIndex('退出会议',this.conferenceBtn),0, this.getShareScreenBtn())
                }else if(item.role == Enum.enumRoleType.member && item.resId == xtxk.cache.get('USER').userId){
                    // let index = this.conferenceBtn.findIndex(item => item.event == 'finishSpeaking')
                    // if (index !== -1) {
                    //     this.$set(this.conferenceBtn, index, { title: '申请发言', class: 'applyspeak', event: 'applySpeaking' } );
                    // }
                    // // 发言人删除共享屏幕
                    // let sIndex = this.conferenceBtn.findIndex(item => (item.class == 'noShareScreen' || item.class == 'shareScreen' || item.class == 'shareCamera'));
                    // if (sIndex !== -1) {
                    //     this.conferenceBtn.splice(sIndex, 1);
                    // }
                }

                //图标处理
                // var resStatus = 0;
                // if(item.isOnline == Enum.enumMerberStatus.online) resStatus = 1;
                // else if(item.isOnline == Enum.enumMerberStatus.offline) resStatus = 0;
                // else if(item.isOnline == Enum.enumMerberStatus.onlineJoin) resStatus = 1;
                // else if(item.isOnline == Enum.enumMerberStatus.onlineNotJoin) resStatus = 1;
                // else if(item.isOnline == Enum.enumMerberStatus.breakdown) resStatus = 2;

                // var busStatus = 0;
                // if(item.role == Enum.enumRoleType.speak) {resStatus = 1; busStatus = Enum.enumBussStatus.Speaking};
                // if(item.isOnline == Enum.enumMerberStatus.playing) {resStatus = 1; busStatus = Enum.enumBussStatus.Playing};

                // var icon_ = Fun._getNodeStatus(item.resType, resStatus, busStatus, item.deviceType);

                // var namePrifex = "";
                // if(resStatus == 1 && item.inGroup == true)  namePrifex = "[已入会]";
                // if(resStatus == 1 && item.inGroup == false)  namePrifex = "[未入会]";

                
            }
            
            //刷新的数据传给主持会商
            // let toastmasterData= {inGroup: [], outGroup: []};
            // this.treeData.forEach(item => {
            //     if (item.inGroup) {
            //         toastmasterData.inGroup.push(item);
            //     } else {
            //         toastmasterData.outGroup.push(item);
            //     }
            // })
            // this.$refs.toastmasterMeeting.getGroupData(toastmasterData)
        },
        initData(data_,isOpen) {
            console.log(",,,,,,,,底部按钮拿到数据")
            console.log(data_);
             if (data_ && data_.res) {
             let data = data_.res;
             this.meetingPersonD=data;
                this.conferenceId = data.conferenceId;
                this.description = data.description;
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ) {
                    this.conferenceName = data.conferenceName
                }
                this.isMP = (data.isMP && data.isMP.status == 1) || false

                if( data.operate === 'init' ){
                    // this.clearTree();
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
                 this.meetingBnt=[
                    {title:this.isChairman?'主持会商':'成员列表', class: this.isChairman?'icon_hostMeeting':'icon_member', event: 'publishToastmasterMeeting'},
                    {title:'视频调试', class: 'icon_videoDispatch', event: 'publishMemberMicrophone'},
                    {title:'会议共享', class: 'icon_shareMeeting', event: 'shareFun'},
                    {title:'聊天室', class: 'icon_chartRoom', event: ''},
                    {title:'窗口布局', class: 'icon_screen', event: 'setWindowLayout'},
                    {title:'更多', class: 'icon_more', event: ''},
                    {title:'麦克风', class: 'icon_microphone', event: 'publishMemberMicrophone'},
                    {title:'摄像头', class: 'icon_videoAbility', event: 'publishMemberVideoAbility'},
                    {title:'扬声器', class: 'icon_voice', event: 'publishMemberVideoAbility'},
                    {title:'开始录制', class: 'icon_startRecord', event: 'startMeetRecording'},
                    {title:'我的设置', class: 'icon_myset', event: 'startMeetRecording'},
                ];
                this.outMeetingBnt=[
                    {title:'退出会商', class: 'icon_out outConference', event: 'publishChairmanQuitConference',style:this.isChairman?"right:143px":'right:30px',isShow:true},
                    {title:'结束会商', class: 'icon_out exitConference', event: 'stopConference',style:"right:30px",isShow:this.isChairman?true:false},
                ]




                //    var btns={};
                //     if (this.isChairman) {
                //         let n=this.meetingBnt.findIndex(item=>item.class=="icon_member")
                //         if(n>-1){
                //             this.meetingBnt[n].title="主持会商";
                //             this.meetingBnt[n].class="icon_hostMeeting";
                //         }
                //         this.outMeetingBnt.forEach(item=>{
                //             if(item.class.indexOf("outConference")>-1){
                //                 item.event="publishChairmanQuitConference"
                //             }
                //         })
                //     }else{
                //         let n=this.meetingBnt.findIndex(item=>item.class=="icon_hostMeeting")
                //         if(n>-1){
                //             this.meetingBnt[n].title="成员列表";
                //             this.meetingBnt[n].class="icon_member";
                //         }
                       
                //          this.outMeetingBnt.forEach((item,index)=>{
                //              item.isShow=true;
                //             if(item.class.indexOf("outConference")>-1){
                //                 item.event="applyLeaveConference";
                //                 item.style="right:30px"
                //             }
                //              if(item.class.indexOf("exitConference")>-1){
                //                item.isShow=false;
                //             }
                //         })
                        this.init();
                       
                         
                //    }
            }
         }
           
        },
       
        //点击底部按钮事件
        handleClick(tab, event){
            let activeIndex=tab.index;
            let btnEvent=this.meetingBnt[activeIndex].event;
            this[btnEvent](this.meetingBnt[activeIndex]);
        },
         //主持会商/成员列表
        publishToastmasterMeeting(val){
            console.log(val);
            let IsChairmanPop=val.class=='icon_hostMeeting'?true:false;
            this.$refs.toastmasterMeeting.showDialog(this.meetingPersonD,IsChairmanPop);
        },

        //会议共享
        shareFun(){
             let data = {
                sceneID: this.conferenceId,
                sceneName: this.conferenceName,
                password: this.password,
                chairman: this.chairmanInfo.name,
                desc: this.description,
                sceneType: 0,
            };
            this.$refs.shareDialog.showDialog(data);
        },

        //窗口布局
        setWindowLayout(){

        },






        //退会和结束会议
        getEvent(btn,event) {
            if(btn.event) {
                if(btn.event == 'publishScreen'){ //大屏
                    this.isMenuShow = !this.isMenuShow;
                    const left_ = event.target.offsetLeft - event.target.offsetWidth ;
                    this.menuLoc = 'left: '+ left_ +'px; bottom: '+ 80 +'px';
                }else{
                    this[btn.event](btn);
                }
            }
        },
          // 主席-关闭(临时/预设)会议
        stopConference() {
            console.log(this.conferenceId);
            this.apiSDK.stopConference(this.conferenceId)
            this.$parent.$parent.goMeetingInfo();
             //this.initBtn()
        },
        // 退出会议
        publishChairmanQuitConference() {
            this.apiSDK.publishChairmanQuitConference(this.conferenceId);
            this.$parent.$parent.goMeetingInfo();
            // this.isChairman=true;
            // this.initBtn()
        },
        // 成员-申请退出会议
        applyLeaveConference() {
            this.apiSDK.applyLeaveConference(this.conferenceId, this.isSpectator)
            this.$parent.$parent.goMeetingInfo();
       
            //this.initBtn()
        },

        publishMemberMicrophone(){
        },
        //切换会商
        publishChangeMeeting(){
            this.$refs.changeMeeting.showDialog();
        },
       
         
        //任务安排
        taskArrangement(){
             this.$refs.taskArrangement.showDialog();
        },
       
    },
    destroyed: function() {
        //注销事件
        window.removeEventListener("resize", this.resize);
    },
}
</script>

<style scoped>
#conferenceFooterMenu{
    padding: 0;
    margin: 0;
    width: 100%;
    height: 58px;
    position: relative;
}
.el-tabs{
    max-width: 1000px;
    width:948px;
    height: 100%;
    min-width: 200px;
    margin:2px auto;
}
.conferenceFooterTab /deep/ .el-tabs__content{
    height:0px;
}
.conferenceFooterTab /deep/  .el-tabs__item{
    height: 53px;
    padding: 0 10px;
}
.conferenceFooterTab /deep/ .el-tabs__item:hover{
    /* background:#5d98ff;
    color:#fff; */
}
.conferenceFooterTab /deep/ .el-tabs__nav-next,.conferenceFooterTab /deep/  .el-tabs__nav-prev{
    line-height: 53px;
}
.conferenceFooterTab /deep/ .el-tabs__active-bar,
.conferenceFooterTab /deep/ .el-tabs__nav-wrap::after{
    height: 0;
}
.conferenceFooterTab button{
   width: 63px;
   height:53px;
   padding:0;
    color: #d7e7ff;
    /* margin: 5px 12px; */
    font-size: 12px;
    background: transparent;
    border: 1px solid transparent;
}
.conferenceFooterTab  /deep/ button span{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.conferenceFooterTab button:hover{
    background:#5d98ff;
    color:#fff;
}

.btn-box{
    max-width: 1000px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    min-width: 200px;
    margin:0 auto;
}
.btn-box button{
   width: 83px;
   height:58px;
   padding:0;
    color: #d7e7ff;
    /* margin: 5px 12px; */
    font-size: 12px;
    background: transparent;
    border: 1px solid transparent;
}
.btn-box button /deep/ span{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.btn-box button:hover{
    background:#5d98ff;
    color:#fff;
}
.icon-button{
    display: block;
    width:34px;
    height: 26px;
    margin-bottom:5px;
}
/* 主持会商 */
.icon_hostMeeting .icon-button{
     background: url(../../../static/meeting/hostMeeting.png) no-repeat center top;
}
.conferenceFooterTab button.icon_hostMeeting:hover  .icon-button{
    background: url(../../../static/meeting/hostMeeting_active.png) no-repeat center top;
}
/* 成员列表 */
.icon_member .icon-button{
     background: url(../../../static/meeting/hostMeeting.png) no-repeat center top;
}
.conferenceFooterTab button.icon_member:hover .icon-button{
     background: url(../../../static/meeting/hostMeeting.png) no-repeat center top;
}
/* 视频调试 */
.icon_videoDispatch .icon-button{
     background: url(../../../static/meeting/videoDispatch.png) no-repeat center top;
}
.conferenceFooterTab button.icon_videoDispatch:hover  .icon-button{
     background: url(../../../static/meeting/videoDispatch_active.png) no-repeat center top;
}
/* 会议共享 */
.icon_shareMeeting .icon-button{
 background: url(../../../static/meeting/shareMeeting.png) no-repeat center top;
}
.conferenceFooterTab button.icon_shareMeeting:hover  .icon-button{
     background: url(../../../static/meeting/shareMeeting_active.png) no-repeat center top;
}
/* 聊天室 */
.icon_chartRoom .icon-button{
 background: url(../../../static/meeting/chartRoom.png) no-repeat center top;
}
.conferenceFooterTab button.icon_chartRoom:hover  .icon-button{
     background: url(../../../static/meeting/chartRoom_active.png) no-repeat center top;
}
/* 窗口布局 */
.icon_screen .icon-button{
 background: url(../../../static/meeting/screen.png) no-repeat center top;
}
.conferenceFooterTab button.icon_screen:hover  .icon-button{
     background: url(../../../static/meeting/screen_active.png) no-repeat center top;
}
/* 更多 */
.icon_more .icon-button{
 background: url(../../../static/meeting/more.png) no-repeat center top;
}
.conferenceFooterTab button.icon_more:hover  .icon-button{
     background: url(../../../static/meeting/more_active.png) no-repeat center top;
}
/* 麦克风 */
.icon_microphone .icon-button{
 background: url(../../../static/meeting/microphone.png) no-repeat center top;
}
.conferenceFooterTab button.icon_microphone :hover .icon-button{
     background: url(../../../static/meeting/microphone_active.png) no-repeat center top;
}
/* 摄像头 */
.icon_videoAbility .icon-button{
 background: url(../../../static/meeting/videoAbility.png) no-repeat center top;
}
.conferenceFooterTab button.icon_videoAbility:hover  .icon-button{
     background: url(../../../static/meeting/videoAbility_active.png) no-repeat center top;
}
/* 扬声器 */
.icon_voice .icon-button{
 background: url(../../../static/meeting/voice.png) no-repeat center top;
}
.conferenceFooterTab button.icon_voice:hover  .icon-button{
     background: url(../../../static/meeting/voice_active.png) no-repeat center top;
}
/* 开始录制 */
.icon_startRecord .icon-button{
 background: url(../../../static/meeting/startRecord.png) no-repeat center top;
}
.conferenceFooterTab button.icon_startRecord:hover  .icon-button{
     background: url(../../../static/meeting/startRecord_active.png) no-repeat center top;
}
/* 我的设置 */
.icon_myset .icon-button{
 background: url(../../../static/meeting/myset.png) no-repeat center top;
}
.conferenceFooterTab button.icon_myset:hover  .icon-button{
     background: url(../../../static/meeting/myset_active.png) no-repeat center top;
}
.open-microphone-mid{
    background: url(../../../static/scene/ico_menu_openwheat.png) no-repeat center top;
}
.open-microphone-mid:hover{
    background: url(../../../static/scene/ico_menu_openwheat_active.png) no-repeat center top;
}
.btn-box .icon_out{
    position: absolute;
    right:30px;
    bottom:12px;
    height: 32px;
    width: 88px;
    padding: 0;
    border-radius: 2px;
    font-size: 14px;
}
.btn-box .outConference{
    right:142px;
    border-color: #6b7c92;
    color: #abb3c4;
}
.btn-box .exitConference{
    background-color: red;
    color: #fff;
}
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
</style>
