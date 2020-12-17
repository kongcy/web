<template>
	<el-dialog :title="title" :visible.sync="visible" width="1050px" class="custom-dialog" @closed="closedDialog">
		<el-tabs v-model="active" class="custom-tabs" @tab-click="tabClick">
		    <el-tab-pane label="发送通知" name="first">
		    	<send-notification ref="sendNotification" @closeDialog="visible = false" />
		    </el-tab-pane>
		    <el-tab-pane label="已发通知" name="second">
		    	<has-notification ref="hasNotification" @closeDialog="visible = false" />
		    </el-tab-pane>
		</el-tabs>
	</el-dialog>
</template>
<script>
import SendNotification from '@/components/notification/SendNotification.vue';
import HasNotification from '@/components/notification/HasNotification.vue';
export default {
  	name: "NotificationDialog",
  	components: {
        SendNotification,
        HasNotification,
  	},
  	data() {
    	return {
    		title: '广播通知',
    		active: 'first',
      		visible: false,
      		moduleData: {},
    	};
  	},
  	methods: {
  		//可接收枚举 data = [{ title: '会场通知', module: 'Meet'},{ title: '广播通知', module: 'Broad'},]
    	showDialog(data) {
    		this.moduleData = data;
    		this.title = data.title;
	      	this.visible = true;
	      	this.$nextTick(() => {
    			this.$refs.sendNotification.init(data.module);
	          	xtxk.media.setDialogTop(data.title);
	      	});
    	},
    	tabClick(tab) {
    		if (tab.name === 'second') {
    			this.$refs.hasNotification.getTableData(this.moduleData.module);
    		}
    	},
      closedDialog() {
        this.$refs.sendNotification.empty();
      }
  	}
};
</script>
<style scoped>
.custom-dialog .custom-tabs{
	border: none;
}
.custom-tabs /deep/ >.el-tabs__header{
	background-color: transparent;
	margin-bottom: 10px;
	padding: 0;
}
.custom-tabs /deep/ >.el-tabs__header .el-tabs__item{
	font-size: 16px;
}
.custom-tabs /deep/ >.el-tabs__header .el-tabs__nav-wrap{
	padding: 0 20px;
}
</style>
