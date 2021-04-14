<template>
    <button>
        <slot />
    </button>
</template>

<script>
export default {
    name: 'HblButton',
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/buttons';
</style>
