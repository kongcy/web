 <template>
	<el-dialog :visible.sync="visible" title="告警查询" width="848px" class="custom-dialog" @close="clear">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
			<el-form-item label="报警时段">
				<el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 380px;" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				<el-button style="padding: 12px 10px;" @click="setDate(1)">最近1天</el-button>
				<el-button style="padding: 12px 10px;" @click="setDate(3)">最近3天</el-button>
				<el-button style="padding: 12px 10px;" @click="setDate(7)">最近7天</el-button>
				<el-button style="padding: 12px 10px;" @click="setDate(30)">最近1月</el-button>
			</el-form-item>
			<el-form-item label="告警类型">
				<el-select placeholder="请选择" v-model="searchForm.alarmEvents" style="width: 120px;">
				    <el-option v-for="item in alarmEventsList" :key="item.key" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="处理状态">
				<el-select placeholder="请选择" v-model="searchForm.alarmLevels" style="width: 100px;">
				    <el-option v-for="item in alarmLevelsList" :key="item.key" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-input placeholder="请输入告警源关键字..." v-model="searchForm.filters" class="input-with-select">
				    <el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</el-form-item>
			<el-button type="primary" @click="queryHistoryAlarmMessage">检索</el-button>
			<el-button @click="clear">重置</el-button>
		</el-form>
		<el-table :data="tableData" border highlight-current-row class="custom-table" height="450">
	      	<el-table-column prop="occurDatetime" label="告警时间" align="center" width="200"></el-table-column>
	      	<el-table-column prop="alarmEvent" label="触发事件" align="center">
	      		<template slot-scope="scope">
	      			{{ getDictLabel('alarmEventsList', scope.row.alarmEvent) }}
	      		</template>
	      	</el-table-column>
	      	<el-table-column prop="deviceName" label="告警源"  align="center"></el-table-column>
	      	<el-table-column prop="alarmLevel" label="告警级别" align="center" width="120">
	      		<template slot-scope="scope">
	      			<el-tag v-if="scope.row.alarmLevel === 'EHigh'" type="danger">高</el-tag>
	      			<el-tag v-if="scope.row.alarmLevel === 'ENormal'" type="warning">中</el-tag>
	      			<el-tag v-if="scope.row.alarmLevel === 'ELow'" type="success">低</el-tag>
				</template>
	      	</el-table-column>
	      	<el-table-column  label="操作" width="175" align="center">
		      	<template slot-scope="scope">
		        	<!-- <el-button size="mini">联动记录</el-button> -->
					<!-- 根据是否已读字段，后面加操作按钮【已读】，点击按钮调用设置已读接口  0613dj -->
		        	<el-button size="mini" type="primary" v-if="scope.row.IsReaded == false" @click="changeIsReaded(scope.row)">已读</el-button>
		      	</template>
		    </el-table-column>
	    </el-table>
	    <!-- 分页 -->
	    <div class="pagination">
	    	<el-pagination background layout="prev, pager, next" :total="total" @current-change="pageChange"></el-pagination>
	    </div>
	</el-dialog>	
</template>
<script>
export default {
	name: 'AlarmMessage',
	data() {
		return {
			visible: false,
			date: [],
			searchForm: {
				startTime: '',
				endTime: '',
				alarmEvents: '',
				alarmLevels: '',
				filters: '',
				page: 1,
				pageSize: 10
			},
			tableData: [],
			alarmEventsList: [
				{ label: '越界', value: 'ECrossBorder' },
				{ label: '攀高', value: 'EClimbedUp' },
				{ label: '滞留', value: 'ERetention' },
				{ label: '徘徊', value: 'EWander' },
				{ label: '人数异常', value: 'EPeopleNumber' },
				//{ label: '聚众', value: 'EGatherCrowd' },
				{ label: '盗移', value: 'EStealMove' },
				{ label: '快速移动', value: 'EFastMove' },
				//{ label: '斗殴', value: 'EFight' },
				//{ label: '逆行', value: 'EReverseDirection' },
				{ label: '起身', value: 'EGetup' },
				{ label: '离岗', value: 'EOffPosition' },
				//{ label: '落单', value: 'EBeAlone' }
			],
			alarmLevelsList: [
				{ label: '高', value: 'EHigh' },
				{ label: '中', value: 'ENormal' },
				{ label: '低', value: 'ELow' }
			],
			total: 0,
		}
	},
	methods: {
		getDictLabel(dictName, value) {
			let obj = this[dictName].find(item => item.value === value);
			return obj && obj.label || '';
		},
		setDate(day) {
			let end = new Date();
			let start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
			this.date = [start, end];
		},
		showDialog(data) {
			this.visible = true;
			this.setDate(1);
			// 如果是右键点击
			if (data && data.name) {
				this.searchForm.filters = data.name;
			}
			this.queryHistoryAlarmMessage();
		},
		clear() {
			this.setDate(1);
			this.searchForm = {
				startTime: '',
				endTime: '',
				alarmEvents: '',
				alarmLevels: '',
				filters: '',
				page: 1,
				pageSize: 10
			}
			this.tableData = [];
		},
		queryHistoryAlarmMessage() {
			this.searchForm.startTime = this.date[0].formatDate('yyyy-MM-dd HH:mm:ss');
			this.searchForm.endTime = this.date[1].formatDate('yyyy-MM-dd HH:mm:ss');

			this.searchForm.alarmEventsArr = [];
			if(this.searchForm.alarmEvents == ''){//查所有事件
				let tempEvent = [];
				this.alarmEventsList.forEach(item => {
					tempEvent.push(item.value)
				})
				this.searchForm.alarmEventsArr = tempEvent
			}else{
				this.searchForm.alarmEventsArr.push(this.searchForm.alarmEvents)
			}

			this.searchForm.alarmLevelsArr = [];
			if(this.searchForm.alarmLevels == ''){//查所有级别
				let tempLevel = [];
				this.alarmLevelsList.forEach(item => {
					tempLevel.push(item.value)
				})
				this.searchForm.alarmLevelsArr = tempLevel
			}else{
				this.searchForm.alarmLevelsArr.push(this.searchForm.alarmLevels)
			}
			this.apiSDK.queryHistoryAlarmMessage(this.searchForm, res => {
				if (res.Ret === 0) {
					this.total = res.totalCount;
					this.tableData = res.data;
				}
			});
		},
		pageChange(currentPage) {
			this.searchForm.page = currentPage;
			this.queryHistoryAlarmMessage();
		},
		//设置告警信息已读  0613dj
		changeIsReaded(item){
			this.apiSDK.publishSetMessageReaded(item.alarmMsgId)
		}
	}
}
</script>
<style scoped>
.pagination{
	text-align: center;
	margin: 10px 0 0;
}
</style>