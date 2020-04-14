<template>
    <div v-if="!loading && !apiError" class="shipping-methods-wrp">
        <div class="headline headline-3" v-text="$t('Shipping methods')" />

        <div v-for="method in shippingMethods" :key="method.key" v-if="method.active" class="method-wrp hbl-checkbox">
            <input :id="'shipping-option-' + method.id" v-model="chosenMethod" type="radio" :value="method.id">

            <label :for="'shipping-option-' + method.id" class="method-label">
                <span class="name" v-text="method.name" />
                <span class="description" v-text="method.description" />
                <span :class="'method-image-' + method.key" />
            </label>
        </div>
        <div class="validation-msg" v-text="$t(shippingError)" />
    </div>

    <div v-else-if="apiError" class="shipping-methods-api-error-wrp">
        No shipping methods found
    </div>

    <div v-else class="shipping-methods-placeholder">
        <div class="loader lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
    export default {
        name: "ShippingMethods",

        data() {
            return {
                loading: false,
                apiError: false,
                chosenMethod: '',
                chosenMethodObj: {}
            }
        },

        computed: {
            ...mapState({
                shippingMethods: state => state.modApiPayment.shippingMethods,
                chosenShippingMethod: state => state.modApiPayment.order.chosenShippingMethod,
                shippingError: state => state.modApiPayment.shippingError,
                shippingAddress: state => state.modApiCustomer.customer.shippingAddress,
                countries: state => state.modApiCustomer.availableCountries,
                customerAddresses: state => state.modApiCustomer.customer.customerAddresses
            }),
            ...mapGetters({
                getChosenShippingMethod: 'modApiPayment/getChosenShippingMethod'
            }),
        },

        watch: {
            chosenMethod: function(newValue) {
                // Start Checkout loader
                this.setProcessingCheckout();

                this.setMethodById(newValue);

                this.storeChosenShippingMethod(this.chosenMethodObj).then(() => {
                    this.recalculateCart().then(() => {
                        this.resetProcessingCheckout();
                    });
                });
            },
        },

        mounted() {
            this.loading = true;
            if(_.isEmpty(this.shippingMethods)) {
                this.getShippingMethods().then(() => {
                    this.setChosenShippingMethod();

                    this.loading = false;
                }).catch(() => {
                    this.apiError = true;

                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        },

        methods: {
            ...mapActions({
                storeChosenShippingMethod: 'modApiPayment/storeChosenShippingMethod',
                recalculateCart: 'modCart/recalculateCart',
                getShippingMethodsFromAPI: 'modApiPayment/getShippingMethods'
            }),
            ...mapMutations({
                setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
                resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout'
            }),
            getShippingMethods: function() {
                // Fetch methods from api, to make them accessible in vuex store
                return new Promise((resolve, reject) => {
                    this.getShippingMethodsFromAPI().then(() => {
                        resolve();
                    }).catch((error) => {
                        this.loading = false;

                        reject(error);
                    });
                })
            },
            setChosenShippingMethod: function() {
                if(!_.isEmpty(this.getChosenShippingMethod)) {
                    this.chosenMethod = this.getChosenShippingMethod.id;
                }
            },
            setMethodById: function(key) {
                _.forEach(this.shippingMethods, (val) => {
                    if(val.id === key ){
                        this.chosenMethodObj = val;
                    }
                });
            }
        }
    }
</script>
