<template>
    <transition name="fade-background">
        <div v-if="layerIsExpanded" class="background-blur" @click="hideMenu()" />
    </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'BackgroundBlur',

    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
        }),
        layerIsExpanded: function () {
            return this.offcanvas.component !== '';
        },
    },

    methods: {
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
    },
};
</script>

<style lang="scss" scoped>
.background-blur {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #000;
    z-index: 50;
    opacity: 0.5;
}

.fade-background-enter-active,
.fade-background-leave-active {
    transition: all 0.5s ease;
}

.fade-background-enter,
.fade-background-leave-to {
    opacity: 0;
}

.fade-background-enter-to,
.fade-background-leave {
    opacity: 0.5;
}
</style>
