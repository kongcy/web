<template >
  <div>
    <el-popover
      popper-class="custom-popover"
      width="780"
      :offset="30"
      placement="right-end"
      ref="trainning"
      title="业务场景"
      trigger="click"
      @show="showDialog"
      v-model="visible"
    >
      <el-button type="text" class="btn-close" icon="el-icon-close" @click="closeDialog"></el-button>

          <el-table border :data="sceneTableData" class="custom-table"  @row-dblclick="handleDBClick" height="450">
            <el-table-column label="场景名称" prop="sceneName"></el-table-column>
            <el-table-column label="场景类型" prop="sceneType" width="100"  :formatter="getSceneLabel"></el-table-column>
            <el-table-column label="激活状态" width="100">
              <template slot-scope="scope">
                <el-switch :disabled="scope.row.isActived" @change="changeActive(scope.row)" v-model="scope.row.isActived" active-color="#128BF1" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="显示方案" prop="name" width="190">
              <template slot-scope="scope">
                <el-select v-model="scope.row.schemeId" @change="(val) => { handleChange(scope.row, val) }">
                  <!-- <el-option :label="" :value=""></el-option> -->
                  <el-option v-for="(item) in scope.row.schemeList" :key="item.key" :label="item.schemeName" :value="item.schemeId"></el-option>

                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="开启者" prop="masterName" width="100"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                 <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

    </el-popover>
    <el-button v-popover:trainning class="btn" title="业务场景"></el-button>

  </div>
</template>

<script>
import Enum from "@/common/enum";

export default {
  name: "BusManagerDialog",
  components: {
  },
  data() {
    return {
      visible: false,
      activeName: "first",
      busTableData: [],
      sceneTableData: [],
      schemeList: [],//所有显示方案列表
      enumGroupType: Enum.enumSchemeType,
      sceneTypeList: [
        {label: '视频会议', value: 'meeting', schemeType: Enum.enumSchemeType.GroupMeeting},
        {label: '视频指挥', value: 'command', schemeType: Enum.enumSchemeType.VideoCommand},
      ],
      sceneId:""
    };
  },
  mounted(){
    //刷新场景列表
    //{operate:"init/add/refresh/stop",rows:[{sceneId:'',sceneName:'',isActived:true/false, schemeId:'',isSchemeActived:true/false}]}
    this.apiSDK.setInformRefreshSceneListCallback(obj => {
      if (obj) {
        if(obj.operate === "init"){
          this.sceneTableData = obj.rows
        } else if (obj.operate === 'add') {
        //   this.sceneTableData = this.sceneTableData.concat(obj.rows)
          obj.rows.forEach(item => {
            console.log(this.sceneTableData)
            let findObj = this.sceneTableData && this.sceneTableData.find(item2 => item.sceneId === item2.sceneId) || 'undefined';
            if (findObj) {
              this.sceneTableData.push(item);
            } else {
              let index = this.sceneTableData && this.sceneTableData.findIndex(item2 => item.sceneId === item2.sceneId) || -1;
              if( index > -1 ) this.sceneTableData[index] = Object.assign({}, this.sceneTableData[index], item);
            }
          });
        } else if (obj.operate === 'refresh') {
          obj.rows.forEach(item => {
            let index = this.sceneTableData.findIndex(item2 => item.sceneId === item2.sceneId);
            if( index > -1 ) this.sceneTableData[index].isActived = item.isActived;
            if( index > -1 ) this.sceneTableData[index].schemeId = item.schemeId;
            if( index > -1 ) this.sceneTableData[index].schemeName = item.schemeName;
          });
        } else if (obj.operate === 'remove') {
          obj.rows && obj.rows.forEach(item2 => {
            let ind = this.sceneTableData.findIndex(item => item.sceneId === item2.sceneId);
            if (ind !== -1) {
              this.sceneTableData.splice(ind, 1);
            }
          });
        }
        this.filterRowSchemeList();
        // this.$set(this.sceneTableData);
        // console.log(this.sceneTableData)
      }
    });
  },
  methods: {
    showDialog() {
      this.$emit('closeOtherDialog')
      this.visible = true;
      this.getAllScheme();

    },
    getAllScheme() {
      //获取显示方案列表
      //[{schemeId:'',schemeName:'',schemeType:'',description:''}]
      this.apiSDK.getAllDisplayScheme(1, 1024, res => {
        //订阅当前所有业务场景
        this.apiSDK.publicSubscribeSceneList();
        if(res) this.schemeList = res;

      });
    },
    // 过滤行显示方案列表
    filterRowSchemeList() {
      //处理显示方案名称
      this.sceneTableData && this.sceneTableData.forEach(item => {
        // 静态添加一条空显示方案 作用是停止
        item.schemeList = [{schemeId: '', schemeName: '', splitType: 9, schemeType: ''}];
        let obj = this.sceneTypeList.find(k => k.value === item.sceneType);
        let isInSchemeList = false;
        this.schemeList && this.schemeList.forEach(item2 => {
            if (item2.schemeType == obj.schemeType) {
                item.schemeList.push(item2);
            }
            if ( item2.schemeId == item.schemeId ) {
                isInSchemeList = true;
            }
        })
        if( isInSchemeList == false ){
            // console.log('该方案不在我的方案列表中');  // 成员端只显示自己创建的方案
            item.schemeList.push({schemeId: item.schemeId, schemeName: item.schemeName, splitType: 9, schemeType: ''});
        }
      });
      this.$set(this.sceneTableData);
    },
    closeDialog() {
      this.visible = false;
      //取消订阅所有的业务场景
      this.apiSDK.publicCancelSubscribeSceneList();

      if(this.sceneId){
        //取消订阅业务场景实时状态
        this.apiSDK.publicCancelSubscribeSceneDetail(this.sceneId);
      }
    },
    // 获取场景类型名称
    getSceneLabel(data) {
      let obj = this.sceneTypeList.find(item => item.value === data.sceneType);
      return obj && obj.label || '';
    },
    //删除
    handleDelete(data) {
      this.apiSDK.publishStopScene(data.sceneId);   // 停止会议
    },
    // 激活，修改switch状态
    changeActive(data) {
      if(data && data.isActived == false){
        //取消订阅业务场景实时状态
        this.apiSDK.publicCancelSubscribeSceneDetail(data.sceneId);
      }else{
        //订阅业务场景实时状态
        this.apiSDK.publicSubscribeSceneDetail(data.sceneId);
      }
    },
    //切换显示方案
    handleChange(row, val){
      //切换业务显示方案
      this.apiSDK.publishReplaceSceneScheme(row.sceneId, val);
    },
    handleDBClick(row,column,event){
      this.sceneId = row.sceneId;
      //订阅业务场景实时状态
      this.apiSDK.publicSubscribeSceneDetail(row.sceneId);
    },
  }
};
</script>
<style scoped>
/deep/.el-table {
  margin: 0 10px;
  width: 760px;
  height: 450px;
}
/deep/.el-table .cell {
  text-align: center;
}
/deep/.el-table td {
  padding: 6px 0;
}
.btn {
  border: 0;
  height: 40px;
  width: 40px;
  background: url(../../../static/main/leftBar/changjing.png) no-repeat;
}
.btn:hover {
  background: url(../../../static/main/leftBar/changjing_hover.png) no-repeat;
}
</style>

