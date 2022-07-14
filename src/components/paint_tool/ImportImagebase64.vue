<template>
  <div>
    <button @click="exportimg()"> import </button>
  </div>
</template>

<script>

export default {
  name: "ImportImagebase64",
  props: {
    saveViews: Array,
  },
  methods : {
    exportimg()
    {
      console.log("IMAGE 1 - out component ", this.$view1image.src)
      console.log("IMAGE 2 - out component ", this.$view2image.src)
    }
  }
}
</script>

<style scoped>

</style>