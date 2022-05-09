import { useContext, ssrRef, useStore, computed, useRouter } from '@nuxtjs/composition-api';
import ApiClient from '@/utils/api-client';

export default function paymentMethodStripe(props, context) {
    const { $config } = useContext();

    const store = useStore();
    let contextToken = computed(() => store.state.modSession.contextToken);

    let errors = ssrRef([]);

    const router = useRouter();

    const placeOrderCall = async function () {
        return await new ApiClient($config).apiCall({
            action: 'post',
            endpoint: 'store-api/checkout/order',
            contextToken: contextToken.value,
        });
    };

    const handlePaymentCall = async function (payload) {
        let requiredData = {
            orderId: payload.orderId,
            finishUrl: $config.swPaymentFinishUrl + '?orderId=' + payload.orderId,
            errorUrl: $config.swPaymentErrorUrl + '?orderId=' + payload.orderId,
        };

        const requestData = Object.assign(requiredData, payload.dataBag);

        return await new ApiClient($config).apiCall({
            action: 'post',
            endpoint: 'store-api/handle-payment',
            contextToken: contextToken.value,
            data: requestData,
        });
    };

    const placeOrder = async function () {
        if (props.paymentError || props.shippingError) {
            return false;
        }

        context.emit('processing', true);

        try {
            // Place order
            const order = await placeOrderCall();

            // Clear cart
            store.commit('modCart/resetCart');

            return order;
        } catch (err) {
            context.emit('processing', false);
            errors.value.push(err.detail);
            return false;
        }
    };

    const handlePayment = async function (order, dataBag = null) {
        try {
            if(dataBag === null) {
                dataBag = router.currentRoute.query;
            }

            // Init payment
            const paymentResponse = await handlePaymentCall({ orderId: order.data.id, dataBag: dataBag });

            if (paymentResponse.data.redirectUrl !== null) {
                context.emit('processing', false);
                window.open(paymentResponse.data.redirectUrl, '_self');
            } else {
                router.push(
                    {
                        name: 'checkout-success',
                        params: {
                            order: order,
                        },
                    },
                    () => {
                        context.emit('processing', false);
                    }
                );
            }
        } catch (err) {
            console.log(err);
            // Redirect to error page
            router.push(
                {
                    name: 'checkout-error',
                    query: {
                        orderId: order.data.id,
                    },
                },
                () => {
                    context.emit('processing', false);
                }
            );
        }
    };

    return {
        errors,
        placeOrder,
        handlePayment
    };
}
