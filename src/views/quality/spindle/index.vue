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
            <el-col :span="7">
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
            <el-col :span="9">
              <el-form-item label="纱锭编号：">
                <el-input style="width: 203px" v-model="listQuery.rot_id" placeholder="请输入纱锭编号"></el-input>
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
                :data="spindleList"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="锭位号码（ROT）" width="150" align="center">
          <template slot-scope="scope">{{scope.row.rot_id}}</template>
        </el-table-column>
        <el-table-column label="状态" width="128" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="预警等级" width="128" align="center">
          <template slot-scope="scope">
            <div class="alarm-shape"
              :class="{
                'alarm-level-1':scope.row.alarm_level==1,
                'alarm-level-2':scope.row.alarm_level==2,
                'alarm-level-3':scope.row.alarm_level==3}">
            </div>
            <span>{{scope.row.alarm_level+'级'}}</span></template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            {{scope.row.date|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="班次" width="128" align="center">
          <template slot-scope="scope">
            {{scope.row.shift_id}}
          </template>
        </el-table-column>
        <el-table-column label="电清切疵总数（YC）" width="160" align="center">
          <template slot-scope="scope">
            {{scope.row.yc}}
          </template>
        </el-table-column>
        <el-table-column label="接头数（PI）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.pi}}</template>
        </el-table-column>
        <el-table-column label="效率（EFF）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.eff}}</template>
        </el-table-column>
        <el-table-column label="异常班次（SH）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.sh}}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleJumpDetail(scope.$index, scope.row)">查看详情
            </el-button>
            <el-button
              size="mini" type="primary"
              @click="handleCreateRepair(scope.$index, scope.row)">报修
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
import { getSpindleList } from '@/api/spindlePanelList'
import { machineDropDown } from '@/api/machinePanelList'
import { formatDate } from '@/utils/date'

  const defaultListQuery = {
    machine_id: null,
    rot_id:null,
    shift_id: null,
    timeValue: [],
    page: 1,
    limit: 5
  };
  const defaultParams = {
    machine_id: null,
    rot_id:null,
    shift_id: null,
    start_time: '',
    end_time: '',
    page: 1,
    limit: 5
  }
  export default {
    name: "spindleList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        getListParams: Object.assign({}, defaultParams),
        spindleList: [],
        total: null,
        listLoading: false,
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
      this.defaultInit()
      this.getMachineDropDownList()
      this.getSpindleTableList()
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
        this.listQuery.timeValue?this.listQuery.timeValue[0] = this.startDate:this.listQuery.timeValue=[];
        this.listQuery.timeValue?this.listQuery.timeValue[1] = this.endDate:this.listQuery.timeValue=[];
        this.getListParams.start_time = this.startDate;
        this.getListParams.end_time = this.endDate;
        if(this.$route.query){
          this.getListParams.machine_id = this.$route.query.machine_id
          this.getListParams.shift_id = this.$route.query.shift_id
          this.listQuery.machine_id = this.$route.query.machine_id
          this.listQuery.shift_id = this.$route.query.shift_id
        }
      },
      getSpindleTableList() {
        this.listLoading = true;
        getSpindleList(this.getListParams).then(response => {
          console.log(response)
          this.spindleList = response.result
          this.total = response.total
          this.listLoading = false
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
        this.getSpindleTableList();
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
        this.getListParams.start_time = this.listQuery.timeValue?this.listQuery.timeValue[0]:''
        this.getListParams.end_time = this.listQuery.timeValue?this.listQuery.timeValue[1]:''
        console.log(this.getListParams)
      },

      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getSpindleTableList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getSpindleTableList();
      },

      handleJumpDetail(index,row){
        console.log("handleShowOriginData",row);
        console.log("handleShowOriginData",index);
        this.$router.push({path:'/quality/spindleDetail',query:{id:row.rot_id}})
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
.alarm-shape{
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f2f2f2;
  margin-right: 8px;
}
.alarm-level-1{
  background: #ee2513;
}
.alarm-level-2{
  background: #FF9800;
}
.alarm-level-3{
  background: #fce24f;
}
</style>


