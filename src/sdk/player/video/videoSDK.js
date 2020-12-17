// import './video'
// import './video.css'
let defaultUrl = './ocwans.png' //放视频预加载时显示的图片
let flashUrl = './video-js.swf'
export default class vedioJs {
    constructor(id, width, height, url) {
        this.id = id
        this.width = width
        this.height = height
        this.vedioId = this.id + '_vedio'
        this.sourseId = this.vedioId + '_source'
        this.url = url
        // videojs.options.flash.swf = flashUrl
        let options = {
            autoplay: true,
            preload: 'none',
            muted: false,
            control: false,
            //fluid:　true,
            width: this.width,
            height: this.height,
            //poster: defaultUrl,
            //techOrder: ['flash'],
            sources: [
                {
                    src: url,
                    type: 'video/x-flv'
                }
            ]
        }
        // console.log()
        this.init()
        let _this = this;
        this.player = videojs(this.vedioId, options, function onPlayerReady() {
            console.log('onPlayerReady1')
            // _this.player.src({
            //     src: _this.url,
            //     type: 'video/x-flv'
            // });
            // _this.player.load();
            // _this.player.play();
        })
        
        // this.player.on('error', function(e){
        //     console.log('error')
        //     _this.player.src({
        //         src: _this.url,
        //         type: 'video/x-flv'
        //     });
        //     _this.player.ready(function(){
        //         console.log('onPlayerReady2')
        //         _this.player.load()
        //         _this.player.play()
        //     })
        // })
    }
    init() {
        let vedioDom = document.createElement('video')
        vedioDom.setAttribute('id', this.vedioId)
        vedioDom.setAttribute('class', 'video-js vjs-default-skin vjs-big-play-centered')

        let sourseDom = document.createElement('source')
        sourseDom.setAttribute('id', this.sourseId)
        
        document.getElementById(this.id).appendChild(vedioDom)
        document.getElementById(this.vedioId).appendChild(sourseDom)

    }
    setUrl(url) { // 设置播放地址
        console.log('setUrl' + url);
        this.url = url;
    }
    play() { // 播放
        this.player.play()
    }
    pause() { // 暂停
        this.player.pause()
    }
    playbackRate() { // 快放
        this.player.playbackRate(2)
    }
    defaultPlaybackRate() { // 慢放
        this.player.playbackRate(0.5)
    }
    currentPlayRate() { // 常速播放
        this.player.playbackRate(1)
    }
    muted() { // 静音
        this.player.muted(true)
    }
    volume() { // 放音
        this.player.muted(false)
    }
    setCurrentTime() { // 回到某个时间点从新播放
        this.player.currentTime(5)
    }
    destroy() { // 播放停止
        this.player.dispose()
    }
    setSize(width, height) {
        this.player.width(width);
        this.player.height(height);
    }
}