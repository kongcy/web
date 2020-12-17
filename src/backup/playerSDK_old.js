import WebSocketSDK from './lib/businessSDK'
import {webglPlayer} from './lib/webglPlayer'

var playerSDK = {
    businessSDKC : null,
    businessSDKD : [],
    unpack_temp  : {//拆包时，中间包数据
        data : new Uint8Array(1920 * 1080 * 3 / 2),
        index: 0
    },
	playerStatus : 0,//0-失败,1-初始化成功,2-注册成功
	regSipObj	 : null,//保存注册sip服务的参数

    /**
     * 初始化
     * @param {*} containerId 
     */
    init(containerId, containerWidth, containerHeight, type, btnCB, businessCB, selectedCB){
        //界面
        webglPlayer.init(containerId, containerWidth, containerHeight)

        //socket
        let url1 = "ws://127.0.0.1:4443";
        this.businessSDKC = new WebSocketSDK(url1, () => {
            this.businessSDKC.initServer(type);
        });

        this._addSocketAuto(function(){

        });

        //切换分屏回调
        webglPlayer.setAfterSplitScreenCallback(businessScreens => {
            //获取当前分辨率
            let sizeObj = this._getDisplaySizeByScreenCount();
            //type：1-暂停  2-恢复  3-切换分辨率            
            for(var i = 0; i < businessScreens.length; i++){
                let businessScreen = businessScreens[i];
                if(businessScreen.type == 1){
                    this.businessSDKC.pausePlay(businessScreen.screenIndex)
                }
                if(businessScreen.type == 2){
                    this.businessSDKC.resumePlay(businessScreen.screenIndex)
                }
                if(businessScreen.type == 3){
                    this.businessSDKC.setResolution(businessScreen.screenIndex, sizeObj.width, sizeObj.height);
                }
            }
        });

        //全屏/退出的回调
        webglPlayer.setFullScreenChangedCallback((businessScreens, isFull) => {
            //type：1-暂停  2-恢复  3-切换分辨率            
            for(var i = 0; i < businessScreens.length; i++){
                let businessScreen = businessScreens[i];
                if(businessScreen.type == 1){
                    this.businessSDKC.pausePlay(businessScreen.screenIndex)
                }
                if(businessScreen.type == 2){
                    this.businessSDKC.resumePlay(businessScreen.screenIndex)
                }
                if(businessScreen.type == 3){
                    if(isFull){
                        //对流做处理
                        let sizeObj = this._getDisplaySizeByScreenCount(1);
                        this.businessSDKC.setResolution(businessScreen.screenIndex, sizeObj.width, sizeObj.height);
                    }else{
                        //对流做处理
                        let sizeObj = this._getDisplaySizeByScreenCount();
                        this.businessSDKC.setResolution(businessScreen.screenIndex, sizeObj.width, sizeObj.height);
                    }
                }
            }
        });

        //操作栏按钮回调
        //value：拖动/点击声音条时为音量值，快进/快退/恢复时为播放速度值，拖动/点击进度条时为时间戳，其他按钮不传此值
        webglPlayer.setPlayerBtnEventCallback((screenIndex, btnKey, value) => {
            if(btnCB) btnCB(screenIndex, btnKey, value);
        });

        //业务接口回调
        this.businessSDKC.setReceiveBusinessCallback((eventType, status_code, screenIndex) => {
            if(eventType == 2) {//初始化
				this.playerStatus = 1;
				this._registerMXTC();
            } else if(eventType == 3){//清屏
				webglPlayer.cancelOSD(screenIndex);
                webglPlayer.stopShow(screenIndex);
			} else if(eventType == 1 && status_code == 2){//注销成功
				this.businessSDKC.closeSocket();
			} else if(eventType == 1 && status_code == 1){//注册成功
				this.playerStatus = 2;
			}
				
			if(businessCB) 
				businessCB(eventType, status_code, screenIndex);
        });

        //选中屏幕回调
        webglPlayer.setAfterSelectedScreenCallback((screenIndex, isSelected, isPlay) => {
            if(selectedCB) selectedCB(screenIndex, isSelected, isPlay);
        });

        //画质参数变化回调
        //type[1-清晰度 2-亮度 3-颜色]
        webglPlayer.setAfterPicQualityChangedCallback((screenIndex, type, val) => {
            this.businessSDKC.adjustQuality(screenIndex, type, val);
        });
    },

    /**
     * socket yuv数据处理
     * @param {*} data 
     * @param {*} data_uint8 
     * @param {*} headParams16 
     * @param {*} temp_uint8 
     * @param {*} data_uint8_index 
     */
    _computeMediaData(data, data_uint8, headParams16){
        //console.log('+++++数 据 流 字节长度++++++' + data.byteLength);
        headParams16 = new Int16Array(data, 0, 10);//头部参数
        console.log("width:"+headParams16[1]+"--height:"+headParams16[2]+"--screenIndex:"+headParams16[3]+"--frameIndex:"+headParams16[4]);
        if(headParams16[4] == 0){
            //data_uint8 = new Uint8ClampedArray(data, 10);//一帧yuv数据
            data_uint8 = new Uint8Array(data, 10);
            //console.log('+++++数 据 流 字节长度++++++' + data.byteLength);
            //console.log('+++++data_uint8 长度++++++' + data_uint8.length);
            webglPlayer.refreshDataByIndex(headParams16[3], data_uint8, headParams16[1], headParams16[2]);
        }else{//分包
            data_uint8 = new Uint8Array(data, 10);
            this.unpack_temp.data.set(data_uint8, this.unpack_temp.index);
            this.unpack_temp.index += data_uint8.length;
            if(headParams16[4] == 3){
                webglPlayer.refreshDataByIndex(headParams16[3], this.unpack_temp.data, headParams16[1], headParams16[2]);
                //this.unpack_temp.data = null;
                this.unpack_temp.index = 0;
            }
        }
        //清空
        data_uint8      = null;
        headParams16    = null;
        data            = null;
    },

    /**
     * 调用下层注册接口
     * 只有初始化成功和sip参数同时具备
     */
    _registerMXTC(){
        if(this.playerStatus == 1 && this.regSipObj){
			this.businessSDKC.startRegister(this.regSipObj.userName, this.regSipObj.password, this.regSipObj.ip, this.regSipObj.port);
		}
    },
	
	/**
     * 业务接口的回调事件
     * 初始化
     * 点播
     * 停止点播
     */
    setPlayerBusinessEventCallback(cb){
        this.businessSDKC.setReceiveBusinessCallback((eventType, result) => {
            if(cb) cb(eventType, result);
        });
    },

    /**
     * 操作栏按钮点击回调事件
     * @param {*} cb 
     */
    setPlayerBtnEventCallback(cb){
        webglPlayer.setPlayerBtnEventCallback((screenIndex, btnKey) => {
            if(cb) cb(screenIndex, btnKey);
        });
    },

    /**
     * 窗口改变
     */
    resize(containerWidth, containerHeight){
        webglPlayer.resize(containerWidth, containerHeight)
    },

    /**
     * 分屏
     * @param {*} splitType 
     */
    splitScreen(splitType){
        webglPlayer.splitScreen(splitType)
    },

    /**
     * 开启点播
     * @param {*} screenIndex 
     * @param {*} data 
     * @param {*} width 
     * @param {*} height 
     */
    startPlay(screenIndex, resourceType, deviceType, ip, ch){
        webglPlayer.startShow(screenIndex, resourceType);
        let _this = this;
        this._addSocketAuto(function(){
            let sizeObj = _this._getDisplaySizeByScreenCount();
            _this.businessSDKC.startPlay(screenIndex, sizeObj.width, sizeObj.height, deviceType, ip, ch);
        });
    },

    /**
     * 停止指定分屏
     * @param {*} screenIndex 
     */
    stopPlay(screenIndex){
        this.businessSDKC.stopPlay(parseInt(screenIndex));
	    webglPlayer.cancelOSD([screenIndex])
        webglPlayer.stopShow(screenIndex);
    },

    /**
     * 停止所有
     */
    stopAllPlay(){
        this.businessSDKC.stopAllPlay();
	    webglPlayer.cancelAllOSD();
        webglPlayer.stopAllShow();
    },

    /**
     * 暂停/取消暂停
     * @param {*} screenIndex 
     * @param {*} flag 
     */
    isSuspendPlay(screenIndex, isSuspend){
        if(isSuspend){
            webglPlayer.suspendShow(screenIndex);
            this.businessSDKC.pausePlay(screenIndex);
        }else{
            webglPlayer.cancelSuspendShow(screenIndex);
            this.businessSDKC.resumePlay(screenIndex);
        }
    },

    /**
     * 设置是否全屏
     * @param {*} screenIndex 
     * @param {*} isFull true:设置全屏 false:取消全屏
     */
    setFullScreen(screenIndex, isFull){
        if(isFull){
            webglPlayer.fullScreenShow(screenIndex)
        }else{
            webglPlayer.cancelFullScreenShow(screenIndex)
        }
    },

    /**
     * 设置OSD
     * @param {*} screenIndex 
     * @param {*} osdIndex osd的id
     * @param {*} osdInfo osd的内容，等于date字符串时是可变时间
     * @param {*} fontFamily 
     * @param {*} fontColor osd的颜色（16进制，RRGGBB）
     * @param {*} isBold osd是否粗体(0/1)
     * @param {*} isItalic osd是否斜体(0/1)
     * @param {*} offsetX osd向窗口左右偏移-以窗口的百分比（basePoint=2/4左偏移，basePoint=1/3右偏移）
     * @param {*} offsetY osd在窗口上下偏移-以窗口的百分比（basePoint=1/2下偏移，basePoint=3/4上偏移）
     * @param {*} basePoint osd左边原点（1左上，2右上，3左下，4右下）
     * @param {*} fontSize osd字号，传入的是转换后的像素（fontSize>0有效，否则字体大小根据字体的宽高计算）
     * @param {*} fontWidth 单个字体占分屏的百分比
     * @param {*} fontHeight 单个字体占分屏的百分比
     */
    setOSD(screenIndex, osdIndex, osdInfo, fontFamily, fontColor, isBold, isItalic, offsetX, offsetY, basePoint, fontSize, fontWidth, fontHeight){
        webglPlayer.setOSD(screenIndex, osdIndex, osdInfo, fontFamily, fontColor, isBold, isItalic, offsetX, offsetY, basePoint, fontSize, fontWidth, fontHeight)
    },

    /**
     * 设置单屏声音
     * @param {*} screenIndex 
     * @param {*} vol 0-255
     */
    setVolume(screenIndex, vol){
        this.businessSDKC.setVolume(screenIndex, vol)
        webglPlayer.setVolume(screenIndex, vol);
    },

    /**
     * 设置声音开关
     * @param {*} isOpen 
     * @param {*} screenIndex 不传设置所有屏，否则指定屏
     */
    isOpenVolume(isOpen, screenIndex){
        if(isOpen == false){
            if(screenIndex == undefined){
                this.businessSDKC.isOpenVolume(false)
                webglPlayer.isDisabledAllVolume(true)
            }else{
                this.businessSDKC.setVolume(screenIndex, 0)
                webglPlayer.soundOffShow(screenIndex)
            }
        }else if(isOpen == true){
            if(screenIndex == undefined){
                this.businessSDKC.isOpenVolume(true)
                webglPlayer.isDisabledAllVolume(false)
            }else{
                let curVol = webglPlayer.getVolume(screenIndex);
                this.businessSDKC.setVolume(screenIndex, curVol)
                webglPlayer.soundOnShow(screenIndex)
            }
        }
    },
    /**
     * 设置按钮状态
     * @param  {*} screenIndex 
     * @param  {*} btnKey      
     */
    changeButton(screenIndex, btnKey){
        webglPlayer.changeButton(screenIndex, btnKey);
    },

    /**
     * 设置回放进度条的起止时间
     * @param {*} screenIndex 
     * @param {*} startTime 
     * @param {*} endTime 
     */
    setPlaybackTime(screenIndex, startTime, endTime){
        webglPlayer.initTimeProgeress(screenIndex, startTime, endTime)
    },
    // [[2020-03新增
    // 点播
    startPlayByRtpId(screenIndex, videoRtpId, audioRtpId, resourceType) {
        webglPlayer.startShow(screenIndex, resourceType);
        let _this = this;
        this._addSocketAuto(function(){
            let sizeObj = _this._getDisplaySizeByScreenCount();
            _this.businessSDKC.startPlayByRtpId(parseInt(screenIndex), videoRtpId, audioRtpId, sizeObj.width, sizeObj.height);
        });
    },
    /**
     * sip注册
     * @param {*} info {username, password, ip, port} 
     */
    register(userName, password, ip, port) {
		this.regSipObj = {
			userName: userName,
			password: password,
			ip: ip,
			port: port
		};
        this._registerMXTC();
    },
    // sip注销
    unRegister() {
		this.playerStatus = 0;
        this.businessSDKC.unRegister();
    },
    // 会议开始
    groupStartCommand(groupId, cmd) {
        let sizeObj = this._getDisplaySizeByScreenCount();
        cmd.forEach(function(item) {
            webglPlayer.startShow(item.pos, item.resourceType);
            item.width = sizeObj.width;
            item.height = sizeObj.height;
        });
        let _this = this;
        this._addSocketAuto(function(){
            _this.businessSDKC.groupStartCommand(groupId, cmd);
        });
    },
    // 会议刷新
    groupRefreshCommand(groupId, cmd) {
        let sizeObj = this._getDisplaySizeByScreenCount();
        cmd.forEach(item => {
            webglPlayer.startShow(item.pos, item.resourceType);
            item.width = sizeObj.width;
            item.height = sizeObj.height;
        });
        let _this = this;
        this._addSocketAuto(function(){
            _this.businessSDKC.groupRefreshCommand(groupId, cmd);
        });
    },
    // 会议停止
    groupStopCommand(groupId) {
        this.businessSDKC.groupStopCommand(groupId);
		webglPlayer.cancelAllOSD();
        webglPlayer.stopAllShow();
    },
    // 2020-03新增]]
    /**
     * 通过分屏数，获取分辨率
     * @param {*} screenCount 不传时，通过当前分屏数来获取结果；可传指定分屏数来获取结果
     */
    _getDisplaySizeByScreenCount(screenCount_){
        let screenCount = screenCount_ == undefined ? webglPlayer._currentSplitCount : screenCount_;
        if(screenCount == 1){
            return {width: 0, height: 0}//原画质
        } else if(screenCount <= 4) {
            return {width: 1080, height: 720}
        } else if(screenCount <= 9) {
            return {width: 352, height: 288}
        } else {
            return {width: 352, height: 288}
        }
    },

    /**
     * 自动扩展socket
     * 每4屏一个socket
     */
    _addSocketAuto(addSuccessCB){
        //多少屏新增socket
        let screenBusCountOfOneSocket = 4;
        //业务中的屏幕数量
        let screenBusCount = webglPlayer.getCountInBusiness();
        //需要的socket数量
        let needSocketCount = Math.ceil(screenBusCount / screenBusCountOfOneSocket );
        needSocketCount = needSocketCount == 0 ? 1 : needSocketCount;
        //当前socket数量
        let curSocketCout = this.businessSDKD.length;
        //
        let port = 4444;
        //是否要新增socket
        let enableAddSocket = false;

        if(!enableAddSocket && curSocketCout == 1){
            if(addSuccessCB) addSuccessCB();
        }else if(curSocketCout == needSocketCount){
            if(addSuccessCB) addSuccessCB();
        }else{
            while(curSocketCout < needSocketCount){
                let url = "ws://127.0.0.1:" + (port + curSocketCout);
                let newSocket = new WebSocketSDK(url, () => {
					if(addSuccessCB) addSuccessCB();
					addSuccessCB = null;//只在初次建立连接时使用
				}, true);
                //
                let data_uint8, headParams16;
                newSocket.setReceiveMediaDataCallback(res => {
                    this._computeMediaData(res, data_uint8, headParams16);
                });
                this.businessSDKD.push(newSocket);
                curSocketCout++;
            }
        }
    },
};

export var playerSDKNew = playerSDK;