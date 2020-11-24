<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="看板指标配置" name="dashboard">
          <dashboard-setting></dashboard-setting>
        </el-tab-pane>
        <el-tab-pane label="预警指标配置" name="warning">
          <warning-setting></warning-setting>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  import DashboardSetting from './components/DashboardSetting'
  import WarningSetting from './components/WarningSetting'
  export default {
    name: 'settings',
    components: { DashboardSetting, WarningSetting },
    data() {
      return {
        activeName: 'dashboard'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>
<style>
</style>


