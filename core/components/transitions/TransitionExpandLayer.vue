<!--
Component Usage:

In Template:
<transition-expand-layer :rightLeft="true" :direction="{ sm: 'bottomTop', md: 'rightLeft', lg: 'rightLeft' }">
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
        direction: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            transitionMode: '',
        };
    },

    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
        }),

        transMode: function () {
            let transitionMode = '';

            try {
                if (this.direction[this.$mq] != null) {
                    transitionMode = this.direction[this.$mq];
                }
            } catch {
                if (this.bottomTop === true) {
                    transitionMode = 'bottomTop';
                }

                if (this.leftRight === true) {
                    transitionMode = 'leftRight';
                }

                if (this.rightLeft === true) {
                    transitionMode = 'rightLeft';
                }
            }

            // If the layer that is supposed to be opened on same direction then only fade the content and not slide the whole layer
            if (this.offcanvas.sameLayerOpened) {
                return 'fade-to-white';
            }

            return 'expand-' + transitionMode;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

$expand-layer-width-mobile: 100%;
$expand-layer-width-tablet: 60%;
$expand-layer-width-desktop: 650px;
$overlay-header-height-desktop: 50px;

.transition-expand-wrp {
    position: fixed;
    top: 0;
    right: 0;
    width: $expand-layer-width-mobile;
    height: 100%;
    background-color: $background;
    z-index: 100;
    max-width: none;

    .express-checkout-wrp,
    .register-form,
    .login-form,
    .pw-reset-form {
        max-width: 100% !important;
    }
}

/* Wrapper to be able to scroll in overlay */
.expand-content {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: $background;
}

/* Header section of expanded layer */
.overlay-header {
    position: relative;
    opacity: 1;
    transition: all 0.2s ease;
    transition-delay: 0.2s;
    border-bottom: 1px solid $border-color;
    height: 56px;
    background-color: $background;

    .button-icon {
        position: absolute;
        top: 0;
        bottom: 0;

        &.close {
            left: 10px;
        }
    }

    .overlay-headline {
        height: 20px;
        margin: auto;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 600;
    }

    img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 15px;
        margin: auto 0;
    }
}

/* Tablet */
@media (min-width: 768px) {
    .transition-expand-wrp {
        width: $expand-layer-width-tablet;
        border-left: 1px solid $border-color;
    }
    .expand-content {
        height: 100vh;
    }
    .overlay-header {
        height: $overlay-header-height-desktop;

        .button-icon {
            top: 0;
            bottom: 0;
        }
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .transition-expand-wrp {
        width: $expand-layer-width-desktop;
        top: 77px;
        border-top: 1px solid $border-color;
    }
    .expand-content {
        overflow-y: inherit;

        .overlay-header {
            padding-left: 5px;
            padding-right: 5px;
        }
    }
    .overlay-header {
        .button-close-menu {
            left: 10px;
        }
    }
}

/* Animate overlay from bottom to top */
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

/* Animate overlay from left to right */
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

/* Animate overlay from right to left */
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

/* Animate overlay from right to left */
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
    /* Animate overlay from bottom to top */
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

    /* Animate overlay from right to left */
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
