<template>
	<el-row :gutter="10">
		<el-col :span="8">
			<!-- 会场通知树 -->
			<el-card class="box-card meet" v-if="module === 'Meet'">
                <div slot="header">
                    <span>通知人员</span>
                    <el-checkbox v-model="isCheckAllUsers" @change="handleCheckAllChange" style="float:right;">全部/取消</el-checkbox>
                </div>
                <div>
                	<el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
	                <el-checkbox v-for="item in magUersData" :label="item.id" :key="item.id">
	                <!-- <el-checkbox v-for="item in magUersData" :label="item" :key="item"> -->
	                    <span class="user_icon"></span>
	                    <span>{{item.name}}</span>
	                    <!-- <span>{{item}}</span> -->
	                </el-checkbox>
	            </el-checkbox-group>
                </div>
            </el-card>
	        <!-- 广播通知树 -->
	        <el-tabs v-model="tabsActive" v-else>
                <el-tab-pane label="组织结构" name="personTree">
                    <person-tree ref="personTree" :subscribeType="subscribeType" style="height: 592px;"/>
                </el-tab-pane>
                <el-tab-pane label="设备资源" name="deviceTree">
                    <device-tree ref="deviceTree" :subscribeType="subscribeType" style="height: 592px;"/>
                </el-tab-pane>
                <el-tab-pane label="常用资源" name="commonTree">
                    <common-res ref="commonTree" :subscribeType="subscribeType" style="height: 592px;"/>
                </el-tab-pane>
            </el-tabs>
		</el-col>
		<el-col :span="16">
			<el-row :gutter="10">
				<el-col :span="12">
					<!-- 视图 -->
					<div class="previewBox" :style="'align-items:' + filterForPos(templateForm.rollPos)">
						<marquee id="previewContent" :style="getStyle(templateForm)" :direction="templateForm.rollStyle == 'fromLeftToRight' ? 'right' : 'left'" :scrollAmount="filterForSpeed(templateForm.rollspeed)">{{message}}</marquee>
                        
					</div>
				</el-col>
				<el-col :span="12">
					<!-- 样式模板 -->
					<el-card class="box-card">
		                <div slot="header">
		                    <span>样式模板</span>
		                </div>
		                <ul class="templates">
		                	<template v-for="item in styleTemplateData">
	                            <li :id="item.templateId" :key="item.key" :class="item.templateId=== styleTemplateSelected.templateId ? 'active' : '' " @click="templateClick(item)">
	                                <span class="icon" :class="item.templateId === styleTemplateSelected.templateId ? 'el-icon-check' : ''"></span>
	                                <span class="name">{{item.templateName}}</span>
	                                <span class="delete-icon" @click.stop="deleteStyleTemplate(item)"></span>
	                            </li>
	                        </template>
		                </ul>
		            </el-card>

				</el-col>
			</el-row>
			<!-- 模板选项 -->
			<el-form :inline="true" :model="templateForm" ref="templateForm" :rules="templateFormRules" style="margin-top:10px;">
                <div class="formDiv">
                    <el-form-item label="模板名称" prop="templateName">
                        <el-input v-model="templateForm.templateName" placeholder="模板名称" class="templateNameInput" :disabled="templateForm.templateId !== ''"></el-input>
                    </el-form-item>
                    <el-button type="text" class="addTemplate" title="保存新增模板" :disabled="templateForm.templateId !== ''" @click="addStyleTemplate"/>
                    <el-button type="text" class="editTemplate" title="保存修改模板" :disabled="templateForm.templateId === ''" @click="editStyleTemplate"/>
                </div>
                <div class="formDiv">
                    <el-form-item label="字体">
                        <el-select v-model="templateForm.fontFamily" placeholder="字体" style="width: 110px;">
                            <el-option v-for="item in templateOptions.fontFamilyData" :label="item.name" :value="item.id" :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-select v-model="templateForm.fontSize" placeholder="字号" style="width: 80px;">
                            <el-option v-for="item in templateOptions.fontSizeData" :label="item" :value="item" :key="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字型">
                        <el-select v-model="templateForm.fontPattern" placeholder="字型" style="width: 80px;">
                            <el-option v-for="item in templateOptions.fontStyleData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="templateForm.color" color-format="hex" ></el-color-picker>
                    </el-form-item>
                </div>
                <div class="formDiv">
                    <el-form-item label="方向">
                        <el-select v-model="templateForm.rollStyle" placeholder="方向" style="width: 105px;">
                            <el-option v-for="item in templateOptions.fontDirectionData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="位置">
                        <el-select v-model="templateForm.rollPos" placeholder="位置" style="width: 75px;">
                            <el-option v-for="item in templateOptions.fontPositionData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="速度">
                        <el-select v-model="templateForm.rollspeed" placeholder="速度" style="width: 75px;">
                            <el-option v-for="item in templateOptions.fontSpeedData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="滚动时间">
                         <el-checkbox v-model="templateForm.isNotLimit">不限</el-checkbox>
                         <el-input-number v-model="templateForm.rollTime" controls-position="right" :min="1" :max="10" class="limitInput" style="width: 85px;"></el-input-number>
                         分钟
                    </el-form-item>
                </div>
                <div class="msgContentBox">
                    <p>通知内容（64个汉字以内）：</p>
                    <el-input type="textarea" :rows="3" placeholder="请输入通知内容" v-model="message" resize="none" maxlength="64"> </el-input>
                </div>
                <div class="footer-btn">
                    <!-- <el-switch v-model="isCanRoll" active-color="#409EFF" inactive-color="#DCDFE6"></el-switch>
                    <span style="margin: 0 10px 0 5px;">未满屏允许滚动</span> -->
                    <el-button type="primary" @click="sendNotification">发送</el-button>
                    <el-button @click="canel">取消</el-button>
                </div>
            </el-form>
		</el-col>
	</el-row>
