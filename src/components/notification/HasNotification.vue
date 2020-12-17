<template>
	<div>
        <el-table :data="tableData" border highlight-current-row class="custom-table" max-height="500" @selection-change="selectChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="notificationTime" label="通知时间" align="center" width="170">
                <template slot-scope="scope">
                    {{new Date(scope.row.notificationTime).formatDate('yyyy-MM-dd HH:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column prop="notifyUserName" label="通知人" align="center" width="100"></el-table-column>
            <el-table-column prop="resources" label="接收人" align="center" width="100" :formatter="getResourceForStr"></el-table-column>
            <el-table-column prop="content" label="通知内容" align="center" show-overflow-tooltip min-width="150"></el-table-column>
        </el-table>
        <div style="margin-top: 10px;text-align:center;">
            <!-- <el-button type="primary" @click="stopAllBroadNotification">全部停止</el-button>
            <el-button type="primary" @click="stopBroadNotificationById">停止</el-button> -->
            <el-button @click="cancel">取消</el-button>
        </div>
    </div>
</template>
<script>
export default {
  name: "HasNotification",
  data() {
    return {
        module: '',
        // 会场，广播api枚举
        moduleAPI: {
            Meet: {
                queryNotifications: 'querySendedNotifications',
                stopAllNotifications: 'deleteNotificationTemplate',
                stopAllNotificationsById: 'getNotificationTemplateById',
            },
            Broad: {
                queryNotifications: 'queryBroadSendedNotifications',
                stopAllNotifications: 'deleteBroadNotificationTemplate',
                stopAllNotificationsById: 'getBroadNotificationTemplateById',
            },
        },
        tableData: [],
        selectData: [],
    };
  },
  methods: {
    // 当选择项发生变化时
    selectChange(selection) {
        this.selectData = selection;
    },
    // 接收人转字符串
    getResourceForStr(data) {
        let str = '';
        str = data.resources.map(item => { return item.receiverName});
        return str.join('，');
    },
    // 查询已经发送的广播通知
    getTableData(module) {
        this.module = module;
        let apiFun = this.moduleAPI[this.module].queryNotifications;
        this.apiSDK[apiFun](0, 1024, res => {
            this.tableData = res;
        });
    },
    // 全部停止发送广播通知
    stopAllBroadNotification() {
        let apiFun = this.moduleAPI[this.module].stopAllNotifications;
        this.apiSDK[apiFun](res => {
            if (res.Ret == 0) {
                this.$message({message: '全部停止成功', type: 'success'});
            } else {
                this.$message({message: '全部停止失败', type: 'warning'});
            }
        });
    },
    // 停止已发广播通知
    stopBroadNotificationById() {
        // 多条
        let notificationIds = this.selectData.map(item => {return item.notificationId});
        if (!notificationId.length) {
            this.$message({message: '请选择一条数据', type: 'success'});
            return;
        }
        let apiFun = this.moduleAPI[this.module].stopAllNotificationsById;
        this.apiSDK[apiFun](notificationIds, res => {
            if (res.Ret == 0) {
                this.$message({message: '停止成功', type: 'success'});
            } else {
                this.$message({message: '停止失败', type: 'warning'});
            }
        })
    },
    // 清空数据
    empty() {
        this.selectData = [];
    },
    // 取消
    cancel() {
        this.empty();
        this.$emit('closeDialog');
    },
  }
};
</script>
<style scoped>
	
</style>