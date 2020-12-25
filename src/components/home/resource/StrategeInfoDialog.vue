<template>
  <div id="strategeInfo">
        <el-dialog :visible.sync="isVisible" class="custom-dialog" :title="dialogTitle" width="984px" center @closed="closedDialog">

            <!-- 修改的页面 -->
            <div class="box-main" v-if="dialogType == 'edit'">
                <div class="main-left">
                    <div class="left-head">
                        <span>方案列表</span>
                        <span class="add-stratege" :class="{'add-stratege-act':innerVisible}">
                            <i class="icon-add-stratege"></i>
                            <span class="text-add-stratege" @click="addStrategeFn">创建</span>
                        </span>
                    </div>
                    <div class="type-select  strategeInfo-type">
                        <el-select v-model="strategeTypeByList" placeholder="请选择活动区域" :popper-append-to-body="false" @change="getStrategeData">
                            <el-option label="全部" value=""><i v-if="strategeTypeByList == ''"></i><span>全部</span></el-option>
                            <el-option label="巡查方案" value="0"><i v-if="strategeTypeByList == '0'"></i><span>巡查方案</span></el-option>
                            <el-option label="计划视频巡查" value="1"><i v-if="strategeTypeByList == '1'"></i><span>计划视频巡查</span></el-option>
                        </el-select>
                    </div>
                    <div class="startege-List">
                        <el-scrollbar class="hiddenXScroll" style="height:100%">
                            <div class="startege-item" v-for="item in startegeArr" :key="item.id" :class="{'act-Startege':item.id == ckStrategeID}" @click="checkStratege(item)">
                                <i class="startege-item-icon"></i>
                                <span class="startege-item-text">{{item.name}}</span>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="r-box">
                    <div class="r-main">
                        <div class="form-div" style="margin-bottom:20px">
                            <div class="control-item">
                                <span class="lable-stratege label-strategeName">方案名称</span>
                                <div class="control-div">
                                    <el-input v-model="strategeName" placeholder="请输入方案名称" ></el-input>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">方案类型</span>
                                <div class="control-div strategeInfo-type">
                                    <el-select v-model="strategeType" placeholder="请选择活动区域" :popper-append-to-body="false" disabled>
                                        <el-option label="巡查方案" value="0">
                                            <i v-if="strategeType == '0'"></i>
                                            <span>巡查方案</span>
                                        </el-option>
                                        <el-option label="计划视频巡查" value="1">
                                            <i v-if="strategeType == '1'"></i>
                                            <span>计划视频巡查</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">巡查间隔(秒)</span>
                                <div class="control-div time-select  strategeInfo-type">
                                    <el-select v-model="strategeTime" :popper-append-to-body="false">
                                        <el-option label="10" value="10"><i v-if="strategeTime == '10'"></i><span>10</span></el-option>
                                        <el-option label="15" value="15"><i v-if="strategeTime == '15'"></i><span>15</span></el-option>
                                        <el-option label="20" value="20"><i v-if="strategeTime == '20'"></i><span>20</span></el-option>
                                        <el-option label="25" value="25"><i v-if="strategeTime == '25'"></i><span>25</span></el-option>
                                        <el-option label="30" value="30"><i v-if="strategeTime == '30'"></i><span>30</span></el-option>
                                        <el-option label="35" value="35"><i v-if="strategeTime == '35'"></i><span>35</span></el-option>
                                        <el-option label="40" value="40"><i v-if="strategeTime == '40'"></i><span>40</span></el-option>
                                        <el-option label="45" value="45"><i v-if="strategeTime == '45'"></i><span>45</span></el-option>
                                        <el-option label="50" value="50"><i v-if="strategeTime == '50'"></i><span>50</span></el-option>
                                        <el-option label="55" value="55"><i v-if="strategeTime == '55'"></i><span>55</span></el-option>
                                        <el-option label="60" value="60"><i v-if="strategeTime == '60'"></i><span>60</span></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="form-div">
                            <div class="control-item">
                                <span class="lable-stratege label-strategeName">窗口布局</span>
                                <div class="control-div  strategeInfo-type">
                                    <el-select v-model="strategeScreen"  :popper-append-to-body="false" @change="changeScreen">
                                        <el-option v-for="item in strategeScreenArr" :key="item.id" :label="item.lable" :value="item.val">
                                            <i v-if="strategeScreen == item.val"></i><span>{{item.lable}}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">巡查窗口</span>
                                
                                <div class="control-div NormalLoop" style="margin-left: 9px;">
                                    <el-select v-model="NormalLoop" multiple collapse-tags  :popper-append-to-body="false" >
                                        <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">应用范围</span>
                                <div class="control-div" style="width: 135px;">
                                    <el-radio v-model="type" label="1">用户</el-radio>
                                    <el-radio v-model="type" label="2">角色</el-radio>
                                </div>
                            </div>
                        </div>
                        <div class="tree-div">
                            <div class="resource-tree">
                                <div class="left-head">
                                    <span>设备资源</span>
                                </div>
                                <device-tree ref="deviceTree" :subscribeType="subscribeType"></device-tree>
                            </div>
                            <div class="join-div"  @click="addReaourceClick">
                                <i></i>
                                <!-- <p>导入</p> -->
                            </div>
                            <div class="ck-tree">
                                <div class="ck-tree-title left-head">
                                    <div class="titleName">
                                        <span>巡查资源</span>
                                        <!-- <i class="addStrategeGroup"  :class="{isAddGroup:showNewGroupLi}" @click="handleAddGroup"></i> -->
                                    </div>
                                </div>
                                <div class="ck-tree-main">
                                    <div class="group-box">
                                        <el-scrollbar class="hiddenXScroll" style="height:100%">
                                            <ul id="groupsBoxMain_ul">
                                                    <!--巡查资源 分组 -->
                                                    <template v-for="(item,index) in groupsArr">
                                                        <li :id="item.id" :key="item.id" :title="item.name" :class="item.active===true?'active' : '' " @click="handleClickGroupsLi(item)">
                                                            <span class="group_icon"></span>
                                                            <input type="text" v-model="item.name" :readonly="!isReadonly" class="groupInput_name ck-tree_name" :class="{newGroupBorder:isReadonly}"  @blur="isReadonly=false"  @dblclick="isReadonly=true" >
                                                            <span class="ck-tree_del el-icon-close" @click="handleDeleteGroup(item,index,'groupsArr')"></span>
                                                        </li>
                                                    </template>
                                                    <!-- 巡查资源未分组 -->
                                                    <template v-for="(item,index) in allCkStratege"  >
                                                        <li :id="item.id" :title="item.name" :key="item.id" :class="item.active===true?'active' : '' ">
                                                            <span class="ck-tree_icon"></span>
                                                            <span class="ck-tree_name">{{item.name}}</span>
                                                            <span class="ck-tree_del el-icon-close" @click="handleDeleteGroup(item,index,'allCkStratege')"></span>
                                                        </li>
                                                    </template>
                                                    <!-- 添加巡查资源分组时显示 -->
                                                    <li v-if="showNewGroupLi">
                                                        <span class="group_icon"></span>
                                                        <input type="text" v-model="newGroupName" class="groupInput_name newGroupBorder" @blur="handleSaveGroup(newGroupName)" id="newGroupInput">
                                                        <span class="ck-tree_del el-icon-close"></span>
                                                    </li>
                                            </ul>
                                        </el-scrollbar>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn-footer">
                            <el-button class="no-background" @click="saveFn">另存为</el-button>
                            <el-button class="no-background" @click="delSelf">删除</el-button>
                            <el-button type="primary" @click="updateStrategyFn" >确定</el-button>
                    </div>
                </div>
            </div>

            <!-- 添加的页面 -->
            <div class="box-main" v-if="dialogType == 'add'">
                <div class="main-left main-left-add">
                    <div class="left-add" @click="goBackEdit">
                        <i></i>
                        <span>返回上一页</span>
                    </div>
                </div>
                <div class="r-box r-box-add">
                    <div class="r-main">
                        <div class="form-div" style="margin-bottom:20px">
                            <div class="control-item">
                                <span class="lable-stratege label-strategeName">方案名称</span>
                                <div class="control-div">
                                    <el-input v-model="strategeName" placeholder="请输入方案名称" ></el-input>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">方案类型</span>
                                <div class="control-div strategeInfo-type">
                                    <el-select v-model="strategeType" placeholder="请选择活动区域" :popper-append-to-body="false" disabled>
                                        <el-option label="巡查方案" value="0">
                                            <i v-if="strategeType == '0'"></i>
                                            <span>巡查方案</span>
                                        </el-option>
                                        <el-option label="计划视频巡查" value="1">
                                            <i v-if="strategeType == '1'"></i>
                                            <span>计划视频巡查</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">巡查间隔(秒)</span>
                                <div class="control-div time-select strategeInfo-type">
                                    <el-select v-model="strategeTime" :popper-append-to-body="false">
                                         <el-option label="10" value="10"><i v-if="strategeTime == '10'"></i><span>10</span></el-option>
                                        <el-option label="15" value="15"><i v-if="strategeTime == '15'"></i><span>15</span></el-option>
                                        <el-option label="20" value="20"><i v-if="strategeTime == '20'"></i><span>20</span></el-option>
                                        <el-option label="25" value="25"><i v-if="strategeTime == '25'"></i><span>25</span></el-option>
                                        <el-option label="30" value="30"><i v-if="strategeTime == '30'"></i><span>30</span></el-option>
                                        <el-option label="35" value="35"><i v-if="strategeTime == '35'"></i><span>35</span></el-option>
                                        <el-option label="40" value="40"><i v-if="strategeTime == '40'"></i><span>40</span></el-option>
                                        <el-option label="45" value="45"><i v-if="strategeTime == '45'"></i><span>45</span></el-option>
                                        <el-option label="50" value="50"><i v-if="strategeTime == '50'"></i><span>50</span></el-option>
                                        <el-option label="55" value="55"><i v-if="strategeTime == '55'"></i><span>55</span></el-option>
                                        <el-option label="60" value="60"><i v-if="strategeTime == '60'"></i><span>60</span></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="form-div">
                            <div class="control-item">
                                <span class="lable-stratege label-strategeName">窗口布局</span>
                                <div class="control-div  strategeInfo-type">
                                    <el-select v-model="strategeScreen"  :popper-append-to-body="false" @change="changeScreen">
                                        <el-option v-for="item in strategeScreenArr" :key="item.id" :label="item.lable" :value="item.val">
                                            <i v-if="strategeScreen == item.val"></i><span>{{item.lable}}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">巡查窗口</span>
                                
                                <div class="control-div NormalLoop" >
                                    <el-select v-model="NormalLoop" multiple collapse-tags  :popper-append-to-body="false" >
                                        <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="control-item">
                                <span class="lable-stratege label-strategeType">设置</span>
                                <div class="control-div" style="width: 135px;">
                                    <el-radio v-model="type" label="1">用户</el-radio>
                                    <el-radio v-model="type" label="2">角色</el-radio>
                                </div>
                            </div>
                        </div>
                        <div class="tree-div">
                            <div class="resource-tree">
                                <div class="left-head">
                                    <span>设备资源</span>
                                </div>
                                <device-tree ref="deviceTree" :subscribeType="subscribeType"></device-tree>
                            </div>
                            <div class="join-div" @click="addReaourceClick">
                                <i></i>
                                <!-- <p>导入</p> -->
                            </div>
                            <div class="ck-tree">
                                <div class="ck-tree-title left-head">
                                    <div class="titleName">
                                        <span>巡查资源</span>
                                        <!-- <i class="addStrategeGroup"  :class="{isAddGroup:showNewGroupLi}" @click="handleAddGroup"></i> -->
                                    </div>
                                </div>
                                <div class="ck-tree-main">
                                    <div class="group-box">
                                        <el-scrollbar class="hiddenXScroll" style="height:100%">
                                            <ul id="groupsBoxMain_ul">
                                                    <!--巡查资源 分组 -->
                                                    <template v-for="(item,index) in groupsArr">
                                                        <li :id="item.id" :key="item.id" :title="item.name" :class="item.active===true?'active' : '' " @click="handleClickGroupsLi(item)">
                                                            <span class="group_icon"></span>
                                                            <input type="text" v-model="item.name" :readonly="!isReadonly" class="groupInput_name ck-tree_name" :class="{newGroupBorder:isReadonly}"  @blur="isReadonly=false"  @dblclick="isReadonly=true" >
                                                            <span class="ck-tree_del el-icon-close" @click="handleDeleteGroup(item,index,'groupsArr')"></span>
                                                        </li>
                                                    </template>
                                                    <!-- 巡查资源未分组 -->
                                                    <template v-for="(item,index) in allCkStratege"  >
                                                        <li :id="item.id" :title="item.name" :key="item.id" :class="item.active===true?'active' : '' ">
                                                            <span class="ck-tree_icon"></span>
                                                            <span class="ck-tree_name">{{item.name}}</span>
                                                            <span class="ck-tree_del el-icon-close" @click="handleDeleteGroup(item,index,'allCkStratege')"></span>
                                                        </li>
                                                    </template>
                                                    <!-- 添加巡查资源分组时显示 -->
                                                    <li v-if="showNewGroupLi">
                                                        <span class="group_icon"></span>
                                                        <input type="text" v-model="newGroupName" class="groupInput_name newGroupBorder" @blur="handleSaveGroup(newGroupName)" id="newGroupInput">
                                                        <span class="ck-tree_del el-icon-close"></span>
                                                    </li>
                                            </ul>
                                        </el-scrollbar>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn-footer btn-footer-add">
                            <el-button class="no-background" @click="cancelAddFn">取消</el-button>
                            <el-button type="primary" @click="goAddStrategyFn">确定</el-button>
                    </div>
                </div>
            </div>

            <!-- 内层弹出框---选择新建策略类型 -->
            <el-dialog
            width="460px"
            title="方案类型"
            class="inner-dialog"
            :visible.sync="innerVisible"
            append-to-body
            @closed="closedInnerDialog"
            >
                <div class="box-inner">
                    <p>请选择新建方案的类型：</p>
                    <div class="radio-div">
                        <el-radio v-model="radioStrategeType" label="0">巡查方案</el-radio>
                      <!--  <el-radio v-model="radioStrategeType" label="1">计划视频巡查</el-radio> -->
                    </div>
                    <div class="inner-btnF">
                        <el-button class="no-background" @click="closedInnerDialog">取消</el-button>
                        <el-button type="primary" @click="showAddStrategy">确定</el-button>
                    </div>
                </div>
                
                <!-- 内层层 左上角icon -->
                <div class="typeTitle-bg"></div>
            </el-dialog>
        </el-dialog>
  </div>
