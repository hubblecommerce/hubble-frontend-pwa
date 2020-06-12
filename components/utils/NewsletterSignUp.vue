<template>
    <validation-observer ref="observer" v-slot="{ passes }" tag="form" @submit.prevent="passes(submitSignUpForm)">
        <div class="headline headline-3 newsletter__headline">{{ title }}</div>

        <validation-provider v-slot="{ errors }" name="email" rules="required" mode="passive" tag="div" class="hbl-input-group input-icon">
            <input id="email"
                   v-model="email"
                   type="text" name="email"
                   value=""
                   :class="{invalid: errors.length > 0}"
                   placeholder=" "
                   required
            >

            <label for="email" v-text="$t('Email Address')" />

            <i class="icon icon-mail" />

            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <div class="error-message" v-text="error" />

        <button class="button-primary" @click.prevent="passes(submitSignUpForm)">
            {{ $t('Subscribe now') }}
            <material-ripple />
        </button>
    </validation-observer>
</template>

<script>
    import { mapActions } from "vuex";

    export default {
        name: "NewsletterSignUp",
        props: {
            title: {
                type: String,
                required: false,
                default: 'Newsletter registration'
            }
        },
        data() {
            return {
                email: '',
                error: ''
            }
        },
        methods: {
            ...mapActions({
                signUp: 'modApiNewsletter/signUpToNewsletter',
                flashMessage: 'modFlash/flashMessage'
            }),

            submitSignUpForm: function() {
                this.signUp({ email: this.email })
                    .then(() => {
                        this.error = '';

                        this.email = '';

                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('You successfully signed up to our newsletter.'),
                            keepOnRouteChange: true
                        });
                    })
                    .catch(() =>  {
                        this.error = this.$t('Subscription was not successful');
                    })
            }
        }
    }
</script>

<style scoped>
    .newsletter__headline {
        margin-bottom: 20px;
    }
</style>
