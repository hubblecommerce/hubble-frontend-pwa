<template>
    <div class="flash-messages-wrp">
        <transition-group name="flash">
            <span v-for="messageObject in messagesToDisplay" :key="messageObject.id" class="flash-message-container">
                <flash-message
                    :message-text="messageObject.flashMessage"
                    :id-of-text="messageObject.id"
                    :flashtype="messageObject.flashType"
                    :fade-out="fadeOut"
                    :in-off-canvas="inOffCanvas"
                    :timeout-time="messageObject.timeoutTime"
                    :keep-on-route-change="messageObject.keepOnRouteChange"
                />
            </span>
        </transition-group>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import FlashMessage from './FlashMessage';
import _ from 'lodash';
export default {
    name: 'FlashMessages',
    components: {
        FlashMessage,
    },
    props: {
        fadeOut: {
            required: false,
            type: Boolean,
            default: true,
        },
        inOffCanvas: {
            required: false,
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            messagesToDisplay: [],
        };
    },
    computed: {
        ...mapState({
            listOfFlashMessages: (state) => state.modFlash.listOfFlashMessages,
            activeOffCanvas: (state) => state.modNavigation.offcanvas.isActive,
        }),
    },
    watch: {
        listOfFlashMessages: function (newList) {
            if (this.activeOffCanvas === false) {
                this.messagesToDisplay = newList;
            }
        },
    },
    created() {
        this.messagesToDisplay = _.cloneDeep(this.listOfFlashMessages);
        if (this.activeOffCanvas === true && this.messagesToDisplay.length !== 0) {
            const lastElementOfListOfFlashMessages = this.messagesToDisplay.pop();
            this.messagesToDisplay = [];
            this.messagesToDisplay.push(lastElementOfListOfFlashMessages);
        }
    },
};
</script>
