export default {
    enumResourceStatus: {
        Online			:1,// 在线
        Offline			:0,// 离线
    },
    enumBussStatus: {
        Playing		: 1,//播放中
        Calling		: 2,//呼叫中
        Meeting		: 3,//会议中
        Speaking	: 4,//对讲中
        Transmiting	: 5,//转发中
        Specialtying : 6,//专项中

        PlayWaiting		: 11,//播放等待中
        CallWaiting		: 12,//呼叫等待中
        MeetWaiting		: 13,//会议等待中
        SpeakWaiting    : 14,//对讲等待中
        TransmitWaiting	: 15,//转发等待中
        SpecialtyWaiting : 16
    },
    enumResType: {
        PERSON	: 0, //人员
        DEVICE	: 1, //设备
        File    : 2, //文件频道
        Record  : 3, //录像
        PlayRoom: 4, //放映厅
        Virtual : 5, //虚拟终端
        Channel : 6, //nvr通道
        NVR:7//nvr wxx 2020.12.2
    },
    //业务分组类型
    enumGroupType:{
        GroupPlay       : 1, //监看分组
        GroupCall       : 2, //呼叫分组
        GroupMeeting    : 3, //视频会议
        LocalLoopPlay   : 4, //监看分组(本地)
        DecodLoopPlay   : 5, //监看分组(解码)
        VideoCommand    : 6  //视频指挥
    },
    //显示方案类型
    enumSchemeType:{
        GroupMeeting    : 3, //视频会议
        LocalLoopPlay   : 4, //监看轮循（本地）
        DecodLoopPlay   : 5, //监看轮循（解码）
        VideoCommand    : 6  //视频指挥
    },
    enumPersonType:{
      H323Meeting         : 4, //H323视频会议网关
      PSTN                : 17, //PSTN程控
      IPVoiceTerminal     : 15  //IP话音终端
    },
    enumDeviceType: {
        Encoder	            : 11, //编码器
        Decoder	            : 12, //解码器
        HWMeetingTerminal   : 13, //华为一体机
    },
    //成员状态，用于会议，轮循点播
    enumMerberStatus: {
        offline         : "offline",//0,//离线
        online          : "online",//1,//在线  （基本没用）
        bebusy          : "bebusy",//2,//忙碌   （目前没用）
        onlineJoin      : "onlineInMeeting",//3,//在线（已入会）
        onlineNotJoin   : "onlineOutMeeting",//4,//在线（未入会）
        breakdown       : "breakdown",//5.//故障
        playing         : "playing",//点播中
    },
    enumRoleType: {
        chairman        : "chairman",//0,//主席
        member          : "member",//1,//成员
        speak           : "speak",//2,//发言人
    },
    //媒体状态
    enumMediaService: {
        Unregister        : "unregister",
        Registering       : "registering",
        Success           : "success",
    },
    //分屏类型
    enumSplitType: {
        OnlyOne         : "OnlyOne",//1分屏
        OneInOne        : "OneInOne",//画中画
        One_Two         : "One_Two",//1+2分屏
        OnlyFour        : "OnlyFour",//4分屏
        Two_Three       : "Two_Three",//2+3分屏
        One_Five        : "One_Five",//1+5分屏
        One_Seven       : "One_Seven",//1+7分屏
        OnlyNine        : "OnlyNine",//9分屏
        OneX_One        : "OneX_One",//2分屏左边宽
        One_OneX        : "One_OneX",//2分屏右边宽
        OnlySixteen     : "OnlySixteen",//16分屏
        OnlySix         : "OnlySix",//6分屏
        One_Six         : "One_Six",//1+6分屏
        OnlyTwelve      : "OnlyTwelve",//12分屏
        One_Eleven      : "One_Eleven",//1+11分屏
        One_Nine        : "One_Nine",//1+9分屏
        OnlyTweentyFour : "OnlyTweentyFour",//24分屏
        OnlyTweentyFive : "OnlyTweentyFive",//25分屏
        OnlyThirtySix   : "OnlyThirtySix", //36分屏
        Two_Eight       : "Two_Eight", //2+8分屏
        OnlyTwo         : "OnlyTwo" //2分屏
    },
    //屏幕显示类型
    enumScreenType: {
        Chairman        :  "Chairman",//主席屏
        Speak           :  "Speak",//发言屏
        Local           :  "Local",//本地屏
        FixResource     :  "FixResource",//固定资源屏
        NormalLoop      :  "NormalLoop",//轮循屏
        UpLoop          :  "UpLoop",//上级轮循屏
        DownLoop        :  "DownLoop",//下级轮循屏
        UpAndDownLoop        :  "UpAndDownLoop",//上下级轮循屏
        LocalBusiness        :  "LocalBusiness",//本地业务屏
    },
    //字号枚举: 10，12，14，16，18，24，28，32，36px----分别对应1-9号字
    enumFontSize: {
        One     : 10,
        Two     : 12,
        Three   : 14,
        Four    : 16,
        Five    : 18,
        Six     : 24,
        Seven   : 28,
        Eight   : 32,
        Nine    : 36,
    },
    enumSubscribeType: {
        //主页面
        main : {
            //人员树
            subscribeOrganizationUser       : "MainOrganizationUser",
            subscribeUsersStatus       		: "MainUsersStatus",
            subscribeUsersStatusByKey		: "MainUsersStatusByKey",
            subscribeUsersStatusByStatus	: "MainUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "MainOrganizationDevice",
            subscribeDevicesStatus			: "MainDevicesStatus",
            subscribeDevicesStatusByKey		: "MainDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "MainDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "MainCommonResources",
            subscribeCommonResourcesByKey			: "MainCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "MainCommonResourcesByStatus",
        },
        //业务分组
        group : {
            //人员树
            subscribeOrganizationUser       : "GroupOrganizationUser",
            subscribeUsersStatus       		: "GroupUsersStatus",
            subscribeUsersStatusByKey		: "GroupUsersStatusByKey",
            subscribeUsersStatusByStatus	: "GroupUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "GroupOrganizationDevice",
            subscribeDevicesStatus			: "GroupDevicesStatus",
            subscribeDevicesStatusByKey		: "GroupDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "GroupDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "GroupCommonResources",
            subscribeCommonResourcesByKey			: "GroupCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "GroupCommonResourcesByStatus",
        },
        //视频转发
        transmit : {
            //人员树
            subscribeOrganizationUser       : "TransmitOrganizationUser",
            subscribeUsersStatus       		: "TransmitUsersStatus",
            subscribeUsersStatusByKey		: "TransmitUsersStatusByKey",
            subscribeUsersStatusByStatus	: "TransmitUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "TransmitOrganizationDevice",
            subscribeDevicesStatus			: "TransmitDevicesStatus",
            subscribeDevicesStatusByKey		: "TransmitDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "TransmitDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "TransmitCommonResources",
            subscribeCommonResourcesByKey			: "TransmitCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "TransmitCommonResourcesByStatus",
            //业务树
            subscribeBusinessStatus			: "TransmitBusinessStatus",
        },
        //视频会议-发起
        meeting : {
            //人员树
            subscribeOrganizationUser       : "MeetingOrganizationUser",
            subscribeUsersStatus       		: "MeetingUsersStatus",
            subscribeUsersStatusByKey		: "MeetingUsersStatusByKey",
            subscribeUsersStatusByStatus	: "MeetingUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "MeetingOrganizationDevice",
            subscribeDevicesStatus			: "MeetingDevicesStatus",
            subscribeDevicesStatusByKey		: "MeetingDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "MeetingDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "MeetingCommonResources",
            subscribeCommonResourcesByKey			: "MeetingCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "MeetingCommonResourcesByStatus",
        },
        //视频会议-主席添加成员
        meetingAddMember : {
            //人员树
            subscribeOrganizationUser       : "MAddMemberOrganizationUser",
            subscribeUsersStatus       		: "MAddMemberUsersStatus",
            subscribeUsersStatusByKey		: "MAddMemberUsersStatusByKey",
            subscribeUsersStatusByStatus	: "MAddMemberUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "MAddMemberOrganizationDevice",
            subscribeDevicesStatus			: "MAddMemberDevicesStatus",
            subscribeDevicesStatusByKey		: "MAddMemberDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "MAddMemberDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "MAddMemberCommonResources",
            subscribeCommonResourcesByKey			: "MAddMemberCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "MAddMemberCommonResourcesByStatus",
        },
        //视频指挥-主席添加成员
        commandAddMember : {
            //人员树
            subscribeOrganizationUser       : "CAddMemberOrganizationUser",
            subscribeUsersStatus       		: "CAddMemberUsersStatus",
            subscribeUsersStatusByKey		: "CAddMemberUsersStatusByKey",
            subscribeUsersStatusByStatus	: "CAddMemberUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "CAddMemberOrganizationDevice",
            subscribeDevicesStatus			: "CAddMemberDevicesStatus",
            subscribeDevicesStatusByKey		: "CAddMemberDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "CAddMemberDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "CAddMemberCommonResources",
            subscribeCommonResourcesByKey			: "CAddMemberCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "CAddMemberCommonResourcesByStatus",
        },
        //计划录像
        planVideo : {
            //人员树
            subscribeOrganizationUser       : "PlanVideoOrganizationUser",
            subscribeUsersStatus       		: "PlanVideoUsersStatus",
            subscribeUsersStatusByKey		: "PlanVideoUsersStatusByKey",
            subscribeUsersStatusByStatus	: "PlanVideoUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "PlanVideoOrganizationDevice",
            subscribeDevicesStatus			: "PlanVideoDevicesStatus",
            subscribeDevicesStatusByKey		: "PlanVideoDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "PlanVideoDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "PlanVideoCommonResources",
            subscribeCommonResourcesByKey			: "PlanVideoCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "PlanVideoCommonResourcesByStatus",
        },
        // 即时通讯
        sendRequest: {
            //人员树
            subscribeOrganizationUser       : "SendRequestOrganizationUser",
            subscribeUsersStatus       		: "SendRequestUsersStatus",
            subscribeUsersStatusByKey		: "SendRequestUsersStatusByKey",
            subscribeUsersStatusByStatus	: "SendRequestUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "SendRequestOrganizationDevice",
            subscribeDevicesStatus			: "SendRequestDevicesStatus",
            subscribeDevicesStatusByKey		: "SendRequestDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "SendRequestDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "SendRequestCommonResources",
            subscribeCommonResourcesByKey			: "SendRequestCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "SendRequestCommonResourcesByStatus",
        },
        // 截图管理
        screenShot : {
            //人员树
            subscribeOrganizationUser       : "ScreenShotOrganizationUser",
            subscribeUsersStatus       		: "ScreenShotUsersStatus",
            subscribeUsersStatusByKey		: "ScreenShotUsersStatusByKey",
            subscribeUsersStatusByStatus	: "ScreenShotUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "ScreenShotOrganizationDevice",
            subscribeDevicesStatus			: "ScreenShotDevicesStatus",
            subscribeDevicesStatusByKey		: "ScreenShotDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "ScreenShotDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "ScreenShotCommonResources",
            subscribeCommonResourcesByKey			: "ScreenShotCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "ScreenShotCommonResourcesByStatus",
        },
        // OSD管理
        osdMng : {
            //人员树
            subscribeOrganizationUser       : "OsdMngOrganizationUser",
            subscribeUsersStatus       		: "OsdMngUsersStatus",
            subscribeUsersStatusByKey		: "OsdMngUsersStatusByKey",
            subscribeUsersStatusByStatus	: "OsdMngUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "OsdMngOrganizationDevice",
            subscribeDevicesStatus			: "OsdMngDevicesStatus",
            subscribeDevicesStatusByKey		: "OsdMngDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "OsdMngDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "OsdMngCommonResources",
            subscribeCommonResourcesByKey			: "OsdMngCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "OsdMngCommonResourcesByStatus",
        },
        // 广播/会场通知
        notification : {
            //人员树
            subscribeOrganizationUser       : "NotificationOrganizationUser",
            subscribeUsersStatus       		: "NotificationUsersStatus",
            subscribeUsersStatusByKey		: "NotificationUsersStatusByKey",
            subscribeUsersStatusByStatus	: "NotificationUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice		: "NotificationOrganizationDevice",
            subscribeDevicesStatus			: "NotificationDevicesStatus",
            subscribeDevicesStatusByKey		: "NotificationDevicesStatusByKey",
            subscribeDevicesStatusByStatus 	: "NotificationDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources		: "NotificationCommonResources",
            subscribeCommonResourcesByKey			: "NotificationCommonResourcesByKey",
            subscribeCommonResourcesByStatus		: "NotificationCommonResourcesByStatus",
        },
        // 解码器状态
        decoder: {
            subscribeMainDecodersStatus      : "MainDecodersStatus",
        },
        //会话消息
        sessionMsg: {
            subscribeSessionMsgUnread   : "SessionMsgUnread",
            subscribeSessionMsgRead     : "SessionMsgRead"
        },
        //map页面
        map : {
            //人员树
            subscribeOrganizationUser       : "MapOrganizationUser",
            subscribeUsersStatus            : "MapUsersStatus",
            subscribeUsersStatusByKey       : "MapUsersStatusByKey",
            subscribeUsersStatusByStatus    : "MapUsersStatusByStatus",
            //设备树
            subscribeOrganizationDevice     : "MapOrganizationDevice",
            subscribeDevicesStatus          : "MapDevicesStatus",
            subscribeDevicesStatusByKey     : "MapDevicesStatusByKey",
            subscribeDevicesStatusByStatus  : "MapDevicesStatusByStatus",
            //常用资源树
            subscribeCommonResources        : "MapCommonResources",
            subscribeCommonResourcesByKey           : "MapCommonResourcesByKey",
            subscribeCommonResourcesByStatus        : "MapCommonResourcesByStatus",
        },
    },
}
