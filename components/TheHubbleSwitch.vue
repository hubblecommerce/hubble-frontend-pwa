<template>
    <div class="hubble-switch">
        <input type="checkbox" id="hubble-switch" name="set-name" class="hbl-switch-input" v-model="isChecked" @change="toggleHubble()">
        <label for="hubble-switch" class="hbl-switch-label">
            <span class="toggle--on">On</span>
            <span class="toggle--off">Off</span>
        </label>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "TheHubbleSwitch",

        data() {
            return {
                isChecked: true
            }
        },

        computed: {
            ...mapState({
                isHubble: state => state.modHubbleSwitch.isHubble
            })
        },

        created() {
            this.isChecked = this.isHubble
        },

        methods: {
            toggleHubble: function() {

                this.$store.dispatch('modFlash/resetMessage');

                setTimeout(() => {
                    if(this.isChecked) {
                        this.$store.commit('modHubbleSwitch/turnOnHubble');

                        this.$store.dispatch('modFlash/flashMessage', {
                            flashType: 'success',
                            flashMessage: this.$t('Hubble performance boost activated!')
                        });
                    }
                    if(!this.isChecked) {
                        this.$store.commit('modHubbleSwitch/turnOffHubble');

                        this.$store.dispatch('modFlash/flashMessage', {
                            flashType: 'error',
                            flashMessage: this.$t('Without hubble performance boost...')
                        });
                    }
                }, 1);

            }
        }
    }
</script>

<style lang="scss" scoped>
    .hubble-switch {
        position: absolute;
        left: 15px;
        top: -15px;

        .hbl-switch-label {
            margin: 15px 5px 0 0;
            min-width: 75px;
        }
    }
</style>
