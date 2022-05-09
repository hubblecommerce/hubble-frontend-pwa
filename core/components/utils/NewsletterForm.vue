<template>
    <div class="newsletter-form">
        <form @submit.prevent="onSubmitForm">
            <div class="row">
                <div class="col-12">
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
            </div>
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
                <div class="col-12">
                    <div class="option">
                        <input id="privacyNewsletter" type="checkbox" name="privacyNewsletter" required />
                        <label for="privacyNewsletter">I have read the data protection information.</label>
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
    name: 'NewsletterForm',

    props: {
        salutations: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            option: 'subscribe',
            formData: {
                salutationId: '',
                email: '',
                firstName: '',
                lastName: '',
            },

            sending: false,
            error: null,
        };
    },

    methods: {
        async onSubmitForm() {
            this.sending = true;

            const postData = Object.assign(this.formData, {
                option: this.option,
                storefrontUrl: process.env.API_BASE_URL,
            });

            try {
                let formPost = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/newsletter/subscribe',
                    data: postData,
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
