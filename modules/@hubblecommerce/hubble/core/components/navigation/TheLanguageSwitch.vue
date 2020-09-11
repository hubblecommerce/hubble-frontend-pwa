<template>
    <div class="language-wrp customer-account-cpt-wrp account-wrp">
        <button v-if="vp === 'md' || vp === 'lg'" class="button-icon" @click="toggle()">
            <i class="icon icon-globe text-white" /><span class="hidden-link-name">Language</span>
            <material-ripple />
        </button>

        <transition-pop-up>
            <div v-if="displaySwitch && (vp === 'md' || vp === 'lg')" v-click-outside="hideSwitch" class="customer-account-wrp">
                <div class="link-wrp">
                    <nuxt-link :to="localePath('index', 'de')">
                        <button :class="{ 'button-primary': isLocale('de'), 'button-secondary': !isLocale('de') }">
                            Deutsch
                            <material-ripple />
                        </button>
                    </nuxt-link>

                    <nuxt-link :to="localePath('index', 'en')">
                        <button :class="{ 'button-primary': isLocale('en'), 'button-secondary': !isLocale('en') }">
                            English
                            <material-ripple />
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </transition-pop-up>

        <collapsible v-if="vp === 'sm'" toggle-text="Change Language" toggle-icon-class="icon-globe mr-3">
            <div class="content-wrp">
                <nuxt-link :to="localePath('index', 'de')">
                    <button :class="{ 'button-primary': isLocale('de'), 'button-secondary': !isLocale('de') }">
                        Deutsch
                        <material-ripple />
                    </button>
                </nuxt-link>

                <nuxt-link :to="localePath('index', 'en')">
                    <button :class="{ 'button-primary': isLocale('en'), 'button-secondary': !isLocale('en') }">
                        English
                        <material-ripple />
                    </button>
                </nuxt-link>
            </div>
        </collapsible>
    </div>
</template>

<script>
import Vue from 'vue';
import vClickOutside from 'v-click-outside';

export default {
    name: 'TheLanguageSwitch',

    components: {
        Collapsible: () => import('../utils/Collapsible'),
    },

    data() {
        return {
            displaySwitch: false,
            vp: '',
        };
    },

    watch: {
        '$route.path': function () {
            // Close menu layer if route changes
            this.displaySwitch = false;
        },
    },

    created() {
        Vue.use(vClickOutside);
    },

    mounted: function () {
        // make Media Query variable reactive in this component
        this.vp = this.$mq;
    },

    methods: {
        hideSwitch: function () {
            this.displaySwitch = false;
        },
        toggle: function () {
            this.displaySwitch = !this.displaySwitch;
        },
        isLocale: function (code) {
            return code === this.$i18n.locale;
        },
    },
};
</script>
