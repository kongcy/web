<template>
  <div>
    <el-dialog :visible.sync="isVisible" title="巡航配置" width="984px" height="500px" class="custom-dialog" id="prepointsDialog" 
        :append-to-body="true">
      <div class="pointGroup-main">
        <div class="pointGroupsBox">
          <div class="groupsBox">
            <div class="groupsBoxTitle">
              <div class="titleName">巡航方案</div>
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
                    <input type="text" v-model="newGroupName" class="groupInput_name newGroupBorder" @blur="handleSaveGroup" id="newGroupInput">
                    <span class="group_delete_icon"></span>
                </li>
                </ul>
            </el-scrollbar>
          </div>
          <div class="pointsBox">
              <div class="pointsBoxTop">
            <div class="pointsBoxTitle">
              <div class="titleName">
                <span v-show="currentSelectGroup.id!=''">[</span>
                <span id="groupName_span" :title="currentSelectGroup.name">{{currentSelectGroup.name}}</span>
                <span> <span  v-show="currentSelectGroup.id!=''">]</span>预置点</span>
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
           <div class="intervalSelectBox">
                <span class="interval_span">循环间隔</span>
                <el-radio-group v-model="loopValue" size="small">
                    <el-radio  border  v-for="item in loopOptions" :key="item.value" :label="item.label">{{item.label}}</el-radio>
                </el-radio-group>

                <!-- <el-select v-model="loopValue" placeholder="请选择" class="interval_select">
                    <el-option v-for="item in loopOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select> -->
            </div>
        <el-button class="btnCom canclebtn" size="small" @click="closeDialog" style="margin-left:-220px;">关闭</el-button>
		<el-button type="primary" class="btnCom"  size="small" @click="handleConfirm">保存</el-button>
        <el-button type="primary" class="btnCom" size="small" @click="handleStartCruse">{{isStartedCruse===false?startCruseBtn:stopCruseBtn}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CruseManageDialog",
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
      loopValue:'20秒',
      loopOptions:[
          {
              label:'10秒',
              value:'10秒',
          },
          {
              label:'20秒',
              value:'20秒',
          },
          {
              label:'30秒',
              value:'30秒',
          },
          {
              label:'1分钟',
              value:'1分钟',
          },
      ],
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
      isStartedCruse:false,
      startedCruseSchemeId:'',
	  startCruseBtn:'开始巡航',
	  stopCruseBtn:'停止巡航',
      encoderSIPID: ''
    };
  },
  mounted(){
      let that = this;
        // 是否开启巡航
        this.apiSDK.setInformPTZStatusCallback(function(obj){
            console.log(obj);
            if ( !obj.schemeId ){
                // 目前未开启巡航
                that.isStartedCruse = false;
            }else{
                // 已开启巡航
                that.isStartedCruse = true;
                that.startedCruseSchemeId = obj.schemeId;
            }
        });
  },
  methods: {
    showDialog(resourceId,resourceCh) {
        this.isVisible = true;
        this.$nextTick(() => {
          xtxk.media.setDialogTop('巡航配置');
        });
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
        this.isStartedCruse = false;
        this.getSchemeList();
        this.getAllPointList();
    },
    closeDialog() {
      if( this.isStartedCruse ===true ){
          this.apiSDK.stopScheme2Cruise(this.resourceId, this.resourceCh, this.startedCruseSchemeId);
      }
      this.isVisible = false;
    },
    // 获取巡航组
    getSchemeList(){
        let that = this;
        that.groupsArr = [];
        let arr = [];
        this.apiSDK.getYtSchemePlanByLimit(this.resourceId, this.resourceCh, 1, 255, function(obj){
            // console.log(obj);
            if( obj && obj.rows ){
                obj.rows.forEach((item,index)=>{
                    arr.push({
                        name: item.schemeName,
                        id:item.schemeID,
                        order:item.order,
                        loopTime:item.loopTime,
                        isparent:true,
                        readonly:true,
                        active:'false',
                        points:[],
                    });
                });
                // console.log(JSON.stringify(that.groupsArr));
            }
            that.groupsArr = arr;
        });
    },
    // 新增方案
    handleAddGroup(){
        this.showNewGroupLi = true;
        setTimeout(function(){
            var newGroupInput = document.getElementById('newGroupInput');
            newGroupInput.focus();
        },500)
    },
    // 保存新增/修改方案
    handleSaveGroup(item){
        let that = this;
        let loopTime;
        if( this.loopValue == '10s' ){
            loopTime = 10;
        }else if( this.loopValue == '20s' ){
            loopTime = 20;
        }else if( this.loopValue == '30s' ){
            loopTime = 30;
        }else if( this.loopValue == '1min' ){
            loopTime = 1*60;
        }
        // console.log('loopTime='+loopTime);
        if(!item.id){
            // console.log('新增方案：'+this.newGroupName);
            if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(this.newGroupName)) {
                this.$message({
                    message: '新增方案名称不合法',
                    type: 'error'
                })
                return
            }
            if(!this.newGroupName){
                this.showNewGroupLi = false;
                return;
            }
            let schemeName = this.newGroupName;
            this.apiSDK.addSchemePlan(this.resourceId, this.resourceCh, schemeName, loopTime, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0 ){
					// console.log('新增方案成功');
					that.$message({
						message: '新增方案成功',
						type: 'success'
					});
                    that.getSchemeList();
                }else{
					// console.log('新增方案失败');
					that.$message({
						message: '新增方案失败',
						type: 'error'
					});
                }
                that.showNewGroupLi = false;
                that.newGroupName = '';
            });
        }else{
            // console.log('修改方案：'+item.name+'，id='+item.id);
            if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(item.name)) {
                this.$message({
                    message: '修改方案名称不合法',
                    type: 'error'
                })
                return
            }
            let schemeId = item.id;
            let schemeName = item.name;
            this.apiSDK.updateSchemePlan(this.resourceId, this.resourceCh, schemeId, schemeName, loopTime, function(obj){
                // console.log(obj);
                if( obj && obj.Ret === 0 ){
					// console.log('修改方案成功');
					that.$message({
						message: '修改方案成功',
						type: 'success'
					});
                    that.getSchemeList();
                }else{
					// console.log('修改方案失败');
					that.$message({
						message: '修改方案失败',
						type: 'error'
					});
                }
            });
        }
    },
    // 删除方案
    handleDeleteGroup(item){
        let that = this;
        // console.log(JSON.stringify(item));
        // console.log('删除方案：'+item.name+'，id='+item.id);
        let schemeId = item.id;
        this.apiSDK.removeSchemePlan(this.resourceId, this.resourceCh, schemeId, function(obj){
            // console.log(obj);
            if( obj && obj.Ret === 0 ){
				// console.log('删除方案成功');
				that.$message({
					message: '删除方案成功',
					type: 'success'
				});
                that.getSchemeList();
                that.currentSelectGroup.name = '';
                that.currentSelectGroup.id = '';
                that.currentSelectGroup.order = '';

                that.pointsArr = []
            }else{
				// console.log('删除方案失败');
				that.$message({
					message: '删除方案失败',
					type: 'error'
				});
            }
        });
    },
    // 修改方案
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
        let schemeId = item.id;
        this.getPointsBySchemeId(schemeId);
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
        var currId = this.currentSelectPointInGroup.id;
        var index = 0;
        for( var i=0;i<this.pointsArr.length;i++ ){
            if( this.pointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index-1 == -1 ){
            return;
        }
        var temp = {
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
        var currId = this.currentSelectPointInGroup.id;
        var index = 0;
        for( var i=0;i<this.pointsArr.length;i++ ){
            if( this.pointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index+1 === this.pointsArr.length ){
            return;
        }
        var temp = {
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
        let that = this;
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
                message: '请选择要加入的方案',
                type: 'warning'
            });
            return;
        }
		// console.log('['+this.currentSelectPointInAll.name+']'+'加入到['+this.currentSelectGroup.name+']');
		/*
		for(let i=0;i<this.allPointsArr.length;i++){
            if( this.allPointsArr[i].id === this.currentSelectPointInAll.id ){
                this.allPointsArr.splice(i,1);
                break;
            }
		}
		*/
		if( this.pointsArr.length === 0 ){
			this.pointsArr.push({
				name:this.currentSelectPointInAll.name,
				id:this.currentSelectPointInAll.id,
				active:false,
			});
		}else{
			var isNotReapeat = true;
			for( let i=0;i<this.pointsArr.length;i++ ){
				if( this.pointsArr[i].id === this.currentSelectPointInAll.id ){
					isNotReapeat = false;
				}
			}
			if(isNotReapeat === true  ){
				this.pointsArr.push({
					name:this.currentSelectPointInAll.name,
					id:this.currentSelectPointInAll.id,
					active:false,
				});
			}
		}
        // this.currentSelectPointInAll = null;
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
		/*
		if( this.allPointsArr.length === 0 ){
			this.allPointsArr.push({
				name:this.currentSelectPointInGroup.name,
				id:this.currentSelectPointInGroup.id,
				active:false,
			});
		}else{
			var isNotReapeat = true;
			for( let i=0;i<this.allPointsArr.length;i++ ){
				if( this.allPointsArr[i].id === this.currentSelectPointInGroup.id ){
					isNotReapeat = false;
				}
			}
			if(isNotReapeat === true  ){
				this.allPointsArr.push({
					name:this.currentSelectPointInGroup.name,
					id:this.currentSelectPointInGroup.id,
					active:false,
				});
			}
		}
		*/
        this.currentSelectPointInGroup = null;
    },
    // 根据方案id查询预置点
    getPointsBySchemeId(schemeId){
        let that = this;
        this.pointsArr = [];
        this.apiSDK.getYTPointInSchemeBySchemeId(this.resourceId, this.resourceCh, schemeId, function(obj){
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
    // 获取所有预置点
    getAllPointList(){
        let that = this;
        this.allPointsArr = [];
        this.currentSelectPointInAll = null;
        this.apiSDK.getYTPointByLimit(this.resourceId, this.resourceCh, 1, 255, function(obj){
            // console.log(obj);
            if( obj && obj.rows ){
                obj.rows.forEach((item,index)=>{
                    that.allPointsArr.push({
                        id:item.pointId,
                        name:item.pointName,
                        isDefault:item.isDefault,
                        encoderSIPID: item.encoderSIPID,
                        order:item.order,
                        active:false,
                    })
                })
                  this.encoderSIPID = obj.encoderSIPID;
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
        var currId = this.currentSelectPointInAll.id;
        var index = 0;
        for( var i=0;i<this.allPointsArr.length;i++ ){
            if( this.allPointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index-1 == -1 ){
            return;
        }
        var temp = {
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
        var currId = this.currentSelectPointInAll.id;
        var index = 0;
        for( var i=0;i<this.allPointsArr.length;i++ ){
            if( this.allPointsArr[i].id == currId ){
                index = i;
                break;
            }
        }
        if( index+1 === this.allPointsArr.length ){
            return;
        }
        var temp = {
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
        // console.log(this.groupsArr);
        // console.log(this.pointsArr);
        // console.log(this.allPointsArr);
        var schemeId = this.currentSelectGroup.id;
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
        this.apiSDK.saveSchemePlan( this.resourceId, this.resourceCh, schemeId, ytPoints, function(obj){
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
	// 开始巡航按钮
	handleStartCruse(){
		if( !this.currentSelectGroup.id ){
			this.$message({
                message: '请先选择巡航方案',
                type: 'warning'
            });
			return;
		}
		var schemeId = this.currentSelectGroup.id;
		// console.log('schemeId='+schemeId);
		if( this.isStartedCruse === false ){
			this.apiSDK.startScheme2Cruise(this.resourceId, this.resourceCh, schemeId);
		}else{
			this.apiSDK.stopScheme2Cruise(this.resourceId, this.resourceCh, schemeId);
		}
	},
  }
};
</script>

<style scoped>
.intervalSelectBox{
    float:left;
    color: #ABB3C4;
}
.el-radio-group {
    margin-left: 10px;
}
.intervalSelectBox .el-radio{
    margin-right:5px;
}
.intervalSelectBox /deep/ .el-radio__input{
    display: none;
}
.intervalSelectBox /deep/ .el-radio__label{
    padding-left:0px;
    color: #ABB3C4;
    
}
.intervalSelectBox /deep/  .el-radio.is-bordered{
     padding: 8px 5px 0 5px;
    border: 1px solid #6B7C92;
}
.intervalSelectBox /deep/ .el-radio.is-bordered:hover{
    border: 1px solid #fff;
    color:#fff;
}
.intervalSelectBox /deep/ .el-radio.is-bordered.is-checked{
    border:1px solid transparent;
    background: #6098FF;
    color:#fff;
}
.intervalSelectBox /deep/ .el-radio.is-bordered.is-checked .el-radio__label{
      color:#fff;
}
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
    margin-right: 25px;
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
/* .pointGroupsBox .pointsBox .pointsBoxTop{
    height: calc(100% - 50px);
    border:1px solid #c8cdd5;
} */
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
.pointGroupsBox .pointsBox .intervalSelectBox{
    height: 40px;
    margin-top: 10px;
    text-align: left;
}
.pointGroupsBox .intervalSelectBox .interval_span{
    display: inline-block;
    line-height: 40px;
}
.pointGroupsBox .intervalSelectBox .interval_select{
    display: inline-block;
    width: 170px;
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
    background: url(../../../static/prepointsManage/removeToLeft.png) no-repeat center top;
  background-size:24px 24px;
}
.pointGroupsBox .btnsBox .confirm-btn:hover{
    margin-top:125px;
    background: url(../../../static/prepointsManage/removeToLeft_hover.png) no-repeat center top;
    background-size:24px 24px;
}
.pointGroupsBox .btnsBox .cancel-btn{
    margin-top:10px;
    background: url(../../../static/prepointsManage/removeToRight.png) no-repeat center top;
    background-size:24px 24px;
}
.pointGroupsBox .btnsBox .cancel-btn:hover{
    margin-top:10px;
    background: url(../../../static/prepointsManage/removeToRight_hover.png) no-repeat;
    background-size:24px 24px;
}
.pointGroupsBox .allPointsBox{
    display: inline-block;
    width: 305px;
    height: 100%;
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