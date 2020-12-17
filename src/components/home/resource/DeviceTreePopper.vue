<template>
   <div class="TreepopperBox cs" v-show="isTreeItemShow">
      <el-checkbox-group v-model="checkedItems" @change="handleCheckedChange(TreeItem)">
      <el-checkbox v-for="item in TreeItem.selectItem" :label="item.id" :key="item.text">{{item.text}}</el-checkbox>
      </el-checkbox-group>
      <div class="poperBoxfoot">
          <el-button type="primary" plain size="small">确定</el-button>
          <div class="clearbtn">
               <el-button class="AllBtns" :class="TreeItem.checkAll?'checked':''" :indeterminate="TreeItem.isIndeterminate" type="text"  @click="handleCheckAllChange(TreeItem)">全部</el-button>
              <el-button :indeterminate="TreeItem.isIndeterminate" type="text"  @click="clearChecked(TreeItem)"><i class="icon-clear"></i>清空</el-button>
          </div>
      </div>
    </div>
    
</template>

<script>
import Fun from '@/common/fun';
import Enum from '@/common/enum';

export default {
    name: 'DeviceTreePopper',
    components: {
      // SendRequestDialog,
    },
    data () {
        return {
          isTreeItemShow:false,//设备资源树筛选框是否显示
          checkedItems:[],//设备资源树筛选数据
          TreeItem:{},//设备资源树筛选数据
        };
    },
    mounted(){
     let self=this;
     //点击其他地方隐藏树的弹出框
        document.addEventListener('click', e => {
            if(!(e.target).closest('.divDevices')&&!(e.target).closest('.TreepopperBox')&&!(e.target).closest('#tab-DeviceTree')){
                self.isTreeItemShow=false;
            }
        });
    },
    methods: {
      showpop(data){
        this.isTreeItemShow=true;
        this.TreeItem=data;
      },
      //子选项checkbox change时
      handleCheckedChange(list,index) {
          console.log(list,index)
          let checkedCount = this.checkedItems.length;
          list.checkAll = checkedCount === list.selectItem.length;
          list.isIndeterminate = checkedCount > 0 && checkedCount < list.selectItem.length;
      },
      //全选checkbox change时
      handleCheckAllChange(val){
        console.log(val);
         val.checkAll=true;
        let arr=val.selectItem.map(vl=>vl.id);
        this.checkedItems = val.checkAll ? arr : [];
        val.isIndeterminate = false;
      },
      clearChecked(list){
         console.log(list);
         list.checkAll=false;
        let arr=list.selectItem.map(vl=>vl.id);
        this.checkedItems = list.checkAll ? arr : [];
        list.isIndeterminate = false;
      }
    }
}
</script>

<style scoped>
.TreepopperBox{
  color: #B7C1D0;
  width: 420px;
  min-height: 50px;
  background: url(../../../../static/main/screen/resource_bg2.png) no-repeat top;
  background-size: 100% 400px;
  position: absolute;
  top: 45px;
  left: 12px;
  z-index: 100;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.25);
  text-align: left;
}
.TreepopperBox /deep/ .el-checkbox__input .el-checkbox__inner{
  background-color:transparent;
}
.TreepopperBox /deep/ .el-checkbox{
  color:#fff;
  margin-top:10px;
}
.TreepopperBox /deep/  .el-checkbox__input.is-checked .el-checkbox__inner,.TreepopperBox /deep/  .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #409EFF;
}
.TreepopperBox /deep/  .el-checkbox__input.is-checked+.el-checkbox__label,
.TreepopperBox /deep/  .el-button--text{
  color:#B7C1D0;
  text-align: left;
}
.TreepopperBox /deep/  .el-button--text.AllBtns[indeterminate="indeterminate"]{
  color: #128bf1;
  text-align: left;
}
.TreepopperBox /deep/  .el-button--text.checked{
   color:#fff;
}
.icon-clear{
    display: inline-block;
    width:12px;
    height: 12px;
    vertical-align: middle;
    background: url(../../../../static/common/reset.png) no-repeat center;
    background-size: 12px;
}

.poperBoxfoot{
  clear: both;
  margin: 20px 0 10px 0;
  text-align: center;
}
.clearbtn{
  float:right;
  margin:5px 10px 0 0;
}
</style>
