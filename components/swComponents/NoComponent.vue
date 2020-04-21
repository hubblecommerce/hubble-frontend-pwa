<template>
    <div>
        <span>
        <b> {{ getBlockType }} </b> is not implemented yet!
      </span>
    </div>
</template>

<script>
  export default {
      name: 'NoComponent',
      props: {
          content: {
              type: Object,
              default: null
          }
      },
      data() {
          return {};
      },
      computed: {
          getBlockType() {
              return this.content.type;
          }
      }
  }
</script>

<style scoped>

</style>
