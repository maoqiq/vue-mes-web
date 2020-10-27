<template> 
  <repair-detail :is-edit='false'></repair-detail>
</template>
<script>
  import RepairDetail from './components/RepairDetail'
  export default {
    name: 'createRepair',
    components: { RepairDetail }
  }
</script>
<style>
</style>


