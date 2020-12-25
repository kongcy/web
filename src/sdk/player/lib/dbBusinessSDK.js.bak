let dbBusinessSDK = function(url, opendCB, isArrayBuffer){
	/*公共接口**************************************************************************************/
	this._wsclient        	= null,
	this._socketURL       	= null,
	this._isConnect		 	= false,//是否连接成功
	this._isArrayBuffer		= false,//true为二进制
	this._receiveInitCb	 	= null,
	this._receiveClosedCB 	= null,
	this._receiveErrorCB  	= null,
	this._receiveReconnectCB= null,
	this._enableReconnect	= true,
	this._failureCount    	= 0,//重连失败次数
	this._reConnectInterval	= null,//重连定时器

	/*业务回调函数************************************************************************************/
	this._receiveBusinessCB	= null,
	this._receiveMediaDataCB	= null,

	// this._socketURL 	= url;
	// this._receiveInitCb	= opendCB;
	// this._isArrayBuffer	= isArrayBuffer;
	this.initScoket(url, opendCB, isArrayBuffer || false);
}

dbBusinessSDK.prototype = {

	//ws初始化
	initScoket : function(wssURL, cb, isArrayBuffer){
		console.log("socket init-----------------", wssURL);
		this._socketURL = wssURL;
		this._isArrayBuffer = isArrayBuffer;
		try{
			if("WebSocket" in window){
				this._wsclient = new WebSocket(this._socketURL);
			}else if("MozWebSocket" in window){
				this._wsclient = new MozWebSocket(this._socketURL);
			}else{
				alert("您的浏览器不支持WebSocket...");
				return;
			}
		}catch(e){
			console.log(e);
			//alert("创建SOCKET失败");
			return;
		}
		if(this._isArrayBuffer) this._wsclient.binaryType = "arraybuffer";
		var _this = this;
		this._wsclient.onopen    = function(e){_this._onOpen(e)};
		this._wsclient.onmessage = function(e){_this._onMessage(e)};
		this._wsclient.onclose   = function(e){_this._onClose(e)};
		this._wsclient.onerror   = function(e){_this._onError(e)};

		if(this._isEmpty(cb) == false){
			this._receiveInitCb = cb;
		}
	},
	//关闭
	closeSocket : function(){
		clearInterval(this._reConnectInterval);
		this._reConnectInterval = null;
		if(this._wsclient) this._wsclient.close();
		this._wsclient = null;
	},
	_onError:function(event){
		console.log("socket error-----------------", this._socketURL);
		this._isConnect = false;
		this._reConnect();
		/*if(this._receiveErrorCB == null) return;
		this._receiveErrorCB(event); */
	},
	_onClose:function(event){
		console.log("socket close-----------------", this._socketURL);
		this._isConnect = false;
		this._reConnect();
		/*if(this._receiveClosedCB == null) return;
		this._receiveClosedCB(event);*/
	},
	_onOpen:function(event){
		if(this._wsclient.readyState == WebSocket.OPEN){
			console.log("socket open-----------------", this._socketURL);
			this._isConnect = true;

			var isReconnect = true;
			if(this._reConnectInterval == null){//首次创建成功
				isReconnect = false;
				if(this._isEmpty(this._receiveInitCb) == false){
					this._receiveInitCb(isReconnect);
				}
			}else{//重连成功
				clearInterval(this._reConnectInterval);
				this._reConnectInterval = null;
				isReconnect = true;
				if(this._isEmpty(this._receiveInitCb) == false){
					this._receiveInitCb(isReconnect);
				}
			}
			if(!this._isEmpty(this._receiveReconnectCB)){
				this._receiveReconnectCB(isReconnect?2:1);
			}
		}
	},
	_reConnect:function(){
		//重连
		var _this = this;
		if(!_this._enableReconnect) return;
		if(_this._wsclient && _this._wsclient.readyState==WebSocket.CLOSED){
			if(_this._reConnectInterval) return;
			if(!_this._isEmpty(_this._receiveReconnectCB))
			_this._receiveReconnectCB(0);
			var reConnect = 0;
			_this._reConnectInterval = setInterval(function(){
				if(reConnect>720){
					clearInterval(_this._reConnectInterval);
					_this._reConnectInterval = null;
				}
				_this._wsclient && _this._wsclient.close();//清除之前的
				_this._wsclient = null;
				if("WebSocket" in window){
					_this._wsclient = new WebSocket(_this._socketURL);
				}else if("MozWebSocket" in window){
					_this._wsclient = new MozWebSocket(_this._socketURL);
				}

				if(_this._isArrayBuffer) _this._wsclient.binaryType = "arraybuffer";
				_this._wsclient.onopen    = function(e){_this._onOpen(e)};
				_this._wsclient.onmessage = function(e){_this._onMessage(e)};
				_this._wsclient.onclose   = function(e){_this._onClose(e)};
				_this._wsclient.onerror   = function(e){_this._onError(e)};

				reConnect++;
				if(reConnect%5==1) console.log("socket重连第"+reConnect+"次");
			}, 5000);
		}
	},
	_onMessage:function(event){
		if(event.data instanceof ArrayBuffer || event.data instanceof Blob){//二进制
			if(this._isEmpty(this._receiveMediaDataCB) == false){
				this._receiveMediaDataCB(event.data);
			}
		}else{
			var data = JSON.parse(event.data);
			var funName = data.command;
			console.log("receive----------"+funName);
			console.log(data);
			if(this._isEmpty(this._receiveBusinessCB) == false){
				//eventType: 0, status_code: 1 播放成功；0 播放失败；-1 断流
				//eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
				//eventType: 2, status_code: 1 初始化成功; 0 失败
				//eventType: 3, 清屏
				var eventType, status_code, screenIndex,playInfo;
				if(funName == 'Init'){
					eventType = 2;
					status_code = data.result >=0 ? 1 : 0;;
				} else if(funName == 'StartRegister'){
					eventType = 1;
					status_code = data.result >=0 ? 1 : -1;;
				} else if(funName == 'UnRegister'){
					eventType = 1;
					status_code = 2;;
				}else if(funName == 'StartPlayInPos' || funName == 'StartPlayByRtpId' || funName == 'StartPlayByResId'){
					eventType = 0;
					status_code = data.result >=0 ? 1 : 0;
					screenIndex = data.pos;
				}else if(funName == 'StopPlay'){
					eventType = 0;
					status_code = data.result >=0 ? 1 : 0;
					screenIndex = data.pos;
				} else if(funName == 'GrpHidePos') {
					eventType = 3;
					screenIndex = data.pos;
				}else if(funName == 'rtsp'){
					eventType = 0;
					status_code = 1
					playInfo={
						rtsp:data.url,
						pos:data.pos,
						isAudio: data.trackname==="audio"?true:false
					}
				}
				console.log( '看回调-----', event );
				this._receiveBusinessCB(eventType, status_code, screenIndex,playInfo);
			}
		}
		event.length = 0;
		event = null;
	},
	_isEmpty : function(obj){
		if(typeof(obj) == "undefined" || obj == null)
			return true;
		else
			return false;
	},
	publishBase: function(data){
		if(!this._isConnect) {
			console.log("SOCKET连接关闭", data);
			return;
		}
		if(this._wsclient.readyState != WebSocket.OPEN){//未成功
			if(this._failureCount >= 3) return;
			setTimeout("this.publishBase(" + JSON.stringify(data) + ");", 1000);
			this._failureCount++;
			return;
		}
		if(this._failureCount != 0) this._failureCount = 0;

		this._wsclient.send(JSON.stringify(data));
		console.log("publish----无插件-------"+JSON.stringify(data));
	},
	//socket状态回调
	setReceiveReconnectCallback: function (cb) {
		if (this._isEmpty(cb) == false) {
			this._receiveReconnectCB = cb;
		}
	},

	/*业务接口----------------------*/
	setReceiveBusinessCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveBusinessCB = cb;
		}
	},
	setReceiveMediaDataCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveMediaDataCB = cb;
		}
	},
	initServer : function(type){
		var data = {
			"command"	: "Init",
			"type": type
		  };
		  this.publishBase(data);
	},
	startPlay : function(screenIndex, displayWith, displayHeight, deviceType, ip, ch){
		var data = {
			"command"		: "StartPlayInPos",
			"pos"			: screenIndex,
			//"deviceType"	: 172,
			"deviceType"	: deviceType,
			//"ip"			: "172.16.3.227",
			"ip"			: ip,
			"ch"			: ch,
			"destAPort"		: 0,
			"nAudioEnable"	: 1,
			"devIds"		: "1234",
			"devCh"			: 0,
			"usrIds"		: "0",
			"opType"		: 0,
			"width"			: displayWith,
  			"height"		: displayHeight
		  };
		  this.publishBase(data);
	},
	stopPlay : function(screenIndex){
		var data = {
			"command"	: "StopPlay",
			"pos"		: screenIndex
		  };
		  this.publishBase(data);
	},
	stopAllPlay : function(){
		var data = {
			"command": "StopPlayAll"
		  };
		  this.publishBase(data);
	},
	setVolume : function(screenIndex, vol){
		var data = {
			"command": "SetVolume",
			"pos": screenIndex,
			"vol": vol
		  };
		  this.publishBase(data);
	},
	isOpenVolume : function(falg){
		var data = {
			"command": "SetVolumeAll",
			"onoff": falg ? 1 : 0
		  };
		  this.publishBase(data);
	},
	setResolution : function(screenIndex, displayWith, displayHeight){
		var data = {
			"command": "SetResolution",
			"pos": screenIndex,
			"width": displayWith,
			"height": displayHeight
		  };
		  this.publishBase(data);
	},
	pausePlay : function(screenIndex){
		var data = {
			"command": "PausePlay",
			"pos": screenIndex
		  };
		  this.publishBase(data);
	},
	resumePlay : function(screenIndex){
		var data = {
			"command": "ResumePlay",
			"pos": screenIndex
		  };
		  this.publishBase(data);
	},
	adjustQuality : function(screenIndex, type, val){
		var data = {
			"command": "AdjustQuality",
			"pos": screenIndex,
			"target": type, //1-清晰度 2-亮度 3-颜色
  			"value": val //0~40 0~100 0~100
		  };
		  this.publishBase(data);
	},
	startRegister: function(userName, password, ip, port) {
		var data = {
			"command": "StartRegister",
			"username": userName, //username 注册媒体调度服务的用户名
			"password": password, //password 注册媒体调度服务的密码
			"ip": ip, //ip 注册媒体调度服务的ip
			"port": port //port 注册媒体调度服务的端口
		  };
		  this.publishBase(data);
	},
	unRegister: function() {
		var data = {
			"command": "UnRegister",
		};
		this.publishBase(data);
	},
	startPlayByRtpId: function(pos, videoRtpId, audioRtpId, width, height) {
		var data = {
			"command" : "StartPlayByRtpId",
			"pos": pos,  //pos 窗口号
			"videoRtpId" : videoRtpId, //视频的rtpid，没有填空字符串
			"audioRtpId" : audioRtpId, //音频的rtpid，没有填空字符串
			"width": width,
			"height": height
		  };
		  this.publishBase(data);
	},
	startPlayByResId: function(pos, resSipId, width, height, grpId, channel, mediaType) {
		var data = {
			"command" : "StartPlayByResId",
			"pos": pos,  //pos 窗口号
			"resSipId": resSipId, //视频的rtpid，没有填空字符串
			"width": width,
			"height": height,
			"grpid": grpId,
 			"channel": channel || "channel:0",
 			'mediaType': mediaType
		  };
		  this.publishBase(data);
	},
	groupStartCommand: function(groupId, cmd) {
		var data = {
			"command" : "GroupStartCommand",
			// "grpid": groupId, //组ID
			"cmd": cmd //cmd 需要记录的指令（json,如[{"pos":"0","videoRtpId":"101","audioRtpId":"102"}]）
		  };
		  this.publishBase(data);
	},
	groupRefreshCommand: function(groupId, cmd) {
		var data = {
			"command" : "GroupRefreshCommand",
			// "grpid": groupId, //组ID
			"cmd": cmd//cmd 需要记录的指令（json,如[{"pos":"0","videoRtpId":"101","audioRtpId":"102"}]）
		  };
		  this.publishBase(data);
	},
	groupStopCommand: function(groupId) {
		let _cmd = {'grpid': groupId};
		var data = {
			"command" : "GroupStopCommand",
			// "grpid": groupId //组ID
			"groupId": groupId
		  };
		  this.publishBase(data);
	},

};

export default dbBusinessSDK;
