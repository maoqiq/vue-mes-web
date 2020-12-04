<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="120px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="指标类型：">
                <el-select v-model="listQuery.pointType" placeholder="请选择指标类型" @change="searchByType" clearable>
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
                <el-select v-model="listQuery.alarm_level" multiple placeholder="请选择报警等级" clearable>
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
                <el-select v-model="listQuery.shift_id" placeholder="全部" clearable>
                  <el-option
                    v-for="item in 4"
                    :key="item"
                    :label="item"
                    :value="item">
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
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="消息序号" align="center">
          <template slot-scope="scope">{{scope.row.message_id}}</template>
        </el-table-column>
        <el-table-column :label="listQuery.pointType.label" align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>
        <el-table-column label="报警等级" align="center">
          <template slot-scope="scope">
            {{scope.row.alarm_level}}
          </template>
        </el-table-column>
        <el-table-column label="锭位号码(ROT)" align="center">
          <template slot-scope="scope">
            {{scope.row.rot_id}}
          </template>
        </el-table-column>
        <el-table-column label="所属气流纺机号" align="center">
          <template slot-scope="scope">
            {{scope.row.machine_id}}
          </template>
        </el-table-column>
        <el-table-column label="所属班次号" align="center">
          <template slot-scope="scope">{{scope.row.shift_id}}</template>
        </el-table-column>
        <el-table-column label="接收时间" width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.alarm_time|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="消息状态" align="center">
          <template slot-scope="scope">{{scope.row.message_status}}</template>
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

  import { machineDropDown } from '@/api/machinePanelList'
  import { getWarningList } from '@/api/warningList'
  import { formatDate } from '@/utils/date'
  const defaultListQuery = {
    pointType: {
      value: 'yc',
      label:'电清切疵总数( YC )'
    },
    alarm_level: '',
    machine_id: [],
    shift_id: null,
    timeValue: [],
    page: 1,
    limit: 5
  };
  const defaultParams = {
    indicate_type: 'yc',
    alarm_level: '',
    machine_id: [],
    shift_id: null,
    start_time: '',
    end_time: '',
    page: 1,
    limit: 5
  };
  export default {
    name: "productList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        getListParams: Object.assign({}, defaultParams),
        pointTypeList: [{
          value: 'yc',
          label:'电清切疵总数( YC )'
        },{
          value: 'pi',
          label:'接头数( PI )'
        },{
          value: 'eff',
          label:'效率( EFF )'
        },{
          value: 'sh',
          label:'异常班次( SH )'
        },{
          value: 'stopped sp',
          label:'停止纱锭( STOPPED SP )'
        }],
        warningList: [],
        total: null,
        listLoading: false,
        // selectMachineValue: null,
        multipleSelection: [],
        machineOptions: []
      }
    },
    created() {
      this.initDate();
      console.log(this.getListParams)
      this.getMachineDropDownList();
      this.getWarningTableList();
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
      getWarningTableList() {
        this.warningList = [];
        getWarningList(this.getListParams).then(response => {
          console.log(response)
          this.warningList = response.result
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
      searchByType(val){
        this.getListParams.indicate_type = val.value
        this.handleSearchList();
      },
      handleSearchList() {
        this.settingSearchParams();
        this.getWarningTableList();
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
      handleResetSearch() {
        this.selectMachineValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        // this.getListParams = Object.assign({}, defaultParams);
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getListParams.page = 1;
        this.getListParams.limit = val;
        this.getWarningTableList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getListParams.page = val;
        this.getWarningTableList();
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
