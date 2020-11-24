<template> 
  <el-card class="batch-operate-container" shadow="never">
    <el-form :model="listQuery" ref="from" label-width="150px">
      <el-form-item label="指标类型：" prop="type">
        <el-select v-model="listQuery.type" placeholder="请选择指标类型" clearable>
          <el-option
            v-for="item in pointTypeList"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：" prop="time">
        <template>
          <el-checkbox-group v-model="listQuery.period" size="medium" @change="handleDateTabChange" :disabled="listQuery.timeValue&&listQuery.timeValue.length!=0">
            <el-checkbox-button v-for="date in dateList" :label="date.value" :key="date.label">{{date.label}}</el-checkbox-button>
          </el-checkbox-group>
          <div class="date-group">
            <el-date-picker
              v-model="listQuery.timeValue"
              :disabled="listQuery.period&&listQuery.period.length!=0"
              :change="handleDatePickerChange"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至">
            </el-date-picker>
          </div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('from')">保存</el-button>
        <el-button @click="resetForm('from')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import { settingDashboardConfig,getDashboardConfig } from '@/api/configSettings'
  import { formatDate } from '@/utils/date'
  const defaultListQuery = {
    type: {
      value: 'yc',
      label:'电清切疵总数( YC )'
    },
    period: [],
    timeValue: []
  };
  const defaultParams = {
    type: 'yc',
    start_time: '',
    end_time: '',
    period: ''
  };
  export default {
    name: 'dashboardSetting',

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
        dateList: [
          {
            value: '-1',
            label:'上一批次'
          },
          {
            value: '0',
            label:'当天'
          },
          {
            value: '1',
            label:'前一天'
          },
          {
            value: '3',
            label:'最近三天'
          },
          {
            value: '7',
            label:'最近一周'
          },
        ]
      }
    },
    created() {
      console.log(this.listQuery)
      getDashboardConfig({type: this.getListParams.type}).then(response=>{
        console.log(response)
        this.handleGetConfig(response.result)
      })
    },
    methods: {
      handleGetConfig(params){
        this.getListParams.start_time = this.formatSelectDate(params.start_time)
        this.getListParams.end_time = this.formatSelectDate(params.end_time)
        let dateArr = [this.getListParams.start_time,this.getListParams.end_time]
        this.listQuery.timeValue=dateArr
        console.log(this.listQuery)
      },
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
      onSubmit(formName) {
        this.settingSearchParams()
        settingDashboardConfig(this.getListParams).then(response => {
          console.log(response)
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.brand = Object.assign({}, defaultRepair);
      },
      handleDateTabChange(arr){
        console.log(arr)
        if(arr.length > 1){
          arr.shift()
        } else if(arr.length == 0){
          this.listQuery.period = []
          this.getListParams.period = ''
        }
        this.listQuery.timeValue = []
        this.getListParams.start_time = ''
        this.getListParams.end_time = ''
      },
      handleDatePickerChange(){
        this.listQuery.period = []
        this.getListParams.period = ''
      },
      settingSearchParams(){
        this.getListParams.type = this.listQuery.type.value
        if(this.listQuery.timeValue&&this.listQuery.timeValue.length!=0){
          this.getListParams.start_time = this.listQuery.timeValue[0]
          this.getListParams.end_time = this.listQuery.timeValue[1]
        } else if(this.listQuery.period&&this.listQuery.period.length!=0){
          this.getListParams.period = this.listQuery.period[0]
        } else {
          return
        }
        console.log(this.getListParams)
        console.log(this.listQuery)
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.date-group{
  margin: 20px 0;
  .el-input__inner {
    width: 100%;
  }
}
</style>


