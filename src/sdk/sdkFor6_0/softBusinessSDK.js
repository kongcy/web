let WebSocketSDK = function(url, opendCB, isArrayBuffer){
	/*公共接口**************************************************************************************/
	this._wsclient        	= null;
	this._socketURL       	= null;
	this._isConnect		 	= false;//是否连接成功
	this._isArrayBuffer		= false;//true为二进制
	this._receiveInitCb	 	= null;
	this._receiveClosedCB 	= null;
	this._receiveErrorCB  	= null;
	this._receiveReconnectCB	= null;
	this._failureCount    	= 0;//重连失败次数
	this._reConnectInterval	= null;//重连定时器

	/*业务回调函数************************************************************************************/
	this._receiveSwitchSourceCB = null;
	this._receiveSoftStatusCB	= null;
	// this.initScoket(url, opendCB, isArrayBuffer || false);
}

WebSocketSDK.prototype = {
	//ws初始化
	initScoket : function(wssURL, cb, isArrayBuffer){
		console.log("socket init-----------------", wssURL);
		this._socketURL = wssURL;
		this._isArrayBuffer = isArrayBuffer || false;
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
		this._isConnect = false;
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
			}else{//重连成功
				clearInterval(this._reConnectInterval);
				this._reConnectInterval = null;
				isReconnect = true;
			}
			if(!this._isEmpty(this._receiveInitCb)){
				this._receiveInitCb();
			}
			if(!this._isEmpty(this._receiveReconnectCB)){
				this._receiveReconnectCB(isReconnect?2:1);
			}
		}
	},
	_reConnect:function(){
		//重连
		var _this = this;
		if(_this._wsclient && _this._wsclient.readyState==WebSocket.CLOSED){
			if(_this._reConnectInterval) return;
			if(!this._isEmpty(this._receiveReconnectCB)){
				this._receiveReconnectCB(0);
			}
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
		if(event.data instanceof ArrayBuffer){//二进制
			if(this._isEmpty(this._receiveMediaDataCB) == false){
				this._receiveMediaDataCB(event.data);
			}
		}else{
			var data = JSON.parse(event.data);
			var funName = data.command;
			console.log("receive----------"+funName);
			console.log(data);
			
			if (funName == 'SwitchSource') {
				if (this._receiveSwitchSourceCB) {
					var obj = {code: data.code, msg: data.msg};
					this._receiveSwitchSourceCB(obj);
				}
			} else if (funName == 'GetSoftStatus') {
				if (this._receiveSoftStatusCB) {
					var obj = {status: data.status};
					this._receiveSoftStatusCB(obj);
				}
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
			console.log("SOCKET连接关闭");
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
	setReceiveSwitchSourceCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveSwitchSourceCB = cb;
		}
	},
	setReceiveSoftStatusCallback : function(cb){
		if(this._isEmpty(cb) == false){
			this._receiveSoftStatusCB = cb;
		}
	},
	switchSource : function(){
		var data = {
			"command"	: "SwitchSource"
		  };
		  this.publishBase(data);
	},
	getSoftStatus : function(){
		var data = {
			"command"	: "GetSoftStatus"
		  };
		  this.publishBase(data);
	},	
	startRegister : function(userName, password, ip, port){
		var data = {
			"command"	: "StartRegister",
			"sipid"		: userName,
			"passwd"	: password,
			"ip"		: ip,
			"port"		: port
		  };
		  this.publishBase(data);
	},
	startWork : function(){
		var data = {
			"command"	: "StartWork"
		  };
		  this.publishBase(data);
	},

};

export var softBusinessSDK6 = new WebSocketSDK();