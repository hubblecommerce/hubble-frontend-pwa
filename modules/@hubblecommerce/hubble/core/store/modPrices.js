import {isBefore, isAfter, isSameOrAfter} from "@hubblecommerce/hubble/core/utils/dateTimeHelper";

export default function (ctx) {

    // Create vuex store module
    const modPrices = {
        namespaced: true,
        state: () => ({
            priceSwitcherIncludeVat: false,
            priceCurrency: 'EUR',
            priceCurrencySymbol: '€',
            priceLocale: 'de-DE'
        }),
        getters: {
            priceAddVat: (state) => (price, vat) => {
                return price * vat;
            },
            priceDecFmt: (state, getters) => (price) => {

                let _price = _.round(price, 2).toFixed(2);

                return _price;
            },
            priceAddCur: (state, getters) => (price) => {
                let localPrice = parseFloat(price);

                localPrice = localPrice.toLocaleString(state.priceLocale, {minimumFractionDigits: 2});

                return localPrice  + ' ' + state.priceCurrencySymbol;
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

                if(item.final_price_item.special_price === null) {
                    return false;
                }

                let _beg = null;
                let _end = null;

                if(item.final_price_item.special_from_date !== null) {
                    _beg = new Date(item.final_price_item.special_from_date);
                }

                if(item.final_price_item.special_to_date !== null) {
                    _end = new Date(item.final_price_item.special_to_date);
                }

                // If no date range isset
                if(_.isNull(_beg) && _.isNull(_end)) {
                    return false;
                }

                // If only to date isset and today is before end
                if(_.isNull(_beg) && ! _.isNull(_end)) {
                    if(isBefore(_end)) {
                        return true;
                    }
                }
                // If only from date isset and today is after begin
                else if(! _.isNull(_beg) && _.isNull(_end)) {
                    if(isAfter(_beg)) {
                        return true;
                    }
                }
                // If both isset and today is after begin and before end
                else {
                    if(isAfter(_beg) && isBefore(_end)) {
                        return true;
                    }
                }

                return false;
            },
            productGetTierPricesByGroupId: (state) => (item, groupID) => {
                let _items = item.tier_price_items.filter(item => item.customer_group_id === groupID || item.all_groups);

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
