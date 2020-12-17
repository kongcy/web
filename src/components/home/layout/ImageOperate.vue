<template>
    <div>
    	<!-- 显示分屏按钮 -->
		<div class="button" v-for="(item, index) in screenTypeShow" :key="item.key" :class="item.class" :title="item.title" v-on:click="handleClick(item)"></div>
		<!-- 更多分屏 -->
		<!-- <el-popover
		  	placement="left"
		  	width="300"
		  	trigger="click">
		  	<div class="horizontal">
		  		<div class="button-text" v-for="(item, index) in screenTypeHide" :key="item.key" :class="item.class" v-on:click="handleClick(item)">{{item.title}}</div>
		  	</div>
		  	<el-button slot="reference" class="more-screen" title="更多分屏"></el-button>
		</el-popover> -->
		<!-- 其他按钮 -->
		<div class="button" v-for="(item, index) in btnName" :key="item.key" :class="item.class" :title="item.title" v-on:click="handleClick(item)"></div>
        <take-photo ref="takePhoto"></take-photo>
        <coding-source-config ref="codingSourceConfig"></coding-source-config>

		<!-- <bottom-nav ref="bottomNav"   v-if="activetabName=='Monitor'"/> -->
	</div>
</template>

<script>
import TakePhoto from '@/components/home/takePhotoDialog.vue'
import CodingSourceConfig from '@/components/home/CodingSourceConfigDialog.vue'
// import BottomNav from "@/components/home/layout/MonitorNavBottom.vue";

