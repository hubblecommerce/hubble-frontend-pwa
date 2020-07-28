<template>
    <div v-if="showMessage" :class="flashtype">
        <div class="flash-message" v-text="flashMessage" />
        <button class="button-icon close-flash" @click="hideMessage()">
            <i class="icon icon-close" />
            <span class="hidden-link-name" v-text="$t('close')" />
            <material-ripple />
        </button>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    name: 'FlashMessage',
    props: {
        messageText: {
            required: false,
            type: String,
            default: '',
        },
        idOfText: {
            required: false,
            type: Number,
            default: 0,
        },
        fadeOut: {
            required: false,
            type: Boolean,
            default: false,
        },
        inOffCanvas: {
            required: false,
            type: Boolean,
            default: false,
        },
        flashtype: {
            type: String,
            // default: 'info',
            required: true,
        },
        timeoutTime: {
            required: false,
            type: Number,
            default: 5000,
        },
        keepOnRouteChange: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            flashMessage: '',
            showMessage: false,
            typeOfMessage: '',
        };
    },
    computed: {
        ...mapState({
            flashVisible: state => state.modFlash.flashVisible,
            activeOffCanvas: state => state.modNavigation.offcanvas.isActive,
        }),
        showFlashMessage: function () {
            // if off canvas is active only show the flash message if it is inside the offcanvas
            if (this.activeOffCanvas) {
                return this.inOffCanvas;
            }
            return true;
        },
    },
    watch: {
        flashVisible: {
            handler(object) {
                if (this.showFlashMessage === true && this.showFlashMessage === true) {
                    this.showMessage = true;
                    this.flashMessage = this.messageText;
                    this.typeOfMessage = this.flashtype;
                    // If fade away isset to false, keep message and dont fade out
                    if (object !== false && this.fadeOut === true) {
                        setTimeout(() => {
                            this.showMessage = false;
                            this.resetMessage();
                            this.deleteMessage(this.idOfText);
                        }, this.timeoutTime);
                    }
                }
            },
        },
        activeOffCanvas: {
            handler(object) {
                if (object === false && this.showFlashMessage === true) {
                    this.hideMessage();
                }
            },
        },
        '$route.path': function () {
            // Reset flash message if route changes and keepOnRouteChange is not true
            if (!this.keepOnRouteChange) {
                this.hideMessage();
            } else {
                this.resetKeepOnRouteChange();
            }
        },
    },
    created() {
        // Set data from store to component data if message is shown
        if (this.flashVisible === true) {
            this.showMessage = true;
            this.flashMessage = this.messageText;
            this.typeOfMessage = this.flashtype;
            if (this.fadeOut === true && this.activeOffCanvas === false) {
                setTimeout(() => {
                    this.hideMessage();
                }, this.timeoutTime);
            } else if (this.activeOffCanvas === true && this.showFlashMessage === true) {
                setTimeout(() => {
                    this.hideMessage();
                }, 0);
            }
        }
    },
    methods: {
        ...mapActions({
            resetMessage: 'modFlash/resetMessage',
            resetKeepOnRouteChange: 'modFlash/resetKeepOnRouteChange',
            deleteMessage: 'modFlash/deleteMessage',
        }),
        hideMessage: function () {
            this.showMessage = false;
            this.resetMessage();
            this.deleteMessage(this.idOfText);
        },
    },
};
</script>
