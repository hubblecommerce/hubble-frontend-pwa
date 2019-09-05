<template>
  <div class="error-401 flex-center flex-column">
    <h1>API authorisation failed</h1>
    <p>Please check your configuration or contact your service provider.</p>
  </div>
</template>
<script>
export default {
  name: 'error-401',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