</template>

<script>
import DeviceTree from "@/components/home/resource/DeviceTreeByStratege.vue";
import Enum from '@/common/enum'
export default {
    name:'strategeInfo',
    components: {
        DeviceTree,
    },
    data () {
        let validateName = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入分组名称"));
            } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
                callback(
                new Error("方案名称为包含中文、英文字母(大小写)、数字、下划线的组合!")
                );
            } else {
                callback();
            }
        };
        return {
            isVisible:false,
            dialogTitle:'视频巡查管理',
            dialogType:'edit', //弹窗是修改还是添加  edit修改 add添加
            subscribeType: '', //资源树 请求的类型
            strategeTypeByList:'', // 左侧的巡查类型
            //已添加的视频巡查列表
            startegeArr:[],
            //分屏下拉数组
            strategeScreenArr:[{
                id:'OnlyOne',
                lable:'1分屏',
                val:1
            },{
                id:'OnlyTwo',
                lable:'2分屏',
                val:12
            },{
                id:'OnlyFour',
                lable:'4分屏',
                val:4
            },{
                id:'One_Five',
                lable:'1+5分屏',
                val:6
            },{
                id:'OnlySix',
                lable:'6分屏',
                val:100
            },{
                id:'OnlyNine',
                lable:'9分屏',
                val:9
            },
            // {
            //     id:'OnlySixteen',
            //     lable:'16分屏',
            //     val:16
            // }
            ],
            //根据分屏来展示的屏幕数组
            arrType: [{value: '0', label: '窗口1', disabled: false}],
            isReadonly:false,  //输入框 显示
            //需要提交的数据 =================================================================
            ckStrategeID:'', //选中的策略
            updateStrategeName:'',
            strategeName:"", //策略名称
            strategeType:"0", //选择的类型
            strategeTime:'15', //时间
            strategeScreen:1, //选择的窗口布局
            //用户选中的屏幕 数组
            NormalLoop: [], 
            type:'1', //声音 改为 角色
            //选择的巡查资源
            allCkStratege:[],
            groupsArr:[],
            //分组 变量
            showNewGroupLi:false,
            newGroupName:'',

            //新建弹窗 选择类型 =================================================================
            innerVisible:false,
            radioStrategeType:'0',

        }
    },
    methods: {
        showDialog(ckID){
            this.isVisible = true;
            this.$nextTick(() => {
            xtxk.media.setDialogTop('视频巡查管理');
            });
            this.initTree();
            //获取已创建的策略
            this.getStrategeData(ckID);
        },
        // 初始化树 Testing
		initTree() {
			this.$nextTick(() => {
	          	const organId = "";
	          	this.subscribeType = Enum.enumSubscribeType.group; 
				//订阅用户组织结构
				let subjectId = 0;
                //获取设备组织结构
                this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
                    this.$refs.deviceTree.setReceiveInformAddDepartmentCallback(obj);
                });
	          	//资源回调  
	          	this.apiSDK.setReceiveResourceStatusQueryCallback("group", (obj) => {
					this.$refs.deviceTree.setReceiveInformResourceStatusCallback(obj);
	          	});
	        });
        },
        //获取已创建的策略
        getStrategeData(ckID){
            const that = this;
            // 请求列表数据 刷新
            this.startegeArr = [];
            var strategeGroupsArr = [];
            this.apiSDK.queryStrategyList(this.strategeTypeByList, obj => {
                console.log('管理业获取分类巡查分组的数据===>',obj)
                if( obj ){ 
                    this.total =  obj.totalCnt;
                    obj.rows && obj.rows.forEach((item,index)=>{
                        let curObj = {
                            id: item.strategyId,
                            name: item.strategyName,
                            nodeStatus: 'strategeGroup',
                            strategyType:item.strategyType,
                            patrolInterval:item.patrolInterval,
                            type:item.type,
                            windowLayout:item.windowLayout,
                            patrolScreen:item.patrolScreen.split(','),
                            children:item.groupDeviceDtoList,
                        }
                        if(curObj.id == ckID){
                            this.checkStratege(curObj)
                        }
                        strategeGroupsArr.push(curObj)
                    });
                }
                this.startegeArr = strategeGroupsArr;
            });
        },
        // 获取详情
        checkStratege(val){
            this.resetData();
            this.ckStrategeID = val.id
            // 调用 获取点播(轮循)分组的详细信息
            this.strategeName = val.name;
            this.updateStrategeName = val.name; //用来判断 另存为 策略名称是否修改
            this.strategeType = val.strategyType + '';
            this.strategeTime = val.patrolInterval + '';
            this.type = val.type + '';
            this.strategeScreen = val.windowLayout;
            
            // 2分屏 6分屏 特殊值 需要转换
            let splitNum = this.strategeScreen;
            if(this.strategeScreen == 12){ //2分屏
                splitNum = 2
            }else if(this.strategeScreen == 100){ //6分屏
                splitNum = 6
            }
            this.arrType = [];
            for (let i=0; i<splitNum; i++) {
                this.arrType.push({value: i.toString(), label:'窗口'+ (i+1) , disabled: false})
            }
            this.NormalLoop = val.patrolScreen;
            val.children.forEach(item => {
                //去重需要nodeId
                var nodeId = item.deviceId + "_" + (item.resCh || 0);
                if(item.resourceType == 'channel'){
                    nodeId = item.deviceId.split(',')[0]
                }
                let lt = {
                    nodeId      : nodeId,
                    groupId     : item.groupId,
                    groupName   : item.groupName,
                    id          : item.deviceId,
                    name        : item.name,
                    resCh       : item.resCh || 0,
                    resourceType: item.resourceType,
                }

                this.allCkStratege.push(lt)
            })
            // this.apiSDK.queryStrategyListById(val.id,res =>{
            //     console.log('编辑页 获取详情=====>',res)
            // })
        },
        // 切换分屏模式
        changeScreen(val) {
            let splitNum = val; // 统计分屏数量
            // 2分屏 6分屏 特殊值 需要转换
            if(val == 12){ //2分屏
                splitNum = 2
            }else if(val == 100){ //6分屏
                splitNum = 6
            }
            this.arrType.length = 0
            for (let i=0; i<splitNum; i++) {
                this.arrType.push({value: i.toString(), label:'窗口'+ (i+1) , disabled: false})
            }
            this.NormalLoop =  [];
        },
        // 新增分组
        handleAddGroup(){
            this.showNewGroupLi = true;
            setTimeout(function(){
                let newGroupInput = document.getElementById('newGroupInput');
                newGroupInput.focus();
            },500)
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
        },
        // 保存新增/修改分组
        handleSaveGroup(item){
            let that = this;
            if(!item.id){
                if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(this.newGroupName)) {
                    this.$message({
                        message: '分组名称为包含中文、英文字母(大小写)、数字、下划线的组合',
                        type: 'error'
                    })
                    return
                }
                if(!this.newGroupName){
                    this.showNewGroupLi = false;
                    return;
                }
                let groupName = this.newGroupName;
                
                //mock-data
                that.groupsArr.push({
                    name: groupName,
                    id:Math.random(10) + '',
                    order:Math.random(10) + '',
                    isparent:true,
                    readonly:true,
                    active:false,
                })
                that.showNewGroupLi = false;
                that.newGroupName = '';
            }else{
                if (!/^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/.test(item.name)) {
                    this.$message({
                        message: '分组名称为包含中文、英文字母(大小写)、数字、下划线的组合',
                        type: 'error'
                    })
                    return
                }
                let groupId = item.id;
                let groupName = item.name;
                //修改接口
                // this.apiSDK.updateYTGroup(this.resourceId, this.resourceCh, groupId, groupName, function(obj){
                //     // console.log(obj);
                //     if( obj && obj.Ret === 0 ){
                //         // console.log('修改分组成功');
                //         that.$message({
                //             message: '修改分组成功',
                //             type: 'success'
                //         });
                //         that.getGroupList();
                //     }else{
                //         // console.log('修改分组失败');
                //         that.$message({
                //             message: '修改分组失败',
                //             type: 'error'
                //         });
                //     }
                // });
            }
        },
        // 删除分组
        handleDeleteGroup(item,index,type){
            let that = this;
            let groupId = item.id;
            this.$confirm('是否确定删除'+ item.name +'?', '信息提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false
            }).then(() => {
                //删除的方法
                if(type == 'groupsArr'){
                    this.groupsArr.splice(index ,1)
                }else if(type == 'allCkStratege'){
                    this.allCkStratege.splice(index,1)
                }
            }).catch(() => {    
            });
        },
        //新建策略类型弹框 弹出
        addStrategeFn(){
            this.innerVisible = true;
        },
        // 显示添加页面
        showAddStrategy(){
            this.resetData();
            this.strategeType = this.radioStrategeType;
            this.innerVisible = false
            this.dialogType = 'add';
            this.dialogTitle = '创建';
            
        },
        // 导入 选中的  设备资源
        addReaourceClick() {
	        var deviceNodes = [];
	      	//设备树
            var devCheckNodes = this.$refs.deviceTree.$refs.main_device_tree.getCheckedNodes();
	      	devCheckNodes && devCheckNodes.forEach(item => {
                if(item.nodeStatus != "department"){
                    if(item.deviceType == "GBNVREncoder"){ //只勾选了 多通道 
                        item.children.forEach(el => {
                            el.id = el.id + ',' + el.pid
	        	            deviceNodes.push(el);
                        })
                    }else if(item.deviceType == "channel"){  //只勾选了 多通道 的 通道
                        item.id = item.id + ',' + item.pid
	        	        deviceNodes.push(item);
                    }else{
	        	        deviceNodes.push(item);
                    }
                    this.$refs.deviceTree.$refs.main_device_tree.setChecked(item.nodeId, false);
                }
	      	})
	      	let array = [];
            array = [...this.allCkStratege, ...deviceNodes];
            this.allCkStratege = this.reduce(array);
        },
        
        //返回上一页 == 返回编辑页 
        goBackEdit(){
            this.dialogType = 'edit';
            this.dialogTitle = '视频巡查管理';
            this.radioStrategeType = '0';
            this.resetData();
        },
        //另存为
        saveFn(){
            if(this.updateStrategeName == this.strategeName){ //视频巡查名相同不能添加
                this.showremind('warning','巡查名称不能相同')
            }else{
                //调用添加方法
                this.goAddStrategyFn('saveAs');
            }
            
        },
        //添加新的 视频巡查 
        goAddStrategyFn(type){
            let strategyName = this.strategeName;
            let strategyType = this.strategeType;
            let patrolInterval = this.strategeTime;
            let usertype = parseInt(this.type);
            let windowLayout = this.strategeScreen;
            let patrolScreen = this.NormalLoop.sort().join(',');
            let groupDeviceDtoList = [];
            this.allCkStratege.forEach(item => {
                let lt = {
                    groupId     : "",
                    groupName   : "",
                    deviceId    : item.id,
                    name        : item.name,
                    resCh       : item.resCh || 0,
                    resourceType: item.resourceType,
                }
                groupDeviceDtoList.push(lt)
            })
            if(strategyName == ''){
                this.showremind('warning','请输入方案名称');
                return
            }else if(this.NormalLoop.length <= 0){
                this.showremind('warning','请选择巡查窗口');
                return
            }else if(groupDeviceDtoList.length <= 0){
                this.showremind('warning','请选择巡查资源');
                return
            }
            this.apiSDK.addPatrolStrategy(
                strategyName,
                strategyType, 
                patrolInterval, 
                usertype, 
                windowLayout, 
                patrolScreen,
                groupDeviceDtoList,
                res => {
                    console.log('添加数据呀===========>',res)
                    if(res.code == 1){
                        this.showremind('success',res.msg);
                        this.dialogType = 'edit'
                        this.getStrategeData();
                        this.resetData();
                        //通知资源树 刷新数据
                        this.$parent.$parent.$refs.rightMenu.reloadStrategy()
                    }else{
                        this.showremind('error',res.msg);
                    }
                }
            )
        },
        //取消添加
        cancelAddFn(){
            this.resetData();
            this.dialogType = 'edit'
        },
        //修改的方法
        updateStrategyFn(){
            let strategyName = this.strategeName;
            let strategyType = this.strategeType;
            let patrolInterval = this.strategeTime;
            let usertype = parseInt(this.type);
            let windowLayout = this.strategeScreen;
            let patrolScreen = this.NormalLoop.sort().join(',');
            let groupDeviceDtoList = [];
            this.allCkStratege.forEach(item => {
                let lt = {
                    groupId     : "",
                    groupName   : "",
                    deviceId    : item.id ,
                    name        : item.name,
                    resCh       : item.resCh || 0,
                    resourceType: item.resourceType,
                }
                groupDeviceDtoList.push(lt)
            })
            if(strategyName == ''){
                this.showremind('warning','请输入方案名称');
                return
            }else if(this.NormalLoop.length <= 0){
                this.showremind('warning','请选择巡查窗口');
                return
            }else if(groupDeviceDtoList.length <= 0){
                this.showremind('warning','请选择巡查资源');
                return
            }
            this.apiSDK.updatePatrolStrategy(
                this.ckStrategeID,
                strategyName,
                strategyType, 
                patrolInterval, 
                usertype, 
                windowLayout, 
                patrolScreen,
                groupDeviceDtoList,
                res => {
                    console.log('修改数据呀===========>',res)
                    if(res.code == 1){
                        this.showremind('success',res.msg);
                        this.dialogType = 'edit';
                        let ckID = this.ckStrategeID;
                        this.resetData();
                        this.getStrategeData(ckID);
                        //通知资源树 刷新数据
                        this.$parent.$parent.$refs.rightMenu.reloadStrategy()
                    }else{
                        this.showremind('error',res.msg);
                    }
                }
            )
        },
        //删除的方法
        delSelf(){
            if(this.ckStrategeID){
                this.$confirm('是否确定删除?', '信息提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false
                }).then(() => {
                    this.apiSDK.deleteStrategyById(this.ckStrategeID,res => {
                        if(res.code == 1){
                            this.showremind('success',res.msg);
                            let ckID = this.ckStrategeID;
                            this.resetData();
                            this.getStrategeData(ckID);
                            //通知资源树 刷新数据
                            this.$parent.$parent.$refs.rightMenu.reloadStrategy()
                        }else{
                            this.showremind('error',res.msg);
                        }
                    })
                }).catch(() => {    
                });
            }else{
                this.showremind('warning','请选择巡查资源后再进行删除操作');
            }
        },
        //去重
        reduce(array) {
            let object = {};
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total;
            }, [])
        },
        //重置数据
        resetData(){
            this.ckStrategeID = ''; //选中的策略
            this.strategeName = "";//策略名称
            this.updateStrategeName ='';
            this.strategeType = "0"; //选择的类型
            this.strategeTime = '15'; //时间
            this.strategeScreen = 1;this.arrType = [{value: '0', label: '窗口1', disabled: false}];
            this.type = '1';
            this.NormalLoop = [];
            this.NormalLoop.length = 0;
            this.allCkStratege.length = 0;
            this.groupsArr.length = 0;
        },
        //关闭外层
        closedDialog(){
            this.isVisible = false
            this.innerVisible = false
            this.resetData();
            //策略列表
            this.startegeArr.length = 0;
            //策略列表 类型
            this.strategeTypeByList = '';
            this.dialogTitle = '视频巡查管理';
            this.dialogType = 'edit';
        },
        //关闭内层 弹框
        closedInnerDialog(){
            this.innerVisible = false
            //添加 策略类型
            this.radioStrategeType = '0';
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
/deep/ .el-dialog{
    background: none!important;
}
/deep/ .custom-dialog .el-dialog__header{
    position: relative;
    background: url(../../../../static/stratege/head-bg.png);
    height: 40px;
}
/deep/ .custom-dialog .el-dialog__title {
    line-height: 46px;
}
/deep/ .custom-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #909399;
    font-size: 24px;
}
/deep/ .custom-dialog .el-dialog__body{
    padding: 15px 20px 0px 0px;
    background: url(../../../../static/stratege/main-bg.png);
    height: 668px;
}

