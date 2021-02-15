<template>
    <div class="pp-express-wrp">
        <div v-if="error != null" class="pp-express-error-wrp">
            <div class="error-msg" v-text="error"/>
        </div>
        <transition name="fade">
            <loader v-if="!scriptLoaded" />
        </transition>
        <transition name="fade">
            <div v-if="loading" class="fullscreen-loader-wrp">
                <loader />
            </div>
        </transition>
        <div ref="pp-express-button" />
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import apiClient from "@/utils/api-client";

export default {
    name: "PaypalExpress",

    data() {
        return {
            options: {
                /**
                 * This option holds the client id specified in the settings
                 *
                 * @type string
                 */
                clientId: process.env.SW_PAYPAL_CLIENT_ID,
                /**
                 * This option toggles the PayNow/Login text at PayPal
                 *
                 * @type boolean
                 */
                commit: false,
                /**
                 * This option specifies the language of the PayPal button
                 *
                 * @type string
                 */
                languageIso: 'en_GB',
                /**
                 * This options specifies the currency of the PayPal button
                 *
                 * @type string
                 */
                currency: 'EUR',
                /**
                 * This options defines the payment intent
                 *
                 * @type string
                 */
                intent: 'capture',
                /**
                 * This option toggles if credit card and ELV should be shown
                 *
                 * @type boolean
                 */
                useAlternativePaymentMethods: false,
                /**
                 * This option specifies if selected APMs should be hidden
                 *
                 * @type string[]
                 */
                disabledAlternativePaymentMethods: [],
                /**
                 * This option toggles the Process whether or not the product needs to be added to the cart.
                 *
                 * @type boolean
                 */
                addProductToCart: false,
                /**
                 * This option specifies the PayPal button size
                 *
                 * @type string
                 */
                buttonSize: 'small',
                /**
                 * This option specifies the PayPal button color
                 *
                 * @type string
                 */
                buttonColor: 'gold',
                /**
                 * This option specifies the PayPal button shape
                 *
                 * @type string
                 */
                buttonShape: 'rect',
                /**
                 * This option toggles the text below the PayPal Express button
                 *
                 * @type boolean
                 */
                tagline: false
            },
            loadingScript: false,
            scriptLoaded: false,
            loading: false,
            callbacks: [],
            availableAPMs: [
                'card',
                'credit',
                'bancontact',
                'blik',
                'eps',
                'giropay',
                'ideal',
                'mybank',
                'p24',
                'sepa',
                'sofort',
                'venmo'
            ],
            error: null
        }
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken
        })
    },

    mounted() {
        this.createButton();
    },

    beforeDestroy() {
        this.loading = false;
    },

    methods: {
        ...mapMutations({
            setContextToken: 'modSession/setContextToken'
        }),

        createButton: function() {
            this.createScript(() => {
                const paypal = window.paypal;
                this.renderButton(paypal);
            });
        },

        renderButton: function(paypal) {
            return paypal.Buttons(this.getButtonConfig()).render(this.$refs['pp-express-button']);
        },

        createScript(callback) {
            this.callbacks.push(callback);

            if (this.loadingScript) {
                if (this.scriptLoaded) {
                    callback.call(this);
                }
                return;
            }

            this.loadingScript = true;
            const scriptOptions = this.getScriptUrlOptions();
            const payPalScriptUrl = `https://www.paypal.com/sdk/js?client-id=${this.options.clientId}${scriptOptions}`;
            const payPalScript = document.createElement('script');
            payPalScript.type = 'text/javascript';
            payPalScript.src = payPalScriptUrl;

            payPalScript.addEventListener('load', this.callCallbacks.bind(this), false);
            document.head.appendChild(payPalScript);
        },

        callCallbacks: function() {
            this.callbacks.forEach(callback => {
                callback.call(this);
            });

            this.scriptLoaded = true;
        },

        /**
         * @return {string}
         */
        getScriptUrlOptions: function() {
            let config = '&components=marks,buttons,messages';

            if (typeof this.options.commit !== 'undefined') {
                config += `&commit=${this.options.commit}`;
            }

            if (this.options.languageIso) {
                config += `&locale=${this.options.languageIso}`;
            }

            if (this.options.currency) {
                config += `&currency=${this.options.currency}`;
            }

            if (this.options.intent) {
                config += `&intent=${this.options.intent}`;
            }

            if (this.options.useAlternativePaymentMethods !== undefined && !this.options.useAlternativePaymentMethods) {
                config += `&disable-funding=${this.availableAPMs.join(',')}`;
            } else if (this.options.disabledAlternativePaymentMethods !== undefined
                && this.options.disabledAlternativePaymentMethods.length > 0
            ) {
                config += `&disable-funding=${this.options.disabledAlternativePaymentMethods.join(',')}`;
            }

            return config;
        },

        getButtonConfig: function() {
            //const renderElement = this.el;
            //const { element: buyButton, disabled: isBuyButtonDisabled } = this.getBuyButtonState();

            return {
                onInit: (data, actions) => {
                    if (!this.options.addProductToCart) {
                        return;
                    }

                    ///**
                    // * Helper method which enables the paypal button
                    // * @returns void
                    // */
                    //const enableButton = () => {
                    //    actions.enable();
                    //    renderElement.classList.remove(this.options.disabledClass);
                    //};
                    //
                    ///**
                    // * Helper method which disables the paypal button
                    // * @returns void
                    // */
                    //const disableButton = () => {
                    //    actions.disable();
                    //    renderElement.classList.add(this.options.disabledClass);
                    //};
                    //
                    //this.observeBuyButton(buyButton, enableButton, disableButton);
                    //
                    //// Set the initial state of the button
                    //if (isBuyButtonDisabled) {
                    //    disableButton();
                    //    return;
                    //}
                    //enableButton();
                },

                style: {
                    size: this.options.buttonSize,
                    shape: this.options.buttonShape,
                    color: this.options.buttonColor,
                    tagline: this.options.tagline,
                    layout: 'horizontal',
                    label: 'checkout',
                    height: 40
                },

                /**
                 * Will be called if the express button is clicked
                 */
                createOrder: this.createOrder.bind(this),

                /**
                 * Will be called if the payment process is approved by paypal
                 */
                onApprove: this.onApprove.bind(this),

                /**
                 * Will be called if an error occurs during the payment process.
                 */
                onError: this.onError.bind(this)
            };
        },

        /**
         * @return {Promise}
         */
        createOrder: function() {
            if (this.options.addProductToCart) {
                return this.addProductToCart().then(() => {
                    return this._createOrder();
                });
            }

            return this._createOrder();
        },

        /**
         * @return {Promise}
         */
        _createOrder: async function() {
            try {
                const response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/v3/paypal/express/create-order',
                    contextToken: this.contextToken
                });

                return response.data.token;
            } catch(e) {
                console.log(e);
            }
        },

        onApprove: async function(data) {
            const requestPayload = {
                token: data.orderID
            };

            // Add a loading indicator to the body to prevent the user breaking the checkout process
            this.loading = true;

            // Loggs in a guest customer, with the data of a paypal order
            try {
                const response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/v3/paypal/express/prepare-checkout',
                    contextToken: this.contextToken,
                    data: requestPayload
                });

                await this.setContextToken(response.data.contextToken);

                await this.$router.push({
                    path: '/checkout',
                    query: {
                        isPayPalExpressCheckout: true,
                        paypalOrderId: data.orderID
                    }
                });
            } catch(e) {
                this.loading = false;
                console.log(e);
            }
        },

        onError: function() {
            this.loading = false;

            if (typeof this.options.clientId === 'undefined' || this.options.clientId === '') {
                console.error('No StoreApiClient defined in child plugin class');
                return;
            }

            this.error = 'Please try a different payment method, or contact our customer service via email or hotline.';
        },

        addProductToCart: function() {
            //const buyForm = this.el.closest('form');
            //const buyButton = DomAccess.querySelector(buyForm, this.options.buyButtonSelector);
            //const plugin = window.PluginManager.getPluginInstanceFromElement(buyForm, 'AddToCart');

            return new Promise(resolve => {
                //this._client.delete(this.options.deleteCartUrl, null, () => {
                //    plugin.$emitter.subscribe('openOffCanvasCart', () => {
                        resolve();
                    //});

                    //buyButton.click();
                //});
            });
        },

        //getBuyButtonState: function() {
        //    if (!this.options.addProductToCart) {
        //        return {
        //            element: null,
        //            disabled: false
        //        };
        //    }
        //
        //    const element = DomAccess.querySelector(this.el.closest('form'), this.options.buyButtonSelector);
        //
        //    return {
        //        element,
        //        disabled: element.getAttribute('disabled') === 'disabled'
        //    };
        //}
    }
}
</script>

<style lang="scss" scoped>
.pp-express-wrp {
    margin-bottom: 20px;
}

.loader-wrp {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
}
</style>
