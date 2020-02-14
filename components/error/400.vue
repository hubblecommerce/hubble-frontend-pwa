<template>
    <div class="error-wrp flex-center flex-column">
        <h1>Bad Request</h1>
        <p>No Items for this Category or Filters found. Please check your applied Filters.</p>
    </div>
</template>

<script>
    export default {
        name: 'Error400',
        props: {
            error: {
                type: Object,
                default: () => {}
            }
        }
    };
</script>
