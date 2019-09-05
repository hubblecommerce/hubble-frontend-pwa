export default function (ctx) {

    // Create vuex store module
    const modPrices = {
        namespaced: true,
        state: () => ({
            priceSwitcherIncludeVat: true,
            priceCurrency: 'EUR',
            priceCurrencySymbol: '€'
        }),
        getters: {
            priceAddVat: (state) => (price, vat) => {
                return price * vat;
            },
            priceDecFmt: (state, getters) => (price) => {

                var _price = _.round(price, 2).toFixed(2);

                return _price.replace(".", ",");
            },
            priceAddCur: (state, getters) => (price) => {
                return price + ' ' + state.priceCurrencySymbol;
            },
            getCurrency: (state, getters) => {
                return state.priceCurrency;
            },
            getCurrencySymbol: (state, getters) => {
                return state.priceCurrencySymbol;
            },
            getPriceAndCurrencyDecFmt: (state, getters) => (_price, _addVat, _taxClass) => {

                if(_addVat) {
                    _price = getters.priceAddVat(_price, _taxClass.value);
                }

                _price = getters.priceDecFmt(_price);
                _price = getters.priceAddCur(_price);

                return _price;
            },
            productIsSpecial: (state) => (item) => {
                let _beg = item.final_price_item.special_from_date;
                let _end = item.final_price_item.special_to_date;
                let _specialPrice = item.final_price_item.special_price;

                if(_specialPrice !== null) {
                    return true;
                }

                // xxx: check
                return false;

                // if(_.isNull(_beg) && _.isNull(_end)) {
                //     return false;
                // }

                // if(_.isNull(_beg) && ! _.isNull(_end)) {
                //     if(moment().isBefore(moment(_end))) {
                //         return true;
                //     }
                // }
                // else if(! _.isNull(_beg) && _.isNull(_end)) {
                //     if(moment().isAfter(moment(_beg))) {
                //         return true;
                //     }
                // }
                // else {
                //     if(moment().isSameOrAfter(moment(_beg)) && moment().isBefore(moment(_end))) {
                //         return true;
                //     }
                // }

                return false;
            },
            productGetTierPricesByGroupId: (state) => (item, groupID) => {
                var _items = item.tier_price_items.filter(item => item.customer_group_id === groupID || item.all_groups);

                // only return tier price items, where price below item's final price
                return _items.filter(tierPriceItem => tierPriceItem.price < item.final_price_item.price);
            },
            productHasTierPricesByGroupId: (state, getters) => (item, groupID) => {
                if(_.isEmpty(item.tier_price_items)) {
                    return false;
                }

                if(_.isEmpty(getters.productGetTierPricesByGroupId(item, groupID))) {
                    return false;
                }

                return true;
            },
            getTaxClassByLabel: (state) => (label) => {
                //TODO replace placeholdr object with real data
                let placeholderObject = {
                    id: 2,
                    label: 'VAT 19',
                    value: 1.19
                };
                return placeholderObject;
                //return _.head(state.session.taxClasses.filter(item => item.label === label));
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modPrices', modPrices);
}
