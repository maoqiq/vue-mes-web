<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="气流纺机编号：">
                <el-select v-model="listQuery.machine_id" multiple placeholder="请选择气流纺机" clearable>
                  <el-option
                    v-for="item in machineOptions"
                    :key="item.device_id"
                    :label="item.device_name"
                    :value="item.device_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提交时间：">
                <el-date-picker
                  v-model="listQuery.timeValue"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="班次编号：">
                <el-select v-model="listQuery.shift_id" placeholder="全部" clearable>
                  <el-option
                    v-for="item in shiftOptions"
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
                :data="machineList"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="气流纺机序号" width="130" align="center">
          <template slot-scope="scope">{{scope.row.machine_id}}</template>
        </el-table-column>
        <el-table-column label="时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.date|formatDate}}</template>
        </el-table-column>
        <el-table-column label="班次" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.shift_id}}
          </template>
        </el-table-column>
        <el-table-column label="品种" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.variety}}
          </template>
        </el-table-column>
        <el-table-column label="效率" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.eff}}
          </template>
        </el-table-column>
        <el-table-column label="产量 ( 千克 ) " width="150" align="center">
          <template slot-scope="scope">{{scope.row.output}}</template>
        </el-table-column>
        <el-table-column label="接头数" width="140" align="center">
          <template slot-scope="scope">{{scope.row.PI}}</template>
        </el-table-column>
        <el-table-column label="设备状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row.device_status}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleJumpOriginData(scope.$index, scope.row)">查看原数据
            </el-button>
            <el-button
              size="mini" type="primary"
              @click="handleJumpSpindleList(scope.$index, scope.row)">查看纱锭
            </el-button>
          </template>
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

import { machineDropDown, getMachineList } from '@/api/machinePanelList'
import { formatDate } from '@/utils/date'

  const defaultListQuery = {
    machine_id: [],
    shift_id: null,
    timeValue: [],
    page: 1,
    limit: 5
  };
  const defaultParams = {
    machine_id: [],
    shift_id: null,
    start_time: '',
    end_time: '',
    page: 1,
    limit: 5
  }
  export default {
    name: "machineList",
    data() {
      return {
        // machineListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        getListParams: Object.assign({}, defaultParams),
        machineList: [],
        total: null,
        listLoading: false,
        // selectMachineValue: null,
        multipleSelection: [],
        machineOptions: [],
        shiftOptions: [{
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }, {
          value: 4,
          label: '4'
        }]
      }
    },
    created() {
      this.initDate();
      console.log(this.listQuery)
      this.getMachineDropDownList();
      this.getMachineTableList();
    },
    watch: {
    },
    filters: {
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
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
      initDate() {
        this.listQuery.timeValue?this.listQuery.timeValue[0] = this.startDate:this.listQuery.timeValue=[];
        this.listQuery.timeValue?this.listQuery.timeValue[1] = this.endDate:this.listQuery.timeValue=[];
        this.getListParams.start_time = this.startDate;
        this.getListParams.end_time = this.endDate;
      },
      getMachineTableList() {
        getMachineList(this.getListParams).then(response => {
          console.log(response)
          this.machineList = response.result
          this.total = response.total
          this.listLoading = false;
        });
      },
      getMachineDropDownList() {
        this.machineOptions = [];
        machineDropDown().then(response => {
          console.log(response)
          this.machineOptions = response.result;
        });
      },

      handleSearchList() {
        this.settingSearchParams();
        this.getMachineTableList();
      },

      handleResetSearch() {
        this.selectMachineValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getListParams = Object.assign({}, defaultParams)
      },
      settingSearchParams(){
        this.listQuery.page = 1;
        for (const key in this.listQuery) {
          if(this.getListParams.hasOwnProperty(key)){
          this.getListParams[key] = this.listQuery[key]
          }
        }
        this.getListParams.start_time = this.listQuery.timeValue?this.listQuery.timeValue[0]:'',
        this.getListParams.end_time = this.listQuery.timeValue?this.listQuery.timeValue[1]:'',
        console.log(this.getListParams)
      },

      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getMachineTableList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getMachineTableList();
      },
      handleJumpOriginData(index,row){
        console.log("handleShowOriginData",row);
        const sourceDate = this.formatSelectDate(row.date);
        this.$router.push({path:'/quality/sourceData',query:{machine_id: row.machine_id,shift_id: row.shift_id,date: sourceDate}})
      },
      handleJumpSpindleList(index,row){
        this.getListParams.machine_id = [row.machine_id];
        this.$router.push({path:'/quality/spindle',query:this.getListParams});
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


