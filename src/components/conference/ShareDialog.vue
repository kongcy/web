 <template>
	<el-dialog :visible.sync="visible" title="会议共享" width="1066px" class="custom-dialog" center @close="handleClose">
		<div class="dialog_content">
			<el-card :body-style="{ padding: '0px' }"  v-for="(item, index) in tabs" :key="index" shadow="hover" :class="clickCardName==item.name?'actived':''"  @click.native="handleCard(item)">
				<i class="card_img" :class="item.class"></i>
				<div class="textbox" style="padding: 5px 28px; color:#e6fefe" >
					<span class="text-ellipsis text-title" :title="item.title">{{item.title}}</span>
				</div>
			</el-card>
		</div>
		<div class="dialog_footBtn">
			 <!-- <el-checkbox-group v-model="checkList" @change="handleCheckedChange()">
				<el-checkbox label="ss">同时共享电脑声音</el-checkbox>
				<el-checkbox label="ee">共享时禁止他人标注</el-checkbox>
				<el-checkbox label="ds">隐藏视频小窗口</el-checkbox>
			</el-checkbox-group> -->

			<el-button  type="primary" size="small" @click="clickShareFun">共享</el-button>
		</div>
		
		<!-- <el-tabs class="no-border" v-model="activeTab" >
			<el-tab-pane name="desktop">
				 <span slot="label"><i class="sharetabicon icon_shareDesktop"></i> 桌面</span>
				 <div class="shareContent">
					<div class="share_list">
						<div class="share-item" v-for="(item,index) in desktopList" :key="item.id" 
							  @click="checkShareFun(item,index)">
							<div class="img-box" :class="{'checked':item.id == ckShareID} ">
								<img :src="item.imgUrl" alt="">
							</div>
							<div class="item-txt">
								<p>{{item.title}}</p>
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="widget">
				<span slot="label"><i class="sharetabicon icon_shareWidget"></i> 应用窗口</span>
				<div class="shareContent">
					<div class="share_list">
						<div class="share-item" v-for="(item,index) in WidgetList" :key="item.id" 
						 @click="checkShareFun(item,index)">
							<div class="img-box" :class="{'checked':item.id == ckShareID} " >
								<img :src="item.imgUrl" alt="">
							</div>
							<div class="item-txt">
								<p>{{item.title}}</p>
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="whiteboard">
				<span slot="label"><i class="sharetabicon icon_shareWhiteboard"></i> 电子白板</span>
				 <div class="shareContent">
					<div class="share_list">
						<div class="share-item" v-for="(item,index) in WhiteboardList" :key="item.id" 
							 @click="checkShareFun(item,index)">
							<div class="img-box" :class="{'checked':item.id == ckShareID} ">
								<img :src="item.imgUrl" alt="">
							</div>
							<div class="item-txt">
								<p>{{item.title}}</p>
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="file">
				<span slot="label"><i class="sharetabicon icon_shareFile"></i> 文件</span>
				 <div class="shareContent">
					 <el-row class="btn-group">
						<el-button type="primary" size="small">添加文件</el-button>
						<el-button size="small">下载文件</el-button>
						<el-button type="danger" plain size="small">删除文件</el-button>
					</el-row>


					<el-table  ref="ShareFileTable" :data="ShareData" border highlight-current-row class="custom-table" height="508" @row-dblclick="dbclickrow"  :cell-class-name="cellstyle">
						<el-table-column type="selection" align="center"  width="55" ></el-table-column>
						<el-table-column prop="name" label="上传人员" align="center" class="taskOutline"></el-table-column>
						<el-table-column prop="filename" label="文件名称"  align="center">
							<template slot-scope="scope">
								<i class="fileicon" :class="{'fileicon_doc':scope.row.filename.indexOf('.doc')>-1,'fileicon_pptx':scope.row.filename.indexOf('.pptx')>-1,'fileicon_xls':scope.row.filename.indexOf('.xls')>-1,'fileicon_png':scope.row.filename.indexOf('.png')>-1}"></i>
								<span>
									{{scope.row.filename}}
								</span>
								
							</template>
						</el-table-column>
						<el-table-column prop="filesize" label="大小"  align="center"></el-table-column>
						<el-table-column prop="editTime" label="修改时间"  align="center"></el-table-column>
					</el-table> 
				</div>
			</el-tab-pane>
		</el-tabs>

		
		
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="clickShareFun">共享</el-button>
			<el-button @click="visible = false" size="small">取 消</el-button>
		</span> -->
	</el-dialog>	
