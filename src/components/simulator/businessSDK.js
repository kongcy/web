let WebSocketSDK = function(url, opendCB, isArrayBuffer){
	/*公共接口**************************************************************************************/
	this._wsclient        	= null,
	this._socketURL       	= null,
	this._isConnect		 	= false,//是否连接成功
	this._isArrayBuffer		= false,//true为二进制
	this._receiveInitCb	 	= null,
	this._receiveClosedCB 	= null,
	this._receiveErrorCB  	= null,
	this._receiveReconnectCB	= null,
	this._failureCount    	= 0,//重连失败次数
	this._reConnectInterval	= null,//重连定时器
	this._userID			= null,
	this._userName			= null,
	this._token				= null,
	this._isPrintLog		= true,

	/*业务回调函数************************************************************************************/
	this._receiveRemindCB	= null,
	this._receiveBusinessCB	= null,
	this._receiveMediaDataCB	= null,

	this._receiveInformStartMediaByLocalCB = null,
	this._receiveInformStopMediaByLocalCB = null,
	this._receiveInformInitMediaCB = null,
	this._receiveInformRefreshScreenOSDInfosCB = null,

	// this._socketURL 	= url;
	// this._receiveInitCb	= opendCB;
	// this._isArrayBuffer	= isArrayBuffer;
	this.initScoket(url, opendCB, isArrayBuffer || false);
}

