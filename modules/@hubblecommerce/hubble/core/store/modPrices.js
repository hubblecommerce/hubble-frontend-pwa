import {isBefore, isAfter} from "@hubblecommerce/hubble/core/utils/dateTimeHelper";
import _ from 'lodash';

export default function (ctx) {
    const modPrices = {
        namespaced: true,
        state: () => ({
            priceSwitcherIncludeVat: false,
            priceCurrency: 'EUR',
            priceCurrencySymbol: '€',
            priceLocale: 'de-DE'
        }),
        getters: {
            priceAddVat: () => (price, vat) => {
                return price * vat;
            },
            priceDecFmt: () => (price) => {
                return _.round(price, 2).toFixed(2);
            },
            priceAddCur: (state) => (price) => {
                let localPrice = parseFloat(price);

                localPrice = localPrice.toLocaleString(state.priceLocale, {minimumFractionDigits: 2});

                return localPrice  + ' ' + state.priceCurrencySymbol;
            },
            getPriceAndCurrencyDecFmt: (state, getters) => (price, addVat, taxClass) => {
                if(addVat) {
                    price = getters.priceAddVat(price, taxClass.value);
                }

                price = getters.priceDecFmt(price);
                price = getters.priceAddCur(price);

                return price;
            },
            productIsSpecial: () => (item) => {
                if(item.final_price_item.special_price === null) {
                    return false;
                }

                let beg = null;
                let end = null;

                if(item.final_price_item.special_from_date !== null) {
                    beg = new Date(item.final_price_item.special_from_date);
                }

                if(item.final_price_item.special_to_date !== null) {
                    end = new Date(item.final_price_item.special_to_date);
                }

                // If no date range isset
                if(_.isNull(beg) && _.isNull(end)) {
                    return false;
                }

                // If only to date isset and today is before end
                if(_.isNull(beg) && ! _.isNull(end)) {
                    if(isBefore(end)) {
                        return true;
                    }
                }
                // If only from date isset and today is after begin
                else if(! _.isNull(beg) && _.isNull(end)) {
                    if(isAfter(beg)) {
                        return true;
                    }
                }
                // If both isset and today is after begin and before end
                else {
                    if(isAfter(beg) && isBefore(end)) {
                        return true;
                    }
                }

                return false;
            },
            productGetTierPricesByGroupId: () => (item, groupID) => {
                let items = item.tier_price_items.filter(item => item.customer_group_id === groupID || item.all_groups);

                // only return tier price items, where price below item's final price
                return items.filter(tierPriceItem => tierPriceItem.price < item.final_price_item.price);
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
                //TODO replace placeholder object with real data
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

    ctx.store.registerModule('modPrices', modPrices);
}
