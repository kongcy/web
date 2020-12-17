<template>
	<el-dialog :visible.sync="visible" title="计划录像" width="1335px" class="custom-dialog planVideoDialog" @closed="closedDialog" >
		<el-row :gutter="10">
			<el-col :span="6">
				<el-tabs style="height: 652px;" v-model="tabActiveName">
				  	<el-tab-pane label="组织结构" name="personTreePlan">
				  		<person-tree ref="personTreePlan" :subscribeType="subscribeType" style="height: 607px;"/>
				  	</el-tab-pane>
				  	<el-tab-pane label="设备资源" name="deviceTreePlan">
				  		<device-tree ref="deviceTreePlan" :subscribeType="subscribeType" style="height: 607px;" />
				  	</el-tab-pane>
				  	<el-tab-pane label="常用资源" name="commonTreePlan" >
				  		<common-res ref="commonTreePlan" :subscribeType="subscribeType" style="height: 607px;"/>
				  	</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span="5">
				<el-card class="box-card" style="margin-bottom: 10px;">
                    <div slot="header" class="clearfix">
                        <span>录像计划</span>
                        <el-button type="text" class="add-btn" style="float: right;" @click="addVideoPlan"></el-button>
                    </div>
                    <el-table :data="planVideoData" style="width: 100%" header-row-class-name="table-header-bg" height="280" @row-click="rowClick">
				      	<el-table-column prop="planName" label="计划名"></el-table-column>
				      	<el-table-column prop="opened" label="启动状态" align="center">
				      		<template slot-scope="scope">
				      			<el-switch v-model="scope.row[scope.column.property]" :active-value="true" :inactive-value="false" @change="(val) => {setVideoRecordingPlanEnabled(val, scope.row)}"></el-switch>
				      		</template>
				      	</el-table-column>
				      	<el-table-column label="操作" width="75">
				      		<template slot-scope="scope">
				      			<el-button type="text" size="small" class="update-btn" title="修改" @click.stop="update(scope.row, scope.$index)"></el-button>
				      			<el-button type="text" size="small" class="delete-btn" title="删除" @click.stop="deleteVideoRecordingPlan(scope.row, scope.$index)"></el-button>
				      		</template>
				      	</el-table-column>
				    </el-table>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>被录资源</span>
                        <el-button type="text" class="add-btn" style="float: right;" @click="addReaourceClick"></el-button>
                    </div>
                    <div style="height:280px;overflow:auto">
                    	<el-tree
	                        ref="video_resource_tree"
	                        :data="resource"
	                        :props="defaultProps"
	                        node-key="id"
	                        :render-content="renderContent">
	                    </el-tree>
                    </div>
                </el-card> 
			</el-col>
			<el-col :span="13">
				<el-row style="margin-bottom: 5px;">
                	<el-col :span="12">
                		<span>计划名：</span>
                		<el-input v-model.trim="planName" placeholder="" maxlength="10" style="width:150px;"></el-input>
                	</el-col>
                	<el-col :span="12" style="text-align: right;">
                		<el-button-group>
						  	<el-button :class="activeBtn === 0 ? 'el-button--primary' : ''" @click="activeBtn = 0">计划编辑</el-button>
						  	<el-button :class="activeBtn === 1 ? 'el-button--primary' : ''" @click="activeBtn = 1">状态预览</el-button>
						</el-button-group>
                	</el-col>
                </el-row>
                <!-- 录像时段 -->
				<el-card class="box-card" v-if="activeBtn === 0">
                    <div slot="header" class="clearfix">
                        <span style="font-size: 16px;">录像时段</span>
                        <el-button type="text"></el-button>
                    </div>
                    <div style="padding: 10px;height: 480px;">
	                    <el-row style="margin: 11px;">
	                    	<el-col :span="17" style="line-height:36px;">
	                    		<span>生效时段：</span>
	                			<el-date-picker v-model="forceDate" type="daterange" range-separator="/" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 230px;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
	                			<el-switch v-model="allDay" :active-value="true" :inactive-value="false" style="margin: -1px 0 0 30px;"></el-switch>
	                    		<span>全天录制</span>
	                    	</el-col>
	                    	<el-col :span="7" style="text-align: right;">
	                    		<span>时段范围：</span>
	                			<el-select v-model="dateRangeValue" placeholder="请选择" style="width: 90px;" @change="calcDateRange">
								    <el-option v-for="(item, index) in dateRangeType" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
	                    	</el-col>
	                    </el-row>
	                	<table class="date-range">
	                    	<tr>
	                    		<th></th>
		                    	<th>星期一</th>
		                    	<th>星期二</th>
		                    	<th>星期三</th>
		                    	<th>星期四</th>
		                    	<th>星期五</th>
		                    	<th>星期六</th>
		                    	<th>星期日</th>
	                    	</tr>
	                    	<tr v-for="(item, index) in dateRangeData " :key="index">
	                    		<td class="cursor-none">{{item.rangeDate}}</td>
	                    		<td v-for="i in 7" :key="i" @click="(event) => { setSelectRange((i-1), index, event) }" :style="changeColor((i-1), index)"></td>
	                    	</tr>
	                    </table>
                    </div>
                </el-card>
                <!-- 状态预览 -->
                <el-card class="box-card" v-if="activeBtn === 1">
                    <div slot="header" class="clearfix">
                        <span style="font-size: 16px;">状态预览</span>
                        <el-button type="text"></el-button>
                    </div>
                    <div style="padding: 10px;">
                    	<el-table border :data="statusData" height="480px">
	                    	<el-table-column label="资源名称" prop="resourceName"></el-table-column>
	                    	<el-table-column label="录制状态" prop="transcribeState"></el-table-column>
	                    </el-table>
                    </div>
                </el-card>
                <div style="text-align:right;padding: 20px 0 0;">
	                <el-button v-if="isAdd && activeBtn === 0" type="primary" @click="createVideoRecordingPlan">新增</el-button>
		            <el-button v-if="!isAdd && activeBtn === 0" type="primary" @click="modifyVideoRecordingPlan" :disabled="isDisabled">保存</el-button>
		            <el-button @click="visible = false">关闭</el-button>
	            </div>
			</el-col>
		</el-row>
		<!-- <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            
        </span> -->
	</el-dialog>
