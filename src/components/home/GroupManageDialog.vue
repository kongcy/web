<template>
  <div>
    <el-dialog
      :visible.sync="isVisible"
      title="分组管理"
      width="1300px"
      customClass="groupManagerPopUp"
      class="custom-dialog">
      <div class="content">
        <!-- 左侧的列表 -->
        <div class="groupManagerTable">
          <div>
            <span>全部分组</span>
            <!-- <span class="mainDel img" @click="batchRemoveClick()"></span> -->
          </div>
          <el-table :data="tableData" ref="table" border class="custom-table"
            highlight-current-row
            tooltip-effect="dark"
            :default-sort="{prop: 'date', order: 'descending'}"
            height="600px"
          >
            <!-- show-summary -->
            <!-- <el-table-column type="index" width="50" fixed="left"></el-table-column> -->
            <el-table-column label="分组名称" prop="groupName" width="150"></el-table-column>
            <el-table-column label="分组类型" width="180">
              <template slot-scope="scope">
                {{ scope.row.groupType | filterGroupType }}
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="groupDescription" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column label="描述" width="200px">
            <tmplate slot-scope="scope">
              <i class="el-icon-info"></i>
              {{ scope.row.description }}
            </tmplate>
            </el-table-column>-->
            <el-table-column fixed="right" width="100">
              <template slot="header" slot-scope="scope">操 作</template>
              <template slot-scope="scope">
                <img v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6"
                  class="operate"
                  src="../../../static/common/update.png"
                  title="编辑分组"
                  @click="editClick(scope.row)"
                />
                <img v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6"
                  class="operate"
                  src="../../../static/common/delete.png"
                  title="删除分组"
                  @click="removeClick(scope.row)"
                />
                <el-button v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && ( ((scope.row.groupType == 6 || scope.row.groupType == 3 ) && scope.row.isGroupOperator == true) || (scope.row.groupType == 2 || scope.row.groupType == 4 || scope.row.groupType == 5) )" 
                    class="operateEdit01" title="编辑分组" @click="editClick(scope.row)"></el-button>
                <el-button v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && ((scope.row.groupType == 6 || scope.row.groupType == 3 ) && scope.row.isGroupOperator == false)" 
                class="operateEdit01" title="编辑分组" disabled></el-button>
                <el-button v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && ( ((scope.row.groupType == 6 || scope.row.groupType == 3 ) && scope.row.isGroupOperator == true) || (scope.row.groupType == 2 || scope.row.groupType == 4 || scope.row.groupType == 5) )" 
                    class="operateDelete01" title="删除分组" @click="removeClick(scope.row)"></el-button>
                <el-button v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5 && ((scope.row.groupType == 6 || scope.row.groupType == 3 ) && scope.row.isGroupOperator == false)" 
                class="operateDelete01" title="删除分组" disabled></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 右侧的表单 -->
        <div class="groupManagerForm">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            size="mini"
            :label-position="labelPosition"
            label-width="80px"
            style="width: 100%"
            status-icon
            :show-message="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5?true:false"
          >
            <el-form-item label="分组类型">
              <el-select v-model="form.type" placeholder="请选择分组类型" :disabled="!addAndUpdate" @change="groupTypeChange">
                <el-option v-for="item in groupTypeData" :key="item.key" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分组名称" prop="name">
              <el-input v-model="form.name" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="显示方案" v-if="form.type !== enumGroupType.GroupCall">
              <el-select v-model="form.scheme" placeholder="请选择显示方案" @change="schemeChange" clearable>
                <el-option label="默认方案" value="" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6"></el-option>
                <el-option v-for="item in schemeData" :key="item.key" :label="item.schemeName" :value="item.schemeId"></el-option>
              </el-select>
              <el-button type="primary" @click="createScheme()">编 辑</el-button>

              <div class="meetingCodeBox" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 && form.type == enumGroupType.GroupMeeting">
                  会议密码<el-checkbox v-model="isEnableMeetingCode" :disabled="'disabled'"></el-checkbox>
                  <el-input v-model="meetingCodeValue" :disabled="!isEnableMeetingCode" placeholder="会议密码" maxlength="4"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="会议模式" v-if="form.type == enumGroupType.GroupMeeting">
              <el-radio v-model="meetingModeRadio" label="1">常规</el-radio>
              <el-radio v-model="meetingModeRadio" label="2">拼接</el-radio>

              <div class="autoRecordBox" v-if="form.type == enumGroupType.GroupMeeting">
                <span class="autoRecordTitle">自动录像</span>
                <el-radio v-model="autoRecordRadio" label="1" :disabled="meetingModeRadio == '1'">开启</el-radio>
                <el-radio v-model="autoRecordRadio" label="2" :disabled="meetingModeRadio == '1'">关闭</el-radio>
              </div>
            </el-form-item>
            <el-form-item label="描述简介" prop="desc">
              <el-input
                class="groupTextarea"
                type="textarea"
                v-model="form.desc"
                placeholder="字数不超过100"
                maxlength="100"
              ></el-input>
              <span id="descErrorMsg" style="color: #999;text-align:left;">字数不超过100字</span>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in domains"
              :key="index"
              :prop="'domain' + index"
              :label="'新增表单'"
            >
              <el-input v-model="domain.value"></el-input>
            </el-form-item>

            <!-- <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                <el-button @click="resetForm('form')">清空</el-button>
            </el-form-item>-->
          </el-form>
          <!-- 配置资源 -->
            <div class="tree_title">
                <span>配置资源</span>
                <span>
                  选择指定人员与设备
                  <span class="addUserAndDev img" @click="addUserAndDevice"></span>
                </span>
            </div>
            <!-- 选择的用户和设备资源 -->
            <el-row :gutter="20" class="selectTree">
                <el-col :span="24/selectTreeData.length" v-for="item in selectTreeData" :key="item.key">
                  <el-card v-if="item.name === '固定资源'" :class="`card-height${form.type}`">
                    <div class="card-title">
                        {{ item.name }}
                    </div>
                    <div class="card-body">
                        <div v-for="(obj, index) in item.data" :key="obj.key" class="fix-resource">
                            <span class="index">#{{obj.position}}</span>
                            <span>{{obj.name}}</span>
                            <el-button v-if="!obj.id" type="text" icon="el-icon-circle-plus" @click="addFixResources(obj, index)"></el-button>
                            <el-button v-else type="text" icon="el-icon-remove" @click="removeFixResources(obj, index, obj.position)"></el-button>
                        </div>
                    </div>
                  </el-card>
                  <el-card v-else  :class="`card-height${form.type}`">
                    <div class="card-title">
                        {{ item.name }}
                        <span class="lookon_span" v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 && item.name === '用户资源'">旁观</span>
                        <span class="mainDel img" @click="eliminate(item)"></span>
                    </div>
                    <div class="card-body">
                        <el-tree
                            :props="props"
                            :data="item.data"
                            :show-checkbox="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6 && (form.type == enumGroupType.GroupMeeting) && (item.name === '用户资源')"
                            :render-content="renderContent"
                            @node-click="handleNodeClick"
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :draggable="selectTreeData[0].draggable"
                            :allow-drop="allowDrop"
                        >
                          <!--
                            @node-drop="nodeDrop"
                            :props="defaultProps"
                             -->
                        </el-tree>
                    </div>
                  </el-card>
                </el-col>
            </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="addAndUpdate" type="primary" @click="onSubmit('add')">新 增</el-button>
        <el-button v-if="!addAndUpdate" type="primary" @click="onSubmit('update')">编 辑</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <select-resource
      ref="selectResourceDialog"
      v-on:resourceEvent="resourceEventData"
    />
    <scheme-manage-dialog ref="schemeManageDialog" @refreshData="getScheme(form.type)" />
  </div>
