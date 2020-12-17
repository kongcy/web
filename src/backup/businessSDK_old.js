export var businessSDKC = {
	/*公共接口**************************************************************************************/
	_socketURL       	: null,
	_wsclient        	: null,
	_isConnect		 	: false,
	//_userID          	: null,
	//_userName        	: null,
	//_token			 	: null,
	_receiveInitCb	 	: null,
	_receiveClosedCB 	: null,
	_receiveErrorCB  	: null,
	_receiveReconnectCB	: null,
	_failureCount    	: 0,//重连失败次数
	_reConnectInterval	: null,//重连定时器

	/*业务回调函数************************************************************************************/
	_receiveBusinessCB         		  : null,

	//ws初始化
	initScoket : function(wssURL, cb){
		console.log("socket init-----------------" + wssURL);
		businessSDKC._socketURL = wssURL;
		//businessSDKC._token  = token;
		try{
			if("WebSocket" in window){
				businessSDKC._wsclient = new WebSocket(businessSDKC._socketURL);
			}else if("MozWebSocket" in window){
				businessSDKC._wsclient = new MozWebSocket(businessSDKC._socketURL);
			}else{
				alert("您的浏览器不支持WebSocket...");
				return;
			}
		}catch(e){
			console.log(e);
			alert("创建SOCKET失败");
			return;
		}
		businessSDKC._wsclient.onopen    = businessSDKC._onOpen;
		businessSDKC._wsclient.onmessage = businessSDKC._onMessage;
		businessSDKC._wsclient.onclose   = businessSDKC._onClose;
		businessSDKC._wsclient.onerror   = businessSDKC._onError;

		if(businessSDKC._isEmpty(cb) == false){
			businessSDKC._receiveInitCb = cb;
		}
	},
	_onError:function(event){
		console.log("socket error-----------------");
		businessSDKC._isConnect = false;
		businessSDKC._reConnect();
		/*if(businessSDKC._receiveErrorCB == null) return;
		businessSDKC._receiveErrorCB(event); */
	},
	_onClose:function(event){
		console.log("socket close-----------------");
		businessSDKC._isConnect = false;
		businessSDKC._reConnect();
		/*if(businessSDKC._receiveClosedCB == null) return;
		businessSDKC._receiveClosedCB(event);*/
	},
	_onOpen:function(event){
		if(businessSDKC._wsclient.readyState == WebSocket.OPEN){
			console.log("socket open-----------------");
			businessSDKC._isConnect = true;

			if(businessSDKC._reConnectInterval == null){//首次创建成功
				if(businessSDKC._isEmpty(businessSDKC._receiveInitCb) == false){
					businessSDKC._receiveInitCb();
				}
			}else{//重连成功
				clearInterval(businessSDKC._reConnectInterval);
				businessSDKC._reConnectInterval = null;
				if(businessSDKC._isEmpty(businessSDKC._receiveInitCb) == false){
					businessSDKC._receiveInitCb();
				}
				// if(!businessSDKC._isEmpty(businessSDKC._receiveReconnectCB)){
				// 	businessSDKC._receiveReconnectCB(true);
				// }
			}
		}
	},
	_reConnect:function(){
		//重连
		if(businessSDKC._wsclient && businessSDKC._wsclient.readyState==WebSocket.CLOSED){
			if(businessSDKC._reConnectInterval) return;
			if(!businessSDKC._isEmpty(businessSDKC._receiveReconnectCB))
				businessSDKC._receiveReconnectCB(false);
			var reConnect = 0;
			businessSDKC._reConnectInterval = setInterval(function(){
				if(reConnect>720){
					clearInterval(businessSDKC._reConnectInterval);
					businessSDKC._reConnectInterval = null;
				}
				businessSDKC._wsclient.close();//清除之前的
				businessSDKC._wsclient = null;
				if("WebSocket" in window){
					businessSDKC._wsclient = new WebSocket(businessSDKC._socketURL);
				}else if("MozWebSocket" in window){
					businessSDKC._wsclient = new MozWebSocket(businessSDKC._socketURL);
				}
				businessSDKC._wsclient.onopen    = businessSDKC._onOpen;
				businessSDKC._wsclient.onmessage = businessSDKC._onMessage;
				businessSDKC._wsclient.onclose   = businessSDKC._onClose;
				businessSDKC._wsclient.onerror   = businessSDKC._onError;

				reConnect++;
				if(reConnect%5==1) console.log("socket重连第"+reConnect+"次");
			}, 5000);
		}
	},
	_onMessage:function(event){
		var data = JSON.parse(event.data);
		var funName = data.command;
		console.log("receive----------"+funName);
		console.log(data);
		if(businessSDKC._isEmpty(businessSDKC._receiveBusinessCB) == false){
			//eventType: 0, status_code: 1 播放成功；0 播放失败；-1 断流
        	//eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
			var eventType, status_code, screenIndex;
			if(funName == 'Init'){
				eventType = 1;
				status_code = 1;
			}else if(funName == 'StartPlayInPos'){
				eventType = 0;
				status_code = data.result >=0 ? 1 : 0;
				screenIndex = data.pos;
			}else if(funName == 'StopPlay'){
				eventType = 0;
				status_code = data.result >=0 ? 1 : 0;
				screenIndex = data.pos;
			}
			businessSDKC._receiveBusinessCB(eventType, status_code, screenIndex);
		}
	},
	_isEmpty : function(obj){
		if(typeof(obj) == "undefined" || obj == null)
			return true;
		else
			return false;
	},
	publishBase: function(data){
		if(!businessSDKC._isConnect) {
			console.log("SOCKET连接关闭");
			return;
		}
		if(businessSDKC._wsclient.readyState != WebSocket.OPEN){//未成功
			if(businessSDKC._failureCount >= 3) return;
			setTimeout("businessSDKC.publishBase(" + JSON.stringify(data) + ");", 1000);
			businessSDKC._failureCount++;
			return;
		}
		if(businessSDKC._failureCount != 0) businessSDKC._failureCount = 0;
		
		businessSDKC._wsclient.send(JSON.stringify(data));
		console.log("publish--------------"+JSON.stringify(data));
	},
	//socket状态回调
	setReceiveReconnectCallback: function (cb) {
		if (businessSDKC._isEmpty(cb) == false) {
			businessSDKC._receiveReconnectCB = cb;
		}
	},

	/*业务接口----------------------*/
	setReceiveBusinessCallback : function(cb){
		if(businessSDKC._isEmpty(cb) == false){
			businessSDKC._receiveBusinessCB = cb;
		}
	},
	initServer : function(){
		var data = {
			"command"	: "Init",
		  };
		businessSDKC.publishBase(data);
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
		businessSDKC.publishBase(data);
	},
	stopPlay : function(screenIndex){
		var data = {
			"command"	: "StopPlay",
			"pos"		: screenIndex
		  };
		businessSDKC.publishBase(data);
	},
	stopAllPlay : function(){
		var data = {
			"command": "StopPlayAll"
		  };
		businessSDKC.publishBase(data);
	},
	setVolume : function(screenIndex, vol){
		var data = {
			"command": "SetVolume",
			"pos": screenIndex,
			"vol": vol
		  };
		businessSDKC.publishBase(data);
	},
	isOpenVolume : function(falg){
		var data = {
			"command": "SetVolumeAll",
			"onoff": falg ? 1 : 0
		  };
		businessSDKC.publishBase(data);
	},
	setResolution : function(screenIndex, displayWith, displayHeight){
		var data = {
			"command": "SetResolution",
			"pos": screenIndex,
			"width": displayWith,
			"height": displayHeight
		  };
		businessSDKC.publishBase(data);
	},
	pausePlay : function(screenIndex){
		var data = {
			"command": "PausePlay",
			"pos": screenIndex
		  };
		businessSDKC.publishBase(data);
	},
	resumePlay : function(screenIndex){
		var data = {
			"command": "ResumePlay",
			"pos": screenIndex
		  };
		businessSDKC.publishBase(data);
	},
	adjustQuality : function(screenIndex, type, val){
		var data = {
			"command": "AdjustQuality",
			"pos": screenIndex,
			"target": type, //1-清晰度 2-亮度 3-颜色
  			"value": val //0~40 0~100 0~100
		  };
		businessSDKC.publishBase(data);
	},

};

