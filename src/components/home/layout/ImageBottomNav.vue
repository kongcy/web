<template>
  <div> 
      <div  class="ImageBottomNav">
      <div class="nav-left">
        <div class="button" v-for="item in screenTypeShow" :key="item.key" :class="activeScreenNum==item.param?item.class+' actived':item.class" :title="item.title" v-on:click="handleClick(item)"></div>
        <!-- <el-popover
            popper-class="navPopper"
		  	placement="top"
		  	width="300"
			@hide="isClickMore=false"
		  	trigger="click">
		  	<div class="horizontal">
		  		 <div class="button" v-for="item in screenTypeHide" :key="item.key" :class="activeScreenNum==item.param?item.class+' actived':item.class" :title="item.title" v-on:click="handleClick(item)"></div>
		  	</div>
		  	<el-button slot="reference" class="more-screen" :class="isClickMore?'actived':''" title="更多分屏" @click="clickmoreFun()"></el-button>
		</el-popover> -->
      </div>
      <div class="btn-box nav-right">
           <div class="button" v-for="item in btnName" :key="item.key" :class="item.class" :title="item.title" v-on:click="handleClick(item)"></div>
      </div>
      </div>
     <set-system-dialog ref="setSystem"/>
      
  </div>
</template>

<script>
//视频监控系统设置 wxx 2020.11.5
import setSystemDialog from "@/components/home/SetSystemMonitor.vue";

