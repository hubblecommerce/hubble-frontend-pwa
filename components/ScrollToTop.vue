<template>
    <transition name="fade">
        <button v-if="show" @click="scrollToTop()" class="scroll-to-top">
            <div class="hidden-link-name">Scroll to top</div>
            <i class="icon chevron-up"></i>
            <material-ripple/>
        </button>
    </transition>
</template>

<script>
    export default {
        name: "ScrollToTop",

        data() {
            return {
                show: false
            }
        },

        created() {
            if (process.browser) {
                this.handleScroll;
                window.addEventListener('scroll', this.handleScroll);
            }
        },

        destroyed () {
            if (process.browser) {
                window.removeEventListener('scroll', this.handleScroll);
            }
        },

        methods: {
            scrollToTop: function() {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            },
            getOffset: function(el) {
                const offset = require('document-offset') // ssr-friendly
                return offset(el) // polyfill
            },
            handleScroll () {
                if(window.scrollY > 200) {
                    this.show = true;
                } else {
                    this.show = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>
