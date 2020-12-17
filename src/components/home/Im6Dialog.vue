<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="即时消息" width="1000px" class="custom-dialog" left @closed="closedDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row :gutter="24">
                <!-- 左侧的tree -->
                <el-col :span="7">
                    <div class="leftTitle">
                        <div class="active">
                            当前对话
                            <div class="many-people" title="新建" @click="openUserDialog"></div>
                        </div>
                    </div>
                    <div class="session-list">
                        <template v-for="item in sessions">
                            <div class="item" @click="switchSession(item)" :class="currentSession.user === item.user ? 'active':''">
                                <span class="icon" :class="item.mFlag == 2 ? 'group' : 'person'"></span>
                                <span class="readed-point" v-if="item.cnt !== '0'">{{item.cnt > 99 ? '99+' : item.cnt}}</span>
                                <span class="user-name">{{getName(item.mFlag, item.user)}}</span>
                                <!-- <span class="deleteSession"></span> -->
                            </div>
                        </template>
                    </div>
                </el-col>
                <!-- 右侧的对话框 -->
                <el-col :span="17">
                  <div style="height: 100%" v-show="rightVisible">
                    <div class="rightTitle">
                        <span>{{getName(currentSession.mFlag, currentSession.user)}}</span>
                        <!-- <el-button type="text" class="add-btn addUser" style="float: right;" title="编辑"></el-button> -->
                    </div>
                    <div class="rightContent" id="msgContent">
                        <!-- {{currSession.messages, rightTitle}} -->
                        <div class="haveOther">
                            <p class="has" v-if="haveOther" @click="getHistoryMsg(currentSession, false)">查看更多消息</p>
                            <p class="none" v-if="!haveOther">没有更多消息了</p>
                        </div>
                        <template v-for="item in messages">
                            <div class="content-list" :class="item.isMe ? 'me' : ''">
                                <p class="content-title">
                                    <span class="name">{{getName('1', item.sendjid)}}</span>
                                    <span class="date">{{new Date(item.time).formatDate('yyyy-MM-dd HH:mm:ss')}}</span>
                                </p>
                                <div class="content-html" v-html="item.content"></div>
                            </div>
                        </template>
                    </div>
                    <div class="toolbar">
                        <el-popover placement="top-start" width="218" trigger="hover">
                          <div class="emotions" v-if="emotions.faces">
                              <ul class="clearfix">
                                  <li v-for="item in faces" :key="item.key" @click="emotionChange(item)">
                                    <img :src="item.url" :title="item.tip" :width="emotions.width" :height="emotions.height" />
                                  </li>
                              </ul>
                              <div class="pages">
                                <span v-for="item in Math.ceil(emotions.faces.length / 32)" @click="switchEmotions(item-1)" :class="facesPage === (item-1) ? 'active': ''">{{item}}</span>
                              </div>
                          </div>
                          <el-button type="text" slot="reference">表情</el-button>
                        </el-popover>
                        <el-popover placement="top-start" trigger="hover" popper-class="file-btn">
                          <ul>
                            <li @click="upload('image')">发送图片</li>
                            <li @click="upload('file')">发送文件</li>
                          </ul>
                          <el-button type="text" slot="reference">文件</el-button>
                        </el-popover>
                    </div>
                    <div class="rightInputDialog">
                        <div class="content">
                            <div id="editor"></div>
                        </div>
                        <div class="buttons">
                            <el-button type="primary" class="inputDialogBtn" @click="sendMessage">发送</el-button>
                            <el-button class="inputDialogBtn" @click="closedDialog">取消</el-button>
                        </div>
                    </div>
                  </div>
                </el-col>
            </el-row>
        </el-dialog>
        <select-resource ref="selectResourceDialog" @resourceEvent="addUsers" />
    </div>
</template>

