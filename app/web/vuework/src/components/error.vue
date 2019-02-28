<template>
    <div v-html="errorData"></div>
</template>

<script>
  export default {
    name: "error",
    data() {
      return {
      errorData:''
      }
    },
    created:function () {
      this.errorData = this.$route.params.errorData;
    }
  }
</script>

<style scoped>

</style>