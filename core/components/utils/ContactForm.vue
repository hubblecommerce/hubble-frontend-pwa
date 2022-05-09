<template>
    <div class="contact-form">
        <form @submit.prevent="onSubmitForm">
            <div class="row">
                <div class="col-12 col-md-4">
                    <div class="hbl-input-group">
                        <hbl-select>
                            <select id="salutationId" v-model="formData.salutationId" required class="select-text" name="salutationId">
                                <option v-for="sal in salutations" :key="sal.id" :value="sal.id" v-text="sal.displayName" />
                            </select>
                            <label class="select-label" v-text="'Salutation'" />
                        </hbl-select>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="hbl-input-group">
                        <input id="firstName" v-model="formData.firstName" required type="text" name="firstName" placeholder=" " />
                        <label for="firstName">First name</label>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="hbl-input-group">
                        <input id="lastName" v-model="formData.lastName" required type="text" name="lastName" placeholder=" " />
                        <label for="lastName">Last name</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-6">
                    <div class="hbl-input-group">
                        <input
                            id="email"
                            v-model="formData.email"
                            required
                            type="email"
                            name="email"
                            placeholder=" "
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        />
                        <label for="email">Email address</label>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="hbl-input-group">
                        <input id="phone" v-model="formData.phone" type="text" name="phone" placeholder=" " />
                        <label for="phone">Phone number</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="hbl-input-group">
                        <input id="subject" v-model="formData.subject" required type="text" name="subject" placeholder=" " />
                        <label for="subject">Subject line</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="hbl-input-group">
                        <textarea id="comment" v-model="formData.comment" required type="text" name="comment" placeholder="Your message" />
                        <label for="comment">Your message</label>
                    </div>

                    <div class="option">
                        <input id="privacyContact" type="checkbox" name="privacyContact" required />
                        <label for="privacyContact">I have read the data protection information.</label>
                    </div>
                </div>
            </div>

            <div class="action-wrp">
                <button class="btn btn-primary" :disabled="sending" type="submit" v-text="sending ? 'Is sending' : 'Send'" />
            </div>
        </form>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';

export default {
    name: 'ContactForm',

    props: {
        salutations: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: '',
        },
        mailReceiver: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            formData: {
                salutationId: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                subject: '',
                comment: '',
            },

            sending: false,
            error: null,
        };
    },

    methods: {
        async onSubmitForm() {
            this.sending = true;

            try {
                let formPost = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/contact-form',
                    data: this.formData,
                });

                this.sending = false;

                if ([200, 204].includes(formPost.status)) {
                    this.setSuccessState();
                } else {
                    this.setErrorState();
                }
            } catch (error) {
                this.sending = false;

                this.setErrorState(error);
            }
        },
        setSuccessState() {
            this.$emit('success');

            Object.keys(this.formData).forEach((key) => {
                this.formData[key] = '';
            });
        },
        setErrorState(error) {
            this.$emit('error');

            if (error) this.error = error;
        },
    },
};
</script>

<style lang="scss">
.contact-form {
    .hbl-select {
        margin: 0;
    }
}
</style>