export var businessSDKD = {
	/*公共接口**************************************************************************************/
	_socketURL       	: null,
	_wsclient        	: null,
	_isConnect		 	: false,//当前连接是否成功
	//_userID          	: null,
	//_userName        	: null,
	//_token			: null,
	_receiveInitCb	 	: null,
	_receiveClosedCB 	: null,
	_receiveErrorCB  	: null,
	_receiveReconnectCB	: null,
	_needReconnect		: true,	//是否需要重连
	_failureCount    	: 0,	//重连失败次数
	_reConnectInterval	: null,	//重连定时器

	/*业务回调函数************************************************************************************/
	_receiveMediaDataCB         		  : null,

	//ws初始化
	initScoket : function(wssURL, cb){
		console.log("socket init-----------------" + wssURL);
		businessSDKD._socketURL = wssURL;
		//businessSDKD._token  = token;
		try{
			if("WebSocket" in window){
				businessSDKD._wsclient = new WebSocket(businessSDKD._socketURL);
			}else if("MozWebSocket" in window){
				businessSDKD._wsclient = new MozWebSocket(businessSDKD._socketURL);
			}else{
				alert("您的浏览器不支持WebSocket...");
				return;
			}
		}catch(e){
			console.log(e);
			alert("创建SOCKET失败");
			return;
		}
		businessSDKD._wsclient.binaryType = "arraybuffer";
		businessSDKD._wsclient.onopen    = businessSDKD._onOpen;
		businessSDKD._wsclient.onmessage = businessSDKD._onMessage;
		businessSDKD._wsclient.onclose   = businessSDKD._onClose;
		businessSDKD._wsclient.onerror   = businessSDKD._onError;

		if(businessSDKD._isEmpty(cb) == false){
			businessSDKD._receiveInitCb = cb;
		}
	},
	_onError:function(event){
		console.log("socket error-----------------");
		businessSDKD._isConnect = false;
		businessSDKD._reConnect();
		/*if(businessSDKD._receiveErrorCB == null) return;
		businessSDKD._receiveErrorCB(event); */
	},
	_onClose:function(event){
		console.log("socket close-----------------");
		businessSDKD._isConnect = false;
		businessSDKD._reConnect();
		/*if(businessSDKD._receiveClosedCB == null) return;
		businessSDKD._receiveClosedCB(event);*/
	},
	_onOpen:function(event){
		if(businessSDKD._wsclient.readyState == WebSocket.OPEN){
			console.log("socket open-----------------");
			businessSDKD._isConnect = true;
			businessSDKD._needReconnect = true;

			if(businessSDKD._reConnectInterval == null){//首次创建成功
				if(businessSDKD._isEmpty(businessSDKD._receiveInitCb) == false){
					businessSDKD._receiveInitCb();
				}
			}else{//重连成功
				clearInterval(businessSDKD._reConnectInterval);
				businessSDKD._reConnectInterval = null;
				if(!businessSDKD._isEmpty(businessSDKD._receiveReconnectCB)){
					businessSDKD._receiveReconnectCB(true);
				}
			}
		}
	},
	_reConnect:function(){
		//重连
		if(businessSDKD._wsclient && businessSDKD._wsclient.readyState==WebSocket.CLOSED){
			if(!businessSDKD._needReconnect) return;
			if(businessSDKD._reConnectInterval) return;
			if(!businessSDKD._isEmpty(businessSDKD._receiveReconnectCB))
				businessSDKD._receiveReconnectCB(false);
			var reConnect = 0;
			businessSDKD._reConnectInterval = setInterval(function(){
				if(reConnect>720){
					clearInterval(businessSDKD._reConnectInterval);
					businessSDKD._reConnectInterval = null;
				}
				businessSDKD._wsclient.close();//清除之前的
				businessSDKD._wsclient = null;
				if("WebSocket" in window){
					businessSDKD._wsclient = new WebSocket(businessSDKD._socketURL);
				}else if("MozWebSocket" in window){
					businessSDKD._wsclient = new MozWebSocket(businessSDKD._socketURL);
				}
				businessSDKD._wsclient.binaryType = "arraybuffer";
				businessSDKD._wsclient.onopen    = businessSDKD._onOpen;
				businessSDKD._wsclient.onmessage = businessSDKD._onMessage;
				businessSDKD._wsclient.onclose   = businessSDKD._onClose;
				businessSDKD._wsclient.onerror   = businessSDKD._onError;

				reConnect++;
				if(reConnect%5==1) console.log("socket重连第"+reConnect+"次");
			}, 5000);
		}
	},
	_onMessage:function(event){
		if(businessSDKD._isEmpty(businessSDKD._receiveMediaDataCB) == false){
			businessSDKD._receiveMediaDataCB(event.data);
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
		if(!businessSDKD._isConnect) {
			console.log("SOCKET连接关闭");
			return;
		}
		if(businessSDKD._wsclient.readyState != WebSocket.OPEN){//未成功
			if(businessSDKD._failureCount >= 3) return;
			setTimeout("businessSDKD.publishBase(" + JSON.stringify(data) + ");", 1000);
			businessSDKD._failureCount++;
			return;
		}
		if(businessSDKD._failureCount != 0) businessSDKD._failureCount = 0;
		
		businessSDKD._wsclient.send(JSON.stringify(data));
		console.log("publish--------------"+JSON.stringify(data));
	},
	//socket状态回调
	setReceiveReconnectCallback: function (cb) {
		if (businessSDKD._isEmpty(cb) == false) {
			businessSDKD._receiveReconnectCB = cb;
		}
	},

	/*业务接口-------------------*/
	setReceiveMediaDataCallback : function(cb){
		if(businessSDKD._isEmpty(cb) == false){
			businessSDKD._receiveMediaDataCB = cb;
		}
	},

};