<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="info-title">基本信息：（最近7班次信息）</div>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="spindleList"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="锭位号码（ROT）" width="150" align="center">
          <template slot-scope="scope">{{scope.row.rot}}</template>
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
          <template slot-scope="scope">{{scope.row.cv}}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="repair-container" shadow="never">
      <p>维修历史：</p>
      <el-table ref="productTable"
                :data="repairHistoryList"
                style="width: 100%"
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

  import { getSpindleDetail } from '@/api/spindlePanelList'
  import { searchRepairList } from '@/api/repairInfo'

  const defaultRepairParams = {
    rot_id: null,
    maintenance_type: 'spindle',
  };
  export default {
    name: "productList",
    data() {
      return {
        spindleList: [],
        repairInfoParams: Object.assign({},defaultRepairParams),
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
      this.getSpindleDetailInfo()
    },
    watch: {
    },
    filters: {

    },
    methods: {
      getSpindleDetailInfo() {
        this.repairInfoParams.rot_id = Number(this.$route.query.id)
        this.spindleList = [];
        this.repairHistoryList = [];
        this.listLoading = true;
        getSpindleDetail({rot_id:this.repairInfoParams.rot_id}).then(response => {
          this.spindleList = response.result
          this.listLoading = false
        });
        searchRepairList(this.repairInfoParams).then(response=>{
          this.repairHistoryList = response.result
          this.listLoading = false
        })
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
    padding: 0 18px;
  }
}
.table-container{
  margin: 20px 0;
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


