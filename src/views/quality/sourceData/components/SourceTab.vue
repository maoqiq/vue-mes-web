<template> 
  <div class="tab-item" :v-for="i in items">
    <div class="item">
      <label>{{1}}</label>
      <span>{{}}</span>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'SourceTab',
    props: {
      items: {
        type: Object,
        default: null
      }
    },
    data() {
      return {

      }
    },
    created() {
      console.log(this.items)
    },
    methods: {

    }
  }
</script>
<style>
</style>


