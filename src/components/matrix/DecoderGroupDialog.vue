<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="解码器组管理" width="1016px" height="674px" 
            class="custom-dialog">
            <div class="decoderGroup-main">
                <div class="pointGroupsBox">
                    <div class="groupsBox">
                        <div class="groupsBoxTitle">
                            <div class="titleName">分组管理</div>
                            <div class="titleBtn" @click="handleAddGroup"></div>
                        </div>
                        <!-- <div class="groupsNameTitle">
                            <span class="span_01">分组名</span>
                            <span class="span_02">操作</span>
                        </div> -->
                        <div class="groupsBoxMain">
                            <ul id="groupsBoxMain_ul">
                                <template v-for="item in groupsArr">
                                    <li :id="item.id" :key="item.id" :class="item.active===true?'active' : '' ">
                                        <span v-if="item.readonly" class="group_name" @click="handleClickGroupsLi(item)">{{item.name}}</span>
                                        <input v-else type="text" v-model="item.name" class="groupInput_name newGroupBorder" @blur="handleSaveGroup(item)" @keyup.enter.native="handleSaveGroup(item)">
                                        <span class="group_delete_icon" @click="handleDeleteGroupConfirm(item)"></span>
                                        <span v-if="item.readonly" class="group_edit_icon" @click="handleUpdateGroup(item,$event)"></span>
                                    </li>
                                </template>
                                <li v-if="showNewGroupLi">
                                    <input type="text" v-model="newGroupName" class="groupInput_name newGroupBorder" @blur="handleSaveGroup" id="newGroupInput" @keyup.enter.native="handleSaveGroup">
                                    <!-- <span class="group_delete_icon" @click="handleDeleteGroupConfirm"></span> -->
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="pointsBox">
                        <div class="pointsBoxTitle">
                            <div class="titleName">
                                组设备
                                <span v-if="currentSelectGroup.name">-{{currentSelectGroup.name}}</span>
                            </div>
                        </div>
                        <!-- <div class="groupsNameTitle">
                            <div class="titleName" v-if="currentSelectGroup.name">
                                <span>【</span>
                                <span id="groupName_span" :title="currentSelectGroup.name">{{currentSelectGroup.name}}</span>
                                <span>】</span>
                            </div>
                        </div> -->
                        <div class="pointsBoxMain">
                            <ul id="pointsBoxMain_ul">
                                <template v-for="item in pointsArr">
                                    <li :id="item.id" :key="item.id">
                                        <!-- <el-checkbox v-model="item.checked"></el-checkbox >
                                        <span class="point_icon"></span>
                                        <span class="point_name">{{item.name}}</span> -->

                                        <el-checkbox v-model="item.checked">
                                            <span class="point_icon"></span>
                                            <span class="point_name">{{item.name}}</span>
                                        </el-checkbox >                                        
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div class="btnsBox">
                        <div type="button" class="btn confirm-btn" id="addInBtn" @click="handleAddInToGroup">
                        </div>
                        <div type="button" class="btn cancel-btn" id="removeOutBtn" @click="handleRemoveOutFromGroup">
                        </div>
                    </div>
                    <div class="allPointsBox">
                        <div class="allPointsBoxTitle">
                            <div class="titleName">解码设备</div>
                        </div>
                        <div class="allPointsBoxMain">
                            <ul id="allPointsBoxMain_ul">
                                <template v-for="item in allPointsArr">
                                    <li :id="item.id" :key="item.id">
                                        <el-checkbox v-model="item.checked">
                                            <span class="point_icon"></span>
                                            <span class="point_name">{{item.name}}</span>
                                        </el-checkbox >                                        
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <div style="text-align:center">
                    <el-button type="primary" @click="handleConfirm">保存</el-button>
                    <el-button @click="closeDialog">关闭</el-button>
                </div>
            </div>
        </el-dialog >
    </div>
</template>