</template>

<script>
import SelectResource from "@/components/home/selectRes/SelectResource.vue";
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import Fun from "@/common/fun";
import Enum from "@/common/enum";

export default {
  name: "GroupManagerDialog",
  components: {
    SelectResource,
    SchemeManageDialog,
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入分组名称"));
      } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
        callback(
          new Error("会议名称为包含中文、英文字母(大小写)、数字、下划线的组合!")
        );
      } else {
        callback();
      }
    };
    let validateDesc = (rule, value, callback) => {
      if (value && value.length > 100) {
        document.getElementById("descErrorMsg").style = "color:#F56C6C";
        callback(new Error(" "));
      } else {
        document.getElementById("descErrorMsg").style = "";
        callback();
      }
    };

    return {
      isVisible: false,
      addAndUpdate: true,
      enumGroupType: Enum.enumGroupType,
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      selectTreeData: [
        { name: "用户资源", data: [] },
        { name: "设备资源", data: [] }
      ],
      tableData: [],
      currentRow: null,
      multipleSelection: [],
      filters: [],
      search: "",

      labelPosition: "left",
      domains: [],
      form: {
        name: "",
        type: Enum.enumGroupType.GroupMeeting,
        desc: "",
        scheme: '',
        //isEnableMeetingCode:false,
        //meetingCodeValue:'1234',
        //modeRadio:'1',
        //autoRecord:'2',
      },
      isEnableMeetingCode:false,
      meetingCodeValue:'1234',
      meetingModeRadio: '1',//会议模式
      autoRecordRadio: '2',//自动录像
      // 编辑时 用于保存
      groupId: "",
      rules: {
        name: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        desc: [{ validator: validateDesc, trigger: "blur" }],
        scheme: [{ required: true, message: "请选择显示方案", trigger: "blur" }],
      },
      // 分组类型转换
      groupTypeData: [
        { id: Enum.enumGroupType.GroupMeeting, label: '会议分组', funName: 'Conference', resourceData: [{ name: "用户资源", data: [] }, { name: "设备资源", data: [] }] },
        //{ id: Enum.enumGroupType.GroupPlay, label: '监看分组', funName: 'DB', resourceData: [{ name: "轮循资源", data: [], draggable:true }, { name: "固定资源", data: [] }] },
        { id: Enum.enumGroupType.LocalLoopPlay, label: '监看分组(本地)', funName: 'DB', resourceData: [{ name: "轮循资源", data: [], draggable:true }, { name: "固定资源", data: [] }] },
        { id: Enum.enumGroupType.DecodLoopPlay, label: '监看分组(解码)', funName: 'DB', resourceData: [{ name: "轮循资源", data: [], draggable:true }, { name: "固定资源", data: [] }] },
        { id: Enum.enumGroupType.GroupCall, label: '呼叫分组', funName: 'Call', resourceData: [{ name: "用户资源", data: [] }] },
        { id: Enum.enumGroupType.VideoCommand, label: '视频指挥', funName: 'VideoCommand', resourceData: [{ name: "用户资源", data: [], draggable:true }, { name: "设备资源", data: [] }] },
      ],
      schemeData: [],
      schemeType: '',
      userInfo: xtxk.cache.get("USER"),
    };
  },
  filters: {
    filterGroupType(type) {
      return Fun.filterForGroupType(type);
    }
  },
  mounted() {
  },
  methods: {
    // 显示业务分组弹框选择资源弹框
    showDialog() {
      this.$emit('closeOtherDialog');
      this.isVisible = true;
      this.$nextTick(() => {
        xtxk.media.setDialogTop('分组管理');
      });
      this.empty();
      this.getTableData();
      // 获取显示方案
      this.getScheme(this.form.type);
    },
    // 清空数据
    empty() {
      if(this.selectTreeData[0]) this.selectTreeData[0].data = [];
      if(this.selectTreeData[1]) this.selectTreeData[1].data = [];
      this.addAndUpdate = true;
      this.form = {
        name: "",
        //type: Enum.enumGroupType.GroupMeeting,
        type: this.form.type,
        desc: "",
        scheme: '',
      }
      this.isEnableMeetingCode = false;
      this.meetingModeRadio = '1';
      this.autoRecordRadio = '2';
    },
    getTableData() {
      // 请求列表数据 刷新
      let groupType = "";//查所有
      this.apiSDK.getAllGroupInfo(groupType, 1, 1024, res => {
        this.tableData = res.rows; 
      });
    },
    // 单个删除
    removeClick(row) {
      //const groupIds = [row.groupId];
      this.$confirm('是否删除该分组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        //modalFade: false
      }).then(() => {
        this.deleteTableData(row);
      });
    },
    // 全部删除
    batchRemoveClick() {
      const groupIds = this.tableData.map(item => item.groupId);
      this.deleteTableData(groupIds);
    },
    // 点击选择数据弹框出现
    addUserAndDevice() {
      this.$refs.selectResourceDialog.showDialog(Enum.enumSubscribeType.group);
    },
    // 从选择资源组件传出
    resourceEventData(resourceEvent) {
        if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
            if (this.form.type == this.enumGroupType.GroupCall){
                let isHasDevice = false;
                resourceEvent.forEach(array =>{
                    array.forEach(item => {
                        if( item.resourceType == 1 ){
                            isHasDevice = true;
                        }
                    })
                })
                if( isHasDevice  === true){
                    this.$notify({
                        title: '提示',
                        message: '呼叫分组只能选择用户，不能选择设备！',
                        position: 'bottom-right',
                        type: 'warning',
                    });
                }

                // 不能选择自己
                var personArr = resourceEvent[0];
                if( personArr.length == 1 && personArr[0].id == this.userInfo.userId ){
                    this.$notify({
                        title: '提示',
                        message: '呼叫分组不能选择自己！',
                        position: 'bottom-right',
                        type: 'warning',
                    });
                    return;
                }
            }
        }
      
        let userIds = this.selectTreeData[0].data.length && this.selectTreeData[0].data.map(item => item.id );
        let deviceIds = this.selectTreeData[1] && this.selectTreeData[1].data.length && this.selectTreeData[1].data.map(item => item.id );
        if (this.form.type == this.enumGroupType.GroupPlay || this.form.type == this.enumGroupType.LocalLoopPlay || this.form.type == this.enumGroupType.DecodLoopPlay) {
            resourceEvent.forEach(array => {
                array.forEach(item => {
                    if( !userIds || userIds.indexOf(item.id) === -1 ) {
                        this.selectTreeData[0].data.push(item);
                    }
                });
                // this.selectTreeData[0].data = this.selectTreeData[0].data.concat(item);
            });
        } else {
            this.selectTreeData.forEach((item, index) => {
                switch (index) {
                case 0:
                    if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6){
                        resourceEvent[index].forEach(items => {
                            if( !userIds || userIds.indexOf(items.id) === -1 ) {
                                item.data.push( items );
                            }
                        });
                    }
                    if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
                        if (this.form.type == this.enumGroupType.GroupCall){
                            resourceEvent[index].forEach(items => {
                                if( (!userIds || userIds.indexOf(items.id) === -1) && items.id != this.userInfo.userId ) {
                                    item.data.push( items );
                                }
                            });
                        }else{
                            resourceEvent[index].forEach(items => {
                                if( !userIds || userIds.indexOf(items.id) === -1 ) {
                                    item.data.push( items );
                                }
                            });
                        }
                    }
                    break;
                case 1:
                    // zld 6.0将选择的设备进行屏蔽
                    if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) break;
                    resourceEvent[index].forEach(items => {
                        if( !deviceIds || deviceIds.indexOf(items.id) === -1 ) {
                            item.data.push( items );
                        }
                    });
                    break;
                }
            });
        }
    },
    // 清除已经选择的用户和设备
    eliminate(event) {
      switch (event.name) {
        case "用户资源":
          this.selectTreeData[0].data = [];
          break;
        case "设备资源":
          this.selectTreeData[1].data = [];
          break;
      }
    },
    // 点击取消时 触发
    handleClose() {
      // this.empty();
      this.isVisible = false;
    },
    // 节点拖拽
    nodeDrop(before, after, inner) {
        let treeData = this.selectTreeData[0].data;
        if (inner === 'inner') {
            // this.selectTreeData[0].data = treeData;
            this.$set(this.selectTreeData[0].data)
        } else {
            let beforeData = before.data;
            let afterData = after.data;
            let beforeIndex = treeData.findIndex(d => d.id == beforeData.id);
            let afterIndex = treeData.findIndex(d => d.id == afterData.id);

            treeData.splice(afterIndex, 1 , afterData);
            treeData.splice(beforeIndex, 1 , beforeData);
            this.selectTreeData[0].data = treeData;
        };
    },
    deleteTableData(row) {
      // 删除列表数据
      let typeObj = this.groupTypeData.find(item => item.id == row.groupType);
      if(typeObj) this['del' + typeObj.funName](row);
      this.empty();
    },
    // 编辑
    editClick(row) {
        this.addAndUpdate = false;
        this.groupId = row.groupId;

        let typeObj = this.groupTypeData.find(item => item.id == row.groupType);
        // this.selectTreeData = typeObj.resourceData.concat();
        if(this.form.type != row.groupType) this.getScheme(row.groupType);
        if(typeObj) this['get' + typeObj.funName](row);
    },
    // 分组类型下拉选择
    groupTypeChange(groupType) {
        this.form.name = '';
        this.form.desc = '';
        this.form.scheme = '';
        this.addAndUpdate = true;
        let typeObj = this.groupTypeData.find(item => item.id == groupType);
        this.selectTreeData = typeObj.resourceData;
        if(this.selectTreeData[0]) this.selectTreeData[0].data = [];
        if(this.selectTreeData[1]) this.selectTreeData[1].data = [];
        // 获取轮循点播方案
        this.getScheme(groupType);
    },
    // 拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data && this.form.type !== this.enumGroupType.VideoCommand ) {
            return type !== 'inner';
        } else {
            return true;
        }
    },
    // 新建显示方案
    createScheme() {
        // this.isVisible = false;
        this.$refs.schemeManageDialog.showDialog(this.form.type);
    },
    // 获取显示方案
    getScheme(groupType) {
        this.schemeData = [];
        if(groupType !== this.enumGroupType.GroupCall) {
           this.apiSDK.getDisplaySchemeBySchemeType(groupType, 1, 1024, res => {
              this.schemeData = res;
              // 显示方案数据发生变化，选择值，固定资源清空
              this.form.scheme = '';
              this.selectTreeData[1].data = [];
          });
        }
    },
    // 显示方案下拉选择
    schemeChange(schemeId) {
        if(this.form.type == this.enumGroupType.GroupPlay || this.form.type == this.enumGroupType.LocalLoopPlay || this.form.type == this.enumGroupType.DecodLoopPlay){
            let fixresources=this.selectTreeData[1].data
            fixresources.forEach(item =>{
                if(item.id && item.id.length>0){
                    var it={}
                    it.id= item.id
                    it.name= item.name
                    it.resCh= item.resCh
                    it.resourceType= item.resourceType
                    it.nodeStatus = item.resourceType == 0 ? 'person_online' : 'device_online';
                    this.selectTreeData[0].data.push(it);
                }
            });
            this.selectTreeData[1].data = [];
            this.apiSDK.getDisplaySchemeInfoById(schemeId, res => {
                let data = []
                res.screens.forEach(item => {
                    if (item.screenType == Enum.enumScreenType.FixResource) {
                        item.pos.forEach(item => {
                            data.push({ id:'', resCh: '', name: '', resourceType:'', position: item });
                        })
                    }
                });
                this.selectTreeData[1].data = data;
                this.schemeType = res.schemeType;
            });
        }
    },
    // 提交表单 新增和编辑
    onSubmit(formName) {
        this.$refs['form'].validate((valid) => {
          if(valid){
            let devices = this.selectTreeData[1] && this.selectTreeData[1].data ? this.selectTreeData[1].data : [];
            let data = [...this.selectTreeData[0].data, ...devices];
            if (!data.length) {
                this.$message({ message: "请至少选择一名成员", type: "warning" });
                return;
            }
            let typeObj = this.groupTypeData.find(item => item.id == this.form.type);
            if(typeObj) this[formName + typeObj.funName]();
          }
        });
    },
    // 删除视频会议
    delConference(row) {
        this.apiSDK.delPresetConferenceGroup(row.groupId, (obj) => {
            if (obj.Ret == "0") {
              this.getTableData();
            } else {
                var msg1="删除失败"
                if(obj.Msg) msg1="删除失败:"+obj.Msg
              this.$message({
                message: msg1,
                type: "warning"
              });
            }
        });
    },
    // 根据id查询视频会议
    getConference(row) {
        this.apiSDK.getMeetingGroupInfoByGroupId(row.groupId, (data) => {
            // console.log(data)
            this.groupId = data.groupId;
            this.form = {
                name: data.groupName,
                type: Enum.enumGroupType.GroupMeeting,
                scheme: data.schemeId || '',
                desc: data.description || '',
            };
            this.isEnableMeetingCode = data.isEnableMeetingCode;
            this.meetingCodeValue = data.password;
            this.meetingModeRadio = data.meetingMode ? '2':'1';
            this.autoRecordRadio = data.isAutoRecord ? '1':'2';

            let person = [];
            let devices = [];
            person = data.users.map(item => {
              let nodeStatus = "person_online";
              if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                nodeStatus = "hwMeeting_online"
              return { id: item.userId, name: item.userName, nodeStatus: nodeStatus}
            });
            //旁观选中
            let checkedUserNodes = [];
            data.users.forEach((item)=>{
                if( item.isSpectator == true ){
                    checkedUserNodes.push(item.userId);
                }
            });
            this.$refs.tree[0].setCheckedKeys(checkedUserNodes);

            devices = data.devices.map(item => {
                return { id: item.deviceId, name: item.deviceName, nodeStatus: "device_online"};
            });
            this.selectTreeData = [
                { name: "用户资源", data: person },
                { name: "设备资源", data: devices }
            ];
        });
    },
    // 新增视频会议
    addConference() {
        let that = this
        let checkedUserNodes = this.$refs.tree[0].getCheckedNodes();
        // console.log(JSON.stringify(checkedUserNodes));
        const userTree = this.selectTreeData[0].data.map((item, index) => {
            return { index: index, userId: item.id, isSpectator:false};
        });
        for( let i=0;i<userTree.length;i++ ){
            for( let k=0;k<checkedUserNodes.length;k++ ){
                if( userTree[i].userId == checkedUserNodes[k].id ){
                    userTree[i].isSpectator = true;
                }
            }
        }
        // console.log(JSON.stringify(userTree));
        const devicesTree = this.selectTreeData[1].data.map((item, index) => {
            return { index: index, deviceId: item.id, deviceCh:item.resCh };
        });
        // console.log(JSON.stringify(devicesTree));
        let meetingMode;
        if( this.meetingModeRadio == '1' ){
            meetingMode = false;
        }else if( this.meetingModeRadio == '2' ){
            meetingMode = true;
        }
        let isAutoRecord;
        if( this.autoRecordRadio == '1' ){
            isAutoRecord = true;
        }else if( this.autoRecordRadio == '2' ){
            isAutoRecord = false;
        }
        this.apiSDK.createConferenceGroupNew(
            this.form.name,
            this.form.desc,
            this.form.scheme,
            this.isEnableMeetingCode,
            this.meetingCodeValue,
            meetingMode,
            isAutoRecord,
            userTree,
            devicesTree,
            function(obj) {
            if (obj && obj.Ret == "0") {
              that.$message({
                message: "新增成功",
                type: "success"
              });
              // that.isVisible = false;
              that.resetForm("form");
              that.empty();
              that.getTableData();
            } else {
                var msg1="新增失败"
                if(obj.Msg) msg1="新增失败:"+obj.Msg
              that.$message({

                message: msg1,
                type: "warning"
              });
            }
          }
        );
    },
    // 更新视频会议
    updateConference() {
        let that = this
        let checkedUserNodes = this.$refs.tree[0].getCheckedNodes();
        // console.log(JSON.stringify(checkedUserNodes));
        const userTree = this.selectTreeData[0].data.map((item, index) => {
            return { index: index, userId: item.id, isSpectator:false};
        });
        for( let i=0;i<userTree.length;i++ ){
            for( let k=0;k<checkedUserNodes.length;k++ ){
                if( userTree[i].userId == checkedUserNodes[k].id ){
                    userTree[i].isSpectator = true;
                }
            }
        }
        // console.log(JSON.stringify(userTree));
        const devicesTree = this.selectTreeData[1].data.map((item, index) => {
            return { index: index, deviceId: item.id, deviceCh:item.resCh};
        });
        // console.log(JSON.stringify(devicesTree));
        let meetingMode;
        if( this.meetingModeRadio == '1' ){
            meetingMode = false;
        }else if( this.meetingModeRadio == '2' ){
            meetingMode = true;
        }
        let isAutoRecord;
        if( this.autoRecordRadio == '1' ){
            isAutoRecord = true;
        }else if( this.autoRecordRadio == '2' ){
            isAutoRecord = false;
        }

        this.apiSDK.modifyPresetConferenceGroupNew(
          this.groupId,
          this.form.name,
          this.form.desc,
          this.form.scheme,
          this.isEnableMeetingCode,
          this.meetingCodeValue,
          meetingMode,
          isAutoRecord,
          userTree,
          devicesTree,
          function(obj) {
            if (obj && obj.Ret == "0") {
              that.$message({
                message: "编辑成功",
                type: "success"
              });
              // that.isVisible = false;
              that.resetForm("form");
              that.empty();
              that.getTableData();
              that.addAndUpdate = true;
            } else {
                var msg1="编辑失败"
                if(obj.Msg) msg1="编辑失败:"+obj.Msg
              that.$message({

                message: msg1,
                type: "warning"
              });
            }
          }
        );
    },
    // 删除呼叫分组
    delCall(row) {
        this.apiSDK.delCallGroup(row.groupId, res => {
            if (res.Ret == "0") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getTableData();
            } else {
                this.$message({
                    message: "删除失败",
                    type: "warning"
                });
            }
        })
    },
    // 根据id查询呼叫分组
    getCall(row) {
        this.apiSDK.getResourcesByGroupId(row.groupId, res => {
            this.form = {
                name: res.groupName,
                type: Enum.enumGroupType.GroupCall,
                desc: res.description || ''
            };
            this.selectTreeData = [{
                name: "用户资源",
                data: res.resources.map(item => {
                  let nodeStatus = 'person_online';
                  if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                    nodeStatus = "hwMeeting_online"
                  return { id: item.resID, name: item.resName, nodeStatus: nodeStatus}
                })
            },];
        })
    },
    // 创建呼叫分组
    addCall() {
        const members = this.selectTreeData[0].data.map((item, index) => {
            return { resId: item.id, resName: item.name };
        });
        this.apiSDK.addCallGroup(this.form.name, this.form.desc, members, res => {
            if (res && res.Ret == "0") {
                this.$message({
                    message: "新增成功",
                    type: "success"
                });
                this.resetForm("form");
                this.empty();
                this.getTableData();
            } else {
                this.$message({
                    message: "新增失败",
                    type: "warning"
                });
            }
        })
    },
    // 更新呼叫分组
    updateCall() {
        const members = this.selectTreeData[0].data.map((item, index) => {
            return { resId: item.id, resName: item.name };
        });
        this.apiSDK.updateCallGroup(this.groupId, this.form.name, this.form.desc, members, res => {
            if (res && res.Ret == "0") {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.resetForm("form");
                this.empty();
                this.getTableData();
                this.addAndUpdate = true;
            } else {
                this.$message({
                    message: "编辑失败",
                    type: "warning"
                });
            }
        })
    },
    // 根据id查询点播分组
    getDB(row) {
        var self=this;
        let isMatrixLoop = row.groupType === Enum.enumGroupType.DecodLoopPlay ? true : false;

        this.apiSDK.getDBGroupInfoById(row.groupId, isMatrixLoop, res => {
          this.form = {
                name: res.groupName,
                type: res.groupType,
                scheme: res.schemeId,
                desc: res.description || ''
            };
            let loopRersources = res.loopRersources && res.loopRersources.map(item => {
                let nodeStatus = item.resourceType == 0 ? 'person_online' : 'device_online';
                if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                  nodeStatus = "hwMeeting_online"
                return { id: item.resourceId, name: item.resourceName, resCh: item.resourceCh, resourceType: item.resourceType, nodeStatus: nodeStatus };
            });
            let fixResources = res.fixResources && res.fixResources.map(item => {
                let nodeStatus = item.resourceType == 0 ? 'person_online' : 'device_online';
                if(item.deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                  nodeStatus = "hwMeeting_online"
                return { id: item.resourceId, name: item.resourceName, resCh: item.resourceCh, resourceType: item.resourceType, nodeStatus: nodeStatus, position: item.pos };
            });
            this.selectTreeData = [
                { name: "轮循资源", data: loopRersources, draggable:true }, { name: "固定资源", data: fixResources }
            ];

            if(res.schemeId){
              //判断显示方案是否存在
              let ind_sc = this.schemeData.findIndex(item => item.schemeId == res.schemeId);
              if(ind_sc == -1){//不存在，将固定资源移到轮循里，方案为默认
                this.$message({
                    message: "原方案不存在，转为默认方案",
                    type: "warning"
                });
                this.selectTreeData[0].data.push.apply(this.selectTreeData[0].data, this.selectTreeData[1].data);
                this.selectTreeData[1].data = [];
                this.form.scheme = "";
              }else{
                this.apiSDK.getDisplaySchemeInfoById(res.schemeId, res => {
                  res.screens.forEach(item => {
                      if (item.screenType == Enum.enumScreenType.FixResource) {
                          item.pos.forEach(item => {
                            let ind = this.selectTreeData[1].data.findIndex(item2 => item2.position == item);
                            if(ind == -1) this.selectTreeData[1].data.push({ id:'', resCh: '', name: '', resourceType:'', position: item });
                          })
                      }
                  });
                });
              }
            }
        });
    },
    // 删除分组点播轮循
    delDB(row) {
        let isMatrixLoop = row.groupType == Enum.enumGroupType.DecodLoopPlay
        this.apiSDK.deleteDBGroup(row.groupId, isMatrixLoop, res => {
            if (res.Ret == "0") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getTableData();
            } else {
                this.$message({
                    message: "删除失败",
                    type: "warning"
                });
            }
        });
    },
    // 创建分组点播轮循
    addDB() {
        let fixResources = this.selectTreeData[1].data;
        let loopResources = this.selectTreeData[0].data;
        var fixed=[];
        var loop=[];
        fixResources.forEach(item =>{
          if(item.id && item.id.length>0){
            var it={}
            it.resourceId= item.id
            it.resourceName= item.name
            it.resourceCh= item.resCh
            it.resourceType= item.resourceType
            it.position =item.position
            fixed.push(it)
          }
        });
        loopResources.forEach(item =>{
          if(item.id && item.id.length>0){
            var it={}
            it.resourceId= item.id
            it.resourceName= item.name
            it.resourceCh= item.resCh
            it.resourceType= item.resourceType
            loop.push(it)
          }
        });

        let schemeId = this.form.scheme;

        let isMatrixLoop = this.form.type == Enum.enumGroupType.DecodLoopPlay ? true : false;
        this.apiSDK.addDBGroup(this.form.name, this.form.desc, schemeId, fixed, loop, isMatrixLoop, res => {
            if (res && res.Ret == "0") {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.resetForm("form");
                this.empty();
                this.getTableData();
            } else {
                this.$message({
                    message: "新增失败",
                    type: "warning"
                });
            }
        });
    },
    // 修改分组点播轮循
    updateDB() {
        let fixResources = this.selectTreeData[1].data;
        let loopResources = this.selectTreeData[0].data;
        var fixed=[];
        var loop=[];
        fixResources && fixResources.forEach(item =>{
          if(item.id && item.id.length>0){
            var it={}
            it.resourceId= item.id
            it.resourceName= item.name
            it.resourceCh= item.resCh
            it.resourceType= item.resourceType
            it.position =item.position
            fixed.push(it)
          }
        });
        loopResources && loopResources.forEach(item =>{
          if(item.id && item.id.length>0){
            var it={}
            it.resourceId= item.id
            it.resourceName= item.name
            it.resourceCh= item.resCh
            it.resourceType= item.resourceType
            loop.push(it)
          }
        });
        let schemeId = this.form.scheme;
        let isMatrixLoop = this.form.type == Enum.enumSchemeType.DecodLoopPlay ? true : false;
        this.apiSDK.saveDBGroup(this.groupId, this.form.name, schemeId, this.form.desc, fixed, loop, isMatrixLoop, res => {
            if (res && res.Ret == "0") {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.resetForm("form");
                this.empty();
                this.getTableData();
                this.addAndUpdate = true;
            } else {
                this.$message({
                    message: "编辑失败",
                    type: "warning"
                });
            }
        });
    },
    // 根据id查询视频指挥
    getVideoCommand(row) {
      this.apiSDK.getCommandGroupById(row.groupId, res => {
        this.form = {
          name: res.groupName,
          type: this.enumGroupType.VideoCommand,
          scheme: res.schemeId,
          desc: res.description
        }
        this.selectTreeData = [
            {
              name: "用户资源",
              draggable:true,
              data: res.users.map(item => {
                  return { id: item.resourceId, name: item.resourceName, nodeStatus: 'person_online', parentId: item.parentId, parentName: item.parentName}
                })
            },
            {
              name: "设备资源",
              data: res.resource.map(item => {
                  return { id: item.resourceId, name: item.resourceName, nodeStatus: 'device_online'}
                })
            }
        ];
        let data = this.selectTreeData[0].data;
        // console.log(data);
        this.selectTreeData[0].data = this.composeTree(this.selectTreeData[0].data);
        // console.log(aa);
        });
    },
    // 删除视频指挥分组
    delVideoCommand(row) {
      this.apiSDK.deleteCommandGroup(row.groupId, res => {
        if (res.Ret == "0") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getTableData();
        } else {
            this.$message({
                message: "删除失败",
                type: "error"
            });
        }
      });
    },
    // 创建视频指挥分组
    addVideoCommand() {
      const tree_users = Fun.transformTreeToArray(this.selectTreeData[0].data);
      const users = tree_users.map((item, index) => {
          return {
                userId: item.id,
                parentId: item.parentId,
            };
      });
      const devices = this.selectTreeData[1].data.map((item, index) => {
          return {
              deviceId: item.id,
              deviceCh: 0
            };
      });
      this.apiSDK.addCommandGroup(this.form.name, this.form.desc, this.form.scheme, users, devices, res => {
          if (res && res.Ret == "0") {
              this.$message({
                  message: "新增成功",
                  type: "success"
              });
              this.resetForm("form");
              this.empty();
              this.getTableData();
          } else {
              this.$message({
                  message: "新增失败",
                  type: "error"
              });
          }
      });
    },
    // 修改视频指挥分组
    updateVideoCommand() {
        const tree_users = Fun.transformTreeToArray(this.selectTreeData[0].data);
        const users = tree_users.map((item, index) => {
            return {
                  userId: item.id,
                  parentId: item.parentId,
              };
        });
        const devices = this.selectTreeData[1].data.map((item, index) => {
              return {
                  deviceId: item.id,
                  deviceCh: 0
                };
        });
        this.apiSDK.saveCommandGroup(this.groupId,this.form.name, this.form.desc, this.form.scheme, users, devices, res => {
          if (res && res.Ret == "0") {
              this.$message({
                  message: "编辑成功",
                  type: "success"
              });
              this.resetForm("form");
              this.empty();
              this.getTableData();
          } else {
              this.$message({
                  message: "编辑失败",
                  type: "error"
              });
          }
      });
    },
    composeTree(list, pid) {
        if(pid == undefined) pid = '';
        let tree = [];
        let temp;
        list.length && list.forEach((item, index) => {
            if (item.parentId ===  pid) {
                let obj = item;
                temp = this.composeTree(list, item.id);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        });
        return tree;
    },
    // 添加固定资源
    addFixResources(item, index) {
        let selectNode = this.$refs.tree[0].getCurrentNode();
        let nodeInd = -1;
        if(selectNode) nodeInd = this.selectTreeData[0].data.findIndex(d => d.id == selectNode.id);
        if (!selectNode || nodeInd == -1) {
            this.$message({
                message: "请选择一条轮循资源",
                type: "warning"
            })
        } else {
            let loopIndex = this.selectTreeData[0].data.findIndex(d => d.id == selectNode.id);
            this.selectTreeData[1].data[index] = Object.assign(item, selectNode);

            this.selectTreeData[0].data.splice(loopIndex, 1);
            if (this.selectTreeData[0].data.length) {
                this.$refs.tree[0].setCurrentNode(this.selectTreeData[0].data[0]);
            }
        }
    },
    // 删除固定资源
    removeFixResources(item, index, position) {
        this.selectTreeData[1].data[index] = { id:'', resCh: '', name: '', resourceType:'', position: position };
        delete item.position;
        this.selectTreeData[0].data.push(item);
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    // 单条删除
    remveClick(node, data) {
        this.$refs.tree[0].setCurrentKey(null);
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id == data.id);
        children.splice(index, 1);

        if( data.nodeStatus.indexOf('person') > -1 ){
          let node_ = this.$refs.tree[0].getNode(data);
          this.$refs.tree[0].remove(node_);
        }else{
          let node_ = this.$refs.tree[1].getNode(data);
          this.$refs.tree[1].remove(node_);
        }
        this.$refs.tree[0].setCurrentKey(null);
    },
    // 树行样式(用户)
    renderContent(h, { node, data, store }) {
      return (
        <span class={"custom-tree-node " + data.nodeStatus}>
          <span class="node-icon"></span>
          <span title={node.label}>{node.label}</span>
          <el-button class="delete-btn" type="text" on-click={ () => this.remveClick(node, data) }></el-button>
        </span>
      );
    },
    handleNodeClick(data, node, tree){
      if( data.nodeStatus != 'department' ) {
        node.checked = !node.checked;
      }
    }
  }
};
</script>

