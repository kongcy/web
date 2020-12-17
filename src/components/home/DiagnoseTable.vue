<template>
    <div class="diagnose-table">
        <div class="tableSearch">
            <div>
                设备名称：
                <el-input placeHolder="请输入设备名称" v-model="nameSearch" @blur="getTable" @keyup.enter.native="getTable"></el-input>
            </div>
            <div>
                诊断结果：
                <el-select v-model="diagnoseValue" placeholder="请选择" @change="getTable">
                    <el-option
                    v-for="item in diagnoseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                开始时间：
                <el-date-picker
                    v-model="srartTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="getTable">
                </el-date-picker>
            </div>
            <div>
                结束时间：
                <el-date-picker
                    v-model="endTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="getTable">
                </el-date-picker>
            </div>
            <div>
                异常项：
                <el-select v-model="warningValue" placeholder="请选择" @change="getTable">
                    <el-option
                    v-for="item in warningOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
         <el-table
            :data="tableData"
            border
            empty-text="没有找到匹配的记录"
            height="calc(100% - 40)"
            style="width: 100%;">
            <el-table-column
                prop="assetName"
                label="设备名称">
            </el-table-column>
            <el-table-column
                prop="ip"
                label="设备ip">
            </el-table-column>
            <el-table-column
                prop="code"
                label="资源IDS"
                width="210">
            </el-table-column>
            <el-table-column
                prop="vender"
                label="厂商">
            </el-table-column>
            <el-table-column
                prop="nvrName"
                label="通道名称">
            </el-table-column>
            <el-table-column
                prop="nvrNo"
                label="通道号">
            </el-table-column>
            <el-table-column
                prop="port"
                label="端口">
            </el-table-column>
            <el-table-column
                prop="diagResult"
                label="诊断结果"
                width="116">
            </el-table-column>
            <el-table-column
                prop="time"
                label="诊断时间"
                width="204">
            </el-table-column>
            <el-table-column
                prop="ipAddr"
                label="异常项"
                width="116">
                <template slot-scope="scope">
                    <span class="el-icon-tickets" @click="showDialog(scope.row)"></span>
                </template>
            </el-table-column>
         </el-table>
         <div class="footer-pagination">
             <div>
                 <span>显示第<span class="num"> {{total>0?(pageNumber-1)*pageSize+1:0}} </span>到第<span class="num"> {{pageNumber*pageSize>total?total:pageNumber*pageSize}} </span>条记录，总共<span class="num"> {{total}} </span>条记录</span>
                 <span>
                     每页显示
                       <el-select v-model="count" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    条记录
                 </span>
             </div>
             <div>
                 <el-pagination
                    background
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
             </div>
         </div>
         <Diagnos-dialog ref="DiagnosDialog"></Diagnos-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import DiagnosDialog from './Diagnose-dialog'
