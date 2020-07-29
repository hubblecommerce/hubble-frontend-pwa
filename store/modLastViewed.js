import localStorageHelper from "~/modules/@hubblecommerce/hubble/core/utils/localStorageHelper";
import _ from 'lodash';

export const state = () => ({
    cookieName: 'hubbleLastViewed',
    localStorageLifetime: 720, // 720 hours = 30 days,
    viewedProducts: []
})

export const mutations = {
    addLastViewedProducts: (state, payload) => {
        let alreadyIncluded = state.viewedProducts.filter((viewedProduct) => viewedProduct.id === payload.id);

        if (alreadyIncluded.length === 0) {
            if (state.viewedProducts.length === 4) {
                let slicedArray  = _.slice(state.viewedProducts,1);

                slicedArray.push(payload);

                state.viewedProducts = slicedArray;
            } else {
                state.viewedProducts.push(payload);
            }
        } else {
            let uniqueVisits = _.uniqBy(state.viewedProducts, product => product.id);

            if (state.viewedProducts.length <= 4) {
                state.viewedProducts = uniqueVisits;
            } else {
                state.viewedProducts = _.slice(uniqueVisits,1);
            }
        }
    },

    addLastViewedProductsComingFromForage: (state, payload) => {
        _.forEach(state.viewedProducts, (viewedProduct) => payload.push(viewedProduct));

        let uniqueVisits = _.uniqBy(payload, product => product.id);

        // remove oldest entry if maxLength is exceeded
        if (uniqueVisits.length > 4) uniqueVisits = _.slice(uniqueVisits, 1);

        state.viewedProducts = uniqueVisits;
    },
}

export const actions = {
    saveViewedProductsToLocalForage({ commit, state, dispatch }, payload) {
        return new Promise((resolve, reject) => {
                localStorageHelper.setCreatedAt(state.viewedProducts, state.localStorageLifetime)
                    .then((response) => {
                        this.$localForage.setItem(state.cookieName, state.viewedProducts);

                        resolve("viewed products saved to localForage");
                    })
        })
    },

    setByForage({commit, state, dispatch}) {
        return new Promise((resolve) => {
            this.$localForage.getItem(state.cookieName).then((response) => {
                if(response !== null) {
                    // Remove local storage if its invalid (end of lifetime)
                    if(!localStorageHelper.lifeTimeIsValid(response, state.localStorageLifetime)) {
                        this.$localForage.removeItem(state.cookieName);

                        resolve({
                            success: true,
                            message: 'local storage was cleared for its invalidity',
                            redirect: true
                        });
                    }

                    commit('addLastViewedProductsComingFromForage', response);

                    dispatch('saveViewedProductsToLocalForage');

                    resolve({
                        success: true,
                        message: 'lastviewedproducts list taken from forage.',
                        redirect: true
                    });
                }

                resolve({
                    success: true,
                    message: 'lastviewedproducts list not known by forage.'
                });
            });
        })
    }
}




