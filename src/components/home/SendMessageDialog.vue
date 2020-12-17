<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="即时通讯" width="1000px" class="custom-dialog" left @closed="closedDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row :gutter="24">
                <!-- 左侧的tree -->
                <el-col :span="7">
                    <div class="leftTitle">
                        <div class="active">
                            当前对话
                            <div class="many-people" @click="typeResource='add';openResource();" title="新建"></div>
                        </div>
                    </div>
                    <div class="session-list">
                        <div class="item" v-for="(item, index) in sessions" :key="item.key" :class="compareUser(item, sessions[currSessionIndex]) ? 'active' : ''" @click="changeSession(index)">
                            <span class="icon" :class="item.chat_type == 2 ? 'group' : 'person'"></span>
                            <span class="readed-point" v-show="item.unReadedCount > 0"></span>
                            <span class="user-name" v-if="item.chat_type == 1">{{item.from == userInfo.userId?item.toName:item.fromName}}</span>
                            <span class="user-name" v-if="item.chat_type == 2">{{item.group_name}}</span>
                            <span class="deleteSession" @click="handleDeleteSession(item, index)"></span>
                        </div>
                    </div>
                </el-col>
                <!-- 右侧的对话框 -->
                <el-col :span="17">
                     <div class="rightTitle">
                        <span v-if="sessions.length > 0 && sessions[currSessionIndex].chat_type == 1">{{sessions[currSessionIndex].from == userInfo.userId?sessions[currSessionIndex].toName:sessions[currSessionIndex].fromName}}</span>
                        <span v-if="sessions.length > 0 && sessions[currSessionIndex].chat_type == 2">{{sessions[currSessionIndex].group_name}}</span>
                        <el-button type="text" class="remove-btn addUser" style="float: right;" @click="handleRemoveSessionMember" title="移除成员" v-if="isShowRemoveMember"></el-button>
                        <el-button type="text" class="add-btn addUser" style="float: right;" @click="typeResource='edit';addUser();" title="添加成员"></el-button>
                    </div>
                    <div class="rightContent" id="msgContent">
                        <el-dialog title="移除成员" :visible.sync="removeDialogVisible" width="30%"  class="custom-dialog" center :modal="false" :close-on-click-modal="true">
                            <div class="memberBox">
                                <ul>
                                    <li v-for="item in forRemoveMembers" :key="item.userId">
                                        <span class="rUserName">{{item.userName}}</span>
                                        <span class="rbutton" v-if="item.userId != userInfo.userId" @click="removeMember(item)"></span>
                                    </li>
                                </ul>
                                <el-button type="primary" @click="confirmRemoveMember">确定</el-button>
                            </div>
                        </el-dialog>
                        <div v-if="sessions.length > 0">
                            <div class="content-list" v-for="item in sessions[currSessionIndex].messages" :key="item.key">
                                <p class="content-title">
                                    <span>{{item.senderName}}</span>
                                    <span>({{item.sendTime}})</span>
                                </p>
                                <!-- msg_type:"消息类型int类型(0-text 1-image 2-voice 3-video) -->
                                <p v-if="item.msg_type == 0" class="content-detail">{{item.content}}</p>
                                <img v-if="item.msg_type == 1" :src="JSON.parse(item.content).downloadUrl" alt="" class="megImg">
                                <!-- <p v-if="item.msg_type == 2 || item.msg_type == 3" class="contentFileDetail" @click="handleOpenFile(item)">&lt;{{JSON.parse(item.content).filename}}&gt;</p> -->
                                <div v-if="item.msg_type == 2" class="contentFileDetail">
                                    <audio v-if="isSupportH5()" :src="JSON.parse(item.content).downloadUrl" controls width="300px" height="30px">
                                    </audio>
                                    <div v-else>
                                        <span @click="handleOpenFile(item)">&lt;{{JSON.parse(item.content).filename}}&gt;</span><br/>
                                        <p class="tips">您当前浏览器暂不支持播放该文件，请点击文件下载到本地播放</p>
                                    </div>
                                </div>
                                <div v-if="item.msg_type == 3" class="contentFileDetail">
                                    <video v-if="isSupportH5() && JSON.parse(item.content).filename.indexOf('.mp4') > -1" :src="JSON.parse(item.content).downloadUrl" controls width="400px" height="300px">
                                    </video>
                                    <div v-else>
                                        <span @click="handleOpenFile(item)">&lt;{{JSON.parse(item.content).filename}}&gt;</span><br/>
                                        <p class="tips">您当前浏览器暂不支持播放该文件，请点击文件下载到本地播放</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rightInputDialog">
                        <el-row :gutter="10">
                            <el-col v-for="item in toolHurdle" :key="item.key" :span="2">
                                <div class="grid-content" :title="item.title" :class="item.class" @click="selectMenu(item)">
                                    <div v-if="item.class==='icon_photo'">
                                        <el-upload
                                            class="uploadImg"
                                            ref="uploadImg" 
                                            accept="image/jpg,image/png,image/jpeg,image/bmp,image/ico"
                                            :action="uploadUrl"
                                            :auto-upload="true"
                                            :file-list="imgFileList"
                                            :before-upload="handleBeforeImgUpload"
                                            :on-success="handleUploadImgSuccess"
                                        >
                                            <i class="uploadimg-btn">上传图片</i>
                                        </el-upload>
                                    </div>
                                    <div v-if="item.class==='icon_vedio'">
                                        <el-upload
                                            class="uploadImg"
                                            ref="uploadVideo"
                                            accept="video/mp4,video/avi,video/rm,video/rmvb,video/mov,video/3gp,video/flv,video/mkv"
                                            :action="uploadUrl"
                                            :auto-upload="true"
                                            :file-list="videoFileList"
                                            :before-upload="handleBeforeVideoUpload"
                                            :on-success="handleUploadVideoSuccess"
                                        >
                                            <i class="uploadimg-btn">上传视频</i>
                                        </el-upload>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <div v-if="showToolHurdle.showFontLine" class="lineFont">
                            <span>字体</span>
                            <el-select placeholder="请选择" v-model="osdFontValue" @change="osdFontSelectChange">
                                <el-option
                                v-for="item in osdFontOptions"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="label">字号</span>
                            <el-select placeholder="请选择" v-model="osdSizeValue" @change="osdSizeSelectChange">
                                <el-option
                                v-for="item in osdSizeOptions"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="label">颜色</span>
                            <el-color-picker v-model="osdColorValue" color-format="rgb" @change="osdColorChange"></el-color-picker>
                        </div>
                        <div class="content">
                            <el-input
                                type="textarea"
                                id="contentInput"
                                autofocus="true"
                                placeholder="请输入内容"
                                v-model="messageContent"
                                maxlength="1024"
                                @keyup.enter.native="sendMessage"
                            ></el-input>
                                <!-- :autosize="{ minRows: 6, maxRows: 10}" -->
                        </div>
                        <div class="buttons">
                            <el-button type="primary" @click="sendMessage" class="inputDialogBtn">发送</el-button>
                            <el-button class="inputDialogBtn" @click="closedDialog">取消</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <select-resource ref="selectResourceDialog" @resourceEvent="getUsers" />
    </div>
