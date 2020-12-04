<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="维修状态：">
                <el-select v-model="listQuery.status" placeholder="请选择维修状态" clearable>
                  <el-option
                    v-for="item in repairStatus"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
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
                <el-select v-model="listQuery.maintenance_type" placeholder="请选择维修类型" clearable>
                  <el-option
                    v-for="item in repairTypeList"
                    :key="item.label"
                    :label="item.maintenance_type"
                    :value="item.maintenance_type">
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
          <template slot-scope="scope">{{scope.row.remarks?scope.row.remarks:'-'}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

  import { searchRepairList, getRepairTypeList } from '@/api/repairInfo'
  import { formatDate } from '@/utils/date'

  const defaultListQuery = {
    status: '',
    rot_id: '',
    maintenance_type: '',
    timeValue: [],
    page: 1,
    limit: 5
  };
  const defaultParams = {
    status: '',
    rot_id: '',
    maintenance_type: '',
    start_time: '',
    end_time: '',
    page: 1,
    limit: 5
  }
  export default {
    name: "productList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        getListParams: Object.assign({}, defaultParams),
        repairList: [],
        total: null,
        listLoading: false,
        repairStatus: [{
          value: 0,
          label: '维修中'
        },{
          value: 1,
          label: '已完成'
        }],
        repairTypeList: []
      }
    },
    created() {
      this.defaultInit()
      this.getRepairDropDownList();
      this.getRepairList();
    },
    watch: {
    },
    filters: {

    },
    computed:{
      endDate() {
        return this.formatSelectDate(new Date());
      },
      startDate() {
        const start = new Date();
        const startDate = start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const startString = this.formatSelectDate(startDate);
        return startString;
      }
    },
    methods: {
      formatSelectDate(date) {
        if (date == null || date === '') {
          return '';
        }
        let unformatDate = null;
        if(date instanceof Date){
          unformatDate = date
        } else {
          unformatDate = new Date(date);
        }
        return formatDate(unformatDate, 'yyyy-MM-dd')
      },
      defaultInit() {
        this.listQuery.timeValue?this.listQuery.timeValue[0] = this.startDate:this.listQuery.timeValue=[];
        this.listQuery.timeValue?this.listQuery.timeValue[1] = this.endDate:this.listQuery.timeValue=[];
        this.getListParams.start_time = this.startDate;
        this.getListParams.end_time = this.endDate;
      },
      getRepairDropDownList(){
        getRepairTypeList().then(response => {
          console.log(response)
          this.repairTypeList = response.result;
        });
      },
      getRepairList() {
        searchRepairList(this.getListParams).then(response=>{
          this.repairList = response.result
          this.total = response.total
          this.listLoading = false
        })
      },
      handleSearchList() {
        this.settingSearchParams();
        this.getRepairList();
      },
      settingSearchParams(){
        this.listQuery.page = 1;
        for (const key in this.listQuery) {
          if(this.getListParams.hasOwnProperty(key)){
          this.getListParams[key] = this.listQuery[key]
          }
        }
        this.getListParams.start_time = this.listQuery.timeValue?this.listQuery.timeValue[0]:''
        this.getListParams.end_time = this.listQuery.timeValue?this.listQuery.timeValue[1]:''
      },
      handleResetSearch() {
        this.selectMachineValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleCreateBill() {
        this.$router.push({path:'/quality/repairCreate'});
      },

      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getListParams.page = 1;
        this.getListParams.limit = val;
        this.getRepairList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getListParams.page = val;
        this.getRepairList();
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


