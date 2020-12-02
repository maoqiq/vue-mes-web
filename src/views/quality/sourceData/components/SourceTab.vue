<template> 
  <div class="tab-item" v-html="currentStr">
  </div>
</template>
<script>

  export default {
    name: 'SourceTab',
    props: ['item'],
    data() {
      return {
        currentStr:''
      }
    },
    watch: {
      item() {
          this.currentStr = this.item&&this.item.replace(/ /g,'&nbsp;').replace(/\n/g,'<br/>')
　　　　  }
    },
    created() {
    },
    methods: {

    }
  }
</script>
<style>
</style>


