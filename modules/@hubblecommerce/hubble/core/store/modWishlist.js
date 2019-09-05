//
// modWishlist
//
import base64 from 'base-64'

export default function (ctx) {

    // Create vuex store module
    const modWishlist = {
        namespaced: true,
        state: () => ({
            wishlistItemsCount: 0,
            wishlistItemsObj: {},

            cookieName: 'rocketWishlist',
            cookiePath: '/',
            cookieTTL: 120 // minutes
        }),
        getters: {
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getWishlistItemsCount: state => {
                return state.wishlistItemsCount;
            },
            getWishlistItemsObj: state => {
                return state.wishlistItemsObj;
            },
            getWishlistEncoded: (state, getters) => (objJsonStr) => {
                return base64.encode(JSON.stringify(objJsonStr));
            },
            getWishlistDecoded: (state, getters) => (objJsonB64) => {
                return JSON.parse(base64.decode(objJsonB64));
            }
        },
        mutations: {
            setWishlistItemsCount: (state, qty) => {
                state.wishlistItemsCount = qty;
            },
            delWishlistItemObj: (state, item) => {
                delete state.wishlistItemsObj[item.id];
            },
            setWishlistItemObj: (state, item) => {
                state.wishlistItemsObj[item.id] = item;
            },
            setWishlistItemsObj: (state, items) => {
                state.wishlistItemsObj = items;
            },
            setWishlistItemsObjQty: (state, payload) => {
                state.wishlistItemsObj[payload.itemId]['qty'] = payload.itemQty;
            }
        },
        actions: {
            clearAll({commit, state}) {
                // console.log("clearAll called");

                return new Promise((resolve, reject) => {

                    commit('setWishlistItemsObj', {});
                    commit('setWishlistItemsCount', 0);

                    resolve('wishlist cleared!');
                })
            },
            addItem({commit, state, getters}, payload) {
                // console.log("addItem ... payload: %o", payload);

                return new Promise((resolve, reject) => {

                    let item = _.pick(payload.item, ['id', 'sku', 'qty', 'name', 'image', 'final_price_item', 'url_pds']);
                    let qty = payload.qty;

                    // Set item to wishlist if not exists
                    if(!state.wishlistItemsObj.hasOwnProperty(item.id)) {
                        commit('setWishlistItemObj', item);
                        commit('setWishlistItemsObjQty', {
                            itemId: item.id,
                            itemQty: qty
                        });
                    } else {
                        commit('setWishlistItemsObjQty', {
                            itemId: item.id,
                            itemQty: parseInt(state.wishlistItemsObj[item.id]['qty']) + qty
                        });
                    }

                    // Increase global wishlist counter
                    commit('setWishlistItemsCount', state.wishlistItemsCount + qty);

                    let _wishlist = getters.getWishlistEncoded({
                        count: state.wishlistItemsCount,
                        items: state.wishlistItemsObj
                    });
                    let _expires = new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);

                    this.$cookies.set(state.cookieName, _wishlist, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK, item added!');
                });
            },
            updateItem({commit, state, getters}, payload) {
                // console.log("addItem ... payload: %o", payload);

                return new Promise((resolve, reject) => {
                    // Update global wishlist counter
                    commit('setWishlistItemsCount', state.wishlistItemsCount + payload.qty );

                    let _wishlist = getters.getWishlistEncoded({
                        count: state.wishlistItemsCount,
                        items: state.wishlistItemsObj
                    });

                    let _expires = new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);

                    this.$cookies.set(state.cookieName, _wishlist, {
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

                    if(state.wishlistItemsObj[item.id]["qty"] > 1) {
                        commit('setWishlistItemsObjQty', {
                            itemId: item.id,
                            itemQty: state.wishlistItemsObj[item.id]["qty"] - 1
                        });
                    } else {
                        commit('delWishlistItemObj', item);
                    }

                    commit('setWishlistItemsCount', state.wishlistItemsCount - 1);

                    let _item = getters.getWishlistEncoded({
                        count: state.wishlistItemsCount,
                        items: state.wishlistItemsObj
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
                // console.log("setCookieWishlist payload: %o", payload);

                return new Promise((resolve, reject) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'wishlist not known by cookie.'
                        });
                    }

                    //
                    let _item = getters.getWishlistDecoded(_cookie);

                    commit('setWishlistItemsObj', _item.items || {});
                    commit('setWishlistItemsCount', _item.count || 0);

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getWishlistEncoded(_item), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve({
                        success: true,
                        message: 'wishlist taken from cookie.',
                        redirect: true
                    });
                })
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modWishlist', modWishlist);
}
