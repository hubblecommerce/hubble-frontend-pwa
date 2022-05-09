<template>
    <div :class="[elementClass]">
        <h2 class="cms-block-headline">{{ getTitle }}</h2>

        <div v-if="getType === 'newsletter'">
            <newsletter-form :salutations="salutations" @success="onSuccess" @error="onError" />
        </div>
        <div v-else>
            <contact-form :salutations="salutations" :mail-receiver="getMailReceiver" @success="onSuccess" @error="onError" />
        </div>

        <flash-message v-if="content && content.blockId === flashMessageBlockId" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ApiClient from '@/utils/api-client';
import { slotMixins } from '../helper';
import NewsletterForm from '../../utils/NewsletterForm';
import ContactForm from '../../utils/ContactForm';

export default {
    name: 'FormSlot',

    components: { ContactForm, NewsletterForm },
    mixins: [slotMixins],

    data() {
        return {
            salutations: [],
            defaultConfirmationText: 'The contact form has been sent successfully.',
            errorText: 'An error occured. Please try again.',
        };
    },

    computed: {
        ...mapState({
            flashMessageBlockId: (state) => state.modFlashMessage.blockId,
        }),
        getType() {
            return this.content.config.type.value;
        },
        getTitle() {
            return this.content.config.title.value;
        },
        getMailReceiver() {
            return this.content.config.mailReceiver.value;
        },
        getDefaultMailReceiver() {
            return this.content.config.defaultMailReceiver.value;
        },
        getConfirmationText() {
            return this.content.config.confirmationText.value;
        },
    },

    async mounted() {
        const salutationResponse = await new ApiClient(this.$config).apiCall({
            endpoint: 'store-api/salutation',
        });

        this.salutations = salutationResponse.data && salutationResponse.data.elements;
    },

    methods: {
        onSuccess() {
            const text = this.getConfirmationText ? this.getConfirmationText : this.defaultConfirmationText;

            this.$store.dispatch('modFlashMessage/flashMessage', {
                type: 'success',
                text,
                blockId: this.content.blockId,
            });
        },
        onError() {
            this.$store.dispatch('modFlashMessage/flashMessage', {
                type: 'error',
                text: this.errorText,
                blockId: this.content.blockId,
            });
        },
    },
};
</script>

<style lang="scss">
.cms-element-form {
    .action-wrp {
        margin-top: 20px;
    }

    .flash-message-wrp {
        margin-top: 20px;
    }
}
</style>