<style scoped>
.custom-dialog .content {
  display: flex;
}
.custom-dialog .content .groupManagerTable{
  width: 618px
}
.custom-dialog .content > div:nth-child(2) {
  margin-left: 20px;
}

.custom-dialog .groupManagerTable > div:nth-child(1) {
  height: 38px;
  padding: 0 20px;
  line-height: 38px;
  border: 1px solid #c8cdd5;
  border-bottom: none;
}
.custom-dialog .groupManagerTable > div:nth-child(1) > span:nth-child(1) {
  float: left;
}
.custom-dialog .groupManagerTable > div:nth-child(1) > span:nth-child(2) {
  float: right;
  margin-top: 12px;
}
.custom-dialog .groupManagerTable > div:nth-child(1) > img {
  float: right;
}
.custom-dialog .groupManagerTable thead.is-group th {
  background: #294a74;
}
.fix-resource{
  margin: 10px;
  border: 1px solid #ddd;
  background-color: #fcfcfc;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
}
.fix-resource .index{
  display: inline-block;
  width: 30px;
  border-right: 1px solid #ddd;
  text-align: center;
}
.fix-resource /deep/ .el-button{
  float: right;
  padding: 0;
  margin: 7px 5px 0 0;
}
.groupManagerForm{
    width: calc(100% - 638px);
}
/deep/ .custom-dialog .groupManagerTable .el-table th {
  background: #e9f3fa;
  text-align: center;
  padding: 0;
}
/deep/ .custom-dialog .groupManagerTable .el-table tr td{
  text-align: center;
}
/deep/ .groupManagerPopUp .groupManagerForm label.el-form-item__label {
  text-align: right;
}
/deep/ .el-textarea__inner{
  height: 46px;
}
.card-height3 .card-body{
    /* height: 276px; */
}
.card-height6 .card-body,
.card-height5 .card-body,
.card-height4 .card-body{
    /* height: 320px; */
}
.card-height2 .card-body{
    /* height: 367px; */
}
.card-title {
    position: relative;
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    background: #e9f3fa;
}
.card-body{
    border-top: 1px solid #c2dff3;
    overflow: auto;
}
.tree_title {
    width:100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  line-height: 40px;
  padding: 0 20px;
  box-sizing: border-box;
  color: #0f5794;
  border: 1px solid #c2dff3;
  font-size: 14px;
}
.tree_title > span:nth-child(1) {
  float: left;
}
.tree_title > span:nth-child(2) {
  float: right;
}
.tree_title > span:nth-child(2) > img {
  margin: 7px 10px;
  float: right;
  cursor: pointer;
}
.selectTree {
    width:100%;
  margin-top: 10px;
  margin-left: 0!important;
  margin-right: 0!important;
}
.selectTree .el-col-24{
    padding:0!important;
}
.selectTree .el-col-12{
    width:49%;
    padding:0!important;
}
.selectTree > div:nth-child(1){
    margin-right:2%;
}
.selectTree .img {
  position: absolute;
  top: 15px;
  right: 20px;
}
/deep/.selectTree .el-tree-node__content{
    position: relative;
}
/deep/.selectTree .el-tree-node__content .el-checkbox{
    position: absolute;
    right:60px;
    top:4px;
}
/deep/.selectTree .custom-tree-node span{
    display: inline-block;
    max-width: 154px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

span.img {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
span.mainDel {
  background: url(../../../static/common/minusSign.png)
    no-repeat;
}
span.mainDel:hover {
  background: url(../../../static/common/minusSign_avtive.png)
    no-repeat;
}
.lookon_span{
    position: absolute;
    top: 15px;
    right: 55px;
    display: inline-block;
    width: 34px;
    height: 16px;
    line-height: 16px;
}
span.addUserAndDev {
  float: right;
  margin-top: 13px;
  margin-left: 10px;
  background: url(../../../static/common/add.png) no-repeat;
}
span.addUserAndDev {
  background: url(../../../static/common/add_avtive.png)
    no-repeat;
}
.operate {
  margin: 0 10px;
  cursor: pointer;
}

.el-table .operateEdit01{
    width:14px;
    height: 14px;
    background: url(../../../static/common/update.png) center center no-repeat;
    padding: 0;
    margin: 0 10px;
    border-style: none;
}
.el-table .operateDelete01{
    width:14px;
    height: 14px;
    background: url(../../../static/common/delete.png) center center no-repeat;
    padding: 0;
    margin: 0;
    border-style: none;
}

.groupManagerForm /deep/ .el-tree-node__content{
    position: relative;
}
.groupManagerForm /deep/ .el-tree-node__content .delete-btn{
    position: absolute;
    right: 21px;
    top: 6px;
    width: 14px;
    height: 14px;
    border: 0;
    background: url(../../../static/common/delete.png) 0 0 no-repeat;
}
.groupManagerForm /deep/ .el-tree-node__content .checkbox_btn{
    position: absolute;
    right: 70px;
    top: 6px;
    width: 14px;
    height: 14px;
    border: 0;
}
.meetingCodeBox{
  display: inline-block;
  width:234px;
  float: right;
}
.meetingCodeBox .el-checkbox{
  margin-left: 10px;
}
/deep/.meetingCodeBox .el-checkbox__label{
  padding-left: 6px;
}
.meetingCodeBox .el-input{
  width: 80px;
  margin-left: 5px;
}
.autoRecordBox{
    display: inline-block;
    width:234px;
    float: right;
}
.autoRecordBox .autoRecordTitle{
    display: inline-block;
    margin-right: 10px;
}
</style>
