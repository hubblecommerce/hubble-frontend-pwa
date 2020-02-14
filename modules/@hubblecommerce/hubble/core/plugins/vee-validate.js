/**
 * Plugin for Vee-Validate
 * https://logaretm.github.io/vee-validate/
 *
 *
 */
import Vue from 'vue';
import {extend, ValidationProvider, ValidationObserver} from "vee-validate";
import {required, email, numeric, min, confirmed, max} from "vee-validate/dist/rules";

// If value should be true (e.g. for required checkboxes) add the rule as:
// :rules="{ required: { allowFalse: false } }
extend('required', {
    ...required,
    message: (field) => {
        if(field === 'privacyPolicy'){
            return 'Please accept that you have read our privacy policy.'
        }
        return 'The ' + field + ' is required.';
    }
});

extend('email', {
    ...email,
    message: (field) => {
        return 'The ' + field + ' must be a valid email address.'
    }
});

extend('numeric', {
    ...numeric,
    message: (field) => {
        return 'The ' + field + ' must be a number.';
    }
});

extend('confirmed', {
    ...confirmed,
    message: (field) => {
        if (field === 'password confirmation') {
            return 'The password confirmation does not match.'
        }
        return 'The ' + field + ' confirmation does not match.'
    }
});

extend('password', {
    ...min,
    message: (field, params) => {
        return 'The password must be atleast 4 characters long.';
    }
});

extend('max', {
    ...max,
    message: (field, params) => {
        return 'The field may not be longer than ' + params.length + ' characters.';
    }
});

extend('birthday', {
    validate: (value) => {
        return /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(String(value).toLowerCase());
    },
    message: () => {
        return 'Birthday structure is not valid.';
    }
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
