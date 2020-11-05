<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="120px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="指标类型：">
                <el-select v-model="listQuery.pointType" placeholder="请选择指标类型" clearable>
                  <el-option
                    v-for="item in pointTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报警等级：">
                <el-select v-model="listQuery.warningGrades" multiple placeholder="请选择报警等级" clearable>
                  <el-option
                    v-for="item in 4"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="气流纺机编号：">
                <el-select v-model="listQuery.machineIds" multiple placeholder="请选择气流纺机" clearable>
                  <el-option
                    v-for="item in machineOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提交时间：">
                <el-date-picker
                  v-model="listQuery.timeValue"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="班次编号：">
                <el-select v-model="listQuery.classesNo" placeholder="全部" clearable>
                  <el-option
                    v-for="item in classesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <div class="submit-group">
                <el-row :gutter="20">
                  <el-button
                    @click="handleSearchList()"
                    type="primary"
                    size="small">
                    搜索
                  </el-button>
                  <el-button
                    @click="handleResetSearch()"
                    size="small">
                    清空条件
                  </el-button>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="warningList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="消息序号" width="130" align="center">
          <template slot-scope="scope">{{scope.row.msgId}}</template>
        </el-table-column>
        <el-table-column :label="listQuery.pointType.label" width="160" align="center">
          <template slot-scope="scope">{{scope.row.pointType}}</template>
        </el-table-column>
        <el-table-column label="报警等级" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.grade}}
          </template>
        </el-table-column>
        <el-table-column label="锭位号码(ROT)" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.rot}}
          </template>
        </el-table-column>
        <el-table-column label="所属气流纺机号" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.machineId}}
          </template>
        </el-table-column>
        <el-table-column label="所属班次号" width="140" align="center">
          <template slot-scope="scope">{{scope.row.classes}}</template>
        </el-table-column>
        <el-table-column label="接收时间" align="center">
          <template slot-scope="scope">
            {{scope.row.date}}
          </template>
        </el-table-column>
        <el-table-column label="消息状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row.msgStatus}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

  import warningListMockData from '@/mock/warningList.js'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    pointType: {
      value:0,
      label:'电清切疵总数( YC )'
    },
    warningGrades: null,
    machineIds: null,
    timeValue: null,
    classesNo: null
  };
  export default {
    name: "productList",
    data() {
      return {
        warningListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        pointTypeList: [{
          value:0,
          label:'电清切疵总数( YC )'
        },{
          value:1,
          label:'接头数( PI )'
        },{
          value:2,
          label:'效率( EFF )'
        },{
          value:3,
          label:'异常班次( SH )'
        },{
          value:4,
          label:'停止纱锭( SS )'
        }],
        warningList: [],
        total: null,
        listLoading: false,
        // selectMachineValue: null,
        multipleSelection: [],
        machineOptions: [],
        classesOptions: [{
          value: 0,
          label: '01'
        }, {
          value: 1,
          label: '02'
        }, {
          value: 2,
          label: '03'
        }, {
          value: 3,
          label: '04'
        }]
      }
    },
    created() {
      this.getList();
      this.getMachineNoList()
    },
    watch: {
      // selectMachineValue: function (newValue) {
      //   if (newValue != null && newValue.length == 2) {
      //     this.listQuery.machineIds = newValue[1];
      //   } else {
      //     this.listQuery.machineIds = null;
      //   }

      // }
    },
    filters: {

    },
    methods: {
      getList() {
        this.warningList = [];
        for (let i = 0; i < 20; i++) {
          this.warningList.push(this.warningListMockData);
          this.total = 50;
        }
        console.log(this.warningList)
        // this.listLoading = true;
        // fetchList(this.listQuery).then(response => {
        //   this.listLoading = false;
        //   this.machineList = response.data.list;
        //   this.total = response.data.total;
        // });
      },
      getMachineNoList() {
        this.machineOptions = [];
        for (let index = 0; index < 28; index++) {
          this.machineOptions.push({label: `${index+1}号机器`, value: index+1});
        }
        // fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        //   this.machineOptions = [];
        //   let brandList = response.data.list;
        //   for (let i = 0; i < brandList.length; i++) {
        //     this.machineOptions.push({label: brandList[i].name, value: brandList[i].id});
        //   }
        // });
      },

      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleResetSearch() {
        this.selectMachineValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

      handleJumpDetail(index,row){
        console.log("handleShowOriginData",row);
        this.$router.push({path:'/quality/spindleDetail',query:{id:row.id}})
      },
      handleCreateRepair(index,row){
        this.$router.push({path:'/quality/repairCreate',query:{id:row.id}});
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.filter-container{
  .submit-group{
    display: flex;
  }
}
</style>