.title-bg,.typeTitle-bg{
  position: absolute;
  top:0;
  left:0;
  width: 104px;
  height: 4px;
  background: url(../../../../static/main/screen/title_bg.png);
  background-size: 104px 4px;
}
/* 左侧 */
.main-left{
    float: left;
    width: 207px;
    display: inline-block;
}
.main-left-add{
    /* width: 148px; */
}
.left-head{
    width: 100%;
    height: 40px;
    background-color:#314D78;
    line-height: 40px;
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 16px;
    color:#B7C1D0;
}
.add-stratege{
    font-size: 14px;
    color: #599AFF;
    margin-left: 30px;
    cursor: pointer;
}
.add-stratege .icon-add-stratege{
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-top: -3px;
    background: url(../../../../static/stratege/add-stratege.png) no-repeat center;
}
.add-stratege:hover .icon-add-stratege,
.add-stratege-act .icon-add-stratege{
    background: url(../../../../static/stratege/add-stratege-hover.png) no-repeat center;
    
}
 
.add-stratege .text-add-stratege{
    vertical-align: middle;
    /* margin-left: -4px; */
    cursor: pointer;
}
/* 类型选择框样式 */
.type-select{
    width: 168px;
    height: 30px;
    margin: 15px 20px 8px 20px;
}
/deep/ .el-select{
    width: 100%;
}
.type-select /deep/ .el-select>.el-input{
    background-color: #11274C;
}
/deep/ .el-select .el-input.is-focus .el-input__inner{
    border-color:#6B7C92;
}
/deep/ .el-select .el-input__inner{
    background: none!important;
    color: #D3DCF0;
    height: 30px;
    border-radius: 2px;
    border: 1px solid #6B7C92;
    outline: none;
}
/deep/ .el-input__icon{
    line-height: 30px;
}
/deep/ .el-select .el-select-dropdown .popper__arrow{
    display: none!important;
}
/deep/ .el-select .el-select-dropdown{
    margin-top: 2px!important;
    background: none;
    background: url(../../../../static/stratege/select-bg.png);
    background-size: 168px;
    border: none;
    border-radius: 0px;
}
/* 类型选择框样式  结束*/

