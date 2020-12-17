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
                <el-table-column prop="destName" label="目标矩阵" align="center"></el-table-column>
                <el-table-column prop="destCenter" label="目标矩阵中心" align="center" width="110px"></el-table-column>
                <el-table-column prop="destPos" label="目的矩阵位置" align="center" width="110px">
                    <template slot-scope="scope">
                    {{scope.row.destPos}}
                    </template>
                </el-table-column>
                <el-table-column prop="sourceName" label="源矩阵" align="center"></el-table-column>
                <el-table-column prop="sourceCenter" label="源矩阵中心" align="center" width="100px"></el-table-column>
                <el-table-column prop="sourcePos" label="源矩阵位置" align="center" width="100px">
                    <template slot-scope="scope">
                    {{scope.row.sourcePos}}
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" align="center" width="80px">
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
                <div style="font-size: 14px;">
                    <el-tree :data="destMatrixData" :props="defaultPropsDest" @node-click="handleNodeClick"></el-tree>
                </div>
            </div>
            <div class="matrix-footer-common split-screen" :class="numClass">
                <div v-for="(i,index) in numArr" :key="i" :class="activeClassNum == index ? 'active' : ''" @click="activeDestScreen(index)"  @dblclick="checkDest(index)">
                    <span class="set-close" :class="submitForm[index].destContent.length > 2 ? 'el-icon-close' : ''" @click="removeContent(index)"></span>
                    <span class="split-screen-content">{{ submitForm[index].destContent }}</span>
                </div>
            </div>
            <div class="matrix-footer-common">
                <p class="matrix-footer-title">源矩阵</p>
                <div class="matrix-tree-wrapper">
                    <el-tree ref="tree" :data="sourceMatrixData" node-key="matrixId" @node-click="treeNodeClick" :props="defaultPropsDest"></el-tree>
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
            subscribeId: '',
            num: 4,
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
                destPos: 0, 
                sourceId: '',
                sourcePos: 0,
                name: '',
                destContent: ''
            },
            activeClassNum: -1,
            destContent: [],
            submitForm: [],
            flag: 0,

            currentSrcNode: {
                id: null,
                time: null,//点击时间
            },
        }
    },
    mounted() {
        this.getList();
        this.setData();
        this.getMatrix();
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
            console.log('矩阵订阅');
            if( this.isNet == true ){
                console.log('本中心');
            }else{
                console.log('全网');
            }
            this.getList();
            this.setData();
            this.getMatrix();
        },
        // 对数据进行封装处理
        setData() {
            this.numArr.length = 0;
            if (this.flag < 1) {
                this.submitForm.length = 0;
                this.submitForm.splice(0, 0);
            }
            
            for(let i=0; i < this.num; i++) {
                
                this.numArr.push(Math.random(10) + i);
                if (this.flag < 1) {
                    let item = {};
                    item.destId = '';
                    item.destPos = 0;
                    item.sourceId = '';
                    item.sourcePos = 0;
                    item.name = '';
                    item.destContent = i+1
                    this.submitForm.push(item)
                }
                
            }
            this.activeClassNum = -1;
            this.numClass = 'split' +　this.num;
        },
        // 查询列表数据
        getList() {
            this.apiSDK.getSubscribedMatrixList(this.isNet, 1, 1024, res => {
                this.allDataList = res.rows;
            })
        },
        // 修改状态
        modifyStatus(data) {
            this.apiSDK.launchMatrixUse(data.subscribeId, {subscribeId: data.subscribeId, destId: data.destId, destPos: data.destPos, sourceId: data.sourceId, sourcePos: data.sourcePos}, !data.isUse, res => {
                if (res.Ret == '0') {
                    this.$message({
                        message: '状态修改成功',
                        type: 'success'
                    });
                    this.getList()
                } else {
                    this.$message({
                        message: '状态修改失败',
                        type: 'error'
                    });
                }
            })
        },
        // 查询所有解析器
        getMatrix() {
            this.apiSDK.getAllMatrix(1, 1024, this.isNet, res => {
                this.destMatrixData = res.rows;
                this.sourceMatrixData = this.deepCopy(res.rows);
                this.sourceMatrixData.forEach((item) => {
                    let children = []
                    for (let i = 1; i < (Number(item.matrixSplitNum) + 1); i++) {
                        let obj = {};
                        obj.matrixId = Math.random(10);
                        obj.matrixName = i;
                        obj.disable = false;
                        children.push(obj);
                    }
                    item.children = children;
                    item.disable = false;
                })
            })
        },
        // 删除订阅
        deleteMatrix() {
            if (this.subscribeId) {
                this.$confirm('是否删除订阅的矩阵?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.apiSDK.deleteSubscribedMatrix(this.subscribeId, res => {
                        if (res.Ret == '0') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList()
                            this.restData()
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
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
        // 新增或者修改订阅
        saveMatrix() {
            let subscriptions= []
            this.submitForm.forEach(item => {
                let obj = {}
                if (item.destId && item.sourceId) {
                    obj.destPos = item.destPos;
                    obj.sourcePos = item.sourcePos
                    obj.destId = item.destId;
                    obj.sourceId = item.sourceId
                    subscriptions.push(obj)
                }
            })
            if (subscriptions.length == 0) {
                //subscriptions.push({destId:this.saveForm.destId})
                this.$message({ message: '请配置分屏映射', type: 'warning' });
                return;
            }
            this.apiSDK.addMatrixSubscribe(subscriptions, res => {
                    if (res.Ret == '0') {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getList()
                        this.getMatrix()
                        this.resetSaveData()
                        this.restData()
                        this.flag = 0;
                        this.num = 4; // 重置分频数
                        this.setData() // 通过重置分频数跟标志位 重置submitFrom数据
                    } else {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    }
                })
            
        },
        // 点击列表
        checkRow(row) {
            this.subscribeId = row.subscribeId;
        },
        // 根据id查询详情
        checkDetail() {
            this.apiSDK.getSubscriptionsById(this.saveForm.destId, res => {
                res.forEach(it => {
                    this.destMatrixData.forEach(item => {
                        if (item.matrixId == it.destId) {
                            this.submitForm[it.destPos].destPos = it.destPos;
                            this.submitForm[it.destPos].sourceId = it.sourceId;
                            this.submitForm[it.destPos].sourcePos = it.sourcePos;
                            this.submitForm[it.destPos].destId = it.destId;
                            this.submitForm[it.destPos].name = it.sourceName;
                            this.submitForm[it.destPos - 1].destContent = it.sourceName + '_' + it.sourcePos;
                        }
                        this.submitForm.splice(0, 0);
                    })
                }); 
            })
        },
        // 过滤查询
        searchMatrix() {
            this.apiSDK.querySubscribeMatrixList(this.form.destName, this.form.sourceName, 1, 1024, res => {
                this.allDataList = res.rows;
            })
        },
        // 全部查询
        searchAllMatrix() {
            this.restData();
            this.getList();
        },
        // 重置头部的输入框
        restData() {
            this.form = {
                destName: '',
                sourceName: ''
            }
            this.subscribeId = ''
        },
        // 重置提交数据
        resetSaveData() {
            this.saveForm = {
                destId: '', 
                destPos: 0, 
                sourceId: '',
                sourcePos: 0,
                name: '',
                destContent: ''
            }
        },
        removeContent(index) {
            this.submitForm[index].destContent = index + 1;
            this.submitForm[index].destId = '';
            this.submitForm[index].destPos = 0;
            this.submitForm[index].sourceId = '';
            this.submitForm[index].sourcePos = 0;
            this.submitForm[index].name = '';
            this.submitForm.splice(0, 0);
        },
        // 点击左侧树结构事件
        handleNodeClick(data) {
            this.num = data.matrixSplitNum;
            this.setData();
            if (!this.saveForm.destId || this.saveForm.destId == data.matrixId) {
                this.flag ++;
            } else {
                this.clearScreen()
            }
            this.saveForm.destId = data.matrixId;
            this.checkDetail()

            this.$refs.tree.store.root.childNodes.forEach(data => {
                if (data.key == this.saveForm.destId) {
                    data.visible = false;
                } else {
                    data.visible = true;
                }
            })
        },
        forbiddenTree() {
            this.sourceMatrixData.forEach(item => {
                if (item.matrixId == this.saveForm.destId) {
                    item.disable = true
                }
            })
            this.sourceMatrixData = this.deepCopy(this.sourceMatrixData)

        },
        clearScreen() {
            this.numArr.length = 0;
            this.submitForm.length = 0;
            this.submitForm.splice(0, 0);
            for(let i=0; i < this.num; i++) {
                this.numArr.push(Math.random(10) + i);
                let item = {};
                item.destId = '';
                item.destPos = 0;
                item.sourceId = '';
                item.sourcePos = 0;
                item.name = '';
                item.destContent = i+1
                this.submitForm.push(item)
            }
            this.activeClassNum = -1;
            this.numClass = 'split' +　this.num;
        },
        // 点击右侧树结构事件
        treeNodeClick(data) {
            //console.log(data)
            let parentNode = this.$refs['tree'].getNode(data.matrixId).parent;
            if (parentNode instanceof Object) {
                this.saveForm.sourcePos = Number(data.matrixName)
                this.saveForm.sourceId = parentNode.data.matrixId
                this.saveForm.name = parentNode.label
            }

            //单击实现双击
            if(!(data.children) && this.currentSrcNode.id == data.matrixId && (new Date().getTime()-this.currentSrcNode.time) < 250){
                if(this.activeClassNum > -1){
                    let number = this.activeClassNum;
                    this.saveForm.destPos = number + 1;
                    this.saveForm.destContent = this.saveForm.name + '_' + (this.saveForm.sourcePos)
                    this.submitForm[number] = Object.assign({}, this.submitForm[number], this.saveForm);
                    this.submitForm.splice(0, 0)
                }
            }
            this.currentSrcNode.id = data.matrixId;
            this.currentSrcNode.time = new Date().getTime();
        },
        // 双击中间框对应的事件
        activeDestScreen(number){
            if (!this.saveForm.destId) {
                this.$message({
                    message: '请选择目的矩阵',
                    type: 'warning'
                })
                return;
            }
            this.activeClassNum = number;
        },
        checkDest(number) {
            if (!this.saveForm.destId) {
                this.$message({
                    message: '请选择目的矩阵',
                    type: 'warning'
                })
                return;
            } else if (!this.saveForm.sourceId) {
                this.$message({
                    message: '请选择源矩阵',
                    type: 'warning'
                })
            } else if (!this.saveForm.sourcePos) {
                this.$message({
                    message: '请选择源矩阵通道',
                    type: 'warning'
                })
            } else {
                let flag = false
                this.submitForm.forEach(item => {
                    if (item.sourcePos == this.saveForm.sourcePos && item.sourceId == this.saveForm.sourceId) {
                        flag = true
                    }
                })
                if (!flag) {
                    this.saveForm.destPos = number + 1;
                    this.activeClassNum = number;
                    this.saveForm.destContent = this.saveForm.name + '_' + (this.saveForm.sourcePos)
                    this.submitForm[number] = Object.assign({}, this.submitForm[number], this.saveForm);
                    this.submitForm.splice(0, 0)
                }
            }
            
        },
        // 深拷贝
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
    max-width: 360px;
    min-width: 360px;
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
.split-screen > .active {
    border: 1px solid #128bf1;
}
.split1 > div {
    width: 100%;
    height: 100%;
}
.split2 > div {
    width: 50%;
    height: 100%;
}
.split3 > div, .split4 > div {
    width: 50%;
    height: 50%;
}
.split5 > div, .split6 > div {
    width: 33.3%;
    height: 50%;
}
.split7 > div, .split8 > div, .split9 > div {
    width: 33.3%;
    height: 33.3%;
}
.matrix-tree-wrapper {
    overflow-y: auto;
    height: 160px;
}
.set-close {
    position: relative;
    float: right;
    top: 5px;
    right: 5px;
    font-size: 14px;
    color: #ddd;
}
</style>