//
// modCart
//
import base64 from 'base-64'

export default function (ctx) {

    // Create vuex store module
    const modCart = {
        namespaced: true,
        state: () => ({
            cartItemsCount: 0,
            cartItemsObj: {},

            cookieName: 'rocketCart',
            cookiePath: '/',
            cookieTTL: 120 // minutes
        }),
        getters: {
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getCartItemsCount: state => {
                return state.cartItemsCount;
            },
            getCartItemsObj: state => {
                return state.cartItemsObj;
            },
            getCartEncoded: (state, getters) => (objJsonStr) => {
                return base64.encode(JSON.stringify(objJsonStr));
            },
            getCartDecoded: (state, getters) => (objJsonB64) => {
                return JSON.parse(base64.decode(objJsonB64));
            }
        },
        mutations: {
            setCartItemsCount: (state, qty) => {
                state.cartItemsCount = qty;
            },
            delCartItemObj: (state, item) => {
                delete state.cartItemsObj[item.id];
            },
            setCartItemObj: (state, item) => {
                state.cartItemsObj[item.id] = item;
            },
            setCartItemsObj: (state, items) => {
                state.cartItemsObj = items;
            },
            setCartItemsObjQty: (state, payload) => {
                state.cartItemsObj[payload.itemId]['qty'] = payload.itemQty;
            }
        },
        actions: {
            clearAll({commit, state}) {
                // console.log("clearAll called");

                return new Promise((resolve, reject) => {

                    commit('setCartItemsObj', {});
                    commit('setCartItemsCount', 0);

                    resolve('cart cleared!');
                })
            },
            addItem({commit, state, getters}, payload) {
                // console.log("addItem ... payload: %o", payload);

                return new Promise((resolve, reject) => {

                    let item = _.pick(payload.item, ['id', 'sku', 'qty', 'name', 'image', 'final_price_item', 'url_pds']);
                    let qty = payload.qty;

                    // Set item to cart if not exists
                    if(!state.cartItemsObj.hasOwnProperty(item.id)) {
                        commit('setCartItemObj', item);
                        commit('setCartItemsObjQty', {
                            itemId: item.id,
                            itemQty: qty
                        });
                    } else {
                        commit('setCartItemsObjQty', {
                            itemId: item.id,
                            itemQty: parseInt(state.cartItemsObj[item.id]['qty']) + qty
                        });
                    }

                    // Increase global cart counter
                    commit('setCartItemsCount', state.cartItemsCount + qty);

                    let _cart = getters.getCartEncoded({
                        count: state.cartItemsCount,
                        items: state.cartItemsObj
                    });
                    let _expires = new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);

                    this.$cookies.set(state.cookieName, _cart, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK, item added!');
                });
            },
            updateItem({commit, state, getters}, payload) {
                // console.log("addItem ... payload: %o", payload);

                return new Promise((resolve, reject) => {
                    // Update global cart counter
                    commit('setCartItemsCount', state.cartItemsCount + payload.qty );

                    let _cart = getters.getCartEncoded({
                        count: state.cartItemsCount,
                        items: state.cartItemsObj
                    });

                    let _expires = new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);

                    this.$cookies.set(state.cookieName, _cart, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK, item added!');
                });
            },
            delItem({commit, state, getters}, payload) {
                //console.log("delItem ... payload: %o", payload);

                let item = payload.data;

                return new Promise((resolve, reject) => {

                    if(state.cartItemsObj[item.id]["qty"] > 1) {
                        commit('setCartItemsObjQty', {
                            itemId: item.id,
                            itemQty: state.cartItemsObj[item.id]["qty"] - 1
                        });
                    } else {
                        commit('delCartItemObj', item);
                    }

                    commit('setCartItemsCount', state.cartItemsCount - 1);

                    let _item = getters.getCartEncoded({
                        count: state.cartItemsCount,
                        items: state.cartItemsObj
                    });
                    let _expires = new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);

                    this.$cookies.set(state.cookieName, _item, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK, item deleted!');
                })
            },
            setByCookie({commit, state, getters}, payload) {
                // console.log("setCookieCart payload: %o", payload);

                return new Promise((resolve, reject) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'cart not known by cookie.'
                        });
                    }

                    //
                    let _item = getters.getCartDecoded(_cookie);

                    commit('setCartItemsObj', _item.items || {});
                    commit('setCartItemsCount', _item.count || 0);

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getCartEncoded(_item), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve({
                        success: true,
                        message: 'cart taken from cookie.',
                        redirect: true
                    });
                })
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modCart', modCart);
}
