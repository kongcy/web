import WebglScreen from './webglScreen'
import JsmpegScreen from './jsmepgScreen'
import videoJs from '../video/videoSDK'
import hlsVideoJs from '../hlsVideo/hlsVideoSDK'
import {UUID} from '../utils/commfun'
// 静态图片引用
// 屏幕选中图片
import img_selected from '../img/img_selected.png'
// 全屏图片
import img_fullscreen from '../img/img_fullscreen.png'
// 全屏图片hover
import img_fullscreen_hover from '../img/img_fullscreen_hover.png'
// 播放图片
import img_play from '../img/img_play.png'
// 播放图片hover
import img_play_hover from '../img/img_play_hover.png'
// 恢复屏幕图片
import img_restorescreen from '../img/img_restorescreen.png'
// 恢复屏幕图片hover
import img_restorescreen_hover from '../img/img_restorescreen_hover.png'
// 停止图片
import img_stop from '../img/img_stop.png'
// 停止图片hover
import img_stop_hover from '../img/img_stop_hover.png'
// 暂停图片
import img_suspend from '../img/img_suspend.png'
// 暂停图片hover
import img_suspend_hover from '../img/img_suspend_hover.png'
// 关闭声音
import img_soundoff from '../img/img_soundoff.png'
// 关闭声音hover
import img_soundoff_hover from '../img/img_soundoff_hover.png'
// 开启声音
import img_soundon from '../img/img_soundon.png'
import img_soundon_hover from '../img/img_soundon_hover.png'
// 云台控制图片
import img_ytcontrol from '../img/img_ytcontrol.png'
import img_ytcontrol_hover from '../img/img_ytcontrol_hover.png'
// 背景操作
import bg_operate from '../img/bg_operate.png'
// 人员图片
import img_person from '../img/img_person.png'
// 设备图片
import img_device from '../img/img_device.png'
// 开启录像图片
import img_start_record from '../img/img_record.png'
import img_start_record_hover from '../img/img_record_hover.png'
// 停止录像图片
import img_stop_record from '../img/img_record_active.png'
// 画质调节
import img_picture_quality from '../img/picture_quality.png'
import img_picture_quality_hover from '../img/picture_quality_hover.png'
// 快退
import img_slow_record from '../img/back.png'
import img_slow_record_hover from '../img/back_hover.png'
// 快进
import img_fast_record from '../img/fast.png'
import img_fast_record_hover from '../img/fast_hover.png'
//
import img_frame_record from '../img/step_start.png'
import img_frame_record_hover from '../img/step_start_hover.png'
// 恢复
import img_renew_record from '../img/restart.png'
import img_renew_record_hover from '../img/restart_hover.png'
// 抓拍
import img_capture from '../img/capture.png'
import img_capture_hover from '../img/capture_hover.png'

// 开启会议
import img_openMeeting from '../img/openMeeting.png'
import img_openMeeting_hover from '../img/openMeeting_hover.png'

// css引用
import '../css/webglPlayer.css'

// 控制条滑块：声音条，时间进度条
import Slider from './slider'
// 画质调节
import PictureQualitySlider from './pictureQualitySlider'

/*分屏类型*/
var SPLIT_TYPE_ONE             = 1; 	// 1 分屏
var SPLIT_TYPE_TWO             = 12; 	// 2 分屏
var SPLIT_TYPE_FOUR            = 4; 	// 4 分屏
var SPLIT_TYPE_SIX             = 100; 	// 6 分屏
var SPLIT_TYPE_NINE            = 9; 	// 9 分屏
var SPLIT_TYPE_TWELVE          = 15;	// 12 分屏
var SPLIT_TYPE_SIXTEEN         = 16;	// 16 分屏
var SPLIT_TYPE_TWENTFOUR       = 24;	// 24 分屏
var SPLIT_TYPE_TWENTFIVE       = 25;	// 25 分屏
var SPLIT_TYPE_THIRTYTWO       = 32;	// 32 分屏
var SPLIT_TYPE_THIRTYSIX       = 36;	// 36 分屏
var SPLIT_TYPE_ONE_PLUS_FIVE   = 6; 	// 1+5 分屏
var SPLIT_TYPE_ONE_PLUS_SEVEN  = 8; 	// 1+7 分屏
var SPLIT_TYPE_ONE_PLUS_NINE   = 102;	// 1+9 分屏
var SPLIT_TYPE_ONE_PLUS_ELEVEN = 103;	// 1+11 分屏
var SPLIT_TYPE_TWO_PLUS_EIGHT  = 110;	// 2+8 分屏
var SPLIT_TYPE_PIC_IN_PIC 	   = 2;		// 画中画

/*分屏显示业务*/
var BUSINESS_NONE        = 0;
var BUSINESS_DEVICE_PLAY = 1;
var BUSINESS_PERSON_PLAY = 2;
var BUSINESS_SPEAK       = 3;
var BUSINESS_CALL        = 4;

function Screen(){
	this.index       = -1;              //分屏索引
	this.left        = -1;              //x坐标
	this.top         = -1;              //y坐标
	this.width       = -1;              //宽度
	this.height      = -1;              //高度
	this.isDisplay   = false;           //是否显示
	this.isHover     = false;           //是否鼠标滑入
	this.isSelected  = false;           //是否选中
	this.resID       = "";              //资源ID
	this.resName     = "";              //资源名称
	this.department  = "";              //所属部门
	this.center      = "";              //所属中心
	this.business    = BUSINESS_NONE;   //显示设备点播
	this.isSuspended = false;           //是否已暂停
	this.soundOff    = true;            //声音是否已关闭
    this.isFull      = false;           //是否全屏显示
	this.webglCanvas = null;            //canvas
	this.osdArray  	 = [];           	// osd
    this.osdTimerArray  = [];           // osd计时器
	this.volume      = null;            // 声音条
    this.volumeValue = 50;              // 声音值
	this.isRecording = false;			//是否录像中
	this.screenType	 = 1;				//操作栏样式：0-不显示，1-点播，2-回放
	this.speed		 = 1;				//播放速度
	this.playTime	 = {
		startTime	: 0,				//回放起始时间
		endTime		: 0,				//回放结束时间
		curTime		: 0,				//指定的时间，如拖动或点击进度条
	};
	this.pictureQuality      = null;    // 画质调节
	this.isRTMP              = false;   // 是否为rtmp
	this.rtmpURL			 = '';
	this.video               = null;    // video
	this.urlType             = null;    // 视频资源类型，flv，hls
	
}

