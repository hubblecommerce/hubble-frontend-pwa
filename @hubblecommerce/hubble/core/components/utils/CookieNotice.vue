<template>
    <div class="row cookie-notice-wrp">
        <template v-if="$mq === 'lg' || $mq === 'md'">
            <div class="col-9 cookie-text-wrp">
                <div class="cookie-icon">
                    <i class="icon icon-cookie" />
                </div>

                <div class="text">
                    Diese Website verwendet Cookies, um die Interaktion mit anderen Websites und sozialen Netzwerken zu ermöglichen sowie den Komfort
                    bei der Benutzung dieser Website zu erhöhen. Details entnehmt Ihr bitte unseren Hinweisen zum
                    <nuxt-link class="link-primary" :to="'/Datenschutz'">Datenschutz.</nuxt-link>
                </div>
            </div>
            <div class="col-3 cookie-notice-button-wrp">
                <button class="float-right button button-primary" @click="deactivateCookieNotice" v-text="'Verstanden'" />
            </div>
        </template>
        <template v-if="$mq === 'sm'">
            <div class="row cookie-notice-wrp">
                <div class="row col-12 cookie-text-wrp">
                    <div class="text">
                        Diese Website verwendet Cookies, um die Interaktion mit anderen Websites und sozialen Netzwerken zu ermöglichen sowie den
                        Komfort bei der Benutzung dieser Website zu erhöhen. Details entnehmt Ihr bitte unseren Hinweisen zum
                        <nuxt-link class="link-primary cookie-link" :to="'/Datenschutz'">Datenschutz.</nuxt-link>
                    </div>
                </div>
                <div class="row col-12 cookie-notice-button-wrp">
                    <button class="button button-primary cookie-notice-button" @click="deactivateCookieNotice">
                        Verstanden
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'CookieNotice',

    methods: {
        ...mapActions({
            acceptCookieNotice: 'modCookieNotice/acceptCookieNotice',
        }),
        deactivateCookieNotice: function () {
            this.acceptCookieNotice();
        },
    },
};
</script>
