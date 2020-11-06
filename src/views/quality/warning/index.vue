<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="repair" :rules="rules" ref="repairFrom" label-width="150px">
      <el-form-item label="维修单编号：" prop="repairId">
        <el-input v-model="repair.repairId"></el-input>
      </el-form-item>
      <el-form-item label="维修单类型：" prop="type">
        <el-checkbox-group class="repair-checkbox" v-model="repair.checkList" @change="handleChange">
          <el-checkbox :label="item.label" v-for="item of repairTypeList" :key="item.label"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="维修单明细：" prop="detail">
        <el-select v-model="repair.detail" placeholder="请选择机器号" clearable>
          <el-option
            v-for="item in 5"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维修内容：">
        <el-input
          placeholder="请输入维修内容"
          type="textarea"
          :rows="3"
          v-model="repair.text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('repairFrom')">报修</el-button>
        <el-button v-if="!isEdit" @click="resetForm('repairFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

  import warningListMockData from '@/mock/warningList.js'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    pointType: {
      value:0,
      label:'电清切疵总数( YC )'
    },
    warningGrades: null,
    machineIds: null,
    timeValue: null,
    classesNo: null
  };
  export default {
    name: "productList",
    data() {
      return {
        warningListMockData,
        listQuery: Object.assign({}, defaultListQuery),
        pointTypeList: [{
          value:0,
          label:'电清切疵总数( YC )'
        },{
          value:1,
          label:'接头数( PI )'
        },{
          value:2,
          label:'效率( EFF )'
        },{
          value:3,
          label:'异常班次( SH )'
        },{
          value:4,
          label:'停止纱锭( SS )'
        }],
        warningList: [],
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
        this.warningList = [];
        for (let i = 0; i < 20; i++) {
          this.warningList.push(this.warningListMockData);
          this.total = 50;
        }
        console.log(this.warningList)
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


