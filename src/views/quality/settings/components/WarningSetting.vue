<template> 
  <el-card class="batch-operate-container" shadow="never">
    <el-form :model="listQuery" ref="form" label-position="right" label-width="120px">
      <el-form-item label="指标类型：">
        <el-select v-model="listQuery.type" placeholder="请选择指标类型" clearable>
          <el-option
            v-for="item in pointTypeList"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警等级：">
        <el-select v-model="listQuery.level" placeholder="请选择预警等级" @change="levelChange" clearable>
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.value"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警阈值：" prop="detail">
        <el-col :span="8">
          <el-input type="number" v-model="listQuery.lo_limit" @change="loLimitChange"></el-input>
        </el-col>
        <el-col class="line" :span="4">--</el-col>
        <el-col :span="8">
          <el-input type="number" v-model="listQuery.hi_limit" @change="hiLimitChange"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="预警配置详情：">
        <template>
          <div v-for="(item,key) in levelParams" :key="key">
            <div v-if="key!='type'">
              <span>{{key}}: </span>
              <span>{{item.lo_limit}}</span> --
              <span>{{item.hi_limit}}</span>
            </div>
          </div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="onSubmit()">保存</el-button>
        <el-button size="medium" @click="handleReset()">清空条件</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import { settingWarningConfig, getWarningConfig } from '@/api/configSettings'

  const defaultListQuery = {
    type: {
      value: 'yc',
      label:'电清切疵总数( YC )'
    },
    level: 'p1',
    lo_limit: 80,
    hi_limit: 90
  };
  const defaultLevelParams = {
    type: 'yc',
    p1:{
      lo_limit: 80,
      hi_limit: 100
    },
    p2:{
      lo_limit: 60,
      hi_limit: 80
    },
    p3:{
      lo_limit: 40,
      hi_limit: 60
    }
  }
  export default {
    name: 'warningSetting',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        levelParams: Object.assign({}, defaultLevelParams),
        currentLevel: 'p1',
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
        levelList: [{
          value: 'p1',
          config: {
            lo_limit: 80,
            hi_limit: 100
          }
        },{
          value: 'p2',
          config: {
            lo_limit: 60,
            hi_limit: 80
          }
        },{
          value: 'p3',
          config: {
            lo_limit: 40,
            hi_limit: 60
          }
        }]
      }
  },
  created() {
    console.log(this.levelParams)
    getWarningConfig({type: this.levelParams.type}).then(response=>{
      console.log(response)
      // this.handleGetConfig(response.result)
    })
  },
  methods: {
    onSubmit() {
      this.levelParams.type = this.listQuery.type.value
      console.log(this.levelParams)
      settingWarningConfig(this.levelParams).then(response => {
        console.log(response)
      });
    },
    levelChange(temp){
      console.log(temp)
      this.currentLevel = temp.value
      this.listQuery.lo_limit = temp.config.lo_limit
      this.listQuery.hi_limit = temp.config.hi_limit
    },
    loLimitChange(level){
      console.log(level)
      for (const key in this.levelParams) {
        if (this.levelParams.hasOwnProperty(key)) {
          if(key==this.currentLevel){
            this.levelParams[key].lo_limit = level
          }
        }
      }
    },
    hiLimitChange(level){
      console.log(level)
      for (const key in this.levelParams) {
        if (this.levelParams.hasOwnProperty(key)) {
          if(key==this.currentLevel){
            this.levelParams[key].hi_limit = level
          }
        }
      }
    },
    handleReset() {
      this.$refs['form'].resetFields();
      this.listQuery = Object.assign({}, defaultListQuery)
      this.levelParams = Object.assign({}, defaultLevelParams)
      console.log(this.listQuery)
      console.log(this.levelParams)
    },
    handleChange(arr){
      if(arr.length > 1){
        arr.shift()
      }
    }
  }
}
</script>
<style>
.line{
  text-align: center;
}
</style>


