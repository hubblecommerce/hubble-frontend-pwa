/**
 * Different Mixins for components using Forms
 *
 */

const mapKeyToValue = {
  methods: {
      mapKeyToValue: function (key, selectField) {
          // Return name of select field by key
          let selectFieldName;
          _.forEach(selectField, (field) => {
              if(field.key === key) {
                  selectFieldName = field.value;
                  return selectFieldName;
              }
          });
          return selectFieldName;
      }
  }
};

const mapIsoToCountry = {
    methods: {
        mapIsoToCountry: function (key, selectField) {
            let selectFieldName;
            _.forEach(selectField, (field) => {
                if(field.iso_code_2 === key) {
                    selectFieldName = field.name;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        }
    }
};

const addBackendErrors = {
    methods: {
        addBackendErrors: function(errors) {
            // get error Messages as array
            let errorMessages = _.mapValues(errors, val => {
                return [val];
            });
            this.$refs.observer.setErrors(errorMessages);
        },
    }
};

const salutations = {
    data() {
        return {
            salutations: [{key: 'm', value: this.$t('Mr.')}, {key: 'f' , value: this.$t('Mrs.')}],
        }
    }
};

export {mapKeyToValue, mapIsoToCountry, addBackendErrors, salutations};
