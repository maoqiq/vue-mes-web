<template>
  <board-detail :list-data="dashboardList"></board-detail>
</template>

<script>
  import BoardDetail from './Component/BoardDetail'
  import { getDashboardList } from '@/api/dashboard'
  import { getDashboardConfig } from '@/api/configSettings'
  import { formatDate } from '@/utils/date'
  import { defaultDashboardParams,defalutResultItem,dateList } from './index'

  export default {
    name: 'ycboard',
    components: { BoardDetail },
    data() {
      return {
        dashboardTime:{
          path: '/YCboard',
          displayTime: ''
        },
        dashboardList:[],
        dashboardParams: Object.assign({},defaultDashboardParams)
      }
    },
    created(){
      this.getConfigData()
    },
    methods:{
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
      getConfigData(){
        getDashboardConfig({type: 'yc'}).then(response=>{
          console.log(response)
          this.handleTimeDisplay(response.result)
        })
      },
      handleTimeDisplay(date){
        let displayPeriod = ''
        let displayTime = ''
        dateList.forEach(element => {
          if(date.period==element.value){
            displayPeriod = element.label
          }
        });
        if(date.period=="-1"){
          displayTime = `${displayPeriod}`
        } else if(date.period=="0"){
          let startTime = this.formatSelectDate(date.start_time)
          let endTime = this.formatSelectDate(date.end_time)
          this.dashboardParams.start_time = startTime;
          this.dashboardParams.end_time = endTime;
          displayTime = `${displayPeriod} ( ${endTime} )`
        } else{
          let startTime = this.formatSelectDate(date.start_time)
          let endTime = this.formatSelectDate(date.end_time)
          this.dashboardParams.start_time = startTime;
          this.dashboardParams.end_time = endTime;
          displayTime = `${displayPeriod} ( ${startTime} 至 ${endTime} )`
        }
        this.dashboardParams.type = 'yc'
        this.dashboardTime.displayTime = displayTime
        this.$store.dispatch('SetDispalyTime',this.dashboardTime);
        this.getData();
      },

      getData(){
        getDashboardList(this.dashboardParams).then(response => {
          console.log(response)
          this.dashboardList = []
          for (const key in response.result) {
            if (response.result.hasOwnProperty(key)) {
              const element = response.result[key];
              let resultItem = Object.assign({},defalutResultItem)
              for (const item in element) {
                if(resultItem.hasOwnProperty(item)){
                  resultItem[item] = element[item]
                }
              }
              resultItem.machine_id = key
              resultItem.type = this.dashboardParams.type
              console.log(resultItem)
              this.dashboardList.push(resultItem)
            }
          }
          this.listLoading = false;
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
