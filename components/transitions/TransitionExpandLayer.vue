<!--
Component Usage:

In Template:
<transition-expand-layer :rightLeft="true">
  <div v-if="showLayer" class="transition-expand-wrp">
    <div class="container expand-content">

        Insert your content here

    </div>
  </div>
</transition-expand-layer>

In Script:
import { mapState } from 'vuex'
export default {
    data() {
        return {
            name: 'ComponentName'
        }
    },
    computed: {
        ...mapState({
            offcanvas: state => state.modNavigation.offcanvas
        }),
        showLayer: function() {
            if(this.offcanvas.component === this.name) {
                return true;
            }
            return false;
        }
    },
    methods: {
        toggle: function() {
            this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                component: this.name,
                direction: 'rightLeft'
            });
        },
        hide() {
            this.$store.dispatch('modNavigation/hideOffcanvasAction');
        }
    }
}

-->

<template>
    <transition :name="transMode">
        <slot />
    </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'TransitionExpandLayer',

    data() {
        return {
            transitionMode: '',
        };
    },

    computed: {
        ...mapState({
            offcanvas: state => state.modNavigation.offcanvas,
        }),
        transMode: function () {
            // If the layer that is supposed to be opened on same direction then only fade the content and not slide the whole layer
            if (this.offcanvas.sameLayerOpened) {
                return 'fade-to-white';
            }
            return 'expand-' + this.transitionMode;
        },
    },

    props: {
        leftRight: {
            type: Boolean,
            required: false,
        },
        rightLeft: {
            type: Boolean,
            required: false,
        },
        bottomTop: {
            type: Boolean,
            required: false,
        },
    },

    created() {
        if (this.bottomTop === true) {
            this.transitionMode = 'bottomTop';
        }

        if (this.leftRight === true) {
            this.transitionMode = 'leftRight';
        }

        if (this.rightLeft === true) {
            this.transitionMode = 'rightLeft';
        }
    },
};
</script>

<style scoped lang="scss">
/* Animate Minicart overlay from bottom to top */
.expand-bottomTop-enter-active,
.expand-bottomTop-leave-active {
    transition: all 0.2s ease;
}
.expand-bottomTop-enter,
.expand-bottomTop-leave-to {
    top: 100% !important;
}
.expand-bottomTop-enter-to,
.expand-bottomTop-leave {
    top: 0 !important;
}

/* Animate Minicart overlay from left to right */
.expand-leftRight-enter-active,
.expand-leftRight-leave-active {
    transition: all 0.2s ease-in-out;
}
.expand-leftRight-enter,
.expand-leftRight-leave-to {
    left: -100% !important;
}
.expand-leftRight-enter-to,
.expand-leftRight-leave {
    left: 0 !important;
}

/* Animate Minicart overlay from right to left */
.expand-rightLeft-enter-active,
.expand-rightLeft-leave-active {
    transition: all 0.1s ease-in-out;
}
.expand-rightLeft-enter,
.expand-rightLeft-leave-to {
    right: -100% !important;
}
.expand-rightLeft-enter-to,
.expand-rightLeft-leave {
    right: 0 !important;
}

/* Animate Minicart overlay from right to left */
.fade-to-white-enter-active,
.fade-to-white-leave-active {
    transition: all 0.2s ease-in-out;

    &:before {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100000;
        background-color: #fff;
        transition: all 0.1s ease-in-out;
        opacity: 0;
    }
}
.fade-to-white-enter,
.fade-to-white-leave-to {
    &:before {
        opacity: 1;
    }
}
.fade-to-white-enter-to,
.fade-to-white-leave {
    &:before {
        opacity: 0;
    }
}

@media (min-width: 768px) {
    /* Animate Minicart overlay from bottom to top */
    .expand-bottomTop-enter-active,
    .expand-bottomTop-leave-active {
        transition: all 0.3s ease;
    }
    .expand-bottomTop-enter,
    .expand-bottomTop-leave-to {
        top: unset !important;
        opacity: 0;
    }
    .expand-bottomTop-enter-to,
    .expand-bottomTop-leave {
        top: unset !important;
        opacity: 1;
    }

    /* Animate Minicart overlay from right to left */
    .expand-rightLeft-enter-active,
    .expand-rightLeft-leave-active {
        transition: all 0.2s ease-in-out;
    }
    .expand-rightLeft-enter,
    .expand-rightLeft-leave-to {
        right: -100% !important;
    }
    .expand-rightLeft-enter-to,
    .expand-rightLeft-leave {
        right: 0 !important;
    }
}
</style>