<script>
export default {
    name: "DecoderGroupDialog",
    components: {},
    data() {
        return {
            isVisible:false,
            groupsArr:[],
            showNewGroupLi:false,
            newGroupName:'',
            // 当前选择分组
            currentSelectGroup:{
                id:'',
                name:'',
                order:'',
            },
            // 分组中预置点
            pointsArr:[],
            // 所有预置点
            allPointsArr:[],
        }
    },
    methods: {
        showDialog(name) {
            this.isVisible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('解码器组管理');
            });
            this.showNewGroupLi = false;
            this.newGroupName = '';
            this.currentSelectGroup = {
                id:'',
                name:'',
                order:'',
            };
            this.pointsArr = [];
            this.getDecoderGroupsList();
            this.getAllDecoderList();
        },
        closeDialog(){
            this.isVisible = false;
        },
        // 获取解码器分组列表
        getDecoderGroupsList(){
            let that = this;
            this.groupsArr = [];
            this.apiSDK.getDecoderGroupList(1, 1024, function(obj){
                // console.log(obj);  // rows:[{groupId:'',groupName:''}]
                if( obj && obj.rows.length>0 ){
                    obj.rows.forEach(item => {
                        that.groupsArr.push({
                            name:item.groupName,
                            id:item.groupId,
                            active:'false',
                            readonly:true,
                        });
                    });
                    // console.log(JSON.stringify(that.groupsArr));
                }
            });
        },
        // 选择分组
        handleClickGroupsLi(item){
            this.currentSelectGroup = item;
            // console.log('选择分组'+this.currentSelectGroup.name+'，id='+item.id);
            for(let i=0;i<this.groupsArr.length;i++){
                this.groupsArr[i].active = false;
            }
            item.active = true;
            let groupId = item.id;
            this.getDecodersByGroupId(groupId);
            this.getAllDecoderList();
        },
        // 新增分组
        handleAddGroup(){
            this.showNewGroupLi = true;
            setTimeout(function(){
                var newGroupInput = document.getElementById('newGroupInput');
                newGroupInput.focus();
            },500)
        },
        // 删除分组
        handleDeleteGroupConfirm(row){
            if(row){
                this.$confirm('是否删除该分组?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.handleDeleteGroup(row);
                });
            }else{
                this.showNewGroupLi = false
                this.newGroupName = ""
            }
        },
        handleDeleteGroup(item){
            let that = this;
            let groupId = item.id;
            this.apiSDK.deleteDecoderGroup (groupId, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0 ){
                    that.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    that.getDecoderGroupsList();
                    that.currentSelectGroup.name = '';
                    that.currentSelectGroup.id = '';
                    that.currentSelectGroup.order = '';
                    that.pointsArr = [];
                }else{
                    that.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            })
        },
        // 编辑分组
        handleUpdateGroup(item,$event){
            item.readonly = false;
            // console.log($event);
            var target = $event.target.parentNode.children[1];
            // console.log(target);
            target.focus();
        },
        // 保存新增/修改分组
        handleSaveGroup(item){
            let that = this;
            if(!item.id){
                // console.log('新增分组：'+this.newGroupName);
                if(!this.newGroupName){
                    this.showNewGroupLi = false;
                    return;
                }
                let groupName = this.newGroupName;
                let decoders = [];
                this.apiSDK.addDecoderGroup( groupName, decoders, function(obj){
                    // console.log(obj);
                    if( obj && obj.Ret === 0 ){
                        that.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        that.getDecoderGroupsList();
                    }else{
                        that.$message({
                            message: '新增失败',
                            type: 'error'
                        });
                    }
                    that.showNewGroupLi = false;
                    that.newGroupName = '';
                });
            }else{
                // console.log('修改分组：'+item.name+'，id='+item.id);
                let groupId = item.id;
                let groupName = item.name;
                let decoders = [];   // decoders:[{resId:'',resName''}....]
                if( this.pointsArr.length >0 ){
                    this.pointsArr.forEach((item,index)=>{
                        decoders.push({
                            resId:item.id,
                            resName:item.name,
                        });
                    })
                }
                this.apiSDK.modifyDecoderGroup(groupId, groupName, decoders, function(obj){
                    // console.log(obj);
                    if( obj && obj.Ret === 0 ){
                        that.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        that.getDecoderGroupsList();
                    }else{
                        that.$message({
                            message: '修改失败',
                            type: 'error'
                        });
                    }
                });
            }
        },
        // 根据Id获取解码器
        getDecodersByGroupId(groupId){
            let that = this;
            this.pointsArr = [];
            this.apiSDK.getDecoderInfoById( groupId, function(obj){
                // console.log(obj);
                if( obj && obj.length>0 ){
                    let data = obj;
                    data.forEach((item)=>{
                        that.pointsArr.push({
                            name:item.matrixName,
                            id:item.matrixId,
                            checked:false,
                        });
                    })
                    // console.log(JSON.stringify(that.pointsArr));
                }
            });
            /* 测试数据
            that.pointsArr.push(
                {name:'测试设备11',id:"11",checked:false},
                {name:'测试设备22',id:"22",checked:false},
                {name:'测试设备33',id:"33",checked:false},
                {name:'测试设备44',id:"44",checked:false},
                {name:'测试设备55',id:"55",checked:false},
            );
            console.log(JSON.stringify(that.pointsArr));
            */
        },
        // 获取所有解码设备
        getAllDecoderList(){
            let that = this;
            this.allPointsArr = [];
            this.apiSDK.getAllMatrix(1, 1024,true, function(obj){
                // console.log(obj);
                if( obj && obj.rows ){
                    obj.rows.forEach((item,index)=>{
                        that.allPointsArr.push({
                            name:item.matrixName,
                            id:item.matrixId,
                            checked:false,
                        })
                    })
                    // console.log(JSON.stringify(that.allPointsArr));
                }
            })
            /* 测试数据
            that.allPointsArr.push(
                {name:'测试设备001',id:"111",checked:false},
                {name:'测试设备002',id:"222",checked:false},
                {name:'测试设备003',id:"333",checked:false},
                {name:'测试设备004',id:"444",checked:false},
                {name:'测试设备005',id:"555",checked:false},
            );
            console.log(JSON.stringify(that.allPointsArr));
            */
        },
        // 加入按钮
        handleAddInToGroup(){
            // console.log(JSON.stringify(this.allPointsArr));
            let tempArr = [];
            this.allPointsArr.forEach((item,index)=>{
                if( item.checked === true ){
                    tempArr.push({
                        name:item.name,
                        id:item.id,
                        checked:item.checked,
                    });
                }
            });
            if( tempArr.length === 0 ){
                this.$message({
                    message: '请先选择设备',
                    type: 'warning'
                });
                return;
            }
            if( !this.currentSelectGroup.id ){
                this.$message({
                    message: '请先选择要加入的分组',
                    type: 'warning'
                });
                return;
            }
            tempArr.forEach((item,index)=>{
                if( this.pointsArr.length === 0 ){
                    this.pointsArr.push({
                        name:item.name,
                        id:item.id,
                        checked:false,
                    });
                }else{
                    let isNotRepeat = true;
                    this.pointsArr.forEach((element,i)=>{
                        if( item.id === element.id ){
                            isNotRepeat = false;
                        }
                    });
                    if( isNotRepeat === true ){
                        this.pointsArr.push({
                            name:item.name,
                            id:item.id,
                            checked:false,
                        });
                    }
                }
            });
        },
        // 移出按钮
        handleRemoveOutFromGroup(){
            // console.log('从['+this.currentSelectGroup.name+']中移出');
            if( !this.currentSelectGroup.id ){
                this.$message({
                    message: '请先选择分组',
                    type: 'warning'
                });
                return;
            }
            // console.log(JSON.stringify(this.pointsArr));
            if( this.pointsArr.length === 0 ){
                this.$message({
                    message: '请先选择设备',
                    type: 'warning'
                });
                return;
            }
            let tempArr = [];
            this.pointsArr.forEach((item,index)=>{
                if( item.checked === true ){
                    tempArr.push({
                        name:item.name,
                        id:item.id,
                        checked:item.checked,
                    });
                }
            });
            if( tempArr.length === 0 ){
                this.$message({
                    message: '请先选择设备',
                    type: 'warning'
                });
                return;
            }
            for( let i=this.pointsArr.length-1;i>-1;i-- ){
                if( this.pointsArr[i].checked === true ){
                    this.pointsArr.splice(i,1);
                }
            }
        },
        // 保存按钮
        handleConfirm(){
            let that = this;
            // console.log(JSON.stringify(this.pointsArr));
            // console.log(JSON.stringify(this.allPointsArr));
            let groupName = this.currentSelectGroup.name;
            let groupId = this.currentSelectGroup.id;
            let decoders = [];   // decoders:[{resId:'',resName''}....]
            if( this.pointsArr.length >0 ){
                this.pointsArr.forEach((item,index)=>{
                    decoders.push({
                        resId:item.id,
                        resName:item.name,
                    });
                })
            }
            // console.log('groupId='+groupId);
            // console.log(JSON.stringify(decoders));
            this.apiSDK.saveDecoderGroup(groupId,groupName,decoders, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0){
                    that.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }else{
                    that.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                }
            });
        },
    },
}
</script>

