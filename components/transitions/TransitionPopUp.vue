<template>
    <transition name="popup">
        <slot />
    </transition>
</template>

<script>
    export default {
        name: "TransitionPopUp"
    }
</script>

<style scoped lang="scss">
    /* Animate Minicart overlay from bottom to top*/
    .popup-enter-active, .popup-leave-active {
        transition: all .2s ease;
    }
    .popup-enter, .popup-leave-to {
        top: 100% !important;
    }
    .popup-enter-to, .popup-leave {
        top: 0 !important;
    }

    @media(min-width: 768px) {
        .popup-enter-active, .popup-leave-active {
            transition: all .2s ease;
        }
        .popup-enter, .popup-leave-to {
            top: 100% !important;
            opacity: 0;
        }
        .popup-enter-to, .popup-leave {
            top: 100% !important;
            opacity: 1;
        }
    }
</style>