
<template>
  <div>
    <el-dialog :visible.sync="isVisible" title="显示方案管理" width="1100px"
      customClass="schemeManagerPopUp"
      class="custom-dialog" @close="handleClose">
      <div class="content">
        <!-- 左侧的列表 -->
        <div class="groupManagerTable">
          <div>
            <span>全部方案</span>
          </div>
          <el-table
            :data="tableData"
            ref="table"
            highlight-current-row
            tooltip-effect="dark"
            :default-sort="{prop: 'date', order: 'descending'}"
            height="630px"
          >
            <el-table-column label="方案名" prop="schemeName" width="180px" align="center"></el-table-column>
            <el-table-column label="方案类型" align="center">
              <template slot-scope="scope">
                {{ scope.row.schemeType | filterSchemeType }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="100px" label="操作" align="center">
              <template slot-scope="scope">
                <img
                  class="operate"
                  src="../../../static/common/update.png"
                  title="编辑分组"
                  @click="handleClick(scope.row)"
                />
                <img
                  class="operate"
                  src="../../../static/common/delete.png"
                  title="删除分组"
                  @click="sineDelTable(scope.row)"
                />
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
            label-width="100px"
            status-icon
            :show-message=false
          >
            <el-form-item label="方案类型：" prop="schemeType">
              <el-select v-model="form.schemeType" placeholder="请选择方案类型" @change="changeType">
                <el-option label="视频会议" :value="3"></el-option>
                <el-option label="监看轮循（本地）" :value="4"></el-option>
                <el-option label="监看轮循（解码）" :value="5"></el-option>
                <el-option label="视频指挥" :value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方案名称：" prop="schemeName">
              <el-input v-model="form.schemeName" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="分屏模式：" prop="splitType">
              <el-select class="select-bg" :class="showScreen" v-model="form.splitType" placeholder="请选择分屏" @change="changeScreen">
                <el-option label="1分屏" value="OnlyOne"><span class="common-screen one-splite"></span>1分屏</el-option>
                <el-option label="2分屏" value="OnlyTwo"><span class="common-screen two-splite"></span>2分屏</el-option>
                <el-option label="4分屏" value="OnlyFour"><span class="common-screen four-splite"></span>4分屏</el-option>
                <el-option label="6分屏" value="OnlySix"><span class="common-screen six-splite"></span>6分屏</el-option>
                <el-option label="9分屏" value="OnlyNine"><span class="common-screen nine-splite"></span>9分屏</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="屏幕类型：">
              <div class="scheme-type">
                <el-form-item v-show="form.schemeType == '4' || form.schemeType == '5'" prop="FixResourceRule">
                  <el-checkbox class="change-checkbox" v-model="form.FixResourceChecked">固定资源屏</el-checkbox>
                  <el-select v-model="form.FixResource" multiple :disabled="!form.FixResourceChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '3'" prop="ChairmanRule">
                  <el-checkbox class="change-checkbox" v-model="form.ChairmanChecked">主席屏</el-checkbox>
                  <el-select v-model="form.Chairman" :disabled="!form.ChairmanChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '3' || form.schemeType == '6'" prop="LocalRule">
                  <el-checkbox class="change-checkbox" v-model="form.LocalChecked">本地屏</el-checkbox>
                  <el-select v-model="form.Local" :disabled="!form.LocalChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '6'" prop="UpLoopRule">
                  <el-checkbox class="change-checkbox" v-model="form.UpLoopChecked">上级轮循屏</el-checkbox>
                  <el-select class="loop-screen-width" v-model="form.UpLoop" multiple :disabled="!form.UpLoopChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                  <el-input-number :disabled="!form.UpLoopChecked" v-model="form.UpLoopInterval" controls-position="right" :min="10" :max="300"></el-input-number><span class="show-time-unit">秒</span>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '6'" prop="DownLoopRule">
                  <el-checkbox class="change-checkbox" v-model="form.DownLoopChecked">下级轮循屏</el-checkbox>
                  <el-select class="loop-screen-width" v-model="form.DownLoop" multiple :disabled="!form.DownLoopChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                  <el-input-number :disabled="!form.DownLoopChecked" v-model="form.DownLoopInterval" controls-position="right" :min="10" :max="300"></el-input-number><span class="show-time-unit">秒</span>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '3'" prop="SpeakRule">
                  <el-checkbox class="change-checkbox" v-model="form.SpeakChecked">发言屏</el-checkbox>
                  <el-select v-model="form.Speak" :disabled="!form.SpeakChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-show="form.schemeType != '6' || this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" prop="NormalLoopRule">
                  <el-checkbox class="change-checkbox" v-model="form.NormalLoopChecked">轮循屏</el-checkbox>
                  <el-select class="loop-screen-width" v-model="form.NormalLoop" multiple :disabled="!form.NormalLoopChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                  <el-input-number :disabled="!form.NormalLoopChecked" v-model="form.NormalLoopInterval" controls-position="right" :min="10" :max="300"></el-input-number><span class="show-time-unit">秒</span>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '6' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" prop="UpAndDownLoopRule">
                  <el-checkbox class="change-checkbox" v-model="form.UpAndDownLoopChecked">上下级轮循屏</el-checkbox>
                  <el-select class="loop-screen-width" v-model="form.UpAndDownLoop" multiple :disabled="!form.UpAndDownLoopChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                  <el-input-number :disabled="!form.UpAndDownLoopChecked" v-model="form.UpAndDownLoopInterval" controls-position="right" :min="10" :max="300"></el-input-number><span class="show-time-unit">秒</span>
                </el-form-item>

                <el-form-item v-show="form.schemeType == '6' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" prop="LocalBusinessRule">
                  <el-checkbox class="change-checkbox" v-model="form.LocalBusinessChecked">本地业务屏</el-checkbox>
                  <el-select class="loop-screen-width" v-model="form.LocalBusiness" multiple :disabled="!form.LocalBusinessChecked" @change="checkType">
                    <el-option v-for="item in arrType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                  <el-input-number :disabled="!form.LocalBusinessChecked" v-model="form.LocalBusinessInterval" controls-position="right" :min="10" :max="300"></el-input-number><span class="show-time-unit">秒</span>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="addAndUpdate" type="primary" @click="onSubmit('add')">新 增</el-button>
            <el-button v-if="!addAndUpdate" type="primary" @click="onSubmit('update')">编 辑</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </span>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";

export default {
  name: "SchemeManagerDialog",
  data() {
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入方案名称"));
      } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
        callback(
          new Error("方案名称为包含中文、英文字母(大小写)、数字、下划线的组合!")
        );
      } else {
        callback();
      }
    };
    let validateFixResource = (rule, value, callback) => {
      if (this.form.FixResourceChecked && this.form.FixResource.length == 0) {
        callback(new Error("请选择固定资源屏"));
      } else {
        callback();
      }
    };
    let validateChairman = (rule, value, callback) => {
      if (this.form.ChairmanChecked && this.form.Chairman == '') {
        callback(new Error("请选择主席屏"));
      } else {
        callback();
      }
    };
    let validateSpeak = (rule, value, callback) => {
      if (this.form.SpeakChecked && this.form.Speak == '') {
        callback(new Error("请选择发言屏"));
      } else {
        callback();
      }
    };
    let validateNormalLoop = (rule, value, callback) => {
      if (this.form.NormalLoopChecked && this.form.NormalLoop.length == 0) {
        callback(new Error("请选择轮循屏"));
      }else {
        callback();
      }
    };
    let validateUpLoop = (rule, value, callback) => {
      if (this.form.UpLoopChecked && this.form.UpLoop.length == 0) {
        callback(new Error("请选择上级轮循屏"));
      }else {
        callback();
      }
    };
    let validateDownLoop = (rule, value, callback) => {
      if (this.form.DownLoopChecked && this.form.DownLoop.length == 0) {
        callback(new Error("请选择下级轮循屏"));
      }else {
        callback();
      }
    };
    let validateLocal = (rule, value, callback) => {
      if (this.form.LocalChecked && this.form.Local == '') {
        callback(new Error("请选择本地屏"));
      }else {
        callback();
      }
    };
    let validateUpAndDownLoop = (rule, value, callback) => {
      if (this.form.UpAndDownLoopChecked && this.form.UpAndDownLoop.length == 0) {
        callback(new Error("请选择上下级轮循屏"));
      }else {
        callback();
      }
    };
    let validateLocalBusiness = (rule, value, callback) => {
      if (this.form.LocalBusinessChecked && this.form.LocalBusiness.length == 0) {
        callback(new Error("请选择本地业务屏"));
      }else {
        callback();
      }
    };
    return {
      isVisible: false,
      tableData: [],
      labelPosition: "left",
      schemeId: '',
      form: {
        schemeName: "",
        schemeType: 3,
        splitType: "OnlyNine",
        screens: [],
        // 屏幕显示后面的下拉选择默认值
        FixResource: [],
        Chairman: '',
        Speak: '',
        NormalLoop: [],
        Local: '',
        UpLoop: [],
        DownLoop: [],
        UpAndDownLoop:[],
        LocalBusiness:[],

        // 屏幕显示前面的checkbox
        FixResourceChecked: false,
        ChairmanChecked: false,
        SpeakChecked: false,
        NormalLoopChecked: false,
        LocalChecked: false,
        UpLoopChecked: false,
        DownLoopChecked: false,
        UpAndDownLoopChecked:false,
        LocalBusinessChecked:false,

        NormalLoopInterval:10,
        UpLoopInterval: 10,
        DownLoopInterval: 10,
        UpAndDownLoopInterval:10,
        LocalBusinessInterval:10,

      },
      rules: {
        schemeName: [
          { required: true, message: "请输入方案名称", trigger: "blur" },
          {
            min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ],
        splitType: [
          { required: true, message: "请选择分组区域", trigger: "change" }
        ],
        FixResourceRule: [
          { validator: validateFixResource, trigger: "change" }
        ],
        ChairmanRule: [
          { validator: validateChairman, trigger: "change" }
        ],
        SpeakRule: [
          { validator: validateSpeak, trigger: "change" }
        ],
        NormalLoopRule: [
          { validator: validateNormalLoop, trigger: "change" }
        ],
        UpLoopRule: [
          { validator: validateUpLoop, trigger: "change" }
        ],
        DownLoopRule: [
          { validator: validateDownLoop, trigger: "change" }
        ],
        LocalRule: [
          { validator: validateLocal, trigger: "change" }
        ],
        UpAndDownLoopRule: [
          { validator: validateUpAndDownLoop, trigger: "change" }
        ],
        LocalBusinessRule: [
          { validator: validateLocalBusiness, trigger: "change" }
        ],
      },
      showScreen: '', // 选择对应的分屏，默认为空

      arrType: [], // 分屏对应的需要展示的数组 1 2 3 4 。。。
      addAndUpdate: true,
      disableArr: []
    };
  },
  filters: {
    filterSchemeType(type) {
      return Fun.filterForSchemeType(type);
    }
  },
  mounted() {
    this.changeScreen(this.form.splitType)
  },
  methods: {
    // 切换分屏模式
    changeScreen(val) {
      let splitNum = 0; // 统计分屏数量
      if (val === 'OnlyOne') {
        this.showScreen = 'one-screen';
        splitNum = 1
      } else if (val === 'OnlyTwo') {
        this.showScreen = 'two-screen';
        splitNum = 2;
      } else if (val === 'OnlyFour') {
        this.showScreen = 'four-screen';
        splitNum = 4;
      } else if (val === 'OnlySix') {
        this.showScreen = 'six-screen';
        splitNum = 6;
      } else if (val === 'OnlyNine') {
        this.showScreen = 'nine-screen';
        splitNum = 9;
      }
      this.arrType.length = 0
      for (let i=1; i<=splitNum; i++) {
        this.arrType.push({value: i, label: i, disabled: false})
      }

      this.form.FixResourceChecked = false;
      this.form.ChairmanChecked = false;
      this.form.SpeakChecked = false;
      this.form.NormalLoopChecked = false;
      this.form.LocalChecked = false;
      this.form.UpLoopChecked = false
      this.form.DownLoopChecked = false
      this.form.UpAndDownLoopChecked = false;
      this.form.LocalBusinessChecked = false;

        this.form.FixResource =  [];
        this.form.Chairman =  '';
        this.form.Speak =  '';
        this.form.NormalLoop =  [];
        this.form.Local =  '';
        this.form.UpLoop =  [];
        this.form.DownLoop =  [];
        this.form.UpAndDownLoop = [];
        this.form.LocalBusiness = [];

        this.form.NormalLoopInterval = 10;  
        this.form.UpLoopInterval = 10;
        this.form.DownLoopInterval = 10;
        this.form.UpAndDownLoopInterval = 10;
        this.form.LocalBusinessInterval = 10;

    },
    unique(arr) {
      return Array.from(new Set(arr))
    },
    checkType() {
      this.disableArr.length = 0;
      if (this.form.schemeType == '3') {
        if (this.form.Chairman) {
          this.disableArr.push(Number(this.form.Chairman))
        }
        if (this.form.Local) {
          this.disableArr.push(Number(this.form.Local))
        }
        if (this.form.Speak) {
          this.disableArr.push(Number(this.form.Speak))
        }
      } else if(this.form.schemeType == '4' || this.form.schemeType == '5') {
        if (this.form.FixResource) {
          this.disableArr = this.disableArr.concat(this.form.FixResource)
        }
      } else if (this.form.schemeType == '6') {
          if( this.form.Local ){
              this.disableArr = this.disableArr.concat(this.form.Local)
          }
        if (this.form.UpLoop) {
          this.disableArr = this.disableArr.concat(this.form.UpLoop)
        }
        if (this.form.DownLoop) {
          this.disableArr = this.disableArr.concat(this.form.DownLoop)
        }
        if( this.form.UpAndDownLoop ){
            this.disableArr = this.disableArr.concat(this.form.UpAndDownLoop)
        }
        if( this.form.LocalBusiness ){
            this.disableArr = this.disableArr.concat(this.form.LocalBusiness)
        }
      }
      if (this.form.NormalLoop) {
        this.disableArr = this.disableArr.concat(this.form.NormalLoop)
      }
      this.disableArr = this.unique(this.disableArr)
      this.arrType.forEach(item => {
        item.disabled = false;
        this.disableArr.forEach(it => {
          if (item.value == it) {
            item.disabled = true;
          }
        })
      })
      this.arrType.splice(0, 0)
    },
    changeType() {
      this.form.schemeId = ''
      this.addAndUpdate = true;
      this.form.schemeName = '';

      this.form.Chairman = '';
      this.form.Speak = '';
      this.form.Local = '';
      this.form.FixResource.length = 0;
      this.form.FixResource.splice(0, 0);
      this.form.NormalLoop.length = 0;
      this.form.NormalLoop.splice(0, 0);
      this.form.UpLoop.length = 0
      this.form.UpLoop.splice(0, 0)
      this.form.DownLoop.length = 0
      this.form.DownLoop.splice(0, 0)
      this.form.UpAndDownLoop.length = 0
      this.form.UpAndDownLoop.splice(0, 0)
      this.form.LocalBusiness.length = 0
      this.form.LocalBusiness.splice(0, 0)


      this.form.FixResourceChecked = false;
      this.form.ChairmanChecked = false;
      this.form.SpeakChecked = false;
      this.form.NormalLoopChecked = false;
      this.form.LocalChecked = false;
      this.form.UpLoopChecked = false
      this.form.DownLoopChecked = false
      this.form.UpAndDownLoopChecked = false;
      this.form.LocalBusinessChecked = false;

      this.form.NormalLoopInterval = 10
      this.form.UpLoopInterval = 10
      this.form.DownLoopInterval = 10
      this.form.UpAndDownLoopInterval = 10
      this.form.LocalBusinessInterval = 10

      this.arrType.length = 0;
      this.disableArr.length = 0;

      this.changeScreen(this.form.splitType);
    },
    showDialog(type) {
      this.isVisible = true;
      this.$nextTick(() => {
          xtxk.media.setDialogTop('显示方案管理');
        });
      this.form.schemeType = type || Enum.enumSchemeType.GroupMeeting;
      this.getTableData();
      this.changeScreen(this.form.splitType);
    },
    getTableData() {
      this.tableData=[];
      // 请求列表数据 刷新
      this.apiSDK.getAllDisplayScheme(1, 1024, res => {
        res.forEach(item => {
          // 判断是否是默认显示方案
          if (!item.schemeId.includes('_defalut_')) {
            this.tableData.push(item);
          }
        });
      });
    },
    CreatedDataForm() {
      if (this.form.schemeType == 3) {
        if (this.form.ChairmanChecked) {
          this.form.screens.push({screenType: 'Chairman', pos: [this.form.Chairman]})
        }
        if (this.form.LocalChecked) {
          this.form.screens.push({screenType: 'Local', pos: [this.form.Local]})
        }
        if (this.form.SpeakChecked) {
          this.form.screens.push({screenType: 'Speak', pos: [this.form.Speak]})
        }
        if (this.form.NormalLoopChecked) {
          this.form.screens.push({screenType: 'NormalLoop', pos: this.form.NormalLoop, 'looptime': this.form.NormalLoopInterval}) 
        }
      }
      if (this.form.schemeType == 4 || this.form.schemeType == 5) {
        if (this.form.FixResourceChecked) {
          this.form.screens.push({screenType: 'FixResource', pos: this.form.FixResource})
        }
        if (this.form.NormalLoopChecked) {
          this.form.screens.push({screenType: 'NormalLoop', pos: this.form.NormalLoop, 'looptime': this.form.NormalLoopInterval})
        }
      }
      if (this.form.schemeType == 6) {
        if (this.form.LocalChecked) {
          this.form.screens.push({screenType: 'Local', pos: [this.form.Local]})
        }
        if (this.form.UpLoopChecked) {
          this.form.screens.push({screenType: 'UpLoop', pos: this.form.UpLoop, 'looptime': this.form.UpLoopInterval})
        }
        if (this.form.DownLoopChecked) {
          this.form.screens.push({screenType: 'DownLoop', pos: this.form.DownLoop, 'looptime': this.form.DownLoopInterval})
        }
        if (this.form.UpAndDownLoopChecked) {
            this.form.screens.push({screenType: 'UpAndDownLoop', pos: this.form.UpAndDownLoop, 'looptime': this.form.UpAndDownLoopInterval})
        }
        if (this.form.LocalBusinessChecked) {
            this.form.screens.push({screenType: 'LocalBusiness', pos: this.form.LocalBusiness, 'looptime': this.form.LocalBusinessInterval})
        }
      }
    },
    // 提交 type表示对应的提交类型 新增/修改
    onSubmit(type) {
      this.form.screens.length = 0;
      this.CreatedDataForm();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (type === 'add') {
            this.apiSDK.createDisplayScheme(this.form.schemeName,this.form.schemeType, this.form.splitType, this.form.screens, this.form.NormalLoopInterval,  res => {
              if (res.Ret == '0') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
                this.getTableData();
                this.restData();
                this.form.schemeType = 3;
                this.$emit('refreshData');
              } else {
                this.$message({
                  message: '新增失败',
                  type: 'error'
                });
              }
              this.changeScreen(this.form.splitType);
            })
          } else {
            this.apiSDK.saveDisplayScheme(this.schemeId, this.form.schemeType, this.form.schemeName, this.form.splitType, this.form.screens, this.form.NormalLoopInterval, res => {
              if (res.Ret == '0') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.addAndUpdate = true;
                this.getTableData();
                this.restData();
                this.form.schemeType = 3;
                this.$emit('refreshData');
              } else {
                this.$message({
                  message: '保存失败',
                  type: 'error'
                });
              }
              this.changeScreen(this.form.splitType);
            })
          }
        }
      });
    },
    // 点击取消
    handleClose() {
      this.isVisible = false;
      this.restData();
      this.form.schemeType = 3;
      this.addAndUpdate = true;
    },
    // 删除方案
    sineDelTable(data) {
      this.$confirm('是否删除该方案?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.apiSDK.deleteDisplayScheme(data.schemeId, res => {
          if (res.Ret == '0') {
            this.$message({message: '删除成功', type: 'success'});
            this.getTableData();
            this.restData();
            this.form.schemeType = 3;
            this.changeScreen(this.form.splitType)
            this.$emit('refreshData');
          } else {
            this.$message({ message: '删除失败', type: 'error'});
          }
        })
      })
    },
    // 编辑方案
    handleClick(data) {
      this.form.schemeType = 3;
      this.restData();
      this.addAndUpdate = false;
      this.apiSDK.getDisplaySchemeInfoById(data.schemeId, res => {
        let data = res;
        this.schemeId = res.schemeId;
        this.form.schemeName = res.schemeName;
        this.form.schemeType = res.schemeType;
        this.form.splitType = res.splitType;
        this.changeScreen(this.form.splitType)
        res.screens.forEach(item => {
          let name = item.screenType;
          let value;
          if (name === 'NormalLoop' || name === 'FixResource' || name === 'UpLoop' || name === 'DownLoop' || name === 'UpAndDownLoop' || name === 'LocalBusiness') {
            value = item.pos
          } else {
            value = item.pos + ''
          }
          let params = {};
          params[name] = value;
          params[name + 'Checked'] = true;
          params[name + 'Interval'] = item.interval
          this.form = Object.assign({}, this.form, params);
        })
        console.log(JSON.stringify(this.form))
        if (this.form.NormalLoopChecked) {
          this.form.NormalLoop.forEach(item => {
            item = item + ''
          })
          this.form.NormalLoop.splice(0, 0)
        }
        if (this.form.FixResourceChecked) {
          this.form.FixResource.forEach(item => {
            item = item + ''
          })
          this.form.FixResource.splice(0, 0)
        }
        if (this.form.UpLoopChecked) {
          this.form.UpLoop.forEach(item => {
            item = item + ''
          })
          this.form.UpLoop.splice(0, 0)
        }
        if (this.form.DownLoopChecked) {
          this.form.DownLoop.forEach(item => {
            item = item + ''
          })
          this.form.DownLoop.splice(0, 0)
        }
        if( this.form.UpAndDownLoopChecked ){
            this.form.UpAndDownLoop.forEach(item => {
            item = item + ''
          })
          this.form.UpAndDownLoop.splice(0, 0)
        }
        if( this.form.LocalBusinessChecked ){
            this.form.LocalBusiness.forEach(item => {
            item = item + ''
          })
          this.form.LocalBusiness.splice(0, 0)
        }
      })
    },
    restData() {
      this.schemeId = ''
      this.form = {
        schemeName: "",
        splitType: "OnlyNine",
        screens: [],
        FixResource: [],
        Chairman: '',
        Speak: '',
        NormalLoop: [],
        Local: '',
        UpLoop: [],
        DownLoop: [],
        FixResourceChecked: false,
        ChairmanChecked: false,
        SpeakChecked: false,
        NormalLoopChecked: false,
        LocalChecked: false,
        UpLoopChecked: false,
        DownLoopChecked: false,
        UpAndDownLoopChecked : false,
        LocalBusinessChecked : false,

        NormalLoopInterval: 10,
        UpLoopInterval: 10,
        DownLoopInterval: 10,
        UpAndDownLoopInterval:10,
        LocalBusinessInterval:10,
      }
      // this.form.FixResource.splice(0, 0)
      // this.form.NormalLoop.splice(0, 0)
      // this.form.screens.splice(0, 0)
      // this.form.UpLoop.splice(0, 0)
      // this.form.DownLoop.split(0, 0)
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.arrType.length = 0;
      this.disableArr.length = 0;
    }
  }
};
</script>

