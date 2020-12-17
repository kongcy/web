<template>
	<div class="decoder-control" :class="{'isright':activetabName=='Mointor'}" v-if="visible" :style="`width:${width}`" id="decoderControl">
		<el-row>
			<el-col :span="10">
				<el-card class="box-card">
				  	<div slot="header" class="clearfix">
				    	<span>解码器</span>
				    	<div style="float:right;">
				    		<el-select v-model="groupId" placeholder="选择解码器组" @change="groupChange" @visible-change="visibleChange" popper-class="decoders-select">
							    <el-option
							      	v-for="item in groupData"
							      	:key="item.groupId"
							      	:label="item.groupName"
							      	:value="item.groupId"
									@click.native="groupChange(item.groupId)">
							    </el-option>
							</el-select>
					    	<el-dropdown @command="command">
							  	<span class="el-dropdown-link icon-set" style="cursor: pointer;"></span>
							  	<el-dropdown-menu slot="dropdown" trigger="click" style="margin-top:0px">
								    <el-dropdown-item command="1">解码器组管理</el-dropdown-item>
								    <el-dropdown-item command="2">矩阵订阅</el-dropdown-item>
								    <el-dropdown-item command="3">矩阵同步</el-dropdown-item>
								    <!-- <el-dropdown-item command="4">大厅配置</el-dropdown-item> -->
							  	</el-dropdown-menu>
							</el-dropdown>
				    	</div>
				  	</div>
				  	<el-table :data="tableData" height="200" @row-click="rowClick" ref="table" highlight-current-row width="100%"
					  	row-key="resId" :current-row-key="matrixId">
				      	<el-table-column prop="resName" label="设备名称">
				      		<template slot-scope="scope">
				      			<i class="icon-resource" :class="scope.row.isOnline"></i>
								<span style="cursor:pointer">{{scope.row.resName}}</span>
				      		</template>
				      	</el-table-column>
				      	<el-table-column prop="loop" label="轮循组选择">
				      		<template slot-scope="scope">
				                <el-select v-model="scope.row.loop" placeholder="" style="height: 12px;" :disabled="scope.row.isOnline === 'offline'" 
									@visible-change="loopVisibleChange">
								    <el-option v-for="item in schemeTypeData" :key="item.groupId" :label="item.groupName" :value="item.groupId">
								    </el-option>
								</el-select>
				            </template>
				      	</el-table-column>
				      	<el-table-column prop="isActived" label="启用" width="80">
				      		<template slot-scope="scope">
				                <el-switch :disabled="scope.row.isOnline === 'offline' || !scope.row.loop" v-model="scope.row.isActived" active-color="#13ce66" :active-value="true" :inactive-value="false" @change="(val) => { switchChange(scope.row, val) }"></el-switch>
				            </template>
				      	</el-table-column>
				    </el-table>
				</el-card>
			</el-col>
			<el-col :span="14">
				<div class="resource">
					<!-- 分屏 -->
					<div class="group" :class="`split-${splitNum}`">
						<div class="item" v-for="(item,index) in resourceData" :key="index" @dblclick="screenDBClick(item)" 
							:class="currentScreenIndex == item.position ? 'active' : ''" @click="screenClick(item.position)">
							<div class="content" v-if="item.status=='playing' && item.resourceId">
								<div class="body">
									<span>{{Number(item.position) + 1}}</span>&nbsp;&nbsp;
									<span>{{item.resourceName||''}}</span>
								</div>
								<div class="footer">
									<el-button v-for="btn in resourceControlBtn" :key="btn.key" :class="btn.icon" :title="btn.title" @click="resourceAction(btn.funName, item)"></el-button>
									<el-button :class="item.isMute?'mute-mini':'unmute-mini'" :title="item.isMute?'放音':'静音'" @click="resourceAction('setMatrixMuteByPos', item)"></el-button>
									<el-slider v-model="item.volume" :max="255" @change="(val) => handleVolume(val, item)"></el-slider>
								</div>
							</div>							
						</div>
					</div>
					<!-- 控制 -->
					<div class="control">
						<el-button v-for="item in allControlBtn" :key="item.key" :class="item.icon" @click="allAction(item.funName)" :title="item.title" :disabled="!maxtrixIsOnPlay"></el-button>
						<!-- <el-button class="cancel-full" title="取消全屏" @click="allAction('cancelMatrixFullScreen')" :disabled="!isFullScreen"></el-button> -->
						<el-button :class="isAllMute?'mute':'unmute'" :title="isAllMute?'全部放音':'全部静音'" @click="allAction('setMatrixMuteAll')" :disabled="!maxtrixIsOnPlay"></el-button>
						
						<el-popover placement="left" trigger="hover" popper-class="split-popover" v-model="popverVisible">
			                <div class="">
			                    <div class="split-screen">
			                        <div class="item" v-for="item in splitTypeData" :key="item.key" @click="splitScreenChange(item)" :class="splitType == item.value ? 'active':''">
			                            <span :class="splitType === item.value ? 'el-icon-check':''" class="icon"></span>
			                            <span>{{item.label}}分屏</span>
			                        </div>
			                    </div>
			                </div>
			                <!-- <div class="custom-popover-footer">
			                    <el-button type="primary" size="small" @click="setMatrixDisplayMode">确定</el-button>
			                    <el-button @click="popverVisible = false" size="small">取消</el-button>
			                </div> -->
			                <el-button slot="reference" type="text" title="分屏切换" class="view" @click="popverVisible = !popverVisible"></el-button>
			            </el-popover>
					</div>
				</div>
			</el-col>
		</el-row>
		<decoder-group-dialog ref='decoderGroupDialog'/>
		<decompiler-manage-dialog @closeDialog="initDialogDate" ref='decompiler'/>
	</div>
