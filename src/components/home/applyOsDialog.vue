<template>
   <div >
         <el-dialog  :visible.sync="visible" title="应用字幕" width="460px" center class="custom-dialog" @close="closeDialog">
            <el-form ref="applyOsdForm" :model="applyOsdForm" label-width="120px">
                <el-form-item label="当前资源：" >
                    <!--{{resource.hasOwnProperty('name') && resource.name}}-->
                    {{applyOsdForm.resName}}
                </el-form-item>
                <el-form-item label="字幕样式：" prop="osdStyleId">
                    <el-select placeholder="请选择" class="card-select" v-model="applyOsdForm.applyIndex">
                        <el-option
                        v-for="item in osdStyleList"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                          <i v-if="applyOsdForm.applyIndex == item.value"></i>
                       <span>{{item.label}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0" style="text-align: center" prop="applyType">
                    <el-radio v-model="applyOsdForm.applyType" label="1">应用到本节点</el-radio>
                    <!--<el-radio v-model="applyOsdForm.applyType" label="2">应用到全网</el-radio>-->
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align:center">
                <el-button class="canclebtn" @click="visible = false" size="small">取消</el-button>
                <el-button type="primary" @click="applyOsdStyle" size="small">确定</el-button>
            </div>
        </el-dialog>
   </div> 
</template>

<script>
export default {
    name:'applyOs',
     components: {
    },
   
    data () {
        return {
            visible:false,
           
             applyOsdForm: {
                resName: '',
                resId: '',
                applyIndex: '1',
                applyType: '1',
            },
             osdStyleList: [{
                value: '1',
                label: 'OSD字幕1'
            },{
                value: '2',
                label: 'OSD字幕2'
            },{
                value: '3',
                label: 'OSD字幕3'
            },{
                value: '4',
                label: 'OSD字幕4'
            },{
                value: '5',
                label: 'OSD字幕5'
            }],
            osdStyleId: '1',
          
        }
    },
    mounted(){

    },
    methods: {
        showDialog(data){
            let resourceId = data.resId;
            if(!resourceId){
                this.showremind("warning",'请选择资源')
                // this.$message({message: '请选择资源', type: 'warning'});
                this.visible = false    
                return;
            }
            this.visible = true
            this.applyOsdForm=data;
        },
        closeDialog(){
            this.visible = false      
        },
      

         // 应用字幕
        applyOsdStyle() {
            let items = [];
            items.push({
                resourceID : this.applyOsdForm.resId,
                applyIndex : this.applyOsdForm.applyIndex
            });

            let method = this.applyOsdForm.applyType === '1' ? 'applyOsdToNode' : 'applyOsdToAll';
            this.apiSDK[method](items, res => {
                if (res && res.Ret == 0) {
                    this.$message({message: '应用成功', type: 'success'});
                } else {
                    this.$message({message: '应用失败', type: 'error'});
                }
                this.applyOsdVisible = false;
            });
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
.canclebtn{
    border-color: #6B7C92;
    background-color: transparent;
    color: #ABB3C4;
}
/deep/ .el-form-item__label{
    color:#B7C1D0;
}
/* redio样式 */
/deep/ .el-radio{
   color: #B7C1D0;
   margin-right: 29px;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
    /* border-color: #409EFF;
    background: none; */
    border:none;
    background:url(../../../static/common/redio_active.png) no-repeat center;
}
/deep/ .el-radio__inner {
    /* border-color: #6B7C92;
    background: none; */
    width:20px;
    height:20px;
    border:none;
    background:url(../../../static/common/redio_no.png) no-repeat center;
}
/deep/ .el-radio__inner::after {
    /* border-radius: 50%;*/
    background:url(../../../static/common/redio_active.png) no-repeat center;
    /* background-color: #409EFF;  */
}
.base-point /deep/ .el-radio__inner::after {
    width: 8px;
    height: 8px;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #fff;
}
</style>