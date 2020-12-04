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

<style lang="scss">
$scrollbar-width: 15px;

.disable-scroll {
    overflow: hidden;

    .desktop-layout {
        width: 100vw;
        padding-right: $scrollbar-width;
    }
}

@media(min-width: 1024px) {
    .disable-scroll {
        .header-wrp {
            width: 100vw;
            padding-right: $scrollbar-width;

            .nav-wrp {
                &::before{
                    width: calc(100vw + 15px)
                }
            }
        }
    }
}
</style>