</template>
<script>
import DecoderGroupDialog from '@/components/matrix/DecoderGroupDialog.vue';
import DecompilerManageDialog from '@/components/matrix/MatrixManageDialog.vue';
import Enum from "@/common/enum";
import Fun from "@/common/fun";

export default {
	components: {
		DecoderGroupDialog,
		DecompilerManageDialog,
	},
	data() {
		return {
			activetabName:'',//star 2020.10.22
			width: 'auto',
			visible: false,
			popverVisible: false,
			groupId: '',
			matrixId: '',
			maxtrixName: '',
			maxtrixIsOnPlay: false, //根据是否有点播中判断所有操作是否可用
			isAllMute: false, //是否全部静音
			isFullScreen: false, //是否全屏
			splitNum: 9,
			splitType: 'OnlyNine',

			groupData: [],
			tableData: [],
			schemeTypeData: [],
			splitTypeData: [],
			resourceData: [],

			allControlBtn: [
				{ title: '全部停止', funName: 'stopAllMatrixPlay', icon: 'stop' },
				{ title: '全部暂停', funName: 'pauseAllMatrixPlay', icon: 'suspend', isEnable:true },
				// { title: '取消全屏', funName: 'cancelMatrixFullScreen', icon: 'cancel-full' },
				// { title: '全部静音', funName: 'setMatrixMuteAll', icon: 'mute', isEnable:true },
			],
			resourceControlBtn: [
				{ title: '全屏播放', funName: 'setFullScreen', icon: 'full-mini' },
				{ title: '停止播放', funName: 'stopMatrixPlay', icon: 'suspend-mini' },
				// { title: '加速播放', funName: '', icon: 'prev' },
				// { title: '减速播放', funName: '', icon: 'next' },
				{ title: '图像复位', funName: 'resetDecoderDBImage', icon: 'refresh' },
			],

			currentScreenIndex: '',
			dbClickStatus: [],//记录每屏双击状态，规避频繁点击
		}
	},
	mounted() {
		this.activetabName=xtxk.cache.get('activeName');//star 2020.10.22
		//分屏模式
		if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5){
			this.splitTypeData.push(
				{ label: 1, value: 'OnlyOne' },
				{ label: 4, value: 'OnlyFour' },
				{ label: 9, value: 'OnlyNine' });
		}else if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion6){
			this.splitTypeData.push(
				{ label: 1, value: 'OnlyOne' },
				{ label: 4, value: 'OnlyFour' },
				{ label: 9, value: 'OnlyNine' });
		}

		//组内解码器列表反馈
		this.apiSDK.setInformMatrixGroupStatusCallback(res => {
			if (res.operate === 'init') {
				this.tableData = res.rows.map(item => {
					return { isOnline: item.isOnline, loop: '', groupId: item.groupId, resId: item.resId, resName: item.resName, matrixSplitNum: item.matrixSplitNum };
				})
			} else if (res.operate === 'refresh') {
				let _status = res.status;
				_status && _status.forEach(item => {
					let index = this.tableData.findIndex(d => d.resId === item.matrixId);
					if(index > -1){
						let obj = this.tableData[index];
						obj.isOnline = item.isOnline;
						this.$set(this.tableData, index, obj);
					}
				});
			}
		});

		// 推送解码器状态详情反馈
		this.apiSDK.setInfromMatrixDetailsStatusCallback(res => {
			let data = res;
			if(data.isOnline == 'online'){
				this.matrixId = data.matrixId;
				//保存当前解码器ID
				this.$store.commit("setDecoderMatrixId", data.matrixId);
				this.maxtrixName = data.maxtrixName;
				this.isAllMute = data.isAllMute;
				this.splitNum = Fun.filterForSplitType(data.splitType);
				this.splitType = data.splitType
				if(this.resourceData.length != this.splitNum){
					this.resourceData = [];
					for(let i = 0; i < this.splitNum; i++) {
						this.resourceData.push({position: i});
					}
				}
				this.resourceData.forEach((item,index) => {
					data.screens.forEach(item2 => {
						if (index == item2.position) {
							this.$set(this.resourceData, index ,item2);
						}
					});
				});

				//全屏判断
				this.isFullScreen = data.isFullScreen
				if(data.isFullScreen){
					let fullObj = this.resourceData.find(item => item.position == data.fullScreenIndex);
					this.resourceData = [];
					if(fullObj) this.resourceData.push(fullObj);
					this.splitNum = 1;
				}

				//是否有屏在播放
				this.maxtrixIsOnPlay = false
				this.resourceData.forEach(item => {
					if(item.status == 'playing' && item.resourceId) this.maxtrixIsOnPlay = true;
				})
			}else if(data.isOnline == 'offline'){
				this.resourceData = [];
				this.maxtrixIsOnPlay = false;
			}
			console.log(this.resourceData)
		});
	},
	methods: {
		// 清空
		empty() {
			this.matrixId = '';
			this.splitType = '';
			this.groupId = '';
			this.splitNum = 9;
			this.maxtrixIsOnPlay = false;
			this.isAllMute = false;

			this.resourceData = [];
			this.tableData = [];

			this.currentScreenIndex = '';
			this.$store.commit("setDecoderPos", '');
			this.$store.commit("setDecoderMatrixId", '');
		},
		// 分屏选择
		splitScreenChange(item) {
			//分屏外的，正在播放的，停止
			// let splitCount = item.label;
			// this.resourceData.forEach((m, index) => {
			// 	if (index >= splitCount) {
			// 		if(m.status=='playing' && m.resourceId){
			// 			this.stopMatrixPlay(m)
			// 		}
			// 	}
			// });

			this.splitType = item.value;
			this.apiSDK.setMatrixDisplayMode(this.matrixId, this.splitType);
			this.popverVisible = !this.popverVisible;
		},
		// 显示
		showDialog() {
			this.empty();
			this.visible = !this.visible;
			let $divImageShow ='';
			//star 2020.10.22
			if(this.activetabName=="Monitor"){
				$divImageShow = document.querySelector('#divImageShow_Monitor');
			}else{
				$divImageShow = document.querySelector('#divImageShow');
			}
			
			let imgShowHeight = parseInt($divImageShow.style.height);
			let imgShowWidth = $divImageShow.style.width;
			let docWidth = document.body.clientWidth;
			//dj 1022 
			let $footMenu = document.querySelector('#footerMenu');
			let footMenuheight=0;
			if($footMenu){
				footMenuheight = parseInt($footMenu.style.height)
			}
			//cy ie浏览器兼容
			if (this.visible) {
				this.$nextTick(() => {
					this.width = (docWidth - 340) + 'px';
				    $divImageShow.style.width = `${imgShowWidth}`;
					$divImageShow.style.height = `${imgShowHeight - 242}px`;
					if($footMenu){
						$footMenu.style.width= '${imgShowWidth}';
						$footMenu.style.height='${footMenuheight}px';
						$footMenu.style.bottom='242px';
					}
					this.getDecoderGroupListForPanel(true)
				})
				this.apiSDK.changeSizeForPlugin(parseInt(imgShowWidth), imgShowHeight-242);
			} else {
				let decoderHeight = document.querySelector('.decoder-control').offsetHeight;
				$divImageShow.style.width = `${imgShowWidth}`;
				$divImageShow.style.height = `${imgShowHeight + 242}px`;
				if($footMenu){
						$footMenu.style.width= '${imgShowWidth}';
						$footMenu.style.height='${footMenuheight}px';
						$footMenu.style.bottom='242px';
				}
			//	$footMenu.style = `width: ${imgShowWidth};height: ${footMenuheight}px;bottom:0px`
				this.apiSDK.changeSizeForPlugin(parseInt(imgShowWidth), imgShowHeight+242);

				// 取消订阅矩阵的分组列表
				this.apiSDK.cancelSubscribeMatrixGroupListStatus(Enum.enumSubscribeType.decoder.subscribeMainDecodersStatus);
			}
		},
		// 下拉菜单事件
		command(command) {
			if( command === '1' ){
				this.$refs.decoderGroupDialog.showDialog();
			} else if (command === '2') {
				let matrixName = 'MatrixSubscription';
				this.$nextTick(() => {
					this.$refs.decompiler.showDialog(matrixName);
				})
			} else if (command === '3') {
				let matrixName = 'MatrixSynchronization'
				this.$nextTick(() => {
					this.$refs.decompiler.showDialog(matrixName);
				})
			}
		},
		initDialogDate(data) {
			
		},
		// 解码器分组下拉选择
		groupChange(groupId) {
			this.tableData = [];
			this.resourceData = [];
			// 根据码器分组ID获取所有解码器
			this.apiSDK.getDecoderByDecoderGroupId(Enum.enumSubscribeType.decoder.subscribeMainDecodersStatus, groupId);
		},
		visibleChange(flag) {
			if (flag) {
				this.getDecoderGroupListForPanel(false);
			}
		},
		// 资源事件
		resourceAction(funName, item) {
			let param = item;
			if (funName) {
				this[funName](param);
			}
		},
		// 事件
		allAction(funName) {
			this[funName]();
		},
		// 启用禁用解码器轮循，row.loop表示轮训组的ID
		switchChange(row, val) {
			if (row.loop !== '') {
				if (val) {
					this.apiSDK.startMatrixLoop(row.loop, row.resId, row.schemeId);
				} else {
					this.apiSDK.stopMatrixLoop(row.loop, row.resId);
				}
			} else {
				row.isActived = !val;
				this.$message({message: '请选择轮循组', type: 'warning'});
			}
		},
		// 行点击事件
		rowClick(row, cloumn, event) {
			if(row.isOnline == "offline"){
				//this.$message({message: '解码器不在线', type: 'warning'});
				return
			}
			if (event.target.className !== 'el-switch__core') {
				if (this.matrixId != row.resId) {
					//清除选中的分屏
					this.currentScreenIndex = '';
					this.$store.commit("setDecoderPos", '');
					// 取消订阅矩阵的状态
					this.apiSDK.cancelSubscribeMatrixStatus(Enum.enumSubscribeType.decoder.subscribeMainDecodersStatus, this.matrixId);
					// 订阅矩阵的状态
					this.resourceData = [];
					this.apiSDK.subscribeMatrixStatus(Enum.enumSubscribeType.decoder.subscribeMainDecodersStatus, this.groupId, row.resId);
				}
			}
		},
		// 分屏单击事件
		screenClick(index) {
			this.currentScreenIndex = index;
			this.$store.commit("setDecoderPos", index);
		},
		// 分屏双击事件
		screenDBClick(data) {
			if(data.status=='playing' && data.resourceId) return;
			let index = data.position;
			//规避频繁双击
			let dbClickItem = this.dbClickStatus.find(item => item.pos == index);
			if(dbClickItem && dbClickItem.isDBClick) return;
			if(dbClickItem) dbClickItem.isDBClick = true;
			else this.dbClickStatus.push({pos: index, isDBClick: true});
			setTimeout(() => { 
				let dbClickItem = this.dbClickStatus.find(item => item.pos == index);
				dbClickItem.isDBClick = false;
			 }, 2*1000);

			let $imgShow = this.$parent.$parent.$refs.imageShow;
			//获取选中的分屏和信息
			let curSelectedPos = $imgShow.curSelectedPos;
			let currentPlayScreens = $imgShow.currentPlayScreens;
			let curPlayItem = currentPlayScreens.find(item => item.screenIndex == curSelectedPos);
			if(curPlayItem) this.apiSDK.startMatrixPlay(this.matrixId, index, curPlayItem.resId, curPlayItem.resCh, curPlayItem.resType, '');
		},
		// 获取解码器分组应用于解码器控制面板
		getDecoderGroupListForPanel(isFirst) {
			this.apiSDK.getDecoderGroupListForPanel(Enum.enumSubscribeType.decoder.subscribeMainDecodersStatus, isFirst, res => {
				this.groupData = res.rows;
				if(isFirst){
					if(this.groupData && this.groupData.length > 0) this.groupId = this.groupData[0].groupId;
					isFirst = false;
				}
			});
		},
		// 通过组类型和方案类型获取业务分组信息
		loopVisibleChange(flag) {
			if(flag){
				let groupType = Enum.enumGroupType.DecodLoopPlay;
				//[{groupId:'',groupName:"",schemeId:""}]
				this.apiSDK.getAllGroupInfo(groupType, 1, 1024, res => {
					if(res){
						this.schemeTypeData = res.rows || [];
						//this.$set(this.schemeTypeData)
					}
				});
			}
		},
		
		// 开始全部播放
		startAllMatrixPlay() {
			this.apiSDK.startAllMatrixPlay(this.matrixId);
		},
		// 停止所有播放
		stopAllMatrixPlay() {
			this.apiSDK.stopAllMatrixPlay(this.matrixId);
		},
		// 设置显示模式
		// setMatrixDisplayMode() {
		// 	this.apiSDK.setMatrixDisplayMode(this.matrixId, this.splitType);
		// 	this.popverVisible = !this.popverVisible;
		// },
		// 取消全屏[对应全局操作按钮]
		cancelMatrixFullScreen() {
			this.apiSDK.cancelMatrixFullScreen(this.matrixId);
		},
		// 设置全场静音
		setMatrixMuteAll() {
			this.apiSDK.setMatrixMuteAll(this.matrixId, !this.isAllMute);
		},
		// 全部暂停和恢复
		pauseAllMatrixPlay() {
			let index = this.allControlBtn.findIndex(item => item.funName === 'pauseAllMatrixPlay');
			let isEnable = this.allControlBtn[index].isEnable;
			if (isEnable) {
				this.apiSDK.pauseAllMatrixPlay(this.matrixId,0);
				this.$set(this.allControlBtn, index, { title: '全部恢复', funName: 'pauseAllMatrixPlay', icon: 'start', isEnable:false });
			} else {
				this.apiSDK.pauseAllMatrixPlay(this.matrixId,1);
				this.$set(this.allControlBtn, index, { title: '全部暂停', funName: 'pauseAllMatrixPlay', icon: 'suspend', isEnable:true});
			}
		},
		// 设置全屏播放
		setFullScreen(item) {
			let pos = item.position;
			if(!this.isFullScreen){
				this.apiSDK.setFullScreen(this.matrixId, pos);
			}else{
				this.apiSDK.cancelMatrixFullScreen(this.matrixId);
			}
		},
		// 停止分屏播放
		stopMatrixPlay(item) {
			let pos = item.position;
			this.apiSDK.stopMatrixPlay(this.matrixId, pos);
		},
		// 设置分屏静音
		setMatrixMuteByPos(item) {
			let pos = item.position;
			let isMute = !item.isMute;
			this.apiSDK.setMatrixMuteByPos(this.matrixId, pos, isMute);
		},
		//设置音量
		handleVolume(val, item){
			let pos = item.position;
			this.apiSDK.setMatrixVolume(this.matrixId, pos, val);
		},
		//图像复位
		resetDecoderDBImage(item){
			let pos = item.position;
			this.apiSDK.resetDecoderDBImage(this.matrixId, pos);
		},
	},
}
</script>
<style>
.decoders-select {
    margin-top: 0px !important;
}
.split-popover{
	min-width: 0px !important;
	border: 1px solid #c2dff3;
	padding: 6px 12px;
}
</style>
<style scoped>
.split-screen .item{
    display: block;
    padding: 5px 15px 5px 0px;
	cursor: pointer;
}
.split-screen .item.active, .split-screen .item:hover{
    color: #409EFF;
}
.split-screen .item .icon{
    display: inline-block;
	width: 13px;
	color: #128bf1;
}
.decoder-control{
	position: absolute;
    left: 40px;
    bottom: 0;
    height: 240px;
    border: 1px solid #c2dff3;
    box-sizing: border-box;
}
.decoder-control.isright{
    right: 40px;
   left: inherit;
}
.decoder-control /deep/ .el-input__inner{
	height: 24px;
	/* 0629 dj */
	line-height: 24px;
}
.decoder-control /deep/ .el-table .el-input__icon{
	line-height: 24px;
}
.decoder-control /deep/ .el-table td, .decoder-control /deep/ .el-table th{
	padding: 0;
	height: 36px;
	line-height: 36px;
}
.decoder-control /deep/ .el-table .icon-resource{
	width: 20px;
	height: 20px;
	display: inline-block;
    vertical-align: -5px;
}
.decoder-control /deep/ .el-table .online{
	background: url(../../../static/resource_tree/device_online.png) no-repeat;
}
.decoder-control /deep/ .el-table .offline{
	background: url(../../../static/resource_tree/device_offline.png) no-repeat;
}
.decoder-control /deep/ .el-table .breakdown{
	background: url(../../../static/resource_tree/device_offline.png) no-repeat;
}
.decoder-control /deep/ .el-table th{
	background-color: #e9f3fa;
}
.decoder-control /deep/ .el-icon-setting{
	margin-left: 5px;
	color: #128bf1;
    font-size: 16px;
}
.decoder-control /deep/ .el-card{
    box-shadow: none;
    border: solid 1px #c2dff3;
    border-radius: 0;
}
.decoder-control /deep/ .el-card__header{
    background-color: #dbf0fe;
    border-color: #c2dff3;
    padding: 0 10px 0 20px;
    height: 40px;
    line-height: 40px;
}
.decoder-control /deep/ .el-button--text{
    color: #128bf1;
    padding: 2px 0;
}
.decoder-control /deep/ .el-card__body{
    min-height: 280px;
    padding: 0;
    overflow: auto;
    width: 100%;
}
.resource{
	position: relative;
	height: 238px;
}
.resource .group{
	position: absolute;
	left: 0;
	right: 40px;
	top: 0;
	bottom: 0;
	display: flex;
	flex-wrap: wrap;
	background-color: #e9f3fa;
}
.resource .group.split-9 .item,
.resource .group .item{
	position: relative;
	box-sizing: border-box;
	border-right: 1px solid #c8ddf3;
	border-top: 1px solid #c8ddf3;
	height: 33.333%;
	min-width: 33.333%;
}
.resource .group .item.active{
	border: 1px solid #4affff;
}
.resource .group.split-1 .item{
	width: 100%;
	height: 100%;
}
.resource .group.split-4 .item{
	width: 50%;
	height: 50%;
}
.resource .group.split-6 .item{
	width: 33.333%;
	height: 50%;
}
.resource .group .item .content{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
	/* border: 1px solid #444; */
}
/* .resource .group .item .content.active{
	border: 1px solid #4affff;
} */
.resource .group .item .body{
	position: absolute;
	top: 0;
	bottom: 20px;
	right: 0;
	left: 0;
	background-color: #444;
	color: #fff;
	font-size: 13px;
	padding: 5px;
}
.resource .group .item .footer{
	position: absolute;
	bottom: 0;
	height: 20px;
	right: 0;
	left: 0;
	background-color: #212121;
	line-height: 20px;
	padding: 0px 5px 3px 5px;
}
.resource .group .item .footer /deep/ .el-button{
	width: 14px;
	height: 14px;
	border: 0;
	padding: 0;
	vertical-align: middle;
}
.resource .control{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 38px;
    padding-top: 5px;
    line-height: 39px;
    background-color: #dbf0fe;
}
.resource .control /deep/ .el-button {
	width: 24px;
	height: 24px;
	border: 0;
	padding: 0;
	vertical-align: middle;
	margin-left: 8px;
}
.icon-set {
	margin-left: 5px;
	width: 20px;
	height: 20px;
	display: inline-block;
    vertical-align: -4px;
	background: url(../../../static/decoderGroup/set.png) no-repeat;
}
.icon-set:focus{
	border:0;
}
.start{
	background: url(../../../static/decoderGroup/start.png) no-repeat;
}
.start:hover, .start:focus{
	background: url(../../../static/decoderGroup/start_hover.png) no-repeat;
}
.suspend{
	background: url(../../../static/decoderGroup/stop.png) no-repeat;
}
.suspend:hover, .suspend:focus{
	background: url(../../../static/decoderGroup/stop_hover.png) no-repeat;
}
.suspend-mini{
	background: url(../../../static/decoderGroup/stop_mini.png) no-repeat;
}
.suspend-mini:hover, .suspend-mini:focus{
	background: url(../../../static/decoderGroup/stop_mini_hover.png) no-repeat;
}
.stop{
	background: url(../../../static/decoderGroup/stop2.png) no-repeat;
}
.stop:hover, .stop:focus{
	background: url(../../../static/decoderGroup/stop2_hover.png) no-repeat;
}
.full-mini{
	background: url(../../../static/decoderGroup/full_mini.png) no-repeat;
}
.full-mini:hover, .full-mini:focus{
	background: url(../../../static/decoderGroup/full_mini_hover.png) no-repeat;
}
.cancel-full{
	background: url(../../../static/decoderGroup/cancel_full.png) no-repeat;
}
.cancel-full:hover, .cancel-full:focus{
	background: url(../../../static/decoderGroup/cancel_full_hover.png) no-repeat;
}
.view{
	background: url(../../../static/decoderGroup/view.png) no-repeat;
}
.view:hover, .view:focus{
	background: url(../../../static/decoderGroup/view_hover.png) no-repeat;
}
.mute{
	background: url(../../../static/decoderGroup/mute.png) no-repeat;
}
.mute:hover, .mute:focus{
	background: url(../../../static/decoderGroup/mute_hover.png) no-repeat;
}
.unmute{
	background: url(../../../static/decoderGroup/unmute.png) no-repeat;
}
.unmute:hover, .unmute:focus{
	background: url(../../../static/decoderGroup/unmute_hover.png) no-repeat;
}
.mute-mini{
	background: url(../../../static/decoderGroup/mute_mini.png) no-repeat;
}
.mute-mini:hover, .mute-mini:focus{
	background: url(../../../static/decoderGroup/mute_mini_hover.png) no-repeat;
}
.unmute-mini{
	background: url(../../../static/decoderGroup/unmute_mini.png) no-repeat;
}
.unmute-mini:hover, .unmute-mini:focus{
	background: url(../../../static/decoderGroup/unmute_mini_hover.png) no-repeat;
}
.prev{
	background: url(../../../static/decoderGroup/prev.png) no-repeat;
}
.prev:hover, .prev:focus{
	background: url(../../../static/decoderGroup/prev_hover.png) no-repeat;
}
.next{
	background: url(../../../static/decoderGroup/next.png) no-repeat;
}
.next:hover, .next:focus{
	background: url(../../../static/decoderGroup/next_hover.png) no-repeat;
}
.refresh{
	background: url(../../../static/decoderGroup/refresh.png) no-repeat;
}
.refresh:hover, .refresh:focus{
	background: url(../../../static/decoderGroup/refresh_hover.png) no-repeat;
}

/* 声音条 */
/deep/ .el-slider{
	width: 60px;
	display: inline-block;
	margin: 0 0 2px 7px;
}
/deep/ .el-slider__runway{
	margin:0px;
}
/deep/ .el-slider__button{
	height: 8px;
	width: 8px;
}
</style>