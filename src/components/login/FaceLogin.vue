<template>
	<div class="login-face">
		<!-- <img :src="this.image" width="210" height="240"> -->
		<!-- 无摄像头 -->
		<div class="no-camera" v-if="mediaState === 0">
			<i class="el-icon-error"></i>
			<p class="msg">无法识别摄像头</p>
		</div>
		<!-- 识别区 -->
		<div v-if="mediaState === 1">
			<div class="video-cont">
				<video id="video" width="210" height="240"  style="object-fit: fill;"></video>
				<div class="video-mask"></div>
				<canvas style="display:none;" id="canvas" width="210" height="240" ></canvas>
				<center><p>识别中...</p></center>
				
			</div>
		</div>
		<div class="no-camera" v-if="mediaState === 2">
			<i class="el-icon-error"></i>
			<p class="msg">{{errorMsg}}</p>
			<center><el-button type="primary" size="large" @click="getUserMedia">重新识别</el-button></center>
		</div>
		<!-- 识别失败 -->
		<!-- <div id="tipBoxError" style="text-align: center;display: none;"> -->
			<!-- <div style="margin-top: 50px">
				<img src="views/face/img/erro.png" />
				<label style="margin-top: 30px;display: block;">验证失败</label>
			</div> -->
			<!-- <div style="margin-top: 35px">
				<input type="button" value="重新输入" style="height:54px; width:404px;" 
				       class="btnLoginStyle" onclick="againLogin()"/>
			</div> -->
			<!-- <div class="faceAgainBtnBox" style="margin-top: 35px">
				<div type="button" class="face-main-btn" onclick="againLogin()">重新输入</div>
			</div>	 -->					
		<!-- </div> -->
		
	</div>
</template>
<script>
export default {
    name: 'FaceLogin',
    data() {
        return {
        	mediaState: 1, // 0:无设备  1：连接成功  2：连接关闭
			streamObj: null,
			errorMsg: ""
        }
    },
    mounted () {},
    methods: {
    	getUserMedia() {
			this.mediaState = 1
    		xtxk.media.getUserMedia({video : {width: 210, height: 240}}, this.success, this.error)
    	},
  		// 访问摄像头成功
  		success(stream) {
			this.mediaState = 1
			this.streamObj = stream;
  			this.$nextTick(() => {
  				let media = document.querySelector('#video')
		  		let canvas = document.querySelector('#canvas') // 画布生成图片
		  		if ('srcObject' in media) {
			        media.srcObject = stream
			    } else {
			        media.src = xtxk.media.getStreamUrl(stream)
			    }
			    // 播放流
			    media.play()
			    media.onplaying = () => {
			    	// 生成图片
			    	let context = canvas.getContext('2d')
			    	context.drawImage(media, 0, 0, 210, 240)
			    	let image = canvas.toDataURL('image/png')
			    	// 登录
			    	this.apiSDK.loginwithface(image, res => {
		  				if (res && res.Ret === 0) {
		  					this.$store.commit("updateUserinfo", {token:res.token, userID:res.userId, userName:res.userName});
							xtxk.cache.set('USER', {token: res.token, userId: res.userId, userName:res.userName, validTime:res.validTime})
							this.apiSDK.initUserInfo(res.userId, res.userName, res.token);
		  					this.$router.push('Home');
		  				} else if(res && res.Ret === 1){
							  this.mediaState = 2
							  this.errorMsg = "未识别到人脸"
						} else {
							  this.mediaState = 2
							  this.errorMsg = "验证失败"
						}
						this.streamObj.getTracks()[0].stop();
		  			})
			    }
  			});
	    },
	    // 访问摄像头失败
	  	error(error) {
	  		this.mediaState = 0
	      	console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
	    }
    }
}
</script>
<style scoped>

.login-face{
	padding: 20px 0 0;
    
}
.login-face .video-cont{
	margin: 5px auto 0;
	width: 210px;
	position: relative;
}
.login-face .video-cont .video-mask{
	position: absolute;
	text-align: center;
	/*background: url(../../../static/face/bg.png) no-repeat center;*/
	border: 1px solid #ddd;
	z-index: 1;
	width: 208px;
    height: 238px;
    top: 0;
    left: 0;
}
.no-camera{
    text-align: center;
    padding-top: 60px;
}
.no-camera i{
	font-size: 70px;
}
.no-camera .msg{
	margin-top: 30px;
	color: #333;
	font-size: 14px;
}	
</style>