<template>
    <div class="newsletter-wrp">
        <div class="newsletter-headline">
            <div class="headline-1 newsletter-title" v-text="title" />
        </div>
        <div class="newsletter-box">
            <validation-observer
                ref="observer"
                v-slot="{ validate, reset }"
                tag="form"
                class="form-edit register-form"
                @submit.prevent="
                    validate().then((e) => {
                        submitForm(e);
                        reset();
                    })
                "
            >
                <validation-provider
                    v-slot="{ errors }"
                    name="gender"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-select"
                >
                    <select
                        v-model="form.salutation"
                        class="select-text"
                        :class="{ invalid: errors.length > 0 }"
                        required
                    >
                        <option v-for="salutation in salutations" :key="salutation.key" :value="salutation.key">{{
                            salutation.value
                        }}</option>
                    </select>

                    <label class="select-label" v-text="$t('Salutation') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    name="firstName"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="firstName"
                        v-model="form.firstName"
                        type="text"
                        name="firstName"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    />

                    <label for="firstName" v-text="$t('First Name') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    name="lastName"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="lastName"
                        v-model="form.lastName"
                        type="text"
                        name="lastName"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    />

                    <label for="lastName" v-text="$t('Last Name') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    vid="email"
                    name="email"
                    rules="required|email"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="email"
                        v-model="form.email"
                        type="text"
                        name="email"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    />

                    <label for="email" v-text="$t('Email Address') + '*'" />
                    <i class="icon icon-mail" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    vid="phone"
                    name="phone"
                    rules="required|numeric"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="phone"
                        v-model="form.phone"
                        type="text"
                        name="phone"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    />

                    <label for="phone" v-text="$t('Phone') + '*'" />
                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    vid="subject"
                    name="subject"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="subject"
                        v-model="form.subject"
                        type="text"
                        name="subject"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    />

                    <label for="subject" v-text="$t('Subject') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    vid="comment"
                    name="comment"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-input-group"
                >
                    <textarea
                        id="comment"
                        v-model="form.comment"
                        type="text"
                        name="comment"
                        :class="{ invalid: errors.length > 0 }"
                        :placeholder="$t('Comment') + '*'"
                        required
                    />
                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <div class="error-message" v-text="error" />

                <button
                    class="button-primary"
                    @click.prevent="
                        validate().then((e) => {
                            submitForm(e);
                            reset();
                        })
                    "
                >
                    {{ $t('Submit') }}
                    <material-ripple />
                </button>
            </validation-observer>

            <div class="indicates-required">
                <div class="text" v-text="$t('* Mandataroy fields are marked with an asterisk *.')" />
            </div>
        </div>
    </div>
</template>

<script>
import Form from '../../utils/form';
import { salutations } from '@hubblecommerce/hubble/core/utils/formMixins';
import { mapActions } from 'vuex';

export default {
    name: 'ContactForm',
    mixins: [salutations],
    props: {
        title: {
            type: String,
            required: false,
            default: 'Contact',
        },
    },
    data() {
        return {
            form: new Form({
                firstName: '',
                lastName: '',
                email: '',
                salutation: '',
                phone: '',
                subject: '',
                comment: '',
            }),
            error: '',
        };
    },
    methods: {
        ...mapActions({
            submitContactForm: 'modApiForm/submitContactForm',
            flashMessage: 'modFlash/flashMessage',
        }),
        submitForm() {
            this.submitContactForm({
                email: this.form.email,
                salutationId: this.form.salutation,
                firstName: this.form.firstName,
                lastName: this.form.lastName,
                phone: this.form.phone,
                subject: this.form.subject,
                comment: this.form.comment,
            })
                .then((response) => {
                    let message =
                        response !== null
                            ? response
                            : this.$t('You successfully contacted us. We will get in touch with you shortly.');
                    this.form = new Form({
                        firstName: '',
                        lastName: '',
                        email: '',
                        salutation: '',
                        phone: '',
                        subject: '',
                        comment: '',
                    });
                    this.error = '';
                    this.flashMessage({
                        flashType: 'success',
                        flashMessage: message,
                        keepOnRouteChange: true,
                    });
                })
                .catch((error) => {
                    this.error = error;
                });
        },
    },
};
</script>
