<template>
<div class="SpeakConference">
    <el-form :model="form" ref="form" label-width="148px" @keyup.enter.native="start">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form-item label="会议名称" prop="name">
                    <el-input  v-model="form.name"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" >
            <el-col :span="24">
                <el-form-item label="会议模板" prop="scheme">
                    <div class="strategeInfo-type" >
                        <el-select v-model="scheme" placeholder="请选择会议模板" style="display:block;" @change='checkTemplate(scheme)'>
                            <el-option label="不调用会议模板" value="" checked></el-option>
                            <el-option
                                v-for="item in schemeData"
                                :key="item.key"
                                :label="item.templateName"
                                :value="item.templateId">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="预设主会场" prop="desc" class="item-switch">
            <el-switch v-model="form.isPreMain" active-color="#3582eb" inactive-color="#bdc1c6" :disabled="isByTemplate"> </el-switch>
        </el-form-item>
        <el-form-item label="默认锁定会议" prop="desc" class="item-switch">
            <el-switch v-model="form.isDefaultLock" active-color="#3582eb" inactive-color="#bdc1c6" :disabled="isByTemplate"> </el-switch>
        </el-form-item>
        <el-form-item label="会议密码" prop="desc" class="item-switch">
            <el-input v-model="form.password" maxlength="6" style="width: 200px;margin-right: 8px;" v-show="form.isNeedPwd" :disabled="isByTemplate"></el-input>
            <el-switch v-model="form.isNeedPwd" active-color="#3582eb"  inactive-color="#bdc1c6" :disabled="isByTemplate"> </el-switch>
        </el-form-item>
        <el-form-item label="成员参会时自动静音" prop="desc" class="item-switch">
            <el-switch v-model="form.isAutoMute" active-color="#3582eb" inactive-color="#bdc1c6" :disabled="isByTemplate"> </el-switch>
        </el-form-item>
        <el-form-item label="默认录制" prop="desc" class="item-switch">
            <el-switch v-model="form.isDefaultRecord" active-color="#3582eb" inactive-color="#bdc1c6" :disabled="isByTemplate"> </el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
            <el-input type="textarea" v-model="form.desc" maxlength="100" resize="none"></el-input>
            <span id="descErrorMsg" style="color: #999">100字内</span>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card member-box">
                    <div slot="header" class="clearfix">
                        <span>参会成员</span>
                        <el-button type="text" style="float:right" @click="batchRemove('video_person_tree',personData)" class="remove-btn" v-if="!isByTemplate" :disabled="isByTemplate"></el-button>
                        <el-button type="text" style="float:right" @click="selectResource" class="add-btn" v-if="!isByTemplate" :disabled="isByTemplate"></el-button>
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
        return {
            form: {
                name: '临时会议',
                modeRadio:'1',
                desc: '临时会议',
                isPreMain:false,
                isDefaultLock:false,
                isNeedPwd:false,
                password:'',
                isAutoMute:false,
                isDefaultRecord:false,
            },
            personData: [],
            deviceData: [],
            mediaType: '',
            schemeData:[],
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            isByTemplate:false,
            scheme:''
        }
    },
    methods: {
        init (data, type, mediaType) {
            this.personData = []
            this.deviceData = []
            this.form.modeRadio = '1';
            this.getScheme();
            if (type === 'temp') {
                this.mediaType = mediaType;
                if(data){
                    if(data.byTempalte){
                        //获取 模板id 然后选中 将控件不可用
                        this.isByTemplate = true
                        this.scheme = data.templateId
                        this.checkTemplate(data.templateId)
                    }else{
                        data && data.members && data.members.forEach(item => {
                            if (item.nodeStatus !== 'department') {
                                this.personData.push(item);
                            }
                        });
                        this.form = {
                            name: data.conferenceName,
                            modeRadio:'1',
                            desc: data.description,
                            isPreMain:false,
                            isDefaultLock:false,
                            isNeedPwd:false,
                            password:'',
                            isAutoMute:false,
                            isDefaultRecord:false,
                        }
                    }
                }
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
                modeRadio:'1',
                desc: '临时会议',
                isPreMain:false,
                isDefaultLock:false,
                isNeedPwd:false,
                password:'',
                isAutoMute:false,
                isDefaultRecord:false,
            };
            this.personData = [];
            this.deviceData = [];
            this.scheme = '';
            this.schemeData = [];
        },
        // 树样式
        renderContent(h, { node, data, store }) {
            if(this.isByTemplate){
                return (
                    <span class={"custom-tree-node " + data.nodeStatus} >
                        <span class="node-icon"></span>
                        <span title={node.label}>{node.label}</span>
                    </span>
                )
            }else{
                return (
                    <span class={"custom-tree-node " + data.nodeStatus} >
                        <span class="node-icon"></span>
                        <span title={node.label}>{node.label}</span>
                        <el-button class="delete-btn" type="text" on-click={ () => this.remveClick(node, data) }></el-button>
                    </span>
                )
            }
        },
        showSchemeDialog(){
            this.$refs.schemeManageDialog.showDialog();
        },
        // 获取显示 模板
        getScheme() {
            let self = this;
            this.schemeData = [];
            // if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6){
            //     this.schemeData.push({
            //         schemeName:'默认方案',
            //         schemeId:'',
            //     });
            // }
            // let groupType = Enum.enumGroupType.GroupMeeting;
            // this.apiSDK.getDisplaySchemeBySchemeType(groupType, 1, 1024, res => {
            //   res && res.forEach((item)=>{
            //         this.schemeData.push(item);
            //   });
            // });
            
            this.apiSDK.getConferenceTemplateList('','','',1,9999,res => {
                this.schemeData.push({
                    schemeName:'不调用会议模板',
                    schemeId:'',
                });
                if(res){
                    this.schemeData = res.data;
                }
            })
        },

        //选择模板 填充 数据
        checkTemplate(data){
            if(data == ''){ //不调用模板
                this.isByTemplate = false;
                this.show();
            }else{
                this.isByTemplate = true;
                this.schemeData.forEach(item => {
                if(item.templateId == data){
                    this.personData = [];
                    this.form = {
                        name:  '临时会议',
                        modeRadio:'1',
                        desc: item.describe,
                        isPreMain:item.isPreMain == 0 ? false : true ,
                        isDefaultLock:item.isDefaultLock == 0 ? false : true ,
                        isNeedPwd:item.isNeedPwd == 0 ? false : true ,
                        password:item.password,
                        isAutoMute:item.isAutoMute == 0 ? false : true ,
                        isDefaultRecord:item.isDefaultRecord == 0 ? false : true ,
                    }
                    item.userDtoList.forEach(val => {
                        let lt = {
                            nodeId: val.userId + '_0',
                            id: val.userId,
                            name: val.userName,
                            resourceType: 0,
                            deviceType: "none",
                            leaf: true,
                            nodeStatus: "person_online",
                            resCh: undefined,
                        }
                        if(lt.id != xtxk.cache.get('USER').userId){
                            this.personData.push(lt)
                        }
                    })
                }
            })
            }
        },
    }
}
</script>
<style scoped>
.custom-dialog .member-box /deep/ .el-card__body{
    height: 180px;
}
.member-box{
    background: none;
    color: #d3dcf0;
}
.member-box /deep/ .el-card__header{
    background: none;
}
.resource{
    border:1px solid #ddd;
    border: solid 1px #c2dff3;
    height: 38px;
    padding: 0 20px;
    margin-bottom: 5px;
}
.resource .text{
    color: #d3dcf0;
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
    vertical-align: middle;
}
/deep/ .el-form-item__label{
    text-align: left;
    color: #d3dcf0;
    line-height: 30px;
}
/deep/ .el-input__inner{
    height: 32px;
    border-radius: 2px;
    background:none;
    outline: none;
    border: 1px solid #6B7C92;
    color: #D3DCF0;
}

#MeetingInfo .SpeakConference /deep/ .el-select .el-input, #MeetingInfo .SpeakConference /deep/ .search .el-input{
    height: 32px;
}
#MeetingInfo .SpeakConference /deep/ .el-select .el-input__inner, #MeetingInfo .SpeakConference /deep/  .search .el-input__inner{
    height: 32px!important;
    background:none!important;
}
.SpeakConference /deep/ .el-input__icon{
    line-height: 32px;
}
.item-switch{
    height: 30px;
    margin-bottom:8px;
}
.SpeakConference /deep/ .el-form-item__content{
    line-height: 30px;
    text-align: right;
}
.item-switch /deep/ .el-form-item__label{
    line-height: 30px;
}

.SpeakConference /deep/ .el-form-item{
    margin-bottom:8px
}

.SpeakConference .remove-btn{
     margin-top: 0px;
}

.SpeakConference /deep/ .el-tree-node__content .delete-btn{
    top: 2px;
    width: 20px;
    height: 20px;
    background: url(../../../static/stratege/del-s-device.png);
    background-size: 20px 20px;
}
.member-box .el-tree{
    padding-top: 8px;
}
</style>