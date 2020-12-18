<template>
   <div class="treeBox" style="text-align:center">
        <div class="divSearchBox divStratege text-center">
            <el-tabs v-model="activeXC" @tab-click="handleClick">
                 <el-tab-pane v-for="(item, index) in editableTabsXC" :name="item.name" :key="item.name" style="height:100%">
                      <span slot="label"><i class="tabtree-icon" :class="item.icon"></i> {{item.title}}</span>
                 </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 筛选 -->
        <div class="serachWrap">
            <el-row :gutter="5" style="margin:0px">
                <el-col :span="24" >
                    <div class="search" >
                        <el-input v-model="input_device" placeholder="请输入关键字" @keyup.enter.native="handleSearchByKey">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchByKey"></i>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="treeWrap treeStratege">
            <el-scrollbar class="hiddenXScroll" style="height:100%">
                <el-tree 
                    :props="props"
                    :data="treeData"
                    :load="loadNodeMainDevice"
                    node-key="nodeId"
                    ref="main_device_tree"
                    lazy
                    :default-expanded-keys="expandedNodes"
                    :render-content="renderContent"
                    @node-click="handleNodeClick"
                    @node-contextmenu="handleNodeRightClick"
                    ></el-tree>
            </el-scrollbar>
        </div>
        <div class="treefoot">
            
            <div class="treeOperate">
                <div class="treeOperate-l">
                    已选中<span class="treeSelectedNum">{{selectedStratege}}</span>
                </div>
                <div class="treeOperate-btn">
                  
                    <el-button type="text"  style="width: 47px;" ></el-button>
                    <el-button type="primary" size="small" @click="startPlays()" style="margin-left:5px"><i class="icon-start"></i><span>点播</span></el-button>
                    <el-button type="danger" size="small" :class="{'isStop':selectedStratege!=''}" @click="stopAll()"><i class="icon-stop"></i><span>停止</span></el-button>
                </div>
            </div>
        </div>
        <!-- 右键菜单 -->
        <tree-right-menu ref="rightMenu"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'SearchStratege',
    components: {
        TreeRightMenu,
    },
    data () {
        return {
            isStop: false,
            props: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            treeData: [],//整个树data
            expandedNodes: [],//默认张开的id集合
            currentNode: {
                id: null,
                time: null,//点击时间
            },
            input_device:'', //关键字
            statusValue:'all', //上线状态
            levelValue: '', //目录层级
            searchChange:false, //判断 显示 搜索按钮
            relationshipValue:0,
            activeXC:"speedy",  //显示的 策略类型
            editableTabsXC: [
                {
                    title: '巡查方案',
                    icon:"icontree-stratege",
                    name:"speedy"
                }
                // {
                //     title: '计划视频巡查',
                //     icon:"icontree-stratege",
                //     name:"plan"
                // }
            ],
            hasPlayD:false,
            //轮循需要的 参数 =========================================================  
            selectedStratege:'', //选中的 策略
            Timer:null, //定时器
            deviceArray:[], //轮循点播的 设备
            lxData:{},//选中 策略的轮循数据
            // playScreenInfo:[], //可轮询设备
            // playScreenNum: 0 //可轮询设备计数
        };
    },
    mounted(){
        this.getBusTableData();
    },
    methods: {
        //关键字搜索 提示
        handleSearchByKey(){
            var self = this;
            var organId = "";
            if(!this.input_device ){
                let strategyType = 0; //类型 
                if(this.activeXC == 'speedy')
                    strategyType = 0;
                else if(this.activeXC == 'plan')
                    strategyType = 1;
                this.getBusTableData();
            }else{
                let data = this.treeData.filter(item => {
                    return item.name.indexOf(this.input_device) > -1
                })
                this.treeData = data

            }
        },
        //快速巡查 计划巡查切换
        handleClick(tab, event) {
            if(this.relationshipValue == tab.name) return;
            this.relationshipValue = tab.name;
            let self = this;
            let organId = "";
            this.selectedStratege = '';
            let strategyType = 0; //类型 
            if(this.activeXC == 'speedy')
                strategyType = 0;
            else if(this.activeXC == 'plan')
                strategyType = 1;
            this.getBusTableData();

        },
        //获取监控分组
        getBusTableData() {
            let strategyType = 0; //类型 
            if(this.activeXC == 'speedy')
                strategyType = 0;
            else if(this.activeXC == 'plan')
                strategyType = 1;
            const that = this;
            // 请求列表数据 刷新
            this.treeData = [];
            // ================= mock data ============================================
            // let it = {
            //     id:'test000001',
            //     name:'测试数据1111',
            //     nodeStatus: 'strategeGroup',
            //     patrolInterval:10,
            //     isOpenVoice:0,
            //     windowLayout:4,
            //     patrolScreen:['0','3'],
            //     children:[],
            // }
            // this.treeData.push(it)
            // ================= mock data  结束============================================
            // 根据类型获取 列表 
            this.apiSDK.queryStrategyList(strategyType,res=> {
                console.log('视频巡查 数据=====>',res)
                if(res.rows && res.rows.length > 0){
                    res.rows.forEach(item => {
                        let lt = {
                            id: item.strategyId,
                            name: item.strategyName,
                            nodeStatus: 'strategeGroup',
                            strategyType:item.strategyType,
                            patrolInterval:item.patrolInterval,
                            isOpenVoice:item.isOpenVoice,
                            windowLayout:item.windowLayout,
                            patrolScreen:item.patrolScreen.split(','),
                            children:item.groupDeviceDtoList,
                        }
                        this.treeData.push(lt)
                    });
                }
            });
        },
        //加载节点
        loadNodeMainDevice(node, resolve){
            if(node.data.nodeStatus == 'strategeGroup'){
                // 加载 视频巡查资源
                // 调用 获取点播(轮循)分组的详细信息	getDBGroupInfoById
                // this.apiSDK.queryStrategyListById(node.data.id,res =>{
                //     console.log('获取详情=====>',res)
                // })
                //mock data
                let  loopRersources = node.data.children.map(item => {
                    if(item.status == "1"){
                        item.nodeStatus = "device_online"
                    }
                    if(item.status == "0"){
                        item.nodeStatus = "device_offline"
                    }
                    item.leaf = true
                    return item
                })
                node.data.children = loopRersources ;
                resolve(node.data.children);
            } 
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();
            this.$refs.rightMenu.closeRightMenu();
            //视频巡查
            if( data.nodeStatus == "strategeGroup" ) {
                
                // 清空可轮循设备
                // this.playScreenInfo = []
                this.deviceArray = []
                // this.playScreenNum = 0

                // this.$refs.rightMenu.strategyItem = data.id
                this.selectedStratege =  data.name   
                this.lxData = {
                    patrolInterval: data.patrolInterval, // 巡查时间
                    windowLayout: data.windowLayout,
                    patrolScreen: data.patrolScreen,
                    isOpenVoice:data.isOpenVoice,
                    children: data.children
                } 
            }
        },
        //开始巡查
        startPlays(){
            this.isStop = true;
            // =======================  先停止其他 ====================
            //停止定时器
            clearInterval(this.Timer);
            //1211 dj 修改 开始新巡查 需要等待 前一次巡查视频结束的问题  直接停止
          //  this.apiSDK.stopAll();
                //每次循环 都把上次的点播关闭
            let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
             for(var i =0;i<screenArr.length;i++){
                this.apiSDK.stopPlayByIndex(screenArr[i].screenIndex);  
             } 
            // this.apiSDK.stopAll();
            // 清空可轮循设备
            // this.playScreenInfo = [];
            // this.playScreenNum = 0;
            this.deviceArray = [];

            // ============================= 在开始新的轮循 =============================
            //改变屏幕布局
            this.apiSDK.splitWidowForPlugin(this.lxData.windowLayout);
            this.apiSDK.publishSplitScreen(this.lxData.windowLayout);

            let that = this;
            //用来判断 在线的设备数量 是否少于 轮循屏数量
            let onlineArr = that.lxData.children.filter(item => {return item.status == '1'})
            if(onlineArr.length <= this.lxData.patrolScreen.length){
                this.lxData.patrolScreen = this.lxData.patrolScreen.splice(0,onlineArr.length)  
            }
            // that.apiSDK.stopAll();
            that.startPlayLoop();
            //如果 在线资源数量 大于 分屏数量  进行 轮循
            if(onlineArr.length > this.lxData.patrolScreen.length){
                this.Timer = setInterval(()=>{
                    that.apiSDK.stopAll();
                    that.startPlayLoop()
                }, that.lxData.patrolInterval * 1000);
            }
        },
        startPlayLoop(){
            let that = this; 
            //获取 轮循屏幕 数组 loopScreenCount.length  === 一次点播几个资源
            let loopScreenCount = this.lxData.patrolScreen;

            //每次循环 都把上次的点播关闭
            let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
            // for(var i =0;i<screenArr.length;i++){
            //     this.apiSDK.stopPlayByIndex(screenArr[i].screenIndex);  
            // } 
            // this.apiSDK.stopAll();
            //每次固定  播放 轮循屏幕 数
            // let that = this;
            setTimeout(() => {
               for(let i =0;i<loopScreenCount.length;i++){
                    //判断 播放的资源  是否少于 轮循屏幕数量  
                    let onlineArr = that.lxData.children.filter(item => {return item.status == '1'})
                    if(that.deviceArray.length <= loopScreenCount.length){
                        //少于 将原数组追加到 播放资源    12.1 将在线的设备  组追加到 播放资源
                        that.deviceArray = that.deviceArray.concat(onlineArr)
                        // // 只轮询可点播设备
                        // if(this.playScreenNum>=onlineArr.length){
                        //     that.deviceArray = that.playScreenInfo
                        // }
                    }
                    // else{
                    //     // 只轮询可点播设备
                    //     if(this.playScreenNum>=onlineArr.length){
                    //         that.deviceArray = that.playScreenInfo
                    //     }
                    // }
                    //因为 每次 点播后都会将 资源删除 所以每次都点播的是 第一条
                    let resouceData = that.deviceArray[0]
                    //点播
                    if(resouceData){
                        if(resouceData.resourceType == 'channel'){
                            let channels = [{channelID: resouceData.deviceId.split(',')[0], index: loopScreenCount[i]}];
                            this.apiSDK.startPlayNVRDeviceByIndex( resouceData.deviceId.split(',')[1], channels, 'unicast');
                        } else {
                            that.apiSDK.startPlayDevice(loopScreenCount[i], resouceData.deviceId, resouceData.resCh,parseInt(resouceData.resourceType), 1, resouceData.name, 'unicast');
                            // //每次 都删除 第一条  
                            // that.deviceArray.splice(0,1)
                            // this.playScreenNum++
                            // // 保存已经播放过的资源
                            // if(screenArr.length>0){
                            //     screenArr.forEach(v=>{
                            //         onlineArr.forEach(e=>{
                            //             if(e.deviceId == v.resId){
                            //                 if(!that.playScreenInfo.includes(e)){
                            //                     that.playScreenInfo.push(e)
                            //                 }
                            //             }
                            //         })
                            //     })
                            // }
                            // console.log('可轮询设备', that.playScreenNum, that.playScreenInfo)
                        }
                        //每次 都删除 第一条  
                        that.deviceArray.splice(0,1)
                    }
                }
            }, 2000);
        },
        //停止
        stopAll(){
            this.isStop = false;
            //停止定时器
            clearInterval(this.Timer);
            //停止所有点播
            // let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
            // for(var i =0;i<screenArr.length;i++){
            //     this.apiSDK.stopPlayByIndex(screenArr[i].screenIndex);  
            // } 
            this.apiSDK.stopAll();
            this.$refs.rightMenu.strategyItem = '';
            // this.playScreenInfo = [];
            // this.playScreenNum = 0;
            this.deviceArray = [];

        },
        //hover 点击 开始图标
        hoverStartClick(data){
            this.$refs.rightMenu.strategyItem = data.id
            this.selectedStratege =  data.name   
            this.lxData = {
                patrolInterval: data.patrolInterval, // 巡查时间
                windowLayout: data.windowLayout,
                patrolScreen: data.patrolScreen,
                isOpenVoice:data.isOpenVoice,
                children: data.children
            } 
            this.startPlays();
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
             event.stopPropagation();
            //console.log(node.data.nodeStatus)
            if(data.nodeStatus  == "strategeGroup"){
                this.$refs.rightMenu.showRightMenu(event, data);
            }
        },
        //修改
        searchValuChangeFun(value){
            console.log(value)
            this.searchV=value.checkedtab;
        },
         // 去重
        reduce(array) {
            let object = {}
            return array.reduce((total, item) => {
                object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
                return total
            }, [])
        },
        /**
         * @param  {String} resType [需返回的数据，默认为所有]
         * @return {Array}          [description]
         */
        mergeResourceData() {
            let nodes = [];
            nodes = this.$refs.main_device_tree.getCheckedNodes();
            return this.reduce(nodes);
        },
     
        //设备上线通知
        onlineNotify(list){
            for(var i = 0, l = list.length; i < l; i++){
                var item = list[i];
                this.$notify({
                    title: '上线通知',
                    message: "【"+item.resName+"】上线了",
                    position: 'bottom-right',
                    type: 'info',
                  });
            }
        },
         //树行样式 
        // <span class="strategeDot">
        //     <span class="start_icon" on-click={ () => this.hoverStartClick(data) } ></span>
        //     <span class="edit_icon" on-click={ () => this.editGroup(data) }></span>
        //     <span class="del_icon" on-click={ () => this.delGroup(data) }></span>
        // </span>
        renderContent(h, { node, data, store }) {
            if ( data.nodeStatus === 'strategeGroup' ) {
                return (<span class={"custom-tree-node " + data.nodeStatus} >
                        <span class="node-icon-radio"></span>
                        <span class="node-icon"></span>
                        <span class="node-name">{node.label}</span>
                    </span>);
            }else{
                return (<span  class={"custom-tree-node " + data.nodeStatus}  title="aaaaaaaaaa">
                        <span class="node-icon-radio"></span>
                        <span class="node-icon"></span>
                        <span class="node-name">{node.label}</span>
                    </span>);
            }
        },
        //编辑
        editGroup(data){
            this.$refs.rightMenu.$refs.strategeInfoDialog.showDialog(data.id,this.treeData)
        },
        //删除
        delGroup(data){
            this.$confirm('是否确定删除'+ data.name +'?', '信息提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false
            }).then(() => {
                this.apiSDK.deleteStrategyById(data.id,res=> {
                    this.showremind('提示',res.msg) 
                })
                let strategyType = 0; //类型 
                if(this.activeXC == 'speedy')
                    strategyType = 0;
                else if(this.activeXC == 'plan')
                    strategyType = 1;
                this.getBusTableData();
            }).catch(() => {    
            });
        },
        //清空树
        clearTree(){
            //清空node
            var tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.main_device_tree.getNode(item);
                node && this.$refs.main_device_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        showremind(title,message){
            this.$notify({
                message: message,
                type: 'warning',
            });
        },
    },
    beforeDestroy(){
        this.stopAll();
    }
}
</script>

