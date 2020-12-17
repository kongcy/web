<template>
<div>
    <el-dialog :visible.sync="visible"  title="开启分组呼叫" width="50%" center class="custom-dialog" @closed="empty" >
        <el-form :model="form" :rules="rules" ref="form" label-width="85px" @keyup.enter.native="start">
            <el-form-item label="分组名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="简要描述" prop="desc">
                <el-input type="textarea" v-model="form.desc" maxlength="100"></el-input>
                <!-- <span id="descErrorMsg" style="color: #999">字数不超过100字</span> -->
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
	                :render-content="renderContent"
                    	@node-click="handleNodeClick">
	            </el-tree>
	        </el-card>
        </el-form>
        
        <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="start">开启</el-button>
            <el-button @click="closeDialog">取消</el-button>
        </span>
    </el-dialog>
    <select-resource ref="selectResource" @resourceEvent="resourceEvent"/>
</div>
</template>
<script>
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import Enum from "@/common/enum";

export default {
    name: 'VideoConferecingDialog',
    components: {
        SelectResource
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
        return {
            visible: false,
            groupId: '',
            form: {
                name: '',
                media: false,
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入分组名称', trigger: 'blur' },
                    { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' },
                    { validator: validateName, trigger: 'blur'  }
                ],
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
        // 开启分组呼叫
        start() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (!this.personData.length) {
                        this.$message({message: '请至少选择一名用户', type: 'warning'})
                    } else {
                        let members = this.personData.map((item,index) => {
                            return { resId: item.id, resName: item.name }
                        })
                        this.apiSDK.startGroupCall(this.groupId, members)
                        this.closeDialog()
                    }
                }
            })
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
            let newPerson = data[0]
            this.personData = this.reduce([...oldPerson,...newPerson])
        },
        showDialog (groupId) {
        	this.groupId = groupId;
        	this.personData = [];
            this.apiSDK.getResourcesByGroupId(groupId, res => {
	            this.form.name = res.groupName
	            this.form.desc = res.description
	            res.resources && res.resources.forEach(item => {
                    var nodeId = item.resID + "_" + (item.resCh || 0);
                    let nodeStatus = 'person_online';
                    if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                        nodeStatus = "hwMeeting_online"
	                this.personData.push({nodeId: nodeId, id: item.resID, name: item.resName, nodeStatus: nodeStatus})
	            })
	        })
            this.visible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('开启分组呼叫');
            });
        },
        closeDialog () {
            this.visible = false;
            this.empty()
        },
        empty() {
            this.form = {
                name: '',
                media: false,
                desc: ''
            }
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
</style>

