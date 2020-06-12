<template>
    <div>
        <div v-if="getType === 'newsletter'">
            <NewsletterSignUp :title="getTitle" />
        </div>
        <div v-else>
            <div>Contact Form</div>
        </div>
    </div>
</template>

<script>
    import NewsletterSignUp from "../../utils/NewsletterSignUp";

    export default {
        name: 'FormSlot',
        components: {NewsletterSignUp},
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            getType() {
                return this.content.config.type.value
            },
            getTitle() {
                return this.content.config.title.value
            },
            getMailReceiver() {
                return this.content.config.mailReceiver.value
            },
            getDefaultMailReceiver() {
                return this.content.config.getDefaultMailReceiver.value
            },
            getConfirmationText() {
                return this.content.config.conformationText.value
            }
        }
    }
</script>
