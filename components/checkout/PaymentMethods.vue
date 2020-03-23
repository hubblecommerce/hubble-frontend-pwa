<template>
    <div v-if="!loading && !apiError" class="payment-methods-wrp">
        <div class="headline headline-3" v-text="$t('Payment')" />

<!--        &lt;!&ndash; Static payment method Payone CC &ndash;&gt;-->
<!--        <div v-if="isAllowedMethod('payone_cc')" class="method-wrp cc">-->
<!--            <div class="hbl-checkbox">-->
<!--                <input id="payment-option-cc" v-model="chosenMethod" type="radio" :value="'payone_cc'">-->
<!--                <label for="payment-option-cc" class="method-label">-->
<!--                    <span class="name" v-text="$t('Credit Card')" />-->
<!--                    <span :class="'method-image-1'" />-->
<!--                </label>-->
<!--            </div>-->
<!--            <div v-show="chosenMethod === 'payone_cc'" class="payone-payment-wrp">-->
<!--                <client-only>-->
<!--                    <payone-channel-client-hosted-iframe />-->
<!--                </client-only>-->
<!--            </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Static payment method Payone Online Bank Tranfer &ndash;&gt;-->
<!--        <div v-if="isAllowedMethod('payone_sb')" class="method-wrp online-bank-transfer">-->
<!--            <div class="hbl-checkbox">-->
<!--                <input id="payment-option-sb" v-model="chosenMethod" type="radio" :value="'payone_sb'">-->
<!--                <label for="payment-option-sb" class="method-label">-->
<!--                    <span class="name" v-text="$t('Online Bank Transfer')" />-->
<!--                    <span class="description" v-text="$t('After checkout you will be redirected to the selected payment provider.')" />-->
<!--                    <span :class="'online-bank-transfer-image'" />-->
<!--                </label>-->
<!--            </div>-->
<!--            <div v-if="chosenMethod === 'payone_sb'" class="payone-payment-wrp">-->
<!--                <div class="hbl-checkbox">-->
<!--                    <input id="payment-option-sofort" v-model="onlinebanktransfertype" type="radio" :value="'PNT'">-->
<!--                    <label for="payment-option-sofort" class="method-label">-->
<!--                        <span class="name" v-text="'Sofortüberweisung Klarna'" />-->
<!--                    </label>-->
<!--                </div>-->
<!--                <div class="hbl-checkbox">-->
<!--                    <input id="payment-option-giropay" v-model="onlinebanktransfertype" type="radio" :value="'GPY'">-->
<!--                    <label for="payment-option-giropay" class="method-label">-->
<!--                        <span class="name" v-text="'giropay'" />-->
<!--                    </label>-->
<!--                </div>-->
<!--                <div class="hbl-input-group">-->
<!--                    <input id="sbIban" v-model="sbIban" type="text" name="name" placeholder=" " required>-->
<!--                    <label for="sbIban">IBAN*</label>-->
<!--                    <div v-if="ibanError" class="validation-msg" v-text="$t('Please insert valid IBAN')" />-->
<!--                </div>-->
<!--                <div class="hbl-input-group">-->
<!--                    <input id="sbBic" v-model="sbBic" type="text" name="name" placeholder=" " required>-->
<!--                    <label for="sbBic">BIC*</label>-->
<!--                    <div v-if="bicError" class="validation-msg" v-text="$t('Please insert valid BIC')" />-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Static payment method Payone Paypal &ndash;&gt;-->
<!--        <div v-if="isAllowedMethod('payone_wlt')" class="method-wrp paypal">-->
<!--            <div class="hbl-checkbox">-->
<!--                <input id="payment-option-pp" v-model="chosenMethod" type="radio" :value="'payone_wlt'">-->
<!--                <label for="payment-option-pp" class="method-label">-->
<!--                    <span class="name" v-text="$t('Paypal')" />-->
<!--                    <span class="description" v-text="$t('After checkout you will be redirected to paypal.')" />-->
<!--                    <span :class="'method-image-2'" />-->
<!--                </label>-->
<!--            </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Static payment method Payone Invoice &ndash;&gt;-->
<!--        <div v-if="isAllowedMethod('payone_rec')" class="method-wrp invoice">-->
<!--            <div class="hbl-checkbox">-->
<!--                <input id="payment-option-rec" v-model="chosenMethod" type="radio" :value="'payone_rec'">-->
<!--                <label for="payment-option-rec" class="method-label">-->
<!--                    <span class="name" v-text="$t('Invoice')" />-->
<!--                </label>-->
<!--            </div>-->
<!--            <div v-if="chosenMethod === 'payone_rec'" class="payone-payment-wrp">-->
<!--                <p class="text">-->
<!--                    Bitte beachten Sie, dass wir bei einer Lieferung auf Rechnung Ihre Adressdaten von einem zertifizierten-->
<!--                    Zahlungsdienstleister prüfen lassen. In seltenen Fällen kann es vorkommen, dass dort Personen unter der angegebenen-->
<!--                    korrekten Adresse nicht bekannt sind. Bitte wählen Sie dann eine andere Zahlart aus, da wir diese Prüfung leider nicht-->
<!--                    umgehen können.-->
<!--                </p>-->
<!--            </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Static payment method Payone Prepayment &ndash;&gt;-->
<!--        <div v-if="isAllowedMethod('payone_vor')" class="method-wrp prepayment">-->
<!--            <div class="hbl-checkbox">-->
<!--                <input id="payment-option-vor" v-model="chosenMethod" type="radio" :value="'payone_vor'">-->
<!--                <label for="payment-option-vor" class="method-label">-->
<!--                    <span class="name" v-text="$t('Prepayment')" />-->
<!--                </label>-->
<!--            </div>-->
<!--            <div v-if="chosenMethod === 'vor'" class="payone-payment-wrp">-->
<!--                <div class="text">Bitte überweisen Sie den Betrag <strong>{{ this.getTotal() }}</strong> auf folgendes Konto:</div>-->
<!--                <div class="text"><span class="label">Kontoinhaber:</span></div>-->
<!--                <div class="text"><span class="label">IBAN:</span></div>-->
<!--                <div class="text"><span class="label">BIC:</span></div>-->
<!--            </div>-->
<!--        </div>-->

        <!-- Dynamic payment methods from api -->
        <div v-for="method in paymentMethods" :key="method.id" v-if="method.active" class="method-wrp hbl-checkbox">
            <input :id="'payment-option-' + method.id" v-model="chosenMethod" type="radio" :value="method.payone_key ? method.payone_key : method.id ">
            <label :for="'payment-option-' + method.id" class="method-label">
                <span class="name" v-text="method.name" />
                <span class="description" v-text="method.description" />
                <span :class="'method-image-' + method.id" />
            </label>
        </div>

        <div class="validation-msg" v-text="$t(paymentError)" />
    </div>
    <div v-else-if="apiError" class="payment-methods-api-error-wrp">
        No payment methods found
    </div>
    <div v-else class="payment-methods-placeholder">
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
        name: "PaymentMethods",
        data() {
            return {
                loading: false,
                apiError: false,
                chosenMethod: null,
                chosenMethodObj: {},

                elvIban: '',
                elvBic: '',

                sbIban: '',
                sbBic: '',

                onlinebanktransfertype: 'PNT'
            }
        },

        computed: {
            ...mapState({
                paymentMethods: state => state.modApiPayment.paymentMethods,
                chosenPaymentMethod: state => state.modApiPayment.order.chosenPaymentMethod,
                paymentError: state => state.modApiPayment.paymentError,
                ibanError: state => state.modApiPayment.ibanError,
                bicError: state => state.modApiPayment.bicError,
                customerAddresses: state => state.modApiPayment.customer.customerAddresses
            }),
            ...mapGetters({
                getChosenPaymentMethod: 'modApiPayment/getChosenPaymentMethod'
            })
        },

        watch: {
            chosenMethod: function(newValue) {
                // Set method by payone_key
                this.setMethodById(newValue);

                // Build object as we need it for payone and api
                if(newValue === 'payone_cc') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_cc',
                        label: this.$t('Credit Card'),
                        payload: {}
                    }
                }

                if(newValue === 'payone_wlt') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_wlt',
                        label: this.$t('Paypal'),
                        payload: {}
                    }
                }

                if(newValue === 'payone_elv') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_elv',
                        label: this.$t('ELV'),
                        payload: {
                            iban: this.iban
                        }
                    }
                }

                if(newValue === 'payone_sb') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_sb',
                        label: this.$t('Online Bank Transfer'),
                        payload: {
                            onlinebanktransfertype: this.onlinebanktransfertype,
                            iban: this.sbIban,
                            bic: this.sbBic
                        }
                    };
                }

                if(newValue === 'payone_rec') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_rec',
                        label: this.$t('Invoice'),
                        payload: {}
                    }
                }

                if(newValue === 'payone_vor') {
                    this.chosenMethodObj = {
                        id: this.chosenMethodObj.id,
                        key: 'payone_vor',
                        label: this.$t('Prepayment'),
                        payload: {}
                    }
                }

                if(!_.isEmpty(this.chosenMethodObj)) {
                    this.$store.dispatch('modApiPayment/storeChosenPaymentMethod', this.chosenMethodObj);
                }
            },

            elvIban: function() {
                this.setElvData();
            },

            elvBic: function() {
                this.setElvData();
            },

            onlinebanktransfertype: function() {
                this.setSbData();
            },

            sbIban: function() {
                this.setSbData();
            },

            sbBic: function() {
                this.setSbData();
            }

        },

        mounted() {
            // Reset errors from previous page
            this.$store.commit('modApiPayment/setPaymentError', null);
            this.$store.commit('modApiPayment/setShippingError', null);
            this.$store.commit('modApiPayment/setIbanError', false);
            this.$store.commit('modApiPayment/setBicError', false);

            this.loading = true;
            if(_.isEmpty(this.paymentMethods)) {
                this.getPaymentMethods().then(()=>{
                    this.setChosenPaymentMethod();
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
            getPaymentMethods: function(order, coupon) {
                return new Promise((resolve, reject) => {
                    // Get payment methods from api
                    this.$store.dispatch('modApiPayment/getPaymentMethods').then(() => {
                        resolve();
                    }).catch((error) => {
                        this.loading = false;
                        reject(error);
                    });
                })
            },
            setChosenPaymentMethod: function() {
                if(this.getChosenPaymentMethod) {
                    this.chosenMethod = this.getChosenPaymentMethod.key;

                    if(!_.isEmpty(this.getChosenPaymentMethod.payload)) {
                        this.onlinebanktransfertype = this.getChosenPaymentMethod.payload.onlinebanktransfertype
                    }
                    // Set id of method from api
                    //this.chosenMethod = this.getChosenPaymentMethod.id;
                }
            },
            setMethodById: function(key) {
                _.forEach(this.paymentMethods, (val) => {
                    if(val.payone_key === key ){
                        this.chosenMethodObj = val;
                    }
                });
            },
            setElvData: function() {
                this.chosenMethodObj = {
                    key: 'payone_elv',
                    label: this.$t('ELV'),
                    payload: {
                        iban: this.elvIban,
                        bic: this.elvBic
                    }
                };

                this.$store.dispatch('modApiPayment/storeChosenPaymentMethod', this.chosenMethodObj);
            },
            setSbData: function() {
                this.chosenMethodObj = {
                    key: 'payone_sb',
                    label: this.$t('Online Bank Transfer'),
                    payload: {
                        onlinebanktransfertype: this.onlinebanktransfertype,
                        iban: this.sbIban,
                        bic: this.sbBic
                    }
                };

                this.$store.dispatch('modApiPayment/storeChosenPaymentMethod', this.chosenMethodObj);
            },
            getTotal: function() {
                let total = this.$store.getters['modCart/getTotals'];

                // Format subtotals
                total = this.$store.getters['modPrices/priceDecFmt'](total);
                total = this.$store.getters['modPrices/priceAddCur'](total);

                return total;
            },
            //isAllowedMethod: function(key) {
            //
            //    // Get method by key
            //    let method = _.find(this.paymentMethods, function(o) {
            //        return o.key === key;
            //    });
            //
            //    // Check if method is available
            //    if( _.isEmpty(method)) {
            //        return true;
            //    }
            //
            //    // Check if payment method is allowed for current address
            //    if(method.fraud || method.blacklist) {
            //        return false;
            //    }
            //
            //    return true;
            //}
        }
    }
</script>
