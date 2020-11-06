<template>
  <board-detail :list-data="dashboardList"></board-detail>
</template>

<script>
  import BoardDetail from './Component/BoardDetail'
  import { getDashboardList } from '@/api/dashboard'
  import { formatDate,showtime } from '@/utils/date'
  import { defaultDashboardParams,defalutResultItem,defalutDate } from './index'
  export default {
    name: 'ssboard',
    components: { BoardDetail },
    data() {
      return {
        dashboardList:[],
        dashboardParams: Object.assign({},defaultDashboardParams),
        dateObj: Object.assign({},defalutDate)
      }
    },
    created(){
      this.defaultInitParams()
      this.getData();
    },
    computed:{
      endDate() {
        return this.formatSelectDate(new Date());
      },
      startDate() {
        const start = new Date();
        const startDate = start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
        const startString = this.formatSelectDate(startDate);
        return startString;
      }
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
      defaultInitParams() {
        this.dashboardParams.start_time = this.startDate;
        this.dashboardParams.end_time = this.endDate;
        // console.log(showtime(this.startDate))
        this.dateObj.start_time = this.startDate;
        this.dateObj.end_time = this.endDate;
        this.dateObj.format_time = showtime(this.startDate)
        localStorage.setItem('dashboardDate',JSON.stringify(this.dateObj))
        this.dashboardParams.type = 'stopped_sh'
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