WebSocketSDK.prototype = {
	/*公共接口**************************************************************************************/
	// _wsclient        	: null,
	// _socketURL       	: null,
	// _isConnect		 	: false,//是否连接成功
	// _isArrayBuffer		: false,//true为二进制
	// _receiveInitCb	 	: null,
	// _receiveClosedCB 	: null,
	// _receiveErrorCB  	: null,
	// _receiveReconnectCB	: null,
	// _failureCount    	: 0,//重连失败次数
	// _reConnectInterval	: null,//重连定时器

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
	//主动关闭
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
				if(!this._isEmpty(this._receiveReconnectCB)){
					this._receiveReconnectCB(true);
				}
			}
		}
	},
	_reConnect:function(){
		//重连
		var _this = this;
		if(_this._wsclient && _this._wsclient.readyState==WebSocket.CLOSED){
			if(_this._reConnectInterval) return;
			if(!_this._isEmpty(_this._receiveReconnectCB))
			_this._receiveReconnectCB(false);
			var reConnect = 0;
			_this._reConnectInterval = setInterval(function(){
				if(reConnect>720){
					clearInterval(_this._reConnectInterval);
					_this._reConnectInterval = null;
				}
				_this._wsclient.close();//清除之前的
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
		if(event.data instanceof ArrayBuffer){//二进制
			if(this._isEmpty(this._receiveMediaDataCB) == false){
				this._receiveMediaDataCB(event.data);
			}
		}else{
			var data = JSON.parse(event.data);
			//console.log(data);
			switch(data.uri){
			case 1 << 8 | 220: // ping message
				this._publishBase(732);
				break;
			case 6 << 8 | 220: // broadcast message
				if(data.body){
					var vData   = null;
					var funName = null;
					var params  = null;
					if(typeof (JSON.parse(data.body)) == "object"){
						vData   = JSON.parse(data.body);
						funName = vData.funName;
						params  = vData.params;
					}
					else {
						vData   = JSON.parse(JSON.parse(data.body));
						funName = vData.funName;
						params  = vData.params;
					}
					if(this._isPrintLog){
						console.log("receive----------"+funName);
						console.log(params);
					}

					if( funName == "informStartMediaByLocal" ){
						if(this._isEmpty(this._receiveInformStartMediaByLocalCB) == false)
							this._receiveInformStartMediaByLocalCB(params);
					}else if( funName == "informStopMediaByLocal" ){
						if(this._isEmpty(this._receiveInformStopMediaByLocalCB) == false)
							this._receiveInformStopMediaByLocalCB(params);
					}else if( funName == "informInitMedia" ){
						if(this._isEmpty(this._receiveInformInitMediaCB) == false)
						this._receiveInformInitMediaCB(params);
					}else if(funName == "informShowRemind") {
						if(this._isEmpty(this._receiveRemindCB) == false)
							this._receiveRemindCB(params);
					}else if( funName == "informRefreshScreenOSDInfos" ){
						if(this._isEmpty(this._receiveInformRefreshScreenOSDInfosCB) == false)
							this._receiveInformRefreshScreenOSDInfosCB(params);
					}
				}
				break;
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
	_publishBase: function(code, data){
		var data_ = { "code": code};
		if(code == 732){

		}else if(code == 1500){
			data_.userID = this._userID;
			data_.userName = this._userName;
			data_.token = this._token;
		}else if(code == 1756){
			data_.userID = this._userID;
			data_.funName = data.funName;
			data_.params = data.params;
		}else if(code == 2012){

		}

		if(!this._isConnect) {
			console.log("SOCKET连接关闭");
			return;
		}
		if(this._wsclient.readyState != WebSocket.OPEN){//未成功
			if(this._failureCount >= 3) return;
			setTimeout("this._publishBase('"  + code +  "', " + JSON.stringify(data) + ");", 1000);
			this._failureCount++;
			return;
		}
		if(this._failureCount != 0) this._failureCount = 0;

		this._wsclient.send(JSON.stringify(data_));
		if(this._isPrintLog) console.log("publish--------------"+JSON.stringify(data_));
	},
	//publish
	publish : function(funName, params){
		params.operatorToken = this._token;
		var data = {"funName" : funName,
					"params"  : params};
					this._publishBase(1756, data);
	},
	//join
	join : function(userID, userName, token, cb){
		this._userID = userID;
		this._userName = userName;
		this._token  = token;

		//认证
		this._publishBase(1500);

		var funName = "join";
		var params = {};
		this.publish(funName, params);

		//回调
		if(this._isEmpty(cb) == false){
			this._receiveJoinCB = cb;
		}
	},
	//leave
	leave : function(cb){
		//退出
		this._publishBase(2012);

		var funName = "leave";
		var params = {};
		this.publish(funName, params);

		if(this._wsclient) {
			this._wsclient.close();
			this._wsclient = null;
			clearInterval(this._reConnectInterval);
			this._reConnectInterval = null;
		}
		/*if(cb != null && typeof(cb) != "undefined"){
			this._receiveClosedCB = cb;
		}*/
	},

	// 开启媒体输出反馈（软解）
	setReceiveInformStartMediaByLocalCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveInformStartMediaByLocalCB = cb;
		}
	},
	// 停止媒体输出反馈（软解）
	setReceiveInformStopMediaByLocalCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveInformStopMediaByLocalCB = cb;
		}
	},
	// 发布初始化媒体状态（用户习惯）
	publishInitMediaByCustom : function(){
		var funName = "publishInitMediaByCustom";
		var params = {};
		this.publish(funName, params);
	},
	// 发布媒体初始化反馈
	setReceiveInformInitMediaCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveInformInitMediaCB = cb;
		}
	},
	//发布用户状态
	publishUserStatus : function(status){
		var funName = "publishUserStatus";
		var params = {"status":status+""};
		this.publish(funName, params);
	},
	//设置接收提醒时回调
	setReceiveRemindCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveRemindCB = cb;
		}
	},
	// OSD信息反馈
	setReceiveInformRefreshScreenOSDInfosCallback : function(cb){
		if(this._isEmpty(cb) == false){
		  this._receiveInformRefreshScreenOSDInfosCB = cb;
		}
	},

	/*呼叫控制-呼叫start**************************************************************************************/
	// 开启呼叫
	publishStartCall : function(receiverID, senderName,receiverName){
		var funName = "publishStartCall";
		var params = {
			"receiverID" : receiverID,
			"onlyVolice" : "false",   // true false
			"senderName" : senderName,
			"receiverName" : receiverName,
		};
		this.publish(funName, params);
	},
	// 开启呼叫华为uc
	publishStartCallHW : function(receiverID, senderName,receiverName){
		var funName = "publishStartCallHWMeetingTerminal";
		var params = {
			"receiverID" : receiverID,
			"onlyVolice" : "false",   // true false
			"senderName" : senderName,
			"receiverName" : receiverName,
		};
		this.publish(funName, params);
	},
	// 停止呼叫
	publishStopCall : function(receiverID,senderName,receiverName){
		var funName = "publishStopCall";
		var params = {
			"receiverID" : receiverID,
			"senderName" : senderName,
			"receiverName" : receiverName,
		};
		this.publish(funName, params);
	},
	/*呼叫控制-呼叫end**************************************************************************************/

};

export default WebSocketSDK;