import Axios from 'axios'
// 统一身份认证服务SDK
export var uiaServiceSDK = {
    /*基础接口**************************************************************************************/
    _URLPrefix: "",
    _token: "",
    _errorCB: function(msg) {},
    _isAsync: true,
    _dataType: "json",
    //_contentType: 'application/json;charset=UTF-8',
    //设置URL前缀
    setURLPrefix: function(prefix) {
        if (prefix != null && typeof(prefix) != "undefined") {
            uiaServiceSDK._URLPrefix = prefix;
        }
    },
    //设置token
    setToken: function(token) {
        if (token != null && typeof(token) != "undefined") {
            uiaServiceSDK._token = token;
        }
    },
    //设置调用发生异常时回调方法
    setErrorCallback: function(callback) {
        if (callback != null && typeof(callback) != "undefined") {
            uiaServiceSDK._errorCB = callback;
        }
    },
    //设置是否异步消息
    setIsAsync: function(isAsync) {
        if (isAsync != null && typeof(isAsync) != "undefined") {
            uiaServiceSDK._isAsync = isAsync;
        }
    },
    //设置返回数据类型
    setDataType: function(dataType) {
        if (dataType != null && typeof(dataType) != "undefined") {
            uiaServiceSDK._dataType = dataType;
        }
    },
    _doGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: uiaServiceSDK._URLPrefix + url,
            async: uiaServiceSDK._isAsync,
            data: data,
            dataType: uiaServiceSDK._dataType,
            success: callback,
            error: uiaServiceSDK._errorCB
        };
        // $.ajax(configObj);
        Axios.get(configObj.url + '?' + data).then((res) => {
            //console.log("Axios 请求 get 获取到的结果 ：" + res.config.url)
            //console.log(res.data)
            if (callback) callback(res.data);
        });
    },
    _doPost: function(url, data, callback) {
        var configObj = {
            method: "POST",
            url: uiaServiceSDK._URLPrefix + url,
            async: uiaServiceSDK._isAsync,
            data: data,
            dataType: uiaServiceSDK._dataType,
            success: callback,
            error: uiaServiceSDK._errorCB
        };
        // $.ajax(configObj);
        Axios.post(configObj.url, data, { headers: { 'content-type': 'application/json; charset=UTF-8' } }).then((res) => {
            //console.log("Axios 请求 post 获取到的结果 ：" + res.config.url)
            //console.log(res.data)
            if (callback) callback(res.data);
        });
    },
       // 根据 HHID 查询用户信息（与下面 userLogin 返回一样）
    queryUserInfo(data, callback){
        var mapObj = new Map();
        mapObj.set("hhid", data.hhid);
        mapObj.set("ip", data.ip);
        var data = uiaServiceSDK._getDataString(mapObj);
        var url = "/third/queryUserInfo";
        uiaServiceSDK._doGet(url, data, callback);
    },

    // 统一认证登录
    userLogin(data, callback){
        var obj = {
             "ydm": data.ydm,
        //     "yhid": "tycjpt.tlm",
             "yhid": data.userName,
        //    "yhkl": "202004@tycjpt",
             "yhkl": data.passWord,
            // "yhkl":'whxtxk@201906',
        //    "yhdllx": "C/S",
            "yhdllx": "B/S",
            "ip": data.ip,
            "computer": "B/S",
        //     "ywxtbm": "TLMYTYSXRHPT",
            "ywxtbm": 'DMTJHPT',
        //     "ywxtmc": "&#x6CB9;&#x7530;&#x591A;&#x5A92;&#x4F53;&#x8F6F;&#x4EF6;&#x534F;&#x540C;&#x4EA4;&#x4E92;&#x5E73;&#x53F0;"
            "ywxtmc": '塔里木油田音视讯融合平台',
        //    "ywxtmc": '油田多媒体软件协同交互平台'
        }
        var url = "/third/userLogin?mode=1";
        uiaServiceSDK._doPost(url,JSON.stringify(obj), callback);
    },

}