export default {
	name: "ImageOperate",
	components: {
		TakePhoto,
		CodingSourceConfig,
		// BottomNav
	},
	data () {
	   return {
	   		screenTypeShow: [
	   			{ title: '一分屏', class: 'screenOne'},
			   	{ title: '二分屏', class: 'screenTwo' },
			   	{ title: '四分屏', class: 'screenFour' },
			   	{ title: '六分屏', class: 'screenSix' },
			   	{ title: '一加五分屏', class: 'screenOneFive' },
			   	{ title: '九分屏', class: 'screenNine' },
			   	// { title: '十六分屏', class: 'screenSixteen' },
	   		],
	   		screenTypeHide: [
	   			{ title: '12分屏', class: 'screenTwelve'},
			   	{ title: '24分屏', class: 'OnlyTweentyFour' },
			   	{ title: '25分屏', class: 'OnlyTweentyFive' },
			   	{ title: '32分屏', class: 'OnlyThirtyTwo' },
			   	{ title: '36分屏', class: 'OnlyThirtySix' },
			   	{ title: '1+7分屏', class: 'One_Seven' },
			   	{ title: '1+11分屏', class: 'One_Eleven' },
			   	{ title: '2+8分屏', class: 'Two_Eight' },
			   	// { title: '画中画', class: 'OneInOne' },
	   		],
		   btnName : [
			   { title: '全部停止', class: 'stopAll' },
			//    { title: '全部静音', class: 'closeVoice' },
			   { title: '全屏', class: 'Allfullscreen' },
			//    { title: '多路抓拍', class: 'takePhoto' },
			//   { title: '编码源设置', class: 'codingSource' },
		   ],
		   activetabName:'',
	   }
	},
	mounted:function(){
		 this.activetabName=xtxk.cache.get('activeName');
		if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
			this.btnName.push({ title: '编码源设置', class: 'codingSource' });
		}
	},
	methods: {
		handleClick(btn){
			const curBtn = btn.class;
			if(curBtn == "stopAll"){
				// let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
				// if (screenArr.length > 0) {
					this.apiSDK.stopAll();
				// }
			} else if (curBtn == "closeVoice"){
				let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
				if (screenArr.length > 0) {
					this.apiSDK.setVolumeAllForPlugin(0);
					this.apiSDK.publishAllVolume(false,0);
					btn.class = 'openVoice';
					btn.title = '全部放音';
				}
			}else if (curBtn == "openVoice") {
				let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
				if (screenArr.length > 0) {
					this.apiSDK.setVolumeAllForPlugin(1);
					this.apiSDK.publishAllVolume(true,255);
					btn.class = 'closeVoice';
					btn.title = '全部静音';
				}
			}else if(curBtn == 'takePhoto'){
				let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
				if (screenArr.length == 0) {
					this.$message({
                        message: '没有点播视频，无法抓拍',
                        type: 'warning'
                    });
				} else {
					let imgData = [];
					screenArr.forEach(element => {
						var curDate = new Date();
						var fileName = element.resId +element.resCh+ curDate.getFullYear() + curDate.getMonth() + curDate.getDay() + curDate.getHours() + curDate.getMinutes() + curDate.getSeconds() + ".bmp";
						this.apiSDK.takeASnap(element.screenIndex, "D:/XtImg/" + fileName, "", res => {
							if (res.Ret == '0') {
								imgData.push({url: res.url, setIndex: element.screenIndex})
							}
						});
					});
					this.$refs.takePhoto.showDialog(imgData);
				}
			}else if(curBtn == 'codingSource'){
				let screenArr = JSON.parse(sessionStorage.getItem('currentScreen'));
				if (screenArr.length == 0) {
					this.$message({
                        message: '没有点播视频，无法设置',
                        type: 'warning'
					});
					return;
				}
				console.log(screenArr);
				let pos = sessionStorage.getItem('curSelectedPos');
				let deviceId = '';
				screenArr.forEach(item => {
					if( item.screenIndex == pos ){
						deviceId = item.resId;
					}
				})
				if( !deviceId ){
					this.$message({
                        message: '请选择点播中的视频',
                        type: 'warning'
					});
					return;
				}
				this.$refs.codingSourceConfig.showDialog(deviceId);
			}else if(curBtn == 'Allfullscreen'){
				//全屏
				this.apiSDK.setAllFullScreenForPlugin(true);
			}else{//分屏
				var param = 4;
				if(curBtn == "screenOne"){
					param = 1;
				}else if(curBtn == "screenTwo"){
					param = 12;
				}else if(curBtn == "screenFour"){
					param = 4;
				}else if(curBtn == "screenSix"){
					param = 100;
				}else if(curBtn == "screenNine"){
					param = 9;
				}else if(curBtn == "screenOneFive"){
					param = 6;
				}else if(curBtn == "screenSixteen"){
					param = 16;
				}else if (curBtn == "screenTwelve") {
					param = 15;
				} else if (curBtn == "OnlyTweentyFour") {
					param = 24;
				} else if (curBtn == "OnlyTweentyFive") {
					param = 25;
				} else if (curBtn == "OnlyThirtyTwo") {
					param = 32;
				} else if (curBtn == "OnlyThirtySix") {
					param = 36;
				} else if (curBtn == "One_Seven") {
					param = 8;
				} else if (curBtn == "One_Eleven") {
					param = 103;
				} else if (curBtn == "Two_Eight") {
					param = 110;
				} else if (curBtn == "OneInOne") {
					param = 2;
				}
				this.apiSDK.splitWidowForPlugin(param);
				this.apiSDK.publishSplitScreen(param);
			}
		},
	}
}
</script>