</template>

<script>
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import Enum from "@/common/enum";

export default {
    // name: 'SendRequestDialog',
    components: {
        PersonTree,
        Enum,
        SelectResource,
    },
    data() {
        return {
            isVisible: false,
            subscribeType: "",
            messageContent: "",
            toolHurdle: [
                // { title: "字体", class: "icon_font" },
                // { title: "截屏", class: "icon_screenshot" },
                { title: "上传图片", class: "icon_photo" },
                { title: "上传视频", class: "icon_vedio" },
                { title: "采集声音", class: "icon_startRecordVoice" },
                // { title: "表情", class: "icon_smile" },
                // { title: "", class: "icon_line" },
                // { title: "聊天记录", class: "icon_list" },
                // { title: "全屏", class: "icon_conputer" },
                // { title: "回执", class: "icon_pdf" },
                // { title: "统计", class: "icon_link" },
                // { title: "刷新", class: "icon_clock" }
            ],
            showToolHurdle: {
                showFontLine: false
            },
            selectResourtce: false,
            sessions: [], //会话列表
            currSessionIndex: 0, // 当前会话下标
            userInfo: xtxk.cache.get("USER"),
            isLoading: false,
            typeResource: "add",
            //字体枚举：宋体，黑体，楷体，隶书，微软雅黑
            osdFontOptions: [
                {
                    value: "宋体", // SIM_SUN
                    label: "宋体"
                },
                {
                    value: "黑体", // SIM_HEI
                    label: "黑体"
                },
                {
                    value: "楷体", // SIM_KAI
                    label: "楷体"
                // }, {
                //     value: '隶书', // SIM_LI
                //     label: '隶书'
                },
                {
                value: "微软雅黑", // SIM_MICRO
                label: "微软雅黑"
                }
            ],
            osdFontValue: "微软雅黑", //字体值
            //字号枚举: 10，12，14，16，18，24，28，32，36px----分别对应1-9号字
            osdSizeOptions: [
                {
                    value: Enum.enumFontSize.One,
                    label: "1"
                },
                {
                    value: Enum.enumFontSize.Two,
                    label: "2"
                },
                {
                    value: Enum.enumFontSize.Three,
                    label: "3"
                },
                {
                    value: Enum.enumFontSize.Four,
                    label: "4"
                },
                {
                    value: Enum.enumFontSize.Five,
                    label: "5"
                },
                {
                    value: Enum.enumFontSize.Six,
                    label: "6"
                },
                {
                    value: Enum.enumFontSize.Seven,
                    label: "7"
                },
                {
                    value: Enum.enumFontSize.Eight,
                    label: "8"
                },
                {
                    value: Enum.enumFontSize.Nine,
                    label: "9"
                }
            ],
            osdSizeValue: Enum.enumFontSize.Three, //字号值
            osdColorValue: "rgb(19, 91, 206)",

            imgFileList:[],
            videoFileList:[],
            uploadUrl:"",
            recorder:null,
            timer:null,
            recordVoice:'',
            forUploadImgSession:"",
            forUploadVideoSession:"",
            forUploadRecordSession:"",
            
            existedGroup:[],
            removeDialogVisible:false,
            forRemoveMembers:[],
            isShowRemoveMember:false,
        };
    },
    // 初始化
    mounted() {},
    methods: {
        isSupportH5(){
            var video = document.createElement('video');
            if( typeof(video.canPlayType) ){
                return true;
            }else{
                return false;
            }
        },
        handleOpenFile(item){
            // console.log(item);
            window.open(JSON.parse(item.content).downloadUrl);
        },
        handleUploadImgSuccess(response, file){
            console.log('on-success-img');
            // console.log(response.data.fileId);
            let fileId = response.data.fileId;
            if(fileId){
                let session = this.forUploadImgSession;
                if( !session ){
                    this.$message({message: '请选择会话', type: 'warning'});
                    return ;
                }
                let sessionId = session.sessionId ? session.sessionId : "";
                // 去除自己
                let users = [];
                session.users.forEach(item => {
                    if (item.userId !== this.userInfo.userId) {
                        users.push(item);
                    }
                });
                let to = '';
                if( session.chat_type == 1 ){
                    to = session.to == this.userInfo.userId ? session.from : session.to;
                }
                let msg_type = 1;
                this.apiSDK.sendMessage(sessionId, users, fileId, to, msg_type);
            }else{
                console.log('图片上传失败');
            }
        },
        handleBeforeImgUpload(file){
            console.log('before-upload-img');
            // console.log(file);
            if( !file.type || !file.name ){
                return false;
            }
            var fileType = 'image/jpg,image/png,image/jpeg,image/bmp,image/ico';
            if( fileType.indexOf(file.type) == -1 ){
                this.$message({message: '文件格式：jpg/png/jpeg/bmp/ico', type: 'warning'});
                return false;
            }
            var fileSize = file.size/1024/1024;
            if( fileSize > 100 ){
                this.$message({message: '文件大小不能超过100M', type: 'warning'});
                return false;
            }
            this.forUploadImgSession =  this.sessions[this.currSessionIndex];
        },
        handleBeforeVideoUpload(file){
            console.log('before-upload-video');
            // console.log(file);
            if( !file.type || !file.name ){
                return false;
            }
            var fileType = 'video/mp4,video/avi,video/rm,video/rmvb,video/mov,video/3gp,video/flv,video/mkv';
            if( fileType.indexOf(file.type) == -1 ){
                this.$message({message: '文件格式：mp4/avi/rm/rmvb/mov/3gp/flv/mkv', type: 'warning'});
                return false;
            }
            var fileSize = file.size/1024/1024;
            if( fileSize > 100 ){
                this.$message({message: '文件大小不能超过100M', type: 'warning'});
                return false;
            }
            this.forUploadVideoSession =  this.sessions[this.currSessionIndex];
        },
        handleUploadVideoSuccess(response, file){
            console.log('on-success-video');
            // console.log(response.data.fileId);
            // console.log(file);
            let fileId = response.data.fileId;
            if(fileId){
                let session = this.forUploadVideoSession;
                if( !session ){
                    this.$message({message: '请选择会话', type: 'warning'});
                    return ;
                }
                let sessionId = session.sessionId ? session.sessionId : "";
                // 去除自己
                let users = [];
                session.users.forEach(item => {
                    if (item.userId !== this.userInfo.userId) {
                        users.push(item);
                    }
                });
                let to = '';
                if( session.chat_type == 1 ){
                    to = session.to == this.userInfo.userId ? session.from : session.to;
                }
                let msg_type = 3;
                this.apiSDK.sendMessage(sessionId, users, fileId, to, msg_type);
            }else{
                console.log('视频上传失败');
            }
        },
        // 关闭弹框
        closedDialog() {
            this.empty();
            this.isVisible = false;
            // 取消订阅会话状态
            this.apiSDK.cancelSubscribeMessageSessionPreview(
                Enum.enumSubscribeType.sessionMsg.subscribeSessionMsgUnread,
                false
            );
            this.apiSDK.cancelSubscribePreview(true);
            // 删除注册事件
            window.removeEventListener("scroll", this.scrollEvent);

            sessionStorage.setItem('isSendMessageDialog',0);
        },
        showDialog(sessions) {
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop("即时通讯");

                // 注册滚动事件
                document.querySelector("#msgContent").addEventListener("scroll", this.scrollEvent);
            });

            sessionStorage.setItem('isSendMessageDialog',1);

            this.uploadUrl = this.apiSDK.config.dataURL + '/IMGroup/uploadFile';

            // 获取历史消息成员列表
            let beginTime = new Date(new Date().getTime() - 3*24*60*60*1000).formatDate("yyyy-MM-dd HH:mm:ss");
            let endTime =  new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000 -1).formatDate("yyyy-MM-dd HH:mm:ss");
            this.apiSDK.queryHistoryMemberList( beginTime, endTime, res => {
                // console.log(res);
                res && res.forEach(item=>{
                    this.receiveSessionPreview(item);
                });
            });

            if( sessions instanceof Array ){
                sessions.forEach(item=>{
                    this.receiveSessionPreview(item);
                });
            }

            // 接收推送会话消息
            this.getSessionMessage();

            // 接收推送删除群组消息
            this.getRemoveSessionMessage();

            // 接收推送更新群组消息
            this.getRefreshSessionMessage();

            // 查询群组
            this.getGroups();
            
            // 取消邮件订阅
            this.apiSDK.cancelSubscribePreview(false);
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                // 订阅会话列表
                this.apiSDK.subscribeMessageSessionPreview(
                    Enum.enumSubscribeType.sessionMsg.subscribeSessionMsgUnread,
                    false
                );

                // 接收推送会话列表
                this.getSessions(session);
            }

        },
        getGroups(){
            this.apiSDK.queryIMGroupAPI(1, 0, 1024, res => {
                // console.log(res);
                this.existedGroup = res.length >0 ? res : [];
            });
        },
        // 消息按时间排序
        messagesConParison(str){
            return function(obj1, obj2){
                var val1 = obj1[str];
                var val2 = obj2[str];
                if( val1 < val2 ){
                    return -1;
                }else if( val1 > val2 ){
                    return 1;
                }else{
                    return 0;
                }
            }
        },
        // 接收会话显示处理
        receiveSessionPreview(session) {
            // console.log('session.unReadedCount='+session.unReadedCount);
            let _session = session;
            if (!_session) {
                this.queryNearMessagesList();
                return -1;
            }
            // 查找session在列表中是否存在
            let index = this.findIndexSession(this.sessions, _session);
            if (index === -1) {
                this.addSessionToSessions(this.sessions, _session);
                // this.setCurrentSessionIndex(this.sessions.length - 1);
            } else {
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                    // 从资源树打开,没有sessionId属性或为空
                    if ( _session.sessionId === "" || !_session.hasOwnProperty("sessionId") ) {
                        this.setCurrentSessionIndex(index);
                        // 判断当前会话列表找到的会话sessionId，查询近期消息
                        if (this.sessions[index].sessionId) {
                            this.queryNearMessagesList();
                        }
                        return;
                    }
                }
                
                // 从邮件入口打开
                if (session.hasOwnProperty("lastMessage")) {
                    this.setCurrentSessionIndex(index);
                    this.queryNearMessagesList();
                    return;
                }
                // 从服务推送，判断是否是当前高亮活动会话
                if (this.currSessionIndex === index) {
                    // 添加会话消息
                    let messages = session.hasOwnProperty("messages") ? session.messages : [];
                    if( messages.length >0 ){
                        // this.sessions[index].unReadedCount = 0;
                        messages.forEach(item=>{
                            if( this.sessions[index].messages.length == 0 ){
                                this.sessions[index].messages.push(item);
                            }else{
                                var isExistedMsg = false;
                                this.sessions[index].messages.forEach(element=>{
                                    if( item.messageId == element.messageId ){
                                    // if( item.sendTime == element.sendTime && item.senderId == element.senderId && item.content == element.content ){
                                        isExistedMsg = true;
                                    }
                                });
                                if( isExistedMsg == false ){
                                    this.sessions[index].messages.push(item);
                                }
                            }
                        });
                        this.sessions[index].messages.sort(this.messagesConParison('sendTime'));
                        if( this.sessions[index].sessionId ){
                            this.sessions[index].group_name = session.group_name;
                        }
                    }
                    this.$set(this.sessions);
                    this.$forceUpdate();
                } else {
                    // 刷新会话状态
                    // this.setCurrentSessionIndex(index);
                    // 添加会话消息
                    let messages = session.hasOwnProperty("messages") ? session.messages : [];
                    if( messages.length >0 ){
                        // this.sessions[index].unReadedCount = 1;
                        this.sessions[index].unReadedCount = session.unReadedCount;
                        messages.forEach(item=>{
                            if( this.sessions[index].messages.length == 0 ){
                                this.sessions[index].messages.push(item);
                            }else{
                                var isExistedMsg = false;
                                this.sessions[index].messages.forEach(element=>{
                                    if( item.messageId == element.messageId ){
                                    // if( item.sendTime == element.sendTime && item.senderId == element.senderId && item.content == element.content ){
                                        isExistedMsg = true;
                                    }
                                });
                                if( isExistedMsg == false ){
                                    this.sessions[index].messages.push(item);
                                }
                            }
                        });
                        this.sessions[index].messages.sort(this.messagesConParison('sendTime'));
                        if( this.sessions[index].sessionId ){
                            this.sessions[index].group_name = session.group_name;
                        }
                    }
                    this.$set(this.sessions);
                    this.$forceUpdate();
                    // this.$set(this.sessions, index, _session);
                }
                this.scrollToBottom("#msgContent");
            }
        },
        // 设置当前活动session下标
        setCurrentSessionIndex(index) {
            this.currSessionIndex = index;
        },
        // 切换会话
        changeSession(index) {
            // 切换当前会话
            this.setCurrentSessionIndex(index);
            // 设置已读
            this.sessions[index].unReadedCount = 0;
            if( this.sessions[index].chat_type == 1 ){
                this.isShowRemoveMember = false;
            }else if( this.sessions[index].chat_type == 2 ){
                this.isShowRemoveMember = true;
            }
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                // 判断当前会话列表找到的会话sessionId，查询近期消息
                if (this.sessions[index].sessionId) {
                    this.queryNearMessagesList();
                }
            }
        },
        // 删除会话
        handleDeleteSession(session, index){
            // console.log(session);
            this.$confirm('是否确认删除该对话?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if( session.chat_type == 1 ){
                    let to = session.to == this.userInfo.userId ? session.from: session.to;
                    this.apiSDK.removeUserSessionAPI(to, res=>{
                        // console.log(res);
                        if( res && res.ret == 0 ){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            var delIndex = -1;
                            this.sessions.forEach((item, index) => {
                                if( (session.to == item.to && session.from == item.from) || (session.to == item.from && session.from == item.to) ){
                                    delIndex = index;
                                }
                            });
                            if( delIndex > -1 ) {
                                this.sessions.splice(delIndex,1);
                                if( this.currSessionIndex >= this.sessions.length -1 ){
                                    // this.setCurrentSessionIndex(this.sessions.length -1);
                                    this.changeSession(this.sessions.length -1);
                                }
                                this.$set(this.sessions);
                                this.$forceUpdate();
                            }
                        }else{
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    })
                }else if( session.chat_type == 2 ){
                    let groupId = session.sessionId;
                    this.apiSDK.removeIMGroupAPI(groupId, res=>{
                        // console.log(res);
                        if( res && res.ret == 0 ){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getGroups();
                        }else{
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 移除成员按钮
        handleRemoveSessionMember(){
            if( this.sessions.length == 0 ){
                return;
            }
            let session = this.sessions[this.currSessionIndex];
            if(session.chat_type == 1){
                return;
            }
            
            this.apiSDK.queryIMGroupInfoAPI(session.sessionId, res =>{
                session.users = res;
                let isCreator = false;
                res.forEach(item=>{
                    if( item.memberType == 0 && item.userId == this.userInfo.userId ){
                        isCreator = true;
                    }
                });
                if( isCreator == true ){
                    this.forRemoveMembers = res;
                    this.removeDialogVisible = true;
                }else{
                    this.$message({message: '无此权限，请联系群组创建者移除成员', type: 'warning'});
                }
            })
        },
        removeMember(item){
            var delIndex = -1;
            this.forRemoveMembers.forEach((element, index) => {
                if( element.userId == item.userId ){
                    delIndex = index;
                }
            });
            if( delIndex > -1 ) this.forRemoveMembers.splice(delIndex,1);
        },
        // 确认移除成员
        confirmRemoveMember(){
            this.removeDialogVisible = false;
            let session = this.sessions[this.currSessionIndex];
            let groupId = session.sessionId;
            let groupName = "";
            let members = [];
            // console.log(this.forRemoveMembers);
            this.forRemoveMembers.forEach(item => {
                groupName += item.userName + ",";
                var member = {
                    memberId: item.userId,
                    // memberType: item.memberType,
                    memberType: '',
                };
                members.push(member);
            });
            groupName = groupName.substr(0, groupName.length-1);
            this.apiSDK.updateIMGroupAPI(groupId, groupName, "", JSON.stringify(members), function(obj) {
                if (obj && obj.ret == 0) {
                    // 编辑群组成功
                    // session.group_name = groupName;
                }else{
                    // 编辑群组失败
                }
            });
        },
        // 接收推送会话列表
        getSessions(session) {
            // 会话列表回调
            this.apiSDK.setReceiveMessageSessionPreviewCallback(res => {
                this.sessions = res.sessions.map(item => {
                    return {
                        sessionId: item.sessionId,
                        users: item.users,
                        lastMessage: item.lastMessage,
                        unReadedCount: item.unReadedCount,
                        // isReaded: item.unReadedCount > 0 ? false : true,
                        messages: []
                    };
                });
                // 接收会话显示
                this.receiveSessionPreview(session);
            });
        },
        // 接收推送会话消息
        getSessionMessage() {
            this.apiSDK.setInfromMessageReceiveCallback(res => {
                this.receiveSessionPreview(res);
            });
        },
        // 接收推送删除群组消息
        getRemoveSessionMessage(){
            this.apiSDK.setRemoveIMGroupCallback(res => {
                var delIndex = -1;
                this.sessions.forEach((element, index) => {
                    if( element.sessionId == res.group_id ){
                        delIndex = index;
                    }
                });
                if( delIndex > -1 ) {
                    this.sessions.splice(delIndex,1);
                    if( this.currSessionIndex >= this.sessions.length -1 ){
                        // this.setCurrentSessionIndex(this.sessions.length -1);
                        this.changeSession(this.sessions.length -1);
                    }
                    this.$set(this.sessions);
                    this.$forceUpdate();
                }
            });
        },
        // 接收推送更新群组消息
        getRefreshSessionMessage(){
            this.apiSDK.setRefreshIMGroupCallback(res => {
                this.sessions.forEach((element, index) => {
                    if( element.sessionId == res.group_id ){
                        element.group_name = res.group_name;
                    }
                });
            })
        },
        // 添加会话
        addSessionToSessions(sessions, session) {
            sessions.push(session);
        },
        // 用户匹配
        compareUser(obj1, obj2) {
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                let obj1User = obj1.users.map(item => {
                    return item.userId;
                });
                let obj2User = obj2.users.map(item => {
                    return item.userId;
                });
                obj1User.sort();
                obj2User.sort();
                return obj1User.toString() === obj2User.toString();
            }
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                if( obj1.chat_type == 1 && obj2.chat_type == 1 ){
                    return (obj1.to == obj2.to && obj1.from == obj2.from) || (obj1.to == obj2.from && obj1.from == obj2.to);
                }else{
                    return obj1.sessionId == obj2.sessionId;
                }
            }
        },
        // 根据用户查找会话下标
        findIndexSession(sessions, session) {
            let index = -1;
            if (sessions.length) {
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                    sessions.forEach((item, i) => {
                        if (this.compareUser(item, session)) {
                            index = i;
                        }
                    });
                }
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                    if( session.chat_type == 2 ){
                        sessions.forEach((item,i) => {
                            if( item.sessionId === session.sessionId ){
                                index = i;
                            }
                        });
                    }else if( session.chat_type == 1 ){
                        sessions.forEach((item, i) => {
                            if( (session.to == item.to && session.from == item.from) || (session.to == item.from && session.from == item.to) ){
                                index = i;
                            }
                        });
                    }
                }
            }
            return index;
        },
        // 查询近期消息
        queryNearMessagesList() {
            let session = this.sessions[this.currSessionIndex];
            this.apiSDK.queryNearMessagesList(session.sessionId, 10, res => {
                // 将近期消息给到当前session
                session.messages = res;
                // 滚动条滚动到底部
                this.scrollToBottom("#msgContent");
                // 设置已读
                let messagesId = [];
                res.forEach(item => {
                    if (!item.isReaded && item.senderId !== this.userInfo.userId) {
                        messagesId.push(item.messageId);
                    }
                });
                if (messagesId.length) {
                    this.apiSDK.setMessageHasReaded(session.sessionId, messagesId);
                }
            });
        },
        // 打开资源树
        openResource() {
            this.$refs.selectResourceDialog.showDialog(
                Enum.enumSubscribeType.sendRequest,
                1,
                0,
                0,
            );
        },
        // 对话中添加人员
        addUser() {
            // 没有选中对话框的时候 不能添加人员
            this.sessions.length && this.openResource();
        },
        // 新增对话
        resourceAdd(data) {
            if( data[0].length == 0 ){
                return;
            }
            let self = this;
            // let selcetPerson = data[0];
            let selcetPerson = [];
            data[0].forEach(item=>{
                if( item.id != this.userInfo.userId ){
                    selcetPerson.push(item);
                }
            });
            if (selcetPerson && selcetPerson.length > 0) {
                // var it = { chat_type:1, sessionId: "", group_name:"", from:"", fromName:"", to:"", toName:"", unReadedCount: 0, messages: [], users:[] };
                let session = {
                    chat_type:1,
                    sessionId: "",
                    group_name:"",
                    from:"",
                    fromName:"",
                    to:"",
                    toName:"",
                    unReadedCount:0,
                    messages:[],
                    users: [],
                };
                // 过滤自己，单人聊天
                if ( selcetPerson.length === 1 && selcetPerson[0].id === this.userInfo.userId ) {
                    return;
                }
                selcetPerson.length > 1 && session.users.push({
                    index: -1,
                    userName: this.userInfo.userName,
                    userId: this.userInfo.userId
                });
                selcetPerson.forEach((item, index) => {
                    session.users.push({
                        index: index,
                        userName: item.name,
                        userId: item.id
                    });
                });
                //过滤自己（多人聊天）
                let newSessionUsers = session.users.filter((fItem, index, self) => {
                    let arraied = [];
                    session.users.forEach((item, i) => {
                        arraied.push(item.userId);
                    });
                    return arraied.indexOf(fItem.userId) === index;
                });
                session.users = newSessionUsers;
                if(  session.users.length == 1 ){
                    session.to = session.users[0].userId;
                    session.toName = session.users[0].userName;
                    session.from = this.userInfo.userId;
                    session.fromName = this.userInfo.userName;
                    this.receiveSessionPreview(session);
                }
                
                //创建群组
                if (session && session.users && session.users.length > 1) {
                    let groupName = "";
                    let members = [];
                    session.users.forEach(item => {
                        groupName += item.userName + ",";
                        var memberType = 2;
                        if (this.userInfo.userId === item.userId) {
                            memberType = 0;
                        }
                        var member = {
                            memberId: item.userId,
                            memberType: memberType
                        };
                        members.push(member);
                    });
                    groupName = groupName.substr(0, groupName.length-1);
                    // console.log("创建群组组名" + groupName);

                    // console.log(this.existedGroup);
                    var isExistedGroupId = '';
                    var array2 = groupName.indexOf(',')>-1? groupName.split(','):groupName;
                    var str2 = array2.sort().toString();
                    if( this.existedGroup.length > 0 ){
                        for(var i=0;i<this.existedGroup.length;i++){
                            var item = this.existedGroup[i];
                            var array1 = item.groupName.indexOf(',')>-1? item.groupName.split(','):item.groupName;
                            var str1 = array1.sort().toString();
                            if( str1 == str2 ){
                                console.log('群组已存在');
                                isExistedGroupId = item.groupId;
                                break;
                            }
                        }
                    }
                    if( !isExistedGroupId ){
                        this.apiSDK.addIMGroupAPI(groupName, "", JSON.stringify(members), function(obj) {
                            if (obj && obj.ret == 0) {
                                // 创建群组成功
                                session.chat_type = 2;
                                session.sessionId = obj.data.groupId;
                                session.group_name = groupName;
                                // self.receiveSessionPreview(session);
                                self.addSessionToSessions(self.sessions, session);
                                // self.setCurrentSessionIndex(self.sessions.length - 1);
                                self.changeSession(self.sessions.length -1);
                                self.getGroups();
                            }else{
                                // 创建群组失败
                            }
                        });
                    }else{
                        // 在已存在的群组中查找，添加到本地对话列表中
                        let _session = {
                            chat_type:2,
                            sessionId: isExistedGroupId,
                            group_name:groupName,
                            from:"",
                            fromName:"",
                            to:"",
                            toName:"",
                            unReadedCount:0,
                            messages:[],
                            users: [],
                        };
                        this.receiveSessionPreview(_session);
                        // console.log(this.sessions);
                    }
                }
            }
        },
        // 编辑对话
        resourceEdit(data) {
            if( data[0].length == 0 ){
                return;
            }
            let self = this;
            let session = this.sessions[this.currSessionIndex];

            if( !session.sessionId ){
                if( data[0].length == 1 && (data[0][0].id == session.to || data[0][0].id == session.from) ){
                    return;
                }
                let selcetPerson = [];
                data[0].forEach(item=>{
                    if(  item.id != session.to  &&  item.id != session.from ){
                        selcetPerson.push(item);
                    }
                });

                let newSessionUsers = [];
                newSessionUsers.push({
                    index: 0,
                    userName: session.fromName,
                    userId: session.from,
                })
                newSessionUsers.push({
                    index: 1,
                    userName: session.toName,
                    userId: session.to,
                })
                
                let newSession = {
                    sessionId:'',
                    users:newSessionUsers,
                    messages:[],
                    to:'',
                    from:'',
                };

                let usersList = newSession.users.map(item => item.userId);
                selcetPerson && selcetPerson.forEach((item, index) => {
                    // console.log(item);
                    if (usersList.indexOf(item.id) == -1) {
                        newSession.users.push({
                            index: index,
                            userName: item.name,
                            userId: item.id
                        });
                    }
                });
                if (newSession && newSession.users.length > 1) {
                    let groupName = "";
                    let members = [];
                    newSession.users.forEach(item => {
                        groupName += item.userName + ",";
                        var memberType = 2;
                        if (this.userInfo.userId === item.userId) {
                            memberType = 0;
                        }
                        var member = {
                            memberId: item.userId,
                            memberType: memberType
                        };
                        members.push(member);
                    });
                    groupName = groupName.substr(0, groupName.length-1);

                    // console.log(this.existedGroup);
                    var isExistedGroupId = '';
                    var array2 = groupName.indexOf(',')>-1? groupName.split(','):groupName;
                    var str2 = array2.sort().toString();
                    if( this.existedGroup.length > 0 ){
                        for(var i=0;i<this.existedGroup.length;i++){
                            var item = this.existedGroup[i];
                            var array1 = item.groupName.indexOf(',')>-1? item.groupName.split(','):item.groupName;
                            var str1 = array1.sort().toString();
                            if( str1 == str2 ){
                                console.log('群组已存在');
                                isExistedGroupId = item.groupId;
                                break;
                            }
                        }
                    }
                    if( !isExistedGroupId ){
                        // 单人会话变为多人会话，创建群组
                        this.apiSDK.addIMGroupAPI(groupName, "", JSON.stringify(members), function(obj) {
                            if (obj && obj.ret == 0) {
                                // 创建群组成功
                                newSession.chat_type = 2;
                                newSession.sessionId = obj.data.groupId;
                                newSession.group_name = groupName;
                                // self.receiveSessionPreview(newSession);
                                self.addSessionToSessions(self.sessions, newSession);
                                // self.setCurrentSessionIndex(self.sessions.length - 1);
                                self.changeSession(self.sessions.length - 1);
                                self.getGroups();
                            }else{
                                // 创建群组失败
                            }
                        });
                    }else{
                        var isInCurrentSessions = false;
                        var isInCurrentSessionsIndex = -1;
                        this.sessions.forEach((item,index)=>{
                            if( isExistedGroupId == item.sessionId ){
                                isInCurrentSessions = true;
                                isInCurrentSessionsIndex = index;
                            }
                        })
                        if( isInCurrentSessions == true ){
                            // this.setCurrentSessionIndex(isInCurrentSessionsIndex);
                            this.changeSession(isInCurrentSessions);
                        }else{
                            let _session = {
                                chat_type:2,
                                sessionId: isExistedGroupId,
                                group_name:groupName,
                                from:"",
                                fromName:"",
                                to:"",
                                toName:"",
                                unReadedCount:0,
                                messages:[],
                                users: [],
                            };
                            this.receiveSessionPreview(_session);
                        }
                    }
                }

            }else{
                this.apiSDK.queryIMGroupInfoAPI(session.sessionId, res =>{
                    session.users = res;
                    let usersList = session.users.map(item => item.userId);
                    let selcetPerson = data[0];
                    selcetPerson && selcetPerson.forEach((item, index) => {
                        // console.log(item);
                        if (usersList.indexOf(item.id) == -1) {
                            session.users.push({
                                index: index,
                                userName: item.name,
                                userId: item.id
                            });
                        }
                    });
                    
                    if (session && session.users && session.users.length > 1) {
                        let groupName = "";
                        let groupId = session.sessionId;
                        let members = [];
                        session.users.forEach(item => {
                            groupName += item.userName + ",";
                            // var memberType = 2;
                            // if (this.userInfo.userId === item.userId) {
                            //     memberType = 0;
                            // }
                            var member = {
                                memberId: item.userId,
                                // memberType: memberType,
                                memberType: '',
                            };
                            members.push(member);
                        });
                        groupName = groupName.substr(0, groupName.length-1);

                        // console.log(this.existedGroup);
                        var isExistedGroupId = '';
                        var array2 = groupName.indexOf(',')>-1? groupName.split(','):groupName;
                        var str2 = array2.sort().toString();
                        if( this.existedGroup.length > 0 ){
                            for(var i=0;i<this.existedGroup.length;i++){
                                var item = this.existedGroup[i];
                                var array1 = item.groupName.indexOf(',')>-1? item.groupName.split(','):item.groupName;
                                var str1 = array1.sort().toString();
                                if( str1 == str2 ){
                                    console.log('群组已存在');
                                    isExistedGroupId = item.groupId;
                                    break;
                                }
                            }
                        }
                        if( !isExistedGroupId ){
                            this.apiSDK.updateIMGroupAPI(groupId, groupName, "", JSON.stringify(members), function(obj) {
                                if (obj && obj.ret == 0) {
                                    // 编辑群组成功
                                    // session.group_name = groupName;
                                }else{
                                    // 编辑群组失败
                                }
                            });
                        }else{
                            var isInCurrentSessions = false;
                            var isInCurrentSessionsIndex = -1;
                            this.sessions.forEach((item,index)=>{
                                if( isExistedGroupId == item.sessionId ){
                                    isInCurrentSessions = true;
                                    isInCurrentSessionsIndex = index;
                                }
                            })
                            if( isInCurrentSessions == true ){
                                // this.setCurrentSessionIndex(isInCurrentSessionsIndex);
                                this.changeSession(isInCurrentSessionsIndex);
                            }else{
                                // 在已存在的群组中查找，添加到本地对话列表中
                                let _session = {
                                    chat_type:2,
                                    sessionId: isExistedGroupId,
                                    group_name:groupName,
                                    from:"",
                                    fromName:"",
                                    to:"",
                                    toName:"",
                                    unReadedCount:0,
                                    messages:[],
                                    users: [],
                                };
                                this.receiveSessionPreview(_session);
                            }
                        }
                    }
                });
            }
        },
        // 获取成员
        getUsers(data) {
            switch (this.typeResource) {
                case "add":
                this.resourceAdd(data);
                break;
                case "edit":
                this.resourceEdit(data);
                break;
            }
        },
        // 发送会话消息
        sendMessage() {
            if (!this.messageContent || /^\s+$/.test(this.messageContent)) {
                this.$message({message: '请输入内容', type: 'warning'});
                this.messageContent = "";
                return;
            }
            let session = this.sessions[this.currSessionIndex];
            if( !session ){
                this.$message({message: '请选择会话', type: 'warning'});
                return ;
            }
            let sessionId = session.sessionId ? session.sessionId : "";
            // 去除自己
            let users = [];
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                session.users.forEach(item => {
                    if (item.userId !== this.userInfo.userId) {
                        users.push(item);
                    }
                });
            }
            
            let to = '';
            if(session.chat_type == 1){
                to = session.to == this.userInfo.userId ? session.from: session.to;
            }
            
            //  仅文本
            let msg_type = 0;
            this.apiSDK.sendMessage(sessionId, users, this.messageContent, to, msg_type);

            // 如果messages属性不存在添加messages属性
            if (!session.messages) {
                session.messages = [];
            }
       
            // 清空输入框
            this.messageContent = "";
            // 滚动条到底部
            this.scrollToBottom("#msgContent");
        },
        // 查询历史消息列表
        queryHistoryMessagesList(messagesId) {
            // console.log("====================    queryHistoryMessagesList  =====================")
            let sessionMessages = this.sessions[this.currSessionIndex].messages;
            this.isLoading = true;
            this.apiSDK.queryHistoryMessagesList(messagesId, 50, res => {
                this.isLoading = false;
                this.sessions[this.currSessionIndex].messages = [
                ...res,
                ...sessionMessages
                ];
            });
        },
        // 滚动条底部
        scrollToBottom(elName) {
            this.$nextTick(() => {
                let $div = document.querySelector(elName);
                if ($div) {
                    $div.scrollTop = $div.scrollHeight;
                }
            });
        },
        // 滚动事件
        scrollEvent(event) {
            let sessionMessages = this.sessions[this.currSessionIndex].messages;
            if (event.currentTarget.scrollTop === 0 && sessionMessages.length) {
                let lastMessageId = sessionMessages[0].messageId;
                if (!this.isLoading) {
                    // console.log('======================' + this.isLoading);
                    this.queryHistoryMessagesList(lastMessageId);
                }
            }
        },
        // 清空
        empty() {
            this.sessions = [];
            this.currSessionIndex = 0;
            this.messageContent = "";
        },
        // 点击选择了的菜单栏
        selectMenu(item) {
            var self = this;
            if (item.class === "icon_font") {
                // 字体
                this.showToolHurdle.showFontLine = !this.showToolHurdle.showFontLine;
                // console.log(this.messageContent);
            }

            if (item.class === "icon_startRecordVoice") {  // 开始录音
                this.forUploadRecordSession = this.sessions[this.currSessionIndex];
                if( !this.forUploadRecordSession ){
                    this.$message({message: '请选择会话', type: 'warning'});
                    return ;
                }
                console.log('点击开始录音');
                // console.log(xtxk.record.Recorder);
                if(xtxk.record.Recorder.canRecording){
                    console.log('支持录音');
                    if(this.recorder != null) {
                        this.recorder.close();
                    }
                    xtxk.record.Recorder.get(function(rec){
                        // console.log(rec);
                        self.recorder = rec;
                        self.recorder.start();
                        self.toolHurdle.splice(2,1,{ title: "停止采集", class: "icon_stopRecordVoice" });
                        // 录音时长限制1分钟
                        self.timer = setTimeout(function(){
                            self.stopRecord();
                        },60000);
                    });
                }else{
                    xtxk.record.Recorder.throwError('不支持录音');
                }
            }

            if (item.class === "icon_stopRecordVoice") {  // 停止录音
                console.log('点击停止录音');
                window.clearTimeout(this.timer);
                this.stopRecord();
            }

        },
        stopRecord(){
                this.recorder.stop(); 
                this.toolHurdle.splice(2,1,{ title: "采集声音", class: "icon_startRecordVoice" });
                this.recordVoice = this.recorder.getBlob();
                console.log('我的录音文件');
                console.log(this.recordVoice);
                // console.log('上传录音');
                var newName = Math.random() + '' + 'recordFile.wav'
                var file = new File([this.recordVoice], newName );
                // console.log(file);
                this.apiSDK.uploadFile(file, (response) => {
                    // console.log(response);
                    if( response && response.ret == 0 ){
                        let fileId = response.data.fileId;
                        if(fileId){
                            let session = this.forUploadRecordSession;
                            let sessionId = session.sessionId ? session.sessionId : "";
                            // 去除自己
                            let users = [];
                            session.users.forEach(item => {
                                if (item.userId !== this.userInfo.userId) {
                                    users.push(item);
                                }
                            });
                            let to = '';
                            if( session.chat_type == 1 ){
                                to = session.to == this.userInfo.userId ? session.from : session.to;
                            }
                            let msg_type = 2;
                            this.apiSDK.sendMessage(sessionId, users, fileId, to, msg_type);
                        }
                    }else{
                        console.log('录音上传失败');
                    }
                });
        },
        // 字体下拉框切换事件
        osdFontSelectChange(val) {
            // console.log('字体：'+this.osdFontValue);
            let contentInput = document.getElementById('contentInput');
            contentInput.style.fontFamily = this.osdSizeValue;
        },
        //字号下拉框切换事件
        osdSizeSelectChange(val) {
            // console.log('字号：'+this.osdSizeValue);
            let contentInput = document.getElementById('contentInput');
            contentInput.style.fontSize = this.osdSizeValue + 'px';
        },
        //颜色切换事件
        osdColorChange(val) {
            // console.log('颜色：'+this.osdColorValue);
            let contentInput = document.getElementById('contentInput');
            contentInput.style.color = this.osdColorValue;
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
    height: calc(100% - 43px);
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
  /* background: #b1e0ff; */
  color: #fff;
}
.session-list .item .icon {
  width: 35px;
  height: 25px;
  margin: 0 10px;
  display: inline-block;
}
.session-list .user-name {
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.session-list .deleteSession{
    display: inline-block;
    width:20px;
    height: 20px;
    background: url(../../../static/prepointsManage/delectRowList.png) no-repeat center center;
    cursor: pointer;
}
.session-list .item.active .deleteSession{
    background: url(../../../static/prepointsManage/delectRowList_active.png) no-repeat center center;
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
  bottom: 14px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #f90102;
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
  width: 590px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.custom-dialog .rightTitle .addUser {
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
.memberBox{
    /* border:1px solid #ddd; */
    /* width:300px; */
    /* height: 400px; */
    text-align: center;
}
.memberBox ul{
    padding: 0;
    margin: 0;
}
.memberBox ul li{
    list-style: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.memberBox ul li .rUserName{
    display: inline-block;
    max-width: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}
.memberBox ul li .rbutton{
    display: inline-block;
    float: right;
    width:20px;
    height: 20px;
    background: url(../../../static/prepointsManage/delectRowList.png) no-repeat center center;
    vertical-align: middle;
    margin-top: 10px;
    margin-right: 5px;
    cursor:pointer;
}
.memberBox .el-button{
    margin:10px auto;
}
.content-list {
  margin-top: 10px;
  padding: 0 20px;
}
.content-title {
  margin: 0;
  padding: 0;
  margin-bottom: 6px;
  font-family: "MicrosoftYaHei";
}
.content-title span:first-child {
  color: #333;
}
.content-title span:last-child {
  color: #666;
  margin: 0 0 0 5px;
}
.content-detail {
  margin: 0;
  padding: 0;
  line-height: 18px;
  color: #0f5794;
}
.megImg{
    max-width: 400px;
}
.contentFileDetail{
    margin: 0;
    padding: 0;
}
.contentFileDetail span{
    line-height: 18px;
    color: #409EFF;
    cursor: pointer;
}
.contentFileDetail .tips{
    font-size: 13px;
    color: #F39D9D;
    margin-top: 3px;
}
video{
    border: 1px solid #000;
    background: #000;
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
.rightInputDialog > div.content {
  height: 143px;
  background: #fff;
}
.rightInputDialog > div.buttons {
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
/deep/.rightInputDialog .el-textarea__inner{
    height:138px;
    padding:10px 15px;
}
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
/* 字体 */
.grid-content.icon_font {
  background: url(../../../static/sendRequest/icon_font.png);
}
.grid-content.icon_font:hover {
  background: url(../../../static/sendRequest/icon_font_selected.png);
}
/* 截屏 */
.grid-content.icon_screenshot {
  background: url(../../../static/sendRequest/icon_screenshot.png);
}
.grid-content.icon_screenshot:hover {
  background: url(../../../static/sendRequest/icon_screenshot_selected.png);
}
/* 图片 */
.grid-content.icon_photo {
  background: url(../../../static/sendRequest/icon_photo.png);
}
/* .grid-content.icon_photo:hover {
  background: url(../../../static/sendRequest/icon_photo_selected.png);
} */
/* 视频 */
.grid-content.icon_vedio{
    background: url(../../../static/sendRequest/icon_vedio.png);
}
/* 开始录音 */
.grid-content.icon_startRecordVoice{
    background: url(../../../static/sendRequest/icon_startRecordVoice.png);
}
/* 停止录音 */
.grid-content.icon_stopRecordVoice{
    background: url(../../../static/sendRequest/icon_stopRecordVoice.png);
}
/* 表情 */
.grid-content.icon_smile {
  background: url(../../../static/sendRequest/icon_smile.png);
}
.grid-content.icon_smile:hover {
  background: url(../../../static/sendRequest/icon_smile_selected.png);
}
/* 记录 */
.grid-content.icon_list {
  background: url(../../../static/sendRequest/icon_list.png);
}
.grid-content.icon_list:hover {
  background: url(../../../static/sendRequest/icon_list_selected.png);
}
/* 全屏 */
.grid-content.icon_conputer {
  background: url(../../../static/sendRequest/icon_conputer.png);
}
.grid-content.icon_conputer:hover {
  background: url(../../../static/sendRequest/icon_conputer_selected.png);
}
/* 回执 */
.grid-content.icon_pdf {
  background: url(../../../static/sendRequest/icon_pdf.png);
}
.grid-content.icon_pdf:hover {
  background: url(../../../static/sendRequest/icon_pdf_selected.png);
}
/* 统计 */
.grid-content.icon_link {
  background: url(../../../static/sendRequest/icon_link.png);
}
.grid-content.icon_link:hover {
  background: url(../../../static/sendRequest/icon_link_selected.png);
}
/* 刷新 */
.grid-content.icon_clock {
  background: url(../../../static/sendRequest/icon_clock.png);
}
.grid-content.icon_clock:hover {
  background: url(../../../static/sendRequest/icon_clock_selected.png);
}
/* 中间那条竖线 */
.icon_line {
  border-right: 1px solid #c8cdd5;
  width: 10px;
}

.el-dialog__body > .el-row > div:nth-child(2) {
  border-left: none;
}
.lineFont {
  position: absolute;
  z-index: 1;
  width: calc(70% - 13px);
  height: 70px !important;
  line-height: 70px;
  box-shadow: 0px 5px 5px #b7b7b7;
  padding: 0 10px;
  background: #fff;
}
.lineFont > .label {
  margin-left: 10px;
}
.lineFont > .el-select {
  width: 120px;
}
.lineFont > .el-color-picker {
  position: relative;
  top: 15px;
}
</style>
