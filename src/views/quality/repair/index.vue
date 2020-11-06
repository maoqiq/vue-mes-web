<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="维修状态：">
                <el-select v-model="listQuery.repairStatus" placeholder="请选择维修状态" clearable>
                  <el-option
                    v-for="item in repairStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="时间：">
                <el-date-picker
                  v-model="listQuery.timeValue"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item label="维修类型：">
                <el-select v-model="listQuery.repairType" placeholder="请选择维修类型" clearable>
                  <el-option
                    v-for="item in repairTypeList"
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
            <el-col :span="5">
              <el-button
                    @click="handleCreateBill()"
                    size="small" plain>
                    新建维修单
                  </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="repairList"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="维修单编号" align="center">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column label="维修类型" align="center">
          <template slot-scope="scope">{{scope.row.maintenance_type}}</template>
        </el-table-column>
        <el-table-column label="维修详情" align="center">
          <template slot-scope="scope">
            {{scope.row.maintenance_detail}}
          </template>
        </el-table-column>
        <el-table-column label="维修状态" align="center">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column label="维修人员" align="center">
          <template slot-scope="scope">
            {{scope.row.maintenance_worker}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.remarks}}</template>
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

  import repairListMockData from '@/mock/repairList.js'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    repairStatus: null,
    timeValue: null,
    repairType: null
  };
  export default {
    name: "productList",
    data() {
      return {
        repairListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        repairList: [],
        total: null,
        listLoading: false,
        // selectMachineValue: null,
        multipleSelection: [],
        machineOptions: [],
        repairStatus: [{
          value: 0,
          label: '维修中'
        },{
          value: 0,
          label: '已完成'
        }],
        repairTypeList: [{
          value: 0,
          label: '纱锭'
        },{
          value: 0,
          label: '机器'
        },{
          value: 0,
          label: '其他'
        }],
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
      console.log(this.machineListMockData);
      this.getList();
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
        this.repairList = [];
        for (let i = 0; i < 20; i++) {
          this.repairList.push(this.repairListMockData);
          this.total = 20;
        }
        // this.listLoading = true;
        // fetchList(this.listQuery).then(response => {
        //   this.listLoading = false;
        //   this.machineList = response.data.list;
        //   this.total = response.data.total;
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
      handleCreateBill() {
        this.$router.push({path:'/quality/repairCreate'});
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
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