</template>
<script>
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import DeviceTree from "@/components/home/selectRes/DeviceTree.vue";
import CommonRes from "@/components/home/selectRes/CommonRes.vue";
import Enum from "@/common/enum";
export default {
	name: "PlanVideoDialog",
	components: {
	    PersonTree,
	    DeviceTree,
	    CommonRes
	},
	data() {
		return {
			subscribeType: '',
            tabActiveName: 'personTree',
			visible: false,
			isAdd: true,
      		isEditing:false,
      		isDisabled: false,
			planVideoData: [],
			defaultProps: {
                label: 'name'
			},
            planId: '',
            resource: [],
            planName: '',
            forceDate: [],
            allDay: true,
            dateRangeValue: 2,
            selectRangeData: [],
            dateRangeType: [
            	{label: '30min', value: 0.5},
            	{label: '1h', value: 1},
            	{label: '2h', value: 2},
            	{label: '3h', value: 3},
            	{label: '4h', value: 4},
            	{label: '6h', value: 6},
            	{label: '8h', value: 8},
            	{label: '12h', value: 12}],
            dateRangeData: [],
            statusData: [],
            activeBtn: 0,
		}
	},
	mounted() {
	},
	methods: {
		// 初始化树 Testing
		initTree() {
			this.$nextTick(() => {
	          	const organId = "";
	          	this.subscribeType = Enum.enumSubscribeType.planVideo;
				  //订阅用户组织结构
				let subjectId = 0;
				// dj 默认行政隶属
				this.$refs.personTreePlan.relationshipValue = subjectId;
				this.$refs.deviceTreePlan.relationshipValue = subjectId;
				
	          	this.apiSDK.getOrganizationUser(organId, this.subscribeType.subscribeOrganizationUser, subjectId ,(obj) => {
	            	//console.log(obj);
	            	this.$refs.personTreePlan.setReceiveInformAddDepartmentCallback(obj);
	          	});
	          	//获取设备组织结构
	          	this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
	            	//console.log(obj);
	            	this.$refs.deviceTreePlan.setReceiveInformAddDepartmentCallback(obj);
	          	});
	          	//获取常用资源树
	          	this.apiSDK.subscribeCommonRes("", "", "", this.subscribeType.subscribeCommonResources);
	          	//资源回调
	          	this.apiSDK.setReceiveResourceStatusQueryCallback("planVideo", (obj) => {
	            	//console.log(obj);
					this.$refs.personTreePlan && this.$refs.personTreePlan.setReceiveInformResourceStatusCallback(obj);
					this.$refs.deviceTreePlan && this.$refs.deviceTreePlan.setReceiveInformResourceStatusCallback(obj);
					this.$refs.commonTreePlan && this.$refs.commonTreePlan.setReceiveInformResourceStatusCallback(obj);
	          	});
	        });
		},
		showDialog() {
	      	this.visible = true;
            this.tabActiveName = 'personTreePlan';
	      	this.$nextTick(() => {
              xtxk.media.setDialogTop('计划录像');
            });
			this.initTree();
			this.empty();
	      	this.calcDateRange(this.dateRangeValue);
			this.getVideoRecordingSchemeList();

			// 计划录像状态回调
			this.apiSDK.setRecordSchemeStatusCallBack(res=>{
				console.log(res);
				if( res.Ret == 0 ){
					this.statusData = res.data;
				}else{
					this.statusData = [];
					this.$message({
                        message: res.msg,
                        type: 'error'
                    });
				}
			});
	    },
	    // 清空
	    empty() {
	    	this.planId = '';
	    	this.planName =  '';
            this.forceDate = [];
            this.allDay = true;
            this.dateRangeValue = 2;
            this.selectRangeData = [];
			this.resource = [];
			this.isAdd = true;
			this.activeBtn = 0;
	    },
      	update(row, index) {
        	this.isDisabled = false;
        	this.isAdd = false;
        	if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
          		this.apiSDK.getPlanInfoByIdForV6(row.planId, (res) => {
          			this.planId = res.planID;
	        		this.planName = res.planName;
	        		this.forceDate = [res.beginDate, res.endDate];
					this.allDay = res.isAllDay;
	        		this.dateRangeValue = !!res.interval ? (res.interval * 15 / 60):2;
	        		this.calcDateRange(this.dateRangeValue);
	        		this.selectRangeData = res.itemlist && res.itemlist.map(item => {
	        			return { day: item.week, time: [item.begin, item.end] };
	        		});
	        		this.resource = res.resourcelist && res.resourcelist.map(item => {
	        			return {
	        				nodeId:			item.resourceID + "_" + (item.resCh || 0),
	        				id:             item.resourceID,
			                name:           item.resourceName,
			                resourceType:   item.type,
			                resCh:          item.resCh
	        			};
	        		});
          		});
          	} else {
	        	this.getResourceOfPlan(row.planId);
	        	this.getTimeOfPlan(row.planId);
				this.getPlanInfoById(row.planId);
			}
			// 查询计划录像状态
			this.apiSDK.queryRecordSchemeStatus(row.planId);
      	},
	    // 时间段数字转时间
	    numberToDate(num) {
	    	let number = num.toString();
	    	if(number === '0') {
				return '00:00';
			} else if (number.indexOf('.') === -1) {
				return this.prefixInteger(number, 2) + ':00';
			} else {
				let date = number.split('.')
				return this.prefixInteger(date[0], 2) + ':' + (date[1] * 6);
			}
	    },
	    // 自动补0
	    prefixInteger(num, length) {
	    	return (Array(length).join(0) + num).slice(-length);
		},
	    // 计算时间段
	    calcDateRange(date) {
	    	let range = (24/date) + 1;
			let array = [];
			for(let i= 1; i < range; i++) {
				let start = this.numberToDate(date*(i-1));
				let end = this.numberToDate(date*i);
				array.push({
					rangeDate: `${start}-${end}`
				});
			}
			this.dateRangeData = array;
	    },
	    // 改变颜色
	    changeColor(day, time) {
	    	if (this.selectRangeData.length === 0) {
	    		return '';
	    	}
	    	let dayIndex  = this.selectRangeData.findIndex(item => item.day === day);
	    	if (dayIndex !== -1) {
	    		let timeIndex = this.selectRangeData[dayIndex]['time'].findIndex(item => item === time);
	    		if (timeIndex !== -1) {
	    			return 'background-color: #b1e0ff;';
	    		} else {
	    			return '';
	    		}
	    	} else {
	    		return '';
	    	}
	    },
	    // 设置选中格式 [{"day":2,"time":[0,1]},{"day":3,"time":[1]},....]
	    setSelectRange(day, time, event) {
	    	if (event.target.getAttribute('style') === 'background-color: rgb(177, 224, 255);') {
	    		let dayIndex  = this.selectRangeData.findIndex(item => item.day === day);
	    		let timeIndex = this.selectRangeData[dayIndex]['time'].findIndex(item => item === time);
	    		this.selectRangeData[dayIndex]['time'].splice(timeIndex, 1);
	    	} else {
	    		let dayIndex  = this.selectRangeData.findIndex(item => item.day === day);
	    		if (dayIndex === -1) {
	    			this.selectRangeData.push({
	    				day: day,
	    				time: [time]
	    			});
	    		} else {
	    			let timeIndex = this.selectRangeData[dayIndex]['time'].findIndex(item => item === time);
	    			if (timeIndex === -1) {
	    				this.selectRangeData[dayIndex]['time'].push(time);
	    			}
	    		}
	    	}
	    },
	    // 获取录像的时间设置
        getTimeOfPlan(planId) {
        	this.apiSDK.getTimeOfPlan(planId, res => {
				this.selectRangeData = res;
				this.calcDateRange(this.dateRangeValue);
        	})
        },
	    // 树样式
        renderContent(h, { node, data, store }) {
            return (
                <span class={ data.resourceType === 0 ? 'custom-tree-node person_online' : 'custom-tree-node device_online'} >
                    <span class="node-icon"></span>
                    <span class="node-name">{node.label}</span>
                    <el-button class="delete-btn" type="text" on-click={ () => this.removeResourceClick(node, data) }></el-button>
                </span>
            );
        },
        /**
		   * 根据计划id查询资源
		   * var resp =[{resId:'',resCh:'',resName:'',resType:具体参照enum.js}
		   * */
        getResourceOfPlan (planId){
        	this.apiSDK.getResourceOfPlan(planId, res =>{
        		this.resource = [];
        		res.forEach(item => {
					var nodeId = item.resId + "_" + (item.resCh || 0);
        			this.resource.push({
						nodeId:			nodeId,
        				id:             item.resId,
		                name:           item.resName,
		                resourceType:   item.resType,
		                resCh:          item.resCh
        			})
        		})
        	})
        },
        // 从计划中删除资源 接口为空
        deleteResourceFromPlan() {
        	this.apiSDK.deleteResourceFromPlan(this.planId, res => {

        	});
        },
        reduce(array) {
            let object = {};
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total;
            }, [])
        },
        // 添加资源
        addReaourceClick() {
        	var userNodes = [];
	        var deviceNodes = [];

	        //人员树
	      	var userCheckNodes = this.$refs.personTreePlan.$refs.SelectResUsersStatus.getCheckedNodes();
	      	userCheckNodes && userCheckNodes.forEach(item => {
	        	item.nodeStatus != "department" && userNodes.push(item);
            	this.$refs.personTreePlan.$refs.SelectResUsersStatus.setChecked(item.nodeId, false);
	      	})
	      	//设备树
	      	var devCheckNodes = this.$refs.deviceTreePlan.$refs.SelectResDevicesStatus.getCheckedNodes();
	      	devCheckNodes && devCheckNodes.forEach(item => {
	        	item.nodeStatus != "department" && deviceNodes.push(item);
            this.$refs.deviceTreePlan.$refs.SelectResDevicesStatus.setChecked(item.nodeId, false);
	      	})
	      	//常用树
	      	var comCheckNodes = this.$refs.commonTreePlan.$refs.SelectResCommonsStatus.getCheckedNodes();
	      	comCheckNodes && comCheckNodes.forEach(item => {
	        	item.nodeStatus.indexOf("person") > -1 && userNodes.push(item);
	        	item.nodeStatus.indexOf("device") > -1 && deviceNodes.push(item);
            	this.$refs.commonTreePlan.$refs.SelectResCommonsStatus.setChecked(item.nodeId, false);
	      	})
	      	let array = [];
	      	array = [...this.resource, ...userNodes, ...deviceNodes];
	      	this.resource = this.reduce(array);
        },
        // 单条资源删除
        removeResourceClick(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.nodeId === data.nodeId);
            children.splice(index, 1);
        },
        // 点击行查数据
        rowClick(row, column, event) {
          	this.isDisabled = true;
          	if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
          		this.apiSDK.getPlanInfoByIdForV6(row.planId, (res) => {
          			this.planId = res.planID;
	        		this.planName = res.planName;
	        		this.forceDate = [res.beginDate, res.endDate];
					this.allDay = res.isAllDay;
	        		this.dateRangeValue = !!res.interval ? (res.interval * 15 / 60):2;
	        		this.calcDateRange(this.dateRangeValue);
	        		this.selectRangeData = res.itemlist && res.itemlist.map(item => {
	        			return { day: item.week, time: [item.begin, item.end] };
	        		});
	        		this.resource = res.resourcelist && res.resourcelist.map(item => {
	        			return {
	        				nodeId:			item.resourceID + "_" + (item.resCh || 0),
	        				id:             item.resourceID,
			                name:           item.resourceName,
			                resourceType:   item.type,
			                resCh:          item.resCh
	        			};
	        		});
          		});
          	} else {
          		this.getResourceOfPlan(row.planId);
	        	this.getTimeOfPlan(row.planId);
	        	this.getPlanInfoById(row.planId);
          	}
        	
			this.isAdd = false;
			
			// 查询计划录像状态
			this.apiSDK.queryRecordSchemeStatus(row.planId);
        },
        // 新增录像计划
        addVideoPlan() {
        	this.empty();
        	this.isAdd = true;
        },
        //设置计划启动状态
        setVideoRecordingPlanEnabled(val, row){
			this.apiSDK.setVideoRecordingPlanEnabled(row.planId,val,(obj)=> {
			if(obj.Ret === 0){
				this.$message({
				type: 'info',
				message: '状态切换成功.'
				});
			}else{
				this.$message({
				type: 'error',
				message: '状态切换失败.'
				});
			}
			})
        },
        // 获取录像计划
        getVideoRecordingSchemeList() {
        	this.apiSDK.getVideoRecordingSchemeList(res => {
        		this.planVideoData = res;
        	})
        },
        // 返回的参数具体参照创建录像计划
        getPlanInfoById(planId) {
        	this.apiSDK.getPlanInfoById(planId, res => {
        		this.planId = res.planId;
        		this.planName = res.planName;
        		this.forceDate = [res.startDate, res.endDate];
				this.allDay = res.allDay;
        		this.dateRangeValue = !!res.timeZone ? (res.timeZone * 15 / 60):2;
        	})
        },
        // 创建录像计划
        createVideoRecordingPlan() {
			if(this.planName.length === 0){
				this.$message.warning("计划名称不能够为空.");
				return;
			}
			//0703 dj 计划名称不能包含特殊字符
			var regx = /^[\u4E00-\u9FA5A-Za-z0-9._-]+$/;
			if(!regx.test(this.planName)){
				this.$message.warning("计划名称不能包含特殊字符.");
				return;
			}
			if (this.resource.length === 0) {
				this.$message({message: '请至少选择一名被录资源', type: 'warning'});
				return;
			}
			if(this.forceDate.length == 0){
				this.$message.warning("生效时段不能够为空.");
				return;
			}
			let timeStructs = this.selectRangeData;
			if( this.allDay == false ){
				if(timeStructs.length ===0){
					this.$message.warning("未开启全天录制，录像时段不能够为空.");
					return;
				}
			}

        	let resources = [];
        	if (this.resource.length !== 0) {
	        	this.resource.forEach(item => {
	        		resources.push({
	        			resourceId: item.id,
	        			resourceCh: item.resCh,
	        			resourceType: item.resourceType
	        		});
	        	})
	        }
        	let timeZone = this.dateRangeValue * 60 / 15;
        	this.apiSDK.createVideoRecordingPlan(this.planName, this.allDay, this.forceDate[0], this.forceDate[1], resources, timeZone, timeStructs, res => {
        		if (res.Ret == 1) {
	        		this.$message({message: '新增失败', type: 'warning'});
	        	} else {
	        		this.$message({message: '新增成功', type: 'success'});
	        		this.getVideoRecordingSchemeList();
					this.empty();
	        	}
        	})
        },
        // 修改录像计划
        modifyVideoRecordingPlan() {
			if(this.planName.length === 0){
				this.$message.warning("计划名称不能够为空.");
				return;
			}
			//0703 dj 计划名称不能包含特殊字符 == 只能中文数字英文
			var regx = /^[\u4e00-\u9fa5A-Za-z0-9._-]+$/;
			if(!regx.test(this.planName)){
				this.$message.warning("计划名称不能包含特殊字符.");
				return;
			}
			if (this.resource.length === 0) {
				this.$message({message: '请至少选择一名被录资源', type: 'warning'});
				return;
			}
			if(this.forceDate.length == 0){
				this.$message.warning("生效时段不能够为空.");
				return;
			}
			let timeStructs = this.selectRangeData;
			if( this.allDay == false ){
				if(timeStructs.length ===0){
					this.$message.warning("未开启全天录制，录像时段不能够为空.");
					return;
				}
			}

	        let resources = [];
	        if (this.resource.length !== 0) {
	        	this.resource.forEach(item => {
	        		resources.push({
	        			resourceId: item.id,
	        			resourceCh: item.resCh,
	        			resourceType: item.resourceType
	        		})
	        	});
	        }
	        let timeZone = this.dateRangeValue * 60 / 15;
	        this.apiSDK.modifyVideoRecordingPlan(this.planId, this.planName, this.allDay, this.forceDate[0], this.forceDate[1], timeZone, timeStructs, resources, res => {
	        	if (res.Ret == 1) {
	        		this.$message({message: '保存失败', type: 'warning'});
	        	} else {
	        		this.$message({message: '保存成功', type: 'success'});
					this.getVideoRecordingSchemeList();
					this.empty();
	        	}
	        })
        },
        // 删除录像计划
        deleteVideoRecordingPlan(row, index,) {
			// console.log(row);
        	this.$confirm('确认删除吗?', '提示', { 
				confirmButtonText: '确定', 
				cancelButtonText: '取消', 
				type: 'warning',
				closeOnClickModal: false
			}).then(() => {
	          	this.apiSDK.deleteVideoRecordingPlan(row.planId, res => {
	        		if (res.Ret == '1') {
	        			this.$message({message: '删除失败', type: 'warning'});
	        		} else {
	        			this.$message({message: '删除成功', type: 'success'})
						this.getVideoRecordingSchemeList()
						this.empty();
	        		}
	        	});
	        }).catch(() => {
	          	this.$message({
	            	type: 'info',
	            	message: '已取消删除'
	          	});
	        })
		},
		closedDialog(){
			//清空
			this.$refs.personTreePlan.clearTree();
			this.$refs.deviceTreePlan.clearTree();
			this.$refs.commonTreePlan.clearTree();
			//取消订阅
			const subIDs = new Array(
				this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,
				this.subscribeType.subscribeOrganizationDevice,this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
				this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus
			);
			this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
			  
			  // 重置筛选
			this.$refs.personTreePlan.resetSearch();
			this.$refs.deviceTreePlan.resetSearch();
		},
	}
}
</script>
<style scoped>
.active{
	color: #2e3c42;
  	border-bottom: 2px solid #128bf1;
}
.date-range{
	width: 100%;
	border-collapse: collapse;
    border-top: 1px solid #dfe4ed;
    border-left: 1px solid #dfe4ed;
}
.date-range td, .date-range th{
	line-height:35px;
	border-bottom: 1px solid #dfe4ed;
	border-right: 1px solid #dfe4ed;
	text-align: center;
}
.date-range td{
	cursor: pointer;
}
.date-range .cursor-none{
	cursor: default;
}
.custom-dialog .update-btn, .custom-dialog .delete-btn{
	position: inherit;
	vertical-align: middle;
}
/deep/.planVideoDialog .el-card__body{
    height: calc(100% - 40px);
    /* min-height: 280px; */
    padding: 0;
    overflow: auto;
}
/deep/.el-tree .custom-tree-node .node-name{
	display: inline-block;
	max-width: 200px;
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
