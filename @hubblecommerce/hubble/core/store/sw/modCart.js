import base64 from 'base-64';
import localStorageHelper from '@hubblecommerce/hubble/core/utils/localStorageHelper';
import _ from 'lodash';

export const state = () => ({
    layerInitiated: false,

    shippingCosts: 0,

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

    // sw
    swtc: '',
    swtcCookieName: 'hubbleSwtc',

    productToUpdate: '',
    qtyToUpdate: null,
});

export const getters = {
    getCookieExpires(state) {
        return new Date(new Date().getTime() + state.cookieTTL * 60 * 60 * 1000);
    },
    getCartEncoded: (state, getters) => (objJsonStr) => {
        return base64.encode(JSON.stringify(objJsonStr));
    },
    getCartDecoded: (state, getters) => (objJsonB64) => {
        return JSON.parse(base64.decode(objJsonB64));
    },
    getSubtotals(state) {
        return state.cart.subtotal;
    },
    getShippingCosts(state) {
        return state.shippingCosts;
    },
    getTotals(state) {
        return state.cart.grand_total;
    },
    getSwtc(state) {
        return state.swtc;
    },
};

export const mutations = {
    setCartItemsCount(state, qty) {
        state.cart.items_qty = qty;
    },
    delCartItemObj(state, item) {
        _.pull(state.cart.items, item);
    },
    setCart(state, item) {
        state.cart = item;
    },
    setCartItemsObj(state, items) {
        state.cart.items = items;
    },
    setCartItemsObjQty(state, payload) {
        _.forEach(state.cart.items, (cartItem, key) => {
            if (cartItem.id === payload.itemId) {
                state.cart.items[key].qty = payload.itemQty;
            }
        });

        // Save id and qty of item to update in store
        // then on modCart/updateItem call update lineItem width saved data to refresh cart
        state.productToUpdate = payload.itemId;
        state.qtyToUpdate = payload.itemQty;
    },
    setSubtotals(state, item) {
        state.cart.subtotal = item;
    },
    setShippingCosts(state, item) {
        state.shippingCosts = item;
    },
    setTotals(state, item) {
        state.cart.grand_total = item;
    },
    setSwtc(state, item) {
        state.swtc = item;
    },
    initiateLayer(state) {
        state.layerInitiated = true;
    },
};