/* 视频巡查列表 */
.startege-List{
    width: 100%;
    height: 558px;
    overflow: auto;
    padding-left: 20px;
    box-sizing: border-box;
}
.startege-List .startege-item{
    width: 168px;
    height: 31.5px;
    line-height: 31.5px;
    color: #D3DCF0;
    text-indent: 8px;
    margin-bottom: 5px;
    cursor: pointer;
}
.startege-item-icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url(../../../../static/stratege/icon-stratege.png) no-repeat center;
    background-size: 18px;
    vertical-align: middle;
}
.startege-item:hover .startege-item-text{
    color: #fff;
}
.act-Startege .startege-item-icon,.startege-item:hover .startege-item-icon{
    background:url(../../../../static/stratege/icon-act-stratege.png) no-repeat center;
}
.startege-item-text{
    vertical-align: middle;
}
.startege-List .startege-item.act-Startege {
    color: #FFFFFF;
    background: #5C98FF;
}
 
/* 视频巡查列表 结束*/

/* 左侧 结束*/

/* 右侧 */
.r-box{
    width: 756px;
    display: inline-block;
}
.r-box .r-main{
    height: 580px;
    width: 100%;
    background:url(../../../../static/stratege/form-bg.png) no-repeat;
    background-size: 100% 100%;
    border:2px solid #356BB0;
    overflow: hidden;
}
/* 输入表单 开始 */
.form-div{
    width: 100%;
    padding: 0 19px 0 25px;
    margin: 6px 0px;
    box-sizing: border-box;
}
.control-item {
    display: inline-block;
    padding-left: 0px!important;
    margin-left: 30px;
    color: #ABB3C4;
}
.control-item:first-child{
    margin-left:0px;
}
.control-item .control-div{
    display: inline-block;
    width: 148px;
    height: 32px;
    margin-left: 10px;
}
.control-div.time-select{
    width: 64px;
    margin:0px;
    margin-left: 10px;
}
.control-item /deep/ .el-radio__inner::after{
    width: 8px;
    height: 8px;
}
.time-select /deep/ .el-select-dropdown__item{
    padding: 0 22px;
}
.control-div /deep/ .el-input__inner{
    height: 32px;
    border-radius: 2px;
    background:none;
    outline: none;
    border: 1px solid #6B7C92;
    color: #D3DCF0;
}


