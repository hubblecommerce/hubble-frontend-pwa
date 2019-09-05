<template>
    <form @submit.prevent="attemptRegistration">
        <template v-if="errors.length">
            <div v-for="(error, index) in errors" :key="index" class="form-validation-error" v-text="error"></div>
        </template>

        <div class="hbl-input-group">
            <input id="username" type="text" name="username" value="" v-bind:class="{invalid: formErrors.loginUsername}" v-model="loginUsername" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="username" v-text="$t('Username')"></label>
            <span class="validation-msg" v-if="formErrors.loginUsername" v-text="formErrors.loginUsername"></span>
        </div>

        <div class="hbl-input-group">
            <input id="email" type="text" name="email" value="" v-bind:class="{invalid: formErrors.loginEmail}" v-model="loginEmail" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="email" v-text="$t('Email Address')"></label>
            <span class="validation-msg" v-if="formErrors.loginEmail" v-text="formErrors.loginEmail"></span>
        </div>

        <div class="hbl-input-group">
            <input id="password" type="password" name="password" autocomplete="on" value="" v-bind:class="{invalid: formErrors.loginPassword}" v-model="loginPassword" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="password" v-text="$t('Password')"></label>
            <span class="validation-msg" v-if="formErrors.loginPassword" v-text="formErrors.loginPassword"></span>
        </div>

        <div class="hbl-input-group">
            <input id="passwordReset" type="password" name="password" value="" v-bind:class="{invalid: formErrors.loginPasswordConfirm}" v-model="loginPasswordConfirm" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="passwordReset" v-text="$t('Password repeat')"></label>
            <span class="validation-msg" v-if="formErrors.loginPasswordConfirm" v-text="formErrors.loginPasswordConfirm"></span>
        </div>

        <button class="button-primary" @click="attemptRegistration">
            {{$t('Register')}}
            <material-ripple></material-ripple>
        </button>
    </form>
</template>

<script>
    export default {
        name: "RegisterForm",

        data() {
            return {
                curComponent: 'view-auth',

                errors: [],
                formErrors: {},
                formHasErrors: false,

                loginEmail: '',
                loginUsername: '',
                loginPassword: '',
                loginPasswordConfirm: ''
            }
        },

        methods: {
            validateForm() {

                return new Promise((resolve, reject) => {

                    if (this.loginUsername &&
                        this.loginEmail &&
                        this.loginPassword &&
                        this.loginPasswordConfirm &&
                        this.loginPassword == this.loginPasswordConfirm) {
                        this.formErrors = {};

                        resolve('Form OK!');
                    }

                    this.formErrors = {};

                    if (!this.loginUsername) {
                        this.formErrors['loginUsername'] = this.$t('Name required.');
                    }

                    if (!this.loginEmail) {
                        this.formErrors['loginEmail'] = this.$t('Email Address is required.');
                    }

                    if (!this.loginPassword) {
                        this.formErrors['loginPassword'] = this.$t('Password is required.');
                    }

                    if (!this.loginPasswordConfirm) {
                        this.formErrors['loginPasswordConfirm'] = this.$t('Password confirmation is required.');
                    }

                    if (this.loginPassword !== this.loginPasswordConfirm) {
                        this.formErrors['loginPasswordConfirm'] = this.$t('Password Confirm must be equal to password field.');
                    }

                    if(! _.isEmpty(this.formErrors)) {
                        reject('validateForm failed.');
                    }

                    resolve('Form OK!');
                });
            },
            attemptRegistration() {
                // console.log("attemptRegistration ...");

                this.validateForm()
                    .then(response => {
                        // console.log("validateForm response: %o", response);

                        // attempt registration ...
                        this.$store.dispatch('modUser/attemptRegistration', {
                            email: this.loginEmail,
                            username: this.loginUsername,
                            password: this.loginPassword
                        })
                            .then(response => {
                                // console.log("attemptRegistration ... backend response success: %o", response);

                                let currentRoute = this.$route.name;

                                if(_.includes(currentRoute, 'customer-register')) {
                                    this.$router.push({
                                        path: this.localePath('customer-dashboard')
                                    });
                                } else {
                                    this.$store.dispatch('modFlash/flashMessage', {
                                        flashType: 'success',
                                        flashMessage: this.$t('Successfully registered in as %s').replace('%s', this.loginUsername)
                                    });
                                }
                            })
                            .catch(response => {
                                // console.log("attemptRegistration ... backend response failed: %o", response);

                                this.status = response;
                                this.hasStatus = true;
                            })
                    })
                    .catch(response => {
                        // console.log("validateForm failed!");

                        return;
                    });
            }
        }
    }
</script>
