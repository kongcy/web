 <template>
	<el-dialog :visible.sync="visible" title="任务安排" width="848px" class="custom-dialog" center @close="handleClose">
		<el-row :gutter="10">
			<el-col :span="24">
				<div class="text-lg text-bold grid-content">
					<i class="taskicon taskicon_title"></i>{{taskTitle}}
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="12">
				<div class="grid-content">
					<i class="taskicon taskicon_time"></i>{{taskTime}}
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content">
					<i class="taskicon taskicon_MC"></i>{{taskMC}} 
					<span class="mc_tag">主持人</span>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="12">
				<div class="grid-content">
					<i class="taskicon taskicon_MC"></i>
					会商ID：<span class="taskId_text">{{taskId}}</span>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content">
					<i class="taskicon taskicon_MC"></i>
					参会人员：{{taskPerson}} 
					<el-button type="text" style="margin-left:10px;">查看列表</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="12">
				<div class="grid-content">
					<i class="taskicon taskicon_list"></i>
					项目名称：
					<el-select v-model="taskName" placeholder="请选择">
						<el-option v-for="item in taskNameOption"	:key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</el-col>
			
		</el-row>
		<el-row :gutter="10">
			<el-col :span="24">
				<div class="grid-content">
					<i class="taskicon taskicon_list"></i>
					任务安排列表：
					<el-button type="primary" icon="el-icon-plus" size="small" class="float-r" @click="addtask">添加任务</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table :data="TaskListData" border highlight-current-row class="custom-table" height="350" @row-dblclick="dbclickrow"  :cell-class-name="cellstyle">
			 <el-table-column type="index" label="序号" width="50" align="center" ></el-table-column>
	      	<el-table-column prop="taskOutline" label="任务概要" align="center" class="taskOutline">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-input v-model="scope.row.taskOutline"></el-input>
					</span>
					<span v-else>{{scope.row.taskOutline}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column prop="taskType" label="任务类型"  align="center">
				  <template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-select v-model="scope.row.taskType" placeholder="请选择">
							<el-option
							v-for="item in taskTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</span>
					<span v-else>{{scope.row.taskType | taskVfilter(scope.$index,taskTypeList)}}</span>
				</template>
			  </el-table-column>
	      	<el-table-column prop="teskLevel" label="优先级" align="center" width="120">
	      		<template slot-scope="scope">
					  <span v-if="scope.row.isSet">
						<el-select v-model="scope.row.teskLevel" placeholder="请选择">
							<el-option
							v-for="item in teskLevelList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</span>
					<span v-else :class="scope.row.teskLevel === 'EHigh'?'text-danget':(scope.row.teskLevel === 'ENormal'?'text-warning':scope.row.teskLevel === 'ELow'?'text-success':'')">
						<!-- <el-tag v-if="scope.row.teskLevel === 'EHigh'" type="danger">高</el-tag>
	      				<el-tag v-if="scope.row.teskLevel === 'ENormal'" type="warning">中</el-tag>
	      				<el-tag v-if="scope.row.teskLevel === 'ELow'" type="success">低</el-tag> -->
					  
						{{scope.row.teskLevel | taskVfilter(scope.$index,teskLevelList)}}
					</span>
	      			
				</template>
	      	</el-table-column>
			  <el-table-column prop="teskName" label="责任人"  align="center">
				  <template slot-scope="scope">
					  <span v-if="scope.row.isSet">
						<el-select v-model="scope.row.teskName" placeholder="请选择">
							<el-option
							v-for="item in teskNameList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</span>
					<span v-else >
						{{scope.row.teskName}}
					</span>
	      			
				</template>
			  </el-table-column>
	      	<el-table-column  label="操作" width="175" align="center">
		      	<template slot-scope="scope">
					  <el-button type="text"  @click.native.prevent="deleteRow(scope.$index, TaskListData)"><i class="el-icon-delete"></i></el-button>
		      	</template>
		    </el-table-column>
	    </el-table>
	    <!-- 分页 -->
	    <!-- <div class="pagination">
	    	<el-pagination background layout="prev, pager, next" :total="total" @current-change="pageChange"></el-pagination>
	    </div> -->
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="savetask">保存安排</el-button>
			<el-button size="small" @click="publishTask">发布安排</el-button>
			<el-button @click="visible = false" size="small">取 消</el-button>
		</span>
	</el-dialog>	
</template>
<script>
export default {
	name: 'TaskArrangement',
	data() {
		return {
			visible: false,
			taskTitle:"XX政策学习的通知",
			taskTime:"06月03日 周三 17：36-18：36",
			taskMC:'张三',
			taskId:"511-2111-0111",
			taskPerson:"36",
			taskName:"",
			taskNameOption:[{
				value:'1',
				label:"油田生产项目"
			},{
				value:'2',
				label:"油田生产项目2"
			}],
			TaskListData:[{
				taskOutline: '2016-05-02',
				taskType: 'teskWX',
				teskLevel: 'EHigh',
				teskName: '高远',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '任飞',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '任飞',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '王小虎',
				isSet:false,
			}],
			taskTypeList:[{
				value:"",
				label:""
			},{
				value:"teskCG",
				label:"采购任务"
			},{
				value:'teskWX',
				label:"维修任务"
			}],
			teskLevelList:[{
				value:"",
				label:"无"
			},{
				value:'EHigh',
				label:"高"
			},{
				value:'ENormal',
				label:"中"
			},{
				value:"ELow",
				label:"低"
			}],
			teskNameList:[{
				value:"",
				label:""
			},{
				value:"王小虎",
				label:"王小虎"
			},{
				value:'任飞',
				label:"任飞"
			},{
				value:'高远',
				label:"高远"
			}]
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
		},
		//删除
		deleteRow(index, rows) {
			rows.splice(index, 1);
		},
		//取消关闭弹框
		handleClose() {
			this.visible = false;
			this.TaskListData=[{
				taskOutline: '2016-05-02',
				taskType: 'teskWX',
				teskLevel: 'EHigh',
				teskName: '高远',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '任飞',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '任飞',
				isSet:false,
				}, {
				taskOutline: '2016-05-02',
				taskType: 'teskCG',
				teskLevel: 'EHigh',
				teskName: '王小虎',
				isSet:false,
			}]
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
		//安排任务
		publishTask(){
			console.log(this.TaskListData)
		}
	}
}
</script>

<style scoped>
.pagination{
	text-align: center;
	margin: 10px 0 0;
}
.taskicon{
	display: inline-block;
	width:24px;
	height:24px;
	vertical-align: middle;
	margin:-5px 10px 0 0;
}
.grid-content{
	padding: 3px 0;
	height: 32px;
	line-height: 32px;
}
.taskicon_title{
	background:url(../../../static/sendRequest/icon_group.png);
}
.text-bold{
	font-weight: bold;
}
.text-lg{
	font-size: 18px;
}
.taskicon_time{
	background:url(../../../static/sendRequest/icon_clock.png);
}
.taskicon_MC{
	background:url(../../../static/sendRequest/icon_person.png);
}
.taskicon_list{
	background:url(../../../static/sendRequest/icon_list.png);
}
.grid-content /deep/ .el-input__inner{
	height:30px;
	line-height: 30px;
}
.grid-content /deep/ .el-input__icon{
line-height: 30px;
}
.float-r{
	float:right;
}
.mc_tag{
	padding: 1px 10px;
    font-size: 12px;
    border: 1px solid #409EFF;
    border-radius: 12px;
	color:#409EFF;
	margin-left:5px;
}
.taskId_text{
	color:#409EFF;
	text-decoration: underline;
}
.custom-table /deep/  td.isSetCell{
	padding:0px !important;
}
.custom-table.el-table /deep/  .isSetCell>.cell{
	padding:0px !important;
}
.text-danget{
	color:#F56C6C;
}
.text-warning{
	color:#E6A23C
}
.text-success{
	color:#67C23A
}
</style>