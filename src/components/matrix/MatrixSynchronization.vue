<template>
    <div>
        <div class="matrix-wrapper">
            <div class="matrix-common">
                <el-button type="primary" @click="deleteMatrix">删除</el-button>
                <el-button type="primary" @click="saveMatrix">保存</el-button>
            </div>
            <div class="matrix-top">
                <el-form :inline="true">
                    <el-form-item label="目的矩阵：" style="margin-bottom:0px">
                        <el-input v-model="form.destName" ></el-input>
                    </el-form-item>
                    <el-form-item label="源矩阵：" style="margin-bottom:0px">
                        <el-input v-model="form.sourceName" ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="matrix-common">
                <el-button type="primary" @click="searchMatrix">检索</el-button>
                <el-button type="primary" @click="searchAllMatrix">全部</el-button>
            </div>
        </div>
        <div class="matrix-content">
            <el-table :data="allDataList" style="100%" highlight-current-row stripe border height="220px" @cell-click="checkRow" >
                <el-table-column prop="destName" label="目的矩阵" align="center"></el-table-column>
                <el-table-column prop="destCenterName" label="目的矩阵中心" align="center"></el-table-column>
                <el-table-column prop="sourceName" label="源矩阵" align="center"></el-table-column>
                <el-table-column prop="sourceCenterName" label="源矩阵中心" align="center"></el-table-column>
                <el-table-column label="是否启用" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="modifyStatus(scope.row)" >{{ !scope.row.isUse | filterIsUser }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="radio-set">
            <el-radio-group v-model="isNet" @change="handleChangeIsNet">
                <el-radio :label="true">本中心矩阵设置</el-radio>
                <el-radio :label="false">全网矩阵设置</el-radio>
            </el-radio-group>
        </div>
        <div class="matrix-footer">
            <div class="matrix-footer-common">
                <p class="matrix-footer-title">目的矩阵</p>
                <div>
                    <el-tree :data="destMatrixData" :props="defaultPropsDest" @node-click="handleNodeClick"></el-tree>
                </div>
            </div>
            <div class="matrix-footer-common">
                <p class="matrix-footer-title">源矩阵</p>
                <div class="matrix-tree-wrapper">
                    <el-tree :data="sourceMatrixData" :props="defaultPropsDest" @node-click="handleNodeClickSource"></el-tree>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                destName: '',
                sourceName: ''
            },
            allDataList: [],
            matrixSet: '',
            syncId: '',
            num: 8,
            numClass: '',
            numArr: [],
            isNet: true,
            destMatrixData: [],
            defaultPropsDest: {
                children: 'children',
                label: 'matrixName',
                id: 'matrixId'
            },
            sourceMatrixData: [],
            saveForm: {
                destId: '', 
                sourceId: ''
            },
        }
    },
    mounted() {
        this.getList();
        this.setData();
        this.getMatrix()
    },
    filters: {
        filterIsUser(isUser) {
            let name = '';
            if (isUser) {
                name = '启用'
            } else {
                name = '不启用'
            }
            return name;
        }
    },
    methods: {
        handleChangeIsNet(val){
            console.log('矩阵同步');
            if( this.isNet == true ){
                console.log('本中心');
            }else{
                console.log('全网');
            }
            this.getList();
            this.setData();
            this.getMatrix();
        },
        setData() {
            this.numArr.length = 0;
            for(let i=0; i < this.num; i++) {
                this.numArr.push(Math.random(10) + i);
            }
        },
        getList() {
            this.apiSDK.getSynchronizeMatrixList(this.isNet, 1, 1024, res => {
                this.allDataList = res.rows;
            })
        },
        deleteMatrix() {
            if (this.syncId) {
                this.$confirm('是否删除同步的矩阵?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.apiSDK.deleteSynchronizedMatrix(this.syncId, res => {
                        if (res.Ret == '0') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList()
                            this.syncId = ''
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                            this.syncId = ''
                        }
                    })
                })
            } else {
                this.$message({
                    message: '请选择需要删除的行',
                    type: 'warning'
                });
            }
        },
        saveMatrix() {
            if (!this.saveForm.destId || !this.saveForm.sourceId) {
                this.$message({
                    message: '请选择选择目的矩阵和源矩阵',
                    type: 'warning'
                });
            } else {
                if (this.syncId) {
                    this.apiSDK.modifySynchronizedMatrix(this.syncId, this.saveForm.destId, this.saveForm.sourceId, res => {
                        if (res.Ret == '0') {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getList()
                            this.getMatrix()
                            this.restData()
                        } else {
                            this.$message({
                                message: '修改失败',
                                type: 'error'
                            });
                        }
                    })
                } else {
                    this.apiSDK.addMatrixSync(this.saveForm.destId, this.saveForm.sourceId, res => {
                        if (res.Ret == '0') {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.getList()
                            this.getMatrix()
                            this.resetSaveData()
                        } else {
                            this.$message({
                                message: '新增失败',
                                type: 'error'
                            });
                        }
                    })
                }
            }
        },
        getMatrix() {
            this.apiSDK.getAllMatrix(1, 1024, this.isNet, res => {
                this.destMatrixData = res.rows;
                this.sourceMatrixData = this.deepCopy(res.rows);
            })
        },
        checkRow(row) {
            this.syncId = row.syncId;
            this.checkDetail()
        },
        searchMatrix() {
            this.apiSDK.querySynchronizeMatrixList(this.form.destName, this.form.sourceName, 1, 1024, res => {
                this.allDataList = res.rows;
            })
        },
        searchAllMatrix() {
            this.restData();
            this.getList();
        },
        restData() {
            this.form = {
                destName: '',
                sourceName: ''
            }
            this.subscribeId = ''
        },
        checkDetail() {
            // var resp ={syncId:'',sourceId:'',sourceName:'',destId:'',destName:'',isUse:true/false}
            // let resp={syncId: "9817f9c8711048b2a4561338ca0c67fe",sourceId: "YPSQ072800000340",sourceName: "测试矩阵不存在通道1",sourcePos: 2,destId: 'YPSQ072800000343',destName: '',destPos: 4, isUse:true}
            this.apiSDK.getSynchronizeMatrixById(this.syncId, res => {
                this.sourceMatrixData.forEach(item => {
                    this.saveForm.sourceId = res.sourceId
                    this.saveForm.destId = res.destId
                })
            })

            // this.sourceMatrixData.forEach(item => {
            //     if (item.matrixId = resp.destId) {
            //         this.saveForm.sourceId = resp.sourceId
            //         this.saveForm.destId = resp.destId

            //     }
            // })
        },
        modifyStatus(data) {
            this.apiSDK.launchSynchronizedUse(data.syncId, {synchronizedId: data.synchronizedId, destId: data.destId, sourceId: data.sourceId}, !data.isUse, res => {
                if (res.Ret == '0') {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.getList()
                } else {
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                }
            })
        },
        handleNodeClickSource(data) {
            //console.log(data)
            this.saveForm.sourceId = data.matrixId
        },
        handleNodeClick(data) {
            //console.log(data)
            this.saveForm.destId = data.matrixId;
        },
        deepCopy(obj) {
            if (typeof obj !== 'object') return 
            var newObj = obj instanceof Array ? [] : {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
                }
            }
            return newObj;
        }
    }
}
</script>
<style scoped>
.matrix-wrapper {
    display: flex;
    padding: 8px 0px 10px 0;
}
.matrix-common {
    flex: 0 0 216px;
}
.matrix-top {
    flex: 1 1 auto;
    align-items: stretch;
}
.matrix-wrapper /deep/ .el-input__inner{
	height: 40px;
}
.radio-set {
    text-align: center;
    padding: 10px 0;
    border: 1px solid #EBEEF5;
    border-top: none;
}
.matrix-footer {
    margin-top: 10px;
    display: flex;
    height: 200px;
}
.matrix-footer-common {
    position: relative;
    flex: 1 1 auto;
    box-sizing: border-box;
    border: 1px solid #EBEEF5;
    height: 100%;
    font-size: 0;
    text-align: center;
    
}
.matrix-footer-common:last-child {
    margin-left: 20px;
}
.matrix-footer-title {
    height: 40px;
    font-size: 14px;
    background-color: #e9f3fa;
    padding: 0;
    margin: 0;
    line-height: 40px;
    text-align: center;
    color: #2e3c42;
}
.split-screen > div {
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid #EBEEF5;
    background-color: #7d7d7d;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    color: #fff;
    font-size: 12px;
    vertical-align: middle;
}
.split-screen-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.matrix-tree-wrapper {
    overflow-y: auto;
    height: 160px;
}
</style>