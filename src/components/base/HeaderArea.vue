<template>
    <div id="divHeader2">
 		<div id="divHeaderLogoWrap">
			  <!-- <span class="logo_icon"></span>
        	  <span class="logo_name">塔里木油田音视讯融合平台</span> -->
		 </div>
		<div id="divHeaderRight">
			<!-- <div class="msgIconBox">
				<div v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6" :class="isHasUnreadMsg ? 'unreadMsgIcon' : 'readMsgIcon'" class="msgIcon" @click="showTalkDialog"></div>
				<div v-else :class="isHasUnreadMsg ? 'unreadMsgIcon' : 'readMsgIcon'" class="msgIcon" v-popover:unreadMsgPopover></div> 
				
				<el-badge :value="badgeValue" class="item" >
					<div v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6" :class="isHasUnreadMsg ? 'unreadMsgIcon' : 'readMsgIcon'" class="msgIcon" @click="showTalkDialog"></div>
					<div v-else :class="isHasUnreadMsg ? 'unreadMsgIcon' : 'readMsgIcon'" class="msgIcon" v-popover:unreadMsgPopover></div>
				</el-badge>

				<el-popover
					popper-class="custom-popover"
					ref="unreadMsgPopover"
					title="未读消息"
					placement="bottom-end"
					width="560"
					@show="getSessions"
					v-model="msgVisible"
					:visible-arrow="false"
					trigger="click">
      				<el-button type="text" class="btn-close" icon="el-icon-close" @click="msgVisible = false"></el-button>
					<div class="unreadMsgbox">
						<p v-if="sessions.length == 0" class="hasNoMsg">暂无未读消息</p>
						<ul v-else>
							<li v-for="item in sessions" :key="item.key" @click="handleClickUnreadMsgLi(sessions)">
								<p class="senderInfo">
									<span class="senderName" v-if="item.chat_type == 1">{{item.fromName}}</span><span class="msgCount" v-if="item.chat_type == 1">({{item.unReadedCount}})</span>
									<span class="senderName" v-if="item.chat_type == 2">{{item.group_name}}</span><span class="msgCount" v-if="item.chat_type == 2">({{item.unReadedCount}})</span>
									<span class="senderTime">{{item.messages[item.messages.length-1].sendTime}}</span>
								</p>
								<p class="msgInfo">
									<span class="msgContent" v-if="item.messages[item.messages.length-1].msg_type == 0">{{item.messages[item.messages.length-1].content}}</span>
									<span class="msgContent" v-else>&lt;{{JSON.parse(item.messages[item.messages.length-1].content).filename}}&gt;</span>
								</p>
							</li>
						</ul>
					</div>
				</el-popover>
			</div>-->
			<!-- <div id="divHeaderRight_1" >欢迎您：{{curUser.userName}}</div>-->
			<!-- <input type="button" id="btnExit" v-on:click="showHeaderMenu"/>  -->
			
			<div id="divHeaderRight_1" ref="divHeaderRight" :title="userTitle" :class="{Menuactived:actived}"  @click="showHeaderMenu">
				<i class="icon-userphoto"></i>
				{{curUser.userName}}
				<i class="el-icon-caret-bottom"></i>
			</div>
			
		</div>
		<div style="clear:both;"></div>

		<header-menu ref="headerMenu"  @changeActivedStatus="changeActivedStatusFun"/>
		<send-request-dialog ref="sendRequestDialog" />
		<Im6-dialog ref="talkDialog" /> 
	</div>
</template>

