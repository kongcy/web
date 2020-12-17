<template>
<div>
    <el-dialog @close='closeDialog' :visible.sync="visible"  title="开启视频指挥" width="600px" center class="custom-dialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="85px" @keyup.enter.native="start">
            <el-form-item label="分组名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
           <!--  <el-row :gutter="20" >
                <el-col :span="20">
                    <el-form-item label="显示方案" prop="scheme">
                        <el-select v-model="form.scheme" placeholder="请选择显示方案">
                            <el-option label="默认方案" value="" checked></el-option>
                            <el-option
                                v-for="item in form.schemeData"
                                :key="item.schemeId"
                                :label="item.schemeName"
                                :value="item.schemeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="newCol">
                    <div class="addSchemeBtn" @click="handleClickAddScheme">新 建</div>
                </el-col>
            </el-row> -->
            <el-form-item label="描述简介" prop="desc">
                <el-input type="textarea" v-model="form.desc" maxlength="100"></el-input>
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

            <!-- <el-row :gutter="20">
                <el-col :span="12"> -->
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
                            show-checkbox
                            draggable
                            @node-drop="nodeDrop"
                            default-expand-all
                            :render-content="renderContent"
                            @node-click="handleNodeClick">
                        </el-tree>
                    </el-card>
                <!-- </el-col>
                <el-col :span="12">
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
                            show-checkbox
                            :render-content="renderContent"
                            @node-click="handleNodeClick">
                        </el-tree>
                    </el-card>
                </el-col>
            </el-row> -->
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="start">开启</el-button>
            <el-button @click="closeDialog">关闭</el-button>
        </span>
    </el-dialog>
    <select-resource ref="selectResource" @resourceEvent="resourceEvent"/>
    <scheme-manage-dialog ref="schemeManageDialog" @refreshData="getScheme(groupType)" />
</div>
</template>
<script>
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import Enum from "@/common/enum";
import Fun from "@/common/fun";

export default {
    name: 'VideoConferecingDialog',
    components: {
        SelectResource,
        SchemeManageDialog,
    },
    data () {
        let validateName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入分组名称'));
            } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
              callback(new Error('分组名称为包含中文、英文字母(大小写)、数字、下划线的组合!'));
            } else {
              callback();
            }
        }
        let validateDesc = (rule, value, callback) => {
            if (value && value.length > 100) {
                // document.getElementById('descErrorMsg').style = 'color:#F56C6C'
                //IE 严格模式 报错  认为style 只读属性  0629dj
                document.getElementById('descErrorMsg').style.color = '#F56C6C'
                callback(new Error(' '));
            } else {
                // document.getElementById('descErrorMsg').style = ''
                document.getElementById('descErrorMsg').style.color = ''
                callback();
            }
        }
        return {
            visible: false,
            form: {
                name: '临时指挥',
                scheme:'',
                schemeData:[
                // {
                //     schemeName:'默认方案',
                //     schemeId:'',
                // },
            ],
                desc: '临时指挥'
            },
            rules: {
                name: [
                    { required: true, message: '请输入分组名称', trigger: 'blur' },
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
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            userInfo: xtxk.cache.get("USER"),
        }
    },
    methods: {
        // 开启临时指挥
        start() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.personData.length == 0 && this.deviceData.length == 0 ) {
                        this.$message({message: '请至少选择一名参会用户', type: 'warning'})
                    } else {
                        let conferenceName = this.form.name
                        let schemeId = this.form.scheme;
                        let description = this.form.desc
                        //let operatorName = xtxk.cache.get('USER').userName
                        let members = []
                        let devices = []

                        let personData_ = Fun.transformTreeToArray(this.personData);
                        personData_.forEach((item,index) => {
                            members.push({
                                index: index,
                                userId: item.id,
                                userName: item.name,
                                parentId: !item.parentId ? this.userInfo.userId : item.parentId,
                                // resourceType: item.resourceType,
                                level: item.level + 1
                            })
                        })
                        this.deviceData.forEach((item,index) => {
                            devices.push({
                                index: index,
                                deviceId: item.id,
                                deviceName: item.name,
                                deviceCh: ''
                            })
                        })
                        this.apiSDK.startTemporaryCommand(conferenceName, members, devices, schemeId, description)
                        this.closeDialog()
                    }
                }
            })
        },
        // 拖拽成功完成时触发的事件
        nodeDrop(before, after, inner) {
            // debugger
        },
        // 单条删除
        remveClick(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.nodeId === data.nodeId);
            //children.splice(index, 1);
            this.$refs.video_person_tree.remove(node)
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
            this.$refs.selectResource.showDialog(Enum.enumSubscribeType.meeting)
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
            let newPerson = [];
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
                newPerson = data[0]
            }
            if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
                let newPerson1 = data[0]
                newPerson1.length >0 && newPerson1.forEach(item=>{
                    if(item.id != this.userInfo.userId){
                        // 不能选自己
                        newPerson.push(item);
                    }
                });
            }
            let oldDevice = this.deviceData
            let newDevice = data[1]
            this.personData = this.reduce([...oldPerson,...newPerson])
            this.deviceData = this.reduce([...oldDevice,...newDevice])
        },
        showDialog (data_, type) {
            let data = JSON.parse(JSON.stringify(data_));
            this.personData = []
            this.deviceData = []
            if (type === 'temp') {
                data.forEach(item => {
                    if (item.nodeStatus !== 'department') {
                        if (item.resourceType === 0) {
                            this.personData.push(item);
                        } else if (item.resourceType === 1){
                            this.deviceData.push(item);
                        }
                    }
                });
            } else if (type === 'group') {
            }
            this.visible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('开启视频指挥');
            });
            this.getScheme();
        },
        closeDialog () {
            this.visible = false;
            this.clearData()
        },
        clearData() {
            this.form = {
                name: '临时指挥',
                scheme:'',
                schemeData:[
                    // {
                    //     schemeName:'默认方案',
                    //     schemeId:'',
                    // },
                ],
                desc: '临时指挥'
            }
            this.personData = []
            this.deviceData = []
            //0709 dj 清空验证 
            this.$refs['form'].clearValidate()
        },
        // 树样式
        renderContent(h, { node, data, store }) {
            return (
                <span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <el-button class="delete-btn" type="text" on-click={ () => this.remveClick(node, data) }></el-button>
                </span>
            )
        },
        handleClickAddScheme(){
            this.$refs.schemeManageDialog.showDialog(Enum.enumGroupType.VideoCommand);
        },
        // 获取显示方案
        getScheme() {
            this.apiSDK.getDisplaySchemeBySchemeType(Enum.enumGroupType.VideoCommand, 1, 1024, res => {
                this.form.schemeData = res;
                // this.form.schemeData.unshift({schemeName:'默认方案', schemeId:''});
                this.form.scheme = '';
                if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
                    this.form.scheme = this.form.schemeData[0].schemeId;
                }
            });
        },
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        }
    }
}
</script>

<style scoped>
.custom-dialog .resource{
    border:1px solid #ddd;
    border: solid 1px #c2dff3;
    height: 38px;
    padding: 0 20px;
    margin-bottom: 15px;
}
.custom-dialog .resource .text{
    color: #0f5794;
    line-height: 38px;
}
.newCol{
    line-height: 40px;
}
.newCol .el-radio{
    margin-right: 10px;
}
.el-select{
    width: 100%;
}
.addSchemeBtn{
    text-align: center;
    height: 40px;
    line-height: 40px;
    border:1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
}
</style>

