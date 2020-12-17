<template>
	<div class="video-search">
		<el-form :model="form" inline style="padding: 10px 5px 15px;">
			<!-- <div>
				<el-date-picker v-model="form.stratTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false" :picker-options="{disabledDate:val=>val.getTime() > Date.parse(form.endTime)}" size="mini" style="width:145px;margin-bottom: 10px;float:left;" placeholder="开始日期"></el-date-picker>
			    <el-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false" :picker-options="{disabledDate:val=>val.getTime() < Date.parse(form.stratTime)}" size="mini" style="width:145px;" placeholder="结束日期"></el-date-picker>
			</div> -->
			<el-form-item label="" style="margin-bottom: 10px;">
				<el-date-picker
				  class="custom-picker"
			      v-model="dateRange"
			      type="datetimerange"
			      size="small"
			      value-format="yyyy-MM-dd HH:mm:ss"
			      format="yyyy-MM-dd HH:mm"
			      :picker-options="pickerOptions"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      style="width:290px;">
			    </el-date-picker>
			</el-form-item>
			<!-- <el-form-item label="检索对象">
			    <el-input v-model="form.resourceName"size="mini" placeholder="" readonly></el-input>
			</el-form-item> -->
			<div style="font-size:14px;line-height:30px;">
				<el-input v-model="form.resourceName"size="small" placeholder="检索对象" readonly style="width: 225px;"></el-input>
				<el-button :disabled="form.resourceName === ''" type="primary" @click="search" size="small" style="float:right">检索</el-button>
			    <el-button @click="empty" style="display:none;">重置</el-button>
			</div>
		</el-form>
		<el-table v-if="tableData.length > 0" :data="tableData" stripe :max-height="tableMaxHeight" @row-contextmenu="showRightMenu" @row-dblclick="publishQueryRecord" class="custom-table">
		    <el-table-column type="index" width="45" label="序号" align="center"></el-table-column>
		    <el-table-column prop="begintime" label="开始 / 结束时间" align="center">
		    	<template slot-scope="scope">
		    		{{scope.row.begintime}}<br/>
		    		{{scope.row.endtime}}
		    	</template>
		    </el-table-column>
		    <!-- <el-table-column prop="endtime" label="结束时间"></el-table-column> -->
		</el-table>
		<el-card class="right-menu" :class="{menuShow: isMenuShow}" :style="menuLoc" :body-style="{padding:'0px'}">
	        <div class="menuItemClass" @click="publishQueryRecord">回放</div>
	        <div class="menuItemClass" @click="showDownloadRecord">下载</div>
	    </el-card>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				dateRange: '',
				form: {
					resourceId: '',
					resourceCh: '',
					resourceType: '',
					stratTime: '',
					endTime: '',
					resourceName: ''
				},
				tableData: [],
				tableMaxHeight: 500,
				menuLoc: '',
				isMenuShow: false,
				currentNode: null,
				pickerOptions: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        }
			}
		},
		mounted() {
			//点击其他地方隐藏右键菜单
		    document.addEventListener('click', e => {
		        //console.log(e.target.className)
		        if(e.target.className != 'el-card__body'){
		          this.isMenuShow = false;
		          this.currentNode = null;
		        }
		    });
		    this.$nextTick(() => {
		    	this.setTableMaxHeight();
		    })
		},
		methods: {
			// 设置表格最大高度
			setTableMaxHeight() {
				// Todo
				this.tableMaxHeight = document.querySelector('#pane-VideoSearch').offsetHeight - 105;
				console.log(this.tableMaxHeight);
			},
			// 重置
			empty() {
				this.form = {
					resourceName: '',
					stratTime: '',
					endTime: ''
				}
			},
			// 显示右键菜单
			showRightMenu(row, column, event){
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					window.event.returnValue = false;
					return false;
				}
		        this.currentNode = row;
		        const left_ = event.clientX + 20;
		        const top_ = event.clientY;
		        this.menuLoc = 'left: '+ left_ +'px; top: '+top_+'px';
		        this.isMenuShow = true;
		        return false;
		    },
			// 设置检索信息
			retrieveVideoRecording(params) {
				this.form = params;
				this.dateRange = [this.form.stratTime, this.form.endTime];
				// console.log(this.form);
				this.search();
			},
			// 检索
			search() {
				// console.log(this.dateRange);
				// Testing
				this.apiSDK.retrieveVideoRecording(this.form.resourceId,this.form.resourceCh,this.form.resourceType, this.dateRange && this.dateRange[0] || '', this.dateRange && this.dateRange[1] || '', (res) => {
					this.tableData = res.data.reverse();
				})
			},
			// 录像回放
			publishQueryRecord(row) {
				if (row) {
					this.currentNode = row;
				}
				//var records=[{recordid:'dccf4a13-9abd-4707-9f27-5a50f9e9011d', begintime: this.form.stratTime, endtime: this.form.endTime}]
				var records=[{recordid:this.currentNode.recordId, begintime: this.currentNode.begintime, endtime: this.currentNode.endtime}]
        		this.apiSDK.startVideoPlayback2(this.form.resourceId, this.form.resourceCh, this.form.resourceType, records)
			},
			// 录像下载
			showDownloadRecord() {
				var id = this.currentNode.recordId;
				var name = this.currentNode.recordName+'_'+this.currentNode.begintime;
				var url = '';
				if( this.currentNode.url.length >0 ){
					var items = this.currentNode.url;
					url = items[0];
					for( var i=1;i<items.length;i++ ){
						url += '&&'+items[i];
					}
				}
				var filesize = this.currentNode.size;
				var startTime = this.currentNode.begintime;
				var endtime = this.currentNode.endtime;
				this.apiSDK.startDownloadRecord(id, name, url, filesize, startTime, endtime);

			},
		}
	}
</script>
<style scoped>
	.video-search{}
	.right-menu {
    	position: fixed;
    	display: none;
    	z-index: 1;
  	}

  	.menuShow {
    	display: block;
  	}

  	.menuItemClass {
    	font-size: 12px;
    	padding: 5px 15px;
    	cursor: pointer;
    	color:#333;
  	}
  	.menuItemClass:hover {
    	background: #dbf0fe;
  	}
  	.custom-table /deep/ td, .custom-table /deep/ th{
  		padding: 5px 0;
  		font-size: 12px;
  		user-select: none;
	    -moz-user-select: none;
	    -webkit-user-select: none;
	    -ms-user-select: none;
  	}
  	.custom-picker /deep/ .el-range-input{
  		width:110px;
  	}
</style>