<script>
import Enum from "@/common/enum";
import HeaderMenu from '@/components/base/HeaderMenu.vue'
import SendRequestDialog from '@/components/home/SendMessageDialog.vue'
import Im6Dialog from '@/components/home/Im6Dialog.vue';
export default {
	name: 'HeaderArea',
	components: {
		HeaderMenu,	
		SendRequestDialog,
		Im6Dialog
	},
    data () {
        return {
			curUser: {},
			sessions:[],
			// isHasUnreadMsg: false,
			msgVisible: false,
			isSendMessageDialog : 0,
			actived:false,
			badgeValue:null,
			userTitle: '',
		};
	},
	computed: {
		isHasUnreadMsg() {
			return false
			// return this.$store.state.hasUnreadMsg;
		}
	},
	mounted(){
		if( xtxk.cache.get('yhsjhm') ) {
		  this.userTitle =  xtxk.cache.get('yhidym') + ',' +  xtxk.cache.get('yhsjhm') + ',' + xtxk.cache.get('dwsx');
		}

		console.log('右上角悬停', this.userTitle);
		var self = this;
		this.curUser = xtxk.cache.get('USER');
		this.actived=this.$store.getters.getStatus;
		this.isSendMessageDialog = sessionStorage.getItem('isSendMessageDialog');
		// console.log('this.isSendMessageDialog='+this.isSendMessageDialog);

		if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
			// 接收会话反馈
			// this.apiSDK.setInformMessageReceiveCallback1(res => {
			// 	if (res.unReadCnt > 0) {
			// 		this.isHasUnreadMsg = true;
			// 	}
			// });
			// 查询未读消息，无未读消息接口，固用sessionList查询
			if (this.imSDK) {
				const USER = xtxk.cache.get("USER");
				// 登录即时通讯服务
    			this.imSDK.connection.connect(USER.userId, 'testpassword', startalkNav.baseaddess && startalkNav.baseaddess.domain, false);
				this.imSDK.ready(async () => {
	                console.log('即时通讯ready---------');
	                const sessionList = await this.imSDK.getSessionList();
	                if (sessionList.ret) {
		            	for (let item of sessionList.data) {
		            		// console.log(item);
		            		if (item.cnt !== '0') {
								this.$store.commit("setHasUnreadMsg", true);
								this.badgeValue=item.cnt
		            			// this.isHasUnreadMsg = true;
		            			return;
		            		}
		            	}
		            }
	            })
				// 接收 message 消息
	            this.imSDK.message.on('message', async (msg) => {
	                if (['chat', 'groupchat'].indexOf(msg.type) > -1) {
	                    let user = msg.type === 'chat' ? 'sendjid' : 'muc';
	                    if (msg.type === 'chat') {
	                    	this.$store.commit("setHasUnreadMsg", true);
	                    }
	                }
	            });
			} else {
				console.log('即时消息服务不可用');
			}
		}
		
		
		if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
			// 查询离线消息
			this.apiSDK.queryOfflineMessageList(res => {
				console.log('查询离线消息');
				if( res && res.length > 0 ){
					this.isHasUnreadMsg = true;
					// this.sessions = res;
					res.forEach(item=>{
                        // var it = { chat_type:1, sessionId: "", group_name:"", from:"", fromName:"", to:"", toName:"", unReadedCount: 0, messages: [], users:[] };
						this.sessions.push(item);
					});
					this.badgeValue=this.sessions.length;
				}
			});

			/*
			this.apiSDK.setInfromMessageReceiveCallback(res => {
				console.log('收到新消息');
				console.log('this.isSendMessageDialog='+this.isSendMessageDialog);
				if( this.isSendMessageDialog == 0 ){
					this.isHasUnreadMsg = true;
					this.sessions.push(res);
				}
			});
			*/ 
		}
	},
	methods: {
		getHasReadMsg() {

		},
		showTalkDialog() {
			// this.$store.commit("setHasUnreadMsg", false);
			this.$refs.talkDialog.showDialog();
		},
		showHeaderMenu(){
			this.actived=!this.actived;
			this.$refs.headerMenu.showHeaderMenus(this.actived);
		},
		changeActivedStatusFun(value){
			this.actived=value;
		},
		handleClickUnreadMsgLi(sessions){
			this.isHasUnreadMsg = false;
			this.msgVisible = false;
			this.badgeValue=null
			this.$refs.sendRequestDialog.showDialog(sessions);
			// this.$refs.sendRequestDialog.showDialog();
			// 设置离线消息为已读
			let fromArr = [];
			let groupArr = [];
			this.sessions.forEach(item=>{
				if( item.chat_type == 1 ){
					fromArr.push(item.from)
				}else if( item.chat_type == 2 ){
					groupArr.push(item.sessionId);
				}
			});
			let froms = fromArr.join(',');
			let groupIds = groupArr.join(',');
			this.apiSDK.updateOfflineMessageRead(froms, groupIds, res => {
				console.log('设置离线消息为已读');
				console.log(res);
				if( res.ret == 0 ){
					this.sessions = [];
				}
			});
		},
		// 获取会话消息
		getSessions() {
			if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
				if (this.isHasUnreadMsg) {
					this.isHasUnreadMsg = false;
					this.sessions = [];
				
					// 订阅会话列表
					this.apiSDK.subscribeMessageSessionPreview(Enum.enumSubscribeType.sessionMsg.subscribeSessionMsgUnread, true);

					// 会话列表回调
					this.apiSDK.setReceiveMessageSessionPreviewCallback1(res => {
						this.sessions = res.sessions
						this.badgeValue=this.sessions.length;
					});
				}
			}
		},
	}
}
</script>

