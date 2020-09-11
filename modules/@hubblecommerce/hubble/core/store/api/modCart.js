import base64 from 'base-64';
// import localStorageHelper from '@hubblecommerce/hubble/core/utils/localStorageHelper';
import localStorageHelper from '~/utils/localStorageHelper';
import _ from 'lodash';

export const state = () => ({
            layerInitiated: false,

            shippingCosts: {
                price: 4.99,
            },
            tax: 1.19,

            // Maximum Qty of one item in Cart
            maxQty: 99,

            cart: {
                items_qty: 0,
                grand_total: 0,
                base_grand_total: 0,
                global_currency_code: 'EUR',
                subtotal: 0,
                coupons: [],
                base_subtotal: 0,
                subtotal_with_discount: 0,
                base_subtotal_with_discount: 0,
                items: [],
            },

            cookieName: 'hubbleCart',
            cookiePath: '/',
            cookieTTL: 720, // 720 hours = 30 days
            localStorageLifetime: 720, // 720 hours = 30 days
})

export const getters = {
            getCookieExpires: state => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 60 * 1000);
            },
            getCartEncoded: () => objJsonStr => {
                return base64.encode(JSON.stringify(objJsonStr));
            },
            getCartDecoded: () => objJsonB64 => {
                return JSON.parse(base64.decode(objJsonB64));
            },
            getSubtotals: state => {
                if (state.cart.discount > 0) {
                    return state.cart.subtotal_with_discount;
                }

                return state.cart.subtotal;
            },
            getShippingCosts: state => {
                return state.shippingCosts;
            },
            getTotals: state => {
                if (state.cart.discount > 0) {
                    return state.cart.grand_total_with_discount;
                }

                return state.cart.grand_total;
            }
}

export const mutations = {
            setCartItemsCount: (state, qty) => {
                state.cart.items_qty = qty;
            },
            delCartItemObj: (state, item) => {
                _.pull(state.cart.items, item);
            },
            removeCouponObj: (state, couponCode) => {
                state.cart.coupons = _.filter(state.cart.coupons, coupon => {
                    return coupon.code !== couponCode;
                });
            },
            setCart: (state, item) => {
                state.cart = item;
            },
            setCartItemObj: (state, item) => {
                state.cart.items.push(item);
            },
            setCartItemsObj: (state, items) => {
                state.cart.items = items;
            },
            setCartCouponsObj: (state, items) => {
                state.cart.coupons = items;
            },
            setCartItemsObjQty: (state, payload) => {
                _.forEach(state.cart.items, (cartItem, key) => {
                    if (cartItem.id === payload.itemId) {
                        state.cart.items[key].qty = payload.itemQty;
                    }
                });
            },
            setSubtotals: (state, item) => {
                state.cart.subtotal = item;
            },
            setShippingCosts: (state, item) => {
                state.shippingCosts = item;
            },
            setTotals: state => {
                state.cart.grand_total = state.cart.subtotal + state.shippingCosts;
            },
            initiateLayer: state => {
                state.layerInitiated = true;
            },
}

