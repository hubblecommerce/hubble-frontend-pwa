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
