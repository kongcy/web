<template>
  <div>
    <el-dialog :visible.sync="isVisible" title="预置点组管理" width="984px" height="500px"
        class="custom-dialog" id="prepointsDialog" :append-to-body="true"  @closed="closeDialog">
      <div class="pointGroup-main">
        <div class="pointGroupsBox">
          <div class="groupsBox">
            <div class="groupsBoxTitle">
              <!-- <div class="titleName">分组名</div> -->
              <div class="titleName">预置点组列表</div>
              <div class="titleBtn" @click="handleAddGroup"></div>
            </div>
            <el-scrollbar class="groupsBoxMain">
              <ul id="groupsBoxMain_ul">
                <template v-for="item in groupsArr">
                  <li v-if="item.isparent===true" :id="item.id" :key="item.id" :class="item.active===true?'active' : '' " @click="handleClickGroupsLi(item)">
                      <span class="group_icon"></span>
                      <!-- <span class="group_name">{{item.name}}</span> -->
                      <input type="text" :readonly="item.readonly" v-model="item.name" class="groupInput_name" @blur="item.readonly === false && handleSaveGroup(item)">
                      <span class="group_delete_icon" @click="handleDeleteGroup(item)"></span>
                      <span class="group_edit_icon" @click="handleUpdateGroup(item,$event)"></span>
                </li>
                </template>
                <li v-if="showNewGroupLi">
                    <span class="group_icon"></span>
                    <input type="text" v-model="newGroupName" class="groupInput_name newGroupBorder" placeholder="新增分组" @blur="handleSaveGroup(newGroupName)" id="newGroupInput">
                    <span class="group_delete_icon"></span>
                </li>
                </ul>
            </el-scrollbar>
          </div>
          <div class="pointsBox">
            <div class="pointsBoxTitle">
              <div class="titleName">
                <span v-show="currentSelectGroup.id!=''">[</span>
                <span id="groupName_span" :title="currentSelectGroup.name">{{currentSelectGroup.name}}</span>
                <span><span v-show="currentSelectGroup.id!=''">]</span>内预置点</span>
              </div>
              <div class="titleBtn_02" id="moveUpBtn" @click="handleMoveUpInGroup"></div>
              <div class="titleBtn_01" id="moveDownBtn" @click="handleMoveDownInGroup"></div>
            </div>
            <el-scrollbar class="pointsBoxMain">
              <ul id="pointsBoxMain_ul">
                <template v-for="item in pointsArr">
                    <li :id="item.id" :key="item.id" :class="item.active===true?'active' : '' " @click="handleClickPointsLi(item)">
                        <span class="point_icon"></span>
                        <span class="point_name">{{item.name}}</span>
                    </li>
                </template>
              </ul>
            </el-scrollbar>
          </div>
          <div class="btnsBox">
            <div type="button" class="btn confirm-btn" id="addInBtn" @click="handleAddInToGroup">
            </div>
            <div type="button" class="btn cancel-btn" id="removeOutBtn" @click="handleRemoveOutFromGroup">
            </div>
          </div>
          <div class="allPointsBox">
            <div class="allPointsBoxTitle">
              <!-- <div class="titleName">全部预置点</div> -->
              <div class="titleName">未分组预置点</div>
              <div class="titleBtn_02" id="moveUpInAllBtn" @click="handleMoveUpInAll"></div>
              <div class="titleBtn_01" id="moveDownInAllBtn" @click="handleMoveDownInAll"></div>
            </div>
            <el-scrollbar class="allPointsBoxMain">
              <ul id="allPointsBoxMain_ul">
                  <template v-for="item in allPointsArr">
                  <li :id="item.id" :key="item.id" :class="item.active===true?'active' : '' " @click="handleClickAllPointsLi(item)">
                      <span class="point_icon"></span>
                      <span class="point_name">{{item.name}}</span>
                </li>
                </template>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btnCom canclebtn"  size="small" plain @click="closeDialog">关闭</el-button>
        <el-button type="primary"  size="small" class="btnCom" @click="handleConfirm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PrepointsManageDialog",
  components: {},
  data() {
    return {
        resourceId: '',
        resourceCh: 0,
      isVisible: false,
      groupsArr:[
            // {index:1,name:'预置点组1',id:"111",active:'false',isparent:true,readonly:true},
            // {index:2,name:'预置点11',id:"0011",active:'false',parentId:'111'},
            // {index:3,name:'预置点12',id:"0012",active:'false',parentId:'111'},
            // {index:4,name:'预置点13',id:"0013",active:'false',parentId:'111'},
            // {index:5,name:'预置点组2',id:"222",active:'false',isparent:true,readonly:true},
            // {index:6,name:'预置点21',id:"021",active:'false',parentId:'222'},
            // {index:7,name:'预置点22',id:"022",active:'false',parentId:'222'},
            // {index:8,name:'预置点23',id:"023",active:'false',parentId:'222'},
            // {index:9,name:'预置点组3',id:"333",active:'false',isparent:true,readonly:true},
      ],
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
      // 当前分组中选择预置点
      currentSelectPointInGroup:null,
      // 所有预置点
      allPointsArr:[
            // {index:1,name:'预置点A',id:"aaa",active:'false'},
            // {index:2,name:'预置点B',id:"bbb",active:'false'},
            // {index:3,name:'预置点C',id:"ccc",active:'false'},
            // {index:4,name:'预置点D',id:"ddd",active:'false'},
            // {index:5,name:'预置点E',id:"eee",active:'false'},
            // {index:6,name:'预置点F',id:"fff",active:'false'},
            // {index:7,name:'预置点G',id:"ggg",active:'false'},
      ],
      // 当前所有预置点中选择预置点
      currentSelectPointInAll:null,
    };
  },
  methods: {
    showDialog(resourceId,resourceCh) {
        this.isVisible = true;
        // this.$nextTick(() => {
        //   xtxk.media.setDialogTop("预置点管理");
        // });
        this.resourceId = resourceId;
        this.resourceCh = resourceCh;
        this.showNewGroupLi = false;
        this.newGroupName = '';
        this.currentSelectGroup = {
            id:'',
            name:'',
            order:'',
          };
        this.pointsArr = [];
        this.currentSelectPointInGroup = null;
        this.currentSelectPointInAll = null;
        this.getGroupList();
        this.getAllPointList();

        // 收到预置点/预置点分组静态数据修改推送消息
        this.apiSDK.setInformPTZStatusCallback(obj=>{
            console.log(obj);
            if( obj.type == 0 || obj.type == 1 ){
                this.getGroupList();
                this.getAllPointList();
            }
        })
    },
    closeDialog() {
      this.isVisible = false;
      this.$emit('close');
    },
    // 获取分组
    getGroupList(){
        let that = this;
        this.groupsArr = [];
        /*
        // 只是获取分组信息
        this.apiSDK.getYTPointGroup(this.resourceId, this.resourceCh, 1, 255, function(obj){
            console.log(obj);
            if( obj && obj.rows ){
                obj.rows.forEach((item,index)=>{
                    that.groupsArr.push({
                        name: item.groupName,
                        id:item.groupId,
                        order:item.order,
                        isparent:true,
                        readonly:true,
                        active:false,
                    });
                });
                console.log(JSON.stringify(that.groupsArr));
            }
        })
        */
        // 获取分组（带组内预置点）
        this.apiSDK.getYTPointGroupWithPoints(this.resourceId, this.resourceCh, 1, 255, function(obj){
            // console.log(obj);
            if( obj && obj.rows ){
                obj.rows.forEach((item,index)=>{
                    that.groupsArr.push({
                        name: item.groupName,
                        id:item.groupId,
                        order:item.order,
                        isparent:true,
                        readonly:true,
                        active:false,
                        points:item.points,
                    });
                });
                // console.log(JSON.stringify(that.groupsArr));
            }
        })
    },
    // 新增分组
    handleAddGroup(){
        this.showNewGroupLi = true;
        setTimeout(function(){
            let newGroupInput = document.getElementById('newGroupInput');
            newGroupInput.focus();
        },500)
    },
    // 保存新增/修改分组
    handleSaveGroup(item){
        let that = this;

        if(!item.id){
            // console.log('新增分组：'+this.newGroupName);
            if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(this.newGroupName)) {
                this.$message({
                    message: '新增分组名称不合法',
                    type: 'error'
                })
                return
            }
            if(!this.newGroupName){
                this.showNewGroupLi = false;
                return;
            }
            let groupName = this.newGroupName;
            this.apiSDK.addYTPointGroup(this.resourceId, this.resourceCh, groupName, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0 ){
                    // console.log('新增分组成功');
                    that.$message({
                        message: '新增分组成功',
                        type: 'success'
                    });
                    that.getGroupList();
                }else{
                    // console.log('新增分组失败');
                    that.$message({
                        message: '新增分组失败',
                        type: 'error'
                    });
                }
                that.showNewGroupLi = false;
                that.newGroupName = '';
            });
        }else{
            // console.log('修改分组：'+item.name+'，id='+item.id);
            if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(item.name)) {
                this.$message({
                    message: '修改分组名称不合法',
                    type: 'error'
                })
                return
            }
            let groupId = item.id;
            let groupName = item.name;
            this.apiSDK.updateYTGroup(this.resourceId, this.resourceCh, groupId, groupName, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0 ){
                    // console.log('修改分组成功');
                    that.$message({
                        message: '修改分组成功',
                        type: 'success'
                    });
                    that.getGroupList();
                }else{
                    // console.log('修改分组失败');
                    that.$message({
                        message: '修改分组失败',
                        type: 'error'
                    });
                }
            });
        }
    },
    // 删除分组
    handleDeleteGroup(item){
        let that = this;
        // console.log(JSON.stringify(item));
        // console.log('删除分组：'+item.name+'，id='+item.id);
        let groupId = item.id;
        this.apiSDK.removeGroup(this.resourceId, this.resourceCh, groupId, function(obj){
            // console.log(obj);
            if( obj && obj.Ret === 0 ){
                // console.log('删除分组成功');
                that.$message({
                    message: '删除分组成功',
                    type: 'success'
                });
                that.getGroupList();
                that.currentSelectGroup.name = '';
                that.currentSelectGroup.id = '';
                that.currentSelectGroup.order = '';

                that.pointsArr=[]
            }else{
                // console.log('删除分组失败');
                that.$message({
                    message: '删除分组失败',
                    type: 'error'
                });
            }
        });
    },
    // 修改分组
    handleUpdateGroup(item,$event){
        // console.log(JSON.stringify(item));
        item.readonly = false;
        // console.log($event);
        var target = $event.target.parentNode.children[1];
        // console.log(target);
        target.focus();
    },
    // 选择分组
    handleClickGroupsLi(item){
        this.currentSelectGroup = item;
        // console.log('选择分组'+this.currentSelectGroup.name);
        for(let i=0;i<this.groupsArr.length;i++){
            this.groupsArr[i].active = false;
        }
        item.active = true;
        let groupId = item.id;
        this.getPointsByGroupId(groupId);
        this.getAllPointList();
    },
    // 分组预置点中选择预置点
    handleClickPointsLi(item){
        this.currentSelectPointInGroup = item;
        // console.log('['+this.currentSelectGroup.name+']中选择['+this.currentSelectPointInGroup.name+']');
        this.pointsArr.forEach(item => {
            item.active = false;
        });
        item.active = true;
    },
    // 分组预置点中上移选择的预置点
    handleMoveUpInGroup(){
        // console.log(this.pointsArr);
        // console.log(this.currentSelectPointInGroup);
        // console.log('上移'+this.currentSelectPointInGroup.name);
        if( this.pointsArr.length === 0 ){
            return;
        }
        if( !this.currentSelectPointInGroup ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        let currId = this.currentSelectPointInGroup.id;
        let index = 0;
        for( let i=0;i<this.pointsArr.length;i++ ){
            if( this.pointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index-1 == -1 ){
            return;
        }
        let temp = {
            name:this.pointsArr[index].name,
            id:this.pointsArr[index].id,
            active:this.pointsArr[index].active,
        };
        this.pointsArr[index].name = this.pointsArr[index-1].name;
        this.pointsArr[index].id = this.pointsArr[index-1].id;
        this.pointsArr[index].active = this.pointsArr[index-1].active;
        this.pointsArr[index-1].name = temp.name;
        this.pointsArr[index-1].id = temp.id;
        this.pointsArr[index-1].active = temp.active;
        this.currentSelectPointInGroup = this.pointsArr[index-1];
        // console.log('上移后：');
        // console.log(this.pointsArr);
        // console.log(this.currentSelectPointInGroup);
    },
    // 分组预置点中下移选择的预置点
    handleMoveDownInGroup(){
        // console.log(this.pointsArr);
        // console.log(this.currentSelectPointInGroup);
        // console.log('下移'+this.currentSelectPointInGroup.name);
        if( this.pointsArr.length === 0 ){
            return;
        }
        if( !this.currentSelectPointInGroup ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        let currId = this.currentSelectPointInGroup.id;
        let index = 0;
        for( let i=0;i<this.pointsArr.length;i++ ){
            if( this.pointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index+1 === this.pointsArr.length ){
            return;
        }
        let temp = {
            name:this.pointsArr[index].name,
            id:this.pointsArr[index].id,
            active:this.pointsArr[index].active,
        };
        this.pointsArr[index].name = this.pointsArr[index+1].name;
        this.pointsArr[index].id = this.pointsArr[index+1].id;
        this.pointsArr[index].active = this.pointsArr[index+1].active;
        this.pointsArr[index+1].name = temp.name;
        this.pointsArr[index+1].id = temp.id;
        this.pointsArr[index+1].active = temp.active;
        this.currentSelectPointInGroup = this.pointsArr[index+1];
        // console.log('下移后：');
        // console.log(this.pointsArr);
        // console.log(this.currentSelectPointInGroup);
    },
    // 加入到分组
    handleAddInToGroup(){
        // console.log('加入到分组');
        if( !this.currentSelectPointInAll ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        // console.log(this.pointsArr);
        // console.log(this.currentSelectGroup);
        if( !this.currentSelectGroup.id ){
            this.$message({
                message: '请选择要加入的分组',
                type: 'warning'
            });
            return;
        }
        // console.log('['+this.currentSelectPointInAll.name+']'+'加入到['+this.currentSelectGroup.name+']');
        for(let i=0;i<this.allPointsArr.length;i++){
            if( this.allPointsArr[i].id === this.currentSelectPointInAll.id ){
                this.allPointsArr.splice(i,1);
                break;
            }
        }
        this.pointsArr.push({
            name:this.currentSelectPointInAll.name,
            id:this.currentSelectPointInAll.id,
            active:false,
        });
        this.currentSelectPointInAll = null;
    },
    // 从分组中移出
    handleRemoveOutFromGroup(){
        let that = this;
        if( !this.currentSelectPointInGroup ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        // console.log('从['+this.currentSelectGroup.name+']中移出['+this.currentSelectPointInGroup.name+']');
        for(let i=0;i<this.pointsArr.length;i++){
            if( this.pointsArr[i].id === this.currentSelectPointInGroup.id ){
                this.pointsArr.splice(i,1);
                break;
            }
        }
        this.allPointsArr.push({
            name:this.currentSelectPointInGroup.name,
            id:this.currentSelectPointInGroup.id,
            active:false,
        });
        this.currentSelectPointInGroup = null;
    },
    // 根据组id获取组内预置点
    getPointsByGroupId(groupId){
        let that = this;
        this.pointsArr = [];
        this.apiSDK.getYTPointByGroupId(this.resourceId, this.resourceCh, groupId, function(obj){
            // console.log(obj);
            // console.log('分组中查询预置点成功');
            if( obj && obj.length>0 ){
                let data = obj;
                data.forEach((item)=>{
                    that.pointsArr.push({
                        name:item.pointName,
                        id:item.pointId,
                        order:item.order,
                        active:false,
                    });
                })
            }
        });
    },
    // 获取组外所有预置点
    getAllPointList(){
        let that = this;
        this.allPointsArr = [];
        this.currentSelectPointInAll = null;
        this.apiSDK.getYTPointOffGroupBylimit(this.resourceId, this.resourceCh, 1, 255, function(obj){
            // console.log(obj);
            if( obj && obj.rows ){
                obj.rows.forEach((item,index)=>{
                    that.allPointsArr.push({
                        id:item.pointId,
                        name:item.pointName,
                        isDefault:item.isDefault,
                        order:item.order,
                        active:false,
                    })
                })
                // console.log(JSON.stringify(that.allPointsArr));
                // {index:1,name:'预置点A',id:"aaa",active:'false'},
            }
        })
    },
    // 全部预置点中选择预置点
    handleClickAllPointsLi(item){
        this.allPointsArr.forEach(item => {
            item.active = false;
        });
        item.active = true;
        this.currentSelectPointInAll = item;
    },
    // 全部预置点中上移选择的预置点
    handleMoveUpInAll(){
        // console.log(this.allPointsArr);
        // console.log(this.currentSelectPointInAll);
        // console.log('上移'+this.currentSelectPointInAll.name);
        if( this.allPointsArr.length === 0 ){
            return;
        }
        if( !this.currentSelectPointInAll ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        let currId = this.currentSelectPointInAll.id;
        let index = 0;
        for( let i=0;i<this.allPointsArr.length;i++ ){
            // console.log(JSON.stringify(this.allPointsArr[i]));
            if( this.allPointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index-1 == -1 ){
            return;
        }
        let temp = {
            name:this.allPointsArr[index].name,
            id:this.allPointsArr[index].id,
            active:this.allPointsArr[index].active,
        };
        this.allPointsArr[index].name = this.allPointsArr[index-1].name;
        this.allPointsArr[index].id = this.allPointsArr[index-1].id;
        this.allPointsArr[index].active = this.allPointsArr[index-1].active;
        this.allPointsArr[index-1].name = temp.name;
        this.allPointsArr[index-1].id = temp.id;
        this.allPointsArr[index-1].active = temp.active;
        this.currentSelectPointInAll = this.allPointsArr[index-1];
        // console.log('上移后：');
        // console.log(this.allPointsArr);
        // console.log(this.currentSelectPointInAll);
    },
    // 全部预置点中下移选择的预置点
    handleMoveDownInAll(){
        // console.log(this.allPointsArr);
        // console.log(this.currentSelectPointInAll);
        // console.log('下移'+this.currentSelectPointInAll.name);
        if( this.allPointsArr.length === 0 ){
            return;
        }
        if( !this.currentSelectPointInAll ){
            this.$message({
                message: '请先选择预置点',
                type: 'warning'
            });
            return;
        }
        let currId = this.currentSelectPointInAll.id;
        let index = 0;
        for( let i=0;i<this.allPointsArr.length;i++ ){
            if( this.allPointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index+1 === this.allPointsArr.length ){
            return;
        }
        let temp = {
            name:this.allPointsArr[index].name,
            id:this.allPointsArr[index].id,
            active:this.allPointsArr[index].active,
        };
        this.allPointsArr[index].name = this.allPointsArr[index+1].name;
        this.allPointsArr[index].id = this.allPointsArr[index+1].id;
        this.allPointsArr[index].active = this.allPointsArr[index+1].active;
        this.allPointsArr[index+1].name = temp.name;
        this.allPointsArr[index+1].id = temp.id;
        this.allPointsArr[index+1].active = temp.active;
        this.currentSelectPointInAll = this.allPointsArr[index+1];
        // console.log('下移后：');
        // console.log(this.allPointsArr);
        // console.log(this.currentSelectPointInAll);
    },
    // 保存
    handleConfirm() {
        let that = this;
        // console.log('保存');
        // console.log(JSON.stringify(this.groupsArr));
        // console.log(JSON.stringify(this.pointsArr));
        // console.log(JSON.stringify(this.allPointsArr));
        var groupId = this.currentSelectGroup.id;
        var ytPoints = [];  // ytPoints:[{pointId,pointName,order}]
        if( this.pointsArr.length >0 ){
            this.pointsArr.forEach((item,index2)=>{
                ytPoints.push({
                    pointId:item.id,
                    pointName:item.name,
                    order:index2,
                });
            })
        }
        if(ytPoints.length==0){
            this.$message({
                    message: '预置点分组内必须有一个预置点，请重新进行编辑',
                    type: 'warning'
                });
                return;
        }
        this.apiSDK.saveYTGroup( this.resourceId, this.resourceCh, groupId, ytPoints, function(obj){
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
        })
    },
  }
};
</script>

<style scoped>
.canclebtn {
    border-color: #6B7C92;
    background-color: transparent;
    color: #ABB3C4;
}
.canclebtn:hover {
    border-color: #fff;
    background-color: transparent;
    color: #fff;
}
.el-scrollbar.pointsBoxMain /deep/ .el-scrollbar__wrap,
.el-scrollbar.allPointsBoxMain /deep/ .el-scrollbar__wrap,
.el-scrollbar.groupsBoxMain /deep/ .el-scrollbar__wrap{
    margin-right: -22px!important;
    height: calc(100% + 17px);
}
.custom-dialog{
    background-color: transparent;
}
/deep/ .el-dialog__footer{
    text-align: center;
}
/deep/#prepointsDialog .el-dialog__body {
  padding: 15px;
}
.pointGroup-main{
    padding: 15px;
    border:2px solid #356BB0;
    background: url(../../../static/prepointsManage/bg2.png) no-repeat;
    background-size:100% 100%;
}

.pointGroupsBox{
    width: 100%;
    height:450px;
}
.pointGroupsBox .groupsBox{
    display: inline-block;
    width: 285px;
    height: 100%;
    /* border:1px solid #c8cdd5; */
    float:left;
    background: url(../../../static/prepointsManage/bg.png) no-repeat;
    background-size:100% 100%;
      color:#D3DCF0;
}
.pointGroupsBox .groupsBox .groupsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 10px;
    box-sizing: border-box;
    /* border-bottom: 1px solid #c8cdd5; */
    background: #314D78;
}
.groupsBox .groupsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#D3DCF0;
    font-size: 14px;
    line-height: 40px;
}
.groupsBox .groupsBoxTitle .titleBtn{
    display: inline-block;
    float: right;
    width: 24px;
    height: 24px;
    margin-top: 11px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/addBtn_b.png) no-repeat;
    background-size:100% 100%;
}
.groupsBox .groupsBoxTitle .titleBtn:hover{
    background: url(../../../static/prepointsManage/addBtn_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.pointGroupsBox .groupsBox .groupsBoxMain{
    height: calc(100% - 40px);
}
.groupsBoxMain ul{
    padding: 0;
    margin: 0;
}
.groupsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.groupsBoxMain ul li.active{
    background: #2f4977;
}
.groupsBoxMain ul li .group_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/prepareGroupIcon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.groupsBoxMain ul li .group_name{
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #D3DCF0;
}
.groupsBoxMain ul li .groupInput_name{
    display: inline-block;
    width:116px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #D3DCF0;
    border: none;
    background: transparent;
}
.groupsBoxMain ul li .newGroupBorder{
    border:1px solid #ddd;
}
.groupsBoxMain ul li .group_edit_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/update_icon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 10px;
    margin-right: 5px;
    visibility: hidden;
    cursor:pointer;
}
.groupsBoxMain ul li .group_delete_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/delPrepare.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 10px;
    margin-right: 5px;
    visibility: hidden;
    cursor:pointer;
}
.groupsBoxMain ul li.active .group_delete_icon{
    visibility: visible;
}
.groupsBoxMain ul li.active .group_edit_icon{
    visibility: visible;
}
.groupsBoxMain ul li:hover .group_delete_icon{
    visibility: visible;
}
.groupsBoxMain ul li:hover .group_edit_icon{
    visibility: visible;
}

.pointGroupsBox .pointsBox{
    display: inline-block;
    width: 285px;
    height: 100%;
    float:left;
    background: url(../../../static/prepointsManage/bg.png) no-repeat;
    background-size:100% 100%;
    color:#D3DCF0;
}
.pointGroupsBox .pointsBox .pointsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 10px;
    box-sizing: border-box;
    background: #314D78;
}
.pointsBox .pointsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#D3DCF0;
    font-size: 14px;
    line-height: 40px;
    max-width:170px;
    height: 40px;
}
.pointsBox .pointsBoxTitle .titleName span{
    display: inline-block;
    height: 40px;
    float: left;
}
.pointsBox .pointsBoxTitle .titleName #groupName_span{
    display: inline-block;
    max-width:150px;
    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.pointsBox .pointsBoxTitle .titleBtn_01{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/down_b.png) no-repeat;
    background-size:100% 100%;
}
.pointsBox .pointsBoxTitle .titleBtn_01:hover{
    background: url(../../../static/prepointsManage/down_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.pointsBox .pointsBoxTitle .titleBtn_02{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    margin-left: 5px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/top_b.png) no-repeat;
    background-size:100% 100%;
}
.pointsBox .pointsBoxTitle .titleBtn_02:hover{
    background: url(../../../static/prepointsManage/top_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.pointGroupsBox .pointsBox .pointsBoxMain{
    height: calc(100% - 40px);
    /* overflow: auto; */
}
.pointsBoxMain ul{
    padding: 0;
    margin: 0;
}
.pointsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.pointsBoxMain ul li.active{
    background: #2f4977;
}
.pointsBoxMain ul li .point_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/prepareIcon.png");
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
    color: #D3DCF0;
}

.pointGroupsBox .btnsBox{
    display: inline-block;
    width: 45px;
    height: 100%;
    float:left;
    text-align:center;
}
.pointGroupsBox .btnsBox .btn{
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-left: 4px;
    padding-top:25px;
}
.pointGroupsBox .btnsBox .confirm-btn{
    margin-top:125px;
    background: url(../../../static/prepointsManage/removeToLeft.png) no-repeat center top;;
    background-size:24px 24px;
}
.pointGroupsBox .btnsBox .confirm-btn:hover{
    margin-top:125px;
    background: url(../../../static/prepointsManage/removeToLeft_hover.png) no-repeat center top;;
    background-size:24px 24px;
}
.pointGroupsBox .btnsBox .cancel-btn{
    margin-top:10px;
    background: url(../../../static/prepointsManage/removeToRight.png) no-repeat center top;;
    background-size:24px 24px;
}
.pointGroupsBox .btnsBox .cancel-btn:hover{
    margin-top:10px;
    background: url(../../../static/prepointsManage/removeToRight_hover.png) no-repeat center top;;
    background-size:24px 24px;
}
.pointGroupsBox .allPointsBox{
    display: inline-block;
    width: 305px;
    height: 100%;
    float:left;
    background: url(../../../static/prepointsManage/bg.png) no-repeat;
    background-size:100% 100%;
    color:#D3DCF0;
}
.pointGroupsBox .allPointsBox .allPointsBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 10px;
    box-sizing: border-box;
    background: #314D78;
}
.allPointsBox .allPointsBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#D3DCF0;
    font-size: 14px;
    line-height: 40px;
}
.allPointsBox .allPointsBoxTitle .titleBtn_01{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/down_b.png) no-repeat;
    background-size:100% 100%;
}
.allPointsBox .allPointsBoxTitle .titleBtn_01:hover{
    background: url(../../../static/prepointsManage/down_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.allPointsBox .allPointsBoxTitle .titleBtn_02{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    margin-left: 5px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/top_b.png) no-repeat;
    background-size:100% 100%;
}
.allPointsBox .allPointsBoxTitle .titleBtn_02:hover{
    background: url(../../../static/prepointsManage/top_b_hover.png) no-repeat;
    background-size:100% 100%;
}
.pointGroupsBox .allPointsBox .allPointsBoxMain{
    height: calc(100% - 40px);
    /* overflow: auto; */
}
.allPointsBoxMain ul{
    padding: 0;
    margin: 0;
}
.allPointsBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.allPointsBoxMain ul li.active{
    background: #2f4977;
}
.allPointsBoxMain ul li .point_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/prepareIcon.png");
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
    color: #D3DCF0;
}
</style>