export default {
    // props:['nodeId'],
    components:{
        DiagnosDialog
    },
    data(){
        return{
            nameSearch:'',//设备名称
            diagnoseOptions: [
                {
                    value: '全部',
                    label: '全部'
                    }, {
                    value: '0',
                    label: '完好'
                    }, {
                    value: '1',
                    label: '故障'
                    }, {
                    value: '2',
                    label: '诊断失败'
                }
            ],
            diagnoseValue: '全部', // 诊断结果
            srartTime:new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)).formatDate('yyyy-MM-dd'),//new Date().formatDate('yyyy-MM-dd'),
            endTime: new Date().formatDate('yyyy-MM-dd'), //  诊断时间
            warningValue: '全部',
            warningOptions: [{
                value: '全部',
                label: '全部'
                }, {
                value: 'pictureColor',
                label: '画面偏色'
                }, {
                value: 'abnormalTagging',
                label: '清晰度'
                }, {
                value: 'brightness',
                label: '亮度'
                },{
                value: 'interference',
                label: '条纹干扰'
                }, {
                value: 'snow',
                label: '雪花干扰'
                }, {
                value: 'signalLoss',
                label: '信号缺失'
                }, {
                value: 'sceneChange',
                label: '场景变换'
                }, {
                value: 'screenFreezes',
                label: '画面冻结'
                },{
                value: 'cloudMirror',
                label: '云镜控制故障'
                }, {
                value: 'soreignBodies',
                label: '人为遮挡'
            }],
            tableData:  [],
            count: 20,
            options: [{
            value: 20,
            label: '20'
            }, {
            value: 40,
            label: '40'
            }],
            pageSize: 20,
            pageNumber:1,
            total:0 // 总数
        }
    },
    watch:{
        // nodeId(){
        //     this.getTable()
        // }
        count(val){
            this.pageSize = val
            this.pageNumber = 1
            this.getTable()
        }
    },
    mounted(){
        this.getTable()
    },
    methods:{
        // 获取表格数据
        getTable(){
            let params={
                start: this.srartTime ? this.srartTime : null,
                end: this.endTime ? this.endTime : null,
                assetName: this.nameSearch,
                // diagType: 2,
                // typeId: '431',
                diagResult: this.diagnoseValue=='全部'?'':this.diagnoseValue,
                diagType: this.warningValue=='全部'?2:this.warningValue,
                page: this.pageNumber,
                pageNum: this.pageSize
            }
            this.apiSDK.getDiagnoseList(params,(res)=>{
                // let obj = JSON.parse(res.msg)
                this.tableData = res.data.list
                this.total = res.data.totalNums
                this.tableData.forEach(e=>{
                    e.diagResult=e.diagResult==0?'完好':e.diagResult==1?'故障':'诊断失败'
                })
                console.log('列表请求成功==========', res.data)
            })
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getTable();
        },
        showDialog(item){
            this.$refs.DiagnosDialog.showDialog(item)
        }
    }
}
</script>
<style>
.diagnose-table{
    width:100%;
    height:100%;
    /* padding: 8px 8px 0 8px; */
    box-sizing: border-box;
    background: url(../../../static/main/screen/diagnose_bg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
}
.diagnose-table .tableSearch,
.diagnose-table .tableSearch>div{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.diagnose-table .tableSearch{
    /* width: 70%; */
    padding:0 10px;
    background-color: #314D78;
    height: 40px;
    justify-content: flex-start;
    /* float: right; */
}
.diagnose-table .tableSearch>div{
    /* flex: 1; */
    margin-left: 24px;
    color: #d5d5d5;
}
.diagnose-table .tableSearch>div:nth-child(1){
    margin-left: 0px;
}
/* .diagnose-table .tableSearch>div:nth-child(1),
.diagnose-table .tableSearch>div:nth-child(3){
    flex: 3;
}
.diagnose-table .tableSearch>div:nth-child(2),
.diagnose-table .tableSearch>div:nth-child(4){
    flex: 2;
} */
.diagnose-table .tableSearch>div>span{
    width: 85px;
}
.diagnose-table .tableSearch .el-input{
    width: 150px;
}
.diagnose-table .tableSearch>div .el-input__inner{
    color: #fff;
    height: 30px;
    line-height: 30px;
    background: transparent;
    text-align: left;
    border: 1px solid #6B7C92;
}
.diagnose-table .el-input__inner:hover {
    border-color: #c0c4cc!important;
}
.diagnose-table .el-input__inner:focus {
    outline: none;
    border-color: #409eff!important;
}
/* .diagnose-table .tableSearch>div:nth-child(1) .el-input,
.diagnose-table .tableSearch>div:nth-child(3) .el-input,
.diagnose-table .tableSearch>div:nth-child(2) .el-select {
    width: calc(100% - 85px);
} */
.diagnose-table .tableSearch>div:nth-child(4)  .el-select {
    width: calc(100% - 65px);
}
/* .diagnose-table .tableSearch>div:nth-child(1) .el-input--suffix .el-input__inner{
    padding-right: 0;
    padding-left: 0;
} */
.diagnose-table .tableSearch>div .el-input__icon{
    display: flex;
    align-items: center;
    justify-content: center;
}
.diagnose-table .el-table, .diagnose-table .el-table__expanded-cell,
.diagnose-table .el-table th, .diagnose-table .el-table tr{
    background: transparent;
    color: #D3DCF0;
    border-color: rgba(255, 255, 255, 0.05);
}
.diagnose-table .el-table td, .diagnose-table .el-table th{
    text-align: center;
    font-family: "微软雅黑";
}
.diagnose-table .el-table--border td, .diagnose-table .el-table--border th, .diagnose-table .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-color: rgba(255, 255, 255, 0.05);
}
/* .diagnose-table .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #2f4977;
} */
.diagnose-table .el-table{
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin:10px 10px 90px;
    width: calc(100% - 20px)!important;
    height: calc(100% - 140px)!important;
    border-radius: 5px;
}
.diagnose-table .el-table::before,
.diagnose-table .el-table::after{
    height: 0;
}
.diagnose-table .el-table thead tr{
    height: 40px;
}
.diagnose-table .el-table thead th,
.diagnose-table .el-table td{
    padding: 8px;
}
.diagnose-table .el-table th{
    font-size: 16px;
    border-right: 1px solid rgba(136, 157, 179, 0.2);
    /* background: #324d78; */
}.diagnose-table .el-table td, .diagnose-table .el-table th.is-leaf{
    border-bottom: 1px solid rgba(136, 157, 179, 0.2);
}
.diagnose-table .el-table--border th, .diagnose-table .el-table__fixed-right-patch {
    border-bottom: 1px solid rgba(136, 157, 179, 0.2);
}
.diagnose-table .el-table--border td, .diagnose-table .el-table--border th, .diagnose-table .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid rgba(136, 157, 179, 0.2);
}
.diagnose-table .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: transparent;
    border-right: 1px solid rgba(136, 157, 179, 0.2);
    border-bottom: 1px solid rgba(136, 157, 179, 0.2);
}
.diagnose-table .el-table--border th.gutter:last-of-type{
    border-bottom: 1px solid rgba(136, 157, 179, 0.2);
    border-right: 0;
}
.diagnose-table tbody tr:nth-of-type(odd) {
    /* #334d73 */
    background-color: #324d77;
}
.diagnose-table tbody tr:nth-of-type(even) {
    background-color: #3e5c86;
}
.diagnose-table tbody tr:hover {
    background-color: #2f4977 !important;
}
.diagnose-table .el-icon-tickets{
    cursor: pointer;
    font-size: 16px;
    color: #409EFF;
}
.diagnose-table .el-icon-tickets:hover,
.diagnose-table .el-icon-tickets:focus{
    color: #ffffff;
}
.footer-pagination{
    position: absolute;
    bottom: 30px;
    left: 10px;
    right: 10px;
    color: #d5d5d5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}
.footer-pagination .num{
    font-size: 16px;
    color: #fff;
}
.footer-pagination .el-select{
    width: 70px;
}
.footer-pagination .el-select .el-input__icon{
    display: flex;
    align-items: center;
    justify-content: center;
}
.diagnose-table .el-table__header-wrapper {
    background: url(../../../static/main/screen/table-header.png) no-repeat center center;
    background-size: 100% 100%;
}
/* 修改滚动条样式 */
div::-webkit-scrollbar{
    width: 8px;
    height: 20px;
}
div::-webkit-scrollbar-track{
    background: transparent;
    border-radius: 10px;
}
div::-webkit-scrollbar-thumb{
    background: rgba(144,147,153,.3);
    border-radius: 10px;
}
div::-webkit-scrollbar-thumb:hover{
    background: rgba(144,147,153,.5);
}
div::-webkit-scrollbar-corner{
    background: #179a16;
}
</style>