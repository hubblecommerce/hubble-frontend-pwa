<template>
    <transition name="flash-message">
        <div class="flash-message-wrp" v-bind:class="type" v-if="showMessage">
            <div class="flash-message" v-text="message"></div>
            <button @click="hideMessage()" class="button-icon close-flash">
                <i class="icon icon-close" />
                <span class="hidden-link-name" v-text="$t('close')"></span>
                <material-ripple/>
            </button>
        </div>
    </transition>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "FlashMessage",

        data() {
            return {
                showMessage: false,
                message: '',
                type: ''
            }
        },

        props: {
            fadeOut: {
                required: false,
                type: Boolean,
                default: true
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

        computed: {
            ...mapState({
                flashVisible: state => state.modFlash.flashVisible,
                flashMessage: state => state.modFlash.flashMessage,
                flashType: state => state.modFlash.flashType,
            }),
        },

        watch: {
            flashVisible: function(object) {

                // Set data from store to component data reactive
                if(this.flashVisible) {
                    this.showMessage = true;
                    this.message = this.flashMessage;
                    this.type = this.flashType;
                }

                // If fade away isset to false, keep message and dont fade out
                if(object !== false && this.fadeOut) {
                    setTimeout(() => {
                        this.showMessage = false;
                        this.$store.dispatch('modFlash/resetMessage');
                    }, 5000);
                }
            }
        },

        methods: {
            hideMessage: function() {
                this.showMessage = false;
                this.$store.dispatch('modFlash/resetMessage');
            }
        }
    }
</script>