/deep/.el-radio__label{
    padding-left:8px;
}
.control-div /deep/ .el-radio__label{
    color: #fff;
    margin-left: 5px;
}

.strategeInfo-type /deep/ .el-select-dropdown__item {
    position: relative;
    padding:0;
}
.strategeInfo-type /deep/ .el-select-dropdown__item span{
    display: inline-block;
    padding-left: 27px;
    margin-left: 2px;
}
.strategeInfo-type /deep/ .el-select-dropdown__item i{
    position: absolute;
    left: 9px;
    top:9px;
    display: inline-block;
    width: 16px;
    height: 16px;
    background:url(../../../../static/stratege/select-ck.png) no-repeat;
}

.control-div /deep/ .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.control-div /deep/ .el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
    background-color: #5C98FF;
    color: #fff;
}
.control-div /deep/ .el-tag.el-tag--info{
    background: none;
    border: none;
}
.control-div /deep/ .el-select .el-tag__close.el-icon-close{
    background:none;
}
.control-div /deep/ .el-tag.el-tag--info{
    color: #D3DCF0;
}
.control-div /deep/ .el-scrollbar__wrap{
    margin-bottom: -20px !important;
    margin-right: -20px !important;
}
/* 输入表单 结束 */

.tree-div{
    width: 100%;
    height: 460px;
    margin-top: 28px;
}
/* 资源设备树 */
.resource-tree,.ck-tree{
    width: 340px;
    height: 453px;
    display: inline-block;
    float: left;
    margin:0 8px;
}
.resource-tree /deep/.el-tabs__active-bar{
    width: 70px!important;
}
/deep/ .custom-dialog .el-tabs{
    border:none;
}
.resource-tree /deep/ .treeBox{
    height:calc(100% - 40px);
    margin-top: 0px;
}
.resource-tree /deep/ .treeWrap{
    width: 346px;
    height: calc(100% - 101px);
}

