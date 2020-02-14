<template>
    <div class="language-wrp customer-account-cpt-wrp account-wrp">
        <button class="button-icon" @click='toggle()' v-if="vp === 'md' || vp === 'lg'">
            <i class="icon icon-globe text-white"></i><span class="hidden-link-name">Language</span>
            <material-ripple></material-ripple>
        </button>
        <transition-pop-up>
            <div v-if="displaySwitch && (vp === 'md' || vp === 'lg')" class="customer-account-wrp" v-click-outside="hideSwitch">
                <div class="link-wrp">
                    <nuxt-link :to="localePath('index', 'de')">
                        <button v-bind:class="{'button-primary': isLocale('de'), 'button-secondary': !isLocale('de')}" >
                            Deutsch
                            <material-ripple></material-ripple>
                        </button>
                    </nuxt-link>
                    <nuxt-link :to="localePath('index', 'en')">
                        <button v-bind:class="{'button-primary': isLocale('en'), 'button-secondary': !isLocale('en')}" >
                            English
                            <material-ripple></material-ripple>
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </transition-pop-up>
        <collapsible toggle-text="Change Language" toggle-icon-class="icon-globe mr-3" v-if="vp === 'sm'">
            <div class="content-wrp">
                <nuxt-link :to="localePath('index', 'de')">
                    <button v-bind:class="{'button-primary': isLocale('de'), 'button-secondary': !isLocale('de')}" >
                        Deutsch
                        <material-ripple></material-ripple>
                    </button>
                </nuxt-link>
                <nuxt-link :to="localePath('index', 'en')">
                    <button v-bind:class="{'button-primary': isLocale('en'), 'button-secondary': !isLocale('en')}" >
                        English
                        <material-ripple></material-ripple>
                    </button>
                </nuxt-link>
            </div>
        </collapsible>
    </div>
</template>

<script>
    export default {
        name: "TheLanguageSwitch",
        data() {
            return {
                displaySwitch: false,
                vp: ''
            }
        },
        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.displaySwitch = false;
            }
        },
        methods: {
            hideSwitch: function() {
                this.displaySwitch = false;
            },
            toggle: function() {
                this.displaySwitch = !this.displaySwitch;
            },
            isLocale: function(code) {
                return code === this.$i18n.locale;
            }
        },
        mounted: function() {
            // make Media Query variable reactive in this component
            this.vp = this.$mq;
        }
    }
</script>
