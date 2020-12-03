<template>
    <div :class="{ 'disable-scroll': activeOffCanvas }">
        <slot />
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'LayoutWrapper',

    data() {
        return {
            offCanvasIsActive: false,
        };
    },
    computed: {
        ...mapState({
            activeOffCanvas: state => state.modNavigation.offcanvas.isActive,
        }),
    },
};
</script>

<style>
.disable-scroll {
    overflow: hidden;
}

.disable-scroll .desktop-layout {
    width: 100vw;
    padding-right: 15px;
}

.disable-scroll .header-wrp {
    width: 100vw;
    padding-right: 15px;
}
</style>