var decoderPlayer = {
	allFull                        :false,//全部插件全屏2020.12.15
	_screens                       : null,
	_containerDiv                  : null,
	_maxScreenCount                : 9,//36,
    _defaultSplitType              : SPLIT_TYPE_FOUR,
	_currentSplitType              : null,
	_currentSplitCount			   : 0,
	_containerWidth                : 0,
	_containerHeight               : 0,
	_space                         : 0,
	_childScreenBorder             : 1,
	_refreshDataType			   : 1, // 1,webgl方式   2，2d方式
	_playerType				       : 0, // 播放器类型 半免0/全免1
	_mediaServer 				   : null, // 流媒体服务
	//操作回调
	_suspendOperateCB              : null,
	_cancelSuspendOperateCB        : null,
	_stopOperateCB                 : null,
	_soundOnOperateCB              : null,
	_soundOffOperateCB             : null,
	_ytControlOperateCB            : null,
	_fullScreenOperateCB           : null,
    //_cancelFullScreenOperateCB     : null,
	_afterSelectedScreenCB         : null,
	_afterSplitScreenCB			   : null,
	_fullScreenChangedCB		   : null,
	_playerBtnEventCB			   : null,//操作栏按钮的统一回调
	_afterVolumeChangedCB		   : null,//声音值变化的回调
	_afterPicQualityChangedCB	   : null,//画质调节变化的回调
	//1119云调度拖动点播
	_afterSelectedScreenDropCB     : null, //拖拽回调
	_containerClassName            : "playerContainer",

    _containerClassName            : "playerContainer",
    /*子分屏ID前缀*/
    _childNormalIdName             : "playerChild_",
    _childCanvasIdName             : "canvasChild_",
	_childRtmpIdName               : "videoChild_",
    /*子分屏样式（正常）*/
	_childNormalClassName          : "normalChild",
	_childHoverNormalClassName     : "hoverNormalChild",
	/*子分屏样式（点播设备）*/
	_childPlayDeviceClassName      : "playDeviceChild",
	_childHoverPlayDeviceClassName : "hoverPlayDeviceChild",
	/*子分屏样式（点播人员）*/
	_childPlayPersonClassName      : "playPersonChild",
	_childHoverPlayPersonClassName : "hoverPersonDeviceChild",
	/*子分屏样式（对讲）*/
	_childSpeakClassName           : "speakChild",
	_childHoverSpeakClassName      : "hoverSpeakChild",
	/*子分屏样式（呼叫）*/
	_childCallClassName            : "callChild",
	_childHoverCallClassName       : "hoverCallChild",
	/*子分屏样式（点播暂停）*/
	_childSuspendClassName1        : "suspendChild1",
	_childHoverSuspendClassName1   : "hoverSuspendChild1",
	/*子分屏样式（对讲、呼叫暂停）*/
	_childSuspendClassName2        : "suspendChild2",
	_childHoverSuspendClassName2   : "hoverSuspendChild2",
	/*子分屏信息显示DIV样式*/
	_childInfoDivClassName         : "businessInfoDIV",
	/*子分屏操作栏DIV样式*/
	_childOperateDivClassName      : "operateDIV",
	/*子分屏选中框DIV样式*/
	_childSelectedDivClassName     : "selectedDIV",
	/*子分屏未选中框DIV样式*/
	_childUnSelectedDivClassName   : "unselectedDIV",
	/*子分屏osd前缀*/
	_childOsdIdName				   : "osdDIV_",
	_childOsdClassName			   : "osdDIV",
	childOsdJoinClassName         : "osdJoinDIV",

	_imgOperate                    : bg_operate,
	_imgPerson                     : img_person,
	_imgDevice                     : img_device,
	_imgSelected                   : img_selected,
	_imgSuspend                    : img_suspend,
	_imgSuspendHover               : img_suspend_hover,
	_imgPlay                       : img_play,
	_imgPlayHover                  : img_play_hover,
	_imgStop                       : img_stop,
	_imgStopHover                  : img_stop_hover,
	_imgSoundOff                   : img_soundoff,
	_imgSoundOffHover              : img_soundoff_hover,
	_imgSoundOn                    : img_soundon,
	_imgSoundOnHover               : img_soundon_hover,
	_imgYTControl                  : img_ytcontrol,
	_imgYTControlHover             : img_ytcontrol_hover,
	_imgFullScreen                 : img_fullscreen,
	_imgFullScreenHover            : img_fullscreen_hover,
	_imgRestoreScreen              : img_restorescreen,
	_imgRestoreScreenHover         : img_restorescreen_hover,
	_imgPictureQuality             : img_picture_quality,
	_imgPictureQualityHover        : img_picture_quality_hover,
	_imgStartRecord                : img_start_record,
	_imgStartRecordHover           : img_start_record_hover,
	_imgStopRecord                 : img_stop_record,
	_imgCapture                    : img_capture,
	_imgCaptureHover               : img_capture_hover,
	_imgOpenMeeting                : img_openMeeting,
	_imgOpenMeetingHover           : img_openMeeting_hover,
	//录像回放下的按钮图片
	_imgSlowRecord                 : img_slow_record,
	_imgSlowRecordHover            : img_slow_record_hover,
	_imgFastRecord                 : img_fast_record,
	_imgFastRecordHover            : img_fast_record_hover,
	_imgFrameRecord                : img_frame_record,
	_imgFrameRecordHover           : img_frame_record_hover,
	_imgRenewRecord                : img_renew_record,
	_imgRenewRecordHover           : img_renew_record_hover,

	//操作栏按钮key
	_btnKeySuspend				   : 'Pause',
	_btnKeyPlay					   : 'Play',
	_btnKeyStop					   : 'Nor_StopPlay',
	_btnKeySoundOff				   : 'Nor_VolOff',
	_btnKeySoundOn				   : 'Nor_VolOn',
	_btnKeyYTControl			   : 'Nor_PTZ',
	_btnKeyFullScreen			   : 'Nor_FullScreen',
    _btnKeyCancelFullScreen        : 'Nor_CancelFull',
	_btnPictureQuality			   : 'Nor_PictureQuality',
	_btnKeyPicCapture			   : 'Pic_Capture',
	_btnOpenMeeting                : 'Open_Meeting',
	_btnKeyStartRecord			   : 'Nor_Record',
	_btnKeyStopRecord			   : 'Choose_Record',
	//录像回放下的按钮key
	_btnKeyPauseRecord			   : 'Record_Pause',//回放暂停
	_btnKeyPlayRecord			   : 'Record_Play',//暂停后恢复
	_btnKeySlowRecord			   : 'Record_Slow',//慢放
	_btnKeyFastRecord			   : 'Record_Fast',//快放
	_btnKeyRenewRecord			   : 'Record_Renew',//恢复速度
	_btnKeyFrameRecord			   : 'Record_Frame',//单帧播放

	/**
	 * [_initLayout 初始化布局]
	 * @return {[type]} [description]
	 */
	_initLayout(containerWidth, containerHeight) {
		// if( decoderPlayer._containerDiv ) {
			decoderPlayer._containerDiv.style.width = containerWidth + 'px';
			decoderPlayer._containerDiv.style.height = containerHeight + 'px';
	
			// 初始化容器宽高
			decoderPlayer._containerWidth            = containerWidth;
			decoderPlayer._containerHeight           = containerHeight;
		// };
	},
	/*分屏计算接口***************************************************************/
	//计算标准分屏
	_fillStandardSplitInfos : function(rowCount, columnCount){
		for(var i = 0; i < decoderPlayer._screens.length; i++) decoderPlayer._screens[i].isDisplay = false;
		// var width  = parseInt((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount);
		// var height = parseInt((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount);
		var width  = Math.floor(((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount)*100)/100;
		var height = Math.floor(((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount)*100)/100;
        var index  = 0;
        var left;
        var top    = 0;
        for (var m = 0; m < rowCount; m++){
            top += decoderPlayer._space;
            left = 0;
            for (var n = 0; n < columnCount; n++){
                left += decoderPlayer._space;
                decoderPlayer._screens[index].left      = left;
                decoderPlayer._screens[index].top       = top;
                decoderPlayer._screens[index].width     = width;
                decoderPlayer._screens[index].height    = height;
                decoderPlayer._screens[index].isDisplay = true;
                index++;
                left += width;
            }//end for n
            top += height;
        }//end for m
    },
    //计算非规则分屏
    _fillMergeSplitInfos : function(rowCount, columnCount, mergeColumns, mergeRows){
		for(var i = 0; i < decoderPlayer._screens.length; i++) decoderPlayer._screens[i].isDisplay = false;
		// var itemWidth  = parseInt((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount);
		// var itemHeight = parseInt((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount);
		var itemWidth  = Math.floor(((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount) *100)/100;
		var itemHeight = Math.floor(((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount)*100)/100;
		decoderPlayer._screens[0].left      = decoderPlayer._space;
		decoderPlayer._screens[0].top       = decoderPlayer._space;
		decoderPlayer._screens[0].width     = itemWidth * mergeColumns + decoderPlayer._space * (mergeColumns - 1);
		decoderPlayer._screens[0].height    = itemHeight * mergeRows + decoderPlayer._space * (mergeRows - 1);
        decoderPlayer._screens[0].isDisplay = true;
        var index = 1;
        var left  = 0;
        var top   = 0;
        for (var m = 0; m < rowCount; m++){
            top += decoderPlayer._space;
            for (var n = 0; n < columnCount; n++){
                left += decoderPlayer._space;
                if (m >= mergeColumns || n >= mergeRows){
                	decoderPlayer._screens[index].left      = left;
                	decoderPlayer._screens[index].top       = top;
                	decoderPlayer._screens[index].width     = itemWidth;
                	decoderPlayer._screens[index].height    = itemHeight;
                	decoderPlayer._screens[index].isDisplay = true;
                    index++;
                }//end if
                left += itemWidth;
            }//end for n
            top += itemHeight;
            left = 0;
        }//end for m
    },
    //2+8
    _fillSplitTwoPlusEight : function(rowCount, columnCount, mergeColumns, mergeRows){
        for(var i = 0; i < decoderPlayer._screens.length; i++) decoderPlayer._screens[i].isDisplay = false;
        // var itemWidth  = parseInt((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount);
        // var itemHeight = parseInt((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount);
        var itemWidth  = Math.floor(((decoderPlayer._containerWidth - decoderPlayer._space * (columnCount + 1)) / columnCount) *100)/100;
        var itemHeight = Math.floor(((decoderPlayer._containerHeight - decoderPlayer._space * (rowCount + 1)) / rowCount)*100)/100;
        decoderPlayer._screens[0].left      = decoderPlayer._space;
        decoderPlayer._screens[0].top       = decoderPlayer._space;
        decoderPlayer._screens[0].width     = itemWidth * mergeColumns + decoderPlayer._space * (mergeColumns - 1);
        decoderPlayer._screens[0].height    = itemHeight * mergeRows + decoderPlayer._space * (mergeRows - 1);
        decoderPlayer._screens[0].isDisplay = true;
        decoderPlayer._screens[1].left      = itemWidth * mergeColumns + decoderPlayer._space * (mergeColumns - 1);
        decoderPlayer._screens[1].top       = 0;
        decoderPlayer._screens[1].width     = itemWidth * mergeColumns + decoderPlayer._space * (mergeColumns - 1);
        decoderPlayer._screens[1].height    = itemHeight * mergeRows + decoderPlayer._space * (mergeRows - 1);
        decoderPlayer._screens[1].isDisplay = true;
        var index = 2;
        var left  = 0;
        var top   = 0;
        for (var m = 0; m < rowCount; m++){
            top += decoderPlayer._space;
            for (var n = 0; n < columnCount; n++){
                left += decoderPlayer._space;
                if (m >= mergeColumns || n >= mergeRows){
                    if (m >= mergeColumns) {
                        decoderPlayer._screens[index].left      = left;
                        decoderPlayer._screens[index].top       = top;
                        decoderPlayer._screens[index].width     = itemWidth;
                        decoderPlayer._screens[index].height    = itemHeight;
                        decoderPlayer._screens[index].isDisplay = true;
                        index++;
                    }
                }//end if
                left += itemWidth;
            }//end for n
            top += itemHeight;
            left = 0;
        }//end for m
    },
    /*获取指定分屏类型的下一级分屏类型*/
    _getNextSplitType : function(splitType){
    	if(splitType > decoderPlayer._maxScreenCount) return splitType;

    	switch(splitType){
    		case SPLIT_TYPE_ONE:
    			return SPLIT_TYPE_FOUR;
    		case SPLIT_TYPE_FOUR:
				return SPLIT_TYPE_NINE;
    		case SPLIT_TYPE_NINE:
    			return SPLIT_TYPE_SIXTEEN;
    		case SPLIT_TYPE_SIXTEEN:
    			return SPLIT_TYPE_TWENTFIVE;
    		case SPLIT_TYPE_TWENTFIVE:
    			return SPLIT_TYPE_THIRTYSIX;
    		case SPLIT_TYPE_THIRTYSIX:
    			return SPLIT_TYPE_THIRTYSIX;
    		case SPLIT_TYPE_ONE_PLUS_FIVE:
    			return SPLIT_TYPE_ONE_PLUS_SEVEN;
    		case SPLIT_TYPE_ONE_PLUS_SEVEN:
    			return SPLIT_TYPE_ONE_PLUS_NINE;
    		case SPLIT_TYPE_ONE_PLUS_NINE:
    			return SPLIT_TYPE_ONE_PLUS_ELEVEN;
    		case SPLIT_TYPE_ONE_PLUS_ELEVEN:
    			return SPLIT_TYPE_SIXTEEN;
    	}
	},
	//通过分屏类型获取分屏数量
	_convertSplitTypeToCount : function(){
		var count = 0;
		switch(decoderPlayer._currentSplitType){
    		case SPLIT_TYPE_ONE:
				count = 1;break;
			case SPLIT_TYPE_TWO:
    			count = 2;break;
    		case SPLIT_TYPE_FOUR:
				count = 4;break;
			case SPLIT_TYPE_SIX:
				count = 6;break;
    		case SPLIT_TYPE_NINE:
				count = 9;break;
			case SPLIT_TYPE_TWELVE:
    			count = 12;break;
    		case SPLIT_TYPE_SIXTEEN:
				count = 16;break;
			case SPLIT_TYPE_TWENTFOUR:
    			count = 24;break;
    		case SPLIT_TYPE_TWENTFIVE:
				count = 25;break;
			case SPLIT_TYPE_THIRTYTWO:
    			count = 32;break;
    		case SPLIT_TYPE_THIRTYSIX:
    			count = 36;break;
    		case SPLIT_TYPE_ONE_PLUS_FIVE:
    			count = 6;break;
    		case SPLIT_TYPE_ONE_PLUS_SEVEN:
    			count = 8;break;
    		case SPLIT_TYPE_ONE_PLUS_NINE:
    			count = 10;break;
    		case SPLIT_TYPE_ONE_PLUS_ELEVEN:
				count = 12;break;
			case SPLIT_TYPE_TWO_PLUS_EIGHT:
				count = 10;break;
			case SPLIT_TYPE_PIC_IN_PIC:
				count = 2;break;
		}
		decoderPlayer._currentSplitCount = count;
	},
    //开启全屏模式
    _launchIntoFullScreen : function(element){
		if(element.requestFullscreen)
			element.requestFullscreen();
		else if(element.mozRequestFullScreen)
			element.mozRequestFullScreen();
		else if(element.webkitRequestFullscreen)
			element.webkitRequestFullscreen();
		else if(element.msRequestFullscreen)
			element.msRequestFullscreen();
	},
	//退出全屏模式
	_exitFullScreen : function(){
		if(document.exitFullscreen)
			document.exitFullscreen();
		else if(document.msExitFullscreen)
			document.msExitFullscreen();
		else if(document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if(document.webkitCancelFullScreen)
			document.webkitCancelFullScreen();
	},
	//监听全屏/退出事件
	_applyExitFullScreenEvent : function(callback){
		document.addEventListener("fullscreenchange", function(e){
			if(document.fullscreenElement == null){
				decoderPlayer.allFull=false;
				callback(false, e);
			}else callback(true, e);
		});
		document.addEventListener("msfullscreenchange", function(e){
			if(document.msFullscreenElement == null){
				decoderPlayer.allFull=false;
				callback(false, e);
			}else callback(true, e);
		});
		document.addEventListener("mozfullscreenchange", function(e){
			if(document.mozFullScreenElement == null){
				decoderPlayer.allFull=false;
				callback(false, e);
			}else callback(true, e);
		});
		document.addEventListener("webkitfullscreenchange", function(e){
			if(document.webkitFullscreenElement == null){
				decoderPlayer.allFull=false;
				callback(false, e);
			}else callback(true, e);
		});
	},
    /*UI区域刷新接口***********************************************************************/
	//刷新选中区域样式
	_refreshChildSelected : function(){
		for(var i = 0; i < decoderPlayer._maxScreenCount; i++){
			var childDiv = decoderPlayer._containerDiv.children[i];
			if(decoderPlayer._screens[i].isSelected){
				childDiv.classList.add("selected")
			}else{
				childDiv.classList.remove("selected")
			}
		}
	},
	_refreshChildSelected_old : function(screenIndex){
		//判断分屏是否有鼠标进入
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var selectedDiv = childDiv.children[2];

		if(screenInfo.isSelected && !screenInfo.isFull){
			selectedDiv.className = decoderPlayer._childSelectedDivClassName;
			selectedDiv.style.display = "block";
		} else {
			// if(!screenInfo.isHover || screenInfo.business == BUSINESS_NONE || screenInfo.isFull){
			// 	selectedDiv.style.display = "none";
			// 	return;
			// }
			//selectedDiv.className = decoderPlayer._childUnSelectedDivClassName;
			//selectedDiv.style.display = "block";
			selectedDiv.style.display = "none";
		}
	},
	//刷新操作栏显示样式
	_refreshOperate : function(screenIndex){
		//判断分屏是否有鼠标进入
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var operateDiv = childDiv.children[1];
		if(screenInfo.business == BUSINESS_NONE){
			operateDiv.style.display = "none"; //1121放开 
			operateDiv.innerHTML = "";
			return;
		}
        if(screenInfo.isFull) {
            var jsOperate5 = '';
            jsOperate5 += " id=\"" + decoderPlayer._btnKeyCancelFullScreen + "\"";
            jsOperate5 += " title=\"取消全屏\" src=\"" + decoderPlayer._imgRestoreScreen +  "\"";

            operateDiv.innerHTML = "<table style=\"height:100%;\">" +
                    "   <tr style=\"height:25px;\" valign=\"bottom\">" +
                    "       <td style=\"width:100%\"></td>" +
                    "       <td><img style=\"width:20px; height:20px; padding: 0px 5px; cursor: pointer;\"" + jsOperate5 + "></img></td>" +
                    "   </tr>" +
                    "</table>";
        }
        if(!screenInfo.isFull) {
            decoderPlayer._initOperate(screenIndex);
        }
		if(screenInfo.business != BUSINESS_NONE && operateDiv.children.length > 0){
			operateDiv.style.display = screenInfo.isHover ? "block" : "none";
		}
		if(screenInfo.business != BUSINESS_NONE && operateDiv.children.length == 0){
			decoderPlayer._initOperate(screenIndex);
		}
		if(!screenInfo.hasAddOperateListener){
			decoderPlayer._addOperateEvent(operateDiv, screenIndex);
			screenInfo.hasAddOperateListener = true;
		}
		// 设置声音条禁用状态
		if(screenInfo.volume) screenInfo.volume.isDisabled(!screenInfo.soundOff); 
	},
	_initOperate(screenIndex){
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var operateDiv = childDiv.children[1];
		if(screenInfo.screenType == 1){//点播屏的按钮操作栏
			//清空内部html
			operateDiv.innerHTML = "";
			var jsOperate1 = "";
			var jsOperate2 = "";
			var jsOperate3 = "";
			var jsOperate4 = "";
			var jsOperate5 = "";
			// var jsOperate6 = "";
			// var jsOperate7 = "";
			//判断分屏业务是否处于暂停状态
			if(screenInfo.isSuspended){
				jsOperate1 += "  id=\"" + decoderPlayer._btnKeyPlay + "\"";
				jsOperate1 += " title=\"播放\" src=\"" + decoderPlayer._imgPlay +  "\"";
			} else {
				jsOperate1 += " id=\"" + decoderPlayer._btnKeySuspend + "\"";
				jsOperate1 += " title=\"暂停\" src=\"" + decoderPlayer._imgSuspend +  "\"";
			}
			//停止按钮
			jsOperate2 += " id=\"" + decoderPlayer._btnKeyStop + "\"";
			jsOperate2 += " title=\"停止\" src=\"" + decoderPlayer._imgStop +  "\"";
			//临时录像按钮
			// if(screenInfo.isRecording){
			// 	jsOperate7 += " id=\"" + decoderPlayer._btnKeyStopRecord + "\"";
			// 	jsOperate7 += " title=\"停止录像\" src=\"" + decoderPlayer._imgStopRecord +  "\"";
			// } else {
			// 	jsOperate7 += " id=\"" + decoderPlayer._btnKeyStartRecord + "\"";
			// 	jsOperate7 += " title=\"开启录像\" src=\"" + decoderPlayer._imgStartRecord +  "\"";
			// }
			//判断分屏业务是否处于静音状态
			if(screenInfo.soundOff){
				jsOperate3 += " id=\"" + decoderPlayer._btnKeySoundOn + "\"";
				jsOperate3 += " title=\"放音\" src=\"" + decoderPlayer._imgSoundOn +  "\"";
			} else {
				jsOperate3 += " id=\"" + decoderPlayer._btnKeySoundOff + "\"";
				jsOperate3 += " title=\"静音\" src=\"" + decoderPlayer._imgSoundOff +  "\"";
			}
			//云台按钮
			jsOperate4 += " id=\"" + decoderPlayer._btnKeyYTControl + "\"";
			jsOperate4 += " title=\"云台控制\" src=\"" + decoderPlayer._imgYTControl +  "\"";
			//判断分屏业务是否处于全屏状态
			if(screenInfo.isFull == true){
				jsOperate5 += " title=\"取消全屏\" src=\"" + decoderPlayer._imgRestoreScreen +  "\"";
			} else {
				jsOperate5 += " id=\"" + decoderPlayer._btnKeyFullScreen + "\"";
				jsOperate5 += " title=\"全屏\" src=\"" + decoderPlayer._imgFullScreen +  "\"";
			}
			// 画质调节
			// jsOperate6 += " id=\"" + decoderPlayer._btnPictureQuality + "\"";
			// jsOperate6 += " title=\"画质调节\" src=\"" + decoderPlayer._imgPictureQuality +  "\"";
			//抓拍按钮
			jsOperate8 += " id=\"" + decoderPlayer._btnKeyPicCapture + "\"";
			jsOperate8 += " src=\"" + decoderPlayer._imgCapture +  "\"";

			jsOperate9 += " id=\"" + decoderPlayer._btnOpenMeeting + "\"";
			jsOperate9 += " title=\"开启会议\" src=\"" + decoderPlayer._imgOpenMeeting +  "\"";
			var innerHTML='';
			//全部全屏时底部功能按钮显示2020.12.15
			if(decoderPlayer.allFull){
				innerHTML =
					"<table style=\"height:100%;\">" +
					"	<tr style=\"height:25px;\" valign=\"bottom\">" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate1 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate2 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate7 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate3 + "></img></td>" +
					 "		<td><div style=\"width:120px; margin-left: 5px;\" class=\"volume-progress\"></div></td>" +
					"		<td style=\"width:100%\"></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate6 + "></img><div class=\"pictureQuality\" style=\"display:none\"></div></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate9 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate4 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate5 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 5px 0px 5px; cursor: pointer;\"" + jsOperate8 + "></img></td>" +
					"	</tr>" +
					"</table>";
			}else{
			innerHTML =
					"<table style=\"height:100%;\">" +
					"	<tr style=\"height:25px;\" valign=\"bottom\">" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate1 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate2 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate7 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate3 + "></img></td>" +
					 "		<td><div style=\"width:120px; margin-left: 5px;\" class=\"volume-progress\"></div></td>" +
					"		<td style=\"width:100%\"></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate6 + "></img><div class=\"pictureQuality\" style=\"display:none\"></div></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate9 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate4 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate5 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 5px 0px 5px; cursor: pointer;\"" + jsOperate8 + "></img></td>" +
					"	</tr>" +
					"</table>";
			}
			operateDiv.innerHTML = innerHTML;

			
			//初始化声音条
			screenInfo.volume = new Slider(operateDiv.querySelector('.volume-progress'), screenInfo.volumeValue, {circleSize: 12});
			screenInfo.volume.setAfterChangedCallback(vol => {
				// if(decoderPlayer._afterVolumeChangedCB != null)
				// 	decoderPlayer._afterVolumeChangedCB(screenIndex, vol)
				if(decoderPlayer._playerBtnEventCB != null)
					decoderPlayer._playerBtnEventCB(screenIndex, 'Volume_Progress', vol)
			});

			// 画质调节
			// screenInfo.pictureQuality = new PictureQualitySlider(operateDiv.querySelector('.pictureQuality'), [{lable: '色&nbsp;&nbsp;&nbsp;彩', icon: 'icon-color', type: 1, value: 40}, {lable: '亮&nbsp;&nbsp;&nbsp;度', icon: 'icon-bright', type: 2, value: 20}, {lable: '清晰度', icon: 'icon-definition', type: 3, value: 30}]);
			// screenInfo.pictureQuality.setAfterChangedCallback((type, value) => {
			// 	if(decoderPlayer._afterPicQualityChangedCB != null)
			// 		decoderPlayer._afterPicQualityChangedCB(screenIndex, type, value);
			// });
		}else if(screenInfo.screenType == 2){//回放屏的按钮操作栏
			//清空内部html
			operateDiv.innerHTML = "";
			var jsOperate1 = "";
			var jsOperate2 = "";
			var jsOperate3 = "";
			var jsOperate4 = "";
			var jsOperate5 = "";
			var jsOperate6 = "";
			var jsOperate7 = "";
			var jsOperate8 = "";
			var jsOperate9 = "";
			//判断分屏业务是否处于暂停状态
			if(screenInfo.isSuspended){
				jsOperate1 += " id=\"" + decoderPlayer._btnKeyPlay + "\"";
				jsOperate1 += " title=\"播放\" src=\"" + decoderPlayer._imgPlay +  "\"";
			} else {
				jsOperate1 += " id=\"" + decoderPlayer._btnKeySuspend + "\"";
				jsOperate1 += " title=\"暂停\" src=\"" + decoderPlayer._imgSuspend +  "\"";
			}
			//停止按钮
			jsOperate2 += " id=\"" + decoderPlayer._btnKeyStop + "\"";
			jsOperate2 += " title=\"停止\" src=\"" + decoderPlayer._imgStop +  "\"";
			//判断分屏业务是否处于静音状态
			if(screenInfo.soundOff){
				jsOperate3 += " id=\"" + decoderPlayer._btnKeySoundOn + "\"";
				jsOperate3 += " title=\"放音\"  src=\"" + decoderPlayer._imgSoundOn +  "\"";
			} else {
				jsOperate3 += " id=\"" + decoderPlayer._btnKeySoundOff + "\"";
				jsOperate3 += " title=\"静音\"  src=\"" + decoderPlayer._imgSoundOff +  "\"";
			}
			//抓拍按钮
			jsOperate4 += " id=\"" + decoderPlayer._btnKeyPicCapture + "\"";
			jsOperate4 += " title=\"抓拍\"  src=\"" + decoderPlayer._imgCapture +  "\"";
			//判断分屏业务是否处于全屏状态
			if(screenInfo.isFull == true){
				jsOperate5 += " title=\"取消全屏\"  src=\"" + decoderPlayer._imgRestoreScreen +  "\"";
			} else {
				jsOperate5 += " id=\"" + decoderPlayer._btnKeyFullScreen + "\"";
				jsOperate5 += " title=\"全屏\"  src=\"" + decoderPlayer._imgFullScreen +  "\"";
			}
			// 注释工具栏2020-08-06 zhengtian
			// 慢放
			// jsOperate6 += " id=\"" + decoderPlayer._btnKeySlowRecord + "\"";
			// jsOperate6 += " title=\"快退\"  src=\"" + decoderPlayer._imgSlowRecord +  "\"";
			// // 快放
			// jsOperate7 += " id=\"" + decoderPlayer._btnKeyFastRecord + "\"";
			// jsOperate7 += " title=\"快进\"  src=\"" + decoderPlayer._imgFastRecord +  "\"";
			// // 恢复速度
			// jsOperate8 += " id=\"" + decoderPlayer._btnKeyRenewRecord + "\"";
			// jsOperate8 += " title=\"恢复\" src=\"" + decoderPlayer._imgRenewRecord +  "\"";
			// // 单帧播放
			// jsOperate9 += " id=\"" + decoderPlayer._btnKeyFrameRecord + "\"";
			// jsOperate9 += " title=\"单帧播放\" src=\"" + decoderPlayer._imgFrameRecord +  "\"";
			var innerHTML =
					"<div class=\"video-progress\"></div>" +
					"<table style=\"height:100%;\">" +
					"	<tr style=\"height:25px;\" valign=\"bottom\">" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate1 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate2 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate6 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate7 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate9 + "></img></td>" +
					// "		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate8 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate3 + "></img></td>" +
					 "		<td><div style=\"width:120px; margin-left: 5px;\" class=\"volume-progress\"></div></td>" +
					"		<td style=\"width:100%\"></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate4 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate9 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 5px 0px 5px; cursor: pointer;\"" + jsOperate5 + "></img></td>" +
					"		<td><img style=\"width:20px; height:20px; padding: 0px 0px 0px 5px; cursor: pointer;\"" + jsOperate8 + "></img></td>" +
					"	</tr>" +
					"</table>";
			operateDiv.innerHTML = innerHTML;
			//初始化声音条
			screenInfo.volume = new Slider(operateDiv.querySelector('.volume-progress'), screenInfo.volumeValue, {circleSize: 12});
			screenInfo.volume.setAfterChangedCallback(vol => {
				// if(decoderPlayer._afterVolumeChangedCB != null)
				// 	decoderPlayer._afterVolumeChangedCB(screenIndex, vol)
				if(decoderPlayer._playerBtnEventCB != null)
					decoderPlayer._playerBtnEventCB(screenIndex, 'Volume_Progress', vol)
			});
		}
	},
	/**
	 * [_addOperateEvent 操作栏事件添加]
	 */
	_addOperateEvent(operateDiv, screenIndex){
		var screenInfo = decoderPlayer._screens[screenIndex];
		operateDiv.addEventListener("click", e => {
			let isBtn = false;
			console.log('视频操作栏',screenInfo)
			let targetId = e.target.id;
			if (targetId == decoderPlayer._btnKeySuspend) {
				isBtn = true;
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySuspend)
				curBtn.id = decoderPlayer._btnKeyPlay;
				curBtn.src = decoderPlayer._imgPlayHover;
			} else if (targetId == decoderPlayer._btnKeyPlay) {
				isBtn = true;
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyPlay)
				curBtn.id = decoderPlayer._btnKeySuspend;
				curBtn.src = decoderPlayer._imgSuspendHover;
			} else if (targetId == decoderPlayer._btnKeyStop) {
				isBtn = true;
				// screenInfo.isHover = false;
				// decoderPlayer._refreshOperate(screenIndex);
				// setTimeout(function(){
				// },200)
			} else if (targetId == decoderPlayer._btnKeySoundOff) {
				isBtn = true;
			} else if (targetId == decoderPlayer._btnKeySoundOn) {
				isBtn = true;
			} else if (targetId == decoderPlayer._btnKeyYTControl) {
				isBtn = true;
			} else if (targetId == decoderPlayer._btnKeyFullScreen) {
				isBtn = true;
			} else if (targetId == decoderPlayer._btnKeyCancelFullScreen) {
                isBtn = true;
            } else if (targetId == decoderPlayer._btnKeyPicCapture) {
				isBtn = true;
			} else if (targetId == decoderPlayer._btnPictureQuality) {
				let pictureQualityDiv = operateDiv.querySelector(".pictureQuality");
				let isShow = pictureQualityDiv.style.display;
				if (isShow === 'none') {
					pictureQualityDiv.style.display = 'block';
				} else {
					pictureQualityDiv.style.display = 'none';
				}
			} else if (targetId == decoderPlayer._btnKeyStartRecord) {
				isBtn = true;
			}  else if (targetId == decoderPlayer._btnKeyStopRecord) {
				isBtn = true;
			}  else if (targetId == decoderPlayer._btnKeySlowRecord) {
				isBtn = true;
				let curr = screenInfo.speed;
				//operateDiv.querySelector("#" + decoderPlayer._btnKeyFastRecord).style.pointerEvents = '';
				if (curr === -4) {
					// operateDiv.querySelector("#" + decoderPlayer._btnKeySlowRecord).style.pointerEvents = 'none';
					// return;
					screenInfo.speed = -4;
				} else if (curr > 1) {
					screenInfo.speed = curr / 2;
				} else {
					screenInfo.speed = curr * 2;
					screenInfo.speed = screenInfo.speed > 0 ? -screenInfo.speed : screenInfo.speed;
				}
			} else if (targetId == decoderPlayer._btnKeyFastRecord) {
				isBtn = true;
				let curr = screenInfo.speed;
				//operateDiv.querySelector("#" + decoderPlayer._btnKeySlowRecord).style.pointerEvents = '';
				if (screenInfo.speed === 8) {
					// operateDiv.querySelector("#" + decoderPlayer._btnKeyFastRecord).style.pointerEvents = 'none';
					// return;
					screenInfo.speed = 8;
				} else if (curr >= 1) {
					screenInfo.speed = curr * 2;
				} else  {
					screenInfo.speed = curr / 2;
					screenInfo.speed = screenInfo.speed === -1 ? 1 : screenInfo.speed;
				}
			} else if (targetId == decoderPlayer._btnKeyRenewRecord) {
				isBtn = true;
				screenInfo.speed = 1;
			} else if (targetId == decoderPlayer._btnKeyFrameRecord) {
				isBtn = true;
			} else if ( targetId == decoderPlayer._btnOpenMeeting ){
				// 开启会议
				isBtn = true;
			}

			if(decoderPlayer._playerBtnEventCB != null && isBtn) {
				decoderPlayer._playerBtnEventCB(screenIndex, targetId, screenInfo.speed);
			}

		});
		operateDiv.addEventListener("mouseout", e => {
			let targetId = e.target.id;
			if (targetId == decoderPlayer._btnKeySuspend) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySuspend)
				curBtn.src = decoderPlayer._imgSuspend;
			} else if (targetId == decoderPlayer._btnKeyPlay) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyPlay)
				curBtn.src = decoderPlayer._imgPlay;
			} else if (targetId == decoderPlayer._btnKeyStop) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStop)
				curBtn.src = decoderPlayer._imgStop;
			} else if (targetId == decoderPlayer._btnKeySoundOff) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOff)
				curBtn.src = decoderPlayer._imgSoundOff;
			} else if (targetId == decoderPlayer._btnKeySoundOn) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOn)
				curBtn.src = decoderPlayer._imgSoundOn;
			} else if (targetId == decoderPlayer._btnKeyYTControl) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyYTControl)
				curBtn.src = decoderPlayer._imgYTControl;
			} else if (targetId == decoderPlayer._btnKeyFullScreen) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFullScreen)
				curBtn.src = decoderPlayer._imgFullScreen;
			} else if (targetId == decoderPlayer._btnKeyPicCapture) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyPicCapture)
				curBtn.src = decoderPlayer._imgCapture;
			} else if (targetId == decoderPlayer._btnPictureQuality) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnPictureQuality)
				curBtn.src = decoderPlayer._imgPictureQuality;
			} else if (targetId == decoderPlayer._btnKeyStartRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStartRecord)
				curBtn.src = decoderPlayer._imgStartRecord;
			} else if (targetId == decoderPlayer._btnKeySlowRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySlowRecord)
				curBtn.src = decoderPlayer._imgSlowRecord;
			} else if (targetId == decoderPlayer._btnKeyFastRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFastRecord)
				curBtn.src = decoderPlayer._imgFastRecord;
			} else if (targetId == decoderPlayer._btnKeyRenewRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyRenewRecord)
				curBtn.src = decoderPlayer._imgRenewRecord;
			} else if (targetId == decoderPlayer._btnKeyFrameRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFrameRecord)
				curBtn.src = decoderPlayer._imgFrameRecord;
			} else if( targetId == decoderPlayer._btnOpenMeeting ){
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnOpenMeeting)
				curBtn.src = decoderPlayer._imgOpenMeeting;
			}
		});
		operateDiv.addEventListener("mouseover", e => {
			let targetId = e.target.id;
			if (targetId == decoderPlayer._btnKeySuspend) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySuspend)
				curBtn.src = decoderPlayer._imgSuspendHover;
			} else if (targetId == decoderPlayer._btnKeyPlay) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyPlay)
				curBtn.src = decoderPlayer._imgPlayHover;
			} else if (targetId == decoderPlayer._btnKeyStop) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStop)
				curBtn.src = decoderPlayer._imgStopHover;
			} else if (targetId == decoderPlayer._btnKeySoundOff) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOff)
				curBtn.src = decoderPlayer._imgSoundOffHover;
			} else if (targetId == decoderPlayer._btnKeySoundOn) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOn)
				curBtn.src = decoderPlayer._imgSoundOnHover;
			} else if (targetId == decoderPlayer._btnKeyYTControl) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyYTControl)
				curBtn.src = decoderPlayer._imgYTControlHover;
			} else if (targetId == decoderPlayer._btnKeyFullScreen) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFullScreen)
				curBtn.src = decoderPlayer._imgFullScreenHover;
			} else if (targetId == decoderPlayer._btnKeyPicCapture) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyPicCapture)
				curBtn.src = decoderPlayer._imgCaptureHover;
			} else if (targetId == decoderPlayer._btnPictureQuality) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnPictureQuality)
				curBtn.src = decoderPlayer._imgPictureQualityHover;
			} else if (targetId == decoderPlayer._btnKeyStartRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStartRecord)
				curBtn.src = decoderPlayer._imgStartRecordHover;
			} else if (targetId == decoderPlayer._btnKeySlowRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySlowRecord)
				curBtn.src = decoderPlayer._imgSlowRecordHover;
			} else if (targetId == decoderPlayer._btnKeyFastRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFastRecord)
				curBtn.src = decoderPlayer._imgFastRecordHover;
			} else if (targetId == decoderPlayer._btnKeyRenewRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyRenewRecord)
				curBtn.src = decoderPlayer._imgRenewRecordHover;
			} else if (targetId == decoderPlayer._btnKeyFrameRecord) {
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyFrameRecord)
				curBtn.src = decoderPlayer._imgFrameRecordHover;
			} else if( targetId == decoderPlayer._btnOpenMeeting ){
				let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnOpenMeeting)
				curBtn.src = decoderPlayer._imgOpenMeetingHover;
			}
		})
	},
    //刷新单个分屏区域背景样式
	_refreshChildScreen : function(screenIndex){
		var isHover = decoderPlayer._screens[screenIndex].isHover;
		//现有分屏鼠标划入效果
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		if(screenInfo.business == BUSINESS_NONE){
			//空闲状态下
			childDiv.className = isHover ? decoderPlayer._childHoverNormalClassName : decoderPlayer._childNormalClassName;
		} else if(screenInfo.business == BUSINESS_DEVICE_PLAY && !screenInfo.isSuspended){
			//设备点播中（非暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverPlayDeviceClassName : decoderPlayer._childPlayDeviceClassName;
		} else if(screenInfo.business == BUSINESS_DEVICE_PLAY && screenInfo.isSuspended){
			//设备点播中（暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverSuspendClassName1 : decoderPlayer._childSuspendClassName1;
		} else if(screenInfo.business == BUSINESS_PERSON_PLAY && !screenInfo.isSuspended){
			//人员点播中（非暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverPlayPersonClassName : decoderPlayer._childPlayPersonClassName;
		} else if(screenInfo.business == BUSINESS_PERSON_PLAY && screenInfo.isSuspended){
			//人员点播中（暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverSuspendClassName1 : decoderPlayer._childSuspendClassName1;
		} else if(screenInfo.business == BUSINESS_SPEAK && !screenInfo.isSuspended){
			//对讲中（非暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverSpeakClassName : decoderPlayer._childSpeakClassName;
		} else if(screenInfo.business == BUSINESS_SPEAK && screenInfo.isSuspended){
			//对讲中（暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverSuspendClassName2 : decoderPlayer._childSuspendClassName2;
		} else if(screenInfo.business == BUSINESS_CALL && !screenInfo.isSuspended){
			//呼叫中（非暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverCallClassName : decoderPlayer._childCallClassName;
		} else if(screenInfo.business == BUSINESS_CALL && screenInfo.isSuspended){
			//呼叫中（暂停）
			childDiv.className = isHover ? decoderPlayer._childHoverSuspendClassName2 : decoderPlayer._childSuspendClassName2;
		}
	},
	//刷新单个分屏信息
	_refreshChildInfo : function(screenIndex){
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childInfoDiv = childDiv.children[0];
		var jsSrc          = "";
		var resText        = "";
		var departmentText = "";
		var centerText     = "";
		switch(screenInfo.business){
			case BUSINESS_NONE:
				childInfoDiv.style.display = "none";
				return;
			case BUSINESS_DEVICE_PLAY:
				jsSrc = " src=\"" + decoderPlayer._imgDevice + "\"";
				childInfoDiv.style.display = "block";
				break;
			case BUSINESS_PERSON_PLAY:
			case BUSINESS_SPEAK:
			case BUSINESS_CALL:
				jsSrc = "src=\"" + decoderPlayer._imgPerson + "\"";
				childInfoDiv.style.display = "block";
				break;
		}
		resText        = screenInfo.resName;
		departmentText = "单位：" + screenInfo.department;
		centerText     = "中心：" + screenInfo.center;
        //显示人员或设备、部门信息
		childInfoDiv.innerHTML =
        		"<table>" +
        		"	<tr style=\"height:25px;\">" +
        		"		<td valign=\"top\">" +
        		"			<img style=\"width:20px; height:20px\"" + jsSrc + "></img>" +
        		"		</td>" +
        		"		<td valign=\"top\" style=\"font-family:Microsoft Yahei; font-size:16px; font-weight:bold;color:#ffffff\">" + resText + "</td>" +
        		"	</tr>" +
        		"	<tr style=\"height:15px;\">" +
        		"		<td></td>" +
        		"		<td style=\"font-family:Microsoft Yahei; font-size:12px; color:#ffffff\" valign=\"top\">" + departmentText + "</td>" +
        		"	</tr>" +
        		"	<tr style=\"height:15px;\">" +
        		"		<td></td>" +
        		"		<td style=\"font-family:Microsoft Yahei; font-size:12px; color:#ffffff\" valign=\"top\">" + centerText + "</td>" +
        		"	</tr>" +
        		"</table>";
	},
	//刷新分屏区域canvas
	_refreshCanvas : function(screenIndex){
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		//控制canvas显示与否
		if(screenInfo.business == BUSINESS_NONE){
			//空闲状态下
			if (screenInfo.isRTMP) {
				var videoDiv = childDiv.children[4];
				if (videoDiv.style.display != "none") {
					// 销毁video
					screenInfo.video.destroy();
					screenInfo.video = null;
					videoDiv.style.display = "none";
				}
			} else {
				var canvasDiv = childDiv.getElementsByTagName('canvas')[0];
				if(canvasDiv.style.display != "none"){
					//销毁canvas
					screenInfo.webglCanvas.destroy();
					canvasDiv.style.display = "none";
					screenInfo.webglCanvas = null;
				}
			}
		} else {
			if (screenInfo.isRTMP) {
				var videoDiv = childDiv.children[4];				
				if (videoDiv.style.display != "block") {
					videoDiv.style.display = "block";
					// 创建video
					// debugger
					if(screenInfo.video == null){
						if(screenInfo.urlType == 'flv'){
							screenInfo.video = new videoJs(videoDiv.id, childDiv.offsetWidth, childDiv.offsetHeight, screenInfo.rtmpURL);
						} else if(screenInfo.urlType == 'hls'){
							screenInfo.video = new hlsVideoJs(videoDiv.id, childDiv.offsetWidth, childDiv.offsetHeight, screenInfo.rtmpURL,screenIndex);
                            screenInfo.video.stopCB((screenIndex) => {
                                // decoderPlayer.cancelOSD(screenIndex);
                                // decoderPlayer.stopShow(screenIndex);
                                if (decoderPlayer._playerBtnEventCB != null)
                                    decoderPlayer._playerBtnEventCB(screenIndex, 'Nor_StopPlay', screenInfo.speed);
                            })
						}
					}
				} else {
						screenInfo.video.setSize(childDiv.offsetWidth, childDiv.offsetHeight);
				}
			} else {
				var canvasDiv = childDiv.getElementsByTagName('canvas')[0];
				if(canvasDiv.style.display != "block"&&!screenInfo.webglCanvas){
					canvasDiv.style.display = "block";
					//创建canvas
					var glScreen =decoderPlayer._playerType?new JsmpegScreen(canvasDiv.id,decoderPlayer._mediaServer,decoderPlayer._decodeResolution): new WebglScreen(canvasDiv, decoderPlayer._refreshDataType);
					screenInfo.webglCanvas = glScreen;
					screenInfo.webglCanvas.setSize(childDiv.offsetWidth, childDiv.offsetHeight)
				}
				if((childDiv.offsetWidth != screenInfo.webglCanvas.getSize().width) ||
					(childDiv.offsetHeight != screenInfo.webglCanvas.getSize().height)){
					//重设大小
					screenInfo.webglCanvas.setSize(childDiv.offsetWidth, childDiv.offsetHeight)
				}
			}
			
		}
	},
	//刷新分屏区域osd
	_refreshOSD : function(screenIndex){
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		//非空闲，且在分屏内的
		if(screenInfo.business != BUSINESS_NONE && screenInfo.isDisplay){
			let screenWidth = childDiv.offsetWidth;
			let screenHeight = childDiv.offsetHeight;
			screenInfo.osdArray.forEach(item => {
				let osdItem = childDiv.querySelector(`#${decoderPlayer._childOsdIdName + item.osdIndex}`)
				//重设位置
				let x = screenWidth * item.offsetX;
				let y = screenHeight * item.offsetY;
				switch (item.basePoint) {
					case 1:
						osdItem.style.left = `${x}px`;
						osdItem.style.top = `${y}px`;
						break;
					case 2:
						osdItem.style.right = `${x}px`;
						osdItem.style.top = `${y}px`;
						break;
					case 3:
						osdItem.style.left = `${x}px`;
						osdItem.style.bottom = `${y}px`;
						break;
					case 4:
						osdItem.style.right = `${x}px`;
						osdItem.style.bottom = `${y}px`;
						break;
					default:
						osdItem.style.left = `${x}px`;
						osdItem.style.top = `${y}px`;
				}
				//重设字体
				let size = item.fontSize > 0 ? item.fontSize : screenWidth * item.fontWidth;
				osdItem.style.fontSize = `${size}px`;
			});
		}
	},
	//刷新整个分屏布局
	_refreshUI : function(){
		for(var i = 0; i < decoderPlayer._screens.length; i++){
			var childDiv = decoderPlayer._containerDiv.children[i];
			if(!decoderPlayer._screens[i].isDisplay){
				childDiv.style.display = "none";
				continue;
            }//end if
			childDiv.style.display = "block";
			//判断当前分屏是否全屏，如果是全屏，则不定义尺寸
			if(!decoderPlayer._screens[i].isFull){
				childDiv.style.left    = decoderPlayer._screens[i].left + "px";
				childDiv.style.top     = decoderPlayer._screens[i].top + "px";
				childDiv.style.width   = (decoderPlayer._screens[i].width - decoderPlayer._childScreenBorder * 2)  + "px";
				childDiv.style.height  = (decoderPlayer._screens[i].height - decoderPlayer._childScreenBorder * 2) + "px";
			} else {
				childDiv.style.left = 0;
				childDiv.style.top = 0;
				childDiv.style.width = "100%";
				childDiv.style.height = "100%";
			}
			//刷新分屏区域背景样式
			decoderPlayer._refreshChildScreen(i);
			//刷新分屏区域显示信息
			//decoderPlayer._refreshChildInfo(i);
			//刷新分屏区域操作栏
			decoderPlayer._refreshOperate(i);
			//刷新分屏区域是否选中
			decoderPlayer._refreshChildSelected(i);
			//刷新分屏区域canvas
			decoderPlayer._refreshCanvas(i);
			//刷新分屏区域OSD
			decoderPlayer._refreshOSD(i);
		}//end for i
	},
	/*内部操作接口*************************************************************************/
	//分屏鼠标滑入
	_chilidMouseOver : function(screenIndex, even){
		if(decoderPlayer._screens[screenIndex].isHover) return;
		for(var i = 0; i < decoderPlayer._maxScreenCount; i++){
			if(i == screenIndex)
				decoderPlayer._screens[i].isHover = true;
			else
				decoderPlayer._screens[i].isHover = false;
		}
		decoderPlayer._refreshUI();
	},
	//分屏鼠标滑出
	_childMouseOut : function(screenIndex, even){
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var childDivRect = childDiv.getBoundingClientRect();
		var y1 = childDivRect.top;//childDiv.offsetTop;
		var y2 = y1 + childDiv.offsetHeight;
		var x1 = childDivRect.left;//childDiv.offsetLeft;
		var x2 = x1 + childDiv.offsetWidth;
		var x = even.clientX;
		var y = even.clientY;
		if( x < x1 || x > x2 || y < y1 || y > y2) {
			for(var i = 0; i < decoderPlayer._maxScreenCount; i++)
				decoderPlayer._screens[i].isHover = false;
			decoderPlayer._refreshUI();
		}
	},
	//分屏单击
	_childSelectedClick : function(screenIndex){
		//判断分屏是否空闲状态
		var isSelected = false;
		//if(decoderPlayer._screens[screenIndex].business == BUSINESS_NONE) return;
		for(var i = 0; i < decoderPlayer._maxScreenCount; i++){
			if(i == screenIndex){
				isSelected = !decoderPlayer._screens[i].isSelected;
				decoderPlayer._screens[i].isSelected = isSelected;
			}
			else{
				decoderPlayer._screens[i].isSelected = false;
			}
		}
		decoderPlayer._refreshUI();
		//执行选中分屏回调
		if(decoderPlayer._afterSelectedScreenCB != null){
			let isPlay = decoderPlayer._screens[screenIndex].business != BUSINESS_NONE
			decoderPlayer._afterSelectedScreenCB(screenIndex, isSelected, isPlay);
		}
	},
	//1119云调度拖动点播
    //分屏拖动  
    _childSelectedDrop : function(screenIndex, dragData){
        //判断分屏是否空闲状态
        var isSelected = false;
        //if(decoderPlayer._screens[screenIndex].business == BUSINESS_NONE) return;
        for(var i = 0; i < decoderPlayer._maxScreenCount; i++){
            if(i == screenIndex){
                isSelected = !decoderPlayer._screens[i].isSelected;
                decoderPlayer._screens[i].isSelected = isSelected;
            }
            else{
                decoderPlayer._screens[i].isSelected = false;
            }
        }
		decoderPlayer._refreshUI();
		//执行选中分屏回调
		if(decoderPlayer._afterSelectedScreenCB != null){
            let isPlay = decoderPlayer._screens[screenIndex].business != BUSINESS_NONE
			decoderPlayer._afterSelectedScreenDropCB(screenIndex, isSelected, isPlay, dragData);
		}
    },
	//执行暂停操作
	_suspendOperate : function(screenIndex){
		if(decoderPlayer._suspendOperateCB != null)
			decoderPlayer._suspendOperateCB(screenIndex);
	},
	//执行取消暂停操作
	_cancelSuspendOperate : function(screenIndex){
		if(decoderPlayer._cancelSuspendOperateCB != null)
			decoderPlayer._cancelSuspendOperateCB(screenIndex);
	},
	//执行停止操作
	_stopOperate : function(screenIndex){
		if(decoderPlayer._stopOperateCB != null)
			decoderPlayer._stopOperateCB(screenIndex);
	},
	//执行声音打开操作
	_soundOnOperate : function(screenIndex){
		if(decoderPlayer._soundOnOperateCB != null)
			decoderPlayer._soundOnOperateCB(screenIndex);
	},
	//执行声音关闭操作
	_soundOffOperate : function(screenIndex){
		if(decoderPlayer._soundOffOperateCB != null)
			decoderPlayer._soundOffOperateCB(screenIndex);
	},
	//执行云台控制操作
	_ytControlOperate : function(screenIndex){
		if(decoderPlayer._ytControlOperateCB != null)
			decoderPlayer._ytControlOperateCB(screenIndex);
	},
	//执行全屏操作
	_fullScreenOperate : function(screenIndex){
		if(decoderPlayer._fullScreenOperateCB != null)
			decoderPlayer._fullScreenOperateCB(screenIndex);
	},
	//取消全屏操作
	_cancelFullScreenOperate : function(screenIndex){
		if(decoderPlayer._cancelFullScreenOperateCB != null)
			decoderPlayer._cancelFullScreenOperateCB(screenIndex);
    },
	/*对外接口*********************************************************************/
    //初始化
	init : function(divId, containerWidth, containerHeight, refreshDataType,playerType){
		console.log('webglPlayer--初始化');
		decoderPlayer._playerType = playerType
		// 清除已保存分屏信息
		decoderPlayer._currentSplitType = null;
		decoderPlayer._refreshDataType = refreshDataType;
		decoderPlayer._screens                   = new Array();
		if( document.getElementById(divId) ){
			console.log('视频插件加载中----111');
            decoderPlayer.assignment(divId, containerWidth, containerHeight, refreshDataType,playerType);
		} else {
            setTimeout(()=> {
				console.log('视频插件加载中----222');
				decoderPlayer.init(divId, containerWidth, containerHeight, refreshDataType,playerType);
			},1000)
		};
	},
	assignment(divId, containerWidth, containerHeight, refreshDataType,playerType){
		decoderPlayer._containerDiv              = document.getElementById(divId);
		// 初始化布局
		decoderPlayer._initLayout(containerWidth, containerHeight);
		//decoderPlayer._maxScreenCount            = maxScreenCount;
		decoderPlayer._containerDiv.className    = decoderPlayer._containerClassName;
		//初始化分屏信息
		for(var i = 0; i < decoderPlayer._maxScreenCount; i++){
			decoderPlayer._screens[i] = new Screen();
			decoderPlayer._screens[i].index      = i;
			decoderPlayer._screens[i].address    = null;
			decoderPlayer._screens[i].isRTSP     = false;
			decoderPlayer._screens[i].left       = -1;
			decoderPlayer._screens[i].top        = -1;
			decoderPlayer._screens[i].width      = -1;
			decoderPlayer._screens[i].height     = -1;
			decoderPlayer._screens[i].isDisplay  = false;
			decoderPlayer._screens[i].isHover    = false;        //是否鼠标滑入
			decoderPlayer._screens[i].isSelected = false;        //是否选中
			decoderPlayer._screens[i].resID      = "";           //资源ID
			decoderPlayer._screens[i].resName    = "";           //资源名称
			decoderPlayer._screens[i].department = "";           //所属部门
			decoderPlayer._screens[i].center     = "";           //所属中心
			decoderPlayer._screens[i].business   = BUSINESS_NONE;//空闲状态
			decoderPlayer._screens[i].isSuspended = false;           //是否已暂停
			decoderPlayer._screens[i].soundOff    = true;           //声音是否已关闭
			decoderPlayer._screens[i].isFull      = false;           //是否全屏显示

            //分屏父DIV
            var childDiv           = document.createElement("DIV");
            childDiv.id            = decoderPlayer._childNormalIdName + i;
			childDiv.style.display = "none";
			childDiv.className     = decoderPlayer._childNormalClassName;
			//1119云调度拖动点播
			childDiv.ondragover = (event) => {
                event.preventDefault();
            }
            childDiv.ondrop = (event) => {
                let screenIndex = event.target.id.substr(decoderPlayer._childNormalIdName.length);
                let data = event.dataTransfer.getData("item")
				decoderPlayer._childSelectedDrop(screenIndex, JSON.parse(data));	
            }
			//childDiv.setAttribute("onmouseover", "decoderPlayer._chilidMouseOver(" + i + ", event);");
            //childDiv.setAttribute("onmouseout" , "decoderPlayer._childMouseOut(" + i + ", event);");
			//分屏显示信息DIV
			var childInfoDiv           = document.createElement("DIV");
			childInfoDiv.style.display = "none";
			childInfoDiv.className     = decoderPlayer._childInfoDivClassName;
			childDiv.appendChild(childInfoDiv);
			//分屏操作栏DIV
			var childOperateDiv           = document.createElement("DIV");
			childOperateDiv.style.display = "none";
			childOperateDiv.className     = decoderPlayer._childOperateDivClassName;
			childDiv.appendChild(childOperateDiv);
			//分屏选中DIV
			var childSelectedDiv           = document.createElement("DIV");
			childSelectedDiv.style.display = "none";
			childSelectedDiv.className     = decoderPlayer._childUnSelectedDivClassName;
			childSelectedDiv.innerHTML = "<img src=\"" + decoderPlayer._imgSelected + "\"/>";
            //childSelectedDiv.setAttribute("onclick" , "decoderPlayer._childSelectedClick(" + i + ")");
            childDiv.appendChild(childSelectedDiv);
            //分屏Canvas
            let canvasItem          = document.createElement("canvas");
            canvasItem.id           = decoderPlayer._childCanvasIdName + i;
			//canvasItem.style        = "width: 100%; height: 100%; display: none";
			canvasItem.style.display        = "none";
            childDiv.appendChild(canvasItem);
			
			// 创建播放rtmp的video
			let videoDom            = document.createElement('div');
			videoDom.id             = decoderPlayer._childRtmpIdName + i;
			// videoDom.style        	= "width: 100%; height: 100%; display: none";
            videoDom.style.width  = "100%";
            videoDom.style.height = '100%';
            videoDom.style.display = 'none';      
			childDiv.appendChild(videoDom)
			//分屏加入主界面
			decoderPlayer._containerDiv.appendChild(childDiv);
			//绑定事件
			childDiv.addEventListener("mouseenter", e => {
				if(e.target.id.indexOf(decoderPlayer._childNormalIdName) > -1){
					var index = e.target.id.split("_")[1];
					decoderPlayer._chilidMouseOver(index, e);
				}
			})
			childDiv.addEventListener("mouseleave", e => {
				if(e.target.id.indexOf(decoderPlayer._childNormalIdName) > -1){
					var index = e.target.id.split("_")[1];
					decoderPlayer._childMouseOut(index, e);
				}
			})
			childDiv.addEventListener("click", e => {
				if(e.target.id.indexOf(decoderPlayer._childNormalIdName) > -1
					|| e.target.id.indexOf(decoderPlayer._childCanvasIdName) > -1){
					var index = e.target.id.split("_")[1];
					decoderPlayer._childSelectedClick(index, e);
				}
			})
		}//end for i

        //分屏
		decoderPlayer.splitScreen(decoderPlayer._defaultSplitType);
		//监听全屏/退出的回调处理
		decoderPlayer._applyExitFullScreenEvent(function(isFull, event){
			//判断是哪一分屏
			var screenIndex = event.target.id.split("_")[1];

			//2020.11.6
			if( event.target.id == 'MonitorId' ||  event.target.id == 'MeetingContainer' || event.target.id == 'MonitorContainer'||event.target.id == 'imageShowContainer'){
				//刷新childDiv显示
				decoderPlayer._refreshUI();
				//执行
				if(decoderPlayer._fullScreenOperateCB != null){
					decoderPlayer._fullScreenOperateCB(isFull);
				}
			}

			if(screenIndex == undefined || screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
			decoderPlayer._screens[screenIndex].isFull = isFull;
			//记录变更的分屏，用于回调
			let businessScreens = [];
			//全屏操作下，非本屏，业务中，当前分屏以内，非暂停的分屏-----设置为暂停
			//退出操作下，非本屏，业务中，当前分屏以内，暂停的分屏-------取消暂停
			//本屏，业务中-------------------------------------------调整分辨率
			for(var i = 0; i < decoderPlayer._screens.length; i++){
				if(i >= decoderPlayer._currentSplitCount) break;
				let screenInfo = decoderPlayer._screens[i];
				if(isFull && i != screenIndex && screenInfo.business != BUSINESS_NONE && !screenInfo.isSuspended){
					screenInfo.isSuspended = true;
					businessScreens.push({screenIndex: i, type: 1})
				}
				if(!isFull && i != screenIndex && screenInfo.business != BUSINESS_NONE && screenInfo.isSuspended){
					screenInfo.isSuspended = false;
					businessScreens.push({screenIndex: i, type: 2})
				}
				if(i == screenIndex && screenInfo.business != BUSINESS_NONE){
					businessScreens.push({screenIndex: i, type: 3})
				}
			}
			//刷新childDiv显示
			decoderPlayer.allFull=false;
			decoderPlayer._refreshUI();
			//执行
			if(decoderPlayer._fullScreenChangedCB != null && businessScreens.length > 0)
				decoderPlayer._fullScreenChangedCB(businessScreens, isFull);
        });
	},
	/**
	 *  初始化jsmpeg流媒体服务
	 */
	initMediaServer(fs,dr){
		if(!decoderPlayer._mediaServer){
			decoderPlayer._mediaServer = new wsConnect(fs,UUID())
			decoderPlayer._decodeResolution= dr
			console.log('初始化jsmpeg流媒体服务！')
		}
	},
	/**
	 * [resize 窗口大小改变]
	 * @return {[type]} [description]
	 */
	resize: function(containerWidth, containerHeight) {
		decoderPlayer._initLayout(containerWidth, containerHeight);
		// 重新计算分屏
		decoderPlayer.splitScreen(decoderPlayer._currentSplitType, true);
	},
	//分屏
	//isChangeSize 窗口大小改变事件
	splitScreen : function(splitType, isChangeSize){
		//保存分屏信息
		if(decoderPlayer._currentSplitType == splitType && isChangeSize != true) return;
		decoderPlayer._currentSplitType = splitType;
		decoderPlayer._convertSplitTypeToCount();
		//计算分屏位置
        switch (parseInt(splitType))
        {
            case SPLIT_TYPE_ONE:             // 1 分屏
            	decoderPlayer._fillStandardSplitInfos(1, 1);
            	break;
            case SPLIT_TYPE_TWO:             // 2 分屏
            	decoderPlayer._fillStandardSplitInfos(1, 2);
            	break;
            case SPLIT_TYPE_SIX:             // 6 分屏
            	decoderPlayer._fillStandardSplitInfos(2, 3);
            	break;
            case SPLIT_TYPE_FOUR:            // 4 分屏
            	decoderPlayer._fillStandardSplitInfos(2, 2);
            	break;
            case SPLIT_TYPE_NINE:            // 9 分屏
            	decoderPlayer._fillStandardSplitInfos(3, 3);
            	break;
            case SPLIT_TYPE_TWELVE:            // 12 分屏
            	decoderPlayer._fillStandardSplitInfos(3, 4);
            	break;
            case SPLIT_TYPE_SIXTEEN:            // 16 分屏
            	decoderPlayer._fillStandardSplitInfos(4, 4);
            	break;
            case SPLIT_TYPE_TWENTFOUR:            // 24 分屏
            	decoderPlayer._fillStandardSplitInfos(4, 6);
            	break;
            case SPLIT_TYPE_TWENTFIVE:            // 25 分屏
                decoderPlayer._fillStandardSplitInfos(5, 5);
                break;
            case SPLIT_TYPE_THIRTYTWO:            // 32 分屏
            	decoderPlayer._fillStandardSplitInfos(4, 8);
            	break;
            case SPLIT_TYPE_THIRTYSIX:            // 36 分屏
                decoderPlayer._fillStandardSplitInfos(6, 6);
                break;
            case SPLIT_TYPE_ONE_PLUS_FIVE:   // 1+5 分屏
            	decoderPlayer._fillMergeSplitInfos(3, 3, 2, 2);
            	break;
            case SPLIT_TYPE_ONE_PLUS_SEVEN:   // 1+7 分屏
            	decoderPlayer._fillMergeSplitInfos(4, 4, 3, 3);
            	break;
            case SPLIT_TYPE_ONE_PLUS_ELEVEN:   // 1+11 分屏
                decoderPlayer._fillMergeSplitInfos(6, 6, 5, 5);
                break;
            case SPLIT_TYPE_TWO_PLUS_EIGHT:   // 2+8 分屏
                decoderPlayer._fillSplitTwoPlusEight(4, 4, 2, 2);
                break;
		}//end switch

		//记录变更的分屏，用于回调
		let businessScreens = [];
		//业务中，当前分屏以外，非暂停的分屏-----设置为暂停
		//业务中，当前分屏以内，暂停的分屏-------取消暂停
		//业务中，当前分屏以内，的分屏-----------调整分辨率
		if(isChangeSize != true){
			for(var i = 0; i < decoderPlayer._screens.length; i++){
				let screenInfo = decoderPlayer._screens[i];
				if(screenInfo.business != BUSINESS_NONE && i >= decoderPlayer._currentSplitCount && !screenInfo.isSuspended){
					screenInfo.isSuspended = true;
					businessScreens.push({screenIndex: i, type: 1})
				}
				if(screenInfo.business != BUSINESS_NONE && i < decoderPlayer._currentSplitCount && screenInfo.isSuspended){
					screenInfo.isSuspended = false;
					businessScreens.push({screenIndex: i, type: 2})
				}
				if(screenInfo.business != BUSINESS_NONE && i < decoderPlayer._currentSplitCount){
					businessScreens.push({screenIndex: i, type: 3})
				}
			}
		}
		//刷新childDiv显示
        decoderPlayer._refreshUI();
		//
		if(decoderPlayer._afterSplitScreenCB != null && businessScreens.length > 0)
				decoderPlayer._afterSplitScreenCB(businessScreens);
    },
	//刷新屏数据
	refreshDataByIndex : function(screenIndex, data, width, height){
			if(screenIndex == undefined || screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
			let screenInfo = decoderPlayer._screens[screenIndex];
			if(screenInfo.business != BUSINESS_NONE && !screenInfo.isSuspended && screenInfo.isDisplay){
				screenInfo.webglCanvas.renderImg(width, height, data);
			}
	},
	/**
	 * 获取媒体流路数
	 */
	getCountInBusiness : function(){
		var count = 0;
		for(var i = 0; i < decoderPlayer._screens.length; i++){
			let screenInfo = decoderPlayer._screens[i];
			if(screenInfo.business != BUSINESS_NONE){
				count++;
			}
		}
		return count;
    },
	//开始显示
	//resType:0:人员,1:设备,2.文件频道，3.录像
	startShow : function(screenIndex, resType, resID, resName, department, center, soundOff){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		//判断是否需要重新分屏
		if(screenIndex >= decoderPlayer._currentSplitCount){
			//需要重新分屏
			var newSplitType = decoderPlayer._getNextSplitType(decoderPlayer._currentSplitType);
			decoderPlayer.splitScreen(newSplitType);
		}//end if
		const curScreen = decoderPlayer._screens[screenIndex];
		curScreen.isSelected = false;     //是否选中
		//decoderPlayer._screens[screenIndex].resID      = resID;     //资源ID
		//decoderPlayer._screens[screenIndex].resName    = resName;   //资源名称
		//decoderPlayer._screens[screenIndex].department = department;//所属部门
		//decoderPlayer._screens[screenIndex].center     = center;    //所属中心
		//decoderPlayer._screens[screenIndex].business   = business;  //显示设备点播
		//设置点播的资源类型
		curScreen.business = BUSINESS_PERSON_PLAY;//默认
		if(resType == 0) curScreen.business = BUSINESS_PERSON_PLAY;
		if(resType == 1) curScreen.business = BUSINESS_DEVICE_PLAY;
		//判断是点播还是回放
		let newScreenType = 1;
		if(resType == 3) newScreenType = 2;
		curScreen.screenType	= newScreenType;
		curScreen.isSuspended = false;    //是否已暂停
		//decoderPlayer._screens[screenIndex].soundOff    = soundOff; //声音是否已关闭
		curScreen.isFull      = false;    //是否全屏显示

		decoderPlayer._refreshUI();

		// // 全免直接调用点播
		// if(decoderPlayer._playerType){
		// 	curScreen.webglCanvas.startPlay();
		// }
	},
	/**
	 * jsmpeg播放器相关方法 点播、暂停、停止、声音调节
	 * @param {点播信息} options 
	 * pos 分屏号
	 */
	startPlayJsmpeg(options){
		const curScreen = decoderPlayer._screens[options.pos];
		if(curScreen){
			curScreen.webglCanvas.startPlay(options);
		}
	},
	// 暂停播放
	puasePlayJsmpeg(pos){

	},
	// 停止播放
	stopPlayJsmpeg(pos){

	},
	//resType:0:人员,1:设备,2.文件频道，3.录像
	startShowByRTMP(screenIndex, resType, rtmpURL, urlType) {
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		//判断是否需要重新分屏
		if(screenIndex >= decoderPlayer._currentSplitCount){
			//需要重新分屏
			var newSplitType = decoderPlayer._getNextSplitType(decoderPlayer._currentSplitType);
			decoderPlayer.splitScreen(newSplitType);
		}//end if
		decoderPlayer._screens[screenIndex].isSelected = false;     //是否选中
		//decoderPlayer._screens[screenIndex].resID      = resID;     //资源ID
		//decoderPlayer._screens[screenIndex].resName    = resName;   //资源名称
		//decoderPlayer._screens[screenIndex].department = department;//所属部门
		//decoderPlayer._screens[screenIndex].center     = center;    //所属中心
		//decoderPlayer._screens[screenIndex].business   = business;  //显示设备点播
		//设置点播的资源类型
		decoderPlayer._screens[screenIndex].business = BUSINESS_PERSON_PLAY;//默认
		if(resType == 0) decoderPlayer._screens[screenIndex].business = BUSINESS_PERSON_PLAY;
		if(resType == 1) decoderPlayer._screens[screenIndex].business = BUSINESS_DEVICE_PLAY;
		//判断是点播还是回放
		let newScreenType = 1;
		if(resType == 2) newScreenType = 2;
		if(resType == 3) newScreenType = 0;
		// if(resType == 2 || resType == 3) newScreenType = 0;
		decoderPlayer._screens[screenIndex].screenType	= newScreenType;
		decoderPlayer._screens[screenIndex].isSuspended = false;    //是否已暂停
		//decoderPlayer._screens[screenIndex].soundOff    = soundOff; //声音是否已关闭
		decoderPlayer._screens[screenIndex].isFull      = false;    //是否全屏显示
		decoderPlayer._screens[screenIndex].isRTMP 		= true;         //是否是rtmp
		decoderPlayer._screens[screenIndex].urlType 	= urlType;         //视频格式
		decoderPlayer._screens[screenIndex].rtmpURL 	= rtmpURL;  // 播放视频地址
		decoderPlayer._refreshUI();
		// debugger
		// decoderPlayer._screens[screenIndex].video.setUrl(rtmpURL);
		
	},
	//停止显示
	stopShow : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].isSelected = false;     //是否选中
		decoderPlayer._screens[screenIndex].resID       = "";        //资源ID
		decoderPlayer._screens[screenIndex].resName     = "";        //资源名称
		decoderPlayer._screens[screenIndex].department  = "";        //所属部门
		decoderPlayer._screens[screenIndex].center      = "";        //所属中心
		decoderPlayer._screens[screenIndex].business    = BUSINESS_NONE;//显示设备点播
		decoderPlayer._screens[screenIndex].isSuspended = false;    //是否已暂停
		decoderPlayer._screens[screenIndex].soundOff    = true; 	//声音是否已关闭
		decoderPlayer._screens[screenIndex].isFull      = false;    //是否全屏显示
		decoderPlayer._screens[screenIndex].isRecording = false;    //是否开启录像
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].isRTMP = false;         //是否是rtmp
			decoderPlayer._screens[screenIndex].video.destroy();
			decoderPlayer._screens[screenIndex].video = null;
			decoderPlayer._containerDiv.children[screenIndex].children[4].style.display = 'none';
		}
		decoderPlayer._refreshUI();
	},
	//停止所有
	stopAllShow : function(){
		if(!decoderPlayer._screens) return
		for(var i = 0; i < decoderPlayer._screens.length; i++){
			if(decoderPlayer._screens[i].business != BUSINESS_NONE){
				var screenIndex = i;
				decoderPlayer._screens[screenIndex].isSelected = false;     //是否选中
				decoderPlayer._screens[screenIndex].resID       = "";        //资源ID
				decoderPlayer._screens[screenIndex].resName     = "";        //资源名称
				decoderPlayer._screens[screenIndex].department  = "";        //所属部门
				decoderPlayer._screens[screenIndex].center      = "";        //所属中心
				decoderPlayer._screens[screenIndex].business    = BUSINESS_NONE;//显示设备点播
				decoderPlayer._screens[screenIndex].isSuspended = false;    //是否已暂停
				decoderPlayer._screens[screenIndex].soundOff    = true; //声音是否已关闭
				decoderPlayer._screens[screenIndex].isFull      = false;    //是否全屏显示
				decoderPlayer._screens[screenIndex].isRecording = false;    //是否开启录像 
				if (decoderPlayer._screens[screenIndex].isRTMP) {
					decoderPlayer._screens[screenIndex].isRTMP = false;         //是否是rtmp
					decoderPlayer._screens[screenIndex].video.destroy();
					decoderPlayer._screens[screenIndex].video = null;
					decoderPlayer._containerDiv.children[screenIndex].children[4].style.display = 'none';
				}
			}
		}
		decoderPlayer._refreshUI();
	},
	// 根据屏幕下标判断改屏幕是否是rtmp
	isRTMP: function(screenIndex) {
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		const screen = decoderPlayer._screens[screenIndex]
		if(screen){
			return screen.isRTMP
		}else{
			return false
		}
	},
	//暂停显示
	suspendShow : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].isSuspended = true;    //是否已暂停
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].video.pause();
		}
		if(decoderPlayer._playerType){
			decoderPlayer._screens[screenIndex].webglCanvas.pausePlay();
		}
		decoderPlayer._refreshUI();
	},
	//取消暂停显示
	cancelSuspendShow : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].isSuspended = false;    //是否已暂停
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].video.play();
		}
		if(decoderPlayer._playerType){
			decoderPlayer._screens[screenIndex].webglCanvas.cancelPausePlay();
		}
		decoderPlayer._refreshUI();
	},
	/**
	 * [setOSD 设置字幕样式]
	 * @param {number}  screenIndex [窗口位置下标]
	 * @param {number}  osdIndex    [osd的id]
	 * @param {string}  osdInfo     [osd的内容]
	 * @param {string}  fontFamily  [osd的字体]
	 * @param {string}  fontColor   [osd的颜色（16进制，RRGGBB）]
	 * @param {number}  isBold      [osd是否粗体(0/1)]
	 * @param {number}  isItalic    [osd是否斜体(0/1)]
	 * @param {number}  offsetX     [osd向窗口左右偏移-以窗口的百分比（basePoint=2/4左偏移，basePoint=1/3右偏移）]
	 * @param {number}  offsetY     [osd在窗口上下偏移-以窗口的百分比（basePoint=1/2下偏移，basePoint=3/4上偏移）]
	 * @param {number}  basePoint   [osd左边原点（1左上，2右上，3左下，4右下）]
	 * @param {number}  fontSize    [osd字号，传入的是转换后的像素（fontSize>0有效，否则字体大小根据字体的宽高计算）]
	 * @param {number}  fontWidth   [osd字体的宽（注fontSize<0有效，通过分屏宽度 * 当前值计算）]
	 * @param {number}  fontHeight  [osd字体的高]
	 */
	setOSD(screenIndex, osdIndex, osdInfo, fontFamily, fontColor, isBold, isItalic, offsetX, offsetY, basePoint, fontSize, fontWidth, fontHeight) {
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		let screenInfo = decoderPlayer._screens[screenIndex];
		let childDiv = decoderPlayer._containerDiv.children[screenIndex];
		let containerWidth = childDiv.offsetWidth;
		let containerHeight = childDiv.offsetHeight;
		// 字幕样式设置
		let bold = isBold == 1 ? 'bold' : 'normal';
		let italic = isItalic == 1 ? 'italic' : 'normal';
		let x = containerWidth * offsetX;
		let y = containerHeight * offsetY;
		/*let positionStr = '';
		switch (basePoint) {
			case 1:
				positionStr = `left: ${x}px; top: ${y}px`;
				break;
			case 2:
				positionStr = `right: ${x}px; top: ${y}px`;
				break;
			case 3:
				positionStr = `left: ${x}px; bottom: ${y}px`;
				break;
			case 4:
				positionStr = `right: ${x}px; bottom: ${y}px`;
				break;
			default:
				positionStr = `left: ${x}px; top: ${y}px`;
		}*/
		// 显示内容转换
		let textContent = osdInfo === 'date' ? new Date().formatDate('yyyy-MM-dd HH:mm:ss') : osdInfo;
		// 字号转换
		let size = fontSize > 0 ? fontSize : containerWidth * fontWidth;

		let osdDiv = document.createElement('div');
		let osdId = decoderPlayer._childOsdIdName + osdIndex;
		osdDiv.id = osdId;
		osdDiv.className = decoderPlayer._childOsdClassName;
	//	osdDiv.style = `font-family: ${fontFamily};color: #${fontColor};font-size: ${size}px;font-weight: ${bold};font-style: ${italic};position: absolute;${positionStr};user-select: none`;
	osdDiv.style.fontFamily = fontFamily;
	osdDiv.style.color = fontColor;
	osdDiv.style.fontSize = size;
	osdDiv.style.fontWeight = bold;
	osdDiv.style.fontStyle = italic;
	osdDiv.style.position = 'absolute';
	osdDiv.style.userSelect = 'none';
	osdDiv.textContent = textContent;
	switch (basePoint) {
		case 1:
			// positionStr = `left: ${x}px; top: ${y}px`;
			osdDiv.style.left = `${x}px`;
			osdDiv.style.top = `${y}px`;
			break;
		case 2:
			// positionStr = `right: ${x}px; top: ${y}px`;
			osdDiv.style.right = `${x}px`;
			osdDiv.style.top = `${y}px`;
			break;
		case 3:
			// positionStr = `left: ${x}px; bottom: ${y}px`;
			osdDiv.style.left = `${x}px`;
			osdDiv.style.bottom = `${y}px`;
			break;
		case 4:
			// positionStr = `right: ${x}px; bottom: ${y}px`;
			osdDiv.style.right = `${x}px`;
			osdDiv.style.bottom = `${y}px`;
			break;
		default:
			// positionStr = `left: ${x}px; top: ${y}px`;
			osdDiv.style.left = `${x}px`;
			osdDiv.style.top = `${y}px`;
	}
		childDiv.appendChild(osdDiv);
		//保存osd部分属性
		screenInfo.osdArray.push({osdIndex: osdIndex, offsetX: offsetX, offsetY: offsetY, basePoint: basePoint, fontSize: fontSize, fontWidth: fontWidth, fontHeight: fontHeight});
		//时间类型osd动态变化
		if (osdInfo == 'date') {
			let timer = setInterval(function () {
				if (childDiv.querySelector(`#${osdId}`)) {
					childDiv.querySelector(`#${osdId}`).innerText = new Date().formatDate('yyyy-MM-dd HH:mm:ss');
				}
			}, 1000);
			screenInfo.osdTimerArray.push({ id: osdIndex, timer: timer });
		}
	},
	/**
	 * [cancelOSD 取消字幕样式]
	 * @param  {number} screenIndex [窗口位置下标]
	 * @param  {array}  osdIndexs   [osd的id。 (注：不传值删除所有字幕，传值删除指定字幕)]
	 */
	cancelOSD(screenIndex, osdIndexs) {
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		let screenInfo = decoderPlayer._screens[screenIndex];
		let childDiv = decoderPlayer._containerDiv.children[screenIndex];
		// 清除
		let clearOSD = function(id) {
			let index_ = id.replace(decoderPlayer._childOsdIdName, "");
			// 清除osd
			let ind_ = screenInfo.osdArray.findIndex(i => i.osdIndex == index_)
			screenInfo.osdArray.splice(ind_, 1)
			// 清除计时器
			let timerIndex = screenInfo.osdTimerArray.findIndex(i => i.id == index_);
			if (timerIndex !== -1) {
				clearInterval(screenInfo.osdTimerArray[timerIndex].timer);
				screenInfo.osdTimerArray.splice(timerIndex, 1);
			}
		}
		// osdid为空删除所有
		if (osdIndexs && osdIndexs.length > 0) {
			osdIndexs.forEach(item => {
				childDiv.removeChild(document.querySelector(`#${decoderPlayer._childOsdIdName + item}`));
				clearOSD(item);
			});
		} else {
			// 查找分屏下的osd标签
			let osdDivAll = childDiv.querySelectorAll(`.${decoderPlayer._childOsdClassName}`);
			[].forEach.call(osdDivAll, function(item){
				childDiv.removeChild(item);
				clearOSD(item.id);
			});
		}
	},
	//取消所有osd
	cancelAllOSD : function(){
		if(decoderPlayer._containerDiv == null || decoderPlayer._screens == null) return;
		for(var i = 0; i < decoderPlayer._screens.length; i++){
			if(decoderPlayer._screens[i].business != BUSINESS_NONE){
				var screenIndex = i;
				this.cancelOSD(screenIndex)
			}
		}
		decoderPlayer._refreshUI();
	},
	// 设置拼接器osd
    setOSDByJoin(splitType, osdItems) {
        decoderPlayer._splitTypeOfJoin = splitType;
        let childDiv = decoderPlayer._containerDiv.children[0];
        decoderPlayer.cancelOSDByJoin();
        osdItems.forEach(item => {
            let osdDiv = document.createElement('div');
            osdDiv.id = item.encoderID;
            osdDiv.className = decoderPlayer._childOsdJoinClassName;
		 //   osdDiv.style = `font-family: Avenir, Helvetica, Arial, sans-serif;color: palegoldenrod;font-size: 16px;font-weight: bold;position: absolute;;user-select: none`;
		 osdDiv.style.color = 'red';
		 osdDiv.style.fontSize = '18px';
		 osdDiv.style.fontWeight = 'bold';
		 osdDiv.style.position = 'absolute';
		 osdDiv.style.userSelect = 'none';
            osdDiv.textContent = item.memberName;
            childDiv.appendChild(osdDiv);
            decoderPlayer._osdItemsOfJoin.push(osdDiv)
        })
        decoderPlayer._computeOSDLocation_join();
        
    },
    cancelOSDByJoin(screenIndex) {
        if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
        let screenInfo = decoderPlayer._screens[0];
        let childDiv = decoderPlayer._containerDiv.children[0];
        let osdDivAll = childDiv.querySelectorAll(`.${decoderPlayer._childOsdJoinClassName}`);
        decoderPlayer._osdItemsOfJoin = [];
        [].forEach.call(osdDivAll, function(item){
            childDiv.removeChild(item);
        });        
    },
	// 设置声音控制条
    setVolume: function(screenIndex, vol){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
    	let screenInfo = decoderPlayer._screens[screenIndex];
		screenInfo.volume.setValue(vol);
        screenInfo.volumeValue = vol;
	},
	getVolume: function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
    	let screenInfo = decoderPlayer._screens[screenIndex];
		return screenInfo.volume.getValue();
	},
	//开声音
	soundOffShow : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].soundOff    = false; //声音是否已关闭
		// decoderPlayer._screens[screenIndex].volume.isDisabled(false); //恢复声音条
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].video.muted(false);
		}

		decoderPlayer._refreshUI();
	},
	//关声音
	soundOnShow : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].soundOff    = true; //声音是否已关闭
		// decoderPlayer._screens[screenIndex].volume.isDisabled(true); //禁用声音条
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].video.muted(true);
		}
		
		decoderPlayer._refreshUI();
	},
	//启用/禁用所有声音
	isDisabledAllVolume: function(isDisabled){
		for(var i = 0; i < decoderPlayer._screens.length; i++){
			if(decoderPlayer._screens[i].business != BUSINESS_NONE){
				var screenIndex = i;
				if(isDisabled) this.soundOffShow(screenIndex)
				else this.soundOnShow(screenIndex)
			}
		}
	},
	//全屏
	fullScreenShow : function(screenIndex){
		//执行全屏操作
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		decoderPlayer._launchIntoFullScreen(childDiv);
		//decoderPlayer._screens[screenIndex].isFull    = true; //是否全屏
		// decoderPlayer._refreshUI();

		// if(decoderPlayer._fullScreenOperateCB != null && businessScreens.length > 0)
		// 	decoderPlayer._fullScreenOperateCB(businessScreens);
	},
	//全屏 wxx 2020.11.4
	fullScreenShowAll : function(){
		//执行全屏操作
		var childDiv = decoderPlayer._containerDiv;
		decoderPlayer._launchIntoFullScreen(childDiv);
		// setTimeout(function(){
		// 	let containerWidth=window.screen.width;
		// 	let containerHeight=window.screen.height;
		// 	decoderPlayer.resize(containerWidth, containerHeight)
		// },50)
	},
	//取消全屏
	cancelFullScreenShow : function(screenIndex){
		//decoderPlayer._screens[screenIndex].isFull    = false; //是否全屏
		//decoderPlayer._refreshUI();
		decoderPlayer._exitFullScreen();
	},
	// 设置按钮状态
	changeButton(screenIndex, btnKey){
		let childDiv = decoderPlayer._containerDiv.children[screenIndex];
		let operateDiv = childDiv.children[1];
        if(btnKey == decoderPlayer._btnKeySoundOff) {
			let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOn)
			if( curBtn ) {
				curBtn.id = decoderPlayer._btnKeySoundOff;
				curBtn.src = decoderPlayer._imgSoundOff;
			}
			return;
		}
		if(btnKey == decoderPlayer._btnKeySoundOn) {
			let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeySoundOff);
			//console.log('curBtn', curBtn);
			if( curBtn ) {
				curBtn.id = decoderPlayer._btnKeySoundOn;
				curBtn.src = decoderPlayer._imgSoundOn;
			}
			return;
		}
		if(btnKey == decoderPlayer._btnKeyStartRecord) {
			let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStopRecord)
			curBtn.id = decoderPlayer._btnKeyStartRecord;
			curBtn.src = decoderPlayer._imgStartRecord;
            decoderPlayer._screens[screenIndex].isRecording = false;    //是否开启录像
			curBtn.title = '开启录像';
			return;
		}
		if(btnKey == decoderPlayer._btnKeyStopRecord) {
			let curBtn = operateDiv.querySelector("#" + decoderPlayer._btnKeyStartRecord)
			curBtn.id = decoderPlayer._btnKeyStopRecord;
			curBtn.src = decoderPlayer._imgStopRecord;
            decoderPlayer._screens[screenIndex].isRecording = true;    //是否开启录像
			curBtn.title = '停止录像';
			return;
		}
	},

	// 添加录像回放进度条
	initTimeProgeress(screenIndex, startTime, endTime) {
		var screenInfo = decoderPlayer._screens[screenIndex];
		var childDiv = decoderPlayer._containerDiv.children[screenIndex];
		var operateDiv = childDiv.children[1];
		screenInfo.playTime.startTime = startTime;
		screenInfo.playTime.endTime = endTime;
		let progress = new Slider(operateDiv.querySelector('.video-progress'), screenInfo.playTime.curTime, {circleSize: 12, type: 'date', startValue: screenInfo.playTime.startTime, endValue: screenInfo.playTime.endTime});
		progress.setAfterChangedCallback(time => {
			screenInfo.playTime.curTime = time;
			if(decoderPlayer._playerBtnEventCB != null)
				decoderPlayer._playerBtnEventCB(screenIndex, 'Record_Progress', screenInfo.playTime.curTime)
				screenInfo.video.setCurrentTime(screenInfo.playTime.curTime);
		});
	},
    // 抓拍
	shoot(screenIndex){
		var screenInfo = decoderPlayer._screens[screenIndex];
		return screenInfo.webglCanvas.getShoot();
	},
	//倍速播放
	playbackRate : function(screenIndex){
		if(screenIndex == -1 || screenIndex >= decoderPlayer._maxScreenCount) return;
		decoderPlayer._screens[screenIndex].isSuspended = false;    //是否已暂停
		if (decoderPlayer._screens[screenIndex].isRTMP) {
			decoderPlayer._screens[screenIndex].video.playbackRate();
		}
		decoderPlayer._refreshUI();
	},
	destroy(){
		if(decoderPlayer._mediaServer){
			decoderPlayer._mediaServer.destroy()
			decoderPlayer._mediaServer = null
		}
	},
	setSuspendOperateCallback          : function(callback){ decoderPlayer._suspendOperateCB          = callback; },
	setCancelSuspendOperateCallback    : function(callback){ decoderPlayer._cancelSuspendOperateCB    = callback; },
	setStopOperateCallback             : function(callback){ decoderPlayer._stopOperateCB             = callback; },
	setSoundOnOperateCallback          : function(callback){ decoderPlayer._soundOnOperateCB          = callback; },
	setSoundOffOperateCallback         : function(callback){ decoderPlayer._soundOffOperateCB         = callback; },
	setYTControlOperateCallback        : function(callback){ decoderPlayer._ytControlOperateCB        = callback; },
	setFullScreenOperateCallback       : function(callback){ decoderPlayer._fullScreenOperateCB       = callback; },
	//setAfterCancelFullScreenCallback   : function(callback){ decoderPlayer._afterCancelFullScreenCB   = callback; },
	setAfterSelectedScreenCallback     : function(callback){ decoderPlayer._afterSelectedScreenCB     = callback; },
	//1119云调度拖动点播
	setAfterSelectedScreenDropCallback : function(callback){ decoderPlayer._afterSelectedScreenDropCB = callback; },
	setAfterSplitScreenCallback		   : function(callback){ decoderPlayer._afterSplitScreenCB	      = callback; },

	setPlayerBtnEventCallback		   : function(callback){ decoderPlayer._playerBtnEventCB	      = callback; },
	setFullScreenChangedCallback   	   : function(callback){ decoderPlayer._fullScreenChangedCB   	  = callback; },
	setAfterVolumeChangedCallback	   : function(callback){ decoderPlayer._afterVolumeChangedCB      = callback; },
	setAfterPicQualityChangedCallback  : function(callback){ decoderPlayer._afterPicQualityChangedCB  = callback; },

}
export var webglPlayer = decoderPlayer;
