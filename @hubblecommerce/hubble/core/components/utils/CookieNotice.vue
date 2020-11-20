<template>
    <div class="row cookie-notice-outer-wrp">
        <div class="cookie-notice-wrp">
            <div class="cookie-text-wrp">
                <div class="cookie-icon">
                    <i class="icon icon-cookie" />
                </div>

                <div class="text cookie-text">
                    {{ $t('Cookie text') }}
                    <nuxt-link class="link-primary cookie-link" :to="'/Datenschutz'" v-text="$t('Data protection')" />
                </div>
            </div>

            <div class="cookie-notice-button-wrp">
                <button class="button button-primary cookie-notice-button" @click="deactivateCookieNotice" v-text="$t('Understood')" />
            </div>
        </div>
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
