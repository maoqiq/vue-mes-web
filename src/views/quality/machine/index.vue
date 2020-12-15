<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="getListParams" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="气流纺机编号：">
                <el-select v-model="getListParams.machine_id" multiple placeholder="请选择气流纺机" clearable>
                  <el-option
                    v-for="item in machineOptions"
                    :key="item.device_id"
                    :label="item.device_name"
                    :value="item.device_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提交时间：">
                <el-date-picker
                  v-model="getListParams.start_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始日期">
                </el-date-picker>
                &nbsp;至&nbsp;
                <el-date-picker
                  v-model="getListParams.end_time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="班次编号：">
                <el-select v-model="getListParams.shift_id" placeholder="全部" clearable>
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
        :page-size="getListParams.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="getListParams.page"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import { machineDropDown, getMachineList } from '@/api/machinePanelList'
import { formatDate } from '@/utils/date'

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
        getListParams: Object.assign({}, defaultParams),
        machineList: [],
        total: null,
        listLoading: false,
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
      this.defaultInit();
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
      defaultInit() {
        if(this.$route.query){
          console.log(this.$route.query)
          this.getListParams = this.$route.query
        }
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
        this.getMachineTableList();
      },

      handleResetSearch() {
        this.selectMachineValue = [];
        this.getListParams = Object.assign({}, defaultParams)
      },

      handleSizeChange(val) {
        this.getListParams.page = 1;
        this.getListParams.limit = val;
        this.getListParams.page = 1;
        this.getListParams.limit = val;
        this.getMachineTableList();
      },
      handleCurrentChange(val) {
        this.getListParams.page = val;
        this.getListParams.page = val;
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