/* 资源设备树  结束*/
.join-div{
    display: inline-block;
    float: left;
    width: 24px;
    height: 37px;
    font-size: 12px;
    color: #94A7C0;
    margin: 197px 10px 0 10px;
    cursor: pointer;
}
.join-div i{
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(../../../../static/stratege/join-icon.png) no-repeat center;
    background-size: 24px;
}
.join-div:hover i{
    background: url(../../../../static/stratege/join-icon-hover.png) no-repeat center;
}
/* 巡查资源开始 */
.ck-tree{
    background:url(../../../../static/stratege/ckstratege-bg.png) no-repeat;
}
.ck-tree-title{
    width: 100%;
    height: 38px;
    position: relative;
}
.ck-tree-title .addStrategeGroup{
    position: absolute;
    top: 8px;
    right: 16px;
    display: inline-block;
    width: 24px;
    height: 24px;
    background:url(../../../../static/stratege/icon-add-strategeGroup.png) no-repeat;
    cursor: pointer;
}
.ck-tree-main{
    height: calc(100% - 40px);
}
.ck-tree-main ul{
    padding: 0;
    margin: 10px 0 0 0;
}
.ck-tree-main ul li{
    color: #D3DCF0;
    list-style-type: none;
    text-align: left;
    height: 30px;
    line-height: 30px;
    padding-left: 23px;
    margin-bottom: 8px;
    /* cursor: pointer; */
    overflow: hidden;
}

