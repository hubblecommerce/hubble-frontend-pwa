<template>
    <div v-if="!loading && !apiError && !addressError" class="shipping-methods-wrp">
        <div class="headline headline-3" v-text="$t('Shipping methods')" />
        <div v-for="method in shippingMethods" :key="method.key" class="method-wrp hbl-checkbox">
            <input :id="'shipping-option-' + method.key" v-model="chosenMethod" type="radio" :value="method.key">
            <label :for="'shipping-option-' + method.key" class="method-label">
                <span class="name" v-text="method.label" />
                <span class="description" v-text="method.description" />
                <span :class="'method-image-' + method.key" />
            </label>
        </div>
        <div class="validation-msg" v-text="$t(shippingError)" />
    </div>
    <div v-else-if="apiError" class="shipping-methods-api-error-wrp">
        No shipping methods found
    </div>
    <div v-else-if="addressError" class="shipping-methods-api-error-wrp" v-text="$t('delivery_notice')" />
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
    import {mapState, mapGetters} from 'vuex';
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
                shippingAddress: state => state.modApiPayment.customer.shippingAddress,
                countries: state => state.modApiPayment.availableCountries,
                customerAddresses: state => state.modApiPayment.customer.customerAddresses
            }),
            ...mapGetters({
                getChosenShippingMethod: 'modApiPayment/getChosenShippingMethod'
            }),
            addressError: function() {
                let addressError = true;
                if(!_.isEmpty(this.shippingAddress)) {
                    _.forEach(this.countries, country => {
                        if(this.shippingAddress.payload.country === country.iso_code_2) {
                            addressError = !country.shipping_status;
                        }
                    });
                }
                return addressError;
            },


        },

        watch: {
            chosenMethod: function(newValue) {
                this.setMethodById(newValue);
                this.$store.dispatch('modApiPayment/storeChosenShippingMethod', this.chosenMethodObj);
            },

            customerAddresses: function() {
                // Check allowed payments if address changed

                if(!this.addressError) {
                    this.getShippingMethods().then();
                }


                // Reset choosen payment method after address changed
                this.chosenMethod = 1;
                this.chosenMethodObj = {};
            }
        },

        mounted() {
            this.loading = true;
            this.getShippingMethods().then(()=>{
                this.setChosenShippingMethod();
                this.loading = false;
            }).catch(() => {
                this.apiError = true;
                this.loading = false;
            });
        },

        methods: {
            getShippingMethods: function() {
                // Fetch methods from api, to make them accessible in vuex store
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('modApiPayment/getShippingMethods').then(() => {
                        resolve();
                    }).catch((error) => {
                        this.loading = false;
                        reject(error);
                    });
                })
            },
            setChosenShippingMethod: function() {
                if(this.getChosenShippingMethod) {
                    this.chosenMethod = this.getChosenShippingMethod.key;
                }
            },
            setMethodById: function(key) {
                _.forEach(this.shippingMethods, (val) => {
                    if(val.key === key ){
                        this.chosenMethodObj = val;
                    }
                });
            }
        }
    }
</script>
