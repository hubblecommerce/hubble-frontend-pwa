<template>
    <div class="password-change-wrp">
        <div class="pw-change text-small" @click.prevent="toggle">
            {{ $t('Change your Password') }}
        </div>

        <transition-expand-layer :right-left="true">
            <div v-if="showMenu" class="transition-expand-wrp">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />
                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="$t('Change your Password')" />
                    </div>

                    <validation-observer ref="observer" v-slot="{ passes }" class="password-change-form-wrp" tag="form" @submit.prevent="passes(submitUpdatePassword)">
                        <validation-provider v-slot="{ errors }" name="email" rules="required|password" mode="passive" tag="div" class="hbl-input-group input-icon">
                            <input id="passwordOld"
                                   v-model="form.passwordOld"
                                   type="password"
                                   autocomplete="on"
                                   value=""
                                   :class="{invalid: errors.length > 0}"
                                   placeholder=" "
                                   required
                            >

                            <label for="passwordOld" v-text="$t('Current Password')" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>

                        <validation-provider v-slot="{ errors }" name="password" rules="required|password:4" mode="passive" tag="div" class="hbl-input-group input-icon">
                            <input id="password"
                                   v-model="form.password"
                                   type="password"
                                   autocomplete="on"
                                   value=""
                                   :class="{invalid: errors.length > 0}"
                                   placeholder=" "
                                   required
                            >

                            <label for="password" v-text="$t('New Password')" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>

                        <validation-provider v-slot="{ errors }" name="email" rules="required" mode="passive" tag="div" class="hbl-input-group input-icon">
                            <input id="passwordConfirm"
                                   v-model="form.passwordConfirm"
                                   type="password"
                                   autocomplete="on"
                                   value=""
                                   :class="{invalid: errors.length > 0}"
                                   placeholder=" "
                                   required
                            >

                            <label for="passwordConfirm" v-text="$t('Confirm new Password')" />

                            <div class="validation-msg" v-text="$t(errors[0])" />
                        </validation-provider>

                        <div class="error-message" v-text="error" />

                        <button class="button-primary w-100" @click.prevent="passes(submitUpdatePassword)">
                            {{ $t('Change your Password') }}
                            <material-ripple />
                        </button>
                    </validation-observer>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import Form from "@hubblecommerce/hubble/core/utils/form";

    export default {
        name: "CustomerPasswordChange",

        data() {
            return {
                name: 'CustomerPasswordChange',
                form: new Form({
                    passwordOld: '',
                    password: '',
                    passwordConfirm: '',
                }),
                error: ''
            }
        },

        computed: {
            ...mapState({
                offcanvas: state => state.modNavigation.offcanvas,
            }),
            showMenu: function() {
                return this.offcanvas.component === this.name;
            }
        },

        methods: {
            ...mapActions({
                passwordUpdate: 'modApiCustomer/passwordUpdate',
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                flashMessage: 'modFlash/flashMessage'
            }),
            submitUpdatePassword: function () {
                let payload = {
                    password_old: this.form.passwordOld,
                    password: this.form.password,
                    password_confirm: this.form.passwordConfirm
                };

                this.passwordUpdate(payload).then(() => {
                    this.toggleOffcanvasAction({
                        component: this.name,
                        direction: 'rightLeft'
                    }).then(() => {
                        // Success Flash Message
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('You successfully changed your password.'),
                            keepOnRouteChange: true
                        });
                    });
                }).catch(() => {
                    this.error = this.$t('Password could not be changed.');
                });
            },
            toggle: function() {
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                }).then(() => {
                    // Reset data
                    this.error = '';

                    this.form = new Form({
                        passwordOld: '',
                        password: '',
                        passwordConfirm: '',
                    });
                });
            },
        }
    }
</script>
