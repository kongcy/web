import { businessSDK6 } from './sdkFor6_0/businessSDK.js';
import { businessSDK5 } from './sdkFor5_0/businessSDK.js';
import { softBusinessSDK5 } from './sdkFor5_0/softBusinessSDK5.js';
import { softBusinessSDK6 } from './sdkFor6_0/softBusinessSDK.js';
import { dataSDK5 } from './sdkFor5_0/dataSDK.js';
import { dataSDK6 } from './sdkFor6_0/dataSDK.js';
import { playerSDK } from './sdkFor6_0/playerSDK';
import { playerSDK5 } from './sdkFor5_0/playSDK5';
import { playerSDKNew } from './player/playerSDK';
//查询策略 新加sdk 11.24
import { strategeSDK6 } from './sdkFor6_0/strategeSDK.js';

var apiSDK = {
    userID: "",
    userName: "",
    userToken: "",
    validTokenTime: 0,
    refreshTokenTimer: null,
    config: null,
    socketStatus: -1, //-1:断开，1:首次链接成功，2：重连成功
    enumSDKVersion: {
        SDKVersion5: "version5",
        SDKVersion6: "version6"
    },
    OrganizationData:{},

    //初始化配置
    initConfig: function(config_) {
        this.config = config_;
        //用于插件版本控制，可扩展
        this.config.pluginVersion = config_.pluginVersion || 1;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.setURLPrefix(this.config.dataURL);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setURLPrefix(this.config.dataURL);
            //查询策略 新加sdk 11.24
            strategeSDK6.setURLPrefix(this.config.strategeURL);
            // 设置免插登录服务地址
            strategeSDK6.setNoPluginURLPrefix(this.config.noPluginServerURL);
        }
    },

    //初始化用户信息
    initUserInfo: function(userID, userName, userToken) {
        this.userID = userID;
        this.userName = userName;
        this.userToken = userToken;
        this.userLoginID = xtxk.cache.get('USER').userLoginID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setToken(userToken);
            //查询策略 新加sdk 11.24
            strategeSDK6.setToken(userToken);
        }
    },


    /**
     * 续约-固定频率刷新token
     * validTime:时间戳，毫秒
     * var resp ={Ret:0/1,newToken:'',newValidTime:0}
     * */
    refreshToken: function(validTime, callback) {
        this.validTokenTime = validTime;
        var _this = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            this.refreshTokenTimer = setInterval(function() {
                dataSDK5.refrshToken(_this.userToken, function(obj) {
                    var resp = {}
                    if (obj.responseCode == 0) {
                        _this.validTokenTime = 0

                        resp.Ret = 0
                        resp.newValidTime = _this.validTokenTime
                        if (callback) callback(resp)
                    }
                });
            }, 5 * 60 * 1000);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            this.refreshTokenTimer = setInterval(function() {
                dataSDK6.renewUserToken(1, function(obj) {
                    var resp = {}
                    if (obj.responseCode == 1) {
                        _this.validTokenTime = obj.data.validTime * 1000

                        resp.Ret = 0
                        resp.newValidTime = _this.validTokenTime
                    } else if (obj.responseCode == 0) {
                        resp.Ret = 1
                    }
                    if (callback) callback(resp)
                });
            }, 30 * 1000);
        }
    },

    /**  // 11.26 同步云调度 1124 用户状态上报从ws改成http
     * 这个接口实际完成的是之前两个版本DataSdk,BussinessSDK的初始化的工作
     * */
    initSocket: function(initSocketfn) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.init(this.config.businessURL, this.userToken, function(obj) {
                businessSDK5.join(apiSDK.userID, apiSDK.userName);
                initSocketfn(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.initScoket(this.config.businessURL, this.userToken, (obj) => {
                //join
                businessSDK6.join(apiSDK.userID, apiSDK.userName);
                let localSipInfo = xtxk.cache.get('LOCALSIPINFO');
                if(localSipInfo) {
                    // this.publishUserStatus(0, localSipInfo.sipid);
                    dataSDK6.setUserStatus(this.userID, 'BusinessOnline', localSipInfo.sipid)
                }
                //首次创建成功
                // if (obj == true) businessSDK6.publishUserStatus(0);
                initSocketfn(obj);
            });
        }
    },

    /**
     * 发布用户状态
     * 0 在线 1 离线
     */

    publishUserStatus(val, encoderSIPID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishUserStatus(val, encoderSIPID);
        }
    },
    // 11.26 同步云调度 1124 用户状态上报从ws改成http
    setUserStatus(resourceStatus, encoderSIPID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setUserStatus(this.userID, resourceStatus, encoderSIPID);
        }
    },
    /*
     * 仅断开socket
     * */
    onlyClose: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.onlyClose();
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.onlyClose();
        }
    },

    /*
     * 获取验证码请求的url
     * */
    getValidCodeUrl: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return this.config.dataURL + "/Authority/imgcode?" + Math.random();
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return this.config.dataURL + "/account/createVerificationCode?type=0&ipAddress=&t" + Math.random();
        }
    },
    /**
     * socket状态上报
     * {state:0} 
     * -1:断开，1:首次链接成功，2：重连成功
     */
    setSocketReconnectCallback: function(id, callback) {
        let _this = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveReconnectCommandWindowCallback(id, function(obj) {
                var resp = {}
                resp.state = obj.state
                _this.socketStatus = resp.state;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveReconnectCommandWindowCallback(id, function(res) {
                var resp = {}
                resp.state = res
                _this.socketStatus = resp.state;
                callback(resp);
            });
        }
    },

    // ----------------------------------------------------登录能力--------------------------------------------------

    /**
     * 登录能力，帐号登录，用户切换
     * loginName:登录名
     * loginpwd:登录密码
     * validCode:验证码
     * resp ={Ret:1,token:'',data:{userID,userName,centerID},validTime:0}
     * validTime:有效截止时间戳，单位毫秒
     */
    loginWithAccount: function(loginName, loginpwd, validCode, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.login(loginName, loginpwd, validCode, function(obj) {
                var resp = {};
                if (obj.ret == 0) {
                    resp.Ret = obj.ret
                    resp.token = obj.token
                    resp.data = {};
                    resp.data.userID = obj.data.userID
                    resp.data.userName = obj.data.userName
                    resp.data.centerID = obj.data.centerID
                    resp.validTime = 0
                } else if (obj.ret === 1) {
                    resp.Ret = 1
                    resp.message = obj.msg
                } else if (obj.ret === 2) {
                    resp.Ret = obj.ret
                    resp.token = obj.token
                    resp.data = {};
                    resp.data.userID = obj.data.userID
                    resp.data.userName = obj.data.userName
                    resp.data.centerID = obj.data.centerID
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.createUserTokenForWeb(loginName, loginpwd, "", "0", validCode, function(obj) {
                var resp = {};
                if (obj.responseCode == 1||obj.responseCode == '0') {
                    resp.Ret = 0
                    resp.token = obj.data.tokenKey
                    resp.data = {};
                    resp.data.userID = obj.data.userID
                    resp.data.userName = obj.data.userName
                    resp.data.centerID = ""
                    resp.validTime = obj.data.validTime * 1000
                } else if (obj.responseCode == 0) {
                    resp.Ret = 1
                    resp.message = obj.responseDesc
                } else {
                    resp.Ret = obj.responseCode
                    resp.message = obj.responseDesc
                }
                callback(resp);
            });
        }
    },

    /**
     * 用户退出
     * */
    publishLeave: function(callback) {
        this.socketStatus = -1;
        var resp = { Ret: '' }
        this.socketStatus = -1;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.leave();
            softBusinessSDK5.close();
            playerSDKNew.close();
            callback();
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            this.noPluginLoginOut()
            // businessSDK6.publishUserStatus(1);    // 11.26 同步云调度 1124 用户状态上报从ws改成http
            dataSDK6.setUserStatus(this.userID, 'UserOffline')   // 11.26 同步云调度 1124 用户状态上报从ws改成http
            businessSDK6.leave();
            playerSDKNew.close();
            dataSDK6.removeUserToken();
            softBusinessSDK6.closeSocket();
            if (this.refreshTokenTimer != null) {
                clearInterval(this.refreshTokenTimer)
                this.refreshTokenTimer = null
            }
            if(typeof(callback) === 'function') {
                callback();
            }
        }
    },

    /**
     * 用户异常退出(刷新、关闭)
     * */
    publishUserStatusException: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishUserStatusException();
        }
    },

    /**
     * 添加问题
     * var resp ={Ret:0/1}
     * */
    addQuestion: function(question, answer, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.addQuestion(this.userToken, question, answer, function(obj) {
                resp.Ret = obj.ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * userId:操作人
     * token:令牌
     * var resp=[{QuestionId:"",QuestionName:"",enable:true/false}]
     */
    getQuestion: function(callback) {
        var resp = []
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getQuestion(this.userToken, function(obj) {
                var enabled = obj.data.enable
                obj.data.questions.forEach(function(item) {
                    var row = {}
                    row.enable = enabled === 1
                    row.QuestionId = item.questionId
                    row.QuestionName = item.questionDes
                    resp.push(row)
                });

                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 编辑问题
     * questionId:问题id
     * question:问题
     * answer:答案
     * var resp ={Ret:0/1}
     * */
    editQuestion: function(questionId, question, answer, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateQuestion(this.userToken, questionId, question, answer, function(obj) {
                resp.Ret = obj.ret
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 启用问题
     * isEnabled是否启用
     * var resp ={Ret:0/1}
     * */
    enableQuestion: function(isEnabled, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.setQuestionEnable(this.userToken, isEnabled ? 1 : 0, function(obj) {
                resp.Ret = obj.ret
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 验证问题
     * questionId:问题id
     * answer:问题
     *
     * var resp ={Ret:0/1/2}
     * Ret:0.成功，1.失败,2.抢占
     * */
    validateQuestion: function(questionId, answer, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.vaildQuestion(this.userToken, questionId, answer, function(obj) {
                resp.Ret = obj.ret
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 人脸识别接口
     * var resp={Ret:0,token:"",userId:"",userName:"",count:''}
     * */
    loginwithface: function(image, calllback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.faceLogin(image, function(obj) {
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                    resp.token = obj.data.tokenKey
                    resp.userId = obj.data.userID
                    resp.userName = obj.data.userName
                    resp.validTime = obj.data.validTime
                } else if (obj.responseCode == 0) { //无人脸
                    resp.Ret = 1
                } else {
                    resp.Ret = -1
                }
                calllback(resp);
            });
        }
    },

    /**
     * 人脸采集
     * var resp = {Ret:0/1/-1}
     * */
    recognizationRegister: function(image, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.faceRegister(image, function(obj) {
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else if (obj.responseCode == 0) { //无人脸
                    resp.Ret = 1
                } else {
                    resp.Ret = -1
                }
                callback(resp)
            });
        }
    },
    /**
     * 修改密码
     * oldPassword:旧密码
     * newPassword:新密码
     * var resp ={Ret:0/1}
     * */
    modifyUserPwd: function(oldPassword, newPassword, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.editUserPassword(oldPassword, newPassword, function(obj) {
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else if (obj.responseCode == 0) {
                    resp.Ret = 1
                }

                callback(resp)
            });
        }
    },
    setLeaveCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            businessSDK5.setReceiveLeaveCallback(function(obj) {
                businessSDK5.leave();
                resp.msg = obj.params;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveExitCallback(function(obj) {
                // businessSDK6.publishUserStatus(1);
                // businessSDK6.leave();
                // dataSDK6.removeUserToken();
                // if (this.refreshTokenTimer != null) {
                //     clearInterval(this.refreshTokenTimer)
                //     this.refreshTokenTimer = null
                // }
                callback(obj)
            });
        }
    },
    setReceivePassiveExitCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceivePassiveExitCallback(obj => {
                this.publishLeave();
                callback(obj)
            });
        }
    },
    /**
     * 登录能力，抢占式登录
     * loginType:0为接管登录，1为重新登录
     * resp ={Ret:0/1,token:'',data:{userID,userName,centerID}}
     */
    LoginWithMandatory: function(loginType, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.forcelogin(this.userToken, loginType, function(obj) {
                var resp = { Ret: "", token: "", data: { userID: "", userName: "", centerID: "" } }
                resp.Ret = obj.ret;
                resp.token = obj.token;
                resp.data.userID = obj.data.userID;
                resp.data.userName = obj.data.userName;
                resp.data.centerID = obj.data.centerID;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *用户切换
     * loginName:新的登录用户
     * loginpwd:新的登录用户密码
     * validCode:验证码
     * resp={Ret:'',token:'',data:{userID,userName,centerID}}
     */
    LoginSwitch: function(loginName, LoginPwd, validCode, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.changelogin(this.userToken, loginName, LoginPwd, validCode, function(obj) {
                var resp = { Ret: "", token: "", data: { userID: "", userName: "", centerID: "" } }

                if (obj.ret == 0) {
                    resp.Ret = obj.ret
                    resp.token = obj.token
                    resp.data = {};
                    resp.data.userID = obj.data.userID
                    resp.data.userName = obj.data.userName
                    resp.data.centerID = obj.data.centerID
                } else if (obj.ret === 1) {
                    resp.Ret = 1
                    resp.message = obj.msg
                } else if (obj.ret === 2) {
                    resp.Ret = obj.ret
                    resp.token = obj.token
                    resp.data = {};
                    resp.data.userID = obj.data.userID
                    resp.data.userName = obj.data.userName
                    resp.data.centerID = obj.data.centerID
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 指纹录入
     * fingerPrint:从插件返回的指纹信息
     *
     * var resp ={Ret:0/1,token:'',data:{userID,userName,centerID}}
     * */
    loginWithFingerPrint: function(fingerPrint, callback) {

    },

    /**
     * uKey录入
     * ukey:从插件返回的ukey信息
     *
     * var resp ={Ret:0/1,token:'',data:{userID,userName,centerID}}
     * */
    loginWithUKey: function(ukey, callback) {

    },

    // ----------------------------------------------- 软编 --------------------------------------------------
    /**
     * 获取绑定编码器
     * deviceId
     * deviceCh
     * deviceName
     * deviceIp
     * deviceType : 设备类型
     * sipId : sip编号
     * password : 密码
     * domain : 域名或ip
     * port : 端口
     * */
    // getBindEncodingDevice: function(callback) {
    //     if (this.config.version === this.enumSDKVersion.SDKVersion5) {
    //         dataSDK5.getBindDevice(this.userToken, function(obj) {
    //             var resp = { userID: '', isSoftCoding: 0, data: { encoderId: '', encoderName: '', encoderCh: '', encoderIp: '', encoderType: '', encoderSipId: '', encoderPassword: '', encoderDomain: '', encoderPort: '' } };
    //             if (obj.ret == 0 && obj.data) {
    //                 resp.userID = obj.data.userID;
    //                 if (obj.data.binddat) {
    //                     if (obj.data.binddat.deviceType == '20127' && obj.data.binddat.deviceSmallType == '174') { // 软编
    //                         resp.isSoftCoding = 1;
    //                         if (obj.data.binddat) {
    //                             resp.data.encoderId = obj.data.binddat.deviceId;
    //                             resp.data.encoderName = obj.data.binddat.deviceName;
    //                             resp.data.encoderCh = obj.data.binddat.deviceCh;
    //                             resp.data.encoderIp = obj.data.binddat.deviceIp;
    //                             resp.data.encoderType = obj.data.binddat.deviceType;
    //                             resp.data.encoderSmallType = obj.data.binddat.deviceSmallType;
    //                             resp.data.encoderSipId = obj.data.binddat.sipId;
    //                             resp.data.encoderPassword = obj.data.binddat.password;
    //                             resp.data.encoderDomain = obj.data.binddat.domain;
    //                             resp.data.encoderPort = obj.data.binddat.port;
    //                         }
    //                     }
    //                 }
    //             }
    //             callback(resp);
    //         })
    //     } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

    //     }
    // },
    setInformInitMediaForEncoderCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getBindDevice(this.userToken, function(obj) {
                var resp = { encoderSipId: '', encoderPassword: '', encoderDomain: '', encoderPort: '' };
                if (obj.ret == 0 && obj.data && obj.data.binddat) {
                    if (obj.data.binddat.deviceType == '20127' && obj.data.binddat.deviceSmallType == '174') { // 软编
                        if (obj.data.binddat) {
                            resp.encoderSipId = obj.data.binddat.sipId;
                            resp.encoderPassword = obj.data.binddat.password;
                            resp.encoderDomain = obj.data.binddat.domain;
                            resp.encoderPort = obj.data.binddat.port;
                        }
                    }
                }
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setInformInitMediaForEncoderCallback(function(obj){
                var resp = { encoderSipId: '', encoderPassword: '', encoderDomain: '', encoderPort: '' };
                resp.encoderSipId = obj.SIPID
                resp.encoderDomain = obj.serverIP
                resp.encoderPort = obj.serverPort
                resp.encoderPassword = obj.clientPassword
                callback(resp)
            });
        }
    },

    /**
     * 软编socket
     * */
    initEncoder: function(sipid, password, domain, port) {
        if(this.config.enableSoftEncoder){ 
            if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // let url = "wss://127.0.0.1:8888";
                let url = "ws://127.0.0.1:8888";
                softBusinessSDK5.init(url, sipid, password, domain, port)
            } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // let url = "wss://127.0.0.1:8888";
                let url = "ws://127.0.0.1:8888";
                softBusinessSDK6.initScoket(url, function(){
                    softBusinessSDK6.startRegister(sipid, password, domain, parseInt(port));
                    softBusinessSDK6.startWork();
                });
            }
        }
    },




    // -----------------------------------------------资源呈现 --------------------------------------------------

    /**
     * 获取组织结构树（包括主界面和子界面）
     * var resp ={subscribeId:'',rows:[{departmentId:'',departmentName:'',parentId:'',userCnt:0}....]}
     * 注意userCnt的作用是前端根据这个值预留相关位置以及是否向后天请求数据
     */
    getOrganizationUser: function(organizationId, id, subjectId, callback) {
        var subjectId = subjectId || 0;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getOrganizationUser(this.userID, this.userToken, id, subjectId, "", function(obj) {
                const resp = { subscribeId: '', rows: [] };
                resp.subscribeId = id
                if (obj.success) {
                    obj.rows.forEach(function(item) {
                        const it = {}
                        it.departmentId = item.departmentID
                        it.departmentName = item.departmentName
                        it.parentId = item.superDepartmentID
                        it.userCnt = item.usercount
                        resp.rows.push(it)
                    })
                }
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeOrganizationUser(organizationId, id);
            businessSDK6.setReceiveInformAddDepartmentCallback(id, function(res) {
                let obj=JSON.parse(res).params;
                const resp = { subscribeId: '', rows: [] };
                resp.subscribeId = obj.subscribeID
                obj.nodes && obj.nodes.forEach(function(item) {
                    const it = {}
                    it.departmentId = item.departmentid
                    it.departmentName = item.name
                    it.parentId = item.parentid
                    it.userCnt = item.resourceCount
                    resp.rows.push(it)
                })
                callback(resp)
            })
        }
    },

    /**
     * 获取设备资源树
     *var resp ={subscribeId:'',rows:[{departmentId:'',departmentName:'',parentId:'',devCnt:0}....]}
     */
    getOrganizationDevice: function(organizationId, id, subjectId, callback) {
        var self=this;
        var subjectId = subjectId || 0;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getOrganizationDevice(this.userID, this.userToken, id, subjectId, "", function(obj) {
                const resp = { subscribeId: '', rows: [] };
                resp.subscribeId = id
                obj.rows && obj.rows.forEach(function(item) {
                    var it = {}
                    it.departmentId = item.departmentID
                    it.departmentName = item.departmentName
                    it.parentId = item.superDepartmentID
                    it.devCnt = item.devicecount
                    resp.rows.push(it)
                })
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeOrganizationDevice(organizationId, id);
            businessSDK6.setReceiveInformAddDepartmentCallback(id, function(res) {
                //wxx 2020.11.26
                let resJ=JSON.parse(res);
                resJ.userID=self.userID;
                self.OrganizationData=resJ;
                if(resJ.params.subscribeID=='MainOrganizationDevice'){
                    strategeSDK6.queryResCount(res,function(objV){
                        let obj=objV.params;
                        const resp = { subscribeId: '', rows: []};
                        resp.subscribeId = obj.subscribeID
                        obj.nodes && obj.nodes.forEach(function(item) {
                            var it = {}
                            it.departmentId = item.departmentid
                            it.departmentName = item.name
                            it.parentId = item.parentid
                            it.userCnt = item.resourceCount
                            it.onLineCount=item.onLineCount
                            it.totalCount=item.totalCount
                            resp.rows.push(it)
                        })
                        callback(resp);
                    })
                }else{
                    let obj=resJ.params;
                    const resp = { subscribeId: '', rows: [] };
                    resp.subscribeId = obj.subscribeID
                    obj.nodes && obj.nodes.forEach(function(item) {
                        var it = {}
                        it.departmentId = item.departmentid
                        it.departmentName = item.name
                        it.parentId = item.parentid
                        it.userCnt = item.resourceCount
                        resp.rows.push(it)
                    })
                    callback(resp);
                }
            })
        }
    },
    //=================刷新设备资源树在线数量和总数量 20201219=================
    refreshOrganizationDevice:function(callback){
        //先测试完再放开
        // strategeSDK6.queryResCount(this.OrganizationData,function(objV){
        //     let obj=objV.params;
        //     const resp = { subscribeId: '', rows: []};
        //     resp.subscribeId = obj.subscribeID
        //     obj.nodes && obj.nodes.forEach(function(item) {
        //         var it = {}
        //         it.departmentId = item.departmentid
        //         it.departmentName = item.name
        //         it.parentId = item.parentid
        //         it.userCnt = item.resourceCount
        //         it.onLineCount=item.onLineCount
        //         it.totalCount=item.totalCount
        //         resp.rows.push(it)
        //     })
        //     callback(resp);
        // })
    },
     /**
     * 获取常用树  2020.12.13
     * 
     * var resp =[{channelId:"",channelName:"",isShare:true/false}]
     * */
    getCommonUse: function(num,resourceName,callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // this.userID,
            strategeSDK6.getCommonUseList(this.userID,num,resourceName,function(res) {
                console.log('获取常用节点-----',res)
                let resp = []
               // if (res.responseCode == 1) {
                    resp = res.data
               // }
                callback(resp)
            })
        }
    },
       /**
     * 添加常用节点  2020.12.13
     * 
     * var resp =[{channelId:"",channelName:"",isShare:true/false}]
     * */
    AddCommonUse:function(node){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // this.userID,
            strategeSDK6.AddCommonUse(this.userID,node,function(res) {
                console.log('添加常用节点-----',res)
            })
        }
    },

    /**
     * 订阅用户
     * departmentIds: 需要加载的部门ID数组
     * subscribeId: 订阅ID/加载区域Id //main-user
     */
    subscribeUserStatus: function(departmentId, subscribeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var departments = [{ id: departmentId }];
            var guid = this.getTime();
            businessSDK5.subscribeUser(departments, subscribeId, guid);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeUsersStatus(departmentId, subscribeId);
        }
    },

    /** 查询资源订阅 ************************************************************************************* */
    /**
     * 订阅人员状态（按关键字/用户状态搜索）
     *
     * type: 搜索类型：text: 关键字, online: 用户状态, buss: 媒体状态
     * text: 搜索关键字
     * online: 人员状态：true: 在线，false: 离线
     * buss: 媒体状态（V5）0.all，1.点播,2.呼叫,3.对讲,4.会议,5.转发
     * subscribeId: 订阅ID
     * organizationId: 组织ID（V6）
     */
    subscribeUserQuery: function(type, text, online, buss, subscribeId, organizationId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var guid = this.getTime();
            businessSDK5.subscribeUserQuery(type, text, online, buss, subscribeId, guid);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (type === "text") { //按照关键字订阅
                businessSDK6.subscribeUsersStatusByKey(text, subscribeId, organizationId);
            }
            if (type === "online") { //按照上下线订阅
                var status = "1" //下线
                if (online == true || online == 'true') {
                    status = "0"
                } else if (online == false || online == 'false') {
                    status = "1"
                }
                businessSDK6.subscribeUsersStatusByStatus(status, subscribeId, organizationId);
            }
        }

    },

    /**
     * 订阅设备状态（设备增/删/改，设备线上状态，媒体状态）
     * departmentIds: 需要加载的部门
     * subscribeId: 订阅ID/加载区域ID
     */
    subscribeDeviceStatus: function(departmentId, subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var departments = [{ id: departmentId }];
            var guid = this.getTime();
            businessSDK5.subscribeDevice(departments, subscribeId, guid)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeDevicesStatus(departmentId, subscribeId);
        }


    },

    /**
     * 订阅设备状态（按关键字/设备状态搜索）
     *
     * type: 搜索类型：text: 关键字, online: 用户状态, buss: 媒体状态
     * text: 搜索关键字
     * online: 人员状态：true: 在线，false: 离线
     * buss: 媒体状态（V5）0.无，1.点播,2.呼叫,3.对讲
     * subscribeId: 订阅ID
     * organizationId: 组织ID（V6）
     *
     * 重构返回数据及执行步骤参考subscribeUserQuery
     */
    subscribeDeviceQuery: function(type, text, online, buss, subscribeId, organizationId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeDeviceQuery(type, text, online, buss, subscribeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (type === "text") { //按照关键字订阅
                businessSDK6.subscribeDevicesStatusByKey(text, subscribeId, organizationId);
            };
            if (type === "online") { //按照上下线订阅
                var status = "1" //下线
                if (online == true || online == 'true') {
                    status = "0"
                } else if (online == false || online == 'false') {
                    status = "1"
                }
                businessSDK6.subscribeDevicesStatusByStatus(status, subscribeId, organizationId);
            };
        }
    },

    /**
     * 订阅常用资源
     *
     * type: 搜索类型：text: 关键字, online: 用户状态
     * text: 搜索关键字
     * online: 人员状态：true: 在线，false: 离线
     * subscribeId: 订阅ID
     */
    subscribeCommonRes: function(type, text, online, subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            const guid = this.getTime();

            businessSDK5.subscribeCommonStatus(text, online, type, subscribeId, guid);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (type === "text") {
                // 根据关键字订阅常用资源
                businessSDK6.subscribeCommonResourcesByKey(text, subscribeId);
            } else if (type === "online") {
                var status = "1" //下线
                if (online === true) {
                    status = "0" //上线
                }

                // 根据资源状态订阅常用资源
                businessSDK6.subscribeCommonResourcesByStatus(status, subscribeId);
            } else {
                // 订阅常用资源
                businessSDK6.subscribeCommonResources(subscribeId);
            }
        }
    },

    /**
     * 取消订阅
     * subscribeId: 订阅ID
     * type: "person", "device", "common"
     */
    cancelSubscribeResourceStatus: function(subscribeId, type) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (type == "person") {
                businessSDK5.cancelSubscribeUser(subscribeId)
            } else if (type == "personquery") {
                businessSDK5.cancelSubscribeUserQuery(subscribeId)
            } else if (type == "device") {
                businessSDK5.cancelSubscribeDevice(subscribeId)
            } else if (type == "devicequery") {
                businessSDK5.cancelSubscribeDeviceQuery(subscribeId)
            } else if (type == "common") {
                businessSDK5.cancesubscribeCommonStatus(subscribeId)
            } else if (type == "all") {
                if (subscribeId.indexOf(",") > -1) {
                    let subIds = subscribeId.split(",")
                    subIds.forEach(item => {
                        if (item.indexOf("UsersStatusBy") > -1) {
                            businessSDK5.cancelSubscribeUserQuery(item)
                        } else if (item.indexOf("UsersStatus") > -1) {
                            businessSDK5.cancelSubscribeUser(item)
                        }
                        if (item.indexOf("DevicesStatusBy") > -1) {
                            businessSDK5.cancelSubscribeDeviceQuery(item)
                        } else if (item.indexOf("DevicesStatus") > -1) {
                            businessSDK5.cancelSubscribeDevice(item)
                        }
                        if (item.indexOf("CommonResources") > -1) {
                            businessSDK5.cancesubscribeCommonStatus(item)
                        }
                    });
                }
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.cancelSubscribeResourceStatus(subscribeId);
        }
    },

    subscribeBusinessStatus: function(busType, subscribeID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeBusinessStatus(busType, subscribeID);
        }
    },

    /** 资源收藏 ************************************************************************************* */

    /**
     * 收藏/取消收藏资源
     *
     * resources: [{resId:"",resCh:"",resName:"",resType:0/1}]
     * favourite: true: 收藏，false: 取消收藏
     */
    publishResourceCollect: function(resources, favourite) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

            resources.forEach(function(item) {
                var resType = 1
                if (item.resourceType === 0) { //人员
                    resType = 1
                }
                if (item.resourceType === 1) { //设备
                    resType = 2
                }
                if (item.resourceType === 2) { //文件频道
                    resType = 3
                }
                if (favourite === true) {
                    businessSDK5.publishAddCollection(item.resId, item.resCh, item.resName, resType);
                }
                if (favourite === false) {
                    businessSDK5.publishRemoveCollection(item.resId, item.resCh);
                }
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var arr = [];
            resources.forEach(function(item) {
                var resourceType = "User"
                if (item.resType == 0) {
                    resourceType = "User"
                } else if (item.resType == 1) {
                    resourceType = "Device"
                }
                arr.push(item.resId);
                businessSDK6.publishResourceCollect(arr.join(','), resourceType, favourite);
            })
        }
    },
    convertBussState: function(state) {
        var result = 0;
        if (state == 0) {
            result = 0;
        } else if (state == 1) {
            result = 1;
        } else if (state == 2) {
            result = 2;
        } else if (state == 3) {
            result = 4;
        } else if (state == 4) {
            result = 6;
        }
        return result;
    },

    /**
     * 关键字，状态，业务订阅人员/设备状态推送
     * var resp={operate:"init/refresh/add/remove",subscribeId:"",nodes:[{resId:"",resCh:"0",resName:"",parentId:"",type:'',
     * resourceType:'具体参见enum.js',deviceType: '具体参见enum.js',status:'',buss:""}]}}
     *
     * status:0/1/2 离线，在线，故障
     *
     * 这个接口将V5.0用户和设备的推送合为一个接口，V6.0的推送建资源状态推送
     */
    setReceiveResourceStatusQueryCallback: function(subId, callback) {
        var that = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //正常加载用户
            businessSDK5.setReceivePersonNodeCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.subscribeId = obj.subId
                if (obj.operate == "init") {
                    resp.operate = "init"
                    obj.nodes.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resCh = 0
                        it.resName = item.userName
                        it.parentId = item.parentId
                        it.deviceType = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 0
                        resp.nodes.push(it)
                    })
                } else if (obj.operate == "refresh") {
                    resp.operate = "refresh"
                    obj.status.forEach(function(item) {

                        var it = {}
                        it.resId = item.userId
                        it.resCh = 0
                        it.resName = item.userName
                        it.parentId = item.parentId
                        it.deviceType = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 0
                        resp.nodes.push(it)
                    })
                }

                callback(resp)

            });
            //检索加载用户
            businessSDK5.setReceiveQueryPersonNodeCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.subscribeId = obj.subId
                if (obj.add && obj.add.length > 0) {
                    resp.operate = "add"
                    obj.add.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resCh = 0
                        it.resName = item.userName
                        it.parentId = item.parentId
                        it.deviceType = item.type
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)
                        it.resourceType = 0

                        resp.nodes.push(it)
                    })
                }
                if (obj.remove && obj.remove.length > 0) {
                    resp.operate = "remove"
                    obj.remove.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resCh = 0
                        it.resName = item.userName
                        it.parentId = item.parentId
                        it.deviceType = item.type
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)
                        it.resourceType = 0

                        resp.nodes.push(it)
                    })
                }
                if (obj.status && obj.status.length > 0) {
                    resp.operate = "refresh"
                    obj.status.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resCh = 0
                        it.resName = item.userName
                        it.parentId = item.parentId
                        it.deviceType = item.type
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)
                        it.resourceType = 0

                        resp.nodes.push(it)

                    })
                }
                callback(resp)

            });
            //正常加载设备
            businessSDK5.setReceiveDeviceNodeCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.subscribeId = obj.subId
                if (obj.operate == "init") {
                    resp.operate = "init"
                    obj.nodes.forEach(function(item) {
                        var it = {}
                        it.resId = item.deviceId
                        it.resCh = item.deviceCh
                        it.resName = item.deviceName
                        it.parentId = item.parentId
                        it.type = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 1
                        if (item.smallType === 170) {
                            it.resourceType = 4
                        } else if (item.smallType === 209) {
                            it.resourceType = 5
                        }
                        resp.nodes.push(it)
                    })
                } else if (obj.operate == "refresh") {
                    resp.operate = "refresh"
                    obj.status.forEach(function(item) {
                        var it = {}
                        it.resId = item.deviceId
                        it.resCh = item.deviceCh
                        it.resName = item.deviceName
                        it.parentId = item.parentId
                        it.type = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 1
                        resp.nodes.push(it)
                    })
                }

                callback(resp)

            });
            //检索加载设备
            businessSDK5.setReceiveQueryDeviceNodeCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.subscribeId = obj.subId
                if (obj.add && obj.add.length > 0) {
                    resp.operate = "add"
                    obj.add.forEach(function(item) {
                        var it = {}
                        it.resId = item.deviceId
                        it.resCh = item.deviceCh
                        it.resName = item.deviceName
                        it.parentId = item.parentId
                        it.type = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 1
                        resp.nodes.push(it)
                    })
                }

                if (obj.remove && obj.remove.length > 0) {
                    resp.operate = "remove"
                    obj.remove.forEach(function(item) {
                        var it = {}
                        it.resId = item.deviceId
                        it.resCh = item.deviceCh
                        it.resName = item.deviceName
                        it.parentId = item.parentId
                        it.type = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 1
                        resp.nodes.push(it)
                    })
                }

                if (obj.status && obj.status.length > 0) {
                    resp.operate = "refresh"
                    obj.status.forEach(function(item) {
                        var it = {}
                        it.resId = item.deviceId
                        it.resCh = item.deviceCh
                        it.resName = item.deviceName
                        it.parentId = item.parentId
                        it.type = item.type
                        it.buss = that.convertBussState(item.buss)
                        it.status = item.status
                        it.resourceType = 1
                        resp.nodes.push(it)

                    })
                }
                callback(resp)
            });


            businessSDK5.setReceiveCommonStatusCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.subscribeId = obj.subId
                if (obj.nodes && obj.nodes.length > 0) {
                    resp.operate = "init"
                    obj.nodes.forEach(function(item) {
                        var it = {}
                        it.resId = item.resId
                        it.resCh = item.resch
                        it.resName = item.resourceName
                        if (item.resType == 1) {
                            it.resourceType = 0
                            it.deviceType = item.type
                        } else if (item.resType == 2) {
                            it.resourceType = 1
                        } else if (item.resType == 3) {
                            it.resourceType = 2
                        }
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)

                        resp.nodes.push(it)
                    })
                }

                if (obj.status && obj.status.length > 0) {

                    resp.operate = "refresh"
                    obj.status.forEach(function(item) {
                        var it = {}
                        it.resId = item.resId
                        it.resCh = item.resch
                        it.resName = item.resourceName
                        if (item.resType == 1) {
                            it.resourceType = 0
                            it.deviceType = item.type
                        } else if (item.resType == 2) {
                            it.resourceType = 1
                        } else if (item.resType == 3) {
                            it.resourceType = 2
                        }
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)

                        resp.nodes.push(it)
                    })
                }
                if (obj.add && obj.add.length > 0) {
                    resp.operate = "add"
                    obj.add.forEach(function(item) {
                        var it = {}
                        it.resId = item.resId
                        it.resCh = item.resch
                        it.resName = item.resourceName
                        if (item.resType == 1) {
                            it.resourceType = 0
                            it.deviceType = item.type
                        } else if (item.resType == 2) {
                            it.resourceType = 1
                        } else if (item.resType == 3) {
                            it.resourceType = 2
                        }
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)

                        resp.nodes.push(it)
                    })
                }
                if (obj.remove && obj.remove.length > 0) {
                    resp.operate = "remove"
                    obj.remove.forEach(function(item) {
                        var it = {}
                        it.resId = item.resId
                        it.resCh = item.resch
                        it.resName = item.resourceName
                        if (item.resType == 1) {
                            it.resourceType = 0
                            it.deviceType = item.type
                        } else if (item.resType == 2) {
                            it.resourceType = 1
                        } else if (item.resType == 3) {
                            it.resourceType = 2
                        }
                        it.status = item.status
                        it.buss = that.convertBussState(item.buss)

                        resp.nodes.push(it)
                    })
                }

                callback(resp)

            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

            businessSDK6.setReceiveInformAddResourceStatusCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.operate = "init"
                resp.subscribeId = obj.subscribeID
                obj.resources && obj.resources.forEach(function(item) {
                    var it = {}
                    it.resId = item.resourceID
                    it.resName = item.resourceName
                    it.parentId = item.parentId
                    it.deviceType = item.deviceType
                    it.type = -1
                    if (item.resourceType == "User") {
                        it.resourceType = 0
                    }
                    if (item.resourceType == "Device") {
                        if(item.deviceType=='GBNVREncoder'){
                            it.resourceType = 7
                        }else{
                            it.resourceType = 1
                        }
                    }
                    
                    if (item.deviceType == "HWMeetingTerminal") {
                        it.deviceType = 13
                    }
                    if (item.isOnline) {
                        it.status = 1 //在线
                    }
                    if (item.isOnline == false) {
                        it.status = 0 //离线
                    }
                    it.buss = item.busStatus //todo enum need define.
                    //1118 云调度 修改
                    it.channels = item.channels && item.channels.sort((a, b) => {
                        if(parseInt(a.channelIndex) < parseInt(b.channelIndex)) {
                            return -1;
                        } else if (parseInt(a.channelIndex) > parseInt(b.channelIndex)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    resp.nodes.push(it)
                })
                // 根据resName排序  //1118 云调度 修改
                resp.nodes.sort((a, b) => {
                    /*
                    if(a.resName < b.resName) {
                        return -1;
                    } else if (a.resName > b.resName) {
                        return 1;
                    } else {
                        return 0;
                    }*/
                    return a.resName.localeCompare(b.resName);
                })
                callback(resp)
            });

            businessSDK6.setReceiveInformRemoveResourceStatusCallback(function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.operate = "remove"
                resp.subscribeId = obj.subscribeID
                obj.resourceIDs.forEach(function(item) {
                    var it = {}
                    it.resId = item
                    it.resName = ""
                    it.parentId = ""
                    it.type = -1
                    it.resourceType = "User"
                    it.status = 1
                    it.buss = 0
                    resp.nodes.push(it)
                })
                callback(resp)
            })

            businessSDK6.setReceiveInformRefreshResourceStatusCallback(subId, function(obj) {
                var resp = { operate: '', subscribeId: '', nodes: [] }
                resp.operate = "refresh"
                resp.subscribeId = obj.subscribeID
                obj.resources && obj.resources.forEach(function(item) {
                    var it = {}
                    it.resId = item.resourceID
                    it.resName = item.resourceName
                    it.parentId = item.parentId
                    it.deviceType = item.deviceType  //1107 云调度
                    it.type = -1
                    if (item.resourceType == "User") {
                        it.resourceType = 0
                    }
                    if (item.resourceType == "Device") {
                        // it.resourceType = 1
                        if(item.deviceType=='GBNVREncoder'){
                            it.resourceType = 7
                        }else{
                            it.resourceType = 1
                        }
                    }
                    if (item.isOnline) {
                        it.status = 1 //在线
                    }
                    if (item.isOnline == false) {
                        it.status = 0 //离线
                    }
                    it.buss = item.busStatus
                    it.channels = item.channels //1107 云调度
                    resp.nodes.push(it)
                })
                callback(resp)
            })

        }
    },

    /**文件频道**************************************************************************************/
    /**
     * type:text:关键字,online:上下线
     * query:查询关键字
     * online:true/false
     * subscribeId:订阅id
     * */
    subscribeFileStatus: function(type, query, online, subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var guid = this.getTime();
            businessSDK5.subscribeFileStatus(query, online, type, subscribeId, guid);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return
        }
    },
    /**
     * subscibeId:订阅Id
     * */
    cancelSubscribeFileStatus: function(subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeFileStatus(subscribeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 其中：isPlay:是否播放中
     * var resp ={operate:init/add/status/remove,
     * nodes:[{resId:'',resCh:'',resName:'',isOnline:true/false,isPlay:true/false}]
       }
     *
     * */

    setInformFileStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveFileListStatusCallback(function(obj) {
                var resp = { operate: '', nodes: [] }
                if (obj) {

                    if (obj.add && obj.add.length > 0) {
                        resp.operate = "add"
                        obj.add.forEach(function(item) {
                            var it = {}
                            it.resId = item.resId
                            it.resCh = item.resCH
                            it.resName = item.resName
                            it.isOnline = item.isOnline
                            it.isPlay = item.isPlay
                            resp.nodes.push(it)
                        })
                    }

                    if (obj.remove && obj.remove.length > 0) {
                        resp.operate = "remove"
                        obj.remove.forEach(function(item) {
                            var it = {}
                            it.resId = item.resId
                            it.resCh = item.resCH
                            it.resName = item.resName
                            it.isOnline = item.isOnline
                            it.isPlay = item.isPlay
                            resp.nodes.push(it)
                        })

                    };

                    if (obj.status) {
                        resp.operate = "status"

                        var it = {}
                        it.resId = obj.status.resId
                        it.resCh = obj.status.resCH
                        it.resName = obj.status.resName
                        it.isOnline = obj.status.isOnline
                        it.isPlay = obj.status.isPlay


                        resp.nodes.push(it)
                    };
                    callback(resp)
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryFileChannels(this.userID, 0, 1024, function(res) {
                // { responseCode:1, data: [{channelID: "", channelName: "", isSharing: false, creatorID: "", createDate: ""}, {...}] }
                var resp = { operate: '', nodes: [] }
                if (res && res.responseCode == 1) {
                    resp.operate = "add"
                    res.data && res.data.forEach(function(item) {
                        var it = {}
                        it.resId = item.channelID
                        it.resCh = 0
                        it.resName = item.channelName
                        it.isOnline = true
                        it.isPlay = false
                        resp.nodes.push(it)
                    })
                }
                callback(resp)
            })
        }
    },

    /**
     * 获取文件频道
     * 
     * var resp =[{channelId:"",channelName:"",isShare:true/false}]
     * */
    getFileChannels: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryFileChannels(this.userID, 0, 1024, function(res) {
                let resp = []
                if (res.responseCode == 1) {
                    resp = res.data
                }
                callback(resp)
            })
        }
    },
    /**
     * 设置文件频道共享
     * channelId:频道id
     * isShare:是否共享
     *
     * var resp ={Ret:0/1}
     * */
    setFileChannelShare: function(channelId, isShare, callback) {

    },

    /**
     * 通过频道id获取文件
     * 
     * channelId:频道id
     * var resp =[{fileId:"",fileName:"",fileUrl:"",fileSize:""}....]
     * */
    getFilesByChannelId: function(channelId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleFileChannel(channelId, function(res) {
                let resp = []
                if (res.responseCode == 1) {
                    resp = res.data.list && res.data.list.map((item, index) => {
                        return {
                            order: index,
                            fileId: item.mediaID,
                            channelId: item.itemID,
                            fileName: item.fileName,
                            fileUrl: '',
                            fileSize: item.fileSize,
                            status:1
                        }
                    })
                }
                callback(resp)
            })
        }
    },
    
    /**
     * 新增文件频道
     * 
     * channelID :频道ID
     * channelName ：频道名称
     * isSharing ：是否共享
     *  
     * resp.Ret = 0
     */
    addFileChannel: function(channelID, channelName, isSharing, callback) {
        let createDate = new Date().formatDate('yyyy-MM-dd HH:ss:mm');
        let creatorID = this.userID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.addFileChannel(channelID, channelName, isSharing, creatorID, createDate, function(res) {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },

    /**
     * 编辑文件频道
     * 
     * channelID :频道ID
     * channelName ：频道名称
     * isSharing ：是否共享
     * 
     * resp.Ret = 0 
     */
    editFileChannel: function(channelID, channelName, isSharing, callback) {
        let createDate = new Date().formatDate('yyyy-MM-dd HH:ss:mm');
        let creatorID = this.userID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.editFileChannel(channelID, channelName, isSharing, creatorID, createDate, function(res) {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },

    /**
     * 
     * channelID :频道ID
     * 
     * resp.Ret = 0
     */
    removeChannel: function(channelID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeChannel(channelID, function(res) {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },

    /**
     * 
     * channelID :频道ID
     * list :[{{itemID: "", fileName: "", fileSize: "", mediaID: ""}, {...}]
     * resp.Ret = 0
     */
    uploadToFileChannel: function(channelID, list, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.uploadToFileChannel(channelID, list, function(res) {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },

    /**
     * 
     * itemID :条目ID
     * resp.Ret = 0
     */
    removeToFileChannel: function(itemID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
           
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeToFileChannel(itemID, function(res) {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },
    
     //获取文件状态  1107 云调度
     getFileStatus(id,callback){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getFileStatus(id, function(res) {
                let resp = {}
                if (res.message == 'ok') {
                    resp.Ret = 0
                    resp.data=res.relaFileItems[0]
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            })
        }
    },

     

    // ------------------------------------视频点播 -----------------------------------------------------
    /**
     *发布初始化媒体状态（用户习惯)
     * 查看一下playsdk是否有提供clientPassword的接口
     * todo 查看整个实现源代码，根本就没有使用过clientPassword这个字段
     * */
    publishInitMediaByCustom: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishInitMediaByCustom()
        }
    },

    /**
     * 发布媒体初始化反馈
     * 这部分主要是放在注册过程中
     * var resp={SIPID:'',serverID:'',serverIP:'',serverPort:'',clientPassword:''}
     * */
    setInformInitMediaCallback: function(callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformInitMediaCallback(function(obj) {
                var resp = { SIPID: '', serverID: '', serverIP: '', serverPort: '', clientPassword: '' }
                resp.SIPID = obj.SIPID
                resp.serverID = obj.serverID
                resp.serverIP = obj.serverIP
                resp.serverPort = obj.serverPort
                resp.clientPassword = obj.clientPassword
                callback(resp)
            });
        }
    },

    /**
     * 视频点播 - 发起点播,根据资源
     * mediaType:0:音视频,1:视频,2:音频
     */
    startPlayUser: function(pos, resourceId, mediaType, resourceName, transportType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartPlay(resourceId, 0, mediaType, pos, 1);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (pos == -1)
                businessSDK6.publishStartPlayUser(resourceId, resourceName, transportType);
            else
                businessSDK6.publishStartPlayUserByIndex(resourceId, resourceName, pos, transportType);
        }
    },

    /**
     * 视频点播 -停止点播,根据位置
     * index:屏的位置
     * 根据位置点播，不需要区分人员还是设备
     * */
    stopPlayByIndex: function(index) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopPlayByIndex(index);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopBusiness(index);
        }
    },

    /**
     * 视频点播 - 停止点播，根据资源
     */
    stopPlayUser: function(resourceId, mediaType, resourceName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopPlayId(resourceId, 0, mediaType);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopPlayUser(resourceId, resourceName);
        }
    },

    /**
     *  点播设备
     *  mediaType:0:无,1:音频,2:视频,3.音视频
     *  resourceType:具体参见enum.js
     */
    startPlayDevice: function(pos, resourceId, resourceCh, resourceType, mediaType, resourceName, transportType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var type = resourceType == 2 ? 2 : 0;
            businessSDK5.publishStartPlay(resourceId, resourceCh, mediaType, pos, type); //todo
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (pos == -1){
                if( resourceType == 1 ){
                    businessSDK6.publishStartPlayDevice(resourceId, resourceName, transportType);
                }else if( resourceType == 2 ){  // 文件频道
                    businessSDK6.publishStartPlayFileChannel('', resourceId);
                }
            }else{
                if( resourceType == 1 ){
                    businessSDK6.publishStartPlayDeviceByIndex(resourceId, resourceName, pos, transportType);
                }else if( resourceType == 2 ){  // 文件频道
                    businessSDK6.publishStartPlayFileChannel(pos, resourceId);
                }
            } 
        }
    },

    /**
     *  停止点播设备
     *  mediaType:0:无,1:音频,2:视频,3.音视频
     */
    stopPlayDevice: function(resourceId, resourceCh, mediaType, resourceName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopPlayId(resourceId, resourceCh, mediaType);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopPlayDevice(resourceId, resourceName);
        }

    },

    /** 1107 云调度
     *  停止点播设备
     */
    startPlayNVRDevice: function(receiverID, channels, transportType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartPlayNVRDevice(receiverID, channels, transportType);
        }
    },

    /** 1107 云调度
     *  开启nvr点播设备
     */
    stopPlayNVRDevice: function(receiverID, channels) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopPlayNVRDevice(receiverID, channels);
        }
    },
    //1119云调度拖动点播
    startPlayNVRDeviceByIndex: function(receiverID, channels, transportType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartPlayNVRDeviceByIndex(receiverID, channels, transportType);
        }
    },
    /**
     * 视频点播 - 停止所有点播
     * */
    stopAll: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.stopAll();
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopAllBusiness();
        }
    },

    //强制I帧
    sendForceIFrame: function(resId, resCh, resType,channelIndex) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.sendForceIFrame(resId, resCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let resType_ = "";
            if (resType == 0) {
                resType_ = "User"
            } else if (resType == 1) {
                resType_ = "Device"
            }
            businessSDK6.publishCaptureIFrame(resId, resType_, channelIndex)
         }
    },

    /**
     * 设置I帧间隔
     * deviceId:设备Id
     *  interval:I帧间隔
     */
    setIFrameInterval: function(deviceId, interval) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSetIFrameInterval(this.userToken, deviceId, interval);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 设置图像参数
     * deviceId:设备Id
     * framerate:帧率
     * bitrate:码率
     * resolutionrate:分辨率
     */
    setImageSession: function(deviceId, framerate, bitrate, resolutionrate) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSetImageSession(this.userToken, deviceId, framerate, bitrate, resolutionrate);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 强制I帧（新）
     * deviceId:设备Id
     */
    setIFrame: function(deviceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSetIFrame(this.userToken, deviceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 批量点播
     * resInfos = [{resId:"", resCh:"", resName:"",resType:""}]
     */
    publishStartPlayRes: function(resInfos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            resInfos && resInfos.forEach(item => {
                businessSDK5.publishStartPlay(item.resId, item.resCh || 0, 3, -1, item.resType);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let resInfos_ = [];
            resInfos && resInfos.forEach(item => {
                let it = {
                    resID: item.resId,
                    resCh: item.resCh || 0,
                    resName: item.resName
                }
                if (item.resType == 0) {
                    it.resType = "User"
                } else if (item.resType == 1) {
                    it.resType = "Device"
                }
                resInfos_.push(it)
            })
            businessSDK6.publishStartPlayRes(JSON.stringify(resInfos_))
        }
    },

    /**
     * 批量呼叫
     * resInfos = [{resId:"", resCh:"", resName:""}]
     */
    publishStartCalls: function(senderName, resInfos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            resInfos && resInfos.forEach(item => {
                businessSDK5.publishStartCall(this.userToken, item.resId);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let resInfos_ = [];
            resInfos && resInfos.forEach(item => {
                let it = {
                    resID: item.resId,
                    resCh: item.resCh || 0,
                    resName: item.resName
                }
                resInfos_.push(it)
            })
            businessSDK6.publishStartCalls(senderName, JSON.stringify(resInfos_))
        }
    },

    /**
     * 业务等待中取消业务
     * @param {*} resourceID
     * @param {*} resourceType
     * @param {*} busType : Play,Call,Speak
     */
    cancelBusiness: function(resourceID, resourceType, busType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.cancelBusiness(resourceID, resourceType, busType);
        }
    },

    /**
     * 视频点播 -媒体输出回调
     *  var resp={screenIndex:'',resId:'',resCh:'',sessionId:'',videoRTPId:'',audioRTPId:'',resType:'1/2',fIPS:"",fCH:'',localVPort:''}
     *  resType:0:人员,1:设备,2.文件频道，3.录像
     * */
    setInformStartMediaByLocalCallback: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMediaStatusByLocalCallback(function(obj) {
                if (obj) {
                    if (obj.operate == "startPlay" && obj.startDBParam) {
                        resp.screenIndex = obj.startDBParam.screenIndex
                        resp.resId = obj.startDBParam.resId
                        resp.resCh = obj.startDBParam.resCH
                        resp.fIPS = obj.startDBParam.fIPS
                        resp.fCH = obj.startDBParam.fCH
                        resp.localVPort = obj.startDBParam.localVPort
                            //resType:点播资源类型，1-人员 2-设备 3-文件频道 4-录像
                        if (obj.startDBParam.resType === "1") {
                            resp.resType = "0"
                        } else if (obj.startDBParam.resType === "2") {
                            resp.resType = "1"
                        } else if (obj.startDBParam.resType === "3") {
                            resp.resType = "2"
                        } else if (obj.startDBParam.resType === "4") {
                            resp.resType = "3"
                        }

                        //resp.resType = obj.startDBParam.resType
                        resp.sessionId = obj.startDBParam.sessionId
                        resp.controlVolumeParam = obj.startDBParam.controlVolumeParam
                            //resp.operate = "start"

                        resp.videoRTPId = ""
                        resp.audioRTPId = ""
                        callback(resp)
                    }

                    // else if (obj.operate == "stopPlay" && obj.stopDBParam){
                    //   resp.screenIndex = obj.stopDBParam.screenIndex
                    //   resp.operate = "stop"
                    //   callback(resp)
                    // }else if (obj.operate == "splitScreen" && obj.splitScreenParam){
                    //   resp.splitType = obj.splitScreenParam.splitType
                    //   resp.operate = "split"
                    //   callback(resp)
                    // }else if (obj.operate == "OSD" && obj.osdParam){
                    //   resp.osdParam = obj.osdParam
                    //   resp.operate = "osd"
                    //   callback(resp)
                    // }

                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformStartMediaByLocalCallback(function(obj) {
                resp.screenIndex = obj.screenIndex
                resp.resId = obj.resourceID
                resp.resCh = -1
                resp.videoRTPId = obj.video
                resp.audioRTPId = obj.audio
                resp.fIPS = ""
                resp.fCH = ""
                resp.localVPort = ""
                if (obj.resourceType == "User") {
                    resp.resType = 0
                } else if (obj.resourceType == "Device") {
                    resp.resType = 1
                }
                resp.encoderSipID = obj.encoderSipID
                resp.mediaGroupID = obj.mediaGroupID
                resp.channel = obj.channel
                resp.mediaType = obj.mediaType
                //obj.operate = "start"
                callback(resp)
            });
        }
    },
    /**
     * 视频点播 - 停止媒体输出
     * var resp ={screenIndex:''}
     * */
    setInformStopMediaByLocalCallback: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMediaStatusByLocalCBForStopPlay(function(obj) {
                if (obj) {
                    if (obj.operate == "stopPlay" && obj.stopDBParam) {
                        resp.screenIndex = obj.stopDBParam.screenIndex;
                        callback(resp);
                    }
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformStopMediaByLocalCallback(function(obj) {
                if (obj.screenIndex) {
                    resp.screenIndex = obj.screenIndex
                }
                if (obj.data) {
                    let data = JSON.parse(obj.data);
                    resp.screenIndex = data.length && data.map(item => item.screenIndex);
                }
                callback(resp)
            });
        }
    },

    /*
     * 声音控制
     */
    setVolumeByLocalCallback: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setVolumeByLocalCallback(function(obj) {
                if (obj) {
                    if (obj.operate == "controlVolume" && obj.controlVolumeParam) {
                        resp.screenIndex = obj.controlVolumeParam.screenIndex
                        resp.state = obj.controlVolumeParam.status == 1 ? true : false
                        resp.volume = obj.controlVolumeParam.value
                        callback(resp)
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setVolumeByLocalCallback(function(obj) {
                resp.screenIndex = obj.screenIndex
                resp.state = obj.state == 1 ? true : false
                resp.volume = obj.volume
                callback(resp)
            });
        }
    },

    /**
     * 点播一键上大屏
     *
     * screenId:大屏id
     * modeCode:模式代码
     * modePos:模式显示位置
     * */
    publishOneKeyToScreen: function(screenId, modeCode, modePos) {

    },

    /**
     * 放映厅获取对应的resId,resCh
     * hallid:放映厅Id
     *
     * var resp={resID,resCh}
     * */
    getVideoHallResource: function(hallid, callback) {
        /**
         * 1.getVersion
         * 1.1. if 5.0
         * 1.2. if 6.0
         * */
    },
    /**
     * 设置的文件频道或者录像与放映厅绑定
     * hallid:放映厅id
     * resId:虚拟资源ID
     * resCh:虚拟资源Ch
     * */
    setVideoHallResource: function(hallid, resId, resCh, callback) {
        /**
         * 1.getVersion
         * 1.1. if 5.0
         * 1.2. if 6.0
         * */
    },
    /**
     * 获取放映厅可播放的录像/文件频道
     *
     * hallid:放映厅id
     *
     * var resp =[{resId:"",resName:"",resType:具体参见enum.js}
     * */
    queryVideoHallResources: function(hallid, callback) {

    },
    //*****************************************************分组点播设置*********************************
    /**
     * 添加分组点播，schemeId区别分组点播和轮循点播
     * groupName:分组名称
     * description:描述
     * schemeId:显示方案id
     * fixResources:固定屏资源，fixResources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType，position:0}
     * loopResources:轮循资源，loopResources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType}
     *
     * isMatrixLoop:true 带矩阵轮循方案的分组,false 其他方案的监看分组
     * var resp ={Ret:0/1}
     * */
    addDBGroup: function(groupName, description, schemeId, fixResources, loopResources, isMatrixLoop, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            ///BusinessGroup/addDBImageGroup
            /**
             * schemeId为空 则只为分组点播 不为空则为轮循点播,同一个资源不允许既是固定资源又是轮循资源
             */
            var fix = []
            var self = this
            fixResources.forEach(function(item) {
                var it = {};
                it.resourceId = item.resourceId;
                it.resourceCh = item.resourceCh;
                it.resourceName = item.resourceName;
                if (item.resourceType == 0) {
                    it.resourceType = 1;
                } else if (item.resourceType == 1) {
                    it.resourceType = 2
                }
                it.position = item.position - 1
                fix.push(it);
            });
            var loop = []
            loopResources.forEach(function(item) {
                var it = {};
                it.resourceId = item.resourceId;
                it.resourceCh = item.resourceCh;
                it.resourceName = item.resourceName;
                if (item.resourceType == 0) {
                    it.resourceType = 1;
                } else if (item.resourceType == 1) {
                    it.resourceType = 2
                }
                loop.push(it);
            });
            if (isMatrixLoop) {
                //]/BusinessGroup/addMatrixLoopGroup
                dataSDK5.addMatrixLoopGroup(this.userToken, groupName, schemeId, description, JSON.stringify(fix), JSON.stringify(loop), function(obj) {
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                });
            } else {
                dataSDK5.addDBImageGroup(self.userToken, groupName, schemeId, description, JSON.stringify(fix), JSON.stringify(loop), function(obj) {
                    // {"ret":0,"msg":"Success","data":{groupId:""}}
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                });
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = "";
            var playResources = [];
            var playFixResources = [];
            loopResources && loopResources.forEach(function(item, index) {
                var it = {};
                it.index = index;
                it.resourceID = item.resourceId;
                if (item.resourceType == 0) {
                    it.resourceType = "User";
                } else {
                    it.resourceType = "Device";
                }
                playResources.push(it);
            });

            fixResources && fixResources.forEach(function(item, index) {
                var it = {};
                it.index = item.position - 1;
                it.resourceID = item.resourceId;
                if (item.resourceType == 0) {
                    it.resourceType = "User";
                } else {
                    it.resourceType = "Device";
                }
                playFixResources.push(it);
            });

            if (schemeId == null || schemeId == "") {
                isDefaultScheme = true;
            } else {
                isDefaultScheme = false;
            }
            dataSDK6.addPlayGroup(groupName, description, schemeId, isDefaultScheme, isMatrixLoop, JSON.stringify(playResources), JSON.stringify(playFixResources), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },
    /**
     * 删除分组点播
     * groupId:分组id
     * isMatrixLoop:true 带矩阵轮循方案的分组,false 其他方案的监看分组
     *
     * var resp ={Ret:0/1}
     * */
    deleteDBGroup: function(groupId, isMatrixLoop, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (isMatrixLoop) {
                ///BusinessGroup/deleteMatrixLoopGroup
                dataSDK5.deleteMatrixLoopGroup(this.userToken, groupId, function(obj) {
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                });
            } else {
                dataSDK5.deleteDBImageGroup(this.userToken, groupId, function(obj) {
                    // {"ret":0,"msg":"Success","data":null}
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                });
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var groupIds = []
            groupIds.push(groupId)
            dataSDK6.removeAnyBusinessGroups(groupIds, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });

        }
    },
    /**
     * 通过组id获取点播分组的详细信息
     * groupId:分组id
     * isMatrixLoop:true 带矩阵轮循方案的分组,false 其他方案的监看分组 V5
     * isDecoder true 代表解码（轮循） false 代表编码（本地）V6
     *
     * var resp ={groupId:"",groupName:"",schemeId:'',schemeName:'',groupType:"具体参考枚举",description:"",isDecoder:true/false,fixResources:[{resourceId,resourceCh,resourceName,resourceType,pos}..],loopRersources:[{resourceId,resourceCh,resourceName,resourceType}..]}
     * */
    getDBGroupInfoById: function(groupId, isMatrixLoop, callback) {
        var self = this
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //BusinessGroup/queryDBImageGroupInfo
            var self = this;
            if (isMatrixLoop) {
                ///BusinessGroup/queryMatrixLoopGroupInfo
                dataSDK5.queryMatrixLoopGroupInfo(this.userToken, groupId, function(obj) {
                    // {"ret":0,"msg":"Success","data":{groupId:"",groupName:"",schemeId="",description="",fixdResources=[{resourceId:"",resourceCh:0,position:0}]，loopResources=[{resourceId:"",resourceCh:0}]}
                    var resp = { groupId: "", groupName: "", groupType: "", description: "", fixResources: [], loopRersources: [] };
                    if (obj && obj.data) {
                        resp.groupId = obj.data.groupId;
                        resp.groupName = obj.data.groupName;
                        resp.groupType = 5;
                        resp.schemeId = obj.data.schemeId;
                        resp.schemeName = obj.data.schemeName;
                        resp.description = obj.data.description;
                        var fix = []
                        obj.data.fixdResourceObjs && obj.data.fixdResourceObjs.length && obj.data.fixdResourceObjs.forEach(function(item) {
                            var it = {};
                            it.resourceId = item.resourceId;
                            it.resourceCh = item.resourceCh;
                            it.resourceName = item.resourceName;
                            // it.resourceType = item.resourceType === 1 ? 0 : 1;
                            if (item.resourceType === 1) {
                                it.resourceType = 0
                            } else if (item.resourceType === 2) {
                                it.resourceType = 1
                            }
                            it.pos = item.position + 1;
                            fix.push(it);
                        });
                        var loop = []
                        obj.data.loopResourceObjs && obj.data.loopResourceObjs.length && obj.data.loopResourceObjs.forEach(function(item) {
                            var it = {};
                            it.resourceId = item.resourceId;
                            it.resourceCh = item.resourceCh;
                            it.resourceName = item.resourceName;
                            // it.resourceType = item.resourceType === 1 ? 0 : 1;
                            if (item.resourceType === 1) {
                                it.resourceType = 0
                            } else if (item.resourceType === 2) {
                                it.resourceType = 1
                            }
                            loop.push(it)
                        })

                        resp.fixResources = fix;
                        resp.loopRersources = loop;
                        resp.isDecoder = true;
                    }
                    callback(resp);
                });
            } else {
                dataSDK5.queryDBImageGroupInfo(this.userToken, groupId, function(obj) {
                    var resp = { groupId: "", groupName: "", groupType: "", description: "", fixResources: [], loopRersources: [] }
                    if (obj.ret == 0) {
                        resp.groupId = obj.data[0].groupId;
                        resp.groupName = obj.data[0].groupName
                        resp.schemeId = obj.data[0].schemeId;
                        resp.schemeName = obj.data[0].schemeName;
                        resp.isDecoder = false;
                        if (obj.data[0].schemeId) {
                            resp.groupType = 4
                        } else {
                            resp.groupType = 4
                        }

                        resp.description = obj.data[0].description
                        obj.data[0].fixdResourceObjs && obj.data[0].fixdResourceObjs.forEach(function(item) {
                            var it = {}
                            it.resourceId = item.resourceId;
                            it.resourceCh = item.resourceCh;
                            if (item.resourceType === 1) {
                                it.resourceType = 0
                            } else if (item.resourceType === 2) {
                                it.resourceType = 1
                            }
                            it.resourceName = item.resourceName;
                            it.pos = item.position + 1;
                            resp.fixResources.push(it);
                        });

                        obj.data[0].loopResourceObjs && obj.data[0].loopResourceObjs.forEach(function(item) {
                            var it = {}
                            it.resourceId = item.resourceId;
                            it.resourceCh = item.resourceCh;
                            if (item.resourceType === 1) {
                                it.resourceType = 0
                            } else if (item.resourceType === 2) {
                                it.resourceType = 1
                            }
                            it.resourceName = item.resourceName;
                            resp.loopRersources.push(it);
                        })
                        callback(resp)
                    } else {
                        callback({})
                    }
                });
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySinglePlayGroup(groupId, function(obj) {
                var resp = { groupId: "", groupName: "", groupType: "", description: "", schemeId: "", fixResources: [], loopRersources: [] };
                if (obj && obj.data) {
                    resp.groupId = obj.data.groupID;
                    resp.groupName = obj.data.groupName;
                    resp.schemeId = obj.data.schemeID || "";
                    resp.schemeName = obj.data.schemeName || "默认方案";
                    resp.groupType = obj.data.isDecoder ? 5 : 4;
                    resp.description = obj.data.description;
                    resp.isDecoder = obj.data.isDecoder;
                    var loopRersources = [];
                    obj.data.playResources && obj.data.playResources.forEach(function(item) {
                        var it = {}
                        it.resourceId = item.resourceID;
                        if (item.resourceType == "User") {
                            it.resourceType = 0
                        } else if (item.resourceType == "Device") {
                            it.resourceType = 1
                        }
                        if (item.deviceType == "HWMeetingTerminal") {
                            it.deviceType = 13
                        }
                        it.resourceName = item.resourceName;
                        it.resourceCh = 0;
                        //it.index = item.index;
                        loopRersources.push(it);
                    })
                    resp.loopRersources = loopRersources;

                    var fixResources = []
                    obj.data.playFixResources && obj.data.playFixResources.forEach(function(item) {
                        var it = {}
                        it.resourceId = item.resourceID;
                        if (item.resourceType == "User") {
                            it.resourceType = 0
                        } else if (item.resourceType == "Device") {
                            it.resourceType = 1
                        }
                        if (item.deviceType == "HWMeetingTerminal") {
                            it.deviceType = 13
                        }
                        it.resourceName = item.resourceName;
                        it.pos = (item.index || 0) + 1;
                        it.resourceCh = 0;
                        fixResources.push(it);
                    });
                    resp.fixResources = fixResources;
                }
                callback(resp);
            });
        }
    },
    /**
     * 保存点播分组
     * groupId:组id
     * schemeId:方案id
     * description:描述
     * fixResources:固定屏资源，fixResources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType，position:0}
     * loopResources:轮循资源，loopResources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType}
     * isMatrixLoop:true 带矩阵轮循方案的分组,false 其他方案的监看分组
     *
     * var resp ={Ret:0/1}
     * */
    saveDBGroup: function(groupId, groupName, schemeId, description, fixResources, loopResources, isMatrixLoop, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            ///BusinessGroup/updateDBImageGroup
            var fix = []
            fixResources.forEach(function(item) {
                var it = {};
                it.resourceId = item.resourceId;
                it.resourceCh = item.resourceCh;
                it.position = item.position - 1
                fix.push(it);
            });
            var loop = []
            loopResources.forEach(function(item) {
                var it = {};
                it.resourceId = item.resourceId;
                it.resourceCh = item.resourceCh;
                loop.push(it);
            });
            if (isMatrixLoop) {
                ///BusinessGroup/updateMatrixLoopGroup
                dataSDK5.updateMatrixLoopGroup(this.userToken, groupId, groupName, schemeId, description, JSON.stringify(fix), JSON.stringify(loop), function(obj) {
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                });
            } else {
                dataSDK5.updateDBImageGroup(this.userToken, groupId, groupName, schemeId, description, JSON.stringify(fix), JSON.stringify(loop), function(obj) {
                    // {"ret":0,"msg":"Success","data":null}
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp);
                })
            }

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = "";
            var playResources = [];
            var playFixResources = [];
            loopResources && loopResources.forEach(function(item) {
                var it = {};
                it.index = 0;
                it.resourceID = item.resourceId;
                if (item.resourceType == 0) {
                    it.resourceType = "User";
                } else {
                    it.resourceType = "Device";
                }
                playResources.push(it);
            });

            fixResources && fixResources.forEach(function(item) {
                var it = {};
                it.index = item.position - 1;
                it.resourceID = item.resourceId;
                if (item.resourceType == 0) {
                    it.resourceType = "User";
                } else {
                    it.resourceType = "Device";
                }
                playFixResources.push(it);
            });

            if (schemeId == null || schemeId == "") {
                isDefaultScheme = true
            } else {
                isDefaultScheme = false
            }
            dataSDK6.editPlayGroup(groupId, groupName, description, schemeId,
                isDefaultScheme,
                isMatrixLoop,
                JSON.stringify(playResources),
                JSON.stringify(playFixResources),
                function(obj) {
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                });


        }
    },
    /**
     * 轮循点播切换方案
     * groupId:组id
     * schemeId:方案id
     * */
    switchLoopDBGrpScheme: function(groupId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishChangeDBScheme(this.userToken, groupId, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetSchemeFromPollPlay(groupId, schemeId);
        }
    },

    //*****************************************************分组点播和轮循点播操作**************************
    /**
     * 开启分组点播
     * groupId:分组id
     * isLoop:是否轮循点播 V6
     * */
    startDBGrp: function(groupId, isLoop) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (isLoop) {
                businessSDK5.publishStartDBImageGroup(this.userToken, groupId, 1);
            } else {
                businessSDK5.publishStartDBImageGroup(this.userToken, groupId, 0);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (isLoop) {
                businessSDK6.publishStartPollPlayByGroup(groupId);
            } else {
                businessSDK6.publishStartGroupPlay(groupId);
            }
        }
    },
    /**
     * 停止分组点播
     * groupId:分组id
     * isLoop:是否轮循点播 V6
     * */
    stopDBGrp: function(groupId, isLoop) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (isLoop) {
                businessSDK5.publishStopDBImageGroup(this.userToken, groupId, 1);
            } else {
                businessSDK5.publishStopDBImageGroup(this.userToken, groupId, 0);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (isLoop) {
                businessSDK6.publishStopPollPlay(groupId);
            } else {
                businessSDK6.publishStopGroupPlay(groupId);
            }
        }
    },
    /**
     * 订阅分组点播状态
     * subscribeId:订阅id
     * groupId:分组id
     * */
    subscribeDBGrpStatus: function(subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeDBImageGroupStatus(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {}
    },
    /**
     * 取消分组点播状态
     * */
    cancelSubscribeDBGrpStatus: function(subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeDBImageGroupStatus(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {}
    },
    /**
     * 分组点播状态反馈
     * var resp ={groupId:"",groupName:'',schemeId:"",schemeName:'',operate:init/refresh/stop,
     * resources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType,status:具体参考enum.js}....]}
     * */
    setInformDBGrpStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveDBImageGroupStatusCallback(function(obj) {
                var resp = { groupId: "", groupName: "", schemeId: "", schemeName: "", operate: "", resources: [], refresh: [] }
                resp.groupId = obj.groupId;
                resp.schemeId = obj.schemeId;
                if (obj.schemeName) {
                    resp.schemeName = obj.schemeName
                }
                if (obj.groupName) {
                    resp.groupName = obj.groupName
                }
                if (obj.status == 1) {
                    if (obj.resources) {
                        resp.operate = "init"
                        obj.resources && obj.resources.forEach((item) => {
                            var row = {}
                            row.resourceId = item.resourceId;
                            row.resourceName = item.resourceName;
                            if (item.resourceType == 1) {
                                row.resourceType = 0;
                            } else if (item.resourceType == 2) {
                                row.resourceType = 1;
                            }
                            row.resourceCh = item.resourceCh;
                            if (item.isOnline == 1) {
                                row.status = 'online';
                            } else if (item.isOnline == 0) {
                                row.status = 'offline';
                            }
                            resp.resources.push(row)
                        });
                    } else if (obj.resourceStatus) {
                        resp.operate = "fresh"
                        var row = {}
                        var item = obj.resourceStatus;
                        row.resourceId = item.resourceId;
                        if (item.resourceType == 1) {
                            row.resourceType = 0;
                        } else if (item.resourceType == 2) {
                            row.resourceType = 1;
                        }
                        row.resourceCh = item.resourceCh;
                        if (item.isOnline == 1) {
                            row.status = 'online';
                        } else if (item.isOnline == 0) {
                            row.status = 'offline';
                        }
                        resp.resources.push(row)
                    }
                    callback(resp)
                } else if (obj.status == 0) {
                    resp.operate = "stop"
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //轮循点播资源加载
            businessSDK6.setInformAddBusinessGroupResource(function(obj) {
                    if (obj.sceneType == 4) {
                        var resp = { groupId: "", groupName: "", schemeId: "", schemeName: "", subscribeId: "", operate: "init", resources: [] }
                        resp.groupId = obj.sceneID
                        resp.groupName = obj.sceneName
                        resp.schemeId = ""
                        resp.schemeName = ""
                        resp.operate = "init"

                        obj.resources && obj.resources.forEach((item) => {
                            var row = {}
                            row.resourceId = item.resourceID
                            row.resourceName = item.resourceName
                                //resourceType
                            if (item.resourceType == 'User') row.resourceType = 0;
                            if (item.resourceType == 'Device') row.resourceType = 1;
                            //deviceType
                            if (item.deviceType == 'HWMeetingTerminal') row.deviceType = 13;
                            row.resourceCh = 0
                            row.status = item.status
                            resp.resources.push(row)
                        })

                        obj.fixedResources && obj.fixedResources.forEach((item) => {
                            var row = {}
                            row.resourceId = item.resourceID
                            row.resourceName = item.resourceName
                                //resourceType
                            if (item.resourceType == 'User') row.resourceType = 0;
                            if (item.resourceType == 'Device') row.resourceType = 1;
                            //deviceType
                            if (item.deviceType == 'HWMeetingTerminal') row.deviceType = 13;
                            row.resourceCh = 0
                            row.status = item.status
                            resp.resources.push(row)
                        })

                        callback(resp)
                    }
                })
                //轮循点播资源停止
            businessSDK6.setInformStopBusinessGroupResource(function(obj) {
                var resp = { groupId: "", groupName: "", schemeId: "", schemeName: "", subscribeId: "", operate: "init", resources: [] }
                resp.groupId = obj.sceneID
                resp.operate = "stop"
                callback(resp)
            })
        }
    },

    //---------------------------------------显示方案设置----------------------------------------
    //*****************************************轮循点播显示方案***********************************

    /**
     * 前端转换到后端 分屏类型
     * */
    getSplitType: function(splitType, version) {
        var splitTypeParams = 1
        var splitTypeParams1 = "4"

        if (splitType === "OnlyOne") { //1分屏
            if (version === 5) {
                splitTypeParams = 1
            } else {
                splitTypeParams1 = "SPLIT_ONE"
            }
        }
        if (splitType === "OnlyTwo") { //2分屏
            if (version === 5) {
                splitTypeParams = 12
            } else {
                splitTypeParams1 = "SPLIT_TWO"
            }
        }
        if (splitType === "OnlyFour") { ////4分屏

            if (version === 5) {
                splitTypeParams = 4
            } else {
                splitTypeParams1 = "SPLIT_FOUR"
            }
        }
        if (splitType === "OnlySix") { ////6分屏

            if (version === 5) {
                splitTypeParams = 100
            } else {
                splitTypeParams1 = "SPLIT_SIX"
            }
        }
        if (splitType === "OnlyNine") { //9分屏

            if (version === 5) {
                splitTypeParams = 9
            } else {
                splitTypeParams1 = "SPLIT_NINE"
            }
        }
        if (splitType === "OnlyTwelve") { //12分屏
            if (version === 5) {
                splitTypeParams = 15
            } else {
                splitTypeParams1 = "SPLIT_TWELVE"
            }
        }
        if (splitType === "OnlySixteen") { //16分屏
            if (version === 5) {
                splitTypeParams = 16
            } else {
                splitTypeParams1 = "SPLIT_SIXTEEN"
            }
        }
        if (splitType === "OnlyTweentyFour") { //24分屏
            if (version === 5) {
                //splitTypeParams = 16
            } else {
                splitTypeParams1 = "SPLIT_TWENTY_FOUR"
            }
        }
        if (splitType === "OnlyTweentyFive") { //25分屏
            if (version === 5) {
                //splitTypeParams = 16
            } else {
                splitTypeParams1 = "SPLIT_TWENTY_FIVE"
            }
        }
        if (splitType === "OnlyThirtySix") { //36分屏
            if (version === 5) {
                //splitTypeParams = 16
            } else {
                splitTypeParams1 = "SPLIT_THIRTY_SIX"
            }
        }
        if (splitType === "One_Five") { //1+5分屏

            if (version === 5) {
                splitTypeParams = 6
            } else {
                splitTypeParams1 = "SPLIT_ONE_PLUS_FIVE"
            }
        }
        if (splitType === "One_Seven") { //1+7分屏

            if (version === 5) {
                splitTypeParams = 8
            } else {
                splitTypeParams1 = "SPLIT_ONE_PLUS_SEVEN"
            }
        }
        if (splitType === "Two_Eight") { //2+8分屏

            if (version === 5) {
                //splitTypeParams = 8
            } else {
                splitTypeParams1 = "SPLIT_TWO_PLUS_EIGHT"
            }
        }
        if (splitType === "OneInOne") { ////画中画
            if (version === 5) {
                splitTypeParams = 2
            } else {
                splitTypeParams = "SPLIT_ONE_PLUS_ONE"
            }
        }

        if (splitType === "One_Two") { //1+2分屏

            if (version === 5) {
                splitTypeParams = 3
            } else {

            }
        }
        if (splitType === "Two_Three") { //2+3分屏

            if (version === 5) {
                splitTypeParams = 5
            } else {

            }
        }
        if (splitType === "OneX_One") { //2分屏左边宽
            if (version === 5) {
                splitTypeParams = 10
            } else {

            }
        }
        if (splitType === "One_OneX") { //2分屏右边宽
            if (version === 5) {
                splitTypeParams = 11
            } else {

            }
        }
        if (splitType === "One_Six") { //1+6分屏
            if (version === 5) {
                splitTypeParams = 101
            } else {

            }
        }
        if (splitType === "One_Eleven") { //1+11分屏
            if (version === 5) {
                splitTypeParams = 103
            } else {

            }
        }
        if (splitType === "One_Nine") { //1+9分屏
            if (version === 5) {
                splitTypeParams = 102
            } else {
                splitTypeParams1 = "SPLIT_ONE_PLUS_NINE"
            }
        }
        if (version === 5) {
            return splitTypeParams
        } else {
            return splitTypeParams1
        }

    },
    getScreenType: function(screenType, schemeType, version) {
        var screenTypeParam = 1
        var screenTypeParam1 = "SpeakerOfMeeting"
        if (version === 5) {
            if (screenType === "Chairman") { //主席屏
                screenTypeParam = 4
            }
            if (screenType === "Speak") { //会议发言屏
                screenTypeParam = 5
            }
            if (screenType === "Local") { //本地屏
                screenTypeParam = 1
            }
            if (screenType === "FixResource") { ////固定资源屏
                screenTypeParam = 2
            }
            if (screenType === "NormalLoop") { //轮循屏
                if (schemeType === 4 || schemeType === 5) {
                    screenTypeParam = 3
                }
                if (schemeType === 3) {
                    screenTypeParam = 6
                }
            }
            if (screenType === "UpLoop") { //上级轮循屏
                screenTypeParam = 9
            }
            if (screenType === "DownLoop") { //下级轮循屏
                screenTypeParam = 10
            }
            if (screenType === "UpAndDownLoop") { //下级轮循屏
                screenTypeParam = 11
            }
            if (screenType === "LocalBusiness") { //本地业务屏
                screenTypeParam = 7
            }

        } else { //version 6
            if (screenType === "Chairman") { //主席屏
                screenTypeParam1 = "ChairmanOfMeeting"
            }
            if (screenType === "Speak") { //会议发言屏
                screenTypeParam1 = "SpeakerOfMeeting"
            }
            if (screenType === "Local") { //本地屏
                screenTypeParam1 = "LocalResourceOfMeeting"
            }
            if (screenType === "FixResource") { ////固定资源屏
                screenTypeParam1 = "FixedResourceOfPlay"
            }
            if (screenType === "NormalLoop") { //轮循屏
                if (schemeType === 4) { //监看分组
                    screenTypeParam1 = "ResourcePollOfPlay"
                }
                if (schemeType === 3) { //视频会议
                    screenTypeParam1 = "MemberPollOfMeeting"
                }
            }
            if (screenType === "UpLoop") { //上级轮循屏
                //screenTypeParam =3
            }
            if (screenType === "DownLoop") { //下级轮循屏
                ////screenTypeParam =3
            }
        }
        if (version === 5) {
            return screenTypeParam
        } else {
            return screenTypeParam1
        }

    },
    getSchemeType: function(schemeType, version) {
        var schemeTypeParam = 1
        var schemeTypeParam1 = "PlaySchemeForLoca"
        if (version === 5) {
            // if(schemeType ===1){ //监看分组
            //   schemeTypeParam = 1
            // }
            // if(schemeType ===2){//分组呼叫
            //   schemeTypeParam = 2
            // }
            if (schemeType === 3) { //视频会议
                schemeTypeParam = 2
            }
            if (schemeType === 4) { //本地
                schemeTypeParam = 1
            }
            if (schemeType === 5) { //解码
                schemeTypeParam = 3
            }
            if (schemeType === 6) { //视频指挥
                schemeTypeParam = 4
            }
        } else {
            // if(schemeType ===1){ //分组点播
            //   schemeTypeParam=
            // }
            // if(schemeType ===2){//分组呼叫
            //   schemeTypeParam=
            // }
            if (schemeType === 3) { //视频会议
                schemeTypeParam1 = "MeetingScheme"
            }
            if (schemeType === 4) { //本地轮循点播
                schemeTypeParam1 = "PlaySchemeForLocal"
            }
            if (schemeType === 5) { //解码轮循点播
                schemeTypeParam1 = "PlaySchemeForDecoder"
            }
        }
        if (version === 5) {
            return schemeTypeParam
        } else if (version === 6) {
            return schemeTypeParam1
        }
    },
    /**
     * 后端转换到前端 分屏类型
     * */
    getSplitTypeReverse: function(inSplitType, version) {
        var splitTypeParams = "OnlyOne"
        if (version === 5) {
            if (inSplitType === 1) { //1分屏
                splitTypeParams = "OnlyOne"
            }
            if (inSplitType === 2) { ////画中画
                splitTypeParams = "OneInOne"
            }
            if (inSplitType === 3) { //1+2分屏
                splitTypeParams = "One_Two"
            }
            if (inSplitType === 4) { ////4分屏
                splitTypeParams = "OnlyFour"
            }
            if (inSplitType === 5) { //2+3分屏
                splitTypeParams = "Two_Three"
            }
            if (inSplitType === 6) { //1+5分屏
                splitTypeParams = "One_Five"
            }
            if (inSplitType === 100) { //6分屏
                splitTypeParams = "OnlySix"
            }
            if (inSplitType === 8) { //1+7分屏
                splitTypeParams = "One_Seven"
            }
            if (inSplitType === 9) { //9分屏
                splitTypeParams = "OnlyNine"
            }
            if (inSplitType === 10) { //2分屏左边宽
                splitTypeParams = "OneX_One"
            }

            if (inSplitType === 11) { //2分屏右边宽
                splitTypeParams = "One_OneX"
            }

            if (inSplitType === 12) { //2分屏等宽
                splitTypeParams = "OnlyTwo"
            }
            if (inSplitType === 16) { //16分屏
                splitTypeParams = "OnlySixteen"
            }
            if (inSplitType === 101) { //1+6分屏
                splitTypeParams = "One_Six"
            }
            if (inSplitType === 15) { //12分屏
                splitTypeParams = "OnlyTwelve"
            }
            if (inSplitType === 103) { //1+11分屏
                splitTypeParams = "One_Eleven"
            }
            if (inSplitType === 102) { //1+9分屏
                splitTypeParams = "One_Nine"
            }
        }
        if (version === 6) {
            if (inSplitType === "SPLIT_ONE") { //1分屏
                splitTypeParams = "OnlyOne"
            }
            if (inSplitType === "SPLIT_TWO") { //2分屏
                splitTypeParams = "OnlyTwo"
            }
            if (inSplitType === "SPLIT_FOUR") { //4分屏
                splitTypeParams = "OnlyFour"
            }
            if (inSplitType === "SPLIT_SIX") { //6分屏
                splitTypeParams = "OnlySix"
            }
            if (inSplitType === "SPLIT_NINE") { //9分屏
                splitTypeParams = "OnlyNine"
            }
            if (inSplitType === "SPLIT_TWELVE") { //12分屏
                splitTypeParams = "OnlyTwelve"
            }
            if (inSplitType === "SPLIT_SIXTEEN") { //16分屏
                splitTypeParams = "OnlySixteen"
            }
            if (inSplitType === "SPLIT_TWENTY_FOUR") { //24分屏
                splitTypeParams = "OnlyTweentyFour"
            }
            if (inSplitType === "SPLIT_TWENTY_FIVE") { //25分屏
                splitTypeParams = "OnlyTweentyFive"
            }
            if (inSplitType === "SPLIT_THIRTY_SIX") { //36分屏
                splitTypeParams = "OnlyThirtySix"
            }
            if (inSplitType === "SPLIT_ONE_PLUS_FIVE") { //1+5
                splitTypeParams = "One_Five"
            }
            if (inSplitType === "SPLIT_ONE_PLUS_SEVEN") { //1+7
                splitTypeParams = "One_Seven"
            }
            if (inSplitType === "SPLIT_ONE_PLUS_NINE") { //1+9
                splitTypeParams = "One_Nine"
            }
            if (inSplitType === "SPLIT_TWO_PLUS_EIGHT") { //2+8
                splitTypeParams = "One_Seven"
            }
            if (inSplitType === "SPLIT_ONE_PLUS_ONE") { //画中画
                splitTypeParams = "OneInOne"
            }
        }
        return splitTypeParams
    },
    getScreenTypeReverse: function(inScreenType, version) {
        var screenTypeParam = "Local"
        if (version === 5) {
            if (inScreenType === 4) { //主席屏
                screenTypeParam = "Chairman"
            }
            if (inScreenType === 5) { //会议发言屏
                screenTypeParam = "Speak"
            }
            if (inScreenType === 1) { //本地屏
                screenTypeParam = "Local"
            }
            if (inScreenType === 2) { ////固定资源屏
                screenTypeParam = "FixResource"
            }
            if (inScreenType === 3) { //轮循屏
                screenTypeParam = "NormalLoop"
            }
            if (inScreenType === 6) { //会议轮循屏
                screenTypeParam = "NormalLoop"
            }
            if (inScreenType === 9) { //上级轮循屏
                screenTypeParam = "UpLoop"
            }
            if (inScreenType === 10) { //下级轮循屏
                screenTypeParam = "DownLoop"
            }
            if (inScreenType === 11) { //上下级轮循屏
                screenTypeParam = "UpAndDownLoop"
            }
            if (inScreenType === 7) { //本地业务屏
                screenTypeParam = "LocalBusiness"
            }
        }
        if (version === 6) {
            if (inScreenType === "ChairmanOfMeeting") { //主席屏
                screenTypeParam = "Chairman"
            }
            if (inScreenType === "SpeakerOfMeeting") { //会议发言屏
                screenTypeParam = "Speak"
            }
            if (inScreenType === "LocalResourceOfMeeting") { //本地屏
                screenTypeParam = "Local"
            }
            if (inScreenType === "FixedResourceOfPlay") { ////固定资源屏
                screenTypeParam = "FixResource"
            }
            if (inScreenType === "ResourcePollOfPlay") { //轮循屏
                screenTypeParam = "NormalLoop"
            }
            if (inScreenType === "MemberPollOfMeeting") { //会议轮循屏
                screenTypeParam = "NormalLoop"
            }
        }

        return screenTypeParam
    },
    getSchemeTypeReverse: function(inSchemeType, version) {
        var schemeTypeParam = 1
        if (version === 5) {
            if (inSchemeType === 2) { //视频会议
                schemeTypeParam = 3
            }
            if (inSchemeType === 1) { //本地轮循点播
                schemeTypeParam = 4
            }
            if (inSchemeType === 3) { //解码轮循点播
                schemeTypeParam = 5
            }
            if (inSchemeType === 4) { //视频指挥
                schemeTypeParam = 6
            }
        }
        if (version === 6) {
            if (inSchemeType === "MeetingScheme") { //视频会议
                schemeTypeParam = 3
            }
            if (inSchemeType === "PlaySchemeForLocal") { //本地轮循点播
                schemeTypeParam = 4
            }
            if (inSchemeType === "PlaySchemeForDecoder") { //解码轮循点播
                schemeTypeParam = 5
            }
        }

        return schemeTypeParam
    },
    getGroupType: function(groupType, version) {
        var groupTypeParam = 1
        var groupTypeParam1 = ""
        if (version === 5) {
            if (groupType === 1) { //监看分组
                groupTypeParam = 7
            }
            if (groupType === 2) { //呼叫
                groupTypeParam = 5
            }
            if (groupType === 3) { //视频会议
                groupTypeParam = 2
            }
            if (groupType === 4) { //监看分组(本地)
                groupTypeParam = 7
            }
            if (groupType === 5) { //监看分组(解码)
                groupTypeParam = 8
            }
            if (groupType === 6) { //视频指挥
                groupTypeParam = 1
            }

            return groupTypeParam
        } else if (version === 6) {
            if (groupType === 1) { //监看分组
                groupTypeParam1 = "PlayGroup"
            }
            if (groupType === 2) { //呼叫
                groupTypeParam1 = "CallGroup"
            }
            if (groupType === 3) { //视频会议
                groupTypeParam1 = "Meeting"
            }
            if (groupType === 4) { //监看分组(本地)
                groupTypeParam1 = "PlayGroupForLocal"
            }
            if (groupType === 5) { //监看分组(解码)
                groupTypeParam1 = "PlayGroupForDecoder"
            }
            if (groupType === 6) { //视频指挥
                groupTypeParam1 = ""
            }

            return groupTypeParam1
        }
    },
    getGroupTypeReverse: function(inGroupType, version) {
        var groupTypeParam = 1
        if (version === 5) {
            if (inGroupType === 1) { //指挥
                groupTypeParam = 6
            }
            if (inGroupType === 2) { //会议
                groupTypeParam = 3
            }
            if (inGroupType === 5) { //呼叫
                groupTypeParam = 2
            }
            if (inGroupType === 7) { //点播
                groupTypeParam = 4
            }
            if (inGroupType === 8) { //解码器点播分组
                groupTypeParam = 5
            }

            return groupTypeParam
        } else {
            if (inGroupType === "PlayGroupForDecoder") {
                groupTypeParam = 5
            }
            if (inGroupType === "PlayGroupForLocal") {
                groupTypeParam = 4
            }
            if (inGroupType === "Meeting") {
                groupTypeParam = 3
            }
            if (inGroupType === "CallGroup") {
                groupTypeParam = 2
            }
            return groupTypeParam
        }
    },

    /**
     * 添加显示方案
     * schemeName:方案名称
     * schemeType:方案类型
     *
     * splitType:分屏类型：具体参考emum.js
     * screens:方案类型,[{screenType:r具体参考emum.js,pos:[1,2,5]}...]
     * loopInterval:轮循间隔
     *
     * var resp ={Ret:0/1}
     * */
    createDisplayScheme: function(schemeName, schemeType, splitType, screens, loopInterval, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //DisplayScheme/addScheme
            var splitTypeParams = this.getSplitType(splitType, 5)
            var screensParams = []
                //var schemeParam = this.getSchemeType(schemeType,5)
            screens.forEach((item) => {
                var row = { screenType: 1, index: "", enable: 1, looptime: 0 }
                var screenTypeParam = this.getScreenType(item.screenType, schemeType, 5)
                row.screenType = screenTypeParam
                var v5Pos = []
                item.pos.forEach(function(line) {
                    v5Pos.push(line - 1)
                })
                row.index = v5Pos.join(",")
                if (item.looptime) {
                    row.looptime = item.looptime
                } else {
                    row.looptime = loopInterval
                }
                screensParams.push(row)
            });

            var schemeTypeParam = this.getSchemeType(schemeType, 5)

            dataSDK5.addScheme(this.userToken, schemeName, schemeTypeParam, splitTypeParams, JSON.stringify(screensParams), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                resp.msg = obj.msg
                callback(resp)
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var splitTypeParams = this.getSplitType(splitType, 6)

            var screensParams = []
            screens.forEach((item) => {
                var row = { roleType: 1, indexes: "", pollingInterval: 10 }
                var screenTypeParam = this.getScreenType(item.screenType, schemeType, 6)
                row.roleType = screenTypeParam

                var v6Pos = []
                item.pos.forEach(function(line) {
                        v6Pos.push(line - 1)
                    })
                    //row.indexes = v6Pos.join(",");
                row.indexes = v6Pos;
                row.pollingInterval = loopInterval

                screensParams.push(row)
            });

            var schemeTypeParam = this.getSchemeType(schemeType, 6);
            dataSDK6.addDisplayScheme("", schemeName, schemeTypeParam, splitTypeParams, screensParams, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            })
        }
    },
    /**
     * 删除显示方案
     * schemeId:方案id
     *
     * var resp ={Ret:0/1}
     * */
    deleteDisplayScheme: function(schemeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            ///DisplayScheme/deleteScheme
            dataSDK5.deleteScheme(this.userToken, schemeId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp)
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeDisplayScheme(schemeId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },

    /**
     * 根据方案id查询详情
     * schemeId:方案id
     * schemeType:具体参考enum.js
     * splitType:具体参考enum.js
     * screens:方案类型,[{sceenType:具体参考emum.js,pos:[1,2,5]}...]
     *
     * var resp ={schemeId:'',schemeName:'',schemeType:'',splitType:'',screens:[],loopInterval:''}
     * */
    getDisplaySchemeInfoById: function(schemeId, callback) {
        var self = this
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //DisplayScheme/queryScheme3
            dataSDK5.queryScheme3(this.userToken, schemeId, function(obj) {
                var resp = { schemeId: '', schemeName: '', schemeType: '', splitType: '', screens: [], loopInterval: '' }
                if (obj && obj.ret === 0) {
                    if (obj.data) {
                        var data = obj.data
                        resp.schemeId = data.schemeId
                        resp.schemeName = data.schemeName

                        resp.schemeType = self.getSchemeTypeReverse(data.schemeType, 5)
                        resp.splitType = self.getSplitTypeReverse(data.splitType, 5)

                        data.screens.forEach((item) => {
                            var row = {}
                            row.screenType = self.getScreenTypeReverse(item.screenType, 5)
                            var v5pos = []
                            item.index.split(",").forEach(function(line) {
                                var nPos = Number(line)
                                v5pos.push(nPos + 1)
                            })
                            row.pos = v5pos
                            row.interval = item.looptime
                            resp.screens.push(row);
                        })
                        callback(resp)
                    }
                } else {
                    callback(resp)
                }
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDisplaySchemeBySchemeID(schemeId, function(obj) {
                var resp = { schemeId: '', schemeName: '', schemeType: '', splitType: '', screens: [], loopInterval: '' }
                if (obj && obj.responseCode == 1) {
                    if (obj.data) {
                        var data = obj.data
                        resp.schemeId = data.schemeID
                        resp.schemeName = data.schemeName

                        resp.schemeType = self.getSchemeTypeReverse(data.schemeType, 6)
                        resp.splitType = self.getSplitTypeReverse(data.splitType, 6)

                        var interval = 0
                        data.screens && data.screens.forEach((item) => {
                            var row = {}
                            row.screenType = self.getScreenTypeReverse(item.roleType, 6)
                            var v6pos = []
                            item.indexes && item.indexes.forEach(function(line) {
                                var nPos = Number(line)
                                v6pos.push(nPos + 1)
                            })
                            row.pos = v6pos

                            if (item.pollingInterval) {
                                interval = item.pollingInterval
                            }
                            resp.screens.push(row);
                        })
                        resp.loopInterval = interval
                        callback(resp)
                    }
                } else {
                    callback(resp)
                }
            });
        }
    },

    /**
     * 获取所有的显示方案
     *
     * var resp =[{schemeId:'',schemeName:'',schemeType:'',description:''}]
     * */
    getAllDisplayScheme: function(page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            ///DisplayScheme/queryScheme
            var self = this
            dataSDK5.queryScheme(this.userToken, page, page - 1, pageSize, function(obj) {
                var resp = []
                    //{schemeId:'',schemeName:'',schemeType:'',description:''}
                if (obj && obj.ret === 0) {
                    if (obj.data) {
                        obj.data.forEach((item) => {
                            var row = {}
                            row.schemeId = item.schemeId
                            row.schemeName = item.schemeName
                            row.schemeType = self.getSchemeTypeReverse(item.schemeType, 5)
                            row.description = ""
                            resp.push(row)
                        })
                    }
                }
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var self = this
            dataSDK6.queryDisplaySchemeList("", function(obj) {
                var resp = []
                if (obj && obj.responseCode == 1) {
                    if (obj.data) {
                        obj.data.forEach((item) => {
                            var row = {}
                            row.schemeId = item.schemeID
                            row.schemeName = item.schemeName
                            row.schemeType = self.getSchemeTypeReverse(item.schemeType, 6)
                            row.description = ""
                            resp.push(row)
                        })
                    }
                }
                callback(resp)
            });

        }
    },

    /**
     * 保存显示方案
     * schemeType:具体参见enum.js
     * splitType:具体参见enum.js
     *
     * 其他参数参见 createDisplayScheme接口
     * schemeName:方案名称
     * schemeType:方案类型
     *
     * screens:方案类型,[{screenType:r具体参考emum.js,pos:[1,2,5]}...]
     * loopInterval:轮循间隔
     *
     * var resp ={Ret:0/1}
     * */
    saveDisplayScheme: function(schemeId, schemeType, schemeName, splitType, screens, loopInterval, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var splitTypeParam = this.getSplitType(splitType, 5)
            var screensParams = []

            screens.forEach((item) => {
                var row = { screenType: 1, index: "", enable: 1, looptime: 0 }
                var screenTypeParam = this.getScreenType(item.screenType, schemeType, 5)
                row.screenType = screenTypeParam

                var v5Pos = []
                item.pos.forEach(function(line) {
                    v5Pos.push(line - 1)
                })

                row.index = v5Pos.join(",")
                if (item.looptime) {
                    row.looptime = item.looptime
                } else {
                    row.looptime = loopInterval
                }
                screensParams.push(row)
            });

            var schemeTypeParam = this.getSchemeType(schemeType, 5)

            dataSDK5.updateScheme(this.userToken, schemeId, schemeName, schemeTypeParam, splitTypeParam, JSON.stringify(screensParams), function(obj) {
                var resp = { Ret: 0 }
                resp.Ret = obj.ret
                resp.msg = obj.msg
                callback(resp)
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var splitTypeParam = this.getSplitType(splitType, 6)
            var screensParams = []

            screens.forEach((item) => {
                var row = { roleType: 1, indexes: "", pollingInterval: 10 }
                var screenTypeParam = this.getScreenType(item.screenType, schemeType, 6)
                row.roleType = screenTypeParam
                var v6Pos = []
                item.pos.forEach(function(line) {
                        v6Pos.push(line - 1)
                    })
                    //row.indexes = v6Pos.join(",")
                row.indexes = v6Pos
                row.pollingInterval = loopInterval
                screensParams.push(row)
            });

            var schemeTypeParam = this.getSchemeType(schemeType, 6)
            dataSDK6.editDisplayScheme(schemeId, schemeName, schemeTypeParam, splitTypeParam, screensParams, function(obj) {
                var resp = {};
                if (obj && obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            })

        }
    },

    /**
     * 根据方案类型查询显示方案
     * var resp =[{schemeId:'',schemeName:'',splitType:具体参考enum.js,schemeType:具体参考enum.js}]
     * */
    getDisplaySchemeBySchemeType: function(schemeType, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var self = this
            var resp = []
            var schemeTypeParam = this.getSchemeType(schemeType, 5)
            dataSDK5.queryScheme2(this.userToken, schemeTypeParam, page, page - 1, pageSize, function(obj) {
                if (obj && obj.ret === 0) {
                    if (obj.data) {
                        obj.data.forEach((item) => {
                            var row = {}
                            row.schemeId = item.schemeId
                            row.schemeName = item.schemeName
                            row.splitType = self.getSplitTypeReverse(item.splitType, 5)
                            row.schemeType = self.getSchemeTypeReverse(item.schemeType, 5)
                            resp.push(row)
                        })
                        callback(resp)
                    }
                } else {
                    callback(resp)
                }
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var self = this
            var schemeTypeParam = this.getSchemeType(schemeType, 6)
            dataSDK6.queryDisplaySchemeList(schemeTypeParam, function(obj) {
                var resp = []
                if (obj && obj.responseCode == 1) {
                    if (obj.data) {
                        obj.data.forEach((item) => {
                            var row = {}
                            row.schemeId = item.schemeID
                            row.schemeName = item.schemeName
                            row.schemeType = self.getSchemeTypeReverse(item.schemeType, 6)
                            row.description = ""
                            resp.push(row)
                        })
                    }
                }
                callback(resp)
            });

        }
    },

    /**
     * 根据组类型查询显示方案
     * var resp =[{schemeId:'',schemeName:'',splitType:具体参考enum.js,schemeType:具体参考enum.js}]
     * */
    getDisplaySchemeByGroupType: function(groupType, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var self = this
            var resp = []
            if (groupType == 1) { //分组监看
                dataSDK5.queryScheme2(this.userToken, 1, page, page - 1, pageSize, function(obj) {
                    if (obj && obj.ret === 0) {
                        if (obj.data) {
                            obj.data.forEach((item) => {
                                var row = {}
                                row.schemeId = item.schemeId
                                row.schemeName = item.schemeName
                                row.splitType = self.getSplitTypeReverse(item.splitType, 5)
                                row.schemeType = self.getSchemeTypeReverse(item.schemeType, 5)
                                resp.push(row)
                            })
                        }
                    }
                    callback(resp)
                })
            } else if (groupType == 3) { //视频会议
                let schemeTypeParam = 2
                dataSDK5.queryScheme2(this.userToken, schemeTypeParam, page, page - 1, pageSize, function(obj) {
                    if (obj && obj.ret === 0) {
                        if (obj.data) {
                            obj.data.forEach((item) => {
                                var row = {}
                                row.schemeId = item.schemeId
                                row.schemeName = item.schemeName
                                row.splitType = self.getSplitTypeReverse(item.splitType, 5)
                                row.schemeType = self.getSchemeTypeReverse(item.schemeType, 5)
                                resp.push(row)
                            })
                        }
                        callback(resp)
                    } else {
                        callback(resp)
                    }
                })
            } else if (groupType == 6) { //视频指挥
                let schemeTypeParam = 4
                dataSDK5.queryScheme2(this.userToken, schemeTypeParam, page, page - 1, pageSize, function(obj) {
                    if (obj && obj.ret === 0) {
                        if (obj.data) {
                            obj.data.forEach((item) => {
                                var row = {}
                                row.schemeId = item.schemeId
                                row.schemeName = item.schemeName
                                row.splitType = self.getSplitTypeReverse(item.splitType, 5)
                                row.schemeType = self.getSchemeTypeReverse(item.schemeType, 5)
                                resp.push(row)
                            })
                        }
                        callback(resp)
                    } else {
                        callback(resp)
                    }
                })
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    // ------------------------------------------ 呼叫 ------------------------------------------
    /**
     * 音视频呼叫
     * token:令牌
     * destId:被呼叫资源Id
     * destName:被呼叫人名称 V6 = receiverName
     * senderName:发起人名称 V6
     * */
    startMediaCall: function(destId, destName, senderName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartCall(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartCall(destId, false, senderName, destName);
        }
    },

    /**
     * 音视频呼叫华为uc
     * token:令牌
     * destId:被呼叫资源Id
     * destName:被呼叫人名称 V6 = receiverName
     * senderName:发起人名称 V6
     * */
    startMediaCallHW: function(destId, destName, senderName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {} else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartCallHW(destId, false, senderName, destName);
        }
    },

    /**
     * 音频呼叫人员
     * destId:接收方id
     * destName:接收方名称
     * senderName:发起方名称
     * */
    startVoiceCall: function(destId, destName, senderName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartAudioCall(this.userToken, destId)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartCall(destId, true, senderName, destName)
        }
    },

    /**
     * 音频呼叫华为uc
     * destId:接收方id
     * destName:接收方名称
     * senderName:发起方名称
     * */
    startVoiceCallHW: function(destId, destName, senderName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {} else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartCallHW(destId, true, senderName, destName)
        }
    },

    /**
     * 停止呼叫
     * token:令牌
     * destId:被呼方
     * isAll:false为单停，true为全停
     * */
    stopCall: function(destId, destName, senderName, onlyVoice) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (onlyVoice)
                businessSDK5.publishStopAudioCall(this.userToken, destId)
            else
                businessSDK5.publishStopCall(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopCall(destId, senderName, destName);
        }

    },

    /**
     * 开始语音对讲
     * destId:接收方Id
     * destCh:接收方通道
     * */
    startSpeak: function(deviceId, deviceCh) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartSpeak(this.userToken, deviceId, deviceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 停止对讲
     * destId:接收方id
     * isAll:是否全停 false为单停，true为全停
     * */
    stopSpeak: function(deviceId, deviceCh, isAll) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // businessSDK5.publishStartSpeak();
            if (isAll) {
                businessSDK5.publishStopSpeakAll(this.userToken)
            } else {
                businessSDK5.publishStopSpeak(this.userToken, deviceId, deviceCh);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }


    },

    /**
     * 订阅分组呼叫状态
     * */
    subscribeGroupCallStatus: function(groupId, subscribeId) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         *     无
         * */
    },

    /**
     * 取消分组呼叫状态
     * */
    cancelSubscribeGroupCallStatus: function(subscribeId) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         * */
    },

    /**
     * 开启分组呼叫
     * groupId:分组id
     * members:[{resId:'',resName:''}...] //临时选择的资源
     * */
    startGroupCall: function(groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartGroupCall(this.userToken, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 分组呼叫,添加成员
     * groupId:分组id
     * members:[{resId,resName}....]
     * */
    addCallGroupMember: function(groupId, members) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            members.forEach((item) => {
                businessSDK5.publishAddGroupCallMember(this.userToken, groupId, item.resId);
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }

    },
    /**
     * 分组呼叫，移除成员
     * groupId:分组id
     * members:[{resId,resName}...]
     * */
    removeCallGroupMember: function(groupId, members) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            members.forEach((item) => {
                businessSDK5.publishRemoveGroupCallMember(this.userToken, groupId, item.resId);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 分组呼叫，勾选成员呼叫
     * groupId:分组id
     * members:[{resId:'',resName:''} ...]
     * */
    startGroupCallByMembers: function(groupId, members) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var memberParams = []
            members.forEach(function(item) {
                var it = {}
                it.memberId = item.resId
                memberParams.push(it)
            })
            businessSDK5.publishStartGroupCalling(this.userToken, groupId, memberParams);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 分组呼叫，停止勾选成员呼叫
     * groupId:分组id
     * members:[{resId:'',resName:''}....]
     * */
    stopGroupCallByMembers: function(groupId, members) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var memberParams = []
            members.forEach(function(item) {
                var it = {}
                it.memberId = item.resId
                memberParams.push(it)
            })
            businessSDK5.publishStopGroupCalling(this.userToken, groupId, memberParams);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }

    },

    /**
     * 停止所有呼叫
     * groupId:分组id
     * */
    stopGroupCall: function(groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopAllGroupCalling(this.userToken, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 退出分组呼叫
     * groupId:分组id
     * */
    ExitGroupCall: function(groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopGroupCall(this.userToken, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 设置分组呼叫状态推送回调
     *  isCalling:0.未呼叫 1.呼叫中,2.呼叫完成
     * var resp ={groupId:'',groupName:'',operate:init/add/remove/refresh/stop
     *  memeber:[{userId:'',userName:"',isOnline:具体参考enum enumMerberStatus ,isCalling:具体参考上面的定义]}
     * */
    setInformGroupCallStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveGroupCallStatusCB(function(obj) {
                var resp = { groupId: '', groupName: '', operate: 'init', members: [] }
                resp.groupId = obj.groupId
                resp.groupName = obj.groupName
                if (obj.operate === 0) {
                    resp.operate = "stop"
                } else {
                    if (obj.operate === 1) { //第一次推送一个全量
                        resp.operate = "init"
                        obj.members && obj.members.forEach(function(item) {
                            var row = {}
                            row.userId = item.memberId
                            row.userName = item.memberName
                            if (item.isOnline === 0) {
                                row.isOnline = "offline"
                            }
                            if (item.isOnline === 1) {
                                row.isOnline = "online"
                            }
                            if (item.isOnline === 2) {
                                row.isOnline = "breakdown"
                            }
                            row.isCalling = item.isCalling
                            resp.members.push(row)
                        })
                    }

                    if (obj.operate === 2) {
                        // if(obj.status.isCalling === 0){//这种情况是删除成员回调
                        //   resp.operate ="remove"
                        // }else{
                        resp.operate = "refresh"
                            // }
                        var row = {}
                        row.userId = obj.status.memberId
                        row.userName = obj.status.memberName
                        if (obj.status.isOnline === 0) {
                            row.isOnline = "offline"
                        }
                        if (obj.status.isOnline === 1) {
                            row.isOnline = "online"
                        }
                        if (obj.status.isOnline === 2) {
                            row.isOnline = "breakdown"
                        }
                        row.isCalling = obj.status.isCalling
                        resp.members.push(row)
                    }
                }
                callback(resp)
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    //----------------------------------呼叫分组--------------------------------------------------------------
    /**
     * 创建呼叫分组
     * groupName:组名称
     * members:[{resId:'',resName:''}...]
     * var resp ={Ret:0}
     * */
    addCallGroup: function(groupName, groupDescription, members, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var users = []
            var self = this

            members.forEach(function(item) {
                if (item.resId !== self.userID) {
                    var it = {}
                    it.userId = item.resId;
                    users.push(it)
                }
            })
            dataSDK5.addCallGroup(this.userToken, groupName, groupDescription, JSON.stringify(users), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var callUsers = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = 0;
                it.userID = item.resId
                callUsers.push(it);
            });
            dataSDK6.addCallGroup(groupName, groupDescription, JSON.stringify(callUsers), function(obj) {
                var resp = {}
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });

        }
    },
    /**
     * 删除呼叫分组
     * groupId:分组id
     *
     * var resp={Ret:0}
     * */
    delCallGroup: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteCallGroup(this.userToken, groupId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var groupIds = []
            groupIds.push(groupId)
            dataSDK6.removeAnyBusinessGroups(groupIds, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },
    /**
     * 分组呼叫，根据组id获取呼叫资源
     * var resp ={groupId,groupName,description,resources:[{resID,resName,order}...]}
     * */
    getResourcesByGroupId: function(groupId, callback) {
        var self = this
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryCallGroupInfo(this.userToken, groupId, function(obj) {
                var resp = { groupid: "", groupName: "", description: "", resources: [] }
                if (obj.ret == 0 && obj.data && obj.data.length > 0) {
                    var data = obj.data[0];
                    resp.groupId = data.groupID;
                    resp.groupName = data.groupName;
                    resp.description = data.description
                    data.userObjs.forEach(function(item) {
                        if (item.userId !== self.userID) {
                            var it = {}
                            it.resID = item.userId
                            it.resName = item.userName
                            it.order = 0
                            resp.resources.push(it)
                        }
                    })
                    callback(resp)
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleCallGroup(groupId, function(obj) {
                var resp = { groupId: "", groupName: "", description: "", resources: [] }
                if (obj.responseCode == 1) {
                    resp.groupId = obj.data.groupID;
                    resp.groupName = obj.data.groupName;
                    resp.description = obj.data.description;
                    resp.groupType = 2
                    var resources = [];
                    obj.data.callUsers && obj.data.callUsers.forEach(function(item) {
                        var it = {};
                        it.resID = item.userID;
                        it.resName = item.userName;
                        it.order = item.index || 0;
                        if (item.deviceType == 'HWMeetingTerminal') {
                            it.deviceType = 13;
                        }
                        resources.push(it);
                    })
                    resp.resources = resources;
                }
                callback(resp);
            });


        }
    },
    /**
     * 更新呼叫分组
     * groupId:分组id
     * groupName:分组名称
     * groupDescription:分组描述
     * members:[{resId:'',resName:''}...]
     * */
    updateCallGroup: function(groupId, groupName, groupDescription, members, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var users = []
            members.forEach(function(item) {
                var it = {}
                it.userId = item.resId;
                users.push(it)
            })
            dataSDK5.updateCallGroup(this.userToken, groupId, groupName, groupDescription, JSON.stringify(users), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var callUsers = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = 0;
                it.userID = item.resId;
                callUsers.push(it);
            });
            dataSDK6.editCallGroup(groupId, groupName, groupDescription, JSON.stringify(callUsers), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    _convertToBeginIndex: function(page, pageSize) {
        return (page - 1) * pageSize
    },
    /**
     * 给前台返回所有的分组信息
     * var resp={totalCnt:'',rows:[{groupId:'',groupName:'',groupDescription:'',groupType:'',schemeId:"",order:0}....]}
     * */
    getAllGroupInfo: function(type, page, pageSize, callback) {
        var resp = { totalCnt: '', rows: [] }
        var self = this
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (!type) { //所有
                //获取分组
                dataSDK5.queryAllGroup(this.userToken, page, page - 1, pageSize, function(obj) {
                    //groupType 1-指挥 2-会议 5-呼叫 7-点播
                    if (obj && obj.ret == 0) {
                        // data":[{"groupId":"","groupName":"","description":"","schemeId":"","groupType":1,"schemeName":"",operateId:[{""}]}]
                        obj.data && obj.data.forEach(function(item) {
                            var type_ = self.getGroupTypeReverse(item.groupType, 5)
                            var isGroupOperator = false;
                            if (item.operateId && item.operateId.length > 0) {
                                item.operateId.forEach(ele => {
                                    if (ele == self.userID) {
                                        isGroupOperator = true;
                                    }
                                })
                            }
                            var it = {}
                            it.groupId = item.groupId
                            it.groupName = item.groupName
                            it.groupDescription = item.description
                            it.schemeId = item.schemeId
                            it.schemeName = item.schemeName
                            it.groupType = type_
                            it.operateId = item.operateId
                            it.isGroupOperator = isGroupOperator
                            resp.rows.push(it)
                        })
                    }
                    resp.totalCnt = (page + 1) * pageSize;
                    callback(resp)
                });
            } else {
                var gType = self.getGroupType(type, 5)
                dataSDK5.queryGroupByType(this.userToken, gType, page, 1, pageSize, function(obj) {
                    if (obj && obj.data) {
                        // data":{"totalCount":5,"list":[{"groupId":"","groupName":"","description":"","schemeId":"","groupType":2,"schemeName":"",operateId:[{""}]}]
                        obj.data.list && obj.data.list.forEach(function(item) {
                            var isGroupOperator = false;
                            if (item.operateId.length > 0) {
                                item.operateId.forEach(ele => {
                                    if (ele == self.userID) {
                                        isGroupOperator = true;
                                    }
                                })
                            }
                            var it = {};
                            it.groupId = item.groupId;
                            it.groupName = item.groupName;
                            it.groupDescription = item.description
                            it.schemeId = item.schemeId;
                            it.schemeName = item.schemeName;
                            it.groupType = type
                            it.operateId = item.operateId
                            it.isGroupOperator = isGroupOperator
                            resp.rows.push(it);
                        })
                        resp.totalCnt = obj.data.totalCount;
                    }
                    callback(resp);
                });
            }

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var gType = self.getGroupType(type, 6)
            var beginIndex = this._convertToBeginIndex(page, pageSize)
            dataSDK6.queryBusinessGroupList(gType, beginIndex, pageSize, function(obj) {
                var resp = { totalCnt: 0, rows: [] }
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.totalCount;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        it.groupId = item.groupID;
                        it.groupName = item.groupName;
                        it.groupDescription = item.description;
                        it.groupType = self.getGroupTypeReverse(item.groupType, 6)
                        it.order = "";
                        it.schemeId = item.schemeID || ""
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });

        }
    },

    //------------------------------------------------云台控制--------------------------------------------------

    /**
     * 是否有云台权限
     * token:令牌
     * resourceId:资源id
     * resourceCh:资源通道
     *
     * var resp = {Ret:0}
     */
    getValidYTRight: function(resourceId, resourceCh, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.validYTRight(this.userToken, resourceId, resourceCh, function(obj) {
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // 目前6不作校验
            resp.Ret = 0;
            callback(resp);
        }
    },

    /**
     * 得到云台的静态数据
     * token:令牌
     * resourceId:资源id
     * resourceCh:资源通道
     *
     * var resp ={wiper:true/false,heat:true/false,night:true/false,t3d:true/false}
     * */
    getYTStaticStatus: function(resourceId, resourceCh, callback) {
        var resp = {};

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getYTOperate(this.userToken, resourceId, resourceCh, function(obj) {
                if (obj.data.wiper === 1) {
                    resp.wiper = true
                } else {
                    resp.wiper = false
                }

                if (obj.data.heat === 1) {
                    resp.heat = true
                } else {
                    resp.heat = false
                }

                if (obj.data.night === 1) {
                    resp.night = true
                } else {
                    resp.night = false
                }

                /*if(obj.Data.3d === 1){
                                                resp.t3d = true
                                            }else{
                                                resp.t3d = false
                                            }*/

                callback(resp)

            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },
    /* 方向控制,
        token:令牌
        resourceId:设备id
        resourceCh:设备通道
        direction:云台方向,上 n , 下 s ,  左 w ,右 e, 左上 nw, 右上 ne, 左下 sw ,右下 se,
        speed:速度 1-255


        var resp ={Ret=0/1}
        */
    publishStartYTDirectionCtl: function(resourceId, resourceCh, direction, direction2, speed, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.directionControl(this.userToken, resourceId, resourceCh, direction2, speed, 1, function(obj) {
                resp.Ret = obj.Ret;
                // callback(resp.Ret)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishDirectionControl(resourceId, direction, speed);
        }
    },
    publishStartYTNVRDirectionCtl: function(resourceID, direction, speed, channelNo, encoderSIPID, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishNVRDirectionControl(resourceID, direction, speed, channelNo, encoderSIPID);
        }
    },
    publishStopYTDirectionCtl: function(resourceId, resourceCh, direction, direction2, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.directionControl(this.userToken, resourceId, resourceCh, direction2, 100, 0, function(obj) {
                resp.Ret = obj.Ret;
                // callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }
    },
    publishStopYTNVRDirectionCtl: function(resourceId, encoderSIPID, channelNo, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopNVRControl(resourceId, encoderSIPID, channelNo);
        }
    },
    /* 聚焦控制
    token:令牌
    resourceId:设备id
    resourceCh:设备通道
    zoom:+为true,-为false
    speed:速度1-255

    var resp ={Ret=0/1}
 */
    publishStartYTFocusCtl: function(resourceId, resourceCh, zoom, speed, callback) {
        var resp = {};
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.focusControl(this.userToken, resourceId, resourceCh, zoom, speed, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishFocusControl(resourceId, zoom, speed);
        }


    },
    publishStopYTFocusCtl: function(resourceId, resourceCh, zoom, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.focusControl(this.userToken, resourceId, resourceCh, zoom, 100, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }

    },

    /*光圈控制
        userId:操作人
        token:令牌
        resourceId:设备id
        resourceCh:设备通道
        zoom:+为true,-为false
        speed:速度1-255

        var resp ={Ret=0/1}
        */
    publishStartYTApertureCtl: function(resourceId, resourceCh, zoom, speed, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.apertureControl(this.userToken, resourceId, resourceCh, zoom, speed, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishApertureControl(resourceId, zoom, speed);
        }
    },
    publishStopYIApertureCtrl: function(resourceId, resourceCh, zoom, speed, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.apertureControl(this.userToken, resourceId, resourceCh, zoom, speed, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }
    },
    /*变焦控制
        token:令牌
        resourceId:设备id
        resourceCh:设备通道
        zoom:+为true,-为false
        speed:速度1-255

        var resp ={Ret=0/1}
        */
    publishStartYTZoomCtl: function(resourceId, resourceCh, zoom, speed, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.zoomControl(this.userToken, resourceId, resourceCh, zoom, speed, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishZoomControl(resourceId, zoom, speed);
        }

    },
    publishStopYTZoomCtl: function(resourceId, resourceCh, zoom, speed) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            zoom = zoom ? "2x" : "-2x"
            dataSDK5.zoomControl(this.userToken, resourceId, resourceCh, zoom, speed, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }
    },
    /**雨刷
     token:令牌
     resourceId:设备id
     resourceCh:设备通道

     var resp ={Ret=0/1}
     *
     */
    publishStartYTWiperCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.wiperControl(this.userToken, resourceId, resourceCh, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishWiperControl(resourceId, 1);
        }
    },

    publishStopYTWiperCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.wiperControl(this.userToken, resourceId, resourceCh, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }
    },
    /**
     * 加热
     token:令牌
     resourceId:设备id
     resourceCh:设备通道
     */
    publishStartYTHeatCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.heatControl(this.userToken, resourceId, resourceCh, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishAddHeat(resourceId, 1);
        }
    },

    publishStopYTHeatCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.heatControl(this.userToken, resourceId, resourceCh, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }

    },
    /**
     * 夜视
     * token:令牌
     * resourceId:设备id
     * resourceCh:设备通道
     */
    publishStartYTNightCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.heatControl(this.userToken, resourceId, resourceCh, 1, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },
    publishStopYTNightCtl: function(resourceId, resourceCh, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.nightControl(this.userToken, resourceId, resourceCh, 0, function(obj) {
                resp.Ret = obj.Ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopControl(resourceId);
        }
    },
    /**
     * 接管
     * token:令牌
     * resourceId:设备id
     * resourceCh:设备通道
     */
    publishStartYTTakeOverCtl: function(resourceId, resourceCh) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishYTTakeover(this.userToken, resourceId, resourceCh, 1);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishTakeoverYT(resourceId, true);
        }
    },

    publishStopYTTakeOverCtl: function(resourceId, resourceCh) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishYTTakeover(this.userToken, resourceId, resourceCh, 0);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // businessSDK6.publishStopControl(resourceId, false);
            businessSDK6.publishTakeoverYT(resourceId, false);
        }
    },
    /**
     * 3D控制
     * token:令牌
     * resourceId:设备Id
     * resourceCh:设备通道
     * value:从playSDK返回回来的值string.Format('%6d,%6d,%6d,%6d,%6d,%6d,%6d,%6d',[0,0,点播区域宽度,点播区域高度,画框起点X,画框起点Y,画框终点X-画框起点X,画框终点Y-画框起点Y])
     * */
    publish3DControl: function(resourceId, resourceCh, value, callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5._3DControl(this.userToken, resourceId, resourceCh, value, function(obj) {
                callback(obj);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 订阅云台状态
     * token:令牌
     * resourceId:设备id
     * resourceCh:设备通道
     */
    subscribeYTStatus: function(resourceId, resourceCh) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeYTStatus(this.userToken, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeYTStatus(resourceId);
        }
    },
    /**
     * 取消云台订阅
     * token:令牌
     * resourceId:设备id
     * resourceCh:设备通道
     */
    cancelSubscribeYTStatus: function(resourceId, resourceCh) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeYTStatus(this.userToken, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.cancelSubscribeYTStatus();
        }
    },

    /**
     * 云台状态推送
     *
     * var resp ={resId,resCh,message:'',wiper:-1,heat:-1,night:-1,takeoverUserName:'',takeoverUserID,isAllow:true/false}
     *
     * */
    setInformYTStatusCallback: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveYTStatusCallback(function(obj) {
                resp.deviceId = obj.deviceId;
                resp.resId = obj.resId;
                resp.resCh = obj.resCh;
                resp.message = obj.message;
                resp.wiper = obj.wiper;
                resp.heat = obj.heat;
                resp.night = obj.night;
                resp.yt3d = obj.yt3d;
                resp.isAllow = (obj.takeover == apiSDK.userID) ? true : false;
                resp.takeoverUserName = ''
                resp.takeoverUserID = obj.takeover;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveYTStatusCallback(function(obj) {
                resp.resId = '';
                resp.resCh = '';
                resp.message = '';
                resp.wiper = '';
                resp.heat = '';
                resp.night = '';
                resp.takeoverUserName = obj.takeoverUserName;
                resp.takeoverUserID = obj.takeoverUserID;
                resp.isAllow = obj.isAllow;

                callback(resp);

            });
        }
    },

    // ------------------------------------------- 视频会议 --------------------------------------------------
    //***************************************视频业务分组******************************************************
    /**
     * 创建预设会议组
     * conferenceName:会议名称
     * description:描述
     * schemeId:终端产品中都有显示方案id
     * members:[{index:0,userId:''}...]
     * devices:[{index:0,deviceId:'',deviceCh:''}...]
     */
    createConferenceGroup: function(conferenceName, description, schemeId, members, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var found = false;
            var newUserArray = new Array();
            members.forEach(member => {
                var user = {};
                user.userId = member.userID;
                if (member.userID == this.userID) {
                    user.isChairman = "1";
                    found = true;
                } else {
                    user.isChairman = "0";
                }
                newUserArray.push(user);
            });
            if (!found) {
                var user = {};
                user.userId = this.userID;
                user.isChairman = "1";
                newUserArray.push(user);
            }
            members = JSON.stringify(newUserArray);
            var newDeviceArray = new Array();
            devices.forEach(member => {
                var device = {};
                device.deviceId = member.deviceID;
                device.deviceCh = 0; //TODO
                newDeviceArray.push(device);
            });
            devices = JSON.stringify(newDeviceArray);

            dataSDK5.addMeetingGroup(this.userToken, conferenceName, schemeId, description, this.userID, members, devices, function(obj) {
                var resp = {};
                if (obj && obj.ret == 0) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                    resp.Msg = obj.msg
                }

                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = "";
            var meetingUsers = [];
            var meetingDevices = [];
            var playResources = [];
            var playFixResources = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.userID = item.userID;
                it.parentUserID = ""
                meetingUsers.push(it);
            });

            devices && devices.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.deviceID = item.deviceID;
                meetingDevices.push(it);
            });

            if (schemeId == null || schemeId == "") {
                isDefaultScheme = "true"
            } else {
                isDefaultScheme = "false"
            }
            dataSDK6.addBusinessGroup(conferenceName, "Meeting", description, schemeId,
                isDefaultScheme, meetingUsers, meetingDevices, playResources, playFixResources,
                function(obj) {
                    var resp = {}
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp)
                });
        }
    },

    /**
     * 创建预设会议组 New
     * conferenceName:会议名称
     * description:描述
     * schemeId:终端产品中都有显示方案id
     * isEnablePwd:是否启用密码
     * password:密码
     * meetingMode:是否mp，bool
     * isAutoRecord:是否自动录像
     *
     * members:[{index:0,userId:'',isSpectator:true/false}...]
     * devices:[{index:0,deviceId:'',deviceCh:''}...]
     */
    createConferenceGroupNew: function(conferenceName, description, schemeId, isEnablePwd, password, meetingMode, isAutoRecord, members, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var found = false;
            var newUserArray = new Array();
            members.forEach(member => {
                var user = {};
                user.userId = member.userId;
                if (member.userId == this.userID) {
                    user.isChairman = "1";
                    found = true;
                } else {
                    user.isChairman = "0";
                }
                newUserArray.push(user);
            });
            if (!found) {
                var user = {};
                user.userId = this.userID;
                user.isChairman = "1";
                newUserArray.push(user);
            }
            members = JSON.stringify(newUserArray);
            var newDeviceArray = new Array();
            devices.forEach(member => {
                var device = {};
                device.deviceId = member.deviceId;
                device.deviceCh = member.deviceCh;
                newDeviceArray.push(device);
            });
            devices = JSON.stringify(newDeviceArray);
            dataSDK5.addMeetingGroup(this.userToken, conferenceName, schemeId, description, this.userID, members, devices, function(obj) {
                var resp = {};
                if (obj && obj.ret == 0) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                    resp.Msg = obj.msg
                }
                callback(resp);
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = '';
            if (schemeId == null || schemeId == "") {
                isDefaultScheme = true
            } else {
                isDefaultScheme = false
            }
            var meetingUsers = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.userID = item.userId;
                it.isSpectator = item.isSpectator;
                meetingUsers.push(it);
            });
            var meetingDevices = [];
            devices && devices.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.deviceID = item.deviceId;
                meetingDevices.push(it);
            });
            dataSDK6.addMeetingGroup(conferenceName, description, schemeId, isDefaultScheme, isEnablePwd, password, meetingMode, meetingUsers, meetingDevices, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },

    /**
     * 修改预设会议组
     * members:[{index:0,userId:''}...]
     * devices:[{index:0,deviceId:'',deviceCh:''}]
     */
    modifyPresetConferenceGroup: function(groupId, groupName, description, schemeId, members, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

            var found = false;
            var newUserArray = new Array();
            const thisUserId = this.userID;
            members.forEach(function(member, index) {
                var user = {};
                // user.index = index;
                user.userId = member.userId;
                if (member.userId == thisUserId) {
                    user.isChairman = "1";
                    found = true;
                } else {
                    user.isChairman = "0";
                }
                newUserArray.push(user);
            });
            if (!found) {
                var user = {};
                user.userId = this.userID;
                user.isChairman = "1";
                newUserArray.push(user);
            }
            members = JSON.stringify(newUserArray);
            var newDeviceArray = new Array();
            devices.forEach(function(member, index) {
                var device = {};
                // device.index = index;
                device.deviceId = member.deviceId;
                device.deviceCh = member.deviceCh;
                newDeviceArray.push(device);
            });
            devices = JSON.stringify(newDeviceArray);

            dataSDK5.updateMeetingGroup(this.userToken, groupId, schemeId, groupName, description, this.userID,
                members, devices,
                function(obj) {
                    var resp = {};
                    if (obj && obj.ret == 0 && obj.msg == 'success') {
                        resp.Ret = 0;
                    } else {
                        resp.Ret = 1;
                    }

                    callback(resp);
                });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = false;
            var meetingUsers = [];
            var meetingDevices = [];
            var playResources = [];
            var playFixResources = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.userID = item.userId;
                it.parentUserID = ""
                meetingUsers.push(it);
            });

            devices && devices.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.deviceID = item.deviceId;
                meetingDevices.push(it);
            });

            if (schemeId == null || schemeId == "") {
                isDefaultScheme = "true"
            } else {
                isDefaultScheme = "false"
            }
            dataSDK6.editBusinessGroup(groupId, groupName, "Meeting", description, schemeId,
                isDefaultScheme, meetingUsers, meetingDevices, playResources, playFixResources,
                function(obj) {
                    var resp = {}
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp)
                });
        }
    },

    /**
     * 修改预设会议组
     * groupId:会议ID
       groupName:会议名称
     * description:描述
     * schemeId:终端产品中都有显示方案id
     * isEnablePwd:是否启用密码
     * password:密码
     * meetingMode:是否mp，bool
     * isAutoRecord:是否自动录像
     *
     * members:[{index:0,userId:'',isSpectator:true/false}...]
     * devices:[{index:0,deviceId:'',deviceCh:''}...]
     *
     */
    modifyPresetConferenceGroupNew: function(groupId, groupName, description, schemeId, isEnablePwd, password, meetingMode, isAutoRecord, members, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var found = false;
            var newUserArray = new Array();
            const thisUserId = this.userID;
            members.forEach(function(member, index) {
                var user = {};
                // user.index = index;
                user.userId = member.userId;
                if (member.userId == thisUserId) {
                    user.isChairman = "1";
                    found = true;
                } else {
                    user.isChairman = "0";
                }
                newUserArray.push(user);
            });
            if (!found) {
                var user = {};
                user.userId = this.userID;
                user.isChairman = "1";
                newUserArray.push(user);
            }
            members = JSON.stringify(newUserArray);
            var newDeviceArray = new Array();
            devices.forEach(function(member, index) {
                var device = {};
                // device.index = index;
                device.deviceId = member.deviceId;
                device.deviceCh = member.deviceCh;
                newDeviceArray.push(device);
            });
            devices = JSON.stringify(newDeviceArray);

            dataSDK5.updateMeetingGroup(this.userToken, groupId, schemeId, groupName, description, this.userID,
                members, devices,
                function(obj) {
                    var resp = {};
                    if (obj && obj.ret == 0) {
                        resp.Ret = 0;
                    } else {
                        resp.Ret = 1;
                        resp.Msg = obj.msg
                    }

                    callback(resp);
                });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var isDefaultScheme = '';
            if (schemeId == null || schemeId == "") {
                isDefaultScheme = true
            } else {
                isDefaultScheme = false
            }
            var meetingUsers = [];
            members && members.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.userID = item.userId;
                it.isSpectator = item.isSpectator;
                meetingUsers.push(it);
            });
            var meetingDevices = [];
            devices && devices.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.deviceID = item.deviceId;
                meetingDevices.push(it);
            });
            dataSDK6.editMeetingGroup(groupId, groupName, description, schemeId, isDefaultScheme, isEnablePwd, password, meetingMode, meetingUsers, meetingDevices, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });

        }
    },

    /**
     * 删除预设会议组
     * groupIds:['','']
     */
    delPresetConferenceGroup: function(groupIds, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteMeetingGroup(this.userToken, groupIds, function(obj) {
                var resp = {};
                if (obj && obj.ret == 0) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                    resp.Msg = obj.msg
                }

                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeAnyBusinessGroups(groupIds, function(obj) {
                var resp = {}
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },

    /**
     * 获取会议组信息 - 通过groupId
     * token:令牌
     * groupId:组id
     *
     * chairMan:会议主席
     * needPassword: bool
     * password:会议密码
     * isAutoRecord:是否自动录像
     * meetingMode:bool
     *
     * var resp={groupId:'',groupName:'',groupType:'',description:'',schemeId:"",schemeName:"",chairMan:"",needPassword:false,password:"",isAutoRecord:true/false,meetingMode:false
     * users:[{index:'',userId:'',userName:'',isSpectator:true/false}],
     * devices:[{index:'',deviceId:'',deviceName:'',deviceCh:''}]}
     * */
    getMeetingGroupInfoByGroupId: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMeetingGroupInfo(this.userToken, groupId, function(obj) {

                var resp = {}
                if (obj && obj.ret == 0 && obj.data) {
                    resp.groupId = obj.data.groupId;
                    resp.groupName = obj.data.groupName;
                    resp.description = obj.data.description;
                    resp.schemeId = obj.data.schemeId;
                    resp.schemeName = obj.data.schemeName;
                    var users = [];
                    obj.data.userObjs && obj.data.userObjs.forEach(function(item, index) {
                        var it = {};
                        it.index = index;
                        it.userId = item.userId;
                        it.userName = item.userName;
                        // it.isChairman = item.isChairman
                        // it.memberLevel = item.memberLevel
                        // it.upmemberId = item.upmemberID
                        // it.downmemberId = item.downmemberID
                        users.push(it)
                        if (item.isChairman == 1) {
                            resp.chairMan = item.userName;
                        }
                    });
                    var devices = []
                    obj.data.deviceObjs && obj.data.deviceObjs.forEach(function(item, index) {
                        var it = {};
                        it.index = index;
                        it.deviceId = item.deviceId;
                        it.deviceName = item.deviceName;
                        it.deviceCh = item.deviceCh;
                        // it.deviceLevel = item.deviceLevel
                        // it.updeviceId = item.updeviceId
                        // it.downdeviceId = item.downdeviceId
                        devices.push(it)
                    });

                    resp.users = users
                    resp.devices = devices
                    resp.responseCode = 1;

                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleMeetingGroup(groupId, function(obj) {
                var resp = { groupId: "", groupName: "", description: "", schemeId: "", schemeName: "", users: [], devices: [] }
                if (obj && obj.responseCode == 1 && obj.data) {
                    resp.groupId = obj.data.groupID;
                    resp.groupName = obj.data.groupName;
                    resp.description = obj.data.description;
                    resp.schemeId = obj.data.schemeID;
                    resp.groupType = 3
                    resp.needPassword = obj.data.needPassword || false
                    resp.password = obj.data.password || "1234"
                    if (obj.data.isDefaultScheme) { //如果是默认显示方案的话，直接置为空
                        resp.schemeId = ""
                    }
                    resp.schemeName = obj.data.schemeName || "默认方案"
                    resp.chairMan = "" //todo 主席姓名
                    resp.isAutoRecord = false //todo 自动录像
                    resp.meetingMode = obj.data.isMediaProcessing || false

                    var users = []
                    obj.data.meetingUsers && obj.data.meetingUsers.forEach(function(item) {
                        var it = {}
                        it.index = item.index || 0
                        it.userId = item.userID
                        it.userName = item.userName
                        it.isSpectator = item.isSpectator || false
                        if (item.deviceType == 'HWMeetingTerminal') {
                            it.deviceType = 13;
                        }
                        users.push(it);
                    });
                    var devices = []
                    obj.data.meetingDevices && obj.data.meetingDevices.forEach(function(item) {
                        var it = {}
                        it.index = item.index || 0
                        it.deviceId = item.deviceID
                        it.deviceName = item.deviceName
                        it.deviceCh = ''
                        devices.push(it)
                    });
                    resp.users = users
                    resp.devices = devices
                }
                callback(resp);
            });
        }
    },

    /**
     * 设置开启录像[discard 这部分已经融合到创建视频分组中去了]
     *
     * conferenceGroupId: 预设会议组ID
     * enabled: 是否开启录像
     * //todo 终端产品规范中定义了这个功能点
     */
    setRecordingEnabled: function(conferenceGroupId, enabled) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    //*************************************************************************
    /**
     * 主席-开启临时会议,使用系统默认显示方案
     *
     * isMp:是否拼接
     * needPassword: 是否需要密码,
     * members:[{index:0,userID:"",userName:""}..]
     * devices:[{index:0, deviceID:"",deviceCh:"", deviceName:"",deviceSIPID:""}..]
     * spectators:[ {index:0, userID:"", userName:""}...]
     * mediaType: "AV" AV音视频，Audio音频
     */
    startTempConference: function(conferenceName, schemeId, description, isMp,
        operatorName, needPassword, password, members, devices, spectators, mediaType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var newUserArray = new Array();
            var found = false;
            members.forEach(member => {
                var user = {
                    userId: member.userID
                };
                if (member.userID == this.userID) {
                    found = true;
                }
                newUserArray.push(user);
            });
            if (!found) {
                var user = {
                    userId: this.userID
                }
                newUserArray.push(user);
            }

            var newDeviceArray = new Array();
            devices.forEach(member => {
                var device = {
                    deviceId: member.deviceID,
                    deviceCh: member.deviceCh
                }
                newDeviceArray.push(device);
            });

            businessSDK5.publishStartTempMeeting(this.userToken, conferenceName, this.userID, newUserArray, newDeviceArray, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

            var devicesMe = []
            devices.forEach((item) => {
                var row = {}
                row.deviceID = item.deviceID
                row.deviceName = item.deviceName
                row.deviceSIPID = item.deviceSIPID
                row.index = item.index
                devicesMe.push(row)
            })
            businessSDK6.publishStartConference(conferenceName, description, schemeId, isMp, operatorName, needPassword, password,
                members, devicesMe, spectators, mediaType);
        }
    },

    /**
     * 主席-开启预设会议
     * conferenceId:会议id
     * conferenceName:对于V6为scheme.
     */
    startPresetConference: function(groupId, topic, mediaType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartMeeting(this.userToken, topic, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartGroupConference(groupId, mediaType);
        }
    },

    /**
     * 主席-关闭(临时/预设)会议
     * token:令牌
     * conferenceId:会议id
     * */
    stopConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopMeeting(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopConference(conferenceId);
        }
    },
    /**
     * 开启会议回调
     * {groupID:"",data:[{screenIndex:"", videoRTPId:"", audioRTPId:"", resourceID:"", resourceType:""},..]}
     */
    setReceiveInformGroupStartMediaCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformGroupStartMediaCallback(function(obj) {
                callback(obj)
            });
        }
    },

    /**
     * 刷新会议回调
     * {groupID:"",data:[{screenIndex:"", videoRTPId:"", audioRTPId:"", resourceID:"", resourceType:""},..]}
     */
    setReceiveInformRefreshGroupMediaCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformRefreshGroupMediaCallback(function(obj) {
                callback(obj)
            });
        }
    },

    /**
     * 刷新会议回调
     * {groupID:""}
     */
    setReceiveInformStopGroupMediaCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformStopGroupMediaCallback(function(obj) {
                callback(obj)
            });
        }
    },

    //***************************会议操作***********************************************************
    /**
     * 主席-添加成员
     *
     * conferenceId: 会议ID
     * members:[{index:'',userId:'',userName:'',resourceType:''}...]
     */
    addMember: function(conferenceId, members) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var users = []
            members.forEach(function(item) {
                var it = {}
                it.userId = item.userId
                users.push(it)
            });
            businessSDK5.publishAddMeetingMember(this.userToken, conferenceId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var users = []
            members && members.forEach(function(item) {
                var it = {}
                it.index = item.index;
                it.userID = item.userId;
                it.userName = item.userName;
                it.resourceType = item.resourceType;
                users.push(it)
            });
            businessSDK6.publishAddMembersFromConference(conferenceId, users);
        }
    },

    /**
     * 主席-强退成员
     * token:令牌
     * conferenceId: 会议ID
     * memberIds:成员列表[{userId:''}...]
     */
    removeMember: function(conferenceId, memberIds) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishKickMeetingMember(this.userToken, conferenceId, memberIds);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var users = []
            memberIds.forEach(function(item) {
                users.push(item.userId)
            });
            businessSDK6.publishRemoveMembersFromConference(conferenceId, users);
        }
    },

    /**
     * 成员-申请退出会议
     * conferenceId: 会议ID
     * isSpectator:是否旁观退出 V6
     * //v6成员退出和旁观者退出是两个参数,已经确认为两个
     */
    applyLeaveConference: function(conferenceId, isSpectator) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishRequestMeetingExit(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (isSpectator === false) {
                businessSDK6.publishMemberLeaveFromConference(conferenceId);
            } else if (isSpectator === true) {
                businessSDK6.publishSpectatorLeaveFromConference(conferenceId);
            }

        }
    },

    /**
     * 主席-指定发言
     *
     * conferenceId: 会议ID
     * memberId: 成员ID
     */
    appointSpeaking: function(conferenceId, memberIds) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var userId = "";
            if (memberIds.length > 0) {
                userId = memberIds[0].userId;
            }
            businessSDK5.publishAppointMeetingTalk(this.userToken, conferenceId, userId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let memberId = memberIds[0].userId;
            businessSDK6.publishSetSpeakerFromConference(conferenceId, memberId);
        }
    },

    /**
     * 主席-收回发言
     * conferenceId: 会议ID
     */
    cancelSpeakingByChairman: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishReclaimMeetingTalk(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCancelSpeakerFromConference(conferenceId);
        }
    },

    /**
     * 成员-申请发言
     * conferenceId: 会议ID
     */
    applySpeakingByMember: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishRequestMeetingTalk(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberSpeakFromConference(conferenceId, false);
        }
    },

    /**
     * 成员-取消发言
     *
     * conferenceId: 会议ID
     */
    finishSpeaking: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopMeetingTalk(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberSpeakFromConference(conferenceId, true);
        }
    },

    /**
     *  成员-加入会议
     *  conferenceId: 会议ID
     */
    joinConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberJoinFromConference(conferenceId);
        }
    },

    //**********************会议讨论*********************************************************************

    /**
     * 主席-开启会议讨论
     * conferenceId: 会议ID
     */
    startConferenceDiscussion: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartMeetingDiscuss(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },

    /**
     * 主席-关闭会议讨论
     *
     * conferenceId: 会议ID
     */
    stopConferenceDiscussion: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopMeetingDiscuss(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }
    },


    //*********************音频控制**********************************************************************

    /**
     * 主席-禁音成员
     *
     * conferenceId: 会议ID
     * memberId: 成员ID
     */
    muteMember: function(conferenceId, memberId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 主席-取消禁音成员
     *
     * conferenceId: 会议ID
     * memberId: 成员ID
     */
    cancelMuteMember: function(conferenceId, memberId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 主席-禁音所有成员
     * conferenceId: 会议ID
     */
    muteConferenceAll: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetMutedFromConference(conferenceId, true);
        }
    },

    /**
     * 主席-取消禁音所有成员
     * conferenceId: 会议ID
     */
    cancelMuteConferenceAll: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetMutedFromConference(conferenceId, false);
        }
    },

    //*********************指定主席*******************************************************************
    /**
     * 主席-指定主席
     * conferenceId: 会议ID
     * memberId: 成员ID
     */
    appointChairman: function(conferenceId, memberId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 成员-申请主席
     * conferenceId: 会议ID
     */
    applyChairman: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    //********************旁观会议******************************************************************
    /**
     * 成员-启用旁观会议
     *
     * conferenceId: 会议ID
     */
    openSpectateConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 成员-关闭旁观会议
     *
     * conferenceId: 会议ID
     */
    closeSpectateConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    //*******************会议录像*******************************************************************
    /**
     * 主席-开启录像（会议中）
     *
     * conferenceId: 会议ID
     */
    startMeetRecording: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 主席-关闭录像（会议中）
     *
     * conferenceId: 会议ID
     */
    stopMeetRecording: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 主席-暂停会议
     * */
    pauseConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishPauseMeeting(this.userToken, conferenceId)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetPausedFromConference(conferenceId, true);
        }
    },
    /**
     * 恢复会议
     * */
    resumeConference: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishResumeMeeting(this.userToken, conferenceId)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetPausedFromConference(conferenceId, false);
        }
    },

    /**
     * 会议切换显示方案
     * */
    switchMeetingDisplayScheme: function(conferenceId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishChangeDisplayScheme(this.userToken, conferenceId, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 用户申请入会
     * conferenceId:会议id
     * clientUser:客户端用户
     * isSpectator:是否旁观者
     * clientUser:{userId:"",userName:"",isSpectator:true/false,password:""}
     * */
    applyJoinMeetingByUser: function(conferenceId, clientUser) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishApplyJoinFromConference(conferenceId, clientUser.isSpectator, clientUser.userName, clientUser.password);
        }
    },

    /**
     * 获取所有正在开的会议
     *
     * var resp =[{conferenceId:"",conferenceName:"",chairManName:"",description:"",
     * isNeedPwd:true/false,meetingTime:""}]
     *
     *
     * 其中：isNeedPwd:表示是否需要密码,description:会议描述
     * */
    getAllOnMeeting: function(conferenceName, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryAllConferenceListItems(function(obj) {
                var resp = []
                if (obj.responseCode == 1 && obj.data.list.length > 0) {
                    obj.data.list.forEach(function(item) {
                        var it = {};
                        it.conferenceId = item.sceneID;
                        it.conferenceName = item.sceneName;
                        it.description = item.description;
                        it.chairManName = item.chairmanName;
                        it.meetingTime = item.beginTime;
                        it.isNeedPwd = item.needPassword || false;
                        resp.push(it);
                    })
                }
                callback(resp);
            });
        }

    },

    /**
     * 通过ID 查询正在进行会议的明细
     *
     * var resp ={conferenceId:"",conferenceName:"",conferenceTime:"",chairMan:""，chairManId:"",description:"",schemeId:"",schemeName:"",isAutoRecord:false,meetingMode:false
     *  users:[{index:'',userId:'',userName:'',isSpectator:true/false}],
     *  devices:[{index:'',deviceId:'',deviceName:'',deviceCh:''}]}
     *
     * */
    queryOnMeeting: function(conferenceId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getSingleConferenceDetail(conferenceId, function(obj) {
                var resp = [{
                    conferenceId: "",
                    conferenceName: "",
                    chairManName: "",
                    description: "",
                    isNeedPwd: "",
                    meetingTime: "",
                    users: [],
                    devices: []
                }]

                if (obj.responseCode == 1) {
                    resp.conferenceId = obj.data.sceneID;
                    resp.conferenceName = obj.data.sceneName;
                    resp.conferenceTime = obj.data.beginTime;
                    resp.chairMan = obj.data.chairman.userName;
                    resp.chairManId = obj.data.chairman.userID;
                    resp.description = obj.data.description || "";
                    resp.schemeId = obj.data.schemeID || "";
                    resp.schemeName = obj.data.schemeName || "默认方案";
                    //resp.isAutoRecord = obj.data.isAutoRecord || false;
                    resp.meetingMode = obj.data.isMediaProcessing || false;

                    var users = []
                    item.members && item.members.forEach(function(itemu) {
                        var it = {}
                        it.index = itemu.index || 0
                        it.userId = itemu.userID
                        it.userName = itemu.userName
                        it.isSpectator = false
                        users.push(it);
                    });
                    item.spectators && item.spectators.forEach(function(itemu) {
                        var it = {}
                        it.index = itemu.index || 0
                        it.userId = itemu.userID
                        it.userName = itemu.userName
                        it.isSpectator = true
                        users.push(it);
                    });
                    resp.users = users;

                    var devices = []
                    item.devices && item.devices.forEach(function(itemd) {
                        var it = {}
                        it.index = itemd.index || 0
                        it.deviceId = itemd.deviceID
                        it.deviceName = itemd.deviceName
                        it.deviceCh = ''
                        devices.push(it)
                    });
                    resp.devices = devices;
                }
                callback(resp);
            });

        }

    },

    /**
     * 主席同意/拒绝组员入会
     * conferenceId:会议id
     * clientId:申请人id
     * isAccept:true为同意，false为不同意
     * */
    answerJoinMeetingByChairMan: function(conferenceId, clientId, isAccept) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishAnswerApplyJoinFromConference(conferenceId, clientId, isAccept);
        }
    },

    /**
     * 开启会场转发授权
     * */
    startMeetingTransmitAuth: function(conferenceId, users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartMeetingTransmitAuth(this.userToken, conferenceId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 停止会场转发授权
     * */
    stopMeetingTransmitAuth: function(conferenceId, users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopMeetingTransmitAuth(this.userToken, conferenceId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取会场转发授权列表
     * */
    queryMeetingTransmitAuth: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishQueryMeetingTransmitAuth(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取会场转发授权列表回调
     * */
    setReceiveMeetingTransmitAuthCallBack: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMeetingTransmitAuthInfoCallBack(function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取会场转发成员
     * */
    queryMeetingTansmitMember: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishQueryMeetingTansmitMember(this.userToken, conferenceId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取会场转发授权列表回调
     * */
    setReceiveMeetingTransmitMemberCallBack: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMeetingTransmitMemberInfoCallBack(function(obj) {
                // [{memberId:"",memberName:"",inGroup:0/1,status:0/1/2,parentId:""}]
                var members = [];
                obj.forEach(item => {
                    var it = {}
                    it.resId = item.memberId
                    it.resName = item.memberName

                    if (item.status == "1") {
                        it.isOnline = "online";
                    } else if (item.status == "0") {
                        it.isOnline = "offline";
                    } else if (item.status == "2") {
                        it.isOnline = "breakdown"
                    }
                    it.inGroup = item.inGroup == "1" ? true : false;
                    it.resType = 0
                    it.parentId = item.parentId
                    members.push(it)
                });
                callback(members);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    //************************场景*******************************************************************************

    /**
     * 通知刷新场景列表
     * sceneId:场景id
     * sceneName:场景名称
     * isActived:false  //是否处于激活状态
     * schemeId:方案id
     * isSchemeActived:true/false //是否方案处于激活状态
     *
     * var resp={operate:"init/add/refresh/remove",rows:[{sceneId:'',sceneName:'',sceneType:'',isActived:true/false, schemeId:'', schemeName:'', isSchemeActived:true/false}]}
     * */
    setInformRefreshSceneListCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveAffairListCallback(function(obj) {
                if (obj) {
                    if (obj.type) {
                        if ('init' === obj.type) {
                            var resp = { operate: '', rows: [] };
                            resp.operate = obj.type;
                            obj.init && obj.init.forEach(function(item) {
                                var row = { sceneId: '', sceneName: '', isActived: false, schemeId: '', schemeName: '', isSchemeActived: true, masterId: "", masterName: "" }
                                row.sceneId = item.affairId;
                                row.sceneName = item.affairName
                                row.sceneType = item.affairType
                                row.isActived = item.status == 1 ? true : false;
                                row.schemeId = item.schemeId;
                                row.schemeName = item.schemeName;
                                row.isSchemeActived = true;
                                row.masterId = item.masterId;
                                row.masterName = item.masterName;
                                resp.rows.push(row);
                            })
                            callback(resp);
                        } else if ('add' === obj.type) {
                            var rows = obj.add.map(item => {
                                return {
                                    sceneId: item.affairId,
                                    sceneName: item.affairName,
                                    sceneType: item.affairType,
                                    isActived: item.status == 1 ? true : false,
                                    schemeId: item.schemeId,
                                    schemeName: item.schemeName,
                                    isSchemeActived: true,
                                    masterId: item.masterId,
                                    masterName: item.masterName
                                };
                            });
                            var resp = { operate: obj.type, rows: rows };
                            callback(resp);
                        } else if ('remove' === obj.type) {
                            let rows = obj.remove.map(item => { return { sceneId: item.affairId } })
                            var resp = { operate: obj.type, rows: rows };

                            callback(resp);
                        } else if ('refresh' === obj.type) {
                            var resp = { operate: '', rows: [] };
                            resp.operate = obj.type;
                            var refresh = obj.refresh;
                            var row = { sceneId: '', sceneName: '', isActived: false, schemeId: '', schemeName: '', isSchemeActived: true, masterId: "", masterName: "" }
                            refresh.forEach(item => {
                                row.sceneId = item.affairId;
                                row.sceneName = item.affairName
                                row.isActived = item.status == 1 ? true : false;
                                row.schemeId = item.schemeId;
                                row.schemeName = item.schemeName;
                                row.isSchemeActived = true;
                                row.masterId = item.masterId;
                                row.masterName = item.masterName;
                                resp.rows.push(row);
                            })
                            callback(resp);
                        }
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformRefreshSceneListCallback(function(obj) {
                var resp = { operate: 'init', rows: [] }
                resp.operate = "init"
                obj.list && obj.list.forEach(function(item) {
                    var row = { sceneId: '', sceneName: '', isActived: false, schemeId: '', isSchemeActived: true }
                    row.sceneId = item.sceneID
                    row.sceneName = item.sceneName
                    row.isActived = item.isActived
                    row.schemeId = "" //V6暂时没有
                    row.isSchemeActived = true
                    row.sceneType = 'meeting' //默认会议
                    if (item.sceneType == 'pollPlay') {
                        //row.sceneType = 4
                    }
                    row.masterId = '';
                    row.masterName = '-';
                    resp.rows.push(row)
                })
                callback(resp)
            })
        }
    },
    /**
     * 通知刷新场景明细
     /**
     * isOnline:"offline"/"online"/"bebusy"/"onlineJoin"/"onlineNotJoin"/"breakdown"
     * role:"speak"/"member"/"chairman"
     * inGroup:true:入会,false:未入会
     * resType:参见enumResType
     *
     * var resp ={
     *     operate:init/refresh/stop/refresh2/addMember/removeMember/discuss, //todo V6来说，这里填写init
     *     conferenceId:'',
     *     conferenceName:'',
     *     init:{
     *         members:[{resId:'',resName:'',isOnline:"参照上面的isOnline定义",role:"参照上面的role定义",inGroup:true/false,resType:"参照上面的resType定义",isSpectator:true/false}],
     *         devices:[{resId:'',resCh:'',resName:'',isOnline:"参照上面的isOnline定义"，resType:"参照上面的resType定义"}]
     *     },
     *     refresh:[{resId:''resName:'',resCh:'',isOnline:"参照上面的isOnline定义",inGroup:true/false,role:"参照上面的role定义",resType:"参照上面的resType定义"}],
     *     addMember:[{resId:''resName:'',resCh:'',isOnline:"参照上面的isOnline定义",inGroup:true/false,role:"参照上面的role定义",resType:"参照上面的resType定义"}],
     *     removeMember:[{resId:'',resCh:''}],
     *     discuss:{status:0/1}, 0:退出讨论，1：开启讨论
     *     pause:{status:0/1},   0:表示暂停，1：表示恢复
     *     isMP:{status:0/1}, 0:非MP，1:MP拼接
     * }
     * */
    setInformRefreshMeetingStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveInformMeetingStatusCallback(function(obj) {
                var resp = {
                    operate: '',
                    conferenceId: '',
                    conferenceName: '',
                    init: {
                        members: [],
                        devices: []
                    },
                    refresh: [],
                    addMember: [],
                    removeMember: [],
                    discuss: {
                        status: 0
                    },
                    pause: {
                        status: 0
                    },
                    isMP: {
                        status: 0
                    }
                };
                resp.conferenceId = obj.affairId;
                resp.conferenceName = obj.topic;

                if (obj.meetingStatus == "StartMeeting") {
                    resp.operate = "init";
                    obj.start && obj.start.users && obj.start.users.forEach(item => {
                        var it = {};
                        it.resId = item.userId;
                        it.resName = item.userName;

                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }

                        if (obj.start.chairmanId == item.userId) {
                            it.role = "chairman"; //Enum.enumRoleType.chairman; //主席
                        } else if (item.buss == "1") {
                            it.role = "speak"; //Enum.enumRoleType.speak; //发言人
                        } else {
                            it.role = "member"; //Enum.enumRoleType.member; //成员
                        }
                        it.inGroup = item.inGroup == "1" ? true : false;
                        it.resType = 0
                        it.isSpectator = false
                        resp.init.members.push(it);
                    });

                    obj.start && obj.start.devices && obj.start.devices.forEach(item => {
                        var it = {}
                        it.resId = item.deviceId
                        it.resName = item.deviceName
                        it.deviceCh = item.deviceCh
                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        it.resType = 1

                        resp.init.devices.push(it);
                    });
                } else if (obj.meetingStatus === "Refresh") {
                    resp.operate = "refresh2";
                    obj.refresh && obj.refresh.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resName = item.userName
                        if (item.status === "1") {
                            it.isOnline = "online";
                        } else if (item.status === "0") {
                            it.isOnline = "offline";
                        } else if (item.status === "2") {
                            it.isOnline = "breakdown"
                        }

                        if (item.buss == "1") {
                            it.role = "speak";
                        } else {
                            it.role = "member"; //include chairman and member
                        }
                        it.inGroup = item.inGroup === "1" ? true : false;
                        //todo V5暂时全当人处理
                        it.resType = 0
                        resp.refresh.push(it)
                    })
                } else if (obj.meetingStatus === "AddMember") {
                    resp.operate = "addMember";
                    obj.addMember && obj.addMember.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resName = item.userName
                        if (item.status === "1") {
                            it.isOnline = "online";
                        } else if (item.status === "0") {
                            it.isOnline = "offline";
                        } else if (item.status === "2") {
                            it.isOnline = "breakdown"
                        }

                        if (item.buss == "1") {
                            it.role = "speak";
                        } else {
                            it.role = "member";
                        }
                        it.inGroup = item.inGroup === "1" ? true : false;

                        //todo V5先当人处理
                        it.resType = 0

                        resp.addMember.push(it)
                    })
                } else if (obj.meetingStatus === "RemoveMember") {
                    resp.operate = "removeMember";
                    obj.removeMember && obj.removeMember.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        resp.removeMember.push(it)
                    })
                } else if (obj.meetingStatus === "DiscussMeeting") {
                    resp.operate = "discuss";
                    resp.discuss.status = obj.discuss.status;
                } else if (obj.meetingStatus === "PauseMeeting") {
                    resp.operate = "pause";
                    resp.pause.status = 0;
                } else if (obj.meetingStatus === "ResumeMeeting") {
                    resp.operate = "pause";
                    resp.pause.status = 1;
                } else if (obj.meetingStatus === "MeetingScheme") {

                }
                callback(resp);
            });
            businessSDK5.setReceiveInformMeetingStatusCallback2(function(obj) {
                if (obj && obj.meetingStatus === "StopMeeting") {
                    var resp = { operate: "stop", conferenceId: '' };
                    resp.conferenceId = obj.affairId;
                    callback(resp)
                }
            });
            businessSDK5.setReceiveMeetingAffairInfoCallback(function(obj) {
                // var resp = {};
                var resp = {
                    operate: '',
                    conferenceId: '',
                    conferenceName: '',
                    init: {
                        members: [],
                        devices: []
                    },
                    // refresh: [],
                    // addMember: [],
                    // removeMember: [],
                    discuss: {
                        status: 0
                    },
                    // pause: {
                    //     status: 0
                    // },
                    // isMP: {
                    //     status: 0
                    // }
                };
                if (obj && obj.affairType == "meeting") {
                    if (obj.type == "init") {
                        resp.operate = "init";
                        resp.init = { members: [], devices: [] };
                        resp.conferenceId = obj.init.affairId;
                        resp.conferenceName = obj.init.affairName;
                        obj.init.users && obj.init.users.forEach(item => {
                            var it = {};
                            it.resId = item.userId;
                            it.resName = item.userName;

                            if (item.status == "1") {
                                it.isOnline = "online";
                            } else if (item.status == "0") {
                                it.isOnline = "offline";
                            } else if (item.status == "2") {
                                it.isOnline = "breakdown"
                            }

                            if (obj.init.launcherId == item.userId) {
                                it.role = "chairman"; //Enum.enumRoleType.chairman; //主席
                            } else if (obj.init.meeting.speakerId == item.userId) {
                                it.role = "speak"; //Enum.enumRoleType.speak; //发言人
                            } else {
                                it.role = "member"; //Enum.enumRoleType.member; //成员
                            }
                            it.inGroup = item.inGroup == "1" ? true : false;
                            it.resType = 0
                            it.isSpectator = false
                            resp.init.members.push(it);
                        });

                        obj.init.devices && obj.init.devices.forEach(item => {
                            var it = {}
                            it.resId = item.deviceId
                            it.resName = item.deviceName
                            it.deviceCh = item.deviceCh
                            if (item.status == "1") {
                                it.isOnline = "online";
                            } else if (item.status == "0") {
                                it.isOnline = "offline";
                            } else if (item.status == "2") {
                                it.isOnline = "breakdown"
                            }
                            it.resType = 1

                            resp.init.devices.push(it);
                        });

                        resp.discuss.status = obj.init.meeting.discuss;
                    } else if (obj.type == "remove") {
                        resp.operate = "stop";
                        resp.conferenceId = obj.remove.affairId;
                    }
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformRefreshActivedSceneDetailCallback(function(obj) {
                if (obj.sceneType !== 4 && obj.sceneType !== 5) {
                    let members = [];
                    members = obj.members && obj.members.map(item => {
                        return {
                            resId: item.userID,
                            resName: item.userName,
                            isOnline: item.status,
                            role: item.role,
                            resType: 0,
                            deviceType: item.deviceType == 'HWMeetingTerminal' ? 13 : '',
                            isSpectator: false,
                            inGroup: item.status == 'offline' || item.status == 'onlineOutMeeting' ? false : true,
                            audioAbility: item.audioAbility,
                            videoAbility: item.videoAbility,
                            microphoneAbility: item.microphoneAbility,
                            isShare: item.isShare,
                            isJoinWhiteBoard: item.isJoinWhiteBoard
                        }
                    });
                    obj.spectator && obj.spectator.forEach((item) => {
                        members.push({
                            resId: item.userID,
                            resName: item.userName,
                            isOnline: item.status,
                            role: 'member',
                            resType: 0,
                            deviceType: item.deviceType == 'HWMeetingTerminal' ? 13 : '',
                            isSpectator: true,
                            inGroup: item.status == 'offline' || item.status == 'onlineOutMeeting' ? false : true,
                            audioAbility: item.audioAbility,
                            videoAbility: item.videoAbility,
                            microphoneAbility: item.microphoneAbility,
                        })
                    })
                    let devices = obj.device && obj.device.map(item => {
                        return {
                            resId: item.userID,
                            resName: item.userName,
                            isOnline: item.status,
                            resType: 1
                        }
                    })
                    var resp = {
                        operate: 'init',
                        operateId: '',
                        conferenceId: obj.sceneID,
                        conferenceName: obj.sceneName,
                        description: obj.description,
                        mediaType: obj.mediaType,
                        sceneType: obj.sceneType,
                        init: {
                            members: members,
                            devices: devices,
                        },
                        isMP: {
                            status: obj.isMp ? 1 : 0
                        }
                    }
                    console.log(resp)
                    callback(resp);
                }
            })
            businessSDK6.setReceiveInformRemoveActivedSceneDetailCallback(function(obj) {
                var resp = { operate: "stop", conferenceId: obj.schemeID }
                callback(resp);
            });
        }
    },

    /**
     * 开启业务显示方案
     * @param {*} affairId
     * @param {*} schemeId
     */
    publishStartSceneScheme: function(affairId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartAffairScheme(this.userToken, affairId, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetIsActivedScene(affairId, true);
        }
    },

    /**
     * 停止业务显示方案
     * @param {*} affairId
     * @param {*} schemeId
     */
    publishStopSceneScheme: function(affairId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopAffairScheme(this.userToken, affairId, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 切换业务显示方案
     * @param {*} affairId
     * @param {*} schemeId
     */
    publishReplaceSceneScheme: function(affairId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishReplaceAffairScheme(this.userToken, affairId, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *  场景停止
     *  sceneID:场景id
     * */
    publishStopScene: function(sceneId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopAffair(this.userToken, sceneId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopScene(sceneId);
        }
    },

    /**
     * 订阅当前所有业务场景列表
     */
    publicSubscribeSceneList: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeAffairList(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 取消订阅当前所有业务场景列表
     */
    publicCancelSubscribeSceneList: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeAffairList(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 订阅业务场景实时状态
     * @param {*} affairID
     */
    publicSubscribeSceneDetail: function(affairID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeAffairDetail(this.userToken, affairID);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 取消订阅业务场景实时状态
     * @param {*} affairID
     */
    publicCancelSubscribeSceneDetail: function(affairID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeAffairDetail(this.userToken, affairID);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },



    // -------------------------------- 绑定解码器 -------------------------------------------------
    /**
     * 获取编码器列表
     * beginIndex:页码
     * count:条数
     * var resp ={totalCount:'',data:[{deviceId:'',deviceCh:'',deviceName:'',ipAddress:''}]}
     * */
    getEncodersByLimit: function(page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getDevices(this.userToken, "", function(obj) {
                var resp = { totalCount: '', data: [] }
                obj.data && obj.data.forEach(function(item) {
                    var row = {}
                    row.deviceId = item.deviceId
                    row.deviceCh = item.deviceCh
                    row.deviceName = item.deviceName
                    row.ipAddress = item.deviceIp
                    resp.data.push(row)

                })
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var beginIndex = this._convertToBeginIndex(page, pageSize)
            // var queryType = ["SIPEncoder", "GBSIPEncoder", "XTSoftEncoder", "OnvifEncoder"].join(",")
            var queryType = ["SIPEncoder", "GBSIPEncoder", "OnvifEncoder"].join(",")
            dataSDK6.queryDeviceList(queryType, beginIndex, pageSize, function(obj) {
                var resp = { totalCount: '', data: [] }
                obj.data.list && obj.data.list.forEach(function(item) {
                    var row = {}
                    row.deviceId = item.deviceID
                        // row.deviceType = item.deviceType
                    row.deviceCh = 0
                    row.deviceName = item.deviceName
                    row.ipAddress = item.ipAddress
                    resp.data.push(row)

                })
                callback(resp);
            });
        }
    },
    /**
     * 验证终端是否已经注册V5
     * resp={Ret=0}//0.true,1.false
     * */
    isRegister: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.IsRegister(this.userToken, function(obj) {

            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return;
        }


    },
    /**
     * callItem:呼叫习惯，0:自动响应，1.手动响应
     * encoderItem:绑定的编码器id
     * encoderCh:编码器通道
     * decoderItem:绑定的解码器id
     * meetingItem:会议习惯。0.自动响应,1.手动响应
     * isOutScreen:0.不输出大屏,1.输出大屏. 呼叫上大屏
     * screens:[{screenId:"",screenMode:"",code:"",pos:""}]
     *
     * isOneKeyToScreen:0.不输出,1.输出. 是否一键上大屏
     * screensForOneKey:[{screenId:"",screenMode:"",code:"",imagesKey:""}..],其中imagesKey:"leftBtn"/"rightBtn"
     *
     * isRing:0.停止播放,1.播放,是否振铃
     *
     * var resp ={Ret:0/1,message:''}
     * */
    setUserCustom: function(userId, callItem, encoderItem, decoderItem, meetingItem, encoderCh, isOutScreen, screens, isRing, isOneKeyToScreen, screensForOneKey, isLocalEncoderID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var screenParams = JSON.stringify(screens)
            var self = this
            var autoAccept;
            if (callItem == 0) {
                autoAccept = 1;
            } else if (callItem == 1) {
                autoAccept = 0;
            }
            dataSDK5.setCallBehavior(this.userToken, autoAccept, isRing, isOutScreen, screenParams, function(obj) {
                if (obj && obj.ret === 0) {
                    dataSDK5.setBindDevice(self.userToken, encoderItem, encoderCh, function(obj) {
                        if (obj && obj.ret === 0) {
                            callback({
                                Ret: 0,
                                message: obj.msg ? obj.msg : ''
                            })
                        } else {
                            callback({
                                Ret: 1,
                                message: obj.msg ? obj.msg : ''
                            })
                        }
                    });
                } else {
                    callback({
                        Ret: 1,
                        message: obj.msg ? obj.msg : ''
                    })
                }
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var meetingParam = "AUTO";
            var callParam = "AUTO";
            if (meetingItem == 0) {
                meetingParam = "AUTO"
            }
            if (meetingItem == 1) {
                meetingParam = "MANUAL"
            }
            if (callItem == 0) {
                callParam = "AUTO"
            }
            if (callItem == 1) {
                callParam = "MANUAL"
            }
            dataSDK6.setUserCustom(userId, callParam, encoderItem, decoderItem, meetingParam, isLocalEncoderID, function(obj) {
                var resp = {}
                if (obj && obj.responseCode == 1) {
                    callback({ Ret: 0 })
                } else {
                    callback({ Ret: 1 })
                }
            });
        }
    },


    /**
     * 获取用户习惯
     * callItem:0.自动响应,1.手动响应
     * encoderItem:绑定的编码器
     * encoderName:编码器名称
     *
     * decoderItem:绑定的解码器
     * decoderName:解码器名称
     * meetingItem:0.自动响应,1.手动响应
     *
     * isOutScreen:0.不输出大屏,1.输出大屏
     * screens:[{screenId:"",screenMode:"",code:"",pos:""}]
     * isRing:0.停止播放,1.播放
     *
     * isOneKeyToScreen:0.不输出,1.输出，是否一键上大屏
     * screensForOneKey:[{screenId:"",screenMode:"",code:"",imagesKey:""}..]
     *
     * var resp={userID:'',callItem:'',encoderId:'',encoderCh:'',encoderName:'',decoderId:'',decoderName:'',
     * meetingItem:'',isOutScreen:0,screens:[],isRing:0/1,isOneKeyToScreen:0,screensForOneKey}
     * */
    getUserCustom: function(callback) {
        var resp = {}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var self = this
            dataSDK5.getBindDevice(this.userToken, function(obj) {

                resp = {}
                if (obj.ret == 0 && obj.data) {
                    resp.userID = obj.data.userID
                    if (obj.data.binddat) {
                        //console.log('绑定编码器：' + obj.data.binddat.deviceName);
                        resp.encoderId = obj.data.binddat.deviceId
                        resp.encoderName = obj.data.binddat.deviceName
                        resp.encoderCh = obj.data.binddat.deviceCh
                    }

                    dataSDK5.queryCallBehavior(self.userToken, function(obj) {

                        if (obj.ret == 0 && obj.data) {
                            //   resp.callItem = obj.data.autoAccept
                            if (obj.data.autoAccept == 0) {
                                resp.callItem = 1;
                            } else if (obj.data.autoAccept == 1) {
                                resp.callItem = 0;
                            }
                            resp.ring = obj.data.ring
                            resp.outputScreen = obj.data.outputScreen
                            if (obj.data.screen && obj.data.screen.length > 0) {
                                resp.screens = []

                            }
                            callback(resp)
                        } else {
                            callback(resp)
                        }
                    });
                } else {
                    callback(resp)
                }
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getUserCustom(function(obj) {
                if (obj.responseCode == 1 && obj.data) {
                    resp.userID = obj.data.userID
                    if (obj.data.callItem == "AUTO") {
                        resp.callItem = 0
                    }
                    if (obj.data.callItem == "MANUAL") {
                        resp.callItem = 1
                    }
                    resp.encoderId = obj.data.encoderItem
                    resp.encoderName = obj.data.encoderItemName
                    resp.encoderCh = 0

                    resp.decoderItem = obj.data.decoderItem
                    resp.decoderItemName = obj.data.decoderItemName

                    if (obj.data.meetingItem === "AUTO") {
                        resp.meetingItem = 0
                    }
                    if (obj.data.meetingItem === "MANUAL") {
                        resp.meetingItem = 1
                    }

                    resp.isOutScreen = 0
                    resp.screens = []
                    resp.isRing = 0
                    resp.isLocalEncoderID = obj.data.isLocalEncoderID || false
                    callback(resp)
                }
            });
        }

    },

    /**
     * 查询设备列表,这个接口是用来更加名称来查询的接口
     * var resp ={totalCount:'',data:[{deviceId:'',deviceCh:'',deviceName:'',ipAddress:''}]}
     * */
    queryDevicesForCustom: function(deviceName, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getDevices(this.userToken, deviceName, function(obj) {
                var resp = { totalCount: '', data: [] }
                if (obj.ret == 0) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.deviceId = item.deviceId;
                        it.deviceCh = item.deviceCh;
                        it.deviceName = item.deviceName;
                        it.ipAddress = item.deviceIp;
                        resp.data.push(it);
                    })
                    resp.totalCount = obj.data.length;
                }
                callback(resp);
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    // ------------------------------------ 预置点管理 -------------------------------------------------

    /**
     * 新增预置点
     * pointName:预置点名称
     * resourceId:设备id
     * resourceCh:设备通道
     * var resp={Ret =0/1}
     * 注:其中Ret=0表示成功，Ret=1表示失败
     *
     * groupId传null时表示向组外新增，传真实值时表示向组内添加
     * */
    addYTPoint: function(pointName, resourceId, goupId, resourceCh, encoderSIPID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (goupId) {
                dataSDK5.addPrepoint2Group(this.userToken, resourceId, resourceCh, goupId, pointName, function(obj) {
                    var resp = {}
                    resp.Ret = obj.ret
                    callback(resp)
                })
            } else {
                dataSDK5.addPrepoint(this.userToken, resourceId, resourceCh, pointName, function(obj) {
                    var resp = {}
                    resp.Ret = obj.ret
                    callback(resp)
                });
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.addUserYTPoint('', pointName, this.userID, resourceId, "111", encoderSIPID, function(obj) {
                var resp = { Ret: '' }
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    /**
     * 删除预置点
     * resourceId:资源id
     * resourceCh:资源通道
     * pointId:删除的预置点的id
     * var resp ={Ret:0/1}
     */
    removeYTPoint: function(resourceId, resourceCh, pointId, encoderSIPID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deletePrepoint(this.userToken, resourceId, resourceCh, pointId, function(obj) {
                var resp = {}
                resp.Ret = obj.ret;
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeUserYTPoint(pointId, encoderSIPID, function(obj) {
                var resp = { Ret: '' };
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    /**
     * 获取所有的预置点
     * resourceId:资源Id
     * resourceCh:资源通道
     *
     * var resp={totalCnt:'',rows:[{pointId:'',pointName:'',isDefault:true/false,order:0}....]}
     * totalCnt:返回的总条数
     * isDefault:是否默认的预置点
     * order:位置
     * */
    getYTPointByLimit: function(resourceId, resourceCh, page, pageSize, callback) {
        var beginIndex = this._convertToBeginIndex(page, pageSize)
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryPrepoint(this.userToken, resourceId, resourceCh, page, page - 1, pageSize, function(obj) {
                var resp = { totalCnt: '', rows: [] }
                var data = obj.data.rows
                resp.totalCnt = obj.data.total

                data && data.forEach(function(item) {
                    var it = {}
                    it.pointId = item.prepointIndex
                    it.pointName = item.prepointName
                    it.isDefault = item.isDefault
                    it.order = item.order
                    resp.rows.push(it)
                })
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryUserYTPointByResID(resourceId, beginIndex, pageSize, function(obj) {
                var resp = { totalcnt: '', rows: [], encoderSIPID: '' };
                if (obj.responseCode == 1) {
                    resp.encoderSIPID = obj.encoderSIPID;
                    if (obj.data.list) {
                        obj.data.list && obj.data.list.forEach(function(item) {
                            var it = {}
                            it.pointId = item.pointID
                            it.pointName = item.pointName
                            it.isDefault = item.isDefault
                            it.order = 0
                            it.encoderSIPID = item.encoderSIPID
                            it.value = item.value
                            resp.rows.push(it)
                        });
                    }
                    callback(resp)
                } else {
                    callback()
                }
            });
        }
    },
    /**
     * 预置点组管理，获取组外预置点
     * resourceId:设备id
     * resourceCh:设备通道
     * page:页码
     * pageSize:页码条数
     *
     * var resp={totalCnt:'',rows:[{pointId:'',pointName:'',isDefault:true/false,order:0}....]}
     */
    getYTPointOffGroupBylimit: function(resourceId, resourceCh, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryPrepoint2(this.userToken, resourceId, resourceCh, page, page - 1, pageSize, function(obj) {
                var resp = { totalCnt: '', rows: [] }
                var data = obj.data
                resp.totalCnt = data.total
                data.rows && data.rows.forEach(function(item) {
                    var it = {}
                    it.pointId = item.prepointIndex
                    it.pointName = item.prepointName
                    it.isDefault = item.isDefault
                    it.order = item.order
                    resp.rows.push(it)
                })
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let pageIndex = this._convertToBeginIndex(page, pageSize)
            dataSDK6.queryUserYTPointByResID(resourceId, pageIndex, pageSize, function(obj) {
                var resp = { totalcnt: '', rows: [], encoderSIPID: '' };
                if (obj.responseCode == 1) {
                    resp.encoderSIPID = obj.data.encoderSIPID;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {}
                        it.pointId = item.pointID
                        it.pointName = item.pointName
                        it.isDefault = item.isDefault
                        it.order = 0
                        it.encoderSIPID = item.encoderSIPID
                        it.value = item.value
                        resp.rows.push(it)
                    });
                }
                callback(resp)
            });
        }
    },
    /**
     * 更新预置点
     * resourceId:资源Id
     * resourceCh:资源通道Ch
     * ytPoints =[{pointId:'',pointName:'',isDefault:true/false,order:0}...]
     * var resp ={Ret:0/1}
     * */
    updateYTPoints: function(resourceId, resourceCh, ytPoints, encoderSIPID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var points = []
            ytPoints && ytPoints.forEach(function(item) {
                var it = {}
                it.prepointIndex = item.pointId
                it.prepointName = item.pointName
                it.isDefault = item.isDefault
                it.order = item.order
                points.push(it)
            });

            var pointsParams = JSON.stringify(points)
            dataSDK5.updatePrepoint(this.userToken, resourceId, resourceCh, pointsParams, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // var point = ytPoints[0]
            ytPoints && ytPoints.forEach((item) => {
                dataSDK6.editUserYTPoint(item.pointId, item.pointName, this.userID, resourceId, "111", encoderSIPID, function(obj) {
                    var resp = { Ret: '' }
                    if (obj.responseCode == 1) {
                        resp.Ret = 0;

                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                });
            });

        }
    },
    /**
     * 设置默认的预置点
     * resourceID:资源ID
     * resourceCh:资源通道
     * pointID:预置点ID
     * isDefault:true/false V5用
     *
     * var resp ={Ret:0/1}
     * */
    setDefaultUserYTPoint: function(resourceID, resourceCh, pointID, isDefault,encoderSIPID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (isDefault === true) {
                dataSDK5.setDefaultPrepoint(this.userToken, resourceID, resourceCh, pointID, function(obj) {
                    var resp = {};
                    resp.Ret = obj.ret;
                    callback(resp)
                });
            } else if (isDefault === false) {
                dataSDK5.cancelDefaultPrepoint(this.userToken, resourceID, resourceCh, pointID, function(obj) {
                    var resp = {}
                    resp.Ret = obj.ret
                    callback(resp)
                })
            }

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setDefaultUserYTPoint(resourceID, pointID, encoderSIPID, function(obj) {
                var resp = { Ret: '' }
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },

    /**
     * 添加预置点组
     * resourceId:资源id
     * resourceCh:资源通道
     * groupName:组名称
     * ytPoints:[{pointId:'',pointName:'',order:''}..]
     * var resp ={Ret:0/1,groupId:''}
     *
     * url:   [...]/PTZControl/addPrepoint2Group
     data:
     token=""&resId= ""&resCh= ""& groupID=""&prepointName=""
     return:
     {"Ret":0,"Msg":"Success","Data":null}
     * */
    addYTPointGroup: function(resourceId, resourceCh, groupName, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.addYzdGroup(this.userToken, resourceId, resourceCh, groupName, function(obj) {
                if (obj && obj.data) {
                    var resp = {}
                    resp.Ret = 0
                    resp.groupId = obj.data.groupID
                    callback(resp)
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 删除预置点组
     * groupId:组id
     * */
    removeGroup: function(resourceId, resourceCh, groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteYzdGroup(this.userToken, resourceId, resourceCh, groupId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 从预置点组中删除单个节点
     * groupId:组id
     * resourceId:资源id
     * resourceCh:资源通道
     * pointId:预置点Id
     *
     * var resp={Ret:0/1}
     * */
    removePrePointFromGroup: function(groupId, resourceId, resourceCh, pointId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            dataSDK5.removePrepoint2Group(this.userToken, resourceId, resourceCh, groupId, pointId, function(obj) {
                resp.Ret = obj.ret
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 预置点组管理，获取预置点组,只是获取分组相关信息
     * resourceId:设备id
     * resourceCh:设备通道
     *
     * var resp ={totalCnt:'',rows:[{groupID:'',groupName:'',order:0}....]}
     */
    getYTPointGroup: function(resourceId, resourceCh, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryYzdGroup(this.userToken, resourceId, resourceCh, page, page - 1, pageSize, function(obj) {
                var resp = { totalCnt: '', rows: [] }
                var data = obj.data;
                resp.totalCnt = data.total;
                data.rows && data.rows.forEach(function(item) {
                    var it = {}
                    it.groupID = item.groupID;
                    it.groupName = item.groupName;
                    it.order = item.order;
                    resp.rows.push(it)
                })
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 获取组内预置点
     * resourceId:设备id
     * resourceCh:设备通道
     * groupId:组Id
     * var resp =[{pointId:'',pointName:'',order:0}....]
     */
    getYTPointByGroupId: function(resourceId, resourceCh, groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryPrepoint2Group(this.userToken, resourceId, resourceCh, groupId, function(obj) {
                if (obj) {
                    if (obj.data) {
                        var resp = []
                        obj.data && obj.data.forEach(function(item) {
                            var it = {}
                            it.pointId = item.prepointIndex
                            it.pointName = item.prepointName
                            it.order = item.order
                            resp.push(it)
                        })
                        callback(resp)
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 获取预置点组列表含子预置点
     * var resp ={totalCnt:'',rows:[{groupId:'',groupName:'',order:'',points:[{pointId:'',pointName:'',order:0, isDefault:false}...]}...]}
     * */
    getYTPointGroupWithPoints: function(resourceId, resourceCh, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = { totalCnt: '', rows: [] }
            dataSDK5.queryYzdGroup2(this.userToken, resourceId, resourceCh, page, page - 1, pageSize, function(obj) {
                if (obj && obj.ret === 0) {
                    if (obj.data) {
                        resp.totalCnt = obj.data.total
                        obj.data.rows && obj.data.rows.forEach((item) => {
                            var groupItem = {}
                            groupItem.groupId = item.groupID
                            groupItem.groupName = item.groupName
                            groupItem.order = item.order
                            groupItem.points = []
                            if (item.prepoints && item.prepoints.length > 0) {
                                item.prepoints && item.prepoints.forEach((row) => {
                                    var itItem = {}
                                    itItem.pointId = row.prepointIndex
                                    itItem.pointName = row.prepointName
                                    itItem.order = row.order
                                    itItem.isDefault = false
                                    groupItem.points.push(itItem)
                                })
                            }
                            resp.rows.push(groupItem)
                        })
                    }
                }
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return
        }
    },

    /**
     * 保存预置点组
     * resourceId:资源Id
     * resourceCh:资源通道
     * groupId:组id
     * ytPoints:[{pointId,pointName,order}
     * var resp ={Ret=0/1}
     * */
    saveYTGroup: function(resourceId, resourceCh, groupId, ytPoints, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var self = this
            if (ytPoints.length > 0) {
                //删除所有的组内预置点
                dataSDK5.removePrepoint2Group2(self.userToken, resourceId, resourceCh, groupId, function(objR) {
                    if (objR && objR.ret === 0) {
                        var id = ""
                        ytPoints && ytPoints.forEach((item) => {
                            id = id + item.pointId + ","
                        })
                        id = id.slice(0, id.length)
                        dataSDK5.addPrepoint2Group2(self.userToken, resourceId, resourceCh, groupId, id, function(obj) {})
                        callback({ Ret: 0 })
                    } else {
                        callback({ Ret: 1 })
                    }
                })

            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },
    /**
     * 更新预置点组(仅仅更新预置点组)
     * */
    updateYTGroup: function(resourceId, resourceCh, groupId, groupName, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var grouplist = []
            var group = {}
            group.groupID = groupId
            group.groupName = groupName
            group.order = 0
            grouplist.push(group)
            var grouplistParams = JSON.stringify(grouplist)
            dataSDK5.updateYzdGroup(this.userToken, resourceId, resourceCh, grouplistParams, function(obj) {
                var resp = {}
                    // if(obj && obj.ret){
                resp.Ret = obj.ret
                    // }
                callback(resp)
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    //***************************巡航方案*************************************************************
    /**
     * 添加巡航方案
     * resourceId:资源Id
     * resourceCh:资源通道
     * schemeName:巡航方案名称
     * looptime:巡航时间
     * ytPoints:[{pointId,pointName,order}..]
     * var resp ={Ret:0/1,schemeId:''}
     * * */
    addSchemePlan: function(resourceId, resourceCh, schemeName, loopTime, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            dataSDK5.addSchemeForPrePoint(this.userToken, resourceId, resourceCh, schemeName, loopTime, function(obj) {
                if (obj && obj.data) {
                    var schemeId = obj.data.schemeID;
                    // //接着添加预置点到方案中去
                    // ytPoints.forEach(function(item){
                    //    var pointId = item.pointId
                    //    dataSDK5.addPrepoint2Scheme(this.userToken,resourceId,resourceCh,schemeId,pointId)
                    // })
                    resp.Ret = obj.ret;
                    resp.schemeId = schemeId;
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 巡航配置，删除巡航方案
     * resourceId:资源Id
     * resourceCh:资源通道
     * schemeId:巡航方案id
     */
    removeSchemePlan: function(resourceId, resourceCh, schemeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            dataSDK5.deleteSchemeForPrePoint(this.userToken, resourceId, resourceCh, schemeId, function(obj) {
                resp.Ret = obj.ret;
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 从巡航配置中删除预置点
     * resourceId:资源Id
     * resourceCh:资源通道
     * schemeId:巡航方案id
     * pointId:预置点id
     *
     * var resp ={Ret:0/1}
     * */
    removePointIdFromSchemePlan: function(resourceId, resourceCh, schemeId, pointId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            dataSDK5.removePrepoint2Scheme(this.userToken, resourceId, resourceCh, schemeId, pointId, function(obj) {
                resp.Ret = obj.ret
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 巡航配置，获取巡航组信息
     * token:令牌
     * resourceId:设备Id
     * resourceCh:设备通道
     *
     * var resp ={totalCnt:'',rows:[{schemeID:'',schemeName:'',order:0,loopTime:10}...]}
     */
    getYtSchemePlanByLimit: function(resourceId, resourceCh, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.querySchemeForPrePoint(this.userToken, resourceId, resourceCh, page, page - 1, pageSize, function(obj) {
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    var data = obj.data
                    resp.totalCnt = data.total
                    data.rows && data.rows.forEach(function(item) {
                        var it = {}
                        it.schemeID = item.schemeID
                        it.schemeName = item.schemeName
                        it.order = item.order
                        it.loopTime = item.loopTime
                        resp.rows.push(it)
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 巡航配置,根据巡航方案获取方案中的预置点
     *
     * var resp =[{pointId:'',pointName:'',Order:0}]
     * */
    getYTPointInSchemeBySchemeId: function(resourceId, resourceCh, schemeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryPrepoint2Scheme(this.userToken, resourceId, resourceCh, schemeId, function(obj) {
                var resp = []
                var data = obj.data;
                data && data.forEach(function(item) {
                    var it = {}
                    it.pointId = item.prepointIndex
                    it.pointName = item.prepointName
                    it.Order = item.order
                    resp.push(it)
                })
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     *  更新巡航方案
     *  resourceId:资源Id
     *  resourceCh:资源通道
     *  schemeName:巡航方案名称
     *  looptime:巡航时间
     *  var resp ={Ret:0/1}
     * */
    updateSchemePlan: function(resourceId, resourceCh, schemeId, schemeName, loopTime, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var schemeList = []
            var scheme = {}
            scheme.schemeID = schemeId
            scheme.schemeName = schemeName
            scheme.order = 0
            scheme.loopTime = loopTime
            schemeList.push(scheme)
            var schemeListParam = JSON.stringify(schemeList)
            dataSDK5.updateSchemeForPrePoint(this.userToken, resourceId, resourceCh, schemeListParam, function(obj) {
                var resp = {}
                resp.Ret = obj.ret
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *  保存巡航方案
     *  schemeId:巡航id
     *  ytPoints:[{pointId,pointName,order}..]
     *
     *  var resp ={Ret:0/1}
     * */
    saveSchemePlan: function(resourceId, resourceCh, schemeId, ytPoints, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //先删除所有的预置点
            var self = this
            dataSDK5.removePrepoint2Scheme2(this.userToken, resourceId, resourceCh, schemeId, function(obj) {
                if (obj && obj.ret === 0) {
                    var id = ""
                    ytPoints && ytPoints.forEach((item) => {
                        id = id + item.pointId + ","
                    })
                    id = id.slice(0, id.length)
                    dataSDK5.addPrepoint2Scheme(self.userToken, resourceId, resourceCh, schemeId, id, function(obj) {})

                    callback({ Ret: 0 })
                } else {
                    callback({ Ret: 1 })
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 巡航配置，开始巡航
     * schemeId:巡航方案id
     */
    startScheme2Cruise: function(resourceId, resourceCh, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartScheme(this.userToken, resourceId, resourceCh, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     *巡航配置，停止巡航
     * schemeId:巡航方案Id
     * */
    stopScheme2Cruise: function(resourceId, resourceCh, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopScheme(this.userToken, resourceId, resourceCh, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 重置预置点
     * resourceId:设备id,
     * resourceCh:设备通道
     */
    publishResetPoint: function(resourceId, resourceCh) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlSelectDefaultPoint(this.userToken, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishResetPoint(resourceId);
        }
    },

    /**
     * 跳转预置点
     * resourceId:设备id
     * resourceCh:设备通道
     * pointId:目标预置点id
     */
    publishUpResPoint: function(resourceId, resourceCh, pointId, index) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlSelectPoint(this.userToken, resourceId, resourceCh, pointId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishUpResPoint(resourceId, pointId, index);
        }
    },

    /**
     * 订阅预置点状态
     * resourceId:资源Id
     * resourceCh:资源通道
     * */
    subscribeYTPointStatus: function(resourceId, resourceCh) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribePTZStatus(this.userToken, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 取消订阅预置点的状态
     * resourceId:资源Id
     * resourceCh:资源通道
     * */
    cancelSubscribeYTPointStatus: function(resourceId, resourceCh) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelsubscribePTZStatus(this.userToken, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },

    /**
     * 收到预置点状态通知
     * type:0-预置点静态数据修改 1-预置点分组静态数据修改 2-预置点巡航静态数据修改 3-预置点跳转  4- 巡航方案切换
     * 0124 prepointIndex没有数据
     * 0123 schemeId没有数据
     *
     * var resp ={type:0,pointId:'',schemeId:'',resId:'',resCh:''}
     * */
    setInformPTZStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceivePTZStatusCallback(function(obj) {
                var resp = {}
                resp.type = obj.type
                resp.pointId = obj.prepointIndex
                resp.schemeId = obj.SchemeID
                resp.resId = obj.resId
                resp.resCh = obj.resCh
                callback(resp)
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return true
        }
    },
    // ------------------------------------------- 通用通知 --------------------------------------------------

    /**
     * 设置后台通知消息
     * var resp ={sessionId: '', title:'',content:'',showCancelBtn:true/false,submitText:'',cancelText:'',success:Function,cancel:Function}....]}
     * */
    setInformShowMessageCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMessageCallback(function(obj) {

                var resp = {}
                resp.title = obj.title
                resp.content = obj.text

                if (obj.buttons[0]) {
                    resp.showCancelBtn = false;
                    resp.submitText = obj.buttons[0].text;
                    //var cmjson0 = JSON.parse(obj.buttons[0].command);
                    var cmjson0 = obj.buttons[0].command;
                    if (cmjson0) {
                        resp.success = function() {
                            businessSDK5.publish(cmjson0.funName, cmjson0.params);
                        }
                    }
                }
                if (obj.buttons[1]) {
                    resp.showCancelBtn = true;
                    resp.cancelText = obj.buttons[1].text;
                    //var cmjson1 = JSON.parse(obj.buttons[1].command);
                    var cmjson1 = obj.buttons[1].command;
                    if (cmjson1) {
                        resp.cancel = function() {
                            businessSDK5.publish(cmjson1.funName, cmjson1.params);
                        }
                    }
                }
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveMessageCallback(function(obj) {
                var resp = {};
                resp.title = obj.title;
                resp.content = obj.text;
                resp.sessionId = obj.buttons[0].command.params.receiverID + '_voiceRemind_' + obj.buttons[0].command.params.senderID;
                if (obj.buttons[0]) {
                    resp.showCancelBtn = false;
                    resp.submitText = obj.buttons[0].text;
                    //var cmjson0 = JSON.parse(obj.buttons[0].command);
                    var cmjson0 = obj.buttons[0].command;
                    if (cmjson0) {
                        resp.success = function() {
                            businessSDK6.publish(cmjson0.funName, cmjson0.params, cmjson0.params.serviceName);
                        }
                    }
                }
                if (obj.buttons[1]) {
                    resp.showCancelBtn = true;
                    resp.cancelText = obj.buttons[1].text;
                    //var cmjson1 = JSON.parse(obj.buttons[1].command);
                    var cmjson1 = obj.buttons[1].command;
                    if (cmjson1) {
                        resp.cancel = function() {
                            businessSDK6.publish(cmjson1.funName, cmjson1.params, cmjson0.params.serviceName);
                        }
                    }
                }
                callback(resp)
            });
        }

    },

    /**
     * 设置后台提醒消息
     * var resp ={text:'',closeTime:5}
     * */
    setInformShowRemindCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveRemindCallback(function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveRemindCallback(function(obj) {
                callback(obj);
            });
        }
    },

    /**
     * 设置声音消息
     * var resp ={isRemind:true/false, sessionID: ''}
     * */
    setInformVoiceRemindCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformVoiceRemindCallback(function(obj) {
                var resp = { isRemind: false, sessionID: obj.sessionID }
                resp.isRemind = obj.isRemind == "true"
                callback(resp);
            });
        }
    },

    // ---------------------------------------------- 分屏控制 ------------------------------------------------------
    /**
     * 发布分屏状态
     * splitType:1201.1分屏,1202.2分屏,1203.画中画,1204.4分屏,1205.1+5分屏,1206:6分屏，1207:1+7分屏，1209：九分屏，1212:12分屏，1216:16分屏
     *
     * //todo 这个部分需要商量着调整
     * */
    publishSplitScreen: function(splitType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSplitScreen(splitType);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSplitScreen(splitType);
        }
    },

    /**
     * 发布全屏状态
     * isFullScreen:true全屏，false非全屏
     * */
    publishFullScreen: function(screenIndex, isFullScreen) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishFullScreen(screenIndex, isFullScreen);
        }
    },

    /**
     * 媒体分屏显示反馈（软解）
     *
     * var resp={splitType:0}//具体参考publishSplitScreen定义
     * splitType:1201.1分屏,1202.2分屏,1203.画中画,1204.4分屏,1205.1+5分屏,1206:6分屏，1207:1+7分屏，1209：九分屏，1212:12分屏，1216:16分屏
     * */
    setInformSplitScreenByLocalCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = {}
            businessSDK5.setReceiveMediaStatusByLocalCBForSplitScreen(function(obj) {
                if (obj) {
                    if (obj.operate == "splitScreen" && obj.splitScreenParam) {
                        resp.splitType = obj.splitScreenParam.splitType;
                        //todo
                        callback(resp)
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = { splitType: '' }
            businessSDK6.setReceiveInformSplitScreenByLocalCallback(function(obj) {
                resp.splitType = obj.splitType;
                callback(resp)
            });
        }
    },

    /**
     * 媒体分屏显示反馈（硬解）
     * ar resp={splitType:0}//具体参考publishSplitScreen定义
     * */
    setInformSplitScreenByRemoteCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = { splitType: '' }
            businessSDK6.setReceiveInformSplitScreenByRemoteCallback(function(obj) {
                resp.splitType = obj.splitType;
                callback(resp)
            });
        }
    },

    /**
     * 媒体全屏显示反馈（软解)
     * var resp ={screenIndex:'',isFullScreen:true/false}
     * */
    setInformFullScreenByLocalCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMediaStatusByLocalCBForFullScreen(function(obj) {
                if (obj) {
                    if (obj.operate === "fullScreen" && obj.fullScreenParam) {
                        var resp = { screenIndex: '', isFullScreen: '' };
                        resp.screenIndex = obj.fullScreenParam.screenIndex;
                        // state 1:全屏，0:取消全屏    true-全屏，false，取消全屏
                        resp.isFullScreen = (obj.fullScreenParam.state == 1) ? true : false;
                        callback(resp)
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = { screenIndex: '', isFullScreen: '' }
            businessSDK6.setReceiveInformFullScreenByLocalCallback(function(obj) {
                resp.screenIndex = obj.screenIndex;
                resp.isFullScreen = obj.state;
                callback(resp)
            });
        }
    },

    /**
     * 媒体全屏显示反馈（硬解)
     *  var resp ={screenIndex:'',isFullScreen:true/false}
     * */
    setInformFullScreenByRemoteCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = { screenIndex: '', isFullScreen: '' }
            businessSDK6.setReceiveInformFullScreenByRemoteCallback(function(obj) {
                resp.screenIndex = obj.screenIndex;
                resp.isFullScreen = obj.state;
                callback(resp)
            });
        }
    },

    /**
     * 编排显示位置
     * resource: 资源
     * resource:{resId:'',resName:''}
     * srcScreenIndex: 源分屏索引
     * destScreenIndex: 目标分屏索引
     */
    dragMediaToPosition: function(resource, srcScreenIndex, destScreenIndex) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         * */
    },

    // ----------------------------------------------声音控制 ---------------------------------------------

    /**
     *发布媒体声音控制
     * */
    publishAllVolume: function(isOpen, value) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishAllVolume(isOpen, value);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishAllVolumn(isOpen);
        }
    },
    /**
     * 发布单路声音控制
     * screenIndex:屏位置
     * isOpen:true/false
     * */
    publishVolume: function(screenIndex, isOpen, value) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishVolume(screenIndex, isOpen, value);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishVolumn(screenIndex, isOpen);
        }
    },

    // ---------------------------------- OSD 管理 ------------------------------------------------------
    /**
     * 字符叠加，添加方案
     * resourceId:资源Id
     * resourceCh:资源通道
     * osdStyleName:样式名称
     * screenWidth: 宽
     * screenHeight：高
     * basePoint:基准点;"leftTop/leftDown/rightTop/rightDown/center"
     *
     * itemType:"text/dateTime/departmentName/centerName/"
     * fontFamily:"SIM_SUN/SIM_HEI/SIM_KAI/SIM_LI/SIM_MICRO"
     * items:[{osdId:"",index: 0,x: 0,y: 0,caption:"",itemType: "",basePoint:"",fontFamily: "",fontSize: 1,fontColorR: 255,fontColorG: 255,fontColorB: 255},...]
     * var resp ={Ret:0/1}
     * */
    addOsdStyle: function(resourceId, resourceCh, screenWidth, screenHeight, osdStyleName, items, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // 创建OSD样式 /osdManage/addOSDStyle
            var osds = [];
            items && items.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.x = item.x;
                it.y = item.y;
                it.itemType = item.itemType;
                it.basePoint = item.basePoint;
                it.fontFamily = item.fontFamily;
                it.fontSize = item.fontSize;
                it.fontColorR = item.fontColorR;
                it.fontColorG = item.fontColorG;
                it.fontColorB = item.fontColorB;
                osds.push(it);
            })
            dataSDK6.addOSDStyle("", osdStyleName, screenWidth, screenHeight, JSON.stringify(osds), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    /**
     * 字符叠加-删除方案极其所下属的所有OSD
     * resourceId:资源Id
     * resourceCh:资源通道
     * index : 样式资源的下标
     *
     * var resp ={Ret=0/1}
     * */
    removeOsdStyle: function(resourceId, resourceCh, index, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeOSDStyle(resourceId, index, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },
    // 删除最后一个字符
    deleteOsdStyle:function(resourceId, index, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.deleteOsdStyle(resourceId, index, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },
    /**
     * 通过资源ID获取osd方案

     * resourceId:资源id(包括人员或者设备)
     * resourceCh:资源通道
     *
     * var resp ={totalCnt:'',rows:[{osdStyleId:"",osdName:""}]}
     * */
    getOsdSchemeByResource: function(resourceId, resourceCh, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 通过资源ID获取当前应用的OSD样式
     *
     * resourceId:资源id(包括人员或者设备)
     * resourceCh:资源通道
     * var resp ={osdStyleId:"",osdStyleName:"",applyIndex:""}
     * */
    getCurrentSchemeByResource: function(resourceId, resourceCh, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 查询 OSD 样式与资源的绑定关系
     *  resourceId : 资源Id （人员 或 设备）
     *  index (样式的下标)
     * var resp =[{resourceId:"",index:""}...]
     */

    queryOSDstyleBind: function(resourceId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceIDs = [];
            resourceIDs.push(resourceId);
            dataSDK6.queryAnyOSDStyleApply(resourceIDs, function(obj) {
                var resp = [];
                if (obj.responseCode == 1) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.resourceId = item.resourceID;
                        it.index = item.applyIndex;
                        resp.push(it);
                    })
                }
                callback(resp)
            });
        }
    },

    /**
     * 根据 id 查询OSD样式详情
     * resourceId:资源 resourceId
     * itemType:"text/dateTime/departmentName/centerName/"
     * fontFamily:" 黑体、仿宋、楷体、隶书、微软雅黑
     *
     * var resp = {resourceId:"",index:"",screenWidth:1920,screenHeight:1080,
     * items:[{index: 0,x: 0,y: 0,itemType: "",basePoint:"",caption:"",fontFamily: "",fontSize: 1,fontColorR: 255,fontColorG: 255,fontColorB: 255},...}
     * */
    getOSDByOsdStyleId: function(resourceId, index, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryOsdLabel(this.userToken, resourceId, 0, function(obj) {
                var resp = { items: [] };
                if (obj && obj.data) {
                    obj.data.forEach(function(item) {
                        resp.items.push(item);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleOSDStyle(resourceId, index, function(obj) {
                var resp = { resourceId: "", index: "", screenWidth: "", screenHeight: "", items: [] };
                if (obj) {
                    resp.resourceId = obj.data.resourceID;
                    resp.index = obj.data.index;
                    resp.screenWidth = obj.data.screenWidth;
                    resp.screenHeight = obj.data.screenHeight;
                    obj.data.items && obj.data.items.forEach(function(item) {
                        var it = {};
                        it.index = item.index || 0;
                        it.x = item.x;
                        it.y = item.y;
                        //it.basePoint = item.basePoint;
                        if (item.basePoint == "LeftTop") {
                            it.basePoint = "leftTop";
                        } else if (item.basePoint == "RightTop") {
                            it.basePoint = "rightTop";
                        } else if (item.basePoint == "LeftBottom") {
                            it.basePoint = "leftDown";
                        } else if (item.basePoint == "RightBottom") {
                            it.basePoint = "rightDown";
                        } else if (item.basePoint == "Center") {
                            it.basePoint = "center";
                        }

                        if (item.itemType == "Text") {
                            it.itemType = "text";
                        } else if (item.itemType == "ResourceName") {
                            it.itemType = "sourceName";
                        } else if (item.itemType == 3) {
                            it.itemType = "sourceIdentification";
                        } else if (item.itemType == 4) {
                            it.itemType = "centerName";
                        } else if (item.itemType == "Department") {
                            it.itemType = "departmentName";
                        } else if (item.itemType == "DateTime") {
                            it.itemType = "dateTime";
                        };
                        it.caption = item.fixedText;
                        if (item.fontFamlily == "SIM_SUN") {
                            it.fontFamily = "宋体";
                        } else if (item.fontFamlily == "SIM_HEI") {
                            it.fontFamily = "黑体";
                        } else if (item.fontFamlily == "KAI_TI") {
                            it.fontFamily = "楷体";
                        } else if (item.fontFamlily == "FANG_SONG") {
                            it.fontFamily = "仿宋";
                        } else if (item.fontFamlily == "MICRO_YA_HEI") {
                            it.fontFamily = "微软雅黑";
                        } else if (item.fontFamlily == "LI_SHU") {
                            it.fontFamily = "隶书";
                        }
                        it.fontSize = item.fontSize;
                        it.fontColorR = item.fontColorR;
                        it.fontColorG = item.fontColorG;
                        it.fontColorB = item.fontColorB;
                        resp.items.push(it);
                    })
                }
                callback(resp);
            });
        }
    },



    /*
     * 编辑OSD样式
     * token:令牌
     * index : 样式下标
     * resourceId: 资源Id
     * screenWidth:屏宽
     * screenHeight：屏高
     * basePoint：基准点
     * items:[{index: 0,x: 0,y: 0,itemType: "",basePoint:"",caption:"",fontFamlily: "",fontSize: 1,fontColorR: 255,fontColorG: 255,fontColorB: 255},{...}]
     *
     * var resp ={Ret:0/1}
     * */
    updateOsdStyle: function(resourceId, index, screenWidth, screenHeight, items, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.saveOsdLabel(this.userToken, resourceId, 0, items, function(obj) {
                var resp = obj;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var osds = [];
            items && items.forEach(function(item) {
                var it = {};
                it.index = item.index;
                it.x = item.x;
                it.y = item.y;
                if (item.itemType == "text") {
                    it.itemType = "Text";
                } else if (item.itemType == "sourceName") {
                    it.itemType = "ResourceName";
                } else if (item.itemType == "departmentName") {
                    it.itemType = "Department";
                } else if (item.itemType == "dateTime") {
                    it.itemType = "DateTime";
                }
                it.fixedText = item.caption;
                if (item.basePoint == "leftTop") {
                    it.basePoint = "LeftTop";
                } else if (item.basePoint == "rightTop") {
                    it.basePoint = "RightTop";
                } else if (item.basePoint == "leftDown") {
                    it.basePoint = "LeftBottom";
                } else if (item.basePoint == "rightDown") {
                    it.basePoint = "RightBottom";
                } else if (item.basePoint == "center") {
                    it.basePoint = "Center";
                }
                if (item.fontFamily == "宋体") {
                    it.fontFamlily = "SIM_SUN";
                } else if (item.fontFamily == "黑体") {
                    it.fontFamlily = "SIM_HEI";
                } else if (item.fontFamily == "仿宋") {
                    it.fontFamlily = "FANG_SONG";
                } else if (item.fontFamily == "楷体") {
                    it.fontFamlily = "KAI_TI";
                } else if (item.fontFamily == "隶书") {
                    it.fontFamlily = "LI_SHU";
                } else if (item.fontFamily == "微软雅黑") {
                    it.fontFamlily = "MICRO_YA_HEI";
                }
                it.fontSize = item.fontSize;
                it.fontColorR = item.fontColorR;
                it.fontColorG = item.fontColorG;
                it.fontColorB = item.fontColorB;
                osds.push(it);
            })
            dataSDK6.saveOSDStyle(resourceId, index, screenWidth, screenHeight, osds, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }


    },

    /**
     * osd 样式，应用到本节点
     * resourceID: 资源ID
     * applyIndex : 应用 OSD 样式下标
       items = [{ resourceID: "", applyIndex: 0 }, { ... }]
     * */
    applyOsdToNode: function(items, callback) {
        dataSDK6.saveAnyOSDStyleApply(JSON.stringify(items), function(obj) {
            var resp = {};
            if (obj.responseCode == 1) {
                resp.Ret = 0;
            } else {
                resp.Ret = 1;
            }
            callback(resp);
        });
    },
    /**
     * osd 样式 ,应用到全网
       resourceID: 资源ID
     * applyIndex : 应用 OSD 样式下标
       items = [{ resourceID: "", applyIndex: 0 }, { ... }]
     * */
    applyOsdToAll: function(items, callback) {

    },

    /**
     * osd 样式 应用到资源
     * resourceID: 资源ID
     * applyIndex : 应用OSD样式下标
       items = [{ resourceID: "", applyIndex: 0 }, { ... }]
     * */
    applyOsdToResource: function(items, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.saveAnyOSDStyleApply(JSON.stringify(items), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });

        }
    },

    /**
     * 设置osd推送反馈
     * var resp=[
     *   {      screenIndex ="";
                osdIndex =  '';
                caption = '';
                fontColor = '';
                bold =  '';
                italic = '';
                width =  '';
                height =  '';
                fontFamily ='';
                fontSize = '';
                relativeX =  '';
                relativeY = '';
                basePoint = '';
        }
     *
     * ]
     * */
    setInformOsdStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveMediaStatusByLocalCBForOSD(function(obj) {
                if (obj) {
                    if (obj.operate === "OSD" && obj.osdParam) {
                        var resp = []
                        obj.osdParam && obj.osdParam.forEach(function(item) {
                            var it = {}
                            it.screenIndex = item.screenIndex;
                            it.osdIndex = item.osdIndex;
                            it.caption = item.caption;

                            //字号枚举: 10，12，14，16，18，24，28，32，36px----分别对应1-9号字
                            switch (item.size) {
                                case 10:
                                    it.fontSize = 1;
                                    break;
                                case 12:
                                    it.fontSize = 2;
                                    break;
                                case 14:
                                    it.fontSize = 3;
                                    break;
                                case 16:
                                    it.fontSize = 4;
                                    break;
                                case 18:
                                    it.fontSize = 5;
                                    break;
                                case 24:
                                    it.fontSize = 6;
                                    break;
                                case 28:
                                    it.fontSize = 7;
                                    break;
                                case 32:
                                    it.fontSize = 8;
                                    break;
                                case 36:
                                    it.fontSize = 9;
                                    break;
                                default:
                                    break;
                            }
                            it.fontColor = item.color
                            it.bold = item.bold;
                            it.italic = item.italic;
                            it.width = item.width;
                            it.height = item.height;
                            it.fontFamily = item.font;

                            it.relativeX = item.leftRate;
                            it.relativeY = item.topRate;
                            it.basePoint = 1;
                            resp.push(it);
                        })
                        callback(resp);
                    }
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var self = this;
            businessSDK6.setReceiveInformRefreshScreenOSDInfosCallback(function(obj) {
                var resp = [];
                if (obj) {
                    obj.screenOSDs && obj.screenOSDs.forEach(function(item) {
                        var it = {}
                        it.screenIndex = item.screenIndex;
                        it.osdIndex = item.index || 0;
                        it.caption = item.text || ''; // 文本内容
                        if (item.itemType == 'DateTime') it.caption = 'date'; //时间类型
                        it.bold = 0; // 粗体
                        it.italic = 0; // 斜体
                        it.width = 0;
                        it.height = 0;
                        it.fontSize = item.fontSize; //字体大小
                        var R = item.fontColorR || 0;
                        var G = item.fontColorG || 0
                        var B = item.fontColorB || 0;
                        // RGB 转 16 进制颜色
                        //it.fontColor = self.toColor16(color);
                        it.fontColor = ((1 << 24) + (B << 16) + (G << 8) + R).toString(16).slice(1);
                        it.relativeX = item.relativeX || 0;
                        it.relativeY = item.relativeY || 0;

                        //console.log(it)
                        if (item.basePoint == "LeftTop") {
                            it.basePoint = 1;
                        } else if (item.basePoint == "RightTop") {
                            it.basePoint = 2;
                        } else if (item.basePoint == "LeftBottom") {
                            it.basePoint = 3;
                        } else if (item.basePoint == "RightBottom") {
                            it.basePoint = 4;
                        } else if (item.basePoint == "Center") {
                            it.basePoint = 1;
                        }

                        if (item.fontFamlily == "SIM_SUN") {
                            it.fontFamily = "宋体";
                        } else if (item.fontFamlily == "SIM_HEI") {
                            it.fontFamily = "黑体";
                        } else if (item.fontFamlily == "KAI_TI") {
                            it.fontFamily = "楷体";
                        } else if (item.fontFamlily == "FANG_SONG") {
                            it.fontFamily = "仿宋";
                        } else if (item.fontFamlily == "MICRO_YA_HEI") {
                            it.fontFamily = "微软雅黑";
                        } else if (item.fontFamlily == "LI_SHU") {
                            it.fontFamily = "隶书";
                        }
                        resp.push(it);
                    });
                }
                callback(resp)
            })
        }
    },

    getTime: function() {
        var date = new Date();
        return date.getTime();
    },

    // ---------------------------------------------------------- 播放器 -----------------------------------------------
    /**
     * 初始化图像显示组件
     * callback: 6.0版本中的回调，用于获取sipId和绑定用户
     */
    initLayout:function(parentID, width, height, btnCB, businessCB, selectedCB, playbackCB, playResultCB, dropCB){
         // 添加“type”:1 //新增参数 1为5.0方式，0为6.0点播方式
         let type = 0;
                
         playerSDKNew.initLayout(parentID, width, height, type,
             //以下为兼容之前代码的回调处理
             function(screenIndex, btnKey, value) {
                 if (btnKey == 'Record_Slow' && playbackCB) playbackCB(screenIndex, 1, value);
                 else if (btnKey == 'Record_Fast' && playbackCB) playbackCB(screenIndex, 1, value);
                 else if (btnKey == 'Record_Renew' && playbackCB) playbackCB(screenIndex, 1, value);
                 else if (btnKey == 'Record_Progress' && playbackCB) {
                     playbackCB(screenIndex, 0, null, parseInt(value / 1000));
                 } else if (btnKey == 'Volume_Progress' && btnCB) btnCB(screenIndex, null, null, btnKey, value);
                 else if (btnCB) btnCB(screenIndex, null, null, btnKey);
             },
             function(eventType, status_code, screenIndex) {
                 if (businessCB) businessCB(eventType, null, status_code, null, screenIndex);
             },
             function(screenIndex, isSelected, isPlay) {
                 //wxx 2020.10.30
                //  screenIndex = isSelected ? screenIndex : -1;
                //  if (selectedCB) selectedCB(screenIndex, isPlay ? 1 : 0);
                
                let selectScreenIndex= isSelected ? screenIndex : -1;
                let ClickIndex = screenIndex;
                 if (selectedCB) selectedCB(selectScreenIndex, isPlay ? 1 : 0,ClickIndex);
             },
             //1119云调度拖动点播
             function(screenIndex, isSelected, isPlay, dragData) {
                //  screenIndex = isSelected ? screenIndex : -1;
                 if (dropCB) dropCB(screenIndex, isPlay ? 1 : 0, dragData);
             
             }
        );
    },
    initMedia:function(businessCB){
        console.log('初始化媒体信息!')
        let type = 0;
        let that = this;
        playerSDKNew.initMedia(type,function(eventType, status_code, screenIndex) {
            if (businessCB) businessCB(eventType, null, status_code, null, screenIndex);
        },that.config.playerType,that.getMediaServerConfig())
    },
    // 免插件播放配置
    getMediaServerConfig(){
        return {
            ffmepgServer:this.config.ffmepgServer,
            mediaServerIp:this.config.mediaServerIp,
            mediaServerPort:this.config.mediaServerPort,
            decodeResolution : this.config.decodeResolution
        }
    },
    //目前废弃 不使用
    initMXTC: function(parentID, width, height, btnCB, businessCB, selectedCB, playbackCB, playResultCB, dropCB) { //parentID,width, height
        //分别调用sdk5和sdk6中对应的方法
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                // 添加“type”:1 //新增参数 1为5.0方式，0为6.0点播方式
                let type = 1;
                playerSDKNew.init(parentID, width, height, type,
                    //以下为兼容之前代码的回调处理
                    function(screenIndex, btnKey, value) {
                        if (btnKey == 'Record_Slow' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Fast' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Renew' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Progress' && playbackCB) {
                            playbackCB(screenIndex, 0, null, parseInt(value / 1000));
                        } else if (btnKey == 'Volume_Progress' && btnCB) btnCB(screenIndex, null, null, btnKey, value);
                        else if (btnCB) btnCB(screenIndex, null, null, btnKey);
                    },
                    function(eventType, status_code, screenIndex) {
                        if (businessCB) businessCB(eventType, null, status_code, null, screenIndex);
                    },
                    function(screenIndex, isSelected, isPlay) {
                         //wxx 2020.10.30
                        // screenIndex = isSelected ? screenIndex : -1;
                        // if (selectedCB) selectedCB(screenIndex, isPlay ? 1 : 0);
                        let selectScreenIndex= isSelected ? screenIndex : -1;
                        let ClickIndex = screenIndex;
                         if (selectedCB) selectedCB(selectScreenIndex, isPlay ? 1 : 0,ClickIndex);
                    });
            } else {
                playerSDK5.initMXTC(parentID, width, height);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                // 添加“type”:1 //新增参数 1为5.0方式，0为6.0点播方式
                let type = 0;
                
                playerSDKNew.init(parentID, width, height, type,
                    //以下为兼容之前代码的回调处理
                    function(screenIndex, btnKey, value) {
                        if (btnKey == 'Record_Slow' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Fast' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Renew' && playbackCB) playbackCB(screenIndex, 1, value);
                        else if (btnKey == 'Record_Progress' && playbackCB) {
                            playbackCB(screenIndex, 0, null, parseInt(value / 1000));
                        } else if (btnKey == 'Volume_Progress' && btnCB) btnCB(screenIndex, null, null, btnKey, value);
                        else if (btnCB) btnCB(screenIndex, null, null, btnKey);
                    },
                    function(eventType, status_code, screenIndex) {
                        if (businessCB) businessCB(eventType, null, status_code, null, screenIndex);
                    },
                    function(screenIndex, isSelected, isPlay) {
                         //wxx 2020.10.30
                        // screenIndex = isSelected ? screenIndex : -1;
                        // if (selectedCB) selectedCB(screenIndex, isPlay ? 1 : 0);
                        let selectScreenIndex= isSelected ? screenIndex : -1;
                        let ClickIndex = screenIndex;
                         if (selectedCB) selectedCB(selectScreenIndex, isPlay ? 1 : 0,ClickIndex);
                    },
                    //1119云调度拖动点播
                    function(screenIndex, isSelected, isPlay, dragData) {
                        // screenIndex = isSelected ? screenIndex : -1;
                        if (dropCB) dropCB(screenIndex, isPlay ? 1 : 0, dragData);
                    
                    }
                );
            } else {
                return playerSDK.initMXTC(parentID, width, height);
            }
        }
    },
    unInitMXTC: function() {
        //分别调用sdk5和sdk6中对应的方法
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {

            } else {
                playerSDK5.unInitMxtc();
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {

            } else {
                playerSDK.unInitMxtc();
            }
        }
    },

    /**
     * 拆分窗口
     * screenType: 分屏模式 1，4，9，2,100,101....
     * 真实的需要参照既有的参数
     */
    splitWidowForPlugin: function(screenType) {
        //分别调用sdk5和sdk6中对应的方法
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.splitScreen(screenType);
            } else {
                playerSDK5.splitWidow(screenType);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.splitScreen(screenType);
            } else {
                playerSDK.splitWidow(screenType);
            }
        }
    },

    /**
     * 点播
     * 2020-06-15修改
     * pos: 窗口号
     * sessionId: session
     * target: invite对象
     * deviceType 设备类型，由JK点播回调返回参数填入
     * ip: rtsp地址
     * ch: 通道，由JK点播回调返回参数填入
     * destAPort: 0主流 1子流 2纯音频
     * nAudioEnable: 是否开启声音，默认关闭
     * devIds: 设备ids
     * devCh: 设备通道
     * usrIds: 人员ids
     * opType: ?
     */
    startPlayForPlugin: function(pos, videoRtpId, audioRtpId, resSipID, deviceType, fIPs, fCH, destAPort, devIds, devCh, usrIds, resourceType, mediaGroupID, channel, mediaType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.startPlay(pos, resourceType, deviceType, fIPs, parseInt(fCH));
            } else {
                if (pos === "") {
                    playerSDK5.startPlay(deviceType, fIPs, fCH, destAPort, devIds, devCh, usrIds, resourceType);
                } else {
                    playerSDK5.startPlayInPos(deviceType, fIPs, fCH, destAPort, pos, devIds, devCh, usrIds, resourceType);
                }
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.startPlayByResId(pos, resSipID, resourceType, mediaGroupID, channel, mediaType);
            } else {
                playerSDK.startPlayByRtpId(pos, videoRtpId, audioRtpId);
            }
        }
    },

    /**
     * 点播-rtmp模式
     * @param {*} pos 
     * @param {*} resourceType 
     * @param {*} rtmpURL 
     */
    startPlayByRTMPForPlugin: function(pos, resourceType, rtmpURL, urlType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                if(urlType == 'hls') {resourceType = 3}
                else if(urlType == 'm3u8') {
                    urlType='hls';
                    resourceType = 3;
                }
                // else if(urlType == 'flv') {resourceType = 2}
                playerSDKNew.startPlayByRTMP(pos, resourceType, rtmpURL, urlType);
            } else {
                
            }
        }
    },

    /**
     * 文件频道和回放反馈
     * @param {*} callback 
     * {screenIndex:"", channelItemID:"", fileName:"",playURL,""}
     */
    setInformStartPlayByRTMPCallback(callback){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // 点播媒资文件反馈
            businessSDK6.setReceiveInformStartFileMediaCallback(function(obj){
                // callback(obj, 'flv');
                callback(obj, 'm3u8');
            });

            // 录像回放反馈
            businessSDK6.setReceiveInformStartRecordMediaCallback(function(obj){
                callback(obj, 'hls');
            });
        }
    },

    /**
     * 停止点播
     *
     * pos: 窗口号
     */
    stopPlayForPlugin: function(pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.stopPlay(pos);
            } else {
                playerSDK5.stopPlay(pos);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.stopPlay(pos);
            } else {
                playerSDK.stopPlay(pos);
            }
        }
    },

    /**
     * 全部停止点播
     */
    stopPlayAllForPlugin: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.stopAllPlay();
            } else {
                playerSDK5.stopPlayAll();
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.stopAllPlay();
            } else {
                playerSDK.stopPlayAll();
            }
        }
    },

    /**
     * 设置OSD
     */
    setOSDForPlugin: function(pos, index, osdInfo, Color, Bold, Italic, WidthSize, HeightSize, offsetX, offsetY, basePoint, fontSize, fontFamily) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                // // Color 10进制转16进制补0
                // let BGR = ('000000' + parseInt(Color).toString(16)).slice(-6);
                // // bgr格式转rgb
                // let RGB = BGR.substr(4, 2) + BGR.substr(2, 2) + BGR.substr(0, 2);
                let colorR = (Color >> 16) & 0xff
                let colorG = (Color >> 8) & 0xff
                let colorB = Color & 0xff
                let RGB = ((colorR << 16) | (colorG << 8) | colorB).toString(16);
                //console.log(colorR, colorG, colorB)
                //console.log(RGB)
                playerSDKNew.setOSD(pos, index, osdInfo, fontFamily, RGB, Bold, Italic, offsetX, offsetY, basePoint, fontSize, WidthSize, HeightSize);
            } else {
                playerSDK5.setOSD(pos, index, osdInfo, Color, Bold, Italic, WidthSize, HeightSize, offsetX, offsetY);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                // 16进制
                let BGR = Color;
                // bgr格式转rgb
                let RGB = BGR.substr(4, 2) + BGR.substr(2, 2) + BGR.substr(0, 2);
                playerSDKNew.setOSD(pos, index, osdInfo, fontFamily, RGB, Bold, Italic, offsetX, offsetY, basePoint, fontSize, WidthSize, HeightSize);
            } else {
                playerSDK.setOSD(pos, index, osdInfo, fontFamily, Color, Bold, Italic, WidthSize, HeightSize, offsetX, offsetY, basePoint, fontSize);
            }
            //playerSDK.setOSD(pos, Caption, Color, Bold, Italic, WidthSize, HeightSize, LeftRate, TopRate);
        }
    },

    /**
     * 取消OSD
     *
     * pos: osd所在的窗口位置
     */
    cancelOSDForPlugin: function(pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.cancelOSD(pos);
            } else {
                //playerSDK5.cancelOSD(pos, osdIndex);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.cancelOSD(pos);
            } else {
                playerSDK.cancelOSD(pos);
            }
        }
    },

    /**
     * 全屏与取消全屏
     *
     * pos: 窗口号
     * type: 是否全屏，true-全屏，false，取消全屏
     */
    setFullScreenForPlugin: function(pos, type) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setFullScreen(pos, type);
            } else {
                playerSDK5.setFullScreen(pos, type);
                if (type === true) {
                    businessSDK5.publishSetFullScreen(pos);
                } else {
                    playerSDK5.changeButton(pos, 0, 2, 'Nor_FullScreen');
                    businessSDK5.publishCancelFullScreen();
                }
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setFullScreen(pos, type);
            } else {
                playerSDK.setFullScreen(pos, type);
            }
        }
    },
    //wxx 2020.11.4
    /**
     * 全部全屏
     *
     * type: 是否全屏，true-全屏，false，取消全屏
     */
    setAllFullScreenForPlugin:function(type){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setFullScreenAll(type);
            } else {
                // playerSDK.setFullScreen(pos, type);
            }
        }
    },
    /**
     * 设置音量开关接口
     *
     * pos: 窗口号
     * state: true-开 false - 关
     */
    setVolumeStateForPlugin: function(pos, state) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.isOpenVolume(state, pos)
            } else {
                playerSDK5.setVolume(pos, state ? 255 : 0);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {

                playerSDKNew.isOpenVolume(state, pos)
            } else {
                playerSDK.setVolume(pos, state ? 255 : 0);
            }
        }
    },

    /**
     * 设置音量值接口
     *
     * pos: 窗口号
     * vol: 音量：0-255
     */
    setVolumeForPlugin: function(pos, vol) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setVolume(pos, vol);
            } else {
                playerSDK5.setVolume(pos, vol);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setVolume(pos, vol);
            } else {
                playerSDK.setVolume(pos, vol);
            }
        }
    },

    /**
     * 设置音量接口
     *
     * flag: 音量开关: 0-off,1-on
     */
    setVolumeAllForPlugin: function(flag) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                if (flag == 0) playerSDKNew.isOpenVolume(false)
                if (flag == 1) playerSDKNew.isOpenVolume(true)
            } else {
                playerSDK5.setVolumeAll(flag);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                if (flag == 0) playerSDKNew.isOpenVolume(false)
                if (flag == 1) playerSDKNew.isOpenVolume(true)
            } else {
                playerSDK.setVolumeAll(flag);
            }
        }
    },

    startPlaybackTimeForPlugin: function(pos, startTime, endTime) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setPlaybackTime(pos, parseInt(startTime) * 1000, parseInt(endTime) * 1000);
            } else {
                playerSDK5.startPlaybackTime(pos, startTime, endTime)
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.setPlaybackTime(pos, parseInt(startTime) * 1000, parseInt(endTime) * 1000);
            } else {
                playerSDK5.startPlaybackTime(pos, startTime, endTime)
            }
        }
    },
    /**
     *
     * cmd, string, 如[{"pos":"0","videoRtpId":"101","audioRtpId":"102","resourceType":"User/Device"}]
     */
    groupStartCommandForPlugin: function(groupId, cmd) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.groupStartCommand(groupId, cmd);
            } else {
                playerSDK.groupStartCommand(groupId, cmd);
            }
        }
    },

    /**
     *
     * cmd, string, 如[{"pos":"0","videoRtpId":"101","audioRtpId":"102"}]
     */
    groupRefreshCommandForPlugin: function(groupId, cmd) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.groupRefreshCommand(groupId, cmd);
            } else {
                playerSDK.groupRefreshCommand(groupId, cmd);
            }
        }
    },

    /**
     *
     */
    groupStopCommandForPlugin: function(groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.groupStopCommand(groupId);
            } else {
                playerSDK.groupStopCommand(groupId);
            }
        }
    },

    /**
     * [changeSizeForPlugin 改变窗口大小]
     * @param  {[type]} width  [description]
     * @param  {[type]} height [description]
     */
    changeSizeForPlugin: function(width, height) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.resize(width, height);
            } else {
                playerSDK.onChangeSize(width, height);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.resize(width, height);
            } else {
                playerSDK.onChangeSize(width, height);
            }
        }
    },
    /**
     * 改变按钮的状态和图标
     * V6专用
     * screenIndex: 按钮所在窗口的位置
     * isLeft: 按钮在窗口的左部还是右部 1->左 0->右
     * btnPos: 按钮的位置，从0开始
     * btnKey: 按钮的状态，详细见PlayButtonCfg.xml
     */
    changeButtonForPlugin: function(screenIndex, isLeft, btnPos, btnKey) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.changeButton(screenIndex, btnKey);
            } else {
                playerSDK5.changeButton(screenIndex, isLeft, btnPos, btnKey);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.changeButton(screenIndex, btnKey);
            } else {
                playerSDK.changeButton(screenIndex, isLeft, btnPos, btnKey);
            }
        }
    },

    /**
     * 根据分屏位置暂停图像
     * */
    pauseDBImageByPosForPlugin: function(screenIndex) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.isSuspendPlay(screenIndex, true);
            } else {
                playerSDK5.pauseDBImageByPos(screenIndex);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.isSuspendPlay(screenIndex, true);
            } else {
                playerSDK.pauseDBImageByPos(screenIndex);
            }
        }
    },

    /**
     * 根据分屏位置恢复图像
     * */
    resumeDBImageByPosForPlugin: function(screenIndex) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.isSuspendPlay(screenIndex, false);
            } else {
                playerSDK5.resumeDBImageByPos(screenIndex);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.isSuspendPlay(screenIndex, false);
            } else {
                playerSDK.resumeDBImageByPos(screenIndex);
            }
        }
    },

    /**
     * 向媒体调度服务注册
     * info: 注册媒体调度服务用户及IP信息
     * var info = {
     *     userName:"abc",
     *     password:"P@ssw0rd",
     *     ip:"172.16.11.22",
     *     port:8088
     * }
     */
    registerForPlguin: function(info) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.register(info.userName, info.pwd, info.ip, parseInt(info.port));
            } else {
                playerSDK.register(info);
            }
        }
    },
    /**
     * 向媒体调度服务注销
     */
    unregisterForPlugin: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (this.config.pluginVersion == 2) {
                playerSDKNew.unRegister();
            } else {
                playerSDK.unRegister();
            }
        }
    },

    /**
     * 开启临时录像
     */
    startVideoRecording: function(resId, resCh, resType, pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartTempRecord(this.userToken, resId, resCh, pos)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (resType === 0) {
                businessSDK6.publishStartUserRecord(resId, '');
            } else if (resType === 1){
                businessSDK6.publishStartDeviceRecord(resId, '');
            }
        }
    },

    /**
     * 停止临时录像
     */
    stopVideoRecording: function(resId, resCh, resType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopTempRecord(this.userToken, resId, resCh)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (resType === 0) {
                businessSDK6.publishStopUserRecord(resId);
            } else if (resType === 1){
                businessSDK6.publishStopDeviceRecord(resId);
            }
        }
    },

    /**
     * 设置接收临时录像状态回调
     *
     * var resp ={resId:"",resCh:"",pos:"",isRecord:true/false}
     */
    setReceiveRecordingStatusCallback: function(cb) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveInformTempRecordStatusCallback(function(obj) {
                var resp = {}
                resp.resId = obj.resId
                resp.resCh = obj.resCh
                resp.pos = obj.pos
                resp.isRecord = obj.isRecord
                cb(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformStartRecordCallback(function(obj) {
                var resp = { resId: obj.resID, isRecord:1 };
                cb(resp);
            });
        }
    },
    //录像检索
    //var resp =[resourceId,resourceCh,data:{recordId:'',,begintime:'',endtime:'',size:'',url:''},]
    retrieveVideoRecording: function(resourceId, resourceCh, resourceType, startDate, endDate, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryRecord(this.userToken, resourceId, resourceCh, resourceType, startDate, endDate, function(obj) {
                var resp = { data: [] }
                resp.resourceId = resourceId
                resp.resourceCh = resourceCh
                if (obj.ret == 0) {
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var row = {}
                        row.recordId = item.recordid
                        row.recordName = item.recordname
                        row.begintime = item.begintime
                        row.endtime = item.endtime
                        row.size = item.filesize
                        row.url = item.url
                        resp.data.push(row)
                    })
                }
                callback(resp)
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryRecordResultItems(this.userID, resourceId, resourceType, startDate, endDate, function(obj){
                var resp = {resourceId: resourceId, resourceCh: resourceCh, data:[]};
                if (obj && obj.responseCode == 1) {
                    resp.Ret = 0;
                    resp.data = obj.data && obj.data.map(item => {
                        return {recordId: item.resourceID, recordName: item.resourceName, begintime: item.beginDate, endtime: item.endDate, size:'', url:''};
                    })
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            })
        }
    },
    /**
     * 图像抓拍
     * pos:位置
     * fileName:文件名称
     * httpPath:未知
     * */
    takeASnap: function(pos, fileName, httpPath, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (this.config.pluginVersion == 2) {
                // 无插件版本
                // playerSDK5.takeASnap(pos, fileName, httpPath);
                callback({ Ret: 0, url: playerSDKNew.setShoot(pos) });
            } else {
                // 有插件版本
                playerSDK5.takeASnap(pos, fileName, httpPath);
                callback({ Ret: 0, url: '../../../static/face/front.png' });
            }
            // callback({ Ret: 0, url: fileName });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //Wxx 2020.11.10
            if (this.config.pluginVersion == 2) {
                // 无插件版本
                // playerSDK5.takeASnap(pos, fileName, httpPath);
                callback({ Ret: 0, url: playerSDKNew.setShoot(pos) });
            } 
            // playerSDK.takeASnap(pos, fileName, httpPath);
            // callback({ Ret: 0, url: '../../../static/face/front.png' });
        }
    },
    /**
     * httpPath
     * */
    takeMultiSnap: function(fileName, httpPaths) {

    },
    /**
     * 开始录像回放（人员，设备入口）
     * resource: {resourceId:'',resourceCh:'',resourceType:0/1}
     * pos:屏位置
     */
    startVideoPlayback: function(resource, pos) {
                
    },
    /**
     * 开始录像回放（录像检索页面的回放入口）
     * recordIds:[{recordId:'',begintime,endtime}....]
     */
    startVideoPlayback2: function(resourceId, resourceCh, resourceType, recordIds) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var videoRecordingIds = JSON.stringify(recordIds);
            businessSDK5.startVideoPlayback2(this.userToken, resourceId, resourceCh, resourceType, videoRecordingIds);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var begin = recordIds[0].begintime
            var end = recordIds[0].endtime
            businessSDK6.publishStartPlayRecordItem('', resourceId, resourceType, begin, end);
        }
    },
    /**
     * 暂停录像回放
     * pos:位置
     */
    pauseVideoPlayback: function(pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishPlayRecord(this.userToken, pos, 0)

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 恢复播放
     * pos:位置
     *
     */
    resumeVideoPlayback: function(pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishPlayRecord(this.userToken, pos, 1)

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 更改回放速度
     * speedRate:x0.5、x1、x2、x4、x8、x16、x32
     */
    changeVideoPlaybackSpeed: function(pos, speedRate) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlRecordSpeed(this.userToken, pos, speedRate)

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 单帧回放
     * 针对快进的过多级别，恢复到x1倍速播放
     * pos:位置
     */
    singleFrameVideoPlayback: function(pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlRecordFrame(this.userToken, pos)

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 跳转到指定位置
     * pos:屏位置
     * position：指定位置,相对时间
     */
    jumpToSpecifiedPosition: function(pos, position) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlRecordTransfer(this.userToken, pos, position)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 录像回放回调函数
     * var resp ={resId:'',resCh:0, recordId:'',isPlaying:1,speed:x2,beginTime:'',endTime:'',position:0,isFrame:0,volume:1}
     * 其中：
     * isPlaying:1，0-暂停 1-播放
     * speed:x2,回放速度
     * position:10,当前回放位置
     * isFrame:0,是否单帧播放0-否, 1-是
     * volume:1,音量开关 0-关 1-开
     */
    setReceivePlaybackStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveInformPlayRecordCallback(function(params) {
                var resp = {}
                resp.resId = params.resourceId
                resp.resCh = params.resourceCh
                resp.recordId = params.recordId
                resp.isPlaying = params.isPlaying
                resp.speed = params.speed
                resp.beginTime = params.begintime
                resp.endTime = params.endtime
                resp.postion = params.position
                resp.isFrame = params.isFrame
                resp.volume = params.volume
                resp.value = params.value
                callback(resp)
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *  弹出下载录像组件
     * */
    showDownloadRecord: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

            playerSDK5.showDownloadRecord();

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //playerSDK.showDownloadRecord();
        }
    },
    startDownloadRecord: function(id, name, url, filesize, startTime, endtime) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            let file = 'name=' + name + ';url=' + url + ';filesize=' + filesize + ';startTime=' + 0 + ';EndTime=' + -1+ ';id=' + id;
            console.log(format);
            // "name=张三;url=ftp:\\a&&ftp:\\b;filesize=30;startTime=0;EndTime=-1"
            playerSDK5.startDownloadRecord(file);

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let attach_name = 'record' + new Date().getTime() + '.flv';
            let uploadUrl = xtxk.config.api.fileUploadURL;
            dataSDK6.recordquery(id, startTime, endtime, uploadUrl, (res) => {
                window.open(`${uploadUrl}/openvone/recordvod-play-system/api/v1/recorddown/slicefile?resource_id=${id}&beg_time=${res.recordFileItems[0].startAt}&end_time=${res.recordFileItems[0].stopAt}&attach_name=${attach_name}`,"_self");
            })
            // dataSDK6.downloadRecordFile(resource_id, beg_time, end_time, attach_name);
        }
    },
    /**
     * 开始云台3D
     * */
    startPtz3D: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            playerSDK5.startPtz3D();
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            playerSDK.startPtz3D();
        }
    },
    /**
     * 停止云台3D
     * */
    stopPtz3D: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            playerSDK5.stopPtz3D();

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            playerSDK.stopPtz3D();
        }
    },

    //****************************************录像方案******************************************************
    /**
     * 创建录像计划
     * 新建的计划没有任何设备和录制时间信息，所以创建完整的录像计划需分三个步骤进行：
     * 1.创建计划；2.绑定设备；3.绑定时间区间
     *
     * planName: 计划名称
     * allDay:true/false是否全天
     * startDate:开始时间
     * endDate:结束时间
     * timezone: 间隔时段 例：timezone=8，最小时间范围是2h（15min*8）,对于V6,这个值填写对应的录制时长
     * resources:[{resourceId:'',resourceCh:'',resourceType:具体参考enum定义}..]
     *
     * timeStructs: 录像时段数组（7个元素，一周）
     * timeStructs:[{"day":2,"time":[0,1]},{"day":3,"time":[1]},....]
     * 其中:day: 0  //周日至周六 0~6
     * time: //时段数组，长度为时段个数的递增序列，录像开启时段则列出，不开启时段不列出
     * var resp = {Ret=0/1}}
     */
    createVideoRecordingPlan: function(planName, allDay, startDate, endDate, resources, timeZone, timeStructs, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = { Ret: 0 }
            var self = this
            var inAllday = 0
            if (allDay == false) {
                inAllday = 0
            }
            if (allDay == true) {
                inAllday = 1
            }
            var inputResource = []
            resources && resources.forEach(function(item) {
                var it = {}
                it.resourceId = item.resourceId
                it.resourceCh = item.resourceCh
                if (item.resourceType === 0) { //人员
                    it.resourceType = 1
                }
                if (item.resourceType === 1) { //设备
                    it.resourceType = 2
                }
                inputResource.push(it)
            });
            inputResource = JSON.stringify(inputResource)
            var timeStructs = JSON.stringify(timeStructs)
            dataSDK5.addRecordScheme(this.userToken, planName, 0, inAllday, startDate, endDate, function(obj) {
                if (obj && obj.ret === 0) {
                    //添加方案成功,接着添加计划
                    var schemeId = obj.data.schemeId
                    dataSDK5.addRecordPlan(self.userToken, schemeId, planName, timeZone, function(objPlan) {
                        if (objPlan && objPlan.ret === 0) {
                            //添加计划成功，开始录像时间的设置
                            var planId = objPlan.data.planId
                            dataSDK5.addRecordTime(self.userToken, schemeId, planId, timeStructs, function(objTime) {
                                if (objTime && objTime.ret === 0) {
                                    //录像时间已经设置，设置资源
                                    dataSDK5.addRecordResource(self.userToken, schemeId, planId, inputResource, function(objResource) {
                                        if (objResource && objResource.ret === 0) {
                                            resp.Ret = objResource.ret
                                            callback(resp)
                                        } else {
                                            resp.Ret = 1
                                            callback(resp)
                                        }
                                    })
                                } else {
                                    resp.Ret = 1
                                    callback(resp)
                                }
                            })
                        } else {
                            resp.Ret = 1
                            callback(resp)
                        }
                    })
                } else {
                    resp.Ret = 1
                    callback(resp)
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let createDate = new Date().formatDate('yyyy-MM-dd HH:ss:mm');
            let resourceList = resources.map((item, index) => {
                return {index: index, resourceID: item.resourceId, deviceSIPID: "", type: item.resourceType, deviceType: 0, }
            });
            let timeStructList = timeStructs.map((item, index) => {
                if (item.time.length > 0) {
                    return {index: index, begin: item.time[0], end: item.time[item.time.length - 1], week: item.day, isEnable: false}
                } else {
                    return {index: index, begin: "", end: "", week: item.day, isEnable: false}
                }
            });
            dataSDK6.addRecordPlan(this.userID, '', planName, false, createDate, startDate, endDate, allDay, timeZone, resourceList, timeStructList, function(obj) {
                var resp = [];
                if (obj && obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    /**
     * 删除录像计划
     * planId: 计划ID //todo 对于V5来说，这个值传的是方案Id
     * var resp ={Ret=0/1}
     */
    deleteVideoRecordingPlan: function(planId, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //首先删除方案底下的计划
            var planids = []
            dataSDK5.queryRecordPlan(this.userToken, planId, function(obj) {
                if (obj && obj.data) {
                    var Datas = obj.data
                    Datas && Datas.forEach(function(item) {
                        dataSDK5.deleteRecordPlan(this.userToken, planId, item.planId, function(obj) {
                            console.log(obj)
                        })
                    })
                }
            })

            //接着删除方案
            dataSDK5.deleteRecordScheme(this.userToken, planId, function(obj) {
                var resp = {}
                resp.Ret = obj.ret
                callback(resp)
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeRecordPlan(planId, function(obj) {
                var resp = {};
                if (obj && obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
            
        }
    },

    /**
     * 获取录像计划
     * var resp =[{planId:'',planName:'',beginTime:"",duration:"",opened:true/false}...]
     *
     * 其中：beginTime:V6专用，开始时间,duration:V6专用,录制时长
     * */
    getVideoRecordingSchemeList: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

            dataSDK5.queryRecordScheme(this.userToken, function(obj) {
                var resp = []
                if (obj && obj.data) {
                    var schemes = obj.data
                    schemes && schemes.forEach(function(item) {
                        var it = {}
                        it.planId = item.schemeId
                        it.planName = item.schemeName
                        if (item.opend == "0") {
                            it.opened = false
                        } else if (item.opend == "1") {
                            it.opened = true
                        }
                        resp.push(it)
                    })
                }
                callback(resp)
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryRecordPlanListItems(this.userID, 0, 1000, function(obj) {
                var resp = [];
                if (obj && obj.data) {
                    resp = obj.data.map(item => {
                        return { planId: item.planID, planName: item.planName, beginTime: item.createDate, duration:"", opened: item.isEnable }
                    });
                }
                callback(resp);
            });
        }
    },

    /**
     * 返回的参数具体参照创建录像计划
     * var resp ={planId:"",planName:"",startDate:'',endDate:'',allDay:true/false,timeZone:''}
     *
     * planId:对于V5来说 planId为方案id
     * */
    getPlanInfoById: function(planId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = { planId: '', planName: '', startDate: '', endDate: '', allDay: '', timeZone: '' }

            var startDate = ""
            var endDate = ""
            var allDay = ""
            var planName = ""
            var timezone = 0
            var self = this

            //第一步查出startDate,endDate,allDay,planName
            dataSDK5.queryRecordScheme(this.userToken, function(obj) {
                if (obj && obj.data) {
                    var schemes = obj.data
                    schemes && schemes.forEach(function(item) {
                            if (item.schemeId === planId) {
                                startDate = item.begintime
                                endDate = item.endtime
                                allDay = item.allday
                                planName = item.schemeName
                            }
                        })
                        //第二步查出timeZone
                    dataSDK5.queryRecordPlan(self.userToken, planId, function(obj) {
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                timezone = item.timeZone
                            })
                            resp.planId = planId
                            resp.planName = planName
                            resp.startDate = startDate
                            resp.endDate = endDate
                            resp.allDay = allDay === "1"
                            resp.timeZone = timezone
                            callback(resp);
                        }
                    })
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return
        }
    },
    /**
     * 根据Id获取计划信息
     * planId:计划id
     *
     * var resp =  {creatorID: "", planID: "", planName: "", isEnable: false, createDate: "", beginDate: "",endDate: "",isAllDay:false,interval:"",resourcelist:[{index: "", resourceID: "", deviceSIPID: "", type: "", deviceType: "", }, {...}],itemlist:[{index: "", begin: "", end: "", week: "", isEnable: false, }, {...}]} 
     *
     * 其中:planId:计划Id
     * planName:计划名称
     * resourceId:资源id
     * resourceName:资源名称
     * beginTime:开始时间
     * duration:录制时长
     * */
    getPlanInfoByIdForV6: function(planId, callback) {
        dataSDK6.querySingleRecordPlan(planId, function(obj) {
            var resp = {};
            if (obj && obj.responseCode == 1) {
                // resp = obj.data;
                resp = {
                    creatorID: obj.data.creatorID || "", 
                    planID: obj.data.planID || "", 
                    planName: obj.data.planName || "", 
                    isEnable: obj.data.isEnable || false, 
                    createDate: obj.data.createDate || "", 
                    beginDate: obj.data.beginDate || "",
                    endDate: obj.data.endDate || "",
                    isAllDay:obj.data.isAllDay || false,
                    interval: obj.data.interval || "",
                    resourcelist: obj.data.resourcelist || [],
                    itemlist: obj.data.itemlist || []
                }
            }
            callback(resp);
        })
    },
    /**
     * 根据计划id查询资源
     * var resp =[{resId:'',resCh:'',resName:'',resType:具体参照enum.js}
     * */
    getResourceOfPlan: function(planId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //通过方案id查找planId
            var InputPlanId = ""
            var self = this
            dataSDK5.queryRecordPlan(this.userToken, planId, function(obj) {
                var resp = [{ resId: '', resCh: '', resName: '', resType: '' }]
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        InputPlanId = item.planId
                    })

                    var resp = []
                    dataSDK5.queryRecordResource(self.userToken, planId, InputPlanId, function(obj) {
                        if (obj && obj.data && obj.data.resources) {
                            obj.data.resources && obj.data.resources.forEach(function(item) {
                                var it = {}
                                it.resId = item.resourceId
                                it.resCh = item.resourceCh
                                it.resName = item.resourceName
                                if (item.resourceType === "1") {
                                    it.resType = 0
                                }
                                if (item.resourceType === "2") {
                                    it.resType = 1
                                }
                                resp.push(it)
                            })
                            callback(resp)
                        }
                    })

                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            return
        }
    },

    /**
     *  获取录像的时间设置
     *  var resp =[{day:0,time:[1,2,3]}{day:1,time:[3]}]
     * */
    getTimeOfPlan: function(planId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //通过方案id查找planId
            var InputPlanId = ""
            var self = this

            dataSDK5.queryRecordPlan(this.userToken, planId, function(obj) {
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        InputPlanId = item.planId
                    })

                    var resp = []
                    dataSDK5.queryRecordTime(self.userToken, InputPlanId, planId, function(obj) {
                        if (obj && obj.data && obj.data.times) {
                            resp = obj.data.times
                        }
                        callback(resp)
                    })
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 修改录像计划
     * 参数定义参见创建
     * allday:
     * resources:[{resourceId:'',resourceCh:'',resourceType:具体参考enum定义}..]
     * planId:方案id
     * var resp={Ret:0/1}
     */
    modifyVideoRecordingPlan: function(planId, planName, allDay, startDate, endDate, timezone, timestructs, resources, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var resp = { Ret: 0 }
            var self = this
            var inAllday = 0
            if (allDay == false) {
                inAllday = 0
            }
            if (allDay == true) {
                inAllday = 1
            }
            var inputResource = []
            resources && resources.forEach(function(item) {
                var it = {}
                it.resourceId = item.resourceId
                it.resourceCh = item.resourceCh
                if (item.resourceType === 0) {
                    it.resourceType = 1
                }
                if (item.resourceType === 1) {
                    it.resourceType = 2
                }
                inputResource.push(it)
            })
            inputResource = JSON.stringify(inputResource)
            var timestructs = JSON.stringify(timestructs)
            dataSDK5.updateRecordScheme(this.userToken, planId, planName, 0, inAllday, startDate, endDate, function(obj) {
                if (obj && obj.ret === 0) {
                    //接着删除录像计划，然后添加录像计划，添加资源，添加时间
                    //通过方案id查找planId
                    var InputPlanId = ""
                    dataSDK5.queryRecordPlan(self.userToken, planId, function(obj2) {
                        if (obj2 && obj2.ret === 0 && obj2.data.length > 0) {
                            obj2.data.forEach(function(item) {
                                    InputPlanId = item.planId
                                })
                                //删除录像计划
                            dataSDK5.deleteRecordPlan(self.userToken, planId, InputPlanId, function(delObjPlan) {
                                if (delObjPlan && delObjPlan.ret === 0) {
                                    //添加录像计划
                                    dataSDK5.addRecordPlan(self.userToken, planId, planName, timezone, function(objPlan) {
                                        if (objPlan && objPlan.ret === 0) {
                                            var inPlanId = objPlan.data.planId
                                                //添加资源
                                            dataSDK5.addRecordResource(self.userToken, planId, inPlanId, inputResource, function(objResource) {
                                                if (objResource && objResource.ret === 0) {
                                                    //添加时间
                                                    dataSDK5.addRecordTime(self.userToken, planId, inPlanId, timestructs, function(objTime) {
                                                        if (objTime && objTime.ret === 0) {
                                                            resp.Ret = objTime.ret
                                                            callback(resp)
                                                        } else {
                                                            resp.Ret = 1
                                                            callback(resp)
                                                        }
                                                    })
                                                } else {
                                                    resp.Ret = 1
                                                    callback(resp)
                                                }
                                            })
                                        } else {
                                            resp.Ret = 1
                                            callback(resp)
                                        }
                                    })
                                } else {
                                    resp.Ret = 1
                                    callback(resp)
                                }
                            })
                        } else {
                            resp.Ret = 1
                            callback(resp)
                        }
                    })
                } else {
                    resp.Ret = 1
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            let createDate = new Date().formatDate('yyyy-MM-dd');
            let resourceList = resources.map((item, index) => {
                return {index: index, resourceID: item.resourceId, deviceSIPID: "", type: item.resourceType, deviceType: "", }
            });
            let timeStructList = timestructs.map((item, index) => {
                if (item.time.length > 0) {
                    return {index: index, begin: item.time[0], end: item.time[item.time.length - 1], week: item.day, isEnable: false}
                } else {
                    return {index: index, begin: "", end: "", week: item.day, isEnable: false}
                }
            });
            dataSDK6.editRecordPlan(this.userID, planId, planName, false, createDate, startDate, endDate, allDay, timezone, resourceList, timeStructList, function(obj) {
                var resp = [];
                if (obj && obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    /**
     * 启动/停止录像方案
     * planId: 方案ID
     * enabled: 方案是否启动
     * var resp ={Ret:0/1}
     */
    setVideoRecordingPlanEnabled: function(planId, enabled, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (enabled) {
                dataSDK5.startRecordScheme(this.userToken, planId, function(obj) {
                    var resp = {}
                    resp.Ret = obj.ret
                    callback(resp)
                });
            } else {
                dataSDK5.stopRecordScheme(this.userToken, planId, function(obj) {
                    var resp = {}
                    resp.Ret = obj.ret
                    callback(resp)
                })
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (enabled) {
                dataSDK6.startRecordPlan(planId, function(obj) {
                    var resp = {}
                    if (obj && obj.responseCode == 1) {
                        resp.Ret = 0;
                    } else {
                        resp.Ret = 1;
                    }
                    callback(resp)
                });
            } else {
                dataSDK6.stopRecordPlan(planId, function(obj) {
                    var resp = {}
                    if (obj && obj.responseCode == 1) {
                        resp.Ret = 0;
                    } else {
                        resp.Ret = 1;
                    }
                    callback(resp)
                })
            }
        }
    },

    /**
     * 从计划中删除资源
     * */
    deleteResourceFromPlan: function(planId, callback) {

    },

    /**
     * 查询计划录像状态
     *
     * schemeId : 方案Id
     */
    queryRecordSchemeStatus: function(schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishQueryRecordSchemeStatus(this.userToken, schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 获取计划录像状态回调
     * 
     * planId : 录像Id
     * resourceName : 资源名称
     * status : 录制状态 (0 : 未录制 1 : 录制中)
     *
     * resp = [{resourceName : "",transcribeState : ""}...]
     * */
    setRecordSchemeStatusCallBack: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveRecordSchemeStatusCallBack(function(obj) {
                var resp = { Ret: 0, data: [], msg: '' };
                if (obj && obj.ret == 0) {
                    resp.Ret = 0;
                    obj.plans.length > 0 && obj.plans.forEach(item => {
                        if (item.resources.length > 0) {
                            item.resources.forEach(ele => {
                                var it = {
                                    resourceName: ele.resourceName,
                                    transcribeState: ele.status == 0 ? '未录制' : '录制中',
                                };
                                resp.data.push(it);
                            })
                        }
                    });
                } else {
                    resp.Ret = 1;
                    resp.msg = obj.msg;
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },



    //************************************解码器控制*************************************************************
    //----------矩阵订阅-----------------------------------------------------------------------------------------
    /**
     * 矩阵订阅
     * destId: 目的矩阵
     * desPos: 订阅的通道id
     * sourceId: 被订阅的矩阵
     * sourcePos: 被订阅通道id
     *
     * subscriptions:[{destId:"",destPos:"",sourceId:"",sourcePos:""}..]
     *
     * var resp={Ret:0/1}
     * 0:成功，1：失败
     */
    addMatrixSubscribe: function(subscriptions, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var subscriptionsMe = []
            subscriptions && subscriptions.forEach(item => {
                var row = {}
                row.destId = item.destId
                row.destPos = item.destPos - 1
                row.sourceId = item.sourceId
                row.sourcePos = item.sourcePos - 1
                subscriptionsMe.push(row)
            })

            dataSDK5.addMatrixSubscribe2(this.userToken, JSON.stringify(subscriptionsMe), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            subscriptions && subscriptions.forEach(item => {
                var destId = item.destId
                var destPos = item.destPos - 1
                var sourceId = item.sourceId
                var sourcePos = item.sourcePos - 1
                dataSDK6.addDecoderSubscription(sourceId, sourcePos, destId, destPos, function(obj) {
                    // { responseCode:1, data: true }
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0;
                    } else {
                        resp.Ret = 1;
                    }
                    callback(resp);
                });

            })
        }

    },

    /**
     * 取消矩阵订阅
     * subscribeId:订阅id
     * */
    cancelSubscribeMatrix: function(subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // {funName:"cancelSubscribeMatrixStatus", params:{token="",matrixs=[{matrixId:""}]}}
            var matrixs = [];
            var it = {};
            it.matrixId = subscribeId;
            matrixs.push(it)
            businessSDK5.cancelSubscribeMatrixStatus(this.userToken, JSON.stringify(matrixs));
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 删除已订阅的矩阵
     * subscribeId:订阅id
     * var resp={Ret:0/1}
     */
    deleteSubscribedMatrix: function(subscribeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteMatrixSubscribe(this.userToken, subscribeId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeDecoderSubscription(subscribeId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    /**
     * 获取已订阅的矩阵列表
     * isNet:true/false,true:表示本中心,false:表示全网
     * var resp ={totalCnt:'',rows:[{subscribeId:'',destId:'',destName:'',destCenter:'',destPos:'',sourceId:'',sourceName:'',sourceCenter:'',sourcePos:'',isUse:true/false}]}
     * subscribeId:记录的条数id
     * destName:目的矩阵名称
     * destCenter:目的矩阵中心
     * destPos:目的矩阵通道

     * sourceName:源矩阵的名称
     * sourceCenter:源矩阵中心
     * sourcePos:源矩阵通道
     *
     */
    getSubscribedMatrixList: function(isNet, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // type:0-本中心，1-全网
            if (isNet == true) {
                var type = 0;
            }else if (isNet == false) {
                var type = 1;
            }
            dataSDK5.queryMatrixSubscribe(this.userToken, type, page, page - 1, pageSize, function(obj) {
                // {"Ret":0,"Msg":"Success","Data":{total:1,,page:1,rows:[{subscribeId=""， sourceId=""&sourcePos=1&destId=""&destPos=1&isUse=1}]}}
                var resp = { totalCnt: '', rows: [] };
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.total;
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {}
                        it.subscribeId = item.subscribeId
                        it.destId = item.destId
                        it.destName = item.destName
                        it.destCenter = item.destCenterName
                        it.destPos = item.destPos + 1
                        it.sourceId = item.sourceId
                        it.sourceName = item.sourceName
                        it.sourceCenter = item.destCenterName
                        it.sourcePos = item.sourcePos + 1
                        if (item.isUse == 1) {
                            it.isUse = true;
                        } else {
                            it.isUse = false;
                        }
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryAllDecoderSubscription(function(obj) {
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    var data = obj.data
                    resp.totalCnt = data.length
                    data && data.forEach(function(item) {
                        var it = {}
                        it.subscribeId = item.subscriptionID;
                        it.destId = item.targetID;
                        it.destName = item.targetName;
                        it.destCenter = "";
                        it.destPos = item.targetScreenIndex;
                        it.sourceId = item.sourceID;
                        it.sourceName = item.sourceName;
                        it.sourceCenter = "";
                        it.sourcePos = item.sourceScreenIndex;
                        it.isUse = item.isActived;
                        resp.rows.push(it);
                    })
                    callback(resp);
                }
            });
        }
    },

    /**
     * 根据矩阵id查询订阅信息
     * var resp=[{subscribeId,sourceId,sourceName,sourcePos,destId,destName,destPos.isUse:true/false}]
     * */
    getSubscriptionsById: function(destId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixSubscribe2(this.userToken, "", destId, function(obj) {
                var resp = []
                if (obj && obj.ret === 0) {
                    obj.data.rows && obj.data.rows.forEach((item) => {
                        var row = {}
                        row.subscribeId = item.subscribeId
                        row.sourceId = item.sourceId
                        row.sourceName = item.sourceName
                        row.sourcePos = item.sourcePos + 1
                        row.destId = item.destId
                        row.destName = item.destName
                        row.destPos = item.destPos + 1
                        row.isUse = item.isUse === 1
                        resp.push(row)
                    })

                    callback(resp)
                } else {
                    callback(resp)
                }
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDecoderSubscriptionByTarget(destId, function(obj) {
                var resp = [];
                if (obj && obj.data.data && obj.responseCode == 1) {
                    obj.data.data && obj.data.data.forEach(function(item) {
                        var it = {}
                        it.subscribeId = item.subscriptionID;
                        it.destId = item.targetID;
                        it.destName = item.targetName;
                        it.destPos = item.targetScreenIndex || 0;
                        it.sourceId = item.sourceID;
                        it.sourceName = item.sourceName;
                        it.sourcePos = item.sourceScreenIndex || 0;
                        it.isUse = item.isActived;
                        resp.push(it);
                    })
                }
                callback(resp)
            })
        }
    },

    /**
     * 搜索矩阵列表
     * destName:目的矩阵
     * sourceName:源矩阵
     * page:页码
     * pageSize:页数
     *
     * var resp ={totalCnt:'',rows:[{subscribeId:'',destId:'',destName:'',destCenter:'',destPos:'',sourceId:'',sourceName:'',sourceCenter:'',sourcePos:'',isUse:true/false}]}
     * */
    querySubscribeMatrixList: function(dest, source, page, pageSize, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixSubscribe3(this.userToken, source, dest, function(obj) {
                // {"Ret":0,"Msg":"Success","Data":{total:1,,page:1,rows:[{subscribeId=""， sourceId=""&sourcePos=1&destId=""&destPos=1&isUse=1}]}}
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.total;
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {};
                        it.subscribeId = item.subscribeId;
                        it.destId = item.destId;
                        it.destName = item.destName;
                        it.destCenter = item.destCenterName;
                        it.destPos = item.destPos + 1;
                        it.sourceId = item.sourceId;
                        it.sourceName = item.sourceName;
                        it.sourceCenter = item.sourceCenterName;
                        it.sourcePos = item.sourcePos + 1;
                        if (item.isUse == 1) {
                            it.isUse = true;
                        } else {
                            it.isUse = false;
                        }
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (source && dest) {
                dataSDK6.queryDecoderSubscriptionBySource(source, function(obj) {
                    var resp = { totalCnt: '', rows: [] }
                    if (obj.responseCode == 1) {
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.subscribeId = item.subscriptionID;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.destCenter = "";
                                it.destPos = item.targetScreenIndex;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.sourceCenter = "";
                                it.sourcePos = item.sourceScreenIndex;
                                it.isUse = item.isActived;
                                resp.rows.push(it);
                            })
                        }
                        dataSDK6.queryDecoderSubscriptionByTarget(dest, function(obj) {
                            if (obj && obj.data) {
                                obj.data && obj.data.forEach(function(item) {
                                    var it = {}
                                    it.subscribeId = item.subscriptionID;
                                    it.destId = item.targetID;
                                    it.destName = item.targetName;
                                    it.destCenter = "";
                                    it.destPos = item.targetScreenIndex;
                                    it.sourceId = item.sourceID;
                                    it.sourceName = item.sourceName;
                                    it.sourceCenter = "";
                                    it.sourcePos = item.sourceScreenIndex;
                                    it.isUse = item.isActived;
                                    resp.rows.push(it);
                                })
                            }
                            resp.totalCnt = resp.rows.length;
                            callback(resp)
                        })
                    } else {
                        callback(resp);
                    }
                })

            } else {
                if (source) {
                    dataSDK6.queryDecoderSubscriptionBySource(source, function(obj) {
                        var resp = { totalCnt: '', rows: [] }
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.subscribeId = item.subscriptionID;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.destCenter = "";
                                it.destPos = item.targetScreenIndex;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.sourceCenter = "";
                                it.sourcePos = item.sourceScreenIndex;
                                it.isUse = item.isActived;
                                resp.rows.push(it);
                            })
                            resp.totalCnt = resp.rows.length
                            callback(resp)
                        }
                    })
                }
                if (dest) {
                    dataSDK6.queryDecoderSubscriptionByTarget(dest, function(obj) {
                        var resp = { totalCnt: '', rows: [] }
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.subscribeId = item.subscriptionID;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.destCenter = "";
                                it.destPos = item.targetScreenIndex;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.sourceCenter = "";
                                it.sourcePos = item.sourceScreenIndex;
                                it.isUse = item.isActived;
                                resp.rows.push(it);
                            })
                            resp.totalCnt = resp.rows.length;
                            callback(resp)
                        }
                    })
                }
            }

        }
    },

    /**
     * 修改矩阵订阅列表
     * subscribeId:订阅Id
     * */
    modifySubscribeMatrixList: function(subscribeId, destId, destPos, sourceId, sourcePos, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateMatrixSubscribe(this.userToken, subscribeId, sourceId, sourcePos, destId, destPos, 1, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.editDecoderSubscription(subscribeId, sourceId, sourcePos, destId, destPos, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
            });
        }
    },

    /**
     * 启动矩阵订阅
     * subscription:{subscribeId:"",destId:"",destPos:"",sourceId:"",sourcePos:""}
     * isUse:true启用，false，不启用
     *
     * var resp ={Ret:0/1}
     * */
    launchMatrixUse: function(subscribeId, subscription, isUse, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var isUseMe = isUse === true ? 1 : 0
            dataSDK5.updateMatrixSubscribe(this.userToken, subscribeId, subscription.sourceId, subscription.sourcePos, subscription.destId, subscription.destPos, isUseMe, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setDecoderSubscriptionIsActived(subscribeId, isUse, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)

            })
        }
    },
    //----------矩阵同步------------------------------------------------------------------------------
    /**
     * 矩阵同步
     *
     * destId:目标解码器
     * sourceId:源解码器
     *
     * var resp ={Ret:0/1}
     */
    addMatrixSync: function(destId, sourceId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.addMatrixSync(this.userToken, sourceId, destId, 1, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.addDecoderSynchronization(sourceId, destId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });
        }
    },

    /**
     * 删除已同步的矩阵
     * synchronizeId: 已同步矩阵的ID
     * var Resp ={Ret:0/1}
     */
    deleteSynchronizedMatrix: function(synchronizeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteMatrixSync(this.userToken, synchronizeId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeDecoderSynchronization(synchronizeId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },

    /**
     * 获取矩阵同步列表
     * isNet:true/false,true:表示本中心,false:表示全网
     * var resp ={totalCnt:'',rows:[{syncId:'',sourceId:'',sourceName:'',sourceCenterName:'',destId:'',destName:'',destCenterName:'',isUse:true/false}]}
     *
     */
    getSynchronizeMatrixList: function(isNet, page, pageSize, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // type:0-本中心，1-全网
            if (isNet == true) {
                var type = 0;
            }else if (isNet == false) {
                var type = 1;
            }
            dataSDK5.queryMatrixSync(this.userToken, type, page, page - 1, pageSize, function(obj) {
                //  var resp ={totalCnt:'',rows:[{syncId:'',sourceId:'',sourceName:'',destId:'',destName:'',isUse:true/false}]}
                var resp = { totalCnt: '', rows: [] };
                // {"Ret":0,"Msg":"Success","Data":{total:1,,page:1,rows:[{syncId=""， sourceId=""&destId=""&isUse=1}]}}
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.total;
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {}
                        it.syncId = item.syncId
                        it.sourceId = item.sourceId
                        it.sourceName = item.sourceName
                        it.sourceCenterName = item.sourceCenterName
                        it.destId = item.destId
                        it.destName = item.destName;
                        it.destCenterName = item.destCenterName
                        if (item.isUse === 1) {
                            it.isUse = true
                        } else {
                            it.IsUse = false
                        }
                        resp.rows.push(it)
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryAllDecoderSynchronization(function(obj) {
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    obj.data && 　obj.data.forEach(function(item) {
                        var it = {}
                        it.syncId = item.synchronizationID;
                        it.sourceId = item.sourceID;
                        it.sourceName = item.sourceName;
                        it.destId = item.targetID;
                        it.destName = item.targetName;
                        it.IsUse = item.isActived;
                        resp.rows.push(it);
                    })
                    resp.totalCnt = resp.rows.length
                    callback(resp)
                }
            });
        }
    },

    /**
     * 根据目标矩阵获取相信同步信息
     * var resp =[{syncId:'',sourceId:'',sourceName:'',destId:'',destName:'',isUse:true/false}]
     * */
    getSynchronizeMatrixById: function(destId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixSync2(this.userToken, "", destId, function(obj) {
                var resp = []
                if (obj && obj.ret === 0) {
                    obj.data　 && 　obj.data.forEach((item) => {
                        var row = {}
                        row.syncId = item.syncId
                        row.sourceId = item.sourceId
                        row.sourceName = item.sourceName
                        row.destId = item.destId
                        row.destName = item.destName
                        row.isUse = item.isUse === 1
                        resp.push(row)
                    })

                    callback(resp)
                } else {
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDecoderSynchronizationByTarget(destId, function(obj) {
                var resp = []
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {}
                        it.syncId = item.synchronizationID;
                        it.sourceId = item.sourceID;
                        it.sourceName = item.sourceName;
                        it.destId = item.targetID;
                        it.destName = item.targetName;
                        it.isUse = item.isActived;
                        resp.push(it);
                    })
                }
                callback(resp);
            })
        }
    },

    /**
     * dest:目的搜索关键字
     * source:源搜索关键字
     *
     *
     * var resp ={totalCnt:'',rows:[{syncId:'',sourceId:'',sourceName:'',sourceCenterName:'',destId:'',destName:'',destCenterName:'',isUse:true/false}]}
     *
     * */
    querySynchronizeMatrixList: function(dest, source, page, pagesize, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixSync3(this.userToken, source, dest, function(obj) {
                // {"Ret":0,"Msg":"Success","Data":{total:1,,page:1,rows:[{syncId=""， sourceId=""&destId=""&isUse=1}]}}
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.total;
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {};
                        it.syncId = item.syncId;
                        it.sourceId = item.sourceId;
                        it.sourceName = item.sourceName;
                        it.sourceCenterName = item.sourceCenterName;
                        it.destId = item.destId;
                        it.destName = item.destName;
                        it.destCenterName = item.destCenterName;
                        if (item.isUse == 1) {
                            it.isUse = true;
                        } else {
                            it.isUse = false;
                        }
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // var resp ={totalCnt:'',rows:[{syncId:'',sourceId:'',sourceName:'',sourceCenterName:'',destId:'',destName:'',destCenterName:'',isUse:true/false}]}
            if (source != "" && dest != "") {
                dataSDK6.queryDecoderSynchronizationBySource(source, function(obj) {
                    var resp = { totalCnt: '', rows: [] }
                    if (obj.responseCode == 1) {
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.syncId = item.synchronizationID;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.isUse = item.isActived;
                                resp.rows.push(it)
                            })
                            dataSDK6.queryDecoderSynchronizationByTarget(dest, function(obj) {
                                if (obj && obj.data) {
                                    obj.data && obj.data.forEach(function(item) {
                                        var it = {}
                                        it.syncId = item.synchronizationID;
                                        it.sourceId = item.sourceID;
                                        it.sourceName = item.sourceName;
                                        it.destId = item.targetID;
                                        it.destName = item.targetName;
                                        it.isUse = item.isActived;
                                        resp.rows.push(it)
                                    })
                                }
                                resp.totalCnt = resp.rows.length;
                                callback(resp);
                            })
                        }
                    } else {
                        callback(resp);
                    }


                })
            } else {
                if (source) {
                    dataSDK6.queryDecoderSynchronizationBySource(source, function(obj) {
                        var resp = { totalCnt: '', rows: [] }
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.syncId = item.synchronizationID;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.isUse = item.isActived;
                                resp.rows.push(it)
                            })
                            resp.totalCnt = resp.rows.length
                            callback(resp)
                        }
                    })
                }
                if (dest) {
                    dataSDK6.queryDecoderSynchronizationByTarget(dest, function(obj) {
                        var resp = { totalCnt: '', rows: [] }
                        if (obj && obj.data) {
                            obj.data && obj.data.forEach(function(item) {
                                var it = {}
                                it.syncId = item.synchronizationID;
                                it.sourceId = item.sourceID;
                                it.sourceName = item.sourceName;
                                it.destId = item.targetID;
                                it.destName = item.targetName;
                                it.isUse = item.isActived;
                                resp.rows.push(it)
                            })
                            resp.totalCnt = resp.rows.length
                            callback(resp)
                        }
                    })
                }
            }
        }
    },

    /**
     * 修改矩阵同步
     *
     * synchronizeIs: 已同步矩阵的ID数组
     * destId: 目标矩阵
     * sourceId:源矩阵
     * isUse:true启用/false取消
     * var resp ={Ret:0/1}
     */
    modifySynchronizedMatrix: function(synchronizedId, destId, sourceId, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateMatrixSync(this.userToken, synchronizedId, sourceId, destId, 1, function(obj) {
                var resp = {}
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.editDecoderSynchronization(synchronizedId, sourceId, destId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },

    /**
     * 启动矩阵同步
     * synchronizedId 同步id
     * synchronization:{synchronizedId:"",destId:"",sourceId:""}
     * isUse:true启用，false是不启用
     * var resp ={Ret:0/1}
     * */
    launchSynchronizedUse: function(synchronizedId, synchronization, isUse, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var isUseMe = isUse === true ? 1 : 0
            dataSDK5.updateMatrixSync(this.userToken, synchronizedId, synchronization.sourceId, synchronization.destId, isUseMe, function(obj) {
                var resp = {}
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.setDecoderSynchronizationIsActived(synchronizedId, isUse, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },
    //----------解码器分组管理设置-------------------------------------------------------------------------------------------
    /**
     * 创建解码器分组
     * groupName: 解码器分组名
     * decoders:[{resId:'',resName''}....]
     * var resp ={Ret:0/1}
     */
    addDecoderGroup: function(groupName, decoders, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var matrixs = []
            decoders && decoders.forEach(function(item) {
                var it = {};
                it.matrixId = item.resId;
                matrixs.push(it)
            })
            dataSDK5.addMatrixGroup(this.userToken, groupName, 1, 3, JSON.stringify(matrixs), function(obj) {
                var resp = {}
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var devices = [];
            decoders && decoders.forEach(function(index, item) {
                var it = {};
                it.deviceID = item.resId;
                it.index = index;
                devices.push(it);
            })
            dataSDK6.addDecoderGroup(groupName, "", JSON.stringify(devices), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });

        }
    },
    /**
     * 删除解码器分组
     * groupId: 解码器分组ID
     * var resp ={Ret:0/1}
     */
    deleteDecoderGroup: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteMaxtrixGroup(this.userToken, groupId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var groupIds = [];
            groupIds.push(groupId);
            dataSDK6.removeAnyDecoderGroups(groupIds, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp);
            });

        }
    },
    /**
     * 获取解码器分组列表
     *
     * var resp={totalCnt:'',rows:[{groupId:'',groupName:''}]}
     */
    getDecoderGroupList: function(page, pagesize, callback) {

        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixGroup(this.userToken, page, page - 1, pagesize, function(obj) {
                var resp = { totalCnt: '', rows: [] };
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.total;
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {}
                        it.groupId = item.groupID;
                        it.groupName = item.groupName;
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDecoderGroupList(this.userID, function(obj) {
                var resp = { totalCnt: '', rows: [] };
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.groupId = item.groupID;
                        it.groupName = item.groupName;
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        }
    },
    /**
     * 根据Id获取解码器
     * groupId: 解码器分组ID
     * var resp =[{matrixId:'',matrixName:'',matrixSplitNum:0},......]
     */
    getDecoderInfoById: function(groupId, callback) {
        var resp = []
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixGroup2(this.userToken, groupId, function(obj) {
                if (obj.data && obj.data.matrixs) {
                    obj.data.matrixs && obj.data.matrixs.forEach((item) => {
                        var it = {}
                        it.matrixId = item.matrixId
                        it.matrixName = item.matrixName
                        it.matrixSplitNum = item.matrixSplitNum
                        resp.push(it);
                    });
                }
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleDecoderGroup(groupId, function(obj) {
                var resp = []
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.devices ? obj.data.devices.length : 0
                    obj.data.devices && obj.data.devices.forEach(function(item) {
                        var it = {};
                        it.matrixId = item.deviceID;
                        it.matrixName = item.deviceName;
                        it.matrixSplitNum = 0
                        resp.push(it);
                    })
                }
                callback(resp);
            });
        }
    },
    /**
     * 保存解码器分组
     * groupId:解码器分组id
     * groupName:解码器分组名称
     * decoders:[{resId:'',resName''}....]
     * var resp ={Ret:0/1}
     */
    saveDecoderGroup: function(groupId, groupName, decoders, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var matrixs = [];
            decoders && decoders.forEach(function(item) {
                var it = {}
                it.matrixId = item.resId
                matrixs.push(it)
            })
            dataSDK5.updateMaxtrixGroup(this.userToken, groupId, groupName, decoders.length, 1, JSON.stringify(matrixs), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var devices = [];
            decoders && decoders.forEach(function(item, index) {
                var it = {};
                it.index = index;
                it.deviceID = item.resId
                devices.push(it);
            })
            dataSDK6.editDecoderGroup(groupId, groupName, "", JSON.stringify(devices), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });

        }
    },
    /**
     * 修改解码器分组信息
     * groupId:解码器分组id
     * groupName:解码器分组名称
     * decoders:[{resId:'',resName''}....]
     *
     * var resp={Ret:0/1}
     * */
    modifyDecoderGroup: function(groupId, groupName, decoders, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateMaxtrixGroup2(this.userToken, groupId, groupName, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            })

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var devices = [];
            decoders && decoders.forEach(function(item, index) {
                var it = {};
                it.index = index;
                it.deviceID = item.resId
                devices.push(it);
            })
            dataSDK6.editDecoderGroup(groupId, groupName, "", JSON.stringify(devices), function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });

        }
    },

    //-------------解码器控制---------------------------------------------------------------------------------------------
    /**
     * 设置全屏播放
     * matrixId: 解码器ID
     * pos: 解码器位置
     */
    setFullScreen: function(matrixId, pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixFull(this.userToken, matrixId, pos);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetDecoderFullScreen(matrixId, pos);
        }
    },
    /**
     * 开始分屏播放
     *
     * resourceType:0:人员,1:设备
     * */
    startMatrixPlay: function(matrixId, pos, resourceId, resourceCh, resourceType, resourceName) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"publishCtrlMatrixDBImage", params:{token="",matrixId="",pos:"",deviceId:"",deviceCh:0}}
            businessSDK5.publishCtrlMatrixDBImage(this.userToken, matrixId, pos, resourceId, resourceCh);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceTypeMe = "User"
            if (resourceType == 0) {
                resourceTypeMe = "User"
            } else if (resourceType == 1) {
                resourceTypeMe = "Device"
            }
            businessSDK6.publishStartDecoderScreenPlay(matrixId, pos, resourceId, resourceTypeMe, resourceName);
        }
    },
    /**
     * 停止分屏播放
     * matrixId: 解码器ID
     * pos: 解码器位置
     */
    stopMatrixPlay: function(matrixId, pos) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixStopDBImage(this.userToken, matrixId, pos);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopDecoderScreenPlay(matrixId, pos);
        }

    },
    /**
     * 设置分屏声音
     *
     * matrixId: 解码器ID
     * pos: 解码器位置
     * value: 音量
     */
    setMatrixVolume: function(matrixId, pos, value) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixVolume(this.userToken, matrixId, pos, 1, value);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetDecoderScreenSoundValue(matrixId, pos, value);
        }


    },
    /**
     * 设置分屏静音
     *  matrixId:矩阵id
     *  pos:位置
     *  isMute:true.禁音, false.取消禁音
     * */
    setMatrixMuteByPos: function(matrixId, pos, isMute) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var volume = 0
            if (isMute) {
                volume = 1
            }
            businessSDK5.publishCtrlMatrixVolume(this.userToken, matrixId, pos, volume, 50);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetDecoderScreenSoundOff(matrixId, pos, isMute);
        }
    },
    /**
     * 恢复/暂停分屏播放
     * matrixId: 解码器ID
     * pos: 解码器位置
     * isPause:true 暂停,false 恢复
     */
    resumeMatrixPlay: function(matrixId, pos, isPause) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var isPlay = 1
            if (isPause) {
                isPlay = 0
            }
            businessSDK5.publishCtrlMatrixPlay(this.userToken, matrixId, pos, isPlay);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 加速播放或者减速播放
     * x36,x16,x8,x4,x2,x1,x0.5
     * */
    changeMatrixPlaySpeed: function(matrixId, speedRate) {

    },
    /**
     * 开始全部播放
     * maxtrixId:解码器Id
     * */
    startAllMatrixPlay: function(matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixAllPlay(this.userToken, matrixId, true);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 停止所有播放
     * matrixId: 解码器ID
     */
    stopAllMatrixPlay: function(matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixStopAll(this.userToken, matrixId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopDecoderPlay(matrixId);
        }


    },
    /**
     *  暂停/恢复所有的播放
     *  isPause 0 暂停 1 恢复
     * */
    pauseAllMatrixPlay: function(matrixId, isPause) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixAllPlay(this.userToken, matrixId, isPause);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 设置显示模式
     * matrixid: 解码器ID
     * splitType: 显示模式，支持1、4、9、12、16分屏显示模式,具体参见enum.js
     */
    setMatrixDisplayMode: function(matrixId, splitType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var displayMode = this.getSplitType(splitType, 5)
            businessSDK5.publishCtrlMatrixSplit(this.userToken, matrixId, displayMode);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var displayMode = this.getSplitType(splitType, 6)
            businessSDK6.publishSetDecoderSplitType(matrixId, displayMode);
        }
    },
    /**
     * 取消全屏[对应全局操作按钮]
     * matrixid: 解码器ID
     */
    cancelMatrixFullScreen: function(matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCtrlMatrixCancelFull(this.userToken, matrixId, -1); //王忠的认可传-1
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCancelDecoderFullScreen(matrixId);
        }

    },
    /**
     * 设置全场静音
     * matrixId:矩阵Id
     * isEnable:true为禁全场声音，false取消全场声音
     * */
    setMatrixMuteAll: function(matrixId, isEnable) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"publishCtrlMatrixAllVolume", params:{token="",matrixId="",volume:0}}
            businessSDK5.publishCtrlMatrixAllVolume(this.userToken, matrixId, isEnable ? 0 : 1);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetDecoderSoundOff(matrixId, isEnable);
        }
    },
    /**
     * 获得所有的解码器
     * matrixId:解码器Id
     * matrixName:解码器名称
     * matrixSplitNum:解码器最大分屏数
     * isNet:true/false,true:表示本中心,false:表示全网
     *
     * var resp ={totalCnt:"",rows:[{matrixId:"",matrixName:"",matrixSplitNum:""}]}
     *
     * */
    getAllMatrix: function(page, pageSize, isNet, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // type:0-本中心，1-全网
            if (isNet == true) {
                var type = 0;
            }else if (isNet == false) {
                var type = 1;
            }
            dataSDK5.getMatrix(this.userToken, type, page, page - 1, pageSize, function(obj) {
                var resp = { totalCnt: '', rows: [] }
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        var row = {}
                        row.matrixId = item.matrixId
                        row.matrixName = item.matrixName
                        row.matrixSplitNum = item.matrixSplitNum
                        resp.rows.push(row)
                    });
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDeviceList("SIPDecoder", 0, 1024, function(obj) {
                var resp = { totalCnt: "", rows: [] }
                if (obj && obj.data) {
                    resp.totalCnt = obj.data.totalCount;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        it.matrixId = item.deviceID;
                        it.matrixName = item.deviceName;
                        it.matrixSplitNum = 9;
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        }
    },
    /**
     * 开启解码器轮循
     * groupId：轮训组ID
     * */
    startMatrixLoop: function(groupId, matrixId, schemeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"publishCtrlMatrixStartLoop", params:{token="",matrixId="",groupid:""}}
            businessSDK5.publishCtrlMatrixStartLoop(this.userToken, matrixId, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var decoderGroupID = groupId;
            var decoderID = matrixId;
            var schemeID = schemeId;
            businessSDK6.publishStartDecoderGroup(decoderID, decoderGroupID, schemeID);
        }
    },
    /**
     * 停止解码器轮循
     * groupId：轮训组ID
     * */
    stopMatrixLoop: function(groupId, matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"publishCtrlMatrixStopLoop", params:{token="",matrixId="",groupid:""}}
            businessSDK5.publishCtrlMatrixStopLoop(this.userToken, matrixId, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var decoderID = matrixId;
            businessSDK6.publishStopDecoderGroup(decoderID);
        }
    },

    /**
     * 矩阵点播图像复位
     * matrixId:矩阵id
     * pos:位置
     *
     * var resp ={Ret:0/1}
     * */
    resetDecoderDBImage: function(matrixId, pos, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"publishCtrlMatrixReset", params:{token="",matrixId="",pos:0}}
            businessSDK5.publishCtrlMatrixReset(this.userToken, matrixId, pos);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    //----------解码器状态推送------------------------------------------------------------------------------------------------

    /**
     * 获取解码器分组应用于解码器控制面板
     *
     * subscribeId:订阅id
     * isFirst:V6的实现，仅isFirst为true时调接口,true/false
     *
     * var resp={subscribeId:"",rows:[{groupId:'',groupName:''}]}
     * */
    getDecoderGroupListForPanel: function(subscribeId, isFirst, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryMatrixGroup(this.userToken, 1, -1, 1024, function(obj) {
                var resp = { subscribeId: "", rows: [] };
                if (obj && obj.data) {
                    obj.data.rows && obj.data.rows.forEach(function(item) {
                        var it = {}
                        it.groupId = item.groupID;
                        it.groupName = item.groupName;
                        resp.rows.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (isFirst) {
                businessSDK6.subscribeUserDecoderForList(subscribeId, true, true)
            } else {
                businessSDK6.subscribeUserDecoderForList(subscribeId, false, false)
            }
            businessSDK6.setInformAddDecoderGroups(function(obj) {
                var resp = { subscribeId: "", rows: [] };
                if (obj) {
                    resp.subscribeId = obj.subscribeID
                    obj.groups && obj.groups.forEach((item) => {
                        var row = {}
                        row.groupId = item.groupID
                        row.groupName = item.groupName
                        resp.rows.push(row)
                    })
                }
                callback(resp)
            })
        }
    },

    /**
     * 根据码器分组ID获取所有解码器,这个部分因为V5、6都修改为websocket推的模式，
     * 故这个接口只是发请求，不处理反馈结果
     *
     * subscribeId:对于V5这个是""
     * groupId:分组Id
     * */
    getDecoderByDecoderGroupId: function(subscribeId, groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeMatrixGroupStatus(this.userToken, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeUserDecoderForListInfo(subscribeId, groupId)
        }
    },

    /**
     * 解码器组条目状态反馈
     *
     * var resp ={subscribeId:"",operate:init/refresh,
     * rows:[{groupId:"",resId:'',resName:'',matrixSplitNum:0,isOnline:具体参见enum.js},......],
     * status:[{matrixId:"",isOnline:具体参见enum.js}]
     * }
     * */
    setInformMatrixGroupStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveInformMatrixGroupStatus(function(obj) {
                var resp = { subscribeId: "", operate: "init", rows: [], status: [] }
                if (obj) {
                    if (obj.operate == "init") {
                        resp.operate = "init";
                        obj.matrixs && obj.matrixs.forEach((item) => {
                            var row = {}
                            row.groupId = obj.groupId
                            row.resId = item.matrixId
                            row.resName = item.matrixName
                            row.matrixSplitNum = item.matrixSplitNum
                            if (item.status == 0) {
                                row.isOnline = "offline"
                            } else if (item.status == 1) {
                                row.isOnline = "online"
                            }

                            resp.rows.push(row)
                        })
                    }
                    if (obj.operate == "refresh") {
                        resp.operate = "refresh";
                        obj.matrixs && obj.matrixs.forEach((item) => {
                            var row = {}
                                //row.groupId = obj.groupId
                            row.matrixId = item.matrixId
                            if (item.status == 0) {
                                row.isOnline = "offline"
                            } else if (item.status == 1) {
                                row.isOnline = "online"
                            }
                            resp.status.push(row)
                        })
                    }
                }
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setInformAddDecoderGroupItems(function(obj) {
                var resp = { subscribeId: "", operate: "init", rows: [], status: [] }
                resp.subscribeId = obj.subscribeID
                resp.operate = "init"
                obj.decoders && obj.decoders.forEach((item) => {
                    var row = {}
                    row.groupId = item.groupID
                    row.resId = item.decoderID
                    row.resName = item.decoderName
                    row.matrixSplitNum = 36

                    if (item.status == "0") {
                        row.isOnline = "online"
                    } else if (item.status == "1") {
                        row.isOnline = "offline"
                    }
                    resp.rows.push(row)
                })
                callback(resp)
            });
            businessSDK6.setInformRefreshDecoderGroupItems(function(obj) {
                var resp = { subscribeId: "", operate: "refresh", rows: [], status: [] }
                resp.subscribeId = obj.subscribeID
                resp.operate = "refresh"
                obj.decoders && obj.decoders.forEach((item) => {
                    var row = {}
                    row.matrixId = item.decoderID

                    if (item.status == "0") {
                        row.isOnline = "online"
                    } else if (item.status == "1") {
                        row.isOnline = "offline"
                    }
                    resp.status.push(row)
                })
                callback(resp)
            })
        }
    },
    /**
     * 取消订阅矩阵的分组列表
     * */
    cancelSubscribeMatrixGroupListStatus: function(subscribeId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelSubscribeMatrixGroupStatus(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var subscribeIds = []
            subscribeIds.push(subscribeId)
            businessSDK6.cancelSubscribeUserDecoder(JSON.stringify(subscribeIds))
        }
    },

    /**
     * 订阅矩阵的状态
     * subscribeId:订阅Id
     * groupId:分组id
     * matrixId:解码器Id
     * */
    subscribeMatrixStatus: function(subscribeId, groupId, matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            //{funName:"subscribeMatrixStatus", params:{token="",matrixs=[{matrixId:""}]}}
            var matrixs = []
            var it = {};
            it.matrixId = matrixId
            matrixs.push(it);
            businessSDK5.subscribeMatrixStatus(this.userToken, JSON.stringify(matrixs))
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeUserDecoderForDetail(subscribeId, groupId, matrixId)
        }
    },
    /**
     * 取消订阅矩阵的状态
     * subscribeId:订阅id
     * matrixId:解码器id
     * */
    cancelSubscribeMatrixStatus: function(subscribeId, matrixId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var matrixIds = []
            var it = {};
            it.matrixId = matrixId
            matrixIds.push(it);
            businessSDK5.cancelSubscribeMatrixStatus(this.userToken, JSON.stringify(matrixIds))
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // var subscribeIds =[]
            // subscribeIds.push(subscribeId);
            // businessSDK6.cancelSubscribeUserDecoder(subscribeIds)
            return;
        }
    },

    /**
     * 推送矩阵详情反馈状态
     * isFullScreen:是否全屏
     * isMute:是否静音
     * volume:音量,
     * position:位置
     * isOnlyAudio:是否音频
     * status:"playing/waiting/free",playing:播放中,waiting:等待中,free:空闲状态
     *
     * isAllMute:全体静音
     *
     * var resp ={subscribeId:"",matrixId:"",matrixName:"",splitType:具体参见enum.js,isFullScreen:true/false,fullScreenIndex:2,isAllMute:true/false,
     *    screens:[{position:1,resourceId:"",resourceCh:0,resourceName:"",resourceType:"",isOnlyAudio:true/false,isMute:true/false,status:'',volume:50}.....]}
     * */
    setInfromMatrixDetailsStatusCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var self = this
            businessSDK5.setReceiveMatrixStatusCallback(function(obj) {
                var resp = { subscribeId: "", matrixId: "", matrixName: "", splitType: "OnlyOne", isFullScreen: false, fullScreenIndex: -1, screens: [] }
                if (obj) {
                    if (obj.isOnline != undefined && obj.isOnline === 0) {
                        resp.matrixId = obj.matrixId
                        resp.isOnline = "offline"
                        callback(resp)
                    } else {
                        resp.isOnline = "online"
                        resp.matrixId = obj.matrixId
                        resp.matrixName = ""
                        resp.splitType = self.getSplitTypeReverse(obj.spiltNum, 5)
                        resp.isFullScreen = false
                        resp.fullScreenIndex = -1
                        resp.isAllMute = obj.volume == 0

                        obj.screens && obj.screens.forEach((item) => {
                            var row = {}
                            row.position = item.pos
                            row.resourceId = item.deviceId
                            row.resourceName = item.deviceName
                            row.resourceType = 1
                            row.resourceCh = item.deviceCh
                            row.isOnlyAudio = item.isPlayAudio === 0
                            row.isMute = obj.volume == 0
                            if (item.isfull === 1) {
                                resp.isFullScreen = true
                                resp.fullScreenIndex = item.pos
                            }
                            if (item.isPlay === 1) {
                                row.status = "playing" //todo需要询问王忠
                            } else {
                                row.status = "free"
                            }
                            row.volume = obj.volume //todo 需要询问王忠
                            resp.screens.push(row)
                        })
                    }
                }
                callback(resp)
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var self = this
            businessSDK6.setInformDecoderStatus(function(obj) {

                var resp = { subscribeId: "", matrixId: "", matrixName: "", splitType: "OnlyOne", isFullScreen: false, fullScreenIndex: 0, allowControl: "", screens: [] }
                resp.subscribeId = obj.subscribeID
                resp.matrixId = obj.detail.decoderID
                resp.matrixName = ""
                resp.isOnline = "online" //todo 先显示
                resp.splitType = self.getSplitTypeReverse(obj.detail.currentSplitType, 6)
                resp.isFullScreen = obj.detail.isFullScreen == "true"
                resp.fullScreenIndex = obj.detail.fullScreenIndex
                resp.isAllMute = obj.detail.globalSoundOff == "true"
                resp.allowControl = obj.detail.allowControl;
                obj.detail.screens && obj.detail.screens.forEach((item) => {
                    var row = {}
                    row.position = item.screenIndex
                    row.resourceId = item.resourceID
                    row.resourceName = item.resourceName
                    row.resourceCh = -1
                    row.isOnlyAudio = false
                    row.isMute = item.soundOff == 'true'
                    row.volume = isNaN(item.soundValue) ? 0 : Number(item.soundValue);
                    row.allowControl = item.allowControl;
                    if (item.playStatus === "playing") {
                        row.status = "playing"
                    } else if (item.playStatus === "waiting") {
                        row.status = "waiting"
                    } else if (item.playStatus === "none") {
                        row.status = "free"
                    }
                    if (item.resourceType == "User") {
                        row.resourceType = 0
                    } else if (item.resourceType == "Device") {
                        row.resourceType = 1
                    }
                    resp.screens.push(row)
                })
                callback(resp)
            })
        }
    },

    //*****************************************************画质调节*********************************************************
    /**
     * 调节视频图像画质
     * resource: 资源{resId:'',resCh:''}
     * color: 色彩（%）
     * brightness: 亮度（%）
     * contrast: 对比度（%）
     * sharpness:清晰度
     *
     * var resp ={Ret:0/1}
     */
    adjustPictureQuality: function(resourceId, resourceCh, color, brightness, contrast, sharpness, callback) {},

    /**
     * 获取调节参数
     * resourceId:资源id
     * resourceCh:资源通道
     *
     * var resp ={color:'',brightness:'',contrast:'',sharpness:''}
     */
    getPictureQuality: function(resourceId, resourceCh) {

    },

    //****************************************************视频转发*********************************************************
    /**
     * 发送者-开始转发
     * resources: 资源列表
     * receivers: 接收者列表
     *
     * resources:[{resourceId:"XTTEST0000034",resourceCh:1,resName:'',resType:具体参见enum.js}]
     * receivers:[{receiveId:"XTTEST000034",receiverName:''}]
     */
    startTransmit: function(resources, receivers, senderName, affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var transinfo = [];
            resources && 　resources.forEach(function(item) {
                var resInfo = {};
                resInfo.resId = item.resourceId;
                resInfo.resch = item.resourceCh;
                transinfo.push(resInfo);
            });
            var receiver = [];
            receivers && receivers.forEach(function(item) {
                var receInfo = {};
                receInfo.receiveId = item.receiveId;
                receiver.push(receInfo);
            });

            businessSDK5.publishStartTransmit(this.userToken, JSON.stringify(transinfo), JSON.stringify(receiver), affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceInfos = []
            resources && 　resources.forEach(function(item) {
                var it = {};
                it.resID = item.resourceId;
                it.resName = item.resName;
                if (item.resType === 0) {
                    it.resType = "User";
                } else if (item.resType === 1) {
                    it.resType = "Device";
                }
                resourceInfos.push(it);
            });
            receivers && receivers.forEach(function(item) {
                var receiverID = item.receiveId;
                var receiverName = item.receiverName;
                businessSDK6.publishStartTransmit(receiverID, senderName, receiverName, JSON.stringify(resourceInfos));
            });
        }
    },
    /**
     * 发送者-停止转发
     * receiverId: 接收者ID
     * resources: 资源列表
     * resources:[{resId:'',resCh:'',resName:'',resType:""}...]
     * //todo 因为这里只有一个receiverId,如果是已接收列表停止转发，receiverId要改为senderId.
     * //todo 停止转发，包括停止转发一条，停止转发多条
     */
    /** 2020.03.10注释 */
    stopTransmit: function(receiverId, resources, senderName, receiverName, senderId, affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            let that = this;
            resources && resources.forEach(function(item) {
                businessSDK5.publishStopTransmit(that.userToken, senderId, receiverId, item.resId, item.resCh, affairId);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceInfos = [];
            resources && resources.forEach(function(item) {
                var it = {};
                it.resID = item.resId;
                it.resName = item.resName;
                if (item.resType == 0) {
                    it.resType = "User";
                } else if (item.resType == 1) {
                    it.resType = "Device";
                }
                resourceInfos.push(it);
            })
            businessSDK6.publishStopTransmit(receiverId, senderName, receiverName, JSON.stringify(resourceInfos));
        }
    },

    /**
     * 停止所有发起的转发
     */
    stopAllSendTramsmit: function(affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopInviteTransmitAll(this.userToken, affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 停止所有接受的转发
     */
    stopAllReviceTramsmit: function(affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopRecvTransmitAll(this.userToken, affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 接收者-接受转发
     * resources: 资源列表
     * resources:[{resId:'',resCh:'',resName:'',resType:""}...]
     * receiverId: 接收人ID
     * senderName:发起人名称
     * receiverName:接收人名称
     */
    acceptTransmit: function(resources, receiverId, senderName, receiverName, affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            resources && resources.forEach(function(item) {
                businessSDK5.publishAcceptTransmit(this.userID, receiverId, item.resId, item.resCh, affairId);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceInfos = [];
            resources && resources.forEach(function(item) {
                var it = {};
                it.resID = item.resId;
                it.resName = item.resName;
                if (item.resType == 0) {
                    it.resType = "User";
                } else if (item.resType == 1) {
                    it.resType = "Device";
                }
                resourceInfos.push(it);
            })
            businessSDK6.publishAcceptTransmit(receiverId, senderName, receiverName, JSON.stringify(resourceInfos));
        }
    },

    /**
     * 接收者-拒绝转发
     * resources: 资源列表
     * resources:[{resId:'',resCh:'',resName:'',resType:""}...]
     * receiverId: 接受转发者Id
     * senderName:发起者名称
     * receiverName:接受人名称
     */
    refuseTransmit: function(resources, receiverId, senderName, receiverName, affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            resources && resources.forEach(function(item) {
                businessSDK5.publishRefuseTransmit(this.userID, receiverId, item.resId, item.resCh, affairId);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resourceInfos = [];
            resources && resources.forEach(function(item) {
                var it = {};
                it.resID = item.resId;
                it.resName = item.resName;
                if (item.resType == 0) {
                    it.resType = "User";
                } else if (item.resType == 1) {
                    it.resType = "Device";
                }
                resourceInfos.push(it);
            })
            businessSDK6.publishRefuseTransmit(receiverId, senderName, receiverName, JSON.stringify(resourceInfos));
        }
    },

    /**
     * 推送转发列表
     * status:"transmiting/transmitOk/transmitFailture/transmitRefuse
     *
     * var resp ={
     * receiverList:[{resourceID:'',resourceName:'',resourceCh:"",resourceType:具体参见enum.js,senderID:'',senderName:'',dateTime:'',status:""}],
     * sendList:[{resourceID:'',resourceName:'',resourceCh:"",resourceType:具体参见enum.js,receiverID:'',receiverName:'',dateTime:'',status:""}]
     * }
     *
     */
    setReceiveTransmitListCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveTransmitInfoListCallback(function(obj) {
                if (obj) {
                    if (obj.type) {
                        var resp = { operate: "", affairId: "", receiverList: [], sendList: [] };
                        resp.operate = obj.type;
                        resp.affairId = obj.affairId;
                        if ('init' === obj.type) {
                            obj.init && obj.init.forEach(function(item) {
                                var it = {};
                                it.resourceID = item.resId;
                                it.resourceName = item.resName;
                                it.senderID = item.requestId;
                                it.senderName = item.requestName;
                                it.destId = item.destId;
                                it.destName = item.destName;
                                it.status = item.status; //status: 0-等待接受  1-正在转发
                                it.resourceCh = item.resch;
                                it.dateTime = item.date;
                                if (1 == item.type) { //type: 1 发送的转发  2接受的转发
                                    resp.sendList.push(it);
                                } else {
                                    resp.receiverList.push(it);
                                }
                            });
                        } else if ('add' === obj.type) {
                            obj.add && obj.add.forEach(function(item) {
                                var it = {};
                                it.resourceID = item.resId;
                                it.resourceName = item.resName;
                                it.senderID = item.requestId;
                                it.senderName = item.requestName;
                                it.destId = item.destId;
                                it.destName = item.destName;
                                it.status = item.status; //status: 0-等待接受  1-正在转发
                                it.resourceCh = item.resch;
                                it.dateTime = item.date;
                                if (1 == item.type) { //type: 1 发送的转发  2接受的转发
                                    resp.sendList.push(it);
                                } else {
                                    resp.receiverList.push(it);
                                }
                            });
                        } else if ('remove' === obj.type) {
                            obj.remove && obj.remove.forEach(function(item) {
                                var it = {};
                                it.resourceID = item.resId;
                                it.resourceName = item.resName;
                                it.senderID = item.requestId;
                                it.senderName = item.requestName;
                                it.destId = item.destId;
                                it.destName = item.destName;
                                it.status = item.status; //status: 0-等待接受  1-正在转发
                                it.resourceCh = item.resch;
                                it.dateTime = item.date;
                                if (1 == item.type) { //type: 1 发送的转发  2接受的转发
                                    resp.sendList.push(it);
                                } else {
                                    resp.receiverList.push(it);
                                }
                            });
                        } else if ('refresh' === obj.type) {
                            if (obj.refresh) {
                                var item = obj.refresh[0];
                                var it = {};
                                it.resourceID = item.resId;
                                it.resourceName = item.resName;
                                it.senderID = item.requestId;
                                it.senderName = item.requestName;
                                it.destId = item.destId;
                                it.destName = item.destName;
                                it.status = item.status; //status: 0-等待接受  1-正在转发
                                it.resourceCh = item.resch;
                                it.dateTime = item.date;
                                if (1 == item.type) { //type: 1 发送的转发  2接受的转发
                                    resp.sendList.push(it);
                                } else {
                                    resp.receiverList.push(it);
                                }
                            }
                        }
                        callback(resp);
                    }
                }
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformTransmitListCallback(function(obj) {
                var resp = { receiverList: [], sendList: [] };
                if (obj) {
                    obj.receiveList && obj.receiveList.forEach(function(item) {
                        var it = {};
                        it.resourceID = item.resourceID;
                        it.resourceName = item.resourceName;
                        if (item.resourceType === "User") {
                            it.resourceType = 0
                        }
                        if (item.resourceType === "Device") {
                            it.resourceType = 1
                        }
                        it.senderID = item.senderID;
                        it.senderName = item.senderName;
                        it.dateTime = item.dateTime;
                        it.status = item.status;
                        it.resourceCh = item.resourceCh || ''
                        resp.receiverList.push(it);
                    });
                    obj.sendList && obj.sendList.forEach(function(item) {
                        var it = {};
                        it.resourceID = item.resourceID;
                        it.resourceName = item.resourceName;
                        if (item.resourceType === "User") {
                            it.resourceType = 0
                        }
                        if (item.resourceType === "Device") {
                            it.resourceType = 1
                        }
                        it.senderID = item.senderID;
                        it.senderName = item.senderName;
                        it.dateTime = item.dateTime;
                        it.status = item.status;
                        it.resourceCh = item.resourceCh || ''
                        resp.sendList.push(it);
                    })
                }
                callback(resp);

            });
        }
    },

    /**
     * 订阅转发信息
     */
    subscribeTransmitStatus: function(affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.subscribeTransmit(this.userToken, affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeTransmitInfos();
        }

    },

    /**
     * 取消订阅转发状态
     */
    cancelSubscribeTransmit: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.cancelsubscribeTransmit(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.cancelSubscribeTransmitInfos();
        }
    },

    /**
     *推送转发服务可转发的资源
     * var resp ={subscribeID:"",resources:[{resId:"",resName:"",resType:具体参见enum.js,parentId:"",isOnline:具体参见enum.js,deviceType:具体参见enum.js}]}
     * */
    getTransimitResources: function(subscribeId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryDBImage(this.userToken, function(obj) {
                var resp = { subscribeID: '', resources: [] };
                if (obj && obj.ret == 0) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.resId = item.resId;
                        it.resName = item.resName;
                        it.resCh = item.resCh;
                        if (item.resType === "User") {
                            it.resType = 0 //人员
                        }
                        if (item.resType === "Device") {
                            it.resType = 1 //设备
                        }

                        resp.resources.push(it);
                    });
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeBusinessStatus("All", subscribeId)
            businessSDK6.setReceiveBusinessStatusCallback(function(obj) {
                var resp = { subscribeID: '', resources: [] };
                resp.subscribeID = obj.subscribeID
                obj.resources && obj.resources.forEach(function(item) {
                    var it = {}
                    it.resId = item.resourceID
                    it.resName = item.resourceName
                    if (item.resourceType === "User") {
                        it.resType = 0 //人员
                    }
                    if (item.resourceType === "Device") {
                        it.resType = 1 //设备
                    }
                    it.parentId = item.parentId
                    if (item.isOnline == true) {
                        it.isOnline = "online"
                    }
                    if (item.isOnline === false) {
                        it.isOnline = "offline"
                    }
                    if (item.deviceType == 'HWMeetingTerminal')
                        it.deviceType = 13;
                    resp.resources.push(it)
                })
                callback(resp)
            })
        }
    },
    //***************************************************虚拟终端**********************************************************
    /**
     * 虚拟终端 - 获取虚拟终端底下所有的资源
     * virtualId:虚拟设备Id
     * var resp =[{resId:'',resCh:'',resName:''}...]
     * */
    getResourcesByVirtualId: function(virtualId, callback) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         * */
    },
    /**
     * 虚拟终端-获取虚拟终端默认的设备
     * virtualId:虚拟终端Id
     * var resp={resId:'',resCh:'',resName:''}
     * */
    getDefaultDeviceForVirtual: function(virtualId, callback) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         * */
    },
    /**
     * 虚拟终端 -设置虚拟终端默认设备
     * virtualId:虚拟设备ID
     * resourceId:资源Id
     * resourceCh:资源通道
     *
     * var resp ={Ret:0/1}
     * */
    setDefaultDeviceForVirtual: function(virtualId, resourceId, resourceCh, callback) {
        /**
         * 1.getVersion
         * 1.1.if 5.0
         * 1.2.if 6.0
         * */
    },
    //**************************************************会场通知***********************************************************
    /**
     * 添加会场通知模版
     *
     * templateName:模版名称
     * fontFamily:字体 "SIM_SUN/SIM_HEI/SIM_KAI/SIM_SUN_EX/SIM_LI" 其中SIM_SUN_EX 为仿宋
     * fontSize:8,10,12,14,16,20....
     * fontPattern:字型 "常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic"
     * color:颜色 {R:,G:,B}
     * rollStyle: 滚动方方向,从右到左：fromRightToLeft,从下到上:fromDownToTop
     * rollPos:滚动位置,顶部：top,居中:center,底部:bottom
     * rollspeed:滚动速度,slow:较慢,normal:普通,fast:较快
     * rollTime:滚动时间
     * isNotLimit:true 滚动时间无限制
     *
     * var resp={Ret:0/1}
     * */
    addNotificationTemplate: function(templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var fontColorR = color.R;
            var fontColorG = color.G;
            var fontColorB = color.B;
            var direction = rollStyle;
            var aligning = rollPos;
            var speed = rollspeed;
            var isScrollTime = isNotLimit;
            var scrollInterval = rollTime;

            var fontFamilyMe = this.getFontFamily(fontFamily)
            var fontStyleMe = this.getFontStyle(fontPattern)
            var directionMe = this.getDirection(direction)
            var aligningMe = this.getTextAligning(aligning)
            var speedMe = this.getSpeed(speed)

            dataSDK6.addNotificationTemplate(templateName, fontFamilyMe, fontSize, fontStyleMe, fontColorR, fontColorG, fontColorB,
                directionMe, aligningMe, speedMe, isScrollTime, scrollInterval,
                function(obj) {
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                })

        }
    },
    /**
     * 删除会场通知模版
     *
     * templateId:模版id
     * var resp ={Ret:0/1}
     * */
    deleteNotificationTemplate: function(templateId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            /**
             * 	删除通知模板	B -> S	HTTP（Get）	"url:   [...]/communication/removeNotificationTemplate
             data: operatorToken=""""&&templateID=""""
             success:{ responseCode:1, data: true }"

             */
            dataSDK6.removeNotificationTemplate(templateId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });

        }
    },
    /**
     * 根据id获取会场通知模版
     * 参数值可以参考 addNotificationTemplate接口
     *
     * var resp ={templateId:"",templateName:"", fontFamily:"", fontSize:"", fontPattern:"", color:{R:'',G:'',B:''},
     * rollStyle:"", rollPos:"", rollspeed:"", rollTime:"", isNotLimit:true/false}
     * */
    getNotificationTemplateById: function(templateId, callback) {
        var self = this
            //querySingleNotificationTemplate
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleNotificationTemplate(templateId, function(obj) {
                var resp = {
                    templateId: "",
                    templateName: "",
                    fontFamily: "",
                    fontSize: "",
                    fontPattern: "",
                    color: {},
                    rollStyle: "",
                    rollPos: "",
                    rollspeed: "",
                    rollTime: "",
                    isNotLimit: "",
                    direction: ""
                }
                if (obj.responseCode == 1 && obj.data) {
                    resp.templateId = obj.data.templateID;
                    resp.templateName = obj.data.templateName;
                    resp.fontFamily = self.getFontFamilyReverse(obj.data.fontFamlily);
                    resp.fontSize = obj.data.fontSize;
                    resp.fontPattern = self.getFontStyleReverse(obj.data.fontStyle);
                    resp.rollStyle = obj.data.direction;
                    resp.rollPos = self.getTextAlignReverse(obj.data.aligning);
                    resp.rollspeed = self.getSpeedReverse(obj.data.speed);
                    resp.isNotLimit = obj.data.isScrollTime;
                    resp.rollTime = obj.data.scrollInterval;
                    resp.direction = self.getDirectionReverse(obj.data.direction)
                    var it = {};
                    it.R = obj.data.fontColorR;
                    it.G = obj.data.fontColorG;
                    it.B = obj.data.fontColorB;
                    resp.color = it;
                }
                callback(resp);
            });

        }
    },
    /**
     * 获取所有的会议通知模版
     * 参数值可以参考 addNotificationTemplate接口
     *
     * var resp =[{templateId:"",templateName:""}...]
     * */
    getNotificationTemplateList: function(beginIndex, count, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryNotificationTemplatesByUserID(beginIndex, count, function(obj) {
                var resp = { total: "", list: [] }
                if (obj.responseCode == 1) {
                    resp.total = obj.data.totalCount;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        it.templateId = item.templateID;
                        it.templateName = item.templateName;
                        resp.list.push(it);
                    })
                }
                callback(resp);
            });
        }
    },
    /**
     * 保存会议通知模版
     * 参数值可以参考 addNotificationTemplate接口
     * var resp ={Ret:0/1}
     * */
    updateNotificationTemplate: function(templateId, templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var templateID = templateId;
            var fontColorR = color.R;
            var fontColorG = color.G;
            var fontColorB = color.B;
            var direction = rollStyle;
            var aligning = rollPos;
            var speed = rollspeed;
            var isScrollTime = isNotLimit;
            var scrollInterval = rollTime;

            var fontFamilyMe = this.getFontFamily(fontFamily)
            var fontStyleMe = this.getFontStyle(fontPattern)
            var directionMe = this.getDirection(direction)
            var aligningMe = this.getTextAligning(aligning)
            var speedMe = this.getSpeed(speed)

            dataSDK6.editNotificationTemplate(templateID, templateName, fontFamilyMe, fontSize, fontStyleMe, fontColorR, fontColorG, fontColorB,
                directionMe, aligningMe, speedMe, isScrollTime, scrollInterval,
                function(obj) {
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                });

        }
    },
    /**
     * 查询已经发送的通知
     * var resp =[{notificationId:"",notificationTime:"",notifyUserId:"",notifyUserName:"",resources:[{receiverId:"",receiverName:""}..],content:""}...]
     * */
    querySendedNotifications: function(callback) {

    },
    /**
     * 停止已发通知
     * notificationIds:通知id集合
     *
     * var resp ={Ret:0/1}
     * */
    stopNotificationById: function(notificationIds, callback) {

    },
    /**
     * 发送通知，全部停止
     *
     * var resp ={Ret:0/1}
     * */
    stopAllNotification: function(callback) {

    },
    /**
     * 获得会议转发列表资源
     * var resp =[{resId:"",resName:"",isChairMan:true/false}..]
     * */
    getMeetingResources: function(conferenceId, callback) {

    },
    /**
     * 主席-发送会场通知（会议中）
     *
     * users:[{userId:""}.....] 接收通知的人员Id
     * notificationTemplateId:模版id
     * isCanRoll:未满屏允许滚动,true/false
     * content:通知内容
     *
     * style:{
     *    fontFamlily:'',
     *    fontSize:"",
     *    fontStyle:"",
     *    fontColorR:"",
     *    fontColorG:"",
     *    fontColorB:"",
     *    direction:"",
     *    aligning:"",
     *    speed:"",
     *    isScrollTime:false/true,
     *    scrollInterval:20
     *    }
     */
    sendConferenceNotification: function(users, content, notificationTemplateId, style, isCanRoll, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var receiverIDs = [];
            users && users.forEach(function(item) {
                receiverIDs.push(item.userId);
            });
            var fontFamlily = this.getFontFamily(style.fontFamlily);
            var fontSize = style.fontSize;
            var fontStyle = this.getFontStyle(style.fontStyle);
            var fontColorR = style.fontColorR;
            var fontColorG = style.fontColorG;
            var fontColorB = style.fontColorB;
            var direction = this.getDirection(style.direction);
            var aligning = this.getTextAligning(style.aligning);
            var speed = this.getSpeed(style.speed);
            var isScrollTime = style.isScrollTime;
            var scrollInterval = style.scrollInterval;
            businessSDK6.publishSendCommunicationNotification(receiverIDs, content, fontFamlily, fontSize, fontStyle, fontColorR, fontColorG, fontColorB, direction, aligning, speed, isScrollTime, scrollInterval);
        }
    },
    /**
     * 查询历史会议列表
     *
     * conferenceName: 会议名称
     * conferenceBeginTime: 会议开始时间
     * conferenceEndTime: 会议结束时间
     * */
    queryHistoryMeetingList: function(conferenceName, conferenceBeginTime, conferenceEndTime, page, pageSize, confMode, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var beginIndex = (page - 1) * pageSize;
            dataSDK6.queryHistoryConference(conferenceName, conferenceBeginTime, conferenceEndTime, beginIndex, pageSize, confMode, function(obj) {
                var resp = { totalCnt: 0, rows: [] }
                if (obj && obj.responseCode == 1) {
                    resp.totalCnt = obj.data.totalCount;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        // it.conferenceId = item.conferenceID;
                        // it.conferenceName = item.conferenceName;
                        it.conferenceId = item.sceneID;
                        it.conferenceName = item.sceneName;
                        it.conferenceTime = item.beginTime;
                        it.chairMan = item.chairman.userName;
                        it.chairManId = item.chairman.userID;
                        it.conferenceEndTime = item.endTime;
                        it.description = item.description || "";
                        it.schemeId = item.schemeID || "";
                        it.schemeName = item.schemeName || "默认方案";
                        it.meetingMode = item.isMediaProcessing || false;
                        it.confMode = item.confMode;
                        it.isVideo = item.isVideo;
                        it.members = item.members && item.members.map(item2 => {
                            return {resId: item2.userID, resName: item.userName };
                        });
                        resp.rows.push(it);
                    });
                }
                callback(resp);
            });
        }
    },
    /**
     * 根据id查询历史会议详情
     *
     * */
    getHistoryInfoByHistoryId: function(conferenceID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getSingleHistoryConferenceDetail(conferenceID, function(obj) {
                var resp = {
                    conferenceId: "",
                    conferenceName: "",
                    chairMan: "",
                    chairManId: "",
                    schemeName: "",
                    schemeId: "",
                    description: "",
                    password: "",
                    meetingMode: false,
                    isAutoRecord: "",
                    beginTime: "",
                    endTime: "",
                    users: [],
                    devices: []
                };
                if (obj.responseCode == 1) {
                    // resp.conferenceId = obj.data.conferenceID;
                    // resp.conferenceName = obj.data.conferenceName;
                    resp.conferenceId = obj.data.sceneID;
                    resp.conferenceName = obj.data.sceneName;
                    resp.description = obj.data.description || "";
                    resp.schemeId = obj.data.schemeID || "";
                    resp.schemeName = obj.data.schemeName || "默认方案";
                    resp.chairMan = obj.data.chairman.userName;
                    resp.chairManId = obj.data.chairman.userID;
                    resp.beginTime = obj.data.beginTime;
                    resp.endTime = obj.data.endTime;
                    resp.password = obj.data.password || "";
                    // resp.meetingMode = obj.data.isMediaProcessing || false;
                    if (obj.data.isMediaProcessing === true || obj.data.isMediaProcessing === 'true') {
                        resp.meetingMode = true;
                    } else {
                        resp.meetingMode = false;
                    }
                    resp.isAutoRecord = obj.data.isAutoRecord || false;
                    var item = obj.data;
                    var users = []
                    item.members && item.members.forEach(function(itemu) {
                        var it = {}
                        it.index = itemu.index || 0
                        it.userId = itemu.userID
                        it.userName = itemu.userName
                        it.isSpectator = false
                        users.push(it);
                    });
                    item.spectators && item.spectators.forEach(function(itemu) {
                        var it = {}
                        it.index = itemu.index || 0
                        it.userId = itemu.userID
                        it.userName = itemu.userName + '（旁观）'
                        it.isSpectator = true
                        users.push(it);
                    });
                    resp.users = users;
                    var devices = []
                    item.devices && item.devices.forEach(function(itemd) {
                        var it = {}
                        it.index = itemd.index || 0
                        it.deviceId = itemd.deviceID
                        it.deviceName = itemd.deviceName
                        it.deviceCh = ''
                        devices.push(it)
                    });
                    resp.devices = devices;
                }
                callback(resp);
            });
        }
    },

    /**
     * 主席-历史会议重开
     *
     * conferenceId 会议Id
     */
    startHistoryMeeting: function(conferenceId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            return;
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishRestartHistoryConference(conferenceId);
        }
    },

    //**************************************************广播通知和音频广播***************************************************
    /**
     * 添加广播通知模版
     *
     * templateName:模版名称
     * fontFamily:字体 "SIM_SUN/SIM_HEI/SIM_KAI/SIM_SUN_EX/SIM_LI" 其中SIM_SUN_EX 为仿宋
     * fontSize:8,10,12,14,16,20....
     * fontPattern:字型 "常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic"
     * color:颜色 {R:,G:,B}
     * rollStyle: 滚动方式,从右到左：fromRightToLeft,从下到上:fromDownToTop,
     * rollPos:滚动位置,顶部：top,居中:center,底部:bottom
     * rollspeed:滚动速度,slow:较慢,normal:普通,fast:较快
     * rollTime:滚动时间
     * isNotLimit:滚动时间无限制
     *
     * var resp={Ret:0/1}
     * */

    getFontFamily(fontFamily) {
        switch (fontFamily) {
            case "SIM_SUN":
                return "SIM_SUN"
            case "SIM_HEI":
                return "SIM_HEI"
            case "SIM_KAI":
                return "KAI_TI"
            case "SIM_SUN_EX":
                return "FANG_SONG"
            case "SIM_LI":
                return "SIM_LI"
        }

        return "SIM_SUN"
    },
    getFontFamilyReverse(fontFamily) {
        switch (fontFamily) {
            case "SIM_SUN":
                return "SIM_SUN"
            case "SIM_HEI":
                return "SIM_HEI"
            case "KAI_TI":
                return "SIM_KAI"
            case "FANG_SONG":
                return "SIM_SUN_EX"
            case "SIM_LI":
                return "SIM_LI"
        }
    },
    getFontStyle(fontStyle) {
        switch (fontStyle) {
            case "normal":
                return "Normal"
            case "italic":
                return "Italic"
            case "bold":
                return "Bold"
            case "boldItalic":
                return "BoldItalic"
        }
    },
    getFontStyleReverse(fontStyle) {
        switch (fontStyle) {
            case "Normal":
                return "normal"
            case "Italic":
                return "italic"
            case "Bold":
                return "bold"
            case "BoldItalic":
                return "boldItalic"
        }
    },
    getDirection(direction) {
        switch (direction) {
            case "fromRightToLeft":
                return "RightToLeft"
            case "fromDownToTop":
                return "DownToTop"
            case "fromLeftToRight":
                return "LeftToRight"
        }
    },
    getDirectionReverse(direction) {
        switch (direction) {
            case "RightToLeft":
                return "fromRightToLeft"
            case "DownToTop":
                return "fromDownToTop"
            case "LeftToRight":
                return "fromLeftToRight"
        }
    },
    getTextAligning(aligning) {
        switch (aligning) {
            case "top":
                return "Top"
            case "center":
                return "Center"
            case "bottom":
                return "Bottom"
        }
    },
    getTextAlignReverse(aligning) {
        switch (aligning) {
            case "Top":
                return "top"
            case "Center":
                return "center"
            case "Bottom":
                return "bottom"
        }
    },
    getSpeed(speed) {
        switch (speed) {
            case "normal":
                return "Standard"
            case "fast":
                return "Fast"
            case "slow":
                return "Slow"
        }
    },
    getSpeedReverse(speed) {
        switch (speed) {
            case "Standard":
                return "normal"
            case "Fast":
                return "fast"
            case "Slow":
                return "slow"
        }
    },

    addBroadNotificationTemplate: function(templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit, callback) {
        //addNotificationTemplate
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var fontColorR = color.R;
            var fontColorG = color.G;
            var fontColorB = color.B;
            var direction = rollStyle;
            var aligning = rollPos;
            var speed = rollspeed;
            var isScrollTime = isNotLimit;
            var scrollInterval = rollTime;

            var fontFamilyMe = this.getFontFamily(fontFamily)
            var fontStyleMe = this.getFontStyle(fontPattern)
            var directionMe = this.getDirection(direction)
            var aligningMe = this.getTextAligning(aligning)
            var speedMe = this.getSpeed(speed)

            dataSDK6.addNotificationTemplate(templateName, fontFamilyMe, fontSize, fontStyleMe, fontColorR, fontColorG, fontColorB,
                directionMe, aligningMe, speedMe, isScrollTime, scrollInterval,
                function(obj) {
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                })
        }
    },
    /**
     * 删除广播通知模版
     *
     * templateId:模版id
     * var resp ={Ret:0/1}
     * */
    deleteBroadNotificationTemplate: function(templateId, callback) {
        //removeNotificationTemplate
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.removeNotificationTemplate(templateId, function(obj) {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                } else {
                    resp.Ret = 1
                }
                callback(resp);
            });
        }
    },
    /**
     * 根据id获取广播通知模版
     *templateName:模版名称
     * fontFamily:字体 "SIM_SUN/SIM_HEI/SIM_KAI/SIM_SUN_EX/SIM_LI" 其中SIM_SUN_EX 为仿宋
     * fontSize:8,10,12,14,16,20....
     * fontPattern:字型 "常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic"
     * color:颜色 {R:,G:,B}
     * rollStyle: 滚动方式,从右到左：fromRightToLeft,从下到上:fromDownToTop
     * rollPos:滚动位置,顶部：top,居中:center,底部:bottom
     * rollspeed:滚动速度,slow:较慢,normal:普通,fast:较快
     * rollTime:滚动时间
     * isNotLimit:滚动时间无限制
     *
     *
     * var resp ={templateId:"",templateName:"", fontFamily:"", fontSize:"", fontPattern:"", color:{R:'',G:'',B:''},
     * rollStyle:"", rollPos:"", rollspeed:"", rollTime:"", isNotLimit:true/false,direction:""}
     * */
    getBroadNotificationTemplateById: function(templateId, callback) {

        var self = this
            //querySingleNotificationTemplate
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleNotificationTemplate(templateId, function(obj) {
                var resp = {}
                if (obj.responseCode == 1 && obj.data) {
                    resp.templateId = obj.data.templateID;
                    resp.templateName = obj.data.templateName;
                    resp.fontFamily = self.getFontFamilyReverse(obj.data.fontFamlily);
                    resp.fontSize = obj.data.fontSize;
                    resp.fontPattern = self.getFontStyleReverse(obj.data.fontStyle);
                    resp.rollStyle = self.getDirectionReverse(obj.data.direction);
                    resp.rollPos = self.getTextAlignReverse(obj.data.aligning);
                    resp.rollspeed = self.getSpeedReverse(obj.data.speed);
                    resp.isNotLimit = obj.data.isScrollTime;
                    resp.rollTime = obj.data.scrollInterval;
                    resp.direction = self.getDirectionReverse(obj.data.direction)
                    var it = {};
                    it.R = obj.data.fontColorR;
                    it.G = obj.data.fontColorG;
                    it.B = obj.data.fontColorB;
                    resp.color = it;
                }
                callback(resp);
            });

        }
    },
    /**
     * 获取所有的广播通知模版
     * var resp = { total:200, list: [{templateId: "",templateName: ""}...] }
     * */
    getBroadNotificationTemplateList: function(beginIndex, count, callback) {
        //queryNotificationTemplatesByUserID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryNotificationTemplatesByUserID(beginIndex, count, function(obj) {
                var resp = { total: "", list: [] }
                if (obj.responseCode == 1) {
                    resp.total = obj.data.totalCount;
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        it.templateId = item.templateID;
                        it.templateName = item.templateName;
                        resp.list.push(it);
                    })
                }
                callback(resp);
            });
        }
    },
    /**
     * 保存广播通知模版
     * templateName:模版名称
     * fontFamily:字体 "SIM_SUN/SIM_HEI/SIM_KAI/SIM_SUN_EX/SIM_LI" 其中SIM_SUN_EX 为仿宋
     * fontSize:8,10,12,14,16,20....
     * fontPattern:字型 "常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic"
     * color:颜色 {R:,G:,B}
     * rollStyle: 滚动方式,从右到左：fromRightToLeft,从下到上:fromDownToTop
     * rollPos:滚动位置,顶部：top,居中:center,底部:bottom
     * rollspeed:滚动速度,slow:较慢,normal:普通,fast:较快
     * rollTime:滚动时间
     * isNotLimit:滚动时间无限制
     * var resp ={Ret:0/1}
     * */
    updateBroadNotificationTemplate: function(templateId, templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit, callback) {
        //editNotificationTemplate
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var templateID = templateId;
            var fontColorR = color.R;
            var fontColorG = color.G;
            var fontColorB = color.B;
            var direction = rollStyle;
            var aligning = rollPos;
            var speed = rollspeed;
            var isScrollTime = isNotLimit;
            var scrollInterval = rollTime;

            var fontFamilyMe = this.getFontFamily(fontFamily)
            var fontStyleMe = this.getFontStyle(fontPattern)
            var directionMe = this.getDirection(direction)
            var aligningMe = this.getTextAligning(aligning)
            var speedMe = this.getSpeed(speed)


            dataSDK6.editNotificationTemplate(templateID, templateName, fontFamilyMe, fontSize, fontStyleMe, fontColorR, fontColorG, fontColorB,
                directionMe, aligningMe, speedMe, isScrollTime, scrollInterval,
                function(obj) {
                    var resp = {};
                    if (obj.responseCode == 1) {
                        resp.Ret = 0
                    } else {
                        resp.Ret = 1
                    }
                    callback(resp);
                });
        }
    },
    /**
     * 查询已经发送的广播通知
     * 通知内容 ： content
     * 通知时间 ： sendTime
     * 通知人 ： senderName
     * 接收人 ： receiverNames
     * var resp =[{notificationId:"",notificationTime:"",notifyUserId:"",notifyUserName:"",resources:[{receiverId:"",receiverName:""}..],content:""}...]
     * */
    queryBroadSendedNotifications: function(beginIndex, count, callback) {
        //queryAllNotificationRecordsBySenderID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryAllNotificationRecordsBySenderID(beginIndex, count, function(obj) {
                var resp = []
                if (obj.responseCode == 1 && obj.data) {
                    obj.data.list && obj.data.list.forEach(function(item) {
                        var it = {};
                        it.notificationId = ""
                        it.notificationTime = item.sendTime
                        it.notifyUserId = item.senderID
                        it.notifyUserName = item.senderName
                        it.resources = []
                        item.receiverNames && item.receiverNames.forEach((itemx) => {
                            var row = {}
                            row.receiverId = ""
                            row.receiverName = itemx
                            it.resources.push(row)
                        })
                        it.content = item.content
                        resp.push(it)
                    });
                    callback(resp);
                }
            });

        }
    },
    /**
     * 停止已发广播通知
     * notificationIds:通知id集合
     *
     * var resp ={Ret:0/1}
     * */
    stopBroadNotificationById: function(notificationIds, callback) {

    },
    /**
     * 全部停止发送广播通知
     *
     * var resp ={Ret:0/1}
     * */
    stopAllBroadNotification: function(callback) {

    },
    /**
     * 发送广播通知
     * users:[{userId:""}.....] 接收广播通知的人员Id
     * notificationTemplateId:模版id
     * isCanRoll:未满屏允许滚动,true/false
     * content:通知内容
     *
     * style:{
     *    fontFamlily:'',
     *    fontSize:"",
     *    fontStyle:"",
     *    fontColorR:"",
     *    fontColorG:"",
     *    fontColorB:"",
     *    direction:"",
     *    aligning:"",
     *    speed:"",
     *    isScrollTime:false/true,
     *    scrollInterval:20
     *    }
     *
     *  style中的参数定义参见addBroadNotificationTemplate
     *
     */
    sendBroadNotification: function(users, content, notificationTemplateId, style, isCanRoll, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var receiverIDs = [];
            users && users.forEach(function(item) {
                receiverIDs.push(item.userId);
            });
            var fontFamlily = this.getFontFamily(style.fontFamlily);
            var fontSize = style.fontSize;
            var fontStyle = this.getFontStyle(style.fontStyle);
            var fontColorR = style.fontColorR;
            var fontColorG = style.fontColorG;
            var fontColorB = style.fontColorB;
            var direction = this.getDirection(style.direction);
            var aligning = this.getTextAligning(style.aligning);
            var speed = this.getSpeed(style.speed);
            var isScrollTime = style.isScrollTime;
            var scrollInterval = style.scrollInterval;
            businessSDK6.publishSendCommunicationNotification(JSON.stringify(receiverIDs), content, fontFamlily, fontSize, fontStyle, fontColorR, fontColorG, fontColorB, direction, aligning, speed, isScrollTime, scrollInterval);
        }
    },


    /**
     * 设置广播通知反馈
     * style:{
     * fontFamlily:,fontSize:"",fontStyle:"",fontColorR:"",fontColorG:"",fontColorB:"",direction:"",
     *  aligning:"",speed:"",isScrollTime:false/true,scrollInterval:20
     *  }
     *
     *  style中的参数定义参见addBroadNotificationTemplate
     *
     *
     * resp:[{senderId:"",senderName:"",sendTime:"",content:"",style:{见上面定义}}....]
     * */
    setReceiverNotificationCallback: function(callback) {
        //informRecevieCommunicationNotification
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var self = this
            businessSDK6.setInformRecevieCommunicationNotificationCallback(function(obj) {
                var resp = [];
                if (obj) {
                    obj.notifications && obj.notifications.forEach(function(item) {
                        var style = {};
                        style.fontFamlily = self.getFontFamilyReverse(item.fontFamlily);
                        style.fontSize = item.fontSize;
                        style.fontStyle = self.getFontStyleReverse(item.fontStyle);
                        style.fontColorR = item.fontColorR;
                        style.fontColorG = item.fontColorG;
                        style.fontColorB = item.fontColorB;
                        style.direction = self.getDirectionReverse(item.direction);
                        style.aligning = self.getTextAlignReverse(item.aligning);
                        style.speed = self.getSpeedReverse(item.speed);
                        style.isScrollTime = item.isScrollTime || false;
                        style.scrollInterval = item.scrollInterval;
                        var it = {};
                        it.senderId = item.senderID;
                        it.senderName = item.senderName;
                        it.sendTime = item.sendTime;
                        it.content = item.content;
                        it.style = style;
                        resp.push(it);
                    });
                }
                callback(resp);
            });

        }


    },

    /**
     * 开始音频广播,有可能是V6专有
     *
     * resourceId:音频文件id
     * users:[{userId:"",resourceId:"",resourceCh:""}.....]
     * */
    startAudioBroadcast: function(resourceId, users) {

    },
    /**
     * 停止音频广播,有可能是V6专有
     * 参数具体参见 startAudioBroadcast
     * */
    stopAudioBroadcast: function(resourceId, users) {

    },

    /**
     * 开始麦克风广播,有可能是V6专有
     * resources:[{userId:"",resourceId:"",resourceCh:""}...]
     * */
    startMicroBroadcast: function(resources) {

    },
    /**
     * 停止麦克风广播,有可能是V6专有
     * 参数具体参见 startMicroBroadcast
     * */
    stopMicroBroadcast: function(resources) {

    },

    //***************************************************呼叫上屏配置*******************************************************
    /**
     * 获取用户绑定的大厅
     * hallId:大厅的id
     * hallName:大厅的名称
     *
     * var resp ={hallId:"",hallName:""}
     * */
    getBigHall: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getHall(this.userToken, function(obj) {
                var resp = { hallId: "", hallName: "" }
                if (obj && obj.data) {
                    resp.hallId = obj.data.hallId;
                    resp.hallName = obj.data.hallName;
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 通过大厅id获取大厅的大屏
     * hallId:大厅id
     * volume:大厅的声音
     *
     * var resp =[{screenId:"",screenName:"",volume:20}...]
     * */
    getBigScreenByHallId: function(hallId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getBigScreen2(this.userToken, hallId, function(obj) {
                var resp = [];
                if (obj && obj.data) {
                    obj.data && obj.data.forEach((item) => {
                        var it = { screenId: "", screenName: "", volume: '' }
                        it.screenId = item.screenId
                        it.screenName = item.screenName
                        it.volume = 0
                        resp.push(it)
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 通过大屏id获取大屏对应的模式屏
     * screenId:大厅id
     * modeId:模式id
     * modeName:模式名称
     * modeCode:模式代码
     * splitNum:分屏数
     * screens:[{pos:0,code:""}] pos:位置,code:04001
     *
     * var resp =[{modeId:"",modeName:"",modeCode:"",splitNum:4,screens:[{pos:1,code:"010400"}...]}]
     * */
    getBigHallModes: function(screenId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.getBigScreenMode(this.userToken, screenId, function(obj) {
                var resp = []
                if (obj && obj.data && obj.data.length > 0) {
                    obj.data && 　obj.data.forEach(function(item) {
                        var it = {};
                        it.modeId = "";
                        it.modeName = item.modeName;
                        it.modeCode = item.modeCode;
                        it.splitNum = item.screen.length
                        it.screens = []
                        item.screen && item.screen.forEach((line) => {
                            var row = { pos: 0, code: "" }
                            row.code = line.pos
                            it.screens.push(row)
                        })
                        resp.push(it);
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    //**************************************************视频指挥***********************************************************

    /**
     * 开启临时指挥
     *
     * groupName: 分组名称
     * osdId : Osd样式Id
     * schemeId : 显示方案 Id
     * description : 简要描述
     * users:[{userId:"",userName:"",parentId:"",level:1}...];用户资源
     * devices：[{deviceId:"",deviceName:"",deviceCh:""}...]; 设备资源
     *
     */
    startTemporaryCommand: function(groupName, users, devices, schemeId, description) {
        let self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var user = []
            users && users.forEach(function(item) {
                var it = {};
                it.userId = item.userId;
                it.userName = item.userName;
                it.parentId = item.parentId || self.userID;
                it.memberLevel = item.level;
                user.push(it);
            });
            var device = [];
            devices && devices.forEach(function(item) {
                var it = {};
                it.deviceId = item.deviceId;
                it.deviceCh = item.deviceCh;
                device.push(it);
            });
            businessSDK5.publishStartTempCommand(this.userToken, groupName, this.userID, JSON.stringify(user), JSON.stringify(device), schemeId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var user = []
            users && users.forEach(function(item) {
                var it = {};
                it.userID = item.userId;
                it.userName = item.userName;
                it.parentUserID = item.parentId;
                it.index = item.index;
                it.resourceType = 'User';
                user.push(it);
            });
            var device = [];
            devices && devices.forEach(function(item) {
                var it = {};
                it.deviceId = item.deviceId;
                it.deviceCh = item.deviceCh;
                device.push(it);
            });
            businessSDK6.publishStartTempCommand(groupName,schemeId, description,JSON.stringify(user), JSON.stringify(device));
        }
    },

    /**
     * 通知刷新指挥场景明细
     /**
     * isOnline:"offline"/"online"/"bebusy"/"onlineJoin"/"onlineNotJoin"/"breakdown"
     * role:"speak"/"member"/"chairman"
     * inGroup:true:入会,false:未入会
     * resType:参见enumResType
     *
     * var resp ={
     *     operate:init/refresh/stop/refresh2/addMember/removeMember/discuss/pause/upSilent/downSilent/cooperate/coordinate/authorize/crossgade/takeover, //todo V6来说，这里填写init
     *     conferenceId:'',
     *     conferenceName:'',
     *     init:{
     *         members:[{resId:'',resName:'',isOnline:"参照上面的isOnline定义",role:"参照上面的role定义",inGroup:true/false,resType:"参照上面的resType定义",parentId:"指挥使用，人员的上级"}],
     *         devices:[{resId:'',resCh:'',resName:'',isOnline:"参照上面的isOnline定义"，resType:"参照上面的resType定义",parentId:"指挥使用，人员的上级"}]
     *     },
     *     refresh:[{resId:''resName:'',resCh:'',isOnline:"参照上面的isOnline定义",inGroup:true/false,role:"参照上面的role定义",resType:"参照上面的resType定义",parentId:"指挥使用，人员的上级"}],
     *     addMember:[{resId:''resName:'',resCh:'',isOnline:"参照上面的isOnline定义",inGroup:true/false,role:"参照上面的role定义",resType:"参照上面的resType定义",parentId:"指挥使用，人员的上级"}],
     *     removeMember:[{resId:'',resCh:''}],
     *     discuss:{status:0/1}, 0:退出讨论，1：开启讨论
     *     pause:{status:0/1},   0:表示暂停，1：表示恢复
     *     upSilent:{userId:"",isMute:true/false},
     *     downSilent:{userId:"",isMute:true/false},
     *     cooperate:{senderId:"",destId:"",isOnline:""},
     *     coordinate:{senderId:"",destId:"",isOnline:""},
     *     crossgade:{senderId:"",destId:"",isOnline:""},
     *     authorize:{userId:"",isOnline:"online",users:[{userId:"",userName:"",inGroup:"true/false",isOnline:""}...]},
     *     takeover:{userId:"",isOnline:"online",users:[{userId:"",userName:"",inGroup:"true/false",isOnline:""}...]}
     * }
     * */
    startTemporaryCommandCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveInformCommandStatusCallback(function(obj) {
                console.log('iiiiii22------', JSON.stringify(obj));
                var resp = {
                    operate: '',
                    conferenceId: '',
                    conferenceName: '',
                    commandStatus: '',
                    init: {
                        members: [],
                        devices: []
                    },
                    refresh: [],
                    addMember: [],
                    removeMember: [],
                    discuss: {
                        status: 0
                    },
                    pause: {
                        status: 0
                    }
                };
                resp.conferenceId = obj.affairId;
                resp.conferenceName = obj.topic;
                resp.commandStatus = obj.commandStatus;
                if (obj.commandStatus === "StartCommand") {
                    resp.operate = "init";
                    obj.start && obj.start.users && obj.start.users.forEach(item => {
                        var it = {}
                        it.resId = item.userId
                        it.resName = item.userName

                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        if (obj.start.starterId === item.userId) {
                            it.role = "chairman" //发起人
                        } else {
                            it.role = "member" //成员
                        }
                        it.inGroup = item.inGroup == "1" ? true : false;
                        it.resType = 0
                        it.parentId = item.parentId
                        resp.init.members.push(it)
                    });
                    obj.start && obj.start.devices && obj.start.devices.forEach(item => {
                        var it = {}
                        it.resId = item.deviceId
                        it.resName = item.deviceName
                        it.deviceCh = item.deviceCh
                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        it.resType = 1
                        resp.init.devices.push(it);
                    });
                } else if (obj.commandStatus === "Refresh") {
                    resp.operate = "refresh2";
                    obj.refresh && obj.refresh.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resName = item.userName
                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        it.inGroup = item.inGroup == "1" ? true : false;
                        //todo V5暂时全当人处理
                        it.resType = 0
                        it.parentId = item.parentId
                        resp.refresh.push(it)
                    })
                } else if (obj.commandStatus === "AddMember") {
                    resp.operate = "addMember";
                    obj.addMember && obj.addMember.forEach(function(item) {
                        var it = {}
                        it.resId = item.userId
                        it.resName = item.userName
                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        it.inGroup = item.inGroup === "1" ? true : false;
                        //todo V5先当人处理
                        it.resType = 0
                        it.parentId = item.parentId
                        resp.addMember.push(it)
                    })
                } else if (obj.commandStatus === "RemoveMember") {
                    resp.operate = "removeMember";
                    obj.removeMember && obj.removeMember.forEach(function(item) {
                        var it = {}
                        it.resName = item.userName;
                        it.resId = item.userId;
                        it.resCh = "";
                        it.inGroup = item.inGroup == "1" ? true : false;
                        if (item.status == "1") {
                            it.isOnline = "online";
                        } else if (item.status == "0") {
                            it.isOnline = "offline";
                        } else if (item.status == "2") {
                            it.isOnline = "breakdown"
                        }
                        it.resType = 0;
                        resp.removeMember.push(it)
                    })
                } else if (obj.commandStatus === "PauseCommand") {
                    resp.operate = "pause";
                    resp.userId = obj.pause.userId;
                    resp.pause.status = 0;
                } else if (obj.commandStatus === "ResumeCommand") {
                    resp.operate = "resume";
                    resp.userId = obj.resume.userId;
                    resp.pause.status = 1;
                } else if (obj.commandStatus === "UpSilent") {
                    resp.operate = "upSilent";
                    resp.upSilent = {}
                    resp.upSilent.userId = obj.upsilent.userId
                    resp.upSilent.isMute = obj.upsilent.status == 1 // 1表示静默，0表示取消静默
                    resp.upSilent.model = obj.upsilent.model
                } else if (obj.commandStatus === "DownSilent") {
                    resp.operate = "downSilent"
                    resp.downSilent = {}
                    resp.downSilent.userId = obj.downsilent.userId
                    resp.downSilent.isMute = obj.downsilent.status == 1
                    resp.downSilent.model = obj.downsilent.model
                } else if (obj.commandStatus === "Cooperate") { //协同，注意是技勤中的协同
                    resp.operate = "cooperate"
                    resp.cooperate = {}
                    resp.cooperate.senderId = obj.cooperate.requestId
                    resp.cooperate.destId = obj.cooperate.destId
                    if (obj.cooperate.status == "1") {
                        resp.cooperate.isOnline = "online";
                    } else if (obj.cooperate.status == "0") {
                        resp.cooperate.isOnline = "offline";
                    } else if (obj.cooperate.status == "2") {
                        resp.cooperate.isOnline = "breakdown"
                    }
                } else if (obj.commandStatus === "Coordinate") { //协调
                    resp.operate = "coordinate"
                    resp.coordinate = {}
                    resp.coordinate.receiverId1 = obj.coordinate.requestId
                    resp.coordinate.receiverId2 = obj.coordinate.destId
                    if (obj.coordinate.status == "1") {
                        resp.coordinate.isOnline = "online";
                    } else if (obj.coordinate.status == "0") {
                        resp.coordinate.isOnline = "offline";
                    } else if (obj.coordinate.status == "2") {
                        resp.coordinate.isOnline = "breakdown"
                    }
                } else if (obj.commandStatus === "Authorize") { //授权,注意，V5中是推送整个组织树
                    resp.operate = "authorize"
                    resp.authorize = { userId: "", destId: "", status: "", users: [] },

                        resp.authorize.userId = obj.authorize.userId // 授权人id
                    resp.authorize.destId = obj.authorize.destId // 被授权人id
                    resp.authorize.status = obj.authorize.status; //   status 0：关闭指挥授权，1：开启指挥授权

                    obj.authorize.users && obj.authorize.users.forEach(item => {
                        var row = {}
                        row.resId = item.userId
                        row.resName = item.userName
                        row.inGroup = item.inGroup == "1" ? true : false;
                        row.parentId = item.parentId

                        if (item.status == "1") {
                            row.isOnline = "online";
                        } else if (item.status == "0") {
                            row.isOnline = "offline";
                        } else if (item.status == "2") {
                            row.isOnline = "breakdown"
                        }
                        row.resType = 0
                        resp.authorize.users.push(row)
                    })
                } else if (obj.commandStatus === "Crossgade") { //越级
                    resp.operate = "crossgade"
                    resp.crossgade = {}
                    resp.crossgade.senderId = obj.crossgade.requestId
                    resp.crossgade.destId = obj.crossgade.destId
                    if (obj.crossgade.status == "1") {
                        resp.crossgade.isOnline = "online";
                    } else if (obj.crossgade.status == "0") {
                        resp.crossgade.isOnline = "offline";
                    } else if (obj.crossgade.status == "2") {
                        resp.crossgade.isOnline = "breakdown"
                    }
                } else if (obj.commandStatus === "Supersede") { //接替
                    resp.operate = "takeover"
                    resp.takeover = { userId: "", destId: "", status: "", users: [] }

                    resp.takeover.userId = obj.supersede.userId // 接替人id
                    resp.takeover.destId = obj.supersede.destId // 被接替人id
                    resp.takeover.status = obj.supersede.status; //   status 0：关闭指挥接替，1：开启指挥接替

                    obj.supersede.users && obj.supersede.users.forEach(item => {
                        var row = {}
                        row.resId = item.userId
                        row.resName = item.userName
                        row.inGroup = item.inGroup === "1" ? true : false;
                        row.parentId = item.parentId

                        if (item.status == "1") {
                            row.isOnline = "online";
                        } else if (item.status == "0") {
                            row.isOnline = "offline";
                        } else if (item.status == "2") {
                            row.isOnline = "breakdown"
                        }
                        row.resType = 0
                        resp.takeover.users.push(row)
                    })
                } else if (obj.commandStatus === 'StartDownSilent' ||
                    obj.commandStatus === 'StartUpSilent' || obj.commandStatus === 'StopDownSilent' ||
                    obj.commandStatus === 'StopUpSilent') {
                    resp.operate = "startAndStop";
                    // resp.operate = "upSilent";
                    resp.upSilent = {}
                    if (obj.downsilent) {
                        resp.upSilent.userId = obj.downsilent.userId
                        resp.upSilent.isMute = obj.downsilent.status == 1 // 1表示静默，0表示取消静默
                        resp.upSilent.model = obj.downsilent.model
                    } else if (obj.upsilent) {
                        resp.upSilent.userId = obj.upsilent.userId
                        resp.upSilent.isMute = obj.upsilent.status == 1 // 1表示静默，0表示取消静默
                        resp.upSilent.model = obj.upsilent.model
                    }
                } else if (obj.commandStatus === 'StartCommutate' || obj.commandStatus === 'StopCommutate' ||
                    obj.commandStatus === 'StartAuthorize' || obj.commandStatus === 'StopAuthorize') {
                    resp.operate = "commutateAndAuthorize";
                    resp.upSilent = obj;
                } else if (obj.commandStatus === 'StartCooperate' || obj.commandStatus === 'StopCooperate') {
                    resp.operate = "commandCoordinate";
                    resp.upSilent = obj;
                } else if (obj.commandStatus === 'StartSupersede' || obj.commandStatus === 'StopSupersede') {
                    resp.operate = "supersede";
                    resp.upSilent = obj;
                }
                callback(resp);
            });
            businessSDK5.setReceiveInformCommandStatusCallback2(function(obj) {
                if (obj && obj.commandStatus === "StopCommand") {
                    var resp = { operate: "stop", conferenceId: '' };
                    resp.conferenceId = obj.affairId;
                    callback(resp);
                }
            });
            businessSDK5.setReceiveCommandAffairInfoCallback(function(obj) {
                // var resp = {};
                var resp = {
                    operate: '',
                    conferenceId: '',
                    conferenceName: '',
                    commandStatus: '',
                    init: {
                        members: [],
                        devices: []
                    },
                    // refresh: [],
                    // addMember: [],
                    // removeMember: [],
                    // discuss: {
                        // status: 0
                    // },
                    pause: {
                        status: 0
                    },
                    authorize:{
                        resId:'',
                        resName:'',
                    },
                    supersede:{
                        resId:'',
                        resName:'',
                    },
                };
                if (obj && obj.affairType == "command") {
                    if (obj.type == "init") {
                        resp.operate = "init";
                        resp.init = { members: [], devices: [] };
                        resp.conferenceId = obj.init.affairId;
                        resp.conferenceName = obj.init.affairName;
                        resp.commandStatus = obj.commandStatus;
                        obj.init.users && obj.init.users.forEach(item => {
                            var it = {};
                            it.resId = item.userId;
                            it.resName = item.userName;

                            if (item.status == "1") {
                                it.isOnline = "online";
                            } else if (item.status == "0") {
                                it.isOnline = "offline";
                            } else if (item.status == "2") {
                                it.isOnline = "breakdown"
                            }

                            if (obj.init.launcherId == item.userId) {
                                it.role = "chairman"; //Enum.enumRoleType.chairman; //主席
                            } else {
                                it.role = "member"; //Enum.enumRoleType.member; //成员
                            }
                            it.inGroup = item.inGroup == "1" ? true : false;
                            it.resType = 0
                            it.isSpectator = false
                            it.parentId = item.parentId;
                            resp.init.members.push(it);
                        });

                        obj.init.devices && obj.init.devices.forEach(item => {
                            var it = {}
                            it.resId = item.deviceId
                            it.resName = item.deviceName
                            it.deviceCh = item.deviceCh
                            if (item.status == "1") {
                                it.isOnline = "online";
                            } else if (item.status == "0") {
                                it.isOnline = "offline";
                            } else if (item.status == "2") {
                                it.isOnline = "breakdown"
                            }
                            it.resType = 1

                            resp.init.devices.push(it);
                        });
                        // 对于前端：0是暂停1是恢复
                        if( obj.init.pause == 1 ){
                            resp.pause.status = 0;
                        }else if( obj.init.pause == 0 ){
                            resp.pause.status = 1;
                        }
                        if( obj.init.command && obj.init.command.authorize ){
                            resp.authorize.resId = obj.init.command.authorize.destId;
                            resp.authorize.resName = obj.init.command.authorize.destName;
                        }
                        if( obj.init.command && obj.init.command.supersede ){
                            resp.supersede.resId = obj.init.command.supersede.destId;
                            resp.supersede.resName = obj.init.command.supersede.destName;
                        }
                    } else if (obj.type == "remove") {
                        resp.operate = "stop";
                        resp.conferenceId = obj.remove.affairId;
                    }
                    callback(resp)
                }
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformRefreshActivedCommandDetailCallback(function(obj) {
                if (obj.sceneType == 5) {
                    let members = [];
                    members = obj.members && obj.members.map(item => {
                        return {
                            resId: item.userID,
                            resName: item.userName,
                            isOnline: item.status,
                            role: item.role,
                            resType: 0,
                            deviceType: item.deviceType == 'HWMeetingTerminal' ? 13 : '',
                            inGroup: item.status == 'offline' || item.status == 'onlineOutMeeting' ? false : true,
                            parentId: item.parentUserId,
                            businessStatus: item.status
                        }
                    });
                    let devices = obj.device && obj.device.map(item => {
                        return {
                            resId: item.userID,
                            resName: item.userName,
                            isOnline: item.status,
                            resType: 1,
                            parentId: item.parentId
                        }
                    })
                    // let operate=null;
                    // if(obj.members.some(item=>item.status==='cmdCalling'||item.status==='cmdCoordinating'||item.status==='cmdCrossing')){
                    //     operate='refersh'
                    // }else{
                    //     operate='init';
                    // }
                    var resp = {
                        operate:'init',
                        operateId: obj.operatorID,
                        conferenceId: obj.sceneID,
                        conferenceName: obj.sceneName,
                        description: obj.description,
                        sceneType: obj.sceneType,
                        init: {
                            members: members,
                            devices: devices,
                        },
                    }
                    callback(resp);
                }
            });
            businessSDK6.setReceiveInformRemoveActivedCommandDetailCallback(function(obj) {
                var resp = { operate: "stop", conferenceId: obj.sceneID }
                callback(resp);
            });
        }
    },

    /**
     * 开启分组指挥
     *
     * groupId  : 分组Id
     * groupName : 分组名称
     */
    startGroupCommand: function(groupName, groupId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartCommand(this.userToken, groupName, groupId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStartCommand(groupName, groupId);
        }
    },

    /**
     * 关闭指挥（发起者）
     *
     * affairId : 指挥Id
     */
    stopCommand: function(affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopCommand(this.userToken, affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopCommand(affairId);
        }
    },

    /**
     * 成员申请退出指挥
     *
     * affairId : 指挥Id
     */
    applyLeaveCommand(affairId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishApplyLeave(this.userToken, affairId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishApplyLeave(affairId);
        }
    },

    /**
     * 指挥呼叫
     * affairId : 指挥Id
     * users:[{userId:""}]
     * */
    startCommandCall: function(affairId, users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCallMember(this.userToken, affairId, users)
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCommandCall(affairId, users)
        }
    },
    /**
     * 越级指挥
     * receiverId:越级接收者
     * 越级指挥也会体现在成员树
     * */
    startCrossCommand: function(commandId, receiverId) {
        // 越级指挥	websocket	C->S	{funName:"publishCrossGradeCommand",params:{token:"",affairId:"",userId:""}}	userId: 目标用户ID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishCrossGradeCommand(this.userToken, commandId, receiverId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCrossGradeCommand(commandId, receiverId);
        }
    },
    cancelCrossCommand: function(commandId, receiverId) {
        // 取消越级指挥	websocket	C->S	{funName:"publishStopCrossGradeCommand",params:{token:"",affairId:"",userId:""}}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopCrossGradeCommand(this.userToken, commandId, receiverId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopCrossGradeCommand(commandId, receiverId);
        }
    },
    /**
     * 授权指挥
     * receiverId:被授权者，有可能是组外成员
     *
     * 授权指挥，体现在结构树的变化，A授权B，B就获得A的成员树
     * */
    startAuthorizeCommand: function(commandId, receiverId) {
        // 授权指挥	websocket	C->S	{funName:"publishAuthorizeCommand",params:{token:"",affairId:"",userId:""}}	userId: 被授权用户ID	与“指挥接替”类似
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishAuthorizeCommand(this.userToken, commandId, receiverId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishAuthorizeCommand(commandId, receiverId);
        }
    },
    cancelAuthorizeCommand: function(commandId, receiverId) {
        // 停止授权指挥	websocket	C->S	{funName:"publishStopAuthorizeCommand",params:{token:"",affairId:"",userId:""}}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopAuthorizeCommand(this.userToken, commandId, receiverId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopAuthorizeCommand(commandId, receiverId);
        }
    },
    /**
     * 专向指挥
     * senderId,发起者
     * receiverId:接受者
     * */
    startSpecialCommand: function(commandId, userId, model) {
        // 专向指挥	websocket	C->S	{funName:"publishSpecialCommand",params:{token:"",affairId:"",userId:"",model:1}}	"userId: 专向指挥被发起方ID
        // model: 同向上静默model"	包括“音视频/视频/音频”三类
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSpecialCommand(this.userToken, commandId, userId, model);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSpecialCommand(commandId, userId, model);
        }
    },
    /**
     * 取消专向指挥
     * senderId:如果是接受者取消则为接收者，如果是发起者取消这位发起者Id
     * */
    cancelSpecialCommand: function(commandId, userId, model) {
        // 停止专向指挥	websocket	C->S	{funName:"publishStopSpecialCommand",params:{token:"",affairId:"",userId:"",model:1}}	userId: 专向指挥对方ID
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopSpecialCommand(this.userToken, commandId, userId, model);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopSpecialCommand(commandId, userId, model);
        }

    },
    /**
     * 接替指挥
     * resId:指挥员B请求接替A，resId为A的Id
     * */
    startTakeOverCommand: function(commandId, resId) {
        /**
         * 接替指挥（接管）	websocket	C->S	{funName:"publishSupersedeCommand",params:{token:"",affairId:"",userId:""}}	userId: 接替用户ID	主动
           请求接替指挥	websocket	C->S	{funName:"publishRequestSupersedeCommand",params:{token:"",affairId:"",userId:""}}	userId: 被接替用户ID	被动

         */
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishSupersedeCommand(this.userToken, commandId, resId);
            // businessSDK5.publishRequestSupersedeCommand(this.userToken,commandId,resId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSupersedeCommand(commandId, resId);
        }
    },
    cancelTakeOverCommand: function(commandId, resId) {
        // 停止接替指挥	websocket	C->S	{funName:"publishStopSupersedeCommand",params:{token:"",affairId:"",userId:""}}
        // "原指挥员取消接替指挥，即收回指挥权；
        // 当前指挥员取消接替指挥，即放弃指挥权"
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopSupersedeCommand(this.userToken, commandId, resId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopSupersedeCommand(commandId, resId);
        }
    },
    /**
     * 指挥静默,对上级指挥员静默,对下级指挥员静默
     * token:令牌
     * groupId:组id
     * upOrDown:true为对上静默,false是对下静默
     * mediaType: -1:无,2:音频,1:视频,0.音视频
     * */
    startCommandSilence: function(commandId, upOrDown, mediaType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (upOrDown) {
                businessSDK5.publishUpSilentCommand(this.userToken, commandId, mediaType);
            } else {
                // 向下静默	websocket	C->S	{funName:"publishDownSilentCommand",params:{token:"",affairId:"",model:1}}
                businessSDK5.publishDownSilentCommand(this.userToken, commandId, mediaType);
            }

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (upOrDown) {
                businessSDK6.publishUpSilentCommand(commandId, mediaType);
            } else {
                // 向下静默
                businessSDK6.publishDownSilentCommand(commandId, mediaType);
            }
        }
    },
    cancelCommandSilence: function(commandId, upOrDown, mediaType) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            if (upOrDown) {
                // 关闭向上静默	websocket	C->S	{funName:"publishStopUpSilentCommand",params:{token:"",affairId:"",model:1}}
                businessSDK5.publishStopUpSilentCommand(this.userToken, commandId, mediaType);
            } else {
                // 关闭向下静默	websocket	C->S	{funName:"publishStopDownSilentCommand",params:{token:"",affairId:"",model:1}}
                businessSDK5.publishStopDownSilentCommand(this.userToken, commandId, mediaType);
            }
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (upOrDown) {
                // 关闭向上静默
                businessSDK6.publishStopUpSilentCommand(commandId, mediaType);
            } else {
                // 关闭向下静默	
                businessSDK6.publishStopDownSilentCommand(commandId, mediaType);
            }
        }
    },
    /**
     * 强退成员
     * resId:成员id
     * */
    kickCommandMember: function(commandId, users) {
        // 强退成员	websocket	C->S	{funName:"publishKickMember",params:{token:"",affairId:"",users:[{userId:""}]}}
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishKickMember(this.userToken, commandId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishKickMember(commandId, users);
        }
    },

    /**
     * 暂停指挥
     * resId:成员id
     * */
    pauseCommand: function(commandId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishPauseCommand(this.userToken, commandId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishPauseCommand(commandId);
        }
    },

    /**
     * 恢复指挥
     * resId:成员id
     * */
    resumeCommand: function(commandId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishResumeCommand(this.userToken, commandId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishResumeCommand(commandId);
        }
    },

    /**
     * 开启指挥转发授权
     * */
    startCommandTransmitAuth: function(commandId, users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartCommandTransmitAuth(this.userToken, commandId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 停止指挥转发授权
     * */
    stopCommandTransmitAuth: function(commandId, users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopCommandTransmitAuth(this.userToken, commandId, users);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取指挥转发授权列表
     * */
    queryCommandTransmitAuth: function(commandId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishQueryCommandTransmitAuth(this.userToken, commandId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取指挥转发授权列表回调
     * */
    setReceiveCommandTransmitAuthCallBack: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveCommandTransmitAuthInfoCallBack(function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取指挥转发成员
     * */
    queryCommandTansmitMember: function(commandId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishQueryCommandTansmitMember(this.userToken, commandId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },

    /**
     * 获取指挥转发成员回调
     * */
    setReceiveCommandTransmitMemberCallBack: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveCommandTransmitMemberInfoCallBack(function(obj) {
                // [{memberId:"",memberName:"",inGroup:0/1,status:0/1/2,parentId:""}]
                var members = [];
                obj.forEach(item => {
                    var it = {}
                    it.resId = item.memberId
                    it.resName = item.memberName

                    if (item.status == "1") {
                        it.isOnline = "online";
                    } else if (item.status == "0") {
                        it.isOnline = "offline";
                    } else if (item.status == "2") {
                        it.isOnline = "breakdown"
                    }
                    it.inGroup = item.inGroup == "1" ? true : false;
                    it.resType = 0
                    it.parentId = item.parentId
                    members.push(it)
                });
                callback(members);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // todo
        }
    },


    //----------------------------------指挥分组----------------------------------------------------
    /**
     * 添加指挥分组
     * groupName: 分组名称
     * description: 描述
     * schemeId: 方案ID
     * users: 成员数组 users=[{userId:"",parentId:""},{userId:"",parentId:""}]
     * devices: 设备数组 devices=[{deviceId:"",deviceCh:0}]
     * var resp ={Ret:0/1}
     * */
    addCommandGroup: function(groupName, description, schemeId, users, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.addCommandGroup(this.userToken, groupName, description, schemeId, JSON.stringify(users), JSON.stringify(devices), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {}
    },
    /**
     * 删除指挥分组
     * groupId:分组id
     * var resp ={Ret:0/1}
     * */
    deleteCommandGroup: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.deleteCommandGroup(this.userToken, groupId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 通过组 id 获取指挥分组的详细信息
     * 分组Id : groupId
     * 业务名称 : groupName
     * 显示方案Id : schemeId
     * 显示方案名称 : schemeName
     * 简要描述 : description

     * var resp ={groupId:"",groupName:"",schemeId:'',schemeName:'',description:"",
     * users:[{resourceId,resourceCh,resourceName,resourceType,parentId,parentName}..],
     * resource:[{resourceId,resourceCh,resourceName,resourceType}..]
     * */
    getCommandGroupById: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryCommandGroupInfo(this.userToken, groupId, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                resp.groupId = obj.data.groupId;
                resp.groupName = obj.data.groupName;
                resp.schemeId = obj.data.schemeId || '';
                resp.schemeName = obj.data.schemeName || '';
                resp.description = obj.data.description;
                resp.groupType = obj.data.groupType;
                var users = [];
                if (obj.data.userObjs && obj.data.userObjs.length > 0) {
                    obj.data.userObjs.forEach(item => {
                        users.push({
                            resourceId: item.userId,
                            resourceName: item.userName,
                            resourceCh: '',
                            resourceType: 0,
                            parentId: item.parentId,
                            // parentName:item.parentName,
                        });
                    })
                }
                resp.users = users;
                var resource = [];
                if (obj.data.deviceObjs && obj.data.deviceObjs.length > 0) {
                    obj.data.deviceObjs.forEach(item => {
                        resource.push({
                            resourceId: item.deviceId,
                            resourceName: item.deviceName,
                            resourceCh: item.deviceCh,
                            resourceType: 0,
                            parentId: item.updeviceId,
                            // parentName:item.parentName,
                        });
                    })
                }
                resp.resource = resource;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = {}
            resp.groupId = "1";
            resp.groupName = "指挥组一";
            resp.schemeId = "FA001";
            resp.schemeName = "显示方案一";
            resp.description = "指挥组一描述";
            var users = [];
            var it1 = { resourceId: "001", resourceCh: "", resourceName: "人员A01", resourceType: 0, parentId: "", parentName: "0" }
            var it2 = { resourceId: "002", resourceCh: "", resourceName: "人员A001", resourceType: 0, parentId: "001", parentName: "人员A01" }
            var it3 = { resourceId: "003", resourceCh: "", resourceName: "人员B01", resourceType: 0, parentId: "", parentName: "0" }
            var it4 = { resourceId: "004", resourceCh: "", resourceName: "人员B001", resourceType: 0, parentId: "003", parentName: "人员B01" }
            var it5 = { resourceId: "005", resourceCh: "", resourceName: "人员B002", resourceType: 0, parentId: "003", parentName: "人员B01" }
            users.push(it1);
            users.push(it2);
            users.push(it3);
            users.push(it4);
            users.push(it5);
            var resource = [];
            var it11 = { resourceId: "01", resourceCh: "", resourceName: "设备A01", resourceType: 1 }
            var it21 = { resourceId: "02", resourceCh: "", resourceName: "设备A02", resourceType: 1 }
            var it31 = { resourceId: "03", resourceCh: "", resourceName: "设备A03", resourceType: 1 }
            var it41 = { resourceId: "04", resourceCh: "", resourceName: "设备A04", resourceType: 1 }
            var it51 = { resourceId: "05", resourceCh: "", resourceName: "设备A05", resourceType: 1 }
            resource.push(it11);
            resource.push(it21);
            resource.push(it31);
            resource.push(it41);
            resource.push(it51);
            resp.users = users;
            resp.resource = resource;
            callback(resp);
        }
    },
    /**
     * 保存指挥分组
     * groupId:组id
     * schemeId:方案id
     * description:描述
     * groupName:分组名称
     * users:[{resourceId,resourceCh,resourceName,resourceType,parentId,parentName}..]
     * resource:[resourceId,resourceCh,resourceName,resourceType}..]
     * var resp ={Ret:0/1}
     * */
    saveCommandGroup: function(groupId, groupName, description, schemeId, users, devices, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateCommandGroup(this.userToken, groupId, groupName, description, schemeId, JSON.stringify(users), JSON.stringify(devices), function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *  查询指挥分组 (分页)
     *
     *  resp =  {total:0, rows:[{groupId:"", groupName: "",groupDescription: "",schemeId:"",groupType:""}]}
     */
    queryCommandGroup: function(page, pageSize, callback) {
        var self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryCommandGroup(this.userToken, page, 1, pageSize, function(obj) {
                var resp = {};
                resp.Ret = obj.ret;
                resp.total = obj.data.totalCount;
                var rows = [];
                obj.data.list && obj.data.list.forEach((item) => {
                    var isGroupOperator = false;
                    if (item.operateId && item.operateId.length > 0) {
                        item.operateId.forEach(ele => {
                            if (ele == self.userID) {
                                isGroupOperator = true;
                            }
                        })
                    }
                    rows.push({
                        groupId: item.groupId,
                        groupName: item.groupName,
                        groupDescription: item.description,
                        schemeId: item.schemeId,
                        groupType: item.groupType,
                        isGroupOperator: isGroupOperator,
                    });
                });
                resp.rows = rows;
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = { total: '', list: [] }
            resp.total = 5;
            var list = [];
            var it1 = { groupId: 1, groupName: '指挥组一', groupDescription: "指挥组一描述" };
            var it2 = { groupId: 2, groupName: '指挥组二', groupDescription: "指挥组二描述" };
            var it3 = { groupId: 3, groupName: '指挥组三', groupDescription: "指挥组三描述" };
            var it4 = { groupId: 4, groupName: '指挥组四', groupDescription: "指挥组四描述" };
            var it5 = { groupId: 5, groupName: '指挥组五', groupDescription: "指挥组五描述" };
            list.push(it1);
            list.push(it2);
            list.push(it3);
            list.push(it4);
            list.push(it5);
            resp.rows = list;
            callback(resp);
        }
    },

    //----------------------------------协同指挥管理-------------------------------------------------
    /**
     * 获取指挥组成员列表
     * commandId:指挥id
     *
     * var resp =[{resourceId:"",resourceName:"",parentId:"",parentName:"",}...]
     * */
    getCommandResources: function(commandId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            /*businessSDK5.setReceiveInformCommandStatusCallback(function(obj){
              var resp = [];
              if(obj.commandStatus === "StartCommand"){
                resp.operate ="init";
                obj.start && obj.start.users && obj.start.users.forEach(item =>{
                  var it ={}
                  it.resourceId = item.userId
                  it.resourceName = item.userName
                  if(item.status == "1"){
                    it.isOnline = "online"; // 在线
                  }else if(item.status == "0"){
                    it.isOnline = "offline"; // 离线
                  }else if(item.status == "2"){
                    it.isOnline ="breakdown" // 故障
                  }
                  if(obj.start.starterId === item.userId){
                    it.role = "chairman" //发起人
                  }else{
                    it.role = "member" //成员
                  }
                  it.inGroup = item.inGroup == "1" ? true : false;
                  it.resType = 0
                  it.parentId = item.parentId
                  resp.push(it)
                });
                obj.start && obj.start.devices && obj.start.devices.forEach(item => {
                  var it ={}
                  it.resId = item.deviceId
                  it.resName = item.deviceName
                  it.deviceCh = item.deviceCh
                  if(item.status == "1"){
                    it.isOnline = "online";
                  }else if(item.status =="0"){
                    it.isOnline = "offline";
                  }else if(item.status=="2"){
                    it.isOnline ="breakdown"
                  }
                  it.resType = 1
                  resp.init.devices.push(it);
                });
              }else if(obj.commandStatus === "Refresh"){
                resp.operate = "refresh2";
                obj.refresh && obj.refresh.forEach(function (item) {
                  var it ={}
                  it.resId = item.userId
                  it.resName = item.userName
                  if(item.status == "1"){
                    it.isOnline = "online";
                  }else if(item.status == "0"){
                    it.isOnline = "offline";
                  }else if(item.status == "2"){
                    it.isOnline ="breakdown"
                  }
                  it.inGroup = item.inGroup == "1" ? true : false;
                  //todo V5暂时全当人处理
                  it.resType = 0
                  it.parentId = item.parentId
                  resp.refresh.push(it)
                })
              } else if(obj.commandStatus === "AddMember"){
                resp.operate = "addMember";
                obj.addMember && obj.addMember.forEach(function (item) {
                  var it ={}
                  it.resId = item.userId
                  it.resName = item.userName
                  if(item.status == "1"){
                    it.isOnline = "online";
                  }else if(item.status == "0"){
                    it.isOnline = "offline";
                  }else if(item.status == "2"){
                    it.isOnline ="breakdown"
                  }
                  it.inGroup = item.inGroup === "1" ? true : false;
                  //todo V5先当人处理
                  it.resType = 0
                  it.parentId = item.parentId
                  resp.addMember.push(it)
                })
              }else if(obj.commandStatus === "RemoveMember"){
                resp.operate = "removeMember";
                obj.removeMember && obj.removeMember.forEach(function (item) {
                  var it ={}
                  it.resName = item.userName;
                  it.resId = item.userId;
                  it.resCh = "";
                  it.inGroup = item.inGroup == "1" ? true : false;
                  resp.removeMember.push(it)
                })
              }else if(obj.commandStatus === "PauseCommand"){
                resp.operate = "pause";
                resp.pause.status = 0;
              }else if(obj.commandStatus === "ResumeCommand"){
                resp.operate = "resume";
                resp.pause.status = 1;
              }else if(obj.commandStatus === "UpSilent"){
                resp.operate = "upSilent";
                resp.upSilent={}
                resp.upSilent.userId = obj.upsilent.userId
                resp.upSilent.isMute = obj.upsilent.status == 1   // 1表示静默，0表示取消静默
                resp.upSilent.model = obj.upsilent.model
              }else if(obj.commandStatus === "DownSilent"){
                resp.operate = "downSilent"
                resp.downSilent ={}
                resp.downSilent.userId = obj.downsilent.userId
                resp.downSilent.isMute = obj.downsilent.status ==1
                resp.downSilent.model = obj.downsilent.model
              }else if(obj.commandStatus === "Cooperate"){//协同，注意是技勤中的协同
                resp.operate = "cooperate"
                resp.cooperate ={}
                resp.cooperate.senderId = obj.cooperate.requestId
                resp.cooperate.destId = obj.cooperate.destId
                if(obj.cooperate.status == "1"){
                  resp.cooperate.isOnline = "online";
                }else if(obj.cooperate.status == "0"){
                  resp.cooperate.isOnline = "offline";
                }else if(obj.cooperate.status == "2"){
                  resp.cooperate.isOnline ="breakdown"
                }
              }else if(obj.commandStatus === "Coordinate"){//协调
                resp.operate = "coordinate"
                resp.coordinate = {}
                resp.coordinate.receiverId1 = obj.coordinate.requestId
                resp.coordinate.receiverId2 = obj.coordinate.destId
                if(obj.coordinate.status == "1"){
                  resp.coordinate.isOnline = "online";
                }else if(obj.coordinate.status == "0"){
                  resp.coordinate.isOnline = "offline";
                }else if(obj.coordinate.status == "2"){
                  resp.coordinate.isOnline ="breakdown"
                }
              }else if(obj.commandStatus === "Authorize"){//授权,注意，V5中是推送整个组织树
                resp.operate = "authorize"
                resp.authorize ={userId:"",isOnline:"online",users:[]}

                resp.authorize.userId = obj.authorize.userId
                if(obj.authorize.status == "1"){
                  resp.authorize.isOnline = "online";
                }else if(obj.authorize.status == "0"){
                  resp.authorize.isOnline = "offline";
                }else if(obj.authorize.status =="2"){
                  resp.authorize.isOnline ="breakdown"
                }

                obj.authorize.users && obj.authorize.users.forEach(item=>{
                  var row  = {}
                  row.userId = item.userId
                  row.userName = item.userName
                  row.inGroup = item.inGroup == "1" ? true : false;
                  row.parentId = item.parentId

                  if(item.status == "1"){
                    row.isOnline = "online";
                  }else if(item.status == "0"){
                    row.isOnline = "offline";
                  }else if(item.status == "2"){
                    row.isOnline ="breakdown"
                  }
                  resp.authorize.users.push(row)
                })
              }else if(obj.commandStatus ==="Crossgade"){//越级
                resp.operate ="crossgade"
                resp.crossgade ={}
                resp.crossgade.senderId = obj.crossgade.requestId
                resp.crossgade.destId = obj.crossgade.destId
                if(obj.crossgade.status == "1"){
                  resp.crossgade.isOnline = "online";
                }else if(obj.crossgade.status == "0"){
                  resp.crossgade.isOnline = "offline";
                }else if(obj.crossgade.status == "2"){
                  resp.crossgade.isOnline ="breakdown"
                }
              }else if(obj.commandStatus === "Supersede"){//接替
                resp.operate = "takeover"
                resp.takeover ={userId:"",isOnline:"online",users:[]}

                resp.takeover.userId = obj.supersede.userId
                if(obj.supersede.status == "1"){
                  resp.takeover.isOnline = "online";
                }else if(obj.supersede.status =="0"){
                  resp.takeover.isOnline = "offline";
                }else if(obj.supersede.status=="2"){
                  resp.takeover.isOnline ="breakdown"
                }

                obj.supersede.users && obj.supersede.users.forEach(item=>{
                  var row  = {}
                  row.userId = item.userId
                  row.userName = item.userName
                  row.inGroup = item.inGroup === "1" ? true : false;
                  row.parentId = item.parentId

                  if(item.status == "1"){
                    row.isOnline = "online";
                  }else if(item.status == "0"){
                    row.isOnline = "offline";
                  }else if(item.status == "2"){
                    row.isOnline ="breakdown"
                  }
                  resp.takeover.users.push(row)
                })
              }
              callback(resp);
            });*/
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    /**
     * 获取指挥组协同资源
     * commandId:指挥id
     *
     * var resp =[{ receiverId1: '1', receiverName1: '接受协同指挥员', receiverId2: '1', receiverName2: '请求协同指挥员' }...]
     * */
    getCooperateCommandResources: function(commandId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryCooperate(this.userToken, commandId, function(obj) {
                var resp = [];
                if (obj) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.receiverId2 = item.request.userId;
                        it.receiverName2 = item.request.userName;
                        it.receiverId1 = item.destion.userId;
                        it.receiverName1 = item.destion.userName;
                        resp.push(it)
                    })
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryCooperate(commandId, function(obj) {
                var resp = [];
                if (obj) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.receiverId1 = '';
                        it.receiverName1 = '';
                        it.receiverId2 = '';
                        it.receiverName2 = '';
                        it.time = '';
                        resp.push(it)
                    })
                }
                callback(resp);
            })
        }
    },
    /**
     * 开始协同指挥 （1 对 1 关系）
     *
     * recevicerId:同级指挥者
     * type 1 为请求协同 2为协调指挥
     * */
    startCooperateCommand: function(commandId, receiverId, type) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // 协同指挥	websocket	C->S	{funName:"publishCooperateCommand",params:{token:"",affairId:"",userId:""}}	userId: 协同指挥被发起方ID
            businessSDK5.publishCooperateCommand(this.userToken, commandId, receiverId, type);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCooperateCommand(commandId, receiverId);
        }

    },
    cancelCooperateCommand: function(commandId, receiverId, destId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // 停止协同指挥	websocket	C->S	{funName:"publishStopCooperateCommand",params:{token:"",affairId:"",reqestId:"", destId:""}}
            businessSDK5.publishStopCooperateCommand(this.userToken, commandId, receiverId, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishStopCooperateCommand(commandId, receiverId);
        }
    },
    /**
     * 协同指挥取消所有协同
     * commandId:指挥id
     * */
    cancelAllCooperateCommand: function(commandId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // {funName:"publishStopCooperateCommand",params:{token:"",affairId:"",userId:""}}
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },
    //----------------------------------协调指挥管理-------------------------------------------------
    /**
     * 获取协调指挥的资源
     * commandId:指挥id
     *
     * ]
     * var resp =[{operateId:"",operateName:"",receiverId1:"",receiverName1:"",receiverId2:"",receiverName2:""}...]
     * */
    getCoordinateCommandResources: function(commandId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryCoordinate(this.userToken, commandId, function(obj) {
                var resp = [];
                if (obj) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.operateId = item.request.userId;
                        it.operateName = item.request.userName;
                        it.receiverId1 = item.a.userId;
                        it.receiverName1 = item.a.userName;
                        it.receiverId2 = item.b.userId;
                        it.receiverName2 = item.b.userName;
                        resp.push(it);
                    });
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // dataSDK6.queryCoordinate(commandId, (obj) => {
            //     var resp = [];
            //     if (obj) {
            //         obj.data && obj.data.members && obj.data.members.forEach((item) => {
            //             var it = {};
            //             it.operateId = '';
            //             it.operateName = this.userName;
            //             it.receiverId1 = item.coordinateIDOne;
            //             it.receiverName1 = item.coordinateNameOne;
            //             it.receiverId2 = item.coordinateIDTwo;
            //             it.receiverName2 = item.coordinateNameTwo;
            //             resp.push(it)
            //         })
            //     }
            //     callback(resp);
            // });
            businessSDK6.setReceiveInformRefreshCoordinateListCallback((obj) => {
                let resp = [];
                obj.data && obj.data.forEach((item) => {
                    var it = {};
                    it.operateId = this.userId;
                    it.operateName = this.userName;
                    it.receiverId1 = item.coordinateIDOne;
                    it.receiverName1 = item.coordinateNameOne;
                    it.receiverId2 = item.coordinateIDTwo;
                    it.receiverName2 = item.coordinateNameTwo;
                    resp.push(it)
                })
                callback(resp);
            });
        }
    },
    // 订阅协调指挥列表
    publishCoordinateList: function(sceneId) {
         if (this.config.version === this.enumSDKVersion.SDKVersion5) {

         } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishCoordinateList(sceneId);
         }
    },
    /**
     * 协调指挥 - 协调指挥只能够是组内指挥，需要接收方同意
     * receiverId:接收协调指挥者，无论是发起协调指挥还是接收协调指挥者都可以取消
     * */
    startCoordinateCommand: function(commandId, receiverId1, receiverId2) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            var users = [];
            var it1 = {};
            var it2 = {};
            it1.userId = receiverId1;
            it2.userId = receiverId2;
            users.push(it1);
            users.push(it2);
            businessSDK5.publishCoordinateCommand(this.userToken, commandId, JSON.stringify(users));
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //users: 协调指挥被发起方ID数组 上级 > A+B users数组只能包含两个元素
            var users = [];
            var it1 = {};
            var it2 = {};
            it1.userId = receiverId1;
            it2.userId = receiverId2;
            users.push(it1);
            users.push(it2);
            businessSDK6.publishCoordinateCommand(commandId,[receiverId1, receiverId2].join(','));
        }
    },
    /**
     * 取消协调指挥
     * */
    cancelCoordinateCommand: function(commandId, requestId, receiverId1, receiverId2) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // 停止协调指挥	websocket	C->S
            // {funName:"publishStopCoordinateCommand",params:{token:"",affairId:"",requestId:""users:[{userId:""}]}}
            var users = [];
            var it1 = {};
            var it2 = {};
            it1.userId = receiverId1;
            it2.userId = receiverId2;
            users.push(it1);
            users.push(it2);
            businessSDK5.publishStopCoordinateCommand(this.userToken, commandId, requestId, JSON.stringify(users));
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var users = [];
            var it1 = {};
            var it2 = {};
            it1.userId = receiverId1;
            it2.userId = receiverId2;
            users.push(it1);
            users.push(it2);
            businessSDK6.publishStopCoordinateCommand(commandId, [receiverId1, receiverId2].join(','));
        }

    },
    /**
     * 取消所有的协调指挥
     * */
    cancelAllCoordinateCommand: function(commandId,users) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        }else{
            businessSDK6.publishStopAllCoordinateCommand(commandId, users.join(','));
        }
    },
    //----------------------------------指挥分派管理-------------------------------------------------
    /**
     * 获取指挥分派资源列表
     * commandId:指挥id
     *
     * var resp =[{resId:"",resName:"",dispatcherId:"",dispatcherName:""}....]
     *
     * 其中:resId:接收分派的指挥员id
     * resName:接收分派的指挥员名称
     * dispatcherId:被分派的下级指挥员id
     * dispatcherName:被分派的下级指挥员名称
     * */
    getDispatchCommandResources: function(commandId, callback) {

    },
    /**
     * 指挥分派,dispatchers,分派给resId
     * dispatchers:被分派的人 [{dispatcherId:""}....]
     * resId:接收分派的资源
     * 指挥分派也体现在成员结构树上面
     * */
    startDispatchCommand: function(commandId, dispatchers, resId) {

    },
    /**
     * 取消分派
     * */
    cancelDispatchCommand: function(commandId, dispatchers, resId) {

    },
    /**
     * 取消所有指挥分派
     * */
    cancelAllDispatch: function(commandId) {

    },
    //*********************************************************即时通讯***************************************************
    /**
     * 获取系统消息
     * key:关键字
     * beginTime:开始时间
     * endTime:  结束时间
     *
     * var resp =[{messageId:"",topic:"",receiveTime:""}...]
     * */
    queryMessageForSystem: function(key, beginTime, endTime, page, pageSize, callback) {

    },
    /**
     * 获取单条系统消息
     * messageId:信息Id
     *
     * var resp ={messageId:"",topic:"",receiveTime:"",content:""}
     * */
    getSystemMessageById: function(messageId, callback) {

    },
    /**
     * 获取广播消息
     *
     * key:关键字
     * beginTime:开始时间
     * endTime:结束时间
     *
     * topic:主题
     * receiverTime:接收时间
     * sender:发送人
     * var resp =[{messageId:"",topic:"",receiverTime:"",sender:""}...]
     * */
    queryMessageForBroadcast: function(key, beginTime, endTime, page, pageSize, callback) {

    },
    /**
     * 获取单条广播消息
     *
     * var resp ={messageId:"",topic:"",receiverTime:"",sender:""}
     * */
    queryBroadcastById: function(messageId, callback) {

    },

    /**
     * 获取单人会话列表
     * 入参具体参见 queryMessageForSystem
     *
     * var resp = [{sessionId:"",userId:"",userName:"",lastTime:"",lastContent:""}..]
     * 其中：userId:联系人id,userName:联系人姓名,lastTime:最后通话时间,lastContent:最后通话内容
     * */
    querySingeSessions: function(key, beginTime, endTime, callback) {

    },
    /**
     * 获取单人会话详细信息
     *
     * var resp ={totalCnt:"",rows:[{sessionId:"",userId:"",userName:"",time:"",content:""}....]}
     * 其中：userId:联系人id,userName:联系人姓名,time:会话时间,content:内容
     *
     * */
    querySessionById: function(sessionId, page, pageSize, callback) {

    },
    /**
     * 获取多人会话列表
     * 入参具体参见 queryMessageForSystem
     *
     * var resp = [{sessionId:"",users:[{userId:"",userName:""}...],lastTime:"",lastContent:""}...]
     * 其中：userId:联系人id,userName:联系人姓名,lastTime:最后通话时间,lastContent:最后通话内容
     * */
    queryMutiSessions: function(key, beginTime, endTime, callback) {

    },
    /**
     * 获取多人会话详细信息
     *
     * var resp ={totalCnt:"",rows:[{sessionId:"",userId:"",userName:"",time:"",content:""}....]}
     * */
    queryMultiSessionById: function(sessionId, page, pageSize, callback) {

    },

    /**
     * 创建群组
     * @param {*} groupName
     * @param {*} description
     * @param {members=[{memberId:"",memberType:0/1/2}]  memberType 分组成员类型 0-群主 1-管理员 2-群成员} members
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{groupId:""}}
     */
    addIMGroupAPI(groupName, description, members, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.addIMGroup(this.userToken, groupName, description, members, function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 修改群组
     * @param {*} groupId
     * @param {*} groupName
     * @param {*} description
     * @param {*} members  members=[{memberId:"",memberType:0/1/2}]  memberType 分组成员类型 0-群主 1-管理员 2-群成员
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    updateIMGroupAPI: function(groupId, groupName, description, members, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateIMGroup(this.userToken, groupId, groupName, description, members, function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 删除群组
     * @param {*} groupId
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    removeIMGroupAPI: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.removeIMGroup(this.userToken, groupId, function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 删除用户会话
     * @param {*} to
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    removeUserSessionAPI: function(to, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.removeUserSession(this.userToken, to, function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 分页查询群组
     * @param {*} page
     * @param {*} offset
     * @param {*} limit
     * @param {*} callback return {"ret":0,"msg":"Success","data":{[{groupId:"",groupName:"",description=""}]}}
     */
    queryIMGroupAPI: function(page, offset, limit, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryIMGroup(this.userToken, page, offset, limit, function(obj) {
                var resp = [];
                if (obj.ret == 0 && obj.data.list) {
                    resp = obj.data.list;
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 查询群组详细信息
     * @param {*} groupId
     * @param {*} callback return {"ret":0,"msg":"Success","data":{groupId:"",groupName:"",description="",members:[{memberId:"",memberType:0/1/2}}}
     */
    queryIMGroupInfoAPI: function(groupId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryIMGroupInfo(this.userToken, groupId, function(obj) {
                var users = [];
                if (obj && obj.ret == 0) {
                    if (obj.data.members && obj.data.members.length > 0) {
                        obj.data.members.forEach(item => {
                            var user = {};
                            user.userId = item.userId;
                            user.userName = item.memberName;
                            user.memberType = item.memberType;
                            // memberType 分组成员类型 0-群主 1-管理员 2-群成员
                            users.push(user);
                        });
                    }
                }
                callback(users);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 文件上传
     * @param {*} file
     * @param {*} callback return {"ret":0,"msg":"Success","data":{fileId:""}}
     */
    uploadFile: function(file, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // dataSDK5.uploadFile(this.userToken, file, function(obj) {
            dataSDK5.uploadFile(file, function(obj) {
                callback(obj);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },


    /**
     * 即时通讯 - 发送消息
     * users :[{userId:"",userName:""}...]
     * content:内容
     * */
    sendCommunicationNotification: function(users, content) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var receiverIds = []
            users && users.forEach(item => {
                receiverIds.push(item.userId)
            })
            businessSDK6.publishSendCommunicationMessage(JSON.stringify(receiverIds), content)
        }
    },

    /**
     * 即时通讯 - 通知推送的回调函数
     *
     * var resp =[{senderId:"",senderName:"",sendTime:"",content:""}...]
     *
     * 其中：sendTime为发送通知时间，content:为内容
     * */
    setInformNotificationReceiveCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            var resp = []
            businessSDK6.setInformRecevieCommunicationNotificationCallback(function(obj) {
                obj.notifications && obj.notifications.forEach(item => {
                    var row = {}
                    row.senderId = item.senderID
                    row.senderName = item.senderName
                    row.sendTime = item.sendTime
                    row.content = item.content

                    resp.push(row)
                })

                callback(resp)
            })
        }
    },

    /**
     * 发送消息(仅文本)
     * sessionId:会话id
     * users:[{userId:"",userName:""}...]
     * content:内容
     * */
    sendMessage: function(sessionId, users, content, to, msg_type) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // let time = new Date().formatDate("yyyy-MM-dd HH:mm:ss");
            let time = "";
            let chat_type = 1;
            let group_id = "";
            if (sessionId == "") {
                chat_type = 1;
            } else {
                chat_type = 2;
                group_id = sessionId;
            }
            businessSDK5.publishSendMsg(this.userToken, to, time, msg_type, chat_type, group_id, content);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (sessionId == "") {
                var receiverIds = []
                users && users.forEach(item => {
                    receiverIds.push(item.userId)
                })
                businessSDK6.publishSendCommunicationMessage(JSON.stringify(receiverIds), content)
            } else {
                businessSDK6.publishSendCommunicationMessageFromSession(sessionId, content)
            }
        }
    },
    /**
     * 设置消息已读
     * sessionId:会话id
     * messageIDs:[""]
     *
     * var resp ={Ret:0/1}
     * */
    setMessageHasReaded: function(sessionId, messageIDs, callback) {
        //publishSetCommunicationMessageReaded
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetCommunicationMessageReaded(JSON.stringify(messageIDs));
        }
    },
    /**
     * 设置消息推送的回调函数
     *
     * var resp = {unReadedCount: 0, sessionId:"",users:[{userId:"",userName:""}...],
     * messages:[{messageId:"",senderId:"",senderName:"",time:"",content:"",isReaded:true/false}...]}}
     * */
    setInfromMessageReceiveCallback: function(callback) {
        var self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveIMMessageCallback(function(res) {
                var resp = { chat_type: 1, sessionId: "", group_name: "", from: "", fromName: "", to: "", toName: "", unReadedCount: 0, messages: [], users: [] };
                resp.chat_type = res.chat_type;
                resp.unReadedCount = 1;
                var message = {};
                message.msg_type = res.msg_type;
                message.messageId = res.messageId;
                message.senderId = res.from;
                message.senderName = res.fromName;
                message.sendTime = res.time;
                message.content = res.content;
                message.isReaded = res.isReaded || false;
                resp.messages.push(message);
                if (res.chat_type == 1) {
                    var user = {};
                    user.userId = res.to;
                    user.userName = res.toName;
                    resp.users.push(user);
                    resp.to = res.to;
                    resp.toName = res.toName;
                    resp.from = res.from;
                    resp.fromName = res.fromName;
                    // callback(resp);
                } else if (res.chat_type == 2) {
                    resp.sessionId = res.group_id;
                    resp.group_name = res.group_name;
                    /*
                    let groupId = res.group_id;
                    // 根据群组id查询群组信息
                    dataSDK5.queryIMGroupInfo(self.userToken, groupId, function(obj) {
                        console.log(obj);
                        if (obj && obj.ret == 0) {
                            if( obj.data.members && obj.data.members.length > 0 ){
                                obj.data.members.forEach(item=>{
                                    var user = {};
                                    user.userId = item.userId;
                                    user.userName = item.memberName;
                                    user.memberType = item.memberType;
                                    // memberType 分组成员类型 0-群主 1-管理员 2-群成员
                                    resp.users.push(user);
                                });
                            }
                        }
                        callback(resp);
                    });
                    */
                }
                callback(resp);
            });
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //
            businessSDK6.setReceiveInformRecevieMessageCallback(function(obj) {
                //返回值
                var resp = { unReadedCount: 0, sessionId: "", users: [], messages: [] }
                resp.unReadedCount = obj.unReadedCount
                resp.sessionId = obj.sessionID
                obj.users && obj.users.forEach((item) => {
                    var user = {}
                    user.userId = item.userID
                    user.userName = item.userName
                    resp.users.push(user)
                })

                obj.messages && obj.messages.forEach(item => {
                    var message = {}
                    message.messageId = item.messageID
                    message.senderId = item.senderID
                    message.senderName = item.senderName
                    message.sendTime = item.sendTime
                    message.content = item.content
                    message.isReaded = item.isReaded || false

                    resp.messages.push(message)
                })

                callback(resp)
            })
        }
    },

    /**
     * 设置删除群组消息回调函数
     * 
     * var resp = {group_id:''}
     * */
    setRemoveIMGroupCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveRemoveIMGroupCallback(function(res) {
                var resp = { group_id: '' };
                if (res && res.group_id) {
                    resp.group_id = res.group_id;
                }
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 设置更新群组消息回调函数
     * 
     * var resp = {group_id:'', group_name:''}
     * */
    setRefreshIMGroupCallback: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.setReceiveRefreshIMGroupCallback(function(res) {
                var resp = { group_id: '', group_name: '' };
                if (res && res.group_id) {
                    resp.group_id = res.group_id;
                    resp.group_name = res.group_name;
                }
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },


    /**
     * 设置邮件消息推送回调函数
     *
     * var resp={unReadCnt:0}
     * */
    setInformMessageReceiveCallback1: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            //
            businessSDK6.setReceiveInformRecevieMessageCallback1(function(obj) {
                //返回值
                var resp = { unReadCnt: 0 }
                if (obj) {
                    resp.unReadCnt = obj.unReadedCount
                }
                callback(resp)
            })
        }
    },


    /**
     * 订阅消息会话预览
     * subscribeID:订阅ID
     *
     * isUnreaded: // 为false代表订阅全部
     * */
    subscribeMessageSessionPreview: function(subscribeId, isUnreaded) {
        //subscribeUserCommSessionPreview
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.subscribeUserCommSessionPreview(subscribeId, JSON.stringify(isUnreaded));
        }
    },

    /**
     * 取消订阅消息会话预览
     * subscribeId:订阅ID
     * */
    cancelSubscribeMessageSessionPreview: function(subscribeId, isUnreaded) {
        //cancelSubscribeUserCommSessionPreview
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.cancelSubscribeUserCommSessionPreview(subscribeId, isUnreaded);
        }
    },

    cancelSubscribePreview: function(isUnreaded) {
        if (isUnreaded) {
            //取消即时通讯框接收能力
            businessSDK6._receiveInformReceiveMessageCBOld = businessSDK6._receiveInformReceiveMessageCB
            businessSDK6._receiveInformReceiveMessageCB = null;

            //恢复邮件接收能力
            businessSDK6._receiveInformReceiveMessageCB1 = businessSDK6._receiveInformReceiveMessageCB1Old



            businessSDK6._receiveInformUserCommSessionPreviewCB = null;
        } else {
            //取消邮件接收能力
            businessSDK6._receiveInformReceiveMessageCB1Old = businessSDK6._receiveInformReceiveMessageCB1
            businessSDK6._receiveInformReceiveMessageCB1 = null;

            //恢复即使通讯接收能力
            businessSDK6._receiveInformReceiveMessageCB = businessSDK6._receiveInformReceiveMessageCBOld


            businessSDK6._receiveInformUserCommSessionPreviewCB1 = null;
        }
    },

    /**
     * 设置会话预览反馈
     * resp ={subscribeId:"",sessions:[{sessionId:"",users:[{userId:"",userName:"",index:0}....],
     * lastMessage:{messageId:"",senderId:"",sendTime:"",content:""isReaded:false/true},unReadedCount:10},{..}..]}
     * */
    setReceiveMessageSessionPreviewCallback: function(callback) {
        //informUserCommSessionPreview
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformUserCommSessionPreviewCallback(function(obj) {
                var resp = { subscribeId: "", sessions: [] }
                if (obj) {
                    resp.subscribeId = obj.subscribeID
                    obj.sessions && obj.sessions.forEach((item) => {
                        var it = { sessionId: "", users: [], lastMessage: {}, unReadedCount: 0 }
                        it.sessionId = item.sessionID
                        it.unReadedCount = item.unReadedCount
                        item.users && item.users.forEach((line) => {
                            var usr = { userId: "", userName: "", index: 0 }
                            usr.userId = line.userID
                            usr.userName = line.userName
                            usr.index = line.index
                            it.users.push(usr)
                        })

                        it.lastMessage.messageId = item.lastMessage[0].messageID
                        it.lastMessage.senderId = item.lastMessage[0].senderID
                        it.lastMessage.sendTime = item.lastMessage[0].sendTime
                        it.lastMessage.content = item.lastMessage[0].content
                        it.lastMessage.isReaded = item.lastMessage[0].isReaded || false

                        resp.sessions.push(it)
                    })
                }
                callback(resp);
            });
        }
    },

    /**
     * 设置会话预览反馈1,这个部分的反馈是用于邮件红点部分
     *
     * resp ={subscribeId:"",sessions:[{sessionId:"",users:[{userId:"",userName:"",index:0}....],
     * lastMessage:{messageId:"",senderId:"",sendTime:"",content:""isReaded:false/true},unReadedCount:10},{..}..]}
     * */
    setReceiveMessageSessionPreviewCallback1: function(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformUserCommSessionPreviewCallback1(function(obj) {
                var resp = { subscribeId: "", sessions: [] }
                if (obj) {
                    resp.subscribeId = obj.subscribeID
                    obj.sessions && obj.sessions.forEach((item) => {
                        var it = { sessionId: "", users: [], lastMessage: {}, unReadedCount: 0 }
                        it.sessionId = item.sessionID
                        it.unReadedCount = item.unReadedCount
                        item.users && item.users.forEach((line) => {
                            var usr = { userId: "", userName: "", index: 0 }
                            usr.userId = line.userID
                            usr.userName = line.userName
                            usr.index = line.index
                            it.users.push(usr)
                        })

                        it.lastMessage.messageId = item.lastMessage[0].messageID
                        it.lastMessage.senderId = item.lastMessage[0].senderID
                        it.lastMessage.sendTime = item.lastMessage[0].sendTime
                        it.lastMessage.content = item.lastMessage[0].content
                        it.lastMessage.isReaded = item.lastMessage[0].isReaded || false

                        resp.sessions.push(it)
                    })
                }
                callback(resp);
            });
        }
    },

    /**
     *  查询近期消息列表
     *  sessionId : 会话Id;
     *  count ： 查询条数
     *
     *   resp = [{sessionId: "",messageId: "",senderId: "",senderName:"",sendTime: "",content: "",isReaded: true}, {...}]
     *
     */
    queryNearMessagesList: function(sessionId, count, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryLastUserMessages(sessionId, count, function(obj) {
                var resp = []
                if (obj.responseCode == 1) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.sessionId = item.sessionID;
                        it.messageId = item.messageID;
                        it.senderId = item.senderID;
                        it.senderName = item.senderName;
                        it.sendTime = item.sendTime;
                        it.content = item.content;
                        it.isReaded = item.isReaded || false;
                        resp.push(it);
                    })
                }
                callback(resp);

            });
        }

    },

    /**
     * 查询离线消息
     */
    queryOfflineMessageList: function(callback) {
        var self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryOfflineMessage(this.userToken, 1, 1024, function(res) {
                var resp = [];
                if (res.ret == 0 && res.data.list) {
                    res.data.list.forEach(function(item) {
                        var it = { chat_type: 1, sessionId: "", group_name: "", from: "", fromName: "", to: "", toName: "", unReadedCount: 0, messages: [], users: [] };
                        it.chat_type = item.chat_type;
                        it.unReadedCount = item.msgcount;
                        item.msgcount && item.msg.forEach(ele => {
                            var message = {};
                            message.messageId = ele.messageId,
                                message.senderId = ele.from;
                            message.senderName = ele.fromName;
                            message.sendTime = ele.time;
                            message.msg_type = ele.msg_type;
                            message.content = ele.content;
                            it.messages.push(message);
                        });
                        if (item.chat_type == 1) {
                            var user = {};
                            user.userId = self.userID;
                            user.userName = self.userName;
                            it.users.push(user);
                            it.to = self.userID;
                            it.toName = self.userName;
                            it.from = item.from;
                            it.fromName = item.fromName;
                        } else if (item.chat_type == 2) {
                            it.sessionId = item.group_id;
                            it.group_name = item.group_name;
                            /*
                            let groupId = item.group_id;
                            // 根据群组id查询群组信息
                            dataSDK5.queryIMGroupInfo(self.userToken, groupId, function(obj) {
                                console.log(obj);
                                if (obj && obj.ret == 0) {
                                    if( obj.data.members && obj.data.members.length > 0 ){
                                        obj.data.members.forEach(item=>{
                                            var user = {};
                                            user.userId = item.userId;
                                            user.userName = item.memberName;
                                            user.memberType = item.memberType;
                                            // memberType 分组成员类型 0-群主 1-管理员 2-群成员
                                            it.users.push(user);
                                        });
                                    }
                                }
                            });
                            */
                        }
                        resp.push(it);
                    })
                }
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }

    },

    /**
     * 设置离线消息为已读
     */
    updateOfflineMessageRead: function(froms, groupIds, callback) {
        var self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.updateOfflineMessageRead(this.userToken, froms, groupIds, function(res) {
                callback(res);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     *  查询历史消息列表
     *
     *  messageId : 开始消息Id
     *  count : 消息条数
     *
     *  resp = [{sessionId: "",messageId: "",senderId: "",sendTime: "",content: "",isReaded: true}, {...}]
     */
    queryHistoryMessagesList: function(messageId, count, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            // let to = "";
            // let groupId = "";
            // let keyword = "";
            // let chatType = "";
            // let beginTime = "";
            // let endTime = "";
            // let page = "";
            // let limit = "";
            // dataSDK5.queryHistoryMessage(this.userToken, to, groupId, keyword, chatType, beginTime, endTime, page, limit, function(obj) {
            // var resp = [];
            // if( obj.ret == 0 && obj.data.list ){
            // resp = obj.data.list;
            // }
            // callback(resp);
            // })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryHistoryUserMessages(messageId, count, function(obj) {
                var resp = []
                if (obj.responseCode == 1) {
                    obj.data && obj.data.forEach(function(item) {
                        var it = {};
                        it.sessionId = item.sessionID;
                        it.messageId = item.messageID;
                        it.senderId = item.senderID;
                        it.sendTime = item.sendTime;
                        it.senderName = item.senderName;
                        it.content = item.content;
                        it.isReaded = item.isReaded || false;
                        resp.push(it);
                    })
                }
                callback(resp);
            });
        }
    },

    /**
     * 查询历史消息成员列表
     */
    queryHistoryMemberList: function(beginTime, endTime, callback) {
        var self = this;
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            dataSDK5.queryHistoryMember(this.userToken, beginTime, endTime, 1, 1024, function(res) {
                var resp = []
                if (res.ret == 0 && res.data.list) {
                    res.data.list.forEach(function(item) {
                        var it = { chat_type: 1, sessionId: "", group_name: "", from: "", fromName: "", to: "", toName: "", unReadedCount: 0, messages: [], users: [] };
                        it.chat_type = item.chat_type;
                        item.message.length > 0 && item.message.forEach(msg => {
                            it.messages.push({
                                msg_type: msg.msg_type,
                                messageId: msg.messageId,
                                senderId: msg.from,
                                senderName: msg.fromName,
                                sendTime: msg.time,
                                content: msg.content,
                                isReaded: msg.isReaded || false,
                            });
                        });
                        if (item.chat_type == 1) {
                            var user = {};
                            user.userId = item.to;
                            user.userName = item.toName;
                            it.users.push(user);
                            it.to = item.to;
                            it.toName = item.toName;
                            it.from = item.from;
                            it.fromName = item.fromName;
                        } else if (item.chat_type == 2) {
                            it.sessionId = item.group_id;
                            it.group_name = item.group_name;
                            /*
                            let groupId = item.group_id;
                            // 根据群组id查询群组信息
                            dataSDK5.queryIMGroupInfo(self.userToken, groupId, function(obj) {
                                console.log(obj);
                                if (obj && obj.ret == 0) {
                                    if( obj.data.members && obj.data.members.length > 0 ){
                                        obj.data.members.forEach(item=>{
                                            var user = {};
                                            user.userId = item.userId;
                                            user.userName = item.memberName;
                                            user.memberType = item.memberType;
                                            // memberType 分组成员类型 0-群主 1-管理员 2-群成员
                                            it.users.push(user);
                                        });
                                    }
                                }
                            });
                            */
                        }
                        resp.push(it);
                    })
                }
                callback(resp);
            })
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }

    },




    //********************************************************截图管理****************************************************
    /**
     * 获取截图列表
     *
     * resourceName:检索对象名称
     * beginTime:开始时间
     * endTime:结束时间
     *
     * var resp =[{fileId:"",fileName:"",url:"",pixelX:"",pixelY:""}]
     * 其中：url:是图片在服务器上面的请求路径路径,pixelX:X方向像素大小，pixelY:Y方向像素大小
     * */
    queryImagesList: function(resourceName, beginTime, endTime, callback) {

    },

    //----------------------------------------------------视频专向管理----------------------------------------------------/

    /**
     * 开启专向
     * @param {*} destId
     */
    startSpecial: function(destId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStartSpecial(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 停止专向
     * @param {} destId
     */
    stopSpecial: function(destId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopSpecial(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 停止所有专向
     */
    stopAllSpecial: function() {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishStopAllSpecial(this.userToken);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 接受专向
     * @param {} destId
     */
    acceptSpecial: function(destId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishAcceptSpecial(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    /**
     * 拒绝专向
     * @param {*} destId
     */
    refuseSpecial: function(destId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            businessSDK5.publishRefuseSpecial(this.userToken, destId);
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {

        }
    },

    //========================================GIS地图 start===================================================
    /**
     * 查询一条目录GIS信息
     *  { responseCode:0, data:{directoryID:"",directoryName:"",longitude:144.02919,latitude:30.58203}}
     */
    querySingleDirectoryGIS(directoryID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {} else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.querySingleDirectoryGIS(directoryID, obj => {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                    resp.data = obj.data;
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    /**
     * 查询所有目录GIS信息
     * { responseCode:0, data:[{directoryID:"",directoryName:"",longitude:144.02919,latitude:30.58203}},{...}]
     */
    queryDirectoryGISList(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {} else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryDirectoryGISList(obj => {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0
                    resp.data = obj.data;
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    //========================================GIS地图 end=====================================================
    //========================================告警业务 start===================================================
    queryHistoryAlarmMessage(obj, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            // let alarmEvents = [obj.alarmEvents];
            // let alarmLevels = [obj.alarmLevels];
            var beginIndex = this._convertToBeginIndex(obj.page, obj.pageSize)
            dataSDK6.queryHistoryAlarmMessage(obj.startTime, obj.endTime, obj.alarmEventsArr, obj.alarmLevelsArr, obj.filters, beginIndex, obj.pageSize, obj => {
                var resp = {};
                if (obj.responseCode == 1) {
                    resp.Ret = 0;
                    resp.totalCount = obj.data.totalCount;
                    resp.data = obj.data.alarmMessages;
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    // 告警信息
    // params:{locationId:"",locationX:"",locationY:"",locationName:"",alarmInfo:{deviceId:"",deviceName:"",alarmEvent:"",alarmLevel:"",alarmType:"",occurDatetime:"",text:""}
    setReceiveInformAlarmInfoCallback(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setReceiveInformAlarmInfoCallback(function(res) {
                var resp = {};
                resp = res;
                callback(resp);
            });
        }
    },
    //获取部门有未读告警状态设备  0613 dj
    queryResourceReaded(departmentID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.queryResourceReaded(departmentID, res => {
                callback(res)
            });
        }
    },
    //设置告警信息已读 0613 dj
    publishSetMessageReaded(alarmAsgId) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {
            
        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetMessageReaded(alarmAsgId);
        }
    },
    //========================================告警业务 end===================================================
    //========================================共享屏幕 start=================================================
    //获取状态
    //"status": 0-服务不在线，1-无摄像头，2-有摄像头且当前处于采集屏幕，3-有摄像头且当前处于采集摄像头
    getStatusOfShareScreen(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            if (softBusinessSDK6._isConnect) {
                softBusinessSDK6.getSoftStatus();
                softBusinessSDK6.setReceiveSoftStatusCallback((res) => {
                    callback(res);
                });
            } else {
                //返回失败
                var obj = { status: 0 };
                callback(obj)
            }
        }
    },
    //切换
    switchSourceOfShareScreen(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            softBusinessSDK6.switchSource();
            softBusinessSDK6.setReceiveSwitchSourceCallback((res) => {
                callback(res);
            });
        }
    },
    //========================================共享屏幕 end===================================================
    //========================================视频会议 start=================================================
    // 主席,成员闭音
    publishMemberAudioAbility(sceneID, memberIDs, audioAbility) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberAudioAbility(sceneID, JSON.stringify(memberIDs), audioAbility);
        }
    },
    // 主席,成员闭麦
    publishMemberMicrophone(sceneID, memberIDs, microphoneAbility) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberMicrophone(sceneID, JSON.stringify(memberIDs), microphoneAbility);
        }
    },
    // 主席,成员关闭视频
    publishMemberVideoAbility(sceneID, memberIDs, videoAbility) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberVideoAbility(sceneID, JSON.stringify(memberIDs), videoAbility);
        }
    },
    // ID加入会议
    publishMemberJoinMeetingBySceneID(sceneID, memberID, microphoneAbility) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberJoinMeetingBySceneID(sceneID, JSON.stringify(memberIDs), videoAbility);
        }
    },
    // 指定主席
    publishSetChairmanRole(sceneID, memberID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishSetChairmanRole(sceneID, memberID);
        }
    },
    // 共享屏幕
    publishShareScreen(sceneID, isShare) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishShareScreen(sceneID, isShare);
        }
    },
    // 主席退出会议
    publishChairmanQuitConference(sceneID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishChairmanQuitConference(sceneID);
        }
    },
    // 成员通过会议ID加入会议
    publishMemberJoinConferenceOfID(sceneID, audioAbility, videoAbility, microphoneAbility) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishMemberJoinConferenceOfID(sceneID, audioAbility, videoAbility, microphoneAbility);
        }
    },
    // 主席-会议讨论
    publishDiscussConference(sceneID, sceneName, description, isMediaProcessing, operatorName, needPassword, password, mediaType, startType, arrangeTime, microphoneAbility, members, arrangeLength) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishDiscussConference(sceneID, sceneName, description, isMediaProcessing, this.userName, needPassword, password, mediaType, startType, arrangeTime, microphoneAbility, members, arrangeLength);
        }
    },
    // 我的预约会议
    getArrangeConferenceList(beginIndex, count, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getArrangeConferenceList(beginIndex, count, this.userID, res => {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0;
                    resp.data = res.data.list;
                    resp.total = res.data.totalCount;
                } else {
                    resp.Ret = 1
                }
                callback(resp)
            });
        }
    },
    // 我的预约会议详情
    getArrangeConferenceDetail(sceneID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.getArrangeConferenceDetail(sceneID, res => {
                let resp;
                if (res.responseCode == 1) {
                    resp = {
                        Ret: 0,
                        sceneID:  res.data.sceneID, 
                        sceneName: res.data.sceneName,
                        description: res.data.description,
                        schemeID: res.data.schemeID,
                        pwd: res.data.pwd,
                        mediaType: res.data.mediaType,
                        microphoneAbility: res.data.microphoneAbility, 
                        arrangeTime: res.data.arrangeTime,
                        creator: res.data.creator,
                        creatorName: res.data.creatorName,
                        createTime: res.data.createTime,
                        arrangeLength: res.data.arrangeLength,
                    }
                } else {
                    resp = {
                        Ret: 1
                    }
                }
                callback(resp)
            });
        }
    },
    // ID加入会议（ID验证）
    checkingConferenceId(sceneID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.checkingConferenceId(sceneID, res => {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0;
                    resp.desc = res.data.responseDescribe;
                    resp.needPassword = res.data.needPassword;
                } else {
                    resp.Ret = 1;
                    resp.desc = res.data.responseDescribe;
                }
                callback(resp)
            });
        }
    },
    // ID加入会议（密码验证）
    checkingConferencePassword(sceneID, password, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.checkingConferencePassword(sceneID, password, res => {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                    resp.desc = res.data.responseDescribe;
                }
                callback(resp)
            });
        }
    },
    // 取消预约会议
    cancelArrangeConference(sceneID, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            dataSDK6.cancelArrangeConference(sceneID, res => {
                let resp = {}
                if (res.responseCode == 1) {
                    resp.Ret = 0;
                } else {
                    resp.Ret = 1;
                }
                callback(resp)
            });
        }
    },
    // 重开历史讨论会议
    publishRestartHistoryDiscussConference(sceneID) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishRestartHistoryDiscussConference(sceneID);
        }
    },
    //========================================视频会议 end=================================================
    setInformInitMediaForBindingEncoderCallback(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setInformInitMediaForBindingEncoderCallback(obj => {
                callback(obj);
            });
        }
    },
    //发送电子白板通知
    publishWhiteBoard(sceneID,userID, isShow) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.publishWhiteBoard(sceneID,userID, isShow);
        }
    },
    // 清除所有业务
    setInformClearAllCallback(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setInformClearAllCallback(obj => {
                if (this.config.pluginVersion == 2) {
                    playerSDKNew.stopPlayAll();
                } else {
                }
            });
        }
    },
    
    // 通知刷新讨论会议（拼接）分屏角标  1118 云调度 修改
    setInformRefreshScreenNameCallBack(callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            businessSDK6.setInformRefreshScreenNameCallBack(obj => {
                if (this.config.pluginVersion == 2) {
                    let screenMemberName = obj.screenMemberName && JSON.parse(obj.screenMemberName)
                    if (obj.splitType && screenMemberName.length) {
                        playerSDKNew.setOSDByJoin(obj.splitType, screenMemberName);
                    }
                } else {
                }
            });
        }
    },

    //======================== 11.24 视频巡查 新增 sdk =======================================================
    //------------------  查询列表  ------------------
    queryStrategyList: function(strategyType, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.queryStrategyList(this.userID,strategyType, function(obj) {
                var resp = { totalCnt: 0, rows: [] };
                if (obj && obj.data) {
                    obj.data && obj.data.forEach(function(item) {
                        resp.rows.push(item);
                    })
                }
                callback(resp);
            });
        }
    },
    //------------------  根据id查询详情    ------------------
    queryStrategyListById:function(strategyId, callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.queryStrategyListById(strategyId, function(obj) {
                var resp = { };
                if (obj && obj.data) {
                    resp = obj.data
                }
                callback(resp);
            });
        }
    },
    //------------------  新增、另存为    ---------------------
    addPatrolStrategy:function(strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, groupDeviceDtoList,callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.addPatrolStrategy(this.userID,strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, groupDeviceDtoList, function(obj) {
                if (obj) {
                    callback(obj);
                }
            })
        }
    },
    //------------------  修改   ----------------------------
    updatePatrolStrategy:function(strategyId,strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, departmentDeviceDtoList,callback) {
        if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.updatePatrolStrategy(this.userID,strategyId,strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, departmentDeviceDtoList, function(obj) {
                if (obj) {
                    callback(obj);
                }
            })
        }
    },
    //------------------  删除   ----------------------------
    deleteStrategyById:function(strategyId, callback){
        if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.deleteStrategyById(strategyId, function(obj) {
                if (obj) {
                    callback(obj);
                }
            });
        }
    },


    // 通过ip 拿到点播的设备信息
    getDeviceDataCallBack(ip,callback){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.getDeviceDataCallBack(ip, obj => {
                callback(obj);
            });
        }
    },

    // 通过轮询id 获取轮询信息 
    // queryStrategyListById(strategeId, callback){
    //     if (this.config.version === this.enumSDKVersion.SDKVersion5) {

    //     } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
    //         strategeSDK6.queryStrategyListById( strategeId , obj => {
    //             callback(obj);
    //         });
    //     }
    // }

    // 开启小鱼易联的会议
    newOpenMeeting(data, callback){
        if (this.config.version === this.enumSDKVersion.SDKVersion5) {

        } else if (this.config.version === this.enumSDKVersion.SDKVersion6) {
            strategeSDK6.newOpenMeeting(data ,obj => {
                callback(obj);
            });
        }
    },
    // ======================  会议 模板列表 新加SDK   1209   增删改查 ==========================================================
    // =================================   查询会议 模板 列表  =============================================
    getConferenceTemplateList(startTime,endTime,templateName,pageIndex,pageSize,callback){
        strategeSDK6.getConferenceTemplateList(this.userID,startTime,endTime,templateName,pageIndex,pageSize,obj => {
            if(obj.code == 1 && obj.data){
                callback(obj);
            }
        });
    },
    // =================================   添加 会议 模板  =============================================
    addConferenceTemplate(templateName,attendance,describe,isPreMain,isDefaultLock,isNeedPwd,isAutoMute,isDefaultRecord,password,userDtoList,callback){
        strategeSDK6.addConferenceTemplate(
            this.userID,
            this.userName,
            templateName,
            attendance,
            describe,
            isPreMain,
            isDefaultLock,
            isNeedPwd,
            isAutoMute,
            isDefaultRecord,
            password,
            userDtoList,
            obj => { 
                if(obj){
                    callback(obj);
                }
            }
        )
    },
    // =================================   修改 会议 模板  =============================================
    updateConferenceTemplate(templateId,templateName,attendance,describe,isPreMain,isDefaultLock,isNeedPwd,isAutoMute,isDefaultRecord,password,userDtoList,callback){
        strategeSDK6.updateConferenceTemplate(
            this.userID,
            this.userName,
            templateId,
            templateName,
            attendance,
            describe,
            isPreMain,
            isDefaultLock,
            isNeedPwd,
            isAutoMute,
            isDefaultRecord,
            password,
            userDtoList,
            obj => { 
                if(obj){
                    callback(obj);
                }
            }
        )
    },
    // =================================   删除 会议 模板  =============================================
    deleteConferenceTemplate(templateId,callback){
        strategeSDK6.deleteConferenceTemplate(templateId,obj => {
            if(obj){
                callback(obj);
            }
        })
    },
    // ======================  我的会议 新加SDK   1210   ==========================================================
    
    // ===============   我的会议 列表 =============================================
    getMyConferenceList(pageIndex,pageSize,conferenceName,conferenceType,callback){
        strategeSDK6.getMyConferenceList(pageIndex,pageSize,conferenceName,conferenceType,obj => {
            if(obj.code == 1 && obj.data){
                callback(obj);
            }
        });
    },

    // ======================  免插登录 新加SDK   1214   ==========================================================
    // 免插登录
    noPluginLogin(account,callback){
        if(!this.config.noPluginServerURL){ // 未配置免插服务，跳过免插登录
            if(callback)callback();
            return
        }
        const noPluginLoginFlag = xtxk.cache.get('noPluginLoginFlag')
        if(!noPluginLoginFlag){
            const userID =this.userLoginID; 
            let that = this;
            strategeSDK6.noPluginLogin( userID , obj => {
                const data = obj.data
                if(data){ 
                    that.config.playerType = Number(data.status)
                    // 媒体服务信息
                    // decodeType --- 解码类型（1-CPU；2-英特尔-QSV；3-英伟达-CUDA）
                    that.config.mediaServerIp = data.ip
                    that.config.mediaServerPort =  data.port
                    that.config.decodeType = data.decodeType
                    that.config.decodeResolution = data.decodeResolution
                    xtxk.cache.set('mediaServerInfo',{
                        playerType: that.config.playerType,
                        ip: that.config.mediaServerIp,
                        port: that.config.mediaServerPort,
                        decodeType: that.config.decodeType,
                        decodeResolution: that.config.decodeResolution
                    })
                    console.log(obj.msg);
                }
                xtxk.cache.set('noPluginLoginFlag',true)
                console.log(`获取媒体服务器信息:初始化${xtxk.cache.get('noPluginLoginFlag')}`)
                console.log(`获取媒体服务器信息:播放器版本${that.config.playerType}`)
                console.log(`获取媒体服务器信息:${that.config.mediaServerIp}:${that.config.mediaServerPort}`)
                if(callback)callback();
            },(err)=>{
                console.log("无法访问免插件服务,默认启用插件服务!");
                if(callback)callback();
            });
        }else{
            const mediaServerInfo = xtxk.cache.get('mediaServerInfo')
            if(mediaServerInfo){
                this.config.playerType = mediaServerInfo.playerType
                this.config.mediaServerIp = mediaServerInfo.ip
                this.config.mediaServerPort =  mediaServerInfo.port
                this.config.decodeType = mediaServerInfo.decodeType
                this.config.decodeResolution = mediaServerInfo.decodeResolution
            }
            if(callback)callback();
        }
    },

    // 免插退出
    noPluginLoginOut(account,callback){
        if(!this.config.noPluginServerURL){ // 未配置免插服务，跳过免插登录
            if(callback)callback();
            return
        }
        const userID =this.userLoginID;
        strategeSDK6.noPluginLoginOut( userID , obj => {
            xtxk.cache.set('noPluginLoginFlag',false);
            xtxk.cache.remove('mediaServerInfo');
            console.log('用户退出免插登录!')
            if(callback)callback();
        });
    },
    // ======================  视频诊断 新加SDK   1216   ==========================================================
    // 视频诊断列表
    getDiagnoseList(data, callback){
        strategeSDK6.getDiagnoseList( data , obj => {
            callback(obj);
        });
    },
    //全屏 回调
    fullAllScreenCallback(callback){
        playerSDKNew.fullAllScreenCallback((isFull,isAllFull) => {
            callback(isFull,isAllFull)
        })
    },
    // 根据 HHID 查询用户信息（与下面 userLogin 返回一样）
    queryUserInfo(data, callback){
        strategeSDK6.queryUserInfo( data , obj => {
            callback(obj);
        });
    },
    // 统一认证登录
    userLogin(data, callback){
        strategeSDK6.userLogin( data , obj => {
            callback(obj);
        });
    }
};

export default apiSDK;