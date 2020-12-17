import WebSocketSDK from './lib/businessSDK'
import {webglPlayer} from './lib/webglPlayer'

var playerSDK = {
    businessSDKC : null,
    businessSDKD : [],
    refreshDataType : 2, //1,webgl方式   2，2d方式

    littleEndian : (function(){//字节序
        var buffer = new ArrayBuffer(2)
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256
    })(),
    stream_data : {//socket数据
        headParam : new Int16Array(5),
        imgData : new Uint8Array(1920*1080*1.5),
        tempIndex: 0
    },
	playerStatus : 0,//0-失败,1-初始化成功,2-注册成功
    regSipObj	 : null,//保存注册sip服务的参数
	commandQueue : [],//缓存指令的队列，{commandName,params}，异常恢复时用

    /**
     * 初始化
     * @param {*} containerId
     */
    initLayout(containerId, containerWidth, containerHeight, type, btnCB, businessCB, selectedCB, dropCB,playResultCB){
        //界面
        webglPlayer.init(containerId, containerWidth, containerHeight, this.refreshDataType)

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

        //全部屏幕全屏/退出的回调 2020.11.9
        webglPlayer.setFullScreenOperateCallback(isFull=> {
            if(isFull){
                let containerWidth=window.screen.width;
                let containerHeight=window.screen.height;
                webglPlayer.resize(containerWidth, containerHeight)
            }
        })

        //操作栏按钮回调
        //value：拖动/点击声音条时为音量值，快进/快退/恢复时为播放速度值，拖动/点击进度条时为时间戳，其他按钮不传此值
        webglPlayer.setPlayerBtnEventCallback((screenIndex, btnKey, value) => {
            if(btnCB) btnCB(screenIndex, btnKey, value);
        });

        if(this.businessSDKC){
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
                    this._executeCommand();
                } else if(eventType == 0 && status_code == 1) { // 播放成功
                    if(playResultCB) playResultCB(screenIndex)
                }
    
                if(businessCB)
                    businessCB(eventType, status_code, screenIndex);
            });
        }

        //选中屏幕回调
        webglPlayer.setAfterSelectedScreenCallback((screenIndex, isSelected, isPlay) => {
            if(selectedCB) selectedCB(screenIndex, isSelected, isPlay);
        });

        //画质参数变化回调
        //type[1-清晰度 2-亮度 3-颜色]
        webglPlayer.setAfterPicQualityChangedCallback((screenIndex, type, val) => {
            this.businessSDKC.adjustQuality(screenIndex, type, val);
        });
        
        //1119云调度拖动点播
        // 拖拽回调
        webglPlayer.setAfterSelectedScreenDropCallback((screenIndex, isSelected, isPlay, dragData) => {
            if(dropCB) dropCB(screenIndex, isSelected, isPlay, dragData);
        })
    },

    initMedia(type,businessCB){
         //socket
         let protocol = window.location.protocol;
         let socketProtocol = protocol.indexOf('s') > -1 ? 'wss' : 'wss';
         let url1 = socketProtocol + "://127.0.0.1:4443";
         this.businessSDKC = new WebSocketSDK(url1, () => {
             this.businessSDKC.initServer(type);
         });
 
         var socketCount = 9;
         var port = 4444;
         for(var i=0; i < socketCount; i++){
             let url2 = socketProtocol + "://127.0.0.1:" + (port + i);
             let newSocket = new WebSocketSDK(url2, null, this.refreshDataType==1?true:false);
             newSocket.setReceiveMediaDataCallback(res => {
                 if(this.refreshDataType == 1){
                     let view = new DataView(res);
                     this._computeMediaData(view);
                     view = null;
                 }else if(this.refreshDataType == 2){
                     this._computeMediaData_jpg(res);
                 }
             });
             this.businessSDKD.push(newSocket);
         }
         
        //业务接口回调
        this.businessSDKC.setReceiveBusinessCallback((eventType, status_code, screenIndex) => {
            if(eventType == 2) {//初始化
				this.playerStatus = 1;
				this._registerMXTC();
            } else if(eventType == 3){//清屏
				webglPlayer.cancelOSD(screenIndex);
                webglPlayer.stopShow(screenIndex);
                webglPlayer.cancelOSDByJoin(screenIndex);
			} else if(eventType == 1 && status_code == 2){//注销成功
				this.businessSDKC.closeSocket();
			} else if(eventType == 1 && status_code == 1){//注册成功
				this.playerStatus = 2;
				this._executeCommand();
            }
            // else if(eventType == 0 && status_code == 1) { // 播放成功
            //     if(playResultCB) playResultCB(screenIndex)
            // }

			if(businessCB)
				businessCB(eventType, status_code, screenIndex);
        });

    },

    init(containerId, containerWidth, containerHeight, type, btnCB, businessCB, selectedCB, playResultCB){
        //界面
        webglPlayer.init(containerId, containerWidth, containerHeight, this.refreshDataType)

        //socket
        let protocol = window.location.protocol;
        let socketProtocol = protocol.indexOf('s') > -1 ? 'wss' : 'wss';
        let url1 = socketProtocol + "://127.0.0.1:4443";
        this.businessSDKC = new WebSocketSDK(url1, () => {
            this.businessSDKC.initServer(type);
        });

        var socketCount = 9;
        var port = 4444;
        for(var i=0; i < socketCount; i++){
            let url2 = socketProtocol + "://127.0.0.1:" + (port + i);
            let newSocket = new WebSocketSDK(url2, null, this.refreshDataType==1?true:false);
            newSocket.setReceiveMediaDataCallback(res => {
                if(this.refreshDataType == 1){
                    let view = new DataView(res);
                    this._computeMediaData(view);
                    view = null;
                }else if(this.refreshDataType == 2){
                    this._computeMediaData_jpg(res);
                }
            });
            this.businessSDKD.push(newSocket);
        }

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
				this._executeCommand();
			} else if(eventType == 0 && status_code == 1) { // 播放成功
                if(playResultCB) playResultCB(screenIndex)
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
    close:function(){
        if(this.businessSDKC!=null){
            this.businessSDKC.closeSocket();
            this.businessSDKC=null;
        }

        this.businessSDKD.forEach(item => {
            item.closeSocket();
        })
        
    },

    /**
     * socket yuv数据处理
     * @param {DataView} data
     */
    _computeMediaData(data){
      var byteLength = data.byteLength;
      //console.log('+++++数 据 流 字节长度++++++' + byteLength);
      //给头部参数赋值Int16Array
      for (let i = 0; i < 10; i+=2) {
          this.stream_data.headParam[i/2] = data.getInt16(i, this.littleEndian);
      }
      console.log("width:"+this.stream_data.headParam[1]+"--height:"+this.stream_data.headParam[2]+"--screenIndex:"+this.stream_data.headParam[3]+"--frameIndex:"+this.stream_data.headParam[4]);
      //给图片变量赋值Uint8Array
      for (let i = 10; i < byteLength; i++) {
          this.stream_data.imgData[this.stream_data.tempIndex] = data.getUint8(i, this.littleEndian);
          this.stream_data.tempIndex++;
      }
      //刷新canvas
      if(this.stream_data.headParam[4] == 0 || //不分包
          this.stream_data.headParam[4] == 3){ //分包
          webglPlayer.refreshDataByIndex(this.stream_data.headParam[3], this.stream_data.imgData.subarray(0, this.stream_data.tempIndex+1), this.stream_data.headParam[1], this.stream_data.headParam[2]);
          this.stream_data.tempIndex = 0;
      }
  },
      /**
     * socket jpg数据处理
     * @param {DataView} data blob
     */
    _computeMediaData_jpg(data){
        //console.log('+++++数 据 流 字节长度++++++' + data.size);
        var newblob=data.slice(0,10);
        var reader=new FileReader();
        reader.readAsArrayBuffer(newblob);
        reader.onload = function(evt){

            if(evt.target.readyState == FileReader.DONE){
                var imageFlag=evt.target.result;

                var view=new Int16Array(imageFlag);
                var width=view[1];
                var height=view[2];
                var screenIndex=view[3];
                //console.log("width:"+width+"--height:"+height+"--screenIndex:"+screenIndex+"--frameIndex:"+0);
                newblob=data.slice(10,data.size);
                webglPlayer.refreshDataByIndex(screenIndex,newblob,width,height);
            }
        }
    },

    /**
     * 重置数据
     */
    _reset(){
        this.businessSDKC = null
        this.businessSDKD = []
        this.playerStatus = 0
        this.regSipObj = null
        this.commandQueue = []
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

        let sizeObj = _this._getDisplaySizeByScreenCount();
        _this.businessSDKC.startPlay(screenIndex, sizeObj.width, sizeObj.height, deviceType, ip, ch);
    },

    /**
     * 停止指定分屏
     * @param {*} screenIndex
     */
    stopPlay(screenIndex){
        if(!webglPlayer.isRTMP(screenIndex)){
            this.businessSDKC.stopPlay(parseInt(screenIndex));
        }
        webglPlayer.cancelOSD(screenIndex);
        webglPlayer.stopShow(screenIndex);
        //   webglPlayer.cancelOSDByJoin(screenIndex);
        
    },

    /**
     * 停止所有
     */
    stopAllPlay(){
        // if(!webglPlayer.isRTMP(screenIndex)){
        //     this.businessSDKC.stopAllPlay();
        // }
        webglPlayer.cancelAllOSD();
        webglPlayer.stopAllShow();
        webglPlayer.cancelOSDByJoin();
        
    },

    /**
     * 暂停/取消暂停
     * @param {*} screenIndex
     * @param {*} flag
     */
    isSuspendPlay(screenIndex, isSuspend){
        if(isSuspend){
            webglPlayer.suspendShow(screenIndex);
            if(!webglPlayer.isRTMP(screenIndex)){
                this.businessSDKC.pausePlay(parseInt(screenIndex));
            }
        }else{
            webglPlayer.cancelSuspendShow(screenIndex);
            if(!webglPlayer.isRTMP(screenIndex)){
                this.businessSDKC.resumePlay(parseInt(screenIndex));
            }
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

    //wxx 2020.11.4
    /**
     * 设置是否全屏
     * @param {*} screenIndex
     * @param {*} isFull true:设置全屏 false:取消全屏
     */
    setFullScreenAll(isFull){
        if(isFull){
            webglPlayer.fullScreenShowAll();
        }else{
            webglPlayer.cancelFullScreenShow()
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
     * 取消OSD
     * @param {*} screenIndex 
     */
    cancelOSD(screenIndex){
        webglPlayer.cancelOSD(screenIndex);
    },
    setOSDByJoin(splitType, osdItems) {
        webglPlayer.setOSDByJoin(splitType, osdItems);
    },
    /**
     * 设置单屏声音
     * @param {*} screenIndex
     * @param {*} vol 0-255
     */
    setVolume(screenIndex, vol){
        if(!webglPlayer.isRTMP(screenIndex)){
            this.businessSDKC.setVolume(parseInt(screenIndex), vol);
        }
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
                if(!webglPlayer.isRTMP(screenIndex)) {
                    this.businessSDKC.isOpenVolume(false)
                }
                webglPlayer.isDisabledAllVolume(true)
            }else{
                if(!webglPlayer.isRTMP(screenIndex)) {
                    this.businessSDKC.setVolume(screenIndex, 0)
                }
                webglPlayer.soundOffShow(screenIndex)
            }
        }else if(isOpen == true){
            if(screenIndex == undefined){
                if(!webglPlayer.isRTMP(screenIndex)) {
                    this.businessSDKC.isOpenVolume(true)
                }
                webglPlayer.isDisabledAllVolume(false)
            }else{
                let curVol = webglPlayer.getVolume(screenIndex);
                if(!webglPlayer.isRTMP(screenIndex)) {
                    this.businessSDKC.setVolume(screenIndex, curVol)
                }
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
    // 2020-06-15 新增
    startPlayByResId(screenIndex, resSipId, resourceType, mediaGroupID, channel, mediaType) {
        if(this.playerStatus != 2){//2为注册成功
            this.commandQueue.push({
                commandName: 'StartPlayByResId',
                params: {
                    screenIndex: screenIndex,
                    resSipId: resSipId,
                    // videoRtpId: videoRtpId,
                    // audioRtpId: audioRtpId,
                    resourceType: resourceType
                }
            });
            return;
        }
        webglPlayer.startShow(screenIndex, resourceType);
        let _this = this;
        let sizeObj = _this._getDisplaySizeByScreenCount();
        _this.businessSDKC.startPlayByResId(parseInt(screenIndex), resSipId, sizeObj.width, sizeObj.height, mediaGroupID, channel, mediaType);
    },
    // [[2020-03新增
    // 点播
    startPlayByRtpId(screenIndex, videoRtpId, audioRtpId, resourceType) {
		if(this.playerStatus != 2){//2为注册成功
			this.commandQueue.push({
				commandName: 'startPlayByRtpId',
				params: {
					screenIndex: screenIndex,
					videoRtpId: videoRtpId,
					audioRtpId: audioRtpId,
					resourceType: resourceType
				}
			});
			return;
		}
        webglPlayer.startShow(screenIndex, resourceType);
        let _this = this;
        let sizeObj = _this._getDisplaySizeByScreenCount();
        _this.businessSDKC.startPlayByRtpId(parseInt(screenIndex), videoRtpId, audioRtpId, sizeObj.width, sizeObj.height);

    },
    startPlayByRTMP(screenIndex, resType, rtmpURL, type) {
        webglPlayer.startShowByRTMP(screenIndex, resType, rtmpURL, type);
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
        if(this.businessSDKC){
            this.businessSDKC.unRegister();
            //关闭socket
            this.businessSDKC.closeSocket();
            this.businessSDKD.forEach(item => {
                item.closeSocket();
            })
        }
        this._reset();
    },
    // 会议开始
    groupStartCommand(groupId, cmd) {
		if(this.playerStatus != 2){//2为注册成功
			this.commandQueue.push({
				commandName: 'groupStartCommand',
				params: {
					groupId: groupId,
					cmd: cmd
				}
			});
			return;
		}
        let sizeObj = this._getDisplaySizeByScreenCount();
        cmd.forEach(function(item) {
            webglPlayer.startShow(item.pos, item.resourceType);
            item.width = sizeObj.width;
            item.height = sizeObj.height;
        });
        let _this = this;

        _this.businessSDKC.groupStartCommand(groupId, cmd);

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

        _this.businessSDKC.groupRefreshCommand(groupId, cmd);

    },
    // 会议停止
    groupStopCommand(groupId) {
        this.businessSDKC.groupStopCommand(groupId);
		webglPlayer.cancelAllOSD();
        webglPlayer.stopAllShow();
        webglPlayer.cancelOSDByJoin();
    },
    // 2020-03新增]]
    /**
     * 通过分屏数，获取分辨率
     * @param {*} screenCount 不传时，通过当前分屏数来获取结果；可传指定分屏数来获取结果
     */
    _getDisplaySizeByScreenCount(screenCount_){
        let screenCount = screenCount_ == undefined ? webglPlayer._currentSplitCount : screenCount_;
        if(screenCount == 1){
            //return {width: 0, height: 0}//原画质
            return {width: 1920, height: 1080}//原画质
        } else if(screenCount <= 4) {
            return {width: 1080, height: 720}
        } else if(screenCount <= 9) {
            return {width: 352, height: 288}
        } else {
            return {width: 352, height: 288}
        }
    },

    /**
     * 执行缓存的指令
     */
	_executeCommand(){
		for(let i = this.commandQueue.length-1; i>=0; i--){
			var item = this.commandQueue[i];
			if(item.commandName == 'startPlayByRtpId'){
				this.startPlayByRtpId(item.params.screenIndex, item.params.videoRtpId, item.params.audioRtpId, item.params.resourceType);
			}else if(item.commandName == 'groupStartCommand'){
				this.groupStartCommand(item.params.groupId, item.params.cmd);
			}
			this.commandQueue.splice(i,1);//删除
		}
    },
    
    /**
     * socket状态上报
     */
    setReceiveReconnectCallback(callback){
        this.businessSDKC.setReceiveReconnectCallback(status => {
            callback(status)
        })
    },

    /**
     * 抓拍
     */
    setShoot(screenIndex) {
        return webglPlayer.shoot(screenIndex);
    },
    /**
     * 停止所有
     */
    stopPlayAll() {
        if(this.businessSDKC){
            this.businessSDKC.stopAllPlay();
        }
        webglPlayer.cancelAllOSD();
        webglPlayer.stopAllShow();
    }
    
};

export var playerSDKNew = playerSDK;