<script>
import axios from 'axios'
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import Enum from "@/common/enum";
// import '@/sdk/imSdk/sdkURL'
// import imSdk from '@/sdk/imSdk/sdk';
// let imSdk = null;
import '@/sdk/imSdk/common/lib/kindeditor-all';
export default {
    name: 'SendRequestDialog',
    components: {
        PersonTree,
        Enum,
        SelectResource,
    },
    data() {
        return {
            isVisible: false,
            rightVisible: false,
            sessions: [],
            currentSession: {},
            messages: [],
            sendContent: '',
            sendContentHtml: '',
            faces: [],
            facesPage: 0,
            emotions: {},
            editor: null,
            mucsIds: [],
            mucs: null,
            users: null,
            haveOther: false,
            USER: xtxk.cache.get('USER'),
        };
    },
    // 初始化
    mounted() {

    },
    methods: {
        ready(addUserObj) {
            this.imSDK && this.imSDK.ready(async () => {
                console.log('即时通讯ready---------');
                if (!this.users) {
                    this.users = await this.imSDK.getCompanyStruct();
                }
                const sessionList = await this.imSDK.getSessionList();

                if (sessionList.ret) {
                    sessionList.data.map((item) => {
                        if (item.mFlag === '2') {
                            this.mucsIds.push(item.user);
                        }
                    });
                    this.mucs = await this.cacheUserCard(this.mucsIds, false);
                    this.sessions = sessionList.data;
                    if (addUserObj) {
                        this.addUsers([[addUserObj]]);
                        this.switchSession(this.sessions[0], true);
                    }
                }
            }, () => {
                console.log('即时通讯服务不可用');
            })
        },
        // 接收 message 消息
        reciveMessage() {
            let that = this;
            this.imSDK.message.on('message', async (msg) => {
                if (['chat', 'groupchat'].indexOf(msg.type) > -1) {
                    // console.log('msg-----------'+JSON.stringify(msg));
                    let user = msg.type === 'chat' ? 'sendjid' : 'muc';
                    // 消息匹配当前会话
                    if (that.currentSession && that.currentSession.user === msg[user]) {
                        let idx = that.messages.findIndex(item =>(item.id === msg.id));
                        if(idx === -1) {
                            that.messages.push(msg);
                            that.scrollToBottom();
                        }
                    } else {
                        // 非当前会话显示数字
                        let idx = that.sessions.findIndex(item => (item.user === msg[user]));
                        if (idx > -1) {
                            let cnt = parseInt(that.sessions[idx].cnt);
                            that.sessions[idx].cnt = (cnt + 1).toString();
                        } else {
                            // 无会话创建会话
                            // that.sessions.unshift({user: msg.type === 'chat' ? msg.sendjid : msg.muc, create_time: msg.time, cnt: '1', mFlag: msg.type === 'chat' ? '1' : '2'});
                            that.addSession(msg);
                        }
                    }

                    this.hasAllReadMsg();
                    // if (msg.content.indexOf(this.USER.userName + ' 创建聊天室') > -1) {
                    //     this.messages = [msg];
                    // }
                    // if (msg.content.indexOf(this.USER.userName + ' 邀请') > -1) {
                    //     this.messages.push(msg);
                    // }
                }
            });
        },
        async getHistoryMsg(session, isFirst) {
            // 单聊: getHistoryMsg; 群:getGroupHistoryMsg;
            let methods = session.mFlag === '1' ? 'getHistoryMsg' : 'getGroupHistoryMsg'
            const res = await this.imSDK[methods](session.user, 20, isFirst);
            if (res.ret) {
                this.haveOther = res.data.haveOther;
                if (isFirst) {
                    this.messages = res.data.msgs;
                    this.scrollToBottom();
                } else {
                    this.messages = res.data.msgs.concat(this.messages);
                }
            }
        },
        async sendMessage() {
            let msg = null;
            let content = this.editor.html();
            // 限制字符输入长度
            var rel = new RegExp("<.+?>","g");
            var str = content.replace(rel,"");
           if(str.length == 0){
             // 表情个数限制
             if(content.indexOf("<img") != -1){
               let imgCount = content.split("<img").length - 1
               if(imgCount > 0 && imgCount < 140){
                 msg = await this.imSDK.sendMessage(content);
                 this.messages.push(msg);
               }else {
                 this.$message({
                   message: '字符输入长度过长，最多支持140个字符，请重新输入',
                   type: 'warning'
                 });
                 return
               }
             }
           }else {
             // 文字 + 表情长度
             if(content.indexOf("<img") != -1){
               let imgCount = content.split("<img").length - 1
               if(imgCount + str.length > 0 && imgCount + str.length < 140 ){
                 msg = await this.imSDK.sendMessage(content);
                 this.messages.push(msg);
               }else {
                 this.$message({
                   message: '字符输入长度过长，最多支持140个字符，请重新输入',
                   type: 'warning'
                 });
                 return
               }
             }else {
               if(str.length < 140){
                 msg = await this.imSDK.sendMessage(content);
                 this.messages.push(msg);
               }else {
                 this.$message({
                   message: '字符输入长度过长，最多支持140个字符，请重新输入',
                   type: 'warning'
                 });
                 return
               }
             }
           }
            this.editor.html('');
            this.scrollToBottom();
        },
        async addUsers(data) {
            let users = data[0].map(item => {
                return {jid: item.id + '@' + startalkNav.baseaddess.domain, nick: item.name}
            });
            // 人数少于2人 不创建群聊或加人  而是个人会话
            if (users.length > 1) {
                // 添加自己
                users.push({jid: this.USER.userId + '@' + startalkNav.baseaddess.domain, nick: this.USER.userName});
                let res = await this.imSDK.addUser(users, true);
                if (res.ret) {
                    // debugger
                    // setTimeout(async() => {
                        // this.mucs = await this.cacheUserCard(this.mucsIds, false);
                        // this.switchSession(this.sessions[0], true);
                    // },300)
                } else {
                    this.$message({ type: 'waning', message: res.errmsg });
                }
            } else { // 添加单人会话
                let session = null;
                let index = this.sessions.findIndex(item => (users[0].jid === item.user))
                if (index > -1) {
                    session = this.sessions[index];
                } else {
                    session = {user: users[0].jid, mFlag: '1', cnt: '0'}
                    this.sessions.unshift(session);
                }
                this.switchSession(session);
            }
        },
        switchSession(session, isFirst = true) {
            this.currentSession = session;
            this.currentSession.cnt = '0';
            this.getHistoryMsg(session, isFirst);
            this.showRightMsg();
        },
        // 显示右聊天框
        showRightMsg() {
            if (!this.rightVisible) {
                this.rightVisible = true;
                setTimeout(() => {
                    if (!this.editor) {
                        this.getEditor();
                    }
                }, 300)
            }
        },
        // 通过消息添加会话
        addSession(msg) {
            if (msg.type === 'groupchat') {
                setTimeout(async() => {
                    let index = this.mucsIds.findIndex(item => (item === msg.muc));
                    if (index === -1) {
                        this.mucsIds.push(msg.muc);
                        this.mucs = await this.cacheUserCard(this.mucsIds, false);
                        this.sessions.unshift({user: msg.muc, create_time: msg.time, cnt: '1', mFlag: '2'});
                    }
                }, 300)
            } else if (msg.type === 'chat') {
                this.sessions.unshift({user: msg.sendjid, create_time: msg.time, cnt: '1', mFlag: '1'});
            }
        },
        async cacheUserCard(users, isChat) {
            const res = await this.imSDK[isChat ? 'getUserCard' : 'getGroupCard'](users);
            return res;
        },
        getEmotions() {
            this.emotions = Object.assign({}, window.QtalkSDK.emotions[0]);
            this.switchEmotions(0);
        },
        switchEmotions(page) {
            let start = page === 0 ? 0 : (page * 32);
            let end = page === 0 ? 32 : ((page + 1) * 32);
            this.faces = this.emotions.faces.slice(start, end);
            this.facesPage = page;
        },
        emotionChange(face) {
            const style = `style="width:${this.emotions.width};height:${this.emotions.height}"`;
            const img = `<img src="${face.url}" data-emoticon="${face.shortcut}" data-categery="${this.emotions.categery}" ${style} />`;
            this.sendContentHtml += img;
            this.editor.insertHtml(img);
        },
        upload(type) {
            this.imSDK.uploadImg({type, success: (msg) => {
                    if (this.currentSession.mFlag === '1') {
                        this.messages.push(msg);
                    }
                    this.scrollToBottom();
                }
            });
        },
        scrollToBottom(elName) {
            this.$nextTick(() => {
                setTimeout(() => {
                    let $div = document.querySelector('#msgContent');
                    if ($div) {
                        $div.scrollTop = $div.scrollHeight;
                    }
                }, 100)
            });
        },
        getName(mFlag, user) {
            if (mFlag === '1') {
                let idx = this.users && this.users.data && this.users.data.findIndex(item => (item.U === user.split('@')[0] || ''));
                if (idx && idx > -1) {
                    return this.users.data[idx].N;
                } else {
                    return user;
                }
            } else if (mFlag === '2') {
                return this.mucs && this.mucs.data[user].SN;
            }
        },
        openUserDialog() {
            this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.sendRequest);
        },
        showDialog(user) {
            this.isVisible = true;
            this.$store.commit("setHasUnreadMsg", false);
            // 登录即时通讯服务
            // const USER = xtxk.cache.get("USER");
            // this.imSDK.connection.connect(USER.userId, 'testpassword', startalkNav.baseaddess && startalkNav.baseaddess.domain, false);
            this.ready(user);
            this.reciveMessage();
            // 获取表情列表
            if(Object.keys(this.emotions).length <= 0) {
                this.getEmotions();
            }
            this.$nextTick(() => {
                xtxk.media.setDialogTop("即时通讯");
                this.addEvent();
            });
        },
        closedDialog() {
          this.isVisible = false;
          this.rightVisible = false;
          this.currentSession = {};
          this.messages = [];
          this.sessions = [];
          // this.editor = null;
        },
        getEditor() {
            let that = this;
            this.editor = window.KindEditor.create('#editor', {
                loadStyleMode: false,
                pasteType: 1,
                items: [],
                newlineTag: 'br',
                htmlTags: {
                  br: [],
                  img: ['src', 'data-emoticon', 'data-type', 'data-categery', 'width', 'height', 'alt', 'title', '.width', '.height']
                }
            });
            window.QtalkSDK.$(this.editor.edit.iframe[0].contentWindow.window).on('keydown', (e) => {
                if (e.keyCode === 13) {
                    that.sendMessage();
                    return false;
                }
                return true;
            })
        },
        // 查询是否有未读消息
        hasAllReadMsg() {
            let ind = this.sessions.findIndex(item => item.cnt !== '0');
            console.log('ind----------------'+ind)
            if (ind === -1) {
                this.$store.commit("setHasUnreadMsg", false);
            }
        },
        addEvent() {
            document.querySelector('#msgContent').addEventListener('click', e => {
                if (e.target.dataset.cScene !== undefined) {
                    let sceneID = e.target.textContent;
                    this.apiSDK.getArrangeConferenceDetail(sceneID, (res) => {
                        this.apiSDK.publishDiscussConference(res.sceneID, 
                            res.sceneName, 
                            res.description,
                            '',
                            res.creatorName, 
                            '', 
                            res.pwd, 
                            res.mediaType, 
                            'immediately', 
                            res.arrangeTime, 
                            '', 
                            [], 
                            res.arrangeLength)
                    })
                }
            })
        },
    }
};
</script>
<style>
.rightInputDialog .el-textarea > textarea {
  border: none;
}
.mainPersonTree .treeWrap > div.el-tree {
  background-color: #e9f3fa;
}
.mainPersonTree .serachWrap .search .el-input__inner {
  font-size: 12px;
  text-indent: 3px;
}
.file-btn{
  min-width: 80px;
  padding: 5px;
}
</style>

