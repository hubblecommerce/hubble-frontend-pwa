<template>
    <div>
        <span>
        <b>
          {{ elementType }}<i> {{ getBlockType }} </i>
        </b>
        is not implemented yet!
      </span>
    </div>
</template>

<script>
  export default {
      name: 'NoComponent',
      data() {
          return {};
      },
      props: {
          content: {
              type: Object,
              default: null
          }
      },
      computed: {
          elementType() {
              return this.content.slot ? `Slot` : `Block`;
          },
          getBlockType() {
              return this.content ? this.content.type : "";
          }
      }
  }
</script>

<style scoped>

</style>