<style scoped>
#divHeader2{
	width: 100%;
	padding: 0px;
	margin: 0px;
	height: 72px;
	background-image: url(../../../static/main/head/header_bg.png);
	background-repeat:no-repeat;
	background-size:cover;
	background-color: transparent;
	background-color: #0f5794;
	box-sizing: border-box; 
}

#divHeaderLogoWrap {
    float: left;
/*    display: inline-block;*/
    width: 414px;
	height: 45px;
	margin-top: 14px;
	margin-left: 10px;
    background: url(../../../static/main/head/logo_03-.png) no-repeat left top; 
    background-size: cover;
}
#divHeaderLogoWrap .logo_icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  /* background: url(../../../static/main/head/header_login.png) no-repeat;  */
    background: url(../../../static/common/login_icon_u16.png) no-repeat; 
  
  background-size: 32px;
  margin-top: 5px;
  vertical-align: middle
}
#divHeaderLogoWrap .logo_name{
	display: inline-block;
    vertical-align: middle;
	color:#fff;
}

#divHeaderRight{
	float: right;
	margin-top: 8px;
	margin-right: 10px;
	margin-bottom: 8px;
}
.msgIconBox{
	display: inline-block;
	width: 26px;
	height: 26px;
	/* background: pink; */
	float: left;
	/* margin-right: 10px; */
	cursor: pointer;
	margin-top:14px;
}
.msgIconBox .msgIcon{
	display: inline-block;
	width: 26px;
	height: 26px;
}
.msgIconBox .unreadMsgIcon{
	background: url(../../../static/main/head/icon_email_new.png) no-repeat;
}
.msgIconBox .readMsgIcon{
	background: url(../../../static/main/head/icon_email_normal.png) no-repeat;
}
#divHeaderRight_1{
	float:left;
	height: 24px;
	line-height: 24px;
	vertical-align:middle;
	color:#FFFFFF;
	/* margin-right: 10px; */
	padding-left: 20px;
	/* padding-right: 20px; */
	/* border-radius: 4px; */
	/* border: 1px solid #fff; */
	font-family: "寰蒋闆呴粦";
	font-size: 18px;
	margin-top:18px;
	cursor: pointer;
}
.icon-userphoto{
	display: inline-block;
	width: 26px;
	height: 26px;
	margin: -4px 5px 0 0;
	vertical-align: middle;
	background: url(../../../static/main/head/logo_photo.png) no-repeat;
}
#divHeaderRight_1.Menuactived .icon-userphoto{
	background: url(../../../static/main/head/logo_photo_active.png) no-repeat;
}

#labUserName{ color:#FF0000; }
#labUserStatus>i{
	font-size:12px;
	color:#bbb
}
#labUserStatus.close>i{
	color:#eea236
}
#labUserStatus.open>i{
	color:#398439
}
#btnExit{
	width: 46px;
	height: 26px;
	outline: none;
	border-width:0px;
	cursor:pointer;
	background-image: url(../../../static/main/head/header-menu.png);
	background-size: cover;
	background-color: transparent;
	margin-top:14px;
}
#btnExit:focus{
	background-image: url(../../../static/main/head/header-menu_active.png);
}

.unreadMsgbox{
	width:530px;
	height: 450px;
	border:1px solid #c8cdd5;
	margin: 15px;
	overflow: auto;
}
.unreadMsgbox .custom-popover{
	padding-bottom: 0px;
}
.unreadMsgbox .hasNoMsg{
	    padding-left: 15px;
}
.unreadMsgbox ul{
	margin: 0;
	padding: 0;
}
.unreadMsgbox ul li{
	height: 74px;
	border-bottom:1px solid #c8cdd5;
	box-sizing: border-box;
	padding: 15px 20px;
	cursor: pointer;
}
.unreadMsgbox ul li:hover{
	background-color: #b1e0ff;
}
.unreadMsgbox ul li p{
	margin: 0;
}
.senderInfo .senderName{
	display: inline-block;
	max-width: 260px;
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	font-size: 16px;
	line-height: 16px;
	color: #323232;
	vertical-align: middle;
}
.senderInfo .msgCount{
	display: inline-block;
	font-size: 16px;
	line-height: 16px;
	color: #323232;
	vertical-align: middle;
}
.senderInfo .senderTime{
	display: inline-block;
	width: 150px;
	font-size: 14px;
	line-height: 14px;
	color: #666;
	float: right;
	text-align: right;
}
.msgInfo .msgContent{
	display: inline-block;
	max-width: 80%;
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	font-size: 14px;
	line-height: 24px;
	color: #666;
}
</style>