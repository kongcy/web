import { runInThisContext } from "vm"
import {UUID} from '../utils/commfun'

const resolutionMap = {
    '480P':[640,480],
    '720P':[1280,720],
    '1080P':[1920,1080]        
}

export default class JsmpegScreen {
    constructor(cid,ms,dr) {
        this.cid =  cid  
        this.mediaServer = ms
        this.videoPlayer = null
        this.audioPlayer = null 
        this.decodeResolution = resolutionMap['480P']
        if(dr&&resolutionMap.hasOwnProperty(dr)){
            this.decodeResolution = resolutionMap [dr]
            console.log("jsmpeg解码分辨率:"+this.decodeResolution)
        }
    }
    startPlay(options){ 
        if(options.isAudio){
            return
        }
        if(this.videoPlayer){
            this.videoPlayer.close()
            this.videoPlayer = null
        }
        const _pContainer = $(`#${this.cid}`).parent()
        if(_pContainer.length>0){ 
            this.videoPlayer = new $(_pContainer[0]).video(this.mediaServer,this.cid,UUID(),false,(obj)=>{

            }) 
        }  
        const player = this.videoPlayer
        if(player){
            const r= this.decodeResolution;
            const params = {
                url: options.rtsp, //'rtsp://11.55.10.140:8557/0', //'rtsp://13.55.10.192:8557/0', //
                userName: "admin", 
                passWord: "yzfar123",
                width: r[0],//1280,//_pContainer.width(),
                height:r[1],//720, //_pContainer.height(),
                type: 0
              } 
              player.play(params,(e)=>{
                if(e){
                  if(this.onPlaySuceessCB){
                    this.onPlaySuceessCB()
                  } 
                }
                else{
                  console.error('点播失败,流媒体服务连接失败!')
                }
              }) 
        }
    }
    pausePlay(){
        const vp = this.videoPlayer
        const ap = this.audioPlayer
        if(vp){
            vp.switchPlay()
        }
        if(ap){
            ap.switchPlay()
        }
    }
    cancelPausePlay(){
        this.pausePlay()
    }

    /**
     * 根据重新设置 canvas 大小
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} maxWidth 最大宽度
     */
    setSize(width, height) { 
        const video = this.videoPlayer;
        if(video){
            video.setSize(width,height)
        }
    }

    /**
     * 获取canvas大小
     */
    getSize() {
        const canvas = document.getElementById(this.cid)
        return {
            width: canvas?canvas.width:0,
            height: canvas?canvas.height:0 
        }
    } 
    /**
     * 销毁
     */
    destroy() {
        // 关闭视频
        if(this.videoPlayer){
            this.videoPlayer.close()
            this.videoPlayer = null
        }
        // 关闭音频
        if(this.audioPlayer){
            this.audioPlayer.close()
            this.audioPlayer = null
        }
    }

    /**
     * 抓拍
     */
    getShoot() {
        const canvas = document.getElementById(this.cid)
        if(canvas){
            let data =  canvas.toDataURL("image/png"); // 将转码的base64 传出去展示出来 
            // let data2 = canvas.getContext('webgl').canvas.toDataURL('image/png');
            // debugger
           this.savePicture(data);
           return data;
        } 
    }
    /**
     * 抓拍时 图片保存在本地
     */
    savePicture(data){
        let base64ToBlob = function (code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for(let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        };
        let aLink = document.createElement('a');
        let blob = base64ToBlob(data);
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent("click", true , true);
        aLink.download = Math.ceil(Math.random()*100000000);
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
    }
}
