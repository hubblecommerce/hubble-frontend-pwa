<template>
  <div class="error-402 flex-center flex-column">
    <h1>Bad Request</h1>
    <p>No Items for this Category or Filters found. Please check your applied Filters.</p>
  </div>
</template>
<script>
export default {
  name: 'error-400',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