<style>
.schemeManagerPopUp div.groupTextarea {
  width: 100% !important;
}
.schemeManagerPopUp div.groupTextarea > textarea {
  min-height: 100px !important;
}
.schemeManagerPopUp .groupManagerTable > div:nth-child(1) {
  height: 40px;
  color: #333;
  padding: 0 20px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
}
.schemeManagerPopUp .groupManagerTable > div:nth-child(1) > span:nth-child(1) {
  float: left;
}
.schemeManagerPopUp .groupManagerTable > div:nth-child(1) > span:nth-child(2) {
  float: right;
  margin-top: 12px;
}
.schemeManagerPopUp .groupManagerTable > div:nth-child(1) > img {
  float: right;
}
.schemeManagerPopUp .groupManagerTable thead.is-group th {
  background: #fff;
}
.schemeManagerPopUp .groupManagerTable .el-table th {
  background: #e9f3fa;
  font-weight: 100;
}
.schemeManagerPopUp .groupManagerTable .el-table td,
.schemeManagerPopUp .groupManagerTable .el-table th {
  padding: 0;
  color: #333;
  height: 40px;
  line-height: 40px;
}
.schemeManagerPopUp .groupManagerTable .el-table--border {
  height: 612px !important;
}
.schemeManagerPopUp .groupManagerForm {
  padding-top: 10px;
  box-sizing: border-box;
}
.schemeManagerPopUp .groupManagerForm label.el-form-item__label {
  color: #333;
  text-align: right;
}
.schemeManagerPopUp .dialog-footer .el-button--primary {
  background-color: #66b1ff;
}
</style>

