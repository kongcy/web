<template>
    <div class="wrap">
        <div class="left">
            <div class="mediaContainer">
                <div id="imageShowContainer" style="width: 100%;height: 100%;float:none;"></div>
            </div>
            <div class="mediaName">
                <el-row :gutter="24" style="">
                    <el-col :span="12">
                        <div style="text-align:center">主呼方<label v-if="selected">-{{selectObjSender}}</label></div>
                    </el-col>
                    <el-col :span="12">
                        <div style="text-align:center">被呼方<label v-if="selected">-{{selectObjReceiver}}</label></div>
                    </el-col>
                </el-row>
            </div>
            <div class="log">
                <h4 style="display:inline">日志</h4>
                <i class="el-icon-delete" style="float:right;cursor:pointer" @click="clearLog"></i>
                <div class="content" id="logs">
                    <template v-for="item in logList">
                        <span v-html="item" :key="item.key"></span>
                    </template>
                </div>
            </div>
        </div>
        <div class="right">
            <div style="margin: 10px 10px 0 0;">
                <el-button type="primary" plain size="medium" @click="downloadTemplate">模板下载</el-button>
                <el-upload class="upload-demo" :on-change="beforeUpLoad" :show-file-list="false" :auto-upload="false" action="" style="float:right;">
                  <el-button type="primary" plain size="medium">导入</el-button>
                </el-upload>
                <!-- <el-button type="primary" plain size="medium">导入</el-button> -->
                <br/><br/>
                <el-table :data="tableList" border stripe ref="table" :height="tableHeight" 
                    @selection-change="selectionChange" @row-click="rowClick" :highlight-current-row="true"
                    style="cursor: default;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="sender.userName" label="发起人"></el-table-column>
                    <el-table-column prop="receiver.userName" label="接收人"></el-table-column>
                    <el-table-column prop="status" width="120" label="状态" :formatter="getDictStatusLabel"></el-table-column>
                </el-table><br/><br/>
                <div class="btn-group">
                    <el-button type="primary" size="medium" @click="toggleSelection">全选</el-button>
                    <el-button type="primary" size="medium" @click="loginPatch" :disabled="isLoginBtn">登录</el-button>
                    <el-button type="primary" size="medium" @click="startCallPatch" :disabled="!isLoginBtn || !enableCall || isCallBtn">开启呼叫</el-button>
                    <el-button type="primary" size="medium" @click="stopCallPatch" :disabled="!isLoginBtn || !enableCall || !isCallBtn">停止呼叫</el-button>
                    <el-button type="primary" size="medium" @click="logoutPatch" :disabled="!isLoginBtn">登出</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WebSocketSDK from './businessSDK'