</template>
<script>
export default {
	name: 'TaskArrangement',
	data() {
		return {
			visible: false,
			tabs: [
				{title: '电脑桌面',class:"icon_desktop",name:'desktop'},
				{title: '电子白板',class:"icon_whiteBoard",name:'whiteBoard'},
				// {title: '音视频文件',class:"icon_AVFile",name:'AVFile'},
				// {title: '应用',class:"icon_applicationProgram",name:'applicationProgram'},
			],
			clickCardName:'desktop',
			checkList:[],


			data:null,
			activeTab:"desktop",
			desktopList:[{
                id:1,
                title:"我的桌面",
                imgUrl:'../../../static/face/front.png',
                isCK:false
			}],
			WidgetList:[{
                id:"widget_1",
                title:"xiaopu",
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:"widget_2",
                title:"钉钉",
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:"widget_3",
                title:"Powerpoint",
                imgUrl:'../../../static/face/front.png',
                isCK:false
            }],
			WhiteboardList:[{
                id:"whiteboard_1",
                title:"电子白板",
                imgUrl:'../../../static/face/front.png',
                isCK:false
            }],
            ckShareID:'',
			ShareData:[{
				name: '高远',
				filename: '政策文件#1.doc',
				filesize: '1.24MB',
				editTime: '2016-05-02',
				}, {
				name: '任飞',
				filename: '政策文件#2.pptx',
				filesize: '1MB',
				editTime: '2016-05-02',
				}, {
				name: '张三',
				filename: '政策文件#3.xls',
				filesize: '343.6KB',
				editTime: '2016-05-02',
				}, {
				name: '王小虎',
				filename: '政策文件#4.png',
				filesize: '302.6kB',
				editTime: '2016-05-02',
			}],
		}
	},
	filters:{
		taskVfilter(value,index,arr){
			return (arr.filter((vl)=>vl.value==value))[0].label
		}
	},
	methods: {
		//显示页面
		showDialog(data) {
			this.visible = true;
            this.data = data;
		},
		
		//取消关闭弹框
		handleClose() {
			this.visible = false;
			this.ckShareID='';
			this.activeTab="desktop";
		},
		//选择共享内容
		handleCard(item){
			this.clickCardName=item.name
		},

		handleCheckedChange(){
			console.log(this.checkList)
		},

		//选择分享内容
 		checkShareFun(item){
            this.ckShareID = item.id;
        },

		//分享功能
		clickShareFun(){
			console.log("分享");
			if(this.clickCardName=="desktop"){
				//电脑桌面
				this.publishShareScreen();
			}else if(this.clickCardName=="whiteBoard"){
				//电子白板入口
				this.electronBlackboard();
			}
			this.handleClose();
		},
		// 共享屏幕
        publishShareScreen() {
            this.apiSDK.publishShareScreen(this.data.sceneID);
        },
		// 电子白板入口
  		electronBlackboard () {
            this.$parent.$refs.electronBlackboard.showDialog(this.data);
        },
		//双击行
		dbclickrow(row,event,column){
			$.each(this.TaskListData,function(k,val){
				val.isSet=false;
			})
			row.isSet=true;
		},
		//单元格加class
		cellstyle(row){
			if(row.row.isSet){
				if(row.column.label=="任务概要"||row.column.label=="任务类型"||row.column.label=="优先级"||row.column.label=="责任人"){
					return "isSetCell";
				}
				
			}else{
				return ""
			}
		},
		//添加任务
		addtask(){
			$.each(this.TaskListData,function(k,val){
				val.isSet=false;
			})
			let arr={
				taskOutline: '',
				taskType: '',
				teskLevel: '',
				teskName: '',
				isSet:true,
			}
			this.TaskListData.push(arr);
		},
		//保存任务
		savetask(){
			// this.visible = false;
			console.log(this.TaskListData)
		},
		
	}
}
</script>

