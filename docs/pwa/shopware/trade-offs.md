# Trade-offs

Features and functions which can be not covered by hubble PWA. Since the PWA depends on the platforms api, 
it comes to some limitations when the api doesn't provide the necessary data.

- Display of „Variants from“ price on product listings when product variants display settings are „Expand property 
values in product listings“. Store-api needs to provide variantListingConfig for each item.
- Display of „from“ price on product listings, when product „Storefront presentation“ of variant products are set to 
„Display single product“. Store-api needs to provide „cheapestPrice“ for each item.
- Display of disabled variants on detail page if a variant is set to sellout and stock quantity is zero. Store-api 
needs to provide „combinable“ flag to each variant option.
- Password recovery mail: You can pass a storefrontUrl parameter to the `store-api/account/recovery-password` request, which shopware uses to generate a 
link in the password recovery mail. Shopware only allows known domains registered to the saleschannel you call.
hubble PWA expects the user is linked to following route to process the password recovery: `/customer/password?hash=XXX`  
