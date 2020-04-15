import * as data from '~/csv/tablerates.json';

// Helper functions for calculating the shipping cost
// Getting the shipping costs rules from tablerates.json

function getShippingCostsByCartVal(rules, subtotals) {
    let matchingRule;

    let sorted = _.sortBy(rules, ['Condition']);

    _.forEach(sorted, rule => {
        if (subtotals >= rule['Condition']) {
            matchingRule = rule;
        }
    });

    if (!_.isEmpty(matchingRule)) {
        return matchingRule;
    }

    return false;
}

function getShippingCostsByCountry(countryCode) {
    let matchingCountries = [];

    _.forEach(data.default, val => {
        if (val['Country'] === countryCode) {
            matchingCountries.push(val);
        }
    });

    if (matchingCountries.length > 0) {
        return matchingCountries;
    }

    return false;
}

export { getShippingCostsByCartVal, getShippingCostsByCountry };
