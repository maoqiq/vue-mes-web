<template> 
  <div class="app-container">
    <el-card class="filter-container margin-bottom" shadow="never">
      <div class="form-search" style="margin-top: 10px">
        <el-form :inline="true"  ref="sourceForm" :rules="rules" :model="listQuery" size="small" label-width="160px" :label-position="'right'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="所属气流纺机编号：" prop="machine_id">
                <el-select v-model="listQuery.machine_id" placeholder="请选择气流纺机" clearable>
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
              <el-form-item label="提交时间：" prop="date">
                <el-date-picker
                  v-model="listQuery.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="班次编号：" prop="shift_id">
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
    <el-card class="margin-bottom">
      <div class="info-container">
        <p>SHIFT REPORT</p>
        <source-tab :item="items&&items.SHIFT_REPORT"></source-tab>
      </div>
    </el-card>
    <el-card>
      <el-tabs v-model="tabsActiveName" @tab-click="handleClick">
        <el-tab-pane label="PRODUCTION PARAMETER" name="first"><source-tab :item="items&&items.PRODUCTION_PARAMETER"></source-tab></el-tab-pane>
        <el-tab-pane label="PRODUCTION DATA" name="second"><source-tab :item="items&&items.PRODUCTION_DATA"></source-tab></el-tab-pane>
        <el-tab-pane label="SECTION DATA" name="fourth"><source-tab :item="items&&items.SECTION_DATA"></source-tab></el-tab-pane>
        <el-tab-pane label="QUALITY DATA" name="fifth"><source-tab :item="items&&items.QUALITY_DATA"></source-tab></el-tab-pane>
        <el-tab-pane label="OFF-STANDARD" name="sixth"><source-tab :item="items&&items.OFF_STANDARD"></source-tab></el-tab-pane>
        <el-tab-pane label="REFERENCE" name="seventh"><source-tab :item="items&&items.REFERENCE"></source-tab></el-tab-pane>
        <el-tab-pane label="YM LOCKS" name="eighth"><source-tab :item="items&&items.YM_LOCKS"></source-tab></el-tab-pane>
        <el-tab-pane label="ERRORS" name="nineth"><source-tab :item="items&&items.ERRORS"></source-tab></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>

  import SourceTab from './components/SourceTab'
  import { machineDropDown } from '@/api/machinePanelList'
  import { getSourceData } from '@/api/sourceData'

  const defaultListQuery = {
    machine_id: '',
    shift_id: '',
    date: ''
  };
  export default {
    name: "sourceData",
    components: { SourceTab },
    data() {
      return {
        rules: {
          machine_id: {required: true, message: '请选择气流纺机', trigger: 'blur'},
          date: {required: true, message: '请选择日期', trigger: 'blur'},
          shift_id: {required: true, message: '请选择班次编号', trigger: 'blur'}
        },
        listQuery: Object.assign({}, defaultListQuery),
        machineList: [],
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
        }],
        tabsActiveName: 'first',
        items: null
      }
    },
    created() {
      console.log(this.listQuery)
      this.getMachineDropDownList()
      this.getSourceDataWithRouteParams()
    },
    watch: {
    },
    filters: {

    },
    methods: {
      getSourceDataInfo() {
        this.$refs.sourceForm.validate(valid => {
          if (valid) {
            getSourceData(this.listQuery).then(response => {
                console.log(response.result)
                this.items = response.result[0]
              });
          }
        })
      },
      getSourceDataWithRouteParams(){
        const routeParams = this.$route.query
        if(routeParams){
          this.listQuery = routeParams
          getSourceData(this.listQuery).then(response => {
            console.log(response.result)
            this.items = response.result[0]
          });
        }
      },
      getMachineDropDownList() {
        this.machineOptions = [];
        machineDropDown().then(response => {
          console.log(response)
          this.machineOptions = response.result;
        });
      },
      // TODO get each source data

      handleSearchList() {
        this.getSourceDataInfo();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },

      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.margin-bottom{
  margin-bottom: 20px;
}
.filter-container{
  .submit-group{
    display: flex;
  }
}
.info-container{
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  p{
    margin-right: 20px;
  }
}
</style>