<style scoped>
.treeBox{
    height: 100%;
    background: url(../../../../static/main/screen/resource_bg.png) no-repeat top;
    margin-top: -2px;
    background-size: 100% 100%;
}
.newSearchBtn{
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    padding: 12px;
    border:1px solid #DCDFE6;
    border-radius: 5px;
    box-sizing: border-box;
}
.searchStatus{
    background: url(../../../../static/common/search.png) no-repeat center center;
}
.backStatus{
    background: url(../../../../static/common/back_btn.png) no-repeat center center;
}
.treeWrap{
    width:414px;
    height: calc(100% - 163px);
    padding: 0 5px;
    box-sizing: border-box;
    /* padding-left: 16px; */
}
.divSearchBox {
  width: 100%;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  /* border: 1px solid #365076; */
  /* background-color: #dbf0fe; */
  box-sizing: border-box;
  position: relative;
}
.text-center{
  text-align: center;
}
.text-right{
  text-align: right;
}
.searchBtn{
   position: absolute;
  right: 0px;
  top: 0px;
  padding: 0px;
  border: 0px;
  width: 40px;
  height: 40px;
  background:#409EFF;
  text-align: center;
  
}
.searchBtn-command{
    width: 40px;
    height: 40px;
    outline: none;
    border-width: 0px;
    background:url(../../../../static/common/u106.png) no-repeat center;
    background-size: 20px;
    cursor: pointer;
}
.searchBtn:hover{
   background:#56a9ff;
}

