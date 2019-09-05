<template>
    <form @submit.prevent="attemptLogin">
        <div class="hbl-input-group input-icon">
            <input id="username" type="text" name="username" value="" v-model="loginUsername" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="username" v-text="$t('Username')+': demo'"></label>
            <i class="icon icon-mail"></i>
        </div>
        <div class="hbl-input-group input-icon">
            <input id="password" type="password" name="password" autocomplete="on" value="" v-model="loginPassword" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label for="password" v-text="$t('Password')+': demo'"></label>
            <i class="icon icon-lock"></i>
        </div>
        <div class="pw-reset" v-text="$t('Reset your Password')"></div>
        <button class="button-primary" @click="attemptLogin">
            {{$t('Login')}}
            <material-ripple></material-ripple>
        </button>
    </form>
</template>

<script>
    export default {
        name: "LoginForm",

        data() {
            return {
                curComponent: 'view-auth',

                loginUsername: '',
                loginPassword: ''
            }
        },

        methods: {
            attemptLogin: function() {
                // console.log("attemptLogin ...");

                this.$store.dispatch('modUser/attemptLogin', {
                    username: this.loginUsername,
                    password: this.loginPassword
                })
                    .then(response => {
                        // console.log("attemptLogin ... backend response success: %o", response);

                        let currentRoute = this.$route.name;

                        if(_.includes(currentRoute, 'customer-login')) {
                            this.$router.push({
                                path: this.localePath('customer-dashboard')
                            });
                        } else {
                            this.$store.dispatch('modFlash/flashMessage', {
                                flashType: 'success',
                                flashMessage: this.$t('Successfully logged in as %s').replace('%s', this.loginUsername)
                            });
                        }
                    })
                    .catch(response => {
                        // console.log("attemptLogin ... backend response failed: %o", response);
                    })
            },
        }
    }
</script>

<style scoped>

</style>
