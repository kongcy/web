<template>
    <el-dialog :visible.sync="visible"  :title="dialogTitle" width="700px" center class="custom-dialog start-meetimg" @closed="closeDialog" >
        <div class="box-center">
            <div class="type-item SpeakConference">
                <el-form :model="form" ref="form" label-width="148px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="模板名称" prop="name">
                                <el-input  v-model="form.templateName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="模板描述" prop="desc">
                        <el-input type="textarea" v-model="form.describe" maxlength="100" resize="none"></el-input>
                        <span id="descErrorMsg" style="color: #999">100字内</span>
                    </el-form-item>
                    <el-form-item label="预设主会场" prop="desc" class="item-switch">
                        <el-switch v-model="form.isPreMain" active-color="#3582eb" inactive-color="#bdc1c6" active-value='1' inactive-value='0'> </el-switch>
                    </el-form-item>
                    <el-form-item label="默认锁定会议" prop="desc" class="item-switch">
                        <el-switch v-model="form.isDefaultLock" active-color="#3582eb" inactive-color="#bdc1c6" active-value='1' inactive-value='0'> </el-switch>
                    </el-form-item>
                    <el-form-item label="会议密码" prop="desc" class="item-switch">
                        <el-input v-model="form.password" maxlength="6" style="width: 200px;margin-right: 8px;" v-show="form.isNeedPwd == '1'"></el-input>
                        <el-switch v-model="form.isNeedPwd" active-color="#3582eb"  inactive-color="#bdc1c6" active-value='1' inactive-value='0'> </el-switch>
                    </el-form-item>
                    <el-form-item label="成员参会时自动静音" prop="desc" class="item-switch">
                        <el-switch v-model="form.isAutoMute" active-color="#3582eb" inactive-color="#bdc1c6" active-value='1' inactive-value='0'> </el-switch>
                    </el-form-item>
                    <el-form-item label="默认录制" prop="desc" class="item-switch">
                        <el-switch v-model="form.isDefaultRecord" active-color="#3582eb" inactive-color="#bdc1c6" active-value='1' inactive-value='0'> </el-switch>
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-card class="box-card member-box">
                                <div slot="header" class="clearfix">
                                    <span>参会成员</span>
                                    <el-button type="text" style="float:right" @click="batchRemove('video_person_tree',personData)" class="remove-btn"></el-button>
                                    <el-button type="text" style="float:right" @click="selectResource" class="add-btn"></el-button>
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
            </div>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;">
            <el-button type="primary" @click="addTemplate">确定</el-button>
            <el-button class="no-background" @click="closeDialog">取消</el-button>
        </span>
        
        <select-resource ref="selectResource" @resourceEvent="resourceEvent"/>
    </el-dialog>