<style scoped>
div.content {
  display: flex;
  color: #ffffff;
  height: 673px;
}

div.content > div {
  width: 681px;
  border: 1px solid #c8cdd5;
}
div.content > div:nth-child(2) {
  margin-left: 20px;
  border: none;
}

span.img {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.operate {
  margin: 0 10px;
  cursor: pointer;
}
.common-screen {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 34px;
  padding: 0 4px;
  background-position: -6px 50%;
  background-size: 32px auto;
}
.one-splite {
  background-image: url(../../../static/main/scheme/one_screen.png);
  background-repeat: no-repeat;
}
.two-splite {
  background-image: url(../../../static/main/scheme/two_screen.png);
  background-repeat: no-repeat;
}
.four-splite {
  background-image: url(../../../static/main/scheme/four_screen.png);
  background-repeat: no-repeat;
}
.six-splite {
  background-image: url(../../../static/main/scheme/six_screen.png);
  background-repeat: no-repeat;
}
.nine-splite {
  background-image: url(../../../static/main/scheme/nine_screen.png);
  background-repeat: no-repeat;
}
.select-bg {
  width: 100%;
}
/deep/.select-bg .el-input .el-input__inner {
  background-position: 0 50%;
  background-size: 30px auto;
  padding-left: 30px;
  background-repeat: no-repeat
}
/deep/.one-screen .el-input .el-input__inner {
  background-image: url(../../../static/main/scheme/one_screen.png);
}
/deep/.two-screen .el-input .el-input__inner {
  background-image: url(../../../static/main/scheme/two_screen.png);
}
/deep/.four-screen .el-input .el-input__inner {
  background-image: url(../../../static/main/scheme/four_screen.png);
}
/deep/.six-screen .el-input .el-input__inner {
  background-image: url(../../../static/main/scheme/six_screen.png);
}
/deep/.nine-screen .el-input .el-input__inner {
  background-image: url(../../../static/main/scheme/nine_screen.png);
}
.scheme-type {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  /* width: 380px; */
}
/deep/.scheme-type .el-select .el-input .el-input__inner {
  width: 290px;
}
/* /deep/.el-input--mini,
.el-select {
  width: 380px;
} */
.show-time-unit {
  color: #666;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
/* 0629 dj */
.show-time-unit{
    margin-left: 3px\0; 
    margin-left: 3px\9;
}
@media all and(min-width:0){
    .show-time-unit{
        margin-left: 3px\9;
    }
}
/deep/.el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: #fff !important;
}
.schemeManagerPopUp .dialog-footer {
  display: inline-block;
  margin-left: 100px;
  margin-top: 20px;
}
.scheme-type .change-checkbox {
  width: 100px;
}
/deep/.scheme-type .loop-screen-width .el-input .el-input__inner {
  width: 190px;
}
/deep/.scheme-type .el-input-number--mini {
  width: 80px;
}
/deep/.scheme-type .el-input-number.is-controls-right .el-input__inner {
  padding-left: 5px;
  padding-right: 40px;
}
/deep/.scheme-type .el-checkbox__label{
  padding-left: 5px;
}
</style>
