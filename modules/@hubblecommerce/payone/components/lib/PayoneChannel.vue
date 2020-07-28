<template>
    <div>
        <div v-if="!scriptError && loaded">
            <client-only>
                <payone-channel-ajax-cc v-if="chosenPaymentMethod.key === 'payone_cc'" />
            </client-only>

            <client-only>
                <payone-channel-ajax-wlt v-if="chosenPaymentMethod.key === 'payone_wlt'" />
            </client-only>

            <client-only>
                <payone-channel-ajax-sb v-if="chosenPaymentMethod.key === 'payone_sb'" />
            </client-only>

            <client-only>
                <payone-channel-ajax-rec v-if="chosenPaymentMethod.key === 'payone_rec'" />
            </client-only>

            <client-only>
                <payone-channel-ajax-vor v-if="chosenPaymentMethod.key === 'payone_vor'" />
            </client-only>
        </div>
        <div v-if="scriptError" v-text="scriptError" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'PayoneChannel',
    data() {
        return {
            loaded: false,
            scriptError: false,
        };
    },
    computed: {
        ...mapState({
            chosenPaymentMethod: state => state.modApiPayment.order.chosenPaymentMethod,
        }),
    },
    mounted() {
        // Get namespace from module to call global function correctly
        let moduleNamespace = '$' + this._hubblePayoneOptions.namespace;
        this[moduleNamespace]
            .loadPayoneScript()
            .then(() => {
                this.loaded = true;
            })
            .catch(error => {
                this.scriptError = error;
            });
    },
};
</script>