.ck-tree_icon,.group_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../../../../static/resource_tree/device_online.png");
    vertical-align: middle;
}
.group_icon{
    background: url(../../../../static/stratege/icon-group.png);
}
.groupInput_name{
    background: none;
    outline: none;
    border: none;
    font-size: 14px;
    color: #D3DCF0;
}
.groupInput_name.newGroupBorder{
    background: none;
    outline: none;
    border: 1px solid #5D98FF;
    border-radius: 1px;
    height: 24px;
    line-height: 24px;
    color:#D3DCF0;
    text-indent: 8px;
}
.ck-tree-title .addStrategeGroup.isAddGroup{
    background: url(../../../../static/stratege/icon-add-strategeGroup-act.png);
}
.ck-tree_name{
    display: inline-block;
    width: 76%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
.ck-tree_del{
    vertical-align: middle;
    display: inline-block;
    line-height: 20px;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
}
/deep/.el-icon-close:hover:before{
    background: url(../../../../static/stratege/del-s-device.png)no-repeat center;
    background-size: 20px;
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
}
.r-box .btn-footer{
   margin-top: 15px;
   margin-left: 50%;
   transform: translateX(-50%);
}
.btn-footer-add{
    width: 220px;
}
/* 编辑页面按钮 */
.btn-footer button{
    border-radius: 1px;
}
/* 无背景按钮 */
.no-background{
    background: none;
    border: 1px solid #6B7C92;
    font-size: 14px;
    color: #ABB3C4;
}
/* 新建类型选择 */
.inner-dialog /deep/ .el-dialog{
    width: 460px;
    height: 260px;
    background: url(../../../../static/stratege/type-bg.png)!important;
    margin-top: 35vh!important;
}
.inner-dialog /deep/ .el-dialog__header{
    padding: 0;
    height: 40px;
    line-height: 40px;
    background: url(../../../../static/stratege/type-title-bg.png)!important;
    padding-left: 16px;
}
.inner-dialog /deep/ .el-dialog__title{
    font-size: 18px;
    color: #FFFFFF;
}
.inner-dialog /deep/ .el-dialog__headerbtn{
    font-size: 14px;
    top:13px
}
.inner-dialog /deep/ .el-dialog__body{
    padding-top: 14px;    
    width: 100%;
    height: calc(100% - 40px);
    box-sizing: border-box;
}
.box-inner{
    width: 100%;
    height: 100%;
}
.box-inner p{
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;
    color: #D3DCF0;
    margin-bottom: 20px;
}
.box-inner .radio-div{
    width: 100%;
    text-align: center;
}
.box-inner .radio-div /deep/ .el-radio{
    margin: 0px;
    display: block;
    margin-bottom: 10px;
}
.box-inner .radio-div /deep/ .el-radio__label{
    font-size: 14px;
    color: #D3DCF0;
}
/deep/ .el-radio__inner{
    border-color: #6B7C92;
    background: none;
}
/deep/ .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background:none;
}
/deep/ .el-radio__inner::after{
    border-radius: 50%;
    background-color: #409EFF;
}