<style scoped>
.el-dialog__body > .el-row > div {
  height: 732px;
  padding: 0 !important;
  background-color: #e9f3fa;
  border: solid 1px #c8cdd5;
}
/* 样式修改 */
.leftTitle {
  position: relative;
  width: 100%;
  height: 43px;
  line-height: 42px;
  text-align: center;
  /* cursor: pointer; */
  box-sizing: border-box;
  /* padding-left: 10px; */
  border-bottom: solid 1px #c8cdd5;
}
/* 样式修改 */
.leftTitle > .active {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  color: #128bf1;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
}
.leftTitle > .el-tabs {
  border: 0;
}
/deep/ .leftTitle .el-tabs__header {
  margin-bottom: 0px;
  padding: 0;
}
/deep/ .leftTitle .el-tabs__item {
  padding: 0 0 0 56px;
}
/deep/ .leftTitle .el-tabs__item.is-top:nth-child(2) {
  padding-left: 58px;
}
/deep/ .el-tabs__nav-wrap::after {
  background-color: #c2dff3;
}

.many-people {
  position: absolute;
  right: 0;
  top: 0;
  width: 42px;
  height: 42px;
  background: url(../../../static/sendRequest/icon_group.png) no-repeat center center;
  cursor: pointer;
}
.mainPersonTree {
  margin-top: 42px;
  border-top: solid 1px #c8cdd5;
}
.btnLaunch {
  position: absolute;
  bottom: 15px;
  left: 90px;
}
.session-list {
    height: 687px;
    overflow: auto;
}
.session-list .item {
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}
.session-list .item.active {
  background-color: #128bf1;
  color: #fff;
}
.session-list .item .icon {
  width: 35px;
  height: 25px;
  margin: 0 10px;
  display: inline-block;
}
.session-list .user-name {
  width: 215px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* 单人的 */
.session-list .item .icon.person {
  background: url(../../../static/sendRequest/icon_person.png) center no-repeat;
}
.session-list .item.active .icon.person {
  background: url(../../../static/sendRequest/icon_person_selected.png) center
    no-repeat;
}
/* 多人的 */
.session-list .item .icon.group {
  background: url(../../../static/sendRequest/icon_group.png) center no-repeat;
}
.session-list .item.active .icon.group {
  background: url(../../../static/sendRequest/icon_group_selected.png) center
    no-repeat;
}
.session-list .item .readed-point {
    position: absolute;
    left: 32px;
    top: 6px;
    width: 25px;
    height: 16px;
    border-radius: 14px;
    background-color: #f90102;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
}
/* 右侧 */
.rightTitle {
  height: 41px;
  background-color: #e9f3fa;
  border: solid 1px #c2dff3;
  line-height: 42px;
  color: #128bf1;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  border-bottom: 1px solid #c2dff3;
}
.rightTitle > span:nth-child(1) {
  margin-left: 10px;
  display: inline-block;
  width: 634px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.addUser {
  margin-top: 13px;
  margin-right: 10px;
}
.rightContent {
  position: relative;
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 300px);
  background: #fff;
}
.content-list {
  margin: 10px 20px 15px;
}
.content-html {
}
.content-html /deep/ img {
    max-width: 95%;
}
.content-list.me{
    text-align: right;
}
.content-title {
  margin: 0;
  padding: 0;
  margin-bottom: 6px;
  font-family: "MicrosoftYaHei";
}
.content-title .name{
  color: #666;
}
.content-title .date{
  color: #999;
  margin: 0 0 0 5px;
}
.content-detail {
  margin: 0;
  padding: 0;
  line-height: 18px;
  color: #0f5794;
}
.contentFileDetail{
    margin: 0;
    padding: 0;
    line-height: 18px;
    color: #409EFF;
    cursor: pointer;
}
.rightInputDialog > .el-row {
  width: 100%;
  margin: 0 !important;
  height: 42px;
  background-color: #eeeeee;
  border: solid 1px #c8cdd5;
  border-left: none;
  border-right: none;
  position: relative;
}
.rightInputDialog > .el-row > div {
  /* padding-left: 5px !important;
        padding-right: 5px !important; */
  margin-top: 8px;
}
.rightInputDialog .content {
  height: 143px;
  background: #fff;
  position: relative;
}
.rightInputDialog .content .editor{
    position: absolute;
}
.rightInputDialog .buttons {
  height: 70px;
  background-color: #eeeeee;
  border: solid 1px #c8cdd5;
  line-height: 70px;
  display: flex;
  justify-content: center;
  border-left: none;
  border-right: none;
  border-bottom: none;
}
/* .rightInputDialog > div.el-row > div:last-child {
  position: absolute;
  right: 0;
} */
.inputDialogBtn {
  width: 120px;
  height: 40px;
  margin-top: 17px;
}
.grid-content {
  text-align: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 12px;
}
.uploadImg{
  opacity: 1;
  width: 24px;
  height: 24px;
}
/deep/ .el-upload{
  width: 24px;
  height: 24px;
}
.uploadimg-btn{
  display: inline-block;
  width: 24px;
  height: 24px;
  opacity: 0;
}
/* .grid-content > img {
        margin-top: 8px;
    } */
.toolbar{
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
}
.file-btn li{
  list-style: none;
  text-align: center;
  line-height: 26px;
  cursor: pointer;
}
.emotions ul{
  height: 108px;
}
.emotions ul li{
  float: left;
  box-sizing: border-box;
  margin: 1px;
  list-style: none;
  width: 25px;
  height: 25px;
}
.emotions ul li:hover{
  border: 1px solid #ddd;
}
.emotions .pages{
  text-align: center;
}
.emotions .pages span{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 5px;
  font-size: 0;
  cursor: pointer;
}
.emotions .pages span.active{
  background-color: #07b5e9;
}
.haveOther{
    margin: 5px;
    font-size: 12px;
    text-align: center;
}
.haveOther .has{
    cursor: pointer;
}
</style>