.treeOperate{
    height: 100%;
    line-height: 41px;
    box-sizing: border-box;
}

/* ui tab样式11.16 */
.treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header{
    background: transparent!important;
}
.treeBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:first{
    padding-left: 4px;
}
.treeBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item{
  color:#B7C1D0;    padding: 0 12px;
}
.treeBox /deep/  .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item::after{
  content:'';
  margin: 0;
}
.treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  /* font-weight: bold; */
  color:#fff;
  font-size: 15px;
}
 .treeBox /deep/ .divSearchBox >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__active-bar{
  height: 3px;
}
.tabtree-icon{
    display: inline-block;
    width:16px;
    height: 16px;
    vertical-align: middle;
    cursor: pointer;
    margin: -4px 2px 0 0;
}
/*策略 tab 图标*/
.icontree-stratege{
    background:url(../../../../static/stratege/icon-stratege-type.png) no-repeat center;
    background-size: 18px;
}
.el-tabs__item.is-active .icontree-stratege{
    background:url(../../../../static/stratege/icon-stratege-typeAct.png) no-repeat center;
    background-size: 18px;
}

/deep/ .el-icon-arrow-left:before,
/deep/ .el-icon-arrow-right:before {
    color: #D7E7FF;
}

.divStratege /deep/ .el-tabs__active-bar{
    width: 89px!important;
    background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%);
}

