import _ from 'lodash';

function addressMapping(address, isDefault){
    let obj = {};

    obj.id = address.id;
    obj.is_billing = true;
    obj.is_billing_default = isDefault;
    obj.is_shipping = true;
    obj.is_shipping_default = false;
    
    obj.payload = {
        gender: address.salutationId,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        houseNo: '',
        postal: address.zipcode,
        city: address.city,
        country: address.countryId,
        company: address.company,
    }
    return obj;
}

export {addressMapping};