.box-inner .radio-div /deep/ .el-radio__inner{
    width: 16px;
    height: 16px;
}
.box-inner .radio-div /deep/ .el-radio__inner::after{
    width: 10px;
    height: 10px;
}
.inner-btnF{
    margin-top: 38px;
    margin-left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

/deep/ .el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    font-weight: bold;
}
.custom-dialog /deep/ .el-button+.el-button,
.inner-btnF /deep/ .el-button+.el-button{
    margin-left: 24px;
}

/* 添加的页面样式 ------------------------------------------------- */
.r-box-add .r-main{
    /* background:none; */
}
.r-box-add .form-div{
    /* padding: 0; */
}
.main-left-add .left-add{
    width: 100%;
    padding-left: 20px;
    box-sizing: border-box;
    margin-top: 11px;
    cursor: pointer;
}
.left-add i{
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    background: url(../../../../static/stratege/stratege-back.png);
}.left-add:hover i{
    background: url(../../../../static/stratege/hover-sBack.png);
}
.left-add span{
    display: inline-block;
    font-size: 14px;
    color: #599AFF;
    vertical-align: middle;
}
/deep/ .el-select .el-input.is-disabled .el-input__inner:hover,
/deep/ .el-select .el-input .el-input__inner:hover{
    border: 1px solid #6B7C92;
}
/deep/ .el-select .el-input.is-disabled .el-input__inner{
    border: 1px solid #6B7C92;
    color: #627088;
}
.group-box{
    height: 100%;
    overflow: auto;
}
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
}

/* redio样式 */
/deep/ .el-radio{
    margin-right: 5px;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
    /* border-color: #409EFF;
    background: none; */
    border:none;
    background:url(../../../../static/common/redio_active.png) no-repeat center;
}
/deep/ .el-radio__inner {
    /* border-color: #6B7C92;
    background: none; */
    width:20px;
    height:20px;
    border:none;
    background:url(../../../../static/common/redio_no.png) no-repeat center;
}
/deep/ .el-radio__inner::after {
    /* border-radius: 50%;*/
    background:url(../../../../static/common/redio_active.png) no-repeat center;
    /* background-color: #409EFF;  */
}
.base-point /deep/ .el-radio__inner::after {
    width: 8px;
    height: 8px;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
   color: #D3DCF0;
   margin-left: 5px;
}
/deep/ .el-radio__label{
        padding-left: 0px;
}

</style>    