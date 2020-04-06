<template>
    <transition name="flash-message">
        <div v-if="showMessage" class="flash-message-wrp" :class="type">
            <div class="flash-message" v-text="message" />
            <button class="button-icon close-flash" @click="hideMessage()">
                <i class="icon icon-close" />
                <span class="hidden-link-name" v-text="$t('close')" />
                <material-ripple />
            </button>
        </div>
    </transition>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "FlashMessage",

        props: {
            fadeOut: {
                required: false,
                type: Boolean,
                default: true
            },
            inOffCanvas: {
                required: false,
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                showMessage: false,
                message: '',
                type: ''
            }
        },

        computed: {
            ...mapState({
                flashVisible: state => state.modFlash.flashVisible,
                flashMessage: state => state.modFlash.flashMessage,
                flashType: state => state.modFlash.flashType,
                keepOnRouteChange: state => state.modFlash.keepOnRouteChange,
                activeOffCanvas: state => state.modNavigation.offcanvas.isActive
            }),
            showFlashMessage: function () {
                // if off canvas is active only show the flash message if it is inside the off canvas
                if(this.activeOffCanvas) {
                    return this.inOffCanvas;
                }
                return true;
            }
        },

        watch: {
            flashVisible: function(object) {
                // Set data from store to component data reactive
                if(this.flashVisible && this.showFlashMessage) {
                    this.showMessage = true;
                    this.message = this.flashMessage;
                    this.type = this.flashType;

                    // If fade away isset to false, keep message and dont fade out
                    if(object !== false && this.fadeOut) {
                        setTimeout(() => {
                            this.showMessage = false;
                            this.resetMessage()
                        }, 5000);
                    }
                }
            },
            activeOffCanvas: function (object) {
                if(object === false) {
                    this.resetMessage();
                }
            },
            '$route.path': function() {
                // Reset flash message if route changes and keepOnRouteChange is not true
                if(!this.keepOnRouteChange){
                    this.showMessage = false;
                    this.resetMessage();
                } else {
                    this.resetKeepOnRouteChange();
                }
            }
        },

        created() {
            // Set data from store to component data if message is shown
            if(this.flashVisible) {
                this.showMessage = true;
                this.message = this.flashMessage;
                this.type = this.flashType;
            }
        },

        methods: {
            ...mapActions({
                resetMessage: 'modFlash/resetMessage',
                resetKeepOnRouteChange: 'modFlash/resetKeepOnRouteChange'
            }),
            hideMessage: function() {
                this.showMessage = false;
                this.resetMessage();
            }
        }
    }
</script>