export const actions = {
            clearAll({ commit, state, dispatch }) {
                return new Promise((resolve, reject) => {
                    commit('setCartItemsObj', []);
                    commit('setCartCouponsObj', []);
                    commit('setCartItemsCount', 0);
                    dispatch('calcTotals');
                    resolve('cart cleared!');
                });
            },
            addItem({ commit, state, dispatch, rootState, getters }, payload) {
                return new Promise((resolve, reject) => {
                    // Get order object from modApiPayment module
                    let order = _.clone(rootState.modApiPayment.order);

                    // Add current cart to order object temporarily
                    let cart = _.cloneDeep(state.cart);

                    // Add item to cloned cart
                    let item = _.pick(payload.item, [
                        'id',
                        'sku',
                        'name_orig',
                        'variants',
                        'image',
                        'manufacturer_name',
                        'final_price_item',
                        'url_pds',
                    ]);
                    let qty = payload.qty;
                    let isInCart = false;

                    // Assign selected qty to cart item in store
                    item = _.assign(item, { qty: qty });

                    // If product has a variant, set the variant ids after product id to make the cart entry for this variant selection unique
                    let variantIds = '';
                    if (!_.isEmpty(item.variants)) {
                        _.forEach(item.variants, variant => {
                            variantIds += '-' + variant.value_id;
                        });
                    }
                    item.id = item.id + variantIds;

                    // Check if item is already in cart
                    if (cart.items.length > 0) {
                        isInCart = _.find(cart.items, o => {
                            return o.id === item.id;
                        });
                    }

                    // Set item to cart if not exists
                    if (!isInCart) {
                        cart.items.push(item);
                    } else {
                        // If isInCart.qty is at maxQty reject Promise
                        if (parseInt(isInCart.qty) >= state.maxQty) {
                            reject('Item quantity is already at maximum quantity.');
                            return;
                        }
                        // Or just raise the qty of selected item
                        _.forEach(cart.items, (cartItem, key) => {
                            if (cartItem.id === item.id) {
                                cart.items[key].qty = parseInt(isInCart.qty) + qty;
                            }
                        });
                    }

                    // Increase global cart counter
                    cart.items_qty = cart.items_qty + qty;

                    order.cart = cart;

                    // Call Api to recalculate cart by shop system
                    dispatch('recalculateCart', {
                        order: JSON.stringify(order),
                    })
                        .then(response => {
                            // Refresh cart item before store to cookie
                            commit('setCart', response.order.cart);

                            // Calculate totals from cart
                            //let totals = state.cart.subtotal_with_discount + state.shippingCosts;
                            commit('setTotals');

                            // Store cart with all info in local storage
                            localStorageHelper.setCreatedAt(_.clone(state.cart), state.localStorageLifetime).then(response => {
                                this.$localForage.setItem(state.cookieName, response);
                            });

                            // Store just important info in cookie
                            // We need cookie to verify on serverside middleware if items are in cart if user want to checkout
                            let smallCart = _.pick(state.cart, ['items_qty']);

                            // Encode Info
                            let _cart = getters.getCartEncoded(smallCart);

                            this.$cookies.set(state.cookieName, _cart, {
                                path: state.cookiePath,
                                expires: getters.getCookieExpires,
                            });

                            resolve('totals calculated and committed');
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            updateItem({ commit, state, dispatch }, payload) {
                return new Promise(resolve => {
                    // Update global cart counter
                    commit('setCartItemsCount', state.cart.items_qty + payload.qty);

                    dispatch('calcTotals').then(() => {
                        resolve('OK, item added!');
                    });
                });
            },
            checkCouponInCart({ state }) {
                return new Promise((resolve, reject) => {
                    // if coupon exist dont apply another coupon
                    if (_.isEmpty(state.cart.coupons)) {
                        resolve('Coupon is not in cart');
                    } else {
                        reject('There already exist a coupon.');
                    }
                });
            },
            storeCouponToCart({ commit, state }, payload) {
                return new Promise(resolve => {
                    // Refresh cart item before store to client store
                    commit('setCart', payload.order.cart);

                    // Calculate totals from cart, set grand_total from response as new subtotal
                    commit('setSubtotals', payload.order.cart.grand_total);
                    commit('setTotals');

                    // Store cart with all info in local storage
                    localStorageHelper.setCreatedAt(_.clone(state.cart), state.localStorageLifetime).then(response => {
                        this.$localForage.setItem(state.cookieName, response);
                        resolve('Coupon stored to cart');
                    });
                });
            },
            removeCoupon({ commit, dispatch }, couponCode) {
                return new Promise(resolve => {
                    commit('removeCouponObj', couponCode);

                    dispatch('calcTotals').then(() => {
                        resolve();
                    });
                });
            },
            delItem({ commit, state, dispatch }, payload) {
                let item = payload.data;

                return new Promise((resolve, reject) => {
                    commit('delCartItemObj', item);
                    commit('setCartItemsCount', state.cart.items_qty - item.qty);
                    dispatch('calcTotals').then(() => {
                        resolve('OK, item deleted!');
                    });
                });
            },
            setByCookie({ commit, state, getters }) {
                return new Promise(resolve => {
                    // try to retrieve auth user by cookie
                    let cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if (!cookie) {
                        resolve({
                            success: true,
                            message: 'cart not known by cookie.',
                        });
                    }

                    //
                    let item = getters.getCartDecoded(cookie);

                    commit('setCart', item);

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getCartEncoded(item), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires,
                    });

                    resolve({
                        success: true,
                        message: 'cart taken from cookie.',
                        redirect: true,
                    });
                });
            },
            setByForage({ commit, state }) {
                return new Promise(resolve => {
                    this.$localForage.getItem(state.cookieName).then(response => {
                        // Remove local storage if its invalid (end of lifetime)
                        if (!localStorageHelper.lifeTimeIsValid(response, state.localStorageLifetime)) {
                            this.$localForage.removeItem(state.cookieName);
                            resolve({
                                success: true,
                                message: 'local storage was cleared for its invalidity',
                                redirect: true,
                            });
                        }

                        if (response !== null) {
                            commit('setCart', response);
                            resolve({
                                success: true,
                                message: 'cart taken from forage.',
                                redirect: true,
                            });
                        }

                        resolve({
                            success: true,
                            message: 'cart not known by forage.',
                        });
                    });
                });
            },
            calcTotals({ commit, state, getters, dispatch, rootState }) {
                return new Promise((resolve, reject) => {
                    // Get order object from modApiPayment module
                    let order = _.clone(rootState.modApiPayment.order);

                    // Add current cart to order object temporarily
                    order.cart = state.cart;

                    // Call Api to recalculate cart by shop system
                    dispatch('recalculateCart', {
                        order: JSON.stringify(order),
                    })
                        .then(response => {
                            // Refresh cart item before store to cookie
                            commit('setCart', response.order.cart);

                            // Calculate totals from cart
                            //let totals = state.cart.subtotal_with_discount + state.shippingCosts;
                            commit('setTotals');

                            // Store cart with all info in local storage
                            localStorageHelper.setCreatedAt(_.clone(state.cart), state.localStorageLifetime).then(response => {
                                this.$localForage.setItem(state.cookieName, response);
                            });

                            // Store just important info in cookie
                            // We need cookie to verify on serverside middleware if items are in cart if user want to checkout
                            let smallCart = _.pick(state.cart, ['items_qty']);

                            // Encode Info
                            let _cart = getters.getCartEncoded(smallCart);

                            this.$cookies.set(state.cookieName, _cart, {
                                path: state.cookiePath,
                                expires: getters.getCookieExpires,
                            });

                            resolve('totals calculated and committed');
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            async recalculateCart({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'api',
                            apiType: 'payment',
                            endpoint: '/api/cart/recalculate',
                            data: payload,
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response.data);
                        })
                        .catch(error => {
                            dispatch(
                                'modFlash/flashMessage',
                                {
                                    flashType: 'error',
                                    flashMessage: error.message,
                                },
                                { root: true }
                            );
                            console.log('recalculateCart failed: %o', error);
                            reject(error);
                        });
                });
            },
            async precalculateShippingCost({ commit, dispatch }, payload) {
                return new Promise(function (resolve, reject) {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'api',
                            apiType: 'payment',
                            endpoint: '/api/cart/precalculate_shipping',
                            data: payload,
                        },
                        { root: true }
                    )
                        .then(response => {
                            // Return response if shipping is not allowed in this country
                            if (!response.data.order.shippingAllowed) {
                                resolve(response);
                            }

                            // Set shipping costs if shipping is allowed
                            commit('setShippingCosts', response.data.order.shippingCost.price);
                            commit('setTotals');
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            }
}
