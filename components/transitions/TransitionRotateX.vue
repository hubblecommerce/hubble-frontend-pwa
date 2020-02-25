<template>
    <transition name="rotateX" mode="out-in">
        <slot />
    </transition>
</template>

<script>
    export default {
        name: "TransitionRotateX"
    }
</script>

<style scoped lang="scss">
    .rotateX-enter-active {
        transition: all .2s ease-in-out;
    }
    .rotateX-enter, .rotateX-leave-to {
        transform: rotateX(90deg);
    }
    .rotateX-enter-to, .rotateX-leave {
        transform: rotateX(0deg);
    }
</style>