<style scoped>
.pointGroupsBox{
    width: 100%;
    height:550px;
}
.pointGroupsBox .groupsBox{
    display: inline-block;
    width: 300px;
    height: 100%;
    border:1px solid #c8cdd5;
    float:left;
}
.pointGroupsBox .groupsBox .groupsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #c8cdd5;
    background: #e9f3fa;
}
.groupsBox .groupsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#333;
    font-size: 14px;
    line-height: 40px;
}
.groupsBox .groupsBoxTitle .titleBtn{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/addBtn_b.png) no-repeat;
    background-size:100% 100%;
}
.groupsBox .groupsBoxTitle .titleBtn:hover{
    background: url(../../../static/prepointsManage/addBtn_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.pointGroupsBox .groupsBox .groupsNameTitle{
    height: 40px;
    border-bottom: 1px solid #c8cdd5;
    padding: 0px 15px;
}
.pointGroupsBox .groupsBox .groupsNameTitle .span_01{
    line-height: 40px;
    float: left;
}
.pointGroupsBox .groupsBox .groupsNameTitle .span_02{
    line-height: 40px;
    float: right;
}
.pointGroupsBox .groupsBox .groupsBoxMain{
    height: calc(100% - 40px);
    overflow: auto;
}
.groupsBoxMain ul{
    padding: 0;
    margin: 0;
}
.groupsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
}
.groupsBoxMain ul li.active{
    background: #b1e0ff;
}
.groupsBoxMain ul li .group_name{
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    /* line-height: 24px;
    vertical-align: middle; */
    color: #333;
    cursor: pointer;
}
.groupsBoxMain ul li .groupInput_name{
    display: inline-block;
    width:200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    /* line-height: 24px;
    vertical-align: middle; */
    color: #333;
    border: none;
    background: transparent;
    cursor: pointer;
}
.groupsBoxMain ul li .newGroupBorder{
    border:1px solid #ddd;
}
.groupsBoxMain ul li .group_edit_icon{
    display: inline-block;
    float: right;
    width: 17px;
    height: 17px;
    background:url("../../../static/prepointsManage/update_icon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 5px;
    margin-right: 10px;
    cursor:pointer;
}
.groupsBoxMain ul li .group_delete_icon{
    display: inline-block;
    float: right;
    width: 18px;
    height: 18px;
    background:url("../../../static/prepointsManage/delPrepare.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 5px;
    margin-right: 10px;
    cursor:pointer;
}

.pointGroupsBox .pointsBox{
    display: inline-block;
    width: 300px;
    height: 100%;
    border:1px solid #c8cdd5;
    float:left;
    margin-left: 10px;
}
.pointGroupsBox .pointsBox .pointsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #c8cdd5;
    background: #e9f3fa;
}
.pointsBox .pointsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#333;
    font-size: 14px;
    line-height: 40px;
    max-width:170px;
    height: 40px;
}
.pointGroupsBox .pointsBox .groupsNameTitle{
    height: 40px;
    border-bottom: 1px solid #c8cdd5;
    text-align: left;
    padding: 0 15px;
}
.pointsBox .groupsNameTitle .titleName{
    display: inline-block;
    color:#333;
    font-size: 14px;
    line-height: 40px;
    width:100%;
    height: 40px;
}
.pointsBox .groupsNameTitle .titleName span{
    display: inline-block;
    height: 40px;
    float: left;
}
.pointsBox .groupsNameTitle .titleName #groupName_span{
    display: inline-block;
    max-width:260px;
    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.pointGroupsBox .pointsBox .pointsBoxMain{
    height: calc(100% - 40px);
    overflow: auto;
}
.pointsBoxMain ul{
    padding: 0;
    margin: 0;
}
.pointsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
}
.pointsBoxMain ul li .point_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/decoderGroup/decoderIcon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.pointsBoxMain ul li .point_name{
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}

