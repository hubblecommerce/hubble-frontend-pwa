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
                    name="action"
                    rules="required"
                    mode="eager"
                    tag="div"
                    class="hbl-select"
                >
                    <select v-model="form.action" class="select-text" :class="{ invalid: errors.length > 0 }" required>
                        <option :value="'subscribe'">{{ $t('Subscribe') }} </option>
                        <option :value="'unsubscribe'">{{ $t('Unsubscribe') }} </option>
                    </select>

                    <label class="select-label" v-text="$t('Action') + '*'" />

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

                <template v-if="form.action === 'subscribe'">
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

                    <!--                <div class="form-row street-nr">
                        <validation-provider
                            v-slot="{ errors }"
                            name="street"
                            rules="required"
                            mode="eager"
                            tag="div"
                            class="hbl-input-group"
                        >
                            <input
                                id="street"
                                v-model="form.street"
                                type="text"
                                name="street"
                                value=""
                                :class="{ invalid: errors.length > 0 }"
                                placeholder=" "
                                required
                            />

                            <label for="street" v-text="$t('Street') + '*'" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>

                        <validation-provider
                            v-slot="{ errors }"
                            name="houseNumber"
                            rules="required"
                            mode="eager"
                            tag="div"
                            class="hbl-input-group"
                        >
                            <input
                                id="houseNumber"
                                v-model="form.houseNumber"
                                type="text"
                                name="houseNumber"
                                value=""
                                :class="{ invalid: errors.length > 0 }"
                                placeholder=" "
                                required
                            />

                            <label for="houseNumber" v-text="$t('Houseno.') + '*'" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>
                    </div>
                    <div class="form-row zip-city">
                        <validation-provider
                            v-slot="{ errors }"
                            name="zipCode"
                            rules="required|numeric|max:5"
                            mode="eager"
                            tag="div"
                            class="hbl-input-group"
                        >
                            <input
                                id="zipCode"
                                v-model="form.zipCode"
                                type="text"
                                name="zipCode"
                                value=""
                                :class="{ invalid: errors.length > 0 }"
                                placeholder=" "
                                required
                            />

                            <label for="zipCode" v-text="$t('Zipcode') + '*'" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>

                        <validation-provider
                            v-slot="{ errors }"
                            name="city"
                            rules="required"
                            mode="eager"
                            tag="div"
                            class="hbl-input-group"
                        >
                            <input
                                id="city"
                                v-model="form.city"
                                type="text"
                                name="city"
                                value=""
                                :class="{ invalid: errors.length > 0 }"
                                placeholder=" "
                                required
                            />

                            <label for="city" v-text="$t('City') + '*'" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>
                    </div>

                    <validation-provider
                        v-slot="{ errors }"
                        name="country"
                        rules="required"
                        mode="eager"
                        tag="div"
                        class="hbl-select"
                    >
                        <select
                            v-model="form.country"
                            class="select-text"
                            :class="{ invalid: errors.length > 0 }"
                            required
                        >
                            <option v-for="country in countries" :key="country.iso_code_2" :value="country.iso_code_2">{{
                                    country.name
                                }}</option>
                        </select>

                        <label class="select-label" v-text="$t('Country') + '*'" />

                        <div class="validation-msg" v-text="$t(errors[0])" />
                    </validation-provider>-->
                </template>
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
import { addBackendErrors, salutations } from '@hubblecommerce/hubble/core/utils/formMixins';
import { mapActions } from 'vuex';

export default {
    name: 'NewsletterForm',
    mixins: [salutations, addBackendErrors],
    props: {
        title: {
            type: String,
            required: false,
            default: 'Newsletter',
        },
    },
    data() {
        return {
            form: new Form({
                firstName: '',
                lastName: '',
                email: '',
                salutation: '',
                street: '',
                zipCode: '',
                houseNumber: '',
                action: 'subscribe',
            }),
            error: '',
        };
    },
    /*computed: {
        ...mapState({
            countries: (state) => state.modApiCustomer.availableCountries,
        }),
    },
    mounted() {
        if (_.isEmpty(this.countries)) {
            this.getAvailableCountries();
        }
    },*/

    methods: {
        ...mapActions({
            getAvailableCountries: 'modApiCustomer/getAvailableCountries',
            subscribeNewsletter: 'modApiForm/subscribeNewsletter',
            unsubscribeNewsletter: 'modApiForm/unsubscribeNewsletter',
            flashMessage: 'modFlash/flashMessage',
        }),
        submitForm() {
            if (this.form.action === 'subscribe') {
                this.subscribeNewsletter({
                    email: this.form.email,
                    salutationId: this.form.salutation,
                    firstName: this.form.firstName,
                    lastName: this.form.lastName,
                    //street: this.form.street + ' ' + this.form.houseNumber,
                    //city: this.form.city,
                    //zipCode: this.form.zipCode,
                })
                    .then(() => {
                        this.form = new Form({
                            firstName: '',
                            lastName: '',
                            email: '',
                            salutation: '',
                            street: '',
                            zipCode: '',
                            houseNumber: '',
                            action: 'subscribe',
                        });
                        this.error = '';
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('You successfully signed up to our newsletter.'),
                            keepOnRouteChange: true,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        this.error = 'error';
                    });
            } else {
                this.unsubscribeNewsletter({
                    email: this.form.email,
                })
                    .then(() => {
                        this.form = new Form({
                            firstName: '',
                            lastName: '',
                            email: '',
                            salutation: '',
                            street: '',
                            zipCode: '',
                            houseNumber: '',
                            action: 'subscribe',
                        });
                        this.error = '';
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('You successfully unsubscribed from our newsletter.'),
                            keepOnRouteChange: true,
                        });
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            }
        },
    },
};
</script>
