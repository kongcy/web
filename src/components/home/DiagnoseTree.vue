<template>
    <div class="diagnose-tree">
        <div class="headerTitle">系统拓扑</div>
        <div class="diagnose-search">
            <el-input
                placeholder="请输入节点名称"
                v-model="filterText"
                clearable
                @keyup.enter.native="handleSearchByKey">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
            </el-input>
        </div>
        <div class="diagnose-radio">
                <el-radio v-model="radio" label="1">按名称</el-radio>
                <el-radio v-model="radio" label="2">按IP</el-radio>
        </div>
        <el-scrollbar class="treeWrap hiddenXScroll">
            <el-tree ref="tree2"
                node-key="nodeId"
                :default-expanded-keys="expandedNodes"
                :data="diagnoseTreeData"
                :props="props"
                :render-content="renderContent"
                @node-click="handleNodeClick">
            </el-tree>
        </el-scrollbar>
    </div>
</template>
<script>
import diagnoseTreeData from '../../../static/config/diagnose.json'
export default {
    name: 'diagnoseTree',
    data(){
        return{
            diagnoseTreeData:[], //整个树data
            expandedNodes:[], //默认张开的id集合
            props: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            filterText: '',//关键字过滤
            radio: '1' // 过滤选项
        }
    },
    mounted(){
        // this.init()
    },
    methods: {
        init(){
            this.diagnoseTreeData = this._initDepartmentTreeData(diagnoseTreeData)                    
            //默认展开一级节点
            this.diagnoseTreeData.forEach(item => {
                this.expandedNodes.push(item.nodeId);
            });
            this.$emit('saveNodeId', this.diagnoseTreeData[0].nodeId)
            console.log('this.diagnoseTreeData====', this.diagnoseTreeData)
        },
        handleNodeClick(data) {
            this.$emit('saveNodeId', data.nodeId)
            console.log(data);
        },
        handleSearchByKey(){
            if(this.radio=='1'){
                let data = diagnoseTreeData.filter(e=>{return e.name.includes(this.filterText)})
                this.diagnoseTreeData = this._initDepartmentTreeData(data)
            }else{
                let data = diagnoseTreeData.filter(e=>{return e.nodeIp.includes(this.filterText)})
                this.diagnoseTreeData = this._initDepartmentTreeData(data) 
            }
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            //console.log(data.nodeStatus, data.alarm, '------------')
            let icon = data.nodeStatus
            let alarm = data.alarm ? "alarm" : ''
            //wxx 2020.11.25
            let count='('+data.onLineCount+'/'+data.totalCount+')'
            if(data.nodeStatus=='department'||data.nodeStatus=='company'){
                return (<span class={"custom-tree-node " + icon + " " + alarm} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
            }else{
                  return (<span class={"custom-tree-node " + icon + " " + alarm} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
            }
                
        },
        //初始化单位树数据
        _initDepartmentTreeData: function(list, pId) {
            let nodeStatus='department';
            if (pId == undefined){
                pId = "";
                nodeStatus='company';
            };
            //先找根节点，有的根节点父ID为空，有的根节点其ID与父ID相同
            for (var i = 0, l = list.length; i < l; i++) {
                var item = list[i];
                if (item.pId === item.id){
                    item.pId = "";
                    nodeStatus='company';
                } 
            }
            var zNodes = [];
            for (var i = 0, l = list.length; i < l; i++) {
                var item = list[i];
                if (item.pId === pId) {
                    var obj = {
                        nodeId: item.id,
                        nodeIp: item.nodeIp,
                        id: item.id,
                        name: item.name,
                        leaf: false,
                        nodeStatus: nodeStatus,
                        alarm: false,
                    };
                    obj.children = this._initDepartmentTreeData(list, item.id);
                    zNodes.push(obj);
                }
            }
            return zNodes;
        }
    }
}
</script>
<style>
.diagnose-tree{
    height: 100%;
    background: url(../../../static/main/screen/resource_bg.png) no-repeat top;
    margin-top: -2px;
    background-size: 100% 100%;
    color: #fff;
}
.diagnose-tree .headerTitle{
    padding: 0 25px 0 20px;
    background-color: #314D78;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
}
.diagnose-tree .diagnose-search{
    height: 40px;
    padding: 10px 20px;
    border-top: 1px solid #365076;
}
.diagnose-radio{
    height: 40px;
    padding: 0px 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.diagnose-radio .el-radio,
.diagnose-radio .el-radio__input.is-checked+.el-radio__label{
    color: #fff;
}
.diagnose-tree .diagnose-search .el-input__inner{
    padding: 0 30px 0 5px;
    background: #11274C;
    border-color: #6B7C92;
    color: #6B7C92;
}
.diagnose-tree .diagnose-search .el-input__icon{
    cursor: pointer;
}
.diagnose-tree .treeWrap{
    width:414px;
    height: calc(100% - 141px);
    /* overflow: hidden; */
    padding: 0 0 0 16px;
    box-sizing: border-box;
}
.diagnose-tree .treeWrap .el-scrollbar__wrap{
    overflow-x: hidden;
}
</style>