import {playerSDK} from '../../sdk/sdkFor6_0/playerSDK'
import {dataSDK6} from '../../sdk/sdkFor6_0/dataSDK'
import Fun from '../../common/fun'
import XLSX from 'xlsx'
export default {
    name: "CallSimulator",
    data(){
        return{
            userCount:0,
            userList:[{
                userID:'',
                userName:'',
                password:'',
                bandEncodeSIPID:'',
                status:0,//0-未登录，1登录成功，2，呼叫成功，3，呼叫失败，4-sip注册成功
                sipData:{},
                mediaData:{},
            }],
            tableList:[], //{id: 0, sender:{}, receiver:{}, status:0}
            tableSelectionList: [],
            logList: [],
            selected: false,
            selectObjSender: "",
            selectObjReceiver: "",
            isLoginBtn: false,
            enableCall: false,
            isCallBtn: false,
            tableHeight: document.querySelector('body').offsetHeight - 130,
        }
    },
    mounted(){
        // this.
        //注册事件
        window.onSessionEvent = this.onSessionEvent;
        window.onBtnEvent = this.onBtnEvent;
        //启动执行
        //初始化插件
        //初始化批量用户
        //单个用户登录
        //创建socket
        //初始化媒体
        //注册插件
        //刷新token
        //绑定编码器
        var imageShowContainer = document.querySelector('#imageShowContainer');
        this.initMXTC(imageShowContainer.offsetWidth, imageShowContainer.offsetHeight);
        //this.testUserList();
    },
    updated(){
        this.$nextTick(function(){
            let $logs = document.querySelector('#logs');
            $logs.scrollTop = $logs.scrollHeight;
        });
    },
    methods:{
        initMXTC(width, height){
            var res = this.apiSDK.initMXTC("imageShowContainer", width, height);
            this.apiSDK.splitWidowForPlugin(12);
        },
        testUserList(){
            this.userList = [];
            this.userList.push({
                    userID : 'test21',
                    userName : '用户21',
                    password : '123456',
                    bandEncodeSIPID: 'af7d97ab-66bd-4d78-9f3f-a91e37e61b0d'
                },{
                    userID : 'test22',
                    userName : '用户22',
                    password : '123456',
                    bandEncodeSIPID: '82cec21f-d67f-41d8-a9d2-3f1ef66d6de0'
                },{
                    userID : 'test23',
                    userName : '用户23',
                    password : '123456',
                    bandEncodeSIPID: '82cec21f-d67f-41d8-a9d2-3f1ef66d6de0'
                },{
                    userID : 'test24',
                    userName : '用户24',
                    password : '123456',
                    bandEncodeSIPID: 'af7d97ab-66bd-4d78-9f3f-a91e37e61b0d'
                })
            this.userCount = this.userList.length;
            this.initTableList();
        },
        initTableList() {
            //将userList转成tableList
            this.tableList = [];
            var tableSize = parseInt(this.userCount/2)
            for (let index = 0; index < tableSize; index++) {
                this.tableList.push({
                    id: index,
                    sender: this.userList[index],
                    receiver: this.userList[index+tableSize],
                    status:0
                })
            }
            //console.log(this.tableList);
        },
        loginOne(userID, password) {
            return new Promise((resolve, reject) => {
                this.apiSDK.loginWithAccount(userID, password, 'AAAA', (res) => {
                    if(res && res.Ret == 0){
                        var itemObj = this.userList.find(item => item.userID == userID)
                        itemObj.status = 1;
                        itemObj.token = res.token
                        //登录成功后，1绑定编码器，2刷新token，3创建socket，4，媒体初始化
                        this.apiSDK.initUserInfo(itemObj.userID, itemObj.userName, itemObj.token);
                        if(itemObj.bandEncodeSIPID) this.bindEncoder(itemObj.userID, itemObj.bandEncodeSIPID);
                        this.refreshToken(itemObj.userID);
                        this.initSocketOne(itemObj.userID);
                        resolve(itemObj);
                    }else{
                        // console.log("login fail, userID: ", userID);
                        reject(userID);
                    }
                    this.changeTableStatus();
                })
            });
        },
        loginPatch(){
            let userList = this.getUsersList();
            if (userList && userList.length) {
                // 添加日志
                this.addLog(`<span style="color:#999">【${new Date().formatDate('yyyy-MM-dd HH:mm:ss:SS')}】</span> 开始批量登录<br/>`);
                this.isLoginBtn = true
                let usersPromise = [];
                userList.forEach(item => {
                    usersPromise.push(
                        this.loginOne(item.userID, item.password).then(obj => {
                            //this.addLog(`${obj.userName} 已登录；`);
                        }, error => {
                            //this.addLog(`${error} 登录失败；`);
                        })
                    )
                });
                Promise.all(usersPromise).then(() => {
                    this.addLog(`<span style="color:#999">【${new Date().formatDate('yyyy-MM-dd HH:mm:ss:SS')}】</span> 完成批量登录<br/>`);
                })
            } else {
                this.$message({
                    message: '请选择登录用户！',
                    type: 'warning'
                });
            }
        },
        initSocketOne(userID){
            var itemObj = this.userList.find(item => item.userID == userID)
            if(itemObj.webSocketSDK) {//socket存在
                //初始化媒体
                itemObj.webSocketSDK.publishInitMediaByCustom();
                return;
            }
            //this.itemObj.status = 4;
            var webSocketSDK = new WebSocketSDK(this.apiSDK.config.businessURL, function (isFirst) {
                webSocketSDK.join(itemObj.userID, itemObj.userName, itemObj.token);
                //初始化媒体
                webSocketSDK.publishInitMediaByCustom();
            });
            webSocketSDK.setReceiveInformInitMediaCallback((obj) => {
                //SIPID:"",serverID:"",serverIP:"",serverPort:"", clientPassword:""
                //console.log("收到媒体初始化反馈------", userID)
                if (obj && obj.serverIP) {
                    var info = { userName: obj.SIPID, pwd: obj.clientPassword, ip: obj.serverIP, port: obj.serverPort };
                    itemObj.sipData = info;
                    this.apiSDK.registerForPlguin(info);
                }
            });
            webSocketSDK.setReceiveInformStartMediaByLocalCallback((obj) =>{
                //console.log("收到开启媒体(软解)", userID);
                if(obj){
                    if(itemObj.status != 2) {
                        itemObj.status = 2;
                        this.changeTableStatus();
                    }
                    //判断是发送人还是接收人
                    this.tableSelectionList.forEach((item, index) => {
                        if(item.sender.userID == obj.resourceID) {
                            obj.screenIndex = 0;
                        }else if(item.receiver.userID == obj.resourceID) {
                            obj.screenIndex = 1;
                        }
                    });
                    itemObj.mediaData = {screenIndex:obj.screenIndex, videoRTPId:obj.videoRTPId || "", audioRTPId:obj.audioRTPId || ""};
                    this.apiSDK.startPlayForPlugin(obj.screenIndex, obj.videoRTPId || "", obj.audioRTPId || "", obj.encoderSipID);
                }
            });
            webSocketSDK.setReceiveInformStopMediaByLocalCallback((obj) => {
                //console.log("收到停止媒体(软解)", userID);
                if (obj) {
                    if(itemObj.status != 4) {
                        itemObj.status = 4;
                        this.changeTableStatus();
                    }
                    // obj.resourceID = webSocketSDK._userID;
                    // //判断是发送人还是接收人
                    // this.tableSelectionList.forEach((item, index) => {
                    //     if(item.sender.userID == obj.resourceID) {
                    //         obj.screenIndex = 0;
                    //     }else if(item.receiver.userID == obj.resourceID) {
                    //         obj.screenIndex = 1;
                    //     }
                    // });
                    // this.apiSDK.stopPlayForPlugin(obj.screenIndex);
                }
            });
            webSocketSDK.setReceiveRemindCallback((obj) => {
                if(obj){
                    if((/呼叫.*?失败/g.test(obj.text)) && itemObj.status != 3) {
                        itemObj.status = 3;
                        this.changeTableStatus();
                    }
                }
            });
            webSocketSDK.setReceiveInformRefreshScreenOSDInfosCallback((obj) => {
                var resp=[];
                if(obj){
                    obj.screenOSDs && obj.screenOSDs.forEach(function (item) {
                        var it={}
                        it.screenIndex = item.screenIndex;
                        it.osdIndex = item.index || 0;
                        it.caption = item.text || ''; // 文本内容
                        if(item.itemType == 'DateTime') it.caption = 'date';//时间类型
                        it.bold = 0; // 粗体
                        it.italic = 0; // 斜体
                        it.width =  0;
                        it.height = 0;
                        it.fontSize = item.fontSize;//字体大小
                        var R = item.fontColorR || 0;
                        var G = item.fontColorG || 0
                        var B = item.fontColorB || 0;
                        // RGB 转 16 进制颜色
                        //it.fontColor = self.toColor16(color);
                        it.fontColor = ((1 << 24) + (B << 16) + (G << 8) + R).toString(16).slice(1);
                        it.relativeX = item.relativeX || 0;
                        it.relativeY = item.relativeY || 0;

                        if(item.basePoint == "LeftTop"){
                            it.basePoint = 1;
                        }else if(item.basePoint == "RightTop"){
                            it.basePoint = 2;
                        }else if(item.basePoint == "LeftBottom"){
                            it.basePoint = 3;
                        }else if(item.basePoint == "RightBottom"){
                            it.basePoint = 4;
                        }else if(item.basePoint == "Center"){
                            it.basePoint = 1;
                        }
                        if(item.fontFamlily == "SIM_SUN"){
                            it.fontFamily = "宋体";
                        }else if(item.fontFamlily == "SIM_HEI"){
                            it.fontFamily = "黑体";
                        }else if(item.fontFamlily == "KAI_TI"){
                            it.fontFamily = "楷体";
                        }else if(item.fontFamlily == "FANG_SONG"){
                            it.fontFamily = "仿宋";
                        }else if(item.fontFamlily == "MICRO_YA_HEI"){
                            it.fontFamily = "微软雅黑";
                        }else if(item.fontFamlily == "LI_SHU"){
                            it.fontFamily = "隶书";
                        }
                        resp.push(it);
                    });
                }
                resp.forEach((item) => {
                    //字号转像素
                    let fontSize = Fun.filterForFontSize(item.fontSize)
                    // this.apiSDK.setOSDForPlugin(itemObj.mediaData.screenIndex,item.osdIndex,item.caption,item.fontColor,item.bold,item.italic,item.width,item.height,
                    //     item.relativeX,item.relativeY,item.basePoint,fontSize,item.fontFamily)
                })
            });
            itemObj.webSocketSDK  = webSocketSDK;
        },
        refreshToken(userID){
            var itemObj = this.userList.find(item => item.userID == userID)
            itemObj.refreshTokenTimer = setInterval(function() {
                dataSDK6.renewUserToken(1, function(obj) {});
            }, 30 * 1000);
        },
        bindEncoder(userID, bandEncodeSIPID){
            dataSDK6.querySingleDeviceBySipId(bandEncodeSIPID, (obj) => {
                if(obj && obj.responseCode == 1){
                    this.apiSDK.setUserCustom(userID, 0, obj.data.deviceID, '', '', 0, 0, [], 0, 0, [],
                        function(obj2) {
                            if (obj2 && obj2.Ret == 0) {
                                
                            }else{
                                console.log("bind encoder fail, userID: ", userID)
                            }
                        }
                    );
                }
            });
        },
        startCallPatch(){
            if (this.tableSelectionList && this.tableSelectionList.length) {
                this.isCallBtn = true;
                var callEna = false;
                this.tableSelectionList.forEach((item, index) => {
                    if(item.status == 4) {
                        item.sender.webSocketSDK.publishStartCall(item.receiver.userID, item.sender.userName,item.receiver.userName)
                        callEna = true;
                    }
                });

                this.addLog(`<span style="color:#999">【${this.formatDateAdd(400)}】</span> 开始批量呼叫<br/>`);
            } else {
                this.$message({
                    message: '请选择呼叫用户！',
                    type: 'warning'
                });
            }
        },
        stopCallPatch(){
            this.selected = false;
            this.isCallBtn = false;

            if (this.tableSelectionList && this.tableSelectionList.length) {
                this.tableSelectionList.forEach((item, index) => {
                    if(item.status == 2) {
                        item.sender.webSocketSDK.publishStopCall(item.receiver.userID, item.sender.userName,item.receiver.userName)
                    }else if(item.status == 3){
                        item.sender.status = 4;
                        item.receiver.status = 4;
                    }
                });
                this.apiSDK.stopPlayAllForPlugin();
                this.changeTableStatus();
            } else {
                this.$message({
                    message: '请选择停呼用户！',
                    type: 'warning'
                });
            }
        },
        logoutPatch(){
            this.selected = false;
            this.isLoginBtn = false;
            this.enableCall = false;

            let userList = this.getUsersList();
            if (userList && userList.length) {
                this.addLog(`<span style="color:#999">【${new Date().formatDate('yyyy-MM-dd HH:mm:ss:SS')}】</span> 开始批量登出<br/>`);
                userList.forEach(item => {
                    if (item.webSocketSDK) {
                        item.status = 0;
                        item.webSocketSDK.publishUserStatus(1);
                        //item.webSocketSDK.leave();
                        //this.addLog(`${item.userName} 已登出；`);
                    } else {
                        //this.addLog(`${item.userName} 未登录；`);
                    }
                    this.changeTableStatus();

                    clearInterval(item.refreshTokenTimer)
                    item.refreshTokenTimer = null
                });
                this.addLog(`<span style="color:#999">【${new Date().formatDate('yyyy-MM-dd HH:mm:ss:SS')}】</span> 完成批量登出<br/>`);
            } else {
                this.$message({
                    message: '请选择登出用户！',
                    type: 'warning'
                });
            }
            this.apiSDK.unregisterForPlugin();
        },
        changeTableStatus_old(){
            var tableSize = this.tableList.length;
            for (let index = 0; index < tableSize; index++) {
                if(this.userList[index].status == 0 && this.userList[index+tableSize].status == 0){
                    this.tableList[index].status = 0;
                }
                if(this.userList[index].status == 1 && this.userList[index+tableSize].status == 1){
                    this.tableList[index].status = 1;
                }
                if(this.userList[index].status == 2 && this.userList[index+tableSize].status == 2){
                    if(this.tableList[index].status != 2){
                        //this.addLog(`${this.userList[index].userName} 呼叫${this.userList[index+tableSize].userName} 成功；`);
                        this.tableList[index].status = 2;
                        this.isPatchCallSuccess();
                    }
                }
                if(this.userList[index].status == 3){
                    if(this.tableList[index].status != 3){
                        //this.addLog(`${this.userList[index].userName} 呼叫${this.userList[index+tableSize].userName} 失败；`);
                        this.tableList[index].status = 3;
                        this.isPatchCallSuccess();
                    }
                }
                if(this.userList[index].status == 4 && this.userList[index+tableSize].status == 4){
                    if(this.tableList[index].status != 4){
                        this.tableList[index].status = 4;
                        this.enableCall = true;
                    }
                }
            }
        },
        changeTableStatus(){
            this.tableSelectionList.forEach(item => {
                if(item.sender.status == 0 && item.receiver.status == 0){
                    item.status = 0;
                }
                if(item.sender.status == 1 && item.receiver.status == 1){
                    item.status = 1;
                }
                if(item.sender.status == 2 && item.receiver.status == 2){
                    if(item.status != 2){
                        //this.addLog(`${this.userList[index].userName} 呼叫${this.userList[index+tableSize].userName} 成功；`);
                        item.status = 2;
                        this.isPatchCallSuccess();
                    }
                }
                if(item.sender.status == 3){
                    if(item.status != 3){
                        //this.addLog(`${this.userList[index].userName} 呼叫${this.userList[index+tableSize].userName} 失败；`);
                        item.status = 3;
                        this.isPatchCallSuccess();
                    }
                }
                if(item.sender.status == 4 && item.receiver.status == 4){
                    if(item.status != 4){
                        item.status = 4;
                        this.enableCall = true;
                    }
                }
            })
        },
        isPatchCallSuccess() {
            let count = 0;
            this.tableSelectionList.forEach(item => {
                if(item.status == 2 || item.status == 3) count++;
            });
            if (count == this.tableSelectionList.length) {
                this.addLog(`<span style="color:#999">【${this.formatDateSubtract(300)}】</span> 完成批量呼叫<br/>`);

                if(this.tableSelectionList[0] && this.tableSelectionList[0].status == 2){
                    var sender = this.tableSelectionList[0].sender
                    var receiver = this.tableSelectionList[0].receiver
                    playerSDK.onTwoDisplay(sender.mediaData.videoRTPId, receiver.mediaData.videoRTPId)
                    this.selected = true;
                    this.selectObjSender = sender.userName;
                    this.selectObjReceiver = receiver.userName;
                }
            }
        },
        //播放器回调
        //eventType: 0, status_code: 1 播放；0 停止播放；-1 断流
        //eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
        onSessionEvent: function(eventType, sessionid, status_code, msg, wgtpos, sipID) {
            sipID = sipID.substring(sipID.indexOf(":")+1)
            //console.log("播放器回调------eventType:" + eventType + "--sessionid：" + sessionid + "--status_code:" + status_code + "--msg:" + msg + "--wgtpos:" + wgtpos + "--sipID:" + sipID);
            if (eventType == 0) {
                switch (status_code) {
                    case 1: //点播成功
                        break;
                    case 0: //点播失败
                        break;
                    case -1: break;
                }
            } else if (eventType == 1) {
                switch (status_code) {
                    case 2:  break;//注销成功
                    case 1:  {//注册成功
                        this.userList.forEach(item => {
                            if(item.sipData && item.sipData.userName == sipID) {
                                if(item.status != 4){
                                    item.status = 4;
                                    //this.addLog(`${item.userName} 已注册；`);
                                    this.changeTableStatus()
                                }
                            }
                        });
                        break;
                    }
                    case -1: break;//注册失败
                    case -2: break;
                    case -3: break;
                }
            }
        },
        //播放器按钮回调事件
        //wgtpos:窗口索引，btnpos：按钮索引
        onBtnEvent: function(wgtpos, isLeft, btnpos, btnkey) {
            //console.log("播放器点击按钮回调-------" + wgtpos + "  " + isLeft + "   " + btnpos + "  " + btnkey);
            if (btnkey == "Nor_StopPlay") //停止视频
            {
                this.apiSDK.stopPlayByIndex(wgtpos);
            } else if (btnkey == "Nor_VolOn") //关声音
            {
                this.apiSDK.publishVolume(wgtpos, false,0);
            } else if (btnkey == "Nor_VolOff")//开声音
            {
                this.apiSDK.publishVolume(wgtpos, true,255);
            } else if (btnkey == "Nor_PTZ")//云台
            {
                
            } else if (btnkey == "Nor_FullScreen")//全屏
            {
                this.apiSDK.setFullScreenForPlugin(wgtpos, true);
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Nor_CancelFull");
            } else if (btnkey == "Nor_CancelFull") {
                this.apiSDK.setFullScreenForPlugin(wgtpos, false);
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Nor_FullScreen");
            }else if(btnkey == "Pause"){//暂停播放
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Play");
                this.apiSDK.pauseDBImageByPosForPlugin(wgtpos);
            }else if(btnkey == "Play") {//恢复图像
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Pause");
                this.apiSDK.resumeDBImageByPosForPlugin(wgtpos);
            }

        },
        selectionChange(val) {
            this.tableSelectionList = val;
            //console.log(this.tableSelectionList)
        },
        rowClick(row, event, column){
            //console.log(row)
            var sender = this.userList.find(item => item.userID == row.sender.userID)
            var receiver = this.userList.find(item => item.userID == row.receiver.userID)
            //console.log(sender.userName, receiver.userName)
            if(row.status == 2) {
                playerSDK.onTwoDisplay(sender.mediaData.videoRTPId, receiver.mediaData.videoRTPId)
                this.selected = true;
                this.selectObjSender = sender.userName;
                this.selectObjReceiver = receiver.userName;
            }
        },
        // 添加日志
        addLog(log) {
            this.logList.push(log);
        },
        clearLog(){
            this.logList = [];
            this.userList.forEach(item => {
                item.webSocketSDK._isPrintLog = false;
            });
        },
        // 全选
        toggleSelection() {
            let rows = this.tableList;
            if (rows) {
                rows.forEach(row => {
                    this.$refs.table.toggleRowSelection(row);
                });
            } else {
                this.$refs.table.clearSelection();
            }
        },
        // 获取状态标签
        getDictStatusLabel(value) {
            let statusList = [
                {label: '未登录', value: 0},
                {label: '登录成功', value: 1},
                {label: '呼叫成功', value: 2},
                {label: '呼叫失败', value: 3},
                {label: 'SIP注册成功', value: 4},
            ]
            let obj = statusList.find(item => item.value === value.status);
            return obj && obj.label || '';
        },
        // 获取选择用户
        getUsersList() {
            let users = [];
            this.tableSelectionList.forEach(item => {
                users.push(item.sender);
                users.push(item.receiver);
            });
            return users;
        },
        // 下载
        downloadTemplate() {
            let rootPath = window.location.href
            let ind = rootPath.indexOf("#")
            rootPath = ind > -1 ? rootPath.substring(0, ind) : rootPath

            const pluginFilePath =  rootPath + `/static/doc/UserInfoTemplate.xls`
            window.open(pluginFilePath, "_self");
        },
        beforeUpLoad(file) {
            //console.log('beforeUpLoad---------------------------------',file)
            this.readExcel(file.raw).then(result => {
                let list = [];
                let j = 0;
                let obj = {};
                if (result) {
                    result.forEach((item, index) => {
                        if (item.v && index > 4) {
                            if (j === 0) {
                                obj.userID = item.w;
                                j++;
                            } else if (j === 1) {
                                obj.userName = item.w;
                                j++;
                            } else if (j === 2) {
                                obj.password = item.w;
                                j++;
                            } else if (j === 3) {
                                obj.bandEncodeSIPID = item.w;
                                j = 0;
                                list.push(Object.assign({}, obj));
                            }
                        }
                    })
                }
                this.userCount = list.length;
                this.userList = list;
                // console.log(this.userList);
                this.initTableList();
            })
        },
        readExcel(file) {// 解析Excel
            let _this = this;
            return new Promise(function(resolve, reject){// 返回Promise对象
                const reader = new FileReader();
                reader.onload = (e) => {// 异步执行
                    try {
                        // 以二进制流方式读取得到整份excel表格对象
                        let data = e.target.result,workbook = XLSX.read(data, {type: 'binary'});
                        let batteryArr = [];
                        for (let item in workbook.SheetNames){
                            let SheetName = workbook.SheetNames[item];
                            let sheetInfos = workbook.Sheets[SheetName];
                            for (let battery in sheetInfos){
                                if (battery!='!ref'){
                                    batteryArr.push(sheetInfos[battery]);
                                }
                            }
                        }
                        // if (batteryArr.length>_this.upLoadNumber){
                        //   app.alert("上传电芯数量不能超过6条");
                        //   resolve(false);
                        // }else {
                        resolve(batteryArr);
                        // resolve(true)
                        // }
                    } catch (e) {
                        reject(e.message);
                    }
                };
                reader.readAsBinaryString(file);
            });
        },
        formatDateAdd(count){
            var date = new Date();
            var dateStr = "";

            var year = date.getFullYear();
            var month = ('' + (date.getMonth() + 101)).substr(1);
            var day = ('' + (date.getDate() + 100)).substr(1);
            var hour = ('' + (date.getHours() + 100)).substr(1);
            var min = ('' + (date.getMinutes() + 100)).substr(1);
            var second = date.getSeconds();
            var milSecond = date.getMilliseconds();
            
            var newMilS = milSecond + count;
            if(newMilS > 1000) {
                second = second + 1;
                newMilS = newMilS - 1000;
            }
            second = ('' + (second + 100)).substr(1)
            newMilS = ('' + (newMilS + 1000)).substr(1)
            return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second+":"+newMilS
        },
        formatDateSubtract(count){
            var date = new Date();
            var dateStr = "";

            var year = date.getFullYear();
            var month = ('' + (date.getMonth() + 101)).substr(1);
            var day = ('' + (date.getDate() + 100)).substr(1);
            var hour = ('' + (date.getHours() + 100)).substr(1);
            var min = ('' + (date.getMinutes() + 100)).substr(1);
            var second = date.getSeconds();
            var milSecond = date.getMilliseconds();
            
            var newMilS = milSecond - count;
            if(newMilS < 0) {
                second = second - 1;
                newMilS = newMilS + 1000;
            }
            second = ('' + (second + 100)).substr(1)
            newMilS = ('' + (newMilS + 1000)).substr(1)
            return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second+":"+newMilS
        },
    }
}
</script>
<style scoped>
h5{margin: 0;}
.wrap{position:relative;height: 100%;}
.left{height: 100%;width: 70%;position: absolute;left: 0;box-sizing: border-box;}
.right{height: 100%;width: 30%;position: absolute;right: 0;box-sizing: border-box;}
/deep/ .el-table--border th{background-color: #FAFAFA }
/deep/ .el-button--medium{padding: 10px;}
.log{padding: 10px;border: 2px solid #eee;overflow: hidden;position: absolute;bottom: 10px;height: 300px;left: 10px;right: 10px;}
.log h4{margin: 0 0 10px 0;}
.log .content{border: 1px solid #eee;padding: 10px;height: 245px;overflow: auto;font-size: 14px;color: #333;line-height: 24px;}
.mediaName{position: absolute;left: 10px;right: 10px;bottom: 334px;width:100%;height:40px;line-height:25px;}
.mediaContainer{margin-bottom: 10px;position: absolute;top: 10px;left: 10px;right: 10px;bottom: 374px;}
.btn-group{position: absolute;bottom: 10px;left: 10px; right: 10px;word-break: break-word; align-content: space-between;text-align: center;}
.custom-table{height: calc(100% - 300px);}
</style>
<style>
html,body{height: 100%}
</style>