.treefoot{
    width: 100%;
    height: 59px;
    background: url(../../../../static/main/screen/resource_bottom_bg.png) no-repeat top;
    background-size: 100% 60px;
    color:#D3DCF0;
}
.icon-clear{
    display: inline-block;
    width:14px;
    height: 14px;
    vertical-align: middle;
    /* background: url(../../../../static/common/reset.png) no-repeat center; */
}
.treefoot /deep/ .el-button--text{
  color:#D3DCF0;
}
.treeSelectedNum{
  color:#599AFF;  
}
.ckBox{
    float: left;
    text-align: left;
    text-indent: 25px;
    width: 50%;
    /* width: 62%; */
    color: #B7C1D0;
    font-size: 12px;
}
.el-button {
    /* padding: 0 15px; */
}
.el-button span{
    display: inline-block;
    height: 22px;
}
.el-button .icon-start,.el-button .icon-stop{
    display: inline-block;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    margin-right: 3px;
}
.el-button .icon-start{
    background:url(../../../../static/stratege/icon-play.png) no-repeat center;
}
.el-button .icon-stop{
    background:url(../../../../static/stratege/icon-stopPlay.png) no-repeat center;
}
.isStop.el-button .icon-stop{
    background:url(../../../../static/stratege/icon-stopPlay-act.png) no-repeat center;
}
.el-button .icon-start+span,.el-button .icon-stop+span{
    display: inline-block;
    line-height: 22px;
    height: 22px;
    vertical-align: middle;
}
/deep/.isStop.el-button--danger{
    color: #FFF;
    background: url(../../../../static/common/btn-danger.png) no-repeat center;
}
/deep/.isStop.el-button--danger:hover{
    background: transparent;
    border-color: #E05656;
    color: #E05656;
}/deep/.isStop.el-button--danger:hover .icon-stop{
    background:url(../../../../static/stratege/icon-stopPlay.png) no-repeat center;
}
/deep/ .el-button--danger{
    background: transparent;
    border-color: #E05656;
    color: #E05656;
}
/deep/ .custom-tree-node.strategeGroup .node-name{
    line-height: 20px;
    margin-left: 3px;
    vertical-align: middle;
}
/* .treeStratege /deep/ .el-tree-node__content{
    margin-bottom: 10px;
} */
/* 树节点图标 */
/deep/ .custom-tree-node.strategeGroup .node-icon{
     background: url("../../../../static/stratege/icon-stratege.png");
}
/* 树节点选中图标 */
/deep/ .el-tree-node.is-current.is-focusable > .el-tree-node__content .custom-tree-node.strategeGroup .node-icon{
     background: url("../../../../static/stratege/icon-act-stratege.png");
} 

