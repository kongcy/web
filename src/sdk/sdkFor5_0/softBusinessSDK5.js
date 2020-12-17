export var softBusinessSDK5 = {
    
    _wsclient: null,
    _url:null,
    _sipId:null,
    _password:null,
    _domain:null,
    _port:5060,
    init:function(url,sipid,password,domain,port){
        softBusinessSDK5._url=url;
        softBusinessSDK5._sipId=sipid;
        softBusinessSDK5._password=password;
        softBusinessSDK5._domain=domain;
        softBusinessSDK5._port=port;

        console.log(softBusinessSDK5._wsclient);
        console.log("softWebsocket init... ");
        if ("WebSocket" in window) {
            softBusinessSDK5._wsclient = new WebSocket(softBusinessSDK5._url);
        } else if ("MozWebSocket" in window) {
            softBusinessSDK5._wsclient = new MozWebSocket(softBusinessSDK5._url);
        } else {
          alert("您的浏览器不支持WebSocket...");
        }
        
        softBusinessSDK5._wsclient.onopen = softBusinessSDK5._onOpen;
        softBusinessSDK5._wsclient.onmessage = softBusinessSDK5._onMessage;
        softBusinessSDK5._wsclient.onclose = softBusinessSDK5._onClose;
        softBusinessSDK5._wsclient.onerror = softBusinessSDK5._onError;
        console.log(softBusinessSDK5._wsclient);

    },
    close:function(){
        if(softBusinessSDK5._wsclient!=null){
            softBusinessSDK5._wsclient.close();
            softBusinessSDK5._wsclient=null;
        }
    },
    _onOpen: function (event) {
        
        console.log("open"+softBusinessSDK5._url);
        if (softBusinessSDK5._wsclient.readyState == WebSocket.OPEN) {
            softBusinessSDK5.startRegister(softBusinessSDK5._sipId,softBusinessSDK5._password,softBusinessSDK5._domain,softBusinessSDK5._port);
            softBusinessSDK5.startWork();
        }
    },
    _onMessage: function (event) {
    },
    _onClose: function (event) {
        console.log("softWebsocket close...");
        console.log(softBusinessSDK5._wsclient);
        if(softBusinessSDK5._wsclient!=null){
            softBusinessSDK5._wsclient.close();
            softBusinessSDK5._wsclient=null;
            softBusinessSDK5.init(softBusinessSDK5._url,softBusinessSDK5._sipId,softBusinessSDK5._password,softBusinessSDK5._domain,softBusinessSDK5._port);
        }
        

    },
    _onError: function (event) {
        console.log("softWebsocket error...");
    },
    

    startRegister: function (sipid, passwd, ip, port) {
        // var a ={"command":"StartRegister","sipid":"39200000001","passwd":"123456","ip":"172.16.3.92","port":5060}
        var data = {"command":"StartRegister","sipid":sipid,"passwd":passwd,"ip":ip,"port":port}
        softBusinessSDK5._wsclient.send(JSON.stringify(data));
        
        console.log(JSON.stringify(data))
    },
    startWork: function () {
        var data = {"command":"StartWork"}
        softBusinessSDK5._wsclient.send(JSON.stringify(data));
        
        console.log(JSON.stringify(data))
    },

}