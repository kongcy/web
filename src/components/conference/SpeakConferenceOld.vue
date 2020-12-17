<template>
<div>
    <el-tag type="warning" style="margin-bottom: 10px;">发言会议中：只有会议主席和主席指定的发言对象可以自由发言！参会者也可以向主席发出申请发言请求。</el-tag>
    <el-form :model="form" :rules="rules" ref="form" label-width="85px" @keyup.enter.native="start">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="会议名称" prop="name">
                    <el-input  v-model="form.name"></el-input>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="12" class="newCol"> -->
                <!-- <el-switch v-model="form.media" :active-value="true" :inactive-value="false"></el-switch> -->
                <!-- <span>启用媒体设备</span> -->
                <!-- <el-form-item label="会议模式">
                    <el-radio v-model="form.modeRadio" label="1">常规</el-radio>
                    <el-radio v-model="form.modeRadio" label="2" :disabled="mediaType=='Audio'">拼接</el-radio>
                </el-form-item>
            </el-col> -->
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="会议密码">
                    <el-checkbox v-model="form.needPassword"></el-checkbox>
                    <el-input v-model="form.password" maxlength="6" style="width: 207px;margin-left:10px;" :disabled="!form.needPassword"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="自动录像">
                    <el-radio v-model="isMediaProcessing" :label="false">开启</el-radio>
                    <el-radio v-model="isMediaProcessing"  :label="true">关闭</el-radio>
                </el-form-item>
            </el-col>
        </el-row> -->
        <el-row :gutter="20" >
            <el-col :span="20">
                <el-form-item label="显示方案" prop="scheme">
                    <el-select v-model="form.scheme" placeholder="请选择显示方案" style="display:block;">
                        <!-- <el-option label="默认方案" value="" checked></el-option> -->
                        <el-option
                            v-for="item in schemeData"
                            :key="item.key"
                            :label="item.schemeName"
                            :value="item.schemeId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4" class="newCol">
                <el-button @click="showSchemeDialog">新 建</el-button>
            </el-col>
        </el-row>
        <el-form-item label="描述简介" prop="desc">
            <el-input type="textarea" v-model="form.desc" maxlength="100" resize="none"></el-input>
            <span id="descErrorMsg" style="color: #999">字数不超过100字</span>
        </el-form-item>
        <div class="resource">
            <el-row :gutter="20">
                <el-col :span="8"><span class="text">配置资源*</span></el-col>
                <el-col :span="16">
                    <div style="float: right;">
                        <span class="text">选择指定人员与设备</span>
                        <el-button type="text" @click="selectResource" class="add-btn"></el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>用户资源</span>
                        <el-button type="text" style="float:right" @click="batchRemove('video_person_tree',personData)" class="remove-btn"></el-button>
                    </div>
                    <el-tree
                        ref="video_person_tree"
                        :data="personData"
                        :props="defaultProps"
                        node-key="nodeId"
                        @node-click="handleNodeClick"
                        show-checkbox
                        :render-content="renderContent">
                    </el-tree>
                </el-card>
            </el-col>
            <!-- 测试需求暂时注释掉 -->
            <!-- <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>设备资源</span>
                        <el-button type="text" style="float:right" @click="batchRemove('video_device_tree', deviceData)" class="remove-btn"></el-button>
                    </div>
                    <el-tree
                        ref="video_device_tree"
                        :data="deviceData"
                        :props="defaultProps"
                        node-key="nodeId"
                        @node-click="handleNodeClick"
                        show-checkbox
                        :render-content="renderContent">
                    </el-tree>
                </el-card>
            </el-col> -->
        </el-row>
    </el-form>
    <select-resource ref="selectResource" @resourceEvent="resourceEvent"/>
    <scheme-manage-dialog ref="schemeManageDialog" @refreshData="getScheme()" />
</div>
</template>
<script>
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import Enum from "@/common/enum";

