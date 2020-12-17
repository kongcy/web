// import {playerSDKNew} from "../playerSDK"
// import apiSDK from "../../apiSDK"
import img_stop from '../img/img_stop.png'
export default class hlsVideoJs {
    constructor(id, width, height,rtmpURL,screenIndex) {
        this.id = id
        this.width = width
        this.height = height
        this.vedioId = this.id + '_vedio'
        this.sourseId = this.vedioId + '_source'
        this.url = rtmpURL
        this.STREAM_ID = this.NewGuid();
        this.MEMBER_NAME = "";
        this.screenIndex = screenIndex;
        this._stopShowHlsCB = null;
        var _that = this;
        this.init();
        // document.querySelector('#'+ this.id +' .media-control').remove() //删除自带操作栏

        this.btnstop = document.createElement("button");
        this.btnstop.style.background = "url("+img_stop+") no-repeat"
        setTimeout(() => {
            this.btnstop.className = 'media-control-button media-control-icon stop'
            let first = document.querySelector('#'+ this.id +' .media-control .media-control-left-panel').firstChild
            document.querySelector('#'+ this.id +' .media-control .media-control-left-panel').insertBefore(this.btnstop,first)
        }, 100);
        this.btnstop.addEventListener('click', () => {
            // playerSDKNew.stopPlay(_that.screenIndex)
            // apiSDK.stopPlayByIndex(_that.screenIndex)
            if (this._stopShowHlsCB) {
                this._stopShowHlsCB(this.screenIndex);
            }
        })
    }
    init() {
        let _this = this;
        this.player = new pwplayer.Player({
            source:_this.url,
            playback: {
                flvjsConfig: {
                    // Params from flv.js
                    enableWorker: false,
                    lazyLoadMaxDuration: 3 * 60,
                    seekType: 'range',
                    isLive: false
                },
                hlsjsConfig: {
                    liveSyncDurationCount: 7, // To have at least 7 segments in queue
                },
            },
            rtmpConfig: {
                swfPath: 'dist/RTMP.swf',
                scaling:'stretch',
                //playbackType: 'live',
                bufferTime: 1,
                startLevel: 0
            }, 
            disableVideoTagContextMenu: true,
            autoPlay: true,
            height: _this.height,
            width: _this.width,
            powerStats: { 
                    baseurl: '', 
                    contentid: 'f39c571163d322f601641c589cdf004b',
                    videoname: 'out333', 
                    videoid: 'f39c571163d322f601641c59ebc5004d', 
                    username: _this.MEMBER_NAME
            },
            

        });
        var playerElement = document.getElementById(this.id);
        this.player.attachTo(playerElement);
        this.player.on('error', function(e){
            console.log(e.error)
        })
        console.log(this.player)
    }
    NewGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
        }
        return guid;
    }
    // setUrl(url) { 
    //     this.url = url;// 设置播放地址
    // }
    play() { // 播放
        this.player.play(true)
    }
    pause() { // 暂停
       this.player.pause(true) 
    }
    playbackRate() { // 快放
    }
    defaultPlaybackRate() { // 慢放
    }
    currentPlayRate() { // 常速播放
    }
    muted() { // 静音
    }
    volume() { // 放音
    }
    setCurrentTime(curTime) { // 回到某个时间点从新播放
    }
    destroy() { // 播放停止
        this.player.destroy();
    }
    setSize(width, height) {
        this.player.resize({
            width:width,
            height:height
        })
    }
    stopCB(cb) {
        if (cb) {
            this._stopShowHlsCB = cb;
        }
    }

}