<style scoped>
div.button {
	width: 40px;
    height: 40px;
	cursor: pointer;
}
/* 一分屏 */
div.screenOne {
	background:url(../../../../static/main/screen/screenOne.png) no-repeat;
}
div.screenOne:hover {
	background:url(../../../../static/main/screen/screenOne_active.png) no-repeat;
}
/* 二分屏 */
div.screenTwo {
	background:url(../../../../static/main/screen/screenTwo.png) no-repeat;
}
div.screenTwo:hover {
	background:url(../../../../static/main/screen/screenTwo_active.png) no-repeat;
}
/* 四分屏 */
div.screenFour {
	background:url(../../../../static/main/screen/screenFour.png) no-repeat;
}
div.screenFour:hover {
	background:url(../../../../static/main/screen/screenFour_active.png) no-repeat;
}
/* 六分屏 */
div.screenSix {
	background:url(../../../../static/main/screen/screenSix.png) no-repeat;
}
div.screenSix:hover {
	background:url(../../../../static/main/screen/screenSix_active.png) no-repeat;
}
/* 1+5分屏 */
div.screenOneFive {
	background:url(../../../../static/main/screen/screenOneFive.png) no-repeat;
}
div.screenOneFive:hover {
	background:url(../../../../static/main/screen/screenOneFive.png) no-repeat;
}
/* 九分屏 */
div.screenNine {
	background:url(../../../../static/main/screen/screenNine.png) no-repeat;
}
div.screenNine:hover {
	background:url(../../../../static/main/screen/screenNine_active.png) no-repeat;
}
/* 16分屏 */
div.screenSixteen {
	background:url(../../../../static/main/screen/screenSixteen.png) no-repeat;
}
div.screenSixteen:hover {
	background:url(../../../../static/main/screen/screenSixteen_active.png) no-repeat;
}
/* 全部停止 */
div.stopAll {
	background:url(../../../../static/main/screen/stopAll.png) no-repeat;
}
div.stopAll:hover {
	background:url(../../../../static/main/screen/stopAll_active.png) no-repeat;
}
/* 关闭声音 */
div.closeVoice {
	background:url(../../../../static/main/screen/closeVoice.png) no-repeat;
}
div.closeVoice:hover {
	background:url(../../../../static/main/screen/closeVoice_active.png) no-repeat;
}
/* 全屏 */
div.Allfullscreen {
	background:url(../../../sdk/player/img/img_fullscreen_hover.png) no-repeat center;
}
/* 开启声音 */
.openVoice {
	background:url(../../../../static/main/screen/openVoice.png) no-repeat;
}
.openVoice:hover {
	background:url(../../../../static/main/screen/openVoice_active.png) no-repeat;
}
div.holder {
	background:url(../../../../static/main/screen/closeVoice.png) no-repeat;
}
div.takePhoto {
	background:url(../../../../static/main/screen/takePhoto.png) no-repeat;
}
div.takePhoto:hover {
	background:url(../../../../static/main/screen/takePhoto_hover.png) no-repeat;
}

/* 编码源设置 */
div.codingSource {
	background:url(../../../../src\sdk\player\img/picture_quality_hover.png) no-repeat center center;
}
div.codingSource:hover {
	background:url(../../../../src\sdk\player\img/picture_quality_hover.png) no-repeat center center;
}
.horizontal{
	display: flex;
	flex-wrap: wrap;
}
.button-text{
	width: 60px;
    padding-top: 25px; 
	cursor: pointer;
	font-size: 12px;
	text-align: center;
	margin: 8px 0;
}
.more-screen{
	line-height: 40px;
    text-align: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: url(../../../../static/main/screen/ico_screen_more.png) center no-repeat;
}
.more-screen:hover{
	background: url(../../../../static/main/screen/ico_screen_more_active.png) center no-repeat;
}
.screenTwelve{
	background:url(../../../../static/main/screen/ico_splitscreen_12.png) center top no-repeat;
}
.screenTwelve:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_12_active.png) center top no-repeat;
}
.OnlyTweentyFour{
	background:url(../../../../static/main/screen/ico_splitscreen_24.png) center top no-repeat;
}
.OnlyTweentyFour:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_24_active.png) center top no-repeat;
}
.OnlyTweentyFive{
	background:url(../../../../static/main/screen/ico_splitscreen_25.png) center top no-repeat;
}
.OnlyTweentyFive:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_25_active.png) center top no-repeat;
}
.OnlyThirtyTwo{
	background:url(../../../../static/main/screen/ico_splitscreen_32.png) center top no-repeat;
}
.OnlyThirtyTwo:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_32_active.png) center top no-repeat;
}
.OnlyThirtySix{
	background:url(../../../../static/main/screen/ico_splitscreen_36.png) center top no-repeat;
}
.OnlyThirtySix:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_36_active.png) center top no-repeat;
}
.One_Seven{
	background:url(../../../../static/main/screen/ico_splitscreen_1+7.png) center top no-repeat;
}
.One_Seven:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_1+7_active.png) center top no-repeat;
}
.One_Eleven{
	background:url(../../../../static/main/screen/ico_splitscreen_1+11.png) center top no-repeat;
}
.One_Eleven:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_1+11_active.png) center top no-repeat;
}
.Two_Eight{
	background:url(../../../../static/main/screen/ico_splitscreen_2+8.png) center top no-repeat;
}
.Two_Eight:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_2+8_active.png) center top no-repeat;
}
.OneInOne{
	background:url(../../../../static/main/screen/ico_splitscreen_inside.png) center top no-repeat;
}
.OneInOne:hover{
	background:url(../../../../static/main/screen/ico_splitscreen_inside_active.png) center top no-repeat;
}
</style>
