<template>
    <div>
        <div v-if="getType === 'newsletter'">
            <!--            <newsletter-form :title="getTitle" />-->
        </div>
        <div v-else>
            <contact-form :title="getTitle" />
        </div>
    </div>
</template>

<script>
import { slotMixins } from '../helper';
//import NewsletterForm from '../../utils/NewsletterForm';
import ContactForm from '../../utils/ContactForm';

export default {
    name: 'FormSlot',

    //components: { ContactForm, NewsletterForm },
    components: { ContactForm },
    mixins: [slotMixins],
    computed: {
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
};
</script>
