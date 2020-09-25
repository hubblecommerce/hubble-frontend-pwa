/**
 * Different Mixins for components using Forms
 *
 */
import _ from 'lodash';

const mapKeyToValue = {
    methods: {
        mapKeyToValue: function (key, selectField) {
            // Return name of select field by key
            let selectFieldName;
            _.forEach(selectField, field => {
                if (field.key === key) {
                    selectFieldName = field.value;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
    },
};

const mapIsoToCountry = {
    methods: {
        mapIsoToCountry: function (key, selectField) {
            let selectFieldName;
            _.forEach(selectField, field => {
                if (field.iso_code_2 === key) {
                    selectFieldName = field.name;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
    },
};

const addBackendErrors = {
    methods: {
        addBackendErrors: function (error) {
            // SW
            if (process.env.API_TYPE === 'sw') {
                if (!(error.errors === undefined)) {
                    return error.errors.map(val => val.detail);
                } else {
                    const errors = [];

                    errors.push(error);

                    return errors;
                }
            }
        },
    },
};

const salutations = {
    data() {
        return {
            salutations: null,
        };
    },

    created() {
        if (process.env.API_TYPE === 'sw') {
            this.$store
                .dispatch('modApiCustomer/swGetSalutations')
                .then(response => {
                    let mappedSalutations = [];

                    _.forEach(response.data.data, salutation => {
                        mappedSalutations.push({
                            key: salutation.id,
                            value: this.$t(salutation.displayName),
                        });
                    });

                    this.salutations = mappedSalutations;
                })
                .catch(err => {
                    console.log('swGetSalutations error: ', err);

                    _.forEach(this.addBackendErrors(err), error => {
                        this.errors.push(error);
                    });
                });
        } else {
            this.salutations = [
                {
                    key: 'm',
                    value: this.$t('Mr.'),
                },
                {
                    key: 'f',
                    value: this.$t('Mrs.'),
                },
            ];
        }
    },
};

export { mapKeyToValue, mapIsoToCountry, addBackendErrors, salutations };