/* 树节点 单选图标 大小位置*/
/deep/ .node-icon-radio{
    display: inline-flex;
    width: 14px;
    height: 20px;
}
/deep/ .custom-tree-node.strategeGroup .node-icon-radio,
/deep/ .el-tree-node.is-current.is-focusable > .el-tree-node__content .custom-tree-node.strategeGroup .node-icon-radio{
    display: inline-flex;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    margin-right: 6px;
    vertical-align: middle;
    background-repeat: no-repeat;
}
/* 树节点 单选图标 */
/deep/ .custom-tree-node.strategeGroup .node-icon-radio{
    background: url("../../../../static/stratege/radio-icon.png") center;
}
/* 树节点 单选 选中图标 */
/deep/ .el-tree-node.is-current.is-focusable > .el-tree-node__content .custom-tree-node.strategeGroup .node-icon-radio{
     background: url("../../../../static/stratege/radio-icon-act.png");
}
/deep/ .el-tree-node__content:hover .custom-tree-node.strategeGroup .node-icon-radio{
    background: url("../../../../static/stratege/radio-icon-hover.png") center;
}

/* 树节点hover菜单 */
.treeStratege /deep/ .el-tree-node{
    position: relative;
}

/deep/ .custom-tree-node.strategeGroup .strategeDot{
    position: absolute;
    right: 20px;
    top:0px;
    display: inline-block;
    width: 101px;
    height: 26px;
    vertical-align: middle;
    visibility: hidden;
}
/deep/ .el-tree-node__content:hover .custom-tree-node.strategeGroup .strategeDot{
    visibility: visible;
    padding: 5px 0;
}
/deep/ .custom-tree-node.strategeGroup .strategeDot .edit_icon,
/deep/ .custom-tree-node.strategeGroup .strategeDot .del_icon,
/deep/ .custom-tree-node.strategeGroup .strategeDot .start_icon{
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 13px;
    background-position-y: 2px!important;
}
/deep/ .custom-tree-node.strategeGroup .strategeDot .start_icon{
    background: url("../../../../static/stratege/start-icon.png") center;
}
/deep/ .custom-tree-node.strategeGroup .strategeDot .edit_icon{
    background: url("../../../../static/stratege/edit-icon.png") center;
}
/deep/ .custom-tree-node.strategeGroup .strategeDot .del_icon{
    background: url("../../../../static/stratege/del-icon.png") center;
    margin-right:0px;
}
.treeStratege /deep/ .el-tree-node.is-current.is-focusable > .el-tree-node__content{
    background: none;
}
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
       margin-right: -20px!important;
    height: calc(100% + 20px);
}
/deep/ .el-tree{
    margin-bottom: 20px;
}

.treeOperate-l{
    width: 135px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
.treeOperate{
    padding: 8px 12px;
    box-sizing: border-box;
}
.treeOperate-btn{
    width: 245px;
    vertical-align: middle;
}
.treeOperate-l,.treeOperate-btn{
    display: inline-block;
    height: 41px;
    line-height: 38px;
    font-size: 12px;
}
.treeSelectedNum{
  color:#599AFF;  
  font-size: 14px;
}

/deep/ .el-button--danger:hover{
    color: #f78989!important;
    border: 1px solid #f78989!important;
}
</style>