<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px" :label-position="'right'">
          <el-row class="info" :gutter="20">
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
            <el-col :span="9">
              <el-form-item label="纱锭编号：">
                <el-input style="width: 203px" v-model="listQuery.spindleNo" placeholder="纱锭编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
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
      <div class="info-title">基本信息：（最近7班次信息）</div>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="spindleList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="班次" width="120" align="center">
          <template slot-scope="scope">{{scope.row.classes}}</template>
        </el-table-column>
        <el-table-column label="时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.date}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="电清切疵总数(YC)" width="160" align="center">
          <template slot-scope="scope">
            {{scope.row.yc}}
          </template>
        </el-table-column>
        <el-table-column label="接头数(PI)" align="center">
          <template slot-scope="scope">
            {{scope.row.pi}}
          </template>
        </el-table-column>
        <el-table-column label="效率(EFF)" align="center">
          <template slot-scope="scope">
            {{scope.row.eff}}
          </template>
        </el-table-column>
        <el-table-column label="异常班次(SH)" align="center">
          <template slot-scope="scope">{{scope.row.sh}}</template>
        </el-table-column>
        <el-table-column label="中断次数(SLT)" align="center">
          <template slot-scope="scope">{{scope.row.slt}}</template>
        </el-table-column>
        <el-table-column label="云斑/条子造成的停止(MVVC)" width="220" align="center">
          <template slot-scope="scope">{{scope.row.mvvc}}</template>
        </el-table-column>
        <el-table-column label="粗节/细节和CV锁住(+-V)" width="180" align="center">
          <template slot-scope="scope">{{scope.row.v}}</template>
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
    <el-card class="repair-container" shadow="never">
      <p>维修历史：</p>
      <el-table ref="productTable"
                :data="repairHistoryList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="维修单编号" align="center">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column label="维修时间" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="维修内容" align="center">
          <template slot-scope="scope">
            {{scope.row.remarks}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>

  import spindleListDetailMockData from '@/mock/spindleListDetail.js'
  import repairHistoryListMockData from '@/mock/repairList.js'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    machineIds: null,
    timeValue: null,
    classesNo: null,
    spindleNo:null
  };
  export default {
    name: "productList",
    data() {
      return {
        spindleListDetailMockData,
        repairHistoryListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        spindleList: [],
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
        this.spindleList = [];
        for (let i = 0; i < 7; i++) {
          this.spindleList.push(this.spindleListDetailMockData);
          this.total = 7;
        }
        console.log(this.spindleList)
        this.repairHistoryList = [];
        for (let i = 0; i < 4; i++) {
          this.repairHistoryList.push(this.repairHistoryListMockData);
          this.total = 4;
        }
        // this.listLoading = true;
        // fetchList(this.listQuery).then(response => {
        //   this.listLoading = false;
        //   this.spindleList = response.data.list;
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
        this.$router.push({path:'/quality/sourceData',query:{id:row.id}})
      },
      handleCreateRepair(index,row){
        this.$router.push({path:'/quality/spindle',query:{id:row.id}});
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.filter-container{
  .submit-group{
    display: flex;
  }
  .info-title{
    width: 100%;
    border-top: 1px solid #f2f2f2;
    padding: 18px 18px 0;
  }
}
.pagination-container{
  display: block;
  float: none;
  text-align: right;
  margin: 18px;
}
.repair-container{
  padding: 0 18px;
}
</style>


