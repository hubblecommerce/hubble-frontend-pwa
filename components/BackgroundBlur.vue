<template>
    <transition name="fade-background">
        <div v-if="layerIsExpanded" class="background-blur" @click="hideMenu()"></div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "BackgroundBlur",
        computed: {
            ...mapState({
                offcanvas: state => state.modNavigation.offcanvas
            }),
            layerIsExpanded: function() {
                if(this.offcanvas.component !== '') {
                    return true;
                }

                return false;
            }
        },
        methods: {
            hideMenu: function() {
                this.$store.dispatch('modNavigation/hideOffcanvasAction');
            }
        }
    }
</script>