<style scoped>
.dialog_content{
	 display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	margin:25px 66px;
}
.dialog_content .el-card{
  cursor:pointer;
  margin:0 50px 0 0;
  width: 186px;
  height: 186px;
  text-align: center;
  background: url(../../../static/meeting/shareMeetingBtn_bg.png);
  background-size:100% 100%;
  border:none;
}
.dialog_content .el-card:last-child{
	 margin:0;
}
.dialog_content .el-card.actived,
.dialog_content .el-card:hover{
	background: url(../../../static/meeting/shareMeetingBtn_bg_active.png);
	background-size:100% 100%;
}
.card_img{
  width:120px;
  height: 120px;
  margin:15px auto 0;
  display: block;
}

.custom-dialog /deep/ .el-card__body{
	height: auto;
}
.icon_desktop{
	background: url(../../../static/meeting/shareMeeting_desktop.png);
	background-size:100% 100%;
}
.icon_whiteBoard{
	background: url(../../../static/meeting/shareMeeting_whiteBoard.png);
	background-size:100% 100%;
}
.icon_AVFile{
	background: url(../../../static/meeting/shareMeeting_AVFile.png);
	background-size:100% 100%;
}
.icon_applicationProgram{
	background: url(../../../static/meeting/shareMeeting_applicationProgram.png);
	background-size:100% 100%;
}


.dialog_footBtn{
	 display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-end;
	margin: 40px 66px 5px 66px;
}
.dialog_footBtn /deep/ .el-checkbox__input .el-checkbox__inner{
	background:transparent;
	border-color: #6b7c92;
}
.dialog_footBtn /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, 
.dialog_footBtn /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
}
.dialog_footBtn /deep/ .el-checkbox__label{
	color:#d3dcf0;
}
.dialog_footBtn /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
	color:#fff;
}



/deep/ .el-tabs__item{
   	width: 265px;
    text-align: center;
    background-color: #909399;
    color: #fff;
	border: 1px solid #ccc;
    border-left: none;
}
/deep/ .el-tabs__active-bar{
    height: 0;
}
/deep/ .el-tabs__item.is-active{
    background-color: #0f5794;
}
.sharetabicon{
	width:24px;
	height:24px;
	display: inline-block;
	vertical-align: middle;
	margin: -5px 10px 0 0;
}
.icon_shareDesktop{
	background:url(../../../static/sendRequest/icon_conputer_selected.png);
}
.icon_shareWidget{
	background:url(../../../static/sendRequest/icon_conputer_selected.png);
}
.icon_shareWhiteboard{
	background:url(../../../static/sendRequest/icon_conputer_selected.png);
}
.icon_shareFile{
	background:url(../../../static/sendRequest/icon_conputer_selected.png);
}
.shareContent{
	height: 560px;
    overflow-y: auto;
}
.share_list{
	width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
	box-sizing: border-box;
    padding: 20px 0;
}
.share-item{
	width: 228px;
    height: 170px;
    margin: 5px 16px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    
}
.share-item .img-box{
    height: 135px;
    width: 224px;
	border: 2px solid transparent;
}
.share-item .img-box.checked{
    border: 2px solid #409EFF;
}

.share-item .img-box img{
	width:100%;
	height:100%;
	cursor: pointer;
}

.item-txt{
    line-height: 20px;
    padding: 5px 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
	text-align: center;
}
.btn-group{
	margin:10px;
}
.fileicon{
	width:20px;
	height:20px;
	display: inline-block;
	vertical-align: middle;
	margin: -5px 10px 0 0;
}
.fileicon_doc{
	background:url(../../../static/sendRequest/icon_pdf.png);
	background-size: 20px 20px;
}
.fileicon_pptx{
	background:url(../../../static/sendRequest/icon_pdf.png);
	background-size: 20px 20px;
}
.fileicon_xls{
	background:url(../../../static/sendRequest/icon_pdf.png);
	background-size: 20px 20px;
}
.fileicon_png{
	background:url(../../../static/sendRequest/icon_photo.png);
	background-size: 20px 20px;
}


.pagination{
	text-align: center;
	margin: 10px 0 0;
}
</style>