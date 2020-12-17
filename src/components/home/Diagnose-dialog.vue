<template>
    <div class="diagnose-dialog">
        <el-dialog
            title="异常项"
            :visible.sync="dialogVisible"
            width="600px"
            class="custom-dialog">
            <el-form :model="form">
                <el-form-item label="基本信息：">
                    <div class="info">
                        <span class="infoItem">
                            设备名称：{{form.assetName}}
                        </span>
                        <span class="infoItem">
                            设备ip：{{form.ip}}
                        </span>
                        <span class="infoItem">
                            端口：{{form.port}}
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="阶段结论：">
                    <div class="info">
                        <span class="infoItem">
                            结果：{{form.diagResult}}
                        </span>
                        <span class="infoItem">
                            结果明细：{{form.des}}
                        </span></div>
                </el-form-item>
                <el-form-item label="视频故障：">
                    <div class="info">
                        <div class="desImgBox"  v-if="form.imgUrl">
                            <img src="form.imgUrl" alt="">
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dialogVisible: false,
            form:{
                "diagResult": 2,
                "nvrName": "13.55.10.244_GB",
                "code": "69600000001320000307",
                "orgName": "151部门",
                "ip": "",
                "errorCode": "923",
                "assetClass": "431",
                "vender": "1",
                "nvrNo": null,
                "imgUrl": null,
                "groupDiagType": "video",
                "areaId": null,
                "des": "下级平台未注册",
                "port": "8000",
                "orgCode": "41010000002160000002",
                "faultType": null,
                "assetName": "13.55.10.244_GB",
                "time": "2020-11-28 16:02:18"
            }
        }
    },
    methods:{
        showDialog(item){
            this.dialogVisible = true
            this.form = item
        }
    }
}
</script>
<style>
.diagnose-dialog .el-dialog__headerbtn{
    top: 8px;
}
.diagnose-dialog .el-dialog__body{
    padding: 15px 15px 20px;
    color:#D3DCF0;
}
.diagnose-dialog .el-dialog__body .el-form-item__label{
    color:#D3DCF0;
}
.diagnose-dialog .el-dialog__body .el-form-item:last-child .el-form-item__content{
    margin-top: 40px;
}
.diagnose-dialog .el-dialog__body .el-form-item:not(:first-child) .info{
    height: 40px;
    /* background: #314D78; */
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-indent: 10px;
}
.diagnose-dialog .el-dialog__body .el-form-item:first-child .info{
    background: transparent;
    display: flex;
    justify-content: space-between;
}
.diagnose-dialog .el-dialog__body .el-form-item:last-child .info{
    height: 264px!important;
}
.diagnose-dialog .el-dialog__body .el-form-item .info .infoItem{
    margin-right: 24px;
}
.diagnose-dialog .el-dialog__body .desImgBox{
    height: 50%;
    width: 100%;
    box-sizing: border-box;
    padding: 3% 20%;
}
.diagnose-dialog .el-dialog__body .desImgBox img{
    height: 100%;
    width: 100%;
}
</style>