export default {
    name:'ImageBottomNav',
    components:{
        setSystemDialog
    },
    data () {
        return {
			isClickMore:false,
			activeScreenNum:4,
            screenTypeShow: [
				   { title: '一分屏', class: 'screenOne',param:1},
				    { title: '二分屏', class: 'screenTwo',param:12 },
			   	{ title: '四分屏', class: 'screenFour',param:4},
				   { title: '一加五分屏', class: 'screenOneFive',param:6 },
				     { title: '六分屏', class: 'screenSix',param:100},
			   	{ title: '九分屏', class: 'screenNine',param:9 },
               ],
            screenTypeHide: [
                { title: '二分屏', class: 'screenTwo',param:12 },
                { title: '六分屏', class: 'screenSix',param:100},
            //    { title: '十六分屏', class: 'screenSixteen',param:16 },
               ],
            btnName : [
				{ title: '全部停止', class: 'stopAll' },
               { title: '全屏放大', class: 'Allfullscreen' },
            //    { title: '暂停巡查', class: 'stopPatrol' },
              { title: '系统设置', class: 'setSystem' },
			//    { title: '全部静音', class: 'closeVoice' },
			//    { title: '多路抓拍', class: 'takePhoto' },
			//   { title: '编码源设置', class: 'codingSource' },
		   ],
          
        }
    },
    created () {
        
    },
    mounted () {
    },
    methods: {
        //点击更多分屏
        clickmoreFun(){
            this.isClickMore=!this.isClickMore;
        },
       	handleClick(btn){
			const curBtn = btn.class;
			if(curBtn == "stopAll"){
                //全部停止
				this.apiSDK.stopAll();
				this.$parent.HideHolder(true);
				//1211 dj 停止巡查的定时器
				this.$parent.$refs.resourcecontainer.$refs.searchStratege[0].stopAll()
				
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
			}else if(curBtn == 'stopPatrol'){
                //暂停巡查
            }else if(curBtn == 'setSystem'){
                //系统设置
                this.$refs.setSystem.showDialog();
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
				this.activeScreenNum=param;
				this.apiSDK.splitWidowForPlugin(param);
				this.apiSDK.publishSplitScreen(param);
			}
		},
	
       
    }
}
</script>
<style>
.navPopper{
    background: url(../../../../static/main/screen/resource_bg3.png) no-repeat center;
    background-size: 100% 100%;
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.25);
    padding:0 12px;
    width: auto!important;
}
.el-popper.navPopper .popper__arrow{
    display: none;
}
</style>
<style scoped>
.ImageBottomNav{
    padding: 0 15px;
    margin: 0;
    width: 100%;
    height: 58px;
	box-sizing: border-box;
    background-color:#314D78;
    display: flex;
    justify-content: space-between;
}
.nav-left{
    display: flex;
    justify-content: flex-start;
}
div.button {
	width: 40px;
    height: 40px;
    cursor: pointer;
    margin: 10px 3px;
}
.horizontal{
	display: flex;
	flex-wrap: wrap;
}
.horizontal div.button{
	margin:4px 0;
}
/* 一分屏 */
div.screenOne {
	background:url(../../../../static/main/screen/screenOne.png) no-repeat center;
}
div.screenOne:hover {
	background:url(../../../../static/main/screen/screenOne_hover.png) no-repeat center;
}
div.screenOne.actived {
	background:url(../../../../static/main/screen/screenOne_active.png) no-repeat center;
}
/* 二分屏 */
div.screenTwo {
	background:url(../../../../static/main/screen/screenTwo.png) no-repeat center;
}
div.screenTwo:hover {
	background:url(../../../../static/main/screen/screenTwo_hover.png) no-repeat center;
}
div.screenTwo.actived{
	background:url(../../../../static/main/screen/screenTwo_active.png) no-repeat center;
}
/* 四分屏 */
div.screenFour {
	background:url(../../../../static/main/screen/screenFour.png) no-repeat center;
}
div.screenFour:hover {
	background:url(../../../../static/main/screen/screenFour_hover.png) no-repeat center;
}
div.screenFour.actived{
	background:url(../../../../static/main/screen/screenFour_active.png) no-repeat center;
}
/* 六分屏 */
div.screenSix {
	background:url(../../../../static/main/screen/screenSix.png) no-repeat center;
}
div.screenSix:hover {
	background:url(../../../../static/main/screen/screenSix_hover.png) no-repeat center;
}
div.screenSix.actived {
	background:url(../../../../static/main/screen/screenSix_active.png) no-repeat center;
}
/* 1+5分屏 */
div.screenOneFive {
	background:url(../../../../static/main/screen/screenOneFive.png) no-repeat center;
}
div.screenOneFive:hover {
	background:url(../../../../static/main/screen/screenOneFive_hover.png) no-repeat center;
}
div.screenOneFive.actived {
	background:url(../../../../static/main/screen/screenOneFive_active.png) no-repeat center;
}
/* 九分屏 */
div.screenNine {
	background:url(../../../../static/main/screen/screenNine.png) no-repeat center;
}
div.screenNine:hover {
	background:url(../../../../static/main/screen/screenNine_hover.png) no-repeat center;
}
div.screenNine.actived {
	background:url(../../../../static/main/screen/screenNine_active.png) no-repeat center;
}
/* 16分屏 */
div.screenSixteen {
	background:url(../../../../static/main/screen/screenSixteen.png) no-repeat center;
}
div.screenSixteen:hover {
	background:url(../../../../static/main/screen/screenSixteen_hover.png) no-repeat center;
}
div.screenSixteen.actived {
	background:url(../../../../static/main/screen/screenSixteen_active.png) no-repeat center;
}
/* 全屏模式 */
div.Allfullscreen{
    background: url(../../../../static/main/screen/screenFull.png) no-repeat center;
}
div.Allfullscreen:hover{
    background: url(../../../../static/main/screen/screenFull_hover.png) no-repeat center;
}
div.Allfullscreen:active{
    background: url(../../../../static/main/screen/screenFull_active.png) no-repeat center;
}
/* 全部停止 */
div.stopAll {
	background:url(../../../../static/main/screen/stopAll.png) no-repeat center;
}
div.stopAll:hover {
	background:url(../../../../static/main/screen/stopAll_hover.png) no-repeat center;
}
div.stopAll:active {
	background:url(../../../../static/main/screen/stopAll_active.png) no-repeat center;
}
/* 暂停巡查 */
div.stopPatrol{
    background: url(../../../../static/main/screen/stopPatrol.png) no-repeat center;
}
div.stopPatrol:hover{
    background: url(../../../../static/main/screen/stopPatrol_hover.png) no-repeat center;
}
div.stopPatrol:active{
    background: url(../../../../static/main/screen/stopPatrol_active.png) no-repeat center;
}
/* 系统设置 */
div.setSystem{
    background: url(../../../../static/main/screen/setsystem.png) no-repeat center;
    background-size: 30px;
}
div.setSystem:hover{
    background: url(../../../../static/main/screen/setsystem_hover.png) no-repeat center;
    background-size: 30px;
}
div.setSystem:active{
    background: url(../../../../static/main/screen/setsystem_active.png) no-repeat center;
    background-size: 30px;
}
.more-screen{
	line-height: 40px;
    text-align: center;
    width: 17px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: url(../../../../static/main/screen/icon-right.png) center no-repeat;
    margin:10px 0;
}
.more-screen.actived{
    background: url(../../../../static/main/screen/icon-up.png) center no-repeat;
}

.nav-right{
    display: flex;
    justify-content: flex-end;
}



.btn-box .outConference{
    background-color: red;
    color: #fff;
    padding: 0;
    height: 40px;
    margin-top: 14px;
    width: 95px;
    border-radius: 10px;
    font-size: 15px;
}
.treeRightMenu {
    width: 550px;
    height: 150px;
    position: fixed;
}
.card-content{
    width: 550px;
    height: 150px;
}
.title-cardScreen{
    width: 100%;
    height: 30px;
    line-height: 30PX;
    text-align: center;
    border-bottom: 1px solid #c8ccd5 ;
}
.screen-box{
    width: 100%;
    height: calc(100% - 30px);
    padding: 10px 22px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.screenBtn-box{
    display: inline-block;
    width: 85px;
    font-size: 13px;
    text-align: center;
}
.screenBtn-box .img-screen{
    width: 70px;
}
.screenBtn-box p{
    margin-top: 5px;
}





/* 关闭声音 */
div.closeVoice {
	background:url(../../../../static/main/screen/closeVoice.png) no-repeat;
}
div.closeVoice:hover {
	background:url(../../../../static/main/screen/closeVoice_active.png) no-repeat;
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

.button-text{
	width: 60px;
    padding-top: 25px; 
	cursor: pointer;
	font-size: 12px;
	text-align: center;
	margin: 8px 0;
}

</style>>
