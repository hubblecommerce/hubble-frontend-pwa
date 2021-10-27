import { loadStripe } from '@stripe/stripe-js';
import { ssrRef, onMounted } from '@nuxtjs/composition-api';
import ApiClient from "~/utils/api-client";

export default function paymentMethodStripe(context, contextToken, currentMethod, currentMethodObj, showModal) {
    let stripe = ssrRef(null); // Stripe.js
    let card = ssrRef(null); // Stripe.js elements: card
    let sepa = ssrRef(null); // Stripe.js elements: iban
    let stripePaymentMethods = ssrRef({
        // Stripe result of createPayment function
        card: {},
        sepaBankAccount: {},
    });
    let billingDetailsCard = ssrRef({
        // Stripe required customer info
        name: '',
    });
    let billingDetailsSepa = ssrRef({
        // Stripe required customer info
        name: '',
        email: '',
    });

    const initStripeElement = function (elementName, targetElement, errorTargetElement, options) {
        let elements = stripe.value.elements();
        let element = elements.create(elementName, options);
        element.mount(targetElement);

        element.on('change', ({ error }) => {
            let displayError = errorTargetElement;
            if (error) {
                displayError.textContent = error.message;
            } else {
                displayError.textContent = '';
            }
        });

        return element;
    };

    const savePaymentSettings = async function (type) {
        let paymentMethodData = {};

        if (type === 'card') {
            if (!card.value._complete || card.value._empty || card.value._invalid) {
                return;
            }

            paymentMethodData = {
                type: 'card',
                card: card.value,
                billing_details: billingDetailsCard.value,
            };
        }

        if (type === 'sepa_debit' && !sepa.value._invalid) {
            if (!sepa.value._complete || sepa.value._empty || sepa.value._invalid) {
                return;
            }

            paymentMethodData = {
                type: 'sepa_debit',
                sepa_debit: sepa.value,
                billing_details: billingDetailsSepa.value,
            };
        }

        if (Object.keys(paymentMethodData).length >= 0) {
            try {
                let result = await stripe.value.createPaymentMethod(paymentMethodData);
                let payload = null;

                if (result.paymentMethod.card != null) {
                    stripePaymentMethods.value.card = result.paymentMethod.card;

                    payload = {
                        card: result.paymentMethod.card,
                        saveCardForFutureCheckouts: null,
                    };
                    Object.assign(payload.card, { id: result.paymentMethod.id });
                    Object.assign(payload.card, { name: result.paymentMethod.billing_details.name });

                    await setPaymentMethodSettings(payload);
                    closeModal(card.value);
                }

                if (result.paymentMethod.sepa_debit != null) {
                    stripePaymentMethods.value.sepaBankAccount = result.paymentMethod.sepa_debit;

                    payload = {
                        sepaBankAccount: result.paymentMethod.sepa_debit,
                        saveSepaBankAccountForFutureCheckouts: null,
                    };
                    Object.assign(payload.sepaBankAccount, { id: result.paymentMethod.id });
                    Object.assign(payload.sepaBankAccount, { name: result.paymentMethod.billing_details.name });

                    await setPaymentMethodSettings(payload);
                    closeModal(sepa.value);
                }
            } catch (e) {
                if (e.message != null) {
                    paymentError.value = e.message;
                }

                if (e.detail != null) {
                    paymentError.value = e.detail;
                }

                closeModal();
                resetChosenPaymentMethod();
            }
        }
    };

    const setPaymentMethodSettings = async function (payload) {
        return await new ApiClient().apiCall({
            action: 'patch',
            endpoint: 'store-api/stripe-payment/payment-method-settings',
            contextToken: contextToken.value,
            data: payload,
        });
    };

    const closeModal = function (element, currentMethodObj) {
        // Reset chosen method if iframe error
        if (element != null) {
            if (!element._complete || element._empty || element._invalid) {
                resetChosenPaymentMethod();
            }
        }

        if (currentMethodObj != null) {
            if (currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card') {
                if (!card.value._complete || card.value._empty || card.value._invalid) {
                    resetChosenPaymentMethod();
                }
            }

            if (currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.sepa') {
                if (!sepa.value._complete || sepa.value._empty || sepa.value._invalid) {
                    resetChosenPaymentMethod();
                }
            }
        }

        showModal.value = false;
    };

    const resetChosenPaymentMethod = function () {
        currentMethod.value = null;
        currentMethodObj.value = {};
    };

    const editPaymentSettings = function (id) {
        // Set currentMethod to trigger watcher
        // Set currentMethod + open related modal
        if (currentMethod.value !== id) {
            currentMethod.value = id;
        } else {
            showModal.value = true;
        }
    };

    const mountStripeJs = async function() {
        try {
            // Init Stripe.js
            stripe.value = await loadStripe(process.env.SW_STRIPE_PUBLIC_KEY);

            // Init Stripe Elements: Card
            const cardOptions = {
                style: {
                    base: {
                        color: '#32325d',
                    },
                },
            };
            card.value = initStripeElement('card', context.refs.card, context.refs.cardErrors, cardOptions);

            // Init Stripe Elements: Iban
            const sepaOptions = {
                style: {},
                supportedCountries: ['SEPA'],
                placeholderCountry: 'DE',
            };
            sepa.value = initStripeElement('iban', context.refs.sepa, context.refs.sepaErrors, sepaOptions);
        } catch (e) {
            console.log('Failed to init Stripe.js');
        }
    };

    onMounted(mountStripeJs);

    return {
        stripe,
        card,
        sepa,
        stripePaymentMethods,
        billingDetailsCard,
        billingDetailsSepa,
        initStripeElement,
        savePaymentSettings,
        setPaymentMethodSettings,
        closeModal,
        resetChosenPaymentMethod,
        editPaymentSettings,
    } // anything returned here will be available for the rest of the component
}