export const actions = {
    clearAll({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            // Reset cart object in store
            commit('setCartItemsObj', []);
            commit('setCartItemsCount', 0);

            // Get cart from sw to calculate totals
            dispatch('swGetCart')
                .then((res) => {
                    dispatch('saveCartToStorage', { response: res }).then(() => {
                        resolve('cart saved');
                    });
                })
                .catch((err) => {
                    console.log('swGetCart error: ', err);

                    reject(err);
                });
        });
    },
    swGetCart({ state, dispatch }) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.swtc,
                    endpoint: '/store-api/v3/checkout/cart',
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log('swGetCart error: ', error);

                    reject(error);
                });
        });
    },
    recalculateCart({ dispatch }) {
        return new Promise((resolve, reject) => {
            dispatch('swGetCart')
                .then((response) => {
                    dispatch('saveCartToStorage', { response: response }).then(() => {
                        resolve();
                    });
                })
                .catch((err) => {
                    console.log('recalculateCart error: ', err);

                    reject('Cart could not be recalculated');
                });
        });
    },
    initCart({ commit, state, dispatch, getters }) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/checkout/cart',
                },
                { root: true }
            )
                .then((response) => {
                    const token = response.data['token'];

                    // Set swtc to store
                    commit('setSwtc', token);

                    // Save swtc to cookie
                    this.$cookies.set(state.swtcCookieName, token, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires,
                    });

                    resolve(token);
                })
                .catch((error) => {
                    console.log('initCart error: ', error);

                    reject('Product could not be saved to cart');
                });
        });
    },
    saveSwtc({ commit, state, getters }, payload) {
        return new Promise((resolve, reject) => {
            // Set swtc to store
            commit('setSwtc', payload);

            // Save swtc to cookie
            this.$cookies.set(state.swtcCookieName, payload, {
                path: state.cookiePath,
                expires: getters.getCookieExpires,
            });

            resolve();
        });
    },
    saveCartToStorage({ commit, state, dispatch, getters }, payload) {
        return new Promise((resolve, reject) => {
            // Map products from calculated cart response from sw to hubble data structure
            dispatch('mappingCartProducts', { products: payload.response.data.lineItems }).then((response) => {
                commit('setCartItemsObj', response.mappedProducts);
                commit('setCartItemsCount', response.cartItemsQuantity);
            });

            dispatch('setTotals', payload.response).then(() => {
                // Store cart with all info in local storage
                localStorageHelper.setCreatedAt(_.clone(state.cart), state.localStorageLifetime).then((response) => {
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

                resolve();
            });
        });
    },
    swAddtToCart({ state, dispatch }, payload) {
        const endpoint = '/store-api/v3/checkout/cart/line-item';

        let items = [
            {
                type: 'product',
                referencedId: payload.item.id,
                quantity: payload.qty,
            },
        ];
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.swtc,
                    endpoint: endpoint,
                    data: {
                        items,
                    },
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log('swAddtToCart error: ', error);

                    reject(error);
                });
        });
    },
    addToCart({ state, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            // Add current cart to order object temporarily
            let cart = _.cloneDeep(state.cart);

            // Add item to cloned cart
            // ID = Product Id (SW handles referenceId as product id)
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

            // Check if item is already in cart
            // Compare cart referenceId with given item id (SW handles referenceId as product id)
            if (cart.items.length > 0) {
                isInCart = _.find(cart.items, (o) => {
                    return o.referenceId === item.id;
                });
            }

            // Set item to cart if not exists
            if (!isInCart) {
                cart.items.push(item);

                // Add to cart sw call
                dispatch('swAddtToCart', { item: item, qty: qty })
                    .then((res) => {
                        dispatch('saveCartToStorage', { cart: cart, qty: qty, response: res }).then(() => {
                            resolve();
                        });
                    })
                    .catch((err) => {
                        console.log('addToCart error ', err);

                        reject(err);
                    });
            } else {
                // Or just raise the qty of selected item
                _.forEach(cart.items, (cartItem, key) => {
                    if (cartItem.id === item.id) {
                        cart.items[key].qty = parseInt(isInCart.qty) + qty;
                    }
                });

                // Patch cart sw call
                dispatch('swUpdateLineItem', { id: isInCart.id, qty: parseInt(isInCart.qty) + qty })
                    .then((res) => {
                        dispatch('saveCartToStorage', { cart: cart, qty: qty, response: res }).then(() => {
                            resolve();
                        });
                    })
                    .catch((err) => {
                        console.log('swAddtToCart error: ', err);

                        reject(err);
                    });
            }
        });
    },
    setTotals({ commit }, payload) {
        return new Promise((resolve, reject) => {
            commit('setSubtotals', payload.data.price.positionPrice);

            commit('setTotals', payload.data.price.totalPrice);

            if (!_.isEmpty(payload.data.deliveries)) {
                commit('setShippingCosts', payload.data.deliveries[0].shippingCosts.totalPrice);
            } else {
                commit('setShippingCosts', 0);
            }

            resolve();
        });
    },
    addItem({ state, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            // Check if swtc isset
            if (state.swtc === '') {
                // Init cart
                dispatch('initCart')
                    .then(() => {
                        dispatch('addToCart', payload)
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }

            if (state.swtc !== '') {
                dispatch('addToCart', payload)
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });
    },
    swUpdateLineItem({ state, dispatch }, payload) {
        const endpoint = '/store-api/v3/checkout/cart/line-item';

        let items = [
            {
                id: payload.id,
                quantity: payload.qty,
                referencedId: payload.referencedId,
            },
        ];

        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'patch',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.swtc,
                    endpoint: endpoint,
                    data: {
                        items,
                    },
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log('swUpdateLineItem error: ', error);

                    reject(error);
                });
        });
    },
    updateItem({ commit, state, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            dispatch('swUpdateLineItem', { id: state.productToUpdate, qty: state.qtyToUpdate })
                .then((res) => {
                    // Update global cart counter
                    commit('setCartItemsCount', state.cart.items_qty + payload.qty);

                    dispatch('saveCartToStorage', { response: res }).then(() => {
                        resolve('item updated');
                    });
                })
                .catch((err) => {
                    console.log('updateItem error: ', err);

                    reject(err);
                });
        });
    },
    swRemoveLineItem({ state, dispatch }, payload) {
        const endpoint = '/store-api/v3/checkout/cart/line-item';

        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'delete',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.swtc,
                    endpoint: endpoint,
                    data: {
                        ids: [payload.id],
                    },
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    console.log('swRemoveLineItem error: ', err);

                    reject(err);
                });
        });
    },
    delItem({ commit, state, dispatch }, payload) {
        let item = payload.data;

        return new Promise((resolve, reject) => {
            dispatch('swRemoveLineItem', { id: item.id })
                .then((res) => {
                    commit('delCartItemObj', item);
                    commit('setCartItemsCount', state.cart.items_qty - item.qty);

                    dispatch('saveCartToStorage', { response: res }).then(() => {
                        resolve('item updated');
                    });
                })
                .catch((err) => {
                    console.log('swRemoveLineItem error: ', err);

                    reject(err);
                });
        });
    },
    setSwtcByCookie({ commit, state, getters }, payload) {
        return new Promise((resolve) => {
            // try to retrieve auth user by cookie
            let _cookie = this.$cookies.get(state.swtcCookieName);

            // no cookie? ok!
            if (_cookie == null) {
                resolve({
                    success: true,
                    message: 'swtc not known by cookie.',
                });
            } else {
                commit('setSwtc', _cookie);

                // set/send cookie to enforce lifetime
                this.$cookies.set(state.swtcCookieName, _cookie, {
                    path: state.cookiePath,
                    expires: getters.getCookieExpires,
                });

                resolve({
                    success: true,
                    message: 'swtc taken from cookie.',
                    redirect: true,
                });
            }
        });
    },
    setByCookie({ commit, state, getters }, payload) {
        return new Promise((resolve) => {
            // try to retrieve auth user by cookie
            let _cookie = this.$cookies.get(state.cookieName);

            // no cookie? ok!
            if (!_cookie) {
                resolve({
                    success: true,
                    message: 'cart not known by cookie.',
                });
            }

            let _item = getters.getCartDecoded(_cookie);

            commit('setCart', _item);

            // set/send cookie to enforce lifetime
            this.$cookies.set(state.cookieName, getters.getCartEncoded(_item), {
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
        return new Promise((resolve) => {
            this.$localForage.getItem(state.cookieName).then((response) => {
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
    async calculateShippingCosts({ state }, payload) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    },
    async precalculateShippingCost({ commit }, payload) {
        return true;
    },
    mappingCartProduct({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            let product = payload.product;

            resolve({
                name_orig: product.label,
                id: product.id,
                referenceId: product.referencedId,
                qty: product.quantity,
                final_price_item: {
                    special_price: null,
                    display_price_brutto: product.price.unitPrice,
                },
                image: product.cover.url,
                url_pds: null,
                variants: product.payload.options.map((option) => {
                    return {
                        label: option.group,
                        value_label: option.option,
                    };
                }),
            });
        });
    },
    mappingCartProducts({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            let _products = payload.products;
            let _mappedProducts = [];
            let _cartItemsQuantity = 0;

            _products.forEach((product) => {
                _cartItemsQuantity += product.quantity;
                dispatch('mappingCartProduct', { product: product }).then((response) => {
                    _mappedProducts.push(response);
                });
            });

            resolve({
                mappedProducts: _mappedProducts,
                cartItemsQuantity: _cartItemsQuantity,
            });
        });
    },
};
