<template>
    <div>
        <button class="button-primary dashboard-section-button-edit" @click.prevent="editCustomerInfo">{{ $t('Edit Information') }}</button>

        <transition-expand-layer :right-left="true">
            <div v-if="showAccountInformation" class="transition-expand-wrp">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu"
                                @click="editCustomerInfo()"
                        >
                            <i class="icon icon-close" aria-hidden="true" />
                            <material-ripple />
                        </button>

                        <div class="overlay-headline">{{ $t('Edit Customer Information') }}</div>
                    </div>

                    <div>
                        <div class="row content-wrp dashboard-section-form">
                            <div class="col-12">
                                <validation-observer ref="observer" v-slot="{ passes }" tag="form" class="form-edit" @submit.prevent="passes(saveChanges)">
                                    <validation-provider v-slot="{ errors }" name="gender" rules="required" mode="passive" tag="div" class="hbl-select">
                                        <select v-model="customerInfo.salutationId" class="select-text" :class="{invalid: errors.length > 0}" required>
                                            <option v-for="salutation in salutations" :key="salutation.key" :value="salutation.key">{{ salutation.value }}</option>
                                        </select>

                                        <label class="select-label" v-text="$t('Salutation')+'*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <validation-provider v-slot="{ errors }" name="firstName" rules="required|max:30" mode="eager" tag="div" class="hbl-input-group">
                                        <input id="firstName"
                                               v-model="customerInfo.firstName"
                                               type="text"
                                               name="firstName"
                                               value=""
                                               :class="{invalid: errors.length > 0}"
                                               placeholder=" "
                                               required
                                        >

                                        <label for="firstName" v-text="$t('First Name')+'*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <validation-provider v-slot="{ errors }" name="lastName" rules="required|max:30" mode="eager" tag="div" class="hbl-input-group">
                                        <input id="lastName"
                                               v-model="customerInfo.lastName"
                                               type="text"
                                               name="lastName"
                                               value=""
                                               :class="{invalid: errors.length > 0}"
                                               placeholder=" "
                                               required
                                        >

                                        <label for="lastName" v-text="$t('Last Name')+'*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <div class="dashboard-section-title">{{ $t('Please enter your password to change your email address') }}</div>

                                    <validation-provider vid="email" name="current-email" mode="passive" tag="div" class="hbl-input-group">
                                        <input id="current-email"
                                               v-model="customerInfo.currentEmail"
                                               type="text"
                                               name="current-email"
                                               value=""
                                               placeholder=" "
                                               disabled
                                               class="dashboard-section-input-disabled"
                                        >

                                        <label for="current-email" v-text="$t('Current Email Address')" />
                                    </validation-provider>

                                    <validation-provider v-slot="{ errors }"
                                                         vid="email"
                                                         name="email"
                                                         :rules="requiredEmail"
                                                         mode="eager"
                                                         tag="div"
                                                         class="hbl-input-group"
                                    >
                                        <input id="email"
                                               v-model="customerInfo.email"
                                               type="text"
                                               name="email"
                                               value=""
                                               :class="{invalid: errors.length > 0}"
                                               placeholder=" "
                                        >

                                        <label for="email" v-text="$t('New Email Address')+'*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <validation-provider v-slot="{ errors }"
                                                         name="email-repeat"
                                                         :rules="requiredEmailRepeat"
                                                         mode="eager"
                                                         tag="div"
                                                         class="hbl-input-group"
                                    >
                                        <input id="email-repeat"
                                               v-model="customerInfo.emailRepeat"
                                               type="text"
                                               name="email-repeat"
                                               value=""
                                               :class="{invalid: errors.length > 0}"
                                               placeholder=" "
                                               @paste="onPaste($event)"
                                        >

                                        <label for="email-repeat" v-text="$t('Confirm New Email Address')+'*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>


                                    <validation-provider v-slot="{ errors }"
                                                         name="password"
                                                         :rules="requiredPassword"
                                                         mode="eager"
                                                         tag="div"
                                                         class="hbl-input-group input-icon"
                                    >
                                        <input id="password"
                                               v-model="customerInfo.password"
                                               type="password"
                                               autocomplete="on"
                                               value=""
                                               :class="{invalid: errors.length > 0}"
                                               placeholder=" "
                                        >

                                        <label for="password" v-text="$t('Password')" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <template v-for="error in errors">
                                        <div class="error-message" v-text="error" />
                                    </template>

                                    <button class="button-primary w-100" @click.prevent="passes(saveChanges)">
                                        {{ $t('Save Profile') }}
                                        <material-ripple />
                                    </button>
                                </validation-observer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { addBackendErrors, salutations } from "@hubblecommerce/hubble/core/utils/formMixins";
    import { mapActions, mapState } from "vuex";

    export default {
        name: 'CustomerAccountInformation',

        mixins: [addBackendErrors, salutations],

        data() {
            return {
                name: 'CustomerAccountInformation',

                orders: [],

                salutations: null,

                customerInfo: {
                    firstName: '',
                    lastName: '',
                    salutationId: '',
                    title: '',
                    birthDay: null,
                    birthdayMonth: null,
                    birthdayYear: null,

                    currentEmail: '',

                    email: '',
                    emailRepeat: '',
                    password: ''
                },

                errors: []
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer,
                offcanvas: state => state.modNavigation.offcanvas
            }),
            customerData: function() {
                return this.customer.customerData;
            },
            showAccountInformation: function() {
                return this.offcanvas.component === this.name;
            },
            requiredEmail: function () {
                let newEmailRepeat = this.customerInfo.emailRepeat;

                return {
                    required: newEmailRepeat === '' ? false : true,
                    email: true
                }
            },
            requiredEmailRepeat: function () {
                let newEmail = this.customerInfo.email;

                return {
                    required: newEmail === '' ? false : true,
                    email: true,
                    confirmed: 'email'
                }
            },
            requiredPassword: function () {
                let newEmail = this.customerInfo.email === '' ? false : true;
                let newEmailRepeat = this.customerInfo.emailRepeat === '' ? false : true;
                let required = false;
                if (newEmail && newEmailRepeat) {
                    required = true;
                }

                return {
                    required: required,
                    password: 4
                }
            }
        },

        created () {
            this.customerInfo = {
                firstName: this.customerData.firstName,
                lastName: this.customerData.lastName,
                salutationId: this.customerData.salutationId,
                title: '',
                birthDay: null,

                currentEmail: this.customerData.email,

                email: '',
                emailRepeat: '',
                password: ''
            }
        },

        methods: {
            ...mapActions({
                flashMessage: 'modFlash/flashMessage',

                updateCustomerInfo: 'modApiCustomer/updateCustomerInfo',
                updateCustomerEmail: 'modApiCustomer/updateCustomerEmail',

                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction'
            }),
            editCustomerInfo: function() {
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                })
            },
            saveChanges: function () {
                this.errors = [];

                this.updateCustomerInfo({
                    firstName: this.customerInfo.firstName,
                    lastName: this.customerInfo.lastName,
                    salutationId: this.customerInfo.salutationId
                }).then(() => {
                    if (this.customerInfo.email !== '') {
                        this.updateCustomerEmail({
                            email: this.customerInfo.email,
                            emailRepeat: this.customerInfo.emailRepeat,
                            password: this.customerInfo.password
                        }).then(() => {
                            this.customerInfo.currentEmail = this.customerData.email;
                            this.customerInfo.email = '';
                            this.customerInfo.emailRepeat = '';
                            this.customerInfo.password = '';

                            this.toggleOffcanvasAction({
                                component: this.name,
                                direction: 'rightLeft'
                            }).then(() => {
                                this.flashMessage({
                                    flashType: 'success',
                                    flashMessage: this.$t('You successfully changed your information.'),
                                    keepOnRouteChange: true
                                });

                                this.errors = [];
                            }).catch((err) => {
                                console.log(err);
                            })
                        }).catch((err) => {
                            this.errors.push(this.$t('Email could not be changed.'));
                            _.forEach(this.addBackendErrors(err), error => {
                                this.errors.push(error);
                            })

                            if (!this.offcanvas.isActive) {
                                this.toggleOffcanvasAction({
                                    component: this.name,
                                    direction: 'rightLeft'
                                })
                            }
                        })
                    } else {
                        this.toggleOffcanvasAction({
                            component: this.name,
                            direction: 'rightLeft'
                        }).then(() => {
                            this.flashMessage({
                                flashType: 'success',
                                flashMessage: this.$t('You successfully changed your information.'),
                                keepOnRouteChange: true
                            });

                            this.errors = [];
                        })
                    }
                }).catch((err) => {
                    this.errors.push(this.$t('No network connection.'));
                })
            },
            onPaste: function(e) {
                e.preventDefault();
            }
        }
    }
</script>
