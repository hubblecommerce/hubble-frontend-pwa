import _ from 'lodash';

export default function({ store, route, error }) {

    return new Promise((resolve, reject) => {
        if (!_.isEmpty(store.state.modApiProduct.dataProduct)) {
            const { name, id, url_pds, image } = store.state.modApiProduct.dataProduct.result.item;

            store.commit('modLastViewed/addLastViewedProducts', { name, id, url_pds, image });

            resolve('OK');
        }

        resolve('OK');
    })
}