export default {
    name: 'SpeakConference',
    components: {
        SelectResource,
        SchemeManageDialog,
    },
    data () {
        let validateName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入会议名称'));
            } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
              callback(new Error('会议名称为包含中文、英文字母(大小写)、数字、下划线的组合!'));
            } else {
              callback();
            }
        }
        let validateDesc = (rule, value, callback) => {
            if (value && value.length > 100) {
                document.getElementById('descErrorMsg').style = 'color:#F56C6C'
                callback(new Error(' '));
            } else {
                document.getElementById('descErrorMsg').style = ''
                callback();
            }
        }
        return {
            form: {
                name: '临时会议',
                modeRadio:'1',
                scheme:'',
                desc: '临时会议',
                needPassword: false,
                password: '',
                isMediaProcessing: false,
            },
            rules: {
                name: [
                    { required: true, message: '请输入会议名称', trigger: 'blur' },
                    { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' },
                    { validator: validateName, trigger: 'blur'  }
                ],
                scheme:[
                    // { required: true, message: "请选择显示方案", trigger: "blur" }
                ],
                desc: [{ validator: validateDesc, trigger: 'blur'  }]
            },
            personData: [],
            deviceData: [],
            mediaType: '',
            schemeData:[],
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            }
        }
    },
    methods: {
        init (data, type, mediaType) {
            this.personData = []
            this.deviceData = []
            if (type === 'temp') {
                this.mediaType = mediaType;
                data.forEach(item => {
                    if (item.nodeStatus !== 'department') {
                        if (item.resourceType === 0) {
                            this.personData.push(item);
                        } else if (item.resourceType === 1){
                            if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                                this.personData.push(item);
                            else
                                this.deviceData.push(item);
                        }
                    }
                });
            } else if (type === 'group') {
                this.apiSDK.getMeetingGroupInfoByGroupId(data, res => {
                    this.form.name = res.groupName
                    this.form.desc = res.description
                    res.users && res.users.forEach(item => {
                        var nodeId = item.userId + "_" + (item.resCh || 0);
                        var nodeStatus = 'person_online';
                        if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                            nodeStatus = 'hwMeeting_online';
                        this.personData.push({nodeId: nodeId, id: item.userId, name: item.userName, nodeStatus: nodeStatus})
                    })
                    res.devices && res.devices.forEach(item => {
                        var nodeId = item.deviceId + "_" + (item.resCh || 0);
                        this.deviceData.push({nodeId: nodeId, id: item.deviceId, name: item.deviceName, nodeStatus: 'device_online'})
                    })
                })
            }
            this.form.modeRadio = '1';
            this.getScheme();
        },
        // 开启视频会议
        startConference() {
            return new Promise((reslove, reject) => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.personData.length === 0 && this.deviceData.length === 0 ) {
                            this.$message({message: '请至少选择一名参会用户', type: 'warning'})
                        } 
                        else {
                            let conferenceName = this.form.name
                            // let schemeId = '';
                            // console.log('this.form.scheme='+this.form.scheme);
                            let schemeId = this.form.scheme;
                            let description = this.form.desc
                            // let isMp = this.form.media
                            let isMp;
                            if( this.form.modeRadio == '1' ){
                                isMp = false;
                            }else if( this.form.modeRadio == '2' ){
                                isMp = true;
                            }
                            let operatorName = xtxk.cache.get('USER').userName
                            let members = []
                            let devices = []
                            let spectators = []
                            this.personData.forEach((item,index) => {
                                let resType = "User";
                                if(item.nodeStatus.indexOf('hwMeeting_') > -1)
                                    resType = "Device"
                                members.push({
                                    index: index,
                                    userID: item.id,
                                    userName: item.name,
                                    resourceType: resType
                                })
                            })
                            this.deviceData.forEach((item,index) => {
                                devices.push({
                                    index: index,
                                    deviceID: item.id,
                                    deviceName: item.name,
                                    deviceSIPID: ''
                                })
                            })
                            let needPassword = false;
                            let password = "1234";
                            this.apiSDK.startTempConference(conferenceName,schemeId,description,isMp,operatorName, 
                            needPassword, password,members,devices,spectators, this.mediaType)
                            // this.closeDialog()
                            reslove();
                        }
                    }
                })
            })
        },
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        // 单条删除
        remveClick(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.nodeId === data.nodeId);
            children.splice(index, 1);
        },
        // 批量删除
        batchRemove(tree, data) {
            let checkData = this.$refs[tree].getCheckedNodes()
            checkData.forEach(item => {
                let index = data.findIndex(d => d.nodeId === item.nodeId);
                data.splice(index, 1)
            })
        },
        // 选择资源
        selectResource() {
            this.$refs.selectResource.showDialog(Enum.enumSubscribeType.meeting, 1, 0, 0)
        },
        // 去重
        reduce(array) {
            let object = {}
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total
            }, [])
        },
        // 选择资源数据
        resourceEvent(data) {
            let oldPerson = this.personData
            let newPerson = data[0]
            let oldDevice = this.deviceData
            let newDevice = data[1]
            this.personData = this.reduce([...oldPerson,...newPerson])
            this.deviceData = this.reduce([...oldDevice,...newDevice])
        },
        show() {
            this.form = {
                name: '临时会议',
                // media: false,
                modeRadio:'1',
                scheme:'',
                desc: '临时会议'
            }
            this.personData = []
            this.deviceData = []
        },
        // 树样式
        renderContent(h, { node, data, store }) {
            return (
                <span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span title={node.label}>{node.label}</span>
                    <el-button class="delete-btn" type="text" on-click={ () => this.remveClick(node, data) }></el-button>
                </span>
            )
        },
        showSchemeDialog(){
            this.$refs.schemeManageDialog.showDialog();
        },
        // 获取显示方案
        getScheme() {
            let self = this;
            this.schemeData = [];
            if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6){
                this.schemeData.push({
                    schemeName:'默认方案',
                    schemeId:'',
                });
            }
            let groupType = Enum.enumGroupType.GroupMeeting;
            this.apiSDK.getDisplaySchemeBySchemeType(groupType, 1, 1024, res => {
              res && res.forEach((item)=>{
                    this.schemeData.push(item);
              });
            });
        },
    }
}
</script>
<style scoped>
.resource{
    border:1px solid #ddd;
    border: solid 1px #c2dff3;
    height: 38px;
    padding: 0 20px;
    margin-bottom: 15px;
}
.resource .text{
    color: #0f5794;
    line-height: 38px;
}
.newCol{
    line-height: 40px;
}
.newCol .el-radio{
    margin-right: 10px;
}
/deep/.box-card .custom-tree-node span{
    display: inline-block;
    max-width: 145px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

</style>