</template>
<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import DeviceTree from "@/components/home/selectRes/DeviceTree.vue";
import CommonRes from "@/components/home/selectRes/CommonRes.vue";
export default {
	name: 'SendNotification',
	components: {
        PersonTree,
        DeviceTree,
        CommonRes
    },
	data() {
        return {
        	module: '',
        	// 会场，广播api枚举
            moduleAPI: {
            	Meet: {
            		getStyleTemplate: 'getNotificationTemplateList',
            		deleteStyleTemplate: 'deleteNotificationTemplate',
            		getStyleTemplateById: 'getNotificationTemplateById',
            		addStyleTemplate: 'addNotificationTemplate',
            		editStyleTemplate: 'updateNotificationTemplate',
            		sendNotification: 'sendConferenceNotification',
            	},
            	Broad: {
            		getStyleTemplate: 'getBroadNotificationTemplateList',
            		deleteStyleTemplate: 'deleteBroadNotificationTemplate',
            		getStyleTemplateById: 'getBroadNotificationTemplateById',
            		addStyleTemplate: 'addBroadNotificationTemplate',
            		editStyleTemplate: 'updateBroadNotificationTemplate',
            		sendNotification: 'sendBroadNotification',
            	},
            },
            isCheckAllUsers:false,
            checkedUsers:[],
            subscribeType: [],
            magUersData:[],
            styleTemplateData:[],
            styleTemplateSelected:{},
            templateOptions: {
            	fontFamilyData:[
                    {
                        value:1,
                        id:'SIM_SUN',
                        // name:'SimSun',
                        name:'宋体',
                    },
                    {
                        value:2,
                        id:'SIM_HEI',
                        // name:'SimHei',
                        name:'黑体',
                    },
                    {
                        value:3,
                        id:'SIM_KAI',
                        // name:'KaiTi',
                        name:'楷体',
                    },
                    {
                        value:4,
                        id:'SIM_SUN_EX',
                        // name:'FangSong',
                        name:'仿宋',
                    },
                    {
                        value:5,
                        id:'SIM_LI',
                        // name:'LiSu',
                        name:'隶书',
                    },
                ],
                fontSizeData:[8,10,12,14,16,20,24,28,32,36,40,44,48,50],
                fontStyleData:[
                    {
                        id:'normal',
                        name:'常规',
                    },
                    {
                        id:'italic',
                        name:'斜体',
                    },
                    {
                        id:'bold',
                        name:'粗体',
                    },
                    {
                        id:'boldItalic',
                        name:'粗斜体',
                    },
                ],
                fontDirectionData:[
                    {
                        id:'fromRightToLeft',
                        name:'从右到左',
                    },
                    {
                        id:'fromLeftToRight',
                        name:'从左到右',
                    },
                ],
                fontPositionData:[
                    {
                        id:'top',
                        name:'顶部',
                    },
                    {
                        id:'center',
                        name:'居中',
                    },
                    {
                        id:'bottom',
                        name:'底部',
                    },
                ],
                fontSpeedData:[
                    {
                        id:'slow',
                        name:'较慢',
                    },
                    {
                        id:'normal',
                        name:'普通',
                    },
                    {
                        id:'fast',
                        name:'较快',
                    },
                ],
            },
            templateForm:{
                templateId:'',
                templateName:'',
                fontFamily: '宋体',
                fontSize:20,
                fontPattern:'normal',  // 常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic
                color:'rgb(0, 0, 0)',
                rollStyle:'fromRightToLeft',
                rollPos:'center',
                rollspeed:'normal',
                isNotLimit:false,
                rollTime:1,
            },
            templateFormRules:{
                templateName:[
                    { required: true, message: "请输入模板名称", trigger: "change" },
                ],
            },
            message:'',
            isCanRoll:true,
            tabsActive: 'personTree'
        }
    },
    methods:{
    	// 初始化
    	init(module) {
    		this.module = module;
    		this[`getTree${module}`]();
    		this.getStyleTemplate();
    	},
    	// 获取左侧树-----会议
    	getTreeMeet() {
    		// mock data ==================
    		this.magUersData = [
                {
                    id:'001',
                    name:'测试用户001',
                },
                {
                    id:'002',
                    name:'测试用户002',
                },
                {
                    id:'003',
                    name:'测试用户003',
                },
            ];
            // mock data ==================
    	},
    	// 获取左侧树-----广播
    	getTreeBroad() {
    		this.$nextTick(() => {
                const organId = "";
                this.subscribeType = Enum.enumSubscribeType.notification;
                //订阅用户组织结构
                let subjectId = 0;
                this.apiSDK.getOrganizationUser(organId, this.subscribeType.subscribeOrganizationUser, subjectId, (obj) => {
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.personTree.setReceiveInformAddDepartmentCallback(obj);
                });
                //获取设备组织结构
                this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.deviceTree.setReceiveInformAddDepartmentCallback(obj);
                });
                //获取常用资源树
                this.apiSDK.subscribeCommonRes("", "", "", this.subscribeType.subscribeCommonResources);
                //资源回调
                this.apiSDK.setReceiveResourceStatusQueryCallback("notification", (obj) => {
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.personTree.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.deviceTree && this.$refs.deviceTree.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.commonTree && this.$refs.commonTree.setReceiveInformResourceStatusCallback(obj);
                });
            });
    	},
        // 获取树选择用户
        getCheckedNodes() {
            let nodes = [];
            if(this.tabsActive == "personTree"){
                nodes = this.$refs.personTree.$refs.SelectResUsersStatus.getCheckedNodes();
            }else if(this.tabsActive == "deviceTree"){
                nodes = this.$refs.deviceTree.$refs.SelectResDevicesStatus.getCheckedNodes();
            } else if(this.tabsActive == "commonTree"){
                nodes = this.$refs.commonTree.$refs.SelectResCommonsStatus.getCheckedNodes();
            }
            nodes = nodes.map(item => {
                return {userId: item.id};
            });
            return nodes;
        },
        // 全部/取消
        handleCheckAllChange(val){
            // this.checkedUsers = val ? this.magUersData : [];
            if( val === true ){
                this.magUersData.forEach((item)=>{
                    this.checkedUsers.push(item.id);
                });
            }else{
                this.checkedUsers = [];
            }
            // console.log(JSON.stringify(this.checkedUsers));
        },
        handleCheckedUsersChange(value){
            let checkedCount = value.length;
            this.isCheckAllUsers = checkedCount === this.magUersData.length;
        },
        // 获取显示样式
        getStyle(data) {
            // console.log(data);
            let style = '';
            let fontFamily = Fun.filterForFontFamily(data.fontFamily);
            let pattern = this.getFontPatternStr(data.fontPattern);
            if (Object.keys(data).length) {
                style = `font-family: ${fontFamily}; font-size: ${data.fontSize}px; color: ${data.color}; ${pattern};`;
            }
            return style;
        },
        getFontPatternStr(pattern) {
        	if (pattern === 'normal') {
        		return '';
        	}
        	if (pattern === 'italic' ){
        		return 'font-style: italic;';
            }
            if (pattern === 'bold') {
            	return 'font-weight: bold';
            }
            if (pattern === 'boldItalic') {
            	return 'font-style: italic;font-weight: bold;';
            }
        },
        filterForSpeed: function(type){
            switch (type) {
                case "normal":
                  return 6
                case "fast":
                  return 10
                case "slow":
                  return 2
              }
            return 6;
        },
        filterForPos: function(type){
            switch (type) {
                case "top":
                  return 'flex-start'
                case "center":
                  return 'center'
                case "bottom":
                  return 'flex-end'
            }
            return 'center';
        },
        // 获取样式模板列表
        getStyleTemplate(){
        	// mock data ==================
            // this.styleTemplateData = [
            //     {
            //         id:'111',
            //         name:'样式模板01',
            //         active:false,
            //         info:{
            //             fontFamily:'',
            //             fontSize:'',
            //             // ...
            //         },
            //     },
            //     {
            //         id:'222',
            //         name:'样式模板02',
            //         active:false,
            //     },
            //     {
            //         id:'333',
            //         name:'样式模板03',
            //         active:false,
            //     },
            // ];
            // mock data ==================
            let apiFun = this.moduleAPI[this.module].getStyleTemplate;
            this.apiSDK[apiFun](0, 1024, res => {
            	this.styleTemplateData = res.list;
            });
        },
        // 删除模板样式
        deleteStyleTemplate(item) {
        	let apiFun = this.moduleAPI[this.module].deleteStyleTemplate;
        	this.apiSDK[apiFun](item.templateId, (res) => {
                if( res && res.Ret === 0 ) {
                    this.$message({ message: '删除样式模版成功', type: 'success' });
                    this.getStyleTemplate();
                } else {
                    this.$message({ message: '删除样式模版失败', type: 'warning' });
                }
                this.empty();
            });
        },
        // 选择模板
        templateClick(item){
            // 选择模板样式
            this.styleTemplateSelected = item;
            this.templateForm.templateName = item.templateName;
            this.templateForm.templateId = item.templateId;

            this.getStyleTemplateById(item);
        },
        getStyleTemplateById(item) {
            let apiFun = this.moduleAPI[this.module].getStyleTemplateById;
            this.apiSDK[apiFun](item.templateId, (res) => {
                if (res) {
                    this.templateForm = {
                        templateId: res.templateId,
                        templateName: res.templateName,
                        fontFamily: Fun.filterForFontFamily(res.fontFamily),
                        fontSize: res.fontSize,
                        fontPattern: res.fontPattern,  // 常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic
                        color: `rgb(${res.color.R}, ${res.color.G}, ${res.color.B})`,
                        rollStyle: res.rollStyle,
                        rollPos: res.rollPos,
                        rollspeed: res.rollspeed,
                        isNotLimit: res.isNotLimit || false,
                        rollTime: res.rollTime,
                    }                    
                    // this.templateForm = res;
           //          this.templateForm.color =  `rgb(${res.color.R}, ${res.color.G}, ${res.color.B})`;
                }
            });
        },
        // 添加会场通知模版
        addStyleTemplate(){
            this.$refs.templateForm.validate((valid) => {
                if (valid) {
                    // console.log(Fun.hexToRGB(this.templateForm.color));
                    let apiFun = this.moduleAPI[this.module].addStyleTemplate;
                    console.log(this.templateForm.fontFamily);
                    this.apiSDK[apiFun](this.templateForm.templateName, this.templateForm.fontFamily, this.templateForm.fontSize, this.templateForm.fontPattern, Fun.hexToRGB(this.templateForm.color), this.templateForm.rollStyle, this.templateForm.rollPos, this.templateForm.rollspeed, this.templateForm.rollTime, this.templateForm.isNotLimit, res => {
                    	if( res && res.Ret === 0 ) {
		                    this.$message({ message: '新增样式模版成功', type: 'success' });
		                    this.getStyleTemplate();
                            this.empty();
		                } else {
		                    this.$message({ message: '新增样式模版失败', type: 'warning' });
		                }
                    });
                    // mock data =================
                    // this.styleTemplateData.push(this.templateForm);
                    // mock data =================
                }
            });
        },
        // 修改会场通知模版
        editStyleTemplate(){
        	this.$refs.templateForm.validate((valid) => {
                if (valid) {
                    let apiFun = this.moduleAPI[this.module].editStyleTemplate;
                    this.apiSDK[apiFun](this.templateForm.templateId, this.templateForm.templateName, this.templateForm.fontFamily, this.templateForm.fontSize, this.templateForm.fontPattern, Fun.hexToRGB(this.templateForm.color), this.templateForm.rollStyle, this.templateForm.rollPos, this.templateForm.rollspeed, this.templateForm.rollTime, this.templateForm.isNotLimit, res => {
                    	if( res && res.Ret === 0 ) {
		                    this.$message({ message: '修改样式模版成功', type: 'success' });
                            this.getStyleTemplate();
                            this.empty();
		                } else {
		                    this.$message({ message: '修改样式模版失败', type: 'warning' });
		                }
                    });
                }
            });
        },
        // 发送按钮
        sendNotification(){
            if (this.module === 'Broad') {
                this.checkedUsers = this.getCheckedNodes();
            }
            if( this.checkedUsers.length === 0 ){
                this.$message({
                    message: '请选择需要通知的人员',
                    type: 'warning'
                });
                return;
            }
            if( !this.message ){
                this.$message({
                    message: '请填写通知内容',
                    type: 'warning'
                });
                return;
            }
            // if( !this.styleTemplateSelected.templateId ){
            //     this.$message({
            //         message: '请选择通知的样式模板',
            //         type: 'warning'
            //     });
            //     return;
            // }
            // 
            let color = Fun.hexToRGB(this.templateForm.color);
            let style = {
                fontFamlily: this.templateForm.fontFamily,
                fontSize: this.templateForm.fontSize.toString(),
                fontStyle: this.templateForm.fontPattern,
                fontColorR: color.R.toString(),
                fontColorG: color.G.toString(),
                fontColorB: color.B.toString(),
                direction: this.templateForm.rollStyle,
                aligning: this.templateForm.rollPos,
                speed: this.templateForm.rollspeed,
                isScrollTime: this.templateForm.isNotLimit.toString(),
                scrollInterval: this.templateForm.rollTime.toString()
            }
            let users = this.checkedUsers;
            let apiFun = this.moduleAPI[this.module].sendNotification;
            this.apiSDK[apiFun](users, this.message, this.styleTemplateSelected.templateId, style, this.templateForm.isCanRoll);
            this.empty();
        },
        // 清空
        empty() {
        	this.checkedUsers = [];
        	this.styleTemplateSelected = {};
        	this.isCanRoll = false;
        	this.message = '';
        	this.templateForm = {
                templateId:'',
                templateName:'',
                fontFamily: '宋体',
                fontSize:20,
                fontPattern:'normal',  // 常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic
                color:'rgb(0, 0, 0)',
                rollStyle:'fromRightToLeft',
                rollPos:'center',
                rollspeed:'normal',
                isNotLimit:false,
                rollTime:1,
            };
            //清空
            this.$refs.personTree.clearTree();
            this.$refs.deviceTree.clearTree();
            this.$refs.commonTree.clearTree();
            //取消订阅
            const subIDs = new Array(this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,
                             this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,this.subscribeType.subscribeOrganizationDevice,
                             this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
                             this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus);
            this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
        },
        // 关闭弹框
        canel(){
        	this.empty();
        	this.$emit('closeDialog');
        },
    },
}	
</script>
<style scoped>
.meet{
	height: 720px;
}
.el-checkbox-group{
    height: calc(100% - 40px);
    overflow: auto;
}
/deep/ .el-checkbox-group .el-checkbox{
    display: block;
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    margin: 0;
}
/deep/ .el-checkbox-group .el-checkbox .el-checkbox__label{
    color: #0f5794;
}
/deep/ .el-checkbox-group .el-checkbox:hover{
    background: #dbf0fe;
}
.el-checkbox-group .user_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/resource_tree/person_online.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.previewBox{
    width: 100%;
    height: 320px;
    background: #dcdcdc;
    display: flex;
    justify-content: center;
    align-items: center; 
    overflow: auto;
}
.templates{
    padding: 0;
    margin: 0;
    height: 280px;
    overflow: auto;
}
.templates li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    cursor: pointer;
}
.templates li .icon{
    display: inline-block;
    width: 14px;
    height: 14px;
}
.templates li.active{
    background: #b1e0ff;
}
.templates li .delete-icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/holderControl/delPrepare.png") no-repeat;
    background-size:100% 100%;
    vertical-align: middle;
    float: right;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
}
.templates li .delete-icon:hover{
    background:url("../../../static/holderControl/delPrepare_active.png") no-repeat;
    background-size:100% 100%;
}
.msgContentBox{
    border-top:1px solid #dcdfe6;;
}
.addTemplate,
.editTemplate{
	width: 20px;
	height: 20px;
	border: 0;
    border-radius: 0;
    margin-top: 9px;
}
.addTemplate{
    background:url("../../../static/resPanelControl/addTemplate.png") top center no-repeat;
}
.addTemplate:hover{
    background:url("../../../static/resPanelControl/addTemplate_hover.png") no-repeat;
}
.editTemplate{
    background:url("../../../static/resPanelControl/editTemplate.png") no-repeat;
}
.editTemplate:hover{
    background:url("../../../static/resPanelControl/editTemplate_hover.png") no-repeat;
}
.addTemplate.is-disabled,
.addTemplate.is-disabled:hover{
    background:url("../../../static/resPanelControl/addTemplate_disabled.png") no-repeat;
}
.editTemplate.is-disabled,
.editTemplate.is-disabled:hover{
    background:url("../../../static/resPanelControl/editTemplate_disabled.png") no-repeat;
}
.footer-btn{
	display: flex;
    align-items: center;
    padding-left: 90px;
    margin-top: 20px;
}
</style>