<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
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
            <el-col :span="10">
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
          </el-row>
          <el-row :gutter="20">
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
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="锭位号码（ROT）" width="150" align="center">
          <template slot-scope="scope">{{scope.row.rotId}}</template>
        </el-table-column>
        <el-table-column label="状态" width="128" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            {{scope.row.date}}
          </template>
        </el-table-column>
        <el-table-column label="班次" width="128" align="center">
          <template slot-scope="scope">
            {{scope.row.classes}}
          </template>
        </el-table-column>
        <el-table-column label="电清切疵总数（YC）" width="160" align="center">
          <template slot-scope="scope">
            {{scope.row.ycSum}}
          </template>
        </el-table-column>
        <el-table-column label="接头数（PI）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.piSum}}</template>
        </el-table-column>
        <el-table-column label="效率（EFF）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.effSum}}</template>
        </el-table-column>
        <el-table-column label="异常班次（SH）" width="128" align="center">
          <template slot-scope="scope">{{scope.row.shSum}}</template>
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus
  } from '@/api/product'
  import {fetchList as fetchSkuStockList,update as updateSkuStockList} from '@/api/skuStock'
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchListWithChildren} from '@/api/productCate'
  import spindleListMockData from '@/mock/spindleList.js'

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
    name: "spindleList",
    data() {
      return {
        spindleListMockData,
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
        for (let i = 0; i < 20; i++) {
          this.spindleList.push(this.spindleListMockData);
          this.total = 50;
        }
        console.log(this.spindleList)
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


