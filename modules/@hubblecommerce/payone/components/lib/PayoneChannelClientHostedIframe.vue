<template>
    <div>
        <form v-if="!scriptError" name="paymentform" method="post">
            <fieldset>
                <input id="pseudocardpan" type="hidden" name="pseudocardpan" />
                <input id="truncatedcardpan" type="hidden" name="truncatedcardpan" />
                <input id="cardtypeResponse" type="hidden" name="cardtypeResponse" />
                <input id="cardexpiredateResponse" type="hidden" name="cardexpiredateResponse" />

                <div class="cc-check-row">
                    <label for="cardtype" class="text">Kartentyp:</label>
                    <span id="cardtype" class="inputIframe" />
                </div>

                <div class="cc-check-row">
                    <label for="cardpanInput" class="text">Kartennummer:</label>
                    <span id="cardpan" class="inputIframe" />
                    <!-- Container for PAYONE-Script -> PAYONE will place an iFrame in here -->
                </div>

                <div class="cc-check-row">
                    <label for="expireInput" class="text">Gültig bis: (MM/JJJJ):</label>
                    <span id="expireInput" class="inputIframe">
                        <span id="cardexpiremonth" />
                        <span id="cardexpireyear" />
                    </span>
                </div>

                <div class="cc-check-row">
                    <label for="cvcInput" class="text">Kartenprüfnummer:</label>
                    <span id="cardcvc2" class="inputIframe" />
                </div>

                <div id="error" />
            </fieldset>
            <transition name="fade">
                <div v-if="loading" class="loader-wrp">
                    <div class="loader lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </transition>
        </form>
        <div v-if="scriptError" v-text="scriptError" />
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'PayoneChannelClientHostedIframe',

    data() {
        return {
            loading: true,
            supportedCardtypes: ['#', 'V', 'M', 'A'],
            config: {
                fields: {
                    cardpan: {
                        selector: 'cardpan',
                        style:
                            "font-size: 14px; width: 248px; border: solid 1px #EAE9EA; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px;",
                        styleFocus:
                            "font-size: 14px; width: 248px; border: solid 1px #535358; outline: none; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px; ",
                        type: 'input',
                    },
                    cardcvc2: {
                        selector: 'cardcvc2',
                        type: 'password', // Could be "text" as well.
                        style:
                            "font-size: 14px; width: 248px; border: solid 1px #EAE9EA; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px;",
                        styleFocus:
                            "font-size: 14px; width: 248px; border: solid 1px #535358; outline: none; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px; ",
                        size: '4',
                        // This is a configuration example for something like:
                        // * Amex: Exactly 4 digits.
                        // * Visa: Exactly 3 digits.
                        // * JCB: No CVC, input disabled.
                        // * Mastercard: Not configured, up to maxlength digits or none.
                        // Notice that our validation code should be stable with case insensitive configurations made by
                        // the merchant. This is why we have a lower case "a" and an upper case "V" and "J" for this demo
                        // configuration.
                        maxlength: '4',
                        length: { a: 4, V: 3, J: false },
                    },
                    cardexpiremonth: {
                        selector: 'cardexpiremonth',
                        type: 'text', // select (default), text, tel (for alternative keyboards on mobile devices)
                        size: '2',
                        maxlength: '2',
                        iframe: {
                            width: '40px',
                        },
                        style:
                            "font-size: 14px; width: 122px; border: solid 1px #EAE9EA; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px;",
                        styleFocus:
                            "font-size: 14px; width: 122px; border: solid 1px #535358; outline: none; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px; ",
                    },
                    cardexpireyear: {
                        selector: 'cardexpireyear',
                        type: 'text', // select (default), text, tel (for alternative keyboards on mobile devices)
                        iframe: {
                            width: '60px',
                        },
                        style:
                            "font-size: 14px; width: 122px; border: solid 1px #EAE9EA; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px;",
                        styleFocus:
                            "font-size: 14px; width: 122px; border: solid 1px #535358; outline: none; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px; ",
                    },
                    cardtype: {
                        selector: 'cardtype',
                        cardtypes: ['#', 'A', 'M', 'V'],
                        style:
                            "font-size: 14px; width: 248px; border: solid 1px #EAE9EA; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif;",
                        styleFocus:
                            "font-size: 14px; width: 248px; border: solid 1px #535358; outline: none; height: 42px; color: #535358; font-family: 'Lato', Helvetica, Arial, sans-serif; background: #F8F8F8; padding: 10px; ",
                    },
                },
                defaultStyle: {
                    input: 'font-size: 1em; border: 1px solid #000; width: 175px;',
                    select: 'font-size: 1em; border: 1px solid #000;',
                    iframe: {
                        height: '22px',
                        width: '180px',
                    },
                },
                autoCardtypeDetection: {
                    supportedCardtypes: this.supportedCardtypes,
                    callback: detectedCardtype => {
                        // Individual callback code starts here:
                        this.iFrames.setCardType(detectedCardtype);
                        // Individual callback code ends.
                    }, //,
                    // deactivate: true // To turn off automatic card type detection.
                    // Must be explicitly set to boolean true.
                },
                events: {
                    // Javascript callback function will be triggered once “hosted iFrames” are completely loaded
                    rendered: () => {
                        this.loading = false;
                    },
                },
                language: null, //, // Language to display error-messages (default: Payone.ClientApi.Language.en)
                error: 'error', // area to display error-messages (optional)
            },
            request: {
                request: 'creditcardcheck', // fixed value
                responsetype: 'JSON', // fixed value
                mode: process.env.PAYONE_MODE, // desired mode
                mid: process.env.PAYONE_MID, // your MID
                aid: process.env.PAYONE_AID, // your AID
                portalid: process.env.PAYONE_PORTALID, // your PortalId
                encoding: 'UTF-8', // desired encoding
                storecarddata: 'yes', // fixed value
                // hash calculated over your request-parameter-values (alphabetical request-order) plus PMI portal key
                hash: '', // see Chapter 3.1.5.3,
                key: '',
            },
            iFrames: null,
            scriptError: false,
        };
    },

    mounted() {
        // Get namespace from module to call global function correctly
        let moduleNamespace = '$' + this._hubblePayoneOptions.namespace;
        this[moduleNamespace]
            .loadPayoneScript()
            .then(() => {
                this.setSupportedCardTypes();
                this.initIFrame();

                this.config.language = window.Payone.ClientApi.Language.de;

                // Set translated placeholders
                window.Payone.ClientApi.Language.de.placeholders.cardpan = 'Kartennummer';
                window.Payone.ClientApi.Language.de.placeholders.cvc = 'CVC';
                window.Payone.ClientApi.Language.de.placeholders.expireMonth = '(MM)';
                window.Payone.ClientApi.Language.de.placeholders.expireYear = '(JJJJ)';
            })
            .catch(error => {
                this.scriptError = error;
            });
    },

    methods: {
        initIFrame: function () {
            this.calcHash()
                .then(() => {
                    this.iFrames = new Payone.ClientApi.HostedIFrames(this.config, this.request);

                    this.$store.commit('modApiPayment/setHostedIFrame', this.iFrames);
                })
                .catch(response => {
                    // Display Error Message (eg. Qty of item is at maxQty)
                    this.$store.dispatch('modFlash/flashMessage', {
                        flashType: 'error',
                        flashMessage: response,
                    });
                });
        },
        setSupportedCardTypes: function () {
            this.config.fields.cardtype.cardtypes = this.supportedCardtypes;
            this.config.autoCardtypeDetection.supportedCardtypes = this.supportedCardtypes;
        },
        pay: function () {
            if (this.iFrames.isComplete()) {
                // Perform "CreditCardCheck" to create and get a PseudoCardPan; then call your function "hostedIFramePayCallback"
                this.iFrames.creditCardCheck('hostedIFramePayCallback');
            } else {
                console.log('Not complete. Nothing done.');
            }
        },
        calcHash: function () {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'GET',
                    url: '/api/calc-hash-hosted-iframe',
                    params: this.request,
                })
                    .then(response => {
                        this.request = response.data;
                        resolve();
                    })
                    .catch(response => {
                        console.log('API request %o to %o failed: %o', 'GET', '/api/calc-hash-hosted-iframe', response);
                        reject(response);
                    });
            });
        },
    },
};
</script>
