<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="所属气流纺机编号：">
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
            <el-col :span="16">
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
    <el-card class="info-container">
      <p>INTERMEDIATE REPORT</p>
    </el-card>
    <el-card class="-container">
      <el-tabs v-model="tabsActiveName" @tab-click="handleClick">
        <el-tab-pane label="PRODUCTION PARAMETER" name="first"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="PRODUCTION DATA" name="second"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="SECTION DATA" name="third"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="QUALITY DATA" name="fourth"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="OFF-STANDARD" name="fifth"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="REFERENCE" name="sixth"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="YM LOCKS" name="seventh"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
        <el-tab-pane label="ERRORS" name="eighth"><source-tab :items="machineListMockData"></source-tab></el-tab-pane>
      </el-tabs>
    </el-card>
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
  import SourceTab from './components/SourceTab'
  import machineListMockData from '@/mock/machineList.js'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    machineIds: null,
    timeValue: null,
    classesNo: null
  };
  export default {
    name: "sourceData",
    components: { SourceTab },
    data() {
      return {
        machineListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        machineList: [],
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
        }],
        tabsActiveName: 'first'
      }
    },
    created() {
      console.log(this.machineListMockData);
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
        this.machineList = [];
        for (let i = 0; i < 20; i++) {
          this.machineList.push(this.machineListMockData);
          this.total = 50;
        }
        console.log(this.machineList)
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
      // TODO get each source data

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

      handleJumpOriginData(index,row){
        console.log("handleShowOriginData",row);
        this.$router.push({path:'/quality/sourceData',query:{id:row.id}})
      },
      handleJumpSpindleList(index,row){
        this.$router.push({path:'/quality/spindle',query:{id:row.id}});
      },

      handleClick(tab, event) {
        console.log(tab, event);
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
.info-container{
  margin-top: 20px;

}
</style>