.pointGroupsBox .btnsBox{
    display: inline-block;
    width: 60px;
    height: 100%;
    float:left;
    text-align:center;
}
.pointGroupsBox .btnsBox .btn{
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-left: 10px;
}
.pointGroupsBox .btnsBox .confirm-btn{
    margin-top:230px;
    background: url(../../../static/prepointsManage/removeToLeft.png) no-repeat;
    background-size:100% 100%;
}
.pointGroupsBox .btnsBox .cancel-btn{
    margin-top:10px;
    background: url(../../../static/prepointsManage/removeToRight.png) no-repeat;
    background-size:100% 100%;
}

.pointGroupsBox .allPointsBox{
    display: inline-block;
    width: 300px;
    height: 100%;
    border:1px solid #c8cdd5;
    float:left;
}
.pointGroupsBox .allPointsBox .allPointsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #c8cdd5;
    background: #e9f3fa;
}
.allPointsBox .allPointsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#333;
    font-size: 14px;
    line-height: 40px;
}
.pointGroupsBox .allPointsBox .allPointsBoxMain{
    height: calc(100% - 40px);
    overflow: auto;
}
.allPointsBoxMain ul{
    padding: 0;
    margin: 0;
}
.allPointsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
}
.allPointsBoxMain ul li .point_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/decoderGroup/decoderIcon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.allPointsBoxMain ul li .point_name{
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}
</style>