</template>
<script>
import Enum from "@/common/enum";
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
export default {
    name: 'ConferenceTemplateDialog',
    components: {
        SelectResource
    },
    data() {
        return {
            visible: false,
            dialogTitle:'新建会议模板',
            templateId:'', //模板ID  判断 编辑 还是 添加
            form: {
                templateName: '',
                describe: '',
                isPreMain:'0',
                isDefaultLock:'0',
                isNeedPwd:'0',
                password:'',
                isAutoMute:'0',
                isDefaultRecord:'0'
            },
            personData: [],
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            }
        }
    },
    methods: {
        showDialog(data) {
            this.visible = true;
            if(data){
                this.dialogTitle = data.title
                this.templateId = data.item.templateId
                this.form = {
                    templateName: data.item.templateName,
                    describe: data.item.describe,
                    isPreMain:data.item.isPreMain + '',
                    isDefaultLock:data.item.isDefaultLock + '',
                    isNeedPwd:data.item.isNeedPwd + '',
                    password:data.item.password,
                    isAutoMute:data.item.isAutoMute + '',
                    isDefaultRecord:data.item.isDefaultRecord + ''
                }
                data.item.userDtoList.forEach(item => {
                    let lt = {
                        nodeId: item.userId + '_0',
                        id: item.userId,
                        name: item.userName,
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
            console.log(checkData)
            checkData.forEach(item => {
                let index = data.findIndex(d => d.nodeId === item.nodeId);
                data.splice(index, 1)
            })
        },
        // 选择资源
        selectResource() {
            this.$refs.selectResource.showDialog(Enum.enumSubscribeType.meeting, 1, 0, 0)
        },
        // 选择资源数据
        resourceEvent(data) {
            let oldPerson = this.personData
            let newPerson = data[0]
            this.personData = this.reduce([...oldPerson,...newPerson])
        },
        // 去重
        reduce(array) {
            let object = {}
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total
            }, [])
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
        // 添加会议模板
        addTemplate() {
            if(this.form.templateName == ''){
                this.showremind('error','模板名称不能为空');
                return;
            }
            if(!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,50}$/.test(this.form.templateName)){
                this.showremind('error','模板名称含有特殊字符');
                return;
            }
            if(this.form.isNeedPwd == '1' && this.form.password == ''){
                this.showremind('error','请输入密码');
                return;
            }
            if(this.personData.length == 0){
                this.showremind('error','请选择参会人员');
                return;
            }
            let selfInfo = xtxk.cache.get("USER");
            //自己
            let userDtoList = [{
                userId:selfInfo.userId,
                userName:selfInfo.userName
            }];
            //+成员
            this.personData.forEach(item => { 
                let obj = {
                    userId:item.id,
                    userName:item.name
                }
                userDtoList.push(obj)
            })
            let attendance = userDtoList.length;
            if(this.templateId == ''){
                this.apiSDK.addConferenceTemplate(
                    this.form.templateName,
                    attendance,
                    this.form.describe,
                    parseInt(this.form.isPreMain),
                    parseInt(this.form.isDefaultLock),
                    parseInt(this.form.isNeedPwd),
                    parseInt(this.form.isAutoMute),
                    parseInt(this.form.isDefaultRecord),
                    this.form.password,
                    userDtoList,
                    res => {
                        if(res.code == 1){
                            this.showremind('success',res.msg);
                            this.$parent.$refs.meetingInfo.getManageQueryList();
                            this.$parent.$refs.meetingManage.getQueryList();
                            this.$parent.$refs.meetingManage.getQueryListHistory();
                            this.closeDialog();
                        }else{
                            this.showremind('error',res.msg);
                        }
                    }
                )
            }else{   //编辑
                this.apiSDK.updateConferenceTemplate(
                    this.templateId,
                    this.form.templateName,
                    attendance,
                    this.form.describe,
                    parseInt(this.form.isPreMain),
                    parseInt(this.form.isDefaultLock),
                    parseInt(this.form.isNeedPwd),
                    parseInt(this.form.isAutoMute),
                    parseInt(this.form.isDefaultRecord),
                    this.form.password,
                    userDtoList,
                    res => {
                        if(res.code == 1){
                            this.showremind('success',res.msg);
                            this.$parent.$refs.meetingInfo.getManageQueryList();
                            this.$parent.$refs.meetingManage.getQueryList();
                            this.closeDialog();
                        }else{
                            this.showremind('error',res.msg);
                        }
                    }
                )
            }
        },
        closeDialog() {
            this.resetData();
            this.visible = false;
        },
        // 清空数据
        resetData(){
            this.form =  {
                templateName: '',
                describe: '',
                isPreMain:'0',
                isDefaultLock:'0',
                isNeedPwd:'0',
                password:'',
                isAutoMute:'0',
                isDefaultRecord:'0'
            };
            this.personData = [];
        },
        showremind(type,message){
            this.$notify({
                message: message,
                type: type,
            });
        },
    }
}
</script>
<style scoped>
.box-center{
    height: 640px;
    padding: 0px 130px;
}
.control-div{
    display: inline-block;
    height: 32px;
}
/* redio样式 */
/deep/ .el-radio{
    margin-right: 90px;
}
/deep/ .el-radio:last-child {
    margin-right: 0;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
    /* border-color: #409EFF;
    background: none; */
    border:none;
    background:url(../../../static/common/redio_active.png) no-repeat center;
}
/deep/ .el-radio__inner {
    /* border-color: #6B7C92;
    background: none; */
    width:20px;
    height:20px;
    border:none;
    background:url(../../../static/common/redio_no.png) no-repeat center;
}
/deep/ .el-radio__inner::after {
    /* border-radius: 50%;*/
    background:url(../../../static/common/redio_active.png) no-repeat center;
    /* background-color: #409EFF;  */
}
.base-point /deep/ .el-radio__inner::after {
    width: 8px;
    height: 8px;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #d3dcf0;
}
/deep/ .el-radio__label{
    color: #d3dcf0;
    padding-left: 0px;
}

.type-item{
    width: 100%;

}
.type-item .lable{
    display: inline-block;
    width: 148px;
}
.type-item /deep/ .el-textarea__inner{
    background: none;
    border: solid 1px #6b7c92;
    border-radius: 0px;
    color: #d3dcf0;
}

.start-meetimg .el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    margin-left: 24px;
}
.start-meetimg /deep/ .el-button.no-background:focus,.start-meetimg /deep/ .el-button.no-background:hover{
    color: #ABB3C4;
    border-color: #c6e2ff;
    background: none;
}
/deep/ .el-tree-node__content:hover {
    background-color: #2f4977;
}
/deep/ .el-tree-node:focus>.el-tree-node__content{
    background-color: #2f4977;
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

.custom-dialog .SpeakConference .add-btn,
.custom-dialog .SpeakConference .remove-btn{
    width: 18px;
    height: 18px;
    margin-left:0px;
    padding: 0;
}
.custom-dialog .SpeakConference .add-btn{
    margin-right: 15